import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import type { Route } from "./+types/user.profile";
import {
  useProfile,
  useUpdatePassword,
  useUpdateProfile,
} from "~/features/users/hooks/use-profile";
import { getApiErrorMessage } from "~/lib/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profil Pengguna - Smart Waste Management" },
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#5d6f66]">
        <Spinner className="size-8 text-[#259e73] mb-3" />
        <p className="text-sm font-medium">Memuat profil akun Anda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
          Profil Akun Warga
        </h1>
        <p className="text-sm text-[#5d6f66] mt-0.5">
          Perbarui informasi kontak dan keamanan akun pelapor Anda.
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
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#f0f4f2]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#acebd4] text-[#2e4a21] font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2e4a21]">Data Diri Pelapor</h3>
              <p className="text-xs text-[#5d6f66]">Digunakan oleh dinas untuk verifikasi laporan</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-4 rounded-lg bg-[#259e73]/15 border border-[#259e73]/30 p-3 text-xs text-[#2e4a21] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
              Informasi kontak Anda berhasil disimpan!
            </div>
          )}

          {updateProfileMutation.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
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
                  className="bg-[#f5f8f6] cursor-not-allowed text-[#889990]"
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
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
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
                  Simpan Kontak Profil
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#f0f4f2]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#259e73]/15 text-[#259e73]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2e4a21]">Ganti Kata Sandi</h3>
              <p className="text-xs text-[#5d6f66]">Jaga keamanan akun pelaporan Anda</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="mb-4 rounded-lg bg-[#259e73]/15 border border-[#259e73]/30 p-3 text-xs text-[#2e4a21] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
              Kata sandi Anda berhasil diperbarui!
            </div>
          )}

          {updatePasswordMutation.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
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
                />
              </div>
            </div>

            <div>
              <Label htmlFor="userConfPass" required>Ulangi Kata Sandi Baru</Label>
              <div className="mt-1.5">
                <Input
                  id="userConfPass"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="forest"
              className="w-full"
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
    </div>
  );
}
