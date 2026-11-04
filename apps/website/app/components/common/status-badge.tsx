import React from "react";
import { Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ReportStatus } from "~/types/report.types";

interface StatusBadgeProps {
  status: ReportStatus;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  ReportStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    dotClass: string;
  }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    icon: Clock,
    className: "bg-[#f2bf87]/20 text-[#8a5518] border-[#f2bf87]/60",
    dotClass: "bg-[#8a5518]",
  },
  in_progress: {
    label: "Sedang Ditangani",
    icon: RefreshCw,
    className: "bg-[#259e73]/15 text-[#1c7454] border-[#259e73]/40",
    dotClass: "bg-[#1c7454]",
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle2,
    className: "bg-[#acebd4]/50 text-[#2e4a21] border-[#acebd4]",
    dotClass: "bg-[#2e4a21]",
  },
  rejected: {
    label: "Ditolak",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-600",
  },
};

export function StatusBadge({
  status,
  showIcon = true,
  className,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5 font-medium";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border shadow-2xs transition-colors",
        sizeClasses,
        config.className,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
            status === "in_progress" && "animate-spin"
          )}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}

