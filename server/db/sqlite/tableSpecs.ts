import { DatabaseState } from '../database';

/**
 * The single definition of how the in-memory DatabaseState maps onto SQLite.
 *
 * One spec drives three things that used to have no shared source of truth:
 * the DDL, the row<->entity mapping, and the indexed query helpers. Writing
 * those by hand in three places is how server/db/sql/schema.sql ended up
 * covering 16 of the 46 collections while claiming to be the schema.
 *
 * ---------------------------------------------------------------------------
 * Storage shape: promoted columns + a `data` JSON document
 * ---------------------------------------------------------------------------
 * Every table stores the complete entity as JSON in `data`, and *additionally*
 * promotes the fields that need a constraint or an index into real typed
 * columns. Reads hydrate from `data`, so round-trip fidelity is total and a
 * new optional field on a TypeScript interface does not need a migration.
 * Writes fill both, so PRIMARY KEY / UNIQUE / FOREIGN KEY / indexes are
 * enforced by SQLite on exactly the fields the application actually queries.
 *
 * The alternative — one column per interface field across 46 entities — means
 * ~400 columns hand-kept in sync with types that are still moving, and a
 * silent data-loss bug every time the two drift. This shape trades a column
 * count for correctness that the engine enforces.
 *
 * ---------------------------------------------------------------------------
 * When a relationship gets a FOREIGN KEY and when it only gets an index
 * ---------------------------------------------------------------------------
 * A FOREIGN KEY is declared where the reference is *mandatory and owned*: a
 * session belongs to a user, a booking belongs to a trip. Those are the rows
 * where a dangling pointer is a real defect, and where the audit found actual
 * orphans (1 booking, 1 tripItem, 3 holds, 2 ledger entries, 1 payment).
 *
 * It is deliberately NOT declared where the column holds something other than
 * a plain row reference:
 *   - notifications.userId carries the literal 'ALL' for broadcasts, so it is
 *     a recipient selector, not a user id. A FK here would reject broadcasts.
 *   - The market-intelligence tables reference suppliers that the crawler may
 *     legitimately observe *before* the supplier row exists. Those references
 *     are advisory and get an index, not a constraint.
 * Both cases get an index, because they are still query paths.
 */

export type SqlType = 'TEXT' | 'INTEGER' | 'REAL';

export interface ColumnSpec {
  /** SQL column name. */
  name: string;
  /** Field on the entity this column is promoted from. */
  field: string;
  type: SqlType;
  notNull?: boolean;
  unique?: boolean;
  index?: boolean;
  /** Stored as 0/1; hydration still comes from `data`, so the JS type is kept. */
  boolean?: boolean;
  references?: {
    table: string;
    onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  };
}

export interface TableSpec {
  /** SQL table name. */
  table: string;
  /** Key on DatabaseState holding this collection. */
  collection: keyof DatabaseState;
  /** Entity field used as the primary key. Not always `id`. */
  key: string;
  /** Human label used in migration and integrity reports. */
  label: string;
  columns: ColumnSpec[];
  /** Multi-column indexes that a single column spec cannot express. */
  compositeIndexes?: string[][];
}

const t = (name: string, field = name, extra: Partial<ColumnSpec> = {}): ColumnSpec =>
  ({ name, field, type: 'TEXT', ...extra });
const i = (name: string, field = name, extra: Partial<ColumnSpec> = {}): ColumnSpec =>
  ({ name, field, type: 'INTEGER', ...extra });
const r = (name: string, field = name, extra: Partial<ColumnSpec> = {}): ColumnSpec =>
  ({ name, field, type: 'REAL', ...extra });
const bool = (name: string, field = name): ColumnSpec =>
  ({ name, field, type: 'INTEGER', boolean: true });

const fk = (table: string, onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT') =>
  ({ table, onDelete });

/**
 * Order matters twice: CREATE TABLE needs parents first so the FK targets
 * exist, and the migration inserts in this order so a child never lands before
 * its parent.
 */
export const TABLE_SPECS: TableSpec[] = [
  // ------------------------------------------------------------------ identity
  {
    table: 'users',
    collection: 'users',
    key: 'id',
    label: 'Users',
    columns: [
      t('email', 'email', { notNull: true, unique: true }),
      t('firebase_uid', 'firebaseUid', { unique: true }),
      t('role', 'role', { notNull: true, index: true }),
      t('supplier_id', 'supplierId', { index: true }),
      t('phone'),
      t('created_at', 'createdAt'),
      t('updated_at', 'updatedAt')
    ]
  },
  {
    table: 'suppliers',
    collection: 'suppliers',
    key: 'id',
    label: 'Suppliers',
    columns: [
      t('business_name', 'businessName', { index: true }),
      t('vertical', 'vertical', { index: true }),
      t('status', 'status', { index: true }),
      t('email'),
      t('phone'),
      r('commission_rate', 'commissionRate')
    ]
  },
  {
    table: 'sessions',
    collection: 'sessions',
    key: 'id',
    label: 'Sessions',
    columns: [
      t('user_id', 'userId', { notNull: true, index: true, references: fk('users', 'CASCADE') }),
      t('token', 'token', { notNull: true, unique: true }),
      t('role'),
      t('expires_at', 'expiresAt', { notNull: true, index: true }),
      t('created_at', 'createdAt')
    ]
  },
  {
    table: 'trips',
    collection: 'trips',
    key: 'id',
    label: 'Trips',
    columns: [
      t('user_id', 'userId', { notNull: true, index: true, references: fk('users', 'CASCADE') }),
      t('status', 'status', { notNull: true, index: true }),
      t('title'),
      t('start_date', 'startDate', { index: true }),
      t('end_date', 'endDate'),
      i('length_days', 'lengthDays'),
      i('travelers_count', 'travelersCount'),
      r('total_estimated_egp', 'totalEstimatedEGP'),
      r('total_paid_egp', 'totalPaidEGP'),
      t('created_at', 'createdAt', { index: true }),
      t('updated_at', 'updatedAt')
    ]
  },

  // ----------------------------------------------------------------- inventory
  {
    table: 'product_skus',
    collection: 'productSkus',
    key: 'id',
    label: 'Product SKUs',
    columns: [
      t('supplier_id', 'supplierId', { notNull: true, index: true, references: fk('suppliers', 'CASCADE') }),
      t('service_type', 'serviceType', { notNull: true, index: true }),
      t('title'),
      r('base_price_egp', 'basePriceEGP'),
      bool('active'),
      i('max_capacity_per_slot', 'maxCapacityPerSlot')
    ],
    compositeIndexes: [['service_type', 'active']]
  },
  {
    table: 'inventory_slots',
    collection: 'inventorySlots',
    key: 'id',
    label: 'Inventory slots',
    columns: [
      t('sku_id', 'skuId', { notNull: true, index: true, references: fk('product_skus', 'CASCADE') }),
      t('date', 'date', { index: true }),
      t('time_slot', 'timeSlot'),
      t('status', 'status', { index: true }),
      i('total_capacity', 'totalCapacity'),
      i('reserved_capacity', 'reservedCapacity'),
      i('held_capacity', 'heldCapacity'),
      r('price_egp', 'priceEGP')
    ],
    compositeIndexes: [['sku_id', 'date']]
  },
  {
    table: 'trip_items',
    collection: 'tripItems',
    key: 'id',
    label: 'Trip items',
    columns: [
      t('trip_id', 'tripId', { notNull: true, index: true, references: fk('trips', 'CASCADE') }),
      t('sku_id', 'skuId', { index: true }),
      t('booking_id', 'bookingId', { index: true }),
      t('service_type', 'serviceType'),
      t('status', 'status', { index: true }),
      i('day_number', 'dayNumber'),
      r('price_egp', 'priceEGP')
    ]
  },
  {
    table: 'holds',
    collection: 'holds',
    key: 'id',
    label: 'Holds',
    columns: [
      t('hold_token', 'holdToken', { notNull: true, unique: true }),
      t('sku_id', 'skuId', { notNull: true, index: true, references: fk('product_skus', 'CASCADE') }),
      t('slot_id', 'slotId', { index: true }),
      t('trip_id', 'tripId', { notNull: true, index: true, references: fk('trips', 'CASCADE') }),
      t('traveler_id', 'travelerId', { notNull: true, index: true, references: fk('users', 'CASCADE') }),
      t('status', 'status', { notNull: true, index: true }),
      t('expires_at', 'expiresAt', { index: true }),
      t('idempotency_key', 'idempotencyKey', { unique: true }),
      r('amount_egp', 'amountEGP'),
      i('passengers_count', 'passengersCount')
    ],
    compositeIndexes: [['status', 'expires_at']]
  },

  // --------------------------------------------------------------------- money
  {
    table: 'bookings',
    collection: 'bookings',
    key: 'id',
    label: 'Bookings',
    columns: [
      t('booking_ref', 'bookingRef', { notNull: true, unique: true }),
      // Indexed, deliberately NOT a foreign key. See the note on money tables
      // above the ledger_entries spec.
      t('trip_id', 'tripId', { notNull: true, index: true }),
      t('trip_item_id', 'tripItemId', { index: true }),
      // RESTRICT, not CASCADE: deleting a supplier must not silently delete the
      // bookings travelers have already paid for.
      t('supplier_id', 'supplierId', { notNull: true, index: true, references: fk('suppliers', 'RESTRICT') }),
      t('sku_id', 'skuId', { notNull: true, index: true, references: fk('product_skus', 'RESTRICT') }),
      t('service_type', 'serviceType', { index: true }),
      t('payment_state', 'paymentState', { index: true }),
      t('supplier_state', 'supplierState', { index: true }),
      t('traveler_email', 'travelerEmail', { index: true }),
      t('traveler_phone', 'travelerPhone'),
      t('scheduled_date', 'scheduledDate', { index: true }),
      t('confirmation_code', 'confirmationCode'),
      r('amount_egp', 'amountEGP'),
      t('created_at', 'createdAt', { index: true }),
      t('updated_at', 'updatedAt')
    ],
    compositeIndexes: [['supplier_id', 'supplier_state']]
  },
  {
    table: 'payments',
    collection: 'payments',
    key: 'id',
    label: 'Payments',
    columns: [
      t('transaction_id', 'transactionId', { index: true }),
      // The idempotency guarantee stops being a convention and becomes a
      // constraint the engine will not let the application violate.
      t('idempotency_key', 'idempotencyKey', { notNull: true, unique: true }),
      t('hold_token', 'holdToken', { index: true }),
      t('trip_id', 'tripId', { notNull: true, index: true }),
      t('booking_id', 'bookingId', { index: true }),
      t('state', 'state', { index: true }),
      t('provider'),
      r('amount_egp', 'amountEGP'),
      bool('simulated'),
      t('created_at', 'createdAt', { index: true })
    ]
  },
  /**
   * Money tables: bookings, payments, ledger_entries.
   *
   * `trip_id` on these three is indexed but has NO foreign key, and that is a
   * deliberate reversal of the obvious modelling.
   *
   * Two reasons, and the first is the serious one:
   *
   * 1. A cascade here is a way to destroy financial records. `ON DELETE CASCADE`
   *    from trips would mean that deleting one trip silently deletes the
   *    bookings a traveller paid for, their payments, and the ledger entries
   *    recording the money — the audit trail disappearing along with the thing
   *    it exists to account for. No delete path should be able to do that.
   *
   * 2. A ledger outlives its subject. These rows are append-only financial
   *    facts; `tripId` on them is a recorded value, not a live relationship.
   *    Requiring the parent to still exist would mean either refusing to
   *    migrate real captured payments (the store already contains some whose
   *    trip is gone) or deleting them to make the constraint pass.
   *
   * Their integrity is guaranteed by stronger things than a foreign key: a
   * UNIQUE idempotency key per entry, and the ledger's own hash chain. The
   * dangling references stay visible — `npm run db:check` reports them by name
   * rather than dropping the rows.
   *
   * trip_items and holds keep CASCADE, because those genuinely are parts of a
   * trip's lifecycle and are meant to disappear with it.
   */
  {
    table: 'ledger_entries',
    collection: 'ledgerEntries',
    key: 'id',
    label: 'Ledger entries',
    columns: [
      t('transaction_id', 'transactionId', { index: true }),
      t('idempotency_key', 'idempotencyKey', { notNull: true, unique: true }),
      t('booking_ref', 'bookingRef', { index: true }),
      t('trip_id', 'tripId', { notNull: true, index: true }),
      t('type', 'type', { index: true }),
      t('status', 'status', { index: true }),
      t('debit_account', 'debitAccount', { index: true }),
      t('credit_account', 'creditAccount', { index: true }),
      r('amount_egp', 'amountEGP'),
      t('timestamp', 'timestamp', { index: true })
    ]
  },
  {
    table: 'transfer_telemetry',
    collection: 'transferTelemetry',
    key: 'bookingId',
    label: 'Transfer telemetry',
    columns: [
      t('reference_code', 'referenceCode', { index: true }),
      t('status', 'status', { index: true }),
      t('flight_status', 'flightStatus'),
      t('driver_phone', 'driverPhone'),
      r('latitude'),
      r('longitude'),
      t('updated_at', 'updatedAt', { index: true })
    ]
  },

  // ------------------------------------------------------- operations & audit
  {
    table: 'notifications',
    collection: 'notifications',
    key: 'id',
    label: 'Notifications',
    columns: [
      // No FK: 'ALL' is a broadcast selector, not a user id. See the note above.
      t('user_id', 'userId', { notNull: true, index: true }),
      t('type', 'type', { index: true }),
      t('status', 'status', { index: true }),
      t('channel'),
      t('created_at', 'createdAt', { index: true })
    ]
  },
  {
    table: 'support_messages',
    collection: 'supportMessages',
    key: 'id',
    label: 'Support messages',
    columns: [
      t('user_id', 'userId', { notNull: true, index: true, references: fk('users', 'CASCADE') }),
      t('trip_id', 'tripId', { index: true }),
      t('booking_ref', 'bookingRef'),
      t('status', 'status', { index: true }),
      bool('urgent'),
      t('created_at', 'createdAt', { index: true })
    ]
  },
  {
    table: 'audit_events',
    collection: 'auditEvents',
    key: 'id',
    label: 'Audit events',
    columns: [
      t('actor', 'actor', { index: true }),
      t('actor_role', 'actorRole'),
      t('action', 'action', { index: true }),
      t('entity_type', 'entityType'),
      t('entity_id', 'entityId'),
      t('timestamp', 'timestamp', { index: true })
    ],
    compositeIndexes: [['entity_type', 'entity_id']]
  },
  {
    table: 'opportunities',
    collection: 'opportunities',
    key: 'id',
    label: 'Product opportunities',
    columns: [
      t('status', 'status', { index: true }),
      t('product_area', 'productArea', { index: true }),
      r('confidence_score', 'confidenceScore')
    ]
  },
  {
    table: 'distributed_locks',
    collection: 'locks',
    key: 'id',
    label: 'Distributed locks',
    columns: [
      t('owner_id', 'ownerId', { index: true }),
      t('expires_at', 'expiresAt', { index: true }),
      i('fencing_token', 'fencingToken')
    ]
  },

  // ------------------------------------------------- local commerce & market
  {
    table: 'raw_supplier_sources',
    collection: 'rawSupplierSources',
    key: 'id',
    label: 'Raw supplier sources',
    columns: [t('source_type', 'sourceType', { index: true })]
  },
  {
    table: 'raw_offer_sources',
    collection: 'rawOfferSources',
    key: 'id',
    label: 'Raw offer sources',
    columns: [t('source_type', 'sourceType', { index: true })]
  },
  {
    table: 'supplier_offers',
    collection: 'supplierOffers',
    key: 'id',
    label: 'Supplier offers',
    columns: [
      // Advisory reference: the crawler can observe an offer before the
      // supplier row is created. Indexed, not constrained.
      t('supplier_id', 'supplierId', { index: true }),
      t('activity_id', 'activityId', { index: true }),
      t('canonical_category', 'canonicalCategory', { index: true }),
      t('currency'),
      r('price')
    ]
  },
  {
    table: 'market_price_stats',
    collection: 'marketPriceStats',
    key: 'activityId',
    label: 'Market price stats',
    columns: [
      r('lowest_observed_price', 'lowestObservedPrice'),
      r('highest_observed_price', 'highestObservedPrice'),
      r('median_observed_price', 'medianObservedPrice'),
      i('observed_offer_count', 'observedOfferCount'),
      t('last_calculated_at', 'lastCalculatedAt', { index: true })
    ]
  },
  {
    table: 'social_accounts',
    collection: 'socialAccounts',
    key: 'id',
    label: 'Social accounts',
    columns: [
      t('platform', 'platform', { index: true }),
      t('username', 'username', { index: true }),
      t('supplier_id', 'supplierId', { index: true }),
      t('ownership_status', 'ownershipStatus', { index: true }),
      t('category', 'category', { index: true })
    ]
  },
  {
    table: 'source_records',
    collection: 'sourceRecords',
    key: 'id',
    label: 'Source records',
    columns: [
      t('source_type', 'sourceType', { index: true }),
      t('supplier_id', 'supplierId', { index: true }),
      t('verification_status', 'verificationStatus', { index: true }),
      t('captured_at', 'capturedAt', { index: true })
    ]
  },
  {
    table: 'price_observations',
    collection: 'priceObservations',
    key: 'id',
    label: 'Price observations',
    columns: [
      t('offer_id', 'offerId', { index: true }),
      t('supplier_id', 'supplierId', { index: true }),
      t('activity_id', 'activityId', { index: true }),
      t('freshness_status', 'freshnessStatus', { index: true }),
      t('verification_status', 'verificationStatus' ),
      r('amount'),
      t('observed_at', 'observedAt', { index: true })
    ]
  },
  {
    table: 'market_change_events',
    collection: 'marketChangeEvents',
    key: 'id',
    label: 'Market change events',
    columns: [
      t('event_type', 'eventType', { index: true }),
      t('supplier_id', 'supplierId', { index: true }),
      t('detected_at', 'detectedAt', { index: true })
    ]
  },
  {
    table: 'market_snapshots',
    collection: 'marketSnapshots',
    key: 'id',
    label: 'Market snapshots',
    columns: [t('created_at', 'createdAt', { index: true })]
  },
  {
    table: 'source_freshness',
    collection: 'sourceFreshnessRecords',
    key: 'id',
    label: 'Source freshness',
    columns: [
      t('source_id', 'sourceId', { index: true }),
      t('freshness_status', 'freshnessStatus', { index: true })
    ]
  },
  {
    table: 'contact_history',
    collection: 'contactHistory',
    key: 'id',
    label: 'Contact history',
    columns: [
      t('supplier_id', 'supplierId', { index: true }),
      t('contacted_at', 'contactedAt', { index: true })
    ]
  },
  {
    table: 'market_refresh_runs',
    collection: 'marketRefreshRuns',
    key: 'id',
    label: 'Market refresh runs',
    columns: [
      t('run_id', 'runId', { index: true }),
      t('source_id', 'sourceId', { index: true }),
      t('status', 'status', { index: true }),
      t('started_at', 'startedAt', { index: true })
    ]
  },
  {
    table: 'market_review_queue',
    collection: 'marketReviewQueue',
    key: 'id',
    label: 'Market review queue',
    columns: [
      t('status', 'status', { index: true }),
      t('supplier_id', 'supplierId', { index: true })
    ]
  },
  {
    table: 'source_health',
    collection: 'sourceHealthRecords',
    key: 'id',
    label: 'Source health',
    columns: [
      t('source_id', 'sourceId', { index: true }),
      t('status', 'status', { index: true })
    ]
  },
  {
    table: 'refresh_schedule_policies',
    collection: 'refreshSchedulePolicies',
    key: 'id',
    label: 'Refresh schedule policies',
    columns: [
      t('source_id', 'sourceId', { index: true }),
      t('interval', 'interval')
    ]
  },
  {
    table: 'market_alerts',
    collection: 'marketAlerts',
    key: 'id',
    label: 'Market alerts',
    columns: [
      t('alert_type', 'alertType', { index: true }),
      t('severity', 'severity', { index: true }),
      t('created_at', 'createdAt', { index: true })
    ]
  },

  // ------------------------------------------------------------------- DKOS
  {
    table: 'research_sources',
    collection: 'researchSources',
    key: 'id',
    label: 'Research sources',
    columns: [
      t('source_type', 'sourceType', { index: true }),
      r('authority_weight', 'authorityWeight'),
      t('last_audited', 'lastAudited')
    ]
  },
  {
    table: 'area_profiles',
    collection: 'areaProfiles',
    key: 'id',
    label: 'Area profiles',
    columns: [t('name_en', 'nameEn', { index: true })]
  },
  {
    table: 'places',
    collection: 'places',
    key: 'id',
    label: 'Places',
    columns: [
      t('area_id', 'areaId', { notNull: true, index: true, references: fk('area_profiles', 'CASCADE') }),
      t('name_en', 'nameEn', { index: true }),
      t('category', 'category', { index: true }),
      t('operational_status', 'operationalStatus', { index: true }),
      t('google_place_id', 'googlePlaceId', { index: true })
    ]
  },
  {
    table: 'temporal_facts',
    collection: 'temporalFacts',
    key: 'id',
    label: 'Temporal facts',
    columns: [
      t('subject_id', 'subjectId', { index: true }),
      t('subject_type', 'subjectType', { index: true }),
      t('predicate', 'predicate', { index: true }),
      t('confidence_tier', 'confidenceTier', { index: true }),
      t('status', 'status', { index: true }),
      t('valid_from', 'validFrom'),
      t('valid_until', 'validUntil', { index: true }),
      t('verified_at', 'verifiedAt', { index: true })
    ],
    compositeIndexes: [['subject_id', 'predicate']]
  },
  {
    table: 'evidence_nodes',
    collection: 'evidenceNodes',
    key: 'id',
    label: 'Evidence nodes',
    columns: [t('fact_id', 'factId', { index: true })]
  },
  {
    table: 'conflict_sets',
    collection: 'conflictSets',
    key: 'id',
    label: 'Conflict sets',
    columns: [
      t('subject_id', 'subjectId', { index: true }),
      t('status', 'status', { index: true })
    ]
  },
  {
    table: 'activities',
    collection: 'activities',
    key: 'id',
    label: 'Activity details',
    columns: [
      t('sku_id', 'skuId', { index: true }),
      // Advisory: one activity already references a supplier that no longer
      // exists (SUP-BEDOUIN-TRANS). Indexed so the gap stays visible.
      t('supplier_id', 'supplierId', { index: true }),
      t('place_id', 'placeId', { index: true }),
      t('area_id', 'areaId', { index: true }),
      t('category', 'category', { index: true }),
      r('base_price_egp', 'basePriceEGP')
    ]
  },
  {
    table: 'dining_venues',
    collection: 'diningVenues',
    key: 'id',
    label: 'Dining venues',
    columns: [
      t('place_id', 'placeId', { index: true }),
      t('area_id', 'areaId', { index: true })
    ]
  },
  {
    table: 'emergency_resources',
    collection: 'emergencyResources',
    key: 'id',
    label: 'Emergency resources',
    columns: [
      t('resource_type', 'resourceType', { index: true }),
      t('area_id', 'areaId', { index: true })
    ]
  },
  {
    table: 'regulatory_decrees',
    collection: 'regulatoryDecrees',
    key: 'id',
    label: 'Regulatory decrees',
    columns: [t('status', 'status', { index: true })]
  },
  {
    table: 'knowledge_snapshots',
    collection: 'knowledgeSnapshots',
    // Keyed on the content fingerprint, not on versionId.
    //
    // versionId looks like an identifier and is not one: snapshotService only
    // generates a unique `DAHAB-<date>-v<n>` when no tag is passed, and callers
    // pass an explicit tag. All 54 snapshots in the store share the single
    // versionId 'DAHAB-2026-08-26-BOOTSTRAP', while createdAt and
    // fingerprintHash are distinct 54/54. The fingerprint is the real identity.
    key: 'fingerprintHash',
    label: 'Knowledge snapshots',
    columns: [
      t('version_id', 'versionId', { index: true }),
      t('created_at', 'createdAt', { index: true }),
      i('total_facts', 'totalFacts'),
      r('quality_score_overall', 'qualityScoreOverall')
    ]
  },
  {
    table: 'place_discoveries',
    collection: 'placeDiscoveries',
    key: 'id',
    label: 'Place discoveries',
    columns: [
      t('status', 'status', { index: true }),
      t('area_id', 'areaId', { index: true })
    ]
  },
  {
    table: 'resolution_candidates',
    collection: 'resolutionCandidates',
    key: 'id',
    label: 'Entity resolution candidates',
    columns: [
      t('status', 'status', { index: true }),
      r('score')
    ]
  }
];

/** Collections that live in DatabaseState but are scalars, not tables. */
export const SCALAR_STATE_KEYS = ['version', 'fencingSequence', 'lastCheckpoint'] as const;

export const SPEC_BY_COLLECTION = new Map<string, TableSpec>(
  TABLE_SPECS.map(s => [s.collection as string, s])
);

export const SPEC_BY_TABLE = new Map<string, TableSpec>(
  TABLE_SPECS.map(s => [s.table, s])
);
