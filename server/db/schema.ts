import { PaymentState, LedgerEntryType, JourneyStage } from '../../src/shared';

export interface UserEntity {
  id: string;
  /**
   * Firebase uid for federated accounts. This — not the email — is the identity
   * key for Firebase sign-in, so that knowing an address is not enough to claim
   * the matching account.
   */
  firebaseUid?: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  passwordSalt?: string;
  passwordAlgorithm?: 'scrypt' | 'sha256_legacy';
  role: 'Traveler' | 'Supplier' | 'Operations' | 'Product' | 'Admin';
  /**
   * For role 'Supplier': the SupplierEntity this account may act for. Supplier
   * actions are bound to this rather than to a body parameter, so an account
   * cannot operate on another supplier's bookings.
   */
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionEntity {
  id: string;
  userId: string;
  token: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

export interface TripEntity {
  id: string;
  userId: string;
  title: string;
  status: 'DRAFT' | 'PLANNED' | 'CONFIRMED' | 'IN_DESTINATION' | 'COMPLETED' | 'CANCELLED';
  lengthDays: number;
  travelersCount: number;
  budget: 'Budget' | 'Moderate' | 'Premium';
  pace: 'Relaxed' | 'Balanced' | 'Active';
  interests: string[];
  startDate?: string;
  endDate?: string;
  totalEstimatedEGP: number;
  totalPaidEGP: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripItemEntity {
  id: string;
  tripId: string;
  serviceType: CommerceServiceType | 'activity' | 'food';
  skuId: string;
  title: string;
  dayNumber: number;
  timeSlot?: string;
  priceEGP: number;
  status: 'SUGGESTED' | 'HELD' | 'BOOKED' | 'CONFIRMED' | 'CANCELLED';
  bookingId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * A message a traveler sent to support, and the reply if one has been written.
 *
 * The Help panel used to be a pure simulation: it opened with a seeded
 * exchange in which a "Dahab Expert" named Kareem said the traveler's boat
 * booking was already being checked with the captain and would be confirmed
 * within five minutes. There was no endpoint, no queue and no agent — a
 * traveler with a real problem was being told work was under way that nobody
 * was doing. What they type is stored now, and the operations console can see
 * it and answer.
 */
export interface SupportMessageEntity {
  id: string;
  userId: string;
  travelerName: string;
  travelerPhone?: string;
  travelerEmail?: string;
  tripId?: string;
  /** The Help category the traveler chose, when they came through one. */
  category?: string;
  bookingRef?: string;
  message: string;
  urgent: boolean;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
  /** Written by Operations. Absent until someone actually replies. */
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type VerificationLevel =
  | 'SOURCE_REPORTED'
  | 'INSTAGRAM_REPORTED'
  | 'WEB_CONFIRMED'
  | 'SUPPLIER_CONFIRMED'
  | 'REGULATORY_VERIFIED'
  | 'FULLY_VERIFIED'
  | 'STALE'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'UNVERIFIED_REGULATORY_CLAIM';

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

export enum FreshnessStatus {
  FRESH = 'FRESH',
  RECENT = 'RECENT',
  AGING = 'AGING',
  STALE = 'STALE',
  EXPIRED = 'EXPIRED',
  UNKNOWN = 'UNKNOWN',
  CURRENT = 'CURRENT',
  CURRENT_LIKELY = 'CURRENT_LIKELY',
  OLD = 'OLD'
}

export type LocalCommerceSourceType =
  | 'OFFICIAL_REGULATORY'
  | 'SUPPLIER_OFFICIAL'
  | 'INSTAGRAM'
  | 'INSTAGRAM_POST'
  | 'TRUSTED_MARKETPLACE'
  | 'LOCAL_DIRECTORY'
  | 'COMMUNITY'
  | 'USER_PROVIDED_IMAGE'
  | 'INTERNAL_DATABASE'
  | 'REGULATORY'
  | 'SUPPLIER_OWNED'
  | 'COMMERCIAL_MARKETPLACE'
  | 'COMMERCIAL_FLYER'
  | 'MARKET_OBSERVATION'
  | 'AUTHORITATIVE';

export type SocialPlatform = 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'YOUTUBE' | 'WEBSITE' | 'LINKTREE' | 'WHATSAPP';
export type OwnershipStatus = 'OWNERSHIP_CONFIRMED' | 'LIKELY_OWNER' | 'POSSIBLE_MATCH' | 'UNRELATED';
export type InstagramAccountCategory =
  | 'BUSINESS'
  | 'TRAVEL_AGENCY'
  | 'DIVE_CENTER'
  | 'WATERSPORTS'
  | 'SAFARI_OPERATOR'
  | 'BOAT_OPERATOR'
  | 'HOTEL'
  | 'CAMP'
  | 'RESTAURANT'
  | 'GUIDE'
  | 'CREATOR'
  | 'PERSONAL'
  | 'UNKNOWN';

export interface SocialAccountEntity {
  id: string;
  platform: SocialPlatform;
  username: string;
  handle?: string;
  displayName?: string;
  profileUrl: string;
  supplierId?: string;
  ownershipStatus: OwnershipStatus;
  category: InstagramAccountCategory;
  bio?: string;
  locationMention?: string;
  contactPhone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  bookingLink?: string;
  services?: string[];
  followersCount?: number;
  postsCount?: number;
  lastPostDate?: string;
  recentActivitySignal?: string;
  isBusinessAccount: boolean;
  sourceReference: string;
  lastObservedAt: string;
  retrievedAt?: string;
  verificationStatus: VerificationLevel;
  active: boolean;
}

export interface SourceRecordEntity {
  id: string;
  sourceType: LocalCommerceSourceType;
  sourceUrl?: string;
  sourceReference: string;
  title?: string;
  sourceName?: string;
  capturedAt?: string;
  retrievedAt: string;
  supplierId?: string;
  offerId?: string;
  claim: string;
  confidence: number;
  verificationStatus: VerificationLevel;
  rawPayload?: any;
}

export interface PriceObservationEntity {
  id: string;
  offerId?: string;
  supplierId: string;
  activityId: string;
  amount?: number;
  priceEGP?: number;
  currency?: 'EGP' | 'USD' | 'EUR';
  pricingBasis: PricingBasis;
  sourcePriceText?: string;
  sourceType: LocalCommerceSourceType;
  sourceUrl?: string;
  sourceReference: string;
  sourceDate?: string;
  freshnessStatus: FreshnessStatus | 'CURRENT' | 'CURRENT_LIKELY' | 'FRESH' | 'RECENT' | 'AGING' | 'STALE' | 'EXPIRED' | 'UNKNOWN' | 'OLD' | string;
  freshnessScore?: number;
  verificationStatus?: VerificationLevel;
  observedAt: string;
  validFrom?: string;
  validUntil?: string;
}

export interface SupplierEntity {
  id: string;
  businessName: string;
  businessNameAr: string;
  displayName?: string;
  aliases?: string[];
  category: 'transfer' | 'diving' | 'hotel' | 'safari' | 'restaurant' | 'logistics' | 'bike_rental';
  businessType?: string;
  serviceTypes?: string[];
  tier: 'Tier 1 Certified' | 'Tier 2 Certified' | 'Vetted Local Partner';
  status: 'Active' | 'Pending_Verification' | 'Suspended';
  leadContact?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  phoneNumbers?: string[];
  whatsappNumbers?: string[];
  socialLinks?: string[];
  email?: string;
  area: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: { lat: number; lng: number };
  /**
   * Optional, because they are only sometimes known.
   *
   * All three were required, so every supplier record had to carry a licence
   * number and a rating whether or not anyone had one — and a required field
   * is a field that gets invented. The supplier portal renders "—" and
   * "No ratings collected yet" when these are absent; it used to fall back to
   * a flattering `|| 4.9` and `|| 100+ Verified Reviews`.
   */
  licenseNumber?: string;
  cdwsVerified?: boolean;
  rating?: number;
  reviewCount?: number;
  reviewsCount?: number;
  locationArea?: string;
  sourceProvenance?: string[];
  sourceType?: LocalCommerceSourceType;
  lastObservedDate?: string;
  dataFreshness?: FreshnessStatus;
  verificationStatus?: VerificationLevel;
  verificationSources?: string[];
  sourceReferences?: string[];
  onboardedAt?: string;
  approvedBy?: string;
  payoutAccountNumber?: string;
  fingerprint?: string;
  metadata?: Record<string, any>;
}

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
  basePriceEGP?: number;
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
  sourceReference?: string;
  sourceImage?: string;
  sourceCapturedAt?: string;
  verificationStatus: VerificationLevel;
  verificationSource?: string;
  verifiedAt?: string;
  sourceFreshness: FreshnessStatus | 'CURRENT' | 'CURRENT_LIKELY' | 'FRESH' | 'RECENT' | 'AGING' | 'STALE' | 'EXPIRED' | 'UNKNOWN' | 'OLD';
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
    freshnessStatus: FreshnessStatus | 'CURRENT' | 'CURRENT_LIKELY' | 'FRESH' | 'RECENT' | 'AGING' | 'STALE' | 'EXPIRED' | 'UNKNOWN' | 'OLD' | string;
  }>;
  label: 'OBSERVED_MARKET_DATA';
  lastCalculatedAt: string;
}

/**
 * The verticals the commerce engine can sell.
 *
 * 'wellness' and 'dining' were added when the Book Now catalogue's eight
 * in-destination services were given real inventory. Six of them fit the
 * original four; a massage and a seafront table did not, and mapping them onto
 * 'diving' or 'safari' would have filed them under the wrong supplier
 * category, the wrong ledger account and the wrong traveler-facing filter.
 */
export type CommerceServiceType =
  | 'transfer'
  | 'diving'
  | 'hotel'
  | 'safari'
  | 'wellness'
  | 'dining'
  | 'rental';

export interface ProductSkuEntity {
  id: string;
  supplierId: string;
  serviceType: CommerceServiceType;
  title: string;
  titleAr: string;
  description: string;
  routeFrom?: string;
  routeTo?: string;
  durationMinutes?: number;
  basePriceEGP: number;
  currency: 'EGP';
  maxCapacityPerSlot: number;
  active: boolean;
  includedItems?: string[];
  cancellationPolicyHours: number;
}

export interface InventorySlotEntity {
  id: string;
  skuId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  totalCapacity: number;
  reservedCapacity: number;
  heldCapacity: number;
  priceEGP: number;
  status: 'AVAILABLE' | 'ALMOST_FULL' | 'SOLD_OUT';
}

/**
 * A hotel in the Dahab hotels catalogue.
 *
 * Content is seeded from the committed data/dahab_hotels.json catalogue on
 * boot and upserted idempotently, so editorial copy stays in the seed and the
 * store only carries runtime state plus the resolved `skuId`. Bookability runs
 * through the standard commerce engine: each hotel owns one 5-night package
 * ProductSkuEntity (serviceType 'hotel'), and inventory slots are created on
 * demand by createHold with the 'Standard Check-in 14:00' time slot.
 */
export interface HotelEntity {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: 'budget' | 'mid-range' | 'boutique' | 'resort';
  priceBand: 'budget' | 'moderate' | 'premium';
  area: string;
  areaName: string;
  areaNameAr: string;
  rating: number;
  reviewCount: number;
  ratingSource?: string;
  typeChips: string[];
  typeChipsAr: string[];
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  amenities: string[];
  amenitiesAr: string[];
  perNightEGP: number;
  packageNights: number;
  rooms: number;
  bestFor: string;
  bestForAr: string;
  note: string;
  noteAr: string;
  /** [lat, lng] indicative position, used for area mapping, not navigation. */
  coordinates?: [number, number];
  /** The bookable 5-night package SKU this hotel resolves to. */
  skuId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Accommodations (generalized successor to HotelEntity — see hotelRoutes.ts
// for the compatibility shim that keeps /api/hotels serving from this table)
// ---------------------------------------------------------------------------

export type PropertyType =
  | 'hotel' | 'hostel' | 'apartment' | 'studio' | 'villa'
  | 'guesthouse' | 'camp' | 'eco-lodge' | 'boutique-hotel' | 'resort';

/**
 * A bookable place to stay in Dahab — the generalized successor to
 * HotelEntity. `propertyType` is the structural kind of place (hotel,
 * apartment, camp...); `category` is the pre-existing style tag
 * ('budget'|'mid-range'|'boutique'|'resort'), kept because the two axes are
 * genuinely orthogonal (a 'resort' propertyType can carry any category).
 *
 * Content is admin-curated and seeded from data/dahab_accommodations.json,
 * exactly like HotelEntity was. Bookability is unchanged: one
 * ProductSkuEntity per property (serviceType 'hotel'), packageNights
 * controls whether that SKU prices a multi-night package (hotels/resorts,
 * typically 5) or a single night (apartments/villas/camps typically 1).
 */
export interface AccommodationEntity {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  propertyType: PropertyType;
  category: 'budget' | 'mid-range' | 'boutique' | 'resort';
  priceBand: 'budget' | 'moderate' | 'premium';
  /** Canonical FK into area_profiles. Every property sits in a real neighborhood. */
  areaId: string;
  /** Legacy loose id/slug, kept for /api/hotels compatibility and old ?area= links. */
  area: string;
  areaName: string;
  areaNameAr: string;
  rating: number;
  reviewCount: number;
  ratingSource?: string;
  typeChips: string[];
  typeChipsAr: string[];
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  amenities: string[];
  amenitiesAr: string[];
  perNightEGP: number;
  packageNights: number;
  rooms: number;
  /** Max guests per booking unit — powers the guests filter and NL search. */
  maxGuests: number;
  bestFor: string;
  bestForAr: string;
  note: string;
  noteAr: string;
  latitude?: number;
  longitude?: number;
  /** The bookable package SKU this property resolves to. */
  skuId: string;
  active: boolean;
  /** Small admin curation lever — capped weight in ranking (see accommodationService). */
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PropertySourceType = 'WHATSAPP' | 'INSTAGRAM' | 'WEBSITE' | 'BOOKING_COM' | 'AIRBNB' | 'OTHER';

/**
 * A manually admin-entered external reference link for a property — "also
 * listed on Booking.com", a WhatsApp number, an Instagram handle, a website.
 * Purely informational display: no live price sync, no scraping, and the
 * frontend must never phrase this as a price comparison or a partnership.
 */
export interface PropertySourceEntity {
  id: string;
  accommodationId: string;
  sourceType: PropertySourceType;
  url: string;
  /** Display text override; required by the admin UI when sourceType = 'OTHER'. */
  label?: string;
  displayOrder: number;
  active: boolean;
  addedByUserId: string;
  createdAt: string;
  updatedAt: string;
}

/** Shared shape for structured filtering and NL-parsed search intent alike —
 *  there is exactly one path from "what the traveler wants" to a database
 *  query, whether it started as filter chips or free text. */
export interface AccommodationSearchFilters {
  q?: string;
  propertyTypes?: PropertyType[];
  categories?: Array<'budget' | 'mid-range' | 'boutique' | 'resort'>;
  priceBands?: Array<'budget' | 'moderate' | 'premium'>;
  areaIds?: string[];
  minRating?: number;
  maxPerNightEGP?: number;
  guests?: number;
  /** Hard filter — ALL of these must be present. */
  mustHaveAmenities?: string[];
  /** Soft — ranking boost only, never excludes. */
  niceToHaveAmenities?: string[];
  sort?: 'relevance' | 'rating' | 'price_asc' | 'price_desc';
}

// ---------------------------------------------------------------------------
// Rentals (bikes MVP, category-agnostic domain)
// ---------------------------------------------------------------------------

export type RentalCategory = 'bike' | 'e-bike';

export interface RentalDeliveryZoneConfig {
  zoneId: string;
  feeEGP: number;
}

/**
 * A rentable product line (bikes MVP; e-scooters, surfboards, kayaks, camping
 * gear later). Editorial content + pricing config live here; the sellable
 * inventory goes through the standard commerce engine via a serviceType
 * 'rental' ProductSkuEntity (basePriceEGP = dailyRateEGP, maxCapacityPerSlot =
 * quantity). Availability is quantity-per-day computed from rental_bookings,
 * so nothing here is book-state.
 */
export interface RentalListingEntity {
  id: string;
  slug: string;
  supplierId: string;
  /** The serviceType 'rental' ProductSkuEntity this listing sells through. */
  skuId: string;
  category: RentalCategory;
  subcategory: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  /** Category-specific attributes (gear, brakes, e-bike range...) in the data JSON. */
  specs: Record<string, string | number | boolean>;
  images: string[];
  /** Fleet size. The availability engine subtracts committed + blocked per day. */
  quantity: number;
  /** Daily anchor rate — powers "from X EGP/day" and the SKU's basePriceEGP. */
  dailyRateEGP: number;
  weeklyRateEGP?: number;
  multiDayMinDays?: number;
  multiDayDiscountPercent?: number;
  /** Refundable deposit; recorded at booking, settled manually at return in MVP. */
  depositEGP: number;
  pickupZoneId: string;
  deliveryZones: RentalDeliveryZoneConfig[];
  pickupMode: 'SHOP' | 'BOTH';
  rating?: number;
  reviewCount?: number;
  featured: boolean;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  active: boolean;
  cancellationPolicyHours: number;
  policies: { en: string; ar: string };
  createdAt: string;
  updatedAt: string;
}

export interface RentalExtraEntity {
  id: string;
  listingId: string;
  name: string;
  nameAr: string;
  priceEGP: number;
  /** FLAT = once per booking; PER_DAY = price x span days. */
  pricingBasis: 'FLAT' | 'PER_DAY';
  active: boolean;
}

export interface RentalMaintenanceBlockEntity {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  quantityBlocked: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export type RentalBookingStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'ACTIVE'
  | 'OVERDUE'
  | 'RETURNED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export interface RentalPriceBreakdown {
  days: number;
  dailyRateEGP: number;
  baseEGP: number;
  discountEGP: number;
  extrasEGP: number;
  deliveryEGP: number;
  depositEGP: number;
  totalEGP: number;
}

export interface RentalBookingExtraSnapshot {
  extraId: string;
  name: string;
  nameAr: string;
  priceEGP: number;
  count: number;
}

/**
 * The date-range rental lifecycle record. The bookings row (created at
 * checkout) is the financial/supplier-facing record; this row is the rental
 * domain's source of truth for dates, quantity, price snapshot and status.
 */
export interface RentalBookingEntity {
  id: string;
  /** The bookings row created at checkout; empty while PENDING_PAYMENT. */
  bookingRef: string;
  listingId: string;
  skuId: string;
  supplierId: string;
  tripId: string;
  userId: string;
  travelerName: string;
  travelerPhone: string;
  travelerEmail: string;
  /** YYYY-MM-DD, local Dahab calendar dates, inclusive both ends. */
  startDate: string;
  endDate: string;
  quantity: number;
  status: RentalBookingStatus;
  paymentState: PaymentState;
  holdToken?: string;
  idempotencyKey?: string;
  /** Server-computed at hold time; checkout prices from this snapshot. */
  priceBreakdown: RentalPriceBreakdown;
  deliveryMode: 'PICKUP' | 'DELIVERY';
  deliveryZoneId?: string;
  deliveryAddress?: string;
  pickupTime?: string;
  extras: RentalBookingExtraSnapshot[];
  depositStatus: 'RECORDED' | 'RETURNED' | 'DEDUCTED';
  depositDeductionEGP?: number;
  damageReport?: string;
  lateFeeEGP?: number;
  notes?: string;
  /** Hold expiry for PENDING_PAYMENT (15-min TTL). */
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HoldEntity {
  id: string;
  holdToken: string;
  skuId: string;
  slotId?: string;
  tripId: string;
  travelerId: string;
  serviceType: string;
  passengersCount: number;
  amountEGP: number;
  expiresAt: string; // ISO String (15 min TTL)
  status: 'ACTIVE' | 'CONVERTED' | 'EXPIRED' | 'RELEASED';
  idempotencyKey: string;
  createdAt: string;
}

export interface PaymentEntity {
  id: string;
  transactionId: string;
  idempotencyKey: string;
  holdToken?: string;
  tripId: string;
  bookingId?: string;
  amountEGP: number;
  currency: 'EGP' | 'USD' | 'EUR';
  provider: 'PAYMOB' | 'STRIPE' | 'CASH_ON_ARRIVAL';
  paymentMethodType: 'CARD' | 'WALLET' | 'CASH';
  state: PaymentState;
  authCode?: string;
  signatureHash: string;
  cardLast4?: string;
  cardBrand?: string;
  payerName?: string;
  payerEmail?: string;
  payerPhone?: string;
  /**
   * True when no payment gateway was contacted and settlement was simulated.
   * Reconciliation and reporting must exclude these from real revenue.
   */
  simulated?: boolean;
  webhookEvents: Array<{
    eventId: string;
    type: string;
    timestamp: string;
    verified: boolean;
    rawPayloadHash: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface BookingEntity {
  id: string;
  bookingRef: string;
  tripId: string;
  tripItemId?: string;
  supplierId: string;
  skuId: string;
  serviceType: CommerceServiceType;
  amountEGP: number;
  paymentState: PaymentState;
  supplierState: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'ASSIGNED' | 'DISPATCHED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'ARRIVED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED' | 'READY_FOR_PICKUP' | 'ACTIVE' | 'RETURNED';
  /** The rental_bookings row this booking fulfils, when the booking is a rental. */
  rentalBookingId?: string;
  travelerName: string;
  travelerPhone: string;
  travelerEmail: string;
  passengersCount: number;
  // Not every vertical has these: a hotel check-in or a dive-centre booking has
  // no pickup or drop-off. They were required, so multi-service checkout was
  // assigning `undefined` into fields the type promised were present.
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
}

export interface LedgerEntryEntity {
  id: string;
  transactionId: string;
  idempotencyKey: string;
  bookingRef: string;
  tripId: string;
  type: LedgerEntryType;
  amountEGP: number;
  debitAccount: string;
  creditAccount: string;
  currency: 'EGP';
  timestamp: string;
  status: 'SETTLED' | 'PENDING' | 'VOIDED';
  signatureHash: string;
  previousHash?: string;
  metadata?: Record<string, any>;
}

export interface TransferTelemetryEntity {
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
  flightStatus: 'SCHEDULED' | 'ON_TIME' | 'DELAYED' | 'LANDED';
  status: 'ASSIGNED' | 'DISPATCHED' | 'EN_ROUTE' | 'AT_AIRPORT' | 'PASSENGER_PICKED_UP' | 'ARRIVED' | 'COMPLETED';
  lastGpsUpdate: string;
  latitude?: number;
  longitude?: number;
  updatedAt: string;
}

export interface NotificationEntity {
  id: string;
  userId: string;
  type: 'BOOKING_CREATED' | 'PAYMENT_SUCCESS' | 'SUPPLIER_CONFIRMED' | 'DISPATCH_UPDATE' | 'EXCEPTION_ALERT' | 'SYSTEM' | 'RENTAL_STATUS_CHANGED';
  title: string;
  message: string;
  channel: 'IN_APP' | 'WHATSAPP' | 'SMS' | 'EMAIL';
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AuditEventEntity {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: Record<string, any>;
  timestamp: string;
  signature: string;
}

export interface PlaceDiscoveryEntity {
  id: string;
  googlePlaceId: string;
  canonicalName: string;
  canonicalNameAr?: string;
  zoneId: string;
  category: string;
  primaryType: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
  matchState: 'EXACT' | 'HIGH_CONFIDENCE' | 'REVIEW_REQUIRED' | 'DISTINCT_ENTITY' | 'DUPLICATE' | 'UNKNOWN';
  resolvedEntityId?: string;
  confidenceScore: number;
  operationalStatus: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'UNKNOWN';
  provenanceSource: 'GOOGLE_PLACES_API_NEW' | 'CDWS_REGISTRY' | 'LOCAL_FIELD_AUDIT';
  lastObservedAt: string;
  isSupplierCandidate: boolean;
  metadata?: Record<string, any>;
}

export interface EntityResolutionCandidateEntity {
  id: string;
  googlePlaceId: string;
  candidateName: string;
  candidateNameAr?: string;
  category: string;
  zoneId: string;
  latitude: number;
  longitude: number;
  existingEntityId?: string;
  matchConfidence: number;
  conflictReason?: string;
  status: 'PENDING_REVIEW' | 'APPROVED_PROMOTED' | 'REJECTED_DISMISSED' | 'MERGED';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface SpatialRouteCacheEntity {
  id: string;
  originZone: string;
  destinationZone: string;
  durationMinutes: number;
  distanceKm: number;
  transitMode: string;
  transitModeAr: string;
  isWalkable: boolean;
  confidence: number;
  expiresAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Dahab Knowledge Operating System (DKOS) Schema Entities
// ---------------------------------------------------------------------------

export interface ResearchSourceEntity {
  id: string;
  name: string;
  sourceType: 'AUTHORITATIVE' | 'APPROVED_OPERATIONAL' | 'VERIFIED_LOCAL' | 'GOOGLE_MAPS' | 'MARKETPLACE' | 'COMMUNITY' | 'INFERENCE';
  authorityWeight: number;
  publisher: string;
  documentRef?: string;
  url?: string;
  lastAudited: string;
  revalidationIntervalDays: number;
}

export interface TemporalFactEntity {
  id: string;
  subjectId: string;
  subjectType: string;
  predicate?: string;
  value?: any;
  factKey?: string;
  factValue?: any;
  factValueAr?: any;
  primarySourceId: string;
  sourceType: string;
  sourceCount?: number;
  observedAt?: string;
  verifiedAt?: string;
  firstObservedAt?: string;
  lastObservedAt?: string;
  validFrom: string;
  validUntil?: string;
  confidence: number;
  confidenceTier?: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';
  status: 'CURRENT' | 'HISTORICAL' | 'FUTURE' | 'SEASONAL' | 'EXPIRED' | 'UNKNOWN' | 'SUPERSEDED';
  supersedesFactId?: string;
  supersededByFactId?: string;
  verificationOwner?: string;
  notes?: string;
}

export interface EvidenceNodeEntity {
  id: string;
  factId: string;
  sourceId: string;
  claim: string;
  observedAt: string;
  verifiedAt: string;
  rawPayload?: any;
  confidence: number;
  authorityScore: number;
  independenceId: string;
  notes?: string;
}

export interface ConflictSetEntity {
  id: string;
  entityId: string;
  property: string;
  claimA: {
    value: any;
    sourceId: string;
    observedAt: string;
    authorityScore: number;
  };
  claimB: {
    value: any;
    sourceId: string;
    observedAt: string;
    authorityScore: number;
  };
  classification: 'BENIGN' | 'TEMPORAL' | 'SCOPE_DIFFERENCE' | 'TRUE_CONFLICT' | 'UNRESOLVED';
  explanation: string;
  resolvedValue?: any;
  resolvedAt?: string;
  resolvedBy?: string;
  status: 'OPEN' | 'RESOLVED' | 'AUTO_RECONCILED';
}

export interface AreaProfileEntity {
  id: string;
  nameEn: string;
  nameAr: string;
  coordinates: { lat: number; lng: number };
  radiusMeters: number;
  atmosphere: string;
  atmosphereAr: string;
  personaAffinity: string[];
  activityAffinity: string[];
  foodAffinity: string[];
  walkabilityScore: number;
  noiseProfile: 'Tranquil' | 'Moderate' | 'Lively' | 'Vibrant Nightlife';
  transportFriction: 'Low (Walking)' | 'Medium (Short Taxi)' | 'High (4x4 / Boat Only)';
  stayProfile: string;
  eveningProfile: string;
}

export interface PlaceEntity {
  id: string;
  nameEn: string;
  nameAr: string;
  aliases: string[];
  arabicNames: string[];
  transliterations: string[];
  areaId: string;
  category: string;
  coordinates: { lat: number; lng: number };
  googlePlaceId?: string;
  externalIds?: Record<string, string>;
  operationalStatus: 'OBSERVED' | 'CANDIDATE' | 'UNDER_REVIEW' | 'VERIFIED' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  supplierId?: string;
  descriptionEn: string;
  descriptionAr: string;
  verifiedAt: string;
}

export interface ActivityDetailEntity {
  id: string;
  skuId?: string;
  titleEn: string;
  titleAr: string;
  category: 'diving' | 'safari' | 'water_sport' | 'wellness' | 'culture' | 'food';
  placeId: string;
  areaId: string;
  durationMinutes: number;
  accessMethod: 'WALK' | 'SHORE' | 'BOAT' | 'VEHICLE' | '4X4' | 'CAMEL' | 'HIKE' | 'MIXED' | 'UNKNOWN';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  experienceLevelRequired: string;
  basePriceEGP: number;
  bookingMode: 'BOOK_NOW' | 'REQUEST_NOW' | 'DISCOVER_ONLY' | 'WALK_IN' | 'PLAN_LATER' | 'UNKNOWN';
  supplierId?: string;
  seasonalityMonths: number[];
  environmentalSensitivities: {
    maxWindKnots?: number;
    minVisibilityMeters?: number;
    requiresDaylight?: boolean;
  };
  dependencies: string[];
  preparationTips: string[];
  preparationTipsAr: string[];
  travelerFitPersonas: string[];
  recoveryAlternativeIds?: string[];
}

export interface DiningVenueEntity {
  id: string;
  nameEn: string;
  nameAr: string;
  areaId: string;
  coordinates: { lat: number; lng: number };
  cuisine: string[];
  priceBand: 'Budget ($)' | 'Moderate ($$)' | 'Premium ($$$)';
  averageMealPriceEGP: number;
  seatingStyle: 'Bedouin Carpet Waterfront' | 'Courtyard Garden' | 'Bistro' | 'Street Counter';
  dietaryOptions: {
    vegan: boolean;
    vegetarian: boolean;
    halal: boolean;
    freshSeafoodCatch: boolean;
  };
  wifiNomadFriendly: boolean;
  openingHours: string;
  bookingEligibility: 'BOOK_NOW' | 'REQUEST_NOW' | 'DISCOVER_ONLY' | 'WALK_IN' | 'PLAN_LATER' | 'UNKNOWN';
  supplierId?: string;
}

export interface EmergencyResourceEntity {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'Hyperbaric Chamber' | 'Hospital ER' | 'Urgent Clinic' | '24h Pharmacy' | 'Tourism Police' | 'Ambulance';
  address: string;
  coordinates: { lat: number; lng: number };
  hotlineNumbers: string[];
  authority: string;
  operatingHours: string;
  responseCapabilitiesEn: string;
  responseCapabilitiesAr: string;
  verifiedAt: string;
  revalidationDays: number;
}

export interface RegulatoryDecreeEntity {
  id: string;
  titleEn: string;
  titleAr: string;
  category: 'GENERAL_TRAVEL_KNOWLEDGE' | 'REGULATORY' | 'SAFETY_CRITICAL';
  authority: string;
  sourceDocRef: string;
  effectiveDate: string;
  summaryEn: string;
  summaryAr: string;
  enforcementAction: string;
  revalidationPolicy: string;
  verifiedAt: string;
}

export interface KnowledgeSnapshotEntity {
  versionId: string;
  createdAt: string;
  totalFacts: number;
  totalEntities: number;
  totalSources: number;
  qualityScoreOverall: number;
  openConflictsCount: number;
  staleFactsCount: number;
  fingerprintHash: string;
  factsSummary: Record<string, number>;
}

export interface DistributedLockEntity {
  id: string; // lockKey
  lockKey: string;
  leaseId: string;
  owner: string;
  acquiredAt: number;
  expiresAt: number;
  fencingToken: number;
  version: number;
}

// ---------------------------------------------------------------------------
// Dahab Live Market Intelligence, Change Events & Freshness Schema
// ---------------------------------------------------------------------------

export type PriceChangeType =
  | 'NEW_PRICE'
  | 'PRICE_INCREASE'
  | 'PRICE_DECREASE'
  | 'PRICE_UNCHANGED'
  | 'PRICE_REMOVED'
  | 'PRICE_EXPIRED'
  | 'PRICING_BASIS_CHANGED'
  | 'PRICE_ANOMALY'
  | 'SOURCE_PRICE_CONFLICT';

export type MarketEventType =
  | 'SUPPLIER_CHANGED'
  | 'NEW_SUPPLIER'
  | 'SUPPLIER_UPDATED'
  | 'SUPPLIER_CONTACT_CHANGED'
  | 'CONTACT_CHANGED'
  | 'INSTAGRAM_CHANGED'
  | 'INSTAGRAM_ACCOUNT_CHANGED'
  | 'OFFER_ADDED'
  | 'NEW_OFFER'
  | 'OFFER_CHANGED'
  | 'OFFER_UPDATED'
  | 'OFFER_REMOVED'
  | 'PRICE_CHANGED'
  | 'PRICE_INCREASE'
  | 'PRICE_DECREASE'
  | 'PRICE_UNCHANGED'
  | 'PRICE_EXPIRED'
  | 'PRICE_REMOVED'
  | 'PRICING_BASIS_CHANGED'
  | 'PRICE_ANOMALY'
  | 'SOURCE_PRICE_CONFLICT'
  | 'ACTIVITY_CHANGED'
  | 'ACTIVITY_ADDED'
  | 'ACTIVITY_REMOVED'
  | 'ACTIVITY_SIGNAL_CHANGED'
  | 'SOURCE_STALE'
  | 'SOURCE_BECAME_STALE'
  | 'SOURCE_REACTIVATED'
  | 'REGULATORY_STATUS_CHANGED'
  | 'REGULATORY_RECORD_REMOVED'
  | 'REGULATORY_RECORD_CHANGED'
  | 'POSSIBLE_DUPLICATE'
  | 'UNEXPECTED_SUPPLIER_REMOVAL';

export interface MarketChangeEventEntity {
  id: string;
  eventType: MarketEventType;
  entityType: 'SUPPLIER' | 'OFFER' | 'PRICE' | 'SOURCE' | 'REGULATORY' | 'SOCIAL_ACCOUNT';
  entityId: string;
  supplierId?: string;
  offerId?: string;
  activityId?: string;
  summaryEn: string;
  summaryAr: string;
  details: {
    oldValue?: any;
    newValue?: any;
    oldAmount?: number;
    newAmount?: number;
    delta?: number;
    percentage?: number;
    field?: string;
    oldPricingBasis?: PricingBasis;
    newPricingBasis?: PricingBasis;
    oldFreshness?: FreshnessStatus | string;
    newFreshness?: FreshnessStatus | string;
    sourceReference?: string;
    sourceType?: LocalCommerceSourceType;
    activitySignal?: string;
    competingObservations?: any[];
    anomalyReason?: string;
  };
  observedAt: string;
  detectedAt: string;
}

export interface MarketSnapshotEntity {
  id: string;
  timestamp: string;
  snapshotTimestamp?: string;
  source?: string;
  triggerSource?: string;
  supplierCount: number;
  offerCount: number;
  priceObservationCount: number;
  activeSources?: number;
  staleSources?: number;
  marketStatsCount?: number;
  changeCount?: number;
  freshnessScore?: number;
  verificationDistribution: Record<string, number>;
  marketStatistics?: MarketPriceStatEntity[];
  freshnessDistribution: Record<string, number>;
}

export interface SourceFreshnessEntity {
  id: string;
  sourceReference: string;
  sourceType: LocalCommerceSourceType;
  supplierId?: string;
  offerId?: string;
  supplierSourceFreshness: FreshnessStatus | string;
  offerSourceFreshness: FreshnessStatus | string;
  priceFreshness: FreshnessStatus | string;
  regulatoryFreshness: FreshnessStatus | string;
  lastObservedAt: string;
  lastAuditedAt: string;
  status: 'ACTIVE' | 'STALE' | 'EXPIRED' | 'DISCONTINUED';
}

export interface ContactHistoryEntity {
  id: string;
  supplierId: string;
  field: 'phone' | 'whatsapp' | 'email' | 'socialLinks' | 'leadContact';
  oldValue: string;
  newValue: string;
  source: string;
  observedAt: string;
  detectedAt: string;
}

export type RefreshInterval = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MANUAL' | 'ON_DEMAND';

export interface RefreshSchedulePolicyEntity {
  id: string;
  sourceId: string;
  sourceReference: string;
  sourceType: LocalCommerceSourceType;
  scheduleInterval: RefreshInterval;
  ingestionMode: 'LIVE_FETCH' | 'IMPORTED_SNAPSHOT' | 'MANUAL_REFRESH';
  enabled: boolean;
  requiresReview: boolean;
  maxRetries: number;
  initialBackoffMs: number;
  consecutiveFailures: number;
  lastScheduledRun?: string;
  nextScheduledRun?: string;
  lastCompletedRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketRefreshRunEntity {
  id: string;
  runId: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  sourceCount: number;
  supplierCount: number;
  offerCount: number;
  priceObservationCount: number;
  changesDetected: number;
  errors: string[];
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'CANCELLED';
  ingestionMode: 'LIVE_FETCH' | 'IMPORTED_SNAPSHOT' | 'MANUAL_REFRESH';
  sourceId?: string;
  sourceReference?: string;
  snapshotId?: string;
}

export type SupervisorActionType =
  | 'APPROVE'
  | 'REJECT'
  | 'DISMISS'
  | 'MARK_VERIFIED'
  | 'MARK_STALE'
  | 'SUSPEND_SOURCE'
  | 'REACTIVATE_SOURCE'
  | 'AUTO_RESOLVE';

export interface MarketReviewQueueEntity {
  id: string;
  issueType:
    | 'PRICE_ANOMALY'
    | 'SOURCE_PRICE_CONFLICT'
    | 'POSSIBLE_DUPLICATE'
    | 'CONTACT_CHANGE'
    | 'REGULATORY_CHANGE'
    | 'AMBIGUOUS_ACTIVITY'
    | 'UNEXPECTED_SUPPLIER_REMOVAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status:
    | 'PENDING_REVIEW'
    | 'APPROVED'
    | 'REJECTED'
    | 'DISMISSED'
    | 'MARKED_VERIFIED'
    | 'MARKED_STALE'
    | 'SOURCE_SUSPENDED'
    | 'SOURCE_REACTIVATED'
    | 'AUTO_RESOLVED';
  supplierId?: string;
  offerId?: string;
  activityId?: string;
  sourceReference?: string;
  summaryEn: string;
  summaryAr: string;
  evidence: Record<string, any>;
  detectedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  resolutionNotes?: string;
}

export interface SourceHealthEntity {
  id: string;
  sourceId?: string;
  sourceReference: string;
  sourceType: LocalCommerceSourceType;
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'FAILING' | 'STALE' | 'DISABLED';
  consecutiveFailures: number;
  lastAttempt?: string;
  lastSuccess?: string;
  lastFailure?: string;
  lastSuccessfulRefresh?: string;
  lastFailedRefresh?: string;
  lastError?: string;
  latencyMs?: number;
  recordsObserved?: number;
  changesDetected?: number;
  totalRuns: number;
  successfulRuns: number;
  updatedAt?: string;
}

export type MarketAlertType =
  | 'SOURCE_FAILURE'
  | 'SOURCE_STALE'
  | 'PRICE_ANOMALY'
  | 'REGULATORY_CHANGE'
  | 'IMPORT_FAILURE'
  | 'REFRESH_BACKLOG'
  | 'PRICE_DROP'
  | 'PRICE_INCREASE';

export interface MarketAlertEntity {
  id: string;
  alertType: MarketAlertType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  titleEn: string;
  titleAr: string;
  messageEn: string;
  messageAr: string;
  sourceReference?: string;
  supplierId?: string;
  activityId?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  metadata?: Record<string, any>;
}


