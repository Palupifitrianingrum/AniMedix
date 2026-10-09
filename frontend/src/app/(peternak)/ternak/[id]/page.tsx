"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Tag,
  Sparkles,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Activity,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button, Modal, StatusModal } from "@/components/ui";

export default function AnimalDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "KMB-001";

  // Data ternak dinamis sesuai ID atau default Si Bimo
  const isSapi = id.toUpperCase().includes("SP");
  const animal = {
    name: isSapi ? "Si Loreng" : "Si Bimo",
    tagId: id.toUpperCase().startsWith("ID:") ? id.toUpperCase() : `ID: ${id.toUpperCase()}`,
    breed: isSapi ? "Sapi Limosin" : "Kambing Etawa",
    category: isSapi
      ? "Kategori: Ruminansia Besar (Pejantan)"
      : "Kategori: Ruminansia Kecil (Pejantan)",
    age: isSapi ? "3.0 Tahun" : "2.5 Tahun",
    weight: isSapi ? "Berat Badan: 650 kg" : "Berat Badan: 74 kg",
  };

  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header dengan tombol Kembali ke List Sesuai Wireframe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-teal-dark tracking-tight">
            Animal List
          </h1>
          <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-1">
            Detail profil dan histori rekam medis hewan ternak
          </p>
        </div>

        <Link
          href="/ternak"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-300 hover:border-teal-accent hover:text-teal-dark bg-white font-body text-xs font-bold text-slate-700 transition-all self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke List</span>
        </Link>
      </div>

      {/* Main Detail Container Card Sesuai Wireframe */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_-2px_rgba(19,53,57,0.06)] flex flex-col gap-8">
        {/* Big Animal Pic Hero Box Sesuai Wireframe */}
        <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#ebf5ea] via-[#e5f2e0] to-[#d6ebcf] border border-[#d2e8cb] p-8 sm:p-12 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Paw Icon Box di Tengah Sesuai Wireframe */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/95 border border-[#cbe4c4] shadow-md flex items-center justify-center text-[#2f7560] mb-3">
            <span className="text-4xl sm:text-5xl">🐾</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-teal-dark">
            Animal Pic
          </h3>
          <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-0.5">
            Foto resolusi tinggi kondisi fisik terkini hewan ternak
          </p>

          {/* Tombol Update Foto di Pojok Kanan Bawah Sesuai Wireframe */}
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 bg-white/95 hover:bg-white border border-slate-200/90 text-teal-dark text-xs font-body font-bold px-4 py-2 rounded-2xl shadow-sm transition-all cursor-pointer hover:border-teal-accent"
          >
            <Camera className="w-4 h-4 text-teal-base" />
            <span>Update Foto</span>
          </button>
        </div>

        {/* 3 Grid Box Metadata Ternak Sesuai Wireframe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Box 1: NAME / CODE */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 bg-[#f9faf7]/60 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-body">
              NAME / CODE
            </span>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-teal-accent" />
              <span className="font-display text-2xl text-teal-dark">
                {animal.name}
              </span>
            </div>
            <span className="inline-block mt-1 text-xs font-bold text-teal-dark bg-teal-tint px-2.5 py-1 rounded-lg w-max font-body">
              {animal.tagId}
            </span>
          </div>

          {/* Box 2: JENIS */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 bg-[#f9faf7]/60 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-body">
              JENIS
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-olive-base" />
              <span className="font-display text-2xl text-teal-dark">
                {animal.breed}
              </span>
            </div>
            <span className="text-xs font-body font-semibold text-slate-500 mt-1">
              {animal.category}
            </span>
          </div>

          {/* Box 3: USIA */}
          <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 bg-[#f9faf7]/60 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-body">
              USIA
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="font-display text-2xl text-teal-dark">
                {animal.age}
              </span>
            </div>
            <span className="text-xs font-body font-semibold text-slate-500 mt-1">
              {animal.weight}
            </span>
          </div>
        </div>

        {/* Section Rekam Medis / Riwayat Sesuai Wireframe */}
        <div className="pt-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-teal-dark">
            <Activity className="w-6 h-6 text-teal-accent" />
            <h3 className="font-display text-2xl text-teal-dark">Riwayat</h3>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Record Item 1: Vaksinasi Lengkap PMK & Antraks */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white hover:border-teal-accent/50 transition-all gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-tint text-teal-dark flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-display text-base sm:text-lg text-teal-dark">
                    Vaksinasi Lengkap PMK &amp; Antraks
                  </h4>
                  <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-0.5">
                    Diberikan oleh drh. Rahmat Santoso di Klinik Sehat Makmur Vet.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full font-body">
                  Terverifikasi
                </span>
                <span className="text-[11px] text-slate-400 font-body font-semibold">
                  14 Agustus 2026
                </span>
              </div>
            </div>

            {/* Record Item 2: Konsultasi Diare Ringan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white hover:border-teal-accent/50 transition-all gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-olive-wash text-olive-dark flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-display text-base sm:text-lg text-teal-dark">
                    Konsultasi Diare Ringan
                  </h4>
                  <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-0.5">
                    Pemberian elektrolit dan penyesuaian ransum rumput gajah kering selama 3 hari.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#48631b] bg-[#edf4d6] px-2.5 py-1 rounded-full font-body">
                  Pulih Total
                </span>
                <span className="text-[11px] text-slate-400 font-body font-semibold">
                  22 Juli 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Update Foto */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        className="max-w-md text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark">
          Unggah Foto Hewan Ternak
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Pilih foto fisik terbaru untuk memperbarui rekam visual hewan ternak {animal.name}.
        </p>

        <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col items-center gap-3 cursor-pointer">
          <Camera className="w-8 h-8 text-slate-400" />
          <div>
            <p className="text-xs font-bold text-teal-dark font-body">
              Klik untuk memilih foto atau seret ke sini
            </p>
            <p className="text-[11px] text-slate-400 font-body mt-1">
              JPG, PNG, atau WEBP hingga 5MB
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPhotoModalOpen(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setIsPhotoModalOpen(false);
              setIsSuccessModalOpen(true);
            }}
          >
            Simpan Foto
          </Button>
        </div>
      </Modal>

      {/* Status Modal Sukses */}
      <StatusModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        status="success"
        title="Foto Berhasil Diperbarui"
        description={`Foto fisik terkini untuk hewan ternak ${animal.name} telah berhasil diunggah.`}
        actionText="Selesai"
      />
    </div>
  );
}
