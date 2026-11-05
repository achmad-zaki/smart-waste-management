import React from "react";
import { Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ReportStatus } from "~/types/report.types";

export interface StatusBadgeProps {
  status: ReportStatus;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
  variant?: "default" | "elegant";
  customLabel?: string;
}

const statusConfig: Record<
  ReportStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    elegantClassName: string;
    elegantLabel: string;
    dotClass: string;
  }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    elegantLabel: "Menunggu",
    icon: Clock,
    className: "bg-[#f2bf87]/20 text-[#8a5518] border-[#f2bf87]/60",
    elegantClassName: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]",
    dotClass: "bg-[#8a5518]",
  },
  in_progress: {
    label: "Sedang Ditangani",
    elegantLabel: "Diproses",
    icon: RefreshCw,
    className: "bg-[#259e73]/15 text-[#1c7454] border-[#259e73]/40",
    elegantClassName: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]",
    dotClass: "bg-[#1c7454]",
  },
  completed: {
    label: "Selesai",
    elegantLabel: "Selesai",
    icon: CheckCircle2,
    className: "bg-[#acebd4]/50 text-[#2e4a21] border-[#acebd4]",
    elegantClassName: "bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]",
    dotClass: "bg-[#2e4a21]",
  },
  rejected: {
    label: "Ditolak",
    elegantLabel: "Ditolak",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
    elegantClassName: "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]",
    dotClass: "bg-red-600",
  },
};

export function StatusBadge({
  status,
  showIcon,
  className,
  size = "md",
  variant = "default",
  customLabel,
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  const isElegant = variant === "elegant";

  // In elegant variant, default to no icon like the reference image unless explicitly specified
  const shouldShowIcon = showIcon !== undefined ? showIcon : !isElegant;

  const sizeClasses = isElegant
    ? size === "sm"
      ? "text-[11px] px-2.5 py-0.5"
      : "text-xs px-3.5 py-1 font-medium"
    : size === "sm"
      ? "text-xs px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5 font-medium";

  const label = customLabel || (isElegant ? config.elegantLabel : config.label);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border transition-colors",
        isElegant ? "rounded-lg" : "rounded-full shadow-2xs",
        sizeClasses,
        isElegant ? config.elegantClassName : config.className,
        className
      )}
    >
      {shouldShowIcon && (
        <Icon
          className={cn(
            size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
            "mr-1.5",
            status === "in_progress" && "animate-spin"
          )}
        />
      )}
      <span>{label}</span>
    </span>
  );
}
