import * as React from "react";
import Link from "next/link";
import { Mail, Globe, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d2629] text-slate-300 mt-auto border-t border-teal-base/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-accent flex items-center justify-center text-teal-dark font-bold text-lg">
                🐾
              </div>
              <span className="font-display text-2xl tracking-tight text-white">
                AniMedix
              </span>
            </div>
            <p className="font-body text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform ekosistem kesehatan hewan & ternak terpadu di Indonesia.
              Menghubungkan peternak pedesaan dengan teknologi AI, dokter
              spesialis ruminansia, dan klinik terdekat.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="mailto:support@animedix.id"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-teal-accent hover:text-teal-dark flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-teal-accent hover:text-teal-dark flex items-center justify-center transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-teal-accent hover:text-teal-dark flex items-center justify-center transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links: Layanan (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h5 className="font-display text-sm tracking-wider uppercase text-teal-accent font-bold">
              Layanan
            </h5>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <Link
                  href="/scan"
                  className="hover:text-white transition-colors"
                >
                  AI Scanner Penyakit
                </Link>
              </li>
              <li>
                <Link
                  href="/dokter"
                  className="hover:text-white transition-colors"
                >
                  Konsultasi Dokter Hewan
                </Link>
              </li>
              <li>
                <Link
                  href="/klinik"
                  className="hover:text-white transition-colors"
                >
                  Direktori Klinik Terdekat
                </Link>
              </li>
              <li>
                <Link
                  href="/komunitas"
                  className="hover:text-white transition-colors"
                >
                  Forum Peternak Nusantara
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Informasi (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h5 className="font-display text-sm tracking-wider uppercase text-teal-accent font-bold">
              Informasi
            </h5>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <Link
                  href="/#blog"
                  className="hover:text-white transition-colors"
                >
                  Blog Edukasi Peternakan
                </Link>
              </li>
              <li>
                <Link
                  href="/bantuan"
                  className="hover:text-white transition-colors"
                >
                  Pusat Bantuan (Help Page)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-slate-500">
          <p>© 2026 AniMedix Healthcare. All rights reserved.</p>
          <p className="text-slate-400">
            Dirancang untuk Kemajuan Peternakan Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
