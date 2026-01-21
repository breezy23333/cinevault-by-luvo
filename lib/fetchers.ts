// lib/fetchers.ts — unified + robust TMDB client (CLEAN)

const BASE = "https://api.themoviedb.org/3";

// Prefer v4 bearer; fall back to v3 key
const TMDB_BEARER =
  process.env.TMDB_BEARER ||
  process.env.TMDB_TOKEN ||
  process.env.NEXT_PUBLIC_TMDB_TOKEN;

const TMDB_V3 = process.env.TMDB_API_KEY;

// Tunables
const DEFAULT_TIMEOUT = Number(process.env.TMDB_TIMEOUT_MS || 20000);
const MAX_RETRIES = Number(process.env.TMDB_RETRIES || 1);

/* ----------------------------------------
   Helpers
----------------------------------------- */

function toURL(path: string, params?: Record<string, any>) {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  if (!TMDB_BEARER && TMDB_V3 && !url.searchParams.has("api_key")) {
    url.searchParams.set("api_key", TMDB_V3);
  }
  return url.toString();
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function isNonCritical(path: string) {
  return /\/(videos|images|credits|similar|recommendations|watch\/providers)\b/.test(
    path
  );
}

/* ----------------------------------------
   Core TMDB fetcher (SINGLE definition)
----------------------------------------- */

async function tmdb(
  path: string,
  params?: Record<string, any>,
  {
    revalidate = 300,
    timeoutMs = DEFAULT_TIMEOUT,
  }: { revalidate?: number; timeoutMs?: number } = {}
) {
  if (!TMDB_BEARER && !TMDB_V3) {
    throw new Error("TMDB credentials missing");
  }

  const headers = TMDB_BEARER
    ? { Authorization: `Bearer ${TMDB_BEARER}`, Accept: "application/json" }
    : { Accept: "application/json" };

  const url = toURL(path, params);
  let lastErr: any;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        { headers, next: { revalidate } },
        timeoutMs
      );

      if (!res.ok) {
        if (
          (res.status === 404 || res.status === 408) &&
          isNonCritical(path)
        ) {
          return { results: [] };
        }
        throw new Error(`TMDB ${res.status} — ${path}`);
      }

      return await res.json();
    } catch (err: any) {
      lastErr = err;

      const isNetwork =
        err?.name === "AbortError" ||
        /timeout|fetch failed|ECONN|ENOTFOUND|UND_ERR/i.test(
          String(err?.message)
        );

      if (isNetwork && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        continue;
      }

      if (isNetwork && isNonCritical(path)) {
        return { results: [] };
      }

      throw err;
    }
  }

  throw lastErr;
}

/* ----------------------------------------
   PUBLIC EXPORTS
----------------------------------------- */

// Home / listings
export async function getTrendingAll(page = 1) {
  return tmdb("/trending/all/day", { page }, { revalidate: 120 });
}

export async function getPopularMovies(page = 1) {
  return tmdb("/movie/popular", { page }, { revalidate: 120 });
}

export async function searchTitles(q: string, page = 1) {
  return tmdb(
    "/search/multi",
    { query: q, include_adult: false, page },
    { revalidate: 60 }
  );
}

// Discover + genres
export type DiscoverParams = {
  year?: number;
  genreId?: number;
  page?: number;
};

export async function discoverMovies({
  year,
  genreId,
  page = 1,
}: DiscoverParams = {}) {
  return tmdb(
    "/discover/movie",
    {
      include_adult: false,
      include_video: false,
      sort_by: "popularity.desc",
      page,
      with_genres: genreId ? String(genreId) : undefined,
      primary_release_year: year ? String(year) : undefined,
    },
    { revalidate: 120 }
  );
}

export async function getMovieGenres() {
  const data = await tmdb(
    "/genre/movie/list",
    { language: "en-US" },
    { revalidate: 360 }
  );
  return Array.isArray(data?.genres) ? data.genres : [];
}

// Movie / TV details
export async function fetchTmdbTitle(
  tmdbId: number | string,
  type: "movie" | "tv",
  opts?: { language?: string }
) {
  return tmdb(
    `/${type}/${tmdbId}`,
    {
      language: opts?.language || "en-US",
      append_to_response:
        "videos,images,credits,external_ids,release_dates,content_ratings,recommendations,similar",
      include_image_language: "en,null",
    },
    { revalidate: 300 }
  );
}

export async function fetchTmdbProviders(
  tmdbId: number | string,
  type: "movie" | "tv"
) {
  return tmdb(`/${type}/${tmdbId}/watch/providers`, undefined, {
    revalidate: 600,
  });
}

// Movie-specific helpers
export async function getMovieDetails(id: number) {
  return tmdb(`/movie/${id}`, undefined, { revalidate: 300 });
}

export async function getMovieVideos(id: number) {
  return tmdb(`/movie/${id}/videos`, undefined, { revalidate: 300 });
}

export async function getMovieCredits(id: number) {
  return tmdb(`/movie/${id}/credits`, undefined, { revalidate: 300 });
}

export async function getSimilarMovies(id: number, page = 1) {
  return tmdb(`/movie/${id}/similar`, { page }, { revalidate: 300 });
}

// Watchmode bridge
export async function searchWatchmodeByTmdb(tmdbId: number) {
  const apiKey = process.env.WATCHMODE_API_KEY;
  if (!apiKey) return null;

  const url =
    `https://api.watchmode.com/v1/search/` +
    `?apiKey=${apiKey}` +
    `&search_field=tmdb_id` +
    `&search_value=${tmdbId}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  return res.json();
}
