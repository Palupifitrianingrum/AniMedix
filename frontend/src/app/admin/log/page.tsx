"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import { AdminPageHead, Count, MiniSelect, Panel, Seg, StatRow, StatTile, Toolbar } from "@/components/admin/AdminUI";
import { useAdminStore, matches } from "@/store/useAdminStore";
import type { ActivityLog, LogRole } from "@/lib/admin/seed";
import { toast } from "@/store/useToastStore";
import { downloadText, toCSV } from "@/lib/download";
import { DAY_MS, dayKey, fmtDate, fmtDateTime, fmtTime } from "@/lib/format";

const ICON: Record<LogRole, [string, string, string]> = {
  Peternak: ["#e2f6f7", "#17808a", "PT"],
  "Dokter hewan": ["#e8f2d4", "#4f7a28", "DR"],
  Admin: ["#fdeede", "#c4570f", "AD"],
};

export default function LogAktivitasPage() {
  const { data, query } = useAdminStore();
  const [role, setRole] = React.useState<LogRole | "semua">("semua");
  const [jenis, setJenis] = React.useState("semua");
  const [limit, setLimit] = React.useState(12);
  const [now] = React.useState(() => Date.now());

  const L = data.logs;
  const today = dayKey(now);
  const yesterday = dayKey(now - DAY_MS);
  const jenisList = [...new Set(L.map((l) => l.jenis))].sort();
  const rows = L.filter((l) => (role === "semua" || l.peran === role) && (jenis === "semua" || l.jenis === jenis) && matches(query, l.teks, l.jenis));
  const shown = rows.slice(0, limit);

  // Kelompokkan per hari
  const groups: { label: string; items: ActivityLog[] }[] = [];
  shown.forEach((l) => {
    const k = dayKey(l.ts);
    const label = k === today ? "Hari ini" : k === yesterday ? "Kemarin" : fmtDate(l.ts);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(l);
    else groups.push({ label, items: [l] });
  });

  const exportCsv = () => {
    downloadText("log-animedix.csv", toCSV(["Waktu", "Peran", "Jenis", "Aktivitas"], rows.map((l) => [fmtDateTime(l.ts), l.peran, l.jenis, l.teks])));
    toast("Log diekspor");
  };

  return (
    <>
      <AdminPageHead title="Log aktivitas" desc="Riwayat tindakan pengguna dan admin selama memakai AniMedix.">
        <Button variant="outline" shape="rounded" size="sm" onClick={exportCsv}>
          Ekspor CSV
        </Button>
      </AdminPageHead>

      <StatRow>
        <StatTile label="Total aktivitas" value={L.length} note="Tercatat di portal" noteTone="mute" />
        <StatTile label="Hari ini" value={L.filter((l) => dayKey(l.ts) === today).length} note="Seluruh peran" tone="ok" />
        <StatTile label="Tindakan admin" value={L.filter((l) => l.peran === "Admin").length} note="Bisa ditelusuri" tone="warn" noteTone="mute" />
        <StatTile label="Login pengguna" value={L.filter((l) => l.jenis === "Login").length} note="Peternak" noteTone="mute" />
      </StatRow>

      <Panel>
        <Toolbar>
          <Seg
            value={role}
            onChange={(r) => {
              setRole(r);
              setLimit(12);
            }}
            options={[
              { value: "semua", label: "Semua" },
              { value: "Peternak", label: "Peternak" },
              { value: "Dokter hewan", label: "Dokter hewan" },
              { value: "Admin", label: "Admin" },
            ]}
          />
          <div className="flex items-center gap-3">
            <MiniSelect
              label="Filter jenis aktivitas"
              value={jenis}
              onChange={(j) => {
                setJenis(j);
                setLimit(12);
              }}
              options={[{ value: "semua", label: "Semua jenis" }, ...jenisList.map((j) => ({ value: j, label: j }))]}
            />
            <Count>{rows.length} aktivitas</Count>
          </div>
        </Toolbar>

        {groups.map((g) => (
          <div key={g.label} className="mb-2">
            <div className="py-2 text-xs font-bold uppercase tracking-wide text-slate-400">{g.label}</div>
            <ul className="relative ml-4 border-l border-border-hairline">
              {g.items.map((l) => {
                const [bg, fg, ab] = ICON[l.peran];
                return (
                  <li key={l.ts + l.teks} className="relative flex items-center gap-3 py-2.5 pl-7">
                    <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ring-4 ring-white" style={{ background: bg, color: fg }}>
                      {ab}
                    </span>
                    <div className="min-w-0 flex-1">
                      <b className="block text-sm text-teal-dark">{l.teks}</b>
                      <small className="text-xs text-slate-500">
                        {l.peran} · {l.jenis}
                      </small>
                    </div>
                    <span className="text-xs font-bold tabular-nums text-slate-400">{fmtTime(l.ts)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {!shown.length && <p className="py-10 text-center text-slate-500">Tidak ada aktivitas yang cocok.</p>}
        {rows.length > limit && (
          <div className="mt-3 flex justify-center">
            <Button variant="outline" shape="rounded" size="sm" onClick={() => setLimit((n) => n + 12)}>
              Muat lebih banyak ({rows.length - limit} lagi)
            </Button>
          </div>
        )}
      </Panel>
    </>
  );
}
