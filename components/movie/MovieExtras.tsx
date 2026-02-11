import Image from "next/image";
import Link from "next/link";

type Cast = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};

type Similar = {
  id: number;
  title?: string;
  poster_path?: string | null;
};

const img = (p?: string | null, size = "w342") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

export default function MovieExtras({
  cast,
  similar,
}: {
  cast: Cast[];
  similar: Similar[];
}) {
  return (
    <div className="space-y-10">
      {/* CAST */}
      {cast.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((c) => (
              <div key={c.id} className="w-[120px] shrink-0 text-center">
                <div className="relative aspect-[2/3] bg-white/5 rounded-xl overflow-hidden">
                  {c.profile_path && (
                    <Image
                      src={img(c.profile_path)!}
                      alt={c.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium">{c.name}</p>
                {c.character && (
                  <p className="text-xs text-white/60">{c.character}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIMILAR */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">More like this</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {similar.map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                className="w-[140px] shrink-0"
              >
                <div className="relative aspect-[2/3] bg-white/5 rounded-xl overflow-hidden">
                  {m.poster_path && (
                    <Image
                      src={img(m.poster_path)!}
                      alt={m.title ?? "Movie"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm">{m.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
