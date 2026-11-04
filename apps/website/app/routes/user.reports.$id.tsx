import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit3,
  AlertTriangle,
  Send,
} from "lucide-react";
import {
  initialReports,
  categoryLabels,
  statusLabels,
} from "~/lib/mock-data";
import { Button } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export default function UserReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportId = Number(id) || 101;
  const initial = initialReports.find((r) => r.id === reportId) || initialReports[0];

  const [report, setReport] = useState(initial);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(report.title);
  const [editDescription, setEditDescription] = useState(report.description);

  const cat = categoryLabels[report.waste_category];
  const stat = statusLabels[report.status];

  const isPending = report.status === "pending";

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setReport({
      ...report,
      title: editTitle,
      description: editDescription,
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
    });
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan dan menghapus laporan ini?")) {
      const idx = initialReports.findIndex((r) => r.id === report.id);
      if (idx !== -1) initialReports.splice(idx, 1);
      navigate("/user/reports");
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

        {/* If pending, citizen can edit or cancel */}
        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-1.5 text-xs text-[#259e73] border-[#259e73]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Ubah Laporan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Batalkan Laporan
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
              {cat.label} ({Math.round(report.confidence_score * 100)}%)
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
              Diajukan pada {report.created_at}
            </p>
          </div>

          {/* Location details */}
          <div className="rounded-xl bg-[#f5f8f6] p-4 border border-[#e2ebe6] text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#2e4a21]">
              <MapPin className="h-4 w-4 text-[#259e73]" />
              Lokasi Titik Sampah
            </div>
            <p className="text-[#5d6f66]">{report.address}</p>
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

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e2ebe6]">
              {report.status_histories.map((hist) => (
                <div key={hist.id} className="relative">
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
                        Petugas: {hist.changed_by_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal for Pending reports */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Ubah Rincian Laporan"
        description="Laporan berstatus Menunggu Verifikasi masih dapat Anda ubah."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <Label htmlFor="editTit" required>Judul Laporan</Label>
            <div className="mt-1.5">
              <Input
                id="editTit"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="editD" required>Deskripsi Sampah</Label>
            <div className="mt-1.5">
              <Textarea
                id="editD"
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f4f2]">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

