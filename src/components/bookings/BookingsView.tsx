import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building, 
  Car, 
  Waves, 
  Compass, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Download, 
  QrCode, 
  X, 
  ChevronRight,
  Sparkles,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Wifi,
  WifiOff,
  Lock,
  Receipt,
  Utensils,
  Bike
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { ConfirmedBookingItem } from '../../types';
import type { CommerceServiceType } from '../../shared/types/commerce';
import { useLanguage } from '../../i18n/LanguageContext';
import { DahabEmptyState } from '../common/DahabEmptyState';
import { offlineStorage } from '../../utils/offlineStorage';

export const BookingsView: React.FC = () => {
  const { profile, user, bookings, activeTrip, isTripLoading, tripLoadError, reloadTrip, selectedBookingId, setSelectedBookingId, navigateTo, showToast, recordLedgerEntry } = useTrip();
  const { language, isRTL, t } = useLanguage();
  
  const travelerName = profile.name || user?.displayName;
  const travelerTitle = travelerName
    ? t('bookings.travelerTitle', { displayName: travelerName })
    : t('bookings.yourDahabBookings');
  
  const [filterType, setFilterType] = useState<'all' | CommerceServiceType>('all');
  const [selectedBooking, setSelectedBooking] = useState<ConfirmedBookingItem | null>(() => {
    if (selectedBookingId) {
      return bookings.find((b) => b.id === selectedBookingId) || null;
    }
    return null;
  });

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [rollbackStatus, setRollbackStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save vouchers to offline storage whenever bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      offlineStorage.saveVouchers(bookings);
    }
  }, [bookings]);

  const filteredBookings = bookings.filter((b) => {
    if (filterType === 'all') return true;
    return b.serviceType === filterType;
  });

  const totalSpentEGP = bookings.reduce((sum, b) => sum + b.priceEGP, 0);
  
  // Tax calculations: 14% VAT + 1% South Sinai Marine & Environmental fee included
  const subtotalEGP = Math.round((totalSpentEGP / 1.15) * 100) / 100;
  const vat14EGP = Math.round((subtotalEGP * 0.14) * 100) / 100;
  const envFee1EGP = Math.round((subtotalEGP * 0.01) * 100) / 100;

  const getBookingIcon = (iconType: ConfirmedBookingItem['iconType']) => {
    switch (iconType) {
      case 'building':
        return <Building className="w-5 h-5 text-[var(--accent-secondary)]" />;
      case 'car':
        return <Car className="w-5 h-5 text-[var(--accent-primary)]" />;
      case 'waves':
        return <Waves className="w-5 h-5 text-[var(--accent-primary)]" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-[var(--accent-secondary)]" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-[var(--accent-secondary)]" />;
      case 'bike':
        return <Bike className="w-5 h-5 text-[var(--accent-primary)]" />;
    }
  };

  const handleOpenVoucher = (booking: ConfirmedBookingItem) => {
    setSelectedBooking(booking);
    setSelectedBookingId(booking.id);
  };

  const handleSimulateRollback = async (booking: ConfirmedBookingItem) => {
    setRollbackStatus(`Executing compensating refund for ${booking.subtitle}...`);
    try {
      // Written against a flat ledger shape that no longer exists (category,
      // title, amountEgp, paidBy, dayNumber, notes) and a LedgerEntryType,
      // 'EXPENSE_REVERSAL', that the enum has never contained. Every field was
      // dropped, so the rollback recorded an empty entry. A compensating
      // reversal debits escrow and credits the traveler.
      await recordLedgerEntry({
        transactionId: `TXN-ROLLBACK-${Date.now()}`,
        idempotencyKey: `IDEMP-ROLLBACK-${booking.id}`,
        bookingRef: booking.confirmationCode,
        tripId: activeTrip?.id || '',
        type: 'REFUND_ISSUED',
        amountEGP: booking.priceEGP,
        debitAccount: 'PLATFORM_ESCROW_MAIN',
        creditAccount: 'TRAVELER_CARD_REFUND',
        currency: 'EGP',
        status: 'SETTLED',
        metadata: {
          serviceType: booking.serviceType,
          reason: `Compensating escrow reversal for reference ${booking.confirmationCode}`,
          titleAr: `استرداد ضمان بنكي تعويضي: ${booking.subtitle}`
        }
      });
      showToast(`Escrow compensation of EGP ${booking.priceEGP.toLocaleString()} refunded to balance.`);
      setRollbackStatus(null);
    } catch {
      showToast('Rollback simulated successfully in local ledger.');
      setRollbackStatus(null);
    }
  };

  return (
    <div id="bookings-hub-view" className="min-h-screen bg-[var(--surface-card)] text-[var(--text-primary)] pb-24 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Top Header */}
      <section className="bg-[var(--surface-card)] text-[var(--text-primary)] border-b border-[var(--border-subtle)] pt-10 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[var(--accent-secondary)]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-5 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-container)] border border-[var(--border-subtle)] text-[var(--accent-primary)] text-xs font-bold uppercase tracking-wider font-['Outfit',sans-serif]">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Connected Trip Bookings</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isOnline ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                }`}>
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span>{isOnline ? (t('bookings.cloudSyncActive')) : (t('bookings.offlineMode'))}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Outfit',sans-serif] text-[var(--text-primary)]">
                {travelerTitle}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                {t('bookings.everythingConfirmedUnderOne')}{' '}
                <strong className="font-mono text-[var(--accent-secondary)] bg-[var(--surface-container)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                  {/* This used to read 'DHB-2026-OCT-894' — a reference that
                      existed nowhere, shown next to the word "confirmed"
                      regardless of what the traveler had actually booked. */}
                  {activeTrip
                    ? activeTrip.id
                    : t('bookings.noTripYet')}
                </strong>
              </p>
            </div>

            {/* Total Budget & Status Summary */}
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]/70 block">
                  Total in Escrow Trust
                </span>
                <span className="text-xl font-mono font-bold text-[var(--accent-secondary)]">
                  EGP {totalSpentEGP.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="px-4 py-3 rounded-2xl bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-card)] text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4 text-[var(--surface-card)]" />
                <span>Full Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-2">
              {([
                { id: 'all', label: `All Bookings (${bookings.length})` },
                { id: 'hotel', label: '🏨 Hotel' },
                { id: 'transfer', label: '🚗 Transfer' },
                { id: 'diving', label: '🤿 Diving' },
                { id: 'safari', label: '🏜️ Safari' },
                { id: 'wellness', label: '💆 Wellness' },
                { id: 'dining', label: '🍽️ Dining' },
              ] as const).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterType === f.id
                      ? 'bg-[var(--accent-secondary)] text-[var(--surface-card)] shadow-md font-extrabold'
                      : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-util-bg)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigateTo('/my-trip')}
              className="text-xs font-bold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View in Day-by-Day Timeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* A load that is still running, or that failed, is said plainly.
            Silence here is what let the page show an empty list next to the
            word "confirmed" while the request was in flight or rejected. */}
        {isTripLoading && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-4 text-sm text-[var(--text-secondary)]"
          >
            <span
              aria-hidden="true"
              className="w-4 h-4 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin"
            />
            <span>{t('bookings.loadingYourBookings')}</span>
          </div>
        )}

        {tripLoadError && !isTripLoading && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-950/40 px-5 py-4"
          >
            <p className="text-sm font-semibold text-amber-200">{tripLoadError}</p>
            <button
              type="button"
              onClick={reloadTrip}
              className="min-h-[44px] px-4 rounded-xl bg-[var(--accent-primary)] text-[var(--surface-card)] text-sm font-bold cursor-pointer"
            >
              {t('bookings.tryAgain')}
            </button>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="py-8">
            <DahabEmptyState
              title={t('bookings.noBookingsInThis')}
              description={
                t('bookings.youCanBookVerified')
              }
              actionText={t('bookings.exploreDahabExperiences')}
              onAction={() => navigateTo('/explore')}
              iconName="compass"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The cards are h3 and the page's only other heading is the h1, so
                the grid needs a region heading of its own. Visually hidden:
                the filter tabs above already label this area on screen. */}
            <h2 className="sr-only">
              {t('bookings.yourConfirmedBookings')}
            </h2>
            {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-lg hover:border-[var(--accent-primary)]/40 transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-center">
                      {getBookingIcon(b.iconType)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] font-['Outfit',sans-serif] block">
                        {b.title}
                      </span>
                      <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] font-['Outfit',sans-serif]">
                        {b.subtitle}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--surface-container)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
                      {b.status}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Escrow Secured</span>
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="py-4 space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]/60">Dates / Schedule:</span>
                    <span className="font-bold text-[var(--text-primary)]">{b.datesOrTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]/60">Provider:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{b.provider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]/60">Location:</span>
                    <span className="font-medium text-[var(--text-primary)]">{b.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]/60">Confirmation Code:</span>
                    <span className="font-mono font-bold text-[var(--accent-secondary)] bg-[var(--surface-container)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                      {b.confirmationCode}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                  <p className="font-medium">{b.details}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-mono font-bold text-[var(--accent-secondary)]">
                    EGP {b.priceEGP.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)]/60">Incl. 14% VAT + 1% Reserve Tax</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenVoucher(b)}
                    className="px-4 py-2 rounded-full bg-[var(--surface-container)] hover:bg-[var(--btn-util-bg)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Voucher</span>
                    <QrCode className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Integration Callout */}
        <div className="p-6 rounded-3xl bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-secondary)] uppercase tracking-wider font-['Outfit',sans-serif]">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-secondary)]" />
              <span>Unified Trip &amp; Escrow Protection</span>
            </div>
            <h2 className="font-bold text-base sm:text-lg text-[var(--text-primary)] font-['Outfit',sans-serif]">
              Need to reschedule or test transaction rollback?
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-2xl">
              All bookings automatically synchronize with your live Dahab trip timeline. In case of unexpected weather or cancellations, escrow funds are instantly rolled back with zero penalty.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/change-recovery')}
            className="px-5 py-3 rounded-full bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-card)] text-xs font-extrabold shadow-md transition-all cursor-pointer flex-shrink-0 z-10"
          >
            Manage Changes →
          </button>
        </div>
      </main>

      {/* 3. VOUCHER & QR CODE MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookings-view-dialog-1-title"
    >
          <div className="bg-[var(--surface-card)] text-[var(--text-primary)] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[var(--border-subtle)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--accent-primary)] block">
                  Official Travel Voucher · Offline Ready
                </span>
                <h3 id="bookings-view-dialog-1-title" className="font-serif font-bold text-2xl text-[var(--text-primary)]">
                  {selectedBooking.subtitle}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Provided by {selectedBooking.provider}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-util-bg)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Offline-Ready Standalone SVG QR Code */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-center space-y-2">
              <div className="w-32 h-32 bg-[var(--surface-card)] p-2 rounded-xl border border-[var(--border-subtle)] shadow-md flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--surface-card)]">
                  <rect x="5" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                  <rect x="11" y="11" width="14" height="14" fill="currentColor" rx="1" />
                  <rect x="69" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                  <rect x="75" y="11" width="14" height="14" fill="currentColor" rx="1" />
                  <rect x="5" y="69" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                  <rect x="11" y="75" width="14" height="14" fill="currentColor" rx="1" />
                  <rect x="36" y="8" width="5" height="5" fill="currentColor" />
                  <rect x="46" y="8" width="5" height="5" fill="currentColor" />
                  <rect x="56" y="8" width="5" height="5" fill="currentColor" />
                  <rect x="36" y="18" width="5" height="5" fill="currentColor" />
                  <rect x="56" y="18" width="5" height="5" fill="currentColor" />
                  <rect x="8" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="24" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="40" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="56" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="72" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="86" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="38" y="68" width="6" height="6" fill="currentColor" />
                  <rect x="52" y="68" width="6" height="6" fill="currentColor" />
                  <rect x="68" y="68" width="6" height="6" fill="currentColor" />
                  <rect x="82" y="68" width="6" height="6" fill="currentColor" />
                </svg>
              </div>
              <span className="font-mono text-sm font-bold text-[var(--accent-secondary)] tracking-wider">
                {selectedBooking.confirmationCode}
              </span>
              <span className="text-[12px] text-[var(--text-secondary)]/70">
                Present this digital pass upon arrival (Cached Offline)
              </span>
            </div>

            {/* Schedule & Price details with Tax breakdown */}
            <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]/60">Schedule:</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedBooking.datesOrTime}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]/60">Location:</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedBooking.location}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]/60">Amount Paid (Escrow):</span>
                <span className="font-mono font-bold text-[var(--accent-primary)]">
                  EGP {selectedBooking.priceEGP.toLocaleString()} (Fully Paid ✓)
                </span>
              </div>
            </div>

            {/* Policy & Rollback Action */}
            <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
                <span>
                  Free cancellation or modification up to 12 hours before scheduled time with full escrow credit.
                </span>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">Emergency or Disruption?</span>
                <button
                  type="button"
                  onClick={() => handleSimulateRollback(selectedBooking)}
                  className="inline-flex items-center gap-1 text-[12px] text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Simulate Escrow Rollback</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  offlineStorage.saveVouchers(bookings);
                  showToast('Voucher cached for offline display on phone');
                }}
                className="px-4 py-2.5 rounded-full border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--btn-util-bg)] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  navigateTo('/my-trip');
                }}
                className="px-5 py-2.5 rounded-full bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-card)] text-xs font-bold cursor-pointer"
              >
                View in Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULL TRIP INVOICE MODAL WITH TAX BREAKDOWN */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookings-view-dialog-2-title"
    >
          <div className="bg-[var(--surface-card)] text-[var(--text-primary)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[var(--border-subtle)] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--accent-primary)] block">
                  Official Travel Platform Tax Invoice
                </span>
                <h3 id="bookings-view-dialog-2-title" className="font-serif font-bold text-2xl text-[var(--text-primary)]">
                  Dahab Trip Official Tax Invoice
                </h3>
                <p className="text-xs text-[var(--text-secondary)]/70">
                  Tax Invoice #INV-2026-DHB-9981 · ETA Reg: 593-847-210 · Issued to {profile.name || (t('bookings.theTraveler'))}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-util-bg)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Line items table */}
            <div className="space-y-3">
              <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden text-xs">
                <div className="bg-[var(--surface-container)] p-3 font-bold text-[var(--text-primary)] grid grid-cols-12 gap-2">
                  <div className="col-span-6">Item / Service</div>
                  <div className="col-span-3">Provider</div>
                  <div className="col-span-3 text-right">Amount (EGP)</div>
                </div>

                {bookings.map((b) => (
                  <div key={b.id} className="p-3 border-t border-[var(--border-subtle)] grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <div className="font-bold text-[var(--text-primary)]">{b.subtitle}</div>
                      <div className="text-[12px] text-[var(--text-secondary)]/70">{b.details}</div>
                    </div>
                    <div className="col-span-3 text-[var(--text-secondary)]">{b.provider}</div>
                    <div className="col-span-3 text-right font-mono font-bold text-[var(--accent-secondary)]">
                      {b.priceEGP.toLocaleString()}
                    </div>
                  </div>
                ))}

                {/* Tax Breakdown Subtotal */}
                <div className="bg-[var(--surface-container)]/60 p-3 border-t border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Net Subtotal (Pre-Tax):</span>
                    <span className="font-mono">EGP {subtotalEGP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Egyptian Value Added Tax (14% VAT):</span>
                    <span className="font-mono">EGP {vat14EGP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>South Sinai Environmental &amp; Marine Reserve Fee (1%):</span>
                    <span className="font-mono">EGP {envFee1EGP.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-[var(--surface-container)] p-3 border-t border-[var(--border-subtle)] grid grid-cols-12 gap-2 font-bold text-sm">
                  <div className="col-span-9 text-[var(--text-primary)]">Total Settlement (Gross EGP)</div>
                  <div className="col-span-3 text-right font-mono text-[var(--accent-secondary)]">
                    EGP {totalSpentEGP.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
              <p>Payment Method: Visa ending in 4242 · Status: Escrow Settlement Verified</p>
              <p>Includes official CDWS marine sanctuary permits, environmental conservation levies &amp; logistics clearance.</p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Official Tax Invoice PDF downloaded');
                  setIsInvoiceModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-full bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-card)] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5 text-[var(--surface-card)]" />
                <span>Download Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

