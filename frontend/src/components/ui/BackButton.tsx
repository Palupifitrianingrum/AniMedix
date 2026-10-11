"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface BackButtonProps {
  /** Tujuan jika halaman dibuka langsung lewat URL (tanpa riwayat). */
  fallbackUrl: string;
  label?: string;
  className?: string;
}

/** Tombol "Kembali" seragam (guidline.md 3.2). Ikon mengikuti src/back-icon.svg Figma. */
export default function BackButton({ fallbackUrl, label = "Kembali", className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackUrl);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl bg-[#e9f6ec] py-2 pl-2 pr-5 font-display text-lg text-teal-dark transition-colors hover:bg-[#dcefe1] cursor-pointer",
        className
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-accent text-white">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.33} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M6.31 14.46a.33.33 0 0 1-.62-.02L1.35 1.77a.33.33 0 0 1 .42-.42l12.67 4.33a.33.33 0 0 1 .02.63L9.17 8.43a1.33 1.33 0 0 0-.74.74z" />
          <path d="M1.43 1.43l7.3 7.3" />
        </svg>
      </span>
      {label}
    </button>
  );
}
