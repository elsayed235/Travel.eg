import { db } from '../db/database';
import { BookingEntity, HoldEntity, PaymentEntity, InventorySlotEntity, ProductSkuEntity } from '../db/schema';

export class BookingRepository {
  public getAllBookings(): BookingEntity[] {
    return [...db.bookings];
  }

  public getBookingById(id: string): BookingEntity | undefined {
    return db.bookings.find(b => b.id === id || b.bookingRef === id);
  }

  public getBookingsByTripId(tripId: string): BookingEntity[] {
    return db.bookings.filter(b => b.tripId === tripId);
  }

  public getBookingsBySupplierId(supplierId: string): BookingEntity[] {
    return db.bookings.filter(b => b.supplierId === supplierId);
  }

  public upsertBooking(booking: BookingEntity): BookingEntity {
    const idx = db.bookings.findIndex(b => b.id === booking.id);
    if (idx >= 0) {
      db.bookings[idx] = booking;
    } else {
      db.bookings.unshift(booking);
    }
    db.saveToDisk();
    return booking;
  }

  public getHoldByToken(holdToken: string): HoldEntity | undefined {
    return db.holds.find(h => h.holdToken === holdToken && h.status === 'ACTIVE');
  }

  public upsertHold(hold: HoldEntity): HoldEntity {
    const idx = db.holds.findIndex(h => h.id === hold.id);
    if (idx >= 0) {
      db.holds[idx] = hold;
    } else {
      db.holds.push(hold);
    }
    db.saveToDisk();
    return hold;
  }

  public getSkuById(skuId: string): ProductSkuEntity | undefined {
    return db.productSkus.find(s => s.id === skuId);
  }

  public getInventorySlot(skuId: string, date: string, timeSlot: string): InventorySlotEntity | undefined {
    return db.inventorySlots.find(s => s.skuId === skuId && s.date === date && s.timeSlot === timeSlot);
  }

  public upsertInventorySlot(slot: InventorySlotEntity): InventorySlotEntity {
    const idx = db.inventorySlots.findIndex(s => s.id === slot.id);
    if (idx >= 0) {
      db.inventorySlots[idx] = slot;
    } else {
      db.inventorySlots.push(slot);
    }
    db.saveToDisk();
    return slot;
  }

  public upsertPayment(payment: PaymentEntity): PaymentEntity {
    const idx = db.payments.findIndex(p => p.id === payment.id);
    if (idx >= 0) {
      db.payments[idx] = payment;
    } else {
      db.payments.unshift(payment);
    }
    db.saveToDisk();
    return payment;
  }
}

export const bookingRepository = new BookingRepository();
