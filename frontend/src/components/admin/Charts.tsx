"use client";

import * as React from "react";
import { rp } from "@/lib/format";

/* Grafik SVG ringan (tanpa library) untuk portal admin. */

const GRID = "#e8eff1";
const TEAL = "#21abb8";
const LIME = "#9cb958";

export function LineChart({ data, labels }: { data: number[]; labels: string[] }) {
  const W = 640, H = 250, p = { l: 38, r: 14, t: 16, b: 30 };
  const max = Math.ceil(Math.max(...data) / 50) * 50;
  const x = (i: number) => p.l + (i * (W - p.l - p.r)) / (data.length - 1);
  const y = (v: number) => p.t + (1 - v / max) * (H - p.t - p.b);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const gid = React.useId();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik jumlah scan AI per hari" className="h-auto w-full">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TEAL} stopOpacity=".28" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const v = (max * i) / 4;
        return (
          <g key={i}>
            <line x1={p.l} x2={W - p.r} y1={y(v)} y2={y(v)} stroke={GRID} />
            <text x={p.l - 8} y={y(v) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
              {Math.round(v)}
            </text>
          </g>
        );
      })}
      <path d={`${line} L${x(data.length - 1)} ${H - p.b} L${x(0)} ${H - p.b} Z`} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={TEAL} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 5 : 3} fill="#fff" stroke={TEAL} strokeWidth={2.2}>
          <title>{`${v} scan`}</title>
        </circle>
      ))}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-slate-400 text-[11px]">
          {l}
        </text>
      ))}
    </svg>
  );
}

export interface ChartItem {
  nama: string;
  n: number;
  warna: string;
}

export function DonutChart({ items, centerLabel }: { items: ChartItem[]; centerLabel: string }) {
  const total = items.reduce((a, d) => a + d.n, 0);
  const R = 54, C = 2 * Math.PI * R;
  const offsets = items.reduce<number[]>((acc, d, i) => [...acc, i === 0 ? 0 : acc[i - 1] + (items[i - 1].n / total) * C], []);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx={70} cy={70} r={R} fill="none" stroke="#eef3f5" strokeWidth={18} />
          {items.map((d, i) => {
            const len = (d.n / total) * C;
            return (
              <circle key={d.nama} cx={70} cy={70} r={R} fill="none" stroke={d.warna} strokeWidth={18} strokeDasharray={`${len - 2} ${C - len + 2}`} strokeDashoffset={-offsets[i]} />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <b className="font-display text-2xl text-teal-dark">{total.toLocaleString("id-ID")}</b>
          <small className="text-[11px] text-slate-500">{centerLabel}</small>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-2.5 text-sm">
        {items.map((d) => (
          <li key={d.nama} className="flex items-center gap-2.5">
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: d.warna }} />
            <span className="flex-1 text-slate-600">{d.nama}</span>
            <b className="text-teal-dark">{Math.round((d.n / total) * 100)}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RevenueBars({ values, labels }: { values: number[]; labels: string[] }) {
  const W = 640, H = 240, p = { l: 52, r: 10, t: 14, b: 28 };
  const max = Math.max(50000, Math.ceil(Math.max(...values) / 50000) * 50000);
  const bw = (W - p.l - p.r) / values.length;
  const yOf = (v: number) => p.t + (1 - v / max) * (H - p.t - p.b);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik pendapatan konsultasi 7 hari terakhir" className="h-auto w-full">
      {[0, 1, 2, 3, 4].map((i) => {
        const v = (max * i) / 4;
        return (
          <g key={i}>
            <line x1={p.l} x2={W - p.r} y1={yOf(v)} y2={yOf(v)} stroke={GRID} />
            <text x={p.l - 8} y={yOf(v) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
              {v >= 1000 ? Math.round(v / 1000) + "rb" : v}
            </text>
          </g>
        );
      })}
      {values.map((v, i) => {
        const h = (v / max) * (H - p.t - p.b);
        const x = p.l + i * bw + bw * 0.22;
        return (
          <g key={i}>
            <rect x={x} y={H - p.b - h} width={bw * 0.56} height={Math.max(h, 2)} rx={6} fill={i === values.length - 1 ? LIME : TEAL}>
              <title>{rp(v)}</title>
            </rect>
            <text x={x + bw * 0.28} y={H - 8} textAnchor="middle" className="fill-slate-400 text-[11px]">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HBars({ items }: { items: ChartItem[] }) {
  const max = Math.max(...items.map((i) => i.n), 1);
  if (!items.length) return <p className="py-6 text-center text-slate-500">Belum ada data.</p>;
  return (
    <div className="flex flex-col gap-4">
      {items.map((j) => (
        <div key={j.nama}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-slate-600">{j.nama}</span>
            <b className="text-teal-dark">{j.n.toLocaleString("id-ID")}</b>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${(j.n / max) * 100}%`, background: j.warna }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export const CHART_COLORS = ["#21abb8", "#eb792b", "#9cb958", "#f6b73c", "#a9bcc0", "#5fe3d3"];
