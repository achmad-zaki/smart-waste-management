import React from "react";
import { UploadCloud, Camera, Sparkles } from "lucide-react";
import { Spinner } from "~/components/ui/spinner";
import { CategoryBadge } from "~/components/common/category-badge";
import { formatConfidence } from "~/lib/utils";
import type { WasteCategory } from "~/types/report.types";

interface AiDetectionPreviewProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  isClassifying: boolean;
  predictedCategory?: WasteCategory | null;
  confidence?: number;
}

export function AiDetectionPreview({
  imagePreview,
  onImageChange,
  isClassifying,
  predictedCategory,
  confidence = 0,
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
                <Spinner className="size-8 text-[#acebd4] mb-2" />
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
      {imagePreview ? (
        <div className="flex items-center justify-between rounded-xl bg-[#259e73]/10 p-3.5 border border-[#259e73]/20">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-[#259e73] shrink-0" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5d6f66] block">
                Hasil Deteksi AI
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                {predictedCategory ? (
                  <>
                    <CategoryBadge category={predictedCategory} size="sm" />
                    <span className="text-xs font-bold text-[#2e4a21]">
                      Akurasi: {formatConfidence(confidence)}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-[#5d6f66]">
                    {isClassifying ? "Menganalisis jenis sampah..." : "Foto siap dianalisis"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-[#259e73] hover:underline cursor-pointer"
          >
            Ganti Foto
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-xl bg-[#f5f8f6] p-3.5 border border-[#e2ebe6] text-[#5d6f66]">
          <Sparkles className="h-4 w-4 text-[#5d6f66] shrink-0" />
          <span className="text-xs">
            Unggah atau ambil foto sampah untuk analisis otomatis kategori oleh AI.
          </span>
        </div>
      )}
    </div>
  );
}
