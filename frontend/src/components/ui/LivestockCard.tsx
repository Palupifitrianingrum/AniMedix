import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import Badge from "./Badge";

export interface LivestockCardProps {
  id: string;
  tagId: string;
  name: string;
  breed: string;
  gender?: string;
  age: string;
  recentHistory?: string;
  imageUrl?: string;
  href?: string;
  className?: string;
}

export default function LivestockCard({
  tagId,
  name,
  breed,
  gender,
  age,
  recentHistory,
  imageUrl,
  href,
  className,
}: LivestockCardProps) {
  const content = (
    <div
      className={cn(
        "group bg-surface-card border border-border-hairline rounded-3xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(19,53,57,0.05)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col",
        className
      )}
    >
      {/* Photo / Visual Container */}
      <div className="relative w-full h-44 bg-gradient-to-br from-[#e8ebe4] to-[#d6ded0] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Tag className="w-12 h-12 text-olive-dark/60 stroke-[1.5]" />
        )}

        {/* Tag ID Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <Badge variant="id-tag" size="sm" shape="rounded">
            ID: {tagId}
          </Badge>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-5 flex flex-col flex-1 gap-2.5">
        <h4 className="font-display text-xl text-teal-dark group-hover:text-teal-base transition-colors">
          {name}
        </h4>

        <div className="flex items-center justify-between text-xs font-body text-slate-600 font-semibold">
          <span>
            Jenis: {breed} {gender ? `(${gender})` : ""}
          </span>
          <span>Usia: {age}</span>
        </div>

        {recentHistory && (
          <div className="mt-auto pt-2">
            <div className="bg-[#f6f8f5] rounded-xl px-3 py-2 text-xs font-body text-slate-700 leading-relaxed border border-slate-100">
              <span className="font-bold text-olive-dark">Riwayat: </span>
              {recentHistory}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
