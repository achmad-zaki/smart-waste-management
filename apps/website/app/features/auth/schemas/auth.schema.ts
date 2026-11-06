import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Kata sandi wajib diisi" })
    .min(6, { message: "Kata sandi minimal 6 karakter" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Nama lengkap wajib diisi" })
      .min(3, { message: "Nama minimal 3 karakter" }),
    email: z
      .string()
      .min(1, { message: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" }),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9+\-\s]{8,20}$/.test(val.trim()),
        { message: "Nomor telepon tidak valid (hanya angka, +, -)" }
      ),
    password: z
      .string()
      .min(1, { message: "Kata sandi wajib diisi" })
      .min(8, { message: "Kata sandi minimal 8 karakter" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Konfirmasi kata sandi wajib diisi" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["passwordConfirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

