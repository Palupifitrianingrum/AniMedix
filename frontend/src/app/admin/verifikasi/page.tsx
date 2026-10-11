"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui";
import AdminDialog from "@/components/admin/AdminDialog";
import {
  AdminPageHead,
  Count,
  DetailGrid,
  EmptyRow,
  Pager,
  Panel,
  Person,
  Seg,
  SortTh,
  StatRow,
  StatTile,
  Table,
  Tag,
  Toolbar,
} from "@/components/admin/AdminUI";
import { useAdminStore, matches } from "@/store/useAdminStore";
import { applyVetStatus, VET_STATUS, vetDocs } from "@/lib/admin/actions";
import type { VetStatus } from "@/lib/admin/seed";
import { useTable } from "@/hooks/useTable";
import { confirmDialog } from "@/store/useConfirmStore";
import { toast } from "@/store/useToastStore";
import { fmtDate } from "@/lib/format";

type Filter = VetStatus | "semua";
type SortKey = "nama" | "str" | "sip" | "kota" | "tgl" | "status";

function StatusTag({ s }: { s: VetStatus }) {
  const [label, tone] = VET_STATUS[s];
  return <Tag tone={tone}>{label}</Tag>;
}

function VerifikasiContent() {
  const params = useSearchParams();
  const { data, query, update } = useAdminStore();
  const [filter, setFilter] = React.useState<Filter>("menunggu");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [openId, setOpenId] = React.useState<string | null>(() => params.get("periksa"));
  const [note, setNote] = React.useState("");

  const V = data.vets;
  const count = (k: VetStatus) => V.filter((v) => v.status === k).length;
  const rows = V.filter((v) => (filter === "semua" || v.status === filter) && matches(query, v.nama, v.str, v.sip, v.kota, v.id));
  const table = useTable<(typeof rows)[number], SortKey>(rows, { key: "tgl", dir: "desc" }, { resetKey: filter + query });

  const selectable = table.rows.filter((v) => v.status === "menunggu").map((v) => v.id);
  const allChecked = selectable.length > 0 && selectable.every((id) => selected.has(id));

  const toggle = (id: string, on: boolean) =>
    setSelected((s) => {
      const n = new Set(s);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });

  const bulkApprove = async () => {
    const ids = [...selected].filter((id) => V.some((v) => v.id === id && v.status === "menunggu"));
    if (!ids.length) return;
    if (!(await confirmDialog({ title: `Setujui ${ids.length} dokter hewan terpilih?`, confirmText: "Setujui" }))) return;
    update((d) => {
      ids.forEach((id) => {
        const teks = applyVetStatus(d, id, "disetujui");
        d.logs.unshift({ ts: Date.now(), peran: "Admin", jenis: "Verifikasi", teks });
      });
    });
    toast(`${ids.length} dokter disetujui`);
    setSelected(new Set());
  };

  const vet = V.find((v) => v.id === openId);
  const close = () => {
    setOpenId(null);
    setNote("");
  };

  const decide = (status: "disetujui" | "ditolak" | "revisi") => {
    if (!vet) return;
    if (status !== "disetujui" && !note.trim()) {
      toast("Tulis catatan untuk dokter dulu");
      return;
    }
    update((d) => {
      const teks = applyVetStatus(d, vet.id, status, note.trim());
      d.logs.unshift({ ts: Date.now(), peran: "Admin", jenis: "Verifikasi", teks });
    });
    toast(status === "disetujui" ? `${vet.nama} disetujui` : status === "ditolak" ? `${vet.nama} ditolak` : "Permintaan dokumen dikirim");
    close();
  };

  const pendingDecision = vet && (vet.status === "menunggu" || vet.status === "revisi");

  return (
    <>
      <AdminPageHead title="Verifikasi dokter hewan" desc="Periksa STR, SIP, dan dokumen pendukung sebelum akun mitra diaktifkan.">
        <Button variant="teal" shape="rounded" size="sm" disabled={!selected.size} onClick={bulkApprove}>
          {selected.size ? `Setujui terpilih (${selected.size})` : "Setujui terpilih"}
        </Button>
      </AdminPageHead>

      <StatRow>
        <StatTile label="Menunggu" value={count("menunggu")} note="Perlu diperiksa" tone="warn" />
        <StatTile label="Perlu dokumen" value={count("revisi")} note="Menunggu balasan dokter" noteTone="mute" />
        <StatTile label="Disetujui" value={count("disetujui")} note="Mitra aktif" tone="ok" />
        <StatTile label="Ditolak" value={count("ditolak")} note="Tidak lolos verifikasi" tone="bad" />
      </StatRow>

      <Panel>
        <Toolbar>
          <Seg
            value={filter}
            onChange={(f) => {
              setFilter(f);
              setSelected(new Set());
            }}
            options={[
              { value: "menunggu", label: "Menunggu" },
              { value: "revisi", label: "Perlu dokumen" },
              { value: "disetujui", label: "Disetujui" },
              { value: "ditolak", label: "Ditolak" },
              { value: "semua", label: "Semua" },
            ]}
          />
          <Count>{rows.length} dokter</Count>
        </Toolbar>

        <Table
          head={
            <>
              <th className="w-10 py-3 pl-5 sm:pl-6">
                <input
                  type="checkbox"
                  aria-label="Pilih semua di halaman ini"
                  className="h-4 w-4 accent-teal-accent"
                  checked={allChecked}
                  disabled={!selectable.length}
                  onChange={(e) => selectable.forEach((id) => toggle(id, e.target.checked))}
                />
              </th>
              <SortTh label="Dokter hewan" k="nama" sort={table.sort} onSort={table.onSort} />
              <SortTh label="No. STR" k="str" sort={table.sort} onSort={table.onSort} />
              <SortTh label="No. SIP" k="sip" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Domisili" k="kota" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Tanggal daftar" k="tgl" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Status" k="status" sort={table.sort} onSort={table.onSort} />
              <th />
            </>
          }
        >
          {table.rows.map((v) => (
            <tr key={v.id} className={selected.has(v.id) ? "bg-teal-tint/50" : undefined}>
              <td>
                <input
                  type="checkbox"
                  aria-label={`Pilih ${v.nama}`}
                  className="h-4 w-4 accent-teal-accent"
                  disabled={v.status !== "menunggu"}
                  checked={selected.has(v.id)}
                  onChange={(e) => toggle(v.id, e.target.checked)}
                />
              </td>
              <td>
                <Person name={v.nama} sub={v.id} />
              </td>
              <td className="tabular-nums">{v.str}</td>
              <td className="tabular-nums">{v.sip}</td>
              <td>{v.kota}</td>
              <td className="whitespace-nowrap tabular-nums">{fmtDate(v.tgl)}</td>
              <td>
                <StatusTag s={v.status} />
              </td>
              <td className="pr-5 text-right">
                <Button variant="outline" shape="rounded" size="sm" onClick={() => setOpenId(v.id)}>
                  Periksa
                </Button>
              </td>
            </tr>
          ))}
          {!table.rows.length && <EmptyRow cols={8}>Tidak ada dokter pada kategori ini.</EmptyRow>}
        </Table>
        <Pager {...table.pager} />
      </Panel>

      <AdminDialog
        isOpen={!!vet}
        onClose={close}
        avatar={vet?.nama}
        title={vet?.nama ?? ""}
        sub={vet ? `${vet.id} · ${vet.kota}` : ""}
        actions={
          pendingDecision ? (
            <>
              <Button variant="danger" shape="rounded" size="sm" onClick={() => decide("ditolak")}>
                Tolak
              </Button>
              {vet?.status === "menunggu" && (
                <Button variant="outline" shape="rounded" size="sm" onClick={() => decide("revisi")}>
                  Minta dokumen
                </Button>
              )}
              <Button variant="teal" shape="rounded" size="sm" onClick={() => decide("disetujui")}>
                Setujui akun
              </Button>
            </>
          ) : (
            <Button variant="outline" shape="rounded" size="sm" onClick={close}>
              Tutup
            </Button>
          )
        }
      >
        {vet && (
          <>
            <DetailGrid
              items={[
                ["No. STR", vet.str],
                ["No. SIP", vet.sip],
                ["Spesialisasi", vet.spesialis],
                ["Pengalaman", vet.pengalaman],
                ["No. HP", vet.hp],
                ["Status", <StatusTag key="s" s={vet.status} />],
                ...(vet.alasan ? ([["Alasan penolakan", vet.alasan, true]] as [string, React.ReactNode, boolean][]) : []),
                ...(vet.catatan && vet.status === "revisi" ? ([["Catatan admin", vet.catatan, true]] as [string, React.ReactNode, boolean][]) : []),
              ]}
            />
            <div>
              <b className="mb-2 block text-sm text-teal-dark">Dokumen pendukung</b>
              <ul className="flex flex-col gap-1.5">
                {vetDocs(vet).map((doc) => (
                  <li key={doc} className="flex items-center gap-2 rounded-xl border border-border-hairline px-3 py-2 text-sm">
                    <FileText className="h-4 w-4 text-teal-base" aria-hidden="true" /> {doc}
                  </li>
                ))}
              </ul>
            </div>
            {pendingDecision && (
              <div>
                <label htmlFor="fNote" className="mb-1.5 block text-[13px] font-bold text-slate-600">
                  Catatan untuk dokter (wajib jika menolak atau meminta dokumen)
                </label>
                <textarea
                  id="fNote"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Contoh: mohon unggah ulang scan SIP yang lebih jelas"
                  className="w-full rounded-xl border border-border-hairline bg-surface-bg px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-accent"
                />
              </div>
            )}
          </>
        )}
      </AdminDialog>
    </>
  );
}

export default function VerifikasiPage() {
  return (
    <React.Suspense>
      <VerifikasiContent />
    </React.Suspense>
  );
}
