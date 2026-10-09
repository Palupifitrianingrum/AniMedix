"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getDashboardPathByRole } from "@/lib/auth-redirect";
import { Input, Button, FormField } from "@/components/ui";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isLoggedIn, user } = useAuthStore();

  const [step, setStep] = React.useState<1 | 2>(1);

  // Form State
  const [formData, setFormData] = React.useState({
    // Step 1
    fullName: "",
    nik: "",
    address: "",
    phone: "",
    // Step 2
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isLoggedIn && user) {
      router.push(getDashboardPathByRole(user.role));
    }
  }, [isLoggedIn, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!formData.fullName.trim()) {
      setValidationError("Nama lengkap wajib diisi.");
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError("Nomor handphone wajib diisi.");
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!formData.email.trim() || !formData.password.trim()) {
      setValidationError("Email dan password wajib diisi.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Konfirmasi password tidak cocok.");
      return;
    }

    const success = await register({
      full_name: formData.fullName,
      nik: formData.nik,
      address: formData.address,
      phone: formData.phone,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      const currentUser = useAuthStore.getState().user;
      router.push(getDashboardPathByRole(currentUser?.role));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7f2] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Back to Home Link */}
      <div className="w-full max-w-4xl mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-body font-bold text-teal-base hover:text-teal-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Split-Card Container (Sesuai Register.png & Register#2.png) */}
      <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-4xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Side: Selamat Datang Panel (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#e4f2eb] via-[#d7ece1] to-[#cae6d5] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Background Circles */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-slate-400/10 pointer-events-none" />
          <div className="absolute top-1/2 -left-12 w-36 h-36 rounded-full bg-slate-400/10 pointer-events-none" />
          <div className="absolute bottom-28 right-8 w-24 h-24 rounded-full bg-slate-400/15 pointer-events-none" />

          {/* Top Logo */}
          <div className="flex items-center justify-between z-10">
            <span className="font-display text-3xl tracking-tight text-teal-dark">
              AniMedix
            </span>
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-teal-base border border-teal-tint">
              <span className="text-3xl select-none">🐾</span>
            </div>
          </div>

          {/* Bottom Title: Selamat Datang */}
          <div className="z-10 mt-16 md:mt-0">
            <h1 className="font-display text-4xl sm:text-5xl text-teal-dark leading-tight tracking-tight">
              Selamat <br />
              Datang
            </h1>
            <p className="font-body text-xs text-teal-base font-semibold mt-2">
              Langkah {step} dari 2: {step === 1 ? "Data Diri" : "Akun & Password"}
            </p>
          </div>
        </div>

        {/* Right Side: Form Pendaftaran (7 cols) */}
        <div className="md:col-span-7 bg-[#edf4e8]/80 p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl text-teal-dark text-center mb-6 tracking-tight">
              Pendaftaran
            </h2>

            {/* Error Notification */}
            {(error || validationError) && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-body font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* STEP 1: Data Diri (Register.png) */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <FormField label="Nama Lengkap" required>
                  <Input
                    name="fullName"
                    placeholder="Contoh: Prabowo Subianto"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <FormField label="NIK">
                  <Input
                    name="nik"
                    placeholder="16 digit Nomor Induk Kependudukan"
                    value={formData.nik}
                    onChange={handleChange}
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <FormField label="Alamat Rumah">
                  <Input
                    name="address"
                    placeholder="Contoh: Bojong Koneng, Babakan Madang"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <FormField label="No. Handphone" required>
                  <Input
                    name="phone"
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <div className="pt-3 flex flex-col items-end gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    shape="rounded"
                    size="md"
                    className="w-36 py-2.5 font-display tracking-wider text-base bg-[#d3ded0] hover:bg-olive-base text-teal-dark hover:text-white border border-slate-300 shadow-sm"
                  >
                    LANJUT
                  </Button>

                  <div className="w-full text-center pt-3 border-t border-slate-200/60">
                    <span className="text-sm font-body text-slate-500">
                      Sudah punya akun?{" "}
                    </span>
                    <Link
                      href="/login"
                      className="text-sm font-body font-bold text-olive-dark hover:text-olive-base underline underline-offset-4"
                    >
                      Masuk
                    </Link>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: Data Akun (Register#2.png) */}
            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <FormField label="Username" required>
                  <Input
                    name="username"
                    placeholder="Contoh: prabowo_farm"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <FormField label="Email" required>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Contoh: nama@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <FormField label="Password" required>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <FormField label="Konfirmasi Password" required>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-[#dce4d7] border-0 text-teal-dark font-semibold text-sm h-12"
                  />
                </FormField>

                <div className="pt-3 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      shape="rounded"
                      size="md"
                      onClick={() => setStep(1)}
                      className="w-32 py-2.5 font-display text-sm bg-white"
                    >
                      KEMBALI
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      shape="rounded"
                      size="md"
                      isLoading={isLoading}
                      className="w-36 py-2.5 font-display tracking-wider text-base bg-[#d3ded0] hover:bg-olive-base text-teal-dark hover:text-white border border-slate-300 shadow-sm"
                    >
                      DAFTAR
                    </Button>
                  </div>

                  <div className="w-full text-center pt-3 border-t border-slate-200/60">
                    <span className="text-sm font-body text-slate-500">
                      Sudah punya akun?{" "}
                    </span>
                    <Link
                      href="/login"
                      className="text-sm font-body font-bold text-olive-dark hover:text-olive-base underline underline-offset-4"
                    >
                      Masuk
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
