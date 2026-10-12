import * as React from "react";
import { Navbar, Footer } from "@/components/layout";
import { ToastHost, ConfirmHost } from "@/components/ui";

/* Shell 1: Marketing - navbar & footer sama dengan landing page.
   Dipakai: /dokter, /klinik, /klinik/[id], /komunitas, /komunitas/[id], /blog, /blog/[slug] */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-teal-dark font-body selection:bg-teal-accent selection:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
      <Footer />
      <ToastHost />
      <ConfirmHost />
    </div>
  );
}
