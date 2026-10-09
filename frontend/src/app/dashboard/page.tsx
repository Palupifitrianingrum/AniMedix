"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button, Badge } from "@/components/ui";
import {
  Search,
  Bell,
  CheckCircle2,
  Scan,
  PlusCircle,
  MapPin,
  Stethoscope,
  Users,
  ArrowUpRight,
  Tag,
  Shield,
  Milk,
  Camera,
  ChevronDown,
  LogOut,
  Settings,
  Home,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/Modal";

export default function DashboardPeternakPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "kambing" | "sapi">("all");
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.push("/login");
  };

  const displayName = user?.full_name ? user.full_name : "Pak Prabowo";

  // Data ternak sesuai wireframe Dashboard Peternak.png
  const livestockList = [
    {
      id: "livestock-001",
      tagId: "KMB-001",
      tagVariant: "dark" as const,
      statusLabel: "Sehat",
      statusVariant: "success" as const,
      category: "kambing" as const,
      name: "Si Bimo",
      breed: "Kambing Peranakan Etawa (Jantan)",
      age: "2.5 Tahun",
      weight: "74 Kg",
      iconType: "tag" as const,
      noteType: "CATATAN MEDIS TERAKHIR",
      noteTitleColor: "text-teal-base",
      noteBoxBorder: "border-teal-accent/20 bg-teal-tint/30",
      noteText:
        "Vaksinasi booster PMK selesai. Gejala mulut berbusa sembuh total pasca diet rumput basah.",
      actionVariant: "teal" as const,
    },
    {
      id: "livestock-002",
      tagId: "SP-002",
      tagVariant: "olive" as const,
      statusLabel: "Jadwal Vaksin",
      statusVariant: "warning" as const,
      category: "sapi" as const,
      name: "Si Loreng",
      breed: "Sapi Potong Limosin (Jantan)",
      age: "3.2 Tahun",
      weight: "650 Kg",
      iconType: "shield" as const,
      noteType: "TENGGAT WAKTU MEDIS",
      noteTitleColor: "text-amber-700",
      noteBoxBorder: "border-amber-200 bg-[#fffbeb]/60",
      noteText:
        "Waktunya suntik vitamin B kompleks dan pemotongan kuku berkala esok hari.",
      actionVariant: "primary" as const,
    },
    {
      id: "livestock-003",
      tagId: "SP-003",
      tagVariant: "dark" as const,
      statusLabel: "Produksi Baik",
      statusVariant: "success" as const,
      category: "sapi" as const,
      name: "Si Manis",
      breed: "Sapi Friesian Holstein (Betina)",
      age: "4 Tahun",
      weight: "22 L/Hari",
      weightLabel: "Produksi",
      iconType: "milk" as const,
      noteType: "CATATAN MEDIS TERAKHIR",
      noteTitleColor: "text-teal-base",
      noteBoxBorder: "border-teal-accent/20 bg-teal-tint/30",
      noteText:
        "Hasil tes mastitis subklinis negatif. Kebutuhan kalsium konsentrat stabil.",
      actionVariant: "teal" as const,
    },
  ];

  const filteredLivestock = livestockList.filter((item) => {
    const matchesFilter =
      selectedFilter === "all" ? true : item.category === selectedFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f3f6f1] text-teal-dark flex flex-col font-body selection:bg-teal-accent selection:text-white">
      {/* 1. Header Khusus Portal Peternak (Sesuai Wireframe) */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Portal Peternak */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2f7560] to-[#739744] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-xl">🐾</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl tracking-tight text-teal-dark leading-none">
                AniMedix
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-body font-bold mt-0.5">
                PORTAL PETERNAK
              </span>
            </div>
          </Link>

          {/* Central Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari data ternak (ID/Nama), riwayat obat, atau jadwal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-full bg-[#f6f8f5] border border-slate-200/90 text-sm font-body text-teal-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative w-11 h-11 rounded-full bg-[#f6f8f5] border border-slate-200 flex items-center justify-center text-slate-600 hover:text-teal-dark hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            {/* User Profile Pill with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 bg-[#f6f8f5] hover:bg-teal-tint/60 border border-slate-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  👤
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-display text-sm text-teal-dark leading-tight">
                      {displayName}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-accent shrink-0" />
                  </div>
                  <span className="text-[10px] font-body text-slate-400 font-semibold leading-tight">
                    Peternak Terverifikasi
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-xl border border-slate-100 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-slate-50 rounded-2xl mb-2 text-xs">
                    <p className="font-bold text-teal-dark">{displayName}</p>
                    <p className="text-slate-500 truncate">{user?.email || "prabowo@gmail.com"}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm font-bold text-slate-700">
                    <Link
                      href="/"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-teal-dark transition-colors"
                    >
                      <Home className="w-4 h-4 text-slate-400" />
                      <span>Beranda Utama</span>
                    </Link>
                    <Link
                      href="/pengaturan"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-teal-dark transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Setting</span>
                    </Link>
                  </div>

                  <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-semantic-error hover:bg-red-50 text-sm font-bold transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Log Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1 w-full">
        {/* 2. Hero Green Banner (Sesuai Dashboard Peternak.png) */}
        <section className="bg-gradient-to-r from-[#173e35] via-[#1d5244] to-[#2d6948] rounded-4xl p-8 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-emerald-400/5 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
                Halo, {displayName}! 👋 <br />
                <span className="text-[#a4e0c4]">
                  Siap Pantau Kesehatan Ternak Hari Ini?
                </span>
              </h1>
              <p className="font-body text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed">
                Periksa gejala fisik dengan kamera AI cerdas, konsultasikan
                penanganan dengan dokter hewan, atau catat perkembangan bobot
                ternak Anda.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link href="/scan">
                  <Button
                    variant="primary"
                    shape="rounded"
                    size="md"
                    className="bg-[#95b854] hover:bg-[#86a847] text-teal-dark font-display text-sm sm:text-base px-6 py-3 shadow-lg"
                    leftIcon={<Scan className="w-5 h-5 stroke-[2.2]" />}
                  >
                    Scan Ternak Sekarang
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={() => alert("Form Tambah Hewan Baru akan segera dibuka di modul berikutnya!")}
                  className="inline-flex items-center gap-2 border border-white/30 text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-body font-bold text-sm sm:text-base transition-all backdrop-blur-xs cursor-pointer active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Tambah Hewan Baru</span>
                </button>
              </div>
            </div>

            {/* Right: STATUS PENGAWASAN (4 cols) */}
            <div className="lg:col-span-4 bg-white/10 border border-white/15 backdrop-blur-md rounded-3xl p-6 flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-body">
                Status Pengawasan
              </span>

              <div className="grid grid-cols-2 gap-4">
                {/* Total Hewan */}
                <div className="bg-black/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-semibold text-slate-300">
                    Total Hewan
                  </span>
                  <span className="font-display text-4xl text-white my-1">
                    12
                  </span>
                  <span className="text-[10px] text-emerald-300 font-medium">
                    Tergabung
                  </span>
                </div>

                {/* Scan AI Selesai */}
                <div className="bg-black/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-semibold text-slate-300">
                    Scan AI Selesai
                  </span>
                  <span className="font-display text-4xl text-[#a4e0c4] my-1">
                    48
                  </span>
                  <span className="text-[10px] text-emerald-300 font-medium">
                    Bulan Ini
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Three Quick Action Cards (Under Banner) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Klinik Terdekat */}
          <Link
            href="/klinik"
            className="group bg-white border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-tint text-teal-base flex items-center justify-center border border-teal-accent/20">
                  <MapPin className="w-6 h-6 stroke-[2]" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-teal-base transition-colors" />
              </div>
              <h3 className="font-display text-xl text-teal-dark mb-1.5">
                Klinik Terdekat
              </h3>
              <p className="font-body text-slate-500 text-xs sm:text-sm leading-relaxed">
                Temukan RS hewan & dokter jaga dengan filter wilayah hingga RT/RW.
              </p>
            </div>
            <div className="pt-4 mt-2">
              <span className="text-xs font-bold font-body text-teal-base group-hover:underline">
                3 Klinik aktif di Sleman →
              </span>
            </div>
          </Link>

          {/* Card 2: Tanya Dokter */}
          <Link
            href="/dokter"
            className="group bg-white border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-olive-wash text-olive-dark flex items-center justify-center border border-olive-base/20">
                  <Stethoscope className="w-6 h-6 stroke-[2]" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-olive-base transition-colors" />
              </div>
              <h3 className="font-display text-xl text-teal-dark mb-1.5">
                Tanya Dokter
              </h3>
              <p className="font-body text-slate-500 text-xs sm:text-sm leading-relaxed">
                Telekonsultasi cepat via obrolan teks atau video bersama dokter tersertifikasi.
              </p>
            </div>
            <div className="pt-4 mt-2">
              <span className="text-xs font-bold font-body text-olive-dark group-hover:underline">
                drh. Palupi Fitria Online →
              </span>
            </div>
          </Link>

          {/* Card 3: Komunitas Peternak */}
          <Link
            href="/komunitas"
            className="group bg-white border border-border-hairline rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center border border-[#fed7aa]">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <Badge variant="warning" size="sm" shape="pill" className="bg-[#ea580c] text-white border-0 text-[11px] font-bold px-2.5">
                  67 Baru
                </Badge>
              </div>
              <h3 className="font-display text-xl text-teal-dark mb-1.5">
                Komunitas Peternak
              </h3>
              <p className="font-body text-slate-500 text-xs sm:text-sm leading-relaxed">
                Diskusikan resep pakan fermentasi & tanggap darurat antar-peternak.
              </p>
            </div>
            <div className="pt-4 mt-2">
              <span className="text-xs font-bold font-body text-[#ea580c] group-hover:underline">
                Buka ruang diskusi →
              </span>
            </div>
          </Link>
        </section>

        {/* 4. Section "Daftar Hewan Ternak" */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-teal-dark tracking-tight">
                Daftar Hewan Ternak
              </h2>
              <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
                Pantauan status klinis, rekam vaksinasi, dan histori pemeriksaan berkala
              </p>
            </div>

            {/* Filter Tabs (Semua, Kambing/Domba, Sapi) */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-body transition-colors cursor-pointer ${
                  selectedFilter === "all"
                    ? "bg-teal-dark text-white shadow-xs"
                    : "text-slate-600 hover:text-teal-dark"
                }`}
              >
                Semua (12)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("kambing")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-body transition-colors cursor-pointer ${
                  selectedFilter === "kambing"
                    ? "bg-teal-dark text-white shadow-xs"
                    : "text-slate-600 hover:text-teal-dark"
                }`}
              >
                Kambing/Domba (7)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("sapi")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-body transition-colors cursor-pointer ${
                  selectedFilter === "sapi"
                    ? "bg-teal-dark text-white shadow-xs"
                    : "text-slate-600 hover:text-teal-dark"
                }`}
              >
                Sapi (5)
              </button>
            </div>
          </div>

          {/* Livestock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredLivestock.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-border-hairline rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Visual Header / Placeholder with Icons */}
                <div className="relative w-full h-44 bg-gradient-to-br from-[#edf2e9] via-[#e2ecdc] to-[#d6e5cf] flex items-center justify-center p-4">
                  {/* Tag ID Badge Top-Left */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span
                      className={`text-[11px] font-mono font-bold px-3 py-1 rounded-md text-white shadow-xs ${
                        item.tagVariant === "olive" ? "bg-olive-dark" : "bg-teal-dark"
                      }`}
                    >
                      ID: {item.tagId}
                    </span>
                  </div>

                  {/* Status Pill Top-Right */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-2xs ${
                        item.statusVariant === "warning"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.statusVariant === "warning" ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      />
                      <span>{item.statusLabel}</span>
                    </span>
                  </div>

                  {/* Center Placeholder Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-xs flex items-center justify-center text-teal-base shadow-xs">
                    {item.iconType === "tag" && <Tag className="w-8 h-8 stroke-[1.8]" />}
                    {item.iconType === "shield" && <Shield className="w-8 h-8 stroke-[1.8]" />}
                    {item.iconType === "milk" && <Milk className="w-8 h-8 stroke-[1.8]" />}
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <div>
                    <h3 className="font-display text-xl text-teal-dark">
                      {item.name}
                    </h3>
                    <p className="text-xs font-body font-semibold text-teal-base mt-0.5">
                      {item.breed}
                    </p>
                  </div>

                  {/* Metrics Box */}
                  <div className="bg-[#f6f8f5] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-body font-bold text-slate-700 border border-slate-100">
                    <span>Usia: {item.age}</span>
                    <span>
                      {item.weightLabel || "Bobot"}: {item.weight}
                    </span>
                  </div>

                  {/* Note Box */}
                  <div className={`rounded-xl p-3 border text-xs font-body ${item.noteBoxBorder}`}>
                    <span className={`block font-bold text-[10px] uppercase tracking-wider mb-1 ${item.noteTitleColor}`}>
                      {item.noteType}
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {item.noteText}
                    </p>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      variant={item.actionVariant}
                      shape="rounded"
                      size="sm"
                      className="flex-1 text-xs py-2.5"
                      onClick={() => alert(`Detail rekam medis ${item.name} (${item.tagId})`)}
                    >
                      Detail Rekam Medis
                    </Button>

                    <Link
                      href="/scan"
                      className="w-10 h-10 rounded-2xl border border-slate-200 bg-[#f6f8f5] hover:bg-teal-tint text-slate-600 hover:text-teal-base flex items-center justify-center transition-colors shadow-2xs"
                      title="Scan Cepat Hewan Ini"
                    >
                      <Camera className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 5. Footer Khusus Portal Peternak */}
      <footer className="w-full bg-[#112d2f] text-slate-400 py-6 mt-12 border-t border-teal-base/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body">
          <div className="flex items-center gap-2">
            <span className="font-display text-white text-base">AniMedix</span>
            <span>—</span>
            <span>Solusi Cerdas Kesehatan Hewan & Ternak Indonesia</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
              Profil Ternak
            </Link>
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Landing Page
            </Link>
            <Link href="#fitur" className="text-slate-300 hover:text-white transition-colors">
              Semua Modul
            </Link>
          </div>

          <p className="text-slate-500">
            © 2026 AniMedix. Sesuai Panduan design.md.
          </p>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to Log Out?"
        description="Anda harus login kembali untuk mengakses data hewan dan riwayat konsultasi."
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
