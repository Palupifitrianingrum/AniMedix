/* Data contoh forum komunitas (Komunitas.png). */

export interface CommunityPost {
  id: string;
  authorInitials: string;
  authorName: string;
  text: string;
  time: string;
  tag: string;
}

export type CommentRole = "Peternak" | "Dokter Hewan";

export interface CommunityComment {
  id: string;
  authorInitials: string;
  authorName: string;
  role: CommentRole;
  text: string;
  time: string;
}

export const COMMUNITY_TAGS = [
  "#KesehatanTernak",
  "#PakanFermentasi",
  "#Vaksinasi",
  "#PeternakanModern",
];

export const STARTER_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorInitials: "AN",
    authorName: "Pak Arif Nugroho",
    text: "Bagaimana cara meningkatkan nafsu makan kambing setelah perjalanan jauh?",
    time: "2 jam lalu",
    tag: COMMUNITY_TAGS[0],
  },
  {
    id: "post-2",
    authorInitials: "SN",
    authorName: "Siti Nurhaliza",
    text: "Ada rekomendasi komposisi pakan fermentasi untuk sapi perah?",
    time: "4 jam lalu",
    tag: COMMUNITY_TAGS[1],
  },
  {
    id: "post-3",
    authorInitials: "BS",
    authorName: "Budi Santoso",
    text: "Jadwal vaksinasi apa saja yang sebaiknya rutin dilakukan?",
    time: "6 jam lalu",
    tag: COMMUNITY_TAGS[2],
  },
  {
    id: "post-4",
    authorInitials: "DW",
    authorName: "Dewi Wulandari",
    text: "Kandang panggung atau kandang lantai tanah, mana yang lebih cocok untuk domba di daerah lembap?",
    time: "Kemarin",
    tag: COMMUNITY_TAGS[3],
  },
];

/** Komentar awal per diskusi (id diskusi -> daftar komentar, urut terlama ke terbaru) */
export const STARTER_COMMENTS: Record<string, CommunityComment[]> = {
  "post-1": [
    {
      id: "c-1-1",
      authorInitials: "HS",
      authorName: "Haji Slamet",
      role: "Peternak",
      text: "Biarkan kambing istirahat dulu 2–3 jam di kandang yang tenang, baru ditawari pakan. Kalau langsung dipaksa makan biasanya malah makin stres.",
      time: "1 jam lalu",
    },
    {
      id: "c-1-2",
      authorInitials: "PF",
      authorName: "drh. Palupi Fitria",
      role: "Dokter Hewan",
      text: "Perjalanan jauh sering membuat rumen kambing 'mogok' karena stres. Beri air minum bersih (boleh dicampur sedikit gula merah), hijauan segar yang disukai, dan hindari konsentrat berlebih di hari pertama. Kalau lebih dari 24 jam tetap tidak mau makan atau perut kembung, segera hubungi dokter hewan.",
      time: "1 jam lalu",
    },
    {
      id: "c-1-3",
      authorInitials: "RW",
      authorName: "Rina Wulandari",
      role: "Peternak",
      text: "Saya biasa kasih daun lamtoro atau gamal sedikit-sedikit, biasanya cepat mau makan lagi. Terima kasih sarannya, Dok!",
      time: "45 menit lalu",
    },
    {
      id: "c-1-4",
      authorInitials: "AN",
      authorName: "Pak Arif Nugroho",
      role: "Peternak",
      text: "Terima kasih semuanya. Sudah saya coba kasih air gula merah dan hijauan segar, sore ini sudah mulai makan.",
      time: "20 menit lalu",
    },
  ],
  "post-2": [
    {
      id: "c-2-1",
      authorInitials: "TS",
      authorName: "Tri Suharto",
      role: "Peternak",
      text: "Saya pakai campuran tebon jagung cacah, ampas tahu, dedak, dan sedikit molases. Difermentasi sekitar 3 minggu. Sapi perah saya suka dan susunya stabil.",
      time: "3 jam lalu",
    },
    {
      id: "c-2-2",
      authorInitials: "PF",
      authorName: "drh. Palupi Fitria",
      role: "Dokter Hewan",
      text: "Poin penting: ubah pakan secara bertahap selama 7–10 hari dan tetap sediakan hijauan segar. Komposisi persisnya bergantung pada produksi susu dan fase laktasi, jadi sebaiknya dikonsultasikan. Artikel 'Formula Silase Jagung & Pakan Fermentasi' di Blog Edukasi bisa jadi titik awal.",
      time: "2 jam lalu",
    },
    {
      id: "c-2-3",
      authorInitials: "SN",
      authorName: "Siti Nurhaliza",
      role: "Peternak",
      text: "Terima kasih Pak Tri dan Dok Palupi, saya coba mulai dari porsi kecil dulu.",
      time: "1 jam lalu",
    },
  ],
  "post-3": [
    {
      id: "c-3-1",
      authorInitials: "PF",
      authorName: "drh. Palupi Fitria",
      role: "Dokter Hewan",
      text: "Secara umum: vaksin enterotoksemia dan antraks (di daerah endemis), vaksin PMK sesuai program pemerintah, serta obat cacing berkala sesuai hasil cek tinja. Jadwal detailnya bisa dilihat di panduan imunisasi pada Blog Edukasi, tetapi tetap ikuti petunjuk produk dan petugas setempat.",
      time: "5 jam lalu",
    },
    {
      id: "c-3-2",
      authorInitials: "HS",
      authorName: "Haji Slamet",
      role: "Peternak",
      text: "Saya catat semua tanggal vaksin di rekam medis ternak supaya tidak lupa ulangannya.",
      time: "4 jam lalu",
    },
  ],
  "post-4": [
    {
      id: "c-4-1",
      authorInitials: "TS",
      authorName: "Tri Suharto",
      role: "Peternak",
      text: "Di tempat saya yang lembap, kandang panggung jauh lebih nyaman. Lantai cepat kering dan kotoran jatuh ke bawah, jadi kasus kuku busuk berkurang.",
      time: "20 jam lalu",
    },
    {
      id: "c-4-2",
      authorInitials: "PF",
      authorName: "drh. Palupi Fitria",
      role: "Dokter Hewan",
      text: "Setuju, kandang panggung lebih ideal untuk daerah lembap. Pastikan celah lantai tidak terlalu lebar agar kuku tidak terjepit, dan bersihkan kolong secara rutin.",
      time: "18 jam lalu",
    },
  ],
};
