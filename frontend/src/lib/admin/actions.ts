import type { AdminData, Vet, VetStatus } from "./seed";
import type { Tone } from "@/components/admin/AdminUI";

/* Aturan bisnis kecil yang dipakai beberapa halaman admin. */

export const VET_STATUS: Record<VetStatus, [string, Tone]> = {
  menunggu: ["Menunggu", "yellow"],
  revisi: ["Perlu dokumen", "orange"],
  disetujui: ["Disetujui", "green"],
  ditolak: ["Ditolak", "red"],
};

const VERB: Record<Exclude<VetStatus, "menunggu">, string> = {
  disetujui: "menyetujui",
  ditolak: "menolak",
  revisi: "meminta dokumen tambahan dari",
};

/** Ubah status dokter. Dokter yang disetujui otomatis masuk daftar pengguna. */
export function applyVetStatus(d: AdminData, vetId: string, status: Exclude<VetStatus, "menunggu">, note?: string) {
  const v = d.vets.find((x) => x.id === vetId);
  if (!v) return "";
  v.status = status;
  if (status === "ditolak") v.alasan = note;
  if (status === "revisi") v.catatan = note;
  if (status === "disetujui" && !d.users.some((u) => u.nama === v.nama)) {
    d.users.push({
      id: "U-" + String(d.users.length + 1).padStart(3, "0"),
      nama: v.nama,
      peran: "Dokter hewan",
      kontak: v.hp,
      wilayah: v.kota,
      ternak: 0,
      status: "Aktif",
      gabung: new Date().toISOString().slice(0, 10),
    });
  }
  return `${d.settings.profil.nama} ${VERB[status]} ${v.nama}`;
}

export const vetDocs = (v: Vet) =>
  v.status === "ditolak" ? ["KTP"] : ["Scan STR", "Surat izin praktik (SIP)", "Ijazah profesi dokter hewan"];
