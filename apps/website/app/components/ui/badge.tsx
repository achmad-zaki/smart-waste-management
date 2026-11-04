import React from "react";
import { cn } from "~/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "mint" | "warm" | "forest" | "danger" | "neutral";
}

export function Badge({
  className,
  variant = "primary",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#259e73]/15 text-[#259e73] border-[#259e73]/30",
    mint: "bg-[#acebd4]/40 text-[#2e4a21] border-[#acebd4]",
    warm: "bg-[#f2bf87]/30 text-[#855115] border-[#f2bf87]/70",
    forest: "bg-[#2e4a21] text-white border-transparent",
    danger: "bg-red-50 text-red-700 border-red-200",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

