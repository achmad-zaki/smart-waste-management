import type { Route } from "./+types/user.reports.new";
import { PageHeader } from "~/components/common/page-header";
import { CreateReportForm } from "~/features/reports/components/create-report-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Buat Laporan Baru - Smart Waste Management" },
    {
      name: "description",
      content:
        "Laporkan titik tumpukan sampah dengan klasifikasi AI otomatis dan deteksi koordinat GPS.",
    },
  ];
}

export default function UserNewReportPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Buat Laporan Sampah Baru"
        description="Unggah foto sampah, biarkan AI MobileNetV2 mengklasifikasikan jenisnya secara otomatis, dan lengkapi detail lokasi."
        backHref="/user/reports"
        backLabel="Kembali ke Riwayat"
      />

      <CreateReportForm />
    </div>
  );
}
