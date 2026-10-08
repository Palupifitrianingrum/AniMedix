# 📘 AniMedix — Panduan Arsitektur & Rekayasa Frontend (`guidline.md`)

Dokumen ini merupakan rangkuman hasil *brainstorming* arsitektur teknis, sistem navigasi, manajemen state, strategi *caching*, dan spesifikasi *reusable component library* untuk implementasi frontend **AniMedix**. Panduan ini berfokus pada **Role Peternak (Farmer)** dan mengacu pada 23 berkas *High-Fidelity (Hi-Fi) Wireframe* yang terdapat di direktori `wireframe/`.

---

## 1. 🎯 Ruang Lingkup & Fokus Pengembangan
* **Target Pengguna Saat Ini:** Peternak Hewan Ruminansia/Ternak (Role Peternak).
* **Tech Stack Utama:** 
  * **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
  * **Styling:** Tailwind CSS v4 (mengadopsi token dari [`design.md`](file:///home/lavvvet/AniMedix/docs/frontendguide/design.md)).
  * **Global Client State:** Zustand.
  * **Server State & Cache:** TanStack React Query v5.
  * **Icons:** Lucide React.
  * **Typography:** Google Fonts (`Jua` untuk Headings & `Jaldi` untuk Body).

---

## 2. 🗺️ Inventaris Layar & Pemetaan Routing (Next.js App Router)

Seluruh 23 gambar wireframe dipetakan ke dalam 4 pola layout (*Route Groups*):

```text
src/app/
├── layout.tsx                                 # Root Layout: Integrasi Google Fonts (Jua & Jaldi)
├── globals.css                              # Tailwind v4 @theme tokens
│
├── (marketing)/                             # Shell 1: Top Navbar Teal + Footer Gelap
│   ├── layout.tsx                           # Shared Header & Footer
│   ├── page.tsx                             # Frame.png (Landing Page Lengkap)
│   ├── dokter/page.tsx                      # Tanya Dokter.png (Katalog & Filter Dokter)
│   ├── klinik/
│   │   ├── page.tsx                         # Lokasi Klinik.png (Direktori & Filter Bertingkat)
│   │   └── [id]/page.tsx                    # Klinik Terdekat.png (Detail Klinik & Jadwal)
│   └── komunitas/page.tsx                   # Komunitas.png (Forum Diskusi Peternak)
│
├── (auth)/                                  # Shell 2: Centered Split-Card Layout
│   ├── login/page.tsx                       # Login.png (Welcome Back! + Form Masuk)
│   └── register/page.tsx                    # Register.png & Register#2.png (Multi-Step Form)
│
├── (peternak)/                              # Shell 3: Farmer Dashboard Layout (Shared Sidebar)
│   ├── layout.tsx                           # Sidebar Tetap (Profil Prabowo) + Content Shell
│   ├── profil/page.tsx                      # Profile.png (Bio & Kartu Metrik Akun)
│   ├── ternak/
│   │   ├── page.tsx                         # Animal List.png (Grid Kartu Hewan + CTA Tambah)
│   │   └── [id]/page.tsx                    # Animal List Detail.png (Profil & Timeline Medis)
│   ├── riwayat/page.tsx                     # Riwayat Pemeriksaan.png (Histori Scan & Konsultasi)
│   ├── arsip/page.tsx                       # Archieve.png (Postingan Disukai, Disimpan, Dihapus)
│   ├── pengaturan/page.tsx                  # Settings.png (Ubah Password, Notifikasi, Bahasa)
│   └── bantuan/page.tsx                     # Help Page.png (FAQ Terkait AI Scan & Konsultasi)
│
├── scan/                                    # Shell 4: Standalone Focused Mode (Scanning)
│   ├── layout.tsx                           # Minimalist Dark / Clean Header
│   ├── page.tsx                             # Scan Foto Langsung.png (Kamera) & Scan Upload Gambar.png (Galeri)
│   └── hasil/page.tsx                       # Hasil Diagnosis AI + Rekomendasi Tindakan
│
└── konsultasi/                              # Shell 4: Standalone Focused Mode (Telehealth & Transaksi)
    ├── bayar/[orderId]/page.tsx             # Pembayaran.png (QRIS & Countdown Timer Merah)
    └── room/[chatId]/page.tsx               # Chat Dokter.png & Chat Dokter Ended.png (Room Chat & Sesi Timer)
```

---

## 3. 🧭 Arsitektur Navigasi (Navigation Architecture)

### 3.1 Layout Shells
1. **Marketing Shell:** Navbar latar Teal Gelap (`#133539`), teks putih, navigasi utama (*Tanya Dokter, Komunitas, Klinik Terdekat*), dan pil status akun.
2. **Farmer Sidebar Shell:**
   * Kartu profil di bagian atas (Avatar inisial/foto, nama *"Prabowo"*, label *"Peternak Terverifikasi"*).
   * 6 Menu aktif dengan penanda visual: latar hijau lembut (`#f7fee7`) dan teks tegas.
   * Tombol *Log Out* berwarna merah di bagian bawah yang memicu modal konfirmasi.
3. **Focused Mode:** Header minimalis tanpa distraksi untuk proses kritis (kamera scan, pembayaran berbatas waktu, dan ruang chat aktif).

### 3.2 Pola Tombol Navigasi Kembali
* Komponen seragam `<BackButton fallbackUrl="..." />` yang membaca riwayat browser (`router.back()`) atau kembali ke rute induk jika halaman dibuka secara langsung via URL.

### 3.3 Penyesuaian Responsivitas (Desktop vs Mobile)
* **Desktop ($\ge 1024\text{px}$):** Sidebar navigasi kiri tetap dipertahankan.
* **Mobile ($< 1024\text{px}$):** Sidebar ditransformasi menjadi **Bottom Navigation Bar** mengambang (Beranda, Ternak, [Scan Bulat Mengapung di Tengah], Dokter, Profil) agar mudah dioperasikan peternak menggunakan satu tangan di kandang.

---

## 4. ⚡ Arsitektur State Management

Aplikasi menggunakan pendekatan 3-lapisan state:

### Lapisan 1: Server State (TanStack React Query v5)
Digunakan untuk data yang bersumber dari API backend:
* **Caching & Stale-While-Revalidate:** Data ternak, katalog dokter, dan klinik disimpan di cache agar saat berpindah menu tidak terjadi loading berulang.
* **Auto-Polling Pembayaran:** Pada halaman QRIS (`/konsultasi/bayar/[id]`), query melakukan refetch status setiap 3 detik hingga status berubah menjadi `PAID`, yang kemudian otomatis memicu modal **Transaksi Berhasil** ([Frame 2.png](file:///home/lavvvet/AniMedix/docs/frontendguide/wireframe/Frame%202.png)).
* **Optimistic Updates:** Pesan yang dikirim peternak langsung muncul di tampilan ruang chat sebelum respon server selesai.

### Lapisan 2: Global Client State (Zustand)
Digunakan untuk data sementara lintas halaman:
* **`useRegisterStore`:** Menyimpan data Step 1 ([Register.png](file:///home/lavvvet/AniMedix/docs/frontendguide/wireframe/Register.png): Nama, NIK, No. HP, Alamat) saat melangkah ke Step 2 ([Register#2.png](file:///home/lavvvet/AniMedix/docs/frontendguide/wireframe/Register%232.png)), sehingga data tidak hilang saat user menekan "Kembali".
* **`useScanStore`:** Menyimpan file/blob citra hasil jepretan kamera atau unggahan galeri sebelum dikirim ke backend AI.
* **`useConsultationStore`:** Mengelola durasi sisa waktu sesi chat aktif dokter (*Countdown Timer* `23:59` $\rightarrow$ `00:00`) dan status sesi (Aktif vs Berakhir).
* **`useAuthStore`:** Menyimpan data token dan informasi profil pengguna yang sedang aktif (persist ke `localStorage`).

### Lapisan 3: Local Component State (React `useState`)
* Status visibilitas modal dialog (*Logout Confirmation*, *Transaksi Berhasil/Gagal*).
* Input teks pada formulir dan kontrol kamera (saklar flash, pembalik kamera).

---

## 5. 🎨 Setup Desain Sistem di Kode (Tokens & Fonts)

### 5.1 Google Fonts di Next.js App Router (`layout.tsx`)
* **`Jua` (Display/Headings):** Khusus H1, H2, H3, angka statistik (*KPI metric*), nama logo brand.
* **`Jaldi` (Body/Interface):** Paragraf, input form, label tabel, isi chat.

### 5.2 Tailwind CSS v4 Theme Registration (`globals.css`)
```css
@import "tailwindcss";

@theme {
  /* Brand Teal */
  --color-teal-dark: #133539;
  --color-teal-base: #1f646b;
  --color-teal-accent: #21abb8;
  --color-teal-tint: #f0fdfa;

  /* Olive Green */
  --color-olive-dark: #5d7532;
  --color-olive-base: #7d9e43;
  --color-olive-light: #9cb958;
  --color-olive-wash: #f7fee7;

  /* Accent & Surfaces */
  --color-coral-accent: #eb792b;
  --color-surface-bg: #f8fafc;
  --color-surface-card: #ffffff;
  --color-border-hairline: #e2e8f0;

  /* Fonts */
  --font-display: var(--font-jua), sans-serif;
  --font-body: var(--font-jaldi), sans-serif;
}
```

---

## 6. 🧱 Spesifikasi Reusable Component Library (`src/components/ui/`)

| Komponen | Spesifikasi & Varian | Implementasi pada Wireframe |
| :--- | :--- | :--- |
| **`Button.tsx`** | • `primary` (Olive `#7d9e43`)<br>• `teal` (Teal `#21abb8`)<br>• `outline` (Hairline Border)<br>• `danger` (Red `#ef4444`)<br>• Bentuk: `pill` (bulat penuh) & `rounded` (radius 16px) | Tombol *Daftar Sekarang*, *+ Tambah Hewan*, *Konsultasi Sekarang*, *Masuk*, *Log Out* |
| **`Input.tsx`** | • Surface lembut `#e7ebe2` / `#e2e8f0/40`<br>• Radius `rounded-2xl`<br>• Label font `Jaldi` tebal<br>• Ikon password toggle & validasi error | Form Login, Register Step 1 & 2, Filter Klinik, Pengaturan |
| **`Card.tsx`** | • Permukaan putih (`#ffffff`)<br>• Hairline border (`#e2e8f0`)<br>• Radius `rounded-2xl` - `rounded-3xl`<br>• Elevasi bayangan halus | Wadah utama konten, kotak fitur landing page |
| **`LivestockCard.tsx`** | • Thumbnail hewan dengan Tag ID (`ID: SP-002`)<br>• Nama ternak font `Jua`<br>• Baris jenis & usia, ringkasan riwayat medis | Halaman *Animal List* |
| **`DoctorCard.tsx`** | • Avatar inisial dengan status dot (Hijau/Merah)<br>• Nama dokter & spesialisasi<br>• Rating bintang (`⭐ 4.98`), pengalaman, harga, tombol aksi | Halaman *Tanya Dokter* |
| **`ClinicCard.tsx`** | • Badge *Buka Hari Ini* / *Tutup*<br>• Jarak (km), rating bintang, dokter aktif bertugas<br>• Preview maps mini & tombol *Buka Rute Navigasi* | Halaman *Lokasi Klinik* |
| **`StatCard.tsx`** | • Angka metrik besar font `Jua` (12 Ekor, 48 Kali, 19 Post)<br>• Latar wash pastel (Teal Wash, Olive Wash, Orange Wash) | Halaman *Public Profile* |
| **`Badge.tsx`** | • Bentuk pill `rounded-full`<br>• Varian semantik: `success` (hijau), `danger` (merah), `warning` (oranye), `neutral` (abu-abu) | Status Online/Offline, Status Rekam Medis (Terverifikasi/Terobati), Badge ID |
| **`Modal.tsx`** | • Backdrop blur `backdrop-blur-sm bg-black/40`<br>• Kotak tengah putih `rounded-3xl` berbayangan dalam | • Transaksi Berhasil ([Frame 2.png](file:///home/lavvvet/AniMedix/docs/frontendguide/wireframe/Frame%202.png))<br>• Transaksi Gagal ([Frame 3.png](file:///home/lavvvet/AniMedix/docs/frontendguide/wireframe/Frame%203.png))<br>• Konfirmasi Logout ([Log out Confirmation.png](file:///home/lavvvet/AniMedix/docs/frontendguide/wireframe/Log%20out%20Confirmation.png)) |
| **`Avatar.tsx`** | • Inisial teks otomatis jika gambar tidak ada (*PF, NSS, BA, P*)<br>• Varian warna latar inisial acak/tertentu<br>• Indikator status dot | Chat Dokter, Katalog Konsultasi, Komunitas, Profil |
| **`CountdownTimer.tsx`** | • Mode Transaksi: Badge merah tebal (`00:00:01`)<br>• Mode Chat Sesi: Badge pojok kanan atas (`23:59`) | Layar Pembayaran & Header Chat Dokter |

---

## 7. 🚀 Rencana Bertahap Eksekusi (Roadmap Pengerjaan)

1. **Fase 1: Setup Fondasi Teknis**
   * Instalasi dependensi: `zustand`, `@tanstack/react-query`, `lucide-react`.
   * Pemasangan font Google (`Jua` & `Jaldi`) di `layout.tsx`.
   * Registrasi variabel token warna di `globals.css`.
2. **Fase 2: Pembuatan Reusable Component Library**
   * Membangun kit komponen di `src/components/ui/` (`Button`, `Input`, `Badge`, `Card`, `Modal`, `Avatar`, `CountdownTimer`).
3. **Fase 3: Pembuatan Layout Shell**
   * Pembangunan `Navbar` & `Footer` untuk Marketing Shell.
   * Pembangunan `FarmerSidebar` untuk Farmer Dashboard Shell.
4. **Fase 4: Slicing Halaman Inti (Tahap demi Tahap)**
   * **Modul 1:** Landing Page (`Frame.png`).
   * **Modul 2:** Autentikasi (`Login.png`, `Register.png`, `Register#2.png`).
   * **Modul 3:** Manajemen Ternak (`Animal List.png` & `Animal List Detail.png`).
   * **Modul 4:** AI Camera Scan (`Scan Foto Langsung.png` & `Scan Upload Gambar.png`).
   * **Modul 5:** Telehealth & Transaksi (`Tanya Dokter.png`, `Pembayaran.png`, `Chat Dokter.png`).
   * **Modul 6:** Fasilitas & Komunitas (`Lokasi Klinik.png` & `Komunitas.png`).
