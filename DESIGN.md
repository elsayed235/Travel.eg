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

**Deprecated aliases:** `tidal-*` / `tide-*` / `animate-tidal-reveal` map onto
the chart paint so non-homepage surfaces (profile, live view) follow the
repaint without logic churn. New code uses `chart-*`.

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
