// app/page.tsx
export const dynamic = "force-dynamic";

import {
  getPopularMovies,
  getTrendingAll,
  getMovieGenres,
} from "@/lib/fetchers";

import HeroCarousel from "@/components/HeroCarousel";
import CategoriesTray from "@/components/CategoriesTray";
import dynamicImport from "next/dynamic";
import type { ReactNode } from "react";
import type { NewsItem } from "@/components/NewsStrip";

/* ---------------- types ---------------- */

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating?: number;
};

/* ---------------- helpers ---------------- */

const tmdbImg = (
  p?: string | null,
  size: "w342" | "w500" | "w780" | "w1280" = "w780"
) => (p ? `https://image.tmdb.org/t/p/${size}${p}` : null);

const uniqueById = <T extends { id: number }>(arr: T[]) => {
  const seen = new Set<number>();
  return arr.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
};

function normalize(list: any[]): Norm[] {
  return list
    .filter((x) => x && typeof x.id === "number")
    .map((x) => ({
      id: x.id,
      media: x.media_type === "tv" ? "tv" : "movie",
      title: x.title || x.name || "Untitled",
      overview: x.overview || "",
      poster: tmdbImg(x.poster_path, "w500"),
      backdrop:
        tmdbImg(x.backdrop_path, "w1280") ||
        tmdbImg(x.poster_path, "w780"),
      year: String(x.release_date || x.first_air_date || "").slice(0, 4),
      rating:
        typeof x.vote_average === "number"
          ? Math.round(x.vote_average * 10) / 10
          : undefined,
    }));
}

const toShelfItem = (x: any) => {
  const media = x.media_type === "tv" ? "tv" : "movie";
  return {
    id: x.id,
    media,
    title: x.title || x.name || "Untitled",
    poster: tmdbImg(x.poster_path, "w342"),
    year: String(x.release_date || x.first_air_date || "").slice(0, 4),
    rating:
      typeof x.vote_average === "number"
        ? Math.round(x.vote_average * 10) / 10
        : undefined,
    href: `/${media}/${x.id}`,
  };
};

const toNews = (x: any): NewsItem => ({
  title: x.title || x.name || "Untitled",
  url: `/${x.media_type === "tv" ? "tv" : "movie"}/${x.id}`,
  source: "TMDB",
  image:
    tmdbImg(x.backdrop_path, "w780") ||
    tmdbImg(x.poster_path, "w780"),
});

/* ---------------- dynamic components ---------------- */

const ShelfRow = dynamicImport(() => import("@/components/ShelfRow"), {
  ssr: true,
  loading: () => <RowSkeleton />,
});

const NewsStrip = dynamicImport(() => import("@/components/NewsStrip"), {
  ssr: true,
  loading: () => <RowSkeleton />,
});

/* ---------------- page ---------------- */

export default async function Home() {
  try {
    const [popularRes, trendingRes, genreRes] = await Promise.allSettled([
      getPopularMovies(1),
      getTrendingAll(1),
      getMovieGenres(),
    ]);

    const popularRaw =
      popularRes.status === "fulfilled" ? popularRes.value?.results ?? [] : [];

    const trendingRaw =
      trendingRes.status === "fulfilled" ? trendingRes.value?.results ?? [] : [];

    const genres =
      genreRes.status === "fulfilled" && Array.isArray(genreRes.value)
        ? genreRes.value
        : [];

    const heroes = uniqueById([
      ...normalize(trendingRaw),
      ...normalize(popularRaw),
    ])
      .filter((x) => x.backdrop)
      .slice(0, 6);

    return (
      <main className="pb-10">
        <HeroCarousel items={heroes} />

        <Surface>
          <div className="space-y-6">
            {genres.length > 0 && <CategoriesTray genres={genres} />}

            <Panel title="More movies">
              <ShelfRow items={popularRaw.slice(0, 18).map(toShelfItem)} />
            </Panel>

            <Panel title="Trending movies">
              <ShelfRow items={trendingRaw.slice(0, 18).map(toShelfItem)} />
            </Panel>

            <Panel title="Top news">
              <NewsStrip items={trendingRaw.slice(0, 12).map(toNews)} />
            </Panel>
          </div>
        </Surface>
      </main>
    );
  } catch {
    // 🚑 HARD FAIL SAFE — prevents 404
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">CineVault</h1>
        <p className="text-zinc-400 mt-2">
          Content is temporarily unavailable. Please refresh.
        </p>
      </main>
    );
  }
}

/* ---------------- UI helpers ---------------- */

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-[#0c111b] ring-1 ring-white/10 overflow-hidden">
      <div className="px-4 md:px-6 py-3 md:py-4">
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
      </div>
      <div className="px-2 md:px-4 pb-4">{children}</div>
    </section>
  );
}

function Surface({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 w-[100svw] left-1/2 -translate-x-1/2 -mt-8 md:-mt-10">
      <div className="relative bg-[#0e131f] rounded-t-[28px] ring-1 ring-white/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 pt-6 pb-8 space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
}

function RowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[270px] w-[180px] rounded-xl bg-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}
