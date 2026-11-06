import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash2,
  X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ClientDate } from "~/components/common/client-date";
import { StatusBadge } from "~/components/common/status-badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Modal } from "~/components/ui/modal";
import { Select } from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import {
  categoryLabels
} from "~/constants/report.constants";
import {
  useDeleteReport,
  useReports,
  useUpdateReportStatus,
} from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";
import type { ReportStatus, WasteReport } from "~/types/report.types";
import type { Route } from "./+types/admin.reports";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Kelola Laporan Sampah - Admin Smart Waste" },
    {
      name: "description",
      content: "Kelola status, filter, dan verifikasi laporan sampah dari masyarakat secara terpadu.",
    },
  ];
}

export default function AdminReportsPage() {
  const navigate = useNavigate();
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
          className={`rounded-xl border p-4 flex items-center justify-between text-xs font-medium animate-in fade-in ${actionMessage.type === "success"
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
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-white text-xs font-medium text-gray-400">
              <tr>
                <th className="px-6 py-4">ID Laporan</th>
                <th className="px-6 py-4">Judul Laporan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pelapor & Lokasi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80 bg-white text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Spinner className="size-5 text-gray-400" />
                      <span className="text-xs">Memuat data laporan dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium text-gray-800 text-sm">Tidak ada laporan ditemukan</p>
                    <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
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
                  };
                  const reporterName = report.user?.name || report.user_name || "Warga";

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-sm">
                        #{report.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={report.image_url}
                            alt={report.title}
                            className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-gray-100"
                            loading="lazy"
                          />
                          <span
                            className="font-medium text-gray-900 text-sm line-clamp-1 max-w-[220px]"
                            title={report.title}
                          >
                            {report.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm font-normal">
                        {cat.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm font-normal">
                        <ClientDate date={report.created_at} format="datetime" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          <p className="text-gray-700 text-sm font-normal truncate">{reporterName}</p>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            {report.address || "Area Pelaporan"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(report)}
                          title="Klik untuk ubah status laporan"
                          className="cursor-pointer transition-transform hover:scale-[1.02]"
                        >
                          <StatusBadge status={report.status} variant="elegant" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer outline-none">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 p-1 rounded-xl shadow-lg border border-gray-100 bg-white"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer text-xs py-2"
                              onClick={() => navigate(`/admin/reports/${report.id}`)}
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-2 text-gray-400" />
                              <span>Lihat Detail</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-xs py-2"
                              onClick={() => handleOpenStatusModal(report)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-2 text-gray-400" />
                              <span>Ubah Status</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-gray-100" />
                            <DropdownMenuItem
                              variant="destructive"
                              className="cursor-pointer text-xs py-2 text-red-600 hover:text-red-700 focus:bg-red-50"
                              onClick={() => handleDelete(report.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2 text-red-600" />
                              <span>Hapus Laporan</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              Menampilkan {reports.length} dari total {totalItems} laporan
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Per baris:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
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
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${pageNum === page
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
