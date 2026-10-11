"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  MapPin,
  RefreshCw,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useScanStore } from "@/store/useScanStore";

export default function HasilScanPage() {
  const router = useRouter();
  const { currentResult, history, resetCurrentScan } = useScanStore();

  // Gunakan currentResult atau hasil terakhir dari history jika ada
  const result = currentResult || history[0];

  if (!result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl text-white mb-2">Belum Ada Hasil Scan</h2>
        <p className="text-sm text-slate-400 mb-6">
          Silakan ambil foto atau unggah gambar bagian tubuh hewan ternak untuk memulai diagnosis AI.
        </p>
        <Button
          variant="teal"
          shape="rounded"
          onClick={() => router.push("/scan")}
        >
          Mulai Scan Sekarang
        </Button>
      </div>
    );
  }

  const { diagnosis, imageUrl, createdAt, id, source } = result;

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "Tinggi":
        return "danger";
      case "Sedang":
        return "warning";
      case "Rendah":
      default:
        return "success";
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-accent/20 text-teal-accent border border-teal-accent/30">
              <Sparkles className="w-3.5 h-3.5" /> Hasil Identifikasi Vision AI
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Ref: {id}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white tracking-tight">
            Laporan Analisis Kesehatan Ternak
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Dipindai pada {formattedDate} via {source === "camera" ? "Kamera Langsung" : "Unggah Galeri"}
          </p>
        </div>

        {/* Action Top Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              resetCurrentScan();
              router.push("/scan");
            }}
            className="inline-flex items-center justify-center font-bold text-sm px-4 py-2 gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-teal-accent" />
            <span>Scan Ulang</span>
          </button>
          <Link href="/dokter">
            <Button
              variant="teal"
              shape="rounded"
              size="sm"
              className="shadow-md"
            >
              <Stethoscope className="w-4 h-4 mr-1.5" /> Konsultasi Dokter
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left (Visual Capture) vs Right (Clinical Diagnosis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Citra Hasil Scan & Metrik AI */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card Gambar dengan Bounding Box Reticle */}
          <div className="relative rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Foto hasil scan hewan"
              className="w-full h-[320px] sm:h-[380px] object-cover opacity-90"
            />

            {/* Bounding Box Simulasi AI Vision */}
            <div className="absolute inset-8 border-2 border-teal-accent/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3 bg-teal-accent/5">
              <div className="flex justify-between items-start">
                <span className="bg-teal-dark/80 backdrop-blur-md text-teal-accent text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-teal-accent/40 shadow-sm">
                  TARGET: DETECTED_SYMPTOM
                </span>
                <span className="bg-teal-dark/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                  {diagnosis.confidence}% Akurasi
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] tracking-widest uppercase font-mono text-teal-accent bg-black/60 px-2 py-0.5 rounded">
                  MODEL: ANIMEDIX-VISION-V2
                </span>
              </div>
            </div>
          </div>

          {/* KPI Summary Tiles */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Tingkat Akurasi</span>
              <span className="font-display text-2xl text-teal-accent">
                {diagnosis.confidence}%
              </span>
              <span className="text-[11px] text-slate-400 mt-1">High Confidence Rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Tingkat Risiko</span>
              <div className="mt-0.5">
                <Badge
                  variant={getRiskBadgeVariant(diagnosis.riskLevel) as "success" | "danger" | "warning"}
                  shape="pill"
                  size="md"
                >
                  Risiko {diagnosis.riskLevel}
                </Badge>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Berdasarkan potensi keparahan</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Hasil Diagnosis Lengkap & Rekomendasi */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card Diagnosis Utama */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#132225] border border-white/10 shadow-xl flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl sm:text-3xl text-white tracking-tight">
                  {diagnosis.diseaseName}
                </h2>
              </div>
              <p className="text-sm font-serif italic text-teal-accent mt-0.5">
                {diagnosis.scientificName}
              </p>
            </div>

            <p className="font-body text-sm sm:text-base text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
              {diagnosis.summary}
            </p>
          </div>

          {/* Gejala yang Terdeteksi */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#132225] border border-white/10 shadow-xl flex flex-col gap-4">
            <h3 className="font-display text-xl text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-accent" />
              <span>Karakteristik & Gejala Klinis Terdeteksi</span>
            </h3>

            <div className="space-y-2.5">
              {diagnosis.detectedSymptoms.map((symptom, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rekomendasi Pertolongan Pertama (PENTING) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#132225] border border-olive-light/20 shadow-xl flex flex-col gap-4">
            <h3 className="font-display text-xl text-[#9bb859] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#9bb859]" />
              <span>Rekomendasi Pertolongan Pertama Darurat</span>
            </h3>

            <div className="space-y-3">
              {diagnosis.firstAidActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-sm text-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-[#9bb859] mt-2 shrink-0" />
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peringatan Khusus / Biosafety */}
          {diagnosis.treatmentWarnings.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold text-amber-300">Peringatan Biosafety:</strong>
                {diagnosis.treatmentWarnings.map((warn, i) => (
                  <p key={i} className="leading-relaxed">{warn}</p>
                ))}
              </div>
            </div>
          )}

          {/* Rekomendasi Dokter & Tombol CTA Lanjutan */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17383c] to-[#1e4e54] border border-teal-accent/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-accent/20 text-teal-accent flex items-center justify-center shrink-0 border border-teal-accent/30">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-teal-accent font-bold uppercase tracking-wider block">
                  Dokter Spesialis Terkait
                </span>
                <strong className="text-base font-display text-white block mt-0.5">
                  {diagnosis.recommendedSpecialist}
                </strong>
                <span className="text-xs text-slate-300">Siap menerima konsultasi telemedicine</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/dokter" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  shape="rounded"
                  size="md"
                  className="w-full sm:w-auto bg-[#84a34b] hover:bg-[#72913b] text-white shadow-lg whitespace-nowrap"
                >
                  <span>Konsultasi Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigasi Tambahan */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
            <Link
              href="/riwayat"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Lihat di Riwayat Pemeriksaan</span>
            </Link>
            <Link
              href="/klinik"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Temukan Klinik Hewan Terdekat</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
