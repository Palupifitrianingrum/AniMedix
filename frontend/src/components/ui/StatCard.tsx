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
    teal: "bg-[#ddf2f5] border-[#bee2e7] text-[#1b4e54]",
    olive: "bg-[#edf3d7] border-[#d9e5b2] text-[#4f6b21]",
    orange: "bg-[#fee4cb] border-[#fdcb9c] text-[#bf5a15]",
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
