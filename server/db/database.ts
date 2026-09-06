import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  UserEntity,
  SessionEntity,
  TripEntity,
  TripItemEntity,
  SupplierEntity,
  ProductSkuEntity,
  HotelEntity,
  AccommodationEntity,
  PropertySourceEntity,
  InventorySlotEntity,
  HoldEntity,
  PaymentEntity,
  BookingEntity,
  LedgerEntryEntity,
  TransferTelemetryEntity,
  NotificationEntity,
  AuditEventEntity,
  PlaceDiscoveryEntity,
  EntityResolutionCandidateEntity,
  SpatialRouteCacheEntity,
  ResearchSourceEntity,
  TemporalFactEntity,
  EvidenceNodeEntity,
  ConflictSetEntity,
  AreaProfileEntity,
  PlaceEntity,
  ActivityDetailEntity,
  DiningVenueEntity,
  EmergencyResourceEntity,
  RegulatoryDecreeEntity,
  KnowledgeSnapshotEntity,
  DistributedLockEntity,
  RawSupplierSourceEntity,
  RawOfferSourceEntity,
  SupplierOfferEntity,
  MarketPriceStatEntity,
  SocialAccountEntity,
  SourceRecordEntity,
  PriceObservationEntity,
  MarketChangeEventEntity,
  MarketSnapshotEntity,
  SourceFreshnessEntity,
  ContactHistoryEntity,
  MarketRefreshRunEntity,
  MarketReviewQueueEntity,
  SourceHealthEntity,
  RefreshSchedulePolicyEntity,
  MarketAlertEntity,
  SupportMessageEntity,
  RentalListingEntity,
  RentalExtraEntity,
  RentalBookingEntity,
  RentalMaintenanceBlockEntity
} from './schema';
import { ProductOpportunity } from '../../src/types/intelligence';
import { IPersistenceAdapter } from './adapters/IPersistenceAdapter';
import { selectAdapter } from './selectAdapter';

export interface DatabaseState {
  version: number;
  users: UserEntity[];
  sessions: SessionEntity[];
  trips: TripEntity[];
  tripItems: TripItemEntity[];
  suppliers: SupplierEntity[];
  productSkus: ProductSkuEntity[];
  hotels: HotelEntity[];
  accommodations: AccommodationEntity[];
  propertySources: PropertySourceEntity[];
  inventorySlots: InventorySlotEntity[];
  holds: HoldEntity[];
  payments: PaymentEntity[];
  bookings: BookingEntity[];
  ledgerEntries: LedgerEntryEntity[];
  transferTelemetry: TransferTelemetryEntity[];
  notifications: NotificationEntity[];
  supportMessages: SupportMessageEntity[];
  auditEvents: AuditEventEntity[];
  opportunities: ProductOpportunity[];
  // Distributed Concurrency & Locks
  locks?: DistributedLockEntity[];
  fencingSequence?: number;
  // Local Commerce & Provenance Engine
  rawSupplierSources?: RawSupplierSourceEntity[];
  rawOfferSources?: RawOfferSourceEntity[];
  supplierOffers?: SupplierOfferEntity[];
  marketPriceStats?: MarketPriceStatEntity[];
  socialAccounts?: SocialAccountEntity[];
  sourceRecords?: SourceRecordEntity[];
  priceObservations?: PriceObservationEntity[];
  marketChangeEvents?: MarketChangeEventEntity[];
  marketSnapshots?: MarketSnapshotEntity[];
  sourceFreshnessRecords?: SourceFreshnessEntity[];
  contactHistory?: ContactHistoryEntity[];
  marketRefreshRuns?: MarketRefreshRunEntity[];
  marketReviewQueue?: MarketReviewQueueEntity[];
  sourceHealthRecords?: SourceHealthEntity[];
  refreshSchedulePolicies?: RefreshSchedulePolicyEntity[];
  marketAlerts?: MarketAlertEntity[];
  // Rentals (bikes MVP; category-agnostic domain)
  rentalListings?: RentalListingEntity[];
  rentalExtras?: RentalExtraEntity[];
  rentalBookings?: RentalBookingEntity[];
  rentalMaintenanceBlocks?: RentalMaintenanceBlockEntity[];
  // DKOS Tables
  researchSources: ResearchSourceEntity[];
  temporalFacts: TemporalFactEntity[];
  evidenceNodes: EvidenceNodeEntity[];
  conflictSets: ConflictSetEntity[];
  areaProfiles: AreaProfileEntity[];
  places: PlaceEntity[];
  activities: ActivityDetailEntity[];
  diningVenues: DiningVenueEntity[];
  emergencyResources: EmergencyResourceEntity[];
  regulatoryDecrees: RegulatoryDecreeEntity[];
  knowledgeSnapshots: KnowledgeSnapshotEntity[];
  placeDiscoveries: PlaceDiscoveryEntity[];
  resolutionCandidates: EntityResolutionCandidateEntity[];
  lastCheckpoint: string;
}

export class Database {
  private adapter: IPersistenceAdapter;

  constructor(customAdapter?: IPersistenceAdapter) {
    this.adapter = customAdapter ?? selectAdapter();
  }

  public setAdapter(adapter: IPersistenceAdapter) {
    this.adapter = adapter;
  }

  public getAdapter(): IPersistenceAdapter {
    return this.adapter;
  }

  public get state(): DatabaseState {
    return this.adapter.getState();
  }

  public saveToDisk(customState?: DatabaseState) {
    if (customState) {
      // Overwrite local state reference if supplied
      Object.assign(this.adapter.getState(), customState);
    }
    this.adapter.save();
  }

  // -------------------------------------------------------------------------
  // Transaction Support
  // -------------------------------------------------------------------------
  public beginTransaction() {
    this.adapter.beginTransaction();
  }

  public commit() {
    this.adapter.commit();
  }

  public rollback() {
    this.adapter.rollback();
  }

  public runInTransaction<T>(work: () => T): T {
    return this.adapter.runInTransaction(work) as T;
  }

  // -------------------------------------------------------------------------
  // Getters for Tables
  // -------------------------------------------------------------------------
  public get users() { return this.state.users; }
  public get sessions() { return this.state.sessions; }
  public get trips() { return this.state.trips; }
  public get tripItems() { return this.state.tripItems; }
  public get suppliers() { return this.state.suppliers; }
  public get productSkus() { return this.state.productSkus; }
  public get hotels() { return this.state.hotels || (this.state.hotels = []); }
  public get accommodations() { return this.state.accommodations || (this.state.accommodations = []); }
  public get propertySources() { return this.state.propertySources || (this.state.propertySources = []); }
  public get inventorySlots() { return this.state.inventorySlots; }
  public get holds() { return this.state.holds; }
  public get payments() { return this.state.payments; }
  public get bookings() { return this.state.bookings; }
  public get ledgerEntries() { return this.state.ledgerEntries; }
  public get transferTelemetry() { return this.state.transferTelemetry; }
  public get notifications() { return this.state.notifications; }
  public get supportMessages() {
    // Defaulted here as well as in the adapters, so a store written before this
    // collection existed loads without crashing on an undefined array.
    if (!this.state.supportMessages) this.state.supportMessages = [];
    return this.state.supportMessages;
  }
  public get auditEvents() { return this.state.auditEvents; }
  public get opportunities() { return this.state.opportunities; }
  public get rawSupplierSources() { return this.state.rawSupplierSources || (this.state.rawSupplierSources = []); }
  public get rawOfferSources() { return this.state.rawOfferSources || (this.state.rawOfferSources = []); }
  public get supplierOffers() { return this.state.supplierOffers || (this.state.supplierOffers = []); }
  public get marketPriceStats() { return this.state.marketPriceStats || (this.state.marketPriceStats = []); }
  public get socialAccounts() { return this.state.socialAccounts || (this.state.socialAccounts = []); }
  public get sourceRecords() { return this.state.sourceRecords || (this.state.sourceRecords = []); }
  public get priceObservations() { return this.state.priceObservations || (this.state.priceObservations = []); }
  public get marketChangeEvents() { return this.state.marketChangeEvents || (this.state.marketChangeEvents = []); }
  public get marketSnapshots() { return this.state.marketSnapshots || (this.state.marketSnapshots = []); }
  public get sourceFreshnessRecords() { return this.state.sourceFreshnessRecords || (this.state.sourceFreshnessRecords = []); }
  public get contactHistory() { return this.state.contactHistory || (this.state.contactHistory = []); }
  public get marketRefreshRuns() { return this.state.marketRefreshRuns || (this.state.marketRefreshRuns = []); }
  public get marketReviewQueue() { return this.state.marketReviewQueue || (this.state.marketReviewQueue = []); }
  public get sourceHealthRecords() { return this.state.sourceHealthRecords || (this.state.sourceHealthRecords = []); }
  public get refreshSchedulePolicies() { return this.state.refreshSchedulePolicies || (this.state.refreshSchedulePolicies = []); }
  public get marketAlerts() { return this.state.marketAlerts || (this.state.marketAlerts = []); }
  public get researchSources() { return this.state.researchSources || (this.state.researchSources = []); }
  public get temporalFacts() { return this.state.temporalFacts || (this.state.temporalFacts = []); }
  public get evidenceNodes() { return this.state.evidenceNodes || (this.state.evidenceNodes = []); }
  public get conflictSets() { return this.state.conflictSets || (this.state.conflictSets = []); }
  public get areaProfiles() { return this.state.areaProfiles || (this.state.areaProfiles = []); }
  public get places() { return this.state.places || (this.state.places = []); }
  public get activities() { return this.state.activities || (this.state.activities = []); }
  public get diningVenues() { return this.state.diningVenues || (this.state.diningVenues = []); }
  public get emergencyResources() { return this.state.emergencyResources || (this.state.emergencyResources = []); }
  public get regulatoryDecrees() { return this.state.regulatoryDecrees || (this.state.regulatoryDecrees = []); }
  public get knowledgeSnapshots() { return this.state.knowledgeSnapshots || (this.state.knowledgeSnapshots = []); }
  public get placeDiscoveries() { return this.state.placeDiscoveries || (this.state.placeDiscoveries = []); }
  public get resolutionCandidates() { return this.state.resolutionCandidates || (this.state.resolutionCandidates = []); }
  public get rentalListings() { return this.state.rentalListings || (this.state.rentalListings = []); }
  public get rentalExtras() { return this.state.rentalExtras || (this.state.rentalExtras = []); }
  public get rentalBookings() { return this.state.rentalBookings || (this.state.rentalBookings = []); }
  public get rentalMaintenanceBlocks() { return this.state.rentalMaintenanceBlocks || (this.state.rentalMaintenanceBlocks = []); }
  public get locks() { return this.state.locks || (this.state.locks = []); }
  public get lastCheckpoint() { return this.state.lastCheckpoint; }

  public nextFencingToken(): number {
    // The SQLite adapter can do this atomically across processes; the file
    // fallback below cannot. Prefer the real one whenever it is in use.
    const adapter = this.adapter as IPersistenceAdapter & { nextFencingToken?: () => number };
    if (typeof adapter.nextFencingToken === 'function') {
      return adapter.nextFencingToken();
    }

    const seqFile = path.join(process.cwd(), 'data', 'fencing_sequence.seq');
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      let currentSeq = 1000;
      if (fs.existsSync(seqFile)) {
        const raw = fs.readFileSync(seqFile, 'utf-8').trim();
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed >= 1000) {
          currentSeq = parsed;
        }
      }
      const nextSeq = Math.max(currentSeq + 1, (this.state.fencingSequence || 1000) + 1);
      fs.writeFileSync(seqFile, nextSeq.toString(), 'utf-8');
      this.state.fencingSequence = nextSeq;
      return nextSeq;
    } catch {
      if (typeof this.state.fencingSequence !== 'number') {
        this.state.fencingSequence = 1000;
      }
      this.state.fencingSequence += 1;
      return this.state.fencingSequence;
    }
  }

  // -------------------------------------------------------------------------
  // Audit Logger
  // -------------------------------------------------------------------------
  public logAudit(actor: string, actorRole: string, action: string, entityType: string, entityId: string, payload: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const signature = crypto.createHash('sha256').update(`${actor}:${action}:${entityId}:${timestamp}`).digest('hex');
    const entry: AuditEventEntity = {
      id: `AUD-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      actor,
      actorRole,
      action,
      entityType,
      entityId,
      payload,
      timestamp,
      signature
    };
    this.state.auditEvents.unshift(entry);
    this.adapter.save();
    return entry;
  }
}

// Global Singleton Instance
export const db = new Database();
