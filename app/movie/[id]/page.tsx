// app/movie/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
} from "@/lib/fetchers";

export const revalidate = 300;

type PageProps = {
  params: { id: string };
};

const img = (p?: string | null, size: string = "w780") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

export default async function MoviePage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return notFound();

  const [detailsRes, videosRes, creditsRes, similarRes] =
    await Promise.allSettled([
      getMovieDetails(id),
      getMovieVideos(id),
      getMovieCredits(id),
      getSimilarMovies(id),
    ]);

  if (detailsRes.status !== "fulfilled") return notFound();

  const details: any = detailsRes.value;
  const videos: any[] =
    videosRes.status === "fulfilled" ? videosRes.value?.results ?? [] : [];
  const cast: any[] =
    creditsRes.status === "fulfilled" ? creditsRes.value?.cast?.slice(0, 12) ?? [] : [];
  const similar: any[] =
    similarRes.status === "fulfilled" ? similarRes.value?.results?.slice(0, 12) ?? [] : [];

  const backdrop =
    img(details.backdrop_path, "w1280") ||
    img(details.poster_path, "w780");

  const poster = img(details.poster_path, "w500");

  const year = details.release_date?.slice(0, 4);

  const rating =
    typeof details.vote_average === "number"
      ? Math.round(details.vote_average * 10) / 10
      : null;

  const ytKey =
    videos.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key ??
    videos.find((v) => v.site === "YouTube")?.key;

  return (
    <main className="pb-12">

      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[60vh]">
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

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="relative z-10 max-w-[1200px] mx-auto px-4 h-full flex items-end pb-10">
            <div>
              <div className="flex gap-3 mb-3">
                {year && (
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    {year}
                  </span>
                )}
                {rating && (
                  <span className="bg-yellow-400 px-3 py-1 rounded text-black font-semibold text-sm">
                    ★ {rating}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">
                {details.title}
              </h1>

              {details.overview && (
                <p className="mt-4 max-w-2xl text-white/85">
                  {details.overview}
                </p>
              )}

              {ytKey && (
                <a
                  href={`https://www.youtube.com/watch?v=${ytKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 rounded-full font-semibold text-black"
                >
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CAST */}
      {cast.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 mt-12">
          <h2 className="text-xl font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.map((c) => (
              <div key={c.id}>
                <div className="relative aspect-[2/3] bg-black/20 rounded-xl overflow-hidden">
                  {c.profile_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                      alt={c.name}
                      fill
                      loading="lazy"
                      unoptimized
                    />
                  )}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 mt-12">
          <h2 className="text-xl font-bold mb-4">More like this</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {similar.map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                className="w-[200px] shrink-0"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                  alt={m.title}
                  width={200}
                  height={300}
                  loading="lazy"
                  unoptimized
                />
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
