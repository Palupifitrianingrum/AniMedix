"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import AdminDialog from "@/components/admin/AdminDialog";
import {
  AdminPageHead,
  Count,
  DetailGrid,
  EmptyRow,
  FieldLabel,
  MiniSelect,
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
  adminInput,
  type Tone,
} from "@/components/admin/AdminUI";
import { useAdminStore, adminName, matches } from "@/store/useAdminStore";
import type { AppUser, UserRole } from "@/lib/admin/seed";
import { useTable } from "@/hooks/useTable";
import { confirmDialog } from "@/store/useConfirmStore";
import { toast } from "@/store/useToastStore";
import { downloadText, toCSV } from "@/lib/download";
import { fmtDate, fmtDateTime } from "@/lib/format";

type RoleFilter = UserRole | "semua";
type SortKey = "nama" | "peran" | "kontak" | "wilayah" | "ternak" | "status";

const ROLE_TONE: Record<UserRole, Tone> = { Peternak: "teal", Koperasi: "yellow", "Dokter hewan": "green" };

export default function PenggunaPage() {
  const { data, query, update } = useAdminStore();
  const me = adminName(data);
  const [role, setRole] = React.useState<RoleFilter>("semua");
  const [status, setStatus] = React.useState("semua");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ nama: "", peran: "Peternak" as UserRole, kontak: "", wilayah: "" });

  const U = data.users;
  const c = (p: UserRole) => U.filter((u) => u.peran === p).length;
  const rows = U.filter(
    (u) => (role === "semua" || u.peran === role) && (status === "semua" || u.status === status) && matches(query, u.nama, u.kontak, u.wilayah, u.peran)
  );
  const table = useTable<AppUser, SortKey>(rows, { key: "nama", dir: "asc" }, { resetKey: role + status + query });

  const toggleUser = (u: AppUser) => {
    const next = u.status === "Aktif" ? "Ditangguhkan" : "Aktif";
    update(
      (d) => {
        const x = d.users.find((y) => y.id === u.id);
        if (x) x.status = next;
      },
      { jenis: "Pengguna", teks: `${me} ${next === "Aktif" ? "mengaktifkan" : "menangguhkan"} akun ${u.nama}` }
    );
    toast(`Akun ${u.nama} ${next === "Aktif" ? "diaktifkan" : "ditangguhkan"}`);
  };

  const user = U.find((u) => u.id === openId);

  const removeUser = async (u: AppUser) => {
    if (!(await confirmDialog({ title: `Hapus akun ${u.nama}?`, description: "Tindakan ini tidak bisa dibatalkan.", confirmText: "Hapus akun", isDestructive: true }))) return;
    update((d) => (d.users = d.users.filter((x) => x.id !== u.id)), { jenis: "Pengguna", teks: `${me} menghapus akun ${u.nama}` });
    setOpenId(null);
    toast("Akun dihapus");
  };

  const saveNew = () => {
    const nama = form.nama.trim(), kontak = form.kontak.trim(), wilayah = form.wilayah.trim();
    if (!nama || !kontak || !wilayah) {
      toast("Lengkapi nama, kontak, dan wilayah");
      return;
    }
    update(
      (d) =>
        d.users.unshift({
          id: "U-" + String(d.users.length + 1).padStart(3, "0"),
          nama,
          peran: form.peran,
          kontak,
          wilayah,
          ternak: 0,
          status: "Aktif",
          gabung: new Date().toISOString().slice(0, 10),
        }),
      { jenis: "Pengguna", teks: `${me} menambahkan pengguna ${nama}` }
    );
    toast(`${nama} ditambahkan`);
    setAdding(false);
    setForm({ nama: "", peran: "Peternak", kontak: "", wilayah: "" });
  };

  const exportCsv = () => {
    downloadText("pengguna-animedix.csv", toCSV(["Nama", "Peran", "Kontak", "Wilayah", "Ternak", "Status"], table.all.map((u) => [u.nama, u.peran, u.kontak, u.wilayah, u.ternak, u.status])));
    toast("Data pengguna diekspor");
  };

  return (
    <>
      <AdminPageHead title="Pengguna" desc="Peternak, koperasi, dan dokter hewan yang terdaftar di AniMedix.">
        <Button variant="outline" shape="rounded" size="sm" onClick={exportCsv}>
          Ekspor CSV
        </Button>
        <Button variant="teal" shape="rounded" size="sm" onClick={() => setAdding(true)}>
          Tambah pengguna
        </Button>
      </AdminPageHead>

      <StatRow>
        <StatTile label="Peternak" value={c("Peternak")} note={`${U.filter((u) => u.peran === "Peternak").reduce((a, u) => a + u.ternak, 0).toLocaleString("id-ID")} ekor tercatat`} />
        <StatTile label="Koperasi" value={c("Koperasi")} note="Menaungi banyak peternak" tone="warn" noteTone="mute" />
        <StatTile label="Dokter hewan" value={c("Dokter hewan")} note="Mitra terverifikasi" tone="ok" />
        <StatTile label="Ditangguhkan" value={U.filter((u) => u.status !== "Aktif").length} note="Tidak bisa masuk" tone="bad" />
      </StatRow>

      <Panel>
        <Toolbar>
          <Seg
            value={role}
            onChange={setRole}
            options={[
              { value: "semua", label: "Semua" },
              { value: "Peternak", label: "Peternak" },
              { value: "Koperasi", label: "Koperasi" },
              { value: "Dokter hewan", label: "Dokter hewan" },
            ]}
          />
          <div className="flex items-center gap-3">
            <MiniSelect
              label="Filter status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "semua", label: "Semua status" },
                { value: "Aktif", label: "Aktif" },
                { value: "Ditangguhkan", label: "Ditangguhkan" },
              ]}
            />
            <Count>{rows.length} pengguna</Count>
          </div>
        </Toolbar>

        <Table
          head={
            <>
              <SortTh label="Nama" k="nama" sort={table.sort} onSort={table.onSort} className="pl-5 sm:pl-6" />
              <SortTh label="Peran" k="peran" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Kontak" k="kontak" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Wilayah" k="wilayah" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Ternak" k="ternak" sort={table.sort} onSort={table.onSort} />
              <SortTh label="Status" k="status" sort={table.sort} onSort={table.onSort} />
              <th />
            </>
          }
        >
          {table.rows.map((u) => (
            <tr key={u.id}>
              <td>
                <Person name={u.nama} sub={`Bergabung ${fmtDate(u.gabung)}`} />
              </td>
              <td>
                <Tag tone={ROLE_TONE[u.peran]}>{u.peran}</Tag>
              </td>
              <td>{u.kontak}</td>
              <td>{u.wilayah}</td>
              <td className="tabular-nums">{u.peran === "Dokter hewan" ? "-" : u.ternak.toLocaleString("id-ID")}</td>
              <td>
                <Tag tone={u.status === "Aktif" ? "green" : "red"}>{u.status}</Tag>
              </td>
              <td className="pr-5">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" shape="rounded" size="sm" onClick={() => setOpenId(u.id)}>
                    Detail
                  </Button>
                  <Button variant={u.status === "Aktif" ? "danger" : "outline"} shape="rounded" size="sm" onClick={() => toggleUser(u)}>
                    {u.status === "Aktif" ? "Tangguhkan" : "Aktifkan"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {!table.rows.length && <EmptyRow cols={7}>Tidak ada pengguna yang cocok.</EmptyRow>}
        </Table>
        <Pager {...table.pager} />
      </Panel>

      {/* Detail pengguna */}
      <AdminDialog
        isOpen={!!user}
        onClose={() => setOpenId(null)}
        avatar={user?.nama}
        title={user?.nama ?? ""}
        sub={user ? `${user.id} · ${user.peran}` : ""}
        actions={
          user && (
            <>
              <Button variant="danger" shape="rounded" size="sm" onClick={() => removeUser(user)}>
                Hapus akun
              </Button>
              <Button
                variant="outline"
                shape="rounded"
                size="sm"
                onClick={() => {
                  update(() => {}, { jenis: "Pengguna", teks: `${me} mereset kata sandi ${user.nama}` });
                  toast(`Tautan reset dikirim ke ${user.kontak}`);
                  setOpenId(null);
                }}
              >
                Reset kata sandi
              </Button>
              <Button
                variant="teal"
                shape="rounded"
                size="sm"
                onClick={() => {
                  toggleUser(user);
                  setOpenId(null);
                }}
              >
                {user.status === "Aktif" ? "Tangguhkan" : "Aktifkan"}
              </Button>
            </>
          )
        }
      >
        {user && (
          <>
            <DetailGrid
              items={[
                ["Peran", <Tag key="p" tone={ROLE_TONE[user.peran]}>{user.peran}</Tag>],
                ["Status", <Tag key="s" tone={user.status === "Aktif" ? "green" : "red"}>{user.status}</Tag>],
                ["Kontak", user.kontak],
                ["Wilayah", user.wilayah],
                ["Bergabung", fmtDate(user.gabung)],
                user.peran === "Dokter hewan"
                  ? ["Konsultasi", `${data.konsultasi.filter((k) => k.dokter === user.nama && k.status === "Lunas").length} sesi`]
                  : ["Jumlah ternak", `${user.ternak.toLocaleString("id-ID")} ekor`],
              ]}
            />
            <div>
              <b className="mb-2 block text-sm text-teal-dark">Aktivitas terakhir</b>
              <ul className="flex flex-col gap-1.5 text-sm">
                {data.logs
                  .filter((l) => l.teks.includes(user.nama))
                  .slice(0, 4)
                  .map((l) => (
                    <li key={l.ts + l.teks} className="rounded-xl border border-border-hairline px-3 py-2">
                      {l.teks}
                      <small className="block text-xs text-slate-500">{fmtDateTime(l.ts)}</small>
                    </li>
                  ))}
                {!data.logs.some((l) => l.teks.includes(user.nama)) && <li className="text-slate-500">Belum ada aktivitas tercatat.</li>}
              </ul>
            </div>
          </>
        )}
      </AdminDialog>

      {/* Tambah pengguna */}
      <AdminDialog
        isOpen={adding}
        onClose={() => setAdding(false)}
        title="Tambah pengguna"
        sub="Akun baru langsung aktif"
        actions={
          <>
            <Button variant="outline" shape="rounded" size="sm" onClick={() => setAdding(false)}>
              Batal
            </Button>
            <Button variant="teal" shape="rounded" size="sm" onClick={saveNew}>
              Simpan pengguna
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="nNama">Nama lengkap</FieldLabel>
            <input id="nNama" className={adminInput} placeholder="Contoh: Bu Sumiati" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          </div>
          <div>
            <FieldLabel htmlFor="nPeran">Peran</FieldLabel>
            <select id="nPeran" className={adminInput} value={form.peran} onChange={(e) => setForm({ ...form, peran: e.target.value as UserRole })}>
              <option>Peternak</option>
              <option>Koperasi</option>
              <option>Dokter hewan</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="nKontak">Email atau no. HP</FieldLabel>
            <input id="nKontak" className={adminInput} value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="nWil">Wilayah</FieldLabel>
            <input id="nWil" className={adminInput} placeholder="Kabupaten, Provinsi" value={form.wilayah} onChange={(e) => setForm({ ...form, wilayah: e.target.value })} />
          </div>
        </div>
      </AdminDialog>
    </>
  );
}
