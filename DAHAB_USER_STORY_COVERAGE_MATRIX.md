# DAHAB TRAVEL OS — User Story Coverage Matrix v1

**Classification:** Full Traceability & Architectural Mapping Matrix  
**Source Baseline:** `DAHAB_FULL_ADVANCED_USER_STORIES_V1.md`  
**Total Stories:** 189 | **Total Epics:** 27 | **Total Personas:** 9

| Story ID | Persona | Epic | Journey | Frontend Surface | Backend Domain | API Operation | DB Entity | Analytics Event | Notification | Test Verification | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **A01** | P01 | Epic A: Discover | J1 | `/` (HomeCockpit) | ContentDomain | `GET /api/content/home` | `LandingContent` | `discovery_homepage_viewed` | None | E2E Hero Render | Build / Current |
| **A02** | P01 | Epic A: Discover | J1 | `/explore` (ExploreView) | CatalogDomain | `GET /api/catalog/explore` | `Experience` | `explore_catalog_opened` | None | Integration Test | Build / Current |
| **A03** | P01 | Epic A: Discover | J1 | `/explore` (AreaFilter) | CatalogDomain | `GET /api/catalog/by-area` | `LocationSite` | `explore_area_filtered` | None | Unit Test | Build / Current |
| **A04** | P01 | Epic A: Discover | J1 | `/explore` (CategoryPills)| CatalogDomain | `GET /api/catalog/categories`| `Category` | `explore_category_selected`| None | Unit Test | Build / Current |
| **A05** | P01 | Epic A: Discover | J1 | `/explore` (Collections) | CatalogDomain | `GET /api/catalog/collections`| `Collection` | `collection_viewed` | None | Component Test | Build / Current |
| **A06** | P01 | Epic A: Discover | J1 | `/experience/:id` | CatalogDomain | `GET /api/catalog/item/:id` | `ExperienceDetail` | `experience_detail_viewed` | None | Snapshot / E2E | Build / Current |
| **A07** | P01 | Epic A: Discover | J1 | `/experience/:id` (Trust) | SupplierDomain | `GET /api/supplier/trust` | `SupplierVerification` | `trust_badges_viewed` | None | Component Test | Build / Current |
| **A08** | P01 | Epic A: Discover | J1 | Global Badge | DataFreshness | `GET /api/system/freshness` | `FreshnessLog` | `freshness_checked` | None | Unit Test | Build / Current |
| **A09** | P01 | Epic A: Discover | J1 | Global Fallback | SystemDomain | In-App State Handler | `SystemFlag` | `unknown_state_rendered` | None | Unit Test | Build / Current |
| **B01** | P02 | Epic B: Plan | J1 | `/trip-builder` (Wizard) | PlanningDomain | In-Memory / Local Draft | `DraftTrip` | `planning_wizard_started` | None | E2E Wizard Flow | Build / Current |
| **B02** | P02 | Epic B: Plan | J1 | `/trip-builder` (Synthesizer)| TripDomain | `POST /api/trip/create` | `Trip` | `trip_synthesized` | None | Integration Test | Build / Current |
| **B03** | P02 | Epic B: Plan | J1 | `/trip-builder` (Timeline) | PlanningDomain | `POST /api/planner/generate` | `Itinerary` | `itinerary_generated` | None | Algorithm Test | Build / Current |
| **B04** | P02 | Epic B: Plan | J1 | `/trip-builder` (Rationale)| PlanningDomain | `GET /api/planner/rationale` | `PlanRationale` | `plan_rationale_viewed` | None | Component Test | Build / Current |
| **B05** | P02 | Epic B: Plan | J1 | `/trip-builder` (Compare) | PlanningDomain | `POST /api/planner/compare` | `AlternativeSet` | `alternatives_compared` | None | UX Test | Build / Current |
| **B06** | P02 | Epic B: Plan | J1 | `/trip-builder` (Customize)| TripDomain | `PATCH /api/trip/item/:id` | `TripItem` | `trip_item_customized` | None | Unit Test | Build / Current |
| **B07** | P02 | Epic B: Plan | J1 | `/trip-builder` (Dates) | PricingDomain | `GET /api/pricing/flexible` | `DatePricingGrid` | `flexible_dates_viewed` | None | Integration Test | Build / Current |
| **B08** | P02 | Epic B: Plan | J1 | `/trip-builder` (Watch) | AlertDomain | `POST /api/alerts/watch` | `TripAlertWatch` | `trip_watch_activated` | Push / Email | Backend Test | Build / Current |
| **B09** | P02 | Epic B: Plan | J1 | `/help` (Expert Modal) | SupportDomain | `POST /api/support/escalate` | `SupportTicket` | `expert_help_requested` | In-App Notice | Integration Test | Build / Current |
| **B10** | P02 | Epic B: Plan | J1 | Support Console | SupportDomain | `GET /api/support/ticket/:id`| `TripContext` | `expert_context_received` | Webhook | Backend Test | Build / Current |
| **B11** | P04 | Epic B: Plan | J6 | `/my-trip` (Group Modal) | GroupDomain | `POST /api/group/invite` | `GroupRoster` | `group_invite_sent` | SMS / WhatsApp | Integration Test | Build / Current |
| **B12** | P05 | Epic B: Plan | J6 | `/my-trip` (Group Voting) | GroupDomain | `POST /api/group/vote` | `GroupVote` | `group_vote_cast` | In-App Sync | Component Test | Build / Current |
| **B13** | P02 | Epic B: Plan | J1 | `/my-trip` (Trip Preview) | TripDomain | `GET /api/trip/:id/preview` | `Trip` | `trip_preview_opened` | None | Snapshot Test | Build / Current |
| **C01** | P02 | Epic C: Trip | J1 | `/my-trip` | TripDomain | `POST /api/trip` | `Trip` | `trip_created` | None | API Contract | Build / Current |
| **C02** | P02 | Epic C: Trip | J1 | `/my-trip` | TripDomain | `POST /api/trip/:id/items` | `TripItem` | `trip_item_added` | None | Unit Test | Build / Current |
| **C03** | P02 | Epic C: Trip | J1 | `/my-trip` | TripDomain | `DELETE /api/trip/item/:id` | `TripItem` | `trip_item_removed` | None | Unit Test | Build / Current |
| **C04** | P02 | Epic C: Trip | J4 | `/my-trip` (Timeline) | TripDomain | `GET /api/trip/:id/timeline`| `ItineraryDay` | `timeline_viewed` | None | E2E Test | Build / Current |
| **C05** | P02 | Epic C: Trip | J1 | `/my-trip` | ConstraintEngine | `POST /api/rules/validate` | `RuleValidation` | `constraint_enforced` | None | Rule Engine Test | Build / Current |
| **C06** | P03 | Epic C: Trip | J4 | `/my-trip` (StatusBadge) | TripDomain | State Machine Resolver | `TripStatus` | `trip_status_changed` | None | State Test | Build / Current |
| **C07** | P03 | Epic C: Trip | J4 | `/my-trip` (HealthCard) | DiagnosticsDomain| `GET /api/trip/:id/health` | `TripHealthReport` | `trip_health_inspected` | In-App Banner | Unit Test | Build / Current |
| **C08** | P03 | Epic C: Trip | J2 | `/bookings` (TripWallet) | CommerceDomain | `GET /api/wallet/:tripId` | `WalletVoucher` | `wallet_opened` | None | Snapshot / E2E | Build / Current |
| **C09** | P03 | Epic C: Trip | J3 | `/bookings` (Authority) | TripDomain | Version Consensus Lock | `TripVersion` | `wallet_version_synced` | None | Concurrency Test | Build / Current |
| **C10** | P02 | Epic C: Trip | J1 | `/my-trip` (BadgeFilter) | TripDomain | State Projection | `TripItem` | `planned_vs_booked_toggled`| None | Component Test | Build / Current |
| **C11** | P03 | Epic C: Trip | J2 | `/bookings` (VoucherModal) | DocumentDomain | `GET /api/vouchers/:id/pdf` | `DigitalVoucher` | `voucher_downloaded` | None | E2E Test | Build / Current |
| **D01** | P01 | Epic D: Transfer | J2 | `/transfers` | TransferDomain | `GET /api/transfers/routes` | `TransferRoute` | `transfer_search_initiated`| None | Integration Test | Build / Current |
| **D02** | P01 | Epic D: Transfer | J2 | `/transfers` | FleetDomain | `GET /api/fleet/availability`| `VehicleSlot` | `transfer_availability_viewed`| None | Real-time Test | Build / Current |
| **D03** | P01 | Epic D: Transfer | J2 | `/transfers` (Detail) | TransferDomain | `GET /api/transfers/slot/:id`| `VehicleSlot` | `departure_selected` | None | Component Test | Build / Current |
| **D04** | P02 | Epic D: Transfer | J2 | `/my-trip` | TripDomain | `POST /api/trip/:id/transfer`| `TripItem` | `transfer_added_to_trip` | None | Unit Test | Build / Current |
| **D05** | P02 | Epic D: Transfer | J2 | `/bookings/checkout` | CommerceDomain | `POST /api/checkout/review` | `CheckoutSession` | `booking_review_opened` | None | E2E Test | Build / Current |
| **D06** | P02 | Epic D: Transfer | J2 | Checkout Lock | InventoryDomain | `POST /api/inventory/hold` | `CapacityHold` | `capacity_held` | None | ACID Hold Test | Build / Current |
| **D07** | P02 | Epic D: Transfer | J2 | `/bookings/checkout` | PaymentDomain | `POST /api/payment/checkout`| `PaymentLedger` | `checkout_authorized` | SMS / Push | Idempotency Test | Build / Current |
| **D08** | P06 | Epic D: Transfer | J8 | Supplier Console | DispatchDomain | `POST /api/dispatch/notify` | `DispatchOrder` | `booking_dispatched` | Webhook / SMS | Integration Test | Build / Current |
| **D09** | P06 | Epic D: Transfer | J8 | Supplier Console | SupplierDomain | `POST /api/supplier/accept` | `Booking` | `booking_accepted_by_op` | Push to Traveler | SLA Test | Build / Current |
| **D10** | P06 | Epic D: Transfer | J8 | Supplier Console | SupplierDomain | `POST /api/supplier/reject` | `Booking` | `booking_rejected_by_op` | Push to Traveler | Recovery Trigger | Build / Current |
| **D11** | P03 | Epic D: Transfer | J2 | `/bookings` (Status) | TripDomain | Dual State Resolver | `BookingState` | `confirmation_state_rendered`| None | UI Truth Test | Build / Current |
| **D12** | P07 | Epic D: Transfer | J8 | Core DB Lock | InventoryDomain | Database Transaction | `VehicleSeat` | `capacity_integrity_verified`| None | Load Test | Build / Current |
| **D13** | P03 | Epic D: Transfer | J3 | `/change-recovery` | RecoveryDomain | `POST /api/recovery/transfer`| `AlternativeSlot` | `transfer_recovery_triggered`| In-App Notice | E2E Test | Build / Current |
| **D14** | P03 | Epic D: Transfer | J2 | `/bookings` (Wallet) | DocumentDomain | `GET /api/wallet/pass/:id` | `DigitalPass` | `transfer_wallet_rendered` | None | Snapshot Test | Build / Current |
| **E01** | P01 | Epic E: Stays | J1 | `/explore` (Stays) | StaysDomain | `GET /api/stays/explore` | `Property` | `stay_discovery_opened` | None | Component Test | Build / Current |
| **E02** | P01 | Epic E: Stays | J1 | `/stays/:id` | StaysDomain | `GET /api/stays/detail/:id` | `PropertyDetail` | `property_detail_viewed` | None | Snapshot Test | Build / Current |
| **E03** | P02 | Epic E: Stays | J1 | `/stays/:id/rooms` | StaysDomain | `GET /api/stays/availability`| `RoomInventory` | `room_availability_viewed` | None | Integration Test | Build / Current |
| **E04** | P02 | Epic E: Stays | J1 | `/my-trip` | TripDomain | `POST /api/trip/:id/stay` | `TripItem` | `stay_booked_to_trip` | Push Notice | E2E Test | Build / Current |
| **E05** | P03 | Epic E: Stays | J5 | `/my-trip` (Briefing) | StaysDomain | `GET /api/stays/checkin-info`| `CheckInPolicy` | `checkin_context_viewed` | None | Component Test | Build / Current |
| **E06** | P03 | Epic E: Stays | J5 | `/my-trip` (EarlyArrival) | ArrivalDomain | `POST /api/arrival/early` | `EarlyArrivalPlan` | `early_arrival_triggered` | In-App Notice | E2E Test | Build / Current |
| **F01** | P01 | Epic F: Diving | J1 | `/explore` (Diving) | DivingDomain | `GET /api/diving/experiences`| `DiveExperience` | `diving_discovery_viewed` | None | Component Test | Build / Current |
| **F02** | P01 | Epic F: Diving | J1 | `/diving/:id` | DivingDomain | `GET /api/diving/suitability` | `DivePrerequisite` | `dive_suitability_checked` | None | Unit Test | Build / Current |
| **F03** | P02 | Epic F: Diving | J1 | `/diving/:id/slots` | DivingDomain | `GET /api/diving/slots` | `DiveSlot` | `dive_slots_viewed` | None | Integration Test | Build / Current |
| **F04** | P02 | Epic F: Diving | J1 | `/my-trip` | TripDomain | `POST /api/trip/:id/dive` | `TripItem` | `dive_added_to_trip` | None | Unit Test | Build / Current |
| **F05** | P03 | Epic F: Diving | J1 | Timeline Lock | SafetyDomain | `POST /api/safety/no-fly-lock`| `TripConstraint` | `no_fly_constraint_locked` | Alert Banner | Rule Engine Test | Build / Current |
| **F06** | P03 | Epic F: Diving | J4 | `/live` (Conditions) | MarineDomain | `GET /api/marine/radar` | `MarineConditions` | `marine_conditions_synced` | None | Integration Test | Build / Current |
| **F07** | P06 | Epic F: Diving | J8 | Supplier Console | DivingDomain | `POST /api/supplier/dive-ack`| `DiveBooking` | `dive_supplier_confirmed` | Push to Traveler | SLA Test | Build / Current |
| **G01** | P01 | Epic G: Safari | J1 | `/explore` (Safari) | SafariDomain | `GET /api/safari/list` | `SafariTrip` | `safari_discovery_opened` | None | Component Test | Build / Current |
| **G02** | P02 | Epic G: Safari | J1 | `/safari/:id` | SafariDomain | `GET /api/safari/options` | `SafariConfig` | `safari_style_selected` | None | Unit Test | Build / Current |
| **G03** | P02 | Epic G: Safari | J1 | `/safari/:id` (Inclusions)| SafariDomain | `GET /api/safari/inclusions` | `SafariInclusion` | `safari_inclusions_viewed`| None | Snapshot Test | Build / Current |
| **G04** | P02 | Epic G: Safari | J1 | `/my-trip` | TripDomain | `POST /api/trip/:id/safari` | `TripItem` | `safari_added_to_trip` | None | Unit Test | Build / Current |
| **G05** | P03 | Epic G: Safari | J3 | `/change-recovery` | SafariDomain | `POST /api/recovery/safari` | `AlternativeSafari` | `safari_change_handled` | SMS / Push | Recovery Test | Build / Current |
| **H01** | P01 | Epic H: Food | J4 | `/food` (FoodDirectory) | FoodDomain | `GET /api/food/curated` | `Restaurant` | `food_directory_viewed` | None | Component Test | Build / Current |
| **H02** | P03 | Epic H: Food | J4 | `/food` (FoodNow) | FoodDomain | `GET /api/food/near-now` | `FoodNowRecommendation`| `food_now_clicked` | None | Location Test | Build / Current |
| **H03** | P03 | Epic H: Food | J4 | `/food/restaurant/:id` | FoodDomain | `GET /api/food/menu/:id` | `MenuCatalog` | `menu_detail_viewed` | None | Snapshot Test | Build / Current |
| **H04** | P03 | Epic H: Food | J4 | `/food/checkout` | OrderDomain | `POST /api/food/order` | `FoodOrder` | `food_order_submitted` | Push / SMS | E2E Checkout | Build / Current |
| **H05** | P07 | Epic H: Food | J4 | Rider Dispatch Hub | DispatchDomain | `POST /api/dispatch/rider` | `RiderAssignment` | `rider_dispatched` | Rider App Push | Dispatch Test | Build / Current |
| **H06** | P03 | Epic H: Food | J4 | `/food/tracking` | OrderDomain | `GET /api/food/order/:id` | `OrderStatus` | `food_tracking_viewed` | Step Push Alert | Real-time Test | Build / Current |
| **H07** | P03 | Epic H: Food | J4 | `/help` (FoodSOS) | SupportDomain | `POST /api/support/order-sos`| `SupportTicket` | `food_support_escalated` | In-App / Call | Integration Test | Build / Current |
| **I01** | P03 | Epic I: Mobility | J4 | `/my-trip` (ScooterCard)| FleetDomain | `POST /api/mobility/scooter` | `VehicleRental` | `scooter_rental_booked` | In-App Notice | E2E Test | Build / Current |
| **I02** | P03 | Epic I: Mobility | J4 | `/explore` (Bikes) | FleetDomain | `POST /api/mobility/bike` | `VehicleRental` | `bike_rental_booked` | None | Component Test | Build / Current |
| **I03** | P07 | Epic I: Mobility | J4 | Asset Allocation Lock | FleetDomain | Exclusive Lease Lock | `FleetAsset` | `mobility_resource_locked` | None | Concurrency Test | Build / Current |
| **I04** | P03 | Epic I: Mobility | J4 | `/my-trip` (RentalPass) | FleetDomain | `GET /api/mobility/pass/:id`| `RentalInstructions` | `mobility_pickup_viewed` | None | Snapshot Test | Build / Current |
| **I05** | P03 | Epic I: Mobility | J4 | `/my-trip` (Timeline) | TripDomain | Timeline Sync Engine | `TripItem` | `mobility_in_trip_synced` | None | Unit Test | Build / Current |
| **J01** | P03 | Epic J: Live | J4 | `/live` (LiveCockpit) | MarineDomain | `GET /api/marine/dahab-now` | `DahabLiveMetrics` | `live_dashboard_opened` | None | E2E Test | Build / Current |
| **J02** | P03 | Epic J: Live | J4 | `/live` (Sensors) | SensorDomain | `GET /api/marine/sensors` | `SensorTelemetry` | `sensor_data_refreshed` | None | Integration Test | Build / Current |
| **J03** | P03 | Epic J: Live | J4 | Fallback Badge | SensorDomain | Offline Heartbeat Check | `TelemetryStatus` | `sensor_offline_flagged` | None | Failure Test | Build / Current |
| **J04** | P03 | Epic J: Live | J4 | `/live` (Windows) | MarineDomain | `GET /api/marine/windows` | `ActivityWindow` | `activity_window_computed` | None | Algorithm Test | Build / Current |
| **J05** | P03 | Epic J: Live | J4 | Sunset Banner | SolarDomain | Solar Ephemeris Engine | `SunsetTime` | `golden_hour_prompted` | In-App Banner | Time Engine Test | Build / Current |
| **J06** | P03 | Epic J: Live | J4 | WhatsApp / Push | NotificationDomain | `POST /api/notify/brief` | `DailyBrief` | `morning_brief_dispatched` | WhatsApp / Push | Dispatch Test | Build / Current |
| **K01** | P03 | Epic K: Do Now | J4 | `/my-trip` (DoNowModal) | RecommendationDomain| `POST /api/recs/now` | `ContextualRec` | `do_now_triggered` | None | Component Test | Build / Current |
| **K02** | P03 | Epic K: Do Now | J4 | `/my-trip` (GapEngine) | TripDomain | Chronological Gap Scan | `ItineraryGap` | `timeline_gap_detected` | In-App Nudge | Unit Test | Build / Current |
| **K03** | P03 | Epic K: Do Now | J4 | `/my-trip` (3Options) | RecommendationDomain| Strict 3-Option Filter | `CuratedTrio` | `do_now_trio_viewed` | None | Snapshot Test | Build / Current |
| **K04** | P03 | Epic K: Do Now | J4 | `/my-trip` (1-Tap Add) | TripDomain | `POST /api/trip/inject` | `TripItem` | `do_now_item_accepted` | In-App Toast | E2E Test | Build / Current |
| **K05** | P03 | Epic K: Do Now | J4 | `/my-trip` (Dismiss) | RecommendationDomain| Dismiss State Record | `DismissLog` | `do_now_dismissed` | None | Unit Test | Build / Current |
| **L01** | P03 | Epic L: Near Me | J4 | `/explore` (NearMeList) | SpatialDomain | `GET /api/spatial/nearby` | `LocalSpot` | `nearby_essentials_opened` | None | Location Test | Build / Current |
| **L02** | P03 | Epic L: Near Me | J4 | Spatial Distance Tag | GeoSpatialEngine | Haversine Geo Calculation | `ProximityAnchor` | `proximity_computed` | None | Unit Test | Build / Current |
| **L03** | P03 | Epic L: Near Me | J4 | Live Open Badge | PlaceDomain | Current Time vs Schedule | `OperatingHours` | `opening_state_checked` | None | Unit Test | Build / Current |
| **M01** | P03 | Epic M: Arrival | J5 | `/my-trip` (EarlyMode) | ArrivalDomain | Arrival Time Comparator | `ArrivalSession` | `early_arrival_acknowledged`| In-App Greeting | State Test | Build / Current |
| **M02** | P03 | Epic M: Arrival | J5 | `/my-trip` (LuggageModal)| StorageDomain | `POST /api/storage/book` | `LuggageBooking` | `luggage_storage_booked` | In-App Voucher | Integration Test | Build / Current |
| **M03** | P03 | Epic M: Arrival | J5 | `/my-trip` (FirstHours) | ArrivalDomain | `GET /api/arrival/first2h` | `TwoHourPlan` | `first_hours_plan_viewed` | None | Component Test | Build / Current |
| **M04** | P03 | Epic M: Arrival | J5 | Hotel Ready Push | StaysDomain | Webhook from Hotel | `RoomStatus` | `room_ready_transitioned` | Push Notification | State Transition | Build / Current |
| **N01** | P03 | Epic N: Departure | J10 | `/departure` | DepartureDomain | `GET /api/departure/plan` | `DeparturePlan` | `departure_mode_opened` | None | E2E Test | Build / Current |
| **N02** | P03 | Epic N: Departure | J10 | `/departure` (Transfer) | TransferDomain | `GET /api/transfers/pickup` | `TransferPickup` | `transfer_reminder_viewed` | SMS / Push | Component Test | Build / Current |
| **N03** | P03 | Epic N: Departure | J10 | `/departure` (Tasks) | DepartureDomain | `GET /api/departure/tasks` | `DepartureChecklist` | `departure_tasks_checked` | None | Snapshot Test | Build / Current |
| **N04** | P03 | Epic N: Departure | J10 | `/departure` (Luggage) | StaysDomain | `POST /api/stays/late-co` | `LateCheckoutReq` | `late_checkout_requested` | In-App Status | Integration Test | Build / Current |
| **O01** | P07 | Epic O: Change | J3 | Event Stream | ChangeEngine | Event Bus `onBookingAltered`| `ChangeEvent` | `change_event_detected` | Push / SMS | Backend Test | Build / Current |
| **O02** | P03 | Epic O: Change | J3 | `/change-recovery` | ChangeEngine | `GET /api/change/impact/:id`| `ImpactAnalysis` | `change_impact_viewed` | Push Alert | E2E Test | Build / Current |
| **O03** | P03 | Epic O: Change | J3 | `/change-recovery` (Triad)| RecoveryDomain | `GET /api/change/alts/:id` | `AlternativeTrio` | `change_alts_generated` | None | Algorithm Test | Build / Current |
| **O04** | P03 | Epic O: Change | J3 | `/change-recovery` (Table)| RecoveryDomain | Client Trade-off Table | `AlternativeTrio` | `change_alts_compared` | None | Component Test | Build / Current |
| **O05** | P03 | Epic O: Change | J3 | `/change-recovery` (Rebook)| ChangeEngine | `POST /api/change/rebook` | `TripMutation` | `alternative_rebooked` | Push to Supplier | ACID Mutation | Build / Current |
| **O06** | P03 | Epic O: Change | J3 | `/help` (RecoverySOS) | SupportDomain | `POST /api/support/urgent` | `SupportTicket` | `change_support_escalated` | High-Pri Push | Integration Test | Build / Current |
| **O07** | P07 | Epic O: Change | J3 | Audit Timeline | AuditDomain | Append-Only Event Log | `TripAuditLog` | `trip_history_audited` | None | DB Test | Build / Current |
| **O08** | P03 | Epic O: Change | J3 | Timeline Isolation | ChangeEngine | Subgraph Mutation Engine | `ItinerarySubgraph` | `partial_disruption_isolated`| None | Graph Test | Build / Current |
| **O09** | P07 | Epic O: Change | J9 | Ops Change Matrix | OperationsDomain | `POST /api/ops/multi-coord`| `CoordinationPackage`| `multi_supplier_coordinated`| Supplier Webhooks| Dispatch Test | Build / Current |
| **O10** | P07 | Epic O: Change | J3 | Financial Ledger | LedgerDomain | `POST /api/ledger/rebalance`| `LedgerTransaction` | `change_financials_settled` | None | Invariant Test | Build / Current |
| **O11** | P03 | Epic O: Change | J3 | API Gateway Token | SecurityDomain | Idempotency Key Validator | `IdempotencyLock` | `idempotent_choice_guarded` | None | Security Test | Build / Current |
| **O12** | P07 | Epic O: Change | J9 | Optimistic Lock | TripDomain | Version Compare-and-Swap | `TripLock` | `concurrent_change_resolved`| Alert to Ops | Concurrency Test | Build / Current |
| **P01** | P02 | Epic P: AI Director | J7 | `/ai-director` | AiDirectorDomain | `POST /api/ai/director/plan`| `AiItineraryDraft` | `ai_plan_generated` | None | Prompt / Model | Build / Current |
| **P02** | P02 | Epic P: AI Director | J7 | `/ai-director` (Why) | AiDirectorDomain | `GET /api/ai/director/why` | `AiRationale` | `ai_rationale_viewed` | None | Component Test | Build / Current |
| **P03** | P02 | Epic P: AI Director | J7 | Validation Engine | ConstraintEngine | `POST /api/rules/validate-ai`| `ValidationResult` | `ai_proposal_validated` | None | Security Rule | Build / Current |
| **P04** | P02 | Epic P: AI Director | J7 | `/ai-director` (Apply) | TripDomain | `POST /api/trip/apply-ai` | `Trip` | `ai_proposal_accepted` | In-App Toast | Integration Test | Build / Current |
| **P05** | P02 | Epic P: AI Director | J7 | `/ai-director` (Refine) | AiDirectorDomain | `POST /api/ai/director/chat`| `AiChatSession` | `ai_proposal_refined` | None | Prompt Test | Build / Current |
| **P06** | P02 | Epic P: AI Director | J7 | Safety Interceptor | SafetyDomain | Safety Guardrail Middleware | `ConstraintRule` | `ai_constraint_enforced` | None | Guardrail Test | Build / Current |
| **P07** | P02 | Epic P: AI Director | J7 | Draft UI State | TripDomain | Transient State Layer | `AiProposalState` | `proposal_vs_commit_verified`| None | UI Test | Build / Current |
| **Q01** | P04 | Epic Q: Group | J6 | `/my-trip` (GroupModal) | GroupDomain | `POST /api/group/invite-link`| `GroupInvite` | `group_invite_created` | Share Sheet | Component Test | Build / Current |
| **Q02** | P05 | Epic Q: Group | J6 | `/group/survey/:id` | GroupDomain | `POST /api/group/preferences`| `MemberProfile` | `group_preferences_saved` | None | Integration Test | Build / Current |
| **Q03** | P05 | Epic Q: Group | J6 | `/my-trip` (VoteBadge) | GroupDomain | `POST /api/group/vote-item` | `GroupVoteRecord` | `group_activity_voted` | Real-time Push | Component Test | Build / Current |
| **Q04** | P04 | Epic Q: Group | J6 | `/my-trip` (LockBtn) | GroupDomain | `POST /api/group/lock-plan` | `GroupLock` | `group_plan_locked` | Broadcast Push | E2E Test | Build / Current |
| **Q05** | P05 | Epic Q: Group | J6 | `/my-trip` (SyncStatus) | GroupDomain | WebSocket Sync Channel | `SharedItinerary` | `shared_itinerary_synced` | In-App Toast | Real-time Test | Build / Current |
| **Q06** | P04 | Epic Q: Group | J6 | `/my-trip` (SplitModal) | LedgerDomain | `GET /api/group/split-calc` | `ExpenseSplit` | `group_expenses_split` | None | Math Test | Build / Current |
| **R01** | P02 | Epic R: Budget | J1 | `/my-trip` (BudgetHeader)| BudgetDomain | `POST /api/budget/target` | `TripBudget` | `budget_target_set` | None | Unit Test | Build / Current |
| **R02** | P02 | Epic R: Budget | J1 | `/my-trip` (SpendSummary)| BudgetDomain | Real-time Spend Aggregate | `SpendLedger` | `spend_summary_viewed` | None | Snapshot Test | Build / Current |
| **R03** | P02 | Epic R: Budget | J1 | `/my-trip` (CategoryBars)| BudgetDomain | Category Bucket Analyzer | `BudgetCategory` | `budget_category_broken` | None | Component Test | Build / Current |
| **R04** | P02 | Epic R: Budget | J1 | Budget Overflow Alert | BudgetDomain | Overflow Threshold Engine | `BudgetAlert` | `budget_overflow_warned` | In-App Alert | Unit Test | Build / Current |
| **R05** | P02 | Epic R: Budget | J1 | Savings Suggestion Card | AiDirectorDomain | `GET /api/budget/ai-savings` | `SavingsPlan` | `ai_savings_suggested` | None | Component Test | Build / Current |
| **S01** | P06 | Epic S: Supplier OS| J8 | `/supplier/onboarding` | PartnerDomain | `POST /api/supplier/profile` | `SupplierProfile` | `supplier_onboarded` | Email Confirm | Integration Test | Build / Current |
| **S02** | P06 | Epic S: Supplier OS| J8 | `/supplier/catalog` | CatalogDomain | `POST /api/supplier/product` | `SupplierProduct` | `supplier_product_saved` | None | CRUD Test | Build / Current |
| **S03** | P06 | Epic S: Supplier OS| J8 | `/supplier/availability` | InventoryDomain | `POST /api/supplier/calendar`| `InventoryCalendar` | `availability_published` | None | Calendar Test | Build / Current |
| **S04** | P06 | Epic S: Supplier OS| J8 | `/supplier/resources` | ResourceDomain | `POST /api/supplier/resource`| `SupplierResource` | `resource_allocated` | None | Resource Test | Build / Current |
| **S05** | P06 | Epic S: Supplier OS| J8 | `/supplier/inbox` | DispatchDomain | `GET /api/supplier/inbox` | `BookingRequest` | `supplier_inbox_viewed` | Push Alert | E2E Inbox | Build / Current |
| **S06** | P06 | Epic S: Supplier OS| J8 | `/supplier/inbox` (Action) | SupplierDomain | `POST /api/supplier/decision`| `BookingDecision` | `supplier_decision_logged` | Customer Push | SLA Test | Build / Current |
| **S07** | P06 | Epic S: Supplier OS| J8 | `/supplier/disrupt` | ChangeEngine | `POST /api/supplier/disrupt` | `SupplierDisruption`| `supplier_change_reported` | Ops Alert | Event Test | Build / Current |
| **S08** | P06 | Epic S: Supplier OS| J8 | `/supplier/freshness` | DataFreshness | Freshness Health Score | `FreshnessScore` | `supplier_freshness_audited`| Reminder SMS | Algorithm Test | Build / Current |
| **S09** | P06 | Epic S: Supplier OS| J8 | `/supplier/metrics` | AnalyticsDomain | Fulfill & SLA Aggregator | `SupplierMetric` | `supplier_metrics_viewed` | None | Metric Test | Build / Current |
| **S10** | P06 | Epic S: Supplier OS| J8 | WhatsApp Webhook | IntegrationDomain | Webhook Ingestion Pipe | `WhatsAppMsg` | `whatsapp_booking_acked` | WhatsApp API | Integration Test | Build / Current |
| **T01** | P07 | Epic T: Ops Console| J9 | `/ops-console` (Radar) | OperationsDomain | `GET /api/ops/live-trips` | `LiveTripSession` | `ops_live_radar_viewed` | None | E2E Ops Test | Build / Current |
| **T02** | P07 | Epic T: Ops Console| J9 | `/ops-console` (Exceptions)| OperationsDomain| `GET /api/ops/exceptions` | `BookingException` | `ops_exceptions_handled` | Sound / Alert | Snapshot Test | Build / Current |
| **T03** | P07 | Epic T: Ops Console| J9 | `/ops-console` (Suppliers) | OperationsDomain | `GET /api/ops/supplier-alerts`| `SupplierAlert` | `supplier_exception_triaged`| None | Component Test | Build / Current |
| **T04** | P07 | Epic T: Ops Console| J9 | `/ops-console` (Change) | ChangeEngine | `POST /api/ops/push-recovery`| `OpsRecoveryPackage`| `ops_change_dispatched` | Traveler Push | E2E Recovery | Build / Current |
| **T05** | P07 | Epic T: Ops Console| J9 | `/ops-console` (Traveler360)| SupportDomain | `GET /api/ops/traveler/:id` | `Traveler360Context`| `traveler_context_loaded` | None | Integration Test | Build / Current |
| **T06** | P07 | Epic T: Ops Console| J9 | `/ops-console` (StaleFeed) | DataFreshness | Stale Source Watchdog | `StaleFeedAlert` | `stale_feed_flagged` | Ops Notice | Watchdog Test | Build / Current |
| **T07** | P09 | Epic T: Ops Console| J9 | `/ops-console` (Flags) | FeatureFlagDomain| `POST /api/flags/toggle` | `FeatureFlag` | `feature_flag_toggled` | None | Config Test | Build / Current |
| **T08** | P07 | Epic T: Ops Console| J9 | `/ops-console` (AuditLog) | AuditDomain | `GET /api/ops/audit-stream` | `AuditEntry` | `ops_audit_stream_viewed` | None | DB Test | Build / Current |
| **T09** | P07 | Epic T: Ops Console| J9 | `/ops-console` (Dispatch) | DispatchDomain | `GET /api/ops/dispatch-map` | `ActiveDispatch` | `dispatch_board_viewed` | None | Map Test | Build / Current |
| **U01** | P03 | Epic U: Support | J3 | Global Floating SOS | SupportDomain | `POST /api/support/open` | `SupportTicket` | `help_me_now_clicked` | In-App Modal | E2E Test | Build / Current |
| **U02** | P03 | Epic U: Support | J3 | `/help` (ContextBridge) | SupportDomain | State Payload Generator | `TicketPayload` | `support_context_attached` | None | Integration Test | Build / Current |
| **U03** | P03 | Epic U: Support | J3 | `/help` (WhatsAppCTA) | SupportDomain | `GET /api/support/wa-link` | `WhatsAppHandshake` | `whatsapp_bridge_opened` | External App | Component Test | Build / Current |
| **U04** | P03 | Epic U: Support | J3 | `/help` (TicketStatus) | SupportDomain | `GET /api/support/ticket/:id`| `TicketStatus` | `ticket_status_checked` | Push on Update | Real-time Test | Build / Current |
| **V01** | P02 | Epic V: Notify | J2 | Push Notification Pipe | NotificationDomain | `POST /api/notify/booking` | `NotificationLog` | `booking_notify_sent` | Push / Email | Delivery Test | Build / Current |
| **V02** | P02 | Epic V: Notify | J2 | In-App Status Badge | NotificationDomain | `POST /api/notify/pending` | `NotificationLog` | `pending_notify_sent` | In-App Banner | Unit Test | Build / Current |
| **V03** | P03 | Epic V: Notify | J3 | High-Priority Push | NotificationDomain | `POST /api/notify/change` | `NotificationLog` | `change_notify_sent` | High-Pri Push | E2E Alert Test | Build / Current |
| **V04** | P03 | Epic V: Notify | J3 | Action Required Modal | NotificationDomain | `POST /api/notify/action` | `NotificationLog` | `action_notify_sent` | In-App Modal | UI Test | Build / Current |
| **V05** | P03 | Epic V: Notify | J10 | Scheduled Push (T-24h) | NotificationDomain | Cron Job Scheduler | `ScheduledNotification`| `departure_reminder_sent` | SMS / Push | Scheduler Test | Build / Current |
| **V06** | P03 | Epic V: Notify | J4 | Geofence Context Trigger| NotificationDomain | Geo-Trigger Pipe | `ContextualTrigger` | `context_notify_sent` | Push | Geofence Test | Build / Current |
| **V07** | P01 | Epic V: Notify | All | Deduplication Cache | NotificationDomain | Idempotency Key Filter | `DeduplicationRecord`| `notify_deduped` | None | Concurrency Test | Build / Current |
| **W01** | P01 | Epic W: Auth | J1 | `/auth/otp` (Request) | AuthDomain | `POST /api/auth/otp-request` | `OtpSession` | `otp_requested` | SMS / WhatsApp | Security Test | Build / Current |
| **W02** | P01 | Epic W: Auth | J1 | `/auth/otp` (Verify) | AuthDomain | `POST /api/auth/otp-verify` | `UserSession` | `otp_verified` | None | Auth Test | Build / Current |
| **W03** | P01 | Epic W: Auth | All | Global Token Hydrator | AuthDomain | `POST /api/auth/refresh` | `AuthToken` | `session_restored` | None | Session Test | Build / Current |
| **W04** | P01 | Epic W: Auth | All | `/profile` (LogoutBtn) | AuthDomain | `POST /api/auth/logout` | `UserSession` | `user_logged_out` | None | E2E Test | Build / Current |
| **W05** | P01 | Epic W: Auth | All | Security Middleware | AuthDomain | 404 Masking Guard | `SecurityPolicy` | `unauthorized_masked` | None | Security Test | Build / Current |
| **X01** | P09 | Epic X: Content | J1 | Admin Content Board | ContentDomain | `GET /api/content/audit` | `ContentRegistry` | `content_freshness_audited` | None | Audit Test | Build / Current |
| **X02** | P09 | Epic X: Content | J1 | Source Attribution Tag | ContentDomain | `GET /api/content/source/:id`| `ContentSource` | `content_source_viewed` | None | Component Test | Build / Current |
| **X03** | P07 | Epic X: Content | J8 | Ingestion Pipeline | PartnerDomain | `POST /api/supply/discover` | `ProspectiveSupplier`| `new_supply_ingested` | Ops Notice | Integration Test | Build / Current |
| **X04** | P09 | Epic X: Content | J1 | Benchmark Crawler | IntelligenceDomain | `GET /api/intel/benchmarks` | `PriceBenchmark` | `benchmark_analyzed` | None | Data Test | Build / Current |
| **X05** | P09 | Epic X: Content | J1 | Unanswered Search Logs | AnalyticsDomain | `GET /api/intel/gaps` | `ContentGapLog` | `content_gap_identified` | None | Log Test | Build / Current |
| **Y01** | P03 | Epic Y: Memories | J10 | `/memories` (Timeline) | MemoryDomain | `GET /api/memories/timeline`| `MemoryMoment` | `memories_timeline_viewed` | None | Snapshot Test | Build / Current |
| **Y02** | P03 | Epic Y: Memories | J10 | `/memories` (Passport) | PassportDomain | `GET /api/passport/stamps` | `DigitalStamp` | `passport_stamps_viewed` | In-App Stamp | Component Test | Build / Current |
| **Y03** | P03 | Epic Y: Memories | J10 | `/memories` (Badges) | GamificationDomain | `GET /api/badges/earned` | `UserBadge` | `badge_unlocked` | Modal Fanfare | Logic Test | Build / Current |
| **Y04** | P03 | Epic Y: Memories | J10 | `/memories` (ExportCard) | MemoryDomain | `POST /api/memories/export` | `ShareableCard` | `memory_card_shared` | Native Share | Canvas Render | Build / Current |
| **Z01** | P03 | Epic Z: Safety | J4 | `/help` (DecompressionSOS) | EmergencyDomain | `GET /api/safety/emergency` | `EmergencyResource` | `emergency_access_opened` | Direct Call Prompt | E2E Emergency | Build / Current |
| **Z02** | P03 | Epic Z: Safety | J4 | `/help` (TriageGuide) | EmergencyDomain | `GET /api/safety/triage` | `TriageProtocol` | `local_triage_viewed` | None | Component Test | Build / Current |
| **Z03** | P03 | Epic Z: Safety | J4 | `/help` (DriverGPSCard) | SpatialDomain | `GET /api/safety/lost-card` | `LostTravelerCard` | `lost_traveler_card_shown` | None | Snapshot Test | Build / Current |
| **AA01**| P01 | Epic AA: Core | All | Global Honesty Badge | SystemDomain | Status Attribution Tag | `SystemTelemetry` | `honest_data_enforced` | None | UI Test | Build / Current |
| **AA02**| P01 | Epic AA: Core | All | Global Currency Parser | LedgerDomain | Minor Unit Math `x100` | `CurrencyScalar` | `money_precision_verified` | None | Precision Test | Build / Current |
| **AA03**| P01 | Epic AA: Core | J2 | Payment API Interceptor | PaymentDomain | UUIDv4 Idempotency Token | `IdempotencyRecord`| `duplicate_charge_blocked` | None | Chaos Test | Build / Current |
| **AA04**| P01 | Epic AA: Core | J2 | DB Constraint Trigger | InventoryDomain | ACID Transaction Exclusion | `CapacitySlot` | `oversell_prevented` | None | Stress Test | Build / Current |
| **AA05**| P07 | Epic AA: Core | All | Structured Logger | AuditDomain | Winston / Pino JSON Log | `SystemAuditLog` | `audit_event_logged` | None | Log Test | Build / Current |
| **AA06**| P01 | Epic AA: Core | All | `dir="rtl"` Language Hook| I18nEngine | `useLanguage` Translation | `I18nDictionary` | `rtl_layout_rendered` | None | Visual Regression | Build / Current |
| **AA07**| P01 | Epic AA: Core | All | Tailwind 390px Viewport | UXEngine | Mobile CSS Fluidity | `ViewportConstraint` | `mobile_viewport_measured`| None | Device Matrix | Build / Current |
| **AA08**| P01 | Epic AA: Core | All | CSS `@media reduced-motion`| MotionEngine | `DAHAB_MOTION` Reduced Hook | `MotionToken` | `reduced_motion_honored` | None | A11y Test | Build / Current |
| **AA09**| P01 | Epic AA: Core | All | Global Error Boundary | UXEngine | React Fallback Boundary | `ErrorStateRecord` | `no_dead_ends_guarded` | None | Crash Test | Build / Current |
| **AA10**| P03 | Epic AA: Core | J3 | `/change-recovery` Hub | RecoveryDomain | Deterministic Healer | `RecoveryTree` | `recovery_over_failure_used`| In-App Notice | E2E Recovery | Build / Current |
| **AA11**| P03 | Epic AA: Core | J3 | Global Concierge Float | SupportDomain | Direct Human Handoff | `ConciergeQueue` | `human_escalation_fired` | Webhook to Agent | Integration Test | Build / Current |
| **AA12**| P03 | Epic AA: Core | J4 | Route Navigator Router | TripDomain | Active Trip Route Redirect | `ActiveTripContext` | `current_trip_prioritized` | None | Router Test | Build / Current |
