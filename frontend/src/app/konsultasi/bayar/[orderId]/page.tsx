"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Avatar, BackButton, Button, CountdownTimer, QrPlaceholder, StatusModal } from "@/components/ui";
import { SESSION_MINUTES } from "@/data/doctors";
import { useConsultationStore } from "@/store/useConsultationStore";
import { useMounted } from "@/hooks/useMounted";
import { fmtDeadline, rupiah } from "@/lib/format";

/*
 * Pembayaran.png - QRIS simulasi + hitung mundur.
 * Status Berhasil/Gagal memakai <StatusModal> (Frame 2.png & Frame 3.png,
 * ikon & warna mengikuti src/info-pembayaran.png).
 */

const TIMEOUT_REASON = "Waktu pembayaran habis. Silakan klik “Kembali”";

function PaymentCountdown({ deadline, onExpire }: { deadline: number; onExpire: () => void }) {
  // Dihitung sekali saat komponen dipasang; komponen dipasang ulang (key) tiap batas waktu baru.
  const [initialSeconds] = React.useState(() => Math.max(0, Math.round((deadline - Date.now()) / 1000)));
  return <CountdownTimer variant="payment" initialSeconds={initialSeconds} onExpire={onExpire} />;
}

export default function PembayaranPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const mounted = useMounted();
  const store = useConsultationStore();
  const { doctor, paymentStatus, payDeadline, failReason, ensureDeadline, markPaid, markFailed, retryPayment } = store;
  const [successDismissed, setSuccessDismissed] = React.useState(false);

  const valid = mounted && !!doctor && store.orderId === orderId;

  React.useEffect(() => {
    if (valid) ensureDeadline();
  }, [valid, ensureDeadline]);

  const handleExpire = React.useCallback(() => {
    if (useConsultationStore.getState().paymentStatus === "pending") markFailed(TIMEOUT_REASON);
  }, [markFailed]);

  const goToChat = () => router.push(`/konsultasi/room/${orderId}`);

  if (!mounted) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" aria-label="Memuat" />
      </div>
    );
  }

  if (!valid || !doctor) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <h1 className="font-display text-3xl text-teal-dark">Transaksi tidak ditemukan</h1>
        <p className="text-slate-500">Pilih dokter terlebih dahulu untuk membuat transaksi konsultasi.</p>
        <Link href="/dokter" className="mt-2 rounded-2xl bg-olive-base px-6 py-3 font-bold text-white hover:bg-olive-dark">
          Pilih dokter
        </Link>
      </div>
    );
  }

  return (
    <>
      <BackButton fallbackUrl="/dokter" className="mb-6" />

      <section className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-border-hairline bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Ringkasan dokter */}
        <div className="flex flex-col items-center border-b border-border-hairline p-8 text-center lg:border-b-0 lg:border-r lg:p-10">
          <Avatar name={doctor.name} size="2xl" colorPreset={doctor.senior ? "olive" : "neutral"} className="mb-6 h-36 w-36 text-4xl" />
          <h2 className="mb-1.5 font-display text-2xl leading-snug text-teal-dark">{doctor.name}</h2>
          <p className="mb-7 font-bold text-teal-base">{doctor.specialization}</p>
          <dl className="w-full border-t border-border-hairline text-left text-sm">
            {[
              ["Biaya konsultasi", rupiah(doctor.fee)],
              ["Durasi sesi", `${SESSION_MINUTES} menit`],
              ["Metode", "QRIS (simulasi)"],
              ["ID transaksi", orderId],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border-hairline py-3 last:border-0">
                <dt className="font-bold text-slate-500">{k}</dt>
                <dd className="font-bold text-teal-dark">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* QRIS */}
        <div className="flex items-center justify-center p-8 lg:p-10">
          {paymentStatus === "paid" && successDismissed ? (
            <div className="flex max-w-sm flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" aria-hidden="true" />
              <h2 className="font-display text-2xl text-teal-dark">Pembayaran terverifikasi</h2>
              <p className="text-slate-500">Sesi chat {SESSION_MINUTES} menit dimulai setelah kamu masuk.</p>
              <Button variant="primary" shape="rounded" onClick={goToChat}>
                Masuk ke chat
              </Button>
            </div>
          ) : (
            <div className="flex w-full max-w-sm flex-col items-center gap-3.5 text-center">
              <QrPlaceholder seed={doctor.fee + doctor.name.length + orderId.length} />
              <p className="text-sm font-bold text-slate-500">Total pembayaran</p>
              <p className="font-display text-4xl leading-none text-teal-dark">{rupiah(doctor.fee)}</p>
              {payDeadline && paymentStatus === "pending" && (
                <>
                  <PaymentCountdown key={payDeadline} deadline={payDeadline} onExpire={handleExpire} />
                  <p className="text-sm font-bold text-slate-500">Bayar sebelum {fmtDeadline(payDeadline)}</p>
                </>
              )}
              <Button variant="teal" shape="rounded" className="mt-2 w-full" onClick={markPaid} disabled={paymentStatus !== "pending"}>
                Saya Sudah Bayar
              </Button>
              <Button variant="outline" shape="rounded" className="w-full" onClick={() => markFailed()} disabled={paymentStatus !== "pending"}>
                Simulasikan pembayaran gagal
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Frame 2.png - Transaksi Berhasil */}
      <StatusModal
        isOpen={paymentStatus === "paid" && !successDismissed}
        onClose={() => setSuccessDismissed(true)}
        status="success"
        title="Transaksi Berhasil"
        description="Waktu percakapan dimulai setelah klik “Masuk”"
        actionText="Masuk"
        onAction={goToChat}
      />

      {/* Frame 3.png - Transaksi Gagal */}
      <StatusModal
        isOpen={paymentStatus === "failed"}
        onClose={retryPayment}
        status="error"
        title="Transaksi Gagal"
        description={failReason ?? "Silakan klik “Kembali”"}
        actionText="Kembali"
      />
    </>
  );
}
