import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "teal" | "olive" | "orange";
  className?: string;
}

export default function StatCard({
  label,
  value,
  variant = "teal",
  className,
}: StatCardProps) {
  const variantStyles = {
    teal: "bg-teal-tint border-teal-base/20 text-teal-base",
    olive: "bg-olive-wash border-olive-base/20 text-olive-dark",
    orange: "bg-[#fff7ed] border-[#fed7aa] text-[#ea580c]",
  };

  return (
    <div
      className={cn(
        "rounded-3xl border p-6 flex flex-col items-center justify-center text-center shadow-xs",
        variantStyles[variant],
        className
      )}
    >
      <span className="text-xs uppercase font-bold tracking-wider font-body opacity-80 mb-1">
        {label}
      </span>
      <span className="font-display text-3xl md:text-4xl tracking-tight">
        {value}
      </span>
    </div>
  );
}
