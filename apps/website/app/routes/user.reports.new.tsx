import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  UploadCloud,
  Camera,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { categoryLabels, initialReports, type WasteCategory, type WasteReport } from "~/lib/mock-data";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select } from "~/components/ui/select";

export default function UserNewReportPage() {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("Jl. Pemuda No. 45, Surabaya");
  const [latitude, setLatitude] = useState<number>(-7.2575);
  const [longitude, setLongitude] = useState<number>(112.7521);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(true);

  // Photo & AI Classification State
  const [imagePreview, setImagePreview] = useState<string | null>(
    "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80"
  );
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<{
    category: WasteCategory;
    confidence: number;
  }>({
    category: "plastic",
    confidence: 0.942,
  });
  const [confirmedCategory, setConfirmedCategory] = useState<WasteCategory>("plastic");

  // Sample Presets for Instant One-Click Testing
  const samplePresets = [
    {
      label: "Botol Plastik",
      category: "plastic" as WasteCategory,
      confidence: 0.954,
      url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
      title: "Tumpukan Botol dan Gelas Plastik Berserakan",
      desc: "Banyak sampah botol plastik air mineral dan sedotan di trotoar pinggir jalan raya.",
    },
    {
      label: "Sayuran & Organik",
      category: "organic" as WasteCategory,
      confidence: 0.912,
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      title: "Limbah Organik Kulit Buah dan Sayuran",
      desc: "Sampah basah sisa makanan dan dedaunan membusuk di sudut lapangan RT.",
    },
    {
      label: "Kardus & Kertas",
      category: "paper" as WasteCategory,
      confidence: 0.938,
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      title: "Tumpukan Kardus Bekas Paket",
      desc: "Kardus kemasan barang dan kertas koran basah menumpuk di depan ruko kosong.",
    },
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setIsClassifying(true);
    setImagePreview(preset.url);
    setTitle(preset.title);
    setDescription(preset.desc);

    setTimeout(() => {
      setAiPrediction({
        category: preset.category,
        confidence: preset.confidence,
      });
      setConfirmedCategory(preset.category);
      setIsClassifying(false);
    }, 700);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setIsClassifying(true);

      // Simulate AI MobileNetV2 prediction API response
      setTimeout(() => {
        // Randomly pick a realistic prediction for custom images
        const categories: WasteCategory[] = ["plastic", "organic", "paper"];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const randomConf = +(0.85 + Math.random() * 0.12).toFixed(3);

        setAiPrediction({
          category: randomCat,
          confidence: randomConf,
        });
        setConfirmedCategory(randomCat);
        setIsClassifying(false);
      }, 1200);
    }
  };

  const handleDetectGPS = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(6)));
          setLongitude(Number(position.coords.longitude.toFixed(6)));
          setGpsDetected(true);
          setIsLocating(false);
        },
        () => {
          // Fallback if permission blocked
          setLatitude(-7.2575);
          setLongitude(112.7521);
          setGpsDetected(true);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    // Create new report and add to mock store
    const newReport: WasteReport = {
      id: Math.floor(100 + Math.random() * 900),
      user_id: 2,
      user_name: "Ahmad Qomaruddin",
      user_email: "ahmad@warga.id",
      title,
      description,
      image_url: imagePreview || samplePresets[0].url,
      waste_category: confirmedCategory,
      confidence_score: aiPrediction.confidence,
      latitude,
      longitude,
      address,
      status: "pending",
      created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
      status_histories: [
        {
          id: Date.now(),
          waste_report_id: 106,
          changed_by_name: null,
          old_status: null,
          new_status: "pending",
          note: "Laporan berhasil diajukan oleh warga dengan klasifikasi AI.",
          created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        },
      ],
    };

    initialReports.unshift(newReport);
    navigate("/user/reports?success=true");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <Link to="/user/dashboard">
          <Button variant="ghost" size="sm" className="gap-1.5 text-[#5d6f66] hover:text-[#2e4a21]">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2e4a21]">
          Buat Laporan Sampah Baru
        </h1>
        <p className="text-sm text-[#5d6f66] mt-0.5">
          Unggah foto sampah di sekitar Anda. Model AI MobileNetV2 akan mendeteksi kategori sampah secara instan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Upload Photo & AI Classification Engine */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4f2]">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#259e73]" />
              <h2 className="text-base font-semibold text-[#2e4a21]">
                Langkah 1: Unggah Foto Sampah & Deteksi AI
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#259e73] bg-[#259e73]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              AI Fast Classifier
            </span>
          </div>

          {/* Quick presets buttons */}
          <div>
            <span className="text-xs text-[#5d6f66] block mb-2 font-medium">
              Uji coba cepat dengan contoh gambar:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => handleApplyPreset(preset)}
                  className="rounded-lg border border-[#c2d8cd] bg-[#f5f8f6] px-3 py-1.5 text-xs font-medium text-[#2e4a21] hover:bg-[#acebd4]/30 hover:border-[#259e73] transition-colors cursor-pointer"
                >
                  📸 {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Upload Area */}
            <div>
              <Label htmlFor="photoUpload" required>
                File Gambar (Kamera / Galeri)
              </Label>
              <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-[#acebd4] hover:border-[#259e73] bg-[#fcfcfc] px-6 py-8 transition-colors relative cursor-pointer group">
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#acebd4]/40 text-[#259e73] group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="text-xs text-[#2e4a21] font-semibold">
                    Klik untuk mengambil foto atau drag file ke sini
                  </div>
                  <p className="text-[11px] text-[#5d6f66]">
                    Format JPG, PNG, atau WebP (Maksimal 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* AI Image Preview & Realtime Prediction Card */}
            <div>
              <Label>Hasil Analisis Model AI (MobileNetV2)</Label>
              <div className="mt-2 rounded-xl border border-[#e2ebe6] bg-[#f5f8f6] p-4 relative overflow-hidden">
                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-[#e2ebe6]">
                      <img
                        src={imagePreview}
                        alt="Preview Sampah"
                        className="h-full w-full object-cover"
                      />
                      {isClassifying && (
                        <div className="absolute inset-0 bg-[#2e4a21]/70 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                          <RefreshCw className="h-8 w-8 animate-spin text-[#acebd4] mb-2" />
                          <p className="text-xs font-semibold">Menganalisis gambar dengan AI...</p>
                        </div>
                      )}
                    </div>

                    {!isClassifying && (
                      <div className="rounded-lg bg-[#fcfcfc] p-3 border border-[#acebd4] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#2e4a21] flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#259e73]" />
                            Prediksi AI: <strong className="text-[#259e73] uppercase">{categoryLabels[aiPrediction.category].label}</strong>
                          </span>
                          <span className="font-bold text-[#2e4a21]">
                            {Math.round(aiPrediction.confidence * 100)}% Cocok
                          </span>
                        </div>

                        {/* Confidence bar */}
                        <div className="h-2 w-full rounded-full bg-[#f0f4f2] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#259e73] transition-all duration-500"
                            style={{ width: `${Math.round(aiPrediction.confidence * 100)}%` }}
                          />
                        </div>

                        <p className="text-[10px] text-[#5d6f66]">
                          Kategori ini dikenali dari tekstur dan karakteristik objek pada foto.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-[#5d6f66]">
                    <ImageIcon className="h-10 w-10 text-[#c2d8cd] mb-2" />
                    <p className="text-xs">Belum ada foto sampah yang dipilih</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirm or Correct AI Category */}
          <div className="pt-2">
            <Label htmlFor="categorySelect" required>
              Konfirmasi Kategori Sampah Akhir
            </Label>
            <p className="text-xs text-[#5d6f66] mb-1.5">
              Anda dapat mengonfirmasi hasil rekomendasi AI atau memilih kategori lain secara manual:
            </p>
            <Select
              id="categorySelect"
              value={confirmedCategory}
              onChange={(e) => setConfirmedCategory(e.target.value as WasteCategory)}
            >
              <option value="plastic">Sampah Plastik (Botol, Kemasan, Kantong Kresek)</option>
              <option value="organic">Sampah Organik (Sisa Makanan, Daun, Sayuran)</option>
              <option value="paper">Sampah Kertas (Kardus, Karton, Arsip)</option>
            </Select>
          </div>
        </div>

        {/* Step 2: Location and GPS Detection */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4f2]">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#259e73]" />
              <h2 className="text-base font-semibold text-[#2e4a21]">
                Langkah 2: Lokasi dan Titik Koordinat GPS
              </h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="gap-1.5 text-xs border-[#259e73] text-[#259e73]"
            >
              <MapPin className="h-3.5 w-3.5" />
              {isLocating ? "Mencari Sinyal..." : "Ambil Lokasi GPS Saya"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat" required>Garis Lintang (Latitude)</Label>
              <div className="mt-1.5">
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lng" required>Garis Bujur (Longitude)</Label>
              <div className="mt-1.5">
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="addr" required>Alamat Lengkap / Patokan Titik Sampah</Label>
            <div className="mt-1.5">
              <Input
                id="addr"
                placeholder="Contoh: Jl. Pemuda No. 45, di seberang halte bus dekat tiang listrik"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 3: Report Details */}
        <div className="rounded-xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#f0f4f2]">
            <h2 className="text-base font-semibold text-[#2e4a21]">
              Langkah 3: Rincian Laporan
            </h2>
          </div>

          <div>
            <Label htmlFor="repTitle" required>Judul Laporan</Label>
            <div className="mt-1.5">
              <Input
                id="repTitle"
                placeholder="Contoh: Tumpukan botol plastik di pinggir trotoar jalan utama"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="repDesc" required>Deskripsi Kondisi & Perkiraan Volume</Label>
            <div className="mt-1.5">
              <Textarea
                id="repDesc"
                rows={4}
                placeholder="Jelaskan kondisi tumpukan sampah, apakah berbau menyengat, menyumbat saluran air, atau membutuhkan armada khusus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link to="/user/dashboard">
            <Button type="button" variant="ghost">
              Batalkan
            </Button>
          </Link>
          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="px-8 font-semibold shadow-sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Kirim Laporan Sampah
          </Button>
        </div>
      </form>
    </div>
  );
}

