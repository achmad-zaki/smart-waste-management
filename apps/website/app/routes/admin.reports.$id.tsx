import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Send,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import {
  categoryLabels,
  statusLabels,
} from "~/constants/report.constants";
import type { ReportStatus } from "~/types/report.types";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import type { Route } from "./+types/admin.reports.$id";
import {
  useReportDetail,
  useUpdateReportStatus,
} from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Detail Laporan #${params.id} - Admin Smart Waste` },
    {
      name: "description",
      content: "Detail verifikasi laporan sampah, koordinat GPS, dan riwayat status penanganan.",
    },
  ];
}

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const reportId = Number(id) || 0;

  const { data: report, isLoading, isError, error, refetch } = useReportDetail(reportId);
  const updateStatusMutation = useUpdateReportStatus();

  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>("pending");
  const [statusNote, setStatusNote] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (report?.status) {
      setSelectedStatus(report.status);
    }
  }, [report?.status]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#5d6f66]">
        <Spinner className="size-8 text-[#259e73] mb-3" />
        <p className="text-sm font-medium">Memuat detail laporan #{id}...</p>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold text-red-800">Laporan tidak ditemukan atau gagal dimuat</h3>
        <p className="text-sm text-red-600 mt-1">{getApiErrorMessage(error)}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
          <Link to="/admin/reports">
            <Button size="sm" variant="primary">
              Kembali ke Daftar
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
  const reporterName = report.user?.name || report.user_name || "Warga";
  const confidencePercent = report.confidence_score
    ? Math.round(report.confidence_score * 100)
    : 0;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();

    updateStatusMutation.mutate(
      {
        id: report.id,
        status: selectedStatus,
        note: statusNote || `Status diperbarui menjadi ${statusLabels[selectedStatus]?.label || selectedStatus}.`,
      },
      {
        onSuccess: () => {
          setStatusNote("");
          setNotification("Status laporan dan catatan audit berhasil diperbarui!");
          setTimeout(() => setNotification(null), 4000);
        },
      }
    );
  };

  const statusHistories = report.status_histories || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5d6f66] hover:text-[#259e73] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Semua Laporan</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stat.bg} ${stat.text} ${stat.border}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {stat.label}
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 text-sm text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Mutation Error Alert */}
      {updateStatusMutation.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>Gagal memperbarui status: {getApiErrorMessage(updateStatusMutation.error)}</span>
        </div>
      )}

      {/* 2-Columns Layout: Content Left, Actions Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Main Photo, Meta, Description, Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Photo & Main Identity */}
          <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
            <div className="relative aspect-video w-full bg-[#f0f4f2]">
              <img
                src={report.image_url}
                alt={report.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md bg-white/90 ${cat.badgeClass}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {cat.label}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between border-b border-[#f0f4f2] pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#5d6f66]">
                    LAPORAN #{report.id}
                  </span>
                  <h1 className="text-xl font-bold text-[#2e4a21] mt-0.5">
                    {report.title}
                  </h1>
                </div>
              </div>

              {/* Submitter & Date Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-[#f0f4f2] text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#acebd4] text-[#2e4a21] font-bold">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[#5d6f66]">Pelapor</p>
                    <p className="font-semibold text-[#2e4a21]">{reporterName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f2] text-[#5d6f66]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[#5d6f66]">Waktu Laporan</p>
                    <p className="font-semibold text-[#2e4a21]">
                      {report.created_at ? new Date(report.created_at).toLocaleString("id-ID") : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f66] mb-2">
                  Deskripsi Kondisi Sampah
                </h3>
                <p className="text-sm text-[#2e4a21] leading-relaxed">
                  {report.description}
                </p>
              </div>
            </div>
          </div>

          {/* Location & GPS Info */}
          <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#259e73]/15 text-[#259e73]">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#2e4a21]">
                Informasi Lokasi & Koordinat GPS
              </h3>
            </div>

            <div className="rounded-lg bg-[#f5f8f6] p-4 border border-[#e2ebe6] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#5d6f66]">Alamat Terdeteksi:</span>
                <span className="font-semibold text-[#2e4a21] text-right">
                  {report.address || "Tidak ada rincian alamat"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5d6f66]">Latitude:</span>
                <span className="font-mono font-medium text-[#2e4a21]">{report.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5d6f66]">Longitude:</span>
                <span className="font-mono font-medium text-[#2e4a21]">{report.longitude}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): AI Score, Update Form, Audit Trail */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI MobileNetV2 Prediction Card */}
          <div className="rounded-xl border border-[#acebd4] bg-[#fcfcfc] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#2e4a21] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#259e73]" />
                Hasil Klasifikasi AI
              </span>
              <span className="text-[11px] font-bold text-[#259e73] bg-[#259e73]/10 px-2 py-0.5 rounded-full">
                MobileNetV2
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-[#2e4a21]">{cat.label}</span>
                <span className="text-base font-extrabold text-[#259e73]">
                  {confidencePercent}%
                </span>
              </div>

              {/* Confidence Progress Bar */}
              <div className="h-3 w-full rounded-full bg-[#f0f4f2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#259e73] transition-all"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>

              <p className="text-[11px] text-[#5d6f66] leading-relaxed">
                Prediksi didapatkan dari endpoint microservice model AI dan telah terverifikasi sesuai dataset gambar sampah.
              </p>
            </div>
          </div>

          {/* Form Update Status */}
          <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f0f4f2]">
              <ShieldCheck className="h-5 w-5 text-[#259e73]" />
              <h3 className="text-sm font-semibold text-[#2e4a21]">
                Tindakan Petugas / Perbarui Status
              </h3>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <Label htmlFor="status" required>
                  Status Penanganan
                </Label>
                <div className="mt-1.5">
                  <Select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ReportStatus)}
                  >
                    <option value="pending">Menunggu Verifikasi (Pending)</option>
                    <option value="in_progress">Sedang Ditangani (In Progress)</option>
                    <option value="completed">Selesai Ditangani (Completed)</option>
                    <option value="rejected">Tolak Laporan (Rejected)</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="note">Catatan Tambahan untuk Warga</Label>
                <div className="mt-1.5">
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder="Contoh: Tim kebersihan zona barat telah diberangkatkan..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Spinner className="mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1.5" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Audit Trail Timeline */}
          <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-[#2e4a21] mb-4">
              Riwayat Perubahan Status (Audit Trail)
            </h3>

            {statusHistories.length === 0 ? (
              <p className="text-xs text-[#5d6f66]">Belum ada riwayat perubahan status.</p>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e2ebe6]">
                {statusHistories.map((hist) => {
                  const histStat = statusLabels[hist.new_status] || { label: hist.new_status };
                  const actor = hist.changed_by?.name || hist.changed_by_name || "Petugas Sistem";

                  return (
                    <div key={hist.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#259e73] shadow-xs" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2e4a21]">
                            {histStat.label}
                          </span>
                          <span className="text-[10px] text-[#5d6f66]">
                            {hist.created_at ? new Date(hist.created_at).toLocaleString("id-ID") : "-"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#5d6f66] leading-relaxed">
                          {hist.note || "Perubahan status dicatat."}
                        </p>
                        {actor && (
                          <p className="mt-1 text-[10px] font-medium text-[#259e73]">
                            Oleh: {actor}
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
