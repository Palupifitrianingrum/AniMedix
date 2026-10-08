"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FolderKanban, Camera, Stethoscope, User } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  // Jangan tampilkan di halaman camera scanner fullscreen agar tidak menutupi shutter
  if (pathname === "/scan") return null;

  const navItems = [
    { label: "Beranda", href: "/", icon: <Home className="w-5 h-5" /> },
    {
      label: "Ternak",
      href: "/ternak",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      label: "Scan AI",
      href: "/scan",
      icon: <Camera className="w-6 h-6 stroke-[2.2]" />,
      isCenter: true,
    },
    {
      label: "Dokter",
      href: "/dokter",
      icon: <Stethoscope className="w-5 h-5" />,
    },
    { label: "Profil", href: "/profil", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-3 shadow-2xl flex items-center justify-around safe-area-bottom">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-4 flex flex-col items-center group"
            >
              <div className="w-13 h-13 rounded-full bg-olive-base text-white flex items-center justify-center shadow-lg ring-4 ring-white group-hover:scale-105 active:scale-95 transition-all">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold font-body text-olive-dark mt-1">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors",
              isActive ? "text-teal-base font-bold" : "text-slate-400 hover:text-slate-600 font-medium"
            )}
          >
            <div className={cn("transition-transform", isActive && "scale-110")}>
              {item.icon}
            </div>
            <span className="text-[10px] font-body mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
