import {
  AlertCircle,
  Clock,
  Edit,
  ExternalLink,
  MapPin,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Modal } from "~/components/ui/modal";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  categoryLabels,
  statusLabels,
} from "~/constants/report.constants";
import type { ReportStatus, WasteReport } from "~/types/report.types";
import type { Route } from "./+types/admin.reports";
import {
  useDeleteReport,
  useReports,
  useUpdateReportStatus,
} from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kelola Laporan Sampah - Admin Smart Waste" },
    {
      name: "description",
      content: "Kelola status dan verifikasi laporan sampah dari masyarakat secara terpadu.",
    },
  ];
}

export default function AdminReportsPage() {
  const [searchParams] = useSearchParams();
  const initialStatusFilter = searchParams.get("status") || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // TanStack Query Hooks
  const { data, isLoading, isError, error, refetch } = useReports({
    status: statusFilter !== "all" ? statusFilter : undefined,
    waste_category: categoryFilter !== "all" ? categoryFilter : undefined,
    search: searchTerm.trim() ? searchTerm.trim() : undefined,
  });

  const updateStatusMutation = useUpdateReportStatus();
  const deleteMutation = useDeleteReport();

  const reports = data?.reports || [];
  const meta = data?.meta;

  // Modal State for Quick Status Change
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>("in_progress");
  const [statusNote, setStatusNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenStatusModal = (report: WasteReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setStatusNote("");
    setIsModalOpen(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    updateStatusMutation.mutate(
      {
        id: selectedReport.id,
        status: newStatus,
        note: statusNote || undefined,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedReport(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
            Kelola Seluruh Laporan Sampah
          </h1>
          <p className="text-sm text-[#5d6f66] mt-0.5">
            Daftar pengaduan warga secara terpusat untuk verifikasi dan pembaruan armada dinas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs"
          >
            Segarkan Data
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5d6f66]" />
            <Input
              type="text"
              placeholder="Cari judul laporan, nama pelapor, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs h-10 bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs h-10 bg-white"
            >
              <option value="all">Semua Status Penanganan</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="in_progress">Sedang Ditangani</option>
              <option value="completed">Selesai Ditangani</option>
              <option value="rejected">Ditolak</option>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs h-10 bg-white"
            >
              <option value="all">Semua Kategori Sampah</option>
              <option value="plastic">Plastik</option>
              <option value="organic">Organik</option>
              <option value="paper">Kertas</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <span>Gagal memuat daftar laporan: {getApiErrorMessage(error)}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Reports Table Container */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f8f6] text-[#5d6f66] border-b border-[#e2ebe6]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Foto & ID</th>
                <th className="px-5 py-3.5 font-semibold">Judul & Lokasi</th>
                <th className="px-5 py-3.5 font-semibold">Kategori AI</th>
                <th className="px-5 py-3.5 font-semibold">Pelapor & Tanggal</th>
                <th className="px-5 py-3.5 font-semibold">Status Penanganan</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f2]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#5d6f66]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Spinner className="size-6 text-[#259e73]" />
                      <span>Memuat data laporan...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#5d6f66]">
                    <AlertCircle className="h-8 w-8 text-[#c2d8cd] mx-auto mb-2" />
                    <p className="font-semibold text-[#2e4a21]">Tidak ada laporan ditemukan</p>
                    <p className="text-xs text-[#5d6f66] mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
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

                  return (
                    <tr key={report.id} className="hover:bg-[#f5f8f6]/60 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={report.image_url}
                            alt={report.title}
                            className="h-12 w-12 rounded-lg object-cover border border-[#e2ebe6] shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <span className="font-mono text-xs font-bold text-[#2e4a21]">
                              #{report.id}
                            </span>
                            <p className="text-[10px] text-[#5d6f66]">
                              {report.confidence_score
                                ? `${Math.round(report.confidence_score * 100)}% conf.`
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-semibold text-[#2e4a21] line-clamp-1">
                          {report.title}
                        </p>
                        <p className="text-[11px] text-[#5d6f66] flex items-center gap-1 mt-0.5 line-clamp-1">
                          <MapPin className="h-3 w-3 text-[#259e73] shrink-0" />
                          <span>{report.address || "Koordinat GPS"}</span>
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badgeClass}`}
                        >
                          <Sparkles className="h-3 w-3" />
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-medium text-[#2e4a21]">{reporterName}</p>
                        <p className="text-[11px] text-[#5d6f66] flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-[#5d6f66]" />
                          {report.created_at ? new Date(report.created_at).toLocaleString("id-ID") : "-"}
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenStatusModal(report)}
                          title="Klik untuk ubah status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-transform hover:scale-105 cursor-pointer ${stat.bg} ${stat.text} ${stat.border}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {stat.label}
                          <Edit className="h-3 w-3 ml-1 opacity-70" />
                        </button>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/admin/reports/${report.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-[#259e73] hover:bg-[#acebd4]/20"
                            >
                              Detail
                              <ExternalLink className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(report.id)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                            title="Hapus Laporan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="px-6 py-3.5 bg-[#f5f8f6] border-t border-[#e2ebe6] flex items-center justify-between text-xs text-[#5d6f66]">
          <span>
            Menampilkan {reports.length} {meta ? `dari total ${meta.total}` : ""} laporan
          </span>
          <span className="font-medium text-[#2e4a21]">
            Halaman {meta?.current_page || 1} dari {meta?.last_page || 1}
          </span>
        </div>
      </div>

      {/* Quick Status Update Modal */}
      {selectedReport && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Perbarui Status Laporan #${selectedReport.id}`}
          description={`Judul: ${selectedReport.title}`}
        >
          <form onSubmit={handleSaveStatus} className="space-y-4">
            <div>
              <Label htmlFor="statusSelect" required>
                Pilih Status Baru
              </Label>
              <div className="mt-1.5">
                <Select
                  id="statusSelect"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                >
                  <option value="pending">Menunggu Verifikasi</option>
                  <option value="in_progress">Sedang Ditangani</option>
                  <option value="completed">Selesai Ditangani</option>
                  <option value="rejected">Tolak Laporan</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="statusNote">Catatan Penanganan / Alasan</Label>
              <div className="mt-1.5">
                <Textarea
                  id="statusNote"
                  rows={3}
                  placeholder="Contoh: Petugas regu kuning telah mengangkut tumpukan sampah plastik..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>
            </div>

            {updateStatusMutation.error && (
              <p className="text-xs text-red-600">
                {getApiErrorMessage(updateStatusMutation.error)}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f2]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                disabled={updateStatusMutation.isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Spinner className="mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan Status"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
