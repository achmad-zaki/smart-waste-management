import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { Modal } from "~/components/ui/modal";
import { Select } from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "~/features/users/hooks/use-admin-users";
import { getApiErrorMessage } from "~/lib/axios";
import type { Role, UserAccount } from "~/types/user.types";
import type { Route } from "./+types/admin.users";

export function meta({ }: Route.MetaArgs) {
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminUsers({
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    page,
    per_page: perPage,
  });

  const createUserMutation = useCreateAdminUser();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();

  const allUsers = data?.users || [];
  // Filter by role on client side if requested
  const users = roleFilter === "all" ? allUsers : allUsers.filter((u) => u.role === roleFilter);

  const meta = data?.meta;
  const totalPages = meta?.last_page || 1;
  const totalUsers = meta?.total || users.length;

  // Create User Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as Role,
    password: "",
  });

  // Edit User Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    role: "user" as Role,
  });

  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      phone: user.phone || "",
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(
      {
        name: newUserData.name,
        email: newUserData.email,
        phone: newUserData.phone || undefined,
        role: newUserData.role,
        password: newUserData.password,
        password_confirmation: newUserData.password,
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setNewUserData({ name: "", email: "", phone: "", role: "user", password: "" });
          setActionMessage({
            type: "success",
            text: "Akun pengguna baru berhasil ditambahkan.",
          });
          setTimeout(() => setActionMessage(null), 4000);
        },
      }
    );
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserMutation.mutate(
      {
        id: editingUser.id,
        data: {
          name: editFormData.name,
          phone: editFormData.phone || undefined,
          role: editFormData.role,
        },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingUser(null);
          setActionMessage({
            type: "success",
            text: `Data akun #${editingUser.id} berhasil diperbarui.`,
          });
          setTimeout(() => setActionMessage(null), 4000);
        },
      }
    );
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${user.name}"?`)) {
      deleteUserMutation.mutate(user.id, {
        onSuccess: () => {
          setActionMessage({
            type: "success",
            text: `Akun "${user.name}" berhasil dihapus.`,
          });
          setTimeout(() => setActionMessage(null), 4000);
        },
        onError: (err) => {
          setActionMessage({
            type: "error",
            text: `Gagal menghapus pengguna: ${getApiErrorMessage(err)}`,
          });
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
              Kelola Akun Pengguna
            </h1>
            <span className="rounded-full bg-[#acebd4]/40 px-2.5 py-0.5 text-xs font-semibold text-[#2e4a21] border border-[#259e73]/20">
              {totalUsers} Pengguna Terdaftar
            </span>
          </div>
          <p className="text-xs text-[#5d6f66] mt-1">
            Daftar seluruh warga pelapor dan akun administrator dinas kebersihan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? "Menyegarkan..." : "Segarkan"}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Pengguna</span>
          </Button>
        </div>
      </div>

      {/* Notification Alert */}
      {actionMessage && (
        <div
          className={`rounded-xl border p-4 flex items-center justify-between text-xs font-medium animate-in fade-in ${
            actionMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Search and Role Filter Toolbar */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <InputGroup className="h-10 bg-white border-[#e2ebe6] rounded-xl focus-within:border-[#259e73] focus-within:ring-2 focus-within:ring-[#259e73]/20">
              <InputGroupAddon align="inline-start">
                <Search className="h-4 w-4 text-[#5d6f66]" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="Cari berdasarkan nama atau email pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs sm:text-sm text-[#2e4a21]"
              />
              {searchTerm && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setSearchTerm("")}
                    title="Hapus pencarian"
                    aria-label="Clear query"
                    className="text-[#5d6f66] hover:text-[#2e4a21] hover:bg-[#f5f8f6] cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>

          <div className="sm:col-span-4">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "all" | "admin" | "user")}
              className="text-xs h-10 bg-white"
            >
              <option value="all">Semua Peran (Role)</option>
              <option value="admin">Administrator (Admin DLH)</option>
              <option value="user">Warga Pelapor (User)</option>
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
        <Table>
          <TableHeader className="bg-[#f5f8f6]">
            <TableRow className="border-b border-[#e2ebe6] hover:bg-transparent">
              <TableHead className="px-5 py-3.5 font-semibold text-[#5d6f66] text-xs">Pengguna</TableHead>
              <TableHead className="px-5 py-3.5 font-semibold text-[#5d6f66] text-xs">Kontak</TableHead>
              <TableHead className="px-5 py-3.5 font-semibold text-[#5d6f66] text-xs">Peran (Role)</TableHead>
              <TableHead className="px-5 py-3.5 font-semibold text-[#5d6f66] text-xs">Aktivitas Laporan</TableHead>
              <TableHead className="px-5 py-3.5 font-semibold text-[#5d6f66] text-xs">Terdaftar</TableHead>
              <TableHead className="px-5 py-3.5 font-semibold text-[#5d6f66] text-xs text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#f0f4f2] text-xs">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#5d6f66]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner className="size-6 text-[#259e73]" />
                    <span>Memuat data pengguna...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#5d6f66]">
                  Tidak ada akun pengguna yang sesuai dengan kriteria pencarian.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-[#f5f8f6]/60 transition-colors">
                  <TableCell className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-[#2e4a21] text-white"
                            : "bg-[#acebd4] text-[#2e4a21]"
                        }`}
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2e4a21]">{user.name}</p>
                        <p className="text-[11px] text-[#5d6f66]">ID: #{user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap">
                    <p className="text-[#2e4a21] flex items-center gap-1.5 font-medium">
                      <Mail className="h-3.5 w-3.5 text-[#5d6f66]" />
                      {user.email}
                    </p>
                    <p className="text-[11px] text-[#5d6f66] flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3 w-3 text-[#5d6f66]" />
                      {user.phone || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap">
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
                  </TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap font-medium text-[#2e4a21]">
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-[#259e73]" />
                      {user.reports_count ?? 0} Laporan
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap text-[#5d6f66]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#5d6f66]" />
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(user)}
                        className="h-8 px-2.5 text-xs text-gray-600 hover:text-[#2e4a21] hover:bg-[#f5f8f6]"
                        title="Edit Data Pengguna"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline ml-1">Edit</span>
                      </Button>

                      <Link to={`/admin/users/${user.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs text-[#259e73] hover:bg-[#acebd4]/20"
                          title="Lihat Detail Pengguna"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline ml-1">Detail</span>
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user)}
                        disabled={deleteUserMutation.isPending}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        title="Hapus Akun Pengguna"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Table Footer with Pagination Controls */}
        <div className="px-6 py-3.5 bg-[#f5f8f6] border-t border-[#e2ebe6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5d6f66]">
          <div className="flex items-center gap-3">
            <span>
              Menampilkan {users.length} dari {totalUsers} pengguna
            </span>
            <div className="flex items-center gap-1">
              <span>Per baris:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-[#e2ebe6] bg-white px-2 py-0.5 text-xs text-[#2e4a21] focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-[#2e4a21] mr-1">
              Halaman {meta?.current_page || page} dari {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="h-8 w-8"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 5 && page > 3) {
                pageNum = page - 2 + idx;
                if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
              }
              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                    pageNum === page
                      ? "bg-[#259e73] text-white shadow-xs"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-8 w-8"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add User Modal (POST /api/admin/users) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
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
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as Role })}
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
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? (
                <>
                  <Spinner className="mr-1.5" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Pengguna"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal (PUT /api/admin/users/:id) */}
      {editingUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Akun Pengguna #${editingUser.id}`}
          description={`Email: ${editingUser.email} (Email bersifat permanen)`}
        >
          <form onSubmit={handleUpdateUser} className="space-y-4">
            {updateUserMutation.error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {getApiErrorMessage(updateUserMutation.error)}
              </p>
            )}

            <div>
              <Label htmlFor="editName" required>Nama Lengkap</Label>
              <div className="mt-1.5">
                <Input
                  id="editName"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editPhone">Nomor Telepon</Label>
              <div className="mt-1.5">
                <Input
                  id="editPhone"
                  type="tel"
                  placeholder="0812-3344-5566"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editRole" required>Hak Akses (Role)</Label>
              <div className="mt-1.5">
                <Select
                  id="editRole"
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as Role })}
                >
                  <option value="user">Warga / Pelapor Biasa</option>
                  <option value="admin">Administrator Dinas (DLH)</option>
                </Select>
              </div>
              <p className="text-[11px] text-[#5d6f66] mt-1">
                Catatan: Sistem akan mencegah penurunan role jika hanya tersisa 1 administrator.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f4f2]">
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={updateUserMutation.isPending}>
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
      )}
    </div>
  );
}
