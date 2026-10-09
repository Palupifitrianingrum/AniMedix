"use client";

import * as React from "react";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Trash2,
  ChevronRight,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { Button, Modal, StatusModal } from "@/components/ui";

interface ArchiveSection {
  id: "likes" | "comments" | "saved" | "deleted";
  title: string;
  count: number;
  icon: React.ReactNode;
}

export default function ArchivePage() {
  const [activeModal, setActiveModal] = React.useState<
    "likes" | "comments" | "saved" | "deleted" | null
  >(null);
  const [statusModal, setStatusModal] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const archiveSections: ArchiveSection[] = [
    {
      id: "likes",
      title: "Postingan Disukai (Like)",
      count: 14,
      icon: <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />,
    },
    {
      id: "comments",
      title: "Komentar Saya (Comments)",
      count: 8,
      icon: <MessageSquare className="w-5 h-5 text-teal-base" />,
    },
    {
      id: "saved",
      title: "Tersimpan (Saved)",
      count: 6,
      icon: <Bookmark className="w-5 h-5 text-[#739744] fill-[#739744]/20" />,
    },
    {
      id: "deleted",
      title: "Baru Dihapus (Recently Deleted)",
      count: 2,
      icon: <Trash2 className="w-5 h-5 text-slate-500" />,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Sesuai Wireframe Archieve.png */}
      <div>
        <h1 className="font-display text-4xl sm:text-5xl text-teal-dark tracking-tight">
          Archive
        </h1>
        <p className="text-xs sm:text-sm font-body text-slate-500 font-semibold mt-1">
          Koleksi aktivitas komunitas, artikel tersimpan, dan data riwayat Anda
        </p>
      </div>

      {/* Main Container Card Sesuai Wireframe */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_-2px_rgba(19,53,57,0.06)] flex flex-col gap-4">
        {archiveSections.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveModal(item.id)}
            className="group w-full flex items-center justify-between p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-[#f9faf7]/50 hover:bg-white hover:border-teal-accent/60 hover:shadow-md transition-all duration-200 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <span className="font-display text-base sm:text-lg text-teal-dark group-hover:text-teal-base transition-colors">
                {item.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 font-body px-2.5 py-1 rounded-full bg-slate-100">
                {item.count} Item
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-accent group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>

      {/* 1. Modal Postingan Disukai */}
      <Modal
        isOpen={activeModal === "likes"}
        onClose={() => setActiveModal(null)}
        className="max-w-lg text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>Postingan Disukai</span>
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Daftar diskusi dan postingan peternak lain yang telah Anda sukai.
        </p>

        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
            <span className="text-xs font-bold text-teal-base font-body">
              Komunitas Peternak Sapi Jawa Barat
            </span>
            <p className="text-sm font-display text-teal-dark">
              Tips Formula Silase Jagung Fermentasi 21 Hari Bobot Naik Maksimal
            </p>
            <span className="text-[11px] text-slate-400 font-body">
              Diposting oleh H. Mahmud • Disukai 3 hari lalu
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
            <span className="text-xs font-bold text-olive-dark font-body">
              Diskusi Dokter Hewan
            </span>
            <p className="text-sm font-display text-teal-dark">
              Protokol Isolasi Ternak Batuk Menular saat Musim Hujan Tiba
            </p>
            <span className="text-[11px] text-slate-400 font-body">
              Diposting oleh drh. Palupi Fitria • Disukai 1 minggu lalu
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveModal(null)}
          >
            Tutup
          </Button>
        </div>
      </Modal>

      {/* 2. Modal Komentar Saya */}
      <Modal
        isOpen={activeModal === "comments"}
        onClose={() => setActiveModal(null)}
        className="max-w-lg text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-base" />
          <span>Komentar Saya</span>
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Riwayat tanggapan dan partisipasi Anda pada forum komunitas peternak.
        </p>

        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
            <p className="text-xs text-slate-500 font-body">
              Pada thread:{" "}
              <strong className="text-teal-dark">
                Perbandingan pakan fermentasi vs hijauan segar
              </strong>
            </p>
            <p className="text-sm font-body text-teal-dark italic bg-white p-2.5 rounded-xl border border-slate-200">
              “Di kandang saya Bogor, silase rumput odot dicampur tetes tebu sangat efektif menjaga nafsu makan kambing saat hujan.”
            </p>
            <span className="text-[11px] text-slate-400 font-body">
              Dikirim 4 hari lalu • 12 Peternak menyukai komentar ini
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveModal(null)}
          >
            Tutup
          </Button>
        </div>
      </Modal>

      {/* 3. Modal Tersimpan */}
      <Modal
        isOpen={activeModal === "saved"}
        onClose={() => setActiveModal(null)}
        className="max-w-lg text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#739744] fill-[#739744]" />
          <span>Tersimpan (Saved)</span>
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Bookmark panduan rekam medis dan artikel edukasi peternakan pilihan.
        </p>

        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
            <span className="text-xs font-bold text-teal-base font-body">
              PANDUAN MEDIS RESMI
            </span>
            <p className="text-sm font-display text-teal-dark">
              Jadwal Vaksinasi Nasional Penyakit Mulut dan Kuku (PMK) 2026
            </p>
            <span className="text-[11px] text-slate-400 font-body">
              Disimpan dari Portal Kementan • 12 Agustus 2026
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
            <span className="text-xs font-bold text-olive-dark font-body">
              RESEP PAKAN
            </span>
            <p className="text-sm font-display text-teal-dark">
              Standar Nutrisi Konsentrat Penggemukan Sapi Potong Limosin
            </p>
            <span className="text-[11px] text-slate-400 font-body">
              Disimpan dari Balai Riset Peternakan • 02 Juli 2026
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveModal(null)}
          >
            Tutup
          </Button>
        </div>
      </Modal>

      {/* 4. Modal Baru Dihapus */}
      <Modal
        isOpen={activeModal === "deleted"}
        onClose={() => setActiveModal(null)}
        className="max-w-lg text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-slate-500" />
          <span>Baru Dihapus (Recently Deleted)</span>
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Item akan dihapus permanen dari sistem setelah 30 hari.
        </p>

        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-display text-teal-dark">
                Draft Rekam Ternak ID: SP-009
              </p>
              <span className="text-[11px] text-slate-400 font-body">
                Dihapus 2 hari lalu • Kadaluarsa dalam 28 hari
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveModal(null);
                setStatusModal({
                  isOpen: true,
                  title: "Data Berhasil Dipulihkan",
                  description:
                    "Draft data ternak SP-009 telah berhasil dikembalikan ke daftar aktif.",
                });
              }}
              className="flex items-center gap-1.5 text-xs text-teal-base hover:text-teal-dark"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pulihkan</span>
            </Button>
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveModal(null)}
          >
            Tutup
          </Button>
        </div>
      </Modal>

      {/* Status Modal Sukses */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        status="success"
        title={statusModal.title}
        description={statusModal.description}
        actionText="Selesai"
      />
    </div>
  );
}
