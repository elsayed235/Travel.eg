import { apiErrorFrom, readJson } from './apiError';
import type { CommerceServiceType, TripBookingRecord, ProductSkuEntity } from '../shared/types/commerce';
import type { DahabCuratedStory, DahabGalleryPhoto, DahabActivity, DahabAttraction, DahabDiningVenue, DahabPlace, AttractionCategory } from '../shared/types/knowledge';
import type { SupportMessage } from '../shared/types/user';
import type { TripEntity, TripItemEntity, TripItemWithSupplier } from '../shared/types/trip';
import type { TransferResolveGeoResponse } from '../shared/types/transfers';
import type { FitWindowResponse, PostActivityFoodResponse, RouteEstimate } from '../shared/types/context';
import type { GroundedIntelligenceQueryResponse, ProductOpportunity } from '../types/intelligence';
import type { Language } from '../i18n/translations';

// ---------------------------------------------------------------------------
// CMS public content — wire shapes served by the /api/content endpoints.
// The CMS hooks reshape these into view models; the shapes live here so api.ts
// is the single source of truth and the hooks never declare them a second time.
// ---------------------------------------------------------------------------

export interface CmsContentPage {
  id: string;
  slug: string;
  type: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
  body_en: string;
  body_ar: string;
  hero_image_url: string;
  hero_image_alt_en: string;
  hero_image_alt_ar: string;
  status: string;
  sort_order: number;
  featured: number;
}

export interface CmsHomepageSection {
  id: string;
  section_key: string;
  title_en: string;
  title_ar: string;
  visible: number;
  sort_order: number;
  config: Record<string, any>;
  updated_at: string;
}

export interface HomepageContent {
  hero: {
    title_en: string;
    title_ar: string;
    config: Record<string, any>;
  } | null;
  sections: CmsHomepageSection[];
  featuredPrograms: CmsContentPage[];
  featuredGallery: CmsContentPage[];
  featuredStories: CmsContentPage[];
}

export interface CmsPageBlockWire {
  id: string;
  type: string;
  sort_order: number;
  visible: number;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  config?: string | Record<string, any>;
}

export interface CmsPageWithBlocks {
  page: CmsContentPage | null;
  blocks: CmsPageBlockWire[];
}

export interface NavigationItemWire {
  id: string;
  menu_key: string;
  item_order: number;
  label_en: string;
  label_ar: string;
  route: string;
  external_url: string;
  visible: number;
  open_in_new: number;
  group_label_en: string;
  group_label_ar: string;
}

export interface ExploreCategoryWire {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
  hero_image_url: string;
  sort_order: number;
  config?: string | Record<string, any>;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

/**
 * Real contracts served by the /api/market/* and /api/events/* endpoints.
 * These mirror the server-side entities (server/db/schema.ts) so callers stop
 * guessing at `unknown[]` and casting malformed shapes onto local models.
 * See `refreshMarketIntelligence` / `getMarketSourceHealth` / `getMarketAlerts`.
 */
export interface MarketSchedulePolicy {
  id: string;
  sourceId: string;
  sourceReference: string;
  sourceType: string;
  scheduleInterval: string;
  ingestionMode: 'LIVE_FETCH' | 'IMPORTED_SNAPSHOT' | 'MANUAL_REFRESH';
  enabled: boolean;
  requiresReview: boolean;
  maxRetries: number;
  consecutiveFailures: number;
  lastScheduledRun?: string;
  nextScheduledRun?: string;
  lastCompletedRun?: string;
}

export type SourceHealthReadiness = 'HEALTHY' | 'DEGRADED' | 'FAILING' | 'STALE' | 'DISABLED';

export interface SourceHealth {
  id: string;
  sourceId?: string;
  sourceReference: string;
  sourceType: string;
  healthStatus: SourceHealthReadiness;
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

export interface MarketAlert {
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
}

export type MarketReviewStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISMISSED'
  | 'MARKED_VERIFIED'
  | 'MARKED_STALE'
  | 'SOURCE_SUSPENDED'
  | 'SOURCE_REACTIVATED'
  | 'AUTO_RESOLVED';

export interface MarketReviewItem {
  id: string;
  issueType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: MarketReviewStatus;
  detectedAt: string;
  summaryEn?: string;
  summaryAr?: string;
}

export interface MarketOpsOverview {
  totalSuppliers: number;
  totalOffers: number;
  totalPriceObservations: number;
  recentChangeEventsCount: number;
  pendingReviewCount: number;
  activeSourcesCount: number;
  freshnessScore: number;
  recentRuns: unknown[];
  recentEvents: unknown[];
  pendingReviews: MarketReviewItem[];
}

export interface BackgroundEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  actorId?: string;
  correlationId?: string;
  data: Record<string, any>;
}

/**
 * Default request timeout, chosen for spotty Sinai connectivity.
 *
 * Anything that waits on a language model needs more: /api/daygi/query was
 * measured at 10.35s against real Gemini and returned a correct answer at HTTP
 * 200, while this abort fired at 8s — so every AI request in the app was
 * cancelled 2.3 seconds before its answer arrived, and the user saw a canned
 * local reply instead. Those call sites pass AI_TIMEOUT_MS.
 */
export const DEFAULT_TIMEOUT_MS = 8000;
export const AI_TIMEOUT_MS = 30000;

/**
 * Robust network fetch with an AbortController timeout to handle spotty
 * Sinai / desert connectivity gracefully.
 * Automatically transmits HttpOnly SameSite session cookies via credentials: 'include'.
 */
export async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT_MS, signal: callerSignal, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // A caller's own signal (a component unmounting, a superseded request) is
  // composed with the timeout rather than replacing it, so cancelling on
  // unmount does not also remove the connectivity guard — and so a timeout
  // still fires for a caller that passed a signal it never aborts.
  const onCallerAbort = () => controller.abort();
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener('abort', onCallerAbort, { once: true });
  }

  try {
    const response = await fetch(resource, {
      credentials: 'include',
      ...fetchOptions,
      signal: controller.signal
    });
    return response;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      // Deliberate cancellation is not a network failure: rethrow it as an
      // AbortError so the caller can drop the result silently instead of
      // showing the traveler a connectivity message they did not cause.
      if (callerSignal?.aborted) throw error;
      throw new Error(
        `انتهت مهلة الاتصال بالشبكة (${Math.round(timeout / 1000)} ثانية). يرجى التحقق من جودة الاتصال في سيناء.`
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
    callerSignal?.removeEventListener('abort', onCallerAbort);
  }
}

const defaultHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json'
  };
};

export const api = {
  // 0. Traveler support
  //
  // The Help panel had no backend: a scripted "Dahab Expert" claimed to be
  // contacting the traveler's boat captain and whatever they typed went
  // nowhere.

  async sendSupportMessage(
    payload: {
      message: string;
      travelerName?: string;
      travelerPhone?: string;
      travelerEmail?: string;
      tripId?: string;
      category?: string;
      bookingRef?: string;
      urgent?: boolean;
    },
    signal?: AbortSignal
  ): Promise<{ message: SupportMessage }> {
    const res = await fetchWithTimeout('/api/support/messages', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(payload),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Your message could not be sent.');
    return await readJson<{ message: SupportMessage }>(res, 'Your message could not be sent.');
  },

  /** The traveler's own thread; Operations and Admin get the whole queue. */
  async getSupportMessages(signal?: AbortSignal): Promise<{ messages: SupportMessage[]; openCount: number }> {
    const res = await fetchWithTimeout('/api/support/messages', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load your support messages.');
    return await readJson<{ messages: SupportMessage[]; openCount: number }>(
      res,
      'Could not load your support messages.'
    );
  },

  // 0b. Editorial content
  //
  // Gallery photographs, curated stories and the ready-made programmes used to
  // be compiled into the components that rendered them, so a copy change meant
  // a rebuild and a deploy.

  async getCuratedStories(signal?: AbortSignal): Promise<{ stories: DahabCuratedStory[] }> {
    const res = await fetchWithTimeout('/api/dahab/content/stories', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load the Dahab stories.');
    return await readJson<{ stories: DahabCuratedStory[] }>(res, 'Could not load the Dahab stories.');
  },

  async getReadyProgrammes(signal?: AbortSignal): Promise<{ programmes: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/content/programmes', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load the ready-made trips.');
    return await readJson<{ programmes: unknown[] }>(res, 'Could not load the ready-made trips.');
  },

  // 0a. Destination knowledge
  //
  // /api/dahab/* is public, already populated (17 places, 22 activities, the
  // dining venues) and was called by nothing: Explore and Food each shipped
  // their own hardcoded copy of a handful of venues instead.

  async getDahabPlaces(signal?: AbortSignal): Promise<{ places: DahabPlace[] }> {
    const res = await fetchWithTimeout('/api/dahab/places', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load places in Dahab.');
    return await readJson<{ places: DahabPlace[] }>(res, 'Could not load places in Dahab.');
  },

  async getDahabActivities(signal?: AbortSignal): Promise<{ activities: DahabActivity[] }> {
    const res = await fetchWithTimeout('/api/dahab/activities', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load things to do in Dahab.');
    return await readJson<{ activities: DahabActivity[] }>(res, 'Could not load things to do in Dahab.');
  },

  async getDahabAttractions(
    filters?: {
      category?: string;
      q?: string;
      area?: string;
      sort?: 'top' | 'rating' | 'popular' | 'name' | 'price';
      order?: 'asc' | 'desc';
    },
    signal?: AbortSignal
  ): Promise<{ attractions: DahabAttraction[]; categories: AttractionCategory[]; count: number }> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.q) params.set('q', filters.q);
    if (filters?.area) params.set('area', filters.area);
    if (filters?.sort && filters.sort !== 'top') params.set('sort', filters.sort);
    if (filters?.order) params.set('order', filters.order);
    const qs = params.toString();
    const res = await fetchWithTimeout(`/api/dahab/attractions${qs ? `?${qs}` : ''}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load things to do in Dahab.');
    return await readJson<{ attractions: DahabAttraction[]; categories: AttractionCategory[]; count: number }>(
      res,
      'Could not load things to do in Dahab.'
    );
  },

  async getDahabDining(
    filters?: { area?: string; cuisine?: string[]; price?: string[]; q?: string; sort?: 'rating' | 'popular' | 'name' | 'price' | 'default'; order?: 'asc' | 'desc' },
    signal?: AbortSignal
  ): Promise<{ venues: DahabDiningVenue[] }> {
    const params = new URLSearchParams();
    if (filters?.area) params.set('area', filters.area);
    if (filters?.cuisine?.length) params.set('cuisine', filters.cuisine.join(','));
    if (filters?.price?.length) params.set('price', filters.price.join(','));
    if (filters?.q) params.set('q', filters.q);
    if (filters?.sort && filters.sort !== 'default') params.set('sort', filters.sort);
    if (filters?.order) params.set('order', filters.order);
    const qs = params.toString();
    const res = await fetchWithTimeout(`/api/dahab/food${qs ? `?${qs}` : ''}`, { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load places to eat in Dahab.');
    return await readJson<{ venues: DahabDiningVenue[] }>(res, 'Could not load places to eat in Dahab.');
  },

  async getEmergencyResources(signal?: AbortSignal): Promise<{ emergencyHotlines: Array<{ service: string; number: string }>; resources: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/emergency', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load emergency resources.');
    return await readJson<{ emergencyHotlines: Array<{ service: string; number: string }>; resources: unknown[] }>(res, 'Could not load emergency resources.');
  },

  async getRegulations(signal?: AbortSignal): Promise<{ regulations: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/regulations', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load regulations.');
    return await readJson<{ regulations: unknown[] }>(res, 'Could not load regulations.');
  },

  async getDahabAreas(signal?: AbortSignal): Promise<{ areas: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/areas', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load areas.');
    return await readJson<{ areas: unknown[] }>(res, 'Could not load areas.');
  },

  // ────────────────────────────────────────────────────────────────────────
  // Admin DKOS Endpoints (require Operations / Admin / Product role)
  // ────────────────────────────────────────────────────────────────────────

  async getAdminDkosHealth(signal?: AbortSignal): Promise<{ health: unknown }> {
    const res = await fetchWithTimeout('/api/dahab/admin/health', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load DKOS health.');
    return await readJson<{ health: unknown }>(res, 'Could not load DKOS health.');
  },

  async getAdminKnowledgeGaps(signal?: AbortSignal): Promise<{ gaps: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/admin/gaps', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load knowledge gaps.');
    return await readJson<{ gaps: unknown[] }>(res, 'Could not load knowledge gaps.');
  },

  async getAdminStaleFacts(signal?: AbortSignal): Promise<{ staleFacts: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/admin/stale-facts', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load stale facts.');
    return await readJson<{ staleFacts: unknown[] }>(res, 'Could not load stale facts.');
  },

  async getAdminConflicts(signal?: AbortSignal): Promise<{ conflicts: unknown[]; openCount: number }> {
    const res = await fetchWithTimeout('/api/dahab/admin/conflicts', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load conflicts.');
    return await readJson<{ conflicts: unknown[]; openCount: number }>(res, 'Could not load conflicts.');
  },

  async getAdminReviewQueue(signal?: AbortSignal): Promise<{ queue: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/admin/review-queue', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load review queue.');
    return await readJson<{ queue: unknown[] }>(res, 'Could not load review queue.');
  },

  async getAdminExpansionMetrics(signal?: AbortSignal): Promise<{ metrics: unknown }> {
    const res = await fetchWithTimeout('/api/dahab/admin/expansion-metrics', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load expansion metrics.');
    return await readJson<{ metrics: unknown }>(res, 'Could not load expansion metrics.');
  },

  // ────────────────────────────────────────────────────────────────────────
  // Trip Status Transitions
  // ────────────────────────────────────────────────────────────────────────

  async transitionTripStatus(tripId: string, status: string, signal?: AbortSignal): Promise<{ trip: unknown }> {
    const res = await fetchWithTimeout(`/api/trips/${encodeURIComponent(tripId)}/status`, {
      method: 'PATCH',
      headers: defaultHeaders(),
      body: JSON.stringify({ status }),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, `Cannot transition trip to ${status}.`);
    return await readJson<{ trip: unknown }>(res, `Cannot transition trip to ${status}.`);
  },

  // 0. Trips
  //
  // The backend has held real trips and trip items all along; no component
  // ever asked for them, so every page rendered a hardcoded itinerary instead.

  /**
   * Reads one trip and its items. Throws ApiError so a caller can tell a
   * missing session (401) from a trip that is not theirs or not there (404).
   */
  async getTrip(tripId: string, signal?: AbortSignal): Promise<{ trip: TripEntity; items: TripItemEntity[] }> {
    const res = await fetchWithTimeout(`/api/trips/${encodeURIComponent(tripId)}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load this trip.');
    return await readJson<{ trip: TripEntity; items: TripItemEntity[] }>(res, 'Could not load this trip.');
  },

  /**
   * The bookings behind a trip's items, each with the supplier it is with.
   * This is what the bookings view needs to show a real provider and
   * confirmation code instead of a hardcoded reference.
   */
  async getTripBookings(
    tripId: string,
    signal?: AbortSignal
  ): Promise<{ tripId: string; bookings: TripBookingRecord[]; items: TripItemWithSupplier[] }> {
    const res = await fetchWithTimeout(`/api/trips/${encodeURIComponent(tripId)}/bookings`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load the bookings for this trip.');
    return await readJson<{ tripId: string; bookings: TripBookingRecord[]; items: TripItemWithSupplier[] }>(
      res,
      'Could not load the bookings for this trip.'
    );
  },

  /**
   * Creates or updates a trip. The server takes the owner from the session and
   * refuses a userId that is not the caller's, so none is sent.
   */
  async saveTrip(
    trip: Partial<TripEntity> & { id: string },
    signal?: AbortSignal
  ): Promise<{ trip: TripEntity }> {
    const res = await fetchWithTimeout('/api/trips', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(trip),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not save this trip.');
    return await readJson<{ trip: TripEntity }>(res, 'Could not save this trip.');
  },

  /** Every trip belonging to a user. The server refuses ids that are not theirs. */
  async getTripsForUser(userId: string, signal?: AbortSignal): Promise<{ trips: TripEntity[] }> {
    const res = await fetchWithTimeout(`/api/trips/user/${encodeURIComponent(userId)}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load your trips.');
    return await readJson<{ trips: TripEntity[] }>(res, 'Could not load your trips.');
  },

  /**
   * Add a trip item to a trip (activity, booking, etc.).
   * P0 fix: Experience → Trip now persists to backend, not just client state.
   */
  async addTripItem(
    tripId: string,
    item: {
      title: string;
      dayNumber: number;
      timeSlot: string;
      serviceType?: string;
      skuId?: string;
      priceEGP?: number;
    },
    signal?: AbortSignal
  ): Promise<{ item: TripItemEntity; trip: TripEntity }> {
    const res = await fetchWithTimeout(`/api/trips/${encodeURIComponent(tripId)}/items`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(item),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not add item to trip.');
    return await readJson<{ item: TripItemEntity; trip: TripEntity }>(res, 'Could not add item to trip.');
  },

  /** Remove a trip item. Recalculates trip total on the backend. */
  async removeTripItem(
    tripId: string,
    itemId: string,
    signal?: AbortSignal
  ): Promise<{ removed: boolean; trip: TripEntity }> {
    const res = await fetchWithTimeout(`/api/trips/${encodeURIComponent(tripId)}/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not remove item from trip.');
    return await readJson<{ removed: boolean; trip: TripEntity }>(res, 'Could not remove item from trip.');
  },

  // 1. Auth & Session (HttpOnly SameSite Cookie Transport)
  async register(name: string, email: string, phone: string, password: string, role: string = 'Traveler') {
    const res = await fetchWithTimeout('/api/auth/register', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ name, email, phone, password, role })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    return await res.json();
  },

  async login(email: string, password: string) {
    const res = await fetchWithTimeout('/api/auth/login', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Invalid credentials' }));
      throw new Error(err.error || 'Invalid credentials');
    }
    return await res.json();
  },

  /**
   * Exchanges a Firebase ID token for a server session cookie.
   *
   * The token is the only thing sent: the server derives uid, email and role
   * itself. Passing an identity or a role from here would be meaningless — and
   * the fact that it used to be accepted was a full authentication bypass.
   */
  async syncFirebaseSession(idToken: string) {
    const res = await fetchWithTimeout('/api/auth/firebase-session', {
      method: 'POST',
      headers: { ...defaultHeaders(), Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({})
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Firebase session sync failed' }));
      throw new Error(err.error || 'Firebase session sync failed');
    }
    return await res.json();
  },

  async getMe() {
    const res = await fetchWithTimeout('/api/auth/me', { headers: defaultHeaders() });
    if (!res.ok) return null;
    return await res.json();
  },

  async logout() {
    try {
      await fetchWithTimeout('/api/auth/logout', {
        method: 'POST',
        headers: defaultHeaders()
      });
    } catch {
      // Graceful offline fallback
    }
  },

  // 2. Multi-Vertical Commerce & Inventory
  /**
   * The sellable products of one vertical.
   *
   * Book Now sold from IN_DESTINATION_SERVICES, a hardcoded array in the
   * frontend that Explore never showed — so the catalogue a traveler browsed
   * and the catalogue they could buy from had nothing in common. This is how
   * the checkout page reaches a product that came from somewhere else in the
   * app.
   */
  async getInventory(
    serviceType: string,
    signal?: AbortSignal
  ): Promise<{ serviceType: string; skus: ProductSkuEntity[] }> {
    const res = await fetchWithTimeout(`/api/inventory/${encodeURIComponent(serviceType)}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load what is available to book.');
    return await readJson<{ serviceType: string; skus: ProductSkuEntity[] }>(
      res,
      'Could not load what is available to book.'
    );
  },

  async getHotels(
    params?: { category?: string; priceBand?: string; area?: string },
    signal?: AbortSignal
  ): Promise<import('../shared/types/commerce').HotelCatalogueResponse> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.priceBand) query.set('priceBand', params.priceBand);
    if (params?.area) query.set('area', params.area);
    const res = await fetchWithTimeout(`/api/hotels${query.size ? `?${query.toString()}` : ''}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load Dahab hotels.');
    return await readJson<import('../shared/types/commerce').HotelCatalogueResponse>(
      res,
      'Could not load Dahab hotels.'
    );
  },

  async getHotelBySlug(
    slug: string,
    signal?: AbortSignal
  ): Promise<import('../shared/types/commerce').HotelDetailResponse> {
    const res = await fetchWithTimeout(`/api/hotels/${encodeURIComponent(slug)}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load that hotel.');
    return await readJson<import('../shared/types/commerce').HotelDetailResponse>(
      res,
      'Could not load that hotel.'
    );
  },

  async checkHotelAvailability(skuId: string, date: string, rooms = 1) {
    const res = await fetchWithTimeout('/api/commerce/availability', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ serviceType: 'hotel', skuId, date, timeSlot: 'Standard Check-in 14:00', passengers: rooms })
    });
    if (!res.ok) throw new Error('Failed to check hotel availability');
    return await res.json();
  },

  async getAccommodations(
    params?: {
      q?: string;
      propertyType?: string[];
      category?: string[];
      priceBand?: string[];
      areaId?: string[];
      guests?: number;
      maxPerNightEGP?: number;
      minRating?: number;
      mustHaveAmenities?: string[];
      sort?: string;
    },
    signal?: AbortSignal
  ): Promise<import('../shared/types/commerce').AccommodationCatalogueResponse> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.propertyType?.length) query.set('propertyType', params.propertyType.join(','));
    if (params?.category?.length) query.set('category', params.category.join(','));
    if (params?.priceBand?.length) query.set('priceBand', params.priceBand.join(','));
    if (params?.areaId?.length) query.set('areaId', params.areaId.join(','));
    if (params?.guests) query.set('guests', String(params.guests));
    if (params?.maxPerNightEGP) query.set('maxPerNightEGP', String(params.maxPerNightEGP));
    if (params?.minRating) query.set('minRating', String(params.minRating));
    if (params?.mustHaveAmenities?.length) query.set('mustHaveAmenities', params.mustHaveAmenities.join(','));
    if (params?.sort) query.set('sort', params.sort);
    const res = await fetchWithTimeout(`/api/accommodations${query.size ? `?${query.toString()}` : ''}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load Dahab accommodations.');
    return await readJson<import('../shared/types/commerce').AccommodationCatalogueResponse>(
      res,
      'Could not load Dahab accommodations.'
    );
  },

  async getAccommodationBySlug(
    slug: string,
    signal?: AbortSignal
  ): Promise<import('../shared/types/commerce').AccommodationDetailResponse> {
    const res = await fetchWithTimeout(`/api/accommodations/${encodeURIComponent(slug)}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load that stay.');
    return await readJson<import('../shared/types/commerce').AccommodationDetailResponse>(
      res,
      'Could not load that stay.'
    );
  },

  async parseAccommodationSearchIntent(
    query: string,
    language: 'en' | 'ar' = 'en'
  ): Promise<import('../shared/types/commerce').AccommodationSearchIntentResult> {
    const res = await fetchWithTimeout('/api/accommodations/search-intent', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ query, language })
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not understand that search.');
    return await readJson<import('../shared/types/commerce').AccommodationSearchIntentResult>(
      res,
      'Could not understand that search.'
    );
  },

  // ---------------------------------------------------------------------------
  // Rentals (bikes MVP — generic rental domain)
  // ---------------------------------------------------------------------------

  async getRentals(
    params?: {
      category?: string;
      subcategory?: string;
      zone?: string;
      q?: string;
      sort?: string;
      startDate?: string;
      endDate?: string;
      quantity?: number;
    },
    signal?: AbortSignal
  ): Promise<import('../shared/types/commerce').RentalCatalogueResponse> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.subcategory) query.set('subcategory', params.subcategory);
    if (params?.zone) query.set('zone', params.zone);
    if (params?.q) query.set('q', params.q);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.quantity) query.set('quantity', String(params.quantity));
    // No trailing slash: the API policy matches `/rentals` exactly, and
    // `/rentals/` falls through to deny-by-default.
    const res = await fetchWithTimeout(`/api/rentals${query.size ? `?${query.toString()}` : ''}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load Dahab rentals.');
    return await readJson<import('../shared/types/commerce').RentalCatalogueResponse>(
      res,
      'Could not load Dahab rentals.'
    );
  },

  async getRentalBySlug(
    slug: string,
    signal?: AbortSignal
  ): Promise<import('../shared/types/commerce').RentalDetailResponse> {
    const res = await fetchWithTimeout(`/api/rentals/${encodeURIComponent(slug)}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load that rental.');
    return await readJson<import('../shared/types/commerce').RentalDetailResponse>(
      res,
      'Could not load that rental.'
    );
  },

  async checkRentalAvailability(params: {
    listingId: string;
    startDate: string;
    endDate: string;
    quantity: number;
  }): Promise<import('../shared/types/commerce').RentalAvailabilityResult> {
    const res = await fetchWithTimeout('/api/rentals/check-availability', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Availability check failed.');
    return await readJson<import('../shared/types/commerce').RentalAvailabilityResult>(
      res,
      'Availability check failed.'
    );
  },

  async quoteRental(params: {
    listingId: string;
    startDate: string;
    endDate: string;
    quantity: number;
    extraIds?: string[];
    deliveryMode?: 'PICKUP' | 'DELIVERY';
    deliveryZoneId?: string;
  }): Promise<import('../shared/types/commerce').RentalQuoteResult> {
    const res = await fetchWithTimeout('/api/rentals/quote', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Quote failed.');
    return await readJson<import('../shared/types/commerce').RentalQuoteResult>(
      res,
      'Quote failed.'
    );
  },

  async createRentalBooking(params: {
    listingId: string;
    tripId: string;
    travelerPhone?: string;
    startDate: string;
    endDate: string;
    quantity: number;
    deliveryMode?: 'PICKUP' | 'DELIVERY';
    deliveryZoneId?: string;
    deliveryAddress?: string;
    pickupTime?: string;
    extraIds?: string[];
    notes?: string;
    idempotencyKey?: string;
  }): Promise<{ booking: import('../shared/types/commerce').RentalBookingView; replayed?: boolean }> {
    const res = await fetchWithTimeout('/api/rental-bookings', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not create the rental booking.');
    return await readJson<{ booking: import('../shared/types/commerce').RentalBookingView; replayed?: boolean }>(
      res,
      'Could not create the rental booking.'
    );
  },

  async checkoutRentalBooking(params: {
    rentalBookingId: string;
    tripId: string;
    travelerPhone?: string;
    idempotencyKey: string;
    provider?: 'PAYMOB' | 'STRIPE' | 'CASH_ON_ARRIVAL';
    cardLast4?: string;
    cardBrand?: string;
    cardHolderName?: string;
  }): Promise<{ success: boolean; bookingRef: string; totalAmountEGP: number; replayed?: boolean }> {
    const res = await fetchWithTimeout(`/api/rental-bookings/${encodeURIComponent(params.rentalBookingId)}/checkout`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Checkout failed.');
    return await readJson<{ success: boolean; bookingRef: string; totalAmountEGP: number; replayed?: boolean }>(
      res,
      'Checkout failed.'
    );
  },

  async cancelRentalBooking(
    bookingId: string,
    reason?: string
  ): Promise<{ booking: import('../shared/types/commerce').RentalBookingView }> {
    const res = await fetchWithTimeout(`/api/rental-bookings/${encodeURIComponent(bookingId)}/cancel`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not cancel the rental booking.');
    return await readJson<{ booking: import('../shared/types/commerce').RentalBookingView }>(
      res,
      'Could not cancel the rental booking.'
    );
  },

  async getMyRentalBookings(signal?: AbortSignal): Promise<{
    bookings: import('../shared/types/commerce').RentalBookingView[];
  }> {
    const res = await fetchWithTimeout('/api/rental-bookings', {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load your rental bookings.');
    return await readJson<{ bookings: import('../shared/types/commerce').RentalBookingView[] }>(
      res,
      'Could not load your rental bookings.'
    );
  },

  // -- provider surfaces ------------------------------------------------------

  async getProviderRentals(signal?: AbortSignal): Promise<{
    rentals: import('../shared/types/commerce').RentalListingView[];
  }> {
    const res = await fetchWithTimeout('/api/rentals/provider', {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load your rental listings.');
    return await readJson<{ rentals: import('../shared/types/commerce').RentalListingView[] }>(
      res,
      'Could not load your rental listings.'
    );
  },

  async getProviderRentalBookings(
    params?: { status?: string; from?: string; to?: string },
    signal?: AbortSignal
  ): Promise<{ bookings: import('../shared/types/commerce').RentalBookingView[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    const res = await fetchWithTimeout(`/api/rental-bookings/provider${query.size ? `?${query.toString()}` : ''}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load your rental bookings.');
    return await readJson<{ bookings: import('../shared/types/commerce').RentalBookingView[] }>(
      res,
      'Could not load your rental bookings.'
    );
  },

  async acceptRentalBooking(
    bookingId: string
  ): Promise<{ booking: import('../shared/types/commerce').RentalBookingView }> {
    const res = await fetchWithTimeout(`/api/rental-bookings/${encodeURIComponent(bookingId)}/accept`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({})
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not accept the rental booking.');
    return await readJson<{ booking: import('../shared/types/commerce').RentalBookingView }>(
      res,
      'Could not accept the rental booking.'
    );
  },

  async rejectRentalBooking(
    bookingId: string,
    reason?: string
  ): Promise<{ booking: import('../shared/types/commerce').RentalBookingView }> {
    const res = await fetchWithTimeout(`/api/rental-bookings/${encodeURIComponent(bookingId)}/reject`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not reject the rental booking.');
    return await readJson<{ booking: import('../shared/types/commerce').RentalBookingView }>(
      res,
      'Could not reject the rental booking.'
    );
  },

  async markRentalReturned(
    bookingId: string,
    opts: { damageReport?: string; depositDeductionEGP?: number; lateFeeEGP?: number } = {}
  ): Promise<{ booking: import('../shared/types/commerce').RentalBookingView }> {
    const res = await fetchWithTimeout(`/api/rental-bookings/${encodeURIComponent(bookingId)}/mark-returned`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(opts)
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not mark the rental returned.');
    return await readJson<{ booking: import('../shared/types/commerce').RentalBookingView }>(
      res,
      'Could not mark the rental returned.'
    );
  },

  async addRentalMaintenanceBlock(
    listingId: string,
    opts: { startDate: string; endDate: string; quantityBlocked: number; reason?: string }
  ): Promise<{ block: import('../shared/types/commerce').RentalMaintenanceBlock }> {
    const res = await fetchWithTimeout(`/api/rentals/${encodeURIComponent(listingId)}/maintenance-blocks`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(opts)
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not add the maintenance block.');
    return await readJson<{ block: import('../shared/types/commerce').RentalMaintenanceBlock }>(
      res,
      'Could not add the maintenance block.'
    );
  },

  async removeRentalMaintenanceBlock(listingId: string, blockId: string): Promise<{ removed: boolean }> {
    const res = await fetchWithTimeout(
      `/api/rentals/${encodeURIComponent(listingId)}/maintenance-blocks/${encodeURIComponent(blockId)}`,
      {
        method: 'DELETE',
        headers: defaultHeaders()
      }
    );
    if (!res.ok) throw await apiErrorFrom(res, 'Could not remove the maintenance block.');
    return await res.json();
  },

  async getTransferOrigins(transferType?: 'within_dahab' | 'anywhere', query?: string) {
    const params = new URLSearchParams();
    if (transferType) params.set('transferType', transferType);
    if (query) params.set('query', query);
    const res = await fetchWithTimeout(`/api/transfers/origins?${params.toString()}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to load transfer origins');
    return await res.json();
  },

  async getTransferRoute(originId: string, tierId?: 'private' | 'shared' | 'premium') {
    const params = new URLSearchParams({ origin: originId });
    if (tierId) params.set('tier', tierId);
    const res = await fetchWithTimeout(`/api/transfers/route?${params.toString()}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to quote transfer route');
    return await res.json();
  },

  async resolveTransferGeo(latitude: number, longitude: number): Promise<TransferResolveGeoResponse> {
    const res = await fetchWithTimeout(`/api/transfers/resolve-geo?lat=${latitude}&lng=${longitude}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to resolve location');
    return await res.json();
  },

  async prepareTransferBooking(params: {
    tripId: string;
    originId: string;
    tierId: 'private' | 'shared' | 'premium';
    date: string;
    timeSlot: string;
    passengersCount: number;
    idempotencyKey: string;
  }) {
    const res = await fetchWithTimeout('/api/transfers/prepare-booking', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to prepare transfer booking');
    }
    return await res.json();
  },

  async completeTransferBooking(params: {
    holdToken: string;
    tripId: string;
    travelerName: string;
    travelerPhone: string;
    travelerEmail: string;
    pickupLocation: string;
    dropoffLocation: string;
    flightNumber?: string;
    specialRequests?: string;
    scheduledDate: string;
    scheduledTime: string;
    idempotencyKey: string;
    cardLast4?: string;
    cardBrand?: string;
    cardHolderName?: string;
    provider?: 'PAYMOB' | 'STRIPE' | 'CASH_ON_ARRIVAL';
  }) {
    const res = await fetchWithTimeout('/api/commerce/checkout', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    }
    return await res.json();
  },

  async createHold(params: {
    skuId: string;
    tripId: string;
    travelerId: string;
    date: string;
    timeSlot: string;
    passengersCount: number;
    idempotencyKey?: string;
  }) {
    const res = await fetchWithTimeout('/api/commerce/hold', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create inventory hold');
    }
    return await res.json();
  },

  async completeMultiCheckout(params: {
    tripId: string;
    travelerName: string;
    travelerPhone: string;
    travelerEmail: string;
    items: Array<{
      serviceType: CommerceServiceType;
      skuId: string;
      holdToken?: string;
      scheduledDate: string;
      scheduledTime: string;
      amountEGP: number;
      pickupLocation?: string;
      dropoffLocation?: string;
      specialRequests?: string;
    }>;
    paymentParams: {
      idempotencyKey: string;
      provider?: 'PAYMOB' | 'STRIPE' | 'CASH_ON_ARRIVAL';
      /**
       * Last four digits only. Never send a full card number, expiry or CVV:
       * doing so puts this API and everything behind it in PCI-DSS scope. A
       * real integration collects card data in a hosted gateway field and
       * sends a token instead.
       */
      cardLast4?: string;
      cardBrand?: string;
      cardHolderName?: string;
    };
  }) {
    const res = await fetchWithTimeout('/api/commerce/checkout/multi', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Multi-service checkout failed');
    }
    return await res.json();
  },

  async processRefund(params: {
    bookingId?: string;
    tripId: string;
    amountEGP: number;
    reason: string;
    idempotencyKey: string;
    initiatedBy?: string;
  }) {
    const res = await fetchWithTimeout('/api/commerce/refund', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Refund failed');
    }
    return await res.json();
  },

  async completeCheckout(params: {
    holdToken?: string;
    tripId: string;
    travelerName?: string;
    travelerPhone?: string;
    travelerEmail?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    flightNumber?: string;
    specialRequests?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    idempotencyKey: string;
    /** Last four digits only. See the note on completeMultiCheckout. */
    cardLast4?: string;
    cardBrand?: string;
    cardHolderName?: string;
    provider?: string;
    amountEGP?: number;
    serviceType?: string;
    supplierId?: string;
  }) {
    const res = await fetchWithTimeout('/api/commerce/checkout', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment checkout settlement failed');
    }
    return await res.json();
  },

  async getLedger() {
    const res = await fetchWithTimeout('/api/commerce/ledger', { headers: defaultHeaders() });
    return await res.json();
  },

  async verifyLedger() {
    const res = await fetchWithTimeout('/api/commerce/ledger/verify', { headers: defaultHeaders() });
    return await res.json();
  },

  // 4. Suppliers & Operations
  async getSuppliers() {
    const res = await fetchWithTimeout('/api/suppliers', { headers: defaultHeaders() });
    return await res.json();
  },

  async getSupplierDashboard(supplierId: string) {
    const res = await fetchWithTimeout(`/api/suppliers/${supplierId}/dashboard`, { headers: defaultHeaders() });
    if (!res.ok) throw new Error('Failed to fetch supplier dashboard');
    return await res.json();
  },

  async respondSupplierBooking(bookingId: string, params: {
    supplierId: string;
    action: 'ACCEPT' | 'REJECT' | 'DISPATCH' | 'COMPLETE';
    assignedResource?: any;
    reason?: string;
  }) {
    const res = await fetchWithTimeout(`/api/suppliers/bookings/${bookingId}/respond`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update booking');
    }
    return await res.json();
  },

  async getSupplierBookings(supplierId: string) {
    const res = await fetchWithTimeout(`/api/suppliers/${supplierId}/bookings`, { headers: defaultHeaders() });
    return await res.json();
  },

  async getOperationsOverview() {
    const res = await fetchWithTimeout('/api/operations/overview', { headers: defaultHeaders() });
    return await res.json();
  },

  async getHealthData() {
    const res = await fetchWithTimeout('/api/health', { headers: defaultHeaders() });
    return await res.json();
  },

  /** Liveness ping for the app boot path. Resolves `null` when the server
   *  answers without health data (r.ok false); rejects on a network failure so
   *  the caller's catch can reset the federated-sign-in flag. */
  async pingHealth(): Promise<{ firebaseAdminConfigured?: boolean; paymentsSimulated?: boolean } | null> {
    const res = await fetchWithTimeout('/api/health', { headers: defaultHeaders() });
    if (!res.ok) return null;
    return await readJson<{ firebaseAdminConfigured?: boolean; paymentsSimulated?: boolean }>(res, 'health');
  },

  async askIntelligence(
    payload: { query: string; language: Language },
    signal?: AbortSignal
  ): Promise<GroundedIntelligenceQueryResponse> {
    const res = await fetchWithTimeout('/api/intelligence/ask', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(payload),
      signal
    });
    if (!res.ok) throw new Error('API query failed');
    return await readJson<GroundedIntelligenceQueryResponse>(res, 'API query failed');
  },

  async draftOpportunity(
    payload: { signalIds: string[]; contextNotes: string }
  ): Promise<{ opportunity?: ProductOpportunity } | null> {
    const res = await fetchWithTimeout('/api/intelligence/draft-opportunity', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) return null;
    return await readJson<{ opportunity?: ProductOpportunity }>(res, '');
  },

  async listAdminContentMedia(signal?: AbortSignal): Promise<{ media?: any[] }> {
    const res = await fetchWithTimeout('/api/admin/content/media', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? 'Not authorized to view media' : 'Failed to load media');
    return await readJson<{ media?: any[] }>(res, 'Could not load media.');
  },

  // ---------------------------------------------------------------------------
  // CMS public content (GET, read-only). The wire shapes below are the single
  // source of truth; src/hooks/useCMSContent reshapes them into view models.
  // ---------------------------------------------------------------------------

  async getCmsHomepage(signal?: AbortSignal): Promise<HomepageContent> {
    const res = await fetchWithTimeout('/api/content/homepage', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS homepage unavailable');
    return await readJson<HomepageContent>(res, 'CMS homepage');
  },

  async getCmsGallery(signal?: AbortSignal): Promise<{ photos?: CmsContentPage[] }> {
    const res = await fetchWithTimeout('/api/content/gallery', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS gallery unavailable');
    return await readJson<{ photos?: CmsContentPage[] }>(res, 'CMS gallery');
  },

  async getCmsProgrammes(signal?: AbortSignal): Promise<{ programmes?: CmsContentPage[] }> {
    const res = await fetchWithTimeout('/api/content/programmes', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS programmes unavailable');
    return await readJson<{ programmes?: CmsContentPage[] }>(res, 'CMS programmes');
  },

  async getCmsStories(signal?: AbortSignal): Promise<{ stories?: CmsContentPage[] }> {
    const res = await fetchWithTimeout('/api/content/stories', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS stories unavailable');
    return await readJson<{ stories?: CmsContentPage[] }>(res, 'CMS stories');
  },

  async getCmsPage(slug: string, signal?: AbortSignal): Promise<CmsPageWithBlocks> {
    const res = await fetchWithTimeout(`/api/content/pages/${slug}`, { headers: defaultHeaders(), signal });
    if (!res.ok) return { page: null, blocks: [] };
    return await readJson<CmsPageWithBlocks>(res, 'CMS page');
  },

  async getCmsNavigation(menuKey: string, signal?: AbortSignal): Promise<{ items?: NavigationItemWire[] }> {
    const res = await fetchWithTimeout(`/api/content/navigation/${menuKey}`, { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS navigation unavailable');
    return await readJson<{ items?: NavigationItemWire[] }>(res, 'CMS navigation');
  },

  async getCmsExploreCategories(signal?: AbortSignal): Promise<{ categories?: ExploreCategoryWire[] }> {
    const res = await fetchWithTimeout('/api/content/explore-categories', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS explore categories unavailable');
    return await readJson<{ categories?: ExploreCategoryWire[] }>(res, 'CMS explore categories');
  },

  async getCmsHowItWorks(signal?: AbortSignal): Promise<{ blocks?: CmsPageBlockWire[] }> {
    const res = await fetchWithTimeout('/api/content/pages/how-it-works?include_blocks=true', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS how-it-works unavailable');
    return await readJson<{ blocks?: CmsPageBlockWire[] }>(res, 'CMS how-it-works');
  },

  async getCmsTripPreview(signal?: AbortSignal): Promise<{ blocks?: CmsPageBlockWire[] }> {
    const res = await fetchWithTimeout('/api/content/pages/trip-preview?include_blocks=true', { headers: defaultHeaders(), signal });
    if (!res.ok) throw new Error('CMS trip-preview unavailable');
    return await readJson<{ blocks?: CmsPageBlockWire[] }>(res, 'CMS trip-preview');
  },

  async getAuditEvents(limit = 50) {
    const res = await fetchWithTimeout(`/api/operations/audit-events?limit=${limit}`, { headers: defaultHeaders() });
    return await res.json();
  },

  async acknowledgeMarketAlert(alertId: string, acknowledgedBy?: string) {
    const res = await fetchWithTimeout(`/api/market/alerts/${encodeURIComponent(alertId)}/acknowledge`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ acknowledgedBy: acknowledgedBy || 'Operations' })
    });
    if (!res.ok) throw new Error('Failed to acknowledge alert');
    return await res.json();
  },

  async getRecentEvents(limit = 20): Promise<{ events: BackgroundEvent[] }> {
    const res = await fetchWithTimeout(`/api/events/recent?limit=${limit}`, { headers: defaultHeaders() });
    return await readJson<{ events: BackgroundEvent[] }>(res, 'Could not load recent events.');
  },

  async replyToSupportMessage(messageId: string, reply: string) {
    const res = await fetchWithTimeout(`/api/support/messages/${encodeURIComponent(messageId)}/reply`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ reply })
    });
    if (!res.ok) throw new Error('Failed to send reply');
    return await res.json();
  },

  async getMarketStatus() {
    const res = await fetchWithTimeout('/api/market/status', { headers: defaultHeaders() });
    return await res.json();
  },

  async getFitWindowOptions(
    params?: { originArea?: string; availableMinutes?: number; category?: string },
    signal?: AbortSignal
  ): Promise<FitWindowResponse> {
    const res = await fetchWithTimeout('/api/context/fit-window', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params || { originArea: 'lighthouse', availableMinutes: 120 }),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load what fits your available time right now.');
    return await readJson<FitWindowResponse>(res, 'Could not load what fits your available time right now.');
  },

  async getPostActivityFood(locationId: string = 'place-lighthouse', limit: number = 3, signal?: AbortSignal): Promise<PostActivityFoodResponse> {
    const res = await fetchWithTimeout(`/api/context/post-activity-food?locationId=${encodeURIComponent(locationId)}&limit=${limit}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load places to eat nearby.');
    return await readJson<PostActivityFoodResponse>(res, 'Could not load places to eat nearby.');
  },

  async getTravelEstimate(origin: string, destination: string, signal?: AbortSignal): Promise<RouteEstimate> {
    const res = await fetchWithTimeout(`/api/context/travel-time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`, {
      headers: defaultHeaders(),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load travel time.');
    return await readJson<RouteEstimate>(res, 'Could not load travel time.');
  },

  async getBackgroundJobsStatus() {
    const res = await fetchWithTimeout('/api/jobs/status', { headers: defaultHeaders() });
    return await res.json();
  },

  async getWeatherTelemetry() {
    try {
      const res = await fetchWithTimeout('/api/telemetry/weather', { headers: defaultHeaders() });
      if (!res.ok) throw new Error('Weather fetch failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getResearchOverview() {
    try {
      const res = await fetchWithTimeout('/api/research/dahab-overview', { headers: defaultHeaders() });
      if (!res.ok) throw new Error('Research overview fetch failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getCameraFeeds() {
    try {
      const res = await fetchWithTimeout('/api/telemetry/cameras', { headers: defaultHeaders() });
      if (!res.ok) throw new Error('Camera fetch failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async generateAiTrip(params: {
    durationDays?: number;
    adultsCount?: number;
    childrenCount?: number;
    dynamic?: string;
    budget?: string;
    interests?: string[];
    pace?: string;
    language?: string;
  }) {
    const res = await fetchWithTimeout('/api/trip/generate', {
      timeout: AI_TIMEOUT_MS,
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to generate AI trip');
    return await res.json();
  },

  /**
   * POST /api/trip/apply-ai
   * Persists a generated "Plan with AI" itinerary as the signed-in traveler's
   * trip. Requires a session; identity is taken from it server-side.
   */
  async applyAiItinerary(
    payload: {
      itinerary: {
        tripTitle?: string;
        days: Array<{
          dayNumber?: number;
          activities: Array<{
            title: string;
            timeSlot?: string;
            estimatedPriceEGP?: number;
            category?: string;
            location?: string;
            description?: string;
          }>;
        }>;
      };
      lengthDays?: number;
      travelersCount?: number;
      budget?: 'Budget' | 'Moderate' | 'Premium';
      pace?: 'Relaxed' | 'Balanced' | 'Active';
      interests?: string[];
    },
    signal?: AbortSignal
  ): Promise<{ trip: { id: string } }> {
    const res = await fetchWithTimeout('/api/trip/apply-ai', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(payload),
      signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not save your AI plan.');
    return await readJson<{ trip: { id: string } }>(res, 'Could not save your AI plan.');
  },

  async queryDayGi(context: {
    prompt: string;
    language?: 'en' | 'ar';
    currentLocation?: string;
    availableMinutes?: number;
    currentDayNumber?: number;
    userPace?: 'Relaxed' | 'Balanced' | 'Active';
    userBudget?: 'Budget' | 'Moderate' | 'Premium';
    interests?: string[];
    activeBookingsCount?: number;
    activeTripTitle?: string;
  }) {
    const res = await fetchWithTimeout('/api/daygi/query', {
      timeout: AI_TIMEOUT_MS,
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(context)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'DayGI service temporarily unavailable' }));
      throw new Error(err.error || 'DayGI query failed');
    }
    return await res.json();
  },

  async executeDayGiAction(params: {
    actionKey: string;
    payload?: Record<string, any>;
  }) {
    const res = await fetchWithTimeout('/api/daygi/action/execute', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'DayGI action execution failed' }));
      throw new Error(err.error || 'DayGI action failed');
    }
    return await res.json();
  },

  async trackDayGiEvent(eventType: string, payload: Record<string, any>) {
    try {
      await fetchWithTimeout('/api/analytics/daygi', {
        method: 'POST',
        headers: defaultHeaders(),
        body: JSON.stringify({ eventType, payload, timestamp: new Date().toISOString() })
      });
    } catch (e) {
      // Non-blocking analytics
      console.debug('DayGI telemetry event logged locally:', eventType, payload);
    }
  },

  /**
   * DayGI identity note: none of these methods take a userId any more.
   *
   * The caller is identified by the session cookie and the server resolves the
   * user itself. Previously the client passed `profile.id || 'USR-AHMED-01'` —
   * and `TravelerProfile` has no `id` field, so every request for every user
   * was made as the demo user 'USR-AHMED-01'. All travelers shared one DayGI
   * memory record, one task list and one telemetry stream.
   */
  async getDayGiProactive(tripId: string) {
    const res = await fetchWithTimeout(`/api/daygi/proactive?tripId=${encodeURIComponent(tripId)}`, {
      timeout: AI_TIMEOUT_MS,
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch proactive intelligence');
    return await res.json();
  },

  async getDayGiTripHealth(tripId: string) {
    const res = await fetchWithTimeout(`/api/daygi/health/${encodeURIComponent(tripId)}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch trip health');
    return await res.json();
  },

  async getDayGiMemory() {
    // 'me' is a placeholder segment; the server resolves the caller's own id.
    const res = await fetchWithTimeout('/api/daygi/memory/me', {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch structured memory');
    return await res.json();
  },

  async updateDayGiMemory(preferences: Record<string, unknown>) {
    const res = await fetchWithTimeout('/api/daygi/memory/me', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(preferences)
    });
    if (!res.ok) throw new Error('Failed to update structured memory');
    return await res.json();
  },

  // DayGI 4.0 Task Orchestration Client Methods
  async getDayGiTasks(tripId: string) {
    const res = await fetchWithTimeout(`/api/daygi/tasks?tripId=${encodeURIComponent(tripId)}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orchestrated tasks');
    return await res.json();
  },

  async executeDayGiTaskStep(taskId: string, stepId: string, actionToken: string) {
    const res = await fetchWithTimeout(`/api/daygi/tasks/${encodeURIComponent(taskId)}/execute-step`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ stepId, actionToken })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Task step execution failed' }));
      throw new Error(err.error || 'Step execution failed');
    }
    return await res.json();
  },

  async applyDayGiTaskRecovery(taskId: string, recoveryOptionId: string) {
    const res = await fetchWithTimeout(`/api/daygi/tasks/${encodeURIComponent(taskId)}/apply-recovery`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ recoveryOptionId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Recovery execution failed' }));
      throw new Error(err.error || 'Recovery failed');
    }
    return await res.json();
  },

  async cancelDayGiTask(taskId: string, reason?: string) {
    const res = await fetchWithTimeout(`/api/daygi/tasks/${encodeURIComponent(taskId)}/cancel`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to cancel orchestrated task');
    return await res.json();
  },

  async trackDayGiFunnel(event: {
    sessionId: string;
    tripId: string;
    step: string;
    intentKey?: string;
    language: 'ar' | 'en';
    actionType?: string;
    cardType?: string;
    latencyMs?: number;
    confidenceScore?: number;
    whyThisInteracted?: boolean;
    metadata?: Record<string, any>;
  }) {
    const res = await fetchWithTimeout('/api/daygi/beta/track-funnel', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(event)
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async submitDayGiBetaFeedback(feedback: {
    messageId: string;
    tripId: string;
    rating: 'HELPFUL' | 'NOT_HELPFUL';
    reasonTag?: string;
    feedbackNotes?: string;
    intentKey: string;
    language: 'ar' | 'en';
  }) {
    const res = await fetchWithTimeout('/api/daygi/beta/feedback', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(feedback)
    });
    if (!res.ok) throw new Error('Failed to record feedback');
    return await res.json();
  },

  async getDayGiBetaExperiments() {
    const res = await fetchWithTimeout('/api/daygi/beta/experiments', {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch experiment flags');
    return await res.json();
  },

  async updateDayGiBetaExperiments(flags: any) {
    const res = await fetchWithTimeout('/api/daygi/beta/experiments', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(flags)
    });
    if (!res.ok) throw new Error('Failed to update experiment flags');
    return await res.json();
  },

  async refreshMarketIntelligence() {
    const res = await fetchWithTimeout('/api/market/refresh', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ ingestionMode: 'MANUAL_REFRESH', triggerSource: 'ops-console' })
    });
    if (!res.ok) throw new Error('Market refresh failed');
    return await res.json();
  },

  async getMarketJobs(signal?: AbortSignal): Promise<{ policies: MarketSchedulePolicy[] }> {
    const res = await fetchWithTimeout('/api/market/jobs', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market jobs.');
    return await readJson<{ policies: MarketSchedulePolicy[] }>(res, 'Could not load market jobs.');
  },

  async triggerMarketJob(payload: { sourceId: string }, signal?: AbortSignal): Promise<unknown> {
    const res = await fetchWithTimeout('/api/market/jobs/trigger', {
      method: 'POST', headers: defaultHeaders(), body: JSON.stringify(payload), signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Failed to trigger market job.');
    return await res.json();
  },

  async getMarketSourceHealth(signal?: AbortSignal): Promise<{ health: SourceHealth[] }> {
    const res = await fetchWithTimeout('/api/market/sources/health', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load source health.');
    return await readJson<{ health: SourceHealth[] }>(res, 'Could not load source health.');
  },

  async getMarketReviewQueue(signal?: AbortSignal): Promise<{ items: MarketReviewItem[] }> {
    const res = await fetchWithTimeout('/api/market/review-queue', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load review queue.');
    return await readJson<{ items: MarketReviewItem[] }>(res, 'Could not load review queue.');
  },

  async getMarketOpsOverview(signal?: AbortSignal): Promise<{ overview: MarketOpsOverview }> {
    const res = await fetchWithTimeout('/api/market/ops/overview', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load ops overview.');
    return await readJson<{ overview: MarketOpsOverview }>(res, 'Could not load ops overview.');
  },

  async getMarketAlerts(signal?: AbortSignal): Promise<{ alerts: MarketAlert[] }> {
    const res = await fetchWithTimeout('/api/market/alerts', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market alerts.');
    return await readJson<{ alerts: MarketAlert[] }>(res, 'Could not load market alerts.');
  },  async getMarketStats(signal?: AbortSignal): Promise<{ stats: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/commerce/market-stats', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market stats.');

    return await readJson<{ stats: unknown[] }>(res, 'Could not load market stats.');
  },

  async getCommerceSuppliers(signal?: AbortSignal): Promise<{ suppliers: import('../shared/types/commerce').SupplierEntity[] }> {
    const res = await fetchWithTimeout('/api/dahab/commerce/suppliers', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load suppliers in Dahab.');
    return await readJson<{ suppliers: import('../shared/types/commerce').SupplierEntity[] }>(res, 'Could not load suppliers in Dahab.');
  },

  async getMarketPriceHistory() {
    const res = await fetchWithTimeout('/api/market/price-history', { headers: defaultHeaders() });
    return await res.json();
  },

  async getSmsLogs(limit: number = 30) {
    const res = await fetchWithTimeout(`/api/sms/logs?limit=${limit}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) return { count: 0, logs: [] };
    return await res.json();
  },

  async getOperationsPayments() {
    const res = await fetchWithTimeout('/api/operations/payments', { headers: defaultHeaders() });
    return await res.json();
  },

  async getOperationsTransfers() {
    const res = await fetchWithTimeout('/api/operations/transfers', { headers: defaultHeaders() });
    return await res.json();
  },

  async getSupplierReliability() {
    const res = await fetchWithTimeout('/api/operations/supplier-reliability', { headers: defaultHeaders() });
    return await res.json();
  },

  async processOpsRefund(params: { bookingRef: string; amountEGP: number; reason: string; operatorId?: string }) {
    const res = await fetchWithTimeout('/api/operations/refund', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to process refund');
    return await res.json();
  },

  async getOperationsNotifications() {
    const res = await fetchWithTimeout('/api/operations/notifications', { headers: defaultHeaders() });
    return await res.json();
  },

  async sendOpsSmsDispatch(params: { to: string; recipientName: string; recipientRole?: string; message: string; bookingRef?: string; channel?: string }) {
    const res = await fetchWithTimeout('/api/operations/sms-dispatch', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to send SMS');
    return await res.json();
  },

  async actOnOpportunity(id: string, action: 'accept' | 'reject' | 'defer', reason?: string) {
    const res = await fetchWithTimeout(`/api/intelligence/opportunities/${encodeURIComponent(id)}/action`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ action, reason }),
    });
    if (!res.ok) throw new Error('Failed to act on opportunity');
    return await res.json();
  },

  async getIntelligenceOpportunities() {
    const res = await fetchWithTimeout('/api/intelligence/opportunities', { headers: defaultHeaders() });
    return await res.json();
  },

  async getIntelligenceFeatures() {
    const res = await fetchWithTimeout('/api/intelligence/features', { headers: defaultHeaders() });
    return await res.json();
  },

  async getOperationsIntegrations() {
    const res = await fetchWithTimeout('/api/operations/integrations', { headers: defaultHeaders() });
    return await res.json();
  },

  async getLedgerAnomalies() {
    const res = await fetchWithTimeout('/api/commerce/ledger/anomalies', { headers: defaultHeaders() });
    return await res.json();
  },

  async reconcileLedger(bookingRef: string) {
    const res = await fetchWithTimeout(`/api/commerce/ledger/reconcile/${encodeURIComponent(bookingRef)}`, { headers: defaultHeaders() });
    return await res.json();
  },

  async getAdminLogs(limit = 50) {
    const res = await fetchWithTimeout(`/api/dahab/admin/logs?limit=${limit}`, { headers: defaultHeaders() });
    return await res.json();
  },

  async resolveAdminConflict(conflictId: string, resolvedValue: string) {
    const res = await fetchWithTimeout('/api/dahab/admin/conflicts/resolve', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ conflictId, resolvedValue }),
    });
    if (!res.ok) throw new Error('Failed to resolve conflict');
    return await res.json();
  },

  async resolveAdminReviewQueue(reviewId: string, decision: string, notes?: string) {
    const res = await fetchWithTimeout('/api/dahab/admin/review-queue/resolve', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ reviewId, decision: decision.toUpperCase(), notes }),
    });
    if (!res.ok) throw new Error('Failed to resolve review item');
    return await res.json();
  },

  async mergeAdminEntities(params: { sourceId: string; targetId: string }) {
    const res = await fetchWithTimeout('/api/dahab/admin/entities/merge', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to merge entities');
    return await res.json();
  },
};

