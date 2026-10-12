import * as React from "react";
import Link from "next/link";
import {
  HeartPulse,
  UtensilsCrossed,
  ShieldCheck,
  Bug,
  Home,
  Baby,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatArticleDate, type Article, type ArticleIcon } from "@/data/blog";

export const ARTICLE_ICONS: Record<ArticleIcon, LucideIcon> = {
  heart: HeartPulse,
  utensils: UtensilsCrossed,
  shield: ShieldCheck,
  bug: Bug,
  home: Home,
  baby: Baby,
};

const ICON_COLOR: Record<Article["tone"], string> = {
  olive: "text-olive-dark/70",
  teal: "text-teal-base/70",
  warning: "text-amber-700/70",
  neutral: "text-slate-500/80",
};

export function ArticleIconMark({ article, className }: { article: Article; className?: string }) {
  const Icon = ARTICLE_ICONS[article.icon];
  return <Icon className={cn("h-12 w-12 stroke-[1.5]", ICON_COLOR[article.tone], className)} aria-hidden="true" />;
}

export default function ArticleCard({ article, className }: { article: Article; className?: string }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-border-hairline bg-surface-bg shadow-xs transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent focus-visible:ring-offset-2",
        className
      )}
    >
      <div className={cn("relative flex h-44 w-full items-center justify-center bg-gradient-to-br", article.gradient)}>
        <ArticleIconMark article={article} />
        <div className="absolute left-4 top-4">
          <Badge variant={article.tone} size="sm" shape="pill">
            {article.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <span className="text-xs font-body font-semibold text-slate-400">
          {formatArticleDate(article.date)} • {article.readMinutes} Menit Baca
        </span>
        <h3 className="font-display text-xl leading-snug text-teal-dark transition-colors group-hover:text-teal-base">
          {article.title}
        </h3>
        <p className="mb-4 font-body text-sm leading-relaxed text-slate-600">{article.desc}</p>

        <div className="mt-auto border-t border-slate-200/60 pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold font-body text-teal-base transition-colors group-hover:text-teal-dark">
            {article.actionText}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
