import { AuthBrandPanel } from "~/features/auth/components/auth-brand-panel";
import { RegisterForm } from "~/features/auth/components/register-form";
import type { Route } from "./+types/register";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Pendaftaran Warga - Smart Waste Management" },
    {
      name: "description",
      content:
        "Daftarkan diri Anda untuk mulai melaporkan tumpukan sampah dan limbah secara cepat dan presisi berbasis AI.",
    },
  ];
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel subtitle="Registrasi Akun Warga Baru" />

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 bg-[#fcfcfc]">
        <div className="mx-auto w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
