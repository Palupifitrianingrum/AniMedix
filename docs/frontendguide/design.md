# 🐾 AniMedix — Design System & UI Specification (`design.md`)

Dokumen ini merupakan spesifikasi teknis desain sistem dan dokumentasi antarmuka untuk platform kesehatan hewan terpadu **AniMedix**. Dirancang berdasarkan evolusi dari sketsa *lo-fi wireframe* menuju implementasi *high-fidelity* berbasis kode web dan komponen vektor Figma.

---

## 1. 🎨 Design Tokens: Color & Theme

Sistem warna menggunakan token semantik fungsional yang diturunkan dari palet warna dokumen *Grand Design* (Halaman 12):

### 1.1 Primary & Brand Colors
* **Primary Teal Dark**: `#133539` — Digunakan untuk kontras teks tertinggi pada *headline*, *surface* gelap, dan border berbobot.
* **Primary Teal Base**: `#1f646b` — Warna dasar *brand*, dipakai pada *header/navbar*, kartu aktif, dan tombol primer *default state*.
* **Primary Teal Light / Accent**: `#21abb8` — Aksen interaktif untuk link, status *hover*, dan indikator aktif.
* **Teal Surface Tint**: `#f0fdfa` — Latar belakang kartu dan *input field* berbobot ringan.

### 1.2 Secondary & Nature Accents
* **Olive Green Dark**: `#5d7532` — Varian penekanan teks dan status *pressed* pada komponen hijau.
* **Olive Green Base**: `#7d9e43` — Tombol aksi sekunder (*Secondary CTA*) dan *badge* status positif.
* **Olive Green Light**: `#9cb958` — Status *hover* untuk tombol herbal/alami.
* **Olive Pale Wash**: `#f7fee7` — *Background surface* kartu ternak dan penanda kategori ramah lingkungan.

### 1.3 Action & Semantic Accent
* **Coral / Orange Accent**: `#eb792b` — Aksen dinamis untuk tombol pemicu utama (*Primary CTA*), penanda urgensi, dan status peringatan.
* **Orange Soft**: `#f97316` — Varian *hover state* pada elemen konversi.
* **Neutral Background**: `#f8fafc` — Warna kanvas utama (*surface level 0*).
* **Card Surface**: `#ffffff` — *Surface level 1* dengan batas *hairline border* (`#e2e8f0`).
* **Semantic Error**: `#ef4444` — Digunakan pada tombol destruktif (*Log Out*, *Delete Account*).

### 1.4 Accessibility & Contrast
* Seluruh kombinasi teks bodi memenuhi standar **WCAG AA** dengan rasio kontras $\ge 4.5:1$ terhadap *surface background*.

---

## 2. 🔤 Typography Specification

Mengintegrasikan dua Google Fonts dengan peruntukan fungsional yang berbeda:

* **Display & Heading (`Jua`)**:
  * **Karakter**: *Display rounded* yang ramah, hangat, dan memberikan identitas organik bagi peternak.
  * **Penerapan**: Logo *brand*, judul halaman (H1, H2, H3), angka statistik utama (*KPI metrics*), serta nama navigasi profil.
  * **Leading**: *Tight line-height* (1.1 - 1.2).
* **Body & Form Interface (`Jaldi`)**:
  * **Karakter**: *Humanist sans-serif* dengan tingkat keterbacaan (*legibility*) tinggi pada ukuran kecil dan teks padat.
  * **Penerapan**: Isi paragraf, label formulir, teks tabel riwayat, dan balon percakapan pesan.
  * **Leading**: *Normal line-height* (1.4 - 1.6).

### Type Scale
| Level | Font Family | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | `Jua` | 44px - 48px | Regular (Display) | 1.15 | -0.01em |
| **Section Title (H2)** | `Jua` | 28px - 32px | Regular | 1.2 | Normal |
| **Card Title (H3)** | `Jua` | 20px - 22px | Regular | 1.25 | Normal |
| **Body Large** | `Jaldi` | 18px | Bold (700) | 1.4 | Normal |
| **Body Regular** | `Jaldi` | 15px - 16px | Regular (400) | 1.5 | Normal |
| **Caption / Badge** | `Jaldi` | 12px - 13px | Bold (700) | 1.3 | +0.02em |

---

## 3. 📐 Layout, Grid & Elevation

* **Grid System**: Mengadopsi sistem **12-column grid** responsif dengan *max content width* sebesar **1280px** (Desktop) dan fluid container untuk perangkat seluler.
* **Spacing Scale (8px Grid System)**:
  * `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 32px | `2xl`: 48px | `3xl`: 64px.
* **Border Radius Tokens**:
  * *Subtle*: 8px - 10px (Input field, filter chip).
  * *Rounded*: 16px - 20px (Card surface, modal dialog).
  * *Pill Shape*: 9999px (Badge kategori, tombol aksi bulat).
* **Elevation & Depth**:
  * Menggunakan pendekatan modern kombinasi *hairline border* 1px solid (`#e2e8f0` / `#ccfbf1`) dengan *subtle shadow* (`box-shadow: 0 4px 20px -2px rgba(19, 53, 57, 0.05)`).
  * *Backdrop-filter blur(12px)* diterapkan pada komponen sticky navbar (*glassmorphism subtle*).

---

## 4. 🎬 Interactive States & Microinteractions

Mengikuti spesifikasi varian status tombol pada berkas *Grand Design* (Halaman 12):

* **Default State**: Background padat (*Teal / Olive / Coral*) dengan teks kontras tinggi dan elevasi dasar.
* **Hover State**: Peningkatan kecerahan warna 1 tahap, *subtle scale* (1.02), serta penambahan bayangan elevasi (*shadow-md*). Waktu transisi: `duration-200 ease-out`.
* **Pressed / Active State**: Penurunan kecerahan warna (*darker shade*) dan kompresi skala (*scale 0.98*).
* **Disabled State**: Opasitas 50%, latar belakang netral pudar, dan kursor `not-allowed`.
* **Focus Ring**: Garis luar `2px solid #21abb8` dengan offset `2px` saat diakses via navigasi keyboard (standar aksesibilitas fungsional).
