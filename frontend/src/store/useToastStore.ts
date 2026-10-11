import { create } from "zustand";

interface ToastState {
  message: string | null;
  seq: number;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  message: null,
  seq: 0,
  show: (message) => set((s) => ({ message, seq: s.seq + 1 })),
  hide: () => set({ message: null }),
}));

/** Tampilkan pesan singkat di pojok bawah layar. Bisa dipanggil dari mana saja. */
export const toast = (message: string) => useToastStore.getState().show(message);
