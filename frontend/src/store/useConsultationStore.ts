import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Doctor, PAY_MINUTES, SESSION_MINUTES } from "@/data/doctors";

/*
 * Alur Tanya Dokter -> Pembayaran -> Chat (lihat guidline.md, useConsultationStore).
 * Disimpan di sessionStorage supaya bertahan saat refresh, hilang saat tab ditutup.
 */

export interface SelectedDoctor {
  id: string;
  name: string;
  specialization: string;
  fee: number;
  senior?: boolean;
}

export type PaymentStatus = "pending" | "paid" | "failed";

interface ConsultationState {
  orderId: string | null;
  doctor: SelectedDoctor | null;
  paymentStatus: PaymentStatus;
  payDeadline: number | null;
  failReason: string | null;
  chatStartedAt: number | null;
  chatEnded: boolean;

  selectDoctor: (doctor: Doctor) => string;
  ensureDeadline: () => number;
  markPaid: () => void;
  markFailed: (reason?: string) => void;
  retryPayment: () => void;
  startChat: () => number;
  endChat: () => void;
  reset: () => void;
}

const newOrderId = () => "TRX-" + Date.now().toString(36).toUpperCase();

const empty = {
  orderId: null,
  doctor: null,
  paymentStatus: "pending" as PaymentStatus,
  payDeadline: null,
  failReason: null,
  chatStartedAt: null,
  chatEnded: false,
};

export const useConsultationStore = create<ConsultationState>()(
  persist(
    (set, get) => ({
      ...empty,

      selectDoctor: (d) => {
        const orderId = newOrderId();
        set({
          ...empty,
          orderId,
          doctor: {
            id: d.id,
            name: d.name,
            specialization: "Spesialis " + d.specialization,
            fee: d.fee,
            senior: d.senior,
          },
        });
        return orderId;
      },

      ensureDeadline: () => {
        const current = get().payDeadline;
        if (current) return current;
        const deadline = Date.now() + PAY_MINUTES * 60_000;
        set({ payDeadline: deadline });
        return deadline;
      },

      markPaid: () => set({ paymentStatus: "paid", failReason: null }),

      markFailed: (reason) =>
        set({ paymentStatus: "failed", failReason: reason ?? null }),

      retryPayment: () =>
        set({
          paymentStatus: "pending",
          failReason: null,
          payDeadline: Date.now() + PAY_MINUTES * 60_000,
        }),

      startChat: () => {
        const current = get().chatStartedAt;
        if (current) return current;
        const now = Date.now();
        set({ chatStartedAt: now });
        return now;
      },

      endChat: () => set({ chatEnded: true }),

      reset: () => set({ ...empty }),
    }),
    {
      name: "animedix_consultation",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const sessionEndsAt = (startedAt: number) => startedAt + SESSION_MINUTES * 60_000;
