"use client";

import * as React from "react";
import { Navbar, Footer, FarmerSidebar, MobileNav } from "@/components/layout";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f2] text-teal-dark font-body selection:bg-teal-accent selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content with Shared Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Sidebar */}
          <FarmerSidebar />

          {/* Right Page Content */}
          <main className="flex-1 w-full min-w-0">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
