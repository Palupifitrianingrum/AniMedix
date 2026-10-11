"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

/** Pasang sekali di layout. Pesan dikirim lewat toast("...") dari store. */
export default function ToastHost() {
  const { message, seq, hide } = useToastStore();

  React.useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, 2800);
    return () => clearTimeout(t);
  }, [message, seq, hide]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed left-1/2 bottom-6 z-[60] -translate-x-1/2 max-w-[calc(100%-32px)] rounded-2xl bg-teal-dark px-5 py-3 text-sm font-body font-bold text-white shadow-xl transition-all duration-200",
        message ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      )}
    >
      {message}
    </div>
  );
}
