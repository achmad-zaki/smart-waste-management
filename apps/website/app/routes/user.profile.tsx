import React, { useState } from "react";
import { User, Mail, Phone, Lock, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    name: "Ahmad Qomaruddin",
    email: "ahmad@warga.id",
    phone: "0857-1122-3344",
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
          Profil Akun Warga
        </h1>
        <p className="text-sm text-[#5d6f66] mt-0.5">
          Perbarui informasi kontak dan keamanan akun pelapor Anda.
        </p>
      </div>

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
              Data profil berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="userName" required>Nama Lengkap</Label>
              <div className="mt-1.5">
                <Input
                  id="userName"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="userEmail">Alamat Email (Permanen)</Label>
              <div className="mt-1.5">
                <Input
                  id="userEmail"
                  value={profile.email}
                  disabled
                  className="bg-[#f5f8f6] cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#5d6f66]">
                Email digunakan sebagai identitas akun utama dan tidak dapat diganti.
              </p>
            </div>

            <div>
              <Label htmlFor="userPhone">Nomor WhatsApp / Kontak Aktif</Label>
              <div className="mt-1.5">
                <Input
                  id="userPhone"
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

        {/* Change Password Card */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#f0f4f2]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#259e73]/15 text-[#259e73]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2e4a21]">Ganti Kata Sandi</h3>
              <p className="text-xs text-[#5d6f66]">Amankan akun Anda dengan sandi yang kuat</p>
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
              <Label htmlFor="uCurrPass" required>Kata Sandi Saat Ini</Label>
              <div className="mt-1.5">
                <Input
                  id="uCurrPass"
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
              <Label htmlFor="uNewPass" required>Kata Sandi Baru</Label>
              <div className="mt-1.5">
                <Input
                  id="uNewPass"
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
              <Label htmlFor="uConfPass" required>Konfirmasi Kata Sandi Baru</Label>
              <div className="mt-1.5">
                <Input
                  id="uConfPass"
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

