import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AdminData,
  ActivityLog,
  Consultation,
  DEFAULT_SETTINGS,
  LogRole,
  seedAdminData,
} from "@/lib/admin/seed";

/*
 * State portal admin. Semua data disimpan di localStorage supaya perubahan
 * terbawa antar halaman. Saat backend siap, ganti update() dengan mutasi
 * TanStack Query ke API.
 */

interface AdminState {
  data: AdminData;
  /** Kata kunci pencarian global di topbar (tidak disimpan). */
  query: string;
  setQuery: (q: string) => void;
  /** Ubah data lewat salinan, opsional sekaligus mencatat log aktivitas admin. */
  update: (fn: (d: AdminData) => void, log?: { jenis: string; teks: string; peran?: LogRole }) => void;
  resetData: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      data: seedAdminData(),
      query: "",
      setQuery: (query) => set({ query }),
      update: (fn, log) =>
        set((s) => {
          const d = structuredClone(s.data);
          fn(d);
          if (log) {
            const entry: ActivityLog = { ts: Date.now(), peran: log.peran ?? "Admin", jenis: log.jenis, teks: log.teks };
            d.logs.unshift(entry);
          }
          return { data: d };
        }),
      resetData: () => set({ data: seedAdminData() }),
    }),
    {
      name: "animedix-admin-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ data: s.data }),
      merge: (persisted, current) => {
        const p = (persisted as { data?: AdminData } | undefined)?.data;
        if (!p?.vets || !p?.scans) return current;
        return {
          ...current,
          data: {
            ...p,
            settings: {
              ...DEFAULT_SETTINGS,
              ...p.settings,
              notif: { ...DEFAULT_SETTINGS.notif, ...p.settings?.notif },
              profil: { ...DEFAULT_SETTINGS.profil, ...p.settings?.profil },
            },
          },
        };
      },
    }
  )
);

/* ---------- Turunan data (dipakai banyak halaman) ---------- */

export const adminName = (d: AdminData) => d.settings.profil.nama;

export const komisiOf = (k: Consultation, d: AdminData) => (k.tarif * d.settings.komisi) / 100;

/** Pencocokan teks untuk pencarian global. */
export const matches = (q: string, ...values: (string | number)[]) =>
  !q || values.join(" ").toLowerCase().includes(q.trim().toLowerCase());

export interface RegionAlert {
  deteksi: string;
  wilayah: string;
  n: number;
}

/** Kasus risiko tinggi sejenis yang berkumpul di satu wilayah. */
export function regionAlerts(d: AdminData): RegionAlert[] {
  const g: Record<string, RegionAlert> = {};
  d.scans
    .filter((s) => s.risiko === "Tinggi")
    .forEach((s) => {
      const k = s.deteksi + "|" + s.wilayah;
      (g[k] ??= { deteksi: s.deteksi, wilayah: s.wilayah, n: 0 }).n++;
    });
  return Object.values(g)
    .filter((a) => a.n >= d.settings.aiWabah)
    .sort((a, b) => b.n - a.n);
}
