import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Judul halaman (H1 Jua) + deskripsi + aksi opsional di kanan. */
export default function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h1 className="font-display text-4xl sm:text-[44px] leading-[1.15] tracking-tight text-teal-dark">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 font-body text-base font-bold text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
