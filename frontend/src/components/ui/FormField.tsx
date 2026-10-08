import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  error,
  helperText,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-teal-dark font-body font-bold text-sm tracking-wide">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-semantic-error font-body text-xs font-semibold mt-0.5">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-slate-500 font-body text-xs mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
