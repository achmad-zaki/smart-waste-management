import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit,
  Trash2,
} from "lucide-react";
import {
  initialReports,
  categoryLabels,
  statusLabels,
  type ReportStatus,
  type WasteCategory,
  type WasteReport,
} from "~/lib/mock-data";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { Modal } from "~/components/ui/modal";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function AdminReportsPage() {
  const [searchParams] = useSearchParams();
  const initialStatusFilter = searchParams.get("status") || "all";

  const [reports, setReports] = useState<WasteReport[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State for Quick Status Change
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>("in_progress");
  const [statusNote, setStatusNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" || report.status === statusFilter;

      const matchCategory =
        categoryFilter === "all" || report.waste_category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [reports, searchTerm, statusFilter, categoryFilter]);

  const handleOpenStatusModal = (report: WasteReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setStatusNote("");
    setIsModalOpen(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const updated = reports.map((r) => {
      if (r.id === selectedReport.id) {
        const newHistory = {
          id: Date.now(),
          waste_report_id: r.id,
          changed_by_name: "Admin Dinas Lingkungan",
          old_status: r.status,
          new_status: newStatus,
          note: statusNote || `Status diperbarui menjadi ${statusLabels[newStatus].label}.`,
          created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        };
        return {
          ...r,
          status: newStatus,
          updated_at: newHistory.created_at,
          status_histories: [...r.status_histories, newHistory],
        };
      }
      return r;
    });

    setReports(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
            Kelola Seluruh Laporan Sampah
          </h1>
          <p className="text-sm text-[#5d6f66] mt-0.5">
            Daftar pengaduan warga secara komprehensif. Perbarui status penanganan dan koordinasikan armada kebersihan.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#5d6f66]" />
            <Input
              type="text"
              placeholder="Cari judul, nama pelapor, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="in_progress">Sedang Ditangani</option>
              <option value="completed">Selesai</option>
              <option value="rejected">Ditolak</option>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Semua Kategori AI</option>
              <option value="plastic">Plastik</option>
              <option value="organic">Organik</option>
              <option value="paper">Kertas</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f8f6] text-[#5d6f66] border-b border-[#e2ebe6]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Foto & ID</th>
                <th className="px-5 py-3.5 font-semibold">Judul & Lokasi Sampah</th>
                <th className="px-5 py-3.5 font-semibold">Kategori Prediksi AI</th>
                <th className="px-5 py-3.5 font-semibold">Pelapor & Waktu</th>
                <th className="px-5 py-3.5 font-semibold">Status Penanganan</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f2]">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5d6f66]">
                    <AlertCircle className="mx-auto h-8 w-8 text-[#f2bf87] mb-2" />
                    <p className="text-sm font-semibold text-[#2e4a21]">Tidak ada laporan yang sesuai</p>
                    <p className="text-xs text-[#5d6f66] mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const cat = categoryLabels[report.waste_category];
                  const stat = statusLabels[report.status];
                  return (
                    <tr key={report.id} className="hover:bg-[#f5f8f6]/60 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={report.image_url}
                            alt={report.title}
                            className="h-12 w-12 rounded-lg object-cover border border-[#e2ebe6] shrink-0"
                          />
                          <div>
                            <span className="font-mono text-xs font-bold text-[#2e4a21]">
                              #{report.id}
                            </span>
                            <p className="text-[10px] text-[#5d6f66]">
                              {report.confidence_score ? `${Math.round(report.confidence_score * 100)}% conf.` : "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-semibold text-[#2e4a21] line-clamp-1">
                          {report.title}
                        </p>
                        <p className="text-[11px] text-[#5d6f66] flex items-center gap-1 mt-0.5 line-clamp-1">
                          <MapPin className="h-3 w-3 text-[#259e73] shrink-0" />
                          {report.address}
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badgeClass}`}
                        >
                          <Sparkles className="h-3 w-3" />
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-medium text-[#2e4a21]">{report.user_name}</p>
                        <p className="text-[11px] text-[#5d6f66] flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-[#5d6f66]" />
                          {report.created_at}
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenStatusModal(report)}
                          title="Klik untuk ubah status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-transform hover:scale-105 cursor-pointer ${stat.bg} ${stat.text} ${stat.border}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {stat.label}
                          <Edit className="h-3 w-3 ml-1 opacity-70" />
                        </button>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/admin/reports/${report.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-[#259e73] hover:bg-[#acebd4]/20">
                              Detail
                              <ExternalLink className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(report.id)}
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            title="Hapus Laporan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="px-6 py-3.5 bg-[#f5f8f6] border-t border-[#e2ebe6] flex items-center justify-between text-xs text-[#5d6f66]">
          <span>Menampilkan {filteredReports.length} dari total {reports.length} laporan</span>
          <span className="font-medium text-[#2e4a21]">Halaman 1 dari 1</span>
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
                  <option value="pending">Menunggu Verifikasi</option>
                  <option value="in_progress">Sedang Ditangani</option>
                  <option value="completed">Selesai Ditangani</option>
                  <option value="rejected">Tolak Laporan</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="statusNote">Catatan Penanganan / Alasan</Label>
              <div className="mt-1.5">
                <Textarea
                  id="statusNote"
                  rows={3}
                  placeholder="Contoh: Petugas regu kuning telah mengangkut tumpukan sampah plastik..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f2]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan Perubahan Status
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

