# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

SEO-optimized Spanish-language football streaming directory targeting Bing top-10 rankings for keywords like `rojadirecta`, `tarjeta roja`, `pirlo tv`. All UI text, meta tags, schema, and content must be in **Spanish only**.

## Commands

```bash
npm run dev          # Start Astro dev server
npm run build        # Build static site to ./dist/
npm run preview      # Preview production build locally
npm run fetch-data   # Fetch latest match data from remote JSON
```

No test or lint commands exist.

## Data Pipeline

Match data flows: remote JSON → `scripts/fetch-matches.mjs` → `src/data/matches.json` → Astro build.

**Data source:** `https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/futbollibre.json`

Key data rules:
- Always use `decoded_iframe_url` (not `embed_iframe`) for iframe `src`
- `diary_hour` is in Latin American time (Argentina/Colombia); convert to local timezone client-side using `Intl.DateTimeFormat` — show `"Hora en tu zona: HH:MM"` via vanilla JS `<script>` tag
- Parse `diary_description` as `"League: Team A vs Team B"` (always `.trim()`)
- First embed is primary; others are fallback channels (OP2, OP3, etc.)
- Flag images are at `https://pltvhd.com` + the relative `url` field

GitHub Actions rebuilds and redeploys every 3 hours (`.github/workflows/build-deploy.yml`). After deploy, `seo-sitemap-ping.yml` pings Bing IndexNow.

## Architecture

**Framework:** Astro 5 in SSG (static) mode — zero JS by default, pure HTML output.

**Routing:**
- `src/pages/partido/[slug].astro` — dynamic match pages; slug = `{id}-{slugified-diary_description}`
- `src/pages/equipo/[slug].astro`, `src/pages/liga/[slug].astro` — team and league pages
- `src/pages/embed/[id].astro` — embed-only pages
- Multiple static keyword landing pages at the root (`tarjeta-roja.astro`, `pirlo-tv.astro`, etc.) — these exist purely for SEO, each targeting specific keyword clusters

**Key files:**
- `src/layouts/Base.astro` — master HTML shell (head, nav, footer, schema.org, Clarity analytics). Props: `title`, `description`, `canonicalUrl`, `matchSchema?`, `ogImage?`
- `src/utils/matches.ts` — data transformation helpers
- `src/utils/seo.ts` — SEO utility functions
- `src/components/MatchPlayer.astro` — iframe player + channel tab switcher (tab switching via vanilla JS, no framework)
- `tailwind.config.mjs` — custom theme: red `#E8001D`, fonts Bebas Neue / Barlow Condensed / Barlow, Tailwind preflight disabled

**Match page layout (`/partido/[slug]`):**
- Breadcrumb → player iframe (with channel tabs) → sidebar with match info + related matches → SEO text block
- iframe attributes: `allowfullscreen`, `frameborder="0"`, `scrolling="no"`, responsive via CSS `aspect-ratio`

## SEO Requirements

Every page needs:
- `<title>` and `<meta name="description">` incorporating target keywords naturally in Spanish
- `<link rel="canonical">`
- Schema.org JSON-LD structured data
- 300+ words of original Spanish content on landing pages

Target keywords by priority: `rojadirecta` (728K/mo), `pirlo tv` (413K/mo), `tarjeta roja` (320K/mo), `rojadirecta tv` (250K/mo), `roja directa` (296K/mo).

Homepage `<title>`: `Rojadirecta en Vivo 🔴 Fútbol en Vivo Gratis | Tarjeta Roja TV Pirlo TV`

Match page `<title>` pattern: `[Team A] vs [Team B] en Vivo 🔴 [League] | Rojadirecta Tarjeta Roja`
