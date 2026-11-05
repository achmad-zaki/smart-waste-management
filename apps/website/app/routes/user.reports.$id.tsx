import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  categoryLabels,
  statusLabels,
} from "~/constants/report.constants";
import { ClientDate } from "~/components/common/client-date";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import type { Route } from "./+types/user.reports.$id";
import { useDeleteReport, useReportDetail } from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Detail Laporan #${params.id} - Smart Waste Management` },
    {
      name: "description",
      content: "Rincian status penanganan sampah dan riwayat koordinasi dinas.",
    },
  ];
}

export default function UserReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportId = Number(id) || 0;

  const { data: report, isLoading, isError, error, refetch } = useReportDetail(reportId);
  const deleteMutation = useDeleteReport();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#5d6f66]">
        <Spinner className="size-8 text-[#259e73] mb-3" />
        <p className="text-sm font-medium">Memuat rincian laporan #{id}...</p>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold text-red-800">Laporan tidak ditemukan</h3>
        <p className="text-sm text-red-600 mt-1">{getApiErrorMessage(error)}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
          <Link to="/user/reports">
            <Button size="sm" variant="primary">
              Kembali ke Riwayat
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cat = categoryLabels[report.waste_category] || {
    label: report.waste_category,
    badgeClass: "bg-gray-100 text-gray-800",
  };
  const stat = statusLabels[report.status] || {
    label: report.status,
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  };

  const isPending = report.status === "pending";
  const confidencePercent = report.confidence_score
    ? Math.round(report.confidence_score * 100)
    : 0;
  const statusHistories = report.status_histories || [];

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan dan menghapus laporan ini?")) {
      deleteMutation.mutate(report.id, {
        onSuccess: () => {
          navigate("/user/reports");
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/user/reports">
            <Button variant="ghost" size="sm" className="gap-1.5 text-[#5d6f66] hover:text-[#2e4a21]">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Riwayat
            </Button>
          </Link>
          <span className="text-[#c2d8cd]">|</span>
          <span className="font-mono text-xs font-bold text-[#2e4a21]">
            Laporan #{report.id}
          </span>
        </div>

        {/* If pending, citizen can cancel */}
        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{deleteMutation.isPending ? "Membatalkan..." : "Batalkan Laporan"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
        {/* Photo with Overlay Badge */}
        <div className="relative aspect-video w-full bg-black/5 max-h-[380px]">
          <img
            src={report.image_url}
            alt={report.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md border ${cat.badgeClass} bg-white/95 backdrop-blur-xs`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#259e73]" />
              {cat.label} {confidencePercent > 0 ? `(${confidencePercent}%)` : ""}
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md border ${stat.bg} ${stat.text} ${stat.border} bg-white/95 backdrop-blur-xs`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              Status: {stat.label}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#2e4a21]">
              {report.title}
            </h1>
            <p className="mt-1 text-xs text-[#5d6f66] flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#259e73]" />
              Diajukan pada <ClientDate date={report.created_at} format="datetime" />
            </p>
          </div>

          {/* Location details */}
          <div className="rounded-xl bg-[#f5f8f6] p-4 border border-[#e2ebe6] text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#2e4a21]">
              <MapPin className="h-4 w-4 text-[#259e73]" />
              Lokasi Titik Sampah
            </div>
            <p className="text-[#5d6f66]">{report.address || "Koordinat GPS"}</p>
            <div className="flex gap-4 text-[#889990] font-mono text-[11px] pt-1 border-t border-[#e2ebe6]">
              <span>Latitude: {report.latitude}</span>
              <span>Longitude: {report.longitude}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5d6f66]">
              Deskripsi dari Pelapor
            </h3>
            <p className="text-sm text-[#2e4a21] leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* Progress Timeline */}
          <div className="pt-6 border-t border-[#f0f4f2]">
            <h3 className="text-sm font-bold text-[#2e4a21] mb-4">
              Perkembangan Penanganan oleh Dinas
            </h3>

            {statusHistories.length === 0 ? (
              <p className="text-xs text-[#5d6f66]">Belum ada pembaruan status dari dinas.</p>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e2ebe6]">
                {statusHistories.map((hist) => {
                  const histStat = statusLabels[hist.new_status] || { label: hist.new_status };
                  const actor = hist.changed_by?.name || hist.changed_by_name || "Petugas Sistem";

                  return (
                    <div key={hist.id} className="relative">
                      <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#259e73] shadow-xs" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2e4a21]">
                            {histStat.label}
                          </span>
                          <span className="text-[10px] text-[#5d6f66]">
                            <ClientDate date={hist.created_at} format="datetime" />
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#5d6f66] leading-relaxed">
                          {hist.note || "Status diperbarui."}
                        </p>
                        {actor && (
                          <p className="mt-1 text-[10px] font-medium text-[#259e73]">
                            Petugas: {actor}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
