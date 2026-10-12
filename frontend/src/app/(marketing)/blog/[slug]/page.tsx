import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, CalendarDays, Stethoscope, MessagesSquare, ArrowRight } from "lucide-react";
import { BackButton, Badge } from "@/components/ui";
import ArticleBody from "@/components/blog/ArticleBody";
import ArticleCard, { ArticleIconMark } from "@/components/blog/ArticleCard";
import DownloadTableButton from "@/components/blog/DownloadTableButton";
import {
  ARTICLES,
  formatArticleDate,
  getArticle,
  getRelatedArticles,
  type ArticleBlock,
} from "@/data/blog";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/* Detail artikel Blog Edukasi */

type Params = { slug: string };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Artikel tidak ditemukan — AniMedix" };
  return { title: `${article.title} — AniMedix`, description: article.desc };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.slug);
  const table = article.downloadableTable
    ? (article.content.find((b) => b.type === "table") as Extract<ArticleBlock, { type: "table" }> | undefined)
    : undefined;

  return (
    <>
      <BackButton fallbackUrl="/blog" label="Kembali ke blog" className="mb-6" />

      <article className="mx-auto max-w-3xl">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={article.tone} size="sm">
              {article.category}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {article.readMinutes} menit baca
            </span>
          </div>

          <h1 className="font-display text-4xl leading-[1.15] tracking-tight text-teal-dark sm:text-5xl">
            {article.title}
          </h1>
          <p className="font-body text-lg leading-relaxed text-slate-600">{article.desc}</p>

          <div className="flex items-center gap-3 border-y border-border-hairline py-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-base font-body text-sm font-bold text-white">
              {initials(article.author)}
            </span>
            <div className="leading-tight">
              <p className="font-display text-base text-teal-dark">{article.author}</p>
              <p className="text-sm text-slate-500">{article.authorRole}</p>
            </div>
          </div>
        </header>

        <div
          className={cn(
            "my-8 flex h-48 items-center justify-center rounded-3xl bg-gradient-to-br sm:h-60",
            article.gradient
          )}
        >
          <ArticleIconMark article={article} className="h-20 w-20" />
        </div>

        <ArticleBody
          blocks={article.content}
          tableAction={
            table ? (
              <DownloadTableButton
                fileName={article.slug}
                head={table.head}
                rows={table.rows}
                label="Unduh Tabel Vaksin (CSV)"
              />
            ) : undefined
          }
        />

        <p className="mt-8 rounded-2xl bg-surface-bg px-5 py-4 text-sm leading-relaxed text-slate-500">
          Artikel ini bersifat edukatif dan tidak menggantikan pemeriksaan langsung. Untuk diagnosis dan pengobatan,
          konsultasikan hewan Anda dengan dokter hewan.
        </p>

        {/* CTA ke fitur lain */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dokter"
            className="group flex items-center gap-4 rounded-3xl border border-border-hairline bg-white p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-accent/30 bg-teal-tint text-teal-base">
              <Stethoscope className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-lg text-teal-dark">Tanya Dokter</span>
              <span className="block text-sm text-slate-500">Konsultasikan gejala ternak Anda</span>
            </span>
            <ArrowRight className="h-5 w-5 text-teal-base transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/komunitas"
            className="group flex items-center gap-4 rounded-3xl border border-border-hairline bg-white p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#fed7aa] bg-[#fff7ed] text-[#ea580c]">
              <MessagesSquare className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-lg text-teal-dark">Diskusi di Komunitas</span>
              <span className="block text-sm text-slate-500">
                {article.communityTag ? `Bahas topik ${article.communityTag}` : "Bertukar pengalaman dengan peternak"}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-[#ea580c] transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </article>

      {/* Artikel terkait */}
      <section aria-labelledby="terkait" className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="terkait" className="font-display text-3xl text-teal-dark">
            Artikel lainnya
          </h2>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-base hover:text-teal-dark">
            Semua artikel <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </>
  );
}
