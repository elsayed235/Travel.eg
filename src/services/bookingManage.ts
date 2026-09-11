import { ApiError } from './apiError';
import type { BookingDetail, RichAvailabilityResponse } from './api';

/**
 * Traveller-facing booking management helpers.
 *
 * The rule these helpers encode is a rule about what the UI may *offer*: the
 * backend remains the source of truth, and every action still round-trips to
 * the server before anything is claimed. When the server says a booking is in
 * a terminal state the manage buttons are hidden or disabled; when the server
 * reports availability, these helpers only turn the reported numbers into
 * presentation states — never into a capacity decision of their own.
 */

/**
 * States in which a booking can no longer be cancelled or rescheduled.
 * Mirrors the terminal set enforced server-side in bookingService.ts; keeping
 * it here only decides whether the buttons are offered at all.
 */
export const TERMINAL_SUPPLIER_STATES: ReadonlyArray<string> = [
  'COMPLETED',
  'CANCELLED',
  'REJECTED',
  'EXPIRED',
  'FAILED'
];

/** Payment states in which the money side can no longer be acted on. */
const TERMINAL_PAYMENT_STATES: ReadonlyArray<string> = [
  'REFUNDED',
  'PARTIALLY_REFUNDED',
  'CANCELLED',
  'FAILED',
  'DISPUTED'
];

export type BookingActionEligibility =
  | { allowed: true }
  | { allowed: false; reason: 'terminal' | 'noRefundPending' };

export function cancellationEligibility(booking: Pick<BookingDetail, 'supplierState' | 'paymentState'>): BookingActionEligibility {
  if (TERMINAL_SUPPLIER_STATES.includes(booking.supplierState)) {
    return { allowed: false, reason: 'terminal' };
  }
  if (TERMINAL_PAYMENT_STATES.includes(booking.paymentState)) {
    return { allowed: false, reason: 'noRefundPending' };
  }
  return { allowed: true };
}

export function rescheduleEligibility(booking: Pick<BookingDetail, 'supplierState'>): BookingActionEligibility {
  if (TERMINAL_SUPPLIER_STATES.includes(booking.supplierState)) {
    return { allowed: false, reason: 'terminal' };
  }
  return { allowed: true };
}

// ---------------------------------------------------------------------------
// Rich availability presentation
// ---------------------------------------------------------------------------

export type SlotAvailabilityKind =
  | 'available'
  | 'limited'
  | 'sold-out'
  | 'fits-no-party';

export interface AvailabilitySlotView {
  id: string;
  timeSlot: string;
  priceEGP: number;
  capacityRemaining: number;
  kind: SlotAvailabilityKind;
}

/** Seats at or below which a fit is shown as "only a few left". */
export const LIMITED_REMAINING = 2;

/**
 * A slot's presentation state. The server reports `availableCapacity` (its own
 * total minus reserved and held seats) and the raw status; this only turns
 * those numbers into the states the UI renders, for the party size in hand.
 */
export function slotAvailabilityKind(slot: {
  availableCapacity: number;
  status: string;
}, passengers: number): SlotAvailabilityKind {
  if (slot.availableCapacity < passengers) {
    // Might read AVAILABLE on a full slot if the party grew after the server
    // answered; the party cannot fit either way.
    return slot.availableCapacity <= 0 ? 'sold-out' : 'fits-no-party';
  }
  if (slot.status === 'SOLD_OUT') return 'sold-out';
  if (slot.status === 'ALMOST_FULL' || slot.availableCapacity <= LIMITED_REMAINING) return 'limited';
  return 'available';
}

/**
 * Builds the per-slot rows shown in the availability picker.
 * Returns an empty list for a date with no scheduled slots — an "unavailable
 * that day" state the caller renders as its own empty result.
 */
export function availabilitySlotViews(
  response: Pick<RichAvailabilityResponse, 'slots'>,
  passengers: number
): AvailabilitySlotView[] {
  return response.slots.map(slot => ({
    id: slot.id,
    timeSlot: slot.timeSlot,
    priceEGP: slot.priceEGP,
    capacityRemaining: Math.max(0, slot.availableCapacity),
    kind: slotAvailabilityKind(slot, passengers)
  }));
}

// ---------------------------------------------------------------------------
// User-facing error mapping
// ---------------------------------------------------------------------------

export type BookingErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'conflict'
  | 'invalidState'
  | 'rateLimited'
  | 'server'
  | 'network'
  | 'badRequest'
  | 'unknown';

export interface BookingErrorInfo {
  code: BookingErrorCode;
  /** Raw backend detail, for logging only — never rendered to the traveller. */
  detail?: string;
}

/**
 * Maps any thrown failure to a code the UI can translate. Status codes are the
 * contract; raw backend sentences are not surfaced to travellers, so the
 * detail is only carried for diagnostics.
 */
export function bookingActionError(error: unknown): BookingErrorInfo {
  if (error instanceof ApiError) {
    const detail = error.message;
    switch (error.status) {
      case 401: return { code: 'unauthorized', detail };
      case 403: return { code: 'forbidden', detail };
      case 404: return { code: 'notFound', detail };
      case 409: return { code: 'conflict', detail };
      case 422: return { code: 'invalidState', detail };
      case 429: return { code: 'rateLimited', detail };
      case 400: return { code: 'badRequest', detail };
      default:
        return { code: error.status >= 500 ? 'server' : 'unknown', detail };
    }
  }
  // A plain Error from fetchWithTimeout (timeout) or a TypeError (offline,
  // DNS failure) — nothing was decided by the server.
  return { code: 'network', detail: error instanceof Error ? error.message : undefined };
}
