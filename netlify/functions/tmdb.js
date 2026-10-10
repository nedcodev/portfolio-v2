/* netlify/functions/tmdb.js
 *
 * Proxies The Movie Database (TMDB) API requests so the API key never
 * ships to the browser. The key lives in the TMDB_API_KEY environment
 * variable (Netlify dashboard > Site settings > Environment variables).
 *
 * Client usage (from favorites.js):
 *   /.netlify/functions/tmdb?kind=movie&q=Inception&year=2010
 *   /.netlify/functions/tmdb?kind=movie&id=27205
 *   /.netlify/functions/tmdb?kind=tv&q=Severance&year=2022
 *   /.netlify/functions/tmdb?kind=tv&id=136557
 *
 * Only whitelisted TMDB paths are reachable through this proxy; arbitrary
 * URLs cannot be fetched.
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';

exports.handler = async (event) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'TMDB_API_KEY is not configured' }),
    };
  }

  const params = event.queryStringParameters || {};
  const kind = params.kind === 'tv' ? 'tv' : 'movie';

  let tmdbPath;
  if (params.id && /^\d{1,10}$/.test(params.id)) {
    // Direct lookup by TMDB id, e.g. ?kind=movie&id=27205
    tmdbPath = `/${kind}/${params.id}`;
  } else if (params.q && params.q.trim().length > 0) {
    // Search, e.g. ?kind=movie&q=Inception&year=2010
    const q = encodeURIComponent(params.q.trim().slice(0, 200));
    const yearParam =
      params.year && /^\d{4}$/.test(params.year)
        ? kind === 'tv'
          ? `&first_air_date_year=${params.year}`
          : `&year=${params.year}`
        : '';
    tmdbPath = `/search/${kind}?query=${q}&include_adult=false${yearParam}`;
  } else {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Provide either id or q (with optional year)' }),
    };
  }

  const separator = tmdbPath.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE}${tmdbPath}${separator}api_key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        // Poster lookups change rarely; let browsers/CDN cache for a day.
        'Cache-Control': 'public, max-age=86400',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'TMDB request failed' }),
    };
  }
};
