import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Recycle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration
    navigate("/user/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#2e4a21] p-12 text-white relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[#259e73]/20 blur-3xl" />
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#f2bf87]/15 blur-3xl" />

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
                Registrasi Akun Warga Baru
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
            Bergabung Bersama Ribuan Warga Menjaga Kebersihan Lingkungan.
          </h1>
          <p className="text-sm text-[#acebd4] leading-relaxed">
            Daftarkan diri Anda untuk mulai melaporkan tumpukan sampah liar, limbah plastik, dan titik penumpukan sampah di wilayah Anda secara cepat dan presisi.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-5 w-5 text-[#259e73]" />
              <span>Gratis dan mudah digunakan melalui ponsel maupun PC</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-5 w-5 text-[#acebd4]" />
              <span>Dukungan AI MobileNetV2 untuk identifikasi sampah instan</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-5 w-5 text-[#f2bf87]" />
              <span>Pemberitahuan perkembangan tindakan langsung dari dinas</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#acebd4]/70">
          Smart Waste Management System • Menuju Kota Bebas Sampah
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 bg-[#fcfcfc]">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#2e4a21] tracking-tight">
              Pendaftaran Warga
            </h2>
            <p className="mt-1 text-sm text-[#5d6f66]">
              Lengkapi data berikut untuk membuat akun pelapor sampah.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" required>
                Nama Lengkap
              </Label>
              <div className="mt-1.5">
                <Input
                  id="name"
                  type="text"
                  placeholder="Contoh: Ahmad Qomaruddin"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" required>
                Alamat Email
              </Label>
              <div className="mt-1.5">
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon / WhatsApp</Label>
              <div className="mt-1.5">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0812-3456-7890"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" required>
                Kata Sandi
              </Label>
              <div className="mt-1.5">
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="passwordConfirmation" required>
                Konfirmasi Kata Sandi
              </Label>
              <div className="mt-1.5">
                <Input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  value={formData.passwordConfirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passwordConfirmation: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold mt-2"
              variant="primary"
            >
              Daftar Sekarang
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#5d6f66]">
            Sudah memiliki akun?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#259e73] hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

