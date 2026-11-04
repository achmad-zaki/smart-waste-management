import React, { useState } from "react";
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
} from "lucide-react";
import {
  initialReports,
  categoryLabels,
  statusLabels,
  type ReportStatus,
} from "~/lib/mock-data";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const reportId = Number(id) || 101;
  const initial = initialReports.find((r) => r.id === reportId) || initialReports[0];

  const [report, setReport] = useState(initial);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(report.status);
  const [statusNote, setStatusNote] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const cat = categoryLabels[report.waste_category];
  const stat = statusLabels[report.status];

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const newHistory = {
      id: Date.now(),
      waste_report_id: report.id,
      changed_by_name: "Admin Dinas Lingkungan",
      old_status: report.status,
      new_status: selectedStatus,
      note: statusNote || `Status diperbarui menjadi ${statusLabels[selectedStatus].label}.`,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setReport({
      ...report,
      status: selectedStatus,
      updated_at: newHistory.created_at,
      status_histories: [...report.status_histories, newHistory],
    });

    setStatusNote("");
    setNotification("Status laporan dan catatan audit berhasil diperbarui!");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/reports">
            <Button variant="ghost" size="sm" className="gap-1.5 text-[#5d6f66] hover:text-[#2e4a21]">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Laporan
            </Button>
          </Link>
          <span className="text-[#c2d8cd]">|</span>
          <span className="font-mono text-xs font-bold text-[#2e4a21]">
            Laporan #{report.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${stat.bg} ${stat.text} ${stat.border}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Status: {stat.label}
          </span>
        </div>
      </div>

      {notification && (
        <div className="rounded-xl border border-[#259e73] bg-[#259e73]/10 p-4 text-xs font-medium text-[#2e4a21] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#259e73] shrink-0" />
          {notification}
        </div>
      )}

      {/* Main Grid: Details on Left, AI & Status Updates on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Photo, Descriptions, Location */}
        <div className="lg:col-span-7 space-y-6">
          {/* Waste Image Preview Card */}
          <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
            <div className="relative aspect-video w-full bg-black/5">
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
                  Klasifikasi: {cat.label}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-xl font-bold text-[#2e4a21] leading-tight">
                {report.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#5d6f66] border-y border-[#f0f4f2] py-3">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-[#259e73]" />
                  <span>Pelapor: <strong className="text-[#2e4a21]">{report.user_name}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#259e73]" />
                  <span>Diajukan: {report.created_at}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5d6f66]">
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
                <span className="font-semibold text-[#2e4a21] text-right">{report.address}</span>
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
                  {Math.round(report.confidence_score * 100)}%
                </span>
              </div>

              {/* Confidence Progress Bar */}
              <div className="h-3 w-full rounded-full bg-[#f0f4f2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#259e73] transition-all"
                  style={{ width: `${Math.round(report.confidence_score * 100)}%` }}
                />
              </div>

              <p className="text-[11px] text-[#5d6f66] leading-relaxed">
                Prediksi didapatkan dari endpoint microservice FastAPI dan telah terverifikasi sesuai dataset gambar sampah.
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

              <Button type="submit" variant="primary" className="w-full">
                <Send className="h-4 w-4 mr-1.5" />
                Simpan Perubahan
              </Button>
            </form>
          </div>

          {/* Audit Trail Timeline */}
          <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-[#2e4a21] mb-4">
              Riwayat Perubahan Status (Audit Trail)
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e2ebe6]">
              {report.status_histories.map((hist, idx) => (
                <div key={hist.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#259e73] shadow-xs" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2e4a21]">
                        {statusLabels[hist.new_status].label}
                      </span>
                      <span className="text-[10px] text-[#5d6f66]">{hist.created_at}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5d6f66] leading-relaxed">
                      {hist.note}
                    </p>
                    {hist.changed_by_name && (
                      <p className="mt-1 text-[10px] font-medium text-[#259e73]">
                        Oleh: {hist.changed_by_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

