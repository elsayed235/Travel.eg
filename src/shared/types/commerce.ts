/**
 * The verticals the commerce engine sells. Mirrors CommerceServiceType in
 * server/db/schema.ts — 'wellness' and 'dining' arrived with the Book Now
 * catalogue's in-destination services, which have real inventory now.
 */
export type CommerceServiceType =
  | 'transfer'
  | 'diving'
  | 'hotel'
  | 'safari'
  | 'wellness'
  | 'dining';

export type PaymentState =
  | 'INITIATED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'DISPUTED';

export type LedgerEntryType =
  | 'HOLD_ESCROW'
  | 'PAYMENT_CAPTURED'
  | 'SUPPLIER_PAYOUT'
  | 'PLATFORM_COMMISSION'
  /** Returns the platform's fee to escrow when the underlying payment is
   *  refunded. Without it a full refund leaves escrow short by the commission. */
  | 'COMMISSION_REVERSAL'
  | 'REFUND_ISSUED'
  | 'RECOVERY_CREDIT'
  | 'ADJUSTMENT';

/**
 * A confirmed booking as shown to the traveler.
 *
 * Canonical home for what was duplicated in src/types.ts and
 * src/components/mytrip/myTripData.ts with different status unions.
 */
export interface ConfirmedBookingItem {
  id: string;
  serviceType: CommerceServiceType;
  title: string;
  subtitle: string;
  details: string;
  datesOrTime: string;
  priceEGP: number;
  provider: string;
  confirmationCode: string;
  status: 'Confirmed ✓' | 'Pending' | 'Changed';
  location: string;
  iconType: 'building' | 'car' | 'waves' | 'compass' | 'sparkles' | 'utensils';
  phone?: string;
  included?: string[];
  cancellationPolicy?: string;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  idempotencyKey: string;
  bookingRef: string;
  tripId: string;
  type: LedgerEntryType;
  amountEGP: number;
  debitAccount: string;
  creditAccount: string;
  currency: 'EGP' | 'USD' | 'EUR';
  timestamp: string;
  status: 'SETTLED' | 'PENDING' | 'VOIDED';
  signatureHash: string;
  /**
   * Contextual detail attached to the entry. The named keys below are the
   * conventional ones; callers legitimately attach extra context (payment
   * method, gateway, supplier name, pickup location...).
   *
   * The server's LedgerEntryEntity.metadata is `Record<string, any>`, so the
   * closed shape here was narrower than the contract it mirrors and rejected
   * valid call sites.
   */
  metadata?: {
    serviceType?: string;
    supplierId?: string;
    travelerName?: string;
    reason?: string;
    [key: string]: unknown;
  };
}

export interface SupplierEntity {
  id: string;
  businessName: string;
  businessNameAr?: string;
  category?: 'transfer' | 'diving' | 'hotel' | 'safari' | 'restaurant' | 'logistics';
  vertical?: string;
  tier?: 'Tier 1 Certified' | 'Tier 2 Certified' | 'Vetted Local Partner';
  status: 'Active' | 'Pending_Verification' | 'Suspended' | string;
  leadContact?: string;
  ownerName?: string;
  phone: string;
  email: string;
  area?: string;
  location?: string;
  licenseNumber?: string;
  cdwsLicenseNumber?: string;
  cdwsExpiryDate?: string;
  rating: number;
  reviewCount: number;
  onboardedAt?: string;
  approvedBy?: string;
  commissionRate?: number;
  payoutMethod?: string;
  payoutDetails?: Record<string, any>;
  payoutAccountNumber?: string;
  whatsappNumber?: string;
  metadata?: Record<string, any>;
}

export interface ProductSkuEntity {
  id: string;
  supplierId: string;
  serviceType: CommerceServiceType | string;
  title: string;
  titleAr: string;
  description: string;
  routeFrom?: string;
  routeTo?: string;
  durationMinutes?: number;
  basePriceEGP: number;
  currency: 'EGP' | 'USD' | 'EUR';
  maxCapacityPerSlot: number;
  active: boolean;
  includedItems?: string[];
  cancellationPolicyHours?: number;
}

export interface InventorySlotEntity {
  id: string;
  skuId: string;
  date: string;
  timeSlot: string;
  totalCapacity: number;
  reservedCapacity: number;
  heldCapacity: number;
  status: 'OPEN' | 'SOLD_OUT' | 'LOCKED';
}

export interface HoldEntity {
  id: string;
  holdToken: string;
  skuId: string;
  tripId: string;
  travelerId: string;
  date: string;
  timeSlot: string;
  units: number;
  amountEGP: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CONVERTED' | 'RELEASED';
  idempotencyKey: string;
  createdAt: string;
}

/**
 * A booking as the server actually stores and returns it.
 *
 * This replaces an earlier `BookingEntity` declared here that no component ever
 * used and that shared almost no fields with the server's record — it promised
 * `referenceCode`, `voucherCode`, `qrPayload`, `commissionRate` and a
 * `titleAr`, none of which exist on `BookingEntity` in server/db/schema.ts.
 * Two types with one name, one of them fictional, is what Phase B spent most of
 * its effort undoing; this one mirrors the wire shape of
 * GET /api/trips/:tripId/bookings and nothing else.
 */
/** The supplier summary returned alongside a trip's bookings and items. */
export interface BookingSupplierSummary {
  id: string;
  businessName: string;
  businessNameAr: string;
  phone: string;
  whatsapp?: string;
  area: string;
  tier: string;
}

export interface TripBookingRecord {
  id: string;
  bookingRef: string;
  tripId: string;
  tripItemId?: string;
  supplierId: string;
  skuId: string;
  serviceType: CommerceServiceType;
  amountEGP: number;
  paymentState: PaymentState;
  supplierState:
    | 'PENDING_CONFIRMATION'
    | 'CONFIRMED'
    | 'ASSIGNED'
    | 'DISPATCHED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'REJECTED'
    | 'CANCELLED';
  travelerName: string;
  travelerPhone: string;
  travelerEmail: string;
  passengersCount: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  scheduledDate: string;
  scheduledTime: string;
  flightNumber?: string;
  specialRequests?: string;
  confirmationCode: string;
  assignedResource?: {
    driverName?: string;
    driverNameAr?: string;
    driverPhone?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
    guideName?: string;
    guidePhone?: string;
    diveSite?: string;
    expeditionRoute?: string;
  };
  createdAt: string;
  updatedAt: string;
  /** Null when the supplier record has been removed; the booking still stands. */
  supplier: BookingSupplierSummary | null;
}

export interface PaymentEntity {
  id: string;
  bookingRef: string;
  tripId: string;
  travelerId: string;
  amountEGP: number;
  currency: 'EGP' | 'USD' | 'EUR';
  gateway: 'Paymob' | 'VodafoneCash' | 'InstaPay' | 'CashOnArrival' | 'Direct';
  gatewayTransactionId?: string;
  state: PaymentState;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferTrackingRecord {
  bookingId: string;
  referenceCode: string;
  driverName: string;
  driverNameAr?: string;
  driverPhone: string;
  vehicleModel: string;
  vehiclePlate: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  flightNumber?: string;
  flightStatus?: 'ON_TIME' | 'DELAYED' | 'LANDED';
  status: 'ASSIGNED' | 'DISPATCHED' | 'AT_AIRPORT' | 'PASSENGER_PICKED_UP' | 'COMPLETED';
  lastGpsUpdate: string;
}

export type VerificationLevel =
  | 'SOURCE_REPORTED'
  | 'WEB_CONFIRMED'
  | 'SUPPLIER_CONFIRMED'
  | 'REGULATORY_VERIFIED'
  | 'FULLY_VERIFIED'
  | 'EXPIRED'
  | 'SUSPENDED';

export type PricingBasis =
  | 'PER_PERSON'
  | 'PER_GROUP'
  | 'PER_BOOKING'
  | 'SINGLE'
  | 'DOUBLE'
  | 'SNGL_DBL'
  | 'VIP_PER_PERSON'
  | 'STARTING_FROM'
  | 'PRICE_ON_INQUIRY'
  | 'INQUIRY'
  | 'UNKNOWN';

export type FreshnessStatus = 'CURRENT' | 'RECENT' | 'STALE' | 'UNKNOWN';

export type LocalCommerceSourceType =
  | 'USER_PROVIDED_IMAGE'
  | 'REGULATORY'
  | 'SUPPLIER_OWNED'
  | 'COMMERCIAL_MARKETPLACE'
  | 'LOCAL_DIRECTORY'
  | 'COMMUNITY'
  | 'AUTHORITATIVE';

export interface RawSupplierSourceEntity {
  id: string;
  sourceType: LocalCommerceSourceType;
  sourceReference: string;
  sourceUrl?: string;
  sourceImage?: string;
  sourceCapturedAt?: string;
  supplierNameRaw: string;
  supplierNameArRaw?: string;
  contactRaw?: string;
  whatsappRaw?: string;
  socialRaw?: string;
  addressRaw?: string;
  bookingInstructionsRaw?: string;
  extractedConfidence: number;
  verificationStatus: VerificationLevel;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface RawOfferSourceEntity {
  id: string;
  rawSupplierSourceId: string;
  sourceType: LocalCommerceSourceType;
  sourceReference: string;
  supplierNameRaw: string;
  activityNameRaw: string;
  activityNameArRaw?: string;
  destinationRaw?: string;
  priceRaw: string;
  currencyRaw: string;
  pricingBasisRaw?: string;
  singlePriceRaw?: string;
  doublePriceRaw?: string;
  vipPriceRaw?: string;
  scheduleRaw?: string;
  durationRaw?: string;
  inclusionsRaw?: string[];
  exclusionsRaw?: string[];
  transportRaw?: string;
  equipmentRaw?: string;
  bookingConditionsRaw?: string;
  extractedConfidence: number;
  verificationStatus: VerificationLevel;
  notes?: string;
  createdAt: string;
}

export interface SupplierOfferEntity {
  id: string;
  supplierId: string;
  activityId: string;
  canonicalCategory: string;
  sourceActivityName: string;
  titleAr: string;
  titleEn: string;
  price: number;
  currency: 'EGP' | 'USD' | 'EUR';
  pricingBasis: PricingBasis;
  singlePrice?: number;
  doublePrice?: number;
  vipPrice?: number;
  groupPrice?: number;
  departureTime?: string;
  returnTime?: string;
  duration?: string;
  durationMinutes?: number;
  includes: string[];
  excludes: string[];
  transportType?: string;
  equipmentProvided?: string;
  bookingChannels: string[];
  sourceType: LocalCommerceSourceType;
  sourceReferences: string[];
  sourceImage?: string;
  sourceCapturedAt?: string;
  verificationStatus: VerificationLevel;
  verificationSource?: string;
  verifiedAt?: string;
  sourceFreshness: FreshnessStatus;
  extractionConfidence: number;
  active: boolean;
  fingerprint: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketPriceStatEntity {
  activityId: string;
  activityNameEn: string;
  activityNameAr: string;
  currency: 'EGP';
  lowestObservedPrice: number;
  highestObservedPrice: number;
  medianObservedPrice: number;
  observedOfferCount: number;
  priceRange: string;
  offers: Array<{
    offerId: string;
    supplierId: string;
    supplierName: string;
    price: number;
    pricingBasis: PricingBasis;
    verificationStatus: VerificationLevel;
    freshnessStatus: FreshnessStatus;
  }>;
  label: 'OBSERVED_MARKET_DATA';
  lastCalculatedAt: string;
}
