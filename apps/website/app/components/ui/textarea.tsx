import React from "react";
import { cn } from "~/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[90px] w-full rounded-lg border border-[#e2ebe6] bg-[#fcfcfc] px-3.5 py-2.5 text-sm text-[#2e4a21] placeholder:text-[#889990] transition-colors hover:border-[#c2d8cd] focus-visible:outline-none focus-visible:border-[#259e73] focus-visible:ring-2 focus-visible:ring-[#259e73]/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

