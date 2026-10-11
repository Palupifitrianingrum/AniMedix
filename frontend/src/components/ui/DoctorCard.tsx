import * as React from "react";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Button from "./Button";
import { Star } from "lucide-react";

export interface DoctorCardProps {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experienceYears: number;
  /** Opsional: tidak semua dokter punya catatan jumlah konsultasi. */
  consultationCount?: number;
  fee: number;
  isOnline: boolean;
  avatarUrl?: string;
  colorPreset?: "teal" | "olive" | "neutral" | "amber";
  onConsult?: (id: string) => void;
  className?: string;
}

export default function DoctorCard({
  id,
  name,
  specialization,
  rating,
  experienceYears,
  consultationCount,
  fee,
  isOnline,
  avatarUrl,
  colorPreset = "olive",
  onConsult,
  className,
}: DoctorCardProps) {
  const formattedFee = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(fee);

  return (
    <div
      className={cn(
        "bg-surface-card border border-border-hairline rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
        className
      )}
    >
      {/* Left: Avatar & Doctor Info */}
      <div className="flex items-start md:items-center gap-4.5 flex-1">
        <Avatar
          src={avatarUrl}
          name={name}
          size="xl"
          status={isOnline ? "online" : "offline"}
          colorPreset={colorPreset}
          className="shrink-0"
        />

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-lg md:text-xl text-teal-dark tracking-tight">
              {name}
            </h4>
            <Badge
              variant={isOnline ? "success" : "danger"}
              size="sm"
              shape="pill"
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          <p className="text-teal-base font-body font-bold text-sm">
            {specialization}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-body text-slate-500 font-semibold mt-1">
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              {rating.toFixed(2)}
            </span>
            <span>•</span>
            <span>Pengalaman {experienceYears} Tahun</span>
            {consultationCount !== undefined && (
              <>
                <span>•</span>
                <span>{consultationCount.toLocaleString("id-ID")}+ Konsultasi Selesai</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Fee & Action Button */}
      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="text-left md:text-right">
          <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold font-body">
            Biaya Konsultasi
          </span>
          <span className="font-display text-2xl text-teal-dark">
            {formattedFee}
          </span>
        </div>

        <Button
          variant="primary"
          shape="rounded"
          size="md"
          className="px-6 py-2.5 text-sm"
          disabled={!isOnline}
          title={isOnline ? undefined : "Dokter sedang offline"}
          onClick={() => onConsult && onConsult(id)}
        >
          {isOnline ? "Konsultasi Sekarang" : "Sedang Offline"}
        </Button>
      </div>
    </div>
  );
}
