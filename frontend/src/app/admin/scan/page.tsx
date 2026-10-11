"use client";

import * as React from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui";
import AdminDialog from "@/components/admin/AdminDialog";
import {
  AdminPageHead,
  Count,
  DetailGrid,
  EmptyRow,
  FieldLabel,
  Meter,
  MiniSelect,
  Pager,
  Panel,
  Seg,
  SortTh,
  StatRow,
  StatTile,
  Table,
  Tag,
  Toolbar,
  adminInput,
  type Tone,
} from "@/components/admin/AdminUI";
import { CHART_COLORS, HBars } from "@/components/admin/Charts";
import RegionAlerts from "@/components/admin/RegionAlerts";
import { useAdminStore, adminName, matches } from "@/store/useAdminStore";
import type { Risk, Scan, ScanStatus } from "@/lib/admin/seed";
import { useTable } from "@/hooks/useTable";
import { toast } from "@/store/useToastStore";
import { downloadText, toCSV } from "@/lib/download";
import { fmtDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortKey = "id" | "ternak" | "pemilik" | "wilayah" | "deteksi" | "yakin" | "risiko" | "status";

const RISK_TONE: Record<Risk, Tone> = { Rendah: "green", Sedang: "yellow", Tinggi: "red" };
const RISK_RANK: Record<Risk, number> = { Rendah: 1, Sedang: 2, Tinggi: 3 };
const STATUS: Record<ScanStatus, [string, Tone]> = {
  Baru: ["Belum ditinjau", "orange"],
  Ditinjau: ["Ditinjau", "teal"],
  Diteruskan: ["Diteruskan", "blue"],
};
const sortValue = (s: Scan, k: SortKey) => (k === "risiko" ? RISK_RANK[s.risiko] : s[k]);

export default function ScanAdminPage() {
  const { data, query, update } = useAdminStore();
  const me = adminName(data);
  const [risk, setRisk] = React.useState<Risk | "semua">("semua");
  const [status, setStatus] = React.useState("semua");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [vet, setVet] = React.useState("");

  const A = data.scans;
  const avg = Math.round(A.reduce((a, x) => a + x.yakin, 0) / Math.max(A.length, 1));
  const counts: Record<string, number> = {};
  A.filter((x) => x.deteksi !== "Sehat").forEach((x) => (counts[x.deteksi] = (counts[x.deteksi] || 0) + 1));
  const bars = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([nama, n], i) => ({ nama, n, warna: CHART_COLORS[i % CHART_COLORS.length] }));

  const rows = A.filter(
    (x) => (risk === "semua" || x.risiko === risk) && (status === "semua" || x.status === status) && matches(query, x.id, x.ternak, x.pemilik, x.wilayah, x.deteksi)
  );
  const table = useTable<Scan, SortKey>(rows, { key: "id", dir: "desc" }, { resetKey: risk + status + query, sortValue });

  const scan = A.find((x) => x.id === openId);
  const low = scan ? scan.yakin < data.settings.aiMin : false;
  const vets = data.vets.filter((v) => v.status === "disetujui");
  const close = () => {
    setOpenId(null);
    setVet("");
  };

  const exportCsv = () => {
    downloadText("scan-animedix.csv", toCSV(["ID", "Ternak", "Pemilik", "Wilayah", "Deteksi", "Keyakinan", "Risiko", "Status"], table.all.map((x) => [x.id, x.ternak, x.pemilik, x.wilayah, x.deteksi, x.yakin + "%", x.risiko, x.status])));
    toast("Data scan diekspor");
  };

  return (
    <>
      <AdminPageHead title="Pemantauan scan AI" desc="Hasil deteksi penyakit dari foto yang diunggah pengguna.">
        <Button variant="outline" shape="rounded" size="sm" onClick={exportCsv}>
          Ekspor CSV
        </Button>
      </AdminPageHead>

      <StatRow>
        <StatTile label="Scan tercatat" value={A.length} note="Contoh terbaru" noteTone="mute" />
        <StatTile label="Rata-rata keyakinan" value={avg + "%"} note={`Minimum ${data.settings.aiMin}%`} tone="ok" />
        <StatTile label="Risiko tinggi" value={A.filter((x) => x.risiko === "Tinggi").length} note={`${A.filter((x) => x.risiko === "Tinggi" && x.status === "Baru").length} belum ditinjau`} tone="bad" />
        <StatTile label="Perlu tinjauan" value={A.filter((x) => x.status === "Baru").length} note="Belum dilihat admin" tone="warn" />
      </StatRow>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel title="Deteksi terbanyak" desc="Dari scan yang tercatat di tabel">
          <HBars items={bars} />
        </Panel>
        <Panel title="Peringatan wilayah" desc={`Batas peringatan: ${data.settings.aiWabah} kasus berisiko tinggi`}>
          <RegionAlerts />
        </Panel>
      </div>

      <Panel>
        <Toolbar>
          <Seg
            value={risk}
            onChange={setRisk}
            options={[
              { value: "semua", label: "Semua" },
              { value: "Tinggi", label: "Risiko tinggi" },
              { value: "Sedang", label: "Sedang" },
              { value: "Rendah", label: "Rendah" },
            ]}
          />
          <div className="flex items-center gap-3">
            <MiniSelect
              label="Filter status tinjauan"
              value={status}
              onChange={setStatus}
              options={[
                { value: "semua", label: "Semua status" },
                { value: "Baru", label: "Belum ditinjau" },
                { value: "Ditinjau", label: "Ditinjau" },
                { value: "Diteruskan", label: "Diteruskan ke dokter" },
              ]}
            />
            <Count>{rows.length} scan</Count>
          </div>
        </Toolbar>
        <Table
          head={
            <>
              <SortTh label="ID" k="id" sort={table.sort} onSort={table.onSort} className="pl-5 sm:pl-6" />
              <SortTh label="Ternak" k="ternak" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Pemilik" k="pemilik" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Wilayah" k="wilayah" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Deteksi" k="deteksi" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Keyakinan" k="yakin" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Risiko" k="risiko" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Status" k="status" sort={table.sort} onSort={table.onSort} />
              <th />
            </>
          }
        >
          {table.rows.map((x) => (
            <tr key={x.id}>
              <td className="font-bold tabular-nums">{x.id}</td>
              <td>{x.ternak}</td>
              <td>{x.pemilik}</td>
              <td>{x.wilayah}</td>
              <td>{x.deteksi}</td>
              <td>
                <Meter value={x.yakin} low={x.yakin < data.settings.aiMin} />
              </td>
              <td>
                <Tag tone={RISK_TONE[x.risiko]}>{x.risiko}</Tag>
              </td>
              <td>
                <Tag tone={STATUS[x.status][1]}>{STATUS[x.status][0]}</Tag>
              </td>
              <td className="pr-5 text-right">
                <Button variant="outline" shape="rounded" size="sm" onClick={() => setOpenId(x.id)}>
                  Tinjau
                </Button>
              </td>
            </tr>
          ))}
          {!table.rows.length && <EmptyRow cols={9}>Tidak ada scan yang cocok.</EmptyRow>}
        </Table>
        <Pager {...table.pager} />
      </Panel>

      <AdminDialog
        isOpen={!!scan}
        onClose={close}
        avatar="AI"
        title={scan ? `Scan ${scan.id}` : ""}
        sub={scan ? `${scan.ternak} milik ${scan.pemilik}` : ""}
        actions={
          scan && (
            <>
              <Button variant="outline" shape="rounded" size="sm" onClick={close}>
                Tutup
              </Button>
              {scan.status !== "Diteruskan" && (
                <Button
                  variant="outline"
                  shape="rounded"
                  size="sm"
                  onClick={() => {
                    if (!vet) return toast("Pilih dokter hewan dulu");
                    update(
                      (d) => d.scans.forEach((s) => s.id === scan.id && Object.assign(s, { status: "Diteruskan", ke: vet })),
                      { jenis: "Konsultasi", teks: `${me} meneruskan scan ${scan.id} ke ${vet}` }
                    );
                    toast(`Scan ${scan.id} diteruskan ke ${vet}`);
                    close();
                  }}
                >
                  Teruskan ke dokter
                </Button>
              )}
              {scan.status === "Baru" && (
                <Button
                  variant="teal"
                  shape="rounded"
                  size="sm"
                  onClick={() => {
                    update((d) => d.scans.forEach((s) => s.id === scan.id && (s.status = "Ditinjau")), { jenis: "Scan", teks: `${me} meninjau scan ${scan.id}` });
                    toast(`Scan ${scan.id} ditandai ditinjau`);
                    close();
                  }}
                >
                  Tandai ditinjau
                </Button>
              )}
            </>
          )
        }
      >
        {scan && (
          <>
            <div className="relative flex h-44 flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-br from-[#edf2e9] to-[#d6e5cf] text-teal-dark">
              <ScanLine className="h-12 w-12 stroke-[1.4]" aria-hidden="true" />
              <span className="font-display text-lg">{scan.ternak}</span>
              <em className="text-xs font-bold not-italic text-slate-500">Keyakinan {scan.yakin}%</em>
            </div>
            <DetailGrid
              items={[
                ["Pemilik", scan.pemilik],
                ["Wilayah", scan.wilayah],
                ["Deteksi AI", scan.deteksi],
                ["Risiko", <Tag key="r" tone={RISK_TONE[scan.risiko]}>{scan.risiko}</Tag>],
                ["Waktu scan", fmtDateTime(scan.ts)],
                ["Status tinjauan", <Tag key="s" tone={STATUS[scan.status][1]}>{STATUS[scan.status][0]}</Tag>],
              ]}
            />
            <div className={cn("rounded-2xl border-l-4 p-4 text-sm", scan.risiko === "Tinggi" || low ? "border-coral-accent bg-orange-50" : "border-teal-accent bg-teal-tint")}>
              <b className="mb-1 block text-teal-dark">{low ? "Keyakinan di bawah batas, sarankan konsultasi dokter" : "Rekomendasi penanganan"}</b>
              {scan.saran}
            </div>
            {scan.status !== "Diteruskan" ? (
              <div>
                <FieldLabel htmlFor="fwdVet">Teruskan ke dokter hewan</FieldLabel>
                <select id="fwdVet" className={adminInput} value={vet} onChange={(e) => setVet(e.target.value)}>
                  <option value="">Pilih dokter</option>
                  {vets.map((v) => (
                    <option key={v.id}>{v.nama}</option>
                  ))}
                </select>
              </div>
            ) : (
              scan.ke && <p className="text-sm text-slate-500">Diteruskan ke {scan.ke}.</p>
            )}
          </>
        )}
      </AdminDialog>
    </>
  );
}
