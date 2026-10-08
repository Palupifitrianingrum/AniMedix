import type { Metadata } from "next";
import { Jua, Jaldi } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

const jaldi = Jaldi({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jaldi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AniMedix — Platform Ekosistem Kesehatan Hewan & Ternak Terpadu",
  description:
    "Deteksi dini keluhan ternak via kamera cerdas AI, konsultasikan pengobatan langsung ke dokter hewan spesialis, serta temukan klinik terdekat dalam satu genggaman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jua.variable} ${jaldi.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body bg-surface-bg text-teal-dark">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
