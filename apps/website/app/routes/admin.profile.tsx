import React, { useState } from "react";
import { ShieldCheck, Mail, Phone, Lock, Save, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Admin Dinas Lingkungan Hidup",
    email: "admin@smartwaste.id",
    phone: "0812-3456-7890",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
          Profil Akun Administrator
        </h1>
        <p className="text-sm text-[#5d6f66] mt-0.5">
          Kelola data diri petugas dan keamanan autentikasi sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info Card */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#f0f4f2]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2e4a21] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2e4a21]">Informasi Data Diri</h3>
              <p className="text-xs text-[#5d6f66]">Data profil petugas berwenang</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-4 rounded-lg bg-[#259e73]/15 border border-[#259e73]/30 p-3 text-xs text-[#2e4a21] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
              Data profil berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="adminName" required>Nama Administrator</Label>
              <div className="mt-1.5">
                <Input
                  id="adminName"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="adminEmail">Alamat Email (Terkunci)</Label>
              <div className="mt-1.5">
                <Input
                  id="adminEmail"
                  value={profile.email}
                  disabled
                  className="bg-[#f5f8f6] cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#5d6f66]">
                Email dinas hanya dapat diubah oleh administrator jaringan.
              </p>
            </div>

            <div>
              <Label htmlFor="adminPhone">Nomor Telepon Dinas</Label>
              <div className="mt-1.5">
                <Input
                  id="adminPhone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              <Save className="h-4 w-4 mr-1.5" />
              Simpan Profil
            </Button>
          </form>
        </div>

        {/* Password Security Card */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#f0f4f2]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#259e73]/15 text-[#259e73]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2e4a21]">Keamanan Kata Sandi</h3>
              <p className="text-xs text-[#5d6f66]">Perbarui sandi akses panel admin</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="mb-4 rounded-lg bg-[#259e73]/15 border border-[#259e73]/30 p-3 text-xs text-[#2e4a21] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
              Kata sandi berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="currPass" required>Kata Sandi Saat Ini</Label>
              <div className="mt-1.5">
                <Input
                  id="currPass"
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
              <Label htmlFor="newPass" required>Kata Sandi Baru</Label>
              <div className="mt-1.5">
                <Input
                  id="newPass"
                  type="password"
                  placeholder="Minimal 8 karakter kombinasi"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confPass" required>Ulangi Kata Sandi Baru</Label>
              <div className="mt-1.5">
                <Input
                  id="confPass"
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

            <Button type="submit" variant="forest" className="w-full">
              <Lock className="h-4 w-4 mr-1.5" />
              Perbarui Kata Sandi
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

