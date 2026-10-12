import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleBlock } from "@/data/blog";

/** Merender blok konten artikel (paragraf, judul, daftar, kotak info, tabel). */
export default function ArticleBody({
  blocks,
  tableAction,
}: {
  blocks: ArticleBlock[];
  /** tombol yang ditampilkan di bawah tabel pertama (mis. unduh CSV) */
  tableAction?: React.ReactNode;
}) {
  const firstTableIndex = blocks.findIndex((b) => b.type === "table");

  return (
    <div className="flex flex-col gap-5 font-body text-[17px] leading-[1.75] text-slate-700">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;

          case "h2":
            return (
              <h2 key={i} className="mt-4 font-display text-2xl leading-snug text-teal-dark sm:text-[28px]">
                {b.text}
              </h2>
            );

          case "ul":
            return (
              <ul key={i} className="flex list-disc flex-col gap-2 pl-6 marker:text-olive-base">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={i} className="flex list-decimal flex-col gap-2 pl-6 marker:font-bold marker:text-teal-base">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            );

          case "callout": {
            const warn = b.tone === "warning";
            const Icon = warn ? AlertTriangle : Info;
            return (
              <aside
                key={i}
                className={cn(
                  "flex gap-3.5 rounded-2xl border p-5 text-base leading-relaxed",
                  warn ? "border-amber-200 bg-amber-50 text-amber-950" : "border-teal-accent/30 bg-teal-tint text-teal-dark"
                )}
              >
                <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", warn ? "text-amber-600" : "text-teal-base")} aria-hidden="true" />
                <div>
                  <p className="font-display text-lg leading-snug">{b.title}</p>
                  <p className="mt-1">{b.text}</p>
                </div>
              </aside>
            );
          }

          case "table": {
            const showAction = i === firstTableIndex && !!tableAction;
            return (
              <figure key={i} className="flex flex-col gap-3">
                <div className="overflow-x-auto rounded-2xl border border-border-hairline bg-white">
                  <table className="w-full min-w-[520px] border-collapse text-left text-[15px] leading-snug">
                    {b.caption && (
                      <caption className="border-b border-border-hairline bg-surface-bg px-5 py-3 text-left text-sm font-bold text-slate-500">
                        {b.caption}
                      </caption>
                    )}
                    <thead>
                      <tr className="bg-teal-dark text-white">
                        {b.head.map((h) => (
                          <th key={h} scope="col" className="px-5 py-3 font-display text-base font-normal">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, ri) => (
                        <tr key={ri} className="border-t border-border-hairline even:bg-surface-bg">
                          {r.map((c, ci) => (
                            <td key={ci} className={cn("px-5 py-3 align-top", ci === 0 && "font-bold text-teal-dark")}>
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {showAction && <div>{tableAction}</div>}
              </figure>
            );
          }
        }
      })}
    </div>
  );
}
