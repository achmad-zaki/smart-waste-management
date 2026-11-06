import type { WasteCategory, ReportStatus } from "~/types/report.types";

export const categoryLabels: Record<
  WasteCategory,
  { label: string; badgeClass: string; desc: string }
> = {
  organic: {
    label: "Organik",
    badgeClass: "bg-[#acebd4]/40 text-[#2e4a21] border-[#acebd4]",
    desc: "Sisa makanan, daun, sayur, buah",
  },
  plastic: {
    label: "Plastik",
    badgeClass: "bg-[#259e73]/15 text-[#259e73] border-[#259e73]/30",
    desc: "Botol, kemasan, kantong kresek",
  },
  paper: {
    label: "Kertas",
    badgeClass: "bg-[#f2bf87]/30 text-[#8f5919] border-[#f2bf87]",
    desc: "Kardus, karton, arsip, koran",
  },
};

export const statusLabels: Record<
  ReportStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    bg: "bg-[#f2bf87]/20",
    text: "text-[#8a5518]",
    border: "border-[#f2bf87]/60",
  },
  in_progress: {
    label: "Sedang Ditangani",
    bg: "bg-[#259e73]/15",
    text: "text-[#1c7454]",
    border: "border-[#259e73]/40",
  },
  completed: {
    label: "Selesai",
    bg: "bg-[#acebd4]/50",
    text: "text-[#2e4a21]",
    border: "border-[#acebd4]",
  },
  rejected: {
    label: "Ditolak",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

