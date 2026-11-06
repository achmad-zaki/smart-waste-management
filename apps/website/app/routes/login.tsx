import type { Route } from "./+types/login";
import { AuthBrandPanel } from "~/features/auth/components/auth-brand-panel";
import { LoginForm } from "~/features/auth/components/login-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Masuk ke Akun - Smart Waste Management" },
    {
      name: "description",
      content:
        "Masuk ke akun Anda untuk mengakses sistem pelaporan sampah cerdas berbasis AI.",
    },
  ];
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel subtitle="Solusi Pelaporan Sampah Cerdas Berbasis AI" />

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 bg-[#fcfcfc]">
        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
