import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  Layers,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  XCircle,
} from "lucide-react";
import type { Route } from "./+types/admin.dashboard";
import { ClientDate } from "~/components/common/client-date";
import { CategoryBadge } from "~/components/common/category-badge";
import { StatusBadge } from "~/components/common/status-badge";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Modal } from "~/components/ui/modal";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAdminDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { useUpdateReportStatus } from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";
import type { ReportStatus, WasteReport } from "~/types/report.types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Overview - Admin Smart Waste" },
    {
      name: "description",
      content:
        "Ringkasan analitik operasional, metrik laporan warga, klasifikasi AI, dan status penanganan sampah.",
    },
  ];
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading, isError, error, refetch, isFetching } = useAdminDashboard();
  const updateStatusMutation = useUpdateReportStatus();

  const [searchTableQuery, setSearchTableQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>("in_progress");
  const [statusNote, setStatusNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalReports = dashboard?.total_reports ?? 0;
  const pendingReports = dashboard?.pending_reports ?? 0;
  const inProgressReports = dashboard?.in_progress_reports ?? 0;
  const completedReports = dashboard?.completed_reports ?? 0;
  const rejectedReports = dashboard?.rejected_reports ?? 0;

  const plasticCount = dashboard?.reports_by_category?.plastic ?? 0;
  const organicCount = dashboard?.reports_by_category?.organic ?? 0;
  const paperCount = dashboard?.reports_by_category?.paper ?? 0;
  const categoryTotal = plasticCount + organicCount + paperCount;

  const plasticPercent = categoryTotal > 0 ? Math.round((plasticCount / categoryTotal) * 100) : 0;
  const organicPercent = categoryTotal > 0 ? Math.round((organicCount / categoryTotal) * 100) : 0;
  const paperPercent = categoryTotal > 0 ? Math.round((paperCount / categoryTotal) * 100) : 0;

  const completionRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;
  const pendingRate = totalReports > 0 ? Math.round((pendingReports / totalReports) * 100) : 0;

  const recentReports = dashboard?.recent_reports ?? [];
  const filteredRecentReports = recentReports.filter(
    (rep) =>
      rep.title.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      String(rep.id).includes(searchTableQuery) ||
      (rep.address && rep.address.toLowerCase().includes(searchTableQuery.toLowerCase())) ||
      (rep.user?.name && rep.user.name.toLowerCase().includes(searchTableQuery.toLowerCase()))
  );

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
          refetch();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#181d1a]">
              Dashboard Operasional
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ringkasan data laporan warga, klasifikasi sampah berbasis AI, dan status penanganan dinas.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-gray-500 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? "Menyegarkan..." : "Segarkan Data"}</span>
          </Button>

          <Link to="/admin/reports?status=pending">
            <Button size="sm" variant="primary" className="flex items-center gap-1.5 text-xs font-semibold">
              <Clock className="h-3.5 w-3.5" />
              <span>Verifikasi Laporan</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <span>Gagal memuat data dashboard: {getApiErrorMessage(error)}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Row 1: 4 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Laporan (Emerald Hero Card) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b5c36] via-[#107549] to-[#08482a] p-5 text-white shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/5 blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-100">Total Pengaduan</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div suppressHydrationWarning className="text-3xl font-extrabold tracking-tight">
                {isLoading ? <Spinner className="size-6 text-white" /> : totalReports.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-emerald-100/80 mt-1">Seluruh laporan tercatat</p>
            </div>
          </div>
          <Link
            to="/admin/reports"
            className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs font-medium text-white/90 hover:text-white group"
          >
            <span>Kelola Laporan</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 2: Menunggu Validasi (Amber Warning) */}
        <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Menunggu Validasi</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div suppressHydrationWarning className="text-3xl font-extrabold tracking-tight text-amber-600">
                {isLoading ? <Spinner className="size-6 text-amber-600" /> : pendingReports.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Perlu verifikasi & delegasi</p>
            </div>
          </div>
          <Link
            to="/admin/reports?status=pending"
            className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-amber-700 hover:text-amber-800 group"
          >
            <span>Proses sekarang</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 3: Sedang Ditangani (Blue / Info) */}
        <div className="rounded-2xl border border-blue-200/80 bg-white p-5 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Sedang Ditangani</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div suppressHydrationWarning className="text-3xl font-extrabold tracking-tight text-blue-600">
                {isLoading ? <Spinner className="size-6 text-blue-600" /> : inProgressReports.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Armada kebersihan di lapangan</p>
            </div>
          </div>
          <Link
            to="/admin/reports?status=in_progress"
            className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-blue-700 hover:text-blue-800 group"
          >
            <span>Pantau armada</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 4: Selesai Ditangani (Emerald / Success) */}
        <div className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Selesai Ditangani</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div suppressHydrationWarning className="text-3xl font-extrabold tracking-tight text-emerald-600">
                {isLoading ? <Spinner className="size-6 text-emerald-600" /> : completedReports.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Lokasi bersih & tuntas</p>
            </div>
          </div>
          <Link
            to="/admin/reports?status=completed"
            className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-emerald-700 hover:text-emerald-800 group"
          >
            <span>Lihat arsip tuntas</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Row 2: Analytics Breakdown (Category Distribution & Operational Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): AI Category Distribution */}
        <div className="lg:col-span-7 rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#259e73]/10 text-[#259e73]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#181d1a]">
                    Klasifikasi Kategori Sampah (AI Computer Vision)
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Hasil deteksi otomatis model MobileNetV2 dari foto pengaduan warga
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#107549] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Total {categoryTotal} Item
              </span>
            </div>

            {/* 3 Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              {/* Plastik */}
              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900">Plastik</span>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                    {plasticPercent}%
                  </span>
                </div>
                <p suppressHydrationWarning className="mt-3 text-2xl font-extrabold text-sky-950">
                  {plasticCount.toLocaleString("id-ID")}
                </p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-sky-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all duration-500"
                    style={{ width: `${plasticPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-sky-700 mt-2">Daur ulang anorganik</p>
              </div>

              {/* Organik */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Organik</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {organicPercent}%
                  </span>
                </div>
                <p suppressHydrationWarning className="mt-3 text-2xl font-extrabold text-emerald-950">
                  {organicCount.toLocaleString("id-ID")}
                </p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-emerald-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#107549] transition-all duration-500"
                    style={{ width: `${organicPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-emerald-700 mt-2">Komposting & pakan ternak</p>
              </div>

              {/* Kertas */}
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">Kertas</span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {paperPercent}%
                  </span>
                </div>
                <p suppressHydrationWarning className="mt-3 text-2xl font-extrabold text-amber-950">
                  {paperCount.toLocaleString("id-ID")}
                </p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-amber-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-600 transition-all duration-500"
                    style={{ width: `${paperPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-amber-700 mt-2">Pabrik pulp & kardus</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Akurasi estimasi AI: ~94-98%</span>
            <Link to="/user/reports/new" className="text-[#107549] font-semibold hover:underline flex items-center gap-1">
              <span>Uji deteksi baru</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Operational Performance */}
        <div className="lg:col-span-5 rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#181d1a]">
                    Efektivitas Penanganan
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Rasio penyelesaian laporan terhadap total pengaduan
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">Tingkat Penyelesaian (Completed)</span>
                  <span className="font-bold text-emerald-700">{completionRate}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">Antrean Menunggu (Pending)</span>
                  <span className="font-bold text-amber-600">{pendingRate}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${pendingRate}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                  <p className="text-[11px] text-gray-400">Laporan Ditolak</p>
                  <p className="text-lg font-bold text-gray-700 mt-0.5">{rejectedReports}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                  <p className="text-[11px] text-gray-400">Total Pengguna</p>
                  <Link to="/admin/users" className="text-lg font-bold text-[#107549] mt-0.5 block hover:underline">
                    Kelola →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
            Pembaruan status secara berkala membantu warga memantau kebersihan lingkungan secara real-time.
          </div>
        </div>
      </div>

      {/* Row 3: Recent Reports Table */}
      <div className="rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#181d1a]">
              Laporan Terbaru Masuk
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Daftar 5 pengaduan sampah terbaru yang diajukan oleh masyarakat
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul atau lokasi..."
                value={searchTableQuery}
                onChange={(e) => setSearchTableQuery(e.target.value)}
                className="w-48 sm:w-60 rounded-xl border border-[#e5e9e7] bg-white pl-8 pr-3 py-1.5 text-xs text-[#181d1a] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#107549] transition-all"
              />
            </div>

            <Link to="/admin/reports">
              <Button variant="outline" size="sm" className="text-xs font-semibold gap-1">
                <span>Lihat Semua</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Table Display */}
        <div className="overflow-x-auto mt-2">
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
                      <span className="text-xs">Memuat laporan terbaru...</span>
                    </div>
                  </td>
                </tr>
              ) : recentReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium text-gray-800 text-sm">Belum ada laporan sampah</p>
                    <p className="text-xs text-gray-400 mt-1">Laporan dari warga akan otomatis muncul di sini.</p>
                  </td>
                </tr>
              ) : filteredRecentReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                    Tidak ada laporan yang sesuai dengan pencarian &quot;{searchTableQuery}&quot;
                  </td>
                </tr>
              ) : (
                filteredRecentReports.map((report) => {
                  const reporter = report.user?.name || report.user_name || "Warga";

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
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
                            className="font-medium text-gray-900 text-sm line-clamp-1 max-w-[200px]"
                            title={report.title}
                          >
                            {report.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm font-normal capitalize">
                        {report.waste_category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm font-normal">
                        <ClientDate date={report.created_at} format="date" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          <p className="text-gray-700 text-sm font-normal truncate">{reporter}</p>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            {report.address || "Area Pelaporan"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(report)}
                          title="Klik untuk ubah status"
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
      </div>

      {/* Quick Status Update Modal */}
      {selectedReport && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Ubah Status Laporan #${selectedReport.id}`}
          description={`Judul: ${selectedReport.title}`}
        >
          <form onSubmit={handleSaveStatus} className="space-y-4">
            <div>
              <Label htmlFor="quickStatusSelect" required>
                Pilih Status Penanganan
              </Label>
              <div className="mt-1.5">
                <Select
                  id="quickStatusSelect"
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
              <Label htmlFor="quickStatusNote">Catatan Penanganan / Alasan</Label>
              <div className="mt-1.5">
                <Textarea
                  id="quickStatusNote"
                  rows={3}
                  placeholder="Contoh: Petugas telah dikirimkan ke lokasi pengaduan..."
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

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
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
