# THE LIVING CHART — SINAI 2027
## Dahab Design Specification (v1.0 — executing)

*Approved 2026-09-10. This is the visual-material contract for the transformation. Executable source (index.css tokens, chart-* API) is authoritative if it conflicts. Companion: `FRONTEND_TRANSFORMATION_BLUEPRINT.md`.*

---

## 1. CONCEPT

A destination OS whose interface is a **live field instrument for the Red Sea**. The UI is not decorated with data — **it is the data**: the chrome reads the wind, the surfaces sit on dune contours, the numerals are instrument readings, and the hero is a sea the visitor steers. No travel platform has built this; it is the visual expression of the product's differentiator (nobody owns *live* Dahab).

Three voices, all native to the product's DNA:
1. **Dune contour** — layered SVG hairline strata instead of flat fills; cards are "chart plates" with brass edges and offset depth (evolves `chart-card`).
2. **Compass & instrument** — navigation and progress read as bearings; a faint compass rose rotates with route changes; JetBrains Mono (`dg-num`) for every number that is live.
3. **Live telemetry skin** — a global ambient layer driven by `/api/telemetry/marine`: wind vector rotates a directional light (section shadows shift), sea state modulates surface grain, sea temp slides the accent between gold (warm sea) and lagoon teal (cold sea). Static fallbacks when data is absent. **Never fake intelligence.**

## 2. TOKENS

### 2.1 Color (verified against ui-ux-pro-max `colors.csv` Luxury/Premium match — kept)
| Role | Dark (stone) | Light (paper) | Note |
|---|---|---|---|
| canvas / card / container | #141311 / #1C1917 / #2A2622 | #FAF9F6 / #FFFFFF / #F1EFE9 | per-theme variants exist (deep-reef, sinai-midnight, lagoon-breeze) |
| accent CTA (dark) | #C8933D, ink #1A1408 (≈8:1) | — | one fire per viewport |
| accent CTA (light) | — | #A16207, ink #FFFFFF (4.53:1) | |
| live-data ink | #52C4B7 / #20A89A | #0F6F78 / #0A535A | teal = telemetry ONLY, never decoration |
| contour line | `--contour-line`: rgba(bone, 0.10–0.16) | rgba(stone, 0.10–0.16) | new |
| wind light | `--wind-angle` (deg, `@property` animated) | same | drives glass/section light via `color-mix` |

### 2.2 Type (verified Luxury Serif pairing — kept)
Cormorant (display; Arabic → El Messiri italic accent), Montserrat (body; Arabic → Alexandria), JetBrains Mono (readings only). Base 16px; reading scale 13/15px with line-height 1.55/1.6 (existing).

### 2.3 Motion tokens (new)
```
--dur-fast: 150ms   --dur-base: 250ms   --dur-slow: 450ms
--ease-out: cubic-bezier(.22, 1, .36, 1)
--spring: spring(1, 120, 12)        /* motion library */
--scrub: 1                           /* hero only */
```

## 3. MOTION SYSTEM

| Moment | Trigger | Duration / Easing | Notes |
|---|---|---|---|
| Hero scrub (dune/sea shader) | scroll | tied to scroll, scrub 1 | **the only pinned section** (skill rule: ≤2 pins/page) |
| Route change | View Transitions API | 300ms crossfade + plate rotation | compass rose turns 8° per hop |
| Primary CTA | hover / press | spring(1,120,12); `active:scale-95` | magnetic (40px) on desktop; haptic `navigator.vibrate(10)` on mobile confirm only |
| Section reveals | viewport enter | 350ms, power1.out, y:12 | constellation-stagger; `toggleActions: play none none reverse` |
| Cards | hover | 200ms hairline brighten + 2° tilt (desktop only) | no lift-shadow (hairline language) |
| Skeleton | on mount | 800–1200ms loop, paused offscreen/visibility-hidden | skeleton→content on every surface |
| Ambient skin | telemetry poll (30s) | 1.2s eased crossfade, ≤4 transitions/min | wind-angle rotates light |
| Live ticker | existing | keep | |

**Reduced-motion matrix (binding):** every effect above collapses to its final static state under `prefers-reduced-motion: reduce`; hero shows the first frame with the headline legible; no pin, no scrub, no magnetic, no tilt, no shimmer loops.

## 4. ENVIRONMENTAL GLASS (material language, not decoration)

### 4.1 Five-tier hierarchy (tokenized)
| Tier | Token | Recipe | Where |
|---|---|---|---|
| 1 Solid | `--glass-none` | opaque theme surfaces | reading, dense data tables, forms, confirmation, review text |
| 2 Soft translucent | `--glass-soft` | rgba(bone/stone, 4–7%), blur 8px, hairline border | section plates over imagery |
| 3 Frosted | `--glass-frost` | rgba(10–18%), blur 14px, 1px light border, internal top highlight | nav, search surfaces, map overlays, floating filters, weather/sea instruments, itinerary controls, booking summaries, recommendation panels, AI panels, modals/sheets |
| 4 High-priority | `--glass-vivid` | 20–28%, blur 16px, stronger highlight | floating quick actions, active instruments, hero CTA |
| 5 Rare cinematic | `--glass-cinema` | tier-4 + one controlled reflection | **one moment per viewport** (hero instrument plate) |

### 4.2 Rarity budget (hard rule)
Per viewport: **max 1 vivid + 2 frosted** surfaces; solid dominates. Every viewport documents its material hierarchy ("solid base → one frosted panel → one vivid instrument"). Two glass surfaces never compete for primary attention. Glass never on dense data tables or critical text surfaces.

### 4.3 Material recipe
Controlled transparency + backdrop blur + subtle saturation (never rainbow) + soft borders + internal highlight + restrained shadow + layered depth + environmental reflection where technically appropriate (hero only). **Forbidden:** excessive blur, unreadable text, low contrast, glow abuse, thick white borders, Vision-Pro imitation, glass everywhere.

### 4.4 Living-Chart interplay (subtle, telemetry-truthful)
Wind vector shifts ambient light intensity on glass (`--wind-angle` → `color-mix` tint); map layers pass behind translucent panels; contour lines continue behind glass; dark themes deepen to smoked glass, light themes to airy translucency; hero imagery casts the one controlled reflection.

### 4.5 Accessibility contract
WCAG 4.5:1 measured against the real blurred backdrop (existing `src/utils/contrast.ts`); readable over dynamic backgrounds; visible focus; reduced-motion parity; **non-glass fallback** (solid surface), **high-contrast fallback** (High Contrast Pro renders zero transparency via `--glass-mode: solid`), **low-end fallback** (`@supports not (backdrop-filter: blur(1px))` + tint-only). Fully usable with blur/transparency disabled.

### 4.6 Performance budget
Max 1–2 `backdrop-filter` layers per viewport; no blur-in-blur; no animated blur; GPU-safe transforms only; static fallback everywhere; INP/LCP/paint/GPU/memory monitored per wave; glass never on booking/search/navigation critical paths. **Conflict rule: usability > glass · performance > glass · accessibility > glass** — any conflict resolves by removing glass.

## 5. THE HERO (Wave B)

Layer stack: sky gradient → GLSL dune/sea shader (21st WebGL Liquid #18531 / Shader Animation #5810 adapted to the dune palette) → `chart-starfield` → headline plate (tier-5 glass). Scrub timeline: headline rises 40px, sea shifts −20%, starfield parallax. **Fallbacks:** static CSS gradient + contour SVG; SSR-safe (no shader until client + WebGL check); reduced-motion = final frame; low-end = static. GPU-only, one pinned section, `content-visibility` on off-screen layers.

## 6. SURFACE MAP (per-viewport material + motion)
| Surface | Material hierarchy | Motion |
|---|---|---|
| Home | solid base, frosted nav, 1 vivid hero CTA, hero = cinematic moment | hero scrub, constellation stagger, ticker |
| Explore / Search | solid list, frosted search panel + filters, 1 vivid action | results stagger, needle transitions |
| Listing detail | solid reading, frosted summary/booking panel, 1 vivid book CTA | image crossfade, availability needle |
| Live | instrument cards (soft), 1 vivid active instrument, frosted spot selector | readings crossfade (1.2s) |
| My Trip / Bookings | solid timeline, frosted next-up banner, 1 vivid action | timeline rail draw, hold countdown |
| DayGI | frosted AI panel over ambient surface | message springs (restrained) |
| Supplier / Ops | solid-first; glass only on verified widgets | skeleton discipline only |
| Modals / Sheets | frosted tier 3 | 200ms entrance, exit 150ms |

## 7. 21ST.DEV ADAPTATION LIST (research complete; code retrieval in build)
WebGL Liquid #18531, Shader Animation #5810 (hero) · Glassmorphism Navigation #15025, Glass Effect #1118, Glass CTA #25647, Frosted Reveal #7293 (glass references) · Checkout Block #8339, Checkout Steps Breadcrumb #18876 (booking) · Interactive Map #3898, Expanded Map #21987 (map/list split). **Pipeline per pattern:** existing Dahab component → ui-ux-pro-max → 21st → compare → adapt to tokens → implement → browser-test → responsive → a11y → consistency. No foreign visual languages.

## 8. 2027 STACK
View Transitions API · CSS `scroll-timeline` (scrub without JS cost) · `@property --wind-angle` · WebGL/GLSL (GPU, fallback) · `motion` springs (existing dep) · `:has()` + container queries · OKLCH/`color-mix` (existing) · `@supports` fallback gates for glass.

## 9. MIGRATION (six waves, token redefinition — proven Star-Chart→Re-Skin path)
1. Tokens (contours, compass, motion, glass tiers, `--glass-mode` flip) across 6 themes.
2. Chrome: contours + compass + glass tiers applied (nav/search/instruments/sheets).
3. Hero: GLSL + View Transitions + motion system.
4. Surfaces: per-surface map applied with rarity budget.
5. Staff surfaces (token-inherited only).
6. QA: 6 themes + AR 375/768/1024/1440 + fallback matrices + screenshots per wave.

## 10. DEFINITION OF DONE (visual layer)
Every surface: material hierarchy documented · fallback matrix verified (static/reduced-motion/low-end/no-blur/high-contrast) · contrast measured on real backdrops · screenshots in `tests/browser-qa/screenshots/` · AR RTL verified at 375px · INP/LCP budgets green · no effect on navigation/search/booking/checkout paths.