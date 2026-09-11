# DAHAB PLATFORM — FROM MVP TO WORLD-CLASS PRODUCT
## Master Transformation Blueprint (Audit → Research → Vision → Architecture → Roadmap)

*Status: PROPOSAL — no production code changes authorized until approved.*
*Evidence base: full repo audit (3 parallel tracks), live visual inspection (8 viewports, 2026-09-09), competitive research (OTA benchmarks, AI planners, Dahab-local players), unit/security/contract test inventory.*
*Date: 2026-09-09. Source tree: `D:\dahab-—-travel-platform`.*

**How to read this:** A–C is what exists and what's wrong. D–G is what the market teaches and what we should become. H–Z is the buildable plan. Every claim cites a file, a screenshot, or a source.

---

## A. CURRENT PRODUCT AUDIT — what exists today

### A.1 Surfaces (all verified in code + live screenshots)
| Surface | Route(s) | State |
|---|---|---|
| Homepage cockpit | `/`, `/home`, `/discover` → `V2HomeCockpit` + cinematic video hero | Live, rich |
| Explore/discovery | `/explore`, `/attractions`, `/experiences[/:slug]`, `/listings` | Live on real corpora |
| Programs (packages) | `/programs[/:slug]`, ready-trips carousel | Live, CMS-managed |
| Hotels/stays | `/hotels[/:slug]` (18 stays, map+price pins, NL search) | Live |
| Food | `/food` (intent-based, time-aware), `/restaurants` | Live, static menus |
| Rentals (bikes) | `/rentals[/:slug]` + provider panel | Live, real lifecycle |
| Transfers | `/transfers[/local\|/intercity]` | Live |
| Trip planner | `/trip-builder`, `/trip-preview`, `/plan-for-me` | Live wizard; AI generation semi-simulated |
| My Trip / bookings | `/my-trip[/day\|/activity]`, `/bookings`, `/quick-book`, `/book-now[?sku=]` | Live |
| Dahab Live | `/live` (weather/cameras/conditions) | Live w/ real Open-Meteo |
| DayGI concierge | `/daygi`, `/ai-director` alias | Live, deterministic-first |
| Static CMS pages | `/about`, `/faq`, `/travel-guides`, `/preview/:token` | Live, full workflow |
| Auth | `/auth/*` (password primary; Firebase gated) | Live |
| Ops console | `/ops-console` (19 sections, role-gated) | Live, extensive |
| Supplier portal | `/supplier-portal` | Live |
| Market intelligence | `/market-intelligence` | Live, ops-heavy |

### A.2 What's genuinely working (do not regress)
1. **Commerce engine (single-instance):** holds → availability → checkout → double-entry ledger → refunds, with idempotency keys, hash-chained entries, capacity invariants, and a 100×5 concurrency test. Simulated money, real state machine (`bookingLifecycle.ts`), lifecycle-gated supplier transitions.
2. **Deny-by-default API policy** (`apiAccessPolicy.ts`) + ownership masking + supplier pinning + payout-IBAN stripping. Best-in-class posture for an MVP.
3. **CMS as real infrastructure:** pages/blocks/media/homepage/nav/SEO + catalog bindings + strings/theme/site-info overrides, workflow (draft→schedule→publish→archive→rollback), expiring previews, revision snapshots, deny-price-smuggling field registries.
4. **Deterministic-first AI:** Gemini is polish over complete rule-based answers; quota circuit + canned fallbacks; DayGI never blocks on the model.
5. **Bilingual EN/AR throughout** (1228 keys, RTL, Arabic-first fonts), 6 AAA themes, a11y toggles.
6. **Real local data:** DKOS corpus (areas/places/activities/dining/facts), local-commerce ingestion with fingerprints + review queue, bookability reconciliation at boot.

### A.3 What's facade, broken, or missing (verified)
1. **P0-CLASS LIVE DEFECT (visual proof):** homepage hero renders the literal text `We\u2019ll handle the rest` — an unescaped unicode escape in the CMS hero title, visible on desktop + mobile. Fix: sanitize on save + repair the row. *(screenshot: home-desktop.png)*
2. **Payments are simulated** (`CAPTURED` without gateway unless `ALLOW_SIMULATED_PAYMENTS`); Paymob path fails closed and is unexercised live. Travelers can receive "confirmed" bookings with no charge.
3. **Trip generation invents prices** (`/api/trip/generate` returns `estimatedPriceEGP` with no DB price/availability join) and the local planner may not even call it — saved "AI" itineraries can contain unbookable items.
4. **Food ordering is static** (menus/timers, no POS, no courier, no live availability); `NEAR_ME_DATA` fallback can imply live inventory that doesn't exist.
5. **SMS/notifications are simulated** (`SM_SIM_*` seeds); SOS/driver SMS never leaves the server without Twilio config — ops can mistake seeds for dispatch.
6. **No 404** — typos and stale links render `/home`, hiding breakage and hurting SEO.
7. **Explore cards render dark/empty image blocks** in places *(screenshot: explore.png)* — image resolution fallback gaps.
8. **Supplier reliability is null-by-design** (honest, but then ops auto-actions run blind); market review queue is human-gated with no SLA.
9. **Multi-instance is unsafe**: in-memory state, per-process rate limits/LRU/quota, file locks, single-writer SQLite mandate. Cloud Run + 2 replicas = oversell + divergent CMS/quota.
10. **Postgres adapter is a no-op stub**; backups manual; audit archive unbounded; media has no variants/CDN/AV-scan; no ETag/Redis.
11. **E2E is manual scripts only** (`tests/browser-qa/*.mjs`, our `cms-advanced-qa.mjs` excepted); DayGI-live, paymob-replay, money-movement, offline pack untested.
12. **Register ignores `role`** (secure default, but silently — our QA had to promote out-of-band); no captcha/email-verify; no refresh rotation.
13. **No missing-AR CI** — absent Arabic silently renders English; `useContentPage` never refetches on slug change; dev simulator ships to prod bundle.

---

## B. CURRENT ARCHITECTURE AUDIT

### B.1 Frontend (`src/`, React 19 + Vite, no react-router)
Custom state router (`UIContext` + `routeUrl.ts` with exhaustive `ROUTES satisfies AppRoute`, `DEFAULT_ROUTE='/home'`); ~30 lazy views + prefetch map; provider stack Theme→Language→AppState(UI→Auth→Commerce→Intelligence→TripOs→Itinerary→Trip facade); server state via `useApiResource` (abort, stale-on-error, **no cache/dedup/TTL**) and `useCmsFetch` (API + compiled fallback); 1898-line `index.css` theme engine (6 AAA themes, CSS vars set by both stylesheet blocks and JS inline props); Tailwind v4 with `var()` utilities; Google Fonts via link. **Verdict:** coherent, well-factored, over-reliant on compiled fallbacks that mask outages; needs a data-fetching/caching layer, real 404, SSR-or-prerender for SEO, bundle discipline (1723kB post-split normalized by a raised warning limit).

### B.2 Backend (`server.ts` 3.6k lines + `server/`)
Synchronous boot (migrate → DKOS bootstrap → CMS schema/seed/media → bookability reconcile → listen); pipeline trust-proxy → helmet(no CSP) → json → cookies → correlation → optionalAuth → rate limiters → deny-by-default policy → 12 routers + ~120 inline handlers → SPA fallback with meta injection → error handler. In-process intervals only (retention/hourly, rental+commerce sweeps/60s, CMS publish/60s, locks/5s, rate GC/60s, async jobs/3s non-unref). JSON-lines structured logs with correlation IDs; RFC7807 errors; `/api/health` with subsystem status. **Verdict:** impressively hardened single process; fundamentally single-writer/single-instance.

### B.3 Data (`server/db/`)
`Database` singleton over ~46 in-memory collections; adapters sqlite (better-sqlite3, WAL, FKs, diffed shadow writes) / json (atomic, quarantine) / postgres (**stub — data loss on restart**) / memory (tests). `promoted-columns + data-JSON` spec pattern; FKs only for mandatory-owned refs (money rows indexed-not-FK to protect audit trail — correct). CMS tables properly relational. Seeds boot-critical (`dahab_local_commerce.json` throws if missing). **Verdict:** right shape for single-node; migration path needed: Postgres-first with the JSON/spec pattern ported, Redis for locks/quota/rate, object storage for media, event log for analytics. Fresh-DB seeding previously crashed on FK order — fixed + regression-tested during this audit cycle (`freshBootSeed.test.ts`).

### B.4 Dashboard/ops (`CommandCenterShell`, 19 sections)
Covers trips, commerce, pricing/inventory, suppliers, intelligence, knowledge, support, SMS, audit, flags, jobs, health, CMS (10 tabs), market. Strength: everything operable in one place with RBAC. Weaknesses: attention-routing is weak ("12 charts" syndrome — badges exist only for support/trips/exceptions); supplier reliability null; review queue without SLA; no fraud/risk signals; no revenue view; CMS tabs growing unbounded (11 and counting — needs grouping).

---

## C. UX/UI AUDIT (from live screenshots + code)

**What works visually:** cinematic reef hero with live conditions strip (26°C, sunset), intent-based food ("Hungry? … fits the time you have"), NL hotel search ("quiet place near the sea…"), map with price pins, aggregate ratings, bottom tab bar on mobile, strong information density without clutter. This is already above template-grade.

**Weaknesses with UX reasons:**
1. **Trust-breaking literal** (`\u2019` in H1) — P0 content-integrity fix.
2. **No visual fallback system**: dark/empty card images (explore), no skeleton-to-image discipline.
3. **Two truths in search**: server unified engine bypassed by client mappers + SearchDrawer triple-fetch; ranking unexplained to users (no "why this" affordance).
4. **Booking confidence gaps**: simulated-payment disclosure depends on one flag; cancellation/refund states not visualised as a timeline; no modification flow evident.
5. **Mobile is adapted, not designed**: desktop-first density, hero text overflows small screens awkwardly, floating buttons overlap content (screenshot), bottom dock + DayGI button compete.
6. **A11y debt**: single toast overwrites SR announcements, smooth-scroll ignores reduced-motion, modal focus traps unverified, Cmd+K suppressed on ops-console.
7. **Empty/error/offline states are thin**; offline pack exists but untested; CMS-failure fallback is silent (user sees stale compiled content with no signal).
8. **Design tokens leak** (hard hex, `text-dahab-ink`, font shim) — the system is 90% tokenized, which makes the last 10% the visible inconsistency.

---

## D. COMPETITIVE RESEARCH (Sept 2026 sources)

### D.1 Global OTAs — what to learn, what to refuse
| Player | Learn | Refuse |
|---|---|---|
| **GetYourGuide** (€1B revenue 2025, first profitable yr; 200k+ experiences) | Cancellation clarity (policy same place every listing), verified-buyer reviews, Originals quality line, reserve-now-pay-later flow | 20–30% commissions, reseller model (same tour, different logo), commission creep 2026 |
| **Viator** (400k+ experiences, Tripadvisor halo) | Catalogue depth, review volume for vetting | Aggregation-first quality, $29/product fee, monthly payouts, "customer always right" disputes, app cancellation complaints |
| **Klook** (48M visits/mo, APAC) | Owns trip *plumbing*: transfers, rail, SIM, passes — the unsexy logistics others ignore | Human/context-free: entry to a building, not time with a person |
| **Tiqets / Civitatis / Lokafy / Airbnb Exp.** | Tiqets: cleanest ticket path; Civitatis: language-native guiding; Lokafy: resident-led unscripted walks; Airbnb: personality-led | Single-vertical depth; Airbnb inventory now resells Viator/Tripadvisor stock |

**Structural lesson:** all OTAs monetize 15–30% take rates on *other people's* supply with monthly/bi-weekly payouts. A Dahab-native platform wins by **inverting the relationship**: supplier tools first (they keep margin + get paid fast), marketplace second.

### D.2 AI planners (Stardrift / MindTrip / Layla / Gemini / ChatGPT, 2026 head-to-heads)
- Winner pattern: **preference-driven brief → complete *bookable* itinerary without switching tools** (Stardrift), with priced hotels/flights/rail legs.
- Failure pattern universal: brilliant research front-loaded, **unbookable output**; ChatGPT "out-thought every tool and cannot book a thing"; Gemini dies on niche destinations; MindTrip's depth needs pushing; group/social planning (shared chat, TikTok/Map-pin imports) is the rising UX.
- GYG launched AI features Apr 2026 (Arival: 1 in 3 planning sessions now start with AI).
- **Our edge available:** everyone generates *documents*; nobody closes the loop to *verified inventory*. Our reconciler + holds + ledger is exactly the missing half — "AI that can only propose what it can actually sell."

### D.3 Dahab-local & Egypt landscape (the real battlefield)
- **WEEMAP Sinai (weemapsinai.com) — direct competitor.** Supabase-backed, Cairo↔Dahab bus (Sun/Thu) + Hiace packages, 25 stays with real photos/prices, WhatsApp concierge fallback, Arabic, merch/rent/community. Strong: real photos, simple packaging, human fallback. Weak: no AI planning, no real-time conditions, no diving/activity depth, no visible availability engine.
- **Fragmented incumbents:** ETL (dated 2022-style package tours), PADI directory (no booking depth), dive centers with own booking (Lagona, Desert Divers — modular pricing, PDF price lists), tourHQ (guide marketplace), BookRetreats (wellness vertical), Divingaway (dive-travel agency), Ask Dahab (content blog).
- **Pattern:** nobody owns *live* Dahab. Everyone sells static pages + WhatsApp. Real-time conditions (wind/sea), verified availability, and in-destination adaptation are unclaimed.

### D.4 Traveler pain signals (Reddit/forums/guides, 2025–26)
Wind-season confusion (kite Jun–Oct vs dive year-round), gear-quality anxiety, safety-perception gap about Sinai, "which area to stay" paralysis, transfer friction (SSH 1.5h, buses, checkpoints), group-size trust in dive courses (>4 = red flag), reef-protection expectations. **Every one of these is a product feature** (conditions engine, verified supplier badges, area-matching quiz, transfer guarantees, group-size filters, eco scoring) — not content.

---

## E. COMPETITIVE FEATURE MATRIX (who does what better)

| Capability | Us today | GYG/Viator/Klook | WEEMAP | PADI/dive shops | Winner today | Our path to win |
|---|---|---|---|---|---|---|
| Activity catalogue depth | ~17 acts, real data | 200–400k global | Shallow | Vertical-deep (dive) | OTAs | Depth via supplier self-serve, not aggregation |
| Real availability | Holds+slots, single-instance | Live inventory | Unknown (WhatsApp?) | Own booking engines | Tie (us/OTAs) | Multi-instance locks + supplier calendars |
| Real-time conditions (wind/sea) | Weather only, static telemetry | None | None | Wind calendars (blog-grade) | **Nobody** | Marine layer: wind/sea/visibility per spot, hourly |
| AI planning→booking loop | Generation w/o inventory join | AI features 2026, unbookable | None | None | **Nobody** | Availability-joined generation (our reconciler++) |
| Bilingual AR/EN depth | Full UI + content | Partial | AR present | EN mostly | **Us** | Keep; add dialect-aware copy |
| Supplier economics | 15% commission, portal exists | 20–30%, monthly pay | Unknown | Direct (0%) | Dive shops | Lower take + 24h payouts + free tooling |
| In-destination adaptation | DayGI concierge, trip health | None | WhatsApp human | None | **Us (early)** | DayGI as live companion, not chatbot |
| Trust/verification | Null reliability scores | Verified-buyer reviews | Unknown | PADI affiliation | GYG | Measured reliability (response time, confirm rate) |
| Packages/bundles | Ready programs (CMS) | Weak bundling | Bus+stay packages | Dive+stay packages | WEEMAP (packages) | Dynamic bundles with live pricing |
| Mobile experience | Adapted responsive | Mature apps | Unknown | Weak | OTAs | Mobile-first rebuild of top 5 journeys |

## F. PRODUCT WHITE SPACE (what nobody owns)

1. **Live Dahab conditions engine** — wind/sea/visibility/temperature per spot, hourly, with go/no-go per activity. Kiteboarders plan entire trips around this; today it's forum threads and wind calendars.
2. **Verified availability as the product** — every "Book now" backed by a hold; every AI suggestion joined to inventory. The industry's open wound (Viator cancellations, unbookable AI plans).
3. **Supplier-side OS** — free ops tooling (calendar, payouts in 24h, review management) in exchange for direct inventory. OTAs extract; we equip. This is also the moat: integrated suppliers can't be scraped.
4. **In-destination companion** — the trip doesn't end at checkout. DayGI evolves from concierge chat to ambient companion: "wind picked up, moved your 2pm kite to 9am tomorrow, rebooked gear, kept your dinner."
5. **Group + social planning** — shared-trip chat, split payments, interest reconciliation (MindTrip validated the pattern; nobody does it with booking attached).
6. **Long-stay/nomad OS** — monthly rentals, coworking passes, visa-run tracking, community. Dahab's actual growth segment, served by Facebook groups.
7. **Reef-positive travel** — eco scoring, diver impact budgets, reef fees routed to conservation. Differentiator with teeth in a marine reserve town.
8. **Arabic-first discovery** — Egyptian dialect search and content, not MSA-afterthought. No global player does this well.

**The one-line principle:** *"I don't need five travel websites anymore; Dahab knows the conditions, holds my spots, adapts my days, and pays my hosts fairly."*

## G. FUTURE PRODUCT VISION — Dahab OS v2

**Dahab becomes the destination operating system:** one account, one trip graph, one truth about conditions and availability — from first search to post-trip memory, for travelers, suppliers, and ops.

**Product pillars (evidenced, not template):**
1. **Live** — conditions, availability, trip state. The heartbeat everything else reads.
2. **Discover** — search + map + programs, availability-aware and explainable.
3. **Plan** — AI briefs joined to inventory; human review on request (Layla pattern, local agents).
4. **Book** — holds, transparent money, modification-first (not cancellation-first).
5. **Companion** — in-destination adaptation via DayGI + human ops fallback (WhatsApp-grade).
6. **Supply** — supplier OS: calendar, payouts, reviews, analytics. Margin for them, moat for us.
7. **Memory** — trips, reviews with teeth (verified-stay only), reef impact, repeat-visitor recognition.

**Differentiation answers:**
- *vs Google:* we hold inventory and know the wind at the Lagoon at 2pm; Google knows pages.
- *vs Tripadvisor/Viator:* verified availability + 24h supplier payouts + no 25% tax; reviews only from completed stays.
- *vs Booking/Airbnb:* destination depth (conditions, spots, transfers, food timing) attached to every stay.
- *vs Instagram:* inspiration that resolves to a bookable, adapted plan — not a saved post.
- *Why would a business choose us:* free ops software + 15% (not 25–30%) + next-day money + direct guest relationship.
- *Proprietary data:* per-spot condition histories, verified availability traces, supplier reliability measurements, trip outcome data. *Network effects:* more suppliers → denser availability → better AI → more travelers → more suppliers. *Hard to copy:* the reconciliation + ledger + local ops graph, not the UI.

---

## H. COMPLETE FEATURE MATRIX (condensed codes)

Legend — State: ✅ live · 🔶 partial/facade · ❌ missing · Priority: P0 critical · P1 core · P2 advanced · P3 experimental. Other columns: ✅ ok · 🔶 gaps · ❌ needed · — n/a.

| # | Feature | State | UX Problem | Opportunity | FE | BE | DB | Dash | AI | An | Sec | Tst | Pri |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Fix hero `\u2019` literal + content sanitizer | ❌ bug | Trust-breaking H1 | Integrity pipeline | ✅ | 🔶 | — | ✅ | — | — | — | 🔶 | P0 |
| 2 | Real payments (Paymob capture) | 🔶 | "Confirmed" w/o charge | Trustworthy money | 🔶 | 🔶 | ✅ | 🔶 | — | 🔶 | 🔶 | ❌ | P0 |
| 3 | Postgres-first persistence | ❌ | — (systemic) | Multi-instance, survival | — | 🔶 | ❌ | — | — | — | ✅ | 🔶 | P0 |
| 4 | 404 + SEO (prerender/meta) | ❌ | Silent dead-ends | Crawlable discovery | 🔶 | 🔶 | — | — | — | — | — | 🔶 | P0 |
| 5 | Booking timeline + modify flow | 🔶 | No visibility into states | Modification-first UX | 🔶 | ✅ | ✅ | 🔶 | — | 🔶 | ✅ | 🔶 | P0 |
| 6 | Real SMS/push delivery | 🔶 | Seeds mistaken for sends | SOS-grade reliability | 🔶 | 🔶 | ✅ | 🔶 | — | — | 🔶 | ❌ | P0 |
| 7 | Rate-limit/abuse shared state | 🔶 | — | Survive launch traffic | — | 🔶 | 🔶 | — | — | — | 🔶 | — | P0 |
| 8 | Backup schedule/retention/off-site | 🔶 | — | Disaster recovery | — | 🔶 | 🔶 | ✅ | — | — | — | — | P0 |
| 9 | Marine conditions engine | 🔶 | Static weather only | THE differentiator | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | — | 🔶 | P1 |
| 10 | Availability-joined AI generation | ❌ | Invented prices | Bookable AI | 🔶 | 🔶 | ✅ | — | 🔶 | 🔶 | ✅ | ❌ | P1 |
| 11 | Unified search (retire dual truth) | 🔶 | Unexplained ranking | Explainable search | 🔶 | 🔶 | 🔶 | — | 🔶 | 🔶 | — | 🔶 | P1 |
| 12 | Supplier calendar + 24h payouts | 🔶 | Portal w/o ops depth | Supplier moat | 🔶 | 🔶 | 🔶 | 🔶 | — | 🔶 | 🔶 | 🔶 | P1 |
| 13 | Measured reliability scores | ❌ | Null scores, blind ops | Trust data asset | 🔶 | 🔶 | 🔶 | 🔶 | — | 🔶 | — | 🔶 | P1 |
| 14 | Review integrity (verified-stay) | ❌ | No reviews module? | Trust moat | ❌ | ❌ | 🔶 | 🔶 | 🔶 | 🔶 | ✅ | ❌ | P1 |
| 15 | DayGI companion (ambient) | 🔶 | Chat-only | In-destination adaptation | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | ✅ | ❌ | P1 |
| 16 | Group planning + split pay | ❌ | Solo-only model | Social travel | 🔶 | 🔶 | 🔶 | — | 🔶 | 🔶 | ✅ | ❌ | P1 |
| 17 | Mobile-first top-5 journeys | 🔶 | Adapted desktop | Thumb-first UX | 🔶 | — | — | — | — | 🔶 | — | 🔶 | P1 |
| 18 | Image pipeline (variants/CDN) | ❌ | Dark/empty cards | Fast visual product | 🔶 | 🔶 | — | ✅ | — | — | ✅ | — | P1 |
| 19 | Missing-AR CI + i18n coverage | ❌ | Silent EN fallback | True bilingual quality | 🔶 | — | — | ✅ | — | — | — | ❌ | P1 |
| 20 | Long-stay/nomad OS | ❌ | Tourist-only model | Growth segment | 🔶 | 🔶 | 🔶 | 🔶 | — | 🔶 | ✅ | ❌ | P2 |
| 21 | Reef-positive program | ❌ | — | Brand + conservation | 🔶 | 🔶 | 🔶 | 🔶 | — | 🔶 | — | — | P2 |
| 22 | Human-agent review (Layla pattern) | ❌ | AI-only or nothing | High-trust bookings | 🔶 | 🔶 | — | 🔶 | 🔶 | 🔶 | ✅ | — | P2 |
| 23 | Dynamic bundles w/ live pricing | 🔶 | Static programs | WEEMAP-beating packages | 🔶 | 🔶 | ✅ | ✅ | 🔶 | 🔶 | ✅ | 🔶 | P2 |
| 24 | Offline pack (tested) | 🔶 | Untested | Sinai connectivity reality | 🔶 | — | — | — | — | — | — | ❌ | P2 |
| 25 | Ops attention routing | 🔶 | 12-charts syndrome | "What needs me now" | 🔶 | 🔶 | — | 🔶 | 🔶 | 🔶 | — | — | P2 |
| 26 | Fraud/risk signals | ❌ | — | Launch safety | — | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | — | P2 |
| 27 | Video media + S3 backend | ❌ | (deferred non-goal) | Rich content | 🔶 | 🔶 | — | ✅ | — | — | ✅ | 🔶 | P2 |
| 28 | Third language infra | ❌ | (deferred non-goal) | e.g. Russian/German dive markets | 🔶 | 🔶 | — | ✅ | — | — | — | 🔶 | P3 |
| 29 | Social discovery feed | ❌ | — | Repeat visitors | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | 🔶 | ✅ | — | P3 |
| 30 | Voice/concierge hands-free | ❌ | — | In-activity use | 🔶 | 🔶 | — | — | 🔶 | — | ✅ | — | P3 |

*Quick wins (≤1 week each): #1, #19, #4-meta-half, dashboard tab grouping, toast queue, reduced-motion scroll, `useContentPage` refetch, dead Firebase paths removal, dev-simulator stripping from prod bundle.*

---

## I. NEW INFORMATION ARCHITECTURE (route map)

**Public (keep all current routes; add marked ★):**
- `/` `/home` `/discover` (cockpit) · `/explore` + `/attractions` (merge views, one engine — kills dual truth) · `/experiences[/:slug]` · `/programs[/:slug]` + ★`/bundles` (dynamic packaging) · `/hotels[/:slug]` · `/food` + `/restaurants` (one surface) · `/rentals[/:slug]` · `/transfers[/...]` · `/live` (→ marine conditions hub ★ wind/sea/visibility) · `/daygi` (companion, not page) · `/plan` (★ NEW unified planner entry absorbing trip-builder/plan-for-me) · `/my-trip[/...]` · `/bookings` (★ timeline UI) · `/quick-book|/book-now` · `/profile` (★ +reviews/impact/nomad) · `/about|/faq|/travel-guides` · `/preview/:token` · ★`/groups/:id` (shared trip) · ★`/journal` (post-trip memory) · real `/404`.
- **Retire/merge:** `/listings` → into explore; `/ai-director` already aliases `/daygi`; `/transfers/local|/intercity` keep (good pattern).

**Business (`/supplier-portal` evolution):** profile · listings · calendar/availability · pricing/inventory · bookings inbox · customers · reviews · promotions · revenue/payouts · staff/roles · analytics. (Today: bookings split + extras only.)

**Admin (`/ops-console` evolution):** attention queue (new landing) · trips · commerce+ledger · suppliers · content (grouped tabs) · users · reviews/moderation · revenue · risk · AI monitoring · search analytics · system health · audit · flags · config. Retire nothing that works; regroup CMS tabs.

---

## J. NEW UX STRATEGY (journeys, condensed to decisions)

**J1. First-time discover → book (the money journey).** Goal: confidence in 3 taps. Entry: home/SearchDrawer. Steps: intent (NL + filters) → ranked results WITH availability badges + "why this" line → listing (real photos, verified reviews, clear cancellation) → hold (15-min timer visible) → checkout (price explainer: what goes to host) → confirmation + offline pack. Errors: sold-out mid-hold → instant alternatives (never dead-end); payment fail → hold preserved + retry. Success: booking timeline (not a voucher PDF). Empty: guided quiz, not blank grid.
**J2. Day in Dahab (companion loop).** Goal: the day adapts itself. Entry: morning brief push. Steps: conditions check → plan nudge → one-tap rebook on wind change → food timing → evening memory capture. Edge: no connectivity → offline pack carries the day.
**J3. Operator runs their business.** Goal: Sunday-night 10-minute ops. Entry: supplier portal inbox. Steps: booking request → accept (calendar blocks, payout scheduled, guest notified) → review exchange → weekly payout + analytics. Edge: overbooking attempt blocked with explanation; dispute opens evidence trail.
**J4. Ops saves a trip.** Goal: attention → action in 60 seconds. Entry: attention queue (SLA-ordered: SOS, unconfirmed, payment-stuck, review-flagged, stale). Every row: context, one-click remedy, audit auto-logged.
**J5. Group trip.** Goal: consensus without 40-message threads. Entry: share link. Steps: join → vote/constrain → AI reconciles → split-pay → shared timeline. Edge: member drops → cost recompute shown before confirm.

**UX principles (binding):** availability is truth (never show unbookable as bookable); every AI output carries provenance + fallback; destructive actions explain + undo where possible; Arabic is a first-class layout (not translated English); mobile thumb-zone owns primary actions; loading→skeleton→content→empty→error, every surface, no exceptions.

## K. DESIGN SYSTEM STRATEGY (Dahab visual language)

**Philosophy:** "nautical chart meets Bedouin textile" — deep-sea ink surfaces, brass/gold accents (already emerging: `#E8A33B`, brass CTAs), telemetry-green confirmations, Arabic-first typography. Memorable because it's *of the place*, not because it's loud.
**Concrete moves:** (1) codify the existing 6-theme token engine into `DESIGN_SYSTEM.md` (it IS the system — document, don't rebuild); (2) close the 10% token leaks (hard hex, font shim); (3) component contracts: cards (image→fallback→skeleton states mandatory), sheets over modals on mobile, sticky action bars, timeline component for bookings, explainability line component for search/rankings; (4) motion: one easing curve, reduced-motion respected everywhere, no decorative animation without UX purpose; (5) imagery: self-hosted responsive variants with focal points already stored — finish the pipeline (CDN + srcset), kill hotlink dependency; (6) AR test: every screen reviewed in Arabic RTL at 360px before sign-off.

## L. FRONTEND ARCHITECTURE (evolution, not rewrite)

Keep: custom router (add real 404 + `/preview` params already proven), provider stack, lazy routes + prefetch, CMS hooks pattern. **Add:** (1) data layer — SWR-style cache/dedup/TTL + offline queue (the single biggest FE lever: kills refetch storms, enables offline pack); (2) prerender/SSG for CMS + catalogue pages (SEO without SSR risk, extends existing meta-injection); (3) shared catalogue hooks to retire per-view mappers (Explore/Restaurants duality); (4) `useContentPage` slug-dep fix + missing-AR CI; (5) design-token lint (no hard hex, no new Unsplash — extend `imagery.test.ts`); (6) toast queue + SR-announcement separation; (7) bundle budget enforced in CI (undo the raised warning limit; split DayGI 1988-line view); (8) strip dev simulator + dead Firebase paths from prod bundle.

## M. BACKEND ARCHITECTURE (evolution)

Keep: deny-by-default policy, ownership masking, bodyParams on money paths, structured logs + correlation, idempotent commerce core, in-process sweeps. **Add, in order:** (1) Postgres as primary (port the spec pattern; keep SQLite for dev/test) — unlocks multi-instance; (2) Redis for rate limits, quota circuits, distributed locks (replacing file locks + in-memory maps); (3) object storage + CDN for media with signed admin writes; (4) job queue (persisted, DLQ) replacing in-memory asyncJobs + unref audit of all timers; (5) webhook hardening + Paymob live certification path; (6) cache headers/ETags on catalogue reads; (7) backup schedule + retention + restore drills; (8) split `server.ts` inline handlers into routers by domain (commerce, trips, daygi, ops) without changing behavior.

## N. DATABASE ARCHITECTURE

Keep the promoted-columns+JSON spec pattern and FK philosophy (mandatory-owned only). **Add:** Postgres DDL generator from `tableSpecs` (single source of truth, no drift); geospatial columns (PostGIS) for spots/routes; `reviews` (verified-stay FK), `payouts`, `shifts/staff`, `price_history`, `condition_readings` (time-series, partitioned), `analytics_events` (append-only) tables; indexes for search facets; migration runner with checksums (replace boot-if-exists drift); seed versioning. Analytics events stream to warehouse, never the OLTP DB.

## O. SEARCH ARCHITECTURE (first-class engine)

**One engine, both callers:** merge `unifiedSearchEngine` + client mappers; SearchDrawer becomes a thin client of it. Pipeline: NL parse (Gemini intent + keyword fallback, AR dialect aware) → facet filters → availability join (the killer feature: unbookable never ranks) → conditions join (wind/sea suitability per activity) → personalization (trip profile, past behavior) → ranking (relevance, rating integrity, reliability, margin-neutral) → **explanation line** ("picked for wind + your level + open now"). Index: Postgres trigram + PostGIS + materialized availability snapshots; autocomplete with typo tolerance; search analytics (query → refine → click → book funnel) feeding the ops dashboard. Contract-test the wire shape (extends `apiContract` pattern).

## P. AI ARCHITECTURE (capability with guardrails)

Keep deterministic-first + quota circuit + polish-timeout pattern. **Add:** (1) **availability-joined generation** — the generator may only emit SKUs/slots verified in-transaction (hallucination mathematically impossible for inventory/prices); free text clearly labeled as editorial; (2) persistent memory (Postgres, user-scoped, exportable/deletable); (3) multi-replica-safe orchestrator (DB-backed locks, idempotent actions); (4) human-agent handoff queue (Layla pattern: local ops reviews + completes high-value bookings); (5) eval harness in CI (golden itineraries, price-factuality, Arabic quality, boundary prompts — "5 EGP dive" must refuse); (6) cost controls per surface (budgets, caching, model tiers); (7) review summarization + semantic classification feeding search; (8) support copilot (draft replies, human sends). Rule that survives everything: **AI proposes only what the ledger can sell.**

---

## Q. BOOKING ARCHITECTURE (production-grade lifecycle)

```
DISCOVERY (availability badges, real prices)
  → HOLD (15-min visible timer, fenced slot lock, idempotency key)
  → CHECKOUT (price explainer: host share / commission / fees; cardLast4 only)
  → PENDING_CONFIRMATION (supplier SLA clock starts; auto-escalate on breach)
  → CONFIRMED (ledger: traveler debit → escrow; supplier payable 85%)
  → IN-PROGRESS (telemetry where real, DayGI companion active)
  → COMPLETED (payout scheduled 24h; review invitations both directions)
  → branches: MODIFY (re-price diff, re-hold) · CANCEL (policy engine: 24h-full default like GYG) · REFUND (partial-capable, commission reversal) · DISPUTE (evidence trail → ops queue)
```
Rules: every transition allow-listed (`canTransition` enforced in BOTH `bookingService` and `supplierService` — today only one calls it); oversell impossible across replicas (Redis/PG-advisory locks); money movement covered by persisted idempotency + hourly reconciliation job with pager on mismatch; traveler-facing timeline UI mirrors these states 1:1 (no hidden states).

## R. BUSINESS DASHBOARD (merchant OS, not listings page)

Modules in dependency order: profile → listings+photos → **calendar/availability** (the missing core) → pricing/inventory → bookings inbox (accept/dispatch with SLA timers) → customers → reviews (respond, dispute) → promotions → revenue/payouts (24h, transparent fees) → staff/roles → analytics (conversion, seasonality, wind-correlation) → notifications. Pricing to suppliers: **free tooling + 15% take + next-day payouts** vs OTA 20–30% + monthly — the pitch that builds the moat. Onboarding must be self-serve in Arabic (today: seeded/gated only).

## S. ADMIN DASHBOARD (attention-first ops)

New landing: **attention queue** (SOS → unconfirmed → payment-stuck → review flags → stale data, SLA-ordered, each with one-click remedy). Then: trips, commerce+ledger, suppliers, users, reviews/moderation, revenue, risk/fraud signals, AI monitoring (quota, eval scores, fallback rate), search analytics, CMS (regroup 11 tabs), system health, audit, flags, config. Every admin write already audit-logged; add before/after diffs for money actions.

## T. ANALYTICS (events + KPIs)

Event schema (append-only, warehouse-bound): `search{query,facets,results}`, `search_refine`, `result_click`, `listing_view`, `hold_start|expire`, `checkout_start|complete|fail(reason)`, `booking_modify|cancel|refund`, `review_submit`, `ai_interaction{surface,tokens,fallback}`, `supplier_accept|response_time`, `condition_view`. Funnels: search→book, hold→pay, AI brief→booking. KPIs: booking conversion, hold conversion, search success rate, AI-attach rate, supplier confirm SLA, payout latency, refund rate, repeat-visitor rate, reef-impact per trip. Dashboards: ops (realtime), product (weekly), supplier (per-business).

## U. SECURITY (threats + mitigations)

Keep: deny-by-default, ownership masking, IBAN stripping, HMAC-closed webhooks, upload byte-sniffing, scrypt+timing-safe, no card PAN. **Close:** (1) real payments certification + simulated-mode banner discipline; (2) captcha + email verification on auth; refresh rotation; (3) extend `bodyParams`/`queryParams` to all 120 handlers (money-first done); (4) admin action re-auth for payouts/refunds + IP allowlist option; (5) upload AV-scan + object-store signed URLs; (6) abuse/fraud signals (velocity, refund-rate, review-gaming); (7) secret rotation runbook + history scrub for the old seed default; (8) dependency + container scanning in CI; (9) PII minimization audit (ledger metadata, telemetry); (10) rate-limit shared state on Redis.

## V. TESTING (pyramid that gates releases)

Keep: 70+ domain unit tests, 7 security suites, contract tests, isolation tripwire, `cms-advanced-qa.mjs` Playwright flows. **Add:** integration suite (API+sqlite, seeded), E2E wired into CI (ephemeral env, seeded Admin, the 10 QA groups as specs), visual regression on hero/cards/checkout, a11y checks (axe) on 5 journeys, k6 perf budgets on search/checkout/homepage, security suite for new auth/payment paths, **AI eval harness** (golden briefs incl. the Arabic example from §7, price-factuality, boundary prompts), chaos/failover tests for multi-instance (locks, quota, jobs). Rule: red suite blocks merge; flaky test quarantined same-day with an owner.

## W. PERFORMANCE (targets + architecture)

Targets: LCP < 2.5s (4G), INP < 200ms, CLS < 0.1, TTI < 3.5s moto-G; API p95 < 300ms catalogue / < 800ms search / < 2s AI brief (streamed); Lighthouse ≥ 90 all routes. Levers: enforce bundle budget (revert raised limit), image variants+CDN+srcset, SWR caching + dedup, prerendered catalogue/CMS pages, Postgres indexes, Redis hot paths, SQLite→PG write-path removal from request path, Arabic font subsetting. Measure in CI, not locally.

## X. ROADMAP (dependency-ordered)

- **Phase 0 — Trust & integrity (4–6 wks):** P0 rows #1–8 (hero fix, payments live path, Postgres dev-parity start, 404+SEO, booking timeline, real SMS/push, shared rate limits, backups). Exit: production-checklist green, no simulated money.
- **Phase 1 — Discovery that sells (6–8 wks):** unified search + availability join + explanations; marine conditions v1 (wind/sea per spot); image pipeline; missing-AR CI. Exit: every "Book now" holdable; search funnel instrumented.
- **Phase 2 — Planning that closes (6–8 wks):** availability-joined generation; human-agent review; group planning v1; dynamic bundles. Exit: AI brief→booking conversion measured > baseline.
- **Phase 3 — Companion (ongoing):** ambient DayGI adaptation; offline pack tested; memory persistence; journal/memories. Exit: in-trip DAU + adaptation rate.
- **Phase 4 — Supply moat (8–10 wks):** supplier calendar, 24h payouts, reliability scoring, Arabic self-onboarding, review integrity. Exit: 50+ self-serve suppliers, confirm SLA < 2h median.
- **Phase 5 — Scale & harden (ongoing):** Postgres primary, Redis, object storage, job queue, E2E-in-CI, perf budgets, fraud signals, third language, video. Exit: 2-replica safe, restore drill passed.
Each phase: objective → features → files/modules → schema/API deltas → tests → acceptance criteria → rollback note. No phase starts with the previous one's acceptance criteria red.

## Y. RISKS

- **Technical:** Postgres migration complexity (spec pattern helps); multi-instance race conditions; payment certification timeline; Vite/React major churn; concurrent-edit collisions in-tree (already observed — branch discipline needed).
- **Product:** over-building vs WEEMAP's simplicity; AI cost overruns; Arabic quality bar; supplier cold-start (who lists first?).
- **Operational:** PII in `data/` + backups; payout fraud; Sinai connectivity assumptions; seasonality cash-flow for suppliers; regulatory (tour licensing, marine reserve rules).

## Z. DEFINITION OF DONE (transformation complete)

1. All P0 rows shipped with 15/19 feature-complete criteria (§21 in repo practice: UX→tests→a11y→perf→security→regression).
2. Booking conversion, search success, hold conversion, AI-attach, supplier SLA, payout latency dashboards live with 90-day history.
3. E2E + eval + perf + a11y gates green on main; flaky-test count zero.
4. Two-replica staging survives chaos tests (kill-one, partition, quota-exhausted) with zero oversell and zero lost bookings.
5. Restore-from-backup drill passed; secrets rotated; pentest findings closed.
6. 50+ self-serve suppliers; repeat-visitor rate climbing; reef-impact ledger public.
7. A first-time visitor can search → plan → book → travel → remember **without leaving Dahab**, on a mid-range Android, in Arabic, on Sinai bandwidth.

*End of blueprint. Approval requested before any production code.*

