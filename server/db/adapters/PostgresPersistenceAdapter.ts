import fs from 'fs';
import path from 'path';
import pg, { Pool, PoolClient } from 'pg';
import { IPersistenceAdapter } from './IPersistenceAdapter';
import { DatabaseState } from '../database';

export interface PostgresConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  maxConnections?: number;
  idleTimeoutMillis?: number;
}

export class PostgresPersistenceAdapter implements IPersistenceAdapter {
  private pool: Pool | null = null;
  private state: DatabaseState;
  private isConnected = false;
  private config: PostgresConfig;
  private activeTransactionClient: PoolClient | null = null;
  private isTransactionActive = false;
  private transactionDepth = 0;

  constructor(config?: PostgresConfig, initialState?: DatabaseState) {
    this.config = config || {
      connectionString: process.env.DATABASE_URL
    };
    this.state = initialState ? JSON.parse(JSON.stringify(initialState)) : this.createEmptyState();
    this.initPool();
  }

  private createEmptyState(): DatabaseState {
    return {
      version: 1,
      users: [],
      sessions: [],
      trips: [],
      tripItems: [],
      suppliers: [],
      productSkus: [],
      hotels: [],
      accommodations: [],
      propertySources: [],
      inventorySlots: [],
      holds: [],
      payments: [],
      bookings: [],
      ledgerEntries: [],
      transferTelemetry: [],
      notifications: [],
      supportMessages: [],
      auditEvents: [],
      opportunities: [],
      locks: [],
      fencingSequence: 1000,
      researchSources: [],
      temporalFacts: [],
      evidenceNodes: [],
      conflictSets: [],
      areaProfiles: [],
      places: [],
      activities: [],
      diningVenues: [],
      emergencyResources: [],
      regulatoryDecrees: [],
      knowledgeSnapshots: [],
      placeDiscoveries: [],
      resolutionCandidates: [],
      lastCheckpoint: new Date().toISOString()
    };
  }

  private initPool() {
    const connStr = this.config.connectionString || process.env.DATABASE_URL;
    if (!connStr && !this.config.host) {
      // Standby / unconfigured mode
      return;
    }

    try {
      this.pool = new pg.Pool({
        connectionString: connStr,
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl || (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined),
        max: this.config.maxConnections || 20,
        idleTimeoutMillis: this.config.idleTimeoutMillis || 30000,
        connectionTimeoutMillis: 5000
      });

      this.pool.on('error', (err) => {
        console.error('[PostgresPersistenceAdapter] Unexpected client error in pool:', err.message);
      });
    } catch (err: any) {
      console.error('[PostgresPersistenceAdapter] Failed to initialize pg.Pool:', err.message);
    }
  }

  public getPool(): Pool | null {
    return this.pool;
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public async isHealthy(): Promise<boolean> {
    if (!this.pool) {
      return false;
    }
    try {
      const client = await this.pool.connect();
      try {
        const result = await client.query('SELECT 1 as alive');
        this.isConnected = result.rows.length > 0;
        return this.isConnected;
      } finally {
        client.release();
      }
    } catch (err) {
      this.isConnected = false;
      return false;
    }
  }

  public async initializeSchema(): Promise<boolean> {
    if (!this.pool) {
      throw new Error('Cannot initialize schema: PostgreSQL pool not connected.');
    }
    const schemaPath = path.join(process.cwd(), 'server/db/sql/schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }
    const ddl = fs.readFileSync(schemaPath, 'utf-8');
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(ddl);
      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * NOT IMPLEMENTED.
   *
   * This method has always been an empty stub. All state lived in the in-memory
   * `this.state` mirror and nothing was ever written to PostgreSQL, so selecting
   * this adapter silently discarded every user, booking, payment and ledger
   * entry on restart — while /api/health reported "PostgreSQL Relational".
   *
   * It now records that fact rather than implying success. The adapter refuses
   * to be selected at all (see assertUsable), so this should be unreachable in
   * a normal boot; migrateFromJson and runInPostgresTransaction below do issue
   * real SQL and remain usable for a one-off migration.
   */
  public async save(): Promise<void> {
    this.state.lastCheckpoint = new Date().toISOString();
    if (!PostgresPersistenceAdapter.hasWarnedAboutSave) {
      PostgresPersistenceAdapter.hasWarnedAboutSave = true;
      console.error(
        '[PostgresPersistenceAdapter] save() is not implemented — no state is being persisted. ' +
        'Data will be lost on restart. Use the JSON adapter until real persistence exists.'
      );
    }
  }

  private static hasWarnedAboutSave = false;

  /**
   * Throws unless the caller has explicitly acknowledged that this adapter does
   * not persist. Better a refused boot than silent, total data loss.
   */
  public static assertUsable(): void {
    if (process.env.ALLOW_NONPERSISTENT_POSTGRES_ADAPTER === 'true') {
      console.warn(
        '[PostgresPersistenceAdapter] Selected with ALLOW_NONPERSISTENT_POSTGRES_ADAPTER=true. ' +
        'State is in-memory only and WILL be lost on restart.'
      );
      return;
    }
    throw new Error(
      'PERSISTENCE_ADAPTER=postgres was requested, but PostgresPersistenceAdapter.save() is not ' +
      'implemented: no application state is written to PostgreSQL, so all data would be lost on ' +
      'restart. Use PERSISTENCE_ADAPTER=json, or set ALLOW_NONPERSISTENT_POSTGRES_ADAPTER=true if ' +
      'you genuinely want an ephemeral in-memory store.'
    );
  }

  public async beginTransactionAsync(): Promise<PoolClient | null> {
    if (!this.pool) return null;
    const client = await this.pool.connect();
    await client.query('BEGIN');
    this.activeTransactionClient = client;
    this.isTransactionActive = true;
    return client;
  }

  public async commitAsync(): Promise<void> {
    if (this.activeTransactionClient) {
      try {
        await this.activeTransactionClient.query('COMMIT');
      } finally {
        this.activeTransactionClient.release();
        this.activeTransactionClient = null;
        this.isTransactionActive = false;
      }
    }
  }

  public async rollbackAsync(): Promise<void> {
    if (this.activeTransactionClient) {
      try {
        await this.activeTransactionClient.query('ROLLBACK');
      } finally {
        this.activeTransactionClient.release();
        this.activeTransactionClient = null;
        this.isTransactionActive = false;
      }
    }
  }

  // Synchronous contract required by IPersistenceAdapter
  public beginTransaction(): void {
    this.transactionDepth++;
    this.isTransactionActive = true;
  }

  public commit(): void {
    if (this.transactionDepth > 0) {
      this.transactionDepth--;
      if (this.transactionDepth === 0) {
        this.isTransactionActive = false;
      }
    }
  }

  public rollback(): void {
    this.transactionDepth = 0;
    this.isTransactionActive = false;
  }

  public runInTransaction<R>(work: () => R): R {
    this.beginTransaction();
    try {
      const result = work();
      this.commit();
      return result;
    } catch (error) {
      this.rollback();
      throw error;
    }
  }

  public async runInPostgresTransaction<R>(work: (client: PoolClient) => Promise<R>): Promise<R> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool not available for relational transaction.');
    }
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  public async migrateFromJson(sourceState: DatabaseState): Promise<{
    users: number;
    trips: number;
    bookings: number;
    ledgerEntries: number;
    temporalFacts: number;
  }> {
    if (!this.pool) {
      throw new Error('Cannot migrate data: PostgreSQL pool not connected.');
    }

    const counts = {
      users: 0,
      trips: 0,
      bookings: 0,
      ledgerEntries: 0,
      temporalFacts: 0
    };

    await this.runInPostgresTransaction(async (client) => {
      // 1. Users
      for (const u of sourceState.users) {
        await client.query(
          `INSERT INTO users (id, email, name, phone, password_hash, password_salt, password_algorithm, role, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()`,
          [u.id, u.email, u.name, u.phone, u.passwordHash, u.passwordSalt || null, u.passwordAlgorithm || 'scrypt', u.role, u.createdAt, u.updatedAt]
        );
        counts.users++;
      }

      // 2. Trips
      for (const t of sourceState.trips) {
        await client.query(
          `INSERT INTO trips (id, user_id, title, status, length_days, travelers_count, budget, pace, interests, total_estimated_egp, total_paid_egp, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING`,
          [t.id, t.userId, t.title, t.status, t.lengthDays, t.travelersCount, t.budget, t.pace, t.interests || [], t.totalEstimatedEGP, t.totalPaidEGP, t.createdAt, t.updatedAt]
        );
        counts.trips++;
      }

      // 3. Bookings
      for (const b of sourceState.bookings) {
        await client.query(
          `INSERT INTO bookings (id, booking_ref, trip_id, supplier_id, sku_id, service_type, amount_egp, payment_state, supplier_state, traveler_name, traveler_phone, traveler_email, passengers_count, pickup_location, dropoff_location, scheduled_date, scheduled_time, flight_number, special_requests, confirmation_code, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
           ON CONFLICT (id) DO NOTHING`,
          [
            b.id, b.bookingRef, b.tripId, b.supplierId, b.skuId, b.serviceType, b.amountEGP,
            b.paymentState, b.supplierState, b.travelerName, b.travelerPhone, b.travelerEmail,
            b.passengersCount, b.pickupLocation, b.dropoffLocation, b.scheduledDate, b.scheduledTime,
            b.flightNumber || null, b.specialRequests || null, b.confirmationCode, b.createdAt, b.updatedAt
          ]
        );
        counts.bookings++;
      }

      // 4. Ledger Entries
      for (const l of sourceState.ledgerEntries) {
        await client.query(
          `INSERT INTO ledger_entries (id, transaction_id, idempotency_key, booking_ref, trip_id, type, amount_egp, debit_account, credit_account, currency, timestamp, status, signature_hash)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING`,
          [l.id, l.transactionId, l.idempotencyKey, l.bookingRef, l.tripId, l.type, l.amountEGP, l.debitAccount, l.creditAccount, l.currency || 'EGP', l.timestamp, l.status, l.signatureHash]
        );
        counts.ledgerEntries++;
      }

      // 5. Temporal Facts
      for (const f of sourceState.temporalFacts || []) {
        await client.query(
          `INSERT INTO temporal_facts (id, subject_id, fact_type, claim_en, claim_ar, confidence_tier, source, valid_from, valid_until, last_verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [
            f.id,
            f.subjectId,
            f.predicate || 'fact',
            typeof f.value === 'string' ? f.value : JSON.stringify(f.value || ''),
            '',
            f.confidenceTier || 'VERY_HIGH',
            f.primarySourceId || 'SRC-MANUAL',
            f.validFrom || new Date().toISOString(),
            f.validUntil || null,
            f.verifiedAt || new Date().toISOString()
          ]
        );
        counts.temporalFacts++;
      }
    });

    // Populate memory mirror
    Object.assign(this.state, JSON.parse(JSON.stringify(sourceState)));
    return counts;
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
    }
  }
}
