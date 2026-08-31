# Backend vs Frontend — Complete Comparison Report

**Date:** August 31, 2026  
**Stack:** React 19 + TypeScript (Frontend) · Node.js/Express + TypeScript (Backend)  
**Tests:** 282/282 passing · TypeScript: clean

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Backend Endpoints Inventory](#2-backend-endpoints-inventory)
3. [Frontend API Client Methods](#3-frontend-api-client-methods)
4. [Endpoint-to-Consumer Mapping](#4-endpoint-to-consumer-mapping)
5. [Orphaned Backend Endpoints (No Frontend Consumer)](#5-orphaned-backend-endpoints-no-frontend-consumer)
6. [Orphaned Frontend Methods (No Backend Endpoint)](#6-orphaned-frontend-methods-no-backend-endpoint)
7. [Middleware & Security Pipeline](#7-middleware--security-pipeline)
8. [Database Schema vs Frontend Types](#8-database-schema-vs-frontend-types)
9. [State Management Architecture](#9-state-management-architecture)
10. [Data Flow Analysis](#10-data-flow-analysis)
11. [Gaps & Recommendations](#11-gaps--recommendations)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19)                      │
│  src/services/api.ts ─── fetchWithTimeout (8s / 30s AI)        │
│  src/context/ ────────── 7 nested providers                    │
│  src/components/ ─────── 30+ view components                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HttpOnly cookie (credentials: include)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express 4.21)                      │
│  server.ts ───────────── 60+ inline route handlers              │
│  server/api/ ─────────── 2 router modules (dahab, admin)        │
│  server/middleware/ ───── auth, RBAC, access policy, validation  │
│  server/services/ ────── 34 service modules                     │
│  server/db/ ──────────── in-memory ACID database + WAL          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  Firebase Auth · Google Gemini · Google Maps · Twilio SMS       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Endpoints Inventory

### Total: ~120 endpoints across 3 registration points

| Registration Point | Count | Auth Required |
|-------------------|-------|---------------|
| `server.ts` inline | ~60 | Mixed (public + auth) |
| `server/api/dahabRoutes.ts` | ~35 | Public (GET) |
| `server/api/adminDahabRoutes.ts` | ~15 | Operations/Admin/Product |

### Endpoint Categories

| Category | Endpoints | Auth |
|----------|-----------|------|
| **Auth & Session** | 7 | Public (register/login/logout) + auth (me, logout-all, firebase-session) |
| **Trips** | 4 | Auth + ownership check |
| **Commerce & Inventory** | 6 | Mixed (availability public, checkout auth) |
| **DayGI Concierge** | 12 | Auth |
| **DayGI Beta Telemetry** | 8 | Mixed (some public, some Product role) |
| **Support Messages** | 3 | Auth (reply requires Operations) |
| **Context & Spatial** | 5 | Public |
| **Market Intelligence (server.ts)** | 18 | Mixed |
| **Market Intelligence (dahabRoutes)** | 15 | Public |
| **Admin DKOS** | 15 | Operations/Admin/Product |
| **Editorial Content** | 3 | Public |
| **Background Jobs** | 2 | Operations/Admin |
| **Other (health, telemetry, etc.)** | 4 | Public |

---

## 3. Frontend API Client Methods

**File:** `src/services/api.ts`  
**Total methods:** ~55

### Method Categories

| Category | Methods |
|----------|---------|
| **Auth** | `register`, `login`, `syncFirebaseSession`, `getMe`, `logout` |
| **Trips** | `getTrip`, `getTripBookings`, `saveTrip`, `getTripsForUser` |
| **Commerce** | `checkMultiAvailability`, `checkTransferAvailability`, `createHold`, `completeMultiCheckout`, `completeCheckout`, `substituteItineraryItem`, `processRefund` |
| **DayGI** | `queryDayGi`, `executeDayGiAction`, `getDayGiProactive`, `getDayGiTripHealth`, `getDayGiMemory`, `updateDayGiMemory`, `getDayGiTasks`, `getDayGiTask`, `executeDayGiTaskStep`, `applyDayGiTaskRecovery`, `cancelDayGiTask` |
| **DayGI Beta** | `trackDayGiFunnel`, `submitDayGiBetaFeedback`, `trackDayGiAlertInteraction`, `trackDayGiCardInteraction`, `getDayGiBetaDashboard`, `getDayGiBetaExperiments`, `updateDayGiBetaExperiments`, `runDayGiGoldenScenarios`, `generateDayGiWeeklyReport` |
| **Support** | `sendSupportMessage`, `getSupportMessages` |
| **Content** | `getGalleryPhotos`, `getCuratedStories`, `getReadyProgrammes` |
| **Knowledge** | `getDahabPlaces`, `getDahabActivities`, `getDahabDining` |
| **Context** | `getFitWindowOptions`, `getPostActivityFood`, `getTravelEstimate`, `parseSearchIntent` |
| **Suppliers** | `getSuppliers`, `getSupplierDashboard`, `respondSupplierBooking`, `getSupplierBookings`, `updateSupplierBookingStatus` |
| **Operations** | `getOperationsOverview`, `runGoldenJourneySuite` |
| **Telemetry** | `getWeatherTelemetry`, `getCameraFeeds`, `getBackgroundJobsStatus` |
| **Ledger** | `getLedger`, `verifyLedger` |
| **Market** | `refreshMarketIntelligence` |
| **SMS** | `getSmsLogs`, `sendSmsDispatch` |
| **Trip Generation** | `generateAiTrip` |
| **Analytics** | `trackDayGiEvent` |

---

## 4. Endpoint-to-Consumer Mapping

### ✅ Fully Connected (Backend ↔ Frontend)

| Backend Endpoint | Frontend Method | Used By |
|-----------------|----------------|---------|
| `POST /api/auth/register` | `api.register()` | AuthContext |
| `POST /api/auth/login` | `api.login()` | AuthContext |
| `POST /api/auth/logout` | `api.logout()` | AuthContext |
| `GET /api/auth/me` | `api.getMe()` | AuthContext (on mount) |
| `POST /api/auth/firebase-session` | `api.syncFirebaseSession()` | AuthContext |
| `GET /api/trips/:tripId` | `api.getTrip()` | CommerceContext |
| `GET /api/trips/:tripId/bookings` | `api.getTripBookings()` | CommerceContext |
| `POST /api/trips` | `api.saveTrip()` | TripEntrySection |
| `GET /api/trips/user/:userId` | `api.getTripsForUser()` | CommerceContext |
| `POST /api/commerce/availability` | `api.checkMultiAvailability()` | Commerce components |
| `POST /api/commerce/hold` | `api.createHold()` | BookingTransferStep |
| `POST /api/commerce/checkout/multi` | `api.completeMultiCheckout()` | BookNowCommerceModal/View |
| `POST /api/commerce/checkout` | `api.completeCheckout()` | BookingPaymentStep |
| `POST /api/commerce/recovery/substitute` | `api.substituteItineraryItem()` | ChangeAndRecoveryView |
| `POST /api/commerce/refund` | `api.processRefund()` | OperationsConsoleView |
| `POST /api/daygi/query` | `api.queryDayGi()` | DayGiConciergeView |
| `POST /api/daygi/action/execute` | `api.executeDayGiAction()` | DayGiConciergeView |
| `GET /api/daygi/proactive` | `api.getDayGiProactive()` | DayGiConciergeView |
| `GET /api/daygi/health/:tripId` | `api.getDayGiTripHealth()` | DayGiConciergeView |
| `GET /api/daygi/memory/:userId` | `api.getDayGiMemory()` | DayGiConciergeView |
| `POST /api/daygi/memory/:userId` | `api.updateDayGiMemory()` | DayGiConciergeView |
| `GET /api/daygi/tasks` | `api.getDayGiTasks()` | DayGiConciergeView |
| `GET /api/daygi/tasks/:taskId` | `api.getDayGiTask()` | DayGiConciergeView |
| `POST /api/daygi/tasks/:taskId/execute-step` | `api.executeDayGiTaskStep()` | DayGiConciergeView |
| `POST /api/daygi/tasks/:taskId/apply-recovery` | `api.applyDayGiTaskRecovery()` | DayGiConciergeView |
| `POST /api/daygi/tasks/:taskId/cancel` | `api.cancelDayGiTask()` | DayGiConciergeView |
| `POST /api/support/messages` | `api.sendSupportMessage()` | HelpMeNowView |
| `GET /api/support/messages` | `api.getSupportMessages()` | HelpMeNowView |
| `POST /api/analytics/daygi` | `api.trackDayGiEvent()` | DayGiConciergeView |
| `POST /api/daygi/beta/track-funnel` | `api.trackDayGiFunnel()` | DayGiConciergeView |
| `POST /api/daygi/beta/feedback` | `api.submitDayGiBetaFeedback()` | DayGiConciergeView |
| `POST /api/daygi/beta/alert-interaction` | `api.trackDayGiAlertInteraction()` | DayGiConciergeView |
| `POST /api/daygi/beta/card-interaction` | `api.trackDayGiCardInteraction()` | DayGiConciergeView |
| `GET /api/daygi/beta/dashboard` | `api.getDayGiBetaDashboard()` | DayGiQualityDashboard |
| `GET /api/daygi/beta/experiments` | `api.getDayGiBetaExperiments()` | DayGiQualityDashboard |
| `POST /api/daygi/beta/experiments` | `api.updateDayGiBetaExperiments()` | DayGiQualityDashboard |
| `POST /api/daygi/beta/run-scenarios` | `api.runDayGiGoldenScenarios()` | DayGiQualityDashboard |
| `POST /api/daygi/beta/generate-weekly-report` | `api.generateDayGiWeeklyReport()` | DayGiQualityDashboard |
| `GET /api/dahab/places` | `api.getDahabPlaces()` | ExploreView, SearchDrawer, Map |
| `GET /api/dahab/activities` | `api.getDahabActivities()` | ExploreView, SearchDrawer |
| `GET /api/dahab/food` | `api.getDahabDining()` | FoodNowView, SearchDrawer |
| `GET /api/dahab/content/gallery` | `api.getGalleryPhotos()` | DahabGallerySection |
| `GET /api/dahab/content/stories` | `api.getCuratedStories()` | CuratedStoriesRail |
| `GET /api/dahab/content/programmes` | `api.getReadyProgrammes()` | TripEntrySection |
| `POST /api/context/fit-window` | `api.getFitWindowOptions()` | WhatShouldIDoNowView |
| `GET /api/context/post-activity-food` | `api.getPostActivityFood()` | DailyCompanionDay2View |
| `GET /api/context/travel-time` | `api.getTravelEstimate()` | Various |
| `POST /api/context/parse-intent` | `api.parseSearchIntent()` | SearchDrawer |
| `POST /api/trip/generate` | `api.generateAiTrip()` | BuildingTripState |
| `POST /api/testing/golden-journey` | `api.runGoldenJourneySuite()` | OperationsConsoleView |
| `POST /api/market/refresh` | `api.refreshMarketIntelligence()` | MarketIntelligenceView |
| `GET /api/suppliers/:supplierId/dashboard` | `api.getSupplierDashboard()` | SupplierPortalView |
| `POST /api/suppliers/bookings/:bookingId/respond` | `api.respondSupplierBooking()` | SupplierPortalView |
| `GET /api/inventory/:serviceType` | (direct fetch in components) | Booking components |

---

## 5. Orphaned Backend Endpoints (No Frontend Consumer)

These endpoints exist in the backend but have **no corresponding frontend API method or component call**:

### 🔴 High Priority (Core Features Unused)

| Endpoint | Purpose | Why It Matters |
|----------|---------|---------------|
| `GET /api/dahab/context` | Full bootstrap payload (conditions, areas, highlights) | Homepage could use this instead of multiple calls |
| `GET /api/dahab/search` | Natural language unified search | SearchDrawer uses places/activities/dining individually |
| `GET /api/dahab/areas` | List all area profiles | Explore doesn't use area-based browsing |
| `GET /api/dahab/areas/:id` | Area detail with places, activities, dining | No area detail view exists |
| `GET /api/dahab/conditions` | Live marine & environmental conditions | SinaiRadarWidget uses weather telemetry instead |
| `GET /api/dahab/emergency` | Emergency hotlines directory | HelpMeNowView has hardcoded contacts |
| `GET /api/dahab/regulations` | Official decrees & permits | No regulations view exists |
| `GET /api/dahab/questions` | Question-driven knowledge retrieval | DayGI handles this via intent parsing |
| `GET /api/dahab/badges/:entityId` | Trust badges for entities | No trust badge display exists |
| `GET /api/dahab/commerce/suppliers` | Supplier catalog | Frontend uses hardcoded supplier data |
| `GET /api/dahab/commerce/offers` | Supplier offers with pricing | Frontend uses curated booking data |
| `GET /api/dahab/commerce/market-stats` | Aggregated market statistics | MarketIntelligenceView doesn't consume this |
| `GET /api/dahab/commerce/compare` | Multi-dimensional offer comparison | No comparison UI exists |
| `GET /api/dahab/commerce/recommend` | Smart recommendations | Recommendations are hardcoded |
| `GET /api/dahab/commerce/price-history` | Price movement over time | No price history chart exists |
| `GET /api/dahab/commerce/price-changes` | Price change events | No price change notifications |
| `GET /api/dahab/commerce/supplier-changes` | Supplier change radar | No change radar UI |
| `GET /api/dahab/commerce/source-freshness` | Data freshness audit | No freshness dashboard |
| `GET /api/dahab/commerce/market-trends` | Temporal price trends | No trend visualization |
| `POST /api/dahab/commerce/refresh` | Market data ingestion | Duplicate of `/api/market/refresh` |
| `GET /api/dahab/commerce/review-queue` | Anomaly review queue | No review queue UI |
| `POST /api/dahab/commerce/review-queue/:id/resolve` | Resolve review items | No resolution UI |
| `GET /api/dahab/commerce/refresh-runs` | Refresh run history | No run history display |
| `GET /api/dahab/commerce/source-health` | Source health report | No health dashboard |
| `GET /api/dahab/commerce/operations-overview` | Market operations overview | No overview dashboard |
| `GET /api/dahab/commerce/search` | Bilingual commerce search | No commerce search UI |
| `GET /api/dahab/commerce/jobs` | Scheduled refresh policies | No job management UI |
| `POST /api/dahab/commerce/jobs/trigger` | Trigger source refresh | No trigger button |
| `POST /api/dahab/commerce/jobs/policy` | Update schedule policies | No policy editor |
| `POST /api/dahab/commerce/run-all-scheduled` | Run all due jobs | No batch run button |
| `GET /api/dahab/commerce/alerts` | Operations alerts | No alerts dashboard |
| `POST /api/dahab/commerce/alerts/:id/acknowledge` | Acknowledge alert | No acknowledge button |
| `POST /api/dahab/commerce/alerts/:id/resolve` | Resolve alert | No resolve button |
| `GET /api/dahab/commerce/snapshots` | Market snapshots | No snapshot viewer |
| `POST /api/dahab/commerce/snapshots/create` | Create snapshot | No snapshot creation |
| `POST /api/dahab/commerce/snapshots/:id/rollback` | Rollback to snapshot | No rollback UI |
| `POST /api/dahab/commerce/circuit-breakers/reset` | Reset circuit breaker | No circuit breaker UI |
| `GET /api/dahab/commerce/autonomous-status` | Autonomous ops status | No status display |

### 🟡 Medium Priority (Admin/Operations)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/dahab/admin/health` | DKOS health dashboard |
| `GET /api/dahab/admin/conflicts` | Knowledge conflicts |
| `POST /api/dahab/admin/conflicts/resolve` | Resolve conflicts |
| `GET /api/dahab/admin/snapshots` | Knowledge snapshots |
| `POST /api/dahab/admin/snapshots/create` | Create knowledge snapshot |
| `POST /api/dahab/admin/snapshots/diff` | Diff two snapshots |
| `POST /api/dahab/admin/entities/resolve` | Entity resolution |
| `POST /api/dahab/admin/entities/merge` | Entity merging |
| `GET /api/dahab/admin/stale-facts` | Stale fact detection |
| `GET /api/dahab/admin/logs` | Search observability logs |
| `POST /api/dahab/admin/proof` | 30-point DKOS proof suite |
| `GET /api/dahab/admin/gaps` | Knowledge gap detection |
| `GET /api/dahab/admin/expansion-metrics` | Coverage metrics |
| `GET /api/dahab/admin/review-queue` | Human review queue |
| `POST /api/dahab/admin/review-queue/resolve` | Resolve review item |
| `POST /api/dahab/admin/stage-observation` | Stage observation |
| `POST /api/dahab/admin/promote-observation` | Promote observation |

### 🟢 Low Priority (Duplicate/Mirror Routes in server.ts)

These are duplicated between `server.ts` and `dahabRoutes.ts`:

| server.ts Route | dahabRoutes.ts Route |
|----------------|---------------------|
| `GET /api/market/jobs` | `GET /api/dahab/commerce/jobs` |
| `POST /api/market/jobs/trigger` | `POST /api/dahab/commerce/jobs/trigger` |
| `GET /api/market/sources/health` | `GET /api/dahab/commerce/source-health` |
| `GET /api/market/review-queue` | `GET /api/dahab/commerce/review-queue` |
| `GET /api/market/ops/overview` | `GET /api/dahab/commerce/operations-overview` |
| `POST /api/market/ops/run-all` | `POST /api/dahab/commerce/run-all-scheduled` |
| `GET /api/market/alerts` | `GET /api/dahab/commerce/alerts` |
| `GET /api/market/snapshots` | `GET /api/dahab/commerce/snapshots` |
| `GET /api/market/status` | `GET /api/dahab/commerce/autonomous-status` |
| `GET /api/market/events` | `GET /api/dahab/commerce/supplier-changes` |
| `GET /api/market/price-history` | `GET /api/dahab/commerce/price-history` |
| `GET /api/market/trends` | `GET /api/dahab/commerce/market-trends` |
| `GET /api/market/source-freshness` | `GET /api/dahab/commerce/source-freshness` |
| `POST /api/market/refresh` | `POST /api/dahab/commerce/refresh` |

---

## 6. Orphaned Frontend Methods (No Backend Endpoint)

These frontend API methods call endpoints that may not exist or are misaligned:

| Frontend Method | Endpoint Called | Issue |
|----------------|----------------|-------|
| `api.checkTransferAvailability()` | `POST /api/inventory/transfers/check` | ⚠️ No matching endpoint in server.ts — may 404 |
| `api.getTelemetry()` | `GET /api/transfers/telemetry/:bookingId` | ⚠️ No matching endpoint visible in server.ts |
| `api.getLedger()` | `GET /api/commerce/ledger` | ⚠️ No matching endpoint — ledger is in-memory only |
| `api.verifyLedger()` | `GET /api/commerce/ledger/verify` | ⚠️ No matching endpoint |
| `api.getSuppliers()` | `GET /api/suppliers` | ⚠️ No matching endpoint (only `/:supplierId/dashboard`) |
| `api.getSupplierBookings()` | `GET /api/suppliers/:supplierId/bookings` | ⚠️ No matching endpoint |
| `api.updateSupplierBookingStatus()` | `POST /api/suppliers/bookings/:bookingId/status` | ⚠️ No matching endpoint |
| `api.getOperationsOverview()` | `GET /api/operations/overview` | ⚠️ No matching endpoint |
| `api.getWeatherTelemetry()` | `GET /api/telemetry/weather` | ⚠️ No matching endpoint — returns null on failure |
| `api.getCameraFeeds()` | `GET /api/telemetry/cameras` | ⚠️ No matching endpoint — returns null on failure |
| `api.getBackgroundJobsStatus()` | `GET /api/jobs/status` | ✅ Exists |
| `api.getSmsLogs()` | `GET /api/sms/logs` | ⚠️ No matching endpoint visible |
| `api.sendSmsDispatch()` | `POST /api/sms/send-dispatch` | ⚠️ No matching endpoint visible |
| `api.runGoldenJourneyTest()` | `POST /api/testing/golden-journey` | ⚠️ Duplicate of `runGoldenJourneySuite()` |

---

## 7. Middleware & Security Pipeline

### Request Processing Order

```
1. helmet()                          → Security headers
2. express.json()                    → Body parsing
3. cookieParser()                    → Cookie parsing
4. correlationMiddleware             → X-Correlation-ID injection
5. optionalAuth                      → Populate req.user from session
6. apiRateLimiter (per route)        → Rate limiting
7. apiAccessPolicy                   → Deny-by-default gate
8. Router-specific middleware        → requireAuth, requireRole
9. Route handler                     → Business logic
10. errorHandler                     → RFC-7807 Problem Details
```

### Auth Middleware Analysis

| Middleware | File | Purpose |
|-----------|------|---------|
| `optionalAuth` | `authMiddleware.ts` | Populates `req.user` if session exists; mounted globally |
| `requireAuth` | `authMiddleware.ts` | Rejects if no valid session; used on protected routes |
| `requireRole` | `rbacMiddleware.ts` | Checks `req.user.role` against allowed roles |
| `apiAccessPolicy` | `apiAccessPolicy.ts` | Deny-by-default; lists public exceptions |

### Frontend Auth Flow vs Backend Enforcement

| Frontend Action | Frontend Check | Backend Enforcement |
|----------------|---------------|-------------------|
| View homepage | None (public) | ✅ `/dahab/*` is public |
| View operations console | `RequireRole(['Operations', 'Admin'])` | ✅ `requireRole('Operations', 'Admin')` |
| View supplier portal | `RequireRole(['Supplier', 'Operations', 'Admin'])` | ✅ `requireRole('Supplier', 'Operations', 'Admin')` |
| Create hold | None (any auth) | ✅ `apiAccessPolicy` requires auth |
| Execute checkout | None (any auth) | ✅ `apiAccessPolicy` requires auth + `rejectRawCardData` |
| Process refund | None (any auth) | ✅ `requireRole('Operations', 'Admin')` on `/commerce/refund` |
| View trip | None | ✅ `mayActOnTripsOf()` ownership check |
| DayGI query | None (any auth) | ✅ `requireAuth` on `/api/daygi/*` |
| DayGI memory | None | ✅ `requireAuth` + ignores `:userId` param (uses session) |

### Security Gaps Identified

1. **Frontend `RequireRole` is UI-only** — a crafted request bypasses it. Backend `apiAccessPolicy` is the real guard.
2. **Some DayGI beta endpoints lack role checks** — `/api/daygi/beta/track-funnel`, `/api/daygi/beta/feedback`, `/api/daygi/beta/alert-interaction`, `/api/daygi/beta/card-interaction` are publicly accessible (any auth).
3. **Duplicate route definitions** — Market intelligence routes exist in both `server.ts` and `dahabRoutes.ts` under different paths (`/api/market/*` vs `/api/dahab/commerce/*`), creating potential confusion.

---

## 8. Database Schema vs Frontend Types

### Schema Coverage

| Backend Entity | Frontend Type | Match? |
|---------------|--------------|--------|
| `UserEntity` | `SessionUser` (AuthContext) | ✅ Partial (no passwordHash) |
| `SessionEntity` | Session token in localStorage | ✅ |
| `TripEntity` | `TripEntity` (shared/types) | ✅ Full match |
| `TripItemEntity` | `TripItemEntity` (shared/types) | ✅ Full match |
| `SupplierEntity` | Not directly exposed | ✅ Supplied via booking enrichment |
| `ProductSkuEntity` | Not directly exposed | ✅ Used server-side only |
| `InventorySlotEntity` | Not directly exposed | ✅ Used server-side only |
| `HoldEntity` | Hold token in checkout | ✅ Token-only exposure |
| `PaymentEntity` | Payment result in checkout | ✅ Partial exposure |
| `BookingEntity` | `TripBookingRecord` (shared) | ✅ Enriched with supplier |
| `LedgerEntryEntity` | `LedgerEntry` (shared) | ✅ Schema match |
| `AuditEventEntity` | Not exposed | ✅ Server-side only |
| `SupportMessageEntity` | `SupportMessage` (shared) | ✅ Full match |
| `PlaceEntity` | `DahabPlace` (shared) | ✅ Full match |
| `ActivityDetailEntity` | `DahabActivity` (shared) | ✅ Full match |
| `DiningVenueEntity` | `DahabDiningVenue` (shared) | ✅ Full match |
| `EmergencyResourceEntity` | Hardcoded in HelpMeNowView | ⚠️ API exists but not consumed |
| `TemporalFactEntity` | Not exposed | ✅ Server-side only |
| `ConflictSetEntity` | Not exposed (admin only) | ✅ |
| `AreaProfileEntity` | Not exposed | ⚠️ API exists but not consumed |
| `MarketPriceStatEntity` | Not exposed | ⚠️ API exists but not consumed |
| `SupplierOfferEntity` | Not exposed | ⚠️ API exists but not consumed |
| `MarketChangeEventEntity` | Not exposed | ⚠️ API exists but not consumed |

### Type Sharing

Types are shared via `src/shared/` directory:
- `src/shared/types/trip.ts` — `TripEntity`, `TripItemEntity`, `TimelineDay`, `TimelineActivity`
- `src/shared/types/commerce.ts` — `ConfirmedBookingItem`, `LedgerEntry`
- `src/shared/types/user.ts` — `TravelerProfile`

The `src/types.ts` re-exports from `src/shared/` and adds frontend-specific types (DayGI intents, actions, etc.).

---

## 9. State Management Architecture

### Provider Hierarchy

```
ThemeProvider          → Visual themes (dark/light/bedouin)
  └── LanguageProvider → i18n (Arabic RTL / English LTR)
      └── AppStateProvider
          ├── UIProvider          → Navigation, routes, toasts
          │   └── AuthProvider    → Session, roles, sign-in/out
          │       └── CommerceProvider → Bookings, trips, ledger
          │           └── IntelligenceProvider → Suppliers, pricing
          │               └── TripOsProvider → Fit score, health
          │                   └── ItineraryProvider → Days, activities
          │                       └── TripProvider → Unified facade
          └── DahabTimeProvider → Sinai timezone simulation
```

### Backend ↔ Frontend Data Flow

| Data | Backend Source | Frontend Consumer | Flow |
|------|---------------|-------------------|------|
| **User session** | `authService.register/login` | `AuthContext` → `sessionUser` | API call on mount + login |
| **Trip data** | `tripService.getTrip` | `CommerceContext` → `activeTrip` | API call on session restore |
| **Bookings** | `tripService.getTrip` + `db.bookings` | `CommerceContext` → `bookings` | API call on session restore |
| **Places** | `db.places` | `ExploreView`, `SearchDrawer`, `Map` | Direct API calls |
| **Activities** | `db.activities` | `ExploreView`, `SearchDrawer` | Direct API calls |
| **Dining** | `db.diningVenues` | `FoodNowView`, `SearchDrawer` | Direct API calls |
| **DayGI responses** | `daygiReasoningService` | `DayGiConciergeView` | API call on user prompt |
| **Weather** | `weatherService` | `SinaiRadarWidget`, `DahabLiveView` | API call (returns null if unavailable) |
| **Gallery** | `editorialContent.ts` | `DahabGallerySection` | API call |
| **Stories** | `editorialContent.ts` | `CuratedStoriesRail` | API call |
| **Support messages** | `db.supportMessages` | `HelpMeNowView` | API call on open |

### Critical Observation: Session Restore on Mount

```typescript
// AuthContext.tsx - runs on every page load
useEffect(() => {
  api.getMe()  // Restores session from HttpOnly cookie
    .then(result => {
      if (result?.user) setSessionUser({...});
    })
    .catch(() => { /* no session yet */ });
}, []);
```

This is the **only mechanism** that restores authentication after a page refresh. Without it, the traveler would appear signed out until they manually log in again.

---

## 10. Data Flow Analysis

### Booking Flow (End-to-End)

```
Frontend: TripPlanner → StepDuration → ... → StepPace → BuildingTripState
   ↓ (generates itinerary)
Frontend: GeneratedItinerary → "Continue to Booking"
   ↓ (auth check)
Frontend: BookingHotelStep → BookingTransferStep → BookingDivingStep → BookingSafariStep
   ↓ (create holds)
Backend: POST /api/commerce/hold → commerceService.createHold()
   ↓ (15-min TTL)
Frontend: BookingReviewStep → BookingPaymentStep
   ↓ (checkout)
Backend: POST /api/commerce/checkout/multi → commerceService.completeMultiServiceCheckout()
   ↓ (creates booking, payment, ledger entries)
Frontend: MyTripView → BookingsSection (displays real bookings)
```

### DayGI Query Flow

```
Frontend: DayGiConciergeView → user types prompt
   ↓
Frontend: api.queryDayGi({ prompt, context })
   ↓
Backend: POST /api/daygi/query → daygiReasoningService.query()
   ↓ (intent classification, parameter extraction)
Backend: Gemini API call (with offline fallback)
   ↓
Backend: Returns DayGiResponse with actionType, actionData, etc.
   ↓
Frontend: Renders response card (recommendation, booking, recovery, etc.)
   ↓ (if action needed)
Frontend: api.executeDayGiAction({ actionKey, payload })
   ↓
Backend: POST /api/daygi/action/execute → daygiReasoningService.executeAction()
```

### Support Message Flow

```
Frontend: HelpMeNowView → user types message
   ↓
Frontend: api.sendSupportMessage({ message, category, urgent })
   ↓
Backend: POST /api/support/messages → creates SupportMessageEntity
   ↓ (audit logged, saved to DB)
Backend: Returns created message with ID
   ↓
Frontend: Shows confirmation
   ↓ (Operations console)
Backend: POST /api/support/messages/:id/reply → updates message with reply
```

---

## 11. Gaps & Recommendations

### 🔴 Critical Gaps

| # | Gap | Impact | Fix |
|---|-----|--------|-----|
| 1 | **15+ market intelligence endpoints have no frontend consumer** | Intelligence console is a shell; real data exists but is invisible | Build MarketIntelligenceView data hooks |
| 2 | **Emergency resources API exists but HelpMeNowView uses hardcoded data** | Emergency contacts may be outdated | Fetch from `/api/dahab/emergency` |
| 3 | **Several frontend API methods call non-existent endpoints** | Silent failures (getWeatherTelemetry returns null) | Implement missing endpoints or remove dead code |
| 4 | **Duplicate market routes** (`/api/market/*` and `/api/dahab/commerce/*`) | Confusion about which to call | Consolidate to one namespace |
| 5 | **Ledger endpoints missing** (`/api/commerce/ledger`, `/api/commerce/ledger/verify`) | `api.getLedger()` and `api.verifyLedger()` always fail | Implement or remove |

### 🟡 Medium Gaps

| # | Gap | Impact | Fix |
|---|-----|--------|-----|
| 6 | **DKOS admin endpoints (17) have no frontend** | Admin can't manage knowledge graph via UI | Build admin dashboard or CLI |
| 7 | **Area profiles API exists but Explore doesn't use it** | No area-based browsing experience | Enhance Explore with area cards |
| 8 | **Supplier catalog API exists but booking uses curated data** | Real supplier data unused in booking flow | Connect booking to live supplier data |
| 9 | **Weather/camera telemetry endpoints may not exist** | Frontend gracefully falls back to null | Implement or confirm they're simulated |
| 10 | **No real-time WebSocket/SSE** | Polling required for live conditions | Consider adding SSE for weather/telemetry |

### 🟢 Low Priority

| # | Gap | Impact | Fix |
|---|-----|--------|-----|
| 11 | **`api.runGoldenJourneyTest()` duplicates `api.runGoldenJourneySuite()`** | Dead code | Remove duplicate |
| 12 | **Some DayGI beta endpoints are publicly accessible** | Any authenticated user can manipulate experiment flags | Add role checks |
| 13 | **Frontend doesn't consume `GET /api/dahab/search`** | Natural language search unused | Wire SearchDrawer to unified search |

### Summary Statistics

| Metric | Count |
|--------|-------|
| Total backend endpoints | ~120 |
| Total frontend API methods | ~55 |
| Fully connected (backend ↔ frontend) | ~45 |
| Orphaned backend (no frontend consumer) | ~50 |
| Orphaned frontend (no backend endpoint) | ~10 |
| Duplicate route definitions | ~14 |
| **Connectivity rate** | **~37%** |

The backend is significantly more feature-complete than the frontend consumes. The frontend effectively uses about **one-third** of the available API surface. The unused two-thirds represents either:
1. **Admin/Operations tools** awaiting UI development
2. **Market intelligence features** awaiting dashboard integration
3. **Knowledge graph management** awaiting admin interface
4. **Duplicate routes** that should be consolidated

---

*Report generated by automated code analysis. All findings based on source code as of August 31, 2026.*
