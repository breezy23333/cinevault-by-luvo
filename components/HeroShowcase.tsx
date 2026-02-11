import Image from "next/image";
import Link from "next/link";

type Featured = {
  id: number;
  title: string;
  media: "movie" | "tv";
  year: string;
  backdrop: string | null;
  poster: string | null;
};

type HeroShowcaseProps = {
  featured: Featured;
  genreId: string;
};

function img(path?: string | null, size: "w1280" | "w500" = "w1280") {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "/img/placeholder.jpg";
}

export default function HeroShowcase({
  featured,
  genreId,
}: HeroShowcaseProps) {
  const href = `/title/${featured.media}/${featured.id}`;

  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl bg-black/40 ring-1 ring-white/10">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={img(featured.backdrop)}
          alt={featured.title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-2xl">
        <p className="text-sm text-white/70 mb-2">
          {featured.media.toUpperCase()} • {featured.year}
        </p>

        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {featured.title}
        </h1>

        <div className="flex gap-3">
          <Link
            href={href}
            className="px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
          >
            View Details
          </Link>

          <Link
            href={`/search?genre=${genreId}&page=1`}
            className="px-5 py-2 rounded-lg bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition"
          >
            Explore Genre
          </Link>
        </div>
      </div>
    </section>
  );
}
