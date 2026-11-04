import React from "react";
import { Link } from "react-router";
import { Recycle, CheckCircle2 } from "lucide-react";

interface AuthBrandPanelProps {
  subtitle?: string;
}

export function AuthBrandPanel({
  subtitle = "Solusi Pelaporan Sampah Cerdas Berbasis AI",
}: AuthBrandPanelProps) {
  return (
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
            <span className="text-xs text-[#acebd4]">{subtitle}</span>
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
  );
}

