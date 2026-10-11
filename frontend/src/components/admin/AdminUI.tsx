"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import { Button } from "@/components/ui";

/* Potongan UI kecil yang dipakai berulang di portal admin. */

export type Tone = "green" | "yellow" | "orange" | "red" | "gray" | "blue" | "teal";

const TAG_TONES: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
  gray: "bg-slate-100 text-slate-600 border-slate-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  teal: "bg-teal-tint text-teal-base border-teal-accent/30",
};

export function Tag({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-bold", TAG_TONES[tone], className)}>
      {children}
    </span>
  );
}

/* ---------- Kartu statistik dengan garis warna di kiri ---------- */
export type StatTone = "" | "ok" | "warn" | "bad" | "mute";
const BAR: Record<StatTone, string> = {
  "": "before:bg-teal-accent",
  ok: "before:bg-olive-light",
  warn: "before:bg-coral-accent",
  bad: "before:bg-semantic-error",
  mute: "before:bg-slate-300",
};
const NOTE: Record<StatTone, string> = {
  "": "text-teal-base",
  ok: "text-olive-dark",
  warn: "text-coral-accent",
  bad: "text-semantic-error",
  mute: "text-slate-500",
};

export function StatTile({
  label,
  value,
  note,
  tone = "",
  noteTone,
}: {
  label: string;
  value: React.ReactNode;
  note: string;
  tone?: StatTone;
  noteTone?: StatTone;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-hairline bg-white px-5 py-4 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r",
        BAR[tone]
      )}
    >
      <small className="block text-[13px] text-slate-500">{label}</small>
      <strong className="my-1 block font-display text-[28px] leading-tight text-teal-dark">{value}</strong>
      <em className={cn("block text-xs font-bold not-italic", NOTE[noteTone ?? tone])}>{note}</em>
    </div>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">{children}</div>;
}

/* ---------- Kartu ---------- */
export function Panel({
  title,
  desc,
  action,
  children,
  className,
}: {
  title?: string;
  desc?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("rounded-3xl border border-border-hairline bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] sm:p-6", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-xl text-teal-dark">{title}</h3>}
            {desc && <p className="text-[13px] text-slate-500">{desc}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </article>
  );
}

export function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="shrink-0 text-sm font-bold text-teal-accent hover:underline">
      {children}
    </Link>
  );
}

/* ---------- Judul halaman admin ---------- */
export function AdminPageHead({ title, desc, children }: { title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl text-teal-dark">{title}</h1>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

/* ---------- Tab segmen ---------- */
export function Seg<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "shrink-0 rounded-lg px-3.5 py-1.5 text-[13px] font-bold transition-colors cursor-pointer",
            o.value === value ? "bg-white text-teal-dark shadow-sm" : "text-slate-500 hover:text-teal-dark"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center justify-between gap-3">{children}</div>;
}

export function Count({ children }: { children: React.ReactNode }) {
  return <span className="text-[13px] font-bold text-slate-500">{children}</span>;
}

export function MiniSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-xl border border-border-hairline bg-white pl-3 pr-9 text-[13px] font-bold text-teal-dark focus:outline-none focus:ring-2 focus:ring-teal-accent cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

/* ---------- Tabel ---------- */
export interface SortState<K extends string> {
  key: K;
  dir: "asc" | "desc";
}

export function SortTh<K extends string>({
  label,
  k,
  sort,
  onSort,
  className,
}: {
  label: string;
  k: K;
  sort: SortState<K>;
  onSort: (k: K) => void;
  className?: string;
}) {
  const active = sort.key === k;
  const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ChevronUp : ChevronDown;
  return (
    <th
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("whitespace-nowrap px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500", className)}
    >
      <button type="button" onClick={() => onSort(k)} className={cn("inline-flex items-center gap-1 cursor-pointer hover:text-teal-dark", active && "text-teal-dark")}>
        {label}
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </th>
  );
}

export function Table({ head, children }: { head: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead className="border-y border-border-hairline bg-slate-50/70">
          <tr>{head}</tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-border-hairline [&>tr:last-child]:border-0 [&_td]:px-3 [&_td]:py-3 [&_td]:align-middle [&_td:first-child]:pl-5 sm:[&_td:first-child]:pl-6 [&_th:first-child]:pl-5">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyRow({ cols, children }: { cols: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={cols} className="py-10 text-center text-slate-500">
        {children}
      </td>
    </tr>
  );
}

export function Pager({
  page,
  pages,
  total,
  from,
  to,
  onPage,
}: {
  page: number;
  pages: number;
  total: number;
  from: number;
  to: number;
  onPage: (p: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[13px] text-slate-500">
      <span>
        Menampilkan {from}–{to} dari {total}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" shape="rounded" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Sebelumnya
        </Button>
        <b className="text-teal-dark">
          {page} / {pages}
        </b>
        <Button variant="outline" shape="rounded" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Berikutnya
        </Button>
      </div>
    </div>
  );
}

/* ---------- Avatar inisial & baris daftar ---------- */
export function Bubble({ text, size = "md" }: { text: string; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d9f3ee] to-[#c9e3b4] font-bold text-teal-base",
        size === "md" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm"
      )}
    >
      {text.length <= 3 ? text : initials(text)}
    </span>
  );
}

export function Person({ name, sub }: { name: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Bubble text={name} />
      <div className="min-w-0">
        <b className="block truncate text-teal-dark">{name}</b>
        {sub && <small className="text-xs text-slate-500">{sub}</small>}
      </div>
    </div>
  );
}

export function MiniItem({
  bubble,
  title,
  sub,
  action,
  alert,
}: {
  bubble?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 py-3",
        alert ? "my-1 rounded-2xl border-l-4 border-semantic-error bg-rose-50/70 px-4" : "border-b border-border-hairline last:border-0"
      )}
    >
      {bubble && <Bubble text={bubble} />}
      <div className="min-w-0 flex-1">
        <b className="block text-sm text-teal-dark">{title}</b>
        {sub && <small className="text-xs text-slate-500">{sub}</small>}
      </div>
      {action}
    </li>
  );
}

export function OkNote({ children }: { children: React.ReactNode }) {
  return <li className="rounded-2xl bg-olive-wash px-4 py-3 text-sm font-bold text-olive-dark">{children}</li>;
}

/* ---------- Meter keyakinan AI ---------- */
export function Meter({ value, low }: { value: number; low?: boolean }) {
  return (
    <div className="flex min-w-[110px] items-center gap-2">
      <i className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <b className={cn("block h-full rounded-full", low ? "bg-coral-accent" : "bg-teal-accent")} style={{ width: `${value}%` }} />
      </i>
      <span className={cn("text-xs font-bold", low ? "text-coral-accent" : "text-teal-dark")}>{value}%</span>
    </div>
  );
}

/* ---------- Grid detail di dialog ---------- */
export function DetailGrid({ items }: { items: [string, React.ReactNode, boolean?][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
      {items.map(([k, v, wide]) => (
        <div key={k} className={cn(wide && "sm:col-span-2")}>
          <dt className="text-xs font-bold text-slate-500">{k}</dt>
          <dd className="text-sm font-bold text-teal-dark">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-bold text-slate-600">
      {children}
    </label>
  );
}

export const adminInput =
  "w-full h-11 rounded-xl border border-border-hairline bg-surface-bg px-3.5 text-sm text-teal-dark focus:outline-none focus:ring-2 focus:ring-teal-accent focus:bg-white";
