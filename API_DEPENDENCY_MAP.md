# DAHAB — API / BACKEND DEPENDENCY MAP (Phase 0.5 deliverable)
*Every meaningful surface → endpoint → service → domain → tables → permissions. Source: api.ts (2,339 lines), server.ts (4,568 lines, 168 inline handlers), server/services (72 files), tableSpecs (63 tables).*

## 1. CORE DOMAIN CHAINS (surface → API → service → tables)
| Surface | Endpoint(s) | Service | Tables | Notes |
|---|---|---|---|---|
| Auth | /api/auth/* (register, login, logout, me, firebase-session) | auth (inline), sessions | users, sessions, suppliers | session-only identity; role from session |
| Commerce | /api/commerce/* (inventory, availability, holds, checkout, multi-checkout, refunds) | commerceService, bookingService, bookingLifecycle | skus, inventory_slots, bookings, ledger, holds | idempotency keys; price server-resolved; ledger balanced |
| Trips | /api/trips/*, /api/trip/generate, /apply-ai, /items | tripService (inline), availabilityJoinService | trips, trip_items | ownership via req.user; price-immune apply-ai |
| Bookings manage | /api/bookings/:ref (detail, manage, reschedule, review) | bookingService, bookingManage (client svc) | bookings, notifications | lifecycle allow-listed both sides |
| Reviews | /api/reviews/* (submit, moderate, respond, supplier/:id) | reviewService | reviews | verified-stay gate; display names only |
| Search | /api/dahab/search | unifiedSearchEngine | catalogue collections | bilingual NL; client bypasses it today (P3) |
| Marine | /api/telemetry/marine (+ weather) | marineService | (live fetch Open-Meteo + thresholds) | per-activity go/caution/avoid |
| CMS | /api/content/* (pages, blocks, strings, theme, site-info, nav, media) + admin | contentService, siteInfoService, siteStringsService, themeService, mediaUpload, catalogContentService | cms_* (11 tables), media | workflow + bindings; compiled fallback in FE |
| DayGI | /api/daygi/* (query, tasks, memory, health, actions, beta) | daygiReasoningService, tripHealthService | daygi_* | deterministic-first; quota circuit |
| Transfers | /api/transfers/* (origins, geo, route, prepare, complete) | transferService | bookings (transfer type) | |
| Rentals | /api/rentals/* (list, detail, availability, quote, provider) | rentalService | rentals, rental bookings | maintenance blocks |
| Support | /api/support/* (messages, emergency) | (inline) + supportEscalationService | support_messages | ops queue |
| Notifications | /api/notifications/* | notificationService, pushService | notifications | sim gateway until P7 |
| Analytics | /api/analytics/events | analyticsService | analytics_events (append-only) | ping 200 live |
| Ops | /api/admin/* (suppliers, ledger, bookings, health, jobs, sms, audit, flags, knowledge) | commerceService, supplierService, knowledge ops | users, suppliers, bookings, ledger, audit_events | RBAC Operations/Admin |
| Supplier | /api/supplier/* (bookings, respond, rentals, reliability) | supplierService, reliabilityService | bookings, suppliers | acting supplier from session |
| Market | /api/market/* (intel, jobs, opportunities) | intelligence (inline) + daygi | market data collections | ops-heavy |

## 2. CAPABILITY → UI GAP TABLE (server-built, surface missing)
| Service (tests) | Route exposed? | UI today | Work |
|---|---|---|---|
| longStayService (longStayPricing.test.ts) | ❌ | none | P2: /long-stay + pricing UI (server-computed) |
| reefPositiveService (reefPositive.test.ts) | ❌ | none | P2: impact gauge on trip/profile |
| groupPlanningService (groupPlanning.test.ts) | ❌ | TripGroupSplitCard only | P2: /groups/:id flow + split-pay via idempotent commerce |
| supplierCalendarService (supplierCalendar.test.ts) | ❌ | none | P2: portal calendar/availability |
| reliabilityService (reliabilityService.test.ts) | /api/supplier/reliability (ops) | SupplierCommand read | P2: traveler verified badges |
| marineService | /api/telemetry/marine | /live MarineConditions | P2: join to listing cards |
| reviewService | /api/reviews/* | ReviewInvitations | ✅ shipped |
| unifiedSearchEngine | /api/dahab/search | SearchDrawer bypasses | P3: single-engine client |
| bundleService / longStay / fraudDetection / backupService / rateLimitStore | various | ops only | ops-visible where relevant |

## 3. PERMISSION MODEL (verified in apiAccessPolicy.ts + middleware)
Deny-by-default on /api; public exceptions: catalogue reads, content, telemetry, auth, search, health. optionalAuth → req.user from session/Bearer. Roles: Traveler/Supplier/Operations/Admin. Ownership: trips/bookings masked by userId; supplier actions resolve acting supplier from session; money paths use bodyParams; admin writes audit-logged.

## 4. NEW ENDPOINTS REQUIRED BY THE ROADMAP
P3: search explanation payload (extend /api/dahab/search) · P4: sold-out alternatives (/api/commerce/alternatives?sku=&date=) · hold-expiry events (extend booking detail/SSE) · P6: attention aggregation (/api/admin/attention) + revenue queries (ledger-sourced) · P2: supplier calendar CRUD, group trip routes (/api/groups/*), long-stay pricing endpoint, reef-impact aggregate. Each carries its 13-field Impact Record at implementation.

## 5. LOGGING / ANALYTICS
Structured JSON logs with correlation IDs on every handler; analytics_events append-only (search, listing_view, hold, checkout, review, ai_interaction, condition_view planned per event schema in blueprint §T). Every new endpoint: correlation-id log line + analytics event where user-visible.