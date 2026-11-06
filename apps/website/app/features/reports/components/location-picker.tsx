import { AlertCircle, MapPin, Navigation } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

interface LocationPickerProps {
  address: string;
  onAddressChange: (value: string) => void;
  latitude: number;
  longitude: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
  onDetectGps: () => void;
  isLocating?: boolean;
  gpsError?: string | null;
  addressError?: string;
}

export function LocationPicker({
  address,
  onAddressChange,
  latitude,
  longitude,
  onDetectGps,
  isLocating = false,
  gpsError,
  addressError,
}: LocationPickerProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[#e2ebe6] bg-[#fcfcfc] p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#259e73]/15 text-[#259e73]">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2e4a21]">Lokasi Sampah</h4>
            <p className="text-xs text-[#5d6f66]">Tentukan titik koordinat & patokan alamat</p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDetectGps}
          disabled={isLocating}
          className="gap-1.5 text-xs text-[#259e73] border-[#259e73]/30 hover:bg-[#acebd4]/20"
        >
          <Navigation className={`h-3.5 w-3.5 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Mencari GPS..." : "Deteksi Lokasi GPS"}</span>
        </Button>
      </div>

      {gpsError && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Address Input */}
      <Field data-invalid={!!addressError} className="gap-1.5">
        <FieldLabel htmlFor="report-address" required>
          Alamat Lengkap / Patokan Titik Sampah
        </FieldLabel>
        <Input
          id="report-address"
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Contoh: Jl. Pemuda No. 45, samping ruko kosong"
          aria-invalid={!!addressError}
        />
        {addressError && <FieldError>{addressError}</FieldError>}
      </Field>

      {/* Coordinates Display */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-xl bg-[#f5f8f6] p-2.5 border border-[#e2ebe6]">
          <span className="block text-[11px] font-semibold text-[#5d6f66]">Garis Lintang (Latitude)</span>
          <span className="text-xs font-mono font-bold text-[#2e4a21]">{latitude.toFixed(6)}</span>
        </div>
        <div className="rounded-xl bg-[#f5f8f6] p-2.5 border border-[#e2ebe6]">
          <span className="block text-[11px] font-semibold text-[#5d6f66]">Garis Bujur (Longitude)</span>
          <span className="text-xs font-mono font-bold text-[#2e4a21]">{longitude.toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
}

