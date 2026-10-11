"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Loader2, SendHorizontal } from "lucide-react";
import { Avatar, BackButton, Badge, Button, CountdownTimer } from "@/components/ui";
import { SESSION_MINUTES } from "@/data/doctors";
import { sessionEndsAt, useConsultationStore } from "@/store/useConsultationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { confirmDialog } from "@/store/useConfirmStore";
import { useMounted } from "@/hooks/useMounted";
import { fmtTime, rupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

/* Chat Dokter.png & Chat Dokter Ended.png */

interface Message {
  id: number;
  from: "doctor" | "user";
  author: string;
  text: string;
  at: number;
}

function SessionTimer({ endsAt, onExpire }: { endsAt: number; onExpire: () => void }) {
  const [initialSeconds] = React.useState(() => Math.max(0, Math.round((endsAt - Date.now()) / 1000)));
  return <CountdownTimer variant="chat" initialSeconds={initialSeconds} onExpire={onExpire} />;
}

function ChatRoom({ orderId }: { orderId: string }) {
  const { doctor, chatStartedAt, chatEnded, startChat, endChat } = useConsultationStore();
  const user = useAuthStore((s) => s.user);
  const userName = user?.full_name || "Prabowo";
  const doctorName = doctor?.name ?? "Dokter hewan";
  const doctorFirst = doctorName.replace(/^((Dr|dr|drh|Ir)\.\s*)+/i, "").split(/[\s,]+/)[0];

  const [messages, setMessages] = React.useState<Message[]>(() => [
    {
      id: 1,
      from: "doctor",
      author: doctorName.split(",")[0],
      text: `Selamat datang, Pak ${userName.split(" ")[0]}. Saya ${doctorFirst}. Ada keluhan apa pada ternak Bapak?`,
      at: Date.now() - 2 * 60_000,
    },
  ]);
  const [text, setText] = React.useState("");
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    startChat();
  }, [startChat]);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || chatEnded) return;
    setMessages((m) => [...m, { id: m.length + 1, from: "user", author: `${userName} (Peternak)`, text: value, at: Date.now() }]);
    setText("");
  };

  const askEnd = async () => {
    const ok = await confirmDialog({
      title: "Akhiri sesi konsultasi?",
      description: "Sesi yang sudah diakhiri tidak bisa dilanjutkan.",
      confirmText: "Akhiri sesi",
      isDestructive: true,
    });
    if (ok) endChat();
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section aria-label="Percakapan dengan dokter" className="flex h-[620px] flex-col overflow-hidden rounded-3xl border border-border-hairline bg-white">
        <header className="flex items-center gap-4 border-b border-border-hairline px-6 py-4">
          <Avatar name={doctorName} size="lg" status="online" colorPreset={doctor?.senior ? "olive" : "neutral"} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-xl text-teal-dark">{doctorName}</h2>
            <small className="text-sm font-bold text-slate-500">Dokter hewan · Konsultasi online</small>
          </div>
          {chatEnded ? (
            <Badge variant="neutral">Selesai</Badge>
          ) : (
            chatStartedAt && <SessionTimer key={chatStartedAt} endsAt={sessionEndsAt(chatStartedAt)} onExpire={endChat} />
          )}
        </header>

        <div ref={listRef} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto bg-surface-bg px-6 py-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[75%] rounded-3xl px-5 py-3",
                m.from === "user" ? "self-end rounded-br-md bg-teal-base text-white" : "self-start rounded-bl-md border border-border-hairline bg-white text-teal-dark"
              )}
            >
              <b className={cn("block text-xs", m.from === "user" ? "text-[#77e0e4]" : "text-teal-base")}>{m.author}</b>
              <p className="text-base">{m.text}</p>
              <small className={cn("block text-right text-[11px]", m.from === "user" ? "text-white/70" : "text-slate-400")}>{fmtTime(m.at)}</small>
            </div>
          ))}
        </div>

        {chatEnded ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-hairline bg-olive-wash px-6 py-4">
            <span className="font-display text-lg text-olive-dark">Sesi percakapan berakhir</span>
            <Link href="/dokter" className="rounded-xl bg-olive-light px-4 py-2 text-sm font-bold text-teal-dark hover:bg-olive-base hover:text-white">
              Mulai sesi baru
            </Link>
          </div>
        ) : (
          <form onSubmit={send} className="flex gap-3 border-t border-border-hairline p-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik pesan Anda di sini…"
              autoComplete="off"
              aria-label="Pesan"
              className="h-12 flex-1 rounded-2xl bg-input-bg px-5 text-base text-teal-dark shadow-inner placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-accent"
            />
            <Button type="submit" variant="teal" shape="rounded" aria-label="Kirim pesan" className="h-12 px-5">
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </form>
        )}
      </section>

      <aside className="flex flex-col gap-4 rounded-3xl border border-border-hairline bg-white p-6">
        <h3 className="font-display text-2xl text-teal-dark">Info konsultasi</h3>
        <Badge variant="success" className="self-start">
          <CheckCircle2 className="h-3.5 w-3.5" /> Pembayaran terverifikasi
        </Badge>
        <dl className="text-sm">
          {[
            ["ID transaksi", orderId],
            ["Biaya", rupiah(doctor?.fee ?? 0)],
            ["Durasi sesi", `${SESSION_MINUTES} menit`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-border-hairline py-2.5 last:border-0">
              <dt className="font-bold text-slate-500">{k}</dt>
              <dd className="font-bold text-teal-dark">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-slate-500">
          Chat ini hanya untuk konsultasi awal. Kondisi darurat sebaiknya langsung dibawa ke klinik terdekat.
        </p>
        <Link href="/klinik" className="rounded-2xl border border-border-hairline px-4 py-2.5 text-center text-sm font-bold text-teal-dark hover:bg-slate-50">
          Cari klinik terdekat
        </Link>
        <Button variant="outline" shape="rounded" size="sm" onClick={askEnd} disabled={chatEnded}>
          Akhiri konsultasi
        </Button>
      </aside>
    </div>
  );
}

export default function ChatDokterPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const mounted = useMounted();
  const { orderId, paymentStatus } = useConsultationStore();

  if (!mounted) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" aria-label="Memuat" />
      </div>
    );
  }

  return (
    <>
      <BackButton fallbackUrl="/dokter" className="mb-6" />
      {orderId === chatId && paymentStatus === "paid" ? (
        <ChatRoom orderId={chatId} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border-hairline bg-surface-bg px-6 py-16 text-center">
          <h1 className="font-display text-3xl text-teal-dark">Pembayaran diperlukan</h1>
          <p className="text-slate-500">Pilih dokter dan selesaikan pembayaran sebelum membuka chat.</p>
          <Link href="/dokter" className="mt-2 rounded-2xl bg-olive-base px-6 py-3 font-bold text-white hover:bg-olive-dark">
            Pilih dokter
          </Link>
        </div>
      )}
    </>
  );
}
