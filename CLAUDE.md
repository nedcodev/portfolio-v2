# nedcode.com: notes for Claude

Ned's personal site: plain HTML/CSS/JS, deployed by Netlify from `main`.
Shared styles live in `css/style.css`, shared behaviour in `scripts.js`.

## Working with Ned

- Show a sample first (screenshot at phone size), then apply on a branch,
  test in a browser, push the branch, and **ask before merging into `main`**.
- Ned reads on his phone: keep updates short and send screenshots.
- Never change the logo, the home hero ("Hi, I'm Ned 👋 / Frontend Dev /
  Based out of Montreal") or the Lab's own buttons unless asked.
- This environment usually can't reach rockstargames.com or reddit.com. If you
  need something from there, ask Ned to send it or to allow the domain.

## Blog posts

These rules apply to **every** blog post, whatever the topic (gaming, tech,
travel, product reviews…), new or old. When the post format or these rules
improve, update all existing posts in `blog/` to match, so the blog always
looks and reads consistently.

**Voice: journalist + content creator.** Report like a journalist, hook like a
creator.

- Lead with the news. Attribute every fact ("Twitch CEO Dan Clancy told
  Bloomberg…"). Mark anything unconfirmed as unconfirmed.
- Research the latest before writing; cross-check facts with at least two
  major outlets (GameSpot, Kotaku, VGC, Engadget, PC Gamer, GamesRadar…).
  Quotes must match the reported wording exactly. Search Reddit/fan coverage
  for reaction, and report it as reaction, not fact.
- No spoilers, and never link leaked footage.
- **Short and sweet:** 300–500 words of article (not counting FAQ, captions
  and sources), 2–3 min read, punchy H2 sections.
  One topic per post (price, release date, online, PC… each gets its own).
- End with a **"My take"** box in Ned's voice: casual, short, human. Avoid AI
  tells: no em dashes, no "game-changer", no tidy three-item lists, no
  "Here's the thing". Only use facts about Ned that are true (he *watches*
  GTA RP on Twitch; he doesn't claim to play it; his phone is an iPhone Air). Ask Ned if unsure.
- Then a short FAQ (3–4 questions) and a Sources list.

**Visuals: always find a way.** Every post gets:

- An original cover from `tools/blog-cover.html` (og + thumb sizes).
  Posts on the same topic (e.g. several GTA 6 posts) stay on the dark/yellow
  template but each gets its own simple icon on the right (`.art` slot) and,
  for leaks, the red glow (`body.leak`): wifi crossed out for "no online",
  cracked video with a red drip for leaks. No characters or photos.
- Visuals between sections so there's never a wall of text. Use official images
  when Ned provides them (credit "Image: Rockstar Games"; keep GTA posts free
  of ads/affiliate links per Rockstar's non-commercial policy). Otherwise build
  them: charts (`.ps-chart`), quote cards (`.ps-quote`), speaker cards
  (`.ps-speaker`), timelines, comparison tables (`.ps-table`).
- Never fake photos of real people or use company logos.
- Review posts use Ned's own product photos, with short captions.

**SEO: aim for the top of Google.** For every post:

- `<title>` ≤ 60 characters, phrased the way people search
  ("Does GTA 6 Have Online at Launch? …"), plus ` | NEDCODE`.
- Meta description ≤ 155 characters, canonical URL, Open Graph + Twitter
  card tags (og image 1200×630), `robots` index/follow.
- JSON-LD `BlogPosting` + `FAQPage` matching the on-page FAQ.
- Exactly one `<h1>`; keywords in the H1 and H2s; descriptive alt text.
- Images as compressed JPEGs in `img/blog/`, `loading="lazy"` below the fold.
- File name: `blog/Title-Words-Like-This.html`.
- Add the URL to `sitemap.xml`; make it the featured post on `blog.html`
  (move the previous one into "More posts"); point the home page's Explore
  "Blog" card at it; link related posts to each other (every post ends
  with a `.ps-related` "Keep reading" box of 2 posts; update the others' boxes
  so the new post gets linked too).
- After publishing, remind Ned to share on Threads and request indexing in
  Google Search Console.

**Amazon affiliate posts:** show "As an Amazon Associate I earn from qualifying
purchases." under the byline (before any link) and use
`rel="sponsored noopener"` on `amzn.to` links.

**Post layout:** copy the structure of an existing post in `blog/`
(`.ps` article classes: `ps-head`, `ps-lead`, `ps-tldr`, `ps-faq`,
`ps-sources`…). Kicker: red `ps-kicker` for breaking news/leaks, yellow
`ps-kicker ps-kicker-review` for explainers and reviews.
