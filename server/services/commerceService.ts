import crypto from 'crypto';
import { db } from '../db/database';
import { reconcileTripStatus } from './tripStatusReconciler';
import type { CommerceServiceType } from '../db/schema';
import { HoldEntity, BookingEntity, InventorySlotEntity, ProductSkuEntity } from '../db/schema';
import { paymentService } from './paymentService';
import { notificationService } from './notificationService';
import { distributedLockService } from './distributedLockService';

const HOLD_TTL_MINUTES = 15;

/**
 * Raised when a slot cannot satisfy the requested party size. Carries a 409 so
 * callers can distinguish "sold out" from a malformed request.
 */
export class InsufficientCapacityError extends Error {
  public readonly status = 409;
  public readonly type = 'https://dahab.travel/errors/insufficient-capacity';
  public readonly title = 'Not Enough Availability';
  public readonly details: Record<string, unknown>;

  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'InsufficientCapacityError';
    this.details = details;
  }
}

/**
 * Raised when a checkout names inventory that does not exist, or that exists
 * under a different service type. A 400 rather than a 409: nothing is sold out,
 * the request is simply wrong, and retrying it unchanged will not help.
 */
export class UnknownSkuError extends Error {
  public readonly status = 400;
  public readonly type = 'https://dahab.travel/errors/unknown-sku';
  public readonly title = 'Unknown Product';
  public readonly details: Record<string, unknown>;

  constructor(skuId: string, actualServiceType?: string, requestedServiceType?: string) {
    super(
      actualServiceType && requestedServiceType
        ? `Product "${skuId}" is a ${actualServiceType} product and cannot be booked as ${requestedServiceType}.`
        : `Product "${skuId}" does not exist. A booking cannot be created for inventory that is not in the catalogue.`
    );
    this.name = 'UnknownSkuError';
    this.details = { skuId, actualServiceType, requestedServiceType };
  }
}

/**
 * The checkout named a trip that does not exist.
 *
 * The store still carries the result of this going unchecked: a CAPTURED
 * booking, its payment and two ledger entries all filed against
 * 'DHB-TRIP-DAHAB-FIRST-TIMER' — a plan-template slug that a since-fixed client
 * path sent in place of the traveller's real trip id. Nothing rejected it, so
 * four money rows point at an itinerary that was never created.
 *
 * The client is fixed, but its fallback is now the empty string, and an empty
 * or unknown trip id would still be accepted here. Validating server-side
 * closes the whole class rather than the one path that caused it.
 */
export class UnknownTripError extends Error {
  public readonly status = 400;
  public readonly type = 'https://dahab.travel/errors/unknown-trip';
  public readonly title = 'Unknown Trip';
  public readonly details: Record<string, unknown>;

  constructor(tripId: string) {
    super(
      tripId
        ? `Trip "${tripId}" does not exist. A booking cannot be filed against an itinerary that is not in the database.`
        : 'No trip was supplied. A booking has to belong to a traveller\'s itinerary.'
    );
    this.name = 'UnknownTripError';
    this.details = { tripId };
  }
}

export class CommerceService {
  // Release holds that have exceeded their TTL
  public releaseExpiredHolds() {
    const now = new Date().toISOString();
    db.runInTransaction(() => {
      db.holds.forEach(h => {
        if (h.status === 'ACTIVE' && h.expiresAt < now) {
          h.status = 'EXPIRED';
          const slot = db.inventorySlots.find(s => s.id === h.slotId);
          if (slot) {
            slot.heldCapacity = Math.max(0, slot.heldCapacity - h.passengersCount);
            if (slot.status === 'SOLD_OUT' && slot.reservedCapacity + slot.heldCapacity < slot.totalCapacity) {
              slot.status = 'AVAILABLE';
            }
          }
        }
      });
    });
  }

  // Explicitly release a specific hold
  public releaseHold(holdToken: string): boolean {
    let released = false;
    db.runInTransaction(() => {
      const hold = db.holds.find(h => h.holdToken === holdToken && h.status === 'ACTIVE');
      if (hold) {
        hold.status = 'RELEASED';
        const slot = db.inventorySlots.find(s => s.id === hold.slotId);
        if (slot) {
          slot.heldCapacity = Math.max(0, slot.heldCapacity - hold.passengersCount);
          if (slot.status === 'SOLD_OUT' && slot.reservedCapacity + slot.heldCapacity < slot.totalCapacity) {
            slot.status = 'AVAILABLE';
          }
        }
        released = true;
      }
    });
    return released;
  }

  // Multi-vertical Availability Check
  public checkAvailability(params: {
    serviceType: CommerceServiceType;
    skuId?: string;
    date: string;
    timeSlot?: string;
    passengers?: number;
  }): {
    available: boolean;
    skus: ProductSkuEntity[];
    slots: InventorySlotEntity[];
    priceEGP: number;
  } {
    this.releaseExpiredHolds();

    let targetSkus = db.productSkus.filter(s => s.serviceType === params.serviceType && s.active);
    if (params.skuId) {
      targetSkus = targetSkus.filter(s => s.id === params.skuId);
    }

    if (targetSkus.length === 0) {
      return { available: false, skus: [], slots: [], priceEGP: 0 };
    }

    const primarySku = targetSkus[0];
    let slots = db.inventorySlots.filter(s => s.skuId === primarySku.id && s.date === params.date);

    // Auto-generate dynamic slots if date is new
    if (slots.length === 0) {
      const defaultTimes = params.serviceType === 'hotel' 
        ? ['Standard Check-in 14:00']
        : params.serviceType === 'rental'
        ? ['FULL_DAY']
        : params.serviceType === 'diving'
        ? ['08:30 AM (Morning Dive)', '01:30 PM (Afternoon Dive)']
        : params.serviceType === 'safari'
        ? ['02:00 AM (Sunrise Trek)', '03:30 PM (Sunset Safari)']
        : ['08:00 AM', '10:30 AM', '01:00 PM', '04:30 PM', '08:00 PM', '11:30 PM'];

      // Projected, not persisted. This method is reachable anonymously, and
      // persisting here meant any request for an unseen date pushed rows and
      // rewrote the entire database file to disk — unbounded growth and write
      // amplification from an unauthenticated endpoint. createHold materialises
      // the slot for real when someone actually books it.
      slots = defaultTimes.map((t, idx) => ({
        id: `SLOT-${primarySku.id}-${params.date}-${idx}`,
        skuId: primarySku.id,
        date: params.date,
        timeSlot: t,
        totalCapacity: primarySku.maxCapacityPerSlot || 10,
        reservedCapacity: 0,
        heldCapacity: 0,
        priceEGP: primarySku.basePriceEGP,
        status: 'AVAILABLE'
      }));
    }

    const pax = params.passengers || 2;
    const availableSlots = slots.filter(s => (s.totalCapacity - (s.reservedCapacity + s.heldCapacity)) >= pax);

    return {
      available: availableSlots.length > 0,
      skus: targetSkus,
      slots,
      priceEGP: primarySku.basePriceEGP
    };
  }

  // Create Concurrency-Safe Hold for any vertical
  public createHold(params: {
    skuId: string;
    tripId: string;
    travelerId: string;
    date: string;
    timeSlot: string;
    passengersCount: number;
    idempotencyKey: string;
  }): HoldEntity {
    this.releaseExpiredHolds();

    // Idempotency
    const existing = db.holds.find(h => h.idempotencyKey === params.idempotencyKey && h.status === 'ACTIVE');
    if (existing) {
      return existing;
    }

    const sku = db.productSkus.find(s => s.id === params.skuId);
    if (!sku) throw new Error(`SKU does not exist: ${params.skuId}`);

    const lockKey = `lock:slot:${params.skuId}:${params.date}:${params.timeSlot}`;
    const lease = distributedLockService.tryAcquire(lockKey, 5000);

    try {
      let holdResult!: HoldEntity;

      db.runInTransaction(() => {
        let slot = db.inventorySlots.find(s => s.skuId === params.skuId && s.date === params.date && s.timeSlot === params.timeSlot);
        if (!slot) {
          slot = {
            id: `SLOT-${params.skuId}-${params.date}-${Date.now()}`,
            skuId: params.skuId,
            date: params.date,
            timeSlot: params.timeSlot,
            totalCapacity: sku.maxCapacityPerSlot || 10,
            reservedCapacity: 0,
            heldCapacity: 0,
            priceEGP: sku.basePriceEGP,
            status: 'AVAILABLE'
          };
          db.inventorySlots.push(slot);
        }

        const availableCapacity = slot.totalCapacity - (slot.reservedCapacity + slot.heldCapacity);
        if (availableCapacity < params.passengersCount) {
          // Previously this raised totalCapacity by passengersCount * 4 and
          // carried on, which made inventory unbounded: every hold succeeded and
          // every booking was confirmed regardless of what the supplier could
          // actually deliver. The surrounding lock, TTL and idempotency
          // machinery protected a number that was never enforced.
          throw new InsufficientCapacityError(
            `Only ${Math.max(0, availableCapacity)} place(s) remain for ${sku.title || params.skuId} ` +
            `on ${params.date} at ${params.timeSlot}; ${params.passengersCount} were requested.`,
            { skuId: params.skuId, date: params.date, timeSlot: params.timeSlot, requested: params.passengersCount, available: Math.max(0, availableCapacity) }
          );
        }

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + HOLD_TTL_MINUTES);

        const prefix = sku.serviceType.substring(0, 3).toUpperCase();
        const holdToken = `HLD-${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        const hold: HoldEntity = {
          id: `HOLD-${Date.now()}`,
          holdToken,
          skuId: params.skuId,
          slotId: slot.id,
          tripId: params.tripId,
          travelerId: params.travelerId,
          serviceType: sku.serviceType,
          passengersCount: params.passengersCount,
          amountEGP: sku.basePriceEGP,
          expiresAt: expires.toISOString(),
          status: 'ACTIVE',
          idempotencyKey: params.idempotencyKey,
          createdAt: new Date().toISOString()
        };

        slot.heldCapacity += params.passengersCount;
        if (slot.reservedCapacity + slot.heldCapacity >= slot.totalCapacity) {
          slot.status = 'SOLD_OUT';
        }
        db.holds.push(hold);
        db.logAudit(params.travelerId, 'Traveler', 'HOLD_CREATED', 'Hold', hold.id, {
          holdToken,
          serviceType: hold.serviceType,
          expiresAt: hold.expiresAt,
          amountEGP: hold.amountEGP
        });
        db.saveToDisk();
        holdResult = hold;
      });

      return holdResult;
    } finally {
      if (lease) {
        distributedLockService.release(lease);
      }
    }
  }

  // Unified Multi-Service Checkout & Booking Confirmation
  public completeMultiServiceCheckout(params: {
    tripId: string;
    /**
     * Who the booking is for, from the caller's verified session.
     *
     * The confirmation notification used to be addressed to a literal
     * 'USR-AHMED-01' — so every booking notification the platform has ever
     * produced was filed against the demo user, whoever actually booked.
     */
    travelerUserId?: string;
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
      passengersCount?: number;
      pickupLocation?: string;
      dropoffLocation?: string;
      specialRequests?: string;
    }>;
    paymentParams: {
      idempotencyKey: string;
      provider?: 'PAYMOB' | 'STRIPE' | 'CASH_ON_ARRIVAL';
      /** Last four digits only — full PANs must never reach the server. */
      cardLast4?: string;
      cardBrand?: string;
      cardHolderName?: string;
    };
  }): {
    success: boolean;
    tripId: string;
    bookings: BookingEntity[];
    totalAmountEGP: number;
    paymentState: string;
    transactionId: string;
    /** True when this idempotencyKey had already been settled (a retry). */
    replayed?: boolean;
  } {
    // Resolve every item's inventory BEFORE the payment is processed.
    //
    // processCheckout runs outside db.runInTransaction and writes a payment
    // plus its ledger entries, so a throw from inside the transaction below
    // would leave the traveler charged for a booking that was never created.
    // Whatever is wrong with the request has to be found while nothing has
    // happened yet.
    // The trip has to exist before anything is charged, for exactly the reason
    // the SKUs are resolved here: this runs before processCheckout, so a throw
    // after payment would leave the traveller charged for a booking that could
    // never be filed correctly.
    if (!params.tripId || !db.trips.some(t => t.id === params.tripId)) {
      throw new UnknownTripError(params.tripId);
    }

    // Replay protection for the WHOLE checkout, not just the payment. A client
    // that times out after a committed response (or double-submits) retries with
    // the same idempotencyKey. processCheckout already short-circuits on the
    // payment, but the booking/totals loop below ran unconditionally, so every
    // retry pushed a brand-new set of bookings and added the total to
    // trip.totalPaidEGP again — duplicate bookings, inflated paid total, for one
    // payment. If a payment already exists for this key, the bookings were
    // created on the first attempt and this is a retry: return without doing
    // any of it again.
    const existingPayment = db.payments.find(p => p.idempotencyKey === params.paymentParams.idempotencyKey);
    if (existingPayment) {
      return {
        success: true,
        replayed: true,
        tripId: params.tripId,
        bookings: db.bookings.filter(b => b.tripId === params.tripId),
        totalAmountEGP: existingPayment.amountEGP,
        paymentState: existingPayment.state,
        transactionId: existingPayment.transactionId
      };
    }

    const resolvedSkus = params.items.map(item => {
      const sku = db.productSkus.find(s => s.id === item.skuId);
      if (!sku) throw new UnknownSkuError(item.skuId);
      if (sku.serviceType !== item.serviceType) {
        throw new UnknownSkuError(item.skuId, sku.serviceType, item.serviceType);
      }
      return sku;
    });

    const totalAmountEGP = params.items.reduce((acc, item) => acc + item.amountEGP, 0);

    // 1. Process payment settlement with idempotency
    const paymentResult = paymentService.processCheckout({
      idempotencyKey: params.paymentParams.idempotencyKey,
      tripId: params.tripId,
      amountEGP: totalAmountEGP,
      provider: params.paymentParams.provider || 'PAYMOB',
      cardLast4: params.paymentParams.cardLast4,
      cardBrand: params.paymentParams.cardBrand,
      cardHolderName: params.paymentParams.cardHolderName,
      payerEmail: params.travelerEmail,
      payerPhone: params.travelerPhone
    });

    // The session's user, then the trip's owner, and only then a marker that
    // says plainly that the owner is unknown. Never another traveler's id.
    const notificationUserId =
      params.travelerUserId ||
      db.trips.find(t => t.id === params.tripId)?.userId ||
      'UNATTRIBUTED';

    const tripPartySize = db.trips.find(t => t.id === params.tripId)?.travelersCount ?? 1;

    const confirmedBookings: BookingEntity[] = [];
    const now = new Date().toISOString();

    db.runInTransaction(() => {
      // 2. Iterate each item and convert into authoritative BookingEntity
      params.items.forEach((item, index) => {
        // Resolved above, before the payment. It used to be looked up here with
        // a fallback to *any* SKU of the same service type and a hardcoded
        // 'SUP-SHUTTLE-01' supplier, so a checkout naming inventory that did
        // not exist — which the Book Now catalogue did for all eight of its
        // services — still created a real booking, dispatched to a real
        // supplier, for something that supplier does not sell.
        const sku = resolvedSkus[index];
        const supplierId = sku.supplierId;
        const prefix = item.serviceType.substring(0, 3).toUpperCase();
        // Was `Math.floor(100 + Math.random() * 900)` — 900 possible refs per
        // service type, used as the primary key. A collision is more likely than
        // not after ~35 bookings, and db.bookings.find(b => b.id === ...) would
        // then return somebody else's booking: wrong traveler, wrong payout,
        // wrong voucher. 12 random hex chars makes that negligible.
        const bookingRef = `DHB-${prefix}-${new Date().getFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        const confirmationCode = `DHB-${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // If a hold was used, mark it converted
        if (item.holdToken) {
          const hold = db.holds.find(h => h.holdToken === item.holdToken);
          if (hold) {
            hold.status = 'CONVERTED';
            const slot = db.inventorySlots.find(s => s.id === hold.slotId);
            if (slot) {
              slot.heldCapacity = Math.max(0, slot.heldCapacity - hold.passengersCount);
              slot.reservedCapacity += hold.passengersCount;
              if (slot.reservedCapacity + slot.heldCapacity >= slot.totalCapacity) {
                slot.status = 'SOLD_OUT';
              }
            }
          }
        }

        const booking: BookingEntity = {
          id: bookingRef,
          bookingRef,
          tripId: params.tripId,
          supplierId,
          skuId: sku?.id || item.skuId,
          serviceType: item.serviceType,
          amountEGP: item.amountEGP,
          paymentState: 'CAPTURED',
          // The supplier has not seen this yet, so it cannot be CONFIRMED.
          //
          // Writing CONFIRMED at the moment of purchase did two things: it told
          // the traveler a named supplier had accepted their booking when
          // nobody had, and it made the booking invisible in the supplier's own
          // queue — supplierService counts PENDING_CONFIRMATION as
          // `pendingActionCount`, so every booking ever created bypassed the
          // acceptance step the portal exists to run. updateBookingState moves
          // it to CONFIRMED when the supplier actually accepts.
          supplierState: 'PENDING_CONFIRMATION',
          travelerName: params.travelerName,
          travelerPhone: params.travelerPhone,
          travelerEmail: params.travelerEmail,
          // Was a hardcoded 2 for every booking, so a solo traveler and a
          // party of six were dispatched to the supplier identically.
          passengersCount: item.passengersCount ?? tripPartySize,
          pickupLocation: item.pickupLocation,
          dropoffLocation: item.dropoffLocation,
          specialRequests: item.specialRequests,
          scheduledDate: item.scheduledDate,
          scheduledTime: item.scheduledTime,
          confirmationCode,
          // Left unassigned, deliberately.
          //
          // Every transfer used to be created already carrying "Mahmoud Salem",
          // phone +20 100 876 5432, a Toyota HiAce and plate ط ج د 4821; every
          // dive "Omar Soliman (PADI MSDT Instructor)"; every safari "Sheikh
          // Salem Al-Jabali". Identical on every booking, invented at the
          // moment of purchase, and shown to the traveler as the person to look
          // for at the airport. Assignment is the supplier's act — it is what
          // supplierService.updateBookingState('ASSIGNED') exists to record —
          // and a booking that nobody has accepted yet must not name a driver.
          assignedResource: undefined,
          createdAt: now,
          updatedAt: now
        };

        db.bookings.push(booking);
        confirmedBookings.push(booking);

        // Attach to the itinerary line this booking actually fulfils.
        //
        // The match used to be `tripId + serviceType`, taking the FIRST item of
        // that type and re-pointing it at the new booking. So a traveler with a
        // 2,700 EGP dive already on their trip who booked a second, cheaper one
        // had their existing line hijacked: its bookingId moved to the new
        // booking while its price and title stayed the old one's, the original
        // booking was orphaned from the itinerary, and the new booking got no
        // line of its own. Observed in this store as a 2,700 EGP item pointing
        // at a 180 EGP booking.
        //
        // A line is only the right one if it is for the same product and is not
        // already booked.
        let tripItem = db.tripItems.find(
          ti =>
            ti.tripId === params.tripId &&
            ti.skuId === sku.id &&
            !ti.bookingId &&
            ti.status !== 'CANCELLED'
        );
        if (tripItem) {
          tripItem.status = 'CONFIRMED';
          tripItem.bookingId = booking.id;
          // Keep the line's price as the amount actually charged, so the
          // itinerary and the ledger cannot disagree.
          tripItem.priceEGP = item.amountEGP;
          tripItem.updatedAt = now;
        } else {
          tripItem = {
            id: `ITEM-${Date.now()}-${prefix}`,
            tripId: params.tripId,
            serviceType: item.serviceType,
            skuId: sku?.id || item.skuId,
            title: sku?.title || `${item.serviceType.toUpperCase()} Booking`,
            dayNumber: item.serviceType === 'hotel' ? 1 : item.serviceType === 'transfer' ? 1 : 2,
            timeSlot: item.scheduledTime,
            priceEGP: item.amountEGP,
            status: 'CONFIRMED',
            bookingId: booking.id,
            createdAt: now,
            updatedAt: now
          };
          db.tripItems.push(tripItem);
        }

        // Send confirmation notifications
        notificationService.sendNotification({
          userId: notificationUserId,
          type: 'BOOKING_CREATED',
          channel: 'WHATSAPP',
          title: `Booking Confirmed: ${booking.serviceType.toUpperCase()}`,
          message: `Your booking ${booking.bookingRef} is confirmed! Voucher code: ${confirmationCode}.`,
          metadata: { recipientPhone: params.travelerPhone, bookingRef: booking.bookingRef, priceEGP: booking.amountEGP }
        });
      });

      // Update Trip totals
      const trip = db.trips.find(t => t.id === params.tripId);
      if (trip) {
        trip.totalPaidEGP += totalAmountEGP;
        trip.updatedAt = now;
      }

      // Advance the trip's own lifecycle from what is now true of it.
      //
      // This was `trip.status = 'CONFIRMED'`, unconditionally, which could only
      // ever move a trip forwards by accident. A traveler already in Dahab
      // (IN_DESTINATION) who booked a massage was sent *back* to CONFIRMED and
      // dropped out of the in-destination experience; a cancelled trip was
      // quietly revived by any booking against it. reconcileTripStatus only
      // moves forward and refuses to touch a terminal trip.
      reconcileTripStatus(params.tripId, params.travelerName);

      db.logAudit(params.travelerName, 'Traveler', 'MULTI_CHECKOUT_COMPLETED', 'Trip', params.tripId, {
        totalAmountEGP,
        bookingsCount: confirmedBookings.length,
        transactionId: paymentResult.payment.transactionId
      });
    });

    return {
      success: true,
      tripId: params.tripId,
      bookings: confirmedBookings,
      totalAmountEGP,
      paymentState: 'CAPTURED',
      transactionId: paymentResult.payment.transactionId
    };
  }
}

export const commerceService = new CommerceService();
