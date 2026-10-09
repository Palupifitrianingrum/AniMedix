"use client";

import * as React from "react";
import { KeyRound, Bell, Lock, Globe, Check, Eye, EyeOff } from "lucide-react";
import { Button, Input, Modal, StatusModal } from "@/components/ui";

interface SettingItem {
  id: "password" | "notification" | "privacy" | "language";
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SettingsPage() {
  const [activeModal, setActiveModal] = React.useState<
    "password" | "notification" | "privacy" | "language" | null
  >(null);

  // State untuk form Ubah Password
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");

  // State untuk Notifikasi
  const [notifSchedule, setNotifSchedule] = React.useState(true);
  const [notifPromo, setNotifPromo] = React.useState(true);
  const [notifWa, setNotifWa] = React.useState(true);

  // State untuk Privasi
  const [privacyPublic, setPrivacyPublic] = React.useState(true);
  const [shareLocation, setShareLocation] = React.useState(true);

  // State untuk Bahasa
  const [selectedLanguage, setSelectedLanguage] = React.useState<"id" | "en">(
    "id"
  );

  // Status modal sukses
  const [statusModal, setStatusModal] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const settingsList: SettingItem[] = [
    {
      id: "password",
      title: "Change Password",
      description: "Ubah kata sandi akun demi keamanan data Anda",
      icon: (
        <KeyRound className="w-6 h-6 text-slate-400 group-hover:text-teal-base transition-colors stroke-[1.8]" />
      ),
    },
    {
      id: "notification",
      title: "Notification Settings",
      description: "Atur pemberitahuan jadwal periksa dan promo",
      icon: (
        <Bell className="w-6 h-6 text-slate-400 group-hover:text-teal-base transition-colors stroke-[1.8]" />
      ),
    },
    {
      id: "privacy",
      title: "Account Privacy",
      description: "Atur visibilitas data ternak dan lokasi Anda",
      icon: (
        <Lock className="w-6 h-6 text-slate-400 group-hover:text-teal-base transition-colors stroke-[1.8]" />
      ),
    },
    {
      id: "language",
      title: "Language",
      description:
        selectedLanguage === "id"
          ? "Bahasa Indonesia (Default)"
          : "English (US)",
      icon: (
        <Globe className="w-6 h-6 text-slate-400 group-hover:text-teal-base transition-colors stroke-[1.8]" />
      ),
    },
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Kata sandi saat ini wajib diisi");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setActiveModal(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatusModal({
      isOpen: true,
      title: "Kata Sandi Berhasil Diperbarui",
      description:
        "Kata sandi akun Anda telah berhasil diubah. Gunakan kata sandi baru untuk login berikutnya.",
    });
  };

  const handleSaveNotifications = () => {
    setActiveModal(null);
    setStatusModal({
      isOpen: true,
      title: "Pengaturan Notifikasi Disimpan",
      description:
        "Preferensi pemberitahuan jadwal dan promo berhasil diperbarui.",
    });
  };

  const handleSavePrivacy = () => {
    setActiveModal(null);
    setStatusModal({
      isOpen: true,
      title: "Pengaturan Privasi Disimpan",
      description:
        "Visibilitas profil peternak dan lokasi kandang telah diperbarui.",
    });
  };

  const handleSaveLanguage = () => {
    setActiveModal(null);
    setStatusModal({
      isOpen: true,
      title: "Bahasa Berhasil Diubah",
      description: `Bahasa aplikasi telah disetel ke ${
        selectedLanguage === "id" ? "Bahasa Indonesia" : "English"
      }.`,
    });
  };

  return (
    <div className="w-full">
      {/* Main Settings Card sesuai Wireframe */}
      <div className="bg-surface-card border border-border-hairline rounded-3xl p-6 sm:p-10 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)]">
        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl text-teal-dark tracking-tight mb-8">
          Settings
        </h1>

        {/* 4 Interactive Setting Rows */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {settingsList.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveModal(item.id)}
              className="group w-full flex items-center justify-between p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-[#f9faf7]/50 hover:bg-white hover:border-teal-accent/60 hover:shadow-md transition-all duration-200 text-left cursor-pointer"
            >
              <div className="flex flex-col gap-1 pr-4">
                <span className="font-display text-lg sm:text-xl text-teal-dark group-hover:text-teal-base transition-colors">
                  {item.title}
                </span>
                <span className="text-xs sm:text-sm font-body text-slate-500 font-semibold leading-relaxed">
                  {item.description}
                </span>
              </div>

              <div className="shrink-0 p-2 rounded-2xl bg-white border border-slate-100 group-hover:border-teal-accent/30 shadow-2xs transition-all">
                {item.icon}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Modal Change Password */}
      <Modal
        isOpen={activeModal === "password"}
        onClose={() => {
          setActiveModal(null);
          setPasswordError("");
        }}
        className="max-w-md text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark">
          Change Password
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Pastikan kata sandi baru Anda kuat dan belum pernah digunakan sebelumnya.
        </p>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          {passwordError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-semantic-error text-xs font-body font-bold">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-dark text-xs"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Kata Sandi Baru
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-dark font-body uppercase tracking-wider mb-1.5">
              Konfirmasi Kata Sandi Baru
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Ketik ulang kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveModal(null)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Kata Sandi
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal Notification Settings */}
      <Modal
        isOpen={activeModal === "notification"}
        onClose={() => setActiveModal(null)}
        className="max-w-md text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark">
          Notification Settings
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Sesuaikan jenis pemberitahuan yang ingin Anda terima dari dokter dan sistem AniMedix.
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="pr-2">
              <p className="font-display text-sm text-teal-dark">
                Pemberitahuan Jadwal Periksa
              </p>
              <p className="text-xs text-slate-500 font-body">
                Dapatkan notifikasi H-1 sebelum jadwal kunjungan dokter ternak.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifSchedule}
              onChange={(e) => setNotifSchedule(e.target.checked)}
              className="w-5 h-5 accent-[#739744] rounded cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="pr-2">
              <p className="font-display text-sm text-teal-dark">
                Notifikasi WhatsApp Langsung
              </p>
              <p className="text-xs text-slate-500 font-body">
                Kirim pesan konfirmasi janji temu langsung ke nomor WhatsApp Anda.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifWa}
              onChange={(e) => setNotifWa(e.target.checked)}
              className="w-5 h-5 accent-[#739744] rounded cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="pr-2">
              <p className="font-display text-sm text-teal-dark">
                Info Program & Vaksinasi Massal
              </p>
              <p className="text-xs text-slate-500 font-body">
                Kabar program subsidi pakan, vaksinasi daerah, dan edukasi peternak.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPromo}
              onChange={(e) => setNotifPromo(e.target.checked)}
              className="w-5 h-5 accent-[#739744] rounded cursor-pointer shrink-0"
            />
          </label>

          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveModal(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveNotifications}
            >
              Simpan Preferensi
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Modal Account Privacy */}
      <Modal
        isOpen={activeModal === "privacy"}
        onClose={() => setActiveModal(null)}
        className="max-w-md text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark">
          Account Privacy
        </h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Kontrol bagaimana data profil peternakan dan ternak Anda dilihat oleh pihak lain.
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="pr-2">
              <p className="font-display text-sm text-teal-dark">
                Profil Publik Aktif
              </p>
              <p className="text-xs text-slate-500 font-body">
                Izinkan dokter hewan dan peternak sekitar menemukan profil peternakan Anda.
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacyPublic}
              onChange={(e) => setPrivacyPublic(e.target.checked)}
              className="w-5 h-5 accent-[#739744] rounded cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="pr-2">
              <p className="font-display text-sm text-teal-dark">
                Bagikan Lokasi Kandang ke Dokter
              </p>
              <p className="text-xs text-slate-500 font-body">
                Otomatis sematkan koordinat GPS kandang saat melakukan reservasi kunjungan dokter.
              </p>
            </div>
            <input
              type="checkbox"
              checked={shareLocation}
              onChange={(e) => setShareLocation(e.target.checked)}
              className="w-5 h-5 accent-[#739744] rounded cursor-pointer shrink-0"
            />
          </label>

          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveModal(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSavePrivacy}
            >
              Simpan Privasi
            </Button>
          </div>
        </div>
      </Modal>

      {/* 4. Modal Language */}
      <Modal
        isOpen={activeModal === "language"}
        onClose={() => setActiveModal(null)}
        className="max-w-md text-left items-stretch"
      >
        <h2 className="font-display text-2xl text-teal-dark">Language</h2>
        <p className="text-xs text-slate-500 font-body mt-1 mb-4">
          Pilih bahasa tampilan antarmuka aplikasi AniMedix.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setSelectedLanguage("id")}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
              selectedLanguage === "id"
                ? "bg-olive-wash border-olive-base text-teal-dark"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div>
              <p className="font-display text-base">Bahasa Indonesia</p>
              <p className="text-xs text-slate-500 font-body">
                Bahasa default untuk wilayah Indonesia
              </p>
            </div>
            {selectedLanguage === "id" && (
              <Check className="w-5 h-5 text-olive-base" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedLanguage("en")}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
              selectedLanguage === "en"
                ? "bg-olive-wash border-olive-base text-teal-dark"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div>
              <p className="font-display text-base">English (US)</p>
              <p className="text-xs text-slate-500 font-body">
                Default international language
              </p>
            </div>
            {selectedLanguage === "en" && (
              <Check className="w-5 h-5 text-olive-base" />
            )}
          </button>

          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveModal(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveLanguage}
            >
              Terapkan Bahasa
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        status="success"
        title={statusModal.title}
        description={statusModal.description}
        actionText="Selesai"
      />
    </div>
  );
}
