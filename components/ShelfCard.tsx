"use client";

import Image from "next/image";
import Link from "next/link";

export type ShelfMedia = {
  id: number;
  media?: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

export default function ShelfCard({
  item,
  href,
}: {
  item: ShelfMedia;
  href: string;
}) {
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : null;

  const title = item.title || item.name || "Untitled";
  const rating =
    typeof item.vote_average === "number"
      ? item.vote_average.toFixed(1)
      : null;

  return (
    <Link
      href={href}
      className="group w-[140px] shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 transition"
    >
      <div className="relative aspect-[2/3] bg-zinc-800">
        {poster && (
          <Image
            src={poster}
            alt={title}
            fill
            loading="lazy"
            sizes="140px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}

        {rating && (
          <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold">
            ⭐ {rating}
          </span>
        )}
      </div>

      <div className="p-2">
        <p className="line-clamp-1 text-sm font-medium">{title}</p>
      </div>
    </Link>
  );
}
