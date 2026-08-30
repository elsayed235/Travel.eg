# DAHAB TRAVEL OS — Full Advanced User Story Implementation Blueprint v1

**Document Classification:** Authoritative Product & UX Architecture Specification  
**Source Baseline:** `DAHAB_FULL_ADVANCED_USER_STORIES_V1.md`  
**North Star:** *"وصلت دهب؟ سيب الباقي علينا." (You made it to Dahab. We’ll handle the rest.)*  
**Core Promise:** Discover → Plan → Book → Coordinate → Travel → Handle Changes → Help After Arrival → Complete the Trip

---

## 1. Executive Summary & Architectural System

The **Dahab Digital Travel OS** is a vertically integrated, domain-authoritative digital travel agency and on-ground companion. Unlike standard travel aggregators or disconnected listing marketplaces, the central product primitive is the **Trip**, a living, state-driven container that orchestrates multi-service bookings, transfers, on-ground utilities, real-time weather constraints, contingency rerouting, and supplier coordination.

### System Architecture Hierarchy
```text
Product (Dahab Travel OS)
  └── Persona (P01 – P09)
       └── Epic (Epics A – Z + AA Cross-Cutting)
            └── Critical Journey (J1 – J10)
                 └── Feature Module
                      └── User Story (A01 – AA12, Total: 189)
                           ├── Acceptance Criteria (Given / When / Then)
                           ├── State Machine Transitions
                           ├── Frontend Route & UX Matrix (EN/AR/RTL)
                           ├── Backend, API & Data Entities
                           └── Implementation Notes & Gaps
```

---

## 2. Personas (Authoritative Roster)

| Persona ID | Persona Name | Role | Core Goals | Operational Context & State |
|---|---|---|---|---|
| **P01** | Traveler / Visitor | Prospective Visitor | Instant inspiration, clear choices, zero-friction discovery without account creation. | Anonymous / Pre-auth |
| **P02** | Planning Traveler | Lead Planner | Multi-vertical planning, timeline synthesis, budgeting, group consensus, expert handoff. | Planning / Drafting |
| **P03** | In-Destination Traveler | Active Traveler in Dahab | Real-time guidance ("Today in Dahab"), marine conditions, "What to do now", food, local SOS. | On-Ground Active |
| **P04** | Trip Organizer | Group Leader | Coordinate passenger roster, collect votes, allocate shared expenses, lock bookings. | Authorized Organizer |
| **P05** | Group Member | Group Participant | View current shared itinerary, cast preference votes, view individual cost shares. | Participant |
| **P06** | Supplier / Operator | Local Sinai Partner | Manage inventory, capacity holds, instant WhatsApp/Console accept/reject, operational changes. | Verified Supplier |
| **P07** | Operations Agent | Central Agency Dispatcher | Live trip cockpit monitoring, exception handling, supplier coordination, dispute resolution. | Internal Ops |
| **P08** | Support / Concierge | Human Escalation Layer | Fast traveler context retrieval, Trip state history, direct chat/call intervention. | Concierge |
| **P09** | Product/Admin Operator | Platform Administrator | Content freshness audit, source verification, feature flags, system governance. | Admin |

---

## 3. Epics & Complete Story Hierarchy

### EPIC A: Discover Dahab (A01 – A09)
- **A01 — Homepage discovery:** First-time visitor understands North Star within seconds; enters planning without account creation.
- **A02 — Explore Dahab:** Browse by destination, area, experience, and interest.
- **A03 — Explore by location:** Spatial browsing by area/site (Lighthouse, Eel Garden, Blue Hole, Canyon, Lagoona, Assalah, Mashraba).
- **A04 — Explore by experience category:** Categorical browsing (Diving, Safari, Kitesurf, Food, Slow Dahab).
- **A05 — Collections:** Pre-curated collections (First-timer, Diver, Adventure, Couples, Short-stay).
- **A06 — Experience detail:** Trustworthy detail with inclusions, prerequisites, timing, verified pricing, authoritative availability.
- **A07 — Trust signals:** Verification badges, cancellation terms, freshness timestamps.
- **A08 — Discovery freshness:** Explicit timestamp indicators preventing reliance on stale data.
- **A09 — Unknown-state honesty:** Platform displays `UNSPECIFIED` or `Unknown` rather than fabricating availability.

### EPIC B: Plan My Dahab (B01 – B13)
- **B01 — Start planning:** Minimal-friction questionnaire (dates, travelers, budget tier, pace, interests).
- **B02 — Build My Dahab:** Synthesizes accommodation, transfer, activities, and food into 1 unified Trip object.
- **B03 — Generate suggested itinerary:** Algorithmic proposed day-by-day itinerary.
- **B04 — Understand why plan fits:** Plain-text explanation of contextual recommendation logic.
- **B05 — Compare alternatives:** Side-by-side comparison of max 3 options without tab sprawl.
- **B06 — Make it yours:** Granular customization (pickup location, private vs. shared, add-ons).
- **B07 — Flexible dates:** Value optimization across flexible calendar windows.
- **B08 — Watch a trip window:** Notification triggers when monitored conditions/prices mutate.
- **B09 — Human expert escalation:** 1-tap connection to local Dahab specialist.
- **B10 — Expert handoff context:** Full Trip draft context automatically forwarded to expert console.
- **B11 — Group planning:** Invite participants, record individual preferences, collect activity votes.
- **B12 — Group decision visibility:** Clear visual distinction between decided vs. open items.
- **B13 — Trip preview:** Holistic pre-checkout summary of chronology, budget, and trade-offs.

### EPIC C: Trip as the Central Product (C01 – C11)
- **C01 — Create Trip:** Initializing persistent Trip entity upon planning trigger.
- **C02 — Add TripItem:** Inserting multi-vertical service items into chronological state.
- **C03 — Remove TripItem:** Isolated deletion without invalidating the rest of the Trip.
- **C04 — View Trip timeline:** Interactive day/hour chronological visualization.
- **C05 — Trip constraints:** Guardrails preventing physically impossible transitions (e.g. Flight within 18h of deep dive).
- **C06 — Trip status:** Authoritative state progression (`planning` → `ready` → `holding` → `confirmed` → `in_destination` → `at_risk` → `completed`).
- **C07 — Trip health:** Diagnostic alert card surfacing blocking issues.
- **C08 — Trip Wallet:** Unified repository for tickets, QR passes, supplier vouchers, payment receipts.
- **C09 — Current version authority:** Guaranteed view of the single authoritative itinerary post-change.
- **C10 — Planned vs. Booked clarity:** Clear UI distinction between intentional wish-items and paid commitments.
- **C11 — Trip documents:** Offline-accessible digital vouchers and PDF passes attached to items.

### EPIC D: Transfer Booking — Golden Vertical (D01 – D14)
- **D01 — Discover transfer:** Sharm Airport / Taba Border ↔ Dahab routing and scheduling.
- **D02 — View real availability:** Authoritative seat/vehicle availability from fleet provider.
- **D03 — Select departure:** Detailed vehicle class, luggage limits, and pickup time review.
- **D04 — Add transfer to Trip:** Attaching transit leg to arrival/departure boundaries.
- **D05 — Review booking:** Pre-checkout audit (passenger names, flight numbers, luggage pieces).
- **D06 — Hold capacity:** Deterministic 15-minute hold lock during payment flow.
- **D07 — Checkout:** Idempotent checkout preventing duplicate charges or bookings.
- **D08 — Operator receives booking:** Instant dispatch notification to driver/operator console.
- **D09 — Operator accepts:** Driver confirms pickup; booking state transitions to `confirmed`.
- **D10 — Operator rejects:** Graceful rejection triggering automated re-dispatch / recovery.
- **D11 — Booking confirmation state:** Rigorous UI separation of `Payment Succeeded` vs. `Supplier Confirmed`.
- **D12 — Capacity integrity:** Database level exclusion locks preventing overselling.
- **D13 — Booking recovery:** In-line alternative selection upon transfer cancellation.
- **D14 — Wallet integration:** Driver contact, vehicle model, and QR voucher appear in Wallet.

### EPIC E: Accommodation (E01 – E06)
- **E01 — Discover stay:** Boutique eco-lodges, camps, and sea-view apartments.
- **E02 — Property detail:** Policies, amenities, check-in windows, and proximity to reef.
- **E03 — Room availability:** Real-time room inventory feed.
- **E04 — Book stay:** Adding room to Trip with deposit/full hold.
- **E05 — Check-in context:** Pre-arrival check-in coordination instructions.
- **E06 — Early arrival:** Automated bridging workflow for arrivals prior to 3:00 PM.

### EPIC F: Diving + Freediving (F01 – F07)
- **F01 — Discover diving:** Blue Hole, Canyon, Bells, Lighthouse, and Gabr El Bint trips.
- **F02 — Understand suitability:** Certification checks (Open Water, Advanced, Medical declarations).
- **F03 — Availability:** Certified dive guide and boat slot availability.
- **F04 — Book diving:** Direct reservation linked to Traveler itinerary.
- **F05 — Trip constraints after diving:** Enforced 18–24 hour no-fly and altitude safari locks.
- **F06 — Conditions-aware diving:** Wave height and visibility threshold integration.
- **F07 — Supplier confirmation:** Dive center instructor assignment and equipment verification.

### EPIC G: Safari + Bedouin (G01 – G05)
- **G01 — Discover safari:** White Canyon, Colored Canyon, St. Catherine, Wadi Qnai, Ras Abu Galum.
- **G02 — Choose style:** Private 4x4, camel trek, or Bedouin dinner under stars.
- **G03 — Understand inclusions:** Guide, national park permits, Bedouin tea, meals.
- **G04 — Add to Trip:** Integration with timeline and transit buffer calculations.
- **G05 — Changes:** Inclement weather / checkpoint delay recovery flow.

### EPIC H: Food & Beach Delivery (H01 – H07)
- **H01 — Food discovery:** Curated local breakfast, fresh seafood, cafes, Bedouin kitchens.
- **H02 — Food Now:** Contextual recommendations filtered by time and walking radius.
- **H03 — Restaurant detail:** Authoritative menu items, dietary tags, kitchen hours.
- **H04 — Delivery order:** Real-time order placement to beach chairs or hotel rooms.
- **H05 — Local rider execution:** Motorbike dispatch partner integration.
- **H06 — Order status:** 4-stage tracking (`accepted` → `preparing` → `on_way` → `delivered`).
- **H07 — Support:** 1-tap intervention for delayed or missing food items.

### EPIC I: Mobility (I01 – I05)
- **I01 — Scooter rental:** Daily and multi-day local scooter booking.
- **I02 — Bicycle rental:** Eco-friendly town cruiser rentals.
- **I03 — Resource integrity:** Physical asset fleet allocation preventing double-lease.
- **I04 — Pickup/return:** Designated hub drop-off points (Lighthouse, Eel Garden).
- **I05 — Mobility in Trip:** Integrated as active mobility pass in Trip timeline.

### EPIC J: Dahab Live / Conditions (J01 – J06)
- **J01 — Dahab right now:** Real-time environmental ambient dashboard.
- **J02 — Environmental data:** Wind speed (knots), swell, water temperature, UV index, visibility.
- **J03 — Unknown state:** Explicit honesty flags when sensor or operator feed is offline.
- **J04 — Decision window:** Activity green/yellow/red readiness indicators based on conditions.
- **J05 — Golden hour:** Dynamic sunset countdown and prime viewing location prompts.
- **J06 — Morning brief:** Automated 08:00 AM daily briefing via in-app or WhatsApp.

### EPIC K: What Should I Do Now? (K01 – K05)
- **K01 — Current context:** Spontaneous recommendation engine reading current location & time.
- **K02 — Free time:** Automatic gap analysis in Trip timeline proposing micro-activities.
- **K03 — Personal fit:** Strict 3-option curation tailored to stated vibe.
- **K04 — Add to Trip:** 1-tap adoption injecting chosen activity into live schedule.
- **K05 — Not interested:** Dismissal without penalty or repetitive prompting.

### EPIC L: Near Me (L01 – L03)
- **L01 — Nearby essentials:** Verified pharmacies, ATMs, grocery shops, bike repair.
- **L02 — Contextual proximity:** Walking distances and minutes calculated from current geo-anchor.
- **L03 — Open/current state:** Authoritative open/closed indicators.

### EPIC M: Arrival Mode (M01 – M04)
- **M01 — Early arrival:** Dedicated UI state when traveler reaches Dahab before 3:00 PM.
- **M02 — Luggage:** Secure luggage storage hub booking and directions.
- **M03 — First hours:** Curated 2-hour mini-itinerary (Breakfast, Coffee, Promenade walk).
- **M04 — Check-in transition:** Automated push notification and UI state transition when room is ready.

### EPIC N: Departure Mode (N01 – N04)
- **N01 — Know departure plan:** Countdown to checkout, airport transfer pickup, and flight departure.
- **N02 — Transfer reminder:** Driver details, vehicle license, and Sharm airport transit buffer.
- **N03 — Final tasks:** Pre-departure checklist (Souvenirs, Key return, Equipment drop-off).
- **N04 — Checkout / baggage:** Late checkout request options and luggage hold guidance.

### EPIC O: Change Engine / Agency (O01 – O12)
- **O01 — Detect change:** Structured change event emission on supplier delay or weather disruption.
- **O02 — Explain impact:** Clear root-cause explanation highlighting downstream affected items.
- **O03 — Alternatives:** Exactly 3 viable alternative plans generated deterministically.
- **O04 — Compare alternatives:** Side-by-side trade-off matrix (time shift vs. refund vs. substitute).
- **O05 — Choose alternative:** 1-tap rebooking updating affected TripItem and notifying suppliers.
- **O06 — Ask for help:** Immediate concierge escalation button.
- **O07 — Preserve history:** Immutable audit log of all trip mutations and timestamps.
- **O08 — Partial disruption:** Isolated healing preserving unaffected bookings.
- **O09 — Multi-supplier coordination:** Centralized coordination payload preventing separate supplier negotiations.
- **O10 — Financial effect boundary:** Strict financial balance recalculation routed to ledger.
- **O11 — Idempotent decision:** Rejection of duplicate change choice submissions.
- **O12 — Concurrent change:** Conflict resolution lock between Traveler and Operations actions.

### EPIC P: AI Trip Director (P01 – P07)
- **P01 — Generate ideas:** Contextual micro-itineraries aligned with Traveler pace.
- **P02 — Explain proposal:** Transparent rationale for generated schedules.
- **P03 — Validate proposal:** Deterministic validation against pricing, inventory, and safety rules.
- **P04 — Add to Trip:** Atomic injection into Trip timeline.
- **P05 — Revise proposal:** Natural language refinement (e.g. "make it slower", "add seafood").
- **P06 — Protect constraints:** Strict impossibility of AI overriding no-fly or overlap constraints.
- **P07 — Distinguish proposal from commitment:** Proposals remain soft drafts until explicit user confirmation.

### EPIC Q: Group Travel (Q01 – Q06)
- **Q01 — Invite members:** Magic link / QR invite generation for group joining.
- **Q02 — Preferences:** Individual survey intake for dietary restrictions, dive certifications.
- **Q03 — Vote:** Upvote/downvote polling on candidate excursions.
- **Q04 — Organizer decision:** Final executive lock by designated trip leader.
- **Q05 — Shared visibility:** Real-time sync of agreed itinerary across all member devices.
- **Q06 — Split expenses:** Itemized per-person breakdown calculation.

### EPIC R: Trip Budget (R01 – R05)
- **R01 — Budget target:** Total target allocation in EGP / USD / EUR.
- **R02 — Spend summary:** Real-time ledger of committed (booked) vs. estimated (draft) funds.
- **R03 — Category breakdown:** Visual breakdown (Stays, Transport, Diving, Food, Safari).
- **R04 — Budget warning:** Proactive alerts when proposed additions exceed target threshold.
- **R05 — AI savings suggestion:** Optimized alternative recommendations with lower cost footprint.

### EPIC S: Supplier / Partner OS (S01 – S10)
- **S01 — Supplier onboarding:** Partner business profile and contact registry.
- **S02 — Product management:** Service catalog creation with strict pricing and inclusion metadata.
- **S03 — Availability:** Real-time slot management calendar.
- **S04 — Resource management:** Boat capacity, fleet vehicles, and instructor allocation.
- **S05 — Booking inbox:** Real-time incoming booking queue with SLA countdown timer.
- **S06 — Accept/reject:** 1-tap confirmation or structured rejection with standard operational codes.
- **S07 — Change response:** Supplier-initiated delay/cancellation dispatch.
- **S08 — Freshness:** Inventory freshness audit scores and reminder triggers.
- **S09 — Reliability:** Operational metrics tracking on-time performance and fulfillment rate.
- **S10 — WhatsApp confirmation:** Secure, webhook-audited WhatsApp interactive confirmation flow.

### EPIC T: Operations Console (T01 – T09)
- **T01 — Live trip monitoring:** Global radar showing all in-destination travelers and current day health.
- **T02 — Booking exceptions:** Highlighted queue of pending, delayed, or rejected items.
- **T03 — Supplier exceptions:** Alert board for unresponsive or overbooked operators.
- **T04 — Change management:** Operator tool to compose and push multi-item recovery packages.
- **T05 — Support context:** Instant 360-degree traveler view (itinerary, spend, issues, chat history).
- **T06 — Freshness monitoring:** Automated detection of stale inventory sources.
- **T07 — Feature flags:** Dynamic runtime toggles for experimental features and new verticals.
- **T08 — Operational audit:** Comprehensive immutable event log of all system and human actions.
- **T09 — Dispatch:** Real-time rider and driver assignment board.

### EPIC U: Support / Human Escalation (U01 – U04)
- **U01 — Help Me Now:** Global floating SOS / support trigger available on every screen.
- **U02 — Context carried forward:** Support ticket pre-populated with exact itinerary state and error code.
- **U03 — WhatsApp bridge:** Deep-link to verified Sinai Concierge with session token.
- **U04 — Case status:** Live ticket resolution progress indicator for the traveler.

### EPIC V: Notifications (V01 – V07)
- **V01 — Booking notification:** Instant transactional receipt and supplier queue notice.
- **V02 — Pending confirmation:** Status update when supplier review is underway.
- **V03 — Change notification:** High-priority push/SMS alert for itinerary schedule adjustments.
- **V04 — Traveler action:** Clear call-to-action prompt when input/approval is required.
- **V05 — Departure reminder:** T-24h and T-3h departure and transfer prep notifications.
- **V06 — In-trip contextual notification:** Location/time triggered nudges (e.g. "Sunset in 40 mins").
- **V07 — Idempotent notification:** Deduplication engine preventing repeated alerts.

### EPIC W: Authentication & Identity (W01 – W05)
- **W01 — Request OTP:** Phone / WhatsApp OTP trigger without cumbersome passwords.
- **W02 — Verify OTP:** Fast session token creation and state hydration.
- **W03 — Session restore:** Transparent token refresh and local state preservation.
- **W04 — Logout:** Secure session invalidation and cache purge.
- **W05 — Unauthorized resource:** Safe 404/not-found response masking protected resources.

### EPIC X: Content & Knowledge (X01 – X05)
- **X01 — Content freshness:** Content registry with expiration timestamps.
- **X02 — Content source:** Clear attribution of verified local guides and sources.
- **X03 — Supply discovery:** Workflow for ingesting and validating emerging Sinai operators.
- **X04 — Competitive intelligence:** Structured tracking of seasonal rate benchmarks.
- **X05 — Content gap:** Unanswered search/question telemetry logging.

### EPIC Y: Memories & Dahab Passport — Proposed / Later (Y01 – Y04)
- **Y01 — Trip memories:** Chronological visual photo and milestone scrapbook.
- **Y02 — Passport:** Digital stamped travel record of completed dives and summits.
- **Y03 — Badges:** Non-blocking achievement markers (e.g. Canyon Diver, Bedouin Stargazer).
- **Y04 — Shareable memory:** Exportable summary card for social sharing.

### EPIC Z: Emergency / Safety — Proposed until verified (Z01 – Z03)
- **Z01 — Emergency access:** Direct connection to Dahab Decompression Chamber and Police.
- **Z02 — Local emergency context:** Contextual triage advice based on traveler location.
- **Z03 — Lost traveler support:** Bilingual English/Arabic driver card with exact GPS coordinates.

### EPIC AA: Cross-Cutting Architectural Stories (AA01 – AA12)
- **AA01 — Honest data:** UI strictly separates verified real-time feeds from static approximations.
- **AA02 — Money correctness:** All monetary math executed in integer minor units (EGP Piastres / Cents).
- **AA03 — No duplicate charge:** Strict idempotency tokens on all payment and checkout operations.
- **AA04 — No oversell:** ACID database capacity holds preventing inventory collisions.
- **AA05 — Auditability:** Structured JSON logs for all mutations.
- **AA06 — Arabic parity:** Full bidirectional RTL layout and culturally authentic Arabic typography.
- **AA07 — Mobile-first:** Responsive perfection at 390px–430px smartphone viewports.
- **AA08 — Reduced motion:** Full compliance with `prefers-reduced-motion` eliminating heavy animations.
- **AA09 — No dead ends:** Every screen provides clear next steps or graceful fallbacks.
- **AA10 — Recovery over failure:** Failure states always provide structured rebooking alternatives.
- **AA11 — Human escalation:** Deterministic routing to live operations when automation reaches boundary.
- **AA12 — Current-trip authority:** UI automatically shifts focus to active Trip once travel commences.

---

## 4. State Machines

### A. Trip State Machine
```text
[ DRAFT ] ──────────► [ HOLDING ] ──────────► [ CONFIRMED ]
   │                     │                         │
   │ (Discard)           │ (Timeout / Payment Fail)│ (Check-in / Start)
   ▼                     ▼                         ▼
[ CANCELLED ] ◄───── [ DRAFT ]              [ IN_DESTINATION ]
                                                   │
                                                   ├──► [ AT_RISK / CHANGING ]
                                                   │          │
                                                   │          ▼ (Resolved)
                                                   │    [ IN_DESTINATION ]
                                                   ▼ (Checkout)
                                             [ COMPLETED ]
```

### B. Booking & Fulfillment State Machine
```text
[ PENDING_PAYMENT ] ──► [ PAID_PENDING_SUPPLIER ] ──► [ SUPPLIER_CONFIRMED ]
        │                        │                          │
        ▼ (Fail)                 ▼ (Reject)                 ▼ (Fulfill)
   [ EXPIRED ]              [ RECOVERY_REQUIRED ]      [ FULFILLED ]
                                 │
                                 ▼ (Rebook / Refund)
                            [ RESOLVED ]
```

---

## 5. Critical End-to-End Journeys (J1 – J10)

1. **J1 — First-Time Discovery & Plan:** Homepage → Explore Collections → Experience Detail → Build Itinerary → Preview.
2. **J2 — Transfer Golden Vertical Booking:** Transfer Route Search → Availability Hold → Idempotent Checkout → Driver Assignment → Wallet Pass.
3. **J3 — In-Trip Disruption & Recovery:** Sea Condition Warning → Change Detected → Alternative Comparison → 1-Tap Rebooking → Coordinated Schedule Update.
4. **J4 — In-Destination Companion Routine:** Morning Marine Radar → Dive Session → "What Should I Do Now?" (2-Hour Gap) → Food Delivery to Beach → Sunset Prompt.
5. **J5 — Early Arrival Bridging:** 10:00 AM Arrival → Hotel Check-in at 3:00 PM → Luggage Hub Drop → Curated 2-Hour Breakfast/Walk → Room Ready Push Notification.
6. **J6 — Collaborative Group Planning:** Organizer Trip Creation → Magic Link Invite → Member Preference Polling → Activity Voting → Organizer Lock.
7. **J7 — AI Director Customization:** Trip Context Ingestion → AI Proposal Composition → Deterministic Availability Validation → User Confirmation → Schedule Injection.
8. **J8 — Supplier SLA Fulfillment:** Instant Booking Dispatch → Supplier Mobile Inbox → Accept/Reject (5 min SLA) → Automated Customer Status Notification.
9. **J9 — Central Operations Intervention:** Exception Triggered on Delayed Safari → Ops Console Multi-Supplier Re-coordination → Push Recovery to Traveler → Traveler Accepts.
10. **J10 — Smart Departure Countdown:** Checkout Reminder → Luggage Hold Option → Scheduled Airport Transfer Pickup → Sharm Airport Arrival → Trip Completion & Scrapbook.

---

## 6. Frontend Route & UX Matrix

| Route | Primary View Component | Supported Story IDs | Mobile Viewport | Arabic RTL Support |
|---|---|---|---|---|
| `/` | `V2HomeCockpit` | A01-A05, J01-J05, AA01-AA12 | 100% Fluid 390px | Native RTL |
| `/trip-builder` | `TripPlanner` | B01-B07, B13, C01-C05, P01-P05 | Step Wizard | Native RTL |
| `/my-trip` | `MyTripView` | C01-C11, M01-M04, K01-K05, AA12 | Day Scrubbing | Native RTL |
| `/explore` | `ExploreView` | A02-A09, L01-L03, F01, G01 | Grid / Map Split | Native RTL |
| `/bookings` | `BookingsView` | D01-D14, C08-C11, AA02-AA04 | Voucher Stack | Native RTL |
| `/live` | `DahabLiveView` | J01-J06, F06, AA01 | Gauge Cluster | Native RTL |
| `/food` | `FoodNowView` | H01-H07, L01 | Filterable List | Native RTL |
| `/help` | `HelpMeNowView` | U01-U04, Z01-Z03, AA11 | SOS Quick Grid | Native RTL |
| `/change-recovery`| `ChangeAndRecoveryView`| O01-O12, AA10 | Compare Matrix | Native RTL |
| `/ai-director` | `AiDirectorView` | P01-P07 | Chat / Plan Split | Native RTL |
| `/departure` | `DepartureView` | N01-N04 | Timeline Card | Native RTL |
| `/memories` | `MemoriesView` | Y01-Y04 | Photo Grid | Native RTL |
| `/profile` | `ProfileView` | W01-W05, R01-R05, Q01-Q06 | Account Panels | Native RTL |
| `/ops-console` | `OperationsDashboard` | T01-T09, S01-S10 | Data Density View | Native RTL |

---

## 7. AI & Real-Time Operational Guardrails

### The AI Directive:
> **"AI proposes. The system validates. The user decides. The domain remains authoritative."**
- AI generated itineraries (Epic P) are strictly tentative proposals.
- No AI output can bypass:
  1. Real-time availability checks.
  2. Verified supplier rate cards.
  3. No-Fly safety intervals (18h post-dive).
  4. Geolocation travel feasibility (transit buffer calculation).

### Real-Time & Sensor Directives:
- Environmental metrics (`wind`, `swell`, `visibility`) must carry explicit freshness timestamps.
- If live sensor feed drops, status displays `UNSPECIFIED` or `Historical Average` with clear disclosure.
- Financial arithmetic uses integer minor units (e.g. `35000` Piastres for `350.00 EGP`) to eliminate floating-point rounding errors.

---

## 8. Prioritization & Release Phases

- **P0 (Phase 1 — Core Agency Foundation):** Epics A, B, C, D, O, U, V, AA. (Discover, Plan, Trip Container, Transfer Booking, Change Recovery V1, Support, Unified Wallet).
- **P1 (Phase 2 — Vertical Expansion & In-Destination Utility):** Epics E, F, G, H, I, J, K, L, M, N, S, T, W. (Stays, Diving, Safari, Food Delivery, Mobility, Live Radar, Early Arrival, Supplier/Ops Consoles).
- **P2 (Phase 3 — Intelligence & Collaboration):** Epics P, Q, R, X. (AI Trip Director, Group Travel, Budget Optimizer, Knowledge Engine).
- **P3 (Phase 4 — Proposed / Future Enhancements):** Epics Y, Z. (Dahab Passport, Digital Badges, Social Scrapbook, Enhanced Emergency Grid).

---

## 9. Document Gaps & Open Technical Questions

1. **Third-Party Payment Gateway Webhooks:** Exact gateway provider (Paymob / Fawry / Stripe) webhook idempotency specification marked as `UNSPECIFIED` in source.
2. **Offline Local Storage Limits:** ServiceWorker cache quota for offline map tiles and high-resolution vouchers requires device-specific benchmarking.
3. **Supplier WhatsApp Interactive Payload:** Meta Business API interactive button payload structure requires formal endpoint registration.
