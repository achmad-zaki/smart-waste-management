import React from "react";
import { Leaf, Package, FileText } from "lucide-react";
import { cn } from "~/lib/utils";
import type { WasteCategory } from "~/types/report.types";

interface CategoryBadgeProps {
  category: WasteCategory;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

const categoryConfig: Record<
  WasteCategory,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  organic: {
    label: "Organik",
    icon: Leaf,
    className: "bg-[#acebd4]/40 text-[#2e4a21] border-[#acebd4]",
  },
  plastic: {
    label: "Plastik",
    icon: Package,
    className: "bg-[#259e73]/15 text-[#259e73] border-[#259e73]/30",
  },
  paper: {
    label: "Kertas",
    icon: FileText,
    className: "bg-[#f2bf87]/30 text-[#8f5919] border-[#f2bf87]",
  },
};

export function CategoryBadge({
  category,
  showIcon = true,
  className,
  size = "md",
}: CategoryBadgeProps) {
  const config = categoryConfig[category] || categoryConfig.plastic;
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
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
      <span>{config.label}</span>
    </span>
  );
}

