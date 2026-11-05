import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  ExternalLink,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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
      content: "Kelola status, filter, dan verifikasi laporan sampah dari masyarakat secara terpadu.",
    },
  ];
}

export default function AdminReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Sync
  const initialStatus = searchParams.get("status") || "all";
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [dateFrom, setDateFrom] = useState(searchParams.get("date_from") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("date_to") || "");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort_by") || "created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (searchParams.get("sort_direction") as "asc" | "desc") || "desc"
  );
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(10);

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync state if URL changes externally
  useEffect(() => {
    const urlStatus = searchParams.get("status");
    if (urlStatus && urlStatus !== statusFilter) {
      setStatusFilter(urlStatus);
      setPage(1);
    }
  }, [searchParams]);

  // TanStack Query Hook with full API params
  const { data, isLoading, isError, error, refetch, isFetching } = useReports({
    status: statusFilter !== "all" ? statusFilter : undefined,
    waste_category: categoryFilter !== "all" ? categoryFilter : undefined,
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    sort_by: sortBy,
    sort_direction: sortDirection,
    page,
    per_page: perPage,
  });

  const updateStatusMutation = useUpdateReportStatus();
  const deleteMutation = useDeleteReport();

  const reports = data?.reports || [];
  const meta = data?.meta;
  const totalPages = meta?.last_page || 1;
  const totalItems = meta?.total || reports.length;

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
          setActionMessage({
            type: "success",
            text: `Status laporan #${selectedReport.id} berhasil diperbarui.`,
          });
          setTimeout(() => setActionMessage(null), 4000);
        },
        onError: (err) => {
          setActionMessage({
            type: "error",
            text: `Gagal memperbarui status: ${getApiErrorMessage(err)}`,
          });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus laporan #${id}? Tindakan ini permanen.`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setActionMessage({
            type: "success",
            text: `Laporan #${id} berhasil dihapus dari sistem.`,
          });
          setTimeout(() => setActionMessage(null), 4000);
        },
        onError: (err) => {
          setActionMessage({
            type: "error",
            text: `Gagal menghapus laporan: ${getApiErrorMessage(err)}`,
          });
        },
      });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("created_at");
    setSortDirection("desc");
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
              Kelola Seluruh Laporan Sampah
            </h1>
            <span className="rounded-full bg-[#acebd4]/40 px-2.5 py-0.5 text-xs font-semibold text-[#2e4a21] border border-[#259e73]/20">
              {totalItems} Total
            </span>
          </div>
          <p className="text-xs text-[#5d6f66] mt-1">
            Daftar pengaduan warga secara terpusat untuk verifikasi dan pembaruan armada dinas kebersihan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? "Menyegarkan..." : "Segarkan Data"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>{showAdvancedFilter ? "Tutup Filter Lanjutan" : "Filter Lanjutan"}</span>
          </Button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`rounded-xl border p-4 flex items-center justify-between text-xs font-medium animate-in fade-in ${
            actionMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5d6f66]" />
            <Input
              type="text"
              placeholder="Cari judul laporan, ID, alamat, atau pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs h-10 bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs h-10 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Verifikasi (Pending)</option>
              <option value="in_progress">Sedang Ditangani (In Progress)</option>
              <option value="completed">Selesai Ditangani (Completed)</option>
              <option value="rejected">Ditolak (Rejected)</option>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs h-10 bg-white"
            >
              <option value="all">Semua Kategori Sampah</option>
              <option value="plastic">Plastik</option>
              <option value="organic">Organik</option>
              <option value="paper">Kertas</option>
            </Select>
          </div>
        </div>

        {/* Advanced Filters: Date Range & Sorting */}
        {showAdvancedFilter && (
          <div className="pt-3 border-t border-[#f0f4f2] grid grid-cols-1 sm:grid-cols-12 gap-3 animate-in fade-in">
            {/* Date From */}
            <div className="sm:col-span-3">
              <Label className="text-[11px] text-gray-500 mb-1 block">Tanggal Mulai (date_from)</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs h-9 bg-white"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="sm:col-span-3">
              <Label className="text-[11px] text-gray-500 mb-1 block">Tanggal Akhir (date_to)</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs h-9 bg-white"
                />
              </div>
            </div>

            {/* Sort Column */}
            <div className="sm:col-span-3">
              <Label className="text-[11px] text-gray-500 mb-1 block">Urutkan Berdasarkan (sort_by)</Label>
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="text-xs h-9 bg-white"
              >
                <option value="created_at">Tanggal Dibuat</option>
                <option value="title">Judul Laporan</option>
                <option value="status">Status</option>
                <option value="waste_category">Kategori</option>
                <option value="id">Nomor ID</option>
              </Select>
            </div>

            {/* Sort Direction & Reset */}
            <div className="sm:col-span-3 flex items-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                className="h-9 text-xs flex-1 flex items-center justify-center gap-1.5"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>{sortDirection === "asc" ? "Naik (A-Z)" : "Turun (Z-A)"}</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 text-xs text-gray-500 hover:text-gray-700"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
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
                      <span>Memuat data laporan dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#5d6f66]">
                    <AlertCircle className="h-8 w-8 text-[#c2d8cd] mx-auto mb-2" />
                    <p className="font-semibold text-[#2e4a21]">Tidak ada laporan ditemukan</p>
                    <p className="text-xs text-[#5d6f66] mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResetFilters}
                      className="mt-3 text-xs"
                    >
                      Reset Semua Filter
                    </Button>
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
                          type="button"
                          onClick={() => handleOpenStatusModal(report)}
                          title="Klik untuk ubah status laporan ini"
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

        {/* Table Footer with Pagination Controls */}
        <div className="px-6 py-3.5 bg-[#f5f8f6] border-t border-[#e2ebe6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5d6f66]">
          <div className="flex items-center gap-3">
            <span>
              Menampilkan {reports.length} dari total {totalItems} laporan
            </span>
            <div className="flex items-center gap-1">
              <span>Per baris:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-[#e2ebe6] bg-white px-2 py-0.5 text-xs text-[#2e4a21] focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-[#2e4a21] mr-1">
              Halaman {meta?.current_page || page} dari {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="h-8 w-8"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page number buttons */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              // Calculate page window
              let pageNum = idx + 1;
              if (totalPages > 5 && page > 3) {
                pageNum = page - 2 + idx;
                if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                    pageNum === page
                      ? "bg-[#259e73] text-white shadow-xs"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-8 w-8"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
                  <option value="pending">Menunggu Verifikasi (Pending)</option>
                  <option value="in_progress">Sedang Ditangani (In Progress)</option>
                  <option value="completed">Selesai Ditangani (Completed)</option>
                  <option value="rejected">Tolak Laporan (Rejected)</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="statusNote">Catatan Penanganan / Alasan</Label>
              <div className="mt-1.5">
                <Textarea
                  id="statusNote"
                  rows={3}
                  placeholder="Contoh: Petugas regu kuning telah ditugaskan untuk penanganan..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>
            </div>

            {updateStatusMutation.error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
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
