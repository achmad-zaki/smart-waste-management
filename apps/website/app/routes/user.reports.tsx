import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  PlusCircle,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  initialReports,
  categoryLabels,
  statusLabels,
  type WasteReport,
} from "~/lib/mock-data";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";

export default function UserReportsListPage() {
  const [searchParams] = useSearchParams();
  const showSuccessBanner = searchParams.get("success") === "true";

  // Filter only user's reports (user_id: 2 - Ahmad Qomaruddin)
  const myInitialReports = initialReports.filter((r) => r.user_id === 2);

  const [reports] = useState<WasteReport[]>(myInitialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" || r.status === statusFilter;

      const matchCategory =
        categoryFilter === "all" || r.waste_category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [reports, searchTerm, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
            Riwayat Laporan Sampah Saya
          </h1>
          <p className="text-sm text-[#5d6f66] mt-0.5">
            Daftar seluruh laporan yang telah Anda kirimkan dan perkembangannya di lapangan.
          </p>
        </div>

        <Link to="/user/reports/new">
          <Button variant="primary" className="gap-2 font-semibold">
            <PlusCircle className="h-4 w-4" />
            Buat Laporan Baru
          </Button>
        </Link>
      </div>

      {showSuccessBanner && (
        <div className="rounded-xl border border-[#259e73] bg-[#e8f9f2] p-4 text-xs font-semibold text-[#2e4a21] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-[#259e73] shrink-0" />
            <span>
              Laporan sampah berhasil dibuat! Petugas dan sistem AI telah mencatat titik koordinat Anda.
            </span>
          </div>
          <Link to="/user/reports" className="text-[#259e73] hover:underline">
            Tutup
          </Link>
        </div>
      )}

      {/* Search and Filters */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#5d6f66]" />
            <Input
              type="text"
              placeholder="Cari judul laporan atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="in_progress">Sedang Ditangani</option>
              <option value="completed">Tuntas / Selesai</option>
              <option value="rejected">Ditolak</option>
            </Select>
          </div>

          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Semua Kategori Sampah</option>
              <option value="plastic">Sampah Plastik</option>
              <option value="organic">Sampah Organik</option>
              <option value="paper">Sampah Kertas</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-12 text-center text-[#5d6f66] shadow-xs">
          <AlertCircle className="mx-auto h-8 w-8 text-[#f2bf87] mb-2" />
          <h3 className="text-sm font-semibold text-[#2e4a21]">Tidak ada laporan ditemukan</h3>
          <p className="text-xs text-[#5d6f66] mt-1">
            Ubah filter pencarian Anda atau buat laporan baru jika menemukan sampah.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const cat = categoryLabels[report.waste_category];
            const stat = statusLabels[report.status];
            return (
              <div
                key={report.id}
                className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs hover:border-[#259e73] transition-all hover:shadow-[0_4px_16px_rgba(37,158,115,0.06)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={report.image_url}
                      alt={report.title}
                      className="h-20 w-20 rounded-xl object-cover border border-[#e2ebe6] shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2e4a21]">
                          #{report.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badgeClass}`}
                        >
                          <Sparkles className="h-3 w-3" />
                          {cat.label} ({Math.round(report.confidence_score * 100)}%)
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-[#2e4a21]">
                        {report.title}
                      </h3>

                      <p className="text-xs text-[#5d6f66] flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#259e73] shrink-0" />
                        {report.address}
                      </p>

                      <p className="text-[11px] text-[#889990] flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#5d6f66]" />
                        Diajukan: {report.created_at}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-end md:self-center shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${stat.bg} ${stat.text} ${stat.border}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {stat.label}
                    </span>

                    <Link to={`/user/reports/${report.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-[#259e73] hover:bg-[#acebd4]/20">
                        Detail Lengkap
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

