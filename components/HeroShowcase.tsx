// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import HeroShowcase from "@/components/HeroShowcase";
import { getPopularMovies, getTrendingAll } from "@/lib/fetchers";

/* ---------------- TYPES ---------------- */

type Featured = {
  id: number;
  title: string;
  media: "movie" | "tv";
  year: string;
  backdrop: string | null;
  poster: string | null;
};

type Norm = {
  id: number;
  media: "movie" | "tv";
  title: string;
  poster?: string | null;
  backdrop?: string | null;
  year: string;
};

/* ---------------- HELPERS ---------------- */

function norm(list: unknown[]): Norm[] {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .filter((x: any) => x && typeof x.id === "number")
    .map((x: any) => ({
      id: x.id,
      media: x.media_type === "tv" ? "tv" : "movie",
      title: x.title || x.name || "Untitled",
      poster: x.poster_path ?? null,
      backdrop: x.backdrop_path ?? null,
      year: (x.release_date || x.first_air_date || "").slice(0, 4),
    }));
}

function img(path?: string | null, size: "w500" | "w1280" = "w500") {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "/img/placeholder.jpg";
}

function fallback(n: number): any[] {
  const posters = [
    "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    "/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    "/wImh3pd3mFNVIDtZycsYO9wP4a0.jpg",
    "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  ];

  return Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    media_type: i % 3 === 0 ? "tv" : "movie",
    title: ["Dune", "Oppenheimer", "Arcane", "Barbie", "Inception"][i % 5],
    name: ["Arcane", "The Bear", "Silo"][i % 3],
    poster_path: posters[i % posters.length],
    backdrop_path: posters[(i + 2) % posters.length],
    release_date: "2023-07-21",
    first_air_date: "2023-12-01",
  }));
}

export const revalidate = 120;

/* ---------------- PAGE ---------------- */

export default async function Home() {
  let popularRaw: any[] = [];
  let trendingRaw: any[] = [];

  try {
    [popularRaw, trendingRaw] = await Promise.all([
      getPopularMovies(),
      getTrendingAll(),
    ]);
  } catch {
    popularRaw = fallback(18);
    trendingRaw = fallback(12);
  }

  const popular = norm(popularRaw).slice(0, 18);
  const trending = norm(trendingRaw).slice(0, 12);

  const heroRaw =
    trendingRaw.find((t) => t?.backdrop_path) ||
    popularRaw[0] ||
    trendingRaw[0];

  const featuredShowcase: Featured | null = heroRaw
    ? {
        id: heroRaw.id,
        title: heroRaw.title || heroRaw.name || "Featured",
        media: heroRaw.media_type === "tv" ? "tv" : "movie",
        year: (heroRaw.release_date || heroRaw.first_air_date || "").slice(0, 4),
        backdrop: heroRaw.backdrop_path || heroRaw.poster_path || null,
        poster: heroRaw.poster_path || null,
      }
    : null;

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8">
      {featuredShowcase && (
        <HeroShowcase featured={featuredShowcase} genreId="27" />
      )}

      <QuickExplore />

      <Section title="Popular now">
        <Grid>
          {popular.map((m) => (
            <Card key={`p-${m.id}`} item={m} />
          ))}
        </Grid>
      </Section>

      <Section title="Trending">
        <Grid>
          {trending.map((m) => (
            <Card key={`t-${m.id}`} item={m} />
          ))}
        </Grid>
      </Section>
    </main>
  );
}

/* ---------------- UI ---------------- */

function QuickExplore() {
  const items = [
    { label: "Horror Night", emoji: "😱", href: "/search?genre=27&page=1" },
    { label: "Laugh Out Loud", emoji: "😂", href: "/search?genre=35&page=1" },
    { label: "Sci-Fi Worlds", emoji: "🚀", href: "/search?genre=878&page=1" },
    { label: "Drama Gems", emoji: "🎭", href: "/search?genre=18&page=1" },
  ];

  return (
    <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((it) => (
        <Link
          key={it.label}
          href={it.href}
          className="rounded-xl p-4 bg-white/5 ring-1 ring-white/10"
        >
          <span className="text-2xl">{it.emoji}</span>
          <div className="font-semibold">{it.label}</div>
        </Link>
      ))}
    </section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {children}
    </div>
  );
}

function Card({ item }: { item: Norm }) {
  return (
    <Link
      href={`/title/${item.media}/${item.id}`}
      className="block rounded-xl overflow-hidden bg-black/30"
    >
      <div className="relative aspect-[2/3]">
        <Image src={img(item.poster)} alt={item.title} fill />
      </div>
      <div className="p-2 text-sm font-semibold">{item.title}</div>
    </Link>
  );
}
