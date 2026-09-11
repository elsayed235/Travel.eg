# DAHAB — PHASE 0 REPORT
## Full 31-Part Audit (2026-09-10, verified)

*Method: repo audit (source), live run of the running app on :3000 (screenshots, DOM/console/network probes), baseline battery (tsc, 1074+23 unit, 32 e2e, build), ui-ux-pro-max database queries (12), 21st.dev catalog research (5 searches), prior 09-09 blueprint + certification cross-checked against current source.*

## 1–11. AUDITS
**1. Frontend** — React 19 + Vite 6 + Tailwind v4; custom state router (`routeUrl.ts`: 49 canonical routes, exhaustive union, canonical deep links, real 404); 37 lazy views + prefetch map; provider stack Theme→Language→AppState; manualChunks; Suspense + SR live regions. Server state via `useApiResource` (abort, requiresSignIn, stale-on-error — no cache/dedup/TTL; refetch storm network-verified) + `useCmsFetch` (compiled fallback can mask outages). 10% token leaks papered by ~800 lines `!important` rescue CSS. Emoji-as-icons 54 sites/14 files.

**2. UI** — Luxury Re-Skin verified live: liquid-glass chrome, warm stone, gold fire, 6 AAA themes, chart motifs, measured reading scale. Defects: emoji pills (/explore, /live), three competing floating clusters, occasional dark image blocks (fixed in later waves; re-verify in build).

**3. UX** — Strong: journey staging, context-aware food, NL hotel search, marine radar, designed empty states, DayGI trust footer, escrow copy, toast/SR separation. Weak: mobile adapted-not-designed, search dual-truth, no availability badges, thin zero-result recovery, offline pack untested, ops attention problem.

**4. Product** — Real: double-entry ledger (balanced 67,350 EGP live), holds/availability/capacity invariants, deny-by-default API policy, CMS workflow + catalog bindings, deterministic-first AI, 1,943 i18n keys, DKOS corpus. Facade/remaining: payments simulated, SMS simulated, Postgres not live-certified, multi-replica unsafe, food ordering static.

**5. Backend** — server.ts 4,568 lines + server/; hardened boot; deny-by-default; structured logs + correlation IDs; RFC7807; in-process intervals; 168 inline handlers; 72 services. Capability layer ahead of frontend (see §26).

**6. Database** — SQLite (WAL, FKs, diffed shadow writes); Postgres adapter with checksum-guarded DDL + diffed save() (not live-certified); 63 TableSpecs; money rows indexed-not-FK (correct); backups + retention scheduled; seeds boot-critical; data/ PII protected.

**7. Dashboard** — Ops: CommandCenterShell 19 sections, RBAC, audit-logged writes, CMS tabs grouped. Missing: attention landing, revenue, risk. Supplier: bookings + extras + rentals panel; missing calendar, payouts, reviews, analytics UI (services exist).

**8. API contracts** — api.ts (2,339 lines) single source of wire shapes; contract tests exist. Gaps: search lacks explanation payload; no alternatives endpoint; hold-expiry not exposed; ~161 client methods vs 168 handlers — full mapping in API_DEPENDENCY_MAP.md.

**9. Search** — Two truths (SearchDrawer triple-fetch vs unifiedSearchEngine); no autocomplete/recents/explanation/availability join surfaced/funnel analytics; thin zero-result.

**10. AI** — DayGI deterministic-first + quota circuit + context pills + memory + task execution with confirm-before-money; availability-joined generation shipped. Gaps: no CI eval harness, no ambient adaptation loop, partial human handoff, provenance polish.

**11. Booking** — Commerce engine production-grade server-side (holds, capacity, ledger, refunds, concurrency-tested). UI gaps: no visible hold timer, no sold-out→alternatives, timeline not surfaced everywhere, sim-payment disclosure flag-dependent, AR checkout un-QA'd.

## 12–15. RESEARCH
**12. Competitive** (09-09, valid; refresh via web during execution): OTAs (learn: cancellation clarity, verified reviews, trip plumbing; refuse: 20–30% take, reseller stock) · AI planners (winner: brief→bookable itinerary; universal failure: unbookable output — our ledger join is the missing half) · local (WEEMAP, ETL, PADI shops: nobody owns live Dahab).

**13. UX benchmarking** — GYG cancellation clarity; Klook logistics plumbing; WEEMAP real photos + WhatsApp + Arabic; nobody benchmarks telemetry-driven UI (doesn't exist).

**14. White space** — live conditions as product (marine shipped, needs productization); verified availability as product (holds shipped, needs card truth); supplier OS (calendar missing); ambient companion; group planning; long-stay; reef-positive; Arabic-first discovery; **telemetry-driven UI skin (novel)**.

**15. Product vision** — Dahab OS v2: one account, one trip graph, one truth about conditions + availability. Pillars: Live · Discover · Plan · Book · Companion · Supply · Memory.

## 16–25. TARGET ARCHITECTURES
**16. IA** — keep router/routes/deep links/404; add /groups/:id, /long-stay, reef-impact, supplier calendar/revenue/analytics, ops attention/revenue/risk; merge /listings→/explore; bottom nav ≤5.
**17. Design direction** — Living Chart — Sinai 2027 + environmental glass (see LIVING_CHART_DESIGN_SPEC.md). Alternatives rejected with evidence: Aurora template (generic, banned), Cyberpunk (wrong DNA), Anti-Polish raw (hurts commerce trust); "topographic contour" had no DB match (reported per skill contract).
**18. Design system** — MASTER.md codification + tokens + glass tiers + Living-Chart elements + enforcement tests (design-token, no-emoji, imagery, missing-AR CI).
**19. Frontend target** — keep router/providers/lazy; add query cache, shared catalogue hooks, View Transitions, shader hero, token-lint, bundle budget, DayGI split, prerender.
**20. Backend target** — keep security posture; add Postgres primary, Redis, object storage, job queue, Paymob/Twilio live, ETags, domain routers; new endpoints (explanation, alternatives, hold-expiry, attention aggregation, group split-pay, supplier calendar).
**21. Data target** — PostGIS, condition_readings time-series, analytics_events append-only, price history, payouts, staff, search analytics, availability snapshots, checksummed migrations.
**22. Search target** — one engine; NL→facets→availability→conditions→personalization→ranking→explanation; autocomplete/recents; zero-result quiz; funnel analytics.
**23. AI target** — eval harness, ambient adaptation, human handoff, provenance, memory (exportable), cost controls; AI proposes only what the ledger can sell.
**24. Supplier dashboard** — inbox-first → calendar (build) → revenue/payouts (build) → reviews (API shipped) → analytics; Arabic self-onboarding; 15% + 24h payouts.
**25. Admin dashboard** — attention queue landing → trips/commerce/suppliers/content/users/revenue/risk/AI/search/health; one-click remedies; audit-logged.

## 26. FEATURE MATRIX (KEEP/IMPROVE/REFACTOR/REPLACE + gaps)
KEEP: router, commerce core, CMS, DayGI trust model, 6-theme engine, reviews, marine, unified search engine, booking timeline, empty states. IMPROVE: cards (badges), SearchDrawer, mobile shell, food icons, ops attention. REFACTOR: emoji→Lucide, mappers→hooks, rescue-CSS→tokens, DayGI split. REPLACE: hero (→Living Chart), floating cluster (→dock). **Capability→UI gaps (built server-side, missing surface):** longStayService (no UI), reefPositiveService (no UI), groupPlanningService (partial: TripGroupSplitCard), supplierCalendarService (no UI), reliabilityService (ops-only), marineService (UI ✅), reviewService (UI ✅), unifiedSearchEngine (UI bypasses it).

## 27. PRIORITIZATION
P0: data layer, emoji sweep, dock de-crowding, baseline. P1: capability→UI, search consolidation, availability badges, Living Chart + glass, hold timers. P2: mobile-first, ops attention, supplier analytics, ambient DayGI, offline pack. P3: real payments/SMS, Postgres live, multi-replica, third language.

## 28. ROADMAP
P0 validation (this report) → P1 hygiene → P2 ship built capability → P3 Living Chart + glass + search → P4 booking & trust → P5 mobile-first → P6 ops/supplier attention → P7 scale & harden. Full field-set roadmap in the approved plan + FRONTEND_TRANSFORMATION_BLUEPRINT.md feature matrix.

## 29. TESTING STRATEGY
Pyramid (verified numbers): 95 node files (1074 passing), 5 UI (23), contract, 5 e2e specs (32 EN+AR). Per capability: unit + contract + e2e + visual regression + axe + AR 375px; vertical-slice gate; AI eval harness; perf budgets in CI; flaky quarantine.

## 30. PERFORMANCE STRATEGY
LCP <2.5s / INP <200ms / CLS <0.1 / API p95 budgets; bundle budget (index 875 kB today → enforce); query cache; image variants+srcset; font subsetting; prerender; WebGL GPU-only + CSS fallback; glass ≤2 backdrop layers; Lighthouse ≥90 in CI.

## 31. SECURITY STRATEGY
Keep: deny-by-default, ownership masking, IBAN stripping, HMAC webhooks, upload byte-sniffing, scrypt+timing-safe, session-only identity, price-immune apply-ai. Close: payments/SMS live + sim-banner discipline, captcha + email verify, refresh rotation, bodyParams everywhere, admin re-auth for money, AV scan + signed URLs, fraud signals, secret rotation, PII minimization, Redis rate limits.

---

## VERIFIED BASELINE (measured 2026-09-10)
tsc CLEAN · 1074+23 tests · 32/32 e2e · build green (index 875.52 kB gzip 256) · 6 themes · 63 tables · 72 services · 168 handlers · 198 components · 37 lazy views · 49 routes · 1,943 i18n keys · 54 emoji sites/14 files · gaps table (§26). Full battery re-run at every phase gate.