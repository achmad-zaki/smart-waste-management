import React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2ebe6] bg-[#fcfcfc] p-10 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#acebd4]/30 text-[#259e73] mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-[#2e4a21]">{title}</h3>
      <p className="mt-1 text-sm text-[#5d6f66] max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

