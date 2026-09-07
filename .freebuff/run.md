# Run doc — Dahab Travel Platform (dev preview)

## 1. Reproduce the artifacts

This project is a Vite + React 19 SPA served by an Express server (`server.ts`) that also
proxies/mounts the Vite middleware. A fresh checkout needs:

1. **Install dependencies** (npm is canonical; `package-lock.json` is committed):
   ```
   npm ci
   ```
   (`better-sqlite3` ships prebuilt binaries; a rebuild is only needed if the platform
   lacks one.)

2. **Copy env files from the main checkout** (never commit real values; `.env` is gitignored):
   ```
   copy D:\dahab-—-travel-platform\.env  →  <worktree>\.env
   ```
   Copy the whole file as-is. Nothing in it is port-specific, so no adaptation is required.
   Minimum contents if starting from scratch: `PERSISTENCE_ADAPTER=sqlite` and a
   `SEED_USER_PASSWORD` (≥16 chars; boot refuses the historically-committed default).

3. **Data directory** — `data/` is gitignored runtime state, but boot needs the
   **seed** `data/dahab_local_commerce.json` (read-only seed; the server *throws* without it).
   If missing in a fresh checkout, copy it (and `data/instagram/`) from the main checkout.
   The runtime DB `data/dahab.sqlite` + WAL files can be copied for state, or recreated with
   `npm run db:migrate` (migrates from `data/dahab_db.json`).

## 2. Run the server

```
npm run dev          # tsx server.ts — honors PORT, default 3000
```

- **Port choice:** the app's default is 3000 (`server.ts`: `const PORT = Number(process.env.PORT) || 3000`).
  On this machine 3000 is occupied by an already-running instance of the project, so the
  preview uses **PORT=3001**. Override with the `PORT` env var — do not edit code.
- **Detach recipe (Windows)** — stdout and stderr MUST go to different files.
  IMPORTANT: `$env:PORT='3001'` set in the parent PowerShell is **NOT inherited**
  through Start-Process (the child gets a fresh environment — observed as the
  server binding port 3000 and dying with EADDRINUSE). Bake env vars into the
  child command line instead, via cmd.exe:
  ```powershell
  powershell -NoProfile -Command "(Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','set PORT=3001&& set DISABLE_HMR=true&& npm run dev' -WorkingDirectory 'D:\dahab-—-travel-platform' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
  ```
- **`DISABLE_HMR=true` for agent-edit sessions:** when another instance of this
  project holds Vite's HMR websocket port (24678), this instance's HMR client
  cannot connect and Vite's module graph goes stale after batches of file edits —
  observed as duplicated context modules (`?t=` URLs) causing
  `useTrip must be used within a TripProvider` on a freshly loaded page, and
  stale transforms served for files edited around a restart. Fix: restart the
  server with `DISABLE_HMR=true` (full reload picks up every edit; AGENTS.md
  documents this flag for exactly this mode).
- **Health check:** `GET http://127.0.0.1:<port>/api/health` → 200 with
  `{"status":"ok",...,"database":{"adapter":"SqlitePersistenceAdapter",...}}`.
  The homepage itself is served at `/` (Express mounts the Vite middleware; HMR works).

### Known-benign boot/runtime noise
- `WebSocket server error: Port 24678 is already in use` — the Vite HMR websocket port is
  shared with the other running instance; the app still serves and HMR degrades gracefully.
- `FirebaseAdmin: No usable credentials` — federated sign-in returns 503 without
  `FIREBASE_SERVICE_ACCOUNT_JSON`; everything else works.
- Browser console: `failed to connect to websocket` + a 401 for anonymous session endpoints +
  ORB-blocked mixkit.co hero videos (poster images render as fallback by design) are all
  expected outside production.

### Verification performed
- `/api/health` → 200, SQLite adapter active.
- `/` → 200 with Vite dev pipeline; full homepage renders (hero slider, season strip,
  trip entry, stories, micro-experiences, landmarks bento, gallery, quick services,
  final CTA, footer) in both the accessibility snapshot and a screenshot.

### QA session notes (2026-09-06, CMS admin dashboard CRUD)
- Full create/read/update/delete pass over Pages+Blocks, Homepage sections,
  Navigation, Media, SEO and Accommodations sources. Fixes landed during QA:
  1. `CmsContentDashboard` — clicking a sub-tab while the page editor was open
     changed `activeTab` but the editor kept overriding the content; tabs now
     clear `editingPageId` first (client-only, no restart needed).
  2. `contentService.rollback()` — revision payloads stored only field NAMES
     (`{fields:[...]}`), so rollback silently changed nothing. `update()` now
     logs changed VALUES, `create()` logs a full restorable snapshot, and
     rollback to a legacy payload is an explicit no-op returning the page.
  3. `cmsSeed.ts` — hero title/badge contained double-escaped `\\u2019`/
     `\\u00b7` literals; fixed in the seed and patched in the live DB row.
- `npm run lint` via the bash shim fails with `node is not recognized` (npm's
  cmd-shim under this shell); use `"C:/Program Files/nodejs/npx.cmd" tsc --noEmit`
  and `"C:/Program Files/nodejs/npx.cmd" vitest run` instead.
- Server-side edits (anything under `server/`) require the restart recipe above;
  client-only edits need a full browser reload when HMR is off.
- Native `confirm()` dialogs (media/navigation delete) block the automation
  thread — dismiss via preview_navigate to reset the page state.

### Enhancements session notes (2026-09-06, follow-ups)
- **History-tab rollback button**: page create/update revisions now show a
  Restore button in the Revisions tab (wired to the existing rollback API).
- **Debounced metadata auto-save**: `CmsPageEditor` PATCHes page metadata
  1.5s after the last keystroke; the explicit Save button only appears while
  a save is pending. Block edits were already instant.
- **Deep-linking**: `/ops-console#<section>` opens a console section directly
  and `/ops-console#cms/<subtab>` (e.g. `#cms/navigation`) opens the CMS
  dashboard on a sub-tab; active section/sub-tab is kept in the URL hash via
  `history.replaceState` (no re-render loops).
- **E2E spec**: `tests/e2e/cms-content.spec.ts` — 6 tests (en+ar) covering
  dashboard load, page create-from-template + live metadata auto-save
  verification through the admin API, and navigation item add/delete. Runs on
  the throwaway E2E data dir via the standard `playwright test` config.
- Navigation row icon buttons got aria-labels (`Edit item`, `Delete item`,
  `Hide/Show item`) for a11y and test targeting.
- All verifications green: tsc clean, 53/53 CMS unit tests, 6/6 new e2e.

### Remediation-plan completion session (2026-09-07)
Finished the outstanding workstreams of the approved plan
(.claude/plan-to-fix-all-peaceful-stearns.md) on top of the in-flight
Tailwind polish sweep:

- **Tailwind sweep completed** via `scripts/codemod-tailwind-sweep.ts`
  (1479 replacements across 125 files: transition-all → scoped property
  lists, uppercase/tracking-wider removal on traveler surfaces, tap-target
  enlargement, slate-950 → ink tokens). Admin mono badges and intentional
  ink-on-ink pairings excluded.
- **§2a reachability fixpoint**: deleted the 3 dead `src/components/hotels/`
  files; `scripts/find-unreachable.ts` now reports 0 unreachable.
- **§6b fonts**: index.html Google Fonts URL trimmed to real weights
  (Outfit 300..800, Alexandria 300..700, El Messiri ital 400..700, JBMono
  400–600); Plus Jakarta Sans ghost removed.
- **§6c head**: full SEO meta (og/twitter/canonical/hreflang/robots), SVG
  favicon (`public/favicon.svg`, Tidal Convergence mark), site.webmanifest,
  and a pre-hydration script setting `lang`/`dir` from the stored language.
- **§6d meta injection**: `server/utils/metaInjection.ts` (pure, unit-tested)
  + wiring in server.ts prod SPA fallback. Smoke test caught the CMS slug
  mapping (`/about` → `about-dahab`); fixed with an explicit path→slug map.
  og:image is absolutized against PUBLIC_BASE_URL. 11 unit tests.
- **§6e imagery registry**: `src/shared/placeholderImagery.ts` — all 43
  Unsplash literals in src/ replaced with named constants; guard test
  `tests/domain/imagery.test.ts` blocks new literals/URL drift.
- **§7b(ii) UI tests**: `vitest.ui.config.ts` (jsdom, no tests/setup.ts) +
  16 tests for useApiResource, useArrivalClock, LanguageContext/t. Wired
  into `npm test` (both projects).
- **E2E fix**: AccommodationCard card CTA now goes through t() with
  'accommodations.viewDetails' (was hardcoded عرض الفندق ternary; test
  updated to the new key).
- **Verification**: tsc clean; 601 node + 16 UI tests pass (54 files);
  build OK; e2e 12/12 incl. re-run of hotels + home after changes;
  reachability 0; index chunk 240.8 KB gzipped.

### CMS → homepage content QA pass (2026-09-07, preview-driven)
Drove `/ops-console#cms/*` in the live preview (session: admin@dahab.travel)
and traced dashboard edits to the traveler-facing homepage:

**Verified working (dashboard → DB → public API → live UI)**
- Homepage tab: hero section visibility toggle round-trips (API-verified
  `visible` flip both ways); hero title_en/title_ar PATCH persists and the
  section list reflects it. Fixed a pre-existing garbage string in the seeded
  AR hero title (`وصلت دهب؟ سيب الباقي علينا.?????????????` → cleaned).
- Navigation tab: add-link form → POST → public `/api/content/navigation/:menu`
  → **live navbar** (menu groups overlay CMS labels by route; extras append to
  the Discover group). Verified "رابط معرض QA" rendered in the opened header
  menu, then deleted; footer add also verified + cleaned. Note: the submit
  button inside the add form is "إضافة" — the "إضافة رابط" label is the
  toggle; menu defaults to footer unless "الرأس" is selected first.
- Ready-programmes carousel renders the CMS-served programmes
  (`/api/dahab/content/programmes`, 5 published).

**Wiring gaps found (dashboard saves data that never renders)**
1. `useHomepageContent()` (src/hooks/useCMSContent.ts) has zero consumers —
   GET /api/content/homepage hero/section config is saved by the dashboard but
   the hero is compiled data in V2HomeCockpit. Wire the hero to read it or
   drop the dead hook.
2. `useReadyProgrammes` maps CMS featured slugs via `^programme-(.+)$`, but the
   CMS seeds slugs as `dahab-first-timer` style — featured flags never reorder
   the carousel.

QA artifacts fully rolled back (header nav back to 9 items, footer to 11).

### Playtest session (2026-09-07, preview-driven, headless)
Drove the app as a first-time user through six flows: homepage exploration,
language switch, Plan-with-AI, navigation/deep-links, search drawer, and the
My Trip conversion path (plan → save → manage → delete).

**Passed**: hero slider pause/prev/next; ar↔en switch (dir flips, persists
across reload); Plan-with-AI (empty/whitespace disabled, real text enables,
rapid triple-click safe, generates a real plan); navbar group panels → /hotels
→ /hotels/:slug detail; browser back; reload on deep link; bad URL → homepage
fallback; search drawer (results, no-result guidance, ESC closes); Manage Trip
opens.

**Defects found & fixed**
1. `DELETE /api/trips/:tripId` did not exist and Manage Trip's four options
   were fake doors (toast only). A traveler who saved an AI plan could never
   remove it. Added the endpoint (blocks deletion while items are
   BOOKED/CONFIRMED — 409 —; drops SUGGESTED/HELD items; audited as
   TRIP_DELETED), `api.deleteTrip`, a real "Delete trip" option in the modal
   (confirm-guarded), and mapped the other options to real destinations
   (explore for add-activity; bookings tab for the two booking options).
   Verified end-to-end in the preview: delete → 0 trips on server → My Trip
   falls back to a fresh starter trip; homepage returns to first-visit variant.

**Verification**: tsc clean, 601+16 unit tests pass, 18/18 e2e
(home+hotels) pass, delete flow re-run green in live preview.

**Behavioral note**: creating any trip (including the auto starter) switches
the homepage to the returning-traveler variant, which hides the Plan-with-AI
widget; deleting the trip restores it.

### Plan implementation — CMS wiring + dev infra (final state)
All five workstreams implemented and verified:
- **A1** Hero wired to CMS: `useHomepageContent()` in V2HomeCockpit → `cmsHero` prop on CinematicVideoHero with compiled-data fallback. Verified live in EN+AR.
- **A2** Featured-programme mapping fixed: `canonicalProgrammeKey()` normalizes BOTH sides (CMS slugs and served-feed ids) to their suffix — prefixes are inconsistent on both sides (`dahab-first-timer` vs bare `couples-escape` id). Verified live: featuring `couples-escape` reorders the carousel to first; seed state restored (all featured=0). Tests in tests/domain/cmsSlugMapping.test.ts.
- **A3** Dead hooks removed from useCMSContent.ts (useGalleryPhotos, useCuratedStories, useExploreCategories, useHowItWorks, useTripPreviewDays). useTripProgrammes retained (feeds useReadyProgrammes).
- **B1** PlanWithAiWidget renders regardless of showHero (returning-traveler variant keeps the AI widget).
- **C1** Dashboard add-link form: header shows target menu ("Adding to X"), submit labeled "Add link/إضافة الرابط" distinct from the "Add Item/إضافة رابط" toggle.
- **D1** HMR routed through the app's own http server (vite `hmr: { server: httpServer }`, created before the vite branch); client no longer dials a phantom port 24679 — "[vite] connected." confirmed, no more ws 400.
- **D2** `npm run dev:fresh` clears node_modules/.vite before starting (dev-cache poisoning guard).
- **E** Verification: tsc clean · 611 node + 16 UI unit tests · build OK · 32/32 e2e · live dashboard→UI loops re-driven.

### CMS homepage section control — stats, marquee, essence (final state)
Three more homepage sections wired to the CMS homepage config (Homepage tab), completing editorial control:
- **stats** (HomeStatsBand): section config `{ items: [{id, value, suffix, label_en, label_ar, accent, icon}] }` — icon names anchor/eye/mountain/heart mapped to lucide. Fallback: compiled SOUNDINGS.
- **marquee** (HomeMarquee): config `{ items_en, items_ar }` (— separated). Fallback: i18n home.marquee.items.
- **essence** (HomeEssenceBento): config `{ eyebrow/title/subtitle/dive/food/explore/stay/help: { en, ar } }` — copy fields resolved per language with t() fallback per field; tile layout/routes stay compiled.
- **Visibility**: each component honors `visible === 0` (returns null). Public GET /api/content/homepage now returns ALL sections with the visible flag (previously filtered invisible ones out, so hidden sections silently fell back to compiled data); hero extraction still requires visible.
- Seed additions in server/db/sqlite/cmsSeed.ts (fresh installs) + upserted into the running DB via PATCH /api/admin/content/homepage/:sectionKey.
- Verified live: edited stats value/label → rendered on homepage; edited essence title → rendered; marquee visible:0 → hidden (0 marquee rows), visible:1 → shown with CMS items; all restored to seed after testing.
- Battery: tsc clean · 617+16 unit tests · build OK · 32/32 e2e (mytrip-baseline snapshot writes are flaky on Windows file-lock — passes on retry, unrelated).

### CMS homepage section control — all remaining sections (final state)
Extended CMS control to every homepage section. All read from the Homepage tab config + honor `visible === 0`:
- **final_cta** (FinalCTA): copy fields badge/headline/headlineAccent/supporting/ctaPrimary/ctaSecondary/footnote (per-lang {en,ar}), visibility. Verified live.
- **ticker** (HomeLiveTicker), **season** (TidalSeasonStrip), **trip_entry** (TripEntrySection), **stories** (CuratedStoriesRail), **micro** (DahabMicroExperiences), **landmarks** (DahabLandmarksBento), **gallery** (DahabPhotoShowcase): visibility-only gating (content is live-data or compiled), verified live for ticker + gallery.
- Visibility checks placed AFTER all hooks in every component (hooks-order safe).
- New section keys seeded in cmsSeed.ts for fresh installs + created in the running DB via PATCH.
- Verified: hiding gallery/ticker via API removes the section; editing final_cta copy reflects on homepage; all restored to seed after testing.
- Battery: tsc clean · 617+16 unit tests · build OK · 32/32 e2e.

### Labeled section editors + config round-trip fix (final state)
Homepage tab now has friendly labeled editors per section instead of raw JSON:
- **stats**: row-per-stat editor (value, suffix, label EN/AR, accent select Teal/Cyan/Amber/Rose, icon select anchor/eye/mountain/heart, remove + add buttons).
- **marquee**: two bilingual textareas (— separated items).
- **essence**: eyebrow/title/subtitle + per-tile fields for dive/food/explore/stay/help.
- **hero**: badge, subtitle, 3 CTA labels (EN/AR each).
- **final_cta**: badge/headline/headlineAccent/supporting/ctaPrimary/ctaSecondary/footnote.
- **visibility-only sections** (ticker/season/trip_entry/stories/micro/landmarks/gallery/footer): hint text — only the eye toggle applies.
- Advanced JSON textarea kept below for power users.

**Backend fix (real bug)**: `cmsHomepage.upsert` returned `config` as a raw JSON string while `findAll`/`findByKey` hydrate it to an object — so after ANY dashboard save the editor received a string and its labeled fields stopped working (and earlier restores clobbered configs to `{}`). Now upsert returns the parsed object; `CmsHomepageSection.config` type widened to `Record<string, any>`. Regression test added (tests/domain/cmsContentService.test.ts).

**Verified live**: stats value edit → save → persisted (config stays object) → editor re-opens with rows; essence/hero/final_cta/marquee/gallery editors all render; visibility toggle round-trip on stats; all seed configs restored (stats was found empty `{}` in the running DB and re-seeded).

**Battery**: tsc clean · 618 unit tests · build OK · 32/32 e2e.
**Server restart note**: `tsx server.ts` has no watch — server-side edits need a restart. Use `start-3001.cmd` (set PORT=3001; call npm.cmd run dev) started detached via PowerShell Start-Process on cmd.exe with full path.
