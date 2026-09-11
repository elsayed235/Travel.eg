# AGENTS.md

Dahab travel platform: a Vite + React 19 SPA (`src/`) served by an Express server (`server.ts` + `server/`). Bilingual (EN/AR).

## Commands (npm is the canonical package manager; CI uses `npm ci`)

- `npm run dev` — starts `tsx server.ts`. The dev server runs on `PORT` (default 3000).
- `npm run lint` — **this is the type-checker, NOT a linter.** It runs `tsc --noEmit` against `src/`, `server/`, `server.ts`. There is no ESLint. Run this before committing.
- `npm test` — Vitest unit suite. Only `tests/**/*.test.ts` runs. Do not run in parallel with a dev server on port 3000 (see data safety below).
- `npm test` enables verbosity and runs `tests/setup.ts`.
- `npm run build` — Vite build for the client + `esbuild server.ts --bundle --platform=node --format=cjs --packages=external`. The server bundle (`dist/server.cjs`) is NOT self-contained: it `require()`s `node_modules` at runtime, so the runtime image must carry production deps.
- `npm run db:migrate` (+ `--dry-run`, `--quarantine --force`) — migrate `data/dahab_db.json` → `data/dahab.sqlite`. `db:check`, `db:backup`, `db:schema`, `db:research` / `db:research:apply` are related one-off scripts; `db:research:apply` mutates data.
- Browser QA: `tests/browser-qa/*.mjs` are Playwright scripts **not wired into package.json**. They require the dev server already running on `http://localhost:3000` and manually extract/inject session cookies. Screenshots land in `tests/browser-qa/screenshots/`.

## Data safety & persistence (critical)

- **`data/` holds production state with PII**: user records, live session tokens, traveler phone/email, supplier payout IBANs, the ledger. `data/dahab_db.json`, `data/dahab.sqlite*`, `data/locks/`, `data/*.seq`, and `data/daygi_*.json` are runtime state and must **never be committed**. `.gitignore` ignores all of `data/` except the seed datasets.
- **Seeds are boot-critical and must be committed**: `data/dahab_local_commerce.json` and `data/instagram/` are read at boot by `runMigrationsAndSeed()`; `importDahabLocalCommerce()` **throws** if `dahab_local_commerce.json` is missing, so a checkout without them cannot start the server at all.
- Persistence is adapter-based, selected by `PERSISTENCE_ADAPTER` at boot (`server/db/selectAdapter.ts`):
  - `sqlite` (default) — real DB at `data/dahab.sqlite` (WAL, FKs, indexes). Best default.
  - `json` — the old single-file store `data/dahab_db.json`.
  - `postgres` — real persistence via the spec-pattern `save()` port (shadow-diff flush to the schema generated from `tableSpecs.ts` via `pgFlush.ts`; schema applied lazily with checksum-guarded migrations). Requires a connection (`DATABASE_URL` or `PG*`); boots refuse otherwise. Not yet certified against a live instance — do not flip the default.
- The test suite swaps the shared `Database` singleton onto an in-memory adapter in `tests/setup.ts` and installs an `fs` tripwire that **throws on any write to the real store**. Write tests against the in-memory adapter or a throwaway temp dir, never `data/dahab_db.json`. This is self-certification behavior — keep the tripwire test green.
- `server/db/paths.ts`: writable state dir `DAHAB_DATA_DIR` and read-only seed dir `DAHAB_SEED_DIR` are split (both default to `<cwd>/data` locally). In Docker they are separated so a volume over `/app/data` doesn't hide seeds. When moving files, respect the split.

## Architecture

- Server boot (in `server.ts`): `runMigrationsAndSeed()` → DKOS bootstrap → CMS schema/seed/media migration → bookability reconciliation, THEN the Express app is created.
- Most `/api/*` routes are defined **inline in `server.ts`** (auth, trips, support, market, daygi, jobs, telemetry). Separate routers live in `server/api/`: `dahabRoutes`, `adminDahabRoutes`, `contentRoutes`, `adminContentRoutes`, `dahabRoutes`. Don't assume a route lives in a router file.
- `server/middleware/apiAccessPolicy.ts` is a **deny-by-default** gate on `/api`; public/role exceptions are declared there. `optionalAuth` populates `req.user` from the session cookie/Bearer.
- `@/*` path alias maps to the repo **root** (not `src/`). Both `src/` and `server/` import via it.
- Vite splits vendor chunks (`vendor-firebase`, `vendor-maps`, `vendor-genai`, ...) with `manualChunks` to keep the homepage critical path thin — keep heavy imports lazy/manual-chunked. HMR is disabled when `DISABLE_HMR=true` (agent-edit mode).

## Security & auth conventions (do not regress)

- **Identity always comes from the session, never from the request body.** server.ts is full of documented fixes for IDOR/privilege bugs where `userId`/`role` used to be taken from the body or a path param. Keep `req.user!.userId` / `req.user!.role` as the source of truth and validate body params via `server/middleware/bodyParams.ts` (`requiredString`, `pickAllowedKeys`, etc.).
- Sessions: `dahab_auth_token` HttpOnly cookie; roles Traveler / Supplier / Operations / Admin. Firebase federated sign-in goes through `/api/auth/firebase-session` (token verified server-side; returns 503 if server cannot verify).
- Trip reads/mutations assert ownership (`mayActOnTripsOf`); the ledger is integrity-checked. Payments (Paymob) webhooks are rejected unless `PAYMOB_HMAC_SECRET` is set.

## i18n

- UI text is bilingual; recent work replaced hardcoded English/Arabic with `t()` calls. Use `src/i18n/translations.ts` for any user-facing string — do not revert to inline English.
- **Client/server dictionary split**: `translations.ts` is the authoring catalog and is SERVER-ONLY (`src/` must never import it — `tests/domain/i18nDictionarySync.test.ts` enforces this; a single import pins both languages into the importing chunk). The client loads per-language chunks (`src/i18n/dictionaries/{en,ar}.ts`, GENERATED by `npm run i18n:emit` after any copy edit) via `src/i18n/translator.ts`, installed before first render by the boot gate in `src/main.tsx`. Canonical `Language`/`TVars` types live in `src/i18n/resolve.ts`.

## Env notes

- `.env` is gitignored; `GEMINI_API_KEY` is required for real Gemini calls. `GEMINI_MODEL` defaults to `gemini-3.6-flash`.
- `SEED_USER_PASSWORD` seeds the demo accounts on a boot with an empty user table (no user if unset; must not be the previously-committed default).
- `ENABLE_TEST_ENDPOINTS` must stay `false` wherever real data lives — it exposes a route that writes real trips/bookings/ledger.
- Gemini result falls back to deterministic canned responses when no key or when quota is exhausted (`server/services/geminiQuota.ts`); check `geminiQuota` in `/api/health` rather than assuming a bug.

## Docs

There is no existing AGENTS.md/CLAUDE.md. Top-level `*.md` files (`DAYGI_*`, `PROJECT_*`, `*_REPORT.md`, etc.) are design/spec docs — read them for intent, but the executable source (server.ts, config, CI) is authoritative if they conflict.
