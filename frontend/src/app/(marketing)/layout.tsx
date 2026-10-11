import * as React from "react";
import { MarketingNavbar, Footer } from "@/components/layout";
import { ToastHost, ConfirmHost } from "@/components/ui";

/* Shell 1: Marketing (guidline.md) - navbar gelap + footer gelap.
   Dipakai: /dokter, /klinik, /klinik/[id], /komunitas */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-teal-dark font-body selection:bg-teal-accent selection:text-white">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
      <Footer />
      <ToastHost />
      <ConfirmHost />
    </div>
  );
}
