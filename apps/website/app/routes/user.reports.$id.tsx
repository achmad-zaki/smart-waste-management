import React from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import {
  categoryLabels,
  statusLabels,
} from "~/constants/report.constants";
import { ClientDate } from "~/components/common/client-date";
import { StatusBadge } from "~/components/common/status-badge";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import type { Route } from "./+types/user.reports.$id";
import { useDeleteReport, useReportDetail } from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Detail Laporan #${params.id} - Warga Smart Waste` },
    {
      name: "description",
      content: "Rincian status penanganan sampah, hasil klasifikasi AI, dan riwayat koordinasi dinas.",
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Spinner className="size-8 text-[#107549] mb-3" />
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
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/user/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#107549] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Riwayat Laporan</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {isPending && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{deleteMutation.isPending ? "Membatalkan..." : "Batalkan Laporan"}</span>
            </Button>
          )}

          <StatusBadge status={report.status} variant="elegant" />
        </div>
      </div>

      {/* 2-Columns Layout: Content Left, Actions Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Main Photo, Meta, Description, Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Photo & Main Identity */}
          <div className="rounded-2xl border border-[#e5e9e7] bg-white overflow-hidden shadow-xs">
            <div className="relative aspect-video w-full bg-gray-100">
              <img
                src={report.image_url}
                alt={report.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md bg-white/90 ${cat.badgeClass}`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#107549]" />
                  {cat.label}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-gray-400">
                    LAPORAN #{report.id}
                  </span>
                  <h1 className="text-xl font-bold text-[#181d1a] mt-0.5">
                    {report.title}
                  </h1>
                </div>
              </div>

              {/* Submitter & Date Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[#107549] font-bold">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-400">Kategori Sampah</p>
                    <p className="font-semibold text-[#181d1a]">{cat.label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-400">Waktu Pengajuan</p>
                    <p className="font-semibold text-[#181d1a]">
                      <ClientDate date={report.created_at} format="datetime" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Deskripsi Kondisi Sampah
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {report.description || "Tidak ada deskripsi tambahan dari pelapor."}
                </p>
              </div>
            </div>
          </div>

          {/* Location & GPS Info */}
          <div className="rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#107549]/10 text-[#107549]">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-[#181d1a]">
                Informasi Lokasi & Koordinat GPS
              </h3>
            </div>

            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Alamat Titik Sampah:</span>
                <span className="font-semibold text-[#181d1a] text-right">
                  {report.address || "Area Pelaporan"}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-100">
                <span className="text-gray-400">Latitude:</span>
                <span className="font-mono font-medium text-[#181d1a]">{report.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Longitude:</span>
                <span className="font-mono font-medium text-[#181d1a]">{report.longitude}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): AI Score, Progress Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI MobileNetV2 Prediction Card */}
          <div className="rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#181d1a] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#107549]" />
                Hasil Klasifikasi AI
              </span>
              <span className="text-[11px] font-bold text-[#107549] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                MobileNetV2
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-[#181d1a]">{cat.label}</span>
                <span className="text-base font-extrabold text-[#107549]">
                  {confidencePercent}%
                </span>
              </div>

              {/* Confidence Progress Bar */}
              <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#107549] transition-all"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Prediksi otomatis dideteksi dari foto sampah Anda menggunakan model Computer Vision cerdas.
              </p>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Clock className="h-4 w-4 text-[#107549]" />
              <h3 className="text-sm font-bold text-[#181d1a]">
                Riwayat Penanganan Dinas
              </h3>
            </div>

            {statusHistories.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                Belum ada riwayat pembaruan status dari dinas kebersihan.
              </p>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {statusHistories.map((hist) => {
                  const histStat = statusLabels[hist.new_status] || { label: hist.new_status };
                  const actor = hist.changed_by?.name || hist.changed_by_name || "Petugas Sistem";

                  return (
                    <div key={hist.id} className="relative">
                      <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#107549] shadow-xs" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#181d1a]">
                            {histStat.label}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            <ClientDate date={hist.created_at} format="datetime" />
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                          {hist.note || "Status diperbarui."}
                        </p>
                        {actor && (
                          <p className="mt-1 text-[10px] font-semibold text-[#107549]">
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
