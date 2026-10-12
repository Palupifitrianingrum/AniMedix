/* Data artikel Blog Edukasi. Dipakai landing page (/), daftar (/blog), dan detail (/blog/[slug]). */

export type ArticleIcon = "heart" | "utensils" | "shield" | "bug" | "home" | "baby";
export type ArticleTone = "olive" | "teal" | "warning" | "neutral";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "warning" | "info"; title: string; text: string }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] };

export interface Article {
  slug: string;
  category: string;
  tone: ArticleTone;
  icon: ArticleIcon;
  /** gradient Tailwind untuk header kartu */
  gradient: string;
  /** tanggal terbit (ISO) */
  date: string;
  readMinutes: number;
  title: string;
  desc: string;
  actionText: string;
  author: string;
  authorRole: string;
  /** tampil di landing page */
  featured?: boolean;
  /** hashtag topik komunitas yang relevan */
  communityTag?: string;
  /** judul tabel yang bisa diunduh sebagai CSV */
  downloadableTable?: boolean;
  content: ArticleBlock[];
}

const BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** "2026-09-28" -> "28 September 2026" (format tetap supaya server & browser sama) */
export function formatArticleDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${BULAN_PANJANG[m - 1]} ${y}`;
}

export const ARTICLES: Article[] = [
  {
    slug: "gejala-awal-pmk-sapi-potong",
    category: "Kesehatan Ternak",
    tone: "olive",
    icon: "heart",
    gradient: "from-olive-wash to-[#e8efe0]",
    date: "2026-09-28",
    readMinutes: 5,
    title: "Gejala Awal Penyakit Mulut & Kuku (PMK) pada Sapi Potong",
    desc: "Langkah tanggap darurat yang wajib dilakukan peternak saat mendapati hewan mengeluarkan busa berlebih dan luka lepuh di kuku.",
    actionText: "Pelajari Penanganan",
    author: "Tim Medis AniMedix",
    authorRole: "Disusun bersama dokter hewan mitra",
    featured: true,
    communityTag: "#KesehatanTernak",
    content: [
      {
        type: "p",
        text: "Penyakit Mulut dan Kuku (PMK) adalah penyakit virus yang sangat menular pada hewan berkuku genap seperti sapi, kerbau, kambing, domba, dan babi. Penularannya cepat, sehingga peternak perlu mengenali tanda awalnya dan bertindak di jam-jam pertama.",
      },
      { type: "h2", text: "Tanda awal yang perlu diwaspadai" },
      {
        type: "ul",
        items: [
          "Demam tinggi dan hewan tampak lesu, nafsu makan turun mendadak.",
          "Air liur keluar berlebihan dan berbusa dari mulut.",
          "Lepuh atau luka merah di lidah, gusi, bibir, dan moncong.",
          "Luka lepuh di sela kuku atau tepi tracak, membuat hewan pincang dan enggan berdiri.",
          "Pada sapi perah, produksi susu turun drastis.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Jangan tunda melapor",
        text: "Begitu ada dugaan PMK, segera hubungi petugas kesehatan hewan atau dinas peternakan setempat. PMK termasuk penyakit hewan menular yang harus dilaporkan.",
      },
      { type: "h2", text: "Langkah pertama di kandang" },
      {
        type: "ol",
        items: [
          "Pisahkan hewan yang bergejala ke kandang isolasi, jauh dari kawanan sehat.",
          "Hentikan keluar-masuk ternak, pakan, dan orang dari kandang yang terduga terkena.",
          "Bersihkan kandang dan peralatan dengan disinfektan yang dianjurkan petugas kesehatan hewan setempat.",
          "Sediakan air minum bersih dan pakan lunak yang mudah dikunyah, misalnya rumput muda atau bubur dedak.",
          "Bersihkan luka di kuku dengan air bersih dan jaga alas kandang tetap kering.",
          "Gunakan alas kaki dan pakaian khusus kandang, lalu cuci tangan dan sepatu setelah menangani hewan sakit.",
        ],
      },
      { type: "h2", text: "Pengobatan dan pemulihan" },
      {
        type: "p",
        text: "Tidak ada obat yang membunuh virus PMK. Pengobatan bersifat suportif: dokter hewan dapat memberi obat untuk meredakan demam dan nyeri, vitamin, serta antibiotik untuk mencegah infeksi sekunder pada luka. Jangan menyuntikkan obat sendiri tanpa arahan dokter hewan.",
      },
      {
        type: "p",
        text: "Hewan yang pulih tetap bisa menularkan virus untuk beberapa waktu. Jangan menjual atau memindahkan ternak yang pernah sakit sebelum petugas menyatakan aman, dan ikuti program vaksinasi PMK dari pemerintah di wilayah Anda.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Butuh bantuan cepat?",
        text: "Foto bagian mulut atau kuku hewan lewat fitur Scan AniMedix, lalu teruskan hasilnya ke dokter hewan melalui Tanya Dokter.",
      },
    ],
  },
  {
    slug: "formula-silase-jagung-pakan-fermentasi-kambing-etawa",
    category: "Nutrisi & Pakan",
    tone: "teal",
    icon: "utensils",
    gradient: "from-teal-tint to-[#d7f1ee]",
    date: "2026-09-22",
    readMinutes: 4,
    title: "Formula Silase Jagung & Pakan Fermentasi Kambing Etawa",
    desc: "Cara praktis memproduksi konsentrat tinggi protein dengan bahan baku lokal murah untuk memacu bobot kambing perah dan potong.",
    actionText: "Lihat Resep Pakan",
    author: "Tim Nutrisi AniMedix",
    authorRole: "Disusun bersama praktisi pakan ternak",
    featured: true,
    communityTag: "#PakanFermentasi",
    content: [
      {
        type: "p",
        text: "Silase dan pakan fermentasi membantu peternak menyimpan hijauan saat panen melimpah, sehingga kambing tetap mendapat pakan bergizi di musim kemarau. Bahan bakunya mudah ditemukan: batang dan daun jagung, dedak, ampas tahu, dan molases.",
      },
      { type: "h2", text: "Silase jagung: bahan dan cara membuat" },
      {
        type: "ul",
        items: [
          "Tebon jagung (batang dan daun) yang dipanen saat bulir mulai terisi, dicacah 2–5 cm.",
          "Dedak halus sekitar 3–5% dari berat hijauan sebagai penyerap air.",
          "Molases sekitar 2–3% sebagai sumber gula bagi bakteri asam laktat.",
          "Starter silase atau probiotik, dosis mengikuti petunjuk kemasan.",
        ],
      },
      {
        type: "ol",
        items: [
          "Layukan cacahan jagung beberapa jam hingga kadar airnya sekitar 60–65%. Jika diperas, tangan basah tetapi air tidak menetes.",
          "Campur dedak, molases yang sudah dilarutkan, dan starter hingga merata.",
          "Masukkan ke drum atau kantong plastik tebal lapis demi lapis, padatkan agar udara keluar.",
          "Tutup rapat sehingga kedap udara dan simpan di tempat teduh.",
          "Biarkan fermentasi sekitar 3 minggu sebelum dibuka.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Cara menilai silase yang berhasil",
        text: "Silase yang baik berbau asam segar seperti tape dan berwarna hijau kekuningan. Buang bagian yang berjamur, berlendir, atau berbau busuk dan jangan diberikan ke ternak.",
      },
      { type: "h2", text: "Contoh formula pakan fermentasi" },
      {
        type: "table",
        caption: "Komposisi untuk 100 kg bahan segar (sesuaikan dengan bahan yang tersedia)",
        head: ["Bahan", "Porsi", "Fungsi"],
        rows: [
          ["Tebon jagung cacah", "65 kg", "Serat dan energi dasar"],
          ["Dedak padi", "15 kg", "Energi dan penyerap air"],
          ["Ampas tahu", "15 kg", "Sumber protein"],
          ["Molases", "3 kg", "Gula untuk fermentasi"],
          ["Garam dan mineral", "1 kg", "Kebutuhan mineral"],
          ["Starter / probiotik", "1 kg", "Memulai fermentasi"],
        ],
      },
      { type: "h2", text: "Tips pemberian" },
      {
        type: "ul",
        items: [
          "Kenalkan pakan baru bertahap selama 7–10 hari agar rumen kambing menyesuaikan diri.",
          "Tetap sediakan hijauan segar dan air minum bersih setiap hari.",
          "Atur takaran sesuai bobot dan fase hidup kambing, dan tanyakan ke dokter hewan atau penyuluh untuk kambing bunting atau menyusui.",
          "Simpan silase yang sudah dibuka di tempat teduh dan habiskan dalam beberapa hari.",
        ],
      },
    ],
  },
  {
    slug: "panduan-imunisasi-kawanan-domba-kambing",
    category: "Jadwal Vaksinasi",
    tone: "warning",
    icon: "shield",
    gradient: "from-[#fff7ed] to-[#fed7aa]/50",
    date: "2026-09-15",
    readMinutes: 6,
    title: "Panduan Imunisasi Berkala Kawanan Domba & Kambing",
    desc: "Tabel lengkap waktu pemberian vaksin antraks, enterotoxemia, dan vitamin penunjang dari anakan (cempe) hingga usia kawin.",
    actionText: "Unduh Tabel Vaksin",
    author: "Tim Medis AniMedix",
    authorRole: "Disusun bersama dokter hewan mitra",
    featured: true,
    communityTag: "#Vaksinasi",
    downloadableTable: true,
    content: [
      {
        type: "p",
        text: "Vaksinasi adalah cara paling murah untuk menjaga kawanan tetap sehat. Satu kali wabah dapat menghabiskan keuntungan berbulan-bulan, sedangkan vaksin hanya butuh jadwal yang tertib.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Jadwal ini bersifat umum",
        text: "Waktu dan jumlah dosis dapat berbeda menurut merek vaksin, kondisi daerah, dan status vaksinasi induk. Selalu ikuti petunjuk di kemasan dan konfirmasikan dengan dokter hewan atau petugas dinas setempat sebelum memvaksin.",
      },
      { type: "h2", text: "Tabel jadwal vaksinasi" },
      {
        type: "table",
        caption: "Gambaran umum jadwal vaksinasi dan perawatan rutin",
        head: ["Usia / Kondisi", "Vaksin atau perawatan", "Catatan"],
        rows: [
          ["Cempe baru lahir", "Pastikan minum kolostrum", "Dalam beberapa jam pertama setelah lahir"],
          ["Sekitar 4–8 minggu", "Enterotoksemia (dosis awal)", "Booster 3–4 minggu kemudian"],
          ["Mulai sekitar 3 bulan", "Antraks", "Di daerah endemis; ulangi setahun sekali"],
          ["Sesuai program pemerintah", "PMK", "Ikuti jadwal dan petugas vaksinator setempat"],
          ["Setiap 3–4 bulan atau sesuai hasil cek tinja", "Obat cacing", "Tentukan jenis obat bersama dokter hewan"],
          ["Induk bunting, sekitar 4 minggu sebelum melahirkan", "Booster enterotoksemia", "Membantu antibodi turun ke cempe lewat kolostrum"],
          ["Ternak yang akan dikawinkan", "Pemeriksaan kesehatan dan vitamin penunjang", "Pastikan bobot dan kondisi tubuh ideal"],
          ["Ternak baru datang", "Karantina dan pemeriksaan", "Pisahkan minimal 14 hari sebelum bergabung dengan kawanan"],
        ],
      },
      { type: "h2", text: "Sebelum dan sesudah vaksinasi" },
      {
        type: "ul",
        items: [
          "Vaksinasi hanya pada ternak yang sehat. Tunda jika hewan sedang demam, lemas, atau cacingan berat.",
          "Simpan vaksin dalam suhu dingin sesuai label dan jangan sampai terkena sinar matahari langsung.",
          "Gunakan jarum dan alat suntik baru untuk setiap hewan agar penyakit tidak berpindah.",
          "Amati hewan 1–2 hari setelahnya. Bengkak ringan di lokasi suntikan umum terjadi, tetapi segera hubungi dokter hewan jika hewan sangat lemas atau sulit bernapas.",
          "Catat tanggal vaksin dan nomor batch di rekam medis ternak AniMedix supaya jadwal ulangan tidak terlewat.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Unduh tabelnya",
        text: "Tabel jadwal di atas bisa diunduh sebagai file CSV dan dibuka di Excel atau Google Sheets untuk dicetak dan ditempel di kandang.",
      },
    ],
  },
  {
    slug: "mengenali-dan-mencegah-cacingan-kambing-domba",
    category: "Kesehatan Ternak",
    tone: "olive",
    icon: "bug",
    gradient: "from-[#f0fdf4] to-[#dcfce7]",
    date: "2026-10-08",
    readMinutes: 5,
    title: "Mengenali dan Mencegah Cacingan pada Kambing & Domba",
    desc: "Kenali tanda cacingan sejak dini, cara mengecek kelopak mata, dan kebiasaan angon yang menekan risiko infeksi ulang.",
    actionText: "Baca Panduan",
    author: "Tim Medis AniMedix",
    authorRole: "Disusun bersama dokter hewan mitra",
    communityTag: "#KesehatanTernak",
    content: [
      {
        type: "p",
        text: "Cacingan, terutama oleh cacing lambung (Haemonchus), adalah penyebab umum kambing dan domba kurus, lemas, dan mati di peternakan rakyat. Anakan dan induk menyusui paling rentan.",
      },
      { type: "h2", text: "Tanda-tanda cacingan" },
      {
        type: "ul",
        items: [
          "Bulu kusam, badan kurus meskipun makan seperti biasa.",
          "Perut buncit pada anakan dan diare, atau kotoran yang lembek berulang.",
          "Pembengkakan di bawah dagu (\"bottle jaw\") pada kasus berat.",
          "Selaput lendir mata dan gusi tampak pucat karena kekurangan darah.",
        ],
      },
      { type: "h2", text: "Cek cepat kelopak mata" },
      {
        type: "p",
        text: "Tarik kelopak mata bawah dengan hati-hati dan lihat warna selaput di baliknya. Merah muda segar berarti baik. Pink pucat hingga putih menandakan anemia dan hewan perlu segera diperiksa dokter hewan. Cek ini hanya penanda awal, bukan pengganti pemeriksaan tinja di laboratorium.",
      },
      { type: "h2", text: "Pencegahan di lapangan" },
      {
        type: "ol",
        items: [
          "Hindari mengangon terlalu pagi saat rumput masih berembun. Larva cacing banyak menempel di pucuk rumput basah.",
          "Rotasi padang gembala dan beri jeda istirahat lahan agar larva mati.",
          "Jangan biarkan kambing makan rumput terlalu dekat dengan tanah. Tinggikan palung atau gunakan rak pakan.",
          "Bersihkan kotoran kandang secara rutin dan keringkan lantai.",
          "Pisahkan anakan dari ternak dewasa saat memberi pakan jika memungkinkan.",
          "Lakukan pemeriksaan tinja berkala dan beri obat cacing sesuai hasil pemeriksaan serta resep dokter hewan.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Hindari obat cacing asal-asalan",
        text: "Pemberian obat dengan dosis yang tidak tepat atau terlalu sering dapat membuat cacing kebal. Tanyakan jenis obat, dosis, dan jadwalnya kepada dokter hewan.",
      },
    ],
  },
  {
    slug: "sanitasi-kandang-biosekuriti-peternak-rakyat",
    category: "Manajemen Kandang",
    tone: "neutral",
    icon: "home",
    gradient: "from-[#f8fafc] to-[#e2e8f0]",
    date: "2026-10-01",
    readMinutes: 4,
    title: "Sanitasi Kandang & Biosekuriti Sederhana untuk Peternak Rakyat",
    desc: "Langkah murah dan realistis untuk menjaga kandang tetap bersih dan memutus penularan penyakit antar ternak.",
    actionText: "Terapkan di Kandang",
    author: "Tim Medis AniMedix",
    authorRole: "Disusun bersama dokter hewan mitra",
    communityTag: "#PeternakanModern",
    content: [
      {
        type: "p",
        text: "Biosekuriti terdengar rumit, padahal intinya sederhana: mencegah penyakit masuk ke kandang dan mencegahnya menyebar di dalam kandang. Banyak langkahnya hanya butuh kebiasaan, bukan biaya besar.",
      },
      { type: "h2", text: "Rancang kandang yang mudah dibersihkan" },
      {
        type: "ul",
        items: [
          "Lantai kandang panggung dengan celah yang cukup agar kotoran jatuh dan lantai cepat kering.",
          "Atap yang menahan hujan dan ventilasi yang membuat udara bergerak tanpa angin langsung ke ternak.",
          "Palung pakan dan tempat minum yang dapat dibersihkan setiap hari.",
          "Kandang isolasi terpisah untuk ternak sakit dan ternak baru.",
        ],
      },
      { type: "h2", text: "Rutinitas harian dan mingguan" },
      {
        type: "table",
        head: ["Frekuensi", "Kegiatan"],
        rows: [
          ["Setiap hari", "Buang sisa pakan, bersihkan kotoran, ganti air minum, amati nafsu makan dan gerak ternak"],
          ["Setiap minggu", "Cuci palung dan tempat minum, semprot lantai dan dinding kandang, periksa kuku dan kulit"],
          ["Setiap bulan", "Cek atap dan sirkulasi udara, rapikan saluran pembuangan, bersihkan area sekitar kandang dari semak"],
          ["Saat ternak baru datang", "Karantina terpisah dan amati gejala sebelum disatukan dengan kawanan"],
        ],
      },
      { type: "h2", text: "Kebiasaan yang memutus penularan" },
      {
        type: "ul",
        items: [
          "Cuci tangan dan alas kaki sebelum masuk dan setelah keluar kandang, terutama setelah menyentuh ternak sakit.",
          "Batasi pengunjung, pedagang, dan kendaraan yang masuk area kandang.",
          "Pisahkan peralatan untuk kandang sehat dan kandang isolasi.",
          "Kelola kotoran dengan baik, misalnya dikomposkan jauh dari sumber air.",
          "Catat kejadian sakit dan kematian untuk membantu dokter hewan menelusuri penyebabnya.",
        ],
      },
    ],
  },
  {
    slug: "merawat-induk-bunting-dan-cempe-baru-lahir",
    category: "Manajemen Kandang",
    tone: "neutral",
    icon: "baby",
    gradient: "from-[#fdf4ff] to-[#f5d0fe]/50",
    date: "2026-09-24",
    readMinutes: 5,
    title: "Merawat Induk Bunting & Cempe Baru Lahir",
    desc: "Persiapan pakan, kandang beranak, dan perawatan 24 jam pertama agar cempe tumbuh sehat dan induk cepat pulih.",
    actionText: "Siapkan Kelahiran",
    author: "Tim Medis AniMedix",
    authorRole: "Disusun bersama dokter hewan mitra",
    communityTag: "#PeternakanModern",
    content: [
      {
        type: "p",
        text: "Masa kebuntingan kambing dan domba berlangsung sekitar lima bulan. Perawatan di akhir masa bunting dan beberapa hari setelah melahirkan sangat menentukan, karena sebagian besar kematian cempe terjadi pada masa ini.",
      },
      { type: "h2", text: "Dua bulan terakhir kebuntingan" },
      {
        type: "ul",
        items: [
          "Tambah kualitas pakan secara bertahap. Janin tumbuh paling cepat di akhir kebuntingan.",
          "Jaga kondisi tubuh induk agar tidak terlalu gemuk atau terlalu kurus.",
          "Pastikan vaksinasi dan obat cacing sesuai jadwal dari dokter hewan.",
          "Hindari mengangkut, mengejar, atau menempatkan induk berdesakan dengan ternak lain.",
        ],
      },
      { type: "h2", text: "Menyiapkan kandang beranak" },
      {
        type: "p",
        text: "Pindahkan induk ke kandang beranak sekitar satu minggu sebelum perkiraan lahir. Alasi dengan jerami atau sekam yang bersih dan kering, pastikan kandang hangat dan bebas dari angin langsung.",
      },
      { type: "h2", text: "24 jam pertama cempe" },
      {
        type: "ol",
        items: [
          "Bersihkan lendir di hidung dan mulut cempe agar bisa bernapas dengan lega.",
          "Biarkan induk menjilati cempe karena membantu menghangatkan dan merangsang peredaran darah.",
          "Celup pusar cempe dengan antiseptik yodium sesuai anjuran dokter hewan untuk mencegah infeksi.",
          "Pastikan cempe menyusu kolostrum dalam beberapa jam pertama. Ini sumber kekebalan utamanya.",
          "Jaga cempe tetap hangat, terutama saat malam dan musim hujan.",
          "Cek apakah plasenta induk sudah keluar dalam beberapa jam. Jika tertahan terlalu lama, hubungi dokter hewan.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Segera hubungi dokter hewan jika",
        text: "Induk mengejan lama tanpa ada kemajuan, cempe tidak mau menyusu, induk menolak anaknya, atau induk tampak lemas dan demam setelah melahirkan.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Artikel terbaru lebih dulu */
export function getArticlesByDate(): Article[] {
  return [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedArticles(): Article[] {
  return ARTICLES.filter((a) => a.featured);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticle(slug);
  const others = getArticlesByDate().filter((a) => a.slug !== slug);
  if (!current) return others.slice(0, limit);
  const sameCategory = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
