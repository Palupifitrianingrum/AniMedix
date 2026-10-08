import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "success"
    | "danger"
    | "warning"
    | "teal"
    | "olive"
    | "neutral"
    | "id-tag";
  shape?: "pill" | "rounded";
  size?: "sm" | "md";
  showDot?: boolean;
}

export default function Badge({
  className,
  variant = "neutral",
  shape = "pill",
  size = "md",
  showDot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    danger: "bg-rose-100 text-rose-800 border border-rose-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    teal: "bg-teal-tint text-teal-base border border-teal-accent/30",
    olive: "bg-olive-wash text-olive-dark border border-olive-base/30",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
    "id-tag": "bg-olive-dark text-white font-mono shadow-sm",
  };

  const dotColors = {
    success: "bg-emerald-500",
    danger: "bg-rose-500",
    warning: "bg-amber-500",
    teal: "bg-teal-accent",
    olive: "bg-olive-base",
    neutral: "bg-slate-400",
    "id-tag": "bg-white",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 gap-1.5",
    md: "text-sm px-3.5 py-1 gap-2",
  };

  const shapeStyles = {
    pill: "rounded-full",
    rounded: "rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold tracking-tight select-none",
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[shape],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn("w-2 h-2 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
