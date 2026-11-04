import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShieldCheck, Recycle, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("ahmad@warga.id");
  const [password, setPassword] = useState("password123");

  const handleRoleToggle = (role: "user" | "admin") => {
    setSelectedRole(role);
    if (role === "admin") {
      setEmail("admin@smartwaste.id");
      setPassword("admin123");
    } else {
      setEmail("ahmad@warga.id");
      setPassword("password123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#2e4a21] p-12 text-white relative overflow-hidden">
        {/* Subtle decorative circles with brand colors */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#259e73]/20 blur-3xl" />
        <div className="absolute right-20 bottom-10 h-80 w-80 rounded-full bg-[#f2bf87]/15 blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#259e73] text-white shadow-lg">
              <Recycle className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                Smart Waste Management
              </span>
              <span className="text-xs text-[#acebd4]">
                Solusi Pelaporan Sampah Cerdas Berbasis AI
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
            Wujudkan Lingkungan Bersih dengan Partisipasi Nyata & Kecerdasan Buatan.
          </h1>
          <p className="text-sm text-[#acebd4] leading-relaxed">
            Foto sampah di sekitar Anda, biarkan model AI MobileNetV2 mengklasifikasikan jenisnya secara otomatis, dan pantau proses penanganannya secara transparan.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-5 w-5 text-[#259e73]" />
              <span>Klasifikasi Sampah Cepat: Organik, Plastik, & Kertas</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-5 w-5 text-[#acebd4]" />
              <span>Deteksi Koordinat GPS Otomatis via Browser</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-5 w-5 text-[#f2bf87]" />
              <span>Pemantauan Status Laporan Terpadu Real-Time</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#acebd4]/70">
          Smart Waste Management System • Versi 1.2
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 bg-[#fcfcfc]">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#2e4a21] tracking-tight">
              Masuk ke Akun
            </h2>
            <p className="mt-1 text-sm text-[#5d6f66]">
              Pilih peran dan masukkan kredensial untuk mengakses sistem.
            </p>
          </div>

          {/* Role Quick Selector */}
          <div className="mb-6 rounded-xl bg-[#f5f8f6] p-1.5 border border-[#e2ebe6]">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => handleRoleToggle("user")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                  selectedRole === "user"
                    ? "bg-[#259e73] text-white shadow-xs"
                    : "text-[#5d6f66] hover:text-[#2e4a21]"
                }`}
              >
                <Recycle className="h-4 w-4" />
                Portal Warga (User)
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle("admin")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
                  selectedRole === "admin"
                    ? "bg-[#2e4a21] text-white shadow-xs"
                    : "text-[#5d6f66] hover:text-[#2e4a21]"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Panel Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" required>
                Alamat Email
              </Label>
              <div className="mt-1.5">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" required>
                  Kata Sandi
                </Label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-[#259e73] hover:underline"
                >
                  Lupa sandi?
                </a>
              </div>
              <div className="mt-1.5">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold"
              variant={selectedRole === "admin" ? "forest" : "primary"}
            >
              Masuk sebagai {selectedRole === "admin" ? "Admin" : "Warga"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Switch Hint */}
          <div className="mt-6 rounded-xl border border-[#acebd4] bg-[#acebd4]/20 p-4">
            <div className="flex items-start gap-2.5 text-xs text-[#2e4a21]">
              <Sparkles className="h-4 w-4 text-[#259e73] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Mode Uji Coba Cepat (Demo):</p>
                <p className="text-[#5d6f66] mt-0.5">
                  Klik tombol peran di atas untuk otomatis mengisi akun contoh Warga atau Admin.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-[#5d6f66]">
            Belum memiliki akun warga?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#259e73] hover:underline"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

