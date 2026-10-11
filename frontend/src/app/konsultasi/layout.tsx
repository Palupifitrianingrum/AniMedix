import * as React from "react";
import { ToastHost, ConfirmHost } from "@/components/ui";

/* Shell 4: Focused Mode (guidline.md) - Standalone Telehealth & Transaksi */
export default function KonsultasiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-teal-dark font-body selection:bg-teal-accent selection:text-white">
      <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <ToastHost />
      <ConfirmHost />
    </div>
  );
}
