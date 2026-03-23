# UI Redesign Prompt — rojadirectaenvivo.top
> Give this entire document to the coding agent. It replaces all visual/styling decisions in PROJECT.md.

---

## Aesthetic Direction: "Estadio Nocturno" (Night Stadium)

Think: the electric feeling of watching a match in a packed stadium at night — the floodlights cutting through darkness, the crowd noise, the tension of a 90th-minute goal. This site should feel like that. Not a tech product. Not a streaming service. A **living broadcast room**.

**Reference mood:** Late-night ESPN Deportes lower-thirds. Telemundo's Champions League broadcast graphics. The urgency of a referee pulling out a red card.

**One unforgettable thing:** Every visitor should feel the heartbeat of live sport the moment the page loads — through motion, color, and the sense that something is happening *right now*.

---

## Typography

### Font Stack
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap');
```

| Role | Font | Weight | Style |
|---|---|---|---|
| Headlines / Match titles | **Bebas Neue** | 400 (it's all-caps by nature) | All-caps, wide tracking |
| Sub-headings / League names | **Barlow Condensed** | 700 | Uppercase, tight |
| Body / Channel names / Times | **Barlow Condensed** | 400–600 | Normal case |
| Meta / Labels | **Barlow** | 500 | Small, spaced |

**Rules:**
- Team names displayed in Bebas Neue at 2.5–4rem. They should feel like stadium signage.
- League names in Barlow Condensed 700 uppercase, smaller, above the team names
- Never use Inter, Roboto, or any system font anywhere

---

## Color System

```css
:root {
  /* Core */
  --c-bg:          #0A0A0A;   /* Near-black — the stadium at night */
  --c-bg-card:     #111111;   /* Card surface */
  --c-bg-elevated: #181818;   /* Hovered card, sidebars */
  --c-border:      #222222;   /* Subtle dividers */

  /* Brand Red — the tarjeta roja itself */
  --c-red:         #E8001D;   /* Pure football red */
  --c-red-glow:    rgba(232, 0, 29, 0.35);
  --c-red-muted:   rgba(232, 0, 29, 0.12);

  /* Accent — floodlight amber */
  --c-amber:       #FF9500;   /* Live badge, highlights */
  --c-amber-glow:  rgba(255, 149, 0, 0.3);

  /* Text */
  --c-text-primary:   #F0F0F0;
  --c-text-secondary: #888888;
  --c-text-muted:     #444444;

  /* Special */
  --c-live-pulse:  #FF3B30;   /* LIVE indicator */
  --c-grass:       rgba(34, 139, 34, 0.08); /* Subtle green tint on match pages */
}
```

**Color rules:**
- Background is almost-black (#0A0A0A), NOT #121212 or #1a1a1a — go darker
- Red is used SPARINGLY and with purpose — logo, active states, live badges, CTAs
- Amber is for time displays, channel counts, accent moments
- No gradients from red-to-purple, no blue anywhere, no white backgrounds
- Cards use a very subtle `box-shadow: 0 0 0 1px var(--c-border)` border — no heavy shadows

---

## Layout System

### Grid Philosophy
Tight, editorial, information-dense. Like a sports newspaper front page, not a streaming service.

**Homepage grid:**
```
┌──────────────────────────────────────────────────────────────┐
│  HEADER — sticky, 60px tall, red left border accent          │
├──────────────────────────────────────────────────────────────┤
│  HERO TICKER — scrolling marquee of today's match names      │
├──────────────────────────────────────────────────────────────┤
│  COUNTRY GROUP HEADER  🇦🇷 ARGENTINA  ─────────────────────  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  Match Card  │ │  Match Card  │ │  Match Card  │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
│  COUNTRY GROUP HEADER  🇪🇸 ESPAÑA   ─────────────────────── │
│  ┌──────────────┐ ┌──────────────┐                          │
│  │  Match Card  │ │  Match Card  │                          │
│  └──────────────┘ └──────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

Grid: `repeat(auto-fill, minmax(280px, 1fr))` — 3 columns desktop, 2 tablet, 1 mobile.

**Match page layout:**
```
┌─────────────────────────────────────────┐
│ HEADER                                  │
├─────────────────────────────────────────┤
│ MATCH HEADER                            │
│  [FLAG] LIGA PROFESIONAL · ARGENTINA    │
│  NEWELL'S OLD BOYS                      │
│  ─── VS ───                             │
│  GIMNASIA MENDOZA                       │
│  ⏰ 15:45 ARG  |  🕐 Tu hora: 18:45    │
├───────────────────────┬─────────────────┤
│                       │ CANALES         │
│    IFRAME PLAYER      │ [Liga1MAX   ▶]  │
│    (16:9 ratio)       │ [OP2          ] │
│                       │ [OP3          ] │
│                       │                 │
│                       │ ─────────────── │
│                       │ MÁS PARTIDOS   │
│                       │ [mini card]    │
│                       │ [mini card]    │
├───────────────────────┴─────────────────┤
│ SEO TEXT BLOCK                          │
└─────────────────────────────────────────┘
```

---

## Component Specifications

### Header

```
Height: 60px
Background: #0A0A0A
Border-bottom: 1px solid #1A1A1A
Left accent: 3px solid var(--c-red) (::before pseudo on the logo)

Left: ROJADIRECTA [red]ENVIVO[/red]  ← logo as styled text, Bebas Neue 24px
Right: [Inicio] [Rojadirecta en Vivo] [Tarjeta Roja] [Pirlo TV]
       Nav links: Barlow Condensed 600, 14px uppercase, color #888, hover → #F0F0F0

Mobile: Logo left, hamburger right (CSS-only toggle using checkbox hack)
```

Logo treatment in CSS:
```css
.logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 0.05em;
  color: #F0F0F0;
}
.logo span { color: var(--c-red); }
/* "ROJA" in red, "DIRECTAENVIVO" in white */
```

---

### Ticker Bar (homepage only — below header)

A horizontally scrolling marquee of all today's match titles. Creates energy and content density immediately.

```css
.ticker {
  background: var(--c-red);
  height: 36px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.ticker-label {
  /* "📡 EN VIVO HOY" label fixed on left */
  background: #000;
  color: var(--c-red);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
}
.ticker-track {
  animation: ticker-scroll 60s linear infinite;
  white-space: nowrap;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: #000;
  letter-spacing: 0.05em;
}
@keyframes ticker-scroll {
  from { transform: translateX(100vw); }
  to   { transform: translateX(-100%); }
}
/* Separator between matches: " · " */
```

---

### Country Group Header

```html
<div class="country-group-header">
  <img src="/flags/argentina.png" alt="Argentina" width="20" height="20" />
  <span class="country-name">ARGENTINA</span>
  <div class="divider-line"></div>
  <span class="match-count">4 partidos</span>
</div>
```

```css
.country-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 32px 0 16px;
  padding-bottom: 8px;
}
.country-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.2em;
  color: var(--c-text-secondary);
  text-transform: uppercase;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: var(--c-border);
}
.match-count {
  font-family: 'Barlow', sans-serif;
  font-size: 11px;
  color: var(--c-text-muted);
}
```

---

### Match Card

The hero component. Must feel like a broadcast lower-third.

```html
<article class="match-card">
  <div class="card-league">LaLiga · España</div>
  <div class="card-teams">
    <span class="team-a">SEVILLA</span>
    <span class="card-vs">vs</span>
    <span class="team-b">VALENCIA</span>
  </div>
  <div class="card-meta">
    <span class="card-time">⏰ 15:00 ARG</span>
    <span class="card-local-time" id="local-33241">· Tu hora: --:--</span>
  </div>
  <div class="card-footer">
    <div class="card-channels">
      <span class="channel-badge">DSports</span>
      <span class="channel-badge">ESPN Dep.</span>
      <span class="channel-badge extra">+4</span>
    </div>
    <a href="/partido/33241-laliga-sevilla-vs-valencia/" class="card-cta">
      <span>▶ VER</span>
    </a>
  </div>
</article>
```

```css
.match-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 4px;                   /* Sharp corners — not rounded bubbles */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, transform 0.15s;
  overflow: hidden;
}
.match-card::before {
  /* Red left accent line — appears on hover */
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--c-red);
  transform: scaleY(0);
  transition: transform 0.2s ease;
  transform-origin: bottom;
}
.match-card:hover::before { transform: scaleY(1); }
.match-card:hover {
  border-color: #333;
  background: var(--c-bg-elevated);
}

/* LIVE state */
.match-card.is-live {
  border-color: rgba(232, 0, 29, 0.4);
}
.match-card.is-live::before {
  transform: scaleY(1);
  background: var(--c-amber);
}

.card-league {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.card-teams {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.team-a, .team-b {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px;
  line-height: 1;
  color: var(--c-text-primary);
  letter-spacing: 0.03em;
}
.card-vs {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-red);
  padding: 2px 0;
}

.card-meta {
  font-family: 'Barlow', sans-serif;
  font-size: 12px;
  color: var(--c-text-secondary);
  display: flex;
  gap: 4px;
  align-items: center;
}
.card-local-time { color: var(--c-amber); }

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
.card-channels {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.channel-badge {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-text-muted);
  background: #1A1A1A;
  border: 1px solid var(--c-border);
  border-radius: 2px;
  padding: 2px 6px;
}
.channel-badge.extra {
  color: var(--c-amber);
  border-color: rgba(255, 149, 0, 0.3);
}

.card-cta {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
  background: var(--c-red);
  border-radius: 2px;
  padding: 6px 14px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}
.card-cta:hover { background: #FF1A2E; }
```

---

### LIVE Badge

For matches where current time is within ±90 minutes of `diary_hour`:

```html
<div class="live-badge">
  <span class="live-dot"></span>
  EN VIVO
</div>
```

```css
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-live-pulse);
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 2px;
  padding: 3px 8px;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-live-pulse);
  animation: pulse-dot 1.5s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
```

---

### Match Page — Match Header

```html
<header class="match-header">
  <div class="match-breadcrumb">
    <a href="/">Inicio</a>
    <span>›</span>
    <span>España</span>
    <span>›</span>
    <span>LaLiga</span>
  </div>
  <div class="match-league-badge">
    <img src="/flags/espana.png" width="16" height="16" />
    <span>LALIGA · JORNADA 30</span>
  </div>
  <div class="match-teams-hero">
    <div class="match-team">SEVILLA</div>
    <div class="match-versus">
      <div class="versus-line"></div>
      <span>VS</span>
      <div class="versus-line"></div>
    </div>
    <div class="match-team">VALENCIA</div>
  </div>
  <div class="match-time-row">
    <span class="time-arg">⏰ 15:00 hora Argentina</span>
    <span class="time-separator">·</span>
    <span class="time-local" id="local-time">Tu hora: --:--</span>
    <span class="time-date">· Sáb 21 Mar 2026</span>
  </div>
</header>
```

```css
.match-header {
  background: var(--c-bg-card);
  border-bottom: 1px solid var(--c-border);
  padding: 32px 24px;
  position: relative;
  overflow: hidden;
}
/* Subtle grass-green tint background effect */
.match-header::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 150%, rgba(34,139,34,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.match-breadcrumb {
  font-family: 'Barlow', sans-serif;
  font-size: 11px;
  color: var(--c-text-muted);
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
}
.match-breadcrumb a { color: var(--c-text-secondary); text-decoration: none; }
.match-breadcrumb a:hover { color: var(--c-red); }

.match-league-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-text-secondary);
  margin-bottom: 16px;
}

.match-teams-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}
.match-team {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.5rem, 6vw, 5rem);  /* Responsive huge type */
  line-height: 1;
  color: var(--c-text-primary);
  letter-spacing: 0.02em;
}
.match-versus {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.versus-line {
  width: 30px;
  height: 1px;
  background: var(--c-red);
}
.match-versus span {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3em;
  color: var(--c-red);
}

.match-time-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  color: var(--c-text-secondary);
  flex-wrap: wrap;
}
.time-local { color: var(--c-amber); font-weight: 500; }
```

---

### Match Player — Iframe Container

```html
<div class="player-wrapper">
  <div class="player-aspect">
    <iframe
      id="match-iframe"
      src="{decoded_iframe_url}"
      title="Ver {team_a} vs {team_b} en vivo"
      allowfullscreen
      frameborder="0"
      scrolling="no"
      allow="autoplay; encrypted-media; fullscreen"
    ></iframe>
  </div>
</div>
```

```css
.player-wrapper {
  background: #000;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  overflow: hidden;
}
.player-aspect {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
}
.player-aspect iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}
```

---

### Channel Switcher Tabs

```html
<div class="channel-tabs" role="tablist" aria-label="Canales disponibles">
  <button class="ch-tab active" data-url="{url1}" role="tab">
    <span class="ch-num">1</span>
    <span class="ch-name">Liga1MAX</span>
  </button>
  <button class="ch-tab" data-url="{url2}" role="tab">
    <span class="ch-num">2</span>
    <span class="ch-name">Liga1Max OP2</span>
  </button>
  <button class="ch-tab" data-url="{url3}" role="tab">
    <span class="ch-num">3</span>
    <span class="ch-name">Liga1Max OP3</span>
  </button>
</div>
```

```css
.channel-tabs {
  display: flex;
  gap: 1px;
  background: var(--c-border);   /* gap acts as divider between tabs */
  border: 1px solid var(--c-border);
  border-top: none;
  border-radius: 0 0 4px 4px;
}
.ch-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--c-bg-card);
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}
.ch-tab:hover { background: var(--c-bg-elevated); }
.ch-tab.active {
  background: var(--c-bg-elevated);
  box-shadow: inset 0 2px 0 var(--c-red);
}
.ch-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 18px;
  line-height: 1;
  color: var(--c-red);
  min-width: 16px;
}
.ch-tab.active .ch-num { color: var(--c-amber); }
.ch-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-text-secondary);
}
.ch-tab.active .ch-name { color: var(--c-text-primary); }

/* Mobile: tabs scroll horizontally */
@media (max-width: 640px) {
  .channel-tabs { overflow-x: auto; flex-wrap: nowrap; }
  .ch-tab { flex-shrink: 0; }
}
```

---

### Footer

```html
<footer class="site-footer">
  <div class="footer-logo">ROJA<span>DIRECTAENVIVO</span></div>
  <nav class="footer-nav">
    <a href="/rojadirecta-en-vivo/">Rojadirecta en Vivo</a>
    <a href="/tarjeta-roja/">Tarjeta Roja</a>
    <a href="/pirlo-tv/">Pirlo TV</a>
  </nav>
  <p class="footer-seo">
    Ver fútbol en vivo gratis — Rojadirecta · Tarjeta Roja TV · Pirlo TV · Roja Directa
  </p>
  <p class="footer-disclaimer">
    Este sitio no aloja ningún contenido. Todos los streams son proporcionados por terceros.
  </p>
</footer>
```

```css
.site-footer {
  margin-top: 80px;
  padding: 40px 24px;
  border-top: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}
.footer-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  letter-spacing: 0.05em;
  color: var(--c-text-muted);
}
.footer-logo span { color: #333; }
.footer-nav {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}
.footer-nav a {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-text-muted);
  text-decoration: none;
}
.footer-nav a:hover { color: var(--c-red); }
.footer-seo {
  font-family: 'Barlow', sans-serif;
  font-size: 11px;
  color: var(--c-text-muted);
  max-width: 500px;
}
.footer-disclaimer {
  font-family: 'Barlow', sans-serif;
  font-size: 10px;
  color: #2A2A2A;
}
```

---

## Page-Load Animation

On every page, stagger-reveal cards and the match header on load. CSS only — no JS library needed.

```css
/* In global.css */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.match-card {
  animation: fade-up 0.4s ease both;
}
/* Stagger per card using nth-child */
.match-card:nth-child(1)  { animation-delay: 0.05s; }
.match-card:nth-child(2)  { animation-delay: 0.10s; }
.match-card:nth-child(3)  { animation-delay: 0.15s; }
.match-card:nth-child(4)  { animation-delay: 0.20s; }
.match-card:nth-child(5)  { animation-delay: 0.25s; }
.match-card:nth-child(6)  { animation-delay: 0.30s; }
/* Beyond 6, all show at 0.35s — don't delay too long */
.match-card:nth-child(n+7) { animation-delay: 0.35s; }

.match-teams-hero {
  animation: fade-up 0.5s 0.1s ease both;
}
.match-header .match-time-row {
  animation: fade-up 0.5s 0.2s ease both;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Keyword Landing Pages (Minimal variant)

`/rojadirecta-en-vivo/`, `/tarjeta-roja/`, `/pirlo-tv/` use the same layout as homepage but with a page hero:

```html
<section class="keyword-hero">
  <h1 class="keyword-h1">Rojadirecta en Vivo</h1>
  <p class="keyword-sub">Fútbol en vivo gratis — todos los partidos de hoy en directo</p>
  <!-- Then same match card grid as homepage -->
</section>
```

```css
.keyword-hero {
  padding: 48px 24px 24px;
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 32px;
}
.keyword-h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 1;
  color: var(--c-text-primary);
  letter-spacing: 0.02em;
  margin-bottom: 12px;
}
/* Red underline accent on H1 */
.keyword-h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--c-red);
  margin-top: 12px;
}
.keyword-sub {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--c-text-secondary);
  letter-spacing: 0.05em;
}
```

---

## Global CSS Rules

```css
/* global.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  background: var(--c-bg);
  color: var(--c-text-primary);
  font-family: 'Barlow Condensed', sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Page max-width container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (max-width: 640px) { .container { padding: 0 16px; } }

/* Links */
a { color: inherit; }

/* Scrollbar styling (Webkit) */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--c-bg); }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--c-red); }

/* Selection */
::selection { background: var(--c-red); color: #fff; }
```

---

## What NOT to Do

- No card border-radius above 6px — sharp is sporty
- No white or light backgrounds anywhere
- No purple, teal, or blue color touches
- No rounded pill buttons — use `border-radius: 2px` max on CTAs
- No box-shadow blur effects — use `border` for depth
- No generic hero images or stock football photos
- No Inter, Roboto, or system-ui fonts
- No padding above 48px inside cards
- No Material Web components — this redesign replaces them entirely with custom CSS
- No JavaScript animations — use CSS `animation` and `transition` only
- Do not center-align match team names — left-aligned feels more editorial and urgent

---

## Tailwind Config Override

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js}'],
  corePlugins: {
    preflight: false,  // Disable Tailwind reset — use our own global.css
  },
  theme: {
    extend: {
      colors: {
        red: { DEFAULT: '#E8001D' },
        amber: { DEFAULT: '#FF9500' },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
    },
  },
};
```

---

## Summary for the Coding Agent

1. **Delete** all existing component CSS and `@material/web` imports
2. **Add** the Google Fonts `@import` to `global.css`
3. **Add** all CSS variables in `:root` to `global.css`
4. **Replace** `Base.astro` header and footer HTML with the markup above
5. **Replace** `MatchCard.astro` HTML and all styles with the card spec above
6. **Replace** `MatchPlayer.astro` and `ChannelTabs.astro` with the player + tab spec above
7. **Add** the ticker bar to `index.astro` only (below header, above first country group)
8. **Add** `keyword-hero` section to the three keyword landing pages
9. **Replace** match page header with `match-header` markup and styles
10. **Add** `@keyframes fade-up` animations to `global.css`
11. **Update** `tailwind.config.mjs` with the override above
12. **Test** on mobile — every component must work at 375px width
13. **Run** `npm run build` — expect 0 errors, all 80 pages rebuild clean
