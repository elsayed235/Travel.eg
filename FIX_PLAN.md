# Backend–Frontend Gap Fix Plan

**Date:** August 31, 2026  
**Status:** Plan only — no code changes  
**Scope:** Fix all orphaned endpoints, dead frontend methods, duplicate routes, and missing middleware

---

## Table of Contents

1. [Execution Overview](#1-execution-overview)
2. [Phase 1: Critical — Fix Broken Frontend Methods](#2-phase-1-critical--fix-broken-frontend-methods)
3. [Phase 2: High — Connect Orphaned Backend to Frontend](#3-phase-2-high--connect-orphaned-backend-to-frontend)
4. [Phase 3: Medium — Consolidate Duplicate Routes](#4-phase-3-medium--consolidate-duplicate-routes)
5. [Phase 4: Medium — Add Missing Middleware](#5-phase-4-medium--add-missing-middleware)
6. [Phase 5: Low — Build Missing Admin UI](#6-phase-5-low--build-missing-admin-ui)
7. [Phase 6: Low — Cleanup Dead Code](#7-phase-6-low--cleanup-dead-code)
8. [Detailed Task Breakdown](#8-detailed-task-breakdown)
9. [Dependency Graph](#9-dependency-graph)
10. [Risk Assessment](#10-risk-assessment)

---

## 1. Execution Overview

```
Phase 1 ─── Fix 5 broken frontend methods (silent failures)         [1 day]
Phase 2 ─── Wire 8 orphaned backend endpoints to frontend views     [3 days]
Phase 3 ─── Consolidate 14 duplicate routes into one namespace      [1 day]
Phase 4 ─── Add 5 missing RBAC checks on public endpoints          [0.5 days]
Phase 5 ─── Build admin dashboard for 17 DKOS endpoints            [5 days]
Phase 6 ─── Remove dead frontend methods and duplicate imports      [0.5 days]
                                                       Total: ~11 days
```

---

## 2. Phase 1: Critical — Fix Broken Frontend Methods

These frontend methods call endpoints that **don't exist**, causing silent failures (returning null or throwing caught errors).

### Task 1.1: Add `/api/telemetry/weather` endpoint

**File to modify:** `server.ts`

**What to do:**
- Add a `GET /api/telemetry/weather` route
- Call `weatherService.getCurrentConditions()` (already implemented in `server/services/weatherService.ts`)
- Return the `DahabConditions` object or `{ available: false }` if null
- The weather service already fetches from Open-Meteo with caching and timeout

**Endpoint shape:**
```
GET /api/telemetry/weather
→ 200: DahabConditions | { available: false }
```

**Frontend consumer:** `api.getWeatherTelemetry()` in `SinaiRadarWidget`, `DahabLiveView`, `ChangeAndRecoveryView`

**Why it's broken:** `weatherService.ts` exists and works, but no route exposes it. The frontend catches the 404 and returns null, so the radar widget shows no data.

---

### Task 1.2: Add `/api/telemetry/cameras` endpoint

**File to modify:** `server.ts`

**What to do:**
- Add a `GET /api/telemetry/cameras` route
- Return a static list of 4 camera locations (Lighthouse, Blue Hole, Eel Garden, Laguna) with status, stream URL placeholders, and current conditions
- This is a presentation endpoint — no real cameras exist, but the data should come from the server, not be hardcoded in the component

**Endpoint shape:**
```
GET /api/telemetry/cameras
→ 200: { cameras: Array<{ id, name, nameAr, location, status, streamUrl, conditions }> }
```

**Frontend consumer:** `api.getCameraFeeds()` in `DahabLiveView`

---

### Task 1.3: Add `/api/commerce/ledger` and `/api/commerce/ledger/verify` endpoints

**File to modify:** `server.ts`

**What to do:**
- Add `GET /api/commerce/ledger` — return `db.ledgerEntries` (the in-memory double-entry ledger)
- Add `GET /api/commerce/ledger/verify` — call `ledgerService.verifyLedgerIntegrity()` (already implemented) and return the verification result
- Both require `requireRole('Operations', 'Admin')` (already enforced by `apiAccessPolicy`)

**Endpoint shape:**
```
GET /api/commerce/ledger
→ 200: { entries: LedgerEntryEntity[], count: number }

GET /api/commerce/ledger/verify
→ 200: { valid: boolean, totalEntries: number, lastHash: string, ... }
```

**Frontend consumer:** `api.getLedger()`, `api.verifyLedger()` in `OperationsConsoleView`

---

### Task 1.4: Add `/api/transfers/telemetry/:bookingId` endpoint

**File to modify:** `server.ts`

**What to do:**
- Add `GET /api/transfers/telemetry/:bookingId`
- Look up `db.transferTelemetry` by bookingId or referenceCode
- Return the telemetry record or 404

**Endpoint shape:**
```
GET /api/transfers/telemetry/:bookingId
→ 200: TransferTelemetryEntity
→ 404: { error: 'Telemetry not found' }
```

**Frontend consumer:** `api.getTelemetry()` in booking components

---

### Task 1.5: Add `/api/suppliers` (list) and `/api/suppliers/:supplierId/bookings` endpoints

**File to modify:** `server.ts`

**What to do:**
- Add `GET /api/suppliers` — return `db.suppliers` (filtered by active status)
- Add `GET /api/suppliers/:supplierId/bookings` — return bookings for a specific supplier
- Both require auth; the supplier list is public for browsing, supplier bookings require matching role

**Endpoint shape:**
```
GET /api/suppliers
→ 200: { suppliers: SupplierEntity[], count: number }

GET /api/suppliers/:supplierId/bookings
→ 200: { bookings: BookingEntity[] }
```

**Frontend consumer:** `api.getSuppliers()`, `api.getSupplierBookings()` in `SupplierPortalView`

---

## 3. Phase 2: High — Connect Orphaned Backend to Frontend

These backend endpoints exist and work, but no frontend component calls them.

### Task 2.1: Wire emergency resources to HelpMeNowView

**Files to modify:**
- `src/components/help/HelpMeNowView.tsx`
- `src/services/api.ts` (add `getEmergencyResources()` method)

**What to do:**
- Add `api.getEmergencyResources()` calling `GET /api/dahab/emergency`
- In `HelpMeNowView`, fetch emergency data on mount
- Replace hardcoded hotline numbers with API data
- The API already returns verified contacts: Hyperbaric Chamber, Hospital ER, Tourism Police

**Data flow:**
```
HelpMeNowView mounts → api.getEmergencyResources() → GET /api/dahab/emergency
→ Render hotlines from db.emergencyResources + hardcoded emergency numbers
```

---

### Task 2.2: Wire area profiles to ExploreView

**Files to modify:**
- `src/components/explore/ExploreView.tsx`
- `src/services/api.ts` (add `getDahabAreas()` method)

**What to do:**
- Add `api.getDahabAreas()` calling `GET /api/dahab/areas`
- In ExploreView, fetch areas on mount alongside places and activities
- Add an "Areas" tab or section showing area profiles with atmosphere, walkability, noise profile
- Each area card links to its detail via `GET /api/dahab/areas/:id`

**Data flow:**
```
ExploreView mounts → api.getDahabAreas() → GET /api/dahab/areas
→ Render area cards with nameEn/nameAr, atmosphere, activityAffinity
→ Click area → GET /api/dahab/areas/:id → show places, activities, dining in that area
```

---

### Task 2.3: Wire supplier catalog to booking flow

**Files to modify:**
- `src/components/booking/BookingHotelStep.tsx` (and other booking steps)
- `src/services/api.ts` (add `getCommerceSuppliers()`, `getCommerceOffers()`)

**What to do:**
- Add `api.getCommerceSuppliers()` calling `GET /api/dahab/commerce/suppliers`
- Add `api.getCommerceOffers()` calling `GET /api/dahab/commerce/offers`
- In booking steps, fetch real supplier data alongside curated data
- Merge real suppliers with curated fallbacks (real data takes priority when available)

**Data flow:**
```
BookingHotelStep mounts → api.getCommerceSuppliers({ category: 'hotel' })
→ Merge with CURATED_HOTELS → render combined list
```

---

### Task 2.4: Wire unified search to SearchDrawer

**Files to modify:**
- `src/components/common/SearchDrawer.tsx`
- `src/services/api.ts` (add `searchDahab()` method)

**What to do:**
- Add `api.searchDahab(query)` calling `GET /api/dahab/search?q=...`
- The backend's `unifiedSearchEngine.search()` already supports natural language queries in Arabic and English
- Replace the current 3 parallel fetches (places, activities, dining) with a single unified search call
- Keep the parallel fetches as fallback if the unified search fails

**Data flow:**
```
SearchDrawer user types → api.searchDahab(query) → GET /api/dahab/search?q=...
→ Returns { results: [...], suggestions: [...] }
→ Render unified results with relevance ranking
```

---

### Task 2.5: Wire regulations to PreArrivalBriefing

**Files to modify:**
- `src/components/briefing/PreArrivalBriefing.tsx`
- `src/services/api.ts` (add `getRegulations()` method)

**What to do:**
- Add `api.getRegulations()` calling `GET /api/dahab/regulations`
- In PreArrivalBriefing, fetch regulatory decrees on mount
- Add a "Regulations & Permits" section showing official CDWS and Ministry of Tourism decrees
- Currently the briefing has hardcoded cultural tips; real regulations add authority

**Data flow:**
```
PreArrivalBriefing mounts → api.getRegulations() → GET /api/dahab/regulations
→ Render regulatory decrees with titleEn/titleAr, authority, effectiveDate
```

---

### Task 2.6: Wire market intelligence data to MarketIntelligenceView

**Files to modify:**
- `src/components/intelligence/MarketIntelligenceView.tsx`
- `src/services/api.ts` (add multiple methods)

**What to do:**
- Add `api.getMarketPriceHistory()` calling `GET /api/dahab/commerce/price-history`
- Add `api.getMarketTrends()` calling `GET /api/dahab/commerce/market-trends`
- Add `api.getMarketStats()` calling `GET /api/dahab/commerce/market-stats`
- Add `api.getMarketSourceHealth()` calling `GET /api/dahab/commerce/source-health`
- In MarketIntelligenceView, replace mock data with real API calls
- Add price history charts, trend visualizations, source health dashboard

**Data flow:**
```
MarketIntelligenceView mounts →
  api.getMarketStats() → price ranges per activity
  api.getMarketTrends() → temporal trends
  api.getMarketSourceHealth() → source reliability
→ Render data-driven dashboards
```

---

### Task 2.7: Wire knowledge gaps to Admin Dashboard

**Files to modify:**
- New component: `src/components/admin/KnowledgeGapsView.tsx`
- `src/services/api.ts` (add admin methods)

**What to do:**
- Add `api.getKnowledgeGaps()` calling `GET /api/dahab/admin/gaps`
- Add `api.getExpansionMetrics()` calling `GET /api/dahab/admin/expansion-metrics`
- Add `api.getStaleFacts()` calling `GET /api/dahab/admin/stale-facts`
- Add `api.getAdminReviewQueue()` calling `GET /api/dahab/admin/review-queue`
- Build a new admin view accessible from the operations console
- Show knowledge gaps, stale facts, and review queue items

**Data flow:**
```
KnowledgeGapsView mounts →
  api.getKnowledgeGaps() → list of missing facts
  api.getStaleFacts() → facts needing revalidation
  api.getAdminReviewQueue() → items awaiting human review
→ Render admin dashboard with actions
```

---

### Task 2.8: Wire DKOS conflicts to Operations Console

**Files to modify:**
- `src/components/operations/OperationsConsoleView.tsx`
- `src/services/api.ts` (add `getConflicts()`, `resolveConflict()`)

**What to do:**
- Add `api.getConflicts()` calling `GET /api/dahab/admin/conflicts`
- Add `api.resolveConflict()` calling `POST /api/dahab/admin/conflicts/resolve`
- In OperationsConsoleView, add a "Knowledge Conflicts" section
- Show open conflicts with claim A vs claim B, source authority, and resolution buttons

**Data flow:**
```
OperationsConsoleView mounts → api.getConflicts() → GET /api/dahab/admin/conflicts
→ Render conflict cards with resolve buttons
→ User clicks resolve → api.resolveConflict({ conflictId, resolvedValue })
```

---

## 4. Phase 3: Medium — Consolidate Duplicate Routes

### Task 3.1: Remove duplicate market routes from server.ts

**Files to modify:**
- `server.ts` (remove ~18 inline market routes)
- `server/api/dahabRoutes.ts` (keep as canonical)

**What to do:**
- The same market intelligence endpoints exist in both files under different paths:
  - `server.ts`: `/api/market/*`
  - `dahabRoutes.ts`: `/api/dahab/commerce/*`
- **Decision:** Keep `/api/market/*` as the primary namespace (it's what the frontend's `api.ts` already calls via `refreshMarketIntelligence`)
- Remove the duplicate `/api/dahab/commerce/*` routes from `dahabRoutes.ts`
- OR: Update frontend to use `/api/dahab/commerce/*` and remove `/api/market/*` from server.ts
- **Recommendation:** Keep `/api/market/*` in server.ts (already working), remove duplicates from dahabRoutes.ts

**Routes to remove from `dahabRoutes.ts`:**
```
GET  /api/dahab/commerce/jobs              → DUPLICATE of /api/market/jobs
POST /api/dahab/commerce/jobs/trigger      → DUPLICATE of /api/market/jobs/trigger
POST /api/dahab/commerce/jobs/policy       → DUPLICATE of /api/market/jobs/policy
POST /api/dahab/commerce/run-all-scheduled → DUPLICATE of /api/market/ops/run-all
GET  /api/dahab/commerce/alerts            → DUPLICATE of /api/market/alerts
POST /api/dahab/commerce/alerts/:id/acknowledge → DUPLICATE
POST /api/dahab/commerce/alerts/:id/resolve     → DUPLICATE
GET  /api/dahab/commerce/snapshots         → DUPLICATE of /api/market/snapshots
POST /api/dahab/commerce/snapshots/create  → DUPLICATE
POST /api/dahab/commerce/snapshots/:id/rollback → DUPLICATE
POST /api/dahab/commerce/circuit-breakers/reset → DUPLICATE of /api/market/sources/circuit-breaker/reset
GET  /api/dahab/commerce/autonomous-status → DUPLICATE of /api/market/status
GET  /api/dahab/commerce/source-health     → DUPLICATE of /api/market/sources/health
GET  /api/dahab/commerce/operations-overview → DUPLICATE of /api/market/ops/overview
POST /api/dahab/commerce/refresh           → DUPLICATE of /api/market/refresh
GET  /api/dahab/commerce/review-queue      → DUPLICATE of /api/market/review-queue
POST /api/dahab/commerce/review-queue/:id/resolve → DUPLICATE
GET  /api/dahab/commerce/refresh-runs      → NO DUPLICATE (unique to dahabRoutes)
```

**Keep in `dahabRoutes.ts` (unique, not duplicated):**
```
GET  /api/dahab/commerce/suppliers
GET  /api/dahab/commerce/offers
GET  /api/dahab/commerce/market-stats
GET  /api/dahab/commerce/compare
GET  /api/dahab/commerce/recommend
GET  /api/dahab/commerce/price-history
GET  /api/dahab/commerce/price-changes
GET  /api/dahab/commerce/supplier-changes
GET  /api/dahab/commerce/source-freshness
GET  /api/dahab/commerce/market-trends
GET  /api/dahab/commerce/search
```

---

## 5. Phase 4: Medium — Add Missing Middleware

### Task 4.1: Add role checks to DayGI beta endpoints

**File to modify:** `server.ts`

**What to do:**
- The following DayGI beta endpoints are accessible to any authenticated user but should require Product/Operations/Admin:
  - `POST /api/daygi/beta/track-funnel` — keep public (any traveler can track)
  - `POST /api/daygi/beta/feedback` — keep public (any traveler can give feedback)
  - `POST /api/daygi/beta/alert-interaction` — keep public
  - `POST /api/daygi/beta/card-interaction` — keep public
  - `GET /api/daygi/beta/dashboard` — **ADD** `requireRole('Product', 'Operations', 'Admin')`
  - `GET /api/daygi/beta/experiments` — **ADD** `requireRole('Product', 'Operations', 'Admin')`
  - `POST /api/daygi/beta/experiments` — **ADD** `requireRole('Product', 'Operations', 'Admin')`
  - `POST /api/daygi/beta/run-scenarios` — **ADD** `requireRole('Product', 'Operations', 'Admin')`
  - `POST /api/daygi/beta/generate-weekly-report` — **ADD** `requireRole('Product', 'Operations', 'Admin')`

**Also update `apiAccessPolicy.ts`:**
- The current pattern `/^\/daygi\/beta\/(dashboard|experiments|run-scenarios|generate-weekly-report)/` already covers these in ROLE_RULES
- Verify the regex matches correctly

---

### Task 4.2: Add ownership check to support message reply

**File to modify:** `server.ts`

**What to do:**
- `POST /api/support/messages/:id/reply` currently requires Operations/Admin via `apiAccessPolicy`
- The handler already checks `req.user` but should also verify the message exists and the replier has authority
- This is already handled correctly — no change needed

---

### Task 4.3: Add auth to `/api/jobs/enqueue` and `/api/events/recent`

**File to modify:** `server.ts`

**What to do:**
- `POST /api/jobs/enqueue` — currently public, should require Operations/Admin
- `GET /api/events/recent` — currently public, should require Operations/Admin
- Add `requireAuth` and `requireRole('Operations', 'Admin')` to both
- OR: Add these to `apiAccessPolicy.ts` ROLE_RULES (preferred, centralized)

**Update `apiAccessPolicy.ts`:**
```typescript
// Already covered by existing patterns:
{ pattern: /^\/jobs\//, roles: ['Operations', 'Admin'] },
{ pattern: /^\/events\//, roles: ['Operations', 'Admin'] },
```
- Verify these patterns match `/jobs/enqueue` and `/events/recent`

---

## 6. Phase 5: Low — Build Missing Admin UI

### Task 5.1: Build Knowledge Gaps Dashboard

**New files:**
- `src/components/admin/KnowledgeGapsView.tsx`
- `src/components/admin/StaleFactsPanel.tsx`
- `src/components/admin/ReviewQueuePanel.tsx`

**What to do:**
- Create a new admin-only view accessible from Operations Console
- Wire to `GET /api/dahab/admin/gaps`, `/stale-facts`, `/review-queue`
- Show knowledge gaps with severity, affected entities, suggested actions
- Show stale facts with last verified date and revalidation priority
- Show review queue with approve/reject/request-info actions

**Route:** `/admin/knowledge-gaps` (add to `AppRoute` union type)

---

### Task 5.2: Build Entity Resolution Dashboard

**New files:**
- `src/components/admin/EntityResolutionView.tsx`

**What to do:**
- Wire to `POST /api/dahab/admin/entities/resolve` and `POST /api/dahab/admin/entities/merge`
- Show pending resolution candidates with match confidence
- Allow approve/reject/merge actions
- Show entity merge history

---

### Task 5.3: Build DKOS Health Dashboard

**New files:**
- `src/components/admin/DkosHealthView.tsx`

**What to do:**
- Wire to `GET /api/dahab/admin/health`, `/expansion-metrics`, `/logs`
- Show knowledge graph health score, fact counts, source distribution
- Show expansion metrics (coverage by area, category)
- Show recent search logs for debugging

---

### Task 5.4: Build Conflict Resolution UI in Operations Console

**Files to modify:**
- `src/components/operations/OperationsConsoleView.tsx`

**What to do:**
- Add a "Knowledge Conflicts" section to the existing operations console
- Wire to `GET /api/dahab/admin/conflicts` and `POST /api/dahab/admin/conflicts/resolve`
- Show conflict cards with claim A vs claim B, authority scores, source names
- One-click resolution buttons

---

### Task 5.5: Build Market Intelligence Dashboards

**Files to modify:**
- `src/components/intelligence/MarketIntelligenceView.tsx`

**What to do:**
- Replace mock/placeholder data with real API calls
- Add price history charts (using recharts, already in dependencies)
- Add trend visualizations
- Add source health dashboard
- Add review queue for anomalies

**APIs to wire:**
- `GET /api/dahab/commerce/market-stats`
- `GET /api/dahab/commerce/price-history`
- `GET /api/dahab/commerce/market-trends`
- `GET /api/dahab/commerce/source-health`
- `GET /api/dahab/commerce/source-freshness`

---

## 7. Phase 6: Low — Cleanup Dead Code

### Task 6.1: Remove duplicate frontend API methods

**File to modify:** `src/services/api.ts`

**What to do:**
- Remove `api.runGoldenJourneyTest()` (duplicate of `api.runGoldenJourneySuite()`)
- Verify all remaining methods have matching endpoints

---

### Task 6.2: Remove duplicate route registrations

**File to modify:** `server/api/dahabRoutes.ts`

**What to do:**
- Remove the 15+ duplicate market routes that also exist in `server.ts`
- Keep only the unique commerce routes (suppliers, offers, stats, compare, recommend, price-history, price-changes, supplier-changes, source-freshness, market-trends, search)

---

### Task 6.3: Clean up unused imports

**Files to modify:** Various component files

**What to do:**
- Audit all component imports for unused variables
- Remove dead imports identified during typecheck

---

## 8. Detailed Task Breakdown

### Phase 1 Tasks (1 day)

| Task | Files | Effort | Dependencies |
|------|-------|--------|-------------|
| 1.1 Weather endpoint | `server.ts` | 2h | None |
| 1.2 Camera endpoint | `server.ts` | 1h | None |
| 1.3 Ledger endpoints | `server.ts` | 2h | None |
| 1.4 Transfer telemetry | `server.ts` | 1h | None |
| 1.5 Supplier list + bookings | `server.ts` | 2h | None |

### Phase 2 Tasks (3 days)

| Task | Files | Effort | Dependencies |
|------|-------|--------|-------------|
| 2.1 Emergency resources | `HelpMeNowView.tsx`, `api.ts` | 3h | Phase 1 |
| 2.2 Area profiles | `ExploreView.tsx`, `api.ts` | 4h | Phase 1 |
| 2.3 Supplier catalog | `BookingHotelStep.tsx`, `api.ts` | 6h | Phase 1 |
| 2.4 Unified search | `SearchDrawer.tsx`, `api.ts` | 4h | Phase 1 |
| 2.5 Regulations | `PreArrivalBriefing.tsx`, `api.ts` | 3h | Phase 1 |
| 2.6 Market intelligence | `MarketIntelligenceView.tsx`, `api.ts` | 8h | Phase 1 |
| 2.7 Knowledge gaps | New `KnowledgeGapsView.tsx`, `api.ts` | 6h | Phase 1 |
| 2.8 DKOS conflicts | `OperationsConsoleView.tsx`, `api.ts` | 4h | Phase 1 |

### Phase 3 Tasks (1 day)

| Task | Files | Effort | Dependencies |
|------|-------|--------|-------------|
| 3.1 Consolidate routes | `server.ts`, `dahabRoutes.ts` | 4h | None |

### Phase 4 Tasks (0.5 days)

| Task | Files | Effort | Dependencies |
|------|-------|--------|-------------|
| 4.1 DayGI beta roles | `server.ts`, `apiAccessPolicy.ts` | 2h | None |
| 4.2 Support reply auth | Already correct | 0h | None |
| 4.3 Jobs/events auth | `apiAccessPolicy.ts` | 1h | None |

### Phase 5 Tasks (5 days)

| Task | Files | Effort | Dependencies |
|------|-------|--------|-------------|
| 5.1 Knowledge gaps UI | New components | 8h | Phase 2.7 |
| 5.2 Entity resolution UI | New component | 6h | Phase 2.7 |
| 5.3 DKOS health UI | New component | 6h | Phase 2.7 |
| 5.4 Conflict resolution UI | `OperationsConsoleView.tsx` | 4h | Phase 2.8 |
| 5.5 Market intelligence UI | `MarketIntelligenceView.tsx` | 8h | Phase 2.6 |

### Phase 6 Tasks (0.5 days)

| Task | Files | Effort | Dependencies |
|------|-------|--------|-------------|
| 6.1 Remove dead API methods | `api.ts` | 1h | All phases |
| 6.2 Remove duplicate routes | `dahabRoutes.ts` | 2h | Phase 3 |
| 6.3 Clean unused imports | Various | 1h | All phases |

---

## 9. Dependency Graph

```
Phase 1 (Backend Endpoints)
    │
    ├──→ Phase 2.1 (Emergency) ──→ Phase 5.4 (Conflict UI)
    ├──→ Phase 2.2 (Areas) ─────→ Phase 5.1 (Knowledge Gaps)
    ├──→ Phase 2.3 (Suppliers) ─→ Phase 5.5 (Market Intel)
    ├──→ Phase 2.4 (Search) ────→ Phase 6.1 (Cleanup)
    ├──→ Phase 2.5 (Regulations)→ Phase 6.3 (Imports)
    ├──→ Phase 2.6 (Market) ────→ Phase 5.5 (Market Intel UI)
    ├──→ Phase 2.7 (Gaps) ──────→ Phase 5.1-5.3 (Admin UIs)
    └──→ Phase 2.8 (Conflicts) ─→ Phase 5.4 (Conflict UI)

Phase 3 (Route Consolidation) ──→ Phase 6.2 (Remove Duplicates)
Phase 4 (Middleware) ──────────→ Independent
Phase 6 (Cleanup) ────────────→ After all other phases
```

---

## 10. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking existing API consumers during route consolidation | Medium | High | Keep `/api/market/*` as primary; remove `/api/dahab/commerce/*` duplicates |
| Weather API (Open-Meteo) unavailable in production | Low | Medium | Service already returns null; frontend handles gracefully |
| Firebase Admin credentials still missing | High | Low | Federated sign-in remains 503; email/password works |
| Admin UI exposing sensitive data | Low | High | All admin endpoints already require Operations/Admin role |
| Performance impact of additional API calls | Low | Low | Most endpoints are in-memory reads; no DB queries |
| Type mismatches between backend response and frontend types | Medium | Medium | Run typecheck after each phase; shared types in `src/shared/` |

---

## Appendix: Quick Reference — What to Build

### New Backend Endpoints (Phase 1)

```
GET  /api/telemetry/weather
GET  /api/telemetry/cameras
GET  /api/commerce/ledger
GET  /api/commerce/ledger/verify
GET  /api/transfers/telemetry/:bookingId
GET  /api/suppliers
GET  /api/suppliers/:supplierId/bookings
```

### New Frontend API Methods (Phase 1+2)

```
api.getEmergencyResources()
api.getDahabAreas()
api.getDahabArea(areaId)
api.getCommerceSuppliers(category?)
api.getCommerceOffers(filters?)
api.searchDahab(query)
api.getRegulations()
api.getMarketPriceHistory(filters?)
api.getMarketTrends(filters?)
api.getMarketStats()
api.getMarketSourceHealth()
api.getKnowledgeGaps()
api.getExpansionMetrics()
api.getStaleFacts()
api.getAdminReviewQueue()
api.getConflicts()
api.resolveConflict(conflictId, resolvedValue)
api.getWeatherConditions()
api.getCameras()
api.getLedger()
api.verifyLedger()
api.getTransferTelemetry(bookingId)
api.getSuppliers()
api.getSupplierBookings(supplierId)
```

### New Frontend Components (Phase 5)

```
src/components/admin/KnowledgeGapsView.tsx
src/components/admin/StaleFactsPanel.tsx
src/components/admin/ReviewQueuePanel.tsx
src/components/admin/EntityResolutionView.tsx
src/components/admin/DkosHealthView.tsx
```

### Routes to Add to AppRoute Union (Phase 5)

```
| '/admin/knowledge-gaps'
| '/admin/entity-resolution'
| '/admin/dkos-health'
```

---

*Plan generated by automated analysis. No code changes made.*
