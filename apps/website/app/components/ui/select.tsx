import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-lg border border-[#e2ebe6] bg-[#fcfcfc] px-3.5 py-2 pr-9 text-sm text-[#2e4a21] transition-colors hover:border-[#c2d8cd] focus-visible:outline-none focus-visible:border-[#259e73] focus-visible:ring-2 focus-visible:ring-[#259e73]/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#5d6f66]" />
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

