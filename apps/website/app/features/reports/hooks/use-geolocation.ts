import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLocating: boolean;
}

export function useGeolocation(defaultLat = -7.2575, defaultLng = 112.7521) {
  const [state, setState] = useState<GeolocationState>({
    latitude: defaultLat,
    longitude: defaultLng,
    error: null,
    isLocating: false,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Browser Anda tidak mendukung deteksi lokasi otomatis (Geolocation).",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLocating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: parseFloat(position.coords.latitude.toFixed(6)),
          longitude: parseFloat(position.coords.longitude.toFixed(6)),
          error: null,
          isLocating: false,
        });
      },
      (error) => {
        let message = "Gagal mengambil koordinat GPS.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Izin akses lokasi ditolak oleh browser Anda.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Informasi lokasi tidak tersedia saat ini.";
        } else if (error.code === error.TIMEOUT) {
          message = "Waktu permintaan lokasi GPS habis (timeout).";
        }
        setState((prev) => ({
          ...prev,
          error: message,
          isLocating: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    ...state,
    getLocation,
  };
}

