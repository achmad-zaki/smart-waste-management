import {
  AlertCircle,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  FileCheck,
  FileText,
  Layers,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
  Users
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Smart Waste Management - Sistem Pelaporan & Klasifikasi Sampah AI" },
    {
      name: "description",
      content:
        "Sistem cerdas terintegrasi antara warga dan dinas kebersihan untuk pelaporan sampah liar berbasis koordinat GPS dan klasifikasi otomatis MobileNetV2 AI.",
    },
  ];
}

export default function Home() {
  const [activeRoleTab, setActiveRoleTab] = useState<"warga" | "petugas">("warga");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1c2e15] antialiased selection:bg-[#acebd4] selection:text-[#1c2e15]">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#e2ebe6] bg-[#fcfcfc]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#259e73] text-white shadow-xs transition-transform group-hover:scale-105">
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#2e4a21] block leading-none">
                Smart Waste
              </span>
              <span className="text-xs text-[#259e73] font-medium">
                Pelaporan & Klasifikasi AI
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#475e52]">
            <a href="#penyebab" className="hover:text-[#259e73] transition-colors">
              Penyebab & Urgensi
            </a>
            <a href="#cara-penggunaan" className="hover:text-[#259e73] transition-colors">
              Cara Penggunaan
            </a>
            <a href="#klasifikasi-ai" className="hover:text-[#259e73] transition-colors">
              Klasifikasi AI
            </a>
            <a href="#faq" className="hover:text-[#259e73] transition-colors">
              Tanya Jawab
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              Lapor Sampah
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-32 bg-gradient-to-b from-[#f5f8f6] via-[#fcfcfc] to-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2e4a21] leading-[1.12]">
              Sistem Pelaporan Sampah Pintar Berbasis Kecerdasan Buatan
            </h1>

            <p className="text-base sm:text-lg text-[#475e52] leading-relaxed max-w-2xl mx-auto">
              Menjembatani kepedulian warga dengan ketepatan aksi dinas kebersihan. Dilengkapi deteksi otomatis jenis sampah oleh model AI MobileNetV2 dan penguncian koordinat GPS presisi untuk kota yang bersih, sehat, dan terdata.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                to="/user/reports/new"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "w-full sm:w-auto px-6 font-semibold shadow-sm",
                })}
              >
                <Camera className="h-4 w-4" />
                Mulai Buat Laporan
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <a
                href="#cara-penggunaan"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full sm:w-auto px-6",
                })}
              >
                Pelajari Alur Penggunaan
              </a>
            </div>
          </div>

          {/* Interactive Live Flow Preview (Demonstrating What The Platform Does) */}
          <div className="mt-16 max-w-5xl mx-auto rounded-3xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 shadow-[0_20px_48px_rgba(46,74,33,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Citizen AI Detection Viewport */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-[#e2ebe6] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-[#259e73] animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2e4a21]">
                      Simulasi Deteksi Visual AI
                    </span>
                  </div>
                  <span className="rounded-md bg-[#acebd4]/40 px-2.5 py-0.5 text-xs font-semibold text-[#1c2e15]">
                    MobileNetV2 Model
                  </span>
                </div>

                {/* Simulated Camera Scan Canvas */}
                <div className="relative rounded-2xl overflow-hidden border border-[#e2ebe6] bg-[#2e4a21] p-5 text-white">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-xs text-emerald-300 font-mono">
                    <Sparkles className="h-3.5 w-3.5" />
                    Keyakinan: 98.4%
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white">
                      <Camera className="h-4 w-4 text-[#acebd4]" />
                      <span>Input Foto: Tumpukan Botol Kemasan</span>
                    </div>

                    {/* Detected Box Overlay */}
                    <div className="rounded-xl border border-dashed border-[#acebd4] bg-[#acebd4]/10 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#acebd4] font-medium">Hasil Analisis Visual</span>
                        <span className="text-xs font-bold text-white bg-[#259e73] px-2 py-0.5 rounded">
                          Sampah Plastik
                        </span>
                      </div>
                      <p className="text-xs text-[#acebd4]/90 leading-relaxed">
                        Terdeteksi botol plastik polietilena tereftalat (PET). Rekomendasi penanganan: Pisahkan ke kontainer anorganik untuk pencacahan ulang di TPS3R.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#acebd4]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#acebd4]" />
                        <span>Lat: -6.2088°, Long: 106.8456°</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#acebd4]" />
                        <span>Otomatis terkirim ke dinas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Municipal Pipeline Resolution */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#f5f8f6] p-6 rounded-2xl border border-[#e2ebe6]">
                <div>
                  <h3 className="text-base font-bold text-[#2e4a21]">
                    Alur Transparan Real-Time
                  </h3>
                  <p className="text-xs text-[#475e52] mt-1 leading-relaxed">
                    Setiap aduan warga diverifikasi dan ditugaskan secara transparan tanpa proses birokrasi berulang.
                  </p>
                </div>

                {/* Status Milestones */}
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#259e73] text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#1c2e15] block">
                        1. Laporan Masuk & Terverifikasi
                      </span>
                      <span className="text-[11px] text-[#475e52]">
                        AI mengelompokkan kategori, geotag mengunci lokasi.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f2bf87] text-[#5c370b]">
                      <Truck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#1c2e15] block">
                        2. Armada Kebersihan Dikerahkan
                      </span>
                      <span className="text-[11px] text-[#475e52]">
                        Petugas lapangan menuju titik koordinat sesuai tiket.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#acebd4] text-[#1c2e15]">
                      <FileCheck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#1c2e15] block">
                        3. Penanganan Tuntas & Berita Acara
                      </span>
                      <span className="text-[11px] text-[#475e52]">
                        Status diperbarui menjadi Selesai dan warga ternotifikasi.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e2ebe6] flex items-center justify-between text-xs">
                  <span className="text-[#475e52]">Target Respons:</span>
                  <span className="font-semibold text-[#259e73]">Kurang dari 24 Jam Kerja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Mengapa Website Ini Dibuat? (Penyebab & Urgensi Masalah) */}
      <section id="penyebab" className="py-20 md:py-28 border-t border-[#e2ebe6] bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2e4a21]">
              Mengapa Smart Waste Management Dibuat?
            </h2>
            <p className="text-base text-[#475e52] leading-relaxed">
              Penumpukan sampah liar dan keterlambatan respon kebersihan selama ini berakar dari kesenjangan komunikasi antara warga dan dinas terkait. Metode pelaporan manual sering kali hilang arah, tanpa titik lokasi jelas, dan tanpa kepastian penyelesaian.
            </p>
          </div>

          {/* Asymmetric Problem-Solution Architecture */}
          <div className="mt-14 space-y-6">
            {/* Bottleneck 1 */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#f5f8f6] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Masalah Konvensional #1
                </div>
                <h3 className="text-lg font-bold text-[#1c2e15]">
                  Pelaporan Tersebar & Rawan Tercecer
                </h3>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Sebelumnya, aduan warga disampaikan melalui grup pesan singkat, media sosial, atau telepon. Pesan mudah tertumpuk tanpa nomor tiket resmi, sehingga petugas dinas kesulitan menginventarisasi mana laporan yang mendesak.
                </p>
              </div>

              <div className="md:col-span-7 bg-[#fcfcfc] p-6 rounded-xl border border-[#e2ebe6] space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#259e73] bg-[#acebd4]/30 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Solusi Smart Waste
                </div>
                <h4 className="text-base font-semibold text-[#2e4a21]">
                  Kanal Terpusat dengan Tiket Digital Otomatis
                </h4>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Semua laporan dihimpun dalam satu basis data terpusat. Setiap aduan memiliki nomor identifikasi unik, status yang tercatat di sistem, dan langsung masuk ke antrean kerja petugas kebersihan tanpa perantara.
                </p>
              </div>
            </div>

            {/* Bottleneck 2 */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#f5f8f6] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Masalah Konvensional #2
                </div>
                <h3 className="text-lg font-bold text-[#1c2e15]">
                  Titik Lokasi Ambigu dan Armada Tersesat
                </h3>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Laporan manual hanya mengandalkan deskripsi verbal seperti &ldquo;dekat pohon besar belakang pasar&rdquo;. Hal ini membuang waktu armada truk sampah yang kesulitan menemukan lokasi tumpukan sampah liar secara cepat.
                </p>
              </div>

              <div className="md:col-span-7 bg-[#fcfcfc] p-6 rounded-xl border border-[#e2ebe6] space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#259e73] bg-[#acebd4]/30 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Solusi Smart Waste
                </div>
                <h4 className="text-base font-semibold text-[#2e4a21]">
                  Geotagging GPS Otomatis Berpresisi Tinggi
                </h4>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Sensor GPS pada perangkat warga langsung mengunci garis lintang (latitude) dan garis bujur (longitude) saat laporan dibuat. Petugas mendapatkan peta rute navigasi akurat langsung ke titik tumpukan sampah.
                </p>
              </div>
            </div>

            {/* Bottleneck 3 */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#f5f8f6] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Masalah Konvensional #3
                </div>
                <h3 className="text-lg font-bold text-[#1c2e15]">
                  Sampah Tercampur Tanpa Identifikasi di Hulu
                </h3>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Warga sering kali ragu memilah jenis sampah, dan dinas tidak mengetahui komposisi sampah yang dilaporkan sebelum tiba di lokasi. Akibatnya, sampah daur ulang dan sampah organik tercampur dan sulit diproses kembali.
                </p>
              </div>

              <div className="md:col-span-7 bg-[#fcfcfc] p-6 rounded-xl border border-[#e2ebe6] space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#259e73] bg-[#acebd4]/30 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Solusi Smart Waste
                </div>
                <h4 className="text-base font-semibold text-[#2e4a21]">
                  Klasifikasi Gambar Cerdas dengan MobileNetV2 AI
                </h4>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Model deep learning mengidentifikasi foto secara otomatis ke dalam kategori Organik, Plastik, atau Kertas. Petugas dapat mempersiapkan kantong pilah dan alokasi armada daur ulang yang tepat sebelum berangkat.
                </p>
              </div>
            </div>

            {/* Bottleneck 4 */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#f5f8f6] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Masalah Konvensional #4
                </div>
                <h3 className="text-lg font-bold text-[#1c2e15]">
                  Ketiadaan Transparansi & Ketidakpastian Status
                </h3>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Setelah melapor, warga tidak pernah tahu apakah aduannya sedang diverifikasi, dijadwalkan, atau diabaikan. Rasa frustrasi ini menurunkan kemauan warga untuk menjaga kebersihan lingkungan bersama.
                </p>
              </div>

              <div className="md:col-span-7 bg-[#fcfcfc] p-6 rounded-xl border border-[#e2ebe6] space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#259e73] bg-[#acebd4]/30 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Solusi Smart Waste
                </div>
                <h4 className="text-base font-semibold text-[#2e4a21]">
                  Audit Trail Linimasa Status Real-Time
                </h4>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Setiap perubahan status dari Menunggu, Diproses, hingga Selesai tercatat dengan stempel waktu dan catatan resmi petugas. Warga dapat memantau proses penanganan secara langsung dari akun mereka.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Cara Penggunaan Website (Panduan Langkah Warga & Petugas) */}
      <section id="cara-penggunaan" className="py-20 md:py-28 border-t border-[#e2ebe6] bg-[#f5f8f6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2e4a21]">
              Panduan Lengkap Cara Penggunaan Sistem
            </h2>
            <p className="text-base text-[#475e52] leading-relaxed">
              Smart Waste Management dirancang dengan alur kerja yang mudah dipahami bagi masyarakat maupun petugas dinas. Pilih peran di bawah untuk melihat langkah penggunaannya:
            </p>

            {/* Interactive Role Switcher Tabs */}
            <div className="inline-flex rounded-xl p-1 bg-[#e2ebe6] border border-[#d3ded8] text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveRoleTab("warga")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                  activeRoleTab === "warga"
                    ? "bg-[#2e4a21] text-white shadow-xs"
                    : "text-[#475e52] hover:text-[#1c2e15]"
                }`}
              >
                <Users className="h-4 w-4" />
                Alur Penggunaan Warga (Pelapor)
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleTab("petugas")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                  activeRoleTab === "petugas"
                    ? "bg-[#2e4a21] text-white shadow-xs"
                    : "text-[#475e52] hover:text-[#1c2e15]"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Alur Kerja Petugas & DLH (Admin)
              </button>
            </div>
          </div>

          {/* Tab 1: Warga Workflow */}
          {activeRoleTab === "warga" && (
            <div className="mt-14 max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#259e73] text-white font-bold text-lg">
                  1
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Daftar dan Masuk ke Portal Warga
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Buka halaman pendaftaran dan masukkan nama lengkap, email, serta kata sandi akun Anda. Setelah masuk, Anda akan diarahkan ke Dasbor Warga untuk melihat statistik pelaporan pribadi dan tombol laporan baru.
                  </p>
                  <div className="pt-2">
                    <Link to="/register" className="inline-flex items-center text-xs font-semibold text-[#259e73] hover:underline">
                      Buka Formulir Registrasi Akun Warga
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#259e73] text-white font-bold text-lg">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Buka Menu Lapor Sampah & Ambil Foto di Lokasi
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Pilih menu &ldquo;Buat Laporan Baru&rdquo;. Ambil foto tumpukan sampah langsung menggunakan kamera smartphone Anda atau unggah file gambar sampah dari galeri. Pastikan gambar terlihat cukup jelas dengan pencahayaan memadai.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#259e73] text-white font-bold text-lg">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Deteksi AI Instan & Penguncian Koordinat GPS
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Sistem secara cerdas menganalisis foto dan memprediksi kategori sampah (Organik, Plastik, atau Kertas) beserta tingkat akurasinya. Klik tombol deteksi GPS otomatis untuk menyematkan latitude dan longitude lokasi saat itu, lalu tambahkan keterangan patokan alamat bila perlu.
                  </p>
                  <div className="rounded-lg bg-[#f5f8f6] p-3 text-xs text-[#2e4a21] border border-[#e2ebe6] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#259e73] shrink-0" />
                    <span>Tips: Anda tetap dapat mengubah kategori bila terdapat jenis sampah campuran.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#259e73] text-white font-bold text-lg">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Kirim Laporan & Pantau Progres Real-Time
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Klik tombol &ldquo;Kirim Laporan&rdquo;. Laporan Anda langsung memperoleh status awal <strong>Menunggu</strong>. Pantau riwayat laporan Anda saat petugas mengubah status menjadi <strong>Diproses</strong> hingga <strong>Selesai</strong> lengkap dengan catatan tindak lanjut.
                  </p>
                  <div className="pt-2">
                    <Link to="/user/dashboard" className="inline-flex items-center text-xs font-semibold text-[#259e73] hover:underline">
                      Kunjungi Dasbor Ringkasan Warga
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Petugas Workflow */}
          {activeRoleTab === "petugas" && (
            <div className="mt-14 max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2e4a21] text-[#acebd4] font-bold text-lg">
                  1
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Masuk ke Panel Administrator Dinas Kebersihan
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Petugas dinas lingkungan hidup atau koordinator wilayah masuk menggunakan kredensial admin terverifikasi untuk membuka monitoring terpadu, sebaran grafik harian, dan tabel laporan masuk.
                  </p>
                  <div className="pt-2">
                    <Link to="/login" className="inline-flex items-center text-xs font-semibold text-[#2e4a21] hover:underline">
                      Masuk ke Akun Petugas
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2e4a21] text-[#acebd4] font-bold text-lg">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Verifikasi Laporan Masuk & Validasi Kategori AI
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Buka detail laporan untuk memeriksa foto sampah yang diunggah warga, memverifikasi kesesuaian kategori prediksi AI, serta melihat koordinat titik tumpukan pada peta.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2e4a21] text-[#acebd4] font-bold text-lg">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Disposisi Armada Berdasarkan Koordinat GPS
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Ubah status tiket menjadi <strong>Diproses</strong> dan instruksikan armada truk serta personel kebersihan menuju koordinat lokasi persis. Informasi jenis sampah membantu armada menyiapkan wadah pemilahan yang tepat.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2e4a21] text-[#acebd4] font-bold text-lg">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-[#1c2e15]">
                    Pembaruan Status Menjadi Selesai & Catatan Penanganan
                  </h3>
                  <p className="text-sm text-[#475e52] leading-relaxed">
                    Setelah area tumpukan sampah dibersihkan secara tuntas, petugas memperbarui status tiket menjadi <strong>Selesai</strong> dan menambahkan catatan verifikasi penanganan. Pelapor mendapatkan kepastian secara transparan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Klasifikasi AI & Kategori Sampah */}
      <section id="klasifikasi-ai" className="py-20 md:py-28 border-t border-[#e2ebe6] bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2e4a21]">
              Klasifikasi Sampah Cerdas dengan MobileNetV2
            </h2>
            <p className="text-base text-[#475e52] leading-relaxed">
              Arsitektur AI MobileNetV2 dirancang khusus agar efisien, ringan, dan cepat dalam mengenali gambar limbah melalui peramban web. Sistem ini membedakan tiga klasifikasi sampah utama:
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Organic Waste */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#f5f8f6] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#259e73]/20 text-[#259e73]">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1c2e15]">
                  Sampah Organik
                </h3>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Limbah yang berasal dari sisa makhluk hidup dan mudah terurai secara alami, seperti sisa makanan, sayuran busuk, kulit buah, dan daun gugur.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e2ebe6]/80 text-xs text-[#2e4a21]">
                <span className="font-semibold block mb-1">Rekomendasi Pemrosesan:</span>
                <span className="text-[#475e52]">Pengomposan hayati, budidaya maggot, atau bahan baku biogas.</span>
              </div>
            </div>

            {/* Plastic Waste */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#f5f8f6] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#acebd4]/50 text-[#1c2e15]">
                  <Recycle className="h-6 w-6 text-[#259e73]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c2e15]">
                  Sampah Plastik
                </h3>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Limbah polimer sintetis anorganik yang sulit terurai secara alami, meliputi botol minuman plastik (PET/HDPE), gelas sekali pakai, kantong kresek, dan wadah kemasan.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e2ebe6]/80 text-xs text-[#2e4a21]">
                <span className="font-semibold block mb-1">Rekomendasi Pemrosesan:</span>
                <span className="text-[#475e52]">Pengumpulan di bank sampah atau sentra TPS3R untuk dicacah dan didaur ulang.</span>
              </div>
            </div>

            {/* Paper Waste */}
            <div className="rounded-2xl border border-[#e2ebe6] bg-[#f5f8f6] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2bf87]/30 text-[#5c370b]">
                  <FileText className="h-6 w-6 text-[#5c370b]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c2e15]">
                  Sampah Kertas & Karton
                </h3>
                <p className="text-sm text-[#475e52] leading-relaxed">
                  Limbah berbahan serat selulosa seperti kardus pembungkus paket, kertas arsip atau cetak bekas, majalah, koran, dan karton makanan kering.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e2ebe6]/80 text-xs text-[#2e4a21]">
                <span className="font-semibold block mb-1">Rekomendasi Pemrosesan:</span>
                <span className="text-[#475e52]">Daur ulang menjadi bubur kertas (pulp) untuk memproduksi kertas dan karton baru.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Tanya Jawab (FAQ) */}
      <section id="faq" className="py-20 md:py-28 border-t border-[#e2ebe6] bg-[#f5f8f6]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2e4a21]">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-base text-[#475e52]">
              Jawaban seputar teknis pelaporan, privasi lokasi, dan tindak lanjut lapangan.
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleFaq(0)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#1c2e15] hover:text-[#259e73]"
              >
                <span>Apakah saya wajib mengizinkan akses GPS saat membuat laporan?</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#475e52] transition-transform duration-200 ${
                    openFaqIndex === 0 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-5 pb-5 text-sm text-[#475e52] leading-relaxed border-t border-[#e2ebe6]/60 pt-3">
                  Sangat dianjurkan. Fitur GPS memastikan koordinat latitude dan longitude tersimpan secara presisi agar armada truk sampah dinas kebersihan dapat langsung menuju ke lokasi penumpukan sampah liar tanpa tersesat.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleFaq(1)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#1c2e15] hover:text-[#259e73]"
              >
                <span>Bagaimana jika hasil prediksi AI berbeda dengan jenis sampah di lapangan?</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#475e52] transition-transform duration-200 ${
                    openFaqIndex === 1 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-5 pb-5 text-sm text-[#475e52] leading-relaxed border-t border-[#e2ebe6]/60 pt-3">
                  Hasil deteksi AI MobileNetV2 berfungsi sebagai asisten otomatis awal. Anda dapat meninjau dan memilih kategori yang tepat secara manual sebelum mengirimkan formulir, dan petugas admin dinas akan memvalidasi kembali saat memproses tiket.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleFaq(2)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#1c2e15] hover:text-[#259e73]"
              >
                <span>Berapa lama rata-rata waktu yang dibutuhkan dinas untuk menangani laporan?</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#475e52] transition-transform duration-200 ${
                    openFaqIndex === 2 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-5 pb-5 text-sm text-[#475e52] leading-relaxed border-t border-[#e2ebe6]/60 pt-3">
                  Waktu respon disesuaikan dengan volume sampah dan ketersediaan armada sektor terdekat. Secara standar operasional, aduan diverifikasi dalam 1x24 jam kerja dan dijadwalkan untuk penanganan fisik di lapangan.
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleFaq(3)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#1c2e15] hover:text-[#259e73]"
              >
                <span>Apakah masyarakat umum dikenakan biaya saat menggunakan sistem ini?</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#475e52] transition-transform duration-200 ${
                    openFaqIndex === 3 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-5 pb-5 text-sm text-[#475e52] leading-relaxed border-t border-[#e2ebe6]/60 pt-3">
                  Sama sekali tidak dipungut biaya. Smart Waste Management adalah inisiatif layanan publik untuk meningkatkan keterlibatan masyarakat dalam menjaga sanitasi dan kebersihan kota.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 md:py-24 bg-[#2e4a21] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Wujudkan Lingkungan Asri dan Tanggap Bersama Smart Waste
          </h2>
          <p className="text-base text-[#acebd4] max-w-2xl mx-auto leading-relaxed">
            Laporkan tumpukan sampah di sekitar Anda sekarang juga dan biarkan teknologi kecerdasan buatan membantu memetakan serta memilahnya dengan presisi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className={buttonVariants({
                variant: "mint",
                size: "lg",
                className: "w-full sm:w-auto font-bold px-7 shadow-xs",
              })}
            >
              Daftar & Buat Laporan Pertama
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link
              to="/user/dashboard"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto text-white border-white/20 hover:bg-white/10 hover:text-white",
              })}
            >
              Buka Dasbor Warga
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2ebe6] bg-[#fcfcfc] py-12 text-sm text-[#475e52]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#e2ebe6]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#259e73] text-white shadow-xs">
                <Recycle className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-[#2e4a21] block leading-none">
                  Smart Waste Management
                </span>
                <span className="text-xs text-[#259e73]">
                  Platform Pelaporan Sampah Cerdas & Klasifikasi AI
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
              <a href="#penyebab" className="hover:text-[#259e73] transition-colors">
                Latar Belakang
              </a>
              <a href="#cara-penggunaan" className="hover:text-[#259e73] transition-colors">
                Panduan Penggunaan
              </a>
              <a href="#klasifikasi-ai" className="hover:text-[#259e73] transition-colors">
                Klasifikasi AI
              </a>
              <Link to="/login" className="hover:text-[#259e73] transition-colors">
                Masuk
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#475e52]">
            <p suppressHydrationWarning>© {new Date().getFullYear()} Smart Waste Management System. Didukung MobileNetV2 Machine Learning.</p>
            <p>Sistem Terpadu Antara Masyarakat dan Dinas Lingkungan Hidup.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
