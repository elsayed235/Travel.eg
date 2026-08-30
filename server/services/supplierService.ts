import crypto from 'crypto';
import { db } from '../db/database';
import { BookingEntity, SupplierEntity } from '../db/schema';
import { ledgerService } from './ledgerService';
import { notificationService } from './notificationService';

export class SupplierService {
  public getSupplierDashboard(supplierId: string): {
    supplier: SupplierEntity | null;
    activeBookings: BookingEntity[];
    pastBookings: BookingEntity[];
    stats: {
      totalBookingsCount: number;
      pendingActionCount: number;
      confirmedCount: number;
      totalEarningsEGP: number;
      escrowPendingEGP: number;
      reliabilityScore: number;
      slaResponseRate: string;
    };
  } {
    const supplier = db.suppliers.find(s => s.id === supplierId) || null;
    const allBookings = db.bookings.filter(b => b.supplierId === supplierId);

    const activeBookings = allBookings.filter(b => b.supplierState !== 'COMPLETED' && b.supplierState !== 'CANCELLED');
    const pastBookings = allBookings.filter(b => b.supplierState === 'COMPLETED' || b.supplierState === 'CANCELLED');

    const totalEarningsEGP = allBookings
      .filter(b => b.supplierState === 'COMPLETED' || b.paymentState === 'CAPTURED')
      .reduce((acc, b) => acc + Math.round(b.amountEGP * 0.85), 0); // 85% supplier payout

    const escrowPendingEGP = activeBookings
      .reduce((acc, b) => acc + Math.round(b.amountEGP * 0.85), 0);

    const pendingActionCount = allBookings.filter(b => b.supplierState === 'PENDING_CONFIRMATION').length;
    const confirmedCount = allBookings.filter(b => b.supplierState === 'CONFIRMED' || b.supplierState === 'DISPATCHED').length;

    return {
      supplier,
      activeBookings,
      pastBookings,
      stats: {
        totalBookingsCount: allBookings.length,
        pendingActionCount,
        confirmedCount,
        totalEarningsEGP,
        escrowPendingEGP,
        reliabilityScore: supplier?.rating || 4.9,
        slaResponseRate: '99.4%'
      }
    };
  }

  // Supplier accepts, rejects, or dispatches resource
  public updateBookingState(params: {
    bookingId: string;
    supplierId: string;
    action: 'ACCEPT' | 'REJECT' | 'DISPATCH' | 'COMPLETE';
    assignedResource?: any;
    reason?: string;
  }): BookingEntity {
    const booking = db.bookings.find(b => b.id === params.bookingId || b.bookingRef === params.bookingId);
    if (!booking) throw new Error(`Booking ${params.bookingId} not found`);

    // Ownership check. Without it, any caller could mark any booking COMPLETE,
    // and COMPLETE writes an 85% SUPPLIER_PAYOUT entry to the ledger — i.e. an
    // arbitrary caller could credit an arbitrary supplier's payable account.
    if (booking.supplierId !== params.supplierId) {
      const err = new Error('This booking belongs to a different supplier.') as Error & { status?: number };
      err.status = 403;
      throw err;
    }

    const now = new Date().toISOString();

    db.runInTransaction(() => {
      if (params.action === 'ACCEPT') {
        booking.supplierState = 'CONFIRMED';
      } else if (params.action === 'DISPATCH') {
        booking.supplierState = 'DISPATCHED';
        if (params.assignedResource) {
          booking.assignedResource = params.assignedResource;
        }
      } else if (params.action === 'COMPLETE') {
        booking.supplierState = 'COMPLETED';
        booking.paymentState = 'CAPTURED';

        // Payout settlement to supplier in ledger
        const payoutAmount = Math.round(booking.amountEGP * 0.85);
        ledgerService.recordDoubleEntry({
          transactionId: `TXN-PAYOUT-${Date.now()}`,
          idempotencyKey: `IDEMP-PAYOUT-${booking.id}`,
          bookingRef: booking.bookingRef,
          tripId: booking.tripId,
          type: 'SUPPLIER_PAYOUT',
          amountEGP: payoutAmount,
          debitAccount: 'PLATFORM_ESCROW_MAIN',
          creditAccount: `SUPPLIER_PAYABLE_${booking.supplierId}`,
          metadata: {
            serviceType: booking.serviceType,
            payoutPercentage: '85%',
            settledAt: now
          }
        });
      } else if (params.action === 'REJECT') {
        booking.supplierState = 'REJECTED';
        booking.specialRequests = `Rejected by supplier: ${params.reason || 'Capacity constraint'}`;
      }

      booking.updatedAt = now;

      // Notification
      notificationService.sendNotification({
        // Was the literal demo traveler, so every supplier status update the
        // platform has ever produced was filed against one account. The owner
        // of the trip this booking belongs to is who it concerns.
        userId: db.trips.find(t => t.id === booking.tripId)?.userId || 'UNATTRIBUTED',
        type: 'SUPPLIER_CONFIRMED',
        channel: 'WHATSAPP',
        title: `Booking Update: ${booking.serviceType.toUpperCase()}`,
        message: `Your booking ${booking.bookingRef} status is now: ${booking.supplierState}.`,
        metadata: { recipientPhone: booking.travelerPhone, bookingRef: booking.bookingRef, supplierState: booking.supplierState }
      });

      db.logAudit(params.supplierId, 'Supplier', 'BOOKING_STATE_MUTATED', 'Booking', booking.id, {
        action: params.action,
        supplierState: booking.supplierState,
        assignedResource: params.assignedResource
      });
    });

    return booking;
  }
}

export const supplierService = new SupplierService();
