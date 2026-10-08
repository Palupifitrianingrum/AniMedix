"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer, MobileNav } from "@/components/layout";
import { Button, Badge, Avatar } from "@/components/ui";
import {
  Camera,
  Stethoscope,
  MapPin,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  HeartPulse,
  UtensilsCrossed,
  ShieldCheck,
  UserPlus,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  // State untuk FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      question: "Apakah hasil AI Camera Scan bisa menggantikan resep dokter?",
      answer:
        "Tidak. AI Camera Scan dirancang untuk skrining awal cepat dan rekomendasi pertolongan pertama darurat. Untuk diagnosa definitif dan resep obat khusus (seperti antibiotik injeksi), Anda dapat meneruskan hasil scan langsung ke dokter hewan terverifikasi melalui fitur Tanya Dokter.",
    },
    {
      question: "Bagaimana sistem pembayaran konsultasi dokter?",
      answer:
        "Pembayaran dilakukan secara praktis melalui QRIS terintegrasi (mendukung BCA, Mandiri, BRI, GoPay, OVO, Dana, dan ShopeePay). Sesi konsultasi berdurasi 30 menit langsung aktif seketika setelah pembayaran terkonfirmasi otomatis.",
    },
    {
      question: "Apakah saya bisa mendaftarkan lebih dari satu hewan ternak?",
      answer:
        "Tentu saja. Anda dapat mendaftarkan seluruh kawanan ternak (sapi potong, perah, kambing, domba) tanpa batas jumlah di fitur Animal List. Setiap ternak memiliki rekam medis digital masing-masing yang dapat dipantau perkembangannya.",
    },
  ];

  const articles = [
    {
      category: "Kesehatan Ternak",
      badgeVariant: "olive" as const,
      icon: <HeartPulse className="w-12 h-12 text-olive-dark/70 stroke-[1.5]" />,
      bgGradient: "from-olive-wash to-[#e8efe0]",
      date: "28 September 2026 • 5 Menit Baca",
      title: "Gejala Awal Penyakit Mulut & Kuku (PMK) pada Sapi Potong",
      desc: "Langkah tanggap darurat yang wajib dilakukan peternak saat mendapati hewan mengeluarkan busa berlebih dan luka lepuh di kuku.",
      actionText: "Pelajari Penanganan →",
    },
    {
      category: "Nutrisi & Pakan",
      badgeVariant: "teal" as const,
      icon: <UtensilsCrossed className="w-12 h-12 text-teal-base/70 stroke-[1.5]" />,
      bgGradient: "from-teal-tint to-[#d7f1ee]",
      date: "22 September 2026 • 4 Menit Baca",
      title: "Formula Silase Jagung & Pakan Fermentasi Kambing Etawa",
      desc: "Cara praktis memproduksi konsentrat tinggi protein dengan bahan baku lokal murah untuk memacu bobot kambing perah dan potong.",
      actionText: "Lihat Resep Pakan →",
    },
    {
      category: "Jadwal Vaksinasi",
      badgeVariant: "warning" as const,
      icon: <ShieldCheck className="w-12 h-12 text-amber-700/70 stroke-[1.5]" />,
      bgGradient: "from-[#fff7ed] to-[#fed7aa]/50",
      date: "15 September 2026 • 6 Menit Baca",
      title: "Panduan Imunisasi Berkala Kawanan Domba & Kambing",
      desc: "Tabel lengkap waktu pemberian vaksin antraks, enterotoxemia, dan vitamin penunjang dari anakan (cempe) hingga usia kawin.",
      actionText: "Unduh Tabel Vaksin →",
    },
  ];

  const testimonials = [
    {
      quote:
        "Kambing Etawa saya sempat lemas dan mengeluarkan busa setelah makan rumput basah. Begitu saya foto pakai fitur Scan, langsung dihubungkan ke drh. Palupi. Alhamdulillah tertolong tepat waktu!",
      name: "Prabowo Subianto",
      role: "Peternak Kambing • Bogor",
      avatarText: "PS",
      colorPreset: "olive" as const,
    },
    {
      quote:
        "Filter klinik terdekat sangat berguna untuk daerah pelosok Sleman. Pas indukan sapi mau melahirkan tengah malam, saya langsung dapat nomor kontak darurat dokter hewan yang buka 24 jam.",
      name: "Haji Slamet",
      role: "Peternak Sapi Limosin • Magelang",
      avatarText: "HS",
      colorPreset: "teal" as const,
    },
    {
      quote:
        "Fitur komunitasnya ramai dan suportif. Banyak peternak senior yang membagikan resep silase fermentasi murah meriah yang ampuh menaikkan bobot harian cempe.",
      name: "Rina Wulandari",
      role: "Peternak Domba Garut • Bandung Barat",
      avatarText: "RW",
      colorPreset: "amber" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-teal-dark selection:bg-teal-accent selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar isLoggedIn={false} />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              <div className="inline-flex items-center gap-2 bg-teal-tint border border-teal-accent/30 rounded-full px-4 py-1.5 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-accent animate-pulse" />
                <span className="text-xs font-body font-bold text-teal-base tracking-wide uppercase">
                  Platform Ekosistem Kesehatan Hewan & Ternak Terpadu #1
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-teal-dark tracking-tight leading-[1.12]">
                Periksa Kesehatan <br />
                Hewan Cepat, Akurat <br />
                <span className="text-teal-base">& Terhubung</span>
              </h1>

              <p className="font-body text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Deteksi dini keluhan ternak via kamera cerdas AI, konsultasikan
                pengobatan langsung ke dokter hewan spesialis, serta temukan
                klinik terdekat dalam satu genggaman.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/register">
                  <Button
                    variant="primary"
                    shape="pill"
                    size="lg"
                    leftIcon={<UserPlus className="w-5 h-5 mr-1" />}
                  >
                    Daftar Sekarang
                  </Button>
                </Link>
                <a href="#fitur">
                  <Button
                    variant="teal"
                    shape="pill"
                    size="lg"
                    leftIcon={<BookOpen className="w-5 h-5 mr-1" />}
                  >
                    Pelajari Fitur
                  </Button>
                </a>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-6 mt-4 border-t border-slate-200/80 w-full max-w-lg">
                <div>
                  <h4 className="font-display text-2xl sm:text-3xl text-teal-dark">
                    15.000+
                  </h4>
                  <p className="text-xs font-body text-slate-500 font-semibold mt-0.5">
                    Ternak Terpantau
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-2xl sm:text-3xl text-teal-dark">
                    350+
                  </h4>
                  <p className="text-xs font-body text-slate-500 font-semibold mt-0.5">
                    Dokter Hewan Aktif
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-2xl sm:text-3xl text-teal-dark">
                    96.4%
                  </h4>
                  <p className="text-xs font-body text-slate-500 font-semibold mt-0.5">
                    Tingkat Ketepatan AI
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: AI Scan Preview Mockup (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white border border-border-hairline rounded-3xl p-5 shadow-2xl relative transition-transform hover:-translate-y-1 duration-300">
                {/* Visual Viewfinder Mockup */}
                <div className="relative w-full h-56 bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10" />

                  {/* Placeholder goat image with tags */}
                  <div className="absolute inset-0 bg-[#35483a]/90 flex items-center justify-center">
                    <span className="text-6xl select-none">🐐</span>
                  </div>

                  {/* Tag top-left */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md font-semibold">
                      Kambing Etawa • Jantan
                    </span>
                  </div>

                  {/* Target Scanner Box overlay */}
                  <div className="relative z-20 w-36 h-36 border-2 border-teal-accent/90 rounded-2xl flex items-center justify-center p-2 text-center shadow-lg">
                    <span className="text-[10px] font-mono font-bold text-teal-accent tracking-widest uppercase bg-black/50 px-2 py-0.5 rounded">
                      DETEKSI GEJALA
                    </span>
                  </div>
                </div>

                {/* Scan Result Snippet */}
                <div className="mt-4 p-4 rounded-2xl bg-teal-tint/60 border border-teal-accent/20 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-teal-base tracking-wider">
                      Diagnosis Awal
                    </span>
                    <Badge variant="success" size="sm" shape="pill">
                      Risiko Rendah
                    </Badge>
                  </div>
                  <h4 className="font-display text-lg text-teal-dark">
                    Penyakit Kudis
                  </h4>
                  <p className="text-xs text-slate-600 font-body leading-relaxed">
                    Pisahkan kambing yang sakit, berikan obat antiparasit seperti
                    ivermectin sesuai dosis dokter hewan, dan bersihkan kandang
                    secara menyeluruh.
                  </p>
                </div>

                {/* Doctor Consult Quick Action */}
                <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      name="Palupi Fitria"
                      size="sm"
                      status="online"
                      colorPreset="olive"
                    />
                    <div className="flex flex-col">
                      <span className="font-display text-xs text-teal-dark">
                        drh. Palupi Fitria
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold font-body">
                        Siap Konsultasi Online
                      </span>
                    </div>
                  </div>

                  <Link href="/dokter">
                    <Button
                      variant="teal"
                      shape="rounded"
                      size="sm"
                      className="text-xs py-1.5 px-3.5"
                    >
                      Hubungi
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section "Solusi Terintegrasi Perawatan Ternak Modern" */}
      <section id="fitur" className="py-20 bg-white border-y border-border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-base bg-teal-tint border border-teal-accent/20 px-3.5 py-1 rounded-full">
            Fitur Lengkap AniMedix
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-teal-dark tracking-tight mt-3 mb-2">
            Solusi Terintegrasi Perawatan Ternak Modern
          </h2>
          <p className="font-body text-slate-600 max-w-2xl mx-auto text-base mb-14">
            Dirancang berdasarkan kebutuhan riil peternak dan dokter hewan di
            lapangan untuk meminimalisir angka kematian ternak.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1: AI Camera Scan */}
            <div className="bg-surface-bg border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-tint border border-teal-accent/30 text-teal-base flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-teal-dark mb-2">
                  AI Camera Scan
                </h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                  Foto gejala luar ternak seperti penyakit kuku, mulut berbusa,
                  atau jamur kulit. AI menganalisis kondisi dalam hitungan detik.
                </p>
              </div>
              <Link
                href="/scan"
                className="inline-flex items-center gap-1.5 text-sm font-bold font-body text-teal-base hover:text-teal-dark transition-colors"
              >
                <span>Coba Kamera</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2: Tanya Dokter */}
            <div className="bg-surface-bg border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-olive-wash border border-olive-base/30 text-olive-dark flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-teal-dark mb-2">
                  Tanya Dokter
                </h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                  Konsultasi langsung via obrolan teks bersama dokter hewan
                  teregistrasi (SIP aktif) dengan tarif terjangkau.
                </p>
              </div>
              <Link
                href="/dokter"
                className="inline-flex items-center gap-1.5 text-sm font-bold font-body text-olive-dark hover:text-olive-base transition-colors"
              >
                <span>Pilih Dokter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 3: Klinik Terdekat */}
            <div className="bg-surface-bg border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-tint border border-teal-accent/30 text-teal-base flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-teal-dark mb-2">
                  Klinik Terdekat
                </h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                  Filter fasilitas kesehatan hewan berdasarkan Provinsi,
                  Kabupaten, hingga RT/RW lengkap dengan rute peta & jadwal praktik.
                </p>
              </div>
              <Link
                href="/klinik"
                className="inline-flex items-center gap-1.5 text-sm font-bold font-body text-teal-base hover:text-teal-dark transition-colors"
              >
                <span>Cari Lokasi</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 4: Forum Komunitas */}
            <div className="bg-surface-bg border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] border border-[#fed7aa] text-[#ea580c] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-teal-dark mb-2">
                  Forum Komunitas
                </h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                  Ruang diskusi sesama peternak kambing, domba, sapi, dan unggas
                  untuk bertukar wawasan ransum pakan dan manajemen kandang.
                </p>
              </div>
              <Link
                href="/komunitas"
                className="inline-flex items-center gap-1.5 text-sm font-bold font-body text-[#ea580c] hover:text-[#c2410c] transition-colors"
              >
                <span>Gabung Forum</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section "3 Langkah Menjaga Hewan Tetap Sehat" */}
      <section className="py-20 bg-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-olive-dark bg-olive-wash border border-olive-base/30 px-3.5 py-1 rounded-full">
            Alur Mudah
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-teal-dark tracking-tight mt-3 mb-2">
            3 Langkah Menjaga Hewan Tetap Sehat
          </h2>
          <p className="font-body text-slate-600 max-w-xl mx-auto text-base mb-14">
            Tidak perlu panik saat mendapati tanda-tanda sakit pada hewan ternak Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="bg-white border border-border-hairline rounded-3xl p-8 shadow-xs hover:shadow-md transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-teal-base text-white font-display text-2xl flex items-center justify-center mb-5 shadow-sm">
                1
              </div>
              <h3 className="font-display text-xl text-teal-dark mb-3">
                Foto & Pindai Gejala
              </h3>
              <p className="font-body text-slate-600 text-sm leading-relaxed">
                Buka aplikasi AniMedix, arahkan kamera ke area tubuh hewan yang
                bermasalah (mata, kuku, mulut, atau kulit) atau upload dari
                galeri.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-border-hairline rounded-3xl p-8 shadow-xs hover:shadow-md transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-olive-base text-white font-display text-2xl flex items-center justify-center mb-5 shadow-sm">
                2
              </div>
              <h3 className="font-display text-xl text-teal-dark mb-3">
                Dapatkan Analisis Instan
              </h3>
              <p className="font-body text-slate-600 text-sm leading-relaxed">
                Algoritma AI AniMedix mendeteksi kemungkinan penyakit dan langsung
                menyajikan rekomendasi tindakan pertolongan pertama yang aman.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-border-hairline rounded-3xl p-8 shadow-xs hover:shadow-md transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-coral-accent text-white font-display text-2xl flex items-center justify-center mb-5 shadow-sm">
                3
              </div>
              <h3 className="font-display text-xl text-teal-dark mb-3">
                Konsultasikan ke Dokter
              </h3>
              <p className="font-body text-slate-600 text-sm leading-relaxed">
                Hubungkan riwayat hasil scan ke dokter hewan spesialis untuk
                peresepan obat, jadwal suntik vaksin, atau rujukan kunjungan kandang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section "Blog Edukasi" */}
      <section id="blog" className="py-20 bg-white border-y border-border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-base bg-teal-tint border border-teal-accent/20 px-3.5 py-1 rounded-full">
                Artikel & Panduan
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-teal-dark tracking-tight mt-3">
                Blog Edukasi
              </h2>
              <p className="font-body text-slate-600 text-base mt-1">
                Informasi terpercaya seputar penanganan, nutrisi, dan manajemen wabah ternak
              </p>
            </div>

            <Link
              href="#blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold font-body text-teal-base hover:text-teal-dark transition-colors"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-bg border border-border-hairline rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Visual Header */}
                <div
                  className={`w-full h-44 bg-gradient-to-br ${item.bgGradient} flex items-center justify-center relative`}
                >
                  {item.icon}
                  <div className="absolute top-4 left-4">
                    <Badge variant={item.badgeVariant} size="sm" shape="pill">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 gap-2.5">
                  <span className="text-xs font-body font-semibold text-slate-400">
                    {item.date}
                  </span>
                  <h3 className="font-display text-xl text-teal-dark group-hover:text-teal-base transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body text-slate-600 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="mt-auto pt-2 border-t border-slate-200/60">
                    <span className="text-xs font-bold font-body text-teal-base group-hover:text-teal-dark transition-colors">
                      {item.actionText}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Section "Suara Peternak" (Testimonial) */}
      <section className="py-20 bg-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-olive-dark bg-olive-wash border border-olive-base/30 px-3.5 py-1 rounded-full">
            Suara Peternak
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-teal-dark tracking-tight mt-3 mb-2">
            Dipercaya Ribuan Peternak di Berbagai Daerah
          </h2>
          <p className="font-body text-slate-600 max-w-xl mx-auto text-base mb-14">
            Lihat bagaimana AniMedix membantu menyelamatkan kawanan ternak dan
            meningkatkan hasil panen peternakan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-body text-slate-700 text-sm italic leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <Avatar
                    name={item.name}
                    size="md"
                    colorPreset={item.colorPreset}
                  />
                  <div className="flex flex-col">
                    <span className="font-display text-sm text-teal-dark">
                      {item.name}
                    </span>
                    <span className="text-xs font-body text-slate-500 font-medium">
                      {item.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Section "Sering Ditanyakan (FAQ)" */}
      <section className="py-20 bg-white border-t border-border-hairline">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-base bg-teal-tint border border-teal-accent/20 px-3.5 py-1 rounded-full">
            Pertanyaan Umum
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-teal-dark tracking-tight mt-3 mb-2">
            Sering Ditanyakan (FAQ)
          </h2>
          <p className="font-body text-slate-600 text-base mb-12">
            Masih ragu? Berikut jawaban atas hal-hal yang sering ditanyakan mengenai AniMedix.
          </p>

          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface-bg border border-border-hairline rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-base text-teal-dark cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-teal-base" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm font-body text-slate-600 leading-relaxed border-t border-slate-200/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#19403b] via-[#356133] to-[#4f7832] py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            Siap Memberikan Perawatan Terbaik <br />
            Untuk Ternak Anda Hari Ini?
          </h2>
          <p className="font-body text-slate-200 text-base sm:text-lg max-w-xl leading-relaxed">
            Daftar gratis dalam 2 menit, catat seluruh kawanan hewan Anda, dan
            konsultasikan keluhan tanpa batas ke dokter hewan terpercaya.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button
                variant="primary"
                shape="pill"
                size="lg"
                className="bg-olive-light hover:bg-white hover:text-olive-dark shadow-xl text-teal-dark font-display"
              >
                Daftar Akun Sekarang
              </Button>
            </Link>
            <Link href="/profil">
              <Button
                variant="outline"
                shape="pill"
                size="lg"
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs"
              >
                Masuk ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <Footer />

      {/* 10. Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
