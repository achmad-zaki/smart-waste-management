import React from "react";
import { cn } from "~/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "mint"
    | "warm"
    | "forest"
    | "outline"
    | "ghost"
    | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#259e73] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#259e73] hover:bg-[#1f8561] text-white shadow-xs",
      mint:
        "bg-[#acebd4] hover:bg-[#97d8c0] text-[#2e4a21] shadow-xs",
      warm:
        "bg-[#f2bf87] hover:bg-[#e4b075] text-[#2e4a21] shadow-xs",
      forest:
        "bg-[#2e4a21] hover:bg-[#223719] text-white shadow-xs",
      outline:
        "border border-[#259e73] text-[#259e73] hover:bg-[#259e73]/10 bg-transparent",
      ghost:
        "text-[#2e4a21] hover:bg-[#acebd4]/20 bg-transparent",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-xs",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

