import React from "react";
import { UploadCloud, Camera, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
import { CategoryBadge } from "~/components/common/category-badge";
import { formatConfidence } from "~/lib/utils";
import type { WasteCategory } from "~/types/report.types";

interface SamplePreset {
  label: string;
  category: WasteCategory;
  confidence: number;
  url: string;
  title: string;
  desc: string;
}

interface AiDetectionPreviewProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  isClassifying: boolean;
  predictedCategory: WasteCategory;
  confidence: number;
  presets?: SamplePreset[];
  onApplyPreset?: (preset: SamplePreset) => void;
}

export function AiDetectionPreview({
  imagePreview,
  onImageChange,
  isClassifying,
  predictedCategory,
  confidence,
  presets = [],
  onApplyPreset,
}: AiDetectionPreviewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#acebd4]/40 text-[#2e4a21]">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2e4a21]">Foto & Klasifikasi AI</h4>
            <p className="text-xs text-[#5d6f66]">AI MobileNetV2 mendeteksi kategori otomatis</p>
          </div>
        </div>
      </div>

      {/* Upload & Preview Area */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-dashed border-[#e2ebe6] bg-[#f5f8f6]">
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Pratinjau Sampah"
              className="h-full w-full object-cover"
            />
            {isClassifying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2e4a21]/70 backdrop-blur-xs text-white">
                <RefreshCw className="h-8 w-8 animate-spin text-[#acebd4] mb-2" />
                <span className="text-xs font-semibold">AI Sedang Mengklasifikasi...</span>
              </div>
            )}
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex h-full flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-[#e2ebe6]/30 transition-colors"
          >
            <UploadCloud className="h-10 w-10 text-[#259e73] mb-2" />
            <p className="text-xs font-semibold text-[#2e4a21]">
              Klik untuk unggah atau ambil foto kamera
            </p>
            <p className="text-[11px] text-[#5d6f66] mt-1">PNG, JPG, WEBP hingga 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* AI Prediction Result Box */}
      <div className="flex items-center justify-between rounded-xl bg-[#259e73]/10 p-3.5 border border-[#259e73]/20">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-[#259e73] shrink-0" />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5d6f66] block">
              Hasil Deteksi AI
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <CategoryBadge category={predictedCategory} size="sm" />
              <span className="text-xs font-bold text-[#2e4a21]">
                Akurasi: {formatConfidence(confidence)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-semibold text-[#259e73] hover:underline"
        >
          Ganti Foto
        </button>
      </div>

      {/* Preset Tes Cepat */}
      {presets.length > 0 && onApplyPreset && (
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-[#5d6f66] block mb-2">
            Uji Coba Contoh Cepat (One-Click Test):
          </span>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="flex items-center justify-center rounded-lg border border-[#e2ebe6] bg-white py-1.5 px-2 text-xs font-medium text-[#2e4a21] hover:border-[#259e73] hover:bg-[#acebd4]/10 transition-colors truncate"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

