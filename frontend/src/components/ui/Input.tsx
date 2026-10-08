"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, leftIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";

    const actualType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={actualType}
          className={cn(
            "w-full h-13 px-5 py-3 rounded-2xl bg-input-bg text-teal-dark placeholder:text-slate-400 font-body text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:bg-white shadow-inner",
            leftIcon && "pl-12",
            isPasswordType && "pr-12",
            error && "ring-2 ring-semantic-error bg-red-50/50",
            className
          )}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-dark p-1 cursor-pointer transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
