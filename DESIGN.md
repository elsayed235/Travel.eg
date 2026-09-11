# DESIGN — Sinai Star Chart

> **Direction key:** `2cdaa49a` · *The night sky over Sinai as trip instrument.*

This document is the source of intent for the Dahab homepage's visual world. The
executable source (CSS, components) is authoritative if it conflicts with prose.
Replaces Tidal Convergence (`a990940c`), which is retained nowhere on the page;
its class names survive only as deprecated aliases (see below).

## The World

Sinai Star Chart treats the homepage as a **Bedouin night-sky navigation chart** —
the sky a traveler actually sleeps under in Dahab: zero light pollution over the
lagoon, 2am departures for the Mount Sinai dawn ascent, guides who read stars
the way kitesurfers read wind graphs. Journey phases plot as constellations the
visitor reads and steers; the plotted (active) waypoint holds firelight while
the rest recede as unplotted stars.

This is the conceptual model that organizes the whole page: the visitor arrives
under the chart, picks their star (scene, traveler type, trip pathway), and
descends into depth soundings (numbers), field notes (stories), plates (gallery),
and a dawn-ascent close (final CTA).

## The Palette

| Token / value | Role |
| --- | --- |
| `#0A1128` Sinai night | chart ground, hero scrims, section depth |
| `#060B1F` abyss-night | deepest layer, pre-hydration body |
| `#F2EDDF` bone starlight | star ink, light display type |
| `#E8A33D` amber fire / `#B97A1F` deep | the single action per viewport (primary CTAs, plotted waypoint, guide star) |
| `#C9A24B` brass | waypoint ticks, hairline borders, secondary CTA edges |
| `#1B2452` chart indigo | section washes, depth steps |
| `#1B9A8B` lagoon teal | **live data ink only** (conditions, provenance, live badges) — never decoration |

Color strategy is Committed: night indigo carries the hero, close, and footer;
bone carries reading sections; amber owns action. Day-paper readability comes
from `color-mix(in oklab, …)` construction over theme vars, so light themes
render indigo ink on bone rather than fighting it.

## The Components

- **`src/components/common/CinematicVideoHero.tsx`** — the first viewport. The
  cinematic scene is framed as a chart plate under night scrims with a pure-CSS
  pinprick starfield (`chart-starfield`, symmetric for RTL, static under reduced
  motion); the headline is set in the chart display face (CMS copy still wins
  when published); one amber CTA (`Plan Your Dahab Trip`); scenes plotted as a
  **constellation stack** with a lit guide star — the active waypoint holds
  firelight, others fade as unplotted stars; the base strip is an instrument
  readout (air/water/sunset wired to **live `/api/telemetry/weather`**, numerals
  in bidi-safe `dg-num`). No kicker — the heading carries its own weight.
- **`src/components/home/V2HomeCockpit.tsx`** — progress rail plotted as
  night → fire → live (`#1B2452 → #E8A33D → #1B9A8B`); footer brand mark in the
  same thread. All composition logic, wayfinder ids, and section order untouched.
- **`src/components/FinalCTA.tsx`** — the dawn-ascent close. Night ground,
  ember badge, chart display headline with same-ink serif-italic turn, quiet
  reassurance line, amber primary + brass secondary. (Reskinned via the shared
  system; no structural edits.)
- **All remaining homepage sections** (stories rail, micro-experiences, landmarks
  bento, photo showcase, essence bento, season strip, stats band, live ticker,
  marquee, plan-with-AI, trip entry) — reskinned via the shared system; copy,
  data hooks, booking exits, and lifecycle logic untouched.

## Reusable Chart CSS (in `src/index.css`)

`chart-gradient-hero`, `chart-gradient-section`, `chart-depth-1..5`,
`chart-starfield`, `animate-chart-rise` (single orchestrated hero reveal, with
`prefers-reduced-motion` guard), `chart-shimmer` (static hairline, no loop),
`chart-card` (brass-tinted hairlines, offset+blur depth, no lift),
`chart-thread` / `chart-waypoint` / `chart-waypoint-active` / `chart-node`
(round star nodes on one chart rule), `chart-cta-primary` (amber fire, dark ink
`#1A1206`, ≈8:1), `chart-cta-secondary` (brass edge),
`chart-heading` (Chakra Petch 700), `chart-heading-accent` (El Messiri italic,
inherits ink — never a contrasting color), `chart-glass` (over sky media only),
`chart-badge` + `chart-badge-live` (teal) / `chart-badge-ember` (amber),
`chart-parallax-*`.

`chart-*` is the only API — the `tidal-*`/`tide-*` aliases were removed once
zero usages remained, along with the dead shimmer keyframes; the navbar
keyframe is `chartShift`, and the season strip is `ChartSeasonStrip`.

Type is three voices: Chakra Petch (Latin display — chosen for its engraved
instrument caps and chart-numeral character, the voice of a trip instrument;
Arabic falls through to Alexandria), Alexandria (Arabic), El Messiri italic
for the single accent turn per viewport, JetBrains Mono / `dg-num` for
readings only. Body text stays on the existing stack.

## Principles

1. **Plot, don't decorate.** Every star, hairline, and tick implies a chart a
   Bedouin guide could actually read — never scattered sparkle.
2. **One fire per viewport.** Amber appears on the single dominant action (and
   the plotted waypoint); everything else stays bone, brass, or ink.
3. **One memorable element.** The constellation stack is the risk; surrounding
   surfaces stay quiet — hairlines instead of shadows, no per-card lifts.
4. **One orchestrated moment.** Only the hero plays `animate-chart-rise` on
   load; sections below render statically.
5. **Theme-aware.** Chart surfaces are built on `color-mix`/CSS variables so
   they stay legible in light and dark themes.
6. **Lifecycle-aware.** The chart reinforces where the traveler is in their
   journey (dreaming → planning → arriving → exploring → remembering) without
   overriding the existing lifecycle logic.

## Finish

Verified 2026-09-07: desktop + mobile hero, full-page scroll, and per-section
captures in `tests/browser-qa/screenshots/starchart/`; `tsc --noEmit` clean;
design detector reports zero findings in changed regions (16 pre-existing
`gray-on-color` warnings elsewhere in `index.css` left untouched). The visual
world is documented here and the executable source is authoritative.

## Wave 0 rollout (2026-09-07)

P0 readability breaks fixed on traveler routes, same system-migration technique
(theme vars + fire/brass selected states, no layout changes): terms modal to
theme vars with amber confirm; Explore badge ink; review-step banner to
surface + accent ink; payment-step selected states to `text-primary`;
NextUp banner to bone wash + accent time ink; manage-modal title ink;
commerce modal header/tabs/selected/CTA to night/brass/fire (weather note
keeps teal as genuine live data). Captures in
`tests/browser-qa/screenshots/wave0/`. Detector clean on all touched files.

## Wave 1 rollout (2026-09-07)

Direct `tidal-*` migration complete — zero `tidal-`/`tide-` class usages remain
in any `.tsx` (only the `index.css` alias definitions survive for safety):
ProfileView (38 uses → `chart-*`, avatar seal to night/brass with bone
initial, permits ledger to `chart-thread`/`chart-waypoint`, notify toggle to
logical `start-*` props); DahabLiveView (cards → `chart-card`, readings to
`dg-num`, cam border to lagoon ink, display headings to `chart-heading`);
all homepage children + FinalCTA renamed to canonical `chart-*`; residual
old-world hexes fixed (essence rail, gallery lightbox CTA, AI-widget food
token) plus one off-world purple hover → firelight. Captures in
`tests/browser-qa/screenshots/wave1/`.

## Wave 2 rollout (2026-09-07)

Paper→night unification across traveler routes (light branches now resolve
through theme vars, so both dark and light themes render one world):
Explore + ListingCard (incl. category inks collapsed to
primary/secondary/brass, accent-button ink fixed cross-theme), full My Trip
cluster (incl. two invisible-hover states in BookingDetailModal and the
teal/gold hover strays), all stays lists (hotels, restaurants, rentals,
attractions + detail views), transfers/companion/spontaneous/arrival
accent-button ink, auth ambient wash to fire/indigo, booking option-card
selected states, gallery tabs/cards, navbar brand seal, ErrorBoundary retry,
AI-widget paper block. Intentionally kept: map-popup ink (over light tiles),
photo scrims and over-photo chips (over imagery), ops-console colors
(staff surfaces, out of scope). Verified in editorial-sand light theme and
Arabic RTL. Captures in `tests/browser-qa/screenshots/wave2/`.

## Wave 3 rollout (2026-09-07)

Display voice + RTL sweep (traveler scope; staff consoles excluded):
`font-serif` display → `chart-heading` across 76 files (258 swaps;
`font-serif italic` accents → `chart-heading-accent`); physical text
alignment → logical (`text-start`/`text-end`, 35 files); input icons and
listing badges to `start-`/`end-*`; manage-modal chevrons mirror in RTL;
icon-gap/pusher margins to `me-*`/`ms-*`; hero progress fill anchors to
`start-0`; InstaPay purple box to theme surfaces. Intentionally kept:
symmetric/over-media absolute placements, timeline rails, map CSS.
Detector: 20 pre-existing `gray-on-color` only, none from these waves.
Production build passes with the direction contract intact in
`dist/index.html`. Captures in `tests/browser-qa/screenshots/wave3/`.

## Wave 4 rollout (2026-09-07)

Remainder sweep. **Staff consoles deliberately untouched**: the ops
command-center is a coherent dark instrument (amber/emerald/red status
semantics), the supplier portal a self-consistent fixed-light surface —
repainting either would harm function, so the Star Chart boundary ends at
traveler routes. Genuine traveler-facing bugs fixed instead:
(1) `IMG_*` token strings rendered raw as image URLs in 11 files
(planner, live cams, review hero, my-trip hero, food, itinerary,
alternatives, interests, pace, booking data, experience service) — rewired
to the imported constants (77 swaps);
(2) the token registry itself was systematically broken — dashless Unsplash
IDs 404'd, so all 30 repairable URLs got their dashes back and 6 fabricated
IDs were repointed to verified-live subject matches (all 23 registry photos
curl-verified 200);
(3) companion timeline rail to logical props.
Verified: zero broken remote images on planner/live/my-trip/food, `tsc`
clean, detector clean, production build passes. Captures in
`tests/browser-qa/screenshots/wave4/`.

## Wave 5 cleanup (2026-09-07)

`chart-*` is the only API: all `tidal-*`/`tide-*` aliases removed, dead
shimmer keyframes deleted, `tidalShift` → `chartShift`, `TidalSeasonStrip`
→ `ChartSeasonStrip` (plus a dead identical-branch collapse and unused
theme hook found along the way). Screenshots confirm pixel-identical paint.
Staff voice pass declined on the merits: consoles carry no `font-serif`
and their instrument/status aesthetics are functional — restraint beat
coverage. (The concurrent commerce work noted here earlier has since landed:
`tsc` is clean repo-wide, including `server.ts` and `transferService.ts`.)

## Luxury Re-Skin (2026-09-09, ui-ux-pro-max full re-skin)

> Direction: `reskin-2026-09` · approved plan: adopt the skill's Liquid Glass +
> premium black/gold on warm paper wholesale, including staff surfaces.

**What changed, and why the Star Chart world survives underneath:**

- **Palette** moved from indigo night (`#0A1128`) to **warm stone**
  (`#141311` canvas / `#1C1917` card / `#2A2622` container per theme) with
  **gold fire** (`#C8933D` fills, ink text) and **bronze** (`#7A5E30` gold-as-
  text on light grounds). Skill spec `#1C1917`/`#A16207`/`#FAFAF9` honored:
  `#A16207` is the light-theme accent/CTA (white text, 4.53:1), `#FAF9F6` the
  warm paper canvas. Lagoon teal stays **live-data ink only**; brass ticks,
  bone starlight, and the constellation stack survive.
- **Fonts**: Cormorant (Latin display serif) + Montserrat (body) replaced
  Outfit/Chakra Petch. Arabic never touches them — Alexandria (body/headings)
  and El Messiri (display serif, the italic accent turn) are enforced by the
  `[dir=rtl]` rules and font fallback chains. JetBrains Mono stays for live
  readings (`dg-num`). Google Fonts link + `@theme` tokens + pre-hydration
  script + `server/services/themeService.ts` FONT_STACKS all updated.
- **Mechanics**: re-skin flows through **token values + chart-* API
  redefinition**, never component-class rewrites — the 6-theme engine and its
  measured-contrast rescue blocks were re-tuned, not bypassed. Old-world hex
  literals in components were swept to the new values; legacy rescue selectors
  in `index.css` remain as dead-but-harmless safety.
- **Pattern**: Scroll-Triggered Storytelling — scroll-progress rail (stone →
  gold → teal) already existed and is remapped; `SectionReveal` gained
  per-child `stagger` and an `onProgress` callback (reduced-motion safe).
  Liquid Glass chrome (nav/dock/modals/headers) was already token-driven and
  inherits the re-skin.
- **Staff surfaces**: ops console / supplier portal / market intelligence are
  token-driven instruments — the re-skin lands through the tokens (gold
  chrome, stone grounds) while amber/emerald/red status semantics and the
  mono label voice are untouched. The lone `text-cyan-400` left is a CMS
  label-color picker option, not chrome.

**Battery (2026-09-09)**: `tsc` clean · 1074 node + 23 UI unit tests ·
`vite build` + server bundle OK · e2e **32/32** (en+ar, isolated :3100).
Also fixed along the way: a time-of-day-sensitive ambient-nudge test (pinned
clock — `currentHour < 14` gate failed every afternoon) and the E2E suite's
`localhost` → `::1` IPv6 resolution failure on Windows hosts files (IPv4-
explicit 127.0.0.1 in `playwright.config.ts` + `tests/e2e/helpers/`).
