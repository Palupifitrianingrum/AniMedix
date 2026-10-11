import * as React from "react";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "AniMedix — Portal Admin",
};

/* Shell Admin: sidebar gelap + topbar pencarian global. Rute: /admin/... */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
