/*
 * Data contoh portal admin. Dibuat otomatis lalu disimpan di localStorage
 * (lihat store/useAdminStore.ts). Ganti dengan panggilan API saat backend siap.
 */
import { DAY_MS, rp } from "@/lib/format";

export type VetStatus = "menunggu" | "revisi" | "disetujui" | "ditolak";
export type UserRole = "Peternak" | "Koperasi" | "Dokter hewan";
export type UserStatus = "Aktif" | "Ditangguhkan";
export type TrxStatus = "Lunas" | "Menunggu" | "Kedaluwarsa" | "Dikembalikan";
export type Risk = "Rendah" | "Sedang" | "Tinggi";
export type ScanStatus = "Baru" | "Ditinjau" | "Diteruskan";
export type LogRole = "Peternak" | "Dokter hewan" | "Admin";

export interface Vet {
  id: string;
  nama: string;
  str: string;
  sip: string;
  kota: string;
  tgl: string;
  status: VetStatus;
  spesialis: string;
  pengalaman: string;
  hp: string;
  alasan?: string;
  catatan?: string;
}

export interface AppUser {
  id: string;
  nama: string;
  peran: UserRole;
  kontak: string;
  wilayah: string;
  ternak: number;
  status: UserStatus;
  gabung: string;
}

export interface Consultation {
  id: string;
  tgl: string;
  peternak: string;
  dokter: string;
  topik: string;
  durasi: number;
  tarif: number;
  status: TrxStatus;
  cair: boolean;
}

export interface Scan {
  id: string;
  ternak: string;
  pemilik: string;
  wilayah: string;
  deteksi: string;
  yakin: number;
  risiko: Risk;
  status: ScanStatus;
  saran: string;
  ts: number;
  ke?: string;
}

export interface ActivityLog {
  ts: number;
  peran: LogRole;
  jenis: string;
  teks: string;
}

export interface AdminNotif {
  id: number;
  t: string;
  s: string;
  unread: boolean;
}

export interface AdminAccount {
  nama: string;
  email: string;
  peran: string;
}

export interface AdminSettings {
  tarif: number;
  durasi: number;
  komisi: number;
  bayar: number;
  verif: boolean;
  aiMin: number;
  aiFlag: boolean;
  aiWabah: number;
  notif: { verif: boolean; bayar: boolean; wabah: boolean; email: boolean };
  profil: { nama: string; email: string };
}

export interface AdminData {
  vets: Vet[];
  users: AppUser[];
  konsultasi: Consultation[];
  scans: Scan[];
  logs: ActivityLog[];
  notifs: AdminNotif[];
  admins: AdminAccount[];
  settings: AdminSettings;
}

export const DEFAULT_SETTINGS: AdminSettings = {
  tarif: 35000,
  durasi: 30,
  komisi: 80,
  bayar: 15,
  verif: true,
  aiMin: 70,
  aiFlag: true,
  aiWabah: 2,
  notif: { verif: true, bayar: true, wabah: true, email: false },
  profil: { nama: "Admin Utama", email: "admin@animedix.id" },
};

export function seedAdminData(now: number = Date.now()): AdminData {
  let sd = 11;
  const rnd = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const iso = (d: number) => new Date(now - d * DAY_MS).toISOString().slice(0, 10);

  const vets: Vet[] = (
    [
      ["V-101", "drh. Palupi Fitria", "STR-3317-0452", "SIP-DIY/2024/118", "Sleman, DIY", 2, "menunggu", "Ruminansia (sapi, kambing)", "7 tahun", "0812-3456-7801"],
      ["V-102", "drh. Bagus Hendrawan", "STR-3301-1190", "SIP-JTG/2023/902", "Magelang, Jateng", 3, "menunggu", "Sapi perah", "5 tahun", "0813-7788-2200"],
      ["V-103", "drh. Intan Maharani", "STR-3510-0873", "SIP-JBR/2025/044", "Garut, Jabar", 5, "menunggu", "Domba & kambing", "3 tahun", "0857-1122-9034"],
      ["V-104", "drh. Yoga Prasetya", "STR-3299-0611", "SIP-JTM/2022/771", "Malang, Jatim", 7, "menunggu", "Unggas & ruminansia", "9 tahun", "0821-9900-4417"],
      ["V-098", "drh. Mega Anjani", "STR-3411-0287", "SIP-BLI/2025/019", "Badung, Bali", 9, "revisi", "Sapi Bali", "4 tahun", "0819-3344-5566"],
      ["V-095", "drh. Rina Kusumawati", "STR-3188-0230", "SIP-DIY/2022/067", "Bantul, DIY", 14, "disetujui", "Sapi potong", "11 tahun", "0878-5566-1203"],
      ["V-090", "drh. Doni Saputra", "STR-3120-0919", "SIP-LPG/2021/310", "Lampung Tengah", 21, "disetujui", "Sapi & kerbau", "8 tahun", "0852-3300-7741"],
      ["V-087", "drh. Sari Wulandari", "STR-3002-0145", "SIP-JBR/2020/208", "Bandung Barat", 24, "disetujui", "Domba Garut", "6 tahun", "0811-2299-5586"],
      ["V-084", "drh. Wirawan Adi", "STR-3066-0732", "SIP-JTM/2021/455", "Surabaya, Jatim", 28, "disetujui", "Sapi perah", "10 tahun", "0822-6677-1900"],
      ["V-081", "Andi Firmansyah", "STR-0000-0000", "-", "Makassar, Sulsel", 30, "ditolak", "-", "-", "0896-1100-2233"],
    ] as const
  ).map((r) => ({
    id: r[0],
    nama: r[1],
    str: r[2],
    sip: r[3],
    kota: r[4],
    tgl: iso(r[5]),
    status: r[6] as VetStatus,
    spesialis: r[7],
    pengalaman: r[8],
    hp: r[9],
    ...(r[6] === "ditolak" ? { alasan: "Nomor STR tidak ditemukan di data KKHI" } : {}),
    ...(r[6] === "revisi" ? { catatan: "Scan SIP buram, mohon unggah ulang." } : {}),
  }));

  const users: AppUser[] = (
    [
      ["Pak Prabowo", "Peternak", "prabowo@email.com", "Sleman, DIY", 12, "Aktif", 120],
      ["Haji Slamet", "Peternak", "0812-4455-9001", "Magelang, Jateng", 48, "Aktif", 98],
      ["Rina Wulandari", "Peternak", "rina.w@email.com", "Bandung Barat, Jabar", 26, "Aktif", 90],
      ["Prabowo Subianto", "Peternak", "0857-9012-3345", "Bogor, Jabar", 9, "Aktif", 77],
      ["Budi Santoso", "Peternak", "budi.s@email.com", "Boyolali, Jateng", 140, "Ditangguhkan", 70],
      ["Siti Aminah", "Peternak", "0813-2201-7788", "Pati, Jateng", 15, "Aktif", 65],
      ["Slamet Riyadi", "Peternak", "0819-8800-1122", "Klaten, Jateng", 33, "Aktif", 60],
      ["Wahyu Hidayat", "Peternak", "wahyu.h@email.com", "Garut, Jabar", 21, "Aktif", 52],
      ["Ketut Arsana", "Peternak", "0878-1234-9087", "Badung, Bali", 18, "Aktif", 47],
      ["Maria Goreti", "Peternak", "0821-4411-6633", "Kupang, NTT", 64, "Aktif", 40],
      ["Yusuf Maulana", "Peternak", "yusuf.m@email.com", "Malang, Jatim", 37, "Aktif", 33],
      ["Dewi Lestari", "Peternak", "dewi.l@email.com", "Bantul, DIY", 11, "Aktif", 28],
      ["Agus Salim", "Peternak", "0856-7788-3300", "Lampung Tengah", 52, "Aktif", 21],
      ["Nur Hasanah", "Peternak", "nur.h@email.com", "Probolinggo, Jatim", 29, "Ditangguhkan", 15],
      ["Koperasi Ternak Makmur", "Koperasi", "info@ternakmakmur.id", "Sleman, DIY", 820, "Aktif", 200],
      ["KUD Sido Rukun", "Koperasi", "0274-889-120", "Kulon Progo, DIY", 410, "Aktif", 180],
      ["KUD Sumber Rejeki", "Koperasi", "kud.sr@email.com", "Boyolali, Jateng", 655, "Aktif", 150],
      ["drh. Rina Kusumawati", "Dokter hewan", "rina.k@vet.id", "Bantul, DIY", 0, "Aktif", 14],
      ["drh. Doni Saputra", "Dokter hewan", "doni.s@vet.id", "Lampung Tengah", 0, "Aktif", 21],
      ["drh. Sari Wulandari", "Dokter hewan", "sari.w@vet.id", "Bandung Barat", 0, "Aktif", 24],
      ["drh. Wirawan Adi", "Dokter hewan", "wirawan@vet.id", "Surabaya, Jatim", 0, "Aktif", 28],
    ] as const
  ).map((r, i) => ({
    id: "U-" + String(i + 1).padStart(3, "0"),
    nama: r[0],
    peran: r[1] as UserRole,
    kontak: r[2],
    wilayah: r[3],
    ternak: r[4],
    status: r[5] as UserStatus,
    gabung: iso(r[6]),
  }));

  const peternak = users.filter((u) => u.peran === "Peternak").map((u) => u.nama);
  const dokter = vets.filter((v) => v.status === "disetujui").map((v) => v.nama);
  const topik = ["Sapi tidak mau makan", "Luka pada kuku", "Kambing berkutu", "Diare pada domba", "Produksi susu menurun", "Demam dan lesu", "Bulu rontok"];

  const konsRaw: { off: number; status: TrxStatus; peternak: string; dokter: string; topik: string }[] = [];
  for (let i = 0; i < 36; i++) {
    const off = Math.floor(rnd() * 14);
    const r = rnd();
    let status: TrxStatus = r < 0.7 ? "Lunas" : r < 0.82 ? "Menunggu" : r < 0.93 ? "Kedaluwarsa" : "Dikembalikan";
    if (status === "Menunggu" && off > 0) status = "Kedaluwarsa";
    konsRaw.push({ off, status, peternak: pick(peternak), dokter: pick(dokter), topik: pick(topik) });
  }
  konsRaw.sort((a, b) => b.off - a.off);
  const konsultasi: Consultation[] = konsRaw.map((k, i) => ({
    id: "TRX-" + (1001 + i),
    tgl: iso(k.off),
    peternak: k.peternak,
    dokter: k.dokter,
    topik: k.topik,
    durasi: DEFAULT_SETTINGS.durasi,
    tarif: DEFAULT_SETTINGS.tarif,
    status: k.status,
    cair: k.status === "Lunas" && k.off >= 5,
  }));

  const sc: [string, string, string, string, number, Risk, ScanStatus, string][] = [
    ["Kambing Etawa", "Prabowo Subianto", "Bogor, Jabar", "Penyakit kudis", 96, "Rendah", "Ditinjau", "Pisahkan kambing yang sakit, beri antiparasit (misalnya ivermectin) sesuai dosis dokter, dan bersihkan kandang secara menyeluruh."],
    ["Sapi Limosin", "Haji Slamet", "Magelang, Jateng", "Gejala awal PMK", 91, "Tinggi", "Baru", "Isolasi segera, jangan pindahkan ternak, dan hubungi dokter hewan serta dinas peternakan setempat."],
    ["Domba Garut", "Rina Wulandari", "Bandung Barat, Jabar", "Orf (ektima)", 88, "Sedang", "Ditinjau", "Pisahkan domba, bersihkan luka di mulut dengan antiseptik, dan beri pakan lunak."],
    ["Sapi Friesian", "Pak Prabowo", "Sleman, DIY", "Mastitis subklinis", 94, "Sedang", "Diteruskan", "Lakukan uji California Mastitis Test dan konsultasikan antibiotik dengan dokter hewan."],
    ["Kambing PE", "Siti Aminah", "Pati, Jateng", "Sehat", 98, "Rendah", "Ditinjau", "Tidak ada gejala penyakit. Lanjutkan jadwal vaksin dan pemantauan rutin."],
    ["Sapi Brahman", "Budi Santoso", "Boyolali, Jateng", "Pembengkakan kuku", 83, "Sedang", "Baru", "Bersihkan kuku, periksa luka dan benda asing, dan jaga lantai kandang tetap kering."],
    ["Sapi Limosin", "Haji Slamet", "Magelang, Jateng", "Gejala awal PMK", 89, "Tinggi", "Baru", "Isolasi segera, jangan pindahkan ternak, dan hubungi dokter hewan serta dinas peternakan setempat."],
    ["Sapi PO", "Agus Salim", "Lampung Tengah", "Gejala awal PMK", 86, "Tinggi", "Baru", "Isolasi segera dan lapor ke petugas kesehatan hewan terdekat."],
    ["Kambing Kacang", "Maria Goreti", "Kupang, NTT", "Cacingan", 79, "Sedang", "Ditinjau", "Berikan obat cacing sesuai berat badan dan perbaiki kebersihan pakan."],
    ["Domba Garut", "Wahyu Hidayat", "Garut, Jabar", "Penyakit kudis", 92, "Rendah", "Ditinjau", "Pisahkan domba, beri obat antiparasit, dan bersihkan kandang."],
    ["Sapi Bali", "Ketut Arsana", "Badung, Bali", "Diare", 81, "Sedang", "Baru", "Beri cairan elektrolit, periksa kualitas pakan dan air minum, dan pantau 24 jam."],
    ["Sapi Simental", "Yusuf Maulana", "Malang, Jatim", "Mastitis subklinis", 90, "Sedang", "Ditinjau", "Periksa kebersihan perah dan konsultasikan terapi dengan dokter hewan."],
  ];
  const scans: Scan[] = sc.map((r, i) => ({
    id: "S-" + (2041 - i),
    ternak: r[0],
    pemilik: r[1],
    wilayah: r[2],
    deteksi: r[3],
    yakin: r[4],
    risiko: r[5],
    status: r[6],
    saran: r[7],
    ts: now - (i * 1.6 + 0.3) * 3_600_000,
  }));

  const logs: ActivityLog[] = [];
  const ternakL = ["sapi Limosin", "kambing Etawa", "domba Garut", "sapi Friesian", "kambing PE"];
  for (let i = 0; i < 34; i++) {
    const ts = now - (i * 2.4 + rnd() * 2) * 3_600_000;
    const r = rnd();
    const pn = pick(peternak);
    const dk = pick(dokter);
    if (r < 0.3) logs.push({ ts, peran: "Peternak", jenis: "Scan", teks: `${pn} memindai ${pick(ternakL)}` });
    else if (r < 0.45) logs.push({ ts, peran: "Peternak", jenis: "Pembayaran", teks: `${pn} membayar konsultasi dengan ${dk}` });
    else if (r < 0.6) logs.push({ ts, peran: "Peternak", jenis: "Rekam medis", teks: `${pn} menambahkan rekam medis ${pick(ternakL)}` });
    else if (r < 0.72) logs.push({ ts, peran: "Peternak", jenis: "Login", teks: `${pn} masuk ke aplikasi` });
    else if (r < 0.86) logs.push({ ts, peran: "Dokter hewan", jenis: "Konsultasi", teks: `${dk} membalas chat ${pn}` });
    else if (r < 0.94) logs.push({ ts, peran: "Dokter hewan", jenis: "Pembayaran", teks: `${dk} menerima komisi ${rp((DEFAULT_SETTINGS.tarif * DEFAULT_SETTINGS.komisi) / 100)}` });
    else logs.push({ ts, peran: "Admin", jenis: "Verifikasi", teks: `Admin Utama menyetujui ${dk}` });
  }
  logs.unshift({ ts: now - 25 * 60_000, peran: "Dokter hewan", jenis: "Pengguna", teks: "drh. Palupi Fitria mendaftar sebagai mitra" });

  const notifs: AdminNotif[] = [
    { id: 1, t: "4 dokter hewan menunggu verifikasi", s: "Baru saja", unread: true },
    { id: 2, t: "Dua kasus gejala awal PMK di Magelang", s: "1 jam lalu", unread: true },
    { id: 3, t: "Beberapa transaksi konsultasi kedaluwarsa", s: "3 jam lalu", unread: true },
  ];

  const admins: AdminAccount[] = [
    { nama: "Admin Utama", email: "admin@animedix.id", peran: "Super admin" },
    { nama: "Dewi Anggraini", email: "dewi@animedix.id", peran: "Verifikator" },
    { nama: "Rizky Ramadhan", email: "rizky@animedix.id", peran: "Keuangan" },
    { nama: "Maya Putri", email: "maya@animedix.id", peran: "Analis data" },
  ];

  return { vets, users, konsultasi, scans, logs, notifs, admins, settings: structuredClone(DEFAULT_SETTINGS) };
}
