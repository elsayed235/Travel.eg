-- GENERATED from server/db/sqlite/tableSpecs.ts. Do not edit by hand.
-- Regenerate with: npm run db:schema

-- Users (DatabaseState.users)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  email TEXT NOT NULL UNIQUE,
  firebase_uid TEXT UNIQUE,
  role TEXT NOT NULL,
  supplier_id TEXT,
  phone TEXT,
  created_at TEXT,
  updated_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_seq ON users(seq);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_supplier_id ON users(supplier_id);

-- Suppliers (DatabaseState.suppliers)
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  business_name TEXT,
  vertical TEXT,
  status TEXT,
  email TEXT,
  phone TEXT,
  commission_rate REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_suppliers_seq ON suppliers(seq);
CREATE INDEX IF NOT EXISTS idx_suppliers_business_name ON suppliers(business_name);
CREATE INDEX IF NOT EXISTS idx_suppliers_vertical ON suppliers(vertical);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

-- Sessions (DatabaseState.sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  role TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_seq ON sessions(seq);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Trips (DatabaseState.trips)
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT,
  start_date TEXT,
  end_date TEXT,
  length_days INTEGER,
  travelers_count INTEGER,
  total_estimated_egp REAL,
  total_paid_egp REAL,
  created_at TEXT,
  updated_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_trips_seq ON trips(seq);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at);

-- Product SKUs (DatabaseState.productSkus)
CREATE TABLE IF NOT EXISTS product_skus (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  title TEXT,
  base_price_egp REAL,
  active INTEGER,
  max_capacity_per_slot INTEGER,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_product_skus_seq ON product_skus(seq);
CREATE INDEX IF NOT EXISTS idx_product_skus_supplier_id ON product_skus(supplier_id);
CREATE INDEX IF NOT EXISTS idx_product_skus_service_type ON product_skus(service_type);
CREATE INDEX IF NOT EXISTS idx_product_skus_service_type_active ON product_skus(service_type, active);

-- Inventory slots (DatabaseState.inventorySlots)
CREATE TABLE IF NOT EXISTS inventory_slots (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  sku_id TEXT NOT NULL REFERENCES product_skus(id) ON DELETE CASCADE,
  date TEXT,
  time_slot TEXT,
  status TEXT,
  total_capacity INTEGER,
  reserved_capacity INTEGER,
  held_capacity INTEGER,
  price_egp REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_inventory_slots_seq ON inventory_slots(seq);
CREATE INDEX IF NOT EXISTS idx_inventory_slots_sku_id ON inventory_slots(sku_id);
CREATE INDEX IF NOT EXISTS idx_inventory_slots_date ON inventory_slots(date);
CREATE INDEX IF NOT EXISTS idx_inventory_slots_status ON inventory_slots(status);
CREATE INDEX IF NOT EXISTS idx_inventory_slots_sku_id_date ON inventory_slots(sku_id, date);

-- Trip items (DatabaseState.tripItems)
CREATE TABLE IF NOT EXISTS trip_items (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  sku_id TEXT,
  booking_id TEXT,
  service_type TEXT,
  status TEXT,
  day_number INTEGER,
  price_egp REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_trip_items_seq ON trip_items(seq);
CREATE INDEX IF NOT EXISTS idx_trip_items_trip_id ON trip_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_sku_id ON trip_items(sku_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_booking_id ON trip_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_status ON trip_items(status);

-- Holds (DatabaseState.holds)
CREATE TABLE IF NOT EXISTS holds (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  hold_token TEXT NOT NULL UNIQUE,
  sku_id TEXT NOT NULL REFERENCES product_skus(id) ON DELETE CASCADE,
  slot_id TEXT,
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  traveler_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  expires_at TEXT,
  idempotency_key TEXT UNIQUE,
  amount_egp REAL,
  passengers_count INTEGER,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_holds_seq ON holds(seq);
CREATE INDEX IF NOT EXISTS idx_holds_sku_id ON holds(sku_id);
CREATE INDEX IF NOT EXISTS idx_holds_slot_id ON holds(slot_id);
CREATE INDEX IF NOT EXISTS idx_holds_trip_id ON holds(trip_id);
CREATE INDEX IF NOT EXISTS idx_holds_traveler_id ON holds(traveler_id);
CREATE INDEX IF NOT EXISTS idx_holds_status ON holds(status);
CREATE INDEX IF NOT EXISTS idx_holds_expires_at ON holds(expires_at);
CREATE INDEX IF NOT EXISTS idx_holds_status_expires_at ON holds(status, expires_at);

-- Bookings (DatabaseState.bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  booking_ref TEXT NOT NULL UNIQUE,
  trip_id TEXT NOT NULL,
  trip_item_id TEXT,
  supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  sku_id TEXT NOT NULL REFERENCES product_skus(id) ON DELETE RESTRICT,
  service_type TEXT,
  payment_state TEXT,
  supplier_state TEXT,
  traveler_email TEXT,
  traveler_phone TEXT,
  scheduled_date TEXT,
  confirmation_code TEXT,
  amount_egp REAL,
  created_at TEXT,
  updated_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bookings_seq ON bookings(seq);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_item_id ON bookings(trip_item_id);
CREATE INDEX IF NOT EXISTS idx_bookings_supplier_id ON bookings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_bookings_sku_id ON bookings(sku_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_type ON bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_state ON bookings(payment_state);
CREATE INDEX IF NOT EXISTS idx_bookings_supplier_state ON bookings(supplier_state);
CREATE INDEX IF NOT EXISTS idx_bookings_traveler_email ON bookings(traveler_email);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_supplier_id_supplier_state ON bookings(supplier_id, supplier_state);

-- Payments (DatabaseState.payments)
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  transaction_id TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  hold_token TEXT,
  trip_id TEXT NOT NULL,
  booking_id TEXT,
  state TEXT,
  provider TEXT,
  amount_egp REAL,
  simulated INTEGER,
  created_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_payments_seq ON payments(seq);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_hold_token ON payments(hold_token);
CREATE INDEX IF NOT EXISTS idx_payments_trip_id ON payments(trip_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_state ON payments(state);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Ledger entries (DatabaseState.ledgerEntries)
CREATE TABLE IF NOT EXISTS ledger_entries (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  transaction_id TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  booking_ref TEXT,
  trip_id TEXT NOT NULL,
  type TEXT,
  status TEXT,
  debit_account TEXT,
  credit_account TEXT,
  amount_egp REAL,
  timestamp TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_seq ON ledger_entries(seq);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_booking_ref ON ledger_entries(booking_ref);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_trip_id ON ledger_entries(trip_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_type ON ledger_entries(type);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_status ON ledger_entries(status);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_debit_account ON ledger_entries(debit_account);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_credit_account ON ledger_entries(credit_account);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_timestamp ON ledger_entries(timestamp);

-- Transfer telemetry (DatabaseState.transferTelemetry)
CREATE TABLE IF NOT EXISTS transfer_telemetry (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  reference_code TEXT,
  status TEXT,
  flight_status TEXT,
  driver_phone TEXT,
  latitude REAL,
  longitude REAL,
  updated_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_transfer_telemetry_seq ON transfer_telemetry(seq);
CREATE INDEX IF NOT EXISTS idx_transfer_telemetry_reference_code ON transfer_telemetry(reference_code);
CREATE INDEX IF NOT EXISTS idx_transfer_telemetry_status ON transfer_telemetry(status);
CREATE INDEX IF NOT EXISTS idx_transfer_telemetry_updated_at ON transfer_telemetry(updated_at);

-- Notifications (DatabaseState.notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT,
  status TEXT,
  channel TEXT,
  created_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_seq ON notifications(seq);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Support messages (DatabaseState.supportMessages)
CREATE TABLE IF NOT EXISTS support_messages (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_id TEXT,
  booking_ref TEXT,
  status TEXT,
  urgent INTEGER,
  created_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_support_messages_seq ON support_messages(seq);
CREATE INDEX IF NOT EXISTS idx_support_messages_user_id ON support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_trip_id ON support_messages(trip_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_status ON support_messages(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);

-- Audit events (DatabaseState.auditEvents)
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  actor TEXT,
  actor_role TEXT,
  action TEXT,
  entity_type TEXT,
  entity_id TEXT,
  timestamp TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_events_seq ON audit_events(seq);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity_type_entity_id ON audit_events(entity_type, entity_id);

-- Product opportunities (DatabaseState.opportunities)
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  status TEXT,
  product_area TEXT,
  confidence_score REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_opportunities_seq ON opportunities(seq);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_product_area ON opportunities(product_area);

-- Distributed locks (DatabaseState.locks)
CREATE TABLE IF NOT EXISTS distributed_locks (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  owner_id TEXT,
  expires_at TEXT,
  fencing_token INTEGER,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_distributed_locks_seq ON distributed_locks(seq);
CREATE INDEX IF NOT EXISTS idx_distributed_locks_owner_id ON distributed_locks(owner_id);
CREATE INDEX IF NOT EXISTS idx_distributed_locks_expires_at ON distributed_locks(expires_at);

-- Raw supplier sources (DatabaseState.rawSupplierSources)
CREATE TABLE IF NOT EXISTS raw_supplier_sources (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  source_type TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_raw_supplier_sources_seq ON raw_supplier_sources(seq);
CREATE INDEX IF NOT EXISTS idx_raw_supplier_sources_source_type ON raw_supplier_sources(source_type);

-- Raw offer sources (DatabaseState.rawOfferSources)
CREATE TABLE IF NOT EXISTS raw_offer_sources (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  source_type TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_raw_offer_sources_seq ON raw_offer_sources(seq);
CREATE INDEX IF NOT EXISTS idx_raw_offer_sources_source_type ON raw_offer_sources(source_type);

-- Supplier offers (DatabaseState.supplierOffers)
CREATE TABLE IF NOT EXISTS supplier_offers (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  supplier_id TEXT,
  activity_id TEXT,
  canonical_category TEXT,
  currency TEXT,
  price REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_seq ON supplier_offers(seq);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_supplier_id ON supplier_offers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_activity_id ON supplier_offers(activity_id);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_canonical_category ON supplier_offers(canonical_category);

-- Market price stats (DatabaseState.marketPriceStats)
CREATE TABLE IF NOT EXISTS market_price_stats (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  lowest_observed_price REAL,
  highest_observed_price REAL,
  median_observed_price REAL,
  observed_offer_count INTEGER,
  last_calculated_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_market_price_stats_seq ON market_price_stats(seq);
CREATE INDEX IF NOT EXISTS idx_market_price_stats_last_calculated_at ON market_price_stats(last_calculated_at);

-- Social accounts (DatabaseState.socialAccounts)
CREATE TABLE IF NOT EXISTS social_accounts (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  platform TEXT,
  username TEXT,
  supplier_id TEXT,
  ownership_status TEXT,
  category TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_social_accounts_seq ON social_accounts(seq);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_username ON social_accounts(username);
CREATE INDEX IF NOT EXISTS idx_social_accounts_supplier_id ON social_accounts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_ownership_status ON social_accounts(ownership_status);
CREATE INDEX IF NOT EXISTS idx_social_accounts_category ON social_accounts(category);

-- Source records (DatabaseState.sourceRecords)
CREATE TABLE IF NOT EXISTS source_records (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  source_type TEXT,
  supplier_id TEXT,
  verification_status TEXT,
  captured_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_source_records_seq ON source_records(seq);
CREATE INDEX IF NOT EXISTS idx_source_records_source_type ON source_records(source_type);
CREATE INDEX IF NOT EXISTS idx_source_records_supplier_id ON source_records(supplier_id);
CREATE INDEX IF NOT EXISTS idx_source_records_verification_status ON source_records(verification_status);
CREATE INDEX IF NOT EXISTS idx_source_records_captured_at ON source_records(captured_at);

-- Price observations (DatabaseState.priceObservations)
CREATE TABLE IF NOT EXISTS price_observations (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  offer_id TEXT,
  supplier_id TEXT,
  activity_id TEXT,
  freshness_status TEXT,
  verification_status TEXT,
  amount REAL,
  observed_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_price_observations_seq ON price_observations(seq);
CREATE INDEX IF NOT EXISTS idx_price_observations_offer_id ON price_observations(offer_id);
CREATE INDEX IF NOT EXISTS idx_price_observations_supplier_id ON price_observations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_price_observations_activity_id ON price_observations(activity_id);
CREATE INDEX IF NOT EXISTS idx_price_observations_freshness_status ON price_observations(freshness_status);
CREATE INDEX IF NOT EXISTS idx_price_observations_observed_at ON price_observations(observed_at);

-- Market change events (DatabaseState.marketChangeEvents)
CREATE TABLE IF NOT EXISTS market_change_events (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  event_type TEXT,
  supplier_id TEXT,
  detected_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_market_change_events_seq ON market_change_events(seq);
CREATE INDEX IF NOT EXISTS idx_market_change_events_event_type ON market_change_events(event_type);
CREATE INDEX IF NOT EXISTS idx_market_change_events_supplier_id ON market_change_events(supplier_id);
CREATE INDEX IF NOT EXISTS idx_market_change_events_detected_at ON market_change_events(detected_at);

-- Market snapshots (DatabaseState.marketSnapshots)
CREATE TABLE IF NOT EXISTS market_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  created_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_seq ON market_snapshots(seq);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_created_at ON market_snapshots(created_at);

-- Source freshness (DatabaseState.sourceFreshnessRecords)
CREATE TABLE IF NOT EXISTS source_freshness (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  source_id TEXT,
  freshness_status TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_source_freshness_seq ON source_freshness(seq);
CREATE INDEX IF NOT EXISTS idx_source_freshness_source_id ON source_freshness(source_id);
CREATE INDEX IF NOT EXISTS idx_source_freshness_freshness_status ON source_freshness(freshness_status);

-- Contact history (DatabaseState.contactHistory)
CREATE TABLE IF NOT EXISTS contact_history (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  supplier_id TEXT,
  contacted_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contact_history_seq ON contact_history(seq);
CREATE INDEX IF NOT EXISTS idx_contact_history_supplier_id ON contact_history(supplier_id);
CREATE INDEX IF NOT EXISTS idx_contact_history_contacted_at ON contact_history(contacted_at);

-- Market refresh runs (DatabaseState.marketRefreshRuns)
CREATE TABLE IF NOT EXISTS market_refresh_runs (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  run_id TEXT,
  source_id TEXT,
  status TEXT,
  started_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_market_refresh_runs_seq ON market_refresh_runs(seq);
CREATE INDEX IF NOT EXISTS idx_market_refresh_runs_run_id ON market_refresh_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_market_refresh_runs_source_id ON market_refresh_runs(source_id);
CREATE INDEX IF NOT EXISTS idx_market_refresh_runs_status ON market_refresh_runs(status);
CREATE INDEX IF NOT EXISTS idx_market_refresh_runs_started_at ON market_refresh_runs(started_at);

-- Market review queue (DatabaseState.marketReviewQueue)
CREATE TABLE IF NOT EXISTS market_review_queue (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  status TEXT,
  supplier_id TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_market_review_queue_seq ON market_review_queue(seq);
CREATE INDEX IF NOT EXISTS idx_market_review_queue_status ON market_review_queue(status);
CREATE INDEX IF NOT EXISTS idx_market_review_queue_supplier_id ON market_review_queue(supplier_id);

-- Source health (DatabaseState.sourceHealthRecords)
CREATE TABLE IF NOT EXISTS source_health (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  source_id TEXT,
  status TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_source_health_seq ON source_health(seq);
CREATE INDEX IF NOT EXISTS idx_source_health_source_id ON source_health(source_id);
CREATE INDEX IF NOT EXISTS idx_source_health_status ON source_health(status);

-- Refresh schedule policies (DatabaseState.refreshSchedulePolicies)
CREATE TABLE IF NOT EXISTS refresh_schedule_policies (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  source_id TEXT,
  interval TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_refresh_schedule_policies_seq ON refresh_schedule_policies(seq);
CREATE INDEX IF NOT EXISTS idx_refresh_schedule_policies_source_id ON refresh_schedule_policies(source_id);

-- Market alerts (DatabaseState.marketAlerts)
CREATE TABLE IF NOT EXISTS market_alerts (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  alert_type TEXT,
  severity TEXT,
  created_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_market_alerts_seq ON market_alerts(seq);
CREATE INDEX IF NOT EXISTS idx_market_alerts_alert_type ON market_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_market_alerts_severity ON market_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_market_alerts_created_at ON market_alerts(created_at);

-- Research sources (DatabaseState.researchSources)
CREATE TABLE IF NOT EXISTS research_sources (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  source_type TEXT,
  authority_weight REAL,
  last_audited TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_research_sources_seq ON research_sources(seq);
CREATE INDEX IF NOT EXISTS idx_research_sources_source_type ON research_sources(source_type);

-- Area profiles (DatabaseState.areaProfiles)
CREATE TABLE IF NOT EXISTS area_profiles (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  name_en TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_area_profiles_seq ON area_profiles(seq);
CREATE INDEX IF NOT EXISTS idx_area_profiles_name_en ON area_profiles(name_en);

-- Places (DatabaseState.places)
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  area_id TEXT NOT NULL REFERENCES area_profiles(id) ON DELETE CASCADE,
  name_en TEXT,
  category TEXT,
  operational_status TEXT,
  google_place_id TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_places_seq ON places(seq);
CREATE INDEX IF NOT EXISTS idx_places_area_id ON places(area_id);
CREATE INDEX IF NOT EXISTS idx_places_name_en ON places(name_en);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_operational_status ON places(operational_status);
CREATE INDEX IF NOT EXISTS idx_places_google_place_id ON places(google_place_id);

-- Temporal facts (DatabaseState.temporalFacts)
CREATE TABLE IF NOT EXISTS temporal_facts (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  subject_id TEXT,
  subject_type TEXT,
  predicate TEXT,
  confidence_tier TEXT,
  status TEXT,
  valid_from TEXT,
  valid_until TEXT,
  verified_at TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_seq ON temporal_facts(seq);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_subject_id ON temporal_facts(subject_id);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_subject_type ON temporal_facts(subject_type);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_predicate ON temporal_facts(predicate);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_confidence_tier ON temporal_facts(confidence_tier);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_status ON temporal_facts(status);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_valid_until ON temporal_facts(valid_until);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_verified_at ON temporal_facts(verified_at);
CREATE INDEX IF NOT EXISTS idx_temporal_facts_subject_id_predicate ON temporal_facts(subject_id, predicate);

-- Evidence nodes (DatabaseState.evidenceNodes)
CREATE TABLE IF NOT EXISTS evidence_nodes (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  fact_id TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_evidence_nodes_seq ON evidence_nodes(seq);
CREATE INDEX IF NOT EXISTS idx_evidence_nodes_fact_id ON evidence_nodes(fact_id);

-- Conflict sets (DatabaseState.conflictSets)
CREATE TABLE IF NOT EXISTS conflict_sets (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  subject_id TEXT,
  status TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_conflict_sets_seq ON conflict_sets(seq);
CREATE INDEX IF NOT EXISTS idx_conflict_sets_subject_id ON conflict_sets(subject_id);
CREATE INDEX IF NOT EXISTS idx_conflict_sets_status ON conflict_sets(status);

-- Activity details (DatabaseState.activities)
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  sku_id TEXT,
  supplier_id TEXT,
  place_id TEXT,
  area_id TEXT,
  category TEXT,
  base_price_egp REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_activities_seq ON activities(seq);
CREATE INDEX IF NOT EXISTS idx_activities_sku_id ON activities(sku_id);
CREATE INDEX IF NOT EXISTS idx_activities_supplier_id ON activities(supplier_id);
CREATE INDEX IF NOT EXISTS idx_activities_place_id ON activities(place_id);
CREATE INDEX IF NOT EXISTS idx_activities_area_id ON activities(area_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

-- Dining venues (DatabaseState.diningVenues)
CREATE TABLE IF NOT EXISTS dining_venues (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  place_id TEXT,
  area_id TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_dining_venues_seq ON dining_venues(seq);
CREATE INDEX IF NOT EXISTS idx_dining_venues_place_id ON dining_venues(place_id);
CREATE INDEX IF NOT EXISTS idx_dining_venues_area_id ON dining_venues(area_id);

-- Emergency resources (DatabaseState.emergencyResources)
CREATE TABLE IF NOT EXISTS emergency_resources (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  resource_type TEXT,
  area_id TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_emergency_resources_seq ON emergency_resources(seq);
CREATE INDEX IF NOT EXISTS idx_emergency_resources_resource_type ON emergency_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_emergency_resources_area_id ON emergency_resources(area_id);

-- Regulatory decrees (DatabaseState.regulatoryDecrees)
CREATE TABLE IF NOT EXISTS regulatory_decrees (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  status TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_regulatory_decrees_seq ON regulatory_decrees(seq);
CREATE INDEX IF NOT EXISTS idx_regulatory_decrees_status ON regulatory_decrees(status);

-- Knowledge snapshots (DatabaseState.knowledgeSnapshots)
CREATE TABLE IF NOT EXISTS knowledge_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  version_id TEXT,
  created_at TEXT,
  total_facts INTEGER,
  quality_score_overall REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_knowledge_snapshots_seq ON knowledge_snapshots(seq);
CREATE INDEX IF NOT EXISTS idx_knowledge_snapshots_version_id ON knowledge_snapshots(version_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_snapshots_created_at ON knowledge_snapshots(created_at);

-- Place discoveries (DatabaseState.placeDiscoveries)
CREATE TABLE IF NOT EXISTS place_discoveries (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  status TEXT,
  area_id TEXT,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_place_discoveries_seq ON place_discoveries(seq);
CREATE INDEX IF NOT EXISTS idx_place_discoveries_status ON place_discoveries(status);
CREATE INDEX IF NOT EXISTS idx_place_discoveries_area_id ON place_discoveries(area_id);

-- Entity resolution candidates (DatabaseState.resolutionCandidates)
CREATE TABLE IF NOT EXISTS resolution_candidates (
  id TEXT PRIMARY KEY NOT NULL,
  seq INTEGER NOT NULL,
  status TEXT,
  score REAL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_resolution_candidates_seq ON resolution_candidates(seq);
CREATE INDEX IF NOT EXISTS idx_resolution_candidates_status ON resolution_candidates(status);

-- Store-level scalars (version, fencingSequence, lastCheckpoint)
CREATE TABLE IF NOT EXISTS store_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

-- Rows that failed a constraint during migration. Never written by the app.
CREATE TABLE IF NOT EXISTS _quarantine (
  id TEXT NOT NULL,
  source_table TEXT NOT NULL,
  reason TEXT NOT NULL,
  quarantined_at TEXT NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (source_table, id)
);
