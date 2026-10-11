import * as React from "react";
import { cn } from "@/lib/utils";

export interface QrPlaceholderProps {
  /** Angka acuan supaya pola QR stabil untuk transaksi yang sama. */
  seed: number;
  className?: string;
}

/** Kode QR simulasi (bukan QRIS sungguhan) untuk layar Pembayaran. */
export default function QrPlaceholder({ seed, className }: QrPlaceholderProps) {
  const path = React.useMemo(() => {
    const n = 29;
    let s = seed;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    let d = "";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const fx = x < 8 ? x : x > n - 9 ? x - (n - 8) : -1;
        const fy = y < 8 ? y : y > n - 9 ? y - (n - 8) : -1;
        let on: boolean;
        if (fx >= 0 && fy >= 0 && !(x > 7 && y > 7)) {
          on =
            fx < 7 &&
            fy < 7 &&
            (fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5));
        } else {
          on = rnd() > 0.5;
        }
        if (on) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return d;
  }, [seed]);

  return (
    <div
      role="img"
      aria-label="Kode QR simulasi"
      className={cn("w-56 h-56 p-3.5 rounded-2xl border border-border-hairline bg-white text-teal-dark", className)}
    >
      <svg viewBox="0 0 29 29" shapeRendering="crispEdges" className="w-full h-full">
        <path d={path} fill="currentColor" />
      </svg>
    </div>
  );
}
