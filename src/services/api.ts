import { apiErrorFrom, readJson } from './apiError';
import type {
  CommerceServiceType,
  SupportMessage,
  DahabActivity,
  DahabDiningVenue,
  DahabPlace,
  TripBookingRecord,
  TripEntity,
  TripItemEntity,
  TripItemWithSupplier
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
  }
};

