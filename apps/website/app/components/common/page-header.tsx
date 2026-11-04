import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "~/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Kembali",
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6",
        className
      )}
    >
      <div className="space-y-1">
        {backHref && (
          <Link
            to={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5d6f66] hover:text-[#2e4a21] transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[#5d6f66] max-w-2xl">{description}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}

