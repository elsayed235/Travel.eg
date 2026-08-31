import { apiErrorFrom, readJson } from './apiError';
import type {
  CommerceServiceType,
  DahabCuratedStory,
  DahabGalleryPhoto,
  SupportMessage,
  DahabActivity,
  DahabDiningVenue,
  DahabPlace,
  TripBookingRecord,
  TripEntity,
  TripItemEntity,
  TripItemWithSupplier,
  ProductSkuEntity
} from '../shared';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
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

  async getGalleryPhotos(signal?: AbortSignal): Promise<{ photos: DahabGalleryPhoto[] }> {
    const res = await fetchWithTimeout('/api/dahab/content/gallery', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load the Dahab gallery.');
    return await readJson<{ photos: DahabGalleryPhoto[] }>(res, 'Could not load the Dahab gallery.');
  },

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

  async getDahabDining(signal?: AbortSignal): Promise<{ venues: DahabDiningVenue[] }> {
    const res = await fetchWithTimeout('/api/dahab/food', { headers: defaultHeaders(), signal });
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

  async searchDahab(query: string, signal?: AbortSignal): Promise<{ results: unknown }> {
    const res = await fetchWithTimeout(`/api/dahab/search?q=${encodeURIComponent(query)}`, { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Search failed.');
    return await readJson<{ results: unknown }>(res, 'Search failed.');
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

  async checkMultiAvailability(params: {
    serviceType: CommerceServiceType;
    skuId?: string;
    date: string;
    timeSlot?: string;
    passengers?: number;
  }) {
    const res = await fetchWithTimeout('/api/commerce/availability', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to check inventory availability');
    return await res.json();
  },

  async checkTransferAvailability(skuId: string, date: string, timeSlot?: string, passengers = 2) {
    const res = await fetchWithTimeout('/api/inventory/transfers/check', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ skuId, date, timeSlot, passengers })
    });
    if (!res.ok) throw new Error('Failed to check transfer inventory');
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

  async substituteItineraryItem(params: {
    tripId: string;
    originalItemId: string;
    alternativeTitle: string;
    alternativeServiceType: string;
    newScheduledTime: string;
    newPriceEGP?: number;
    reason: string;
    idempotencyKey: string;
  }) {
    const res = await fetchWithTimeout('/api/commerce/recovery/substitute', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Itinerary substitution failed');
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

  async getTelemetry(bookingId: string) {
    const res = await fetchWithTimeout(`/api/transfers/telemetry/${bookingId}`, { headers: defaultHeaders() });
    if (!res.ok) throw new Error('Telemetry fetch failed');
    return await res.json();
  },

  // 3. Ledger & Audits
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

  async updateSupplierBookingStatus(bookingId: string, supplierState: string, resource?: any) {
    const res = await fetchWithTimeout(`/api/suppliers/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ supplierState, resource })
    });
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

  async resolveMarketAlert(alertId: string, resolutionNotes?: string) {
    const res = await fetchWithTimeout(`/api/market/alerts/${encodeURIComponent(alertId)}/resolve`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ resolutionNotes })
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return await res.json();
  },

  async resolveReviewQueueItem(itemId: string, action: string, notes?: string, reviewer?: string) {
    const res = await fetchWithTimeout(`/api/market/review-queue/${encodeURIComponent(itemId)}/resolve`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ action, notes, reviewer })
    });
    if (!res.ok) throw new Error('Failed to resolve review item');
    return await res.json();
  },

  async getRecentEvents(limit = 20) {
    const res = await fetchWithTimeout(`/api/events/recent?limit=${limit}`, { headers: defaultHeaders() });
    return await res.json();
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

  async runGoldenJourneySuite() {
    const res = await fetchWithTimeout('/api/testing/golden-journey', {
      method: 'POST',
      headers: defaultHeaders()
    });
    return await res.json();
  },

  // 5. Background Spatial Context Engine ("I Have Two Hours", Food Proximity, Routing)
  async getFitWindowOptions(params?: { originArea?: string; availableMinutes?: number; category?: string }) {
    const res = await fetchWithTimeout('/api/context/fit-window', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params || { originArea: 'lighthouse', availableMinutes: 120 })
    });
    if (!res.ok) throw new Error('Failed to fetch window fit options');
    return await res.json();
  },

  async getPostActivityFood(locationId: string = 'place-lighthouse', limit: number = 3) {
    const res = await fetchWithTimeout(`/api/context/post-activity-food?locationId=${encodeURIComponent(locationId)}&limit=${limit}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch post activity food');
    return await res.json();
  },

  async getTravelEstimate(origin: string, destination: string) {
    const res = await fetchWithTimeout(`/api/context/travel-time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch travel estimate');
    return await res.json();
  },

  async parseSearchIntent(query: string) {
    const res = await fetchWithTimeout('/api/context/parse-intent', {
      timeout: AI_TIMEOUT_MS,
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed to parse search intent');
    return await res.json();
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

  async getDayGiTask(taskId: string) {
    const res = await fetchWithTimeout(`/api/daygi/tasks/${encodeURIComponent(taskId)}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orchestrated task');
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

  async runGoldenJourneyTest() {
    const res = await fetchWithTimeout('/api/testing/golden-journey', {
      method: 'POST',
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Golden journey test failed');
    return await res.json();
  },

  // ---------------------------------------------------------------------------
  // DayGI Closed Beta Telemetry & Productization API
  // ---------------------------------------------------------------------------
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

  async trackDayGiAlertInteraction(alertId: string, lifecycle: 'SHOWN' | 'OPENED' | 'IGNORED' | 'ACTED_ON' | 'DISMISSED') {
    const res = await fetchWithTimeout('/api/daygi/beta/alert-interaction', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ alertId, lifecycle })
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async trackDayGiCardInteraction(cardType: string, action: 'SHOWN' | 'CLICKED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED', durationSec: number = 0) {
    const res = await fetchWithTimeout('/api/daygi/beta/card-interaction', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ cardType, action, durationSec })
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async getDayGiBetaDashboard() {
    const res = await fetchWithTimeout('/api/daygi/beta/dashboard', {
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch beta dashboard');
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

  async runDayGiGoldenScenarios() {
    const res = await fetchWithTimeout('/api/daygi/beta/run-scenarios', {
      method: 'POST',
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to run golden scenarios');
    return await res.json();
  },

  /**
   * Recomputes market statistics, freshness buckets and change events from the
   * observations already stored. It does NOT fetch from external sources — the
   * ops console button that used to be labelled "Trigger Crawl" fabricated a
   * completed Google Maps crawl in a setTimeout without any network call.
   */
  async refreshMarketIntelligence() {
    const res = await fetchWithTimeout('/api/market/refresh', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ ingestionMode: 'MANUAL_REFRESH', triggerSource: 'ops-console' })
    });
    if (!res.ok) throw new Error('Market refresh failed');
    return await res.json();
  },

  async generateDayGiWeeklyReport() {
    const res = await fetchWithTimeout('/api/daygi/beta/generate-weekly-report', {
      method: 'POST',
      headers: defaultHeaders()
    });
    if (!res.ok) throw new Error('Failed to generate weekly report');
    return await res.json();
  },

  // ────────────────────────────────────────────────────────────────────────
  // Market Intelligence Endpoints (/api/market/*)
  // ────────────────────────────────────────────────────────────────────────

  async getMarketJobs(signal?: AbortSignal): Promise<{ jobs: unknown[] }> {
    const res = await fetchWithTimeout('/api/market/jobs', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market jobs.');
    return await readJson<{ jobs: unknown[] }>(res, 'Could not load market jobs.');
  },

  async triggerMarketJob(payload: { jobType?: string }, signal?: AbortSignal): Promise<unknown> {
    const res = await fetchWithTimeout('/api/market/jobs/trigger', {
      method: 'POST', headers: defaultHeaders(), body: JSON.stringify(payload), signal
    });
    if (!res.ok) throw await apiErrorFrom(res, 'Failed to trigger market job.');
    return await res.json();
  },

  async getMarketSourceHealth(signal?: AbortSignal): Promise<{ sources: unknown[] }> {
    const res = await fetchWithTimeout('/api/market/sources/health', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load source health.');
    return await readJson<{ sources: unknown[] }>(res, 'Could not load source health.');
  },

  async getMarketReviewQueue(signal?: AbortSignal): Promise<{ queue: unknown[] }> {
    const res = await fetchWithTimeout('/api/market/review-queue', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load review queue.');
    return await readJson<{ queue: unknown[] }>(res, 'Could not load review queue.');
  },

  async getMarketOpsOverview(signal?: AbortSignal): Promise<{ overview: unknown }> {
    const res = await fetchWithTimeout('/api/market/ops/overview', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load ops overview.');
    return await readJson<{ overview: unknown }>(res, 'Could not load ops overview.');
  },

  async getMarketAlerts(signal?: AbortSignal): Promise<{ alerts: unknown[] }> {
    const res = await fetchWithTimeout('/api/market/alerts', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market alerts.');
    return await readJson<{ alerts: unknown[] }>(res, 'Could not load market alerts.');
  },

  async getMarketStats(signal?: AbortSignal): Promise<{ stats: unknown[] }> {
    const res = await fetchWithTimeout('/api/dahab/commerce/market-stats', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market stats.');
    return await readJson<{ stats: unknown[] }>(res, 'Could not load market stats.');
  },

  async getMarketTrends(signal?: AbortSignal): Promise<{ trends: unknown }> {
    const res = await fetchWithTimeout('/api/dahab/commerce/market-trends', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market trends.');
    return await readJson<{ trends: unknown }>(res, 'Could not load market trends.');
  },

  async getMarketSnapshots(signal?: AbortSignal): Promise<{ snapshots: unknown[] }> {
    const res = await fetchWithTimeout('/api/market/snapshots', { headers: defaultHeaders(), signal });
    if (!res.ok) throw await apiErrorFrom(res, 'Could not load market snapshots.');
    return await readJson<{ snapshots: unknown[] }>(res, 'Could not load market snapshots.');
  },

  async getMarketPriceHistory() {
    const res = await fetchWithTimeout('/api/market/price-history', { headers: defaultHeaders() });
    return await res.json();
  },

  async getMarketEvents() {
    const res = await fetchWithTimeout('/api/market/events', { headers: defaultHeaders() });
    return await res.json();
  },

  async getMarketSourceFreshness() {
    const res = await fetchWithTimeout('/api/market/source-freshness', { headers: defaultHeaders() });
    return await res.json();
  },

  // ---------------------------------------------------------------------------
  // Twilio & Sinai SMS Gateway API
  // ---------------------------------------------------------------------------
  async getSmsLogs(limit: number = 30) {
    const res = await fetchWithTimeout(`/api/sms/logs?limit=${limit}`, {
      headers: defaultHeaders()
    });
    if (!res.ok) return { count: 0, logs: [] };
    return await res.json();
  },

  async sendSmsDispatch(params: {
    to: string;
    recipientName: string;
    recipientRole: 'DRIVER' | 'DIVE_INSTRUCTOR' | 'HOTEL_DESK' | 'TRAVELER' | 'BEDOUIN_GUIDE';
    message: string;
    bookingRef?: string;
    channel?: 'TWILIO_SMS' | 'WHATSAPP_BUSINESS';
  }) {
    const res = await fetchWithTimeout('/api/sms/send-dispatch', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to dispatch SMS');
    }
    return await res.json();
  },

  // ─── Operations Admin Endpoints (Command Center) ────────────────────
  async getOperationsTrips() {
    const res = await fetchWithTimeout('/api/operations/trips', { headers: defaultHeaders() });
    return await res.json();
  },

  async getOperationsBookings(params?: { status?: string; supplierId?: string; paymentState?: string; limit?: number }) {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.supplierId) qs.set('supplierId', params.supplierId);
    if (params?.paymentState) qs.set('paymentState', params.paymentState);
    if (params?.limit) qs.set('limit', String(params.limit));
    const res = await fetchWithTimeout(`/api/operations/bookings?${qs}`, { headers: defaultHeaders() });
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

  async getIntelligenceSummary() {
    const res = await fetchWithTimeout('/api/intelligence/summary', { headers: defaultHeaders() });
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

  async resolveAdminReviewQueue(itemId: string, action: string, notes?: string) {
    const res = await fetchWithTimeout('/api/dahab/admin/review-queue/resolve', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ itemId, action, notes }),
    });
    if (!res.ok) throw new Error('Failed to resolve review item');
    return await res.json();
  },

  async resolveAdminEntity(params: { entityId: string; resolution: string }) {
    const res = await fetchWithTimeout('/api/dahab/admin/entities/resolve', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to resolve entity');
    return await res.json();
  },

  async mergeAdminEntities(params: { primaryEntityId: string; secondaryEntityId: string }) {
    const res = await fetchWithTimeout('/api/dahab/admin/entities/merge', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to merge entities');
    return await res.json();
  },
};

