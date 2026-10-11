import { create } from "zustand";

/*
 * Pengganti window.confirm() memakai <ConfirmModal> dari components/ui.
 *   if (await confirmDialog({ title: "Hapus akun?" })) { ... }
 */

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

interface ConfirmState {
  options: ConfirmOptions | null;
  resolver: ((ok: boolean) => void) | null;
  ask: (options: ConfirmOptions) => Promise<boolean>;
  settle: (ok: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>()((set, get) => ({
  options: null,
  resolver: null,
  ask: (options) =>
    new Promise<boolean>((resolve) => {
      get().resolver?.(false);
      set({ options, resolver: resolve });
    }),
  settle: (ok) => {
    const resolve = get().resolver;
    set({ options: null, resolver: null });
    resolve?.(ok);
  },
}));

export const confirmDialog = (options: ConfirmOptions) =>
  useConfirmStore.getState().ask(options);
