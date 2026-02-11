import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import UserRating from "@/components/UserRating";
import Comments from "@/components/Comments";
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getRecommendedMovies,
} from "@/lib/fetchers";

export const revalidate = 300;

/* Next.js 15: params are async */
type PageProps = {
  params: Promise<{ id: string }>;
};

const img = (p?: string | null, size = "w780") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);

  
  if (!Number.isFinite(movieId)) return notFound();

 /* =========================
   BLOCK UNTIL EVERYTHING LOADS
========================= */

let details: any;
let credits: any;
let similarRes: any;
let recommendedRes: any;

try {
  [
    details,
    credits,
    similarRes,
    recommendedRes,
  ] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getSimilarMovies(movieId),
    getRecommendedMovies(movieId),
  ]);
} catch (err) {
  console.error("TMDB failed:", err);
  return (
    <main className="p-10 text-center text-white/70">
      Unable to load movie data.
    </main>
  );
}


  const cast = credits?.cast?.slice(0, 12) ?? [];
  const similar = similarRes?.results?.slice(0, 12) ?? [];
  const recommended = recommendedRes?.results?.slice(0, 12) ?? [];

  const backdrop =
    img(details.backdrop_path, "w1280") ||
    img(details.poster_path, "w780");

  const year = details.release_date?.slice(0, 4);
  const rating =
    typeof details.vote_average === "number"
      ? Math.round(details.vote_average * 10) / 10
      : undefined;

  return (
    <main className="pb-12">
      {/* ================= HERO ================= */}
      <section className="relative w-[100svw] left-1/2 -translate-x-1/2">
        <div className="relative h-[55vh] md:h-[65vh]">
          {backdrop && (
           <Image
            src={backdrop}
            alt={details.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />

          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 mx-auto max-w-[1200px] px-4 h-full flex items-end md:items-center">
            <div className="pb-6 max-w-2xl">
              <div className="flex gap-2 text-sm mb-2">
                <span className="bg-white/10 px-3 py-1 rounded-full">MOVIE</span>
                {year && (
                  <span className="bg-white/10 px-3 py-1 rounded-full">
                    {year}
                  </span>
                )}
                {rating && (
                  <span className="bg-yellow-400 px-2 py-1 rounded text-black font-semibold">
                    ★ {rating}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold">
                {details.title}
              </h1>

              {details.overview && (
                <p className="mt-3 text-white/85">
                  {details.overview}
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${details.title} trailer`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 font-semibold text-black"
                >
                  ▶ Trailer
                </a>
              </div>

              <div className="mt-4">
                <UserRating movieId={movieId} tmdb={rating} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <section className="mx-auto max-w-[1200px] px-4 mt-10 space-y-12">

        {/* CAST */}
        {cast.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((c: any) => (
                <div key={c.id}>
                  <div className="relative aspect-[2/3] bg-black/20 rounded-xl overflow-hidden">
                    {c.profile_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w154${c.profile_path}`}
                        alt={c.name}
                        fill
                        loading="lazy"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {c.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIMILAR */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3">More like this</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {similar.map((m: any) => (
                <Link
                  key={m.id}
                  href={`/movie/${m.id}`}
                  className="w-[220px] md:w-[260px] shrink-0 snap-start"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    alt={m.title}
                    width={260}
                    height={390}
                    loading="lazy"
                    unoptimized
                  />

                </Link>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED */}
        {recommended.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3">
              Recommended for you
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {recommended.map((m: any) => (
                <Link
                  key={m.id}
                  href={`/movie/${m.id}`}
                  className="w-[220px] md:w-[260px] shrink-0 snap-start"
                >
                 <Image
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    alt={m.title}
                    width={260}
                    height={390}
                    loading="lazy"
                    unoptimized
                  />

                </Link>
              ))}
            </div>
          </div>
        )}

        <Comments movieId={movieId} title={details.title} />
      </section>
    </main>
  );
}
