# DESIGN — Tidal Convergence

> **Direction key:** `a990940c` · *The shoreline where two landscapes meet.*

This document is the source of intent for the Dahab homepage's visual world. The
executable source (CSS, components) is authoritative if it conflicts with prose.

## The World

Tidal Convergence treats the homepage as a **shoreline** — a thin line where Sinai's
desert sand dissolves into the Red Sea's depth. Warm, sun-bleached sand warms the
top of the canvas; cool teal deepens into ocean night as the traveler scrolls. Every
surface, border, and motion reads as water meeting land.

This is not a decoration applied to the top of an existing design: it is the
conceptual model that organizes the whole page. The page is a gradient in both color
and meaning — the traveler starts at the surface (discovery, wonder) and sinks into
depth (planning, the journey itself).

## The Palette

| Token / value | Role |
| --- | --- |
| `#E7D3AE` warm Sinai sand | top of the canvas, highlights, the desert voice |
| `#20A89A` teal | live conditions, primary interactive accent |
| `#0F6F78` ocean teal | CTA gradient, mid-depth panels |
| `#062C35` ocean night | deep sections, footer-of-meaning |
| `#04171D` abyss | deepest layer |
| `#F7F3EA` bone | light display type on the hero and CTA |

The transition is carried by `tidal-gradient-*` utilities and `tidal-depth-1..5`,
implemented with `color-mix(in oklab, …)` so they adapt to the active theme (light
or dark) instead of fighting it.

## The Components

- **`src/components/common/CinematicVideoHero.tsx`** — the first viewport. Desert-warmed
  cinematic scene flowing into ocean depth; the headline *"Where the desert meets the
  sea"* owns the viewport (no kicker/eyebrow — the display face carries the weight, with
  a serif-italic accent on the verb); one primary CTA (`Plan Your Dahab Trip`) in ocean
  teal; the destination stack as **receding tide pools** whose opacity sinks with distance
  from the shoreline; scallop-chip scene selectors; and a bottom conditions strip wired to
  **live `/api/telemetry/weather`** (air/water/sunset with graceful fallback) instead of
  hardcoded values — honoring trust-through-transparency. The greeting relocates into the
  top location capsule rather than floating above the headline.
- **`src/components/home/V2HomeCockpit.tsx`** — the page cockpit. Scroll progress
  rendered as a shoreline rail (`#E7D3AE → #20A89A → #0F6F78`), Quick Services as a
  `tide-ledger` (four depth soundings on one shoreline rule; only diving holds
  depth via `tide-row-primary`), and a footer anchored in ocean depth. No
  `SectionReveal` wrappers on the homepage — the hero owns the single reveal.
- **`src/components/home/NextBestActionBanner.tsx`** — the signed-in "next best action"
  derived card rendered as a `tidal-card` with `tidal-shimmer`, the persona toggle as a
  `tidal-glass` channel, and a `tidal-heading` action title.
- **`src/components/home/TripEntrySection.tsx`** — trip-style entry with a `tidal-heading`
  header, the three pathway doorways (build-myself / ready-trips / plan-for-me) surfaced
  as `tidal-card` panels, and the active-journey resume banner in tidal language.
- **`src/components/common/SinaiRadarWidget.tsx`** — live sea/air intelligence in a
  `tidal-card` shell with `tidal-shimmer`, a `tidal-heading`, `tidal-badge` reading stamps,
  and `tidal-glass` metric tiles.
- **`src/components/common/CuratedStoriesRail.tsx`** — editorial rail shelled in
  `tidal-card` with `tidal-shimmer`, `tidal-heading`, `tidal-badge-ocean` provenance pill,
  and `tidal-card` story tiles with `tidal-badge-sunset` category tags.
- **`src/components/common/AiTravelAssistant.tsx`** — the copilot shell as `tidal-card`
  with `tidal-shimmer`, `tidal-heading`, and `tidal-badge-ocean` live-context stamp.
- **`src/components/gallery/DahabGallerySection.tsx`** — archive shell as `tidal-card`
  with `tidal-shimmer` and a `tidal-heading` header.
- **`src/components/home/DahabWeekCompanionDeck.tsx`** — weekly planner header set in
  `tidal-heading` (kept the pre-existing conditional light/dark surface stays intact).
- **`src/components/maps/DahabSpatialContextMap.tsx`** — geospatial companion shell as
  `tidal-card` with `tidal-shimmer` and a `tidal-heading`.
- **`src/components/FinalCTA.tsx`** — the closing shoreline. Tidal gradient section
  anchoring into ocean night, tidal badge (sentence case), light display headline
  with a same-ink serif-italic turn, quiet sentence-case reassurance line, and
  `tidal-cta-primary` / `tidal-cta-secondary` closing actions.

- **`src/components/navigation/V2Navbar.tsx`** — wayfinding groups, not flat
  pills. Four jobs (Discover / Stay & Taste / Getting Around / My Trip) plus a
  grid button that opens the site map: every route in one 4-column overview
  grouped by what it does for the traveler, with CMS labels overlaid and the
  hovered group spotlighted. Hover/focus opens, click lands, Escape and
  mouse-away close. Mobile menu groups identically; per-route ids
  (`nav-link-*` desktop, `mobile-nav-link-*` mobile) are preserved.

## Reusable Tidal CSS (in `src/index.css`)

`tidal-gradient-hero`, `tidal-gradient-section`, `tidal-depth-1..5`,
`animate-tidal-reveal`, `animate-wave-crest`, `tidal-shimmer` (static hairline
highlight, no loop), `tidal-card` (no lift on hover), `tide-ledger` / `tide-row` /
`tide-row-primary` / `tide-mark`, `tidal-cta-primary`, `tidal-cta-secondary`,
`tidal-heading`, `tidal-heading-accent` (serif-italic, inherits ink — never a
contrasting color), `tidal-glass`, `tidal-badge(-ocean/-sunset)` (sentence case,
never all-caps), `tidal-parallax-*`.

Type is two voices only: Outfit (Latin) + Alexandria (Arabic), El Messiri italic
for the single accent turn per viewport, JetBrains Mono for codes/times only.
Retired faces map onto Outfit via a fallback rule so older arbitrary classes do
not break. Coral `#D96C4F` is reserved for help/warn semantics, never decoration.

## Principles

1. **Depth read, not decoration.** Every gradient should imply a physical descent
   from sand into sea — never a flat wash.
2. **One primary action per viewport.** The hero and final CTA each surface a single
   dominant CTA; the secondary is visually quieter.
3. **One memorable element.** The tide ledger is the risk; everything around it
   stays quiet — hairlines instead of shadows, no per-card arrows or lifts.
4. **One orchestrated moment.** Only the hero plays `animate-tidal-reveal` on load;
   homepage sections below render statically (`SectionReveal` removed there).
5. **Theme-aware.** Tidal surfaces are built on `color-mix`/CSS variables so they stay
   legible in both light and dark themes.
6. **Lifecycle-aware.** The visual world reinforces where the traveler is in their
   journey (discover → plan → operate → reflect) without overriding the existing
   lifecycle logic.

## Finish

This appears across the homepage sections touched above. The visual world is
documented here and the executable source is authoritative.
