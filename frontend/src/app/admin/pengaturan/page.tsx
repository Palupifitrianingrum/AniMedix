"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import AdminDialog from "@/components/admin/AdminDialog";
import { AdminPageHead, FieldLabel, MiniItem, Panel, Seg, Tag, adminInput } from "@/components/admin/AdminUI";
import { useAdminStore, adminName, matches } from "@/store/useAdminStore";
import type { AdminSettings } from "@/lib/admin/seed";
import { confirmDialog } from "@/store/useConfirmStore";
import { toast } from "@/store/useToastStore";
import { downloadText } from "@/lib/download";
import { cn } from "@/lib/utils";

type Tab = "kons" | "ai" | "notif" | "akun" | "admin" | "data";

function Switch({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer", checked ? "bg-teal-accent" : "bg-slate-300")}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

function SwitchRow({ id, title, desc, checked, onChange }: { id: string; title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border-hairline py-4 sm:col-span-2">
      <label htmlFor={id} className="cursor-pointer">
        <b className="block text-sm text-teal-dark">{title}</b>
        <small className="text-xs text-slate-500">{desc}</small>
      </label>
      <Switch id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

function NumberField({ id, label, hint, value, onChange, min, max, step }: { id: string; label: string; hint: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input id={id} type="number" className={adminInput} value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} />
      <small className="mt-1 block text-xs text-slate-500">{hint}</small>
    </div>
  );
}

function FormActions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap justify-end gap-2 pt-2 sm:col-span-2">{children}</div>;
}

export default function PengaturanPage() {
  const { data, query, update, resetData } = useAdminStore();
  const me = adminName(data);
  const [tab, setTab] = React.useState<Tab>("kons");
  const [s, setS] = React.useState<AdminSettings>(() => structuredClone(data.settings));
  const [pass, setPass] = React.useState({ lama: "", baru: "", ulang: "" });
  const [adding, setAdding] = React.useState(false);
  const [newAdmin, setNewAdmin] = React.useState({ nama: "", email: "", peran: "Verifikator" });

  const save = (label: string, patch: Partial<AdminSettings>) => {
    update((d) => Object.assign(d.settings, patch), { jenis: "Pengaturan", teks: `${me} memperbarui ${label}` });
    toast("Perubahan disimpan");
  };

  const submit = (e: React.FormEvent, fn: () => void) => {
    e.preventDefault();
    fn();
  };

  return (
    <>
      <AdminPageHead title="Pengaturan" desc="Atur tarif, model AI, notifikasi, akun, dan akses admin." />

      <Seg
        className="mb-5"
        value={tab}
        onChange={setTab}
        options={[
          { value: "kons", label: "Konsultasi" },
          { value: "ai", label: "Model AI" },
          { value: "notif", label: "Notifikasi" },
          { value: "akun", label: "Akun & keamanan" },
          { value: "admin", label: "Admin" },
          { value: "data", label: "Data contoh" },
        ]}
      />

      {tab === "kons" && (
        <Panel>
          <form
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            onSubmit={(e) =>
              submit(e, () => {
                if (s.komisi < 0 || s.komisi > 100) return toast("Komisi harus antara 0 dan 100%");
                if (s.tarif < 0) return toast("Tarif tidak boleh negatif");
                save("pengaturan konsultasi", { tarif: s.tarif, durasi: s.durasi, komisi: s.komisi, bayar: s.bayar, verif: s.verif });
              })
            }
          >
            <NumberField id="setTarif" label="Tarif konsultasi (Rp)" hint="Dibayar peternak untuk satu sesi chat." value={s.tarif} min={0} step={1000} onChange={(v) => setS({ ...s, tarif: v })} />
            <NumberField id="setDurasi" label="Batas waktu sesi (menit)" hint="Sesi chat otomatis berakhir setelah waktu ini." value={s.durasi} min={5} step={5} onChange={(v) => setS({ ...s, durasi: v })} />
            <NumberField id="setKomisi" label="Komisi dokter hewan (%)" hint="Sisanya menjadi pendapatan platform." value={s.komisi} min={0} max={100} onChange={(v) => setS({ ...s, komisi: v })} />
            <NumberField id="setBayar" label="Batas waktu pembayaran (menit)" hint="Setelah lewat, transaksi berstatus kedaluwarsa." value={s.bayar} min={5} step={5} onChange={(v) => setS({ ...s, bayar: v })} />
            <SwitchRow id="setVerif" title="Wajib verifikasi STR/SIP" desc="Akun dokter baru aktif setelah disetujui admin." checked={s.verif} onChange={(v) => setS({ ...s, verif: v })} />
            <FormActions>
              <Button type="submit" variant="teal" shape="rounded" size="sm">Simpan perubahan</Button>
            </FormActions>
          </form>
        </Panel>
      )}

      {tab === "ai" && (
        <Panel>
          <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={(e) => submit(e, () => save("pengaturan model AI", { aiMin: s.aiMin, aiWabah: Math.max(1, s.aiWabah), aiFlag: s.aiFlag }))}>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="setAiMin">
                Keyakinan minimum hasil scan: <b className="text-teal-base">{s.aiMin}</b>%
              </FieldLabel>
              <input id="setAiMin" type="range" min={40} max={95} step={1} value={s.aiMin} onChange={(e) => setS({ ...s, aiMin: Number(e.target.value) })} className="w-full accent-teal-accent" />
              <small className="mt-1 block text-xs text-slate-500">Hasil di bawah angka ini ditandai &quot;perlu ditinjau&quot; dan disarankan konsultasi dokter.</small>
            </div>
            <NumberField id="setAiWabah" label="Batas peringatan wilayah (kasus)" hint="Jumlah kasus risiko tinggi sejenis di satu daerah sebelum peringatan muncul." value={s.aiWabah} min={1} max={20} onChange={(v) => setS({ ...s, aiWabah: v })} />
            <div />
            <SwitchRow id="setAiFlag" title="Tandai otomatis kasus risiko tinggi" desc="Kasus risiko tinggi masuk antrean tinjauan admin." checked={s.aiFlag} onChange={(v) => setS({ ...s, aiFlag: v })} />
            <FormActions>
              <Button type="submit" variant="teal" shape="rounded" size="sm">Simpan perubahan</Button>
            </FormActions>
          </form>
        </Panel>
      )}

      {tab === "notif" && (
        <Panel>
          <form className="grid grid-cols-1 sm:grid-cols-2" onSubmit={(e) => submit(e, () => save("pengaturan notifikasi", { notif: s.notif }))}>
            {(
              [
                ["verif", "Permohonan dokter baru", "Beri tahu saat ada dokter hewan yang mendaftar."],
                ["bayar", "Masalah pembayaran", "Transaksi kedaluwarsa atau dikembalikan."],
                ["wabah", "Peringatan wilayah", "Lonjakan kasus berisiko tinggi di satu daerah."],
                ["email", "Ringkasan harian lewat email", "Dikirim setiap pagi ke alamat email admin."],
              ] as const
            ).map(([k, title, desc]) => (
              <SwitchRow key={k} id={`n-${k}`} title={title} desc={desc} checked={s.notif[k]} onChange={(v) => setS({ ...s, notif: { ...s.notif, [k]: v } })} />
            ))}
            <FormActions>
              <Button type="submit" variant="teal" shape="rounded" size="sm">Simpan perubahan</Button>
            </FormActions>
          </form>
        </Panel>
      )}

      {tab === "akun" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel title="Profil admin">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) =>
                submit(e, () => {
                  const nama = s.profil.nama.trim();
                  if (!nama) return toast("Nama tidak boleh kosong");
                  save("profil admin", { profil: { nama, email: s.profil.email.trim() } });
                })
              }
            >
              <div>
                <FieldLabel htmlFor="pNama">Nama</FieldLabel>
                <input id="pNama" required className={adminInput} value={s.profil.nama} onChange={(e) => setS({ ...s, profil: { ...s.profil, nama: e.target.value } })} />
              </div>
              <div>
                <FieldLabel htmlFor="pEmail">Email</FieldLabel>
                <input id="pEmail" type="email" required className={adminInput} value={s.profil.email} onChange={(e) => setS({ ...s, profil: { ...s.profil, email: e.target.value } })} />
              </div>
              <FormActions>
                <Button type="submit" variant="teal" shape="rounded" size="sm">Simpan profil</Button>
              </FormActions>
            </form>
          </Panel>
          <Panel title="Ganti kata sandi">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) =>
                submit(e, () => {
                  if (!pass.lama) return toast("Isi kata sandi lama");
                  if (pass.baru.length < 8) return toast("Kata sandi baru minimal 8 karakter");
                  if (pass.baru !== pass.ulang) return toast("Kata sandi baru dan ulangannya belum sama");
                  update(() => {}, { jenis: "Pengaturan", teks: `${me} mengganti kata sandi` });
                  setPass({ lama: "", baru: "", ulang: "" });
                  toast("Kata sandi diperbarui");
                })
              }
            >
              <div>
                <FieldLabel htmlFor="pLama">Kata sandi lama</FieldLabel>
                <input id="pLama" type="password" autoComplete="current-password" className={adminInput} value={pass.lama} onChange={(e) => setPass({ ...pass, lama: e.target.value })} />
              </div>
              <div>
                <FieldLabel htmlFor="pBaru">Kata sandi baru</FieldLabel>
                <input id="pBaru" type="password" autoComplete="new-password" className={adminInput} value={pass.baru} onChange={(e) => setPass({ ...pass, baru: e.target.value })} />
                <small className="mt-1 block text-xs text-slate-500">Minimal 8 karakter.</small>
              </div>
              <div>
                <FieldLabel htmlFor="pUlang">Ulangi kata sandi baru</FieldLabel>
                <input id="pUlang" type="password" autoComplete="new-password" className={adminInput} value={pass.ulang} onChange={(e) => setPass({ ...pass, ulang: e.target.value })} />
              </div>
              <FormActions>
                <Button type="submit" variant="teal" shape="rounded" size="sm">Perbarui kata sandi</Button>
              </FormActions>
            </form>
          </Panel>
        </div>
      )}

      {tab === "admin" && (
        <Panel
          title="Akun admin"
          desc="Siapa saja yang bisa masuk ke portal ini"
          action={
            <Button variant="teal" shape="rounded" size="sm" onClick={() => setAdding(true)}>
              Tambah admin
            </Button>
          }
        >
          <ul>
            {data.admins
              .filter((a) => matches(query, a.nama, a.email, a.peran))
              .map((a) => (
                <MiniItem
                  key={a.email}
                  bubble={a.nama}
                  title={a.nama}
                  sub={a.email}
                  action={
                    <div className="flex items-center gap-2">
                      <Tag tone={a.peran === "Super admin" ? "green" : "teal"}>{a.peran}</Tag>
                      {a.peran !== "Super admin" && (
                        <Button
                          variant="danger"
                          shape="rounded"
                          size="sm"
                          onClick={async () => {
                            if (!(await confirmDialog({ title: `Hapus akses ${a.nama}?`, confirmText: "Hapus", isDestructive: true }))) return;
                            update((d) => (d.admins = d.admins.filter((x) => x.email !== a.email)), { jenis: "Pengaturan", teks: `${me} menghapus admin ${a.nama}` });
                            toast("Admin dihapus");
                          }}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  }
                />
              ))}
          </ul>
        </Panel>
      )}

      {tab === "data" && (
        <Panel title="Data contoh">
          <p className="mb-4 max-w-2xl text-sm text-slate-500">
            Data di portal ini disimpan di browser Anda supaya perubahan terbawa antar halaman. Saat backend sudah siap, bagian ini tidak diperlukan lagi.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              shape="rounded"
              size="sm"
              onClick={() => {
                downloadText("animedix-data.json", JSON.stringify(data, null, 2), "application/json");
                toast("Data diunduh");
              }}
            >
              Unduh semua data (JSON)
            </Button>
            <Button
              variant="danger"
              shape="rounded"
              size="sm"
              onClick={async () => {
                if (!(await confirmDialog({ title: "Kembalikan semua data ke contoh awal?", confirmText: "Reset data", isDestructive: true }))) return;
                resetData();
                setS(structuredClone(useAdminStore.getState().data.settings));
                toast("Data contoh dikembalikan");
              }}
            >
              Reset data contoh
            </Button>
          </div>
        </Panel>
      )}

      <AdminDialog
        isOpen={adding}
        onClose={() => setAdding(false)}
        title="Tambah admin"
        sub="Undangan dikirim lewat email"
        actions={
          <>
            <Button variant="outline" shape="rounded" size="sm" onClick={() => setAdding(false)}>
              Batal
            </Button>
            <Button
              variant="teal"
              shape="rounded"
              size="sm"
              onClick={() => {
                const nama = newAdmin.nama.trim(), email = newAdmin.email.trim();
                if (!nama || !/^\S+@\S+\.\S+$/.test(email)) return toast("Isi nama dan email yang valid");
                update((d) => d.admins.push({ nama, email, peran: newAdmin.peran }), { jenis: "Pengaturan", teks: `${me} mengundang admin ${nama}` });
                toast(`Undangan dikirim ke ${email}`);
                setAdding(false);
                setNewAdmin({ nama: "", email: "", peran: "Verifikator" });
              }}
            >
              Kirim undangan
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="aNama">Nama</FieldLabel>
            <input id="aNama" className={adminInput} value={newAdmin.nama} onChange={(e) => setNewAdmin({ ...newAdmin, nama: e.target.value })} />
          </div>
          <div>
            <FieldLabel htmlFor="aEmail">Email</FieldLabel>
            <input id="aEmail" type="email" className={adminInput} value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
          </div>
          <div>
            <FieldLabel htmlFor="aPeran">Peran</FieldLabel>
            <select id="aPeran" className={adminInput} value={newAdmin.peran} onChange={(e) => setNewAdmin({ ...newAdmin, peran: e.target.value })}>
              <option>Verifikator</option>
              <option>Keuangan</option>
              <option>Analis data</option>
              <option>Moderator</option>
            </select>
          </div>
        </div>
      </AdminDialog>
    </>
  );
}
