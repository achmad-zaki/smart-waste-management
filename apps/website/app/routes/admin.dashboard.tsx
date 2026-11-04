import { Link } from "react-router";
import {
  FileSpreadsheet,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Route } from "./+types/admin.dashboard";
import { PageHeader } from "~/components/common/page-header";
import { StatCard } from "~/components/common/stat-card";
import { CategoryBadge } from "~/components/common/category-badge";
import { StatusBadge } from "~/components/common/status-badge";
import { Button } from "~/components/ui/button";
import { useAdminDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Administrator - Smart Waste Management" },
    {
      name: "description",
      content:
        "Ringkasan statistik pengelolaan sampah kota, klasifikasi AI, dan kinerja dinas kebersihan.",
    },
  ];
}

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading, isError, error, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#5d6f66]">
        <Loader2 className="h-8 w-8 animate-spin text-[#259e73] mb-3" />
        <p className="text-sm font-medium">Memuat data analitik dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold text-red-800">Gagal memuat statistik dashboard</h3>
        <p className="text-sm text-red-600 mt-1">{getApiErrorMessage(error)}</p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  const totalReports = dashboard?.total_reports ?? 0;
  const pendingReports = dashboard?.pending_reports ?? 0;
  const inProgressReports = dashboard?.in_progress_reports ?? 0;
  const completedReports = dashboard?.completed_reports ?? 0;
  const rejectedReports = dashboard?.rejected_reports ?? 0;

  const plasticCount = dashboard?.reports_by_category?.plastic ?? 0;
  const organicCount = dashboard?.reports_by_category?.organic ?? 0;
  const paperCount = dashboard?.reports_by_category?.paper ?? 0;

  const recentReports = dashboard?.recent_reports ?? [];

  return (
    <div className="space-y-8">
      {/* Page Title & Summary Header */}
      <PageHeader
        title="Ringkasan Pengelolaan Sampah Kota"
        description="Pantau arus laporan warga, akurasi AI klasifikasi, dan perkembangan penanganan di lapangan."
        actions={
          <Link to="/admin/reports">
            <Button variant="primary" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              <span>Semua Laporan ({totalReports})</span>
            </Button>
          </Link>
        }
      />

      {/* Metric Cards Grid using StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Laporan Masuk"
          value={totalReports}
          description="Semua laporan terdata di sistem"
          icon={FileSpreadsheet}
          iconBgClass="bg-[#259e73]/15 text-[#259e73]"
        />
        <StatCard
          title="Menunggu Validasi"
          value={pendingReports}
          description="Memerlukan tindakan tim dinas"
          icon={Clock}
          iconBgClass="bg-amber-500/15 text-amber-600"
        />
        <StatCard
          title="Sedang Ditangani"
          value={inProgressReports}
          description="Petugas kebersihan di lapangan"
          icon={RefreshCw}
          iconBgClass="bg-blue-500/15 text-blue-600"
        />
        <StatCard
          title="Selesai Diangkut"
          value={completedReports}
          description="Lingkungan telah bersih kembali"
          icon={CheckCircle2}
          iconBgClass="bg-[#259e73]/15 text-[#259e73]"
        />
      </div>

      {/* AI Category Distribution & Status Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waste Categories AI Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f2]">
            <div>
              <h2 className="text-base font-bold text-[#2e4a21] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#259e73]" />
                <span>Distribusi Kategori Sampah (Hasil AI)</span>
              </h2>
              <p className="text-xs text-[#5d6f66] mt-0.5">
                Klasifikasi otomatis oleh model Computer Vision
              </p>
            </div>
            <span className="text-xs font-semibold text-[#259e73] bg-[#259e73]/10 px-2.5 py-1 rounded-full">
              Real-time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-800">Sampah Plastik</span>
                <span className="h-2 w-2 rounded-full bg-sky-500" />
              </div>
              <p className="text-2xl font-black text-sky-900 mt-2">{plasticCount}</p>
              <p className="text-[11px] text-sky-700/80 mt-1">
                {totalReports > 0 ? ((plasticCount / totalReports) * 100).toFixed(1) : 0}% dari total
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">Sampah Organik</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-900 mt-2">{organicCount}</p>
              <p className="text-[11px] text-emerald-700/80 mt-1">
                {totalReports > 0 ? ((organicCount / totalReports) * 100).toFixed(1) : 0}% dari total
              </p>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">Kertas & Karton</span>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-900 mt-2">{paperCount}</p>
              <p className="text-[11px] text-amber-700/80 mt-1">
                {totalReports > 0 ? ((paperCount / totalReports) * 100).toFixed(1) : 0}% dari total
              </p>
            </div>
          </div>
        </div>

        {/* Action Priority Callout */}
        <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#259e73]">
              <TrendingUp className="h-4 w-4" />
              <span>Prioritas Respon</span>
            </div>
            <h3 className="text-lg font-bold text-[#2e4a21] mt-2">
              {pendingReports} Laporan Perlu Diverifikasi
            </h3>
            <p className="text-xs text-[#5d6f66] mt-2 leading-relaxed">
              Terdapat laporan dari warga yang masih berstatus menunggu. Segera tetapkan tim armada kebersihan untuk penanganan cepat.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f0f4f2]">
            <Link to="/admin/reports?status=pending">
              <Button variant="mint" className="w-full justify-between font-semibold">
                <span>Periksa Antrean Menunggu</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#f0f4f2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#2e4a21]">
              Laporan Masuk Terbaru
            </h2>
            <p className="text-xs text-[#5d6f66] mt-0.5">
              Daftar laporan terakhir yang dikirim oleh masyarakat
            </p>
          </div>
          <Link
            to="/admin/reports"
            className="text-xs font-semibold text-[#259e73] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Tabel</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f8f6] text-[#5d6f66] border-b border-[#e2ebe6]">
              <tr>
                <th className="px-5 py-3 font-semibold">ID / Foto</th>
                <th className="px-5 py-3 font-semibold">Judul & Lokasi</th>
                <th className="px-5 py-3 font-semibold">Pelapor</th>
                <th className="px-5 py-3 font-semibold">Kategori AI</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f2]">
              {recentReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#5d6f66]">
                    Belum ada laporan masuk.
                  </td>
                </tr>
              ) : (
                recentReports.map((report) => {
                  const reporterName = report.user?.name || report.user_name || "Warga";
                  return (
                    <tr key={report.id} className="hover:bg-[#f5f8f6]/50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={report.image_url}
                            alt={report.title}
                            className="h-10 w-10 rounded-lg object-cover border border-[#e2ebe6]"
                            loading="lazy"
                          />
                          <span className="font-mono text-xs text-[#5d6f66]">
                            #{report.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-semibold text-[#2e4a21] truncate">
                          {report.title}
                        </p>
                        <p className="text-[11px] text-[#5d6f66] flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3 text-[#259e73] shrink-0" />
                          <span>{report.address || "Koordinat GPS"}</span>
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-medium text-[#2e4a21]">{reporterName}</p>
                        <p className="text-[11px] text-[#5d6f66]">
                          {report.created_at ? new Date(report.created_at).toLocaleString("id-ID") : "-"}
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <CategoryBadge category={report.waste_category} size="sm" />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={report.status} size="sm" />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <Link to={`/admin/reports/${report.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs text-[#259e73] hover:bg-[#acebd4]/20"
                          >
                            <span>Detail</span>
                            <ExternalLink className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
