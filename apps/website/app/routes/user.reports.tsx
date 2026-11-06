import {
  AlertCircle,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  MapPin,
  MoreHorizontal,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ClientDate } from "~/components/common/client-date";
import { CategoryBadge } from "~/components/common/category-badge";
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
import { Select } from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import {
  categoryLabels,
} from "~/constants/report.constants";
import {
  useDeleteReport,
  useReports,
} from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";
import type { Route } from "./+types/user.reports";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Riwayat Laporan Saya - Warga Smart Waste" },
    {
      name: "description",
      content: "Kelola status, pantau armada, dan lihat riwayat seluruh pengaduan sampah yang Anda ajukan.",
    },
  ];
}

export default function UserReportsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Sync
  const initialStatus = searchParams.get("status") || "all";
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;
  const showSuccessBanner = searchParams.get("success") === "true";

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
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    showSuccessBanner
      ? {
        type: "success",
        text: "Laporan sampah berhasil dibuat! Petugas dan sistem AI telah mencatat titik koordinat Anda.",
      }
      : null
  );

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

  const deleteMutation = useDeleteReport();

  const reports = data?.reports || [];
  const meta = data?.meta;
  const totalPages = meta?.last_page || 1;
  const totalItems = meta?.total || reports.length;

  const handleDelete = (id: number) => {
    if (confirm(`Apakah Anda yakin ingin membatalkan & menghapus laporan #${id}? Tindakan ini permanen.`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setActionMessage({
            type: "success",
            text: `Laporan #${id} berhasil dibatalkan dan dihapus.`,
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
            <h1 className="text-2xl font-bold tracking-tight text-[#181d1a]">
              Riwayat Laporan Sampah Saya
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[#107549] border border-emerald-200">
              {totalItems} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Daftar seluruh laporan yang telah Anda kirimkan dan perkembangan penanganan oleh dinas kebersihan.
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
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#107549]" : ""}`} />
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

          <Link to="/user/reports/new">
            <Button size="sm" variant="primary" className="text-xs font-semibold flex items-center gap-1.5">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Lapor Sampah</span>
            </Button>
          </Link>
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
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#e5e9e7] bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari judul laporan, ID, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs h-10 bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
          <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-3 animate-in fade-in">
            {/* Date From */}
            <div className="sm:col-span-3">
              <Label className="text-[11px] text-gray-500 mb-1 block">Tanggal Mulai (date_from)</Label>
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

            {/* Date To */}
            <div className="sm:col-span-3">
              <Label className="text-[11px] text-gray-500 mb-1 block">Tanggal Akhir (date_to)</Label>
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

            {/* Sort Column */}
            <div className="sm:col-span-3">
              <Label className="text-[11px] text-gray-500 mb-1 block">Urutkan Berdasarkan</Label>
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
                className="h-9 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reports Table Card */}
      <div className="rounded-2xl border border-[#e5e9e7] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-white text-xs font-medium text-gray-400">
              <tr>
                <th className="px-6 py-4">ID Laporan</th>
                <th className="px-6 py-4">Judul Laporan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Waktu Pengajuan</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Status Penanganan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80 bg-white text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Spinner className="size-6 text-[#107549]" />
                      <span className="text-xs">Memuat data laporan Anda...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800 text-sm">Tidak ada laporan ditemukan</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                        ? "Coba sesuaikan kata kunci pencarian atau reset filter Anda."
                        : "Anda belum pernah mengirimkan laporan sampah. Jadilah pelopor kebersihan lingkungan!"}
                    </p>
                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResetFilters}
                        className="mt-3 text-xs"
                      >
                        Reset Semua Filter
                      </Button>
                    ) : (
                      <Link to="/user/reports/new" className="inline-block mt-3">
                        <Button size="sm" variant="primary" className="text-xs gap-1.5 font-semibold">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Buat Laporan Sekarang</span>
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const cat = categoryLabels[report.waste_category] || {
                    label: report.waste_category,
                  };

                  return (
                    <tr key={report.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-[#107549]">
                        #{report.id}
                      </td>

                      {/* Judul & Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={report.image_url}
                            alt={report.title}
                            className="h-9 w-9 rounded-xl object-cover shrink-0 ring-1 ring-gray-100"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/user/reports/${report.id}`}
                              className="font-semibold text-xs text-[#181d1a] hover:text-[#107549] line-clamp-1 transition-colors block max-w-[220px]"
                              title={report.title}
                            >
                              {report.title}
                            </Link>
                            {report.confidence_score ? (
                              <span className="text-[10px] text-gray-400 font-medium">
                                AI: {Math.round(report.confidence_score * 100)}%
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CategoryBadge category={report.waste_category} size="sm" />
                      </td>

                      {/* Waktu */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <ClientDate date={report.created_at} format="datetime" />
                      </td>

                      {/* Lokasi */}
                      <td className="px-6 py-4 max-w-[200px]">
                        <span className="flex items-center gap-1 text-xs text-gray-500 line-clamp-1">
                          <MapPin className="h-3 w-3 text-[#107549] shrink-0" />
                          <span className="truncate">{report.address || "Area Pelaporan"}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={report.status} variant="elegant" />
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/user/reports/${report.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs font-semibold gap-1 rounded-xl h-8 px-2.5"
                            >
                              <span>Detail</span>
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 hover:text-[#181d1a] hover:bg-gray-100 transition-colors cursor-pointer outline-none"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              }
                            />
                            <DropdownMenuContent
                              align="end"
                              className="w-44 p-1 rounded-xl shadow-lg border border-gray-100 bg-white"
                            >
                              <DropdownMenuItem
                                className="cursor-pointer text-xs py-2"
                                onClick={() => navigate(`/user/reports/${report.id}`)}
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                <span>Lihat Detail</span>
                              </DropdownMenuItem>

                              {report.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    className="cursor-pointer text-xs py-2 text-red-600 hover:text-red-700 focus:bg-red-50"
                                    onClick={() => handleDelete(report.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-2 text-red-600" />
                                    <span>Batalkan Laporan</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#107549]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
