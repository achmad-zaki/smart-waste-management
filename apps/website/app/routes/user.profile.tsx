import {
  AlertCircle,
  CheckCircle2,
  Lock,
  LogOut,
  Save,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { useLogout } from "~/features/auth/hooks/use-auth";
import {
  useProfile,
  useUpdatePassword,
  useUpdateProfile,
} from "~/features/users/hooks/use-profile";
import { getApiErrorMessage } from "~/lib/axios";
import type { Route } from "./+types/user.profile";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Profil Pengguna - Warga Smart Waste" },
    {
      name: "description",
      content: "Kelola informasi profil warga dan pengaturan kata sandi akun pelapor sampah.",
    },
  ];
}

export default function UserProfilePage() {
  const { data: userProfile, isLoading, isError, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();
  const logoutMutation = useLogout();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setPhone(userProfile.phone || "");
    }
  }, [userProfile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      { name, phone },
      {
        onSuccess: () => {
          setProfileSuccess(true);
          setTimeout(() => setProfileSuccess(false), 4000);
        },
      }
    );
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    updatePasswordMutation.mutate(
      {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      },
      {
        onSuccess: () => {
          setPasswordSuccess(true);
          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setTimeout(() => setPasswordSuccess(false), 4000);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Spinner className="size-8 text-[#107549] mb-3" />
        <p className="text-sm font-medium">Memuat profil akun Anda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#181d1a]">
          Profil Akun Warga
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Perbarui informasi data diri pelapor dan pengaturan keamanan kata sandi akun Anda.
        </p>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-2.5 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>Gagal memuat profil: {getApiErrorMessage(error)}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#107549]/10 text-[#107549]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181d1a]">Data Diri Pelapor</h3>
              <p className="text-xs text-gray-400">Digunakan oleh dinas untuk koordinasi lapangan</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Informasi data diri Anda berhasil disimpan!
            </div>
          )}

          {updateProfileMutation.error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {getApiErrorMessage(updateProfileMutation.error)}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="citizenName" required>Nama Lengkap</Label>
              <div className="mt-1.5">
                <Input
                  id="citizenName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-xs h-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="citizenEmail">Alamat Email (Permanen)</Label>
              <div className="mt-1.5">
                <Input
                  id="citizenEmail"
                  value={userProfile?.email || ""}
                  disabled
                  className="bg-gray-50 cursor-not-allowed text-gray-500 text-xs h-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="citizenPhone">Nomor WhatsApp / Seluler</Label>
              <div className="mt-1.5">
                <Input
                  id="citizenPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="text-xs h-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs font-semibold h-10 mt-2"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Spinner className="mr-1.5" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Simpan Profil
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#107549]/10 text-[#107549]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181d1a]">Ganti Kata Sandi</h3>
              <p className="text-xs text-gray-400">Jaga keamanan akun pelaporan Anda</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Kata sandi Anda berhasil diperbarui!
            </div>
          )}

          {updatePasswordMutation.error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {getApiErrorMessage(updatePasswordMutation.error)}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="curPass" required>Kata Sandi Saat Ini</Label>
              <div className="mt-1.5">
                <Input
                  id="curPass"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                  className="text-xs h-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="userNewPass" required>Kata Sandi Baru</Label>
              <div className="mt-1.5">
                <Input
                  id="userNewPass"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  className="text-xs h-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="userConfirmPass" required>Konfirmasi Kata Sandi Baru</Label>
              <div className="mt-1.5">
                <Input
                  id="userConfirmPass"
                  type="password"
                  placeholder="Ulangi kata sandi baru"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  className="text-xs h-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs font-semibold h-10 mt-2"
              disabled={updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending ? (
                <>
                  <Spinner className="mr-1.5" />
                  Memperbarui Sandi...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-1.5" />
                  Perbarui Kata Sandi
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Account Actions / Opsi Sesi */}
      <div className="rounded-2xl border border-[#e5e9e7] bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#181d1a]">Keluar Sesi Akun</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Keluar dari sesi akun Smart Waste Anda pada perangkat ini.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-semibold cursor-pointer h-9 px-4 rounded-xl"
          >
            <LogOut className="h-4 w-4 mr-1.5 text-red-500" />
            Keluar dari Akun
          </Button>
        </div>
      </div>
    </div>
  );
}
