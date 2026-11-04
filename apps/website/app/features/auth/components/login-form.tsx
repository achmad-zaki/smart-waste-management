import React from "react";
import { Link } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Field, FieldLabel, FieldError } from "~/components/ui/field";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-auth";
import { getApiErrorMessage } from "~/lib/axios";

interface LoginFormProps {
  onSuccess?: (data: LoginFormValues) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess(data);
          }
        },
      }
    );
  };

  const errorMessage = loginMutation.error
    ? getApiErrorMessage(loginMutation.error)
    : null;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#2e4a21] tracking-tight">
          Masuk ke Akun
        </h2>
        <p className="mt-1 text-sm text-[#5d6f66]">
          Masukkan email dan kata sandi Anda untuk mengakses sistem.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
                disabled={loginMutation.isPending || isSubmitting}
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
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name}>Kata Sandi</FieldLabel>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-[#259e73] hover:underline"
                >
                  Lupa sandi?
                </a>
              </div>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
                disabled={loginMutation.isPending || isSubmitting}
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
          className="w-full text-base font-semibold"
          disabled={loginMutation.isPending || isSubmitting}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Memproses Masuk...
            </>
          ) : (
            <>
              Masuk
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[#5d6f66]">
        Belum memiliki akun warga?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#259e73] hover:underline"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
