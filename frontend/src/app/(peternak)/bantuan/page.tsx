"use client";

import * as React from "react";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  PhoneCall,
  Mail,
  Search,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export default function HelpPage() {
  const [search, setSearch] = React.useState("");
  const [openIds, setOpenIds] = React.useState<string[]>([
    "faq-1",
    "faq-2",
    "faq-3",
  ]);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqs: FaqItem[] = [
    {
      id: "faq-1",
      question: "Bagaimana cara kerja AI Scan Ternak?",
      answer:
        "Sistem membandingkan foto gejala fisik dengan ribuan database penyakit ternak untuk memberikan dugaan awal.",
    },
    {
      id: "faq-2",
      question: "Berapa lama batas waktu chat konsultasi dokter?",
      answer:
        "Satu sesi percakapan dokter berdurasi 30 menit terhitung setelah pembayaran terverifikasi.",
    },
    {
      id: "faq-3",
      question: "Bagaimana cara mendaftarkan ternak baru ke profil saya?",
      answer:
        "Buka menu Animal List di bilah samping, tekan tombol '+ Tambah Hewan (Add)', lalu isi data eartag ID, ras ternak, usia, serta riwayat vaksinasi awal.",
    },
    {
      id: "faq-4",
      question: "Apakah hasil analisis AI menggantikan diagnosis dokter hewan resmi?",
      answer:
        "Hasil AI Vision berfungsi sebagai skrining awal dan pertolongan pertama di kandang. Untuk penanganan obat keras atau injeksi antibiotik, peternak disarankan melakukan konfirmasi dengan dokter hewan berizin di platform.",
    },
    {
      id: "faq-5",
      question: "Bagaimana cara melakukan pembayaran reservasi konsultasi dokter?",
      answer:
        "Pembayaran mendukung QRIS otomatis (GoPay, OVO, Dana, ShopeePay), transfer Virtual Account (BCA, Mandiri, BRI, BNI), dan konfirmasi instan 24/7.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Sesuai Wireframe Help Page.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-teal-dark tracking-tight">
            Help Page
          </h1>
          <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-1">
            Pusat bantuan informasi, panduan fitur aplikasi, dan kontak layanan darurat
          </p>
        </div>

        {/* Search FAQ */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pertanyaan bantuan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-2xl bg-white border border-slate-200 text-xs font-body text-teal-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-accent transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Main Container Card Sesuai Wireframe */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_-2px_rgba(19,53,57,0.06)] flex flex-col gap-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-[#f9faf7]/50 hover:bg-white hover:border-teal-accent/50 transition-all duration-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
              >
                <div>
                  <h3 className="font-display text-base sm:text-lg text-teal-dark leading-snug">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-1.5 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <div
                  className={`p-1.5 rounded-full bg-slate-100 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Customer Care Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#173e35] to-[#2d6948] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
            <PhoneCall className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="font-display text-xl text-white">
              Butuh Pendampingan Darurat Ternak?
            </h4>
            <p className="text-xs sm:text-sm font-body text-emerald-100 font-semibold mt-0.5">
              Layanan siaga tanggap darurat wabah PMK dan konsultasi dokter hewan via WhatsApp.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/6281234567890?text=Halo%20AniMedix%20saya%20butuh%20bantuan%20ternak"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#84a34b] hover:bg-[#72913b] text-white px-5 py-3 rounded-2xl font-body font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Hubungi Tim Siaga</span>
        </a>
      </div>
    </div>
  );
}
