import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ToastHost, ConfirmHost } from "@/components/ui";

export const metadata: Metadata = {
  title: "AI Camera Scan — AniMedix",
  description: "Pindai bagian tubuh hewan yang bergejala untuk identifikasi instan menggunakan AniMedix Vision AI.",
};

/* Shell 4: Focused Mode (guidline.md 3.1) - Header minimalis tanpa distraksi */
export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1619] text-white font-body selection:bg-teal-accent selection:text-white flex flex-col">
      {/* Minimalist Focused Header */}
      <header className="w-full border-b border-white/10 bg-[#132225]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-body font-bold text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-xl hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#21abb8] to-[#7d9e43] flex items-center justify-center text-white text-base shadow-sm">
              🐾
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-tight text-white leading-none">
                AniMedix
              </span>
              <span className="text-[9px] uppercase tracking-widest text-teal-accent font-body font-bold mt-0.5 flex items-center gap-1">
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
