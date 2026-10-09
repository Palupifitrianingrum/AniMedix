"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/Modal";
import {
  User,
  FolderKanban,
  ClipboardList,
  Archive,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

export interface FarmerSidebarProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  className?: string;
}

export default function FarmerSidebar({
  userName: propUserName,
  userRole: propUserRole,
  className,
}: FarmerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const { user, logout } = useAuthStore();

  const userName = propUserName || user?.full_name || "Prabowo";
  const userRole = propUserRole || (user?.role === "peternak" ? "Peternak Terverifikasi" : "Pengguna");

  const menuItems = [
    {
      label: "Public Profile",
      href: "/profil",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "Animal List",
      href: "/ternak",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      label: "Riwayat Pemeriksaan",
      href: "/riwayat",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      label: "Archive",
      href: "/arsip",
      icon: <Archive className="w-5 h-5" />,
    },
    {
      label: "Settings",
      href: "/pengaturan",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      label: "Help Page",
      href: "/bantuan",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.push("/login");
  };

  return (
    <>
      <aside
        className={cn(
          "w-full lg:w-72 bg-surface-card border border-border-hairline rounded-3xl p-5 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] flex flex-col shrink-0 gap-5",
          className
        )}
      >
        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
          <div className="w-13 h-13 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
            <User className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h3 className="font-display text-lg text-teal-dark truncate leading-tight">
              {userName}
            </h3>
            <span className="text-xs font-body font-semibold text-teal-base truncate mt-0.5">
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <nav className="flex flex-col gap-2.5 flex-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/profil" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl border font-body text-sm font-bold transition-all duration-200 select-none",
                  isActive
                    ? "bg-olive-wash border-olive-base/40 text-teal-dark shadow-xs"
                    : "bg-white border-border-hairline text-slate-600 hover:bg-slate-50 hover:text-teal-dark hover:border-slate-300"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-olive-base" : "text-slate-400"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border-hairline text-semantic-error hover:bg-red-50 hover:border-red-200 font-body text-sm font-bold transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0 stroke-[2.2]" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

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
