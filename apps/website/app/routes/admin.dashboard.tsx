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
} from "lucide-react";
import { initialReports, categoryLabels, statusLabels } from "~/lib/mock-data";
import { Button } from "~/components/ui/button";

export default function AdminDashboardPage() {
  const totalReports = initialReports.length;
  const pendingReports = initialReports.filter((r) => r.status === "pending").length;
  const inProgressReports = initialReports.filter((r) => r.status === "in_progress").length;
  const completedReports = initialReports.filter((r) => r.status === "completed").length;
  const rejectedReports = initialReports.filter((r) => r.status === "rejected").length;

  const plasticCount = initialReports.filter((r) => r.waste_category === "plastic").length;
  const organicCount = initialReports.filter((r) => r.waste_category === "organic").length;
  const paperCount = initialReports.filter((r) => r.waste_category === "paper").length;

  return (
    <div className="space-y-8">
      {/* Page Title & Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
            Ringkasan Pengelolaan Sampah Kota
          </h1>
          <p className="text-sm text-[#5d6f66] mt-1">
            Pantau arus laporan warga, akurasi AI klasifikasi, dan perkembangan penanganan di lapangan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/reports">
            <Button variant="primary" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              Semua Laporan ({totalReports})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5d6f66]">Total Laporan Masuk</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#259e73]/15 text-[#259e73]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2e4a21]">{totalReports}</span>
            <span className="text-xs text-[#259e73] font-medium flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> 100% terekam
            </span>
          </div>
          <p className="mt-1 text-xs text-[#5d6f66]">Dari seluruh area pelaporan warga</p>
        </div>

        {/* Pending Reports */}
        <div className="rounded-xl border border-[#f2bf87]/80 bg-[#fdfaf5] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#855115]">Menunggu Verifikasi</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f2bf87]/30 text-[#855115]">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#855115]">{pendingReports}</span>
            <span className="text-xs font-medium text-[#855115] bg-[#f2bf87]/30 px-2 py-0.5 rounded-full">
              Prioritas Tindakan
            </span>
          </div>
          <p className="mt-1 text-xs text-[#855115]/80">Perlu peninjauan pengawas</p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-[#259e73]/30 bg-[#f5fbf8] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1c7454]">Sedang Ditangani</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#259e73]/15 text-[#259e73]">
              <RefreshCw className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1c7454]">{inProgressReports}</span>
            <span className="text-xs text-[#1c7454] font-medium">Tim Regu di Jalan</span>
          </div>
          <p className="mt-1 text-xs text-[#5d6f66]">Tahap pengangkutan armada</p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-[#acebd4] bg-[#fcfcfc] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2e4a21]">Tuntas Ditangani</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#acebd4]/50 text-[#2e4a21]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2e4a21]">{completedReports}</span>
            <span className="text-xs text-[#259e73] font-medium">Selesai Bersih</span>
          </div>
          <p className="mt-1 text-xs text-[#5d6f66]">Limbah diangkut ke TPA / Daur Ulang</p>
        </div>
      </div>

      {/* AI Category Breakdown & Fast Dispatch Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="lg:col-span-2 rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#2e4a21]">
                Distribusi Klasifikasi Sampah (Model AI)
              </h2>
              <p className="text-xs text-[#5d6f66] mt-0.5">
                Hasil prediksi otomatis model MobileNetV2 terhadap gambar kiriman warga
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-[#259e73] bg-[#259e73]/10 px-2.5 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Akurasi Rata-rata 93.4%
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Plastic */}
            <div>
              <div className="flex justify-between text-xs font-medium text-[#2e4a21] mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#259e73]" />
                  Sampah Plastik (Botol, Kresek, Kemasan)
                </span>
                <span className="font-semibold">{plasticCount} Laporan ({Math.round((plasticCount / totalReports) * 100)}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#f0f4f2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#259e73] transition-all"
                  style={{ width: `${(plasticCount / totalReports) * 100}%` }}
                />
              </div>
            </div>

            {/* Organic */}
            <div>
              <div className="flex justify-between text-xs font-medium text-[#2e4a21] mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#acebd4]" />
                  Sampah Organik (Sisa Makanan, Daun, Sayuran)
                </span>
                <span className="font-semibold">{organicCount} Laporan ({Math.round((organicCount / totalReports) * 100)}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#f0f4f2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#acebd4] transition-all"
                  style={{ width: `${(organicCount / totalReports) * 100}%` }}
                />
              </div>
            </div>

            {/* Paper */}
            <div>
              <div className="flex justify-between text-xs font-medium text-[#2e4a21] mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f2bf87]" />
                  Sampah Kertas (Kardus, Karton, Arsip)
                </span>
                <span className="font-semibold">{paperCount} Laporan ({Math.round((paperCount / totalReports) * 100)}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#f0f4f2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#f2bf87] transition-all"
                  style={{ width: `${(paperCount / totalReports) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Operations Summary */}
        <div className="rounded-xl border border-[#2e4a21] bg-[#2e4a21] p-6 text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#acebd4]">
                Instruksi Pengawas
              </span>
              <span className="h-2 w-2 rounded-full bg-[#259e73]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {pendingReports} Laporan Perlu Validasi Cepat
            </h3>
            <p className="text-xs text-[#acebd4] leading-relaxed">
              Dinas Lingkungan Hidup menargetkan respon cepat maksimal 2 jam setelah warga mengirimkan foto dan lokasi GPS.
            </p>
          </div>

          <div className="pt-6 border-t border-[#3b5d2b]">
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
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#f0f4f2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#2e4a21]">
              Laporan Masuk Terbaru
            </h2>
            <p className="text-xs text-[#5d6f66] mt-0.5">
              Daftar 5 laporan terakhir yang dikirim oleh masyarakat
            </p>
          </div>
          <Link
            to="/admin/reports"
            className="text-xs font-semibold text-[#259e73] hover:underline flex items-center gap-1"
          >
            Lihat Semua Tabel
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
              {initialReports.slice(0, 5).map((report) => {
                const cat = categoryLabels[report.waste_category];
                const stat = statusLabels[report.status];
                return (
                  <tr key={report.id} className="hover:bg-[#f5f8f6]/50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.image_url}
                          alt={report.title}
                          className="h-10 w-10 rounded-lg object-cover border border-[#e2ebe6]"
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
                        {report.address}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-medium text-[#2e4a21]">{report.user_name}</p>
                      <p className="text-[11px] text-[#5d6f66]">{report.created_at}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badgeClass}`}
                      >
                        {cat.label} ({Math.round(report.confidence_score * 100)}%)
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${stat.bg} ${stat.text} ${stat.border}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {stat.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Link to={`/admin/reports/${report.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-[#259e73] hover:bg-[#acebd4]/20">
                          Detail
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

