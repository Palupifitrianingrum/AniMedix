import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ToastHost, ConfirmHost } from "@/components/ui";

export const metadata: Metadata = {
  title: "AI Camera Scan — AniMedix",
  description: "Pindai bagian tubuh hewan yang bergejala untuk identifikasi instan menggunakan AniMedix Vision AI.",
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-bg text-teal-dark font-body selection:bg-teal-accent selection:text-white flex flex-col">
      {/* Top Decorative Gradient Bar (Konsisten dengan Landing Page) */}
      <div className="w-full h-2.5 bg-gradient-to-r from-[#113235] via-[#1d5757] via-50% to-[#668b39]" />

      {/* Header Bersih & Terang Sesuai Landing Page */}
      <header className="w-full border-b border-border-hairline bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-body font-bold text-slate-600 hover:text-teal-dark transition-colors py-2 px-3 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#21abb8] to-[#7d9e43] flex items-center justify-center text-white text-base shadow-sm group-hover:scale-105 transition-transform">
              🐾
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-tight text-teal-dark leading-none">
                AniMedix
              </span>
              <span className="text-[9px] uppercase tracking-widest text-teal-base font-body font-bold mt-0.5 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> VISION AI SCANNER
              </span>
            </div>
          </Link>

          {/* Spacer kanan untuk menjaga keseimbangan posisi logo di tengah */}
          <div className="w-20 hidden sm:block" aria-hidden="true" />
        </div>
      </header>

      {/* Main Focused Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {children}
      </main>

      {/* Global Hosts for Modals and Toasts */}
      <ToastHost />
      <ConfirmHost />
    </div>
  );
}
