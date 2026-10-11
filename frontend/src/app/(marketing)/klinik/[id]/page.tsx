"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navigation, Building2, Star } from "lucide-react";
import { BackButton, Badge } from "@/components/ui";
import { CLINICS, mapsEmbedUrl, mapsSearchUrl } from "@/data/clinics";

/* Klinik Terdekat.png - detail klinik, peta, praktik dokter & jadwal */

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b border-border-hairline py-3 text-sm last:border-0">
      <span className="font-bold text-slate-500">{label}</span>
      <span className="text-right font-bold text-teal-dark">{value}</span>
    </div>
  );
}

export default function DetailKlinikPage() {
  const { id } = useParams<{ id: string }>();
  const clinic = CLINICS.find((c) => c.id === id);

  if (!clinic) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <h1 className="font-display text-3xl text-teal-dark">Klinik tidak ditemukan</h1>
        <p className="text-slate-500">Klinik yang kamu cari mungkin sudah tidak terdaftar.</p>
        <Link href="/klinik" className="mt-2 rounded-2xl bg-teal-accent px-6 py-3 font-bold text-white hover:bg-teal-base">
          Lihat daftar klinik
        </Link>
      </div>
    );
  }

  return (
    <>
      <title>{`AniMedix — ${clinic.name}`}</title>
      <BackButton fallbackUrl="/klinik" className="mb-6" />

      <section className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-border-hairline bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Info klinik */}
        <div className="flex flex-col gap-4 border-b border-border-hairline p-7 lg:border-b-0 lg:border-r">
          <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-[#d9d9d9] text-slate-500">
            <Building2 className="h-20 w-20 stroke-[1.4]" aria-hidden="true" />
          </div>
          <Badge variant={clinic.isOpen ? "success" : "danger"} size="sm" className="self-start">
            {clinic.isOpen ? "Buka Hari Ini" : "Tutup"}
          </Badge>
          <h1 className="font-display text-3xl leading-tight text-teal-dark">{clinic.name}</h1>
          <div>
            <InfoRow label="Jadwal Buka" value={clinic.openSchedule} />
            <InfoRow label="Alamat" value={clinic.address} />
            <InfoRow label="Layanan" value={clinic.services} />
            <InfoRow
              label="Rating"
              value={
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" aria-hidden="true" />
                  {String(clinic.rating).replace(".", ",")} / 5,00
                </span>
              }
            />
          </div>
        </div>

        {/* Peta & jadwal */}
        <div className="flex flex-col gap-5 p-7">
          <iframe
            title={`Peta ${clinic.name}`}
            src={mapsEmbedUrl(clinic)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full rounded-3xl border border-border-hairline bg-slate-100"
          />
          <a
            href={mapsSearchUrl(clinic)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-teal-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-teal-base"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Buka Rute Navigasi
          </a>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <span className="self-start rounded-full bg-teal-dark px-4 py-1.5 font-display text-sm text-white">Praktik Dokter</span>
              <div className="flex flex-col gap-3 rounded-2xl bg-[#e8f7f9] p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Nama</span>
                  <span className="text-right font-display text-base text-teal-dark">{clinic.vet.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Bidang Keahlian</span>
                  <span className="text-right font-bold text-teal-dark">Spesialis {clinic.vet.specialization}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="self-start rounded-full bg-teal-dark px-4 py-1.5 font-display text-sm text-white">Jadwal Praktik</span>
              <div className="flex flex-col gap-3 rounded-2xl bg-[#e8f7f9] p-4 text-sm">
                {clinic.weeklySchedule.map(([day, time]) => (
                  <div key={day} className="flex justify-between gap-4">
                    <span className="font-bold text-slate-500">{day}</span>
                    <span className="font-bold text-teal-dark">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
