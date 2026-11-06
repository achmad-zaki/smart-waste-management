import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "~/components/ui/field";
import { LocationPicker } from "./location-picker";
import { AiDetectionPreview } from "./ai-detection-preview";
import { useGeolocation } from "../hooks/use-geolocation";
import {
  createReportSchema,
  type CreateReportFormValues,
} from "../schemas/report.schema";
import type { WasteCategory } from "~/types/report.types";
import {
  useClassifyWasteImage,
  useCreateReport,
} from "../hooks/use-reports";
import { getApiErrorMessage } from "~/lib/axios";

export function CreateReportForm() {
  const navigate = useNavigate();
  const { latitude, longitude, isLocating, error: gpsError, getLocation } = useGeolocation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictedCategory, setPredictedCategory] = useState<WasteCategory | null>(null);
  const [confidence, setConfidence] = useState(0);

  const classifyMutation = useClassifyWasteImage();
  const createReportMutation = useCreateReport();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      latitude: latitude ?? -7.2575,
      longitude: longitude ?? 112.7521,
      waste_category: "plastic",
      image_url: "",
      confidence_score: 0,
    },
  });

  const currentAddress = watch("address");
  const currentCategory = watch("waste_category");

  // Sync GPS hook updates to react-hook-form
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setValue("latitude", latitude);
      setValue("longitude", longitude);
    }
  }, [latitude, longitude, setValue]);

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setValue("image_url", objectUrl, { shouldValidate: true });

    // Call real backend classification endpoint (FastAPI through Laravel)
    classifyMutation.mutate(file, {
      onSuccess: (result) => {
        setPredictedCategory(result.predicted_category);
        setConfidence(result.confidence_score);
        setValue("waste_category", result.predicted_category, { shouldValidate: true });
        setValue("confidence_score", result.confidence_score);
      },
      onError: () => {
        // Fallback: If ML service is temporarily down, keep current manual category selection
      },
    });
  };

  const onSubmit = (data: CreateReportFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("waste_category", data.waste_category);
    if (data.confidence_score !== undefined && data.confidence_score !== null) {
      formData.append("confidence_score", String(data.confidence_score));
    }
    formData.append("latitude", String(data.latitude));
    formData.append("longitude", String(data.longitude));
    if (data.address) formData.append("address", data.address);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    createReportMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/user/reports?success=true");
      },
    });
  };

  const submissionError = createReportMutation.error
    ? getApiErrorMessage(createReportMutation.error)
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {submissionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-2.5 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: AI Detection & Photo */}
        <div className="space-y-6">
          <div>
            <AiDetectionPreview
              imagePreview={imagePreview}
              onImageChange={handleImageUpload}
              isClassifying={classifyMutation.isPending}
              predictedCategory={predictedCategory}
              confidence={confidence}
            />
            {errors.image_url && (
              <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.image_url.message}</span>
              </p>
            )}
          </div>

          <LocationPicker
            address={currentAddress}
            onAddressChange={(val) => setValue("address", val, { shouldValidate: true })}
            latitude={latitude ?? -7.2575}
            longitude={longitude ?? 112.7521}
            onCoordinatesChange={(lat, lng) => {
              setValue("latitude", lat);
              setValue("longitude", lng);
            }}
            onDetectGps={getLocation}
            isLocating={isLocating}
            gpsError={gpsError}
            addressError={errors.address?.message}
          />
        </div>

        {/* Right Column: Report Details Form */}
        <div className="space-y-5 rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#2e4a21]">Detail Laporan Sampah</h3>

          {/* Title Field */}
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor={field.name} required>
                  Judul Laporan
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Contoh: Tumpukan Botol Plastik di Pinggir Jalan"
                  aria-invalid={fieldState.invalid}
                  disabled={createReportMutation.isPending}
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]}>
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Description Field */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor={field.name} required>
                  Deskripsi Kondisi & Perkiraan Volume
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={4}
                  placeholder="Jelaskan jenis sampah, perkiraan banyaknya, atau patokan agar tim dinas mudah menemukan..."
                  aria-invalid={fieldState.invalid}
                  disabled={createReportMutation.isPending}
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]}>
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Category Selection Confirmation */}
          <Controller
            name="waste_category"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 pt-1">
                <label className="text-sm font-medium text-[#2e4a21] block">
                  Konfirmasi Kategori Sampah
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "organic", label: "Organik" },
                    { value: "plastic", label: "Plastik" },
                    { value: "paper", label: "Kertas" },
                  ].map((cat) => {
                    const isSelected = currentCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => field.onChange(cat.value)}
                        className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#259e73] bg-[#259e73]/15 text-[#259e73] shadow-xs"
                            : "border-[#e2ebe6] bg-white text-[#5d6f66] hover:border-[#259e73]/50"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full text-base font-semibold gap-2"
              disabled={createReportMutation.isPending || classifyMutation.isPending}
            >
              {createReportMutation.isPending ? (
                <>
                  <Spinner />
                  <span>Mengirim Laporan...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Kirim Laporan Sampah</span>
                </>
              )}
            </Button>
            <p className="mt-2 text-center text-[11px] text-[#5d6f66]">
              Laporan akan langsung diverifikasi dan diteruskan ke dinas kebersihan terkait.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
