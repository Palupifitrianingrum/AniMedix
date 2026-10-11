"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import AdminDialog from "@/components/admin/AdminDialog";
import {
  AdminPageHead,
  Count,
  DetailGrid,
  EmptyRow,
  MiniItem,
  OkNote,
  Pager,
  Panel,
  Seg,
  SortTh,
  StatRow,
  StatTile,
  Table,
  Tag,
  Toolbar,
  type Tone,
} from "@/components/admin/AdminUI";
import { RevenueBars } from "@/components/admin/Charts";
import { useAdminStore, adminName, komisiOf, matches } from "@/store/useAdminStore";
import type { Consultation, TrxStatus } from "@/lib/admin/seed";
import { useTable } from "@/hooks/useTable";
import { confirmDialog } from "@/store/useConfirmStore";
import { toast } from "@/store/useToastStore";
import { downloadText, toCSV } from "@/lib/download";
import { DAY_MS, HARI, fmtDate, rp } from "@/lib/format";

type Filter = TrxStatus | "semua";
type SortKey = "id" | "tgl" | "peternak" | "dokter" | "tarif" | "komisi" | "status";
type Row = Consultation & { komisi: number };

const STATUS: Record<TrxStatus, [string, Tone]> = {
  Lunas: ["Lunas", "green"],
  Menunggu: ["Menunggu bayar", "yellow"],
  Kedaluwarsa: ["Kedaluwarsa", "gray"],
  Dikembalikan: ["Dikembalikan", "blue"],
};

function StatusTag({ s }: { s: TrxStatus }) {
  return <Tag tone={STATUS[s][1]}>{STATUS[s][0]}</Tag>;
}

export default function KonsultasiAdminPage() {
  const { data, query, update } = useAdminStore();
  const me = adminName(data);
  const [filter, setFilter] = React.useState<Filter>("semua");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [now] = React.useState(() => Date.now());

  const K = data.konsultasi;
  const lunas = K.filter((k) => k.status === "Lunas");
  const total = lunas.reduce((a, k) => a + k.tarif, 0);
  const kom = lunas.reduce((a, k) => a + komisiOf(k, data), 0);
  const belum = lunas.filter((k) => !k.cair).reduce((a, k) => a + komisiOf(k, data), 0);

  const days = Array.from({ length: 7 }, (_, i) => new Date(now - (6 - i) * DAY_MS));
  const revenue = days.map((d) => lunas.filter((k) => k.tgl === d.toISOString().slice(0, 10)).reduce((a, k) => a + k.tarif, 0));

  const perDoctor: Record<string, { n: number; sum: number }> = {};
  lunas
    .filter((k) => !k.cair)
    .forEach((k) => {
      perDoctor[k.dokter] ??= { n: 0, sum: 0 };
      perDoctor[k.dokter].n++;
      perDoctor[k.dokter].sum += komisiOf(k, data);
    });
  const komisiList = Object.entries(perDoctor)
    .filter(([d]) => matches(query, d))
    .sort((a, b) => b[1].sum - a[1].sum);

  const rows: Row[] = K.map((k) => ({ ...k, komisi: k.status === "Lunas" ? komisiOf(k, data) : 0 })).filter(
    (k) => (filter === "semua" || k.status === filter) && matches(query, k.id, k.peternak, k.dokter, k.topik)
  );
  const table = useTable<Row, SortKey>(rows, { key: "tgl", dir: "desc" }, { resetKey: filter + query });

  const cairkan = async (dokter: string) => {
    const sum = perDoctor[dokter]?.sum ?? 0;
    if (!(await confirmDialog({ title: `Cairkan komisi ${rp(sum)} untuk ${dokter}?`, confirmText: "Cairkan" }))) return;
    update(
      (d) => d.konsultasi.forEach((k) => k.dokter === dokter && k.status === "Lunas" && (k.cair = true)),
      { jenis: "Pembayaran", teks: `${me} mencairkan komisi ${rp(sum)} ke ${dokter}` }
    );
    toast(`Komisi ${rp(sum)} dicairkan ke ${dokter}`);
  };

  const trx = K.find((k) => k.id === openId);
  const setTrxStatus = (id: string, status: TrxStatus, teks: string, msg: string) => {
    update((d) => d.konsultasi.forEach((k) => k.id === id && (k.status = status)), { jenis: "Pembayaran", teks });
    toast(msg);
    setOpenId(null);
  };

  const exportCsv = () => {
    downloadText("konsultasi-animedix.csv", toCSV(["ID", "Tanggal", "Peternak", "Dokter", "Tarif", "Komisi", "Status"], table.all.map((k) => [k.id, k.tgl, k.peternak, k.dokter, k.tarif, k.komisi, k.status])));
    toast("Transaksi diekspor");
  };

  return (
    <>
      <AdminPageHead title="Konsultasi & komisi" desc="Pantau pembayaran konsultasi dan komisi yang diterima dokter hewan.">
        <Button variant="outline" shape="rounded" size="sm" onClick={exportCsv}>
          Ekspor CSV
        </Button>
      </AdminPageHead>

      <StatRow>
        <StatTile label="Pendapatan konsultasi" value={rp(total)} note={`${lunas.length} transaksi lunas`} noteTone="ok" />
        <StatTile label={`Komisi dokter (${data.settings.komisi}%)`} value={rp(kom)} note={`${rp(belum)} belum dicairkan`} tone="warn" />
        <StatTile label="Pendapatan platform" value={rp(total - kom)} note="Setelah komisi" tone="ok" noteTone="mute" />
        <StatTile label="Menunggu pembayaran" value={K.filter((k) => k.status === "Menunggu").length} note={`Batas ${data.settings.bayar} menit`} noteTone="mute" />
      </StatRow>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Pendapatan konsultasi" desc="7 hari terakhir, hanya transaksi lunas">
          <RevenueBars values={revenue} labels={days.map((d) => HARI[d.getDay()])} />
        </Panel>
        <Panel title="Komisi dokter" desc="Belum dicairkan">
          <ul>
            {komisiList.map(([d, v]) => (
              <MiniItem
                key={d}
                bubble={d}
                title={d}
                sub={`${v.n} sesi · ${rp(v.sum)}`}
                action={
                  <Button variant="outline" shape="rounded" size="sm" onClick={() => cairkan(d)}>
                    Cairkan
                  </Button>
                }
              />
            ))}
            {!komisiList.length && <OkNote>Semua komisi sudah dicairkan.</OkNote>}
          </ul>
        </Panel>
      </div>

      <Panel>
        <Toolbar>
          <Seg
            value={filter}
            onChange={setFilter}
            options={[
              { value: "semua", label: "Semua" },
              { value: "Lunas", label: "Lunas" },
              { value: "Menunggu", label: "Menunggu bayar" },
              { value: "Kedaluwarsa", label: "Kedaluwarsa" },
              { value: "Dikembalikan", label: "Dikembalikan" },
            ]}
          />
          <Count>{rows.length} transaksi</Count>
        </Toolbar>
        <Table
          head={
            <>
              <SortTh label="ID" k="id" sort={table.sort} onSort={table.onSort} className="pl-5 sm:pl-6" />
              <SortTh label="Tanggal" k="tgl" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Peternak" k="peternak" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Dokter hewan" k="dokter" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Tarif" k="tarif" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Komisi dokter" k="komisi" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Pembayaran" k="status" sort={table.sort} onSort={table.onSort} />
              <th />
            </>
          }
        >
          {table.rows.map((k) => (
            <tr key={k.id}>
              <td className="font-bold tabular-nums">{k.id}</td>
              <td className="whitespace-nowrap tabular-nums">{fmtDate(k.tgl)}</td>
              <td>{k.peternak}</td>
              <td>{k.dokter}</td>
              <td className="tabular-nums">{rp(k.tarif)}</td>
              <td className="whitespace-nowrap tabular-nums">
                {k.status === "Lunas" ? (
                  <>
                    {rp(k.komisi)} {!k.cair && <Tag tone="orange">Belum cair</Tag>}
                  </>
                ) : (
                  "-"
                )}
              </td>
              <td>
                <StatusTag s={k.status} />
              </td>
              <td className="pr-5 text-right">
                <Button variant="outline" shape="rounded" size="sm" onClick={() => setOpenId(k.id)}>
                  Detail
                </Button>
              </td>
            </tr>
          ))}
          {!table.rows.length && <EmptyRow cols={8}>Tidak ada transaksi yang cocok.</EmptyRow>}
        </Table>
        <Pager {...table.pager} />
      </Panel>

      <AdminDialog
        isOpen={!!trx}
        onClose={() => setOpenId(null)}
        avatar="Rp"
        title={trx?.id ?? ""}
        sub={trx ? `${trx.peternak} dengan ${trx.dokter}` : ""}
        actions={
          trx && (
            <>
              {trx.status === "Lunas" && (
                <Button
                  variant="danger"
                  shape="rounded"
                  size="sm"
                  onClick={async () => {
                    if (!(await confirmDialog({ title: `Kembalikan ${rp(trx.tarif)} ke ${trx.peternak}?`, confirmText: "Kembalikan dana", isDestructive: true }))) return;
                    setTrxStatus(trx.id, "Dikembalikan", `${me} mengembalikan dana ${trx.id}`, "Dana dikembalikan");
                  }}
                >
                  Kembalikan dana
                </Button>
              )}
              {trx.status === "Menunggu" && (
                <Button variant="teal" shape="rounded" size="sm" onClick={() => setTrxStatus(trx.id, "Lunas", `${me} menandai ${trx.id} lunas`, `${trx.id} ditandai lunas`)}>
                  Tandai lunas
                </Button>
              )}
              <Button variant="outline" shape="rounded" size="sm" onClick={() => setOpenId(null)}>
                Tutup
              </Button>
            </>
          )
        }
      >
        {trx && (
          <DetailGrid
            items={[
              ["Tanggal", fmtDate(trx.tgl)],
              ["Status", <StatusTag key="s" s={trx.status} />],
              ["Peternak", trx.peternak],
              ["Dokter hewan", trx.dokter],
              ["Keluhan", trx.topik, true],
              ["Tarif", rp(trx.tarif)],
              ["Durasi sesi", `${trx.durasi} menit`],
              ["Komisi dokter", trx.status === "Lunas" ? rp(komisiOf(trx, data)) : "-"],
              ["Pendapatan platform", trx.status === "Lunas" ? rp(trx.tarif - komisiOf(trx, data)) : "-"],
            ]}
          />
        )}
      </AdminDialog>
    </>
  );
}
