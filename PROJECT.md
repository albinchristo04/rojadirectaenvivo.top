# PROJECT.md — rojadirectaenvivo.top
> Full specification for a coding agent. Read every section before writing a single line of code.

---

## 1. Project Overview

| Field | Value |
|---|---|
| Domain | `rojadirectaenvivo.top` |
| Primary Goal | Rank in **Bing** top 10 for Spanish-language football streaming keywords |
| Language | **Spanish only** (UI, content, meta tags, schema) |
| Framework | **Astro** (SSG mode — zero JS by default, pure HTML output) |
| UI Components | **Material Web** (Google's official open-source Material Design 3 web components — `@material/web`) |
| Styling | **Tailwind CSS v3** (utility layer on top of Material Web tokens) |
| Deployment | **Cloudflare Pages** (free tier, global CDN) |
| Source repo | GitHub |
| Data source | `https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/futbollibre.json` |
| Automation | **GitHub Actions** — scheduled every 3 hours, fetches JSON, rebuilds, redeploys |

> **Note on "Stitch 2.0":** Google's Stitch 2.0 is an internal Google design system and is not publicly available. The closest public equivalent from Google is **Material Web** (`@material/web`) — the official open-source implementation of Material Design 3 (Material You). It produces clean, semantic HTML that Bing/Google crawlers index perfectly. Use it.

---

## 2. Target Keywords (Priority Order)

These are the Bing search terms to rank for. Every page title, H1, meta description, and URL slug must incorporate these naturally.

| Priority | Keyword | Monthly Volume |
|---|---|---|
| 🔴 1 | `rojadirecta` | 728,918 |
| 🔴 2 | `tarjeta roja` | 320,144 |
| 🔴 3 | `pirlo tv` | 413,999 |
| 🔴 4 | `rojadirecta tv` | 250,140 |
| 🔴 5 | `roja directa` | 296,631 |
| 🟠 6 | `tarjeta roja tv` | 110,328 |
| 🟠 7 | `livetv` | 185,813 |
| 🟠 8 | `pirlotv` | 88,297 |
| 🟠 9 | `futbol` | 81,154 |
| 🟠 10 | `rojadirecta en vivo` | 74,753 |
| 🟡 11 | `tarjeta roja directa` | 32,854 |
| 🟡 12 | `pirlo tv rojadirecta` | 32,445 |
| 🟡 13 | `tarjeta roja en vivo` | ~19,779 |

---

## 3. Data Source — JSON Schema

**URL:** `https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/futbollibre.json`

The JSON is fetched every 3 hours by a GitHub Action and saved to `src/data/matches.json` before the Astro build runs.

### Relevant Fields (per event)

```json
{
  "metadata": {
    "last_updated": "2026-03-21T10:29:59.059347Z",
    "total_events": 76
  },
  "data": [
    {
      "id": 33229,
      "attributes": {
        "diary_description": "Liga 1: Deportivo Moquegua vs Cusco",
        "diary_hour": "11:00:00",           // ⚠️ LATIN AMERICAN TIME (see note below)
        "date_diary": "2026-03-21",
        "embeds": {
          "data": [
            {
              "id": 774,
              "attributes": {
                "embed_name": "Liga1MAX",
                "embed_iframe": "/embed/eventos.html?r=BASE64_ENCODED",
                "decoded_iframe_url": "https://tvtvhd.com/vivo/canal.php?stream=liga1max"  // USE THIS
              }
            }
            // ... more channel options (OP2, OP3, etc.)
          ]
        },
        "country": {
          "data": {
            "attributes": {
              "name": "Perú",
              "image": {
                "data": {
                  "attributes": {
                    "url": "/uploads/peru_ddc4e685cf_43831ed9b0.png"  // flag icon, relative to pltvhd.com
                  }
                }
              }
            }
          }
        }
      }
    }
  ]
}
```

### Key Data Rules

1. **Use `decoded_iframe_url`** — NOT `embed_iframe`. The decoded URL is the direct stream link to embed in an `<iframe>`.
2. **Flag images** are stored at `https://pltvhd.com` + the `url` field (e.g., `https://pltvhd.com/uploads/peru_ddc4e685cf_43831ed9b0.png`). Fetch and cache these locally during the build step.
3. **`diary_hour` timezone**: The hours in the JSON are in **Latin American mixed time** (primarily Argentina/Colombia UTC-5 / UTC-3). When displaying to a user, use the browser's `Intl.DateTimeFormat` API client-side to convert to their local timezone. The page must show: `"Hora en tu zona: HH:MM"` via a small `<script>` tag (not a framework — just vanilla JS).
4. **Parse `diary_description`**: The format is `"League Name: Team A vs Team B"` (sometimes with extra whitespace/newlines — always `.trim()` the value). Extract the league name before the `:` and the match title after it.
5. **Multiple embeds per match** = multiple channel options. The first embed is the primary. Others are fallback channels labeled OP2, OP3, etc.

---

## 4. Site Architecture

```
repo/
├── .github/
│   └── workflows/
│       ├── build-deploy.yml          # Main: runs every 3h + on push to main
│       └── seo-sitemap-ping.yml      # Pings Bing IndexNow after each deploy
├── src/
│   ├── data/
│   │   └── matches.json              # Written by GitHub Action before build
│   ├── layouts/
│   │   └── Base.astro                # HTML shell: <head>, nav, footer, schema.org
│   ├── pages/
│   │   ├── index.astro               # Homepage: all today's matches
│   │   ├── rojadirecta-en-vivo.astro # Keyword landing page (static SEO page)
│   │   ├── tarjeta-roja.astro        # Keyword landing page
│   │   ├── pirlo-tv.astro            # Keyword landing page
│   │   ├── partido/
│   │   │   └── [slug].astro          # Dynamic match pages (getStaticPaths)
│   │   └── sitemap.xml.ts            # Auto-generated sitemap
│   ├── components/
│   │   ├── MatchCard.astro           # Homepage match card
│   │   ├── MatchPlayer.astro         # Video player + channel tab switcher
│   │   ├── ChannelTabs.astro         # Tab UI for switching embeds
│   │   ├── CountryFlag.astro         # Flag image + country name
│   │   └── LocalTime.astro           # Client-side timezone display
│   └── styles/
│       └── global.css                # Material tokens + Tailwind directives
├── public/
│   ├── robots.txt
│   ├── flags/                        # Cached flag images (downloaded at build)
│   └── indexnow-key.txt              # Bing IndexNow verification file
├── scripts/
│   ├── fetch-matches.mjs             # Fetches JSON + downloads flags
│   └── ping-indexnow.mjs             # Pings Bing IndexNow API
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## 5. Page Specifications

### 5.1 Homepage (`/` → `index.astro`)

**Purpose:** Show all of today's matches. The most trafficked page. Must rank for `rojadirecta en vivo`, `fútbol en vivo gratis`, `tarjeta roja`.

**URL:** `https://rojadirectaenvivo.top/`

**`<title>`:** `Rojadirecta en Vivo 🔴 Fútbol en Vivo Gratis | Tarjeta Roja TV Pirlo TV`

**`<meta name="description">`:** `Ver fútbol en vivo gratis hoy. Rojadirecta en vivo, Tarjeta Roja, Pirlo TV - todos los partidos del día en rojadirectaenvivo.top`

**`<h1>`:** `Rojadirecta en Vivo – Fútbol en Vivo Gratis Hoy`

**Layout:**
- Sticky header with site logo + keyword-rich nav links
- Date heading: `"Partidos de Hoy – [día de semana] [fecha]"`
- Matches grouped by country/league (use `country.name` as group header with flag)
- Each match = a `<MatchCard>` component (see below)
- Matches sorted by `diary_hour` ascending
- Footer with keyword-rich paragraph (see SEO section §8)

**MatchCard component:**
- Shows: flag icon + country name, league name, team names (H2), kick-off time (in Latin American time + JS local time), channel names (badges), CTA button → links to match page
- Card uses Material Web `<md-card>` or `<md-elevated-card>` styling
- Clicking anywhere on the card goes to the match page

---

### 5.2 Match Page (`/partido/[slug]`)

**URL pattern:** `/partido/[event-id]-[slugified-diary-description]/`
- Example: `/partido/33229-liga-1-deportivo-moquegua-vs-cusco/`
- Slug = `event.id` + `-` + `diary_description` lowercased, spaces→hyphens, special chars removed

**`<title>`:** `[Team A vs Team B] en Vivo 🔴 [League] | Rojadirecta Tarjeta Roja`
- Example: `Deportivo Moquegua vs Cusco en Vivo 🔴 Liga 1 | Rojadirecta Tarjeta Roja`

**`<meta name="description">`:** `Ver [Team A vs Team B] en vivo gratis. [League] en directo por rojadirecta, tarjeta roja, pirlo tv. Partido en vivo hoy [date].`

**`<h1>`:** `[Team A] vs [Team B] en Vivo`
**`<h2>`:** `[League Name] – [Date] – [Time] hora Argentina`

**Layout:**
- Breadcrumb: `Inicio > [Country] > [Match]`
- **Main player area** (full-width on mobile, ~70% on desktop):
  - `<MatchPlayer>` component:
    - Primary `<iframe>` displaying `decoded_iframe_url` of the first embed
    - `<ChannelTabs>` below the player: one tab per embed (`embed_name` as label)
    - Clicking a tab swaps the `src` attribute of the iframe via vanilla JS (NO framework needed)
    - iframe must have: `allowfullscreen`, `frameborder="0"`, `scrolling="no"`, `width="100%"`, `height="500px"` (responsive via CSS aspect-ratio)
    - Fallback text if no embeds: `"Este partido no tiene transmisión disponible aún."`
- **Sidebar / below player** (desktop: right column; mobile: below):
  - Match info: country flag, league, teams, date, time (local timezone via JS)
  - List of available channels (same as tabs)
  - "Ver más partidos" section: 4 other match cards from the same day
- **SEO text block** (below the fold): 2–3 paragraphs mentioning the match, league, keyword phrases naturally (see §8)

---

### 5.3 Keyword Landing Pages (Static SEO Pages)

These are static pages with no dynamic content. Their purpose is to capture navigational keyword traffic.

#### `/rojadirecta-en-vivo` → `rojadirecta-en-vivo.astro`
- Title: `Rojadirecta en Vivo – Ver Fútbol Online Gratis | Tarjeta Roja TV`
- H1: `Rojadirecta en Vivo – Fútbol en Vivo Gratis`
- Content: 300–400 words explaining the site. Include matches of the day (same as homepage, reused component). Mentions: rojadirecta, tarjeta roja, pirlo tv, roja directa, fútbol en vivo.

#### `/tarjeta-roja` → `tarjeta-roja.astro`
- Title: `Tarjeta Roja TV – Fútbol en Vivo | Rojadirecta Pirlo TV`
- H1: `Tarjeta Roja – Ver Partidos en Vivo Gratis`

#### `/pirlo-tv` → `pirlo-tv.astro`
- Title: `Pirlo TV en Vivo – Fútbol Online Gratis | Rojadirecta Tarjeta Roja`
- H1: `Pirlo TV – Rojadirecta en Vivo Gratis`

Each of these pages must have 300+ words of original Spanish content mentioning the target keywords naturally, plus the match card list for today.

---

## 6. Component Specifications

### `Base.astro` Layout
```astro
---
// Props: title, description, canonicalUrl, matchSchema? (optional JSON-LD)
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta name="theme-color" content="#D32F2F" />
  <!-- Schema.org JSON-LD injected here if matchSchema prop provided -->
  <!-- Tailwind CSS -->
  <!-- Material Web via CDN or bundled -->
</head>
<body>
  <!-- Header -->
  <!-- <slot /> -->
  <!-- Footer -->
</body>
</html>
```

### Header
- Logo: text-based `rojadirectaenvivo` in red (#D32F2F) — keyword in the brand
- Nav links: `Inicio` | `Rojadirecta en Vivo` | `Tarjeta Roja` | `Pirlo TV`
- Mobile: hamburger menu using `<md-navigation-drawer>` or simple CSS toggle

### `MatchCard.astro`
```
Props:
  - id: number
  - slug: string
  - title: string          (diary_description, cleaned)
  - league: string
  - teams: string
  - hour: string           (diary_hour in original LatAm time)
  - country: string
  - flagUrl: string        (local /flags/[country].png)
  - channels: string[]     (list of embed_name values)
```

### `MatchPlayer.astro`
```
Props:
  - embeds: Array<{ name: string, url: string }>
  
Renders:
  - <iframe> with first embed URL as src
  - <ChannelTabs> with all embed names
  - Vanilla JS <script> to swap iframe src on tab click
```

### `LocalTime.astro`
- Renders a `<span id="local-time-{id}">` placeholder
- Inline `<script>` converts the passed `diary_hour` + `date_diary` from Argentina time (UTC-3) to user's local time using `Intl.DateTimeFormat`

---

## 7. GitHub Actions Workflows

### 7.1 Main Build & Deploy (`.github/workflows/build-deploy.yml`)

```yaml
name: Build and Deploy

on:
  schedule:
    - cron: '0 */3 * * *'    # Every 3 hours
  push:
    branches: [main]
  workflow_dispatch:           # Manual trigger

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Fetch match data + download flags
        run: node scripts/fetch-matches.mjs
        # This script:
        # 1. GETs https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/futbollibre.json
        # 2. Writes the JSON to src/data/matches.json
        # 3. Downloads all flag image URLs to public/flags/ (skip if already exists)
        # 4. Rewrites flag URLs in the JSON to local /flags/[filename] paths

      - name: Build Astro site
        run: npm run build
        env:
          SITE_URL: https://rojadirectaenvivo.top

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: rojadirectaenvivo
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Ping Bing IndexNow
        run: node scripts/ping-indexnow.mjs
        env:
          INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}
          # This script submits updated match page URLs to Bing IndexNow API
          # POST https://www.bing.com/indexnow
          # with the list of new/updated match page URLs
```

### 7.2 Required GitHub Secrets

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages:Edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `INDEXNOW_KEY` | Random string used for Bing IndexNow (also placed in `public/[key].txt`) |

---

## 8. SEO Implementation

### 8.1 URL Structure
```
/                                                    → Homepage
/partido/33229-liga-1-deportivo-moquegua-vs-cusco/   → Match page
/rojadirecta-en-vivo/                                → Keyword landing
/tarjeta-roja/                                       → Keyword landing
/pirlo-tv/                                           → Keyword landing
/sitemap.xml                                         → Auto-generated
```

### 8.2 Schema.org (JSON-LD)

On **every match page**, inject a `SportsEvent` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "[Team A] vs [Team B]",
  "description": "Ver [Team A] vs [Team B] en vivo gratis. [League] en directo.",
  "startDate": "[date_diary]T[diary_hour]-03:00",
  "sport": "Fútbol",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://rojadirectaenvivo.top/partido/[slug]/"
  },
  "organizer": {
    "@type": "Organization",
    "name": "[League Name]"
  }
}
```

On the **homepage**, inject a `WebSite` + `ItemList` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Rojadirecta en Vivo",
  "url": "https://rojadirectaenvivo.top",
  "description": "Ver fútbol en vivo gratis - Rojadirecta, Tarjeta Roja, Pirlo TV",
  "inLanguage": "es",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://rojadirectaenvivo.top/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 8.3 Sitemap (`/sitemap.xml`)

Generate using `@astrojs/sitemap`. Configure it to include:
- `/` with `changefreq: daily`, `priority: 1.0`
- `/rojadirecta-en-vivo/`, `/tarjeta-roja/`, `/pirlo-tv/` with `priority: 0.9`
- All `/partido/[slug]/` pages with `changefreq: daily`, `priority: 0.8`

### 8.4 `robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://rojadirectaenvivo.top/sitemap.xml
```

### 8.5 Bing IndexNow

After every deploy, `scripts/ping-indexnow.mjs` must:
1. Read `src/data/matches.json` and collect all match page URLs
2. POST to `https://www.bing.com/indexnow` with the key and URL list
3. Also submit homepage + keyword landing pages

### 8.6 SEO Text Blocks

Every page must have a `<section>` below the match list with keyword-rich Spanish text. Example for homepage:

```html
<section class="seo-text">
  <h2>Rojadirecta en Vivo – Ver Fútbol Gratis</h2>
  <p>
    Bienvenido a <strong>Rojadirecta en Vivo</strong>, tu destino para ver fútbol en vivo gratis hoy. 
    Aquí encontrarás todos los partidos del día transmitidos en directo, igual que en 
    <strong>Tarjeta Roja</strong>, <strong>Pirlo TV</strong> y <strong>RojaDirecta TV</strong>. 
    Disfruta de la <strong>roja directa</strong> sin cortes y en alta definición.
  </p>
  <p>
    Seguimos todos los campeonatos en vivo: LaLiga, Premier League, Serie A, Bundesliga, 
    Liga MX, Liga Profesional Argentina, Copa Libertadores y mucho más. 
    Ver <strong>futbol en vivo</strong> nunca fue tan fácil — sin registro, sin pago, gratis.
  </p>
</section>
```

Every match page should have a similar 2-paragraph block mentioning the specific teams, league, and general keywords.

### 8.7 `<meta>` Tags Checklist (per page)
- `<title>` — unique per page, includes primary keyword
- `<meta name="description">` — unique, 150–160 chars, includes keyword
- `<link rel="canonical">` — self-referencing absolute URL
- `<meta name="robots" content="index, follow">`
- `<meta property="og:title">`, `og:description>`, `og:url>`, `og:type>`
- `<html lang="es">`
- `<meta name="theme-color" content="#D32F2F">`

### 8.8 Performance (Core Web Vitals)
Bing uses page experience signals. Requirements:
- **No client-side JS frameworks** — Astro SSG produces pure HTML
- Images: use `width` and `height` attributes on all `<img>`, use `loading="lazy"` on match cards below the fold
- Flag images: download locally during build (do NOT hotlink from pltvhd.com)
- CSS: Tailwind purges unused styles automatically
- Iframe: load with `loading="lazy"` where appropriate
- Target: Lighthouse score 90+ on mobile

---

## 9. UI / Visual Design

### Color Palette (Spanish football aesthetic)
| Token | Value | Usage |
|---|---|---|
| `--md-sys-color-primary` | `#D32F2F` (red) | Primary buttons, active tabs, logo |
| `--md-sys-color-on-primary` | `#FFFFFF` | Text on primary |
| `--md-sys-color-surface` | `#121212` | Page background (dark mode) |
| `--md-sys-color-on-surface` | `#E0E0E0` | Body text |
| `--md-sys-color-surface-variant` | `#1E1E1E` | Card backgrounds |
| `--md-sys-color-secondary` | `#FF6F00` (amber) | Accent, live badges |

The site should use **dark mode by default** (dark background, red accent). This matches competitor sites the users expect.

### "LIVE" Badge
On match cards and pages where the current time falls within the match window (±2 hours of `diary_hour`): show a red `🔴 EN VIVO` pulsing badge. Compute this server-side at build time and also via a small inline script client-side.

### Match Card Layout
```
┌─────────────────────────────────────┐
│ 🇦🇷  Liga Profesional Argentina      │
│                                     │
│  Newell's Old Boys  vs  Gimnasia    │
│                                     │
│  ⏰ 15:45 ARG  |  Tu hora: --:--    │  ← JS fills this
│                                     │
│  [ESPN Premium]  [OP2]  [OP3]       │  ← channel name badges
│                      [▶ Ver Partido] │
└─────────────────────────────────────┘
```

### Match Player Layout
```
┌────────────────────────────────────────────────────┐
│                                                    │
│                    [ IFRAME ]                      │
│               decoded_iframe_url                   │
│                   full width                       │
│                                                    │
├────────────────────────────────────────────────────┤
│ Canales:  [Liga1MAX ✓]  [Liga1Max OP2]  [OP3]      │  ← tabs
└────────────────────────────────────────────────────┘
```

Channel tab switching: vanilla JS only.
```javascript
document.querySelectorAll('.channel-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('#match-iframe').src = tab.dataset.url;
    document.querySelectorAll('.channel-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
```

---

## 10. `scripts/fetch-matches.mjs`

This script runs during the GitHub Action, before `npm run build`.

```javascript
// Pseudocode — implement in full:
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const JSON_URL = 'https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/futbollibre.json';
const FLAGS_BASE = 'https://pltvhd.com';
const OUTPUT_JSON = './src/data/matches.json';
const FLAGS_DIR = './public/flags';

async function main() {
  // 1. Fetch JSON
  const res = await fetch(JSON_URL);
  const data = await res.json();

  // 2. Download flag images
  mkdirSync(FLAGS_DIR, { recursive: true });
  
  for (const event of data.data) {
    const imageData = event.attributes?.country?.data?.attributes?.image?.data?.attributes;
    if (imageData?.url) {
      const filename = imageData.url.split('/').pop();
      const localPath = join(FLAGS_DIR, filename);
      
      if (!existsSync(localPath)) {
        const imgRes = await fetch(FLAGS_BASE + imageData.url);
        const buffer = await imgRes.arrayBuffer();
        writeFileSync(localPath, Buffer.from(buffer));
      }
      
      // Rewrite URL to local path
      imageData.url = `/flags/${filename}`;
    }
  }

  // 3. Write processed JSON
  writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2));
  console.log(`✅ Fetched ${data.data.length} matches. Data written to ${OUTPUT_JSON}`);
}

main().catch(console.error);
```

---

## 11. `scripts/ping-indexnow.mjs`

```javascript
// After build, ping Bing IndexNow with all match URLs

const KEY = process.env.INDEXNOW_KEY;
const SITE = 'https://rojadirectaenvivo.top';
const matches = JSON.parse(fs.readFileSync('./src/data/matches.json', 'utf8'));

function toSlug(event) {
  return `${event.id}-${event.attributes.diary_description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')}`;
}

const urls = [
  `${SITE}/`,
  `${SITE}/rojadirecta-en-vivo/`,
  `${SITE}/tarjeta-roja/`,
  `${SITE}/pirlo-tv/`,
  ...matches.data.map(e => `${SITE}/partido/${toSlug(e)}/`)
];

await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'rojadirectaenvivo.top', key: KEY, urlList: urls })
});
```

---

## 12. Astro Config (`astro.config.mjs`)

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rojadirectaenvivo.top',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
  output: 'static',            // Full SSG — no server runtime needed
  build: {
    format: 'directory',       // Creates /partido/slug/index.html (better for crawlers)
  },
});
```

---

## 13. Package Dependencies

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/sitemap": "^3.x",
    "@material/web": "^2.x",
    "tailwindcss": "^3.x"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "fetch-data": "node scripts/fetch-matches.mjs"
  }
}
```

---

## 14. Cloudflare Pages Setup

1. Connect GitHub repo to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Environment variables: `SITE_URL=https://rojadirectaenvivo.top`
5. **Do NOT** enable Cloudflare Workers for this project — pure static is faster and cheaper
6. Enable Cloudflare's automatic Brotli compression and HTTP/2
7. Set custom domain: `rojadirectaenvivo.top` → point nameservers to Cloudflare

### `_headers` file (place in `public/`)
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400

/partido/*
  Cache-Control: public, max-age=10800, stale-while-revalidate=86400
```

### `_redirects` file (place in `public/`)
```
# Common misspellings redirect to homepage (SEO link equity)
/rojadirecta          /     302
/roja-directa         /     302
/tarjeta-roja         /tarjeta-roja/     301
/pirlo-tv             /pirlo-tv/         301
```

---

## 15. Step-by-Step Implementation Order (for the coding agent)

Follow this exact order:

1. **Init project**: `npm create astro@latest . -- --template minimal --no-install`
2. **Install deps**: `npm install`
3. **Configure Astro**: Write `astro.config.mjs` per §12
4. **Configure Tailwind**: Write `tailwind.config.mjs` with Material token colors
5. **Write `scripts/fetch-matches.mjs`**: Per §10. Run it once locally to generate `src/data/matches.json`
6. **Write `Base.astro`**: Per §6 — full HTML shell with all meta tags
7. **Write `MatchCard.astro`**: Card component
8. **Write `MatchPlayer.astro` + `ChannelTabs.astro`**: Iframe + tab switcher
9. **Write `LocalTime.astro`**: Vanilla JS timezone conversion
10. **Write `index.astro`**: Homepage, import matches.json, render MatchCard grid grouped by country
11. **Write `[slug].astro`**: Dynamic match pages with `getStaticPaths()`, MatchPlayer, SEO text
12. **Write keyword landing pages**: `rojadirecta-en-vivo.astro`, `tarjeta-roja.astro`, `pirlo-tv.astro`
13. **Write `public/robots.txt`** and `public/_headers` and `public/_redirects`
14. **Write GitHub Actions workflows**: Per §7
15. **Write `scripts/ping-indexnow.mjs`**: Per §11
16. **Test build locally**: `npm run fetch-data && npm run build && npm run preview`
17. **Push to GitHub**: Cloudflare Pages deploys automatically
18. **Set GitHub secrets**: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `INDEXNOW_KEY`
19. **Verify Bing Webmaster Tools**: Add site, verify via `indexnow-key.txt`, submit sitemap

---

## 16. Critical Rules for the Coding Agent

- **Never use React, Vue, or Svelte** — Astro components only. Zero JS frameworks = maximum Lighthouse score.
- **Never hotlink flag images from pltvhd.com** — download them locally at build time.
- **Always use `decoded_iframe_url`** from the JSON, never `embed_iframe`.
- **All `<iframe>` tags must have** `title` attribute (accessibility + SEO): `title="Ver [match name] en vivo"`
- **Every page must have a unique `<title>` and `<meta name="description">`** — no duplicates.
- **Slugify function must be deterministic** — same input always produces same output.
- **Timezone handling**: `diary_hour` is approximate Latin American time. Display it as-is (labelled "hora Argentina") and convert to user local time via browser JS. Never hardcode a specific timezone offset in server-side code since the JSON covers multi-country events.
- **Do not use `<form>` tags** for any interactive UI — use `<button>` with event listeners.
- **Parse `diary_description` defensively**: some entries have leading/trailing whitespace and `\n` newlines inside the string. Always `.trim().replace(/\s+/g, ' ')`.
- **Handle missing embeds gracefully**: some events may have `embeds.data = []`. Show a message instead of crashing.
- **Flag image URL construction**: `https://pltvhd.com` + `attributes.image.data.attributes.url` (the url field starts with `/uploads/...`).
