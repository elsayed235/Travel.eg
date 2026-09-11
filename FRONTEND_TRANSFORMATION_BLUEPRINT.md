# DAHAB — FRONTEND TRANSFORMATION BLUEPRINT
## The Living Chart — Sinai 2027 (frontend-first, full-stack-truthful)

*Status: EXECUTING. Direction approved 2026-09-10. Companion docs: `LIVING_CHART_DESIGN_SPEC.md`, `PHASE_0_REPORT.md`, `SURFACE_MAP.md`, `API_DEPENDENCY_MAP.md`. Executable source is authoritative if this document conflicts.*

**Verified baseline (2026-09-10, measured — not quoted):** tsc CLEAN · 1074 node + 23 UI unit tests passing (5 skipped, secret-gated) · 32/32 Playwright e2e (EN+AR) · production build green (index chunk 875.52 kB / gzip 256) · 6 themes · 63 TableSpecs · 72 server services · 168 inline handlers in server.ts · ~161 api.ts client methods · 198 component files · 37 lazy route views · 49 canonical routes · ~1,943 i18n keys · 54 emoji-as-icon sites across 14 files · capability→UI gaps: long-stay, reef-positive, group trips (partial), supplier calendar, reliability badges (server-built, no/partial UI).

---

## 1. CURRENT UX
Journey-staged product (dream → plan → arrive → explore → depart → remember). Homepage cockpit with cinematic video hero + live conditions strip; ⌘K SearchDrawer spotlight + per-surface NL search (hotels: "quiet place near the sea…"); journey sub-flows (PreArrivalBriefing, EarlyArrival, FirstTwoHours, DailyCompanionDay2, ChangeAndRecovery, WhatShouldIDoNow, Departure, PostTrip); My Trip as the trip graph hub (timeline / bookings / tools / group-split card); DayGI floating concierge everywhere with a confirm-before-money trust model; Dahab Live instrument page (marine telemetry); food with intent/time/location context; ops console (19 sections) and supplier portal as staff surfaces. Verified live on :3000 during this audit.

## 2. CURRENT UI
Luxury Re-Skin (2026-09-09): liquid-glass chrome, warm stone canvas/card/container per theme (#141311/#1C1917/#2A2622 dark; #FAF9F6/#FFFFFF/#F1EFE9 light), gold fire accents (#C8933D dark, ink #1A1408 ≈8:1; #A16207 light, white ink 4.53:1), teal = live-data ink only, Cormorant + Montserrat with Alexandria/El Messiri Arabic enforcement, JetBrains Mono instrument readings, 6 AAA themes (charcoal-minimal, deep-reef, editorial-sand, high-contrast-pro, lagoon-breeze, sinai-midnight), `chart-*` API, measured reading scale (13/15px, line-height 1.55/1.6).

## 3. PROBLEMS
(a) Emoji-as-icons: 54 sites / 14 files, including inside i18n keys. (b) Floating-action crowding: DayGI FAB + emergency ring + "✨ Dahab Tools" pill on every viewport, overlapping content (live screenshots). (c) No data cache/dedup/TTL — `/api/auth/me`, `/api/health`, `/api/content/theme`, `/content/strings`, `/content/navigation/header` refetch on every navigation (network-log verified). (d) Search dual-truth: SearchDrawer bypasses the unifiedSearchEngine; no explanation of ranking, no autocomplete, no zero-result recovery. (e) No availability/conditions/verified badges on discovery cards though all three server capabilities exist. (f) Capability→UI gap: long-stay, reef-positive, group trips, supplier calendar, reliability scores built server-side without (full) UI. (g) Token leaks + ~800 lines of `!important` rescue CSS. (h) Bundle: index chunk 875 kB (warning limit raised to 900); DayGI view 1,988 lines unsplit. (i) Ops "12-charts" attention problem. (j) Payments/SMS simulated — the UI must mirror that truthfully, never overstate.

## 4. DESIRED EXPERIENCE
*"I don't need five travel websites; Dahab knows the conditions, holds my spots, adapts my days, and pays my hosts fairly."* Availability is truth on every card; every AI output carries provenance + fallback; Arabic is a first-class layout; mobile thumb-zone owns primary actions; loading→skeleton→content→empty→error on every surface, no exceptions; glass and motion serve these goals, never compete with them.

## 5. INFORMATION ARCHITECTURE
Keep the custom router, all 49 routes, deep links and real 404. Add: `/groups/:id` (shared trip), `/long-stay` (nomad), reef-impact in `/profile` + My Trip, supplier portal sections (Calendar/Availability, Revenue, Analytics), ops Attention Queue + Revenue + Risk. Merge `/listings` → `/explore`; SearchDrawer becomes a thin client of one engine. Mobile: bottom nav ≤5 (Home, Discover, My Trip, Book, Profile); DayGI reachable from the dock.

## 6. DESIGN SYSTEM
Codify `design-system/dahab/MASTER.md` + page overrides: color roles (stone/gold/teal + per-theme variants), type scale (Cormorant display / Montserrat body / Alexandria + El Messiri Arabic / JetBrains Mono readings), spacing, radii, shadows, motion tokens (`--dur-fast 150ms / --dur-base 250ms / --dur-slow 450ms`, `--ease-out cubic-bezier(.22,1,.36,1)`, `--spring spring(1,120,12)`), focus/disabled/loading states, imagery rules (self-hosted variants, srcset, focal points), RTL rules (logical props, Arabic fonts enforced), glass tiers (see design spec), Living-Chart elements (contours, compass, readings, telemetry skin via `--wind-angle` custom property). Enforcement: design-token test (no new hard hex), no-emoji test, imagery test, missing-AR CI (shipped).

## 7. COMPONENT STRATEGY
Reuse-first: TouchTarget, SafeArea, MobileSheet, DahabEmptyState, CmsImage, ChartSeasonStrip, StickyBookingBottomBar, ThumbBar, section UI kit, `chart-*` API. Consolidate: per-view mappers → shared catalogue hooks; card variants → one ListingCard with availability/conditions/verified slots. New primitives: GlassPlate (tiered), CompassRail, ContourLayer, AvailabilityNeedle, WhyThisLine, SkeletonPlate. 21st.dev patterns adapted per the component pipeline — nothing installed raw.

## 8. PAGE-BY-PAGE TRANSFORMATION
Home: Living-Chart hero (GLSL sea/dunes, scroll-scrubbed), compass progress rail, de-crowded dock, intent entry. Explore: one engine, availability needles, skeletons, guided zero-result recovery, Lucide icons. Hotels/Rentals/Attractions: map/list split, conditions badges, verified seals. Food: keep the intent model; SVG icons. Live: canonical instrument; spots joined to listings. DayGI: ambient panel + provenance + trust footer. My Trip: group entry, reef gauge, budget truth. Bookings: timeline + review invitations (shipped); hold timers added. Profile: reviews, impact, long-stay entry. Supplier portal: calendar/availability core, reliability, revenue, analytics. Ops: attention queue landing, revenue, risk. CMS pages: prerender/SEO.

## 9. MOBILE STRATEGY
Designed, not shrunk: bottom nav ≤5; sheets over modals; dock consolidates DayGI/emergency/tools/offline; sticky action bars in the thumb zone; 44px targets; safe areas; 375px AR RTL QA per sign-off; offline pack tested on throttled Sinai-like networks.

## 10. INTERACTION STRATEGY
One easing curve + motion tokens; micro-interactions with purpose (state change, feedback, disclosure); SectionReveal stagger reduced-motion-safe; no decorative animation; skeletons everywhere; optimistic updates only where server truth is immediate (trip items), refetch elsewhere (commerce); glass never animated (static blur, GPU-safe transforms).

## 11. SEARCH EXPERIENCE
Single engine, both callers. NL parse (Gemini intent + deterministic AR-dialect fallback) → facets → availability join (unbookable never ranks) → conditions join → personalization → ranking (relevance, review integrity, reliability) → **"why this" explanation line**. Autocomplete (debounced) + recents + suggestions; zero-result → guided quiz; funnel analytics (query→refine→click→book) feeding ops.

## 12. BOOKING EXPERIENCE
Hold with visible 15-min mono countdown; price explainer (host share / commission / fees); modification-first manage flow (timeline shipped — surface everywhere); sold-out mid-hold → instant alternatives; payment-fail → hold preserved + retry; booking state mirrors server 1:1 (never visual-only); AR RTL checkout QA.

## 13. AI EXPERIENCE
DayGI: contextual pills (shipped), deterministic-first, quota circuit, provenance on every answer, ambient adaptation (conditions-change nudge → one-tap rebook, ledger-safe), human handoff queue (ops); generator constrained to verified SKUs (shipped — extend to all surfaces); eval harness in CI (golden itineraries, price factuality, Arabic quality, boundary prompts); cost controls per surface. **Rule: AI proposes only what the ledger can sell.**

## 14. DASHBOARD EXPERIENCE
Supplier: inbox-first (accept/dispatch, SLA timers) → calendar/availability (build) → revenue/payouts 24h (build) → reviews respond (API shipped) → analytics. Ops: attention queue (SOS→unconfirmed→payment-stuck→review-flagged→stale, one-click remedies, audit-logged) → trips/commerce/suppliers/content/users/revenue/risk/AI/search/health. Solid-first material; glass only where usability is verified.

## 15. ACCESSIBILITY
Contrast ≥4.5:1 (6 themes incl. 21:1 High Contrast Pro = zero transparency), visible focus everywhere, keyboard order = visual order, focus traps verified, SR live regions (shipped: route + toast separation), SVG-only icons, touch ≥44px, reduced-motion collapses every effect to final static states, responsive zoom 200%, glass fallback matrix (solid / high-contrast / low-end / no-blur).

## 16. PERFORMANCE
LCP <2.5s, INP <200ms, CLS <0.1, API p95 <300ms catalogue / <800ms search / <2s AI streamed; bundle budget enforced (revert raised limit, DayGI split, no simulator chunk — verified absent); query cache; image variants + srcset (partially shipped); Arabic font subsetting; prerender catalogue/CMS; WebGL GPU-only with CSS fallback; glass ≤2 backdrop-filter layers per viewport; Lighthouse ≥90 in CI.

## 17. TESTING
Pyramid (verified): 95 node files (1074 passing) + 5 UI files (23 passing) + contract suites + 5 e2e specs (32 runs EN+AR). Per capability: unit + contract + e2e + visual regression + axe + AR 375px; **vertical-slice gate** (evidence per layer, never visual-only); AI eval harness; perf budgets in CI; flaky-quarantine rule (red suite blocks merge; flaky quarantined same-day with an owner).

---

## FEATURE MATRIX (condensed, execution tracking)
| # | Feature | State | FE | BE | DB | Dash | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| 1 | Query-cache / no refetch storms | ❌ | 🔶 | — | — | — | planned | P1 |
| 2 | Emoji→Lucide sweep | ❌ | 🔶 | — | — | — | planned | P1 |
| 3 | Floating-action de-crowding | ❌ | 🔶 | — | — | — | planned | P1 |
| 4 | Token-leak sweep + lint | ❌ | 🔶 | — | — | — | planned | P1 |
| 5 | Bundle budget + DayGI split | 🔶 | 🔶 | — | — | — | planned | P1 |
| 6 | Supplier calendar UI | ❌ | 🔶 | 🔶 | — | 🔶 | planned | P2 |
| 7 | Verified/reliability badges | ❌ | 🔶 | 🔶 | — | 🔶 | planned | P2 |
| 8 | /long-stay surface | ❌ | 🔶 | 🔶 | 🔶 | — | planned | P2 |
| 9 | Reef-impact surface | ❌ | 🔶 | 🔶 | — | — | planned | P2 |
| 10 | /groups/:id flow | 🔶 | 🔶 | 🔶 | 🔶 | — | planned | P2 |
| 11 | Conditions-on-cards | ❌ | 🔶 | 🔶 | — | — | planned | P2 |
| 12 | Living Chart tokens + glass tiers | ❌ | 🔶 | — | — | — | planned | P3 |
| 13 | GLSL hero + View Transitions + motion | ❌ | 🔶 | — | — | — | planned | P3 |
| 14 | Unified SearchDrawer + explanation + zero-result | ❌ | 🔶 | 🔶 | 🔶 | 🔶 | planned | P3 |
| 15 | Booking hold timers / alternatives | ❌ | 🔶 | 🔶 | — | — | planned | P4 |
| 16 | Mobile bottom nav / sheets / dock | ❌ | 🔶 | — | — | — | planned | P5 |
| 17 | Ops attention queue / revenue | ❌ | 🔶 | 🔶 | 🔶 | 🔶 | planned | P6 |
| 18 | Payments/SMS live + sim discipline | 🔶 | 🔶 | 🔶 | — | 🔶 | planned | P7 |
| 19 | Postgres cert / Redis / media / offline | 🔶 | 🔶 | 🔶 | 🔶 | — | planned | P7 |

Legend: ✅ live · 🔶 partial/exists · ❌ missing · — not applicable.

*This document is updated after every wave with actual decisions.*