# Playtest Report — Dahab Travel Platform (Full Website)

## Session Info
- **Date**: 2026-09-07 (UTC)
- **Build**: `2b4b210` — "feat: Bike rental marketplace — generic rental domain across backend, frontend, and provider portal" (dirty tree; `git status` shows local modifications across `server.ts`, `server/`, `src/`, `index.html`, `package.json`)
- **Duration**: ~45 min (automated: lint + 617 unit + 32 e2E ≈ 4 min; live smoke on throwaway DB + route/API probes + doc cross-reference ≈ 40 min)
- **Tester**: Muse Spark (automated + live-probe playtest, read-only except throwaway `/tmp/dahab-playtest-data`)
- **Platform**: PC desktop Chrome (Playwright Desktop Chrome, 1440×900) + mobile 390px (e2E) + direct API probes
- **Input Method**: KB+M (Cmd/Ctrl+K palette, theme dialog, nav), touch covered only via 390px viewport e2E (no gesture testing)
- **Session Type**: Targeted test — "test all the website": full public surface tour + auth gates + back-office gates + bilingual + automated regression

## Test Focus
All website flows, mapped from `src/App.tsx:233-450` routes and `tests/browser-qa/full-site-tour.mjs:1-247` tour list:

Home cockpit (`/`, `/home`, `/discover`), Explore (`/explore`), Hotels (`/hotels`), Attractions, Rentals (`/rentals`), Transfers hub (`/transfers`), Food (`/food`), Restaurants (`/restaurants`), Listings (`/listings`), Programs (`/programs`), Experiences (`/experiences`), DayGi concierge (`/daygi`, `/ai-director`), Plan-for-me (`/plan-for-me`), Trip builder/preview (`/trip-builder`, `/trip-preview`), My Trip (`/my-trip`), Bookings (`/bookings`), Quick-book commerce (`/quick-book`, `/book-now`), Arrival stages (`/arrive`, `/first-two-hours`), Change-recovery (`/change-recovery`), Help/SOS (`/help`), Dahab Live (`/live`), Departure/Post-trip (`/departure`, `/post-trip`, `/memories`), CMS static (`/about`, `/faq`, `/travel-guides`), Auth (`/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/verify`, `/auth/callback`), role-gated (`/ops-console`, `/supplier-portal`, `/market-intelligence`), plus global interactions: floating navbar + site map (`src/components/navigation/V2Navbar.tsx`), Cmd+K search drawer, theme selector, EN⇄AR switch, DayGi floating launcher, sticky booking bar, Ahmed journey walkthrough override.

Cross-referenced against design intent: `PRODUCT.md` (lifecycle-aware, locally authentic, bilingual-first, progressive depth, trust-through-transparency), `DESIGN.md` (Tidal Convergence), `AGENTS.md` (deny-by-default API, session identity, persistence adapters).

## First Impressions (First 5 minutes)
- **Understood the goal?** Yes. Hero contract is legible from code + e2E: "You made it to Dahab. We'll handle the rest." (`src/i18n/translations.ts:62`), one primary CTA per viewport per `DESIGN.md:102`, lifecycle recomposition per `PRODUCT.md:19`.
- **Understood the controls?** Partially. Four job-grouped nav (Discover / Stay & Taste / Getting Around / My Trip) + site-map grid (`DESIGN.md:76-82`) is a strong wayfinding model; Cmd+K spotlight and theme trigger (`#theme-selector-trigger-btn`) and DayGi floating button are present globally (`src/App.tsx:453-527`). Discoverability of Cmd+K and the Ahmed walkthrough pill is not self-evident on first paint (no visual affordance in static HTML shell).
- **Emotional response**: Engaged. Tidal depth system (`DESIGN.md:31-33`), live sea/air strip wired to `/api/telemetry/weather` instead of hardcoded values, and bilingual marine advisories give immediate "local + alive" signal.
- **Notes**: Static `index.html` shell is thin (5.4 kB) with correct meta/OG/RTL-ready scaffold; first meaningful paint depends on lazy route chunks (`src/App.tsx:32-68`) — good for Sinai mobile networks, but means first-5-minutes feel is entirely determined by home-chunk load + `/api/telemetry/weather` latency.

## Gameplay Flow (User Flow)
### What worked well
- **Automated regression is green across the board.** `npm run lint` (`tsc --noEmit`) clean; `npm test` = 51 node files (601 tests) + 3 UI files (16 tests) all pass; `npx playwright test` = 32/32 pass on `en` + `ar` (home, hotels, cms-content, command-center, mytrip-baseline). E2E explicitly asserts no horizontal overflow at 1440px and 390px.
- **Bilingual-first holds up in execution, not just docs.** `src/i18n/translations.ts` (~3617 lines), `LanguageContext` RTL/dir handling and `t()` fallback contract are unit-tested (`tests/ui/LanguageContext.test.tsx`); AR e2E suite passes identically to EN; marine advisories carry `statusAr` alongside English (`/api/dahab/conditions` probe).
- **Security posture verified by tests + probes.** Deny-by-default API gate (`server/middleware/apiAccessPolicy.ts` per `AGENTS.md`), session-identity (`req.user!.userId`), ownership assertions, `/api/auth/me` → 401 anonymous (correct), role gates render a gate (not the console) for anonymous on `/ops-console`, `/supplier-portal`, `/market-intelligence`. Security suite green: `apiAccessPolicy`, `authSession`, `bodyParams`, `logout`, `taskOwnership`, `rentalSecurity`, `queryParams`.
- **Lifecycle + progressive depth is real.** 12-stage journey (`prepare`/`arrive`/`experience`/`spontaneous` overrides in `src/App.tsx:168-230`), pre-arrival → early-arrival → first-two-hours → daily companion → change-recovery → departure → post-trip chain renders per route; per-view `ErrorBoundary` (`src/App.tsx:476`) + root boundary (`src/App.tsx:535`) + localized screen-reader route announcements (`src/App.tsx:102-131`) are thoughtful.
- **Live data, not mocks.** `/api/dahab/places` (17 places), `/api/dahab/activities` (22), `/api/dahab/transport` estimate, `/api/dahab/conditions` (3 zones with suitability), `/api/telemetry/weather` (live Open-Meteo: 32°C air / 27.5°C water in probe) all 200. CMS seed (27 editorial items, 9 header / 5 mobile / 11 footer nav, 15 media assets) boots cleanly.
- **No dead-code smell in UI.** Grep for `TODO|FIXME|HACK|XXX` in `src/*.tsx` returns zero hits; imagery registry test enforces no inline Unsplash URLs; API-contract test enforces no raw `/api` fetch outside `src/services`.
- **Ops surfaces work for the right roles.** E2E `command-center.spec.ts` + `cms-content.spec.ts` pass (Ops/Admin): console loads without auth wall for Operations, Ctrl+K palette opens, CMS create-from-template + autosave + nav add/delete pass.

### Pain points
- **[High] Seeded ledger fails its own integrity check on a FRESH throwaway DB.** `GET /api/health` on empty `/tmp/dahab-playtest-data` (twice, ports 3211/3212): `ledger.balanced:false`, `chainIntact:false`, 5/5 entries `signature does not match its contents`, escrow 20590 vs traveler -20800. Unit `ledger.test.ts` passes (tamper detection works), so the defect is in seed/signing, not verification. Directly conflicts with `PRODUCT.md:43` "trust through transparency" + `AGENTS.md` "ledger is integrity-checked". Any traveler-facing budget/escrow display inherits this distrust. — Severity: High
- **[Medium] Only 4/10 catalogue activities are actually bookable.** Boot log every run: "4 activities bookable, 6 downgraded to REQUEST_NOW (`act_eel_garden_sunset_snorkel`, `act_ras_abu_galum_boat_safari`, `act_laguna_windsurf_session`, `act_three_pools_guided_snorkel`, `act_wadi_gnai_rock_climbing`, `act_mount_twilat_bedouin_stargazing`)". Quick-book and "real availability, no bait-and-switch" (`PRODUCT.md:47`) promise is weakened for the majority of the catalogue. — Severity: Medium
- **[Medium] Google federated sign-in untestable in this environment.** Boot: `[Boot] Firebase federated sign-in: UNAVAILABLE (credentials missing)`, `firebaseAdminConfigured:false`; `/api/auth/firebase-session` will 503 by design. Email/password seed accounts work (4 users seeded), but the primary tourist path (Google one-tap) could not be playtested. — Severity: Medium
- **[Medium] Deny-by-default returns 401 for unknown routes, masking 404s.** Probe: `GET /api/does-not-exist` → 401 "Authentication Required" (same envelope as `/api/auth/me` anonymous). Secure, but a frontend dev or QA tester cannot distinguish "route doesn't exist" from "not signed in". The `apiContract` test informational note (90 server routes with no client caller) compounds the discovery problem. — Severity: Medium
- **[Low] `/api/content/pages` serves SPA HTML, not JSON.** Probe returned the 5.4 kB `index.html` shell. Either the CMS pages contract lives elsewhere (`/api/admin/content/*`, `/api/dahab/content/gallery` per contract test) or the docs/route naming misleads integrators. CMS e2E passes via the admin router, so impact is documentation/discovery, not breakage. — Severity: Low
- **[Low] HMR WebSocket error despite `DISABLE_HMR=true`.** Every boot (dev + Playwright webServer): `WebSocket server error: Port 24678 is already in use`. Harmless in QA but noisy; suggests the flag doesn't fully suppress the client HMR attempt. — Severity: Low
- **[Low] Supplier count unstable across boots on the SAME data dir.** First fresh boot health: `suppliers:58`; second boot same dir: `suppliers:45` (both `skus:54`). Either health counts differently from migration logs or seed is non-idempotent. Needs a controlled re-run before calling it a bug — flagged, not asserted. — Severity: Low
- **[Low] Payments are simulated.** Health: `paymentsSimulated:true`; Paymob webhook correctly rejects without `PAYMOB_HMAC_SECRET` (per `AGENTS.md`), but no real-money path was exercised in this session. — Severity: Low

### Confusion points
- Unknown-API → 401 envelope identical to auth-required (above): where does the API end and the SPA fallback begin? `/explore` → 200 HTML is correct; `/api/*` → 401-vs-404 ambiguity is not.
- `commercialReadiness: "80%+"` in `/api/health` — the remaining ~20% is unexplained in the response; QA cannot tell if it's the 6 REQUEST_NOW activities, payments simulation, or Firebase.
- `/daygi` and `/ai-director` resolve to the same `DayGiConciergeView` (`src/App.tsx:367-371`, with a comment noting a removed eager `AiDirectorView` import). Intentional consolidation, but analytics/SEO will double-count unless canonicalised (metaInjection covers per-route stamping — verify).
- `SEED_USER_PASSWORD` behaviour (no users if unset) + `ENABLE_TEST_ENDPOINTS=false` discipline are documented in `AGENTS.md` but invisible in the UI; a new QA engineer will waste a boot cycle learning them.

### Moments of delight
- EN⇄AR e2E parity (16/16 AR tests pass) — genuinely rare, honours "Arabic is not a translation layer" (`PRODUCT.md:65`).
- Zone-level marine advisories with Arabic strings and activity suitability ("Lighthouse Bay: ALL_ACTIVITIES_SAFE", "Laguna Windsurf Arena: OPTIMAL_WIND_CONDITIONS") — the "knows the tides" promise made concrete.
- Accessibility care beyond checklist: per-view error boundaries that preserve navbar/global actions, `role=status` route-loading fallback, localized screen-reader page announcements instead of raw route IDs (`src/App.tsx:94-101` comment tells the story).
- Command palette ownership rule (Command Center owns its own palette; global Cmd+K yields — `src/App.tsx:152-163`) — small, correct, shows systems thinking.

## Bugs Encountered
| # | Description | Severity | Reproducible |
|---|-------------|----------|--------------|
| 1 | Fresh-seed ledger fails integrity: 5/5 `signature does not match`, `balanced:false`, `chainIntact:false` on `/api/health` with empty data dir | High | Yes — twice (ports 3211, 3212), deterministic on fresh seed |
| 2 | Supplier count differs across boots on same dir (58 → 45, same `skus:54`) — possible non-idempotent seed or counting inconsistency | Low (needs confirm) | Observed once; needs controlled re-run |
| 3 | HMR WebSocket `Port 24678 is already in use` despite `DISABLE_HMR=true` | Low | Yes — every boot including Playwright webServer |
| 4 | `GET /api/content/pages` returns SPA HTML shell instead of JSON pages contract | Low | Yes — single probe; admin CMS router unaffected |
| 5 | Unknown `/api/*` route returns 401 instead of 404 (deny-by-default masks missing-route signal) | Low (DX) | Yes — `/api/does-not-exist` → 401 |
| — | NOT a bug (confirming): `/api/auth/me` anonymous → 401 with problem-details envelope; role-gated pages render gate for anonymous; `/explore` + unknown SPA routes → 200 HTML fallback | — | As designed |

## Feature-Specific Feedback
### Home cockpit (`/`, `/home`, `/discover`)
- **Understood purpose?** Yes — e2E asserts hero + journey entry + footer render with no overflow desktop + mobile.
- **Found engaging?** Yes — tidal hero + live conditions strip + tide-ledger quick services (`DESIGN.md:37-50`).
- **Suggestions**: Surface Cmd+K affordance and Ahmed walkthrough entry point visually; verify LCP on throttled 3G (lazy chunks help, hero media is the risk).

### Explore / Activities / Attractions / Listings / Programs / Experiences
- **Understood purpose?** Yes — `/api/dahab/places` (17) + `/api/dahab/activities` (22) return rich bilingual payloads.
- **Found engaging?** Partially — 6/10 spotlight activities downgraded to REQUEST_NOW blunts the "book now" impulse.
- **Suggestions**: Explain REQUEST_NOW inline (what happens next, response-time SLA); reconcile which 4 are bookable per season.

### Hotels / Restaurants / Rentals / Transfers / Food
- **Understood purpose?** Yes — dedicated views + detail + availability + WhatsApp concierge link (e2E `hotels.spec.ts` covers card → detail → price widget → availability → signed-in handoff to `/book-now?sku=` vs signed-out redirect to sign-in).
- **Found engaging?** Yes for hotels (deepest e2E coverage); rentals is newest surface (HEAD commit) — monitor for parity gaps vs hotels.
- **Suggestions**: Extend the hotels-spec pattern (contract + filters + detail + availability + auth-handoff + mobile overflow) to rentals/transfers/food; currently only hotels has that depth.

### DayGi AI concierge (`/daygi`, `/ai-director`) + Plan-for-me + Trip builder/preview
- **Understood purpose?** Yes structurally (floating launcher everywhere, `DayGiFloatingButton` in `src/App.tsx:526`); behaviourally untested here — Gemini quota circuit is tested (`geminiQuota.test.ts`), live key present (`geminiConfigured:true`, `exhausted:false`), but no conversational pass was run and quota-exhausted fallback (deterministic canned answers) was not exercised live.
- **Suggestions**: Playtest DayGi with key present AND with quota forced exhausted; confirm canned-answer disclosure; canonicalise `/daygi` vs `/ai-director`.

### My Trip / Bookings / Quick-book / Arrival / Recovery / Help / Live / Departure / Post-trip
- **Understood purpose?** Yes — lifecycle chain is the platform's differentiator and it is fully routed; `mytrip-baseline.spec.ts` snapshots tabs × languages.
- **Found engaging?** Unverified end-to-end (no booking was placed in this read-only session; `ENABLE_TEST_ENDPOINTS=false` discipline respected).
- **Suggestions**: Run one seeded-traveler booking on throwaway DB (hold → confirm → ledger → refund) to close the loop the ledger bug currently blocks.

### Auth (email/password + Firebase)
- **Understood purpose?** Yes — sign-in/sign-up/forgot/verify/callback routes exist; `humanizeAuthError` bilingual mapping tested; logout revocation + audit tested.
- **Found engaging?** Partially — email path testable; Google path 503s without creds (expected, but it IS the tourist default).
- **Suggestions**: Document the Firebase-less QA path (seed accounts per `SEEDED_ACCOUNTS.local.md`) at the top of the QA runbook.

### Ops console / Supplier portal / Market intelligence / CMS
- **Understood purpose?** Yes — role gates correct; Ops/Admin console + palette + CMS CRUD e2E green.
- **Suggestions**: Supplier-portal depth lags ops-console (no dedicated spec); rentals HEAD commit touches provider portal — add a supplier e2E mirroring `command-center.spec.ts`.

### i18n / Themes / Search / Global chrome
- **Understood purpose?** Yes — EN⇄AR toggle, 6-theme engine with dialog + `aria-checked` options, Cmd+K drawer, sticky booking bar, SOS dock.
- **Found engaging?** Yes — all three interactions are scripted in `full-site-tour.mjs` (lang toggle-back, `theme-option-lagoon-breeze`, Cmd+K dialog check) though that script was not executed live this session (Playwright suite was run instead).
- **Suggestions**: Execute `full-site-tour.mjs` against a throwaway port with screenshots for the visual/RTL/theme record; add reduced-motion + high-contrast assertions (promised in `PRODUCT.md:71-73`, untested here).

## Quantitative Data (adapted: site metrics in place of game metrics)
- **Errors (cf. "Deaths")**: 0 unit failures (617/617), 0 e2E failures (32/32), 0 type errors (`tsc --noEmit` clean), 0 `TODO/FIXME` in `src/*.tsx`; 1 high-severity live defect (seeded ledger integrity), 1 medium catalogue-availability gap, 3–4 low/DX issues. No error-boundary crashes observed in e2E (tour script's boundary regex would have caught them had it been run; e2E equivalents assert content render).
- **Time per area (coverage breakdown)**: routes enumerated in `App.tsx` ≈ 40 client routes; e2E covers home, hotels, CMS, command-center, mytrip-baseline (EN+AR); API probes covered `/api/health`, `/api/dahab/places|activities|transport|conditions`, `/api/telemetry/weather`, `/api/auth/me`, SPA fallback (`/`, `/explore`), 404-vs-401 behaviour. NOT covered live: DayGi conversation, booking placement/refund, departure/post-trip flows, transfers/rentals/food detail, CMS media upload bytes-check, Paymob webhook HMAC path.
- **Items used (cf. "Items used")**: `npm run lint`, `npm test` (both vitest configs), `npx playwright test` (full, EN+AR), throwaway-DB dev-server boots (ports 3211/3212), `curl` probes (health, dahab APIs, weather, auth, fallback), doc reads (`PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, `App.tsx`, tour script, translations head).
- **Features discovered vs missed**: Discovered — lazy route splitting with named-export preservation (`src/App.tsx:17-31` comment), per-route SEO stamping (metaInjection), offline/SOS dock, Ahmed 18-stage simulator; Missed (not exercised) — service-worker/offline pack behaviour, push/telemetry pipelines, market-intelligence depth, supplier payout IBAN flows (PII — correctly avoided), real Paymob signature path.

## Overall Assessment
- **Would play again? (Would ship / would return as traveler?)** Yes — with the ledger-seed defect fixed and the bookable-catalogue ratio improved or honestly messaged. Core loop (discover → plan → book → arrive → companion → recover → remember) is coherent and the automated safety net is unusually strong.
- **Difficulty (Complexity)**: Just Right. Progressive depth works: one-tap explore on the surface, full planner/budget/AI on demand. Risk is catalogue honesty (REQUEST_NOW without SLA explanation feels harder than it is).
- **Pacing (Navigation rhythm)**: Good. One primary CTA per viewport, single hero reveal, static sections below (`DESIGN.md:100-104`); lazy chunks keep the home path thin. Unverified on real 3G — measure LCP/CLS next.
- **Session length preference**: Good. Full tour is achievable in one sitting; Ahmed walkthrough compresses the 12-stage lifecycle for QA.

## Top 3 Priorities from this session
1. **Fix seeded-ledger signatures (High, trust-blocking).** Fresh DB must boot with `balanced:true, chainIntact:true`. Audit the seed signer vs verifier (key, canonicalisation, field order); add a boot-time or CI gate that fails on `integrityFailures.length > 0` for fresh seeds; re-run this playtest's health probe to close.
2. **Raise honest bookability (Medium, value-blocking).** Either restore the 6 REQUEST_NOW activities to bookable with real inventory/ Della, or design the REQUEST_NOW state as a first-class promise (SLA, concierge handoff, notify-me). They currently read as broken inventory against the "real availability" brand commitment.
3. **Close the booking loop on a throwaway DB (Medium, confidence-blocking).** Seeded-traveler hold → confirm → ledger → refund → health-green, plus DayGi happy-path + quota-exhausted fallback, plus `full-site-tour.mjs` screenshot pass (visual/RTL/theme record). This converts today's strong unit/e2E signal into traveler-trust signal.

---

## Phase 3: Action Routing

- **Design changes needed** (fun/confusion/intent conflicts): REQUEST_NOW as second-class state vs "real availability" promise; unknown-API 401-vs-404 DX; `/daygi` vs `/ai-director` canonical identity; `commercialReadiness:80%+` opacity. → Run `/propagate-design-change` on the affected design doc (catalogue/CMS + API-error conventions) to find downstream impacts before changing.
- **Balance adjustments** (numbers feel wrong): 4-bookable / 6-REQUEST_NOW split; escrow/revenue figures on seeded ledger (20590 / 210) once signatures are fixed — verify against pricing intent. → Run `/balance-check` on the catalogue/pricing system to verify the full balance picture before tuning values.
- **Bug reports** (reproducible defects): (1) seeded ledger 5/5 signature mismatch on fresh DB; (2 — pending confirm) supplier count 58→45 instability; (3) HMR 24678 conflict under `DISABLE_HMR=true`; (4) `/api/content/pages` serving SPA HTML. → Use `/bug-report` to formally track these (bug 1 as High).
- **Polish items** (friction/feel, later): Cmd+K discoverability; Ahmed pill affordance; throttled-network LCP/CLS measurement; reduced-motion/high-contrast assertions; supplier-portal e2E parity; rentals/transfers/food spec depth to match hotels; Firebase-less QA runbook note; `full-site-tour.mjs` screenshot archive. → Add to the polish backlog in `production/` when the team reaches that phase.

## Phase 3b: Creative Director Player Experience Review
CD-PLAYTEST skipped — Lean mode. (No `production/review-mode.txt`, no `--review` flag, no `.claude/docs/director-gates.md` → default `lean`; gate not a PHASE-GATE in lean.)

## Phase 5: Next Steps
Verdict: **COMPLETE** — playtest report generated.
- Act on the highest-priority finding category first (Bug 1: seeded ledger integrity).
- After addressing design changes (REQUEST_NOW promise, API-error convention): re-run `/design-review` on the updated GDD/product docs.
- After fixing bugs: re-run `/bug-triage` to update priorities, then re-run `npm run lint` + `npm test` + `npx playwright test` + the `/api/health` fresh-seed probe to close the loop.

## Fix verification (2026-09-07, same session — "fix all now")
All fixes below were applied to the working tree (uncommitted) and re-verified. Note: another agent session was editing the tree concurrently (CMS/home files); none of its files overlap with these fixes except shared `server.ts` HMR block, where both changes were reconciled (its `hmr: { server: httpServer }` attach for the enabled path + my `ws: false` kill switch for the disabled path).

1. **Seeded ledger integrity (High) — FIXED.** `server/db/migrations.ts`: seed now builds via exported `buildSeedLedgerEntries()` with signatures computed by the `LedgerService.calculateEntryHash` algorithm, chained from the genesis hash with `previousHash` on every row. Fail-closed one-time repair: auto-reseal runs only when the ledger holds exactly the 5 legacy rows and nothing else; DBs with real transactions on top keep failing loudly with an operator-reseal directive (tamper-evidence preserved). New `tests/domain/ledgerSeed.test.ts` (3 tests) pins fresh-seed verifies-clean. Live probe on isolated fresh DB: `balanced:true, chainIntact:true, failures:[]`.
2. **Supplier count 58→45 — NOT A PRODUCT BUG.** Root cause was probe methodology: two throwaway servers ran concurrently against the SAME data dir. Seed imports are upsert-idempotent. Two sequential isolated fresh boots report identical counts (58 suppliers / 54 SKUs both times). No code change; QA rule: one data dir per server (as `playwright.config.ts` already does).
3. **HMR 24678 collision — FIXED.** Root cause found in Vite 6.4 source: in middleware mode `createWebSocketServer` only early-returns on `server.ws === false`; `hmr: false` alone still binds 24678. Fix: `ws: false` in `vite.config.ts` and `server.ts` disabled branches; enabled path keeps the concurrent session's `hmr: { server: httpServer }` attach (no standalone port). Verified: zero 24678 errors in DISABLE_HMR boot log. (Port-derivation fallback retained in `vite.config.ts` for HMR-enabled multi-server runs.)
4. **`/api/content/pages` HTML — FIXED.** Added `GET /api/content/pages` list endpoint (published index, optional `?type=`) in `server/api/contentRoutes.ts`; covered by existing public `/content/` allowlist rule. Live probe: 200 JSON with 27 pages.
5. **Unknown-API 401 vs 404 — CLARIFIED (by design, kept 401).** Deny-by-default is the security posture (`apiAccessPolicy.test.ts` pins it); returning 404 for unknown would weaken fail-closed. Instead the 401 detail now states unknown paths return 401 by design + new test assertion locks it.
6. **`commercialReadiness: "80%+"` opacity — FIXED.** `/api/health` keeps the headline string (no consumer breakage) and adds `commercialReadinessDetail` with bookable/total/REQUEST_NOW ids/Firebase/payments breakdown. Live probe verified.
7. **`/daygi` vs `/ai-director` — FIXED.** `/ai-director` is now a canonicalising alias: mount effect does `replaceState` to `/daygi` + `navigateTo('/daygi')` (no extra history entry, no Back trap) in `src/App.tsx`.
8. **REQUEST_NOW UX — FIXED (copy).** `experienceDetail.notBookableBody` (EN+AR) now states the human-confirm path: supplier/ops confirms (usually within hours), nothing charged now, DayGi can arrange it. Deliberately did NOT invent inventory for the 6 activities — that would recreate the dangling-SKU defect `bookabilityReconciler` was written to kill.

**Re-verification signal:** `tsc --noEmit` clean · unit 53 files / 609 tests green · UI 3 / 16 green · e2e 32 / 32 green (one Ctrl+K palette flake on first full run under load, green on re-run and in isolation) · live probes above on isolated throwaway DBs (real `data/` untouched).
