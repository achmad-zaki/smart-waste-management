import React, { useState } from "react";
import { Link } from "react-router";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  RotateCcw,
  Search,
  Sparkles,
  MapPin,
  Layers,
  Recycle,
  Leaf,
  FileText,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
} from "lucide-react";
import type { Route } from "./+types/user.dashboard";
import { ClientDate } from "~/components/common/client-date";
import { CategoryBadge } from "~/components/common/category-badge";
import { StatusBadge } from "~/components/common/status-badge";
import { EmptyState } from "~/components/common/empty-state";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useUserDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Warga - Smart Waste Management" },
    {
      name: "description",
      content:
        "Ringkasan kontribusi pelaporan sampah, status penanganan dinas, dan analitik AI.",
    },
  ];
}

export default function UserDashboardPage() {
  const { data: dashboard, isLoading, isFetching, refetch } = useUserDashboard();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Spinner className="size-8 text-[#107549] mb-3" />
        <p className="text-sm font-medium">Memuat ringkasan laporan Anda...</p>
      </div>
    );
  }

  const totalReports = dashboard?.total_reports ?? 0;
  const pendingReports = dashboard?.pending_reports ?? 0;
  const inProgressReports = dashboard?.in_progress_reports ?? 0;
  const completedReports = dashboard?.completed_reports ?? 0;
  const rejectedReports = dashboard?.rejected_reports ?? 0;
  const recentReports = dashboard?.recent_reports ?? [];

  // Category counts
  const categoryStats = dashboard?.reports_by_category || {
    plastic: 0,
    organic: 0,
    paper: 0,
  };
  const plasticCount = categoryStats.plastic;
  const organicCount = categoryStats.organic;
  const paperCount = categoryStats.paper;
  const categoryTotal = plasticCount + organicCount + paperCount || totalReports;

  const plasticPercent =
    categoryTotal > 0 ? Math.round((plasticCount / categoryTotal) * 100) : 0;
  const organicPercent =
    categoryTotal > 0 ? Math.round((organicCount / categoryTotal) * 100) : 0;
  const paperPercent =
    categoryTotal > 0 ? Math.round((paperCount / categoryTotal) * 100) : 0;

  // Handling rates
  const completionRate =
    totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;
  const activeReportsCount = pendingReports + inProgressReports;

  const filteredReports = recentReports.filter(
    (rep) =>
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(rep.id).includes(searchQuery) ||
      (rep.address && rep.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header: Overview title, status badge & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#181d1a]">
              Dashboard Warga
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#107549]/10 px-3 py-0.5 text-xs font-semibold text-[#107549]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Portal Warga Peduli Lingkungan</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ringkasan kontribusi pelaporan sampah, status verifikasi dinas, dan hasil analisis AI.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-xl border-[#e5e9e7] bg-white px-3.5 py-2 text-xs font-semibold text-[#181d1a] shadow-xs hover:bg-[#f7f9f8] transition-colors cursor-pointer"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5 text-gray-500", isFetching && "animate-spin text-[#107549]")}
            />
            <span>Segarkan Data</span>
          </Button>

          <Link to="/user/reports/new">
            <Button
              size="sm"
              className="bg-[#107549] hover:bg-[#0c5c36] text-white rounded-xl gap-1.5 shadow-xs font-semibold text-xs h-9 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Lapor Sampah</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reports (Green Hero Card) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b5c36] via-[#107549] to-[#08482a] p-5 text-white shadow-sm flex flex-col justify-between min-h-[170px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-100">
                Total Kontribusi
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {totalReports}
              </span>
              <span className="ml-1.5 text-xs text-emerald-100">Laporan</span>
            </div>
          </div>
          <Link
            to="/user/reports"
            className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] font-medium text-emerald-100 hover:text-white transition-colors"
          >
            <span>Lihat semua laporan</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Card 2: Pending (Menunggu Validasi) */}
        <div className="rounded-3xl border border-[#e5e9e7] bg-white p-5 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Menunggu Verifikasi
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold tracking-tight text-[#181d1a]">
                {pendingReports}
              </span>
              <span className="ml-1.5 text-xs text-gray-400">Menunggu</span>
            </div>
          </div>
          <Link
            to="/user/reports?status=pending"
            className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500 hover:text-amber-700 transition-colors"
          >
            <span>Antrean verifikasi dinas</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Card 3: In Progress (Sedang Ditangani) */}
        <div className="rounded-3xl border border-[#e5e9e7] bg-white p-5 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Sedang Ditangani
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold tracking-tight text-[#181d1a]">
                {inProgressReports}
              </span>
              <span className="ml-1.5 text-xs text-gray-400">Lokasi</span>
            </div>
          </div>
          <Link
            to="/user/reports?status=in_progress"
            className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <span>Proses petugas lapangan</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Card 4: Completed (Tuntas) */}
        <div className="rounded-3xl border border-[#e5e9e7] bg-white p-5 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Tuntas / Selesai
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold tracking-tight text-[#181d1a]">
                {completedReports}
              </span>
              <span className="ml-1.5 text-xs text-gray-400">Titik Bersih</span>
            </div>
          </div>
          <Link
            to="/user/reports?status=completed"
            className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500 hover:text-emerald-700 transition-colors"
          >
            <span>Telah dibersihkan</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Row 2: Middle Section (Kategori Sampah AI & Status Penanganan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): Kategori Sampah Terdeteksi AI */}
        <div className="lg:col-span-5 rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#181d1a]">
                  Kategori Sampah AI
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Klasifikasi otomatis foto menggunakan MobileNetV2
                </p>
              </div>

              <Link to="/user/reports/new">
                <button className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[#107549] hover:bg-emerald-50 transition-colors cursor-pointer">
                  <span>+ Lapor Baru</span>
                </button>
              </Link>
            </div>

            {/* 3 Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {/* Plastik */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">Plastik</span>
                    <div className="h-6 w-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Recycle className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-blue-950 tracking-tight">
                    {plasticCount}
                  </p>
                  <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                    {plasticPercent}% dari total
                  </p>
                </div>
              </div>

              {/* Organik */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Organik</span>
                    <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Leaf className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-emerald-950 tracking-tight">
                    {organicCount}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                    {organicPercent}% dari total
                  </p>
                </div>
              </div>

              {/* Kertas */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Kertas</span>
                    <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-amber-950 tracking-tight">
                    {paperCount}
                  </p>
                  <p className="text-[10px] text-amber-600 font-medium mt-0.5">
                    {paperPercent}% dari total
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#107549]" />
              Model AI Terkalibrasi (3 Kelas Sampah)
            </span>
            <Link
              to="/user/reports"
              className="text-[#107549] font-medium hover:underline flex items-center gap-1"
            >
              <span>Riwayat</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right Column (7 cols): Progress Penanganan Laporan */}
        <div className="lg:col-span-7 rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Efektivitas Penanganan
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#181d1a]">
                    {completionRate}%
                  </h2>
                  <span className="text-xs font-medium text-emerald-600">
                    Tingkat Penyelesaian Laporan
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-gray-500 block">
                  Laporan Aktif
                </span>
                <span className="text-lg font-bold text-amber-600">
                  {activeReportsCount} Lokasi
                </span>
              </div>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="mt-6 space-y-2">
              <div className="h-3.5 w-full rounded-full bg-gray-100 overflow-hidden flex">
                {completedReports > 0 && (
                  <div
                    style={{ width: `${(completedReports / (totalReports || 1)) * 100}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Selesai: ${completedReports}`}
                  />
                )}
                {inProgressReports > 0 && (
                  <div
                    style={{ width: `${(inProgressReports / (totalReports || 1)) * 100}%` }}
                    className="bg-blue-500 transition-all duration-500"
                    title={`Sedang Ditangani: ${inProgressReports}`}
                  />
                )}
                {pendingReports > 0 && (
                  <div
                    style={{ width: `${(pendingReports / (totalReports || 1)) * 100}%` }}
                    className="bg-amber-400 transition-all duration-500"
                    title={`Menunggu: ${pendingReports}`}
                  />
                )}
                {rejectedReports > 0 && (
                  <div
                    style={{ width: `${(rejectedReports / (totalReports || 1)) * 100}%` }}
                    className="bg-rose-400 transition-all duration-500"
                    title={`Ditolak: ${rejectedReports}`}
                  />
                )}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-gray-600">Selesai: {completedReports}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-gray-600">Proses: {inProgressReports}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="text-gray-600">Menunggu: {pendingReports}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="text-gray-600">Ditolak: {rejectedReports}</span>
                </div>
              </div>
            </div>

            {/* Information Card */}
            <div className="mt-5 rounded-2xl bg-[#f9faf9] border border-[#e5e9e7] p-4 text-xs text-gray-600 flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#107549] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#181d1a]">
                  Kontribusi Anda Sangat Berarti
                </p>
                <p className="mt-0.5 text-gray-500 leading-relaxed">
                  Setiap laporan sampah yang Anda kirimkan langsung diteruskan ke dinas kebersihan terkait untuk ditindaklanjuti secara transparan dan terukur.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Dikelola Dinas Lingkungan Hidup & Kebersihan</span>
            <Link
              to="/user/reports?status=completed"
              className="text-[#107549] font-medium hover:underline flex items-center gap-1"
            >
              <span>Lihat Laporan Tuntas</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Reports Table */}
      <div className="rounded-3xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#181d1a]">
              Laporan Terbaru Anda
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              5 laporan sampah terakhir yang Anda ajukan ke sistem
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-64 rounded-xl border border-[#e5e9e7] bg-[#f9faf9] pl-9 pr-3 py-1.5 text-xs text-[#181d1a] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#107549] transition-all"
              />
            </div>

            <Link to="/user/reports">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-[#e5e9e7] text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Semua Laporan</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto mt-2">
          {filteredReports.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 text-[11px] font-medium">
                  <th className="py-3.5 px-4 font-medium">Laporan Sampah</th>
                  <th className="py-3.5 px-4 font-medium">ID</th>
                  <th className="py-3.5 px-4 font-medium">Kategori</th>
                  <th className="py-3.5 px-4 font-medium">Tanggal Pengajuan</th>
                  <th className="py-3.5 px-4 font-medium">Status Penanganan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[#181d1a]">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-[#f9faf9] transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-4 font-semibold">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.image_url}
                          alt={report.title}
                          className="h-10 w-10 rounded-xl object-cover border border-[#e2ebe6] shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <Link
                            to={`/user/reports/${report.id}`}
                            className="text-[#181d1a] font-semibold hover:text-[#107549] transition-colors block line-clamp-1"
                          >
                            {report.title}
                          </Link>
                          <span className="text-[11px] text-gray-400 font-normal flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-[#107549] shrink-0" />
                            <span className="line-clamp-1">
                              {report.address || "Area Pelaporan"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-500 font-medium">
                      #{report.id}
                    </td>
                    <td className="py-4 px-4">
                      <CategoryBadge category={report.waste_category} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <ClientDate date={report.created_at} format="datetime" />
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} variant="elegant" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/user/reports/${report.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-[#107549] hover:bg-emerald-50 rounded-lg px-2.5 h-8 font-medium cursor-pointer"
                        >
                          <span>Detail</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12">
              <EmptyState
                title="Belum ada laporan sampah yang diajukan"
                description={
                  searchQuery
                    ? "Tidak ada laporan yang sesuai dengan kata kunci pencarian Anda."
                    : "Anda belum pernah mengirimkan laporan sampah. Jadilah warga pelopor kebersihan dengan melaporkan tumpukan sampah di sekitar Anda."
                }
                action={
                  <Link to="/user/reports/new">
                    <Button variant="primary" size="sm" className="gap-1.5 font-semibold">
                      <PlusCircle className="h-4 w-4" />
                      <span>Buat Laporan Sampah Sekarang</span>
                    </Button>
                  </Link>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
