"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getDashboardPathByRole } from "@/lib/auth-redirect";
import { Input, Button, FormField } from "@/components/ui";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isLoggedIn, user } = useAuthStore();

  const [emailOrUsername, setEmailOrUsername] = React.useState("prabowo");
  const [password, setPassword] = React.useState("password123");

  // Jika sudah login, langsung redirect ke dashboard sesuai role
  React.useEffect(() => {
    if (isLoggedIn && user) {
      router.push(getDashboardPathByRole(user.role));
    }
  }, [isLoggedIn, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login({ emailOrUsername, password });
    if (success) {
      const currentUser = useAuthStore.getState().user;
      const targetPath = getDashboardPathByRole(currentUser?.role);
      router.push(targetPath);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7f2] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Tombol Kembali ke Beranda */}
      <div className="w-full max-w-4xl mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-body font-bold text-teal-base hover:text-teal-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Split-Card Container (Sesuai Wireframe Login.png) */}
      <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-4xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        {/* Left Side: Brand & Welcome Panel (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#e4f2eb] via-[#d7ece1] to-[#cae6d5] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Background Circles */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-slate-400/10 pointer-events-none" />
          <div className="absolute top-1/2 -left-12 w-36 h-36 rounded-full bg-slate-400/10 pointer-events-none" />
          <div className="absolute bottom-28 right-8 w-24 h-24 rounded-full bg-slate-400/15 pointer-events-none" />

          {/* Top: Logo & Paw Icon */}
          <div className="flex items-center justify-between z-10">
            <span className="font-display text-3xl tracking-tight text-teal-dark">
              AniMedix
            </span>
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-teal-base border border-teal-tint">
              <span className="text-3xl select-none">🐾</span>
            </div>
          </div>

          {/* Bottom: Welcome Back! */}
          <div className="z-10 mt-16 md:mt-0">
            <h1 className="font-display text-4xl sm:text-5xl text-teal-dark leading-tight tracking-tight">
              Welcome <br />
              Back!
            </h1>
          </div>
        </div>

        {/* Right Side: Form Masuk Panel (7 cols) */}
        <div className="md:col-span-7 bg-[#edf4e8]/80 p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl text-teal-dark text-center mb-8 tracking-tight">
              Masuk
            </h2>

            {/* Error Notification Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-sm font-body font-semibold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Username / Email">
                <Input
                  type="text"
                  placeholder="Masukkan username atau email"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  className="bg-[#dce4d7] border-0 focus:bg-white text-teal-dark placeholder:text-slate-400 font-semibold"
                />
              </FormField>

              <FormField label="Password">
                <Input
                  type="password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#dce4d7] border-0 focus:bg-white text-teal-dark placeholder:text-slate-400 font-semibold"
                />
              </FormField>

              {/* Action Button & Register Link */}
              <div className="pt-4 flex flex-col items-end gap-5">
                <Button
                  type="submit"
                  variant="primary"
                  shape="rounded"
                  size="md"
                  isLoading={isLoading}
                  className="w-36 py-3 font-display tracking-wider text-base bg-[#d3ded0] hover:bg-olive-base text-teal-dark hover:text-white border border-slate-300 shadow-sm"
                >
                  MASUK
                </Button>

                <div className="w-full text-center pt-4 border-t border-slate-200/60">
                  <span className="text-sm font-body text-slate-500">
                    Belum punya akun?{" "}
                  </span>
                  <Link
                    href="/register"
                    className="text-sm font-body font-bold text-olive-dark hover:text-olive-base underline underline-offset-4"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
