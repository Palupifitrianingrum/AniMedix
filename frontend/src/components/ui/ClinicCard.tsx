import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Badge from "./Badge";
import Button from "./Button";
import Avatar from "./Avatar";
import { MapPin, Star, Navigation } from "lucide-react";

export interface ActiveDoctor {
  name: string;
  specialization: string;
  schedule: string;
  avatarUrl?: string;
}

export interface ClinicCardProps {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
  distanceKm?: number;
  rating: number;
  reviewCount?: number;
  openSchedule: string;
  services: string;
  activeDoctor?: ActiveDoctor;
  mapNavUrl?: string;
  /** Opsional: tautan ke halaman detail klinik. */
  detailHref?: string;
  className?: string;
}

export default function ClinicCard({
  name,
  address,
  isOpen,
  distanceKm,
  rating,
  reviewCount,
  openSchedule,
  services,
  activeDoctor,
  mapNavUrl,
  detailHref,
  className,
}: ClinicCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-card border border-border-hairline rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] hover:shadow-md transition-all duration-200 flex flex-col gap-5",
        className
      )}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge
            variant={isOpen ? "success" : "danger"}
            size="sm"
            shape="pill"
          >
            {isOpen ? "Buka Hari Ini" : "Tutup"}
          </Badge>
          {distanceKm !== undefined && (
            <span className="text-xs font-semibold text-slate-500 font-body">
              Jarak: {String(distanceKm).replace(".", ",")} km
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 font-body">
          <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
          <span>
            {String(rating).replace(".", ",")}
            {reviewCount !== undefined && ` (${reviewCount} ulasan)`}
          </span>
        </div>
      </div>

      {/* Main Content: Info & Map Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Info Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div>
            <h4 className="font-display text-xl text-teal-dark tracking-tight">
              {name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-body mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-teal-accent" />
              <span>{address}</span>
            </div>
          </div>

          <div className="space-y-1 text-xs font-body text-slate-600 pt-1">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400 font-medium">Jadwal Buka:</span>
              <span className="font-semibold text-teal-dark">{openSchedule}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-400 font-medium">Layanan:</span>
              <span className="font-semibold text-teal-dark">{services}</span>
            </div>
          </div>

          {/* Active Doctor In Clinic */}
          {activeDoctor && (
            <div className="mt-2 p-3 bg-teal-tint/50 border border-teal-accent/20 rounded-2xl flex items-center gap-3">
              <Avatar
                src={activeDoctor.avatarUrl}
                name={activeDoctor.name}
                size="md"
                colorPreset="teal"
              />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-teal-accent tracking-wider">
                  Praktik Dokter Aktif
                </span>
                <span className="font-display text-sm text-teal-dark">
                  {activeDoctor.name}
                </span>
                <span className="text-xs text-slate-500 font-body font-medium">
                  {activeDoctor.specialization} • {activeDoctor.schedule}
                </span>
              </div>
            </div>
          )}

          {detailHref && (
            <Link
              href={detailHref}
              className="self-start mt-1 inline-flex items-center rounded-xl border border-border-hairline bg-white px-4 py-2 text-xs font-bold text-teal-dark hover:bg-slate-50 transition-colors"
            >
              Lihat detail klinik
            </Link>
          )}
        </div>

        {/* Right Map Navigation Box (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-base flex items-center justify-center text-white shadow-sm">
            <Navigation className="w-6 h-6 stroke-[2]" />
          </div>

          <div>
            <h5 className="font-display text-base text-teal-dark">
              Peta Lokasi Klinik
            </h5>
            <p className="text-xs text-slate-500 font-body mt-0.5">
              Klik untuk membuka petunjuk arah via Google Maps
            </p>
          </div>

          <Button
            variant="teal"
            shape="rounded"
            size="sm"
            className="w-full text-xs py-2 mt-1"
            onClick={() => {
              if (mapNavUrl) {
                window.open(mapNavUrl, "_blank");
              } else {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${name} ${address}`
                  )}`,
                  "_blank"
                );
              }
            }}
          >
            Buka Rute Navigasi
          </Button>
        </div>
      </div>
    </div>
  );
}
