# Fix All Project Logic Issues — Execution Plan (approved)

User approved: full scope (findings 1–23), Traveler-only registration, full refund fix
(ledgerService + persist + commission reversal).

## Phase A — Security (highest value, lowest risk)
- **A1** `server.ts:561-565` + `authService.ts:64-108`: hardcode `Traveler` on public
  register; ignore body `role`. Add test asserting body `role` is ignored.
- **A2** `dahabRoutes.ts:341-354` (`/commerce/suppliers`) and `:686-716`
  (`/commerce/search`): strip `payoutAccountNumber` for non-Ops/Admin (mirror
  `server.ts:1760-1765`). Add test asserting no IBAN in anon response.
- **A3** `apiAccessPolicy.ts:61-95`: add `ROLE_RULES` gating
  `/dahab/commerce/*` ops mutations (review-queue/resolve, jobs/*, run-all-scheduled,
  alerts/*/acknowledge|resolve, snapshots/*, circuit-breakers/reset, refresh) to
  Operations/Admin (market refresh also Product).

## Phase B — Authz / identity (IDOR, cross-user)
- **B4** `server.ts:2034-2038` `/api/notifications`: scope to `req.user.userId`; gate
  `'ALL'` behind Ops/Admin.
- **B5** `server.ts:1778-1787` supplier booking status: `resolveActingSupplierId` +
  booking ownership + `supplierState` whitelist.
- **B6** `server.ts:1438-1457` hold, `1494-1508` multi-checkout, `1631-1685` checkout:
  assert trip ownership vs `req.user.userId`; remove demo fallbacks and standalone
  refund-capture path.
- **B7** `server.ts:1515-1542` + `recoveryService.ts:30-34`: assert trip ownership in
  substitute.
- **B8** Daygi `server.ts:922-988` (read, cancel, apply-recovery, execute-step): assert
  `task.userId === req.user.userId`.

## Phase C — Business logic / broken flows
- **C9** `recoveryService.ts:42-79` + `paymentService.ts:282-321`: refund keyed to the
  trip/ledger, not a phantom bookingRef (fixes always-409 substitute).
- **C10** `server.ts:1885-1927` `/api/operations/refund`: route through
  `ledgerService.recordDoubleEntry`, cap to refundable amount, 15% commission reversal,
  persist via `db.runInTransaction`. Tests for ledger integrity staying intact.
- **C11** `commerceService.ts:343-546`: make bookings/totals idempotent on idempotencyKey.
- **C12** `paymentService.ts:257-261`: fix inverted guard so FAILED transition works.
- **C13** Dedupe 4 duplicate handlers (`server.ts:468/2752` weather, `503/2840` cameras,
  `1090/2008` jobs/status, `1099/2014` jobs/enqueue), keep the real ones.
- **C14** Sweep server for leftover `require()` in ESM context.

## Phase D — Frontend (Command Center / Intelligence)
- **D15** `MarketIntelligenceView.tsx:1007-1060`: render schedule policies as policy cards
  (like `MarketJobsSection`), guard `logs.map`.
- **D16** `MarketIntelligenceView.tsx:131-141` + `api.ts:1134-1137`: read `data.health`,
  map `SourceHealthEntity` -> render fields.
- **D17** `SystemHealth.tsx:41,89-94,154-188`: correct weather (flat), cameras (`spots`),
  jobs card fields.
- **D18** `Overview.tsx:256-267`: wire Recent Events to `api.getRecentEvents()`.
- **D19** `MarketIntelligenceView.tsx:144-158`: render alerts separately, no garbage merge
  into change events.
- **D20** `api.ts:1134-1143`: correct declared types (source health, review queue).
- **D21** i18n `t()` conversion across SystemHealth, KnowledgeOps, IntelligenceCommand,
  ExceptionsCenter, MarketIntelligenceView.
- **D22** `recoveryService.ts:47-58`: record correct previousTitle.
- **D23** `Overview.tsx:88`: drop unused `supplierBookings` fetch.

## Verification (each phase)
- `npm run lint`, `npm test` (add tests for A1/A2/A3, C9/C10/C11/C12).
- Restart dev server; probe as anon (register -> Traveler only, no IBAN) and as Admin.
- Browser-qa for Command Center tabs (crawls no crash, sources/weather/cameras real data).

## Notes / risks
- C10 and C11 are behaviorally nuanced; flag before committing large diffs.
- D19/D21 are pure-frontend, larger diff surface, low runtime risk.