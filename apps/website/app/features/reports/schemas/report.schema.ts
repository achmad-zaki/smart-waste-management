import { z } from "zod";

export const createReportSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Judul laporan wajib diisi" })
    .min(5, { message: "Judul laporan minimal 5 karakter" }),
  description: z
    .string()
    .min(1, { message: "Deskripsi kondisi sampah wajib diisi" })
    .min(10, { message: "Deskripsi minimal 10 karakter agar petugas memahami lokasi" }),
  address: z
    .string()
    .min(1, { message: "Alamat / patokan lokasi wajib diisi" })
    .min(5, { message: "Alamat minimal 5 karakter" }),
  latitude: z.number({ message: "Koordinat latitude wajib ada" }),
  longitude: z.number({ message: "Koordinat longitude wajib ada" }),
  waste_category: z.enum(["organic", "plastic", "paper"], {
    message: "Pilih kategori sampah yang valid",
  }),
  image_url: z.string().min(1, { message: "Foto sampah wajib diunggah" }),
  confidence_score: z.number(),
});

export type CreateReportFormValues = z.infer<typeof createReportSchema>;

export const updateReportStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "rejected"], {
    message: "Pilih status laporan yang valid",
  }),
  note: z.string().min(1, { message: "Catatan penanganan status wajib diisi" }),
});

export type UpdateReportStatusFormValues = z.infer<typeof updateReportStatusSchema>;
