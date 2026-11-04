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
  Recycle,
  HelpCircle,
} from "lucide-react";
import {
  initialReports,
  categoryLabels,
  statusLabels,
} from "~/lib/mock-data";
import { Button } from "~/components/ui/button";

export default function UserDashboardPage() {
  // Current simulated logged-in user is Ahmad Qomaruddin (user_id: 2)
  const myReports = initialReports.filter((r) => r.user_id === 2);

  const totalReports = myReports.length;
  const pendingReports = myReports.filter((r) => r.status === "pending").length;
  const inProgressReports = myReports.filter((r) => r.status === "in_progress").length;
  const completedReports = myReports.filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Action CTA */}
      <div className="rounded-2xl border border-[#acebd4] bg-gradient-to-r from-[#e8f9f2] via-[#f5fbf8] to-[#fcfcfc] p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#259e73]/15 px-3 py-1 text-xs font-semibold text-[#259e73] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Portal Warga Peduli Lingkungan
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2e4a21] tracking-tight">
            Lihat Sampah Menumpuk di Sekitar Anda?
          </h1>
          <p className="mt-2 text-sm text-[#5d6f66] leading-relaxed">
            Ambil foto sekarang. Kecerdasan Buatan (AI) kami akan mengenali jenis sampahnya, mencatat titik GPS, dan mengirimkannya ke Dinas Lingkungan Hidup.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to="/user/reports/new">
              <Button size="lg" variant="primary" className="gap-2 shadow-sm font-semibold">
                <PlusCircle className="h-5 w-5" />
                Buat Laporan Sampah AI
              </Button>
            </Link>
            <Link to="/user/reports">
              <Button size="lg" variant="ghost" className="text-[#2e4a21] hover:bg-[#acebd4]/30">
                Lihat Semua Laporan Saya
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative graphic element */}
        <div className="absolute right-4 -bottom-6 hidden md:block opacity-20 pointer-events-none">
          <Recycle className="h-64 w-64 text-[#259e73]" />
        </div>
      </div>

      {/* Metric Cards (Warga Summary) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5d6f66]">Total Laporan</span>
            <FileSpreadsheet className="h-4 w-4 text-[#259e73]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#2e4a21]">
            {totalReports}
          </div>
          <p className="mt-1 text-[11px] text-[#5d6f66]">Laporan yang pernah Anda kirim</p>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-[#f2bf87]/80 bg-[#fdfaf5] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#855115]">Menunggu</span>
            <Clock className="h-4 w-4 text-[#855115]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#855115]">
            {pendingReports}
          </div>
          <p className="mt-1 text-[11px] text-[#855115]/80">Menanti verifikasi petugas</p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-[#259e73]/30 bg-[#f5fbf8] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1c7454]">Ditangani</span>
            <RefreshCw className="h-4 w-4 text-[#259e73]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#1c7454]">
            {inProgressReports}
          </div>
          <p className="mt-1 text-[11px] text-[#1c7454]/80">Armada sedang menuju lokasi</p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-[#acebd4] bg-[#fcfcfc] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2e4a21]">Tuntas</span>
            <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#2e4a21]">
            {completedReports}
          </div>
          <p className="mt-1 text-[11px] text-[#5d6f66]">Lingkungan sudah bersih</p>
        </div>
      </div>

      {/* Main Content Grid: Recent Reports & Quick Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Reports */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#2e4a21]">
                Aktivitas Laporan Terkini Anda
              </h2>
              <p className="text-xs text-[#5d6f66]">
                Pantau progres penanganan sampah yang telah Anda laporkan
              </p>
            </div>
            <Link
              to="/user/reports"
              className="text-xs font-semibold text-[#259e73] hover:underline flex items-center gap-1"
            >
              Lihat Riwayat Lengkap
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myReports.slice(0, 4).map((report) => {
              const cat = categoryLabels[report.waste_category];
              const stat = statusLabels[report.status];
              return (
                <div
                  key={report.id}
                  className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs hover:border-[#259e73] transition-all hover:shadow-[0_4px_12px_rgba(37,158,115,0.06)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={report.image_url}
                        alt={report.title}
                        className="h-14 w-14 rounded-lg object-cover border border-[#e2ebe6] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#2e4a21]">
                            #{report.id}
                          </span>
                          <h4 className="text-sm font-semibold text-[#2e4a21] line-clamp-1">
                            {report.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#5d6f66] flex items-center gap-1 mt-1 line-clamp-1">
                          <MapPin className="h-3 w-3 text-[#259e73] shrink-0" />
                          {report.address}
                        </p>
                        <p className="text-[11px] text-[#889990] mt-0.5">
                          Dilaporkan pada {report.created_at}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badgeClass}`}
                      >
                        {cat.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${stat.bg} ${stat.text} ${stat.border}`}
                      >
                        {stat.label}
                      </span>
                      <Link to={`/user/reports/${report.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-[#259e73] hover:bg-[#acebd4]/20">
                          Detail
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Sorting Guide */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#f0f4f2]">
              <HelpCircle className="h-4 w-4 text-[#259e73]" />
              <h3 className="text-sm font-semibold text-[#2e4a21]">
                Panduan Kategori AI
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#259e73]/10 border border-[#259e73]/20">
                <span className="font-bold text-[#259e73] block mb-0.5">
                  1. Sampah Plastik
                </span>
                <p className="text-[#5d6f66]">
                  Botol PET, kantong kresek, kemasan sachet, gelas air mineral.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#acebd4]/30 border border-[#acebd4]">
                <span className="font-bold text-[#2e4a21] block mb-0.5">
                  2. Sampah Organik
                </span>
                <p className="text-[#5d6f66]">
                  Sisa sayur mayur, kulit buah, sisa makanan basah, dedaunan.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f2bf87]/30 border border-[#f2bf87]">
                <span className="font-bold text-[#855115] block mb-0.5">
                  3. Sampah Kertas
                </span>
                <p className="text-[#5d6f66]">
                  Kardus coklat, kertas berkas, koran bekas, kantong kertas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

