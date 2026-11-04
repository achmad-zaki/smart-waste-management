import React from "react";
import { Link } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Field, FieldLabel, FieldError } from "~/components/ui/field";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { useRegister } from "../hooks/use-auth";
import { getApiErrorMessage } from "~/lib/axios";

interface RegisterFormProps {
  onSuccess?: (data: RegisterFormValues) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess(data);
          }
        },
      }
    );
  };

  const errorMessage = registerMutation.error
    ? getApiErrorMessage(registerMutation.error)
    : null;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#2e4a21] tracking-tight">
          Pendaftaran Warga
        </h2>
        <p className="mt-1 text-sm text-[#5d6f66]">
          Lengkapi data berikut untuk membuat akun pelapor sampah.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor={field.name}>Nama Lengkap</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder="Contoh: Ahmad Qomaruddin"
                aria-invalid={fieldState.invalid}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]}>
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor={field.name}>Alamat Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="nama@email.com"
                aria-invalid={fieldState.invalid}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]}>
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor={field.name}>Nomor Telepon / WhatsApp</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                placeholder="0812-3456-7890"
                aria-invalid={fieldState.invalid}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]}>
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor={field.name}>Kata Sandi</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Minimal 8 karakter"
                aria-invalid={fieldState.invalid}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]}>
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="passwordConfirmation"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor={field.name}>Konfirmasi Kata Sandi</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Ulangi kata sandi"
                aria-invalid={fieldState.invalid}
                disabled={registerMutation.isPending || isSubmitting}
              />
              {fieldState.error && (
                <FieldError errors={[fieldState.error]}>
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Button
          type="submit"
          size="lg"
          variant="primary"
          className="w-full text-base font-semibold mt-2"
          disabled={registerMutation.isPending || isSubmitting}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Mendaftarkan Akun...
            </>
          ) : (
            <>
              Daftar Sekarang
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[#5d6f66]">
        Sudah memiliki akun?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#259e73] hover:underline"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
