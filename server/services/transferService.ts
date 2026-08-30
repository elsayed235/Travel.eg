import crypto from 'crypto';
import { db } from '../db/database';
import { HoldEntity, BookingEntity, TransferTelemetryEntity, InventorySlotEntity } from '../db/schema';
import { paymentService } from './paymentService';
import { notificationService } from './notificationService';

const HOLD_TTL_MINUTES = 15;

export class TransferService {
  // Check and clean expired holds
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

  public checkAvailability(params: {
    skuId: string;
    date: string;
    timeSlot?: string;
    passengers: number;
  }): {
    available: boolean;
    slots: InventorySlotEntity[];
    priceEGP: number;
    sku: any;
  } {
    this.releaseExpiredHolds();
    const sku = db.productSkus.find(s => s.id === params.skuId);
    if (!sku) {
      throw new Error(`Transfer SKU not found: ${params.skuId}`);
    }

    let slots = db.inventorySlots.filter(s => s.skuId === params.skuId && s.date === params.date);

    // If no slots exist yet for this date, dynamically generate them
    if (slots.length === 0) {
      const times = ['08:00 AM', '10:30 AM', '01:00 PM', '04:30 PM', '08:00 PM', '11:30 PM'];
      times.forEach((t, idx) => {
        const newSlot: InventorySlotEntity = {
          id: `SLOT-${params.skuId}-${params.date}-${idx}`,
          skuId: params.skuId,
          date: params.date,
          timeSlot: t,
          totalCapacity: sku.maxCapacityPerSlot || 6,
          reservedCapacity: 0,
          heldCapacity: 0,
          priceEGP: sku.basePriceEGP,
          status: 'AVAILABLE'
        };
        db.inventorySlots.push(newSlot);
      });
      slots = db.inventorySlots.filter(s => s.skuId === params.skuId && s.date === params.date);
    }

    slots.forEach(s => {
      if (!s.totalCapacity || s.totalCapacity <= 0) {
        s.totalCapacity = sku.maxCapacityPerSlot || 6;
      }
    });

    const availableSlots = slots.filter(s => (s.totalCapacity - (s.reservedCapacity + s.heldCapacity)) >= params.passengers);

    return {
      available: availableSlots.length > 0,
      slots,
      priceEGP: sku.basePriceEGP,
      sku
    };
  }

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
    if (!sku) throw new Error('Transfer SKU does not exist');

    let slot = db.inventorySlots.find(s => s.skuId === params.skuId && s.date === params.date && s.timeSlot === params.timeSlot);
    if (!slot) {
      slot = {
        id: `SLOT-${params.skuId}-${params.date}-${Date.now()}`,
        skuId: params.skuId,
        date: params.date,
        timeSlot: params.timeSlot,
        totalCapacity: sku.maxCapacityPerSlot || 6,
        reservedCapacity: 0,
        heldCapacity: 0,
        priceEGP: sku.basePriceEGP,
        status: 'AVAILABLE'
      };
      db.inventorySlots.push(slot);
    }

    if (!slot.totalCapacity || slot.totalCapacity <= 0) {
      slot.totalCapacity = sku.maxCapacityPerSlot || 6;
    }
    slot.reservedCapacity = slot.reservedCapacity || 0;
    slot.heldCapacity = slot.heldCapacity || 0;

    let availableCapacity = slot.totalCapacity - (slot.reservedCapacity + slot.heldCapacity);
    if (availableCapacity < params.passengersCount) {
      // Dynamic slot replenishment for on-demand transfer requests
      slot.totalCapacity += (params.passengersCount * 4);
      slot.status = 'AVAILABLE';
      availableCapacity = slot.totalCapacity - (slot.reservedCapacity + slot.heldCapacity);
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + HOLD_TTL_MINUTES);

    const holdToken = `HLD-TRF-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const hold: HoldEntity = {
      id: `HOLD-${Date.now()}`,
      holdToken,
      skuId: params.skuId,
      slotId: slot.id,
      tripId: params.tripId,
      travelerId: params.travelerId,
      serviceType: 'transfer',
      passengersCount: params.passengersCount,
      amountEGP: sku.basePriceEGP,
      expiresAt: expires.toISOString(),
      status: 'ACTIVE',
      idempotencyKey: params.idempotencyKey,
      createdAt: new Date().toISOString()
    };

    db.runInTransaction(() => {
      slot!.heldCapacity += params.passengersCount;
      if (slot!.reservedCapacity + slot!.heldCapacity >= slot!.totalCapacity) {
        slot!.status = 'SOLD_OUT';
      }
      db.holds.push(hold);
      db.logAudit(params.travelerId, 'Traveler', 'HOLD_CREATED', 'Hold', hold.id, {
        holdToken,
        expiresAt: hold.expiresAt,
        amountEGP: hold.amountEGP
      });
    });

    return hold;
  }

  public completeBooking(params: {
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
    paymentParams: {
      /** Last four digits only — full PANs must never reach the server. */
      cardLast4?: string;
      cardBrand?: string;
      cardHolderName?: string;
      idempotencyKey: string;
      provider?: 'PAYMOB' | 'STRIPE' | 'CASH_ON_ARRIVAL';
    };
  }): { booking: BookingEntity; telemetry: TransferTelemetryEntity } {
    this.releaseExpiredHolds();

    const hold = db.holds.find(h => h.holdToken === params.holdToken);
    if (!hold || hold.status !== 'ACTIVE') {
      throw new Error('Hold token has expired or is invalid. Please select your slot again.');
    }

    const sku = db.productSkus.find(s => s.id === hold.skuId);
    if (!sku) throw new Error('Product SKU not found');

    const bookingRef = `DHB-TRF-2026-${String(db.bookings.length + 43).padStart(3, '0')}`;
    const confirmationCode = `DHB-SSH-${crypto.randomBytes(2).toString('hex').toUpperCase()}-OK`;

    return db.runInTransaction(() => {
      // 1. Process payment
      const paymentResult = paymentService.processCheckout({
        idempotencyKey: params.paymentParams.idempotencyKey,
        tripId: params.tripId,
        holdToken: params.holdToken,
        bookingId: bookingRef,
        amountEGP: hold.amountEGP,
        provider: params.paymentParams.provider || 'PAYMOB',
        cardLast4: params.paymentParams.cardLast4,
        cardBrand: params.paymentParams.cardBrand,
        cardHolderName: params.paymentParams.cardHolderName,
        payerEmail: params.travelerEmail,
        payerPhone: params.travelerPhone
      });

      // 2. Mark hold as converted & update slot capacity
      hold.status = 'CONVERTED';
      const slot = db.inventorySlots.find(s => s.id === hold.slotId);
      if (slot) {
        slot.heldCapacity = Math.max(0, slot.heldCapacity - hold.passengersCount);
        slot.reservedCapacity += hold.passengersCount;
        if (slot.reservedCapacity >= slot.totalCapacity) {
          slot.status = 'SOLD_OUT';
        }
      }

      // 3. Create Booking Entity
      const booking: BookingEntity = {
        id: bookingRef,
        bookingRef,
        tripId: params.tripId,
        supplierId: sku.supplierId,
        skuId: hold.skuId,
        serviceType: 'transfer',
        amountEGP: hold.amountEGP,
        paymentState: paymentResult.payment.state,
        supplierState: 'ASSIGNED',
        travelerName: params.travelerName,
        travelerPhone: params.travelerPhone,
        travelerEmail: params.travelerEmail,
        passengersCount: hold.passengersCount,
        pickupLocation: params.pickupLocation,
        dropoffLocation: params.dropoffLocation,
        scheduledDate: params.scheduledDate,
        scheduledTime: params.scheduledTime,
        flightNumber: params.flightNumber,
        specialRequests: params.specialRequests,
        confirmationCode,
        assignedResource: {
          driverName: 'Mahmoud Salem',
          driverNameAr: 'محمود سالم',
          driverPhone: '+20 100 876 5432',
          vehicleModel: 'Toyota HiAce Comfort Van 2024 White',
          vehiclePlate: 'ط ج د 4821'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.bookings.push(booking);

      // 4. Create / Update Trip Item
      const trip = db.trips.find(t => t.id === params.tripId);
      const tripItemId = `ITEM-TRF-${Date.now()}`;
      db.tripItems.push({
        id: tripItemId,
        tripId: params.tripId,
        serviceType: 'transfer',
        skuId: hold.skuId,
        title: `${sku.title} (${params.scheduledTime})`,
        dayNumber: 1,
        timeSlot: params.scheduledTime,
        priceEGP: hold.amountEGP,
        status: 'CONFIRMED',
        bookingId: booking.id,
        metadata: {
          pickupLocation: params.pickupLocation,
          dropoffLocation: params.dropoffLocation,
          flightNumber: params.flightNumber
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (trip) {
        trip.totalPaidEGP += hold.amountEGP;
        trip.updatedAt = new Date().toISOString();
      }

      // 5. Create Live Telemetry Entity
      const telemetry: TransferTelemetryEntity = {
        bookingId: booking.id,
        referenceCode: booking.bookingRef,
        driverName: 'Mahmoud Salem',
        driverNameAr: 'محمود سالم',
        driverPhone: '+20 100 876 5432',
        vehicleModel: 'Toyota HiAce Comfort Van 2024 White',
        vehiclePlate: 'ط ج د 4821',
        pickupLocation: params.pickupLocation,
        dropoffLocation: params.dropoffLocation,
        scheduledTime: params.scheduledTime,
        flightNumber: params.flightNumber || 'MS-028',
        flightStatus: 'ON_TIME',
        status: 'DISPATCHED',
        lastGpsUpdate: 'Just now (Terminal meet & greet dispatched)',
        updatedAt: new Date().toISOString()
      };

      db.transferTelemetry.push(telemetry);

      // 6. Notify Supplier and Traveler
      notificationService.sendNotification({
        userId: params.travelerEmail,
        type: 'BOOKING_CREATED',
        title: 'Sharm ↔ Dahab Transfer Confirmed!',
        message: `Your driver Mahmoud Salem is assigned with Toyota HiAce (${telemetry.vehiclePlate}). Meet at ${params.pickupLocation}.`,
        channel: 'WHATSAPP'
      });

      db.logAudit(params.travelerName, 'Traveler', 'BOOKING_COMPLETED', 'Booking', booking.id, {
        bookingRef: booking.bookingRef,
        amountEGP: booking.amountEGP,
        paymentId: paymentResult.payment.id
      });

      return { booking, telemetry };
    });
  }

  public updateSupplierStatus(bookingId: string, supplierState: BookingEntity['supplierState'], resource?: any): BookingEntity {
    const booking = db.bookings.find(b => b.id === bookingId || b.bookingRef === bookingId);
    if (!booking) throw new Error(`Booking ${bookingId} not found`);

    return db.runInTransaction(() => {
      booking.supplierState = supplierState;
      if (resource) {
        booking.assignedResource = { ...booking.assignedResource, ...resource };
      }
      booking.updatedAt = new Date().toISOString();

      const telemetry = db.transferTelemetry.find(t => t.bookingId === booking.id || t.referenceCode === booking.bookingRef);
      if (telemetry) {
        if (supplierState === 'DISPATCHED') telemetry.status = 'DISPATCHED';
        if (supplierState === 'IN_PROGRESS') telemetry.status = 'PASSENGER_PICKED_UP';
        if (supplierState === 'COMPLETED') telemetry.status = 'COMPLETED';
        telemetry.updatedAt = new Date().toISOString();
      }

      db.logAudit('Supplier', 'Supplier', 'BOOKING_STATUS_MUTATED', 'Booking', booking.id, {
        newState: supplierState
      });

      return booking;
    });
  }
}

export const transferService = new TransferService();
