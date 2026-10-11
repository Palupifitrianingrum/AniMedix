import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: (SelectOption | string)[];
  size?: "md" | "sm";
}

/** Dropdown dengan tampilan yang sama seperti <Input> (permukaan input-bg, rounded-2xl). */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, size = "md", ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-2xl bg-input-bg pl-5 pr-11 font-body font-bold text-teal-dark shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:bg-white cursor-pointer",
          size === "md" ? "h-13 text-base" : "h-10 text-sm rounded-xl pl-4",
          className
        )}
        {...props}
      >
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
    </div>
  )
);

Select.displayName = "Select";

export default Select;
