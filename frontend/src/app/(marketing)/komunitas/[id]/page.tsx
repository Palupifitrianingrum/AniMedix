"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, MessageCircle, MessagesSquare, Send } from "lucide-react";
import { Avatar, BackButton, Badge, Button } from "@/components/ui";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMounted } from "@/hooks/useMounted";
import { initials } from "@/lib/format";
import { toast } from "@/store/useToastStore";

/* Detail diskusi komunitas - isi pertanyaan, daftar komentar, dan form balasan */

export default function DetailDiskusiPage() {
  const { id } = useParams<{ id: string }>();
  const mounted = useMounted();
  const { posts, comments, addComment } = useCommunityStore();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  const authorName = user?.full_name || "Prabowo";
  const post = posts.find((p) => p.id === id);
  const thread = comments[id] ?? [];
  const others = posts.filter((p) => p.id !== id).slice(0, 4);

  // Data diskusi tersimpan di localStorage, jadi baru ditampilkan setelah di browser.
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <div className="h-12 w-40 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <MessagesSquare className="h-10 w-10 text-slate-400" aria-hidden="true" />
        <h1 className="font-display text-3xl text-teal-dark">Diskusi tidak ditemukan</h1>
        <p className="text-slate-500">Diskusi yang kamu cari mungkin sudah dihapus.</p>
        <Link href="/komunitas" className="mt-2 rounded-2xl bg-teal-accent px-6 py-3 font-bold text-white hover:bg-teal-base">
          Kembali ke komunitas
        </Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    addComment(post.id, { authorInitials: initials(authorName), authorName, text: value });
    setText("");
    toast("Komentar terkirim");
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  return (
    <>
      <title>{`AniMedix — Diskusi ${post.authorName}`}</title>
      <BackButton fallbackUrl="/komunitas" label="Kembali ke komunitas" className="mb-6" />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-5">
          {/* Pertanyaan utama */}
          <article className="flex gap-4 rounded-3xl border border-border-hairline bg-white p-6 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)]">
            <Avatar name={post.authorInitials} size="lg" colorPreset="neutral" className="rounded-2xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <b className="font-display text-xl text-teal-dark">{post.authorName}</b>
                <Badge variant="olive" size="sm">Peternak</Badge>
                <small className="text-xs font-bold text-slate-400">{post.time}</small>
              </div>
              <h1 className="font-body text-xl leading-snug text-teal-dark sm:text-2xl">{post.text}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                {post.tag && <Badge variant="teal" size="sm">{post.tag}</Badge>}
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> {thread.length} komentar
                </span>
              </div>
            </div>
          </article>

          {/* Komentar */}
          <section aria-labelledby="komentar" className="flex flex-col gap-4">
            <h2 id="komentar" className="px-1 font-display text-2xl text-teal-dark">
              Komentar ({thread.length})
            </h2>

            {thread.length ? (
              <ul className="flex flex-col gap-3">
                {thread.map((c) => {
                  const isVet = c.role === "Dokter Hewan";
                  return (
                    <li
                      key={c.id}
                      className={
                        "flex gap-3.5 rounded-3xl border p-5 " +
                        (isVet ? "border-teal-accent/30 bg-teal-tint/60" : "border-border-hairline bg-white")
                      }
                    >
                      <Avatar
                        name={c.authorInitials}
                        size="md"
                        colorPreset={isVet ? "teal" : "neutral"}
                        className="rounded-xl"
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <b className="font-display text-base text-teal-dark">{c.authorName}</b>
                          <Badge variant={isVet ? "teal" : "olive"} size="sm">{c.role}</Badge>
                          <small className="text-xs font-bold text-slate-400">{c.time}</small>
                        </div>
                        <p className="whitespace-pre-line text-[15px] leading-relaxed text-teal-dark">{c.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border-hairline bg-surface-bg px-6 py-10 text-center">
                <MessageCircle className="h-9 w-9 text-slate-400" aria-hidden="true" />
                <h3 className="font-display text-xl text-teal-dark">Belum ada komentar</h3>
                <p className="text-slate-500">Bagikan pengalamanmu untuk membantu peternak ini.</p>
              </div>
            )}
            <div ref={endRef} />
          </section>

          {/* Form komentar */}
          <form
            onSubmit={submit}
            className="flex flex-col gap-3 rounded-3xl border border-border-hairline bg-white p-6 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)]"
          >
            <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
              Tulis komentar
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
                required
                rows={3}
                placeholder="Bagikan saran atau pengalamanmu..."
                className="w-full resize-y rounded-2xl bg-input-bg px-5 py-4 font-body text-base font-normal text-teal-dark shadow-inner placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-accent"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-400">{text.length}/500</span>
              <Button type="submit" variant="teal" shape="rounded" leftIcon={<Send className="h-4 w-4" aria-hidden="true" />}>
                Kirim komentar
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 rounded-3xl border border-border-hairline bg-white p-6 lg:sticky lg:top-32">
          <div>
            <h3 className="mb-3 font-display text-2xl text-teal-dark">Diskusi Lainnya</h3>
            <ul className="flex flex-col">
              {others.map((o) => (
                <li key={o.id} className="border-b border-border-hairline last:border-0">
                  <Link
                    href={`/komunitas/${o.id}`}
                    className="group flex items-start gap-2 py-3 text-sm font-bold text-teal-dark hover:text-teal-base"
                  >
                    <span className="flex-1 leading-snug">{o.text}</span>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/komunitas" className="mt-3 inline-block text-sm font-bold text-teal-base hover:text-teal-dark">
              Lihat semua diskusi
            </Link>
          </div>
          <div className="border-t border-border-hairline pt-5">
            <h3 className="mb-1.5 font-display text-2xl text-teal-dark">Butuh dokter hewan?</h3>
            <p className="mb-3 text-sm leading-relaxed text-slate-500">
              Saran sesama peternak membantu, tetapi untuk hewan yang sakit, konsultasikan langsung ke dokter hewan.
            </p>
            <Link
              href="/dokter"
              className="inline-flex items-center justify-center rounded-2xl bg-teal-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-base"
            >
              Tanya Dokter
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
