"use client";

import * as React from "react";
import { Search, SearchX } from "lucide-react";
import { Button, Input, PageHeader } from "@/components/ui";
import ArticleCard from "@/components/blog/ArticleCard";
import { getArticlesByDate } from "@/data/blog";
import { cn } from "@/lib/utils";

/* Blog Edukasi - daftar artikel dengan filter kategori & pencarian */

const ALL = "Semua";
const ARTICLES = getArticlesByDate();
const CATEGORIES = [ALL, ...Array.from(new Set(ARTICLES.map((a) => a.category)))];

export default function BlogPage() {
  const [category, setCategory] = React.useState(ALL);
  const [query, setQuery] = React.useState("");

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter(
      (a) =>
        (category === ALL || a.category === category) &&
        (!q || `${a.title} ${a.desc} ${a.category}`.toLowerCase().includes(q))
    );
  }, [category, query]);

  const reset = () => {
    setCategory(ALL);
    setQuery("");
  };

  return (
    <>
      <title>AniMedix — Blog Edukasi</title>
      <PageHeader
        title="Blog Edukasi"
        description="Informasi terpercaya seputar penanganan, nutrisi, dan manajemen wabah ternak"
      />

      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter kategori" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition-colors",
                category === c
                  ? "border-teal-base bg-teal-base text-white"
                  : "border-border-hairline bg-white text-teal-base hover:bg-teal-tint"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="block w-full lg:w-80">
          <span className="sr-only">Cari artikel</span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel..."
            leftIcon={<Search className="h-4 w-4" aria-hidden="true" />}
          />
        </label>
      </div>

      <p aria-live="polite" className="mb-4 px-1 text-sm font-bold text-slate-500">
        {visible.length ? `${visible.length} artikel` : ""}
      </p>

      {visible.length ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border-hairline bg-surface-bg px-6 py-14 text-center">
          <SearchX className="h-10 w-10 text-slate-400" aria-hidden="true" />
          <h2 className="font-display text-2xl text-teal-dark">Artikel tidak ditemukan</h2>
          <p className="text-slate-500">Coba kata kunci lain atau tampilkan semua kategori.</p>
          <Button type="button" variant="outline" shape="rounded" className="mt-3" onClick={reset}>
            Tampilkan semua artikel
          </Button>
        </div>
      )}
    </>
  );
}
