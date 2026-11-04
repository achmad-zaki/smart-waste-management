import { Link } from "react-router";
import {
  PlusCircle,
  Clock,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  MapPin,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import type { Route } from "./+types/user.dashboard";
import { StatCard } from "~/components/common/stat-card";
import { CategoryBadge } from "~/components/common/category-badge";
import { StatusBadge } from "~/components/common/status-badge";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useUserDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Warga - Smart Waste Management" },
    {
      name: "description",
      content: "Ringkasan kontribusi pelaporan sampah dan pemantauan penanganan lingkungan.",
    },
  ];
}

export default function UserDashboardPage() {
  const { data: dashboard, isLoading, isError, error, refetch } = useUserDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#5d6f66]">
        <Spinner className="size-8 text-[#259e73] mb-3" />
        <p className="text-sm font-medium">Memuat ringkasan laporan Anda...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold text-red-800">Gagal memuat dashboard warga</h3>
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
  const recentReports = dashboard?.recent_reports ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Action CTA */}
      <div className="rounded-3xl border border-[#acebd4] bg-gradient-to-r from-[#e8f9f2] via-[#f5fbf8] to-[#fcfcfc] p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#259e73]/15 px-3 py-1 text-xs font-semibold text-[#259e73] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Portal Warga Peduli Lingkungan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2e4a21] tracking-tight">
            Lihat Sampah Menumpuk di Sekitar Anda?
          </h1>
          <p className="mt-2 text-sm text-[#5d6f66] leading-relaxed">
            Ambil foto sekarang. Kecerdasan Buatan (AI) kami akan mengenali jenis sampahnya, mencatat titik GPS, dan mengirimkannya ke Dinas Lingkungan Hidup.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to="/user/reports/new">
              <Button size="lg" variant="primary" className="gap-2 shadow-xs font-semibold">
                <PlusCircle className="h-5 w-5" />
                <span>Buat Laporan Sampah AI</span>
              </Button>
            </Link>
            <Link to="/user/reports">
              <Button size="lg" variant="ghost" className="text-[#2e4a21] hover:bg-[#acebd4]/30">
                <span>Lihat Semua Laporan Saya</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Laporan Anda"
          value={totalReports}
          description="Kontribusi menjaga kebersihan"
          icon={FileSpreadsheet}
          iconBgClass="bg-[#259e73]/15 text-[#259e73]"
        />
        <StatCard
          title="Menunggu Validasi"
          value={pendingReports}
          description="Sedang dalam antrean dinas"
          icon={Clock}
          iconBgClass="bg-amber-500/15 text-amber-600"
        />
        <StatCard
          title="Sedang Ditangani"
          value={inProgressReports}
          description="Armada kebersihan di lokasi"
          icon={RefreshCw}
          iconBgClass="bg-blue-500/15 text-blue-600"
        />
        <StatCard
          title="Selesai Diangkut"
          value={completedReports}
          description="Lokasi sudah tertangani"
          icon={CheckCircle2}
          iconBgClass="bg-[#259e73]/15 text-[#259e73]"
        />
      </div>

      {/* Main Grid: Recent Reports & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Reports */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#2e4a21]">
                Laporan Terakhir Anda
              </h2>
              <p className="text-xs text-[#5d6f66]">
                Pantau perkembangan penanganan sampah yang telah Anda laporkan
              </p>
            </div>
            <Link
              to="/user/reports"
              className="text-xs font-semibold text-[#259e73] hover:underline flex items-center gap-1"
            >
              <span>Semua Laporan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentReports.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#c2d8cd] bg-[#fcfcfc] p-8 text-center text-[#5d6f66]">
                <p className="text-sm font-medium">Anda belum pernah mengirimkan laporan sampah.</p>
                <Link to="/user/reports/new">
                  <Button variant="outline" size="sm" className="mt-3">
                    Kirim Laporan Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs hover:border-[#259e73]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={report.image_url}
                        alt={report.title}
                        className="h-16 w-16 rounded-xl object-cover border border-[#e2ebe6] shrink-0"
                        loading="lazy"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#2e4a21]">
                            #{report.id}
                          </span>
                          <CategoryBadge category={report.waste_category} size="sm" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#2e4a21] line-clamp-1">
                          {report.title}
                        </h3>
                        <p className="text-xs text-[#5d6f66] flex items-center gap-1 line-clamp-1">
                          <MapPin className="h-3 w-3 text-[#259e73] shrink-0" />
                          <span>{report.address || "Koordinat GPS"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusBadge status={report.status} size="sm" />
                      <Link
                        to={`/user/reports/${report.id}`}
                        className="text-xs font-semibold text-[#259e73] hover:underline flex items-center gap-0.5 mt-1"
                      >
                        <span>Detail</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Guidelines */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-[#2e4a21] pb-3 border-b border-[#e2ebe6]">
              <HelpCircle className="h-4 w-4 text-[#259e73]" />
              <span>Panduan Pelaporan Cerdas</span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-[#5d6f66]">
              <div className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#259e73]/15 font-bold text-[#259e73]">
                  1
                </span>
                <p>Ambil foto sampah dari jarak 1-2 meter dengan pencahayaan cukup jelas.</p>
              </div>

              <div className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#259e73]/15 font-bold text-[#259e73]">
                  2
                </span>
                <p>Aktifkan izin GPS di peramban Anda agar titik koordinat sampah tercatat otomatis.</p>
              </div>

              <div className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#259e73]/15 font-bold text-[#259e73]">
                  3
                </span>
                <p>Model AI akan mengenali apakah sampah termasuk Plastik, Organik, atau Kertas.</p>
              </div>

              <div className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#259e73]/15 font-bold text-[#259e73]">
                  4
                </span>
                <p>Pantau status penanganan oleh dinas kebersihan langsung di aplikasi ini.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
