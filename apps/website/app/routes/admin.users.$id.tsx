import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  AlertCircle,
  Edit,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Modal } from "~/components/ui/modal";
import { Select } from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { ClientDate } from "~/components/common/client-date";
import type { Route } from "./+types/admin.users.$id";
import {
  useAdminUserDetail,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "~/features/users/hooks/use-admin-users";
import { getApiErrorMessage } from "~/lib/axios";
import type { Role } from "~/types/user.types";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Detail Pengguna #${params.id} - Admin Smart Waste` },
    {
      name: "description",
      content: "Profil lengkap pengguna dan riwayat kontribusi pelaporan sampah.",
    },
  ];
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id) || 0;

  const { data: user, isLoading, isError, error, refetch } = useAdminUserDetail(userId);
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setRole(user.role);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#5d6f66]">
        <Spinner className="size-8 text-[#259e73] mb-3" />
        <p className="text-sm font-medium">Memuat profil pengguna #{id}...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold text-red-800">Pengguna tidak ditemukan</h3>
        <p className="text-sm text-red-600 mt-1">{getApiErrorMessage(error)}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
          <Link to="/admin/users">
            <Button size="sm" variant="primary">
              Kembali ke Daftar Pengguna
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const userInitial = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(
      {
        id: user.id,
        data: {
          name,
          phone: phone || undefined,
          role,
        },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setNotification({
            type: "success",
            text: "Data profil pengguna berhasil diperbarui.",
          });
          setTimeout(() => setNotification(null), 4000);
        },
        onError: (err) => {
          setNotification({
            type: "error",
            text: `Gagal memperbarui pengguna: ${getApiErrorMessage(err)}`,
          });
        },
      }
    );
  };

  const handleDeleteUser = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun "${user.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteUserMutation.mutate(user.id, {
        onSuccess: () => {
          navigate("/admin/users");
        },
        onError: (err) => {
          setNotification({
            type: "error",
            text: `Gagal menghapus pengguna: ${getApiErrorMessage(err)}`,
          });
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/users">
            <Button variant="ghost" size="sm" className="gap-1.5 text-[#5d6f66] hover:text-[#2e4a21]">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Pengguna
            </Button>
          </Link>
          <span className="text-[#c2d8cd]">|</span>
          <span className="text-xs font-semibold text-[#2e4a21]">
            Profil Pengguna: {user.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-semibold gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Pengguna</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteUser}
            disabled={deleteUserMutation.isPending}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Hapus Akun</span>
          </Button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {notification && (
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 text-sm animate-in fade-in ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* User Info Overview Card */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#acebd4] text-[#2e4a21] font-bold text-xl border border-[#259e73]/20 shrink-0">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[#2e4a21]">{user.name}</h1>
                {user.role === "admin" ? (
                  <span className="rounded-full bg-[#2e4a21] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Administrator
                  </span>
                ) : (
                  <span className="rounded-full bg-[#acebd4]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#2e4a21] border border-[#acebd4]">
                    Warga Pelapor
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#5d6f66]">ID: #{user.id}</span>
              </div>
              <p className="text-xs text-[#5d6f66] mt-1.5 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[#259e73]" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-[#259e73]" />
                  {user.phone || "Tidak ada nomor"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#5d6f66]" />
                  Bergabung: <ClientDate date={user.created_at} format="date" />
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#f5f8f6] p-4 border border-[#e2ebe6] text-center min-w-[160px]">
            <span className="text-3xl font-extrabold text-[#2e4a21]">
              {user.reports_count ?? 0}
            </span>
            <p className="text-[11px] text-[#5d6f66] mt-0.5">Total Laporan Diajukan</p>
          </div>
        </div>
      </div>

      {/* Reports & Contributions Section */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f2]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#259e73]" />
            <h3 className="text-sm font-semibold text-[#2e4a21]">
              Riwayat Pengaduan & Laporan Warga
            </h3>
          </div>

          <Link
            to={`/admin/reports?search=${encodeURIComponent(user.name)}`}
            className="text-xs font-semibold text-[#259e73] hover:underline flex items-center gap-1"
          >
            <span>Buka Laporan Terkait di Tabel</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 text-xs text-[#5d6f66]">
          <p>
            Pengguna ini telah berpartisipasi dengan mengirimkan{" "}
            <strong className="text-[#2e4a21]">{user.reports_count ?? 0} laporan sampah</strong> ke dalam sistem.
            Untuk memverifikasi atau meninjau laporan spesifik dari warga ini, klik tautan di atas untuk menyaring laporan berdasarkan nama pelapor.
          </p>
        </div>
      </div>

      {/* Edit User Modal (PUT /api/admin/users/:id) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Data Pengguna #${user.id}`}
        description={`Email: ${user.email}`}
      >
        <form onSubmit={handleUpdateUserSubmit} className="space-y-4">
          {updateUserMutation.error && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {getApiErrorMessage(updateUserMutation.error)}
            </p>
          )}

          <div>
            <Label htmlFor="detailEditName" required>Nama Lengkap</Label>
            <div className="mt-1.5">
              <Input
                id="detailEditName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="detailEditPhone">Nomor Telepon</Label>
            <div className="mt-1.5">
              <Input
                id="detailEditPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-3344-5566"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="detailEditRole" required>Hak Akses (Role)</Label>
            <div className="mt-1.5">
              <Select
                id="detailEditRole"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="user">Warga / Pelapor Biasa</option>
                <option value="admin">Administrator Dinas (DLH)</option>
              </Select>
            </div>
            <p className="text-[11px] text-[#5d6f66] mt-1">
              Catatan: Menurunkan role admin terakhir dicegah demi keamanan sistem.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f4f2]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateUserMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <>
                  <Spinner className="mr-1.5" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
