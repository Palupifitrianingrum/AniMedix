"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Stethoscope, Users, MapPin, PawPrint, User, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useMounted } from "@/hooks/useMounted";
import { ConfirmModal } from "@/components/ui/Modal";

/*
 * Navbar gelap Marketing Shell (guidline.md 3.1):
 * latar #133539, sudut membulat, menu aktif #1f646b, pil profil putih.
 * Acuan: Tanya Dokter.png, Lokasi Klinik.png, Pembayaran Gagal.png
 */

const NAV_LINKS = [
  { label: "Tanya Dokter", href: "/dokter", match: ["/dokter", "/konsultasi"], icon: Stethoscope },
  { label: "Komunitas", href: "/komunitas", match: ["/komunitas"], icon: Users },
  { label: "Klinik Terdekat", href: "/klinik", match: ["/klinik"], icon: MapPin },
];

export default function MarketingNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const { isLoggedIn, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showLogout, setShowLogout] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const loggedIn = mounted && isLoggedIn;
  const firstName = user?.full_name?.split(" ")[0] || "Prabowo";

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <div className="sticky top-0 z-40 px-3 pt-2.5">
        <header className="mx-auto flex max-w-[1416px] flex-wrap items-center gap-x-6 gap-y-3 rounded-[28px] bg-teal-dark px-5 py-3.5 shadow-[0_10px_30px_-10px_rgba(19,53,57,0.45)] lg:flex-nowrap lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0" aria-label="AniMedix, ke beranda">
            <span className="font-display text-3xl lg:text-[32px] leading-none text-white">AniMedix</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-base">
              <PawPrint className="h-6 w-6 stroke-[2]" aria-hidden="true" />
            </span>
          </Link>

          {/* Menu utama */}
          <nav
            aria-label="Menu utama"
            className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto lg:order-none lg:mx-auto lg:w-auto lg:gap-3"
          >
            {NAV_LINKS.map(({ label, href, match, icon: Icon }) => {
              const active = match.some((m) => pathname?.startsWith(m));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-2.5 font-display text-base lg:text-lg text-white transition-colors",
                    active ? "bg-teal-base" : "hover:bg-white/10"
                  )}
                >
                  <Icon className="h-5 w-5 text-[#77e0e4] stroke-[1.8]" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Profil */}
          <div className="relative ml-auto shrink-0 lg:ml-0" ref={menuRef}>
            {loggedIn ? (
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 font-display text-lg text-teal-dark cursor-pointer"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9d9d9]">
                  <User className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="hidden sm:inline">{firstName}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 font-display text-base text-white hover:bg-white/10"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-white px-5 py-2 font-display text-base text-teal-dark hover:bg-teal-tint"
                >
                  Daftar
                </Link>
              </div>
            )}

            {menuOpen && loggedIn && (
              <div className="absolute right-0 mt-2 w-56 rounded-3xl border border-slate-100 bg-white p-2.5 shadow-2xl">
                <div className="mb-1.5 rounded-2xl bg-slate-50 p-3 text-xs">
                  <p className="font-display text-sm text-teal-dark">{user?.full_name || "Prabowo"}</p>
                  <p className="truncate text-slate-500">{user?.email || "Peternak terverifikasi"}</p>
                </div>
                <div className="flex flex-col gap-0.5 text-sm font-bold text-slate-700">
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
                    <LayoutDashboard className="h-4 w-4 text-teal-base" /> Dashboard Peternak
                  </Link>
                  <Link href="/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
                    <User className="h-4 w-4 text-slate-400" /> Profil Saya
                  </Link>
                  <Link href="/pengaturan" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
                    <Settings className="h-4 w-4 text-slate-400" /> Pengaturan
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogout(true);
                    }}
                    className="mt-1 flex items-center gap-2 rounded-xl border-t border-slate-100 px-3 py-2 text-left text-semantic-error hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Keluar (Log Out)
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      <ConfirmModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to Log Out?"
        description="Anda harus login kembali untuk mengakses data hewan dan riwayat konsultasi."
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive
      />
    </>
  );
}
