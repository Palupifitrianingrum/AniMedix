import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "teal" | "coral" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  shape?: "pill" | "rounded";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      shape = "pill",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none";

    const variantStyles = {
      primary:
        "bg-olive-base text-white hover:bg-olive-dark hover:scale-[1.02] shadow-sm",
      teal: "bg-teal-accent text-white hover:bg-teal-base hover:scale-[1.02] shadow-sm",
      coral:
        "bg-coral-accent text-white hover:bg-coral-soft hover:scale-[1.02] shadow-sm",
      outline:
        "border border-border-hairline bg-white text-teal-dark hover:bg-slate-50 hover:border-slate-300",
      danger:
        "bg-semantic-error text-white hover:bg-red-700 hover:scale-[1.02] shadow-sm",
      ghost:
        "bg-transparent text-teal-dark hover:bg-teal-tint/50",
    };

    const sizeStyles = {
      sm: "text-sm px-4 py-2 gap-1.5",
      md: "text-base px-6 py-2.5 gap-2",
      lg: "text-lg px-8 py-3.5 gap-2.5",
    };

    const shapeStyles = {
      pill: "rounded-full",
      rounded: "rounded-2xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          shapeStyles[shape],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
