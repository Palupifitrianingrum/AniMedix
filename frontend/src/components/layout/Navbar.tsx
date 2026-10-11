"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Stethoscope,
  MapPin,
  Users,
  Menu,
  X,
  User,
  UserPlus,
  BookOpen,
  LogOut,
  ChevronDown,
  FolderKanban,
  ClipboardList,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ConfirmModal } from "@/components/ui/Modal";

export interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  variant?: "white" | "dark";
  className?: string;
}

export default function Navbar({
  isLoggedIn: propIsLoggedIn,
  userName: propUserName,
  variant = "white",
  className,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const { isLoggedIn: storeIsLoggedIn, user, logout } = useAuthStore();

  const isLoggedIn =
    propIsLoggedIn !== undefined ? propIsLoggedIn : storeIsLoggedIn;
  const userName =
    propUserName || (user?.full_name ? user.full_name.split(" ")[0] : "Prabowo");
  const fullName = user?.full_name || "Prabowo Subianto";

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/");
  };

  // Link navigasi (Fitur Utama dihapus sesuai permintaan)
  const navLinks = [
    {
      label: "Tanya Dokter",
      href: "/dokter",
      icon: <Stethoscope className="w-4 h-4 text-teal-base stroke-[2.2]" />,
    },
    {
      label: "Klinik Terdekat",
      href: "/klinik",
      icon: <MapPin className="w-4 h-4 text-olive-base stroke-[2.2]" />,
    },
    {
      label: "Komunitas",
      href: "/komunitas",
      icon: <Users className="w-4 h-4 text-coral-accent stroke-[2.2]" />,
    },
    {
      label: "Blog Edukasi",
      href: "/#blog",
      icon: <BookOpen className="w-4 h-4 text-slate-500 stroke-[2]" />,
    },
  ];

  return (
    <>
      <header className={cn("w-full sticky top-0 z-50 shadow-xs", className)}>
        {/* 1. Top Decorative Gradient Bar */}
        <div className="w-full h-7 bg-gradient-to-r from-[#113235] via-[#1d5757] via-50% to-[#668b39]" />

        {/* 2. White Navbar Container */}
        <div className="w-full bg-white border-b border-slate-100">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2f7560] to-[#739744] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-xl">🐾</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl tracking-tight text-teal-dark leading-none">
                  AniMedix
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-body font-bold mt-0.5">
                  ANIMAL HEALTHCARE
                </span>
              </div>
            </Link>

            {/* Middle: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 text-sm font-body font-bold transition-colors hover:text-teal-base py-1",
                      isActive ? "text-teal-base" : "text-teal-dark"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right: Auth / User Profile */}
            <div className="hidden sm:flex items-center gap-4">
              {isLoggedIn ? (
                /* User Profile Pill with Interactive Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 bg-slate-100 hover:bg-teal-tint text-teal-dark px-4 py-2 rounded-full font-display text-sm transition-all shadow-xs cursor-pointer select-none"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-teal-dark">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{userName}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-200",
                        userDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-3 bg-slate-50 rounded-2xl mb-2 border border-slate-100">
                        <p className="font-display text-teal-dark text-base truncate">
                          {fullName}
                        </p>
                        <p className="text-xs text-slate-500 font-body truncate">
                          {user?.email || "prabowosubianto@gmail.com"}
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-body">
                          Peternak Terverifikasi
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 text-sm font-body font-bold text-slate-700">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-teal-dark transition-colors"
                        >
                          <FolderKanban className="w-4 h-4 text-teal-base" />
                          <span>Dashboard Peternak</span>
                        </Link>
                        <Link
                          href="/profil"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-teal-dark transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profil Saya</span>
                        </Link>
                        <Link
                          href="/ternak"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-teal-dark transition-colors"
                        >
                          <FolderKanban className="w-4 h-4 text-slate-400" />
                          <span>Daftar Hewan Ternak</span>
                        </Link>
                        <Link
                          href="/riwayat"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-teal-dark transition-colors"
                        >
                          <ClipboardList className="w-4 h-4 text-slate-400" />
                          <span>Riwayat Pemeriksaan</span>
                        </Link>
                        <Link
                          href="/pengaturan"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-teal-dark transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Setting</span>
                        </Link>
                        {user?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-teal-50 text-teal-base font-bold transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-teal-base" />
                            <span>Portal Admin</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-semantic-error hover:bg-red-50 text-sm font-body font-bold transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar (Log Out)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-teal-dark hover:text-teal-base font-body font-bold text-sm px-3 py-2 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-[#84a34b] hover:bg-[#72913b] text-white text-sm font-body font-bold px-5 py-2.5 rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.4]" />
                    <span>Daftar Sekarang</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 text-teal-dark hover:text-teal-base transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-base font-body font-bold text-teal-dark"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-slate-100 px-4 py-3 rounded-2xl font-display text-sm text-teal-dark">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-base" />
                      <span>{fullName}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-body">Masuk</span>
                  </div>
                  <Link
                    href="/pengaturan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-slate-200 bg-white text-teal-dark font-body font-bold text-sm hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4 text-teal-base" />
                    <span>Setting / Pengaturan</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-red-200 bg-red-50 text-semantic-error font-body font-bold text-sm cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar (Log Out)</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center border border-slate-300 py-2.5 rounded-2xl font-body font-bold text-sm text-teal-dark hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#84a34b] text-white py-2.5 rounded-2xl font-body font-bold text-sm shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

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
    </>
  );
}
