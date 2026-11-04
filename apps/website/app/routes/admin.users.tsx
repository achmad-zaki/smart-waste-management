import React, { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  UserPlus,
  Shield,
  User,
  Phone,
  Mail,
  Calendar,
  FileSpreadsheet,
  ExternalLink,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Modal } from "~/components/ui/modal";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import type { Route } from "./+types/admin.users";
import {
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
} from "~/features/users/hooks/use-admin-users";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kelola Pengguna - Admin Smart Waste" },
    {
      name: "description",
      content: "Kelola akun warga dan administrator dalam ekosistem Smart Waste Management.",
    },
  ];
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data, isLoading, isError, error, refetch } = useAdminUsers({
    search: searchTerm.trim() ? searchTerm.trim() : undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });

  const createUserMutation = useCreateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();

  const users = data?.users || [];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as "admin" | "user",
    password: "",
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(
      {
        name: newUserData.name,
        email: newUserData.email,
        phone: newUserData.phone,
        role: newUserData.role,
        password: newUserData.password,
        password_confirmation: newUserData.password,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewUserData({ name: "", email: "", phone: "", role: "user", password: "" });
        },
      }
    );
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menonaktifkan / menghapus pengguna ini?")) {
      deleteUserMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
            Kelola Akun Pengguna
          </h1>
          <p className="text-sm text-[#5d6f66] mt-0.5">
            Daftar seluruh warga pelapor dan akun administrator dinas kebersihan.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 font-semibold shadow-xs"
        >
          <UserPlus className="h-4 w-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#5d6f66]" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama atau email pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="sm:col-span-4">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Semua Peran (Role)</option>
              <option value="admin">Administrator Dinas (DLH)</option>
              <option value="user">Warga / Pelapor Biasa</option>
            </Select>
          </div>
        </div>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <span>Gagal memuat pengguna: {getApiErrorMessage(error)}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f8f6] text-[#5d6f66] border-b border-[#e2ebe6]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Pengguna</th>
                <th className="px-5 py-3.5 font-semibold">Kontak</th>
                <th className="px-5 py-3.5 font-semibold">Peran (Role)</th>
                <th className="px-5 py-3.5 font-semibold">Aktivitas Laporan</th>
                <th className="px-5 py-3.5 font-semibold">Terdaftar</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f2]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#5d6f66]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-[#259e73]" />
                      <span>Memuat data pengguna...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#5d6f66]">
                    Tidak ada akun pengguna yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f5f8f6]/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                            user.role === "admin"
                              ? "bg-[#2e4a21] text-white"
                              : "bg-[#acebd4] text-[#2e4a21]"
                          }`}
                        >
                          {user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2e4a21]">{user.name}</p>
                          <p className="text-[11px] text-[#5d6f66]">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-[#2e4a21] flex items-center gap-1.5 font-medium">
                        <Mail className="h-3.5 w-3.5 text-[#5d6f66]" />
                        {user.email}
                      </p>
                      <p className="text-[11px] text-[#5d6f66] flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3 text-[#5d6f66]" />
                        {user.phone || "-"}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#2e4a21]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#2e4a21] border border-[#2e4a21]/20">
                          <Shield className="h-3 w-3 text-[#259e73]" />
                          Administrator DLH
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#acebd4]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#259e73] border border-[#259e73]/20">
                          <User className="h-3 w-3" />
                          Warga Pelapor
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[#2e4a21]">
                      <span className="flex items-center gap-1">
                        <FileSpreadsheet className="h-3.5 w-3.5 text-[#259e73]" />
                        {user.reports_count ?? 0} Laporan
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-[#5d6f66]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#5d6f66]" />
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/admin/users/${user.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-[#259e73] hover:bg-[#acebd4]/20">
                            Detail
                            <ExternalLink className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                        {user.role !== "admin" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUserMutation.isPending}
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                            title="Hapus Akun Pengguna"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Pengguna Baru"
        description="Buat akun admin atau akun warga baru ke dalam database sistem."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {createUserMutation.error && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {getApiErrorMessage(createUserMutation.error)}
            </p>
          )}

          <div>
            <Label htmlFor="addName" required>Nama Lengkap</Label>
            <div className="mt-1.5">
              <Input
                id="addName"
                placeholder="Contoh: Rina Kusuma"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addEmail" required>Alamat Email</Label>
            <div className="mt-1.5">
              <Input
                id="addEmail"
                type="email"
                placeholder="rina@gmail.com"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addPhone">Nomor Telepon</Label>
            <div className="mt-1.5">
              <Input
                id="addPhone"
                type="tel"
                placeholder="0812-3344-5566"
                value={newUserData.phone}
                onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addRole" required>Hak Akses (Role)</Label>
            <div className="mt-1.5">
              <Select
                id="addRole"
                value={newUserData.role}
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as "admin" | "user" })}
              >
                <option value="user">Warga / Pelapor Biasa</option>
                <option value="admin">Administrator Dinas (DLH)</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="addPassword" required>Kata Sandi Sementara</Label>
            <div className="mt-1.5">
              <Input
                id="addPassword"
                type="password"
                placeholder="Minimal 8 karakter"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f4f2]">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Pengguna"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
