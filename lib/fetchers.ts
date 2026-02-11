// lib/fetchers.ts — FAST + ROBUST TMDB client (FINAL)

const BASE = "https://api.themoviedb.org/3";

/* ----------------------------------------
   AUTH
----------------------------------------- */

const TMDB_BEARER =
  process.env.TMDB_BEARER ||
  process.env.TMDB_TOKEN ||
  process.env.NEXT_PUBLIC_TMDB_TOKEN;

const TMDB_V3 = process.env.TMDB_API_KEY;

if (!TMDB_BEARER && !TMDB_V3) {
  throw new Error("TMDB credentials missing");
}

/* ----------------------------------------
   SPEED TUNING
----------------------------------------- */

// Home page: fail fast
const FAST_TIMEOUT = 4000;

// Detail pages: more patient
const SLOW_TIMEOUT = Number(process.env.TMDB_TIMEOUT_MS || 15000);

/* ----------------------------------------
   HELPERS
----------------------------------------- */

function buildURL(path: string, params?: Record<string, unknown>) {
  const url = new URL(`${BASE}${path}`);

  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });

  if (!TMDB_BEARER && TMDB_V3 && !url.searchParams.has("api_key")) {
    url.searchParams.set("api_key", TMDB_V3);
  }

  return url.toString();
}

function headers(): HeadersInit {
  return TMDB_BEARER
    ? { Authorization: `Bearer ${TMDB_BEARER}`, Accept: "application/json" }
    : { Accept: "application/json" };
}

async function fetchAbortable(
  url: string,
  init: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

/* ----------------------------------------
   FAST FETCHER (HOME PAGE)
   - no retries
   - short timeout
   - silent failure
----------------------------------------- */

async function tmdbFast(
  path: string,
  params?: Record<string, unknown>,
  revalidate = 300
) {
  try {
    const res = await fetchAbortable(
      buildURL(path, params),
      { headers: headers(), next: { revalidate } },
      FAST_TIMEOUT
    );

    if (!res.ok) {
  console.warn(`TMDB ${res.status} — ${path}`);
  return null;
}
return res.json();

  } catch {
    return { results: [] };
  }
}

/* ----------------------------------------
   ROBUST FETCHER (DETAIL PAGES)
----------------------------------------- */

async function tmdbSafe(
  path: string,
  params?: Record<string, unknown>,
  revalidate = 300
) {
  const res = await fetchAbortable(
    buildURL(path, params),
    { headers: headers(), next: { revalidate } },
    SLOW_TIMEOUT
  );

  if (!res.ok) {
    throw new Error(`TMDB ${res.status} — ${path}`);
  }

  return res.json();
}

/* ----------------------------------------
   HOME / LISTINGS (FAST)
----------------------------------------- */

// ⚡ FAST — MOVIES ONLY (Hero loads quicker)
export async function getTrendingAll(page = 1) {
  return tmdbFast("/trending/movie/day", { page }, 600);
}

export async function getPopularMovies(page = 1) {
  return tmdbFast("/movie/popular", { page }, 600);
}

export async function getMovieGenres() {
  const data = await tmdbFast("/genre/movie/list", {}, 86400);
  return Array.isArray((data as any)?.genres) ? data.genres : [];
}

export async function searchTitles(q: string, page = 1) {
  return tmdbFast(
    "/search/multi",
    { query: q, include_adult: false, page },
    120
  );
}

/* ----------------------------------------
   DISCOVER
----------------------------------------- */

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
  return tmdbFast(
    "/discover/movie",
    {
      include_adult: false,
      include_video: false,
      sort_by: "popularity.desc",
      page,
      with_genres: genreId ? String(genreId) : undefined,
      primary_release_year: year ? String(year) : undefined,
    },
    600
  );
}

/* ----------------------------------------
   DETAIL PAGES (ROBUST)
----------------------------------------- */

export async function fetchTmdbTitle(
  tmdbId: number | string,
  type: "movie" | "tv",
  opts?: { language?: string }
) {
  return tmdbSafe(
    `/${type}/${tmdbId}`,
    {
      language: opts?.language || "en-US",
      append_to_response:
        "videos,images,credits,external_ids,release_dates,content_ratings,recommendations,similar",
      include_image_language: "en,null",
    },
    300
  );
}

export async function fetchTmdbProviders(
  tmdbId: number | string,
  type: "movie" | "tv"
) {
  return tmdbSafe(`/${type}/${tmdbId}/watch/providers`, undefined, 600);
}

export async function getMovieDetails(id: number) {
  return tmdbSafe(`/movie/${id}`, undefined, 300);
}

export async function getMovieVideos(id: number) {
  return tmdbSafe(`/movie/${id}/videos`, undefined, 300);
}

export async function getMovieCredits(id: number) {
  return tmdbSafe(`/movie/${id}/credits`, undefined, 300);
}

export async function getSimilarMovies(id: number, page = 1) {
  return tmdbSafe(`/movie/${id}/similar`, { page }, 300);
}

// ✅ RECOMMENDED MOVIES
export async function getRecommendedMovies(id: number, page = 1) {
  return tmdbSafe(`/movie/${id}/recommendations`, { page }, 300);
}

/* ----------------------------------------
   WATCHMODE (NON-BLOCKING)
----------------------------------------- */

export async function searchWatchmodeByTmdb(tmdbId: number) {
  const apiKey = process.env.WATCHMODE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=tmdb_id&search_value=${tmdbId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
