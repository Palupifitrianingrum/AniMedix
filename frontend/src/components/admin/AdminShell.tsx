"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  MessageSquareText,
  ScanLine,
  Clock,
  Settings,
  Menu,
  Search,
  Bell,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import { useAdminStore, adminName } from "@/store/useAdminStore";
import { useAuthStore } from "@/store/useAuthStore";
import { confirmDialog } from "@/store/useConfirmStore";
import { toast } from "@/store/useToastStore";
import { useMounted } from "@/hooks/useMounted";
import { ConfirmHost, ToastHost } from "@/components/ui";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/verifikasi", label: "Verifikasi dokter", icon: ShieldCheck, badge: true },
  { href: "/admin/pengguna", label: "Pengguna", icon: Users },
  { href: "/admin/konsultasi", label: "Konsultasi & komisi", icon: MessageSquareText },
  { href: "/admin/scan", label: "Pemantauan scan AI", icon: ScanLine },
  { href: "/admin/log", label: "Log aktivitas", icon: Clock },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout: authLogout } = useAuthStore();
  const pending = useAdminStore((s) => s.data.vets.filter((v) => v.status === "menunggu").length);

  const logout = async () => {
    if (await confirmDialog({ title: "Keluar dari portal admin?", confirmText: "Keluar", isDestructive: true })) {
      await authLogout();
      toast("Anda telah keluar");
      router.push("/login");
    }
  };

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-teal-dark px-4 py-6 text-[#d7ecea] transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Link href="/admin" className="mb-6 flex items-center gap-3 px-2" onClick={onClose}>
          <span className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#2f9e8f] to-[#7ea34a] shadow-lg" />
          <span>
            <strong className="block font-display text-xl leading-none text-white">AniMedix</strong>
            <small className="text-[11px] tracking-wide text-[#8fb7b4]">Portal admin</small>
          </span>
        </Link>

        <nav aria-label="Menu admin" className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold transition-colors",
                  active ? "bg-olive-light text-[#18321a]" : "text-[#b8d6d3] hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0 stroke-[1.8]" aria-hidden="true" />
                {label}
                {badge && pending > 0 && (
                  <span className="ml-auto rounded-full bg-coral-accent px-2 py-0.5 text-[11px] text-white">{pending}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3.5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#77e0e4] ring-4 ring-[#77e0e4]/20" />
            <div>
              <b className="block text-[12.5px] text-white">Layanan AI aktif</b>
              <small className="text-[11.5px] text-[#8fb7b4]">Ketepatan model 96,4%</small>
            </div>
          </div>
          <button type="button" onClick={logout} className="rounded-xl bg-white/10 py-2.5 text-sm font-bold text-white hover:bg-white/15 cursor-pointer">
            Keluar
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />}
    </>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { data, query, setQuery, update } = useAdminStore();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const name = adminName(data);
  const unread = data.notifs.some((n) => n.unread);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-border-hairline bg-white/90 px-4 backdrop-blur-md sm:px-8">
      <button type="button" onClick={onMenu} aria-label="Buka menu" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-hairline lg:hidden cursor-pointer">
        <Menu className="h-5 w-5" />
      </button>

      <label className="flex h-11 max-w-xl flex-1 items-center gap-2.5 rounded-xl border border-border-hairline bg-[#f1f6f8] px-3.5 text-slate-500 focus-within:border-teal-accent focus-within:bg-white">
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari dokter, pengguna, atau ID transaksi..."
          aria-label="Pencarian global"
          className="min-w-0 flex-1 bg-transparent text-sm text-teal-dark outline-none"
        />
      </label>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative" ref={wrapRef}>
          <button
            type="button"
            aria-label="Notifikasi"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-hairline bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unread && <i className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral-accent ring-2 ring-white" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
              <div className="flex items-center justify-between px-3 py-2">
                <b className="text-sm text-teal-dark">Notifikasi</b>
                <button
                  type="button"
                  className="text-xs font-bold text-teal-accent hover:underline cursor-pointer"
                  onClick={() => update((d) => d.notifs.forEach((n) => (n.unread = false)))}
                >
                  Tandai dibaca
                </button>
              </div>
              <ul className="flex flex-col">
                {data.notifs.slice(0, 8).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => update((d) => d.notifs.forEach((x) => x.id === n.id && (x.unread = false)))}
                      className={cn("w-full rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 cursor-pointer", n.unread && "bg-teal-tint/60")}
                    >
                      <b className="block text-[13px] text-teal-dark">{n.t}</b>
                      <small className="text-xs text-slate-500">{n.s}</small>
                    </button>
                  </li>
                ))}
                {!data.notifs.length && <li className="px-3 py-3 text-sm text-slate-500">Belum ada notifikasi.</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2.5 rounded-full border border-border-hairline py-1 pl-1 pr-4 sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d9f3ee] to-[#c9e3b4] text-xs font-bold text-teal-base">
            {initials(name)}
          </span>
          <span className="leading-tight">
            <b className="block text-[13px] text-teal-dark">{name}</b>
            <small className="text-[11px] text-slate-500">Super admin</small>
          </span>
        </div>
      </div>
    </header>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Data admin dibaca dari localStorage, jadi tunggu sampai di browser.
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-bg text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" aria-label="Memuat portal admin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-bg font-body text-teal-dark">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-7 sm:px-8">{children}</main>
        <footer className="flex flex-col gap-2 bg-teal-dark px-8 py-5 text-xs text-[#b8d6d3] sm:flex-row sm:items-center sm:justify-between">
          <span>
            <i className="mr-2 inline-block h-5 w-5 rounded-md bg-teal-accent align-middle" />
            <b className="font-display text-sm text-white">AniMedix</b> Solusi cerdas kesehatan hewan &amp; ternak Indonesia
          </span>
          <span>© 2026 AniMedix. Portal admin.</span>
        </footer>
      </div>
      <ToastHost />
      <ConfirmHost />
    </div>
  );
}
