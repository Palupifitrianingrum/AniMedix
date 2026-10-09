"use client";

import * as React from "react";
import {
  Scan,
  MessageSquare,
  Filter,
  CheckCircle2,
  Calendar,
  FileText,
  User,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { Button, Modal } from "@/components/ui";

interface ExaminationRecord {
  id: string;
  type: "scan" | "consultation";
  title: string;
  date: string;
  diagnosis: string;
  doctorOrMethod: string;
  statusText: string;
  statusVariant: "success" | "olive";
  notes: string;
  treatment: string;
}

export default function RiwayatPemeriksaanPage() {
  const [filterType, setFilterType] = React.useState<"all" | "scan" | "consultation">("all");
  const [selectedRecord, setSelectedRecord] = React.useState<ExaminationRecord | null>(null);

  const records: ExaminationRecord[] = [
    {
      id: "REC-001",
      type: "scan",
      title: "Scan Kulit Si Bimo (Etawa)",
      date: "22 September 2026",
      diagnosis: "Indikasi Jamur Kulit Ringan",
      doctorOrMethod: "Vision AI Screening (AniMedix AI)",
      statusText: "Selesai",
      statusVariant: "success",
      notes:
        "Terdapat bercak alopecia ringan pada bagian daun telinga kanan dan leher. Suhu tubuh ternak normal 38.6°C.",
      treatment:
        "Oleskan salep antijamur ketoconazole 2% dua kali sehari setelah dibersihkan dengan air hangat.",
    },
    {
      id: "REC-002",
      type: "consultation",
      title: "Konsultasi Dr. Palupi Fitria",
      date: "18 September 2026",
      diagnosis: "Kasus Mulut Berbusa",
      doctorOrMethod: "drh. Palupi Fitria (Spesialis Ruminansia)",
      statusText: "Terobati",
      statusVariant: "olive",
      notes:
        "Mulut berbusa akibat makan rumput yang terpapar embun beracun/getah tanaman liar. Tidak ada lesi PMK pada lidah.",
      treatment:
        "Injeksi antihistamin 5ml dan pemberian air gula merah hangat untuk detoksifikasi alami rumen.",
    },
    {
      id: "REC-003",
      type: "scan",
      title: "Scan Feses & Pencernaan Si Loreng",
      date: "05 September 2026",
      diagnosis: "Kondisi Normal (Kadar Serat Baik)",
      doctorOrMethod: "Vision AI Screening (AniMedix AI)",
      statusText: "Selesai",
      statusVariant: "success",
      notes:
        "Tekstur feses padat normal, tidak ditemukan lendir atau darah. Fermentasi mikroba rumen berlangsung optimal.",
      treatment: "Pertahankan porsi konsentrat dan silase hijauan harian.",
    },
    {
      id: "REC-004",
      type: "consultation",
      title: "Konsultasi drh. Rahmat Santoso",
      date: "28 Agustus 2026",
      diagnosis: "Pemeriksaan Kebuntingan (USG Lapangan)",
      doctorOrMethod: "drh. Rahmat Santoso (Klinik Sehat Makmur Vet)",
      statusText: "Terobati",
      statusVariant: "olive",
      notes:
        "Kebuntingan terkonfirmasi positif usia fetus 65 hari. Denyut jantung janin normal dan posisi plasenta baik.",
      treatment: "Tambahan kalsium laktat dan vitamin A, D, E mingguan.",
    },
  ];

  const filteredRecords = records.filter((r) => {
    if (filterType === "all") return true;
    return r.type === filterType;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Sesuai Wireframe Riwayat Pemeriksaan.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-teal-dark tracking-tight">
            Riwayat Pemeriksaan
          </h1>
          <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-1">
            Histori hasil scan dan konsultasi dokter hewan
          </p>
        </div>

        {/* Filter Toggle Button Sesuai Wireframe */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-white border border-slate-300 rounded-2xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all cursor-pointer ${
                filterType === "all"
                  ? "bg-teal-base text-white shadow-xs"
                  : "text-slate-600 hover:text-teal-dark"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setFilterType("scan")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all cursor-pointer ${
                filterType === "scan"
                  ? "bg-teal-base text-white shadow-xs"
                  : "text-slate-600 hover:text-teal-dark"
              }`}
            >
              Scan AI
            </button>
            <button
              type="button"
              onClick={() => setFilterType("consultation")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all cursor-pointer ${
                filterType === "consultation"
                  ? "bg-teal-base text-white shadow-xs"
                  : "text-slate-600 hover:text-teal-dark"
              }`}
            >
              Konsultasi
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Card Sesuai Wireframe */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_-2px_rgba(19,53,57,0.06)] flex flex-col gap-4">
        {filteredRecords.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedRecord(item)}
            className="group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-[#f9faf7]/50 hover:bg-white hover:border-teal-accent/60 hover:shadow-md transition-all duration-200 text-left cursor-pointer"
          >
            {/* Left: Icon & Info Sesuai Wireframe */}
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                  item.type === "scan"
                    ? "bg-[#ddf2f5] border-[#bee2e7] text-[#1b4e54]"
                    : "bg-[#edf3d7] border-[#d9e5b2] text-[#4f6b21]"
                }`}
              >
                {item.type === "scan" ? (
                  <Scan className="w-6 h-6 stroke-[2]" />
                ) : (
                  <MessageSquare className="w-6 h-6 stroke-[2]" />
                )}
              </div>

              <div className="flex flex-col">
                <span className="font-display text-base sm:text-lg text-teal-dark group-hover:text-teal-base transition-colors">
                  {item.title}
                </span>
                <span className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-0.5">
                  {item.date} • {item.diagnosis}
                </span>
              </div>
            </div>

            {/* Right: Status Badge Sesuai Wireframe */}
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-body ${
                  item.statusVariant === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-[#edf4d6] text-[#48631b]"
                }`}
              >
                {item.statusText}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-accent group-hover:translate-x-0.5 transition-all hidden sm:block" />
            </div>
          </button>
        ))}
      </div>

      {/* Detail Rekam Medis Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        className="max-w-lg text-left items-stretch"
      >
        {selectedRecord && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-body">
                {selectedRecord.id} • {selectedRecord.date}
              </span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-body ${
                  selectedRecord.statusVariant === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-[#edf4d6] text-[#48631b]"
                }`}
              >
                {selectedRecord.statusText}
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl text-teal-dark">
                {selectedRecord.title}
              </h2>
              <p className="text-xs font-bold text-teal-base font-body mt-0.5">
                Pemeriksa: {selectedRecord.doctorOrMethod}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-body">
                Diagnosa / Temuan
              </span>
              <p className="text-sm font-body text-teal-dark font-bold">
                {selectedRecord.diagnosis}
              </p>
              <p className="text-xs font-body text-slate-600 mt-1 leading-relaxed">
                {selectedRecord.notes}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-tint/40 border border-teal-base/20 flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-base font-body">
                Tindakan & Rekomendasi Terapi
              </span>
              <p className="text-xs font-body text-teal-dark font-medium leading-relaxed">
                {selectedRecord.treatment}
              </p>
            </div>

            <div className="flex items-center justify-end mt-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="primary"
                onClick={() => setSelectedRecord(null)}
              >
                Tutup Rincian
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
