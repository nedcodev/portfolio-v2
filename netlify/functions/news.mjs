// Collects the latest gaming and tech headlines for the home page.
// Served at /api/news; Netlify's CDN caches the result for 30 minutes.

const FEEDS = {
  gaming: [
    { name: 'IGN', url: 'https://feeds.feedburner.com/ign/games-all' },
    { name: 'GameSpot', url: 'https://www.gamespot.com/feeds/news/' },
    { name: 'Polygon', url: 'https://www.polygon.com/rss/index.xml' },
    { name: 'Kotaku', url: 'https://kotaku.com/rss' },
    { name: 'PlayStation', url: 'https://blog.playstation.com/feed/' },
    { name: 'Xbox', url: 'https://news.xbox.com/en-us/feed/' },
  ],
  tech: [
    { name: 'Apple', url: 'https://www.apple.com/newsroom/rss-feed.rss' },
    { name: 'NVIDIA', url: 'https://blogs.nvidia.com/feed/' },
    { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
    { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  ],
};

const PER_FEED = 6;
const PER_TOPIC = 16;
const MAX_PER_SOURCE = 3; // keeps one busy site from filling the whole ticker

const decode = (text = '') =>
  text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
};

// Handles both RSS (<item>) and Atom (<entry>) feeds
export function parseFeed(xml, source) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.slice(0, PER_FEED).map((block) => {
    let link = decode(tag(block, 'link'));
    if (!link) {
      const alt = block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) || block.match(/<link[^>]*href=["']([^"']+)["']/i);
      link = alt ? alt[1].replace(/&amp;/g, '&') : '';
    }
    const date = new Date(decode(tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated') || tag(block, 'dc:date')));
    return {
      title: decode(tag(block, 'title')),
      link,
      source,
      date: isNaN(date) ? null : date.toISOString(),
    };
  }).filter((item) => item.title && /^https?:\/\//.test(item.link));
}

async function readFeed({ name, url }) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'nedcode.com news widget', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  return parseFeed(await res.text(), name);
}

async function topic(feeds, status) {
  const results = await Promise.allSettled(feeds.map(readFeed));
  results.forEach((r, i) => { status[feeds[i].name] = r.status === 'fulfilled' ? r.value.length : 'failed'; });
  const seen = new Set();
  const perSource = {};
  return results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .filter((item) => !seen.has(item.link) && seen.add(item.link))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .filter((item) => (perSource[item.source] = (perSource[item.source] || 0) + 1) <= MAX_PER_SOURCE)
    .slice(0, PER_TOPIC);
}

export default async () => {
  // sources: how many headlines each feed gave, or "failed"; handy for checking /api/news
  const sources = {};
  const [gaming, tech] = await Promise.all([topic(FEEDS.gaming, sources), topic(FEEDS.tech, sources)]);
  return new Response(JSON.stringify({ updated: new Date().toISOString(), sources, gaming, tech }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
};

export const config = { path: '/api/news' };
