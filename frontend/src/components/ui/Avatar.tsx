import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  status?: "online" | "offline";
  colorPreset?: "teal" | "olive" | "neutral" | "amber";
}

function getInitials(name?: string): string {
  if (!name) return "?";
  // Abaikan gelar di depan nama (Dr., dr., drh., Ir.) dan gelar di belakang koma.
  const clean = name.replace(/^((Dr|dr|drh|Ir)\.\s*)+/i, "").split(",")[0];
  const parts = (clean.trim() || name.trim()).split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (parts.length === 2)
    return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0][0] + parts[1][0] + parts[2][0]).toUpperCase().slice(0, 3);
}

export default function Avatar({
  className,
  src,
  name = "",
  size = "md",
  status,
  colorPreset = "teal",
  ...props
}: AvatarProps) {
  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
    "2xl": "w-28 h-28 text-3xl",
  };

  const statusDotSizes = {
    sm: "w-2.5 h-2.5 ring-1.5",
    md: "w-3.5 h-3.5 ring-2",
    lg: "w-4 h-4 ring-2",
    xl: "w-5 h-5 ring-3",
    "2xl": "w-7 h-7 ring-4",
  };

  const presetBgStyles = {
    teal: "bg-teal-base text-white",
    olive: "bg-olive-base text-white",
    neutral: "bg-slate-300 text-teal-dark",
    amber: "bg-amber-500 text-white",
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full shrink-0 select-none overflow-visible font-bold font-body",
        sizeStyles[size],
        !src && presetBgStyles[colorPreset],
        className
      )}
      {...props}
    >
      {src ? (
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src={src}
            alt={name || "Avatar"}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <span className="tracking-tight">{initials}</span>
      )}

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-white",
            statusDotSizes[size],
            status === "online" ? "bg-emerald-500" : "bg-rose-500"
          )}
          aria-label={status}
        />
      )}
    </div>
  );
}
