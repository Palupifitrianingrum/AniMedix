"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  variant?: "white" | "dark";
  className?: string;
}

export default function Navbar({
  isLoggedIn = false,
  userName = "Prabowo",
  variant = "white",
  className,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Link navigasi (Fitur Utama dihapus sesuai permintaan pengguna)
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

  /* -------------------------------------------------------------
     Varian White (Tampilan Sesuai Gambar: Top Gradient + White Bar)
  ------------------------------------------------------------- */
  if (variant === "white") {
    return (
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
                <Link
                  href="/profil"
                  className="flex items-center gap-2.5 bg-slate-100 hover:bg-teal-tint text-teal-dark px-4 py-2 rounded-full font-display text-sm transition-all shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-teal-dark">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{userName}</span>
                </Link>
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
                <Link
                  href="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between bg-slate-100 px-4 py-2.5 rounded-2xl font-display text-sm text-teal-dark"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-base" />
                    <span>Profil ({userName})</span>
                  </div>
                  <span className="text-xs text-slate-500 font-body">Buka</span>
                </Link>
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
    );
  }

  /* -------------------------------------------------------------
     Varian Dark (Pill Teal Gelap untuk Inner Dashboard / Konsultasi)
  ------------------------------------------------------------- */
  return (
    <header className={cn("w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 z-40", className)}>
      <nav className="max-w-7xl mx-auto bg-teal-dark text-white rounded-3xl px-6 py-3.5 shadow-xl flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-teal-base shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-xl">🐾</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl tracking-tight text-white leading-none">
              AniMedix
            </span>
            <span className="text-[10px] uppercase tracking-widest text-teal-accent font-body font-bold">
              ANIMAL HEALTHCARE
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-body font-bold transition-colors hover:text-teal-accent",
                  isActive ? "text-teal-accent" : "text-slate-100"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Pill */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/profil"
              className="flex items-center gap-2.5 bg-white text-teal-dark hover:bg-teal-tint px-4 py-2 rounded-full font-display text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-teal-dark">
                <User className="w-4 h-4" />
              </div>
              <span>{userName}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-white hover:text-teal-accent font-body font-bold text-sm px-3 py-1.5"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-olive-base hover:bg-olive-dark text-white px-5 py-2 rounded-full font-body font-bold text-sm"
              >
                Daftar Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-white hover:text-teal-accent transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
