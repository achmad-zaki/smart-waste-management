import React from "react";
import { Link } from "react-router";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { CategoryBadge } from "~/components/common/category-badge";
import { StatusBadge } from "~/components/common/status-badge";
import { formatDate, truncate } from "~/lib/utils";
import type { WasteReport } from "~/types/report.types";

interface ReportCardProps {
  report: WasteReport;
  baseHref?: string; // e.g. "/user/reports" or "/admin/reports"
}

export function ReportCard({ report, baseHref = "/user/reports" }: ReportCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={report.image_url}
          alt={report.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <CategoryBadge category={report.waste_category} size="sm" />
          <StatusBadge status={report.status} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#2e4a21] line-clamp-1 group-hover:text-[#259e73] transition-colors">
            {report.title}
          </h3>
          <p className="text-xs text-[#5d6f66] line-clamp-2 leading-relaxed">
            {truncate(report.description, 100)}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-4 border-t border-[#e2ebe6] space-y-2 text-xs text-[#5d6f66]">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#259e73]" />
            <span className="truncate">{report.address}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-[11px] text-[#5d6f66]">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(report.created_at)}</span>
            </div>

            <Link
              to={`${baseHref}/${report.id}`}
              className="inline-flex items-center gap-1 font-semibold text-[#259e73] hover:underline"
            >
              <span>Detail</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

