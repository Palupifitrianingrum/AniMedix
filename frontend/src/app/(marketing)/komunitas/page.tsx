"use client";

import * as React from "react";
import { MessageCircle, MessagesSquare } from "lucide-react";
import { Avatar, Badge, Button, PageHeader, Select } from "@/components/ui";
import { COMMUNITY_TAGS } from "@/data/community";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMounted } from "@/hooks/useMounted";
import { initials } from "@/lib/format";
import { toast } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

/* Komunitas.png - forum diskusi peternak */

export default function KomunitasPage() {
  const mounted = useMounted();
  const { posts, addPost } = useCommunityStore();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [filter, setFilter] = React.useState("");

  const authorName = user?.full_name || "Prabowo";
  // Postingan tersimpan di localStorage, jadi baru ditampilkan setelah di browser.
  const visible = mounted ? posts.filter((p) => !filter || p.tag === filter) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    addPost({ authorInitials: initials(authorName), authorName, text: value, tag });
    setText("");
    setFilter("");
    toast("Diskusi terkirim");
  };

  return (
    <>
      <PageHeader title="Komunitas Peternak" description="Berbagi pengalaman dan berdiskusi bersama peternak lainnya" />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          {/* Composer */}
          <form onSubmit={submit} className="flex flex-col gap-4 rounded-3xl border border-border-hairline bg-white p-6 shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)]">
            <label className="flex flex-col gap-2 text-sm font-bold text-slate-600">
              Mulai diskusi
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={280}
                required
                rows={3}
                placeholder="Apa yang ingin kamu tanyakan atau bagikan?"
                className="w-full resize-y rounded-2xl bg-input-bg px-5 py-4 font-body text-base font-normal text-teal-dark shadow-inner placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-accent"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex flex-1 flex-col gap-2 text-sm font-bold text-slate-600">
                Topik
                <Select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  options={[{ value: "", label: "Tanpa topik" }, ...COMMUNITY_TAGS]}
                />
              </label>
              <Button type="submit" variant="teal" shape="rounded" className="h-13">
                Kirim diskusi
              </Button>
            </div>
          </form>

          {/* Daftar postingan */}
          {visible.map((p) => (
            <article key={p.id} className="flex gap-4 rounded-3xl border border-border-hairline bg-white p-6">
              <Avatar name={p.authorInitials} size="lg" colorPreset="neutral" className="rounded-2xl" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="font-display text-lg text-teal-dark">{p.authorName}</b>
                  <Badge variant="olive" size="sm">Peternak</Badge>
                  <small className="text-xs font-bold text-slate-400">{p.time}</small>
                </div>
                <p className="text-base text-teal-dark">{p.text}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                  {p.tag && <Badge variant="teal" size="sm">{p.tag}</Badge>}
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> {p.comments} komentar
                  </span>
                </div>
              </div>
            </article>
          ))}

          {mounted && !visible.length && (
            <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border-hairline bg-surface-bg px-6 py-12 text-center">
              <MessagesSquare className="h-10 w-10 text-slate-400" aria-hidden="true" />
              <h3 className="font-display text-2xl text-teal-dark">Belum ada diskusi di topik ini</h3>
              <p className="text-slate-500">Jadilah yang pertama bertanya.</p>
            </div>
          )}
        </div>

        {/* Sidebar topik */}
        <aside className="flex flex-col gap-5 rounded-3xl border border-border-hairline bg-white p-6 lg:sticky lg:top-32">
          <div>
            <h3 className="mb-3 font-display text-2xl text-teal-dark">Topik Populer</h3>
            <div className="flex flex-wrap gap-2">
              {COMMUNITY_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={filter === t}
                  onClick={() => setFilter((f) => (f === t ? "" : t))}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-bold transition-colors cursor-pointer",
                    filter === t
                      ? "border-teal-base bg-teal-base text-white"
                      : "border-border-hairline bg-white text-teal-base hover:bg-teal-tint"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border-hairline pt-5">
            <h3 className="mb-1.5 font-display text-2xl text-teal-dark">Pedoman Komunitas</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Berdiskusilah dengan sopan, bagikan informasi yang bermanfaat, dan konfirmasikan saran kesehatan hewan
              kepada dokter hewan.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
