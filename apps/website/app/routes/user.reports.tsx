import React, { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  PlusCircle,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Route } from "./+types/user.reports";
import { PageHeader } from "~/components/common/page-header";
import { CategoryBadge } from "~/components/common/category-badge";
import { StatusBadge } from "~/components/common/status-badge";
import { EmptyState } from "~/components/common/empty-state";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { formatDate } from "~/lib/utils";
import { useReports } from "~/features/reports/hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Riwayat Laporan Saya - Smart Waste Management" },
    {
      name: "description",
      content: "Daftar seluruh laporan sampah yang diajukan beserta status penanganannya.",
    },
  ];
}

export default function UserReportsListPage() {
  const [searchParams] = useSearchParams();
  const showSuccessBanner = searchParams.get("success") === "true";
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      searchInputRef.current?.focus();
    }
  }, [searchParams]);

  const { data, isLoading, isError, error, refetch } = useReports({
    status: statusFilter !== "all" ? statusFilter : undefined,
    waste_category: categoryFilter !== "all" ? categoryFilter : undefined,
    search: searchTerm.trim() ? searchTerm.trim() : undefined,
  });

  const reports = data?.reports || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Laporan Sampah Saya"
        description="Daftar seluruh laporan yang telah Anda kirimkan dan perkembangannya di lapangan."
        actions={
          <Link to="/user/reports/new">
            <Button variant="primary" className="gap-2 font-semibold">
              <PlusCircle className="h-4 w-4" />
              <span>Buat Laporan Baru</span>
            </Button>
          </Link>
        }
      />

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
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#5d6f66]" />
            <Input
              ref={searchInputRef}
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

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <span>Gagal memuat riwayat laporan: {getApiErrorMessage(error)}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Reports List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-[#5d6f66]">
          <Spinner className="size-8 text-[#259e73] mb-3" />
          <p className="text-sm font-medium">Memuat riwayat laporan Anda...</p>
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="Tidak ada laporan ditemukan"
          description="Ubah filter pencarian Anda atau buat laporan baru jika menemukan sampah di sekitar Anda."
          action={
            <Link to="/user/reports/new">
              <Button variant="primary" size="sm" className="gap-1.5">
                <PlusCircle className="h-4 w-4" />
                <span>Buat Laporan Sekarang</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs hover:border-[#259e73] transition-all hover:shadow-[0_4px_16px_rgba(37,158,115,0.06)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <img
                    src={report.image_url}
                    alt={report.title}
                    className="h-20 w-20 rounded-xl object-cover border border-[#e2ebe6] shrink-0"
                    loading="lazy"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2e4a21]">
                        #{report.id}
                      </span>
                      <CategoryBadge category={report.waste_category} size="sm" />
                      <span className="text-[11px] font-medium text-[#5d6f66]">
                        {report.confidence_score
                          ? `(${Math.round(report.confidence_score * 100)}% akurasi)`
                          : ""}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#2e4a21]">
                      {report.title}
                    </h3>

                    <p className="text-xs text-[#5d6f66] flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#259e73] shrink-0" />
                      <span>{report.address || "Koordinat GPS"}</span>
                    </p>

                    <p className="text-[11px] text-[#5d6f66] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span suppressHydrationWarning>Diajukan: {formatDate(report.created_at)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-end md:self-center shrink-0">
                  <StatusBadge status={report.status} />

                  <Link to={`/user/reports/${report.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-[#259e73] hover:bg-[#acebd4]/20"
                    >
                      <span>Detail Lengkap</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
