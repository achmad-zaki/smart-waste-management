import React from "react";
import { cn } from "~/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBgClass = "bg-[#259e73]/15 text-[#259e73]",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5d6f66]">
          {title}
        </span>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBgClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-[#2e4a21] sm:text-3xl">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold",
              trend.isPositive ? "text-[#259e73]" : "text-red-600"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-xs text-[#5d6f66]">{description}</p>
      )}
    </div>
  );
}

