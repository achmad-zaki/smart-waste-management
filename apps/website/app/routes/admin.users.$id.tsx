import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  AlertCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import type { Route } from "./+types/admin.users.$id";
import { useAdminUserDetail } from "~/features/users/hooks/use-admin-users";
import { getApiErrorMessage } from "~/lib/axios";

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
  const userId = Number(id) || 0;

  const { data: user, isLoading, isError, error, refetch } = useAdminUserDetail(userId);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/users">
          <Button variant="ghost" size="sm" className="gap-1.5 text-[#5d6f66] hover:text-[#2e4a21]">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Pengguna
          </Button>
        </Link>
        <span className="text-[#c2d8cd]">|</span>
        <span className="text-xs font-semibold text-[#2e4a21]">
          Detail Pengguna: {user.name}
        </span>
      </div>

      {/* User Info Card */}
      <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#acebd4] text-[#2e4a21] font-bold text-xl border border-[#259e73]/20">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
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
              </div>
              <p className="text-xs text-[#5d6f66] mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[#259e73]" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-[#259e73]" />
                  {user.phone || "-"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#5d6f66]" />
                  Bergabung: {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#f5f8f6] p-3 border border-[#e2ebe6] text-center px-6">
            <span className="text-2xl font-extrabold text-[#2e4a21]">
              {user.reports_count ?? 0}
            </span>
            <p className="text-[11px] text-[#5d6f66]">Total Laporan Diajukan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
