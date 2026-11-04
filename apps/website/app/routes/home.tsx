import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  MapPin,
  Recycle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Smart Waste Management - Sistem Pelaporan & Klasifikasi Sampah AI" },
    {
      name: "description",
      content:
        "Sistem terpadu antara warga dan dinas kebersihan untuk pelaporan sampah liar dan klasifikasi otomatis berbasis AI.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="border-b border-[#e2ebe6] bg-[#fcfcfc]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#259e73] text-white shadow-xs">
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#2e4a21] block leading-none">
                Smart Waste
              </span>
              <span className="text-xs text-[#259e73] font-medium">
                Sistem Pelaporan & Klasifikasi AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className={buttonVariants({ variant: "primary" })}>
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#acebd4] bg-[#acebd4]/20 px-4 py-1.5 text-xs font-semibold text-[#2e4a21]">
              <Sparkles className="h-3.5 w-3.5 text-[#259e73]" />
              Smart Waste Management Platform • MobileNetV2 AI Model
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2e4a21] leading-[1.15]">
              Laporkan Sampah Liar, Klasifikasikan Otomatis dengan AI
            </h1>

            <p className="text-base md:text-lg text-[#5d6f66] leading-relaxed max-w-2xl mx-auto">
              Sistem terpadu antara warga dan dinas kebersihan untuk mewujudkan lingkungan yang asri, tanggap, dan terdata berbasis kecerdasan buatan.
            </p>

            {/* Direct Portal Jump Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/user/dashboard" className={buttonVariants({ variant: "warm", size: "lg", className: "w-full sm:w-auto" })}>
                <Recycle className="h-5 w-5" />
                Masuk Portal Warga
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <Link to="/admin/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="forest" className="w-full gap-2 text-base px-8">
                  <ShieldCheck className="h-5 w-5 text-[#acebd4]" />
                  Buka Panel Admin
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dual Interactive Portal Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* User View Card */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-8 shadow-xs hover:border-[#259e73] transition-all hover:shadow-[0_8px_24px_rgba(37,158,115,0.08)] group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#acebd4]/40 text-[#259e73] group-hover:bg-[#259e73] group-hover:text-white transition-colors">
                  <Recycle className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-[#acebd4]/30 px-3 py-1 text-xs font-semibold text-[#2e4a21]">
                  Akses Masyarakat
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#2e4a21] mb-2">
                Tampilan Portal Warga (User)
              </h2>
              <p className="text-sm text-[#5d6f66] mb-6 leading-relaxed">
                Kirim laporan sampah dengan mudah. Unggah foto langsung terdeteksi oleh AI (Organik, Plastik, Kertas) beserta koordinat GPS akurat.
              </p>
              <div className="space-y-2.5 mb-6 text-xs text-[#2e4a21]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
                  <span>Dashboard ringkasan laporan pribadi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
                  <span>Formulir upload dengan prediksi AI instan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#259e73]" />
                  <span>Riwayat status penanganan realtime</span>
                </div>
              </div>
              <Link to="/user/dashboard">
                <Button variant="outline" className="w-full justify-between">
                  <span>Jelajahi Portal Warga</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Admin View Card */}
            <div className="rounded-2xl border border-[#2e4a21] bg-[#2e4a21] p-8 text-white shadow-xs group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#259e73] text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-[#3b5d2b] px-3 py-1 text-xs font-semibold text-[#acebd4]">
                  Akses Petugas & DLH
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Tampilan Panel Admin
              </h2>
              <p className="text-sm text-[#acebd4] mb-6 leading-relaxed">
                Kelola seluruh laporan masuk dari warga, validasi kategori sampah, pantau peta sebaran, dan perbarui status penanganan secara komprehensif.
              </p>
              <div className="space-y-2.5 mb-6 text-xs text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#acebd4]" />
                  <span>Statistik sebaran sampah per kategori & status</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#acebd4]" />
                  <span>Tabel laporan dengan filter & pencarian cepat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#acebd4]" />
                  <span>Manajemen pengguna dan log status laporan</span>
                </div>
              </div>
              <Link to="/admin/dashboard">
                <Button variant="mint" className="w-full justify-between font-semibold">
                  <span>Buka Panel Administrator</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="border-t border-[#e2ebe6] bg-[#f5f8f6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2e4a21]">
              Fitur Unggulan Sistem
            </h2>
            <p className="text-sm text-[#5d6f66] mt-2">
              Didesain dengan arsitektur modern dan standar keramahan pengguna yang tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#259e73]/15 text-[#259e73] mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#2e4a21] mb-2">
                Klasifikasi AI MobileNetV2
              </h3>
              <p className="text-xs text-[#5d6f66] leading-relaxed">
                Mendeteksi secara akurat jenis limbah: sampah organik, sampah plastik, dan sampah kertas disertai skor keyakinan model.
              </p>
            </div>

            <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#acebd4]/40 text-[#2e4a21] mb-4">
                <MapPin className="h-5 w-5 text-[#259e73]" />
              </div>
              <h3 className="text-base font-semibold text-[#2e4a21] mb-2">
                Geolokasi Presisi
              </h3>
              <p className="text-xs text-[#5d6f66] leading-relaxed">
                Merekam koordinat garis lintang dan bujur secara otomatis dari sensor GPS perangkat pelapor untuk memandu armada kebersihan.
              </p>
            </div>

            <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f2bf87]/30 text-[#855115] mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#2e4a21] mb-2">
                Audit Trail & Status Log
              </h3>
              <p className="text-xs text-[#5d6f66] leading-relaxed">
                Setiap perubahan status dari Pending hingga Selesai terekam riwayatnya dengan catatan transparan dari petugas berwenang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2ebe6] bg-[#fcfcfc] py-8 text-center text-xs text-[#5d6f66]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Recycle className="h-4 w-4 text-[#259e73]" />
            <span className="font-semibold text-[#2e4a21]">Smart Waste Management</span>
            <span>• Solusi Pengelolaan Sampah Berbasis AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-[#259e73]">
              Masuk
            </Link>
            <Link to="/register" className="hover:text-[#259e73]">
              Daftar
            </Link>
            <Link to="/admin/dashboard" className="hover:text-[#259e73]">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
