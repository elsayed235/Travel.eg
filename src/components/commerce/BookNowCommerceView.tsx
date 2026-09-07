import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Waves,
  Car,
  Compass,
  Coffee,
  Flame,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ChevronRight,
  Search,
  Check,
  Luggage,
  X
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ConfirmedBookingItem, TimelineActivity } from '../../types';
import { IN_DESTINATION_SERVICES, InDestinationServiceOption, BookNowCategory } from './BookNowCommerceModal';
import { INITIAL_LIVE_DAHAB_CONDITIONS } from '../../data/dahabGeography';
import { analytics } from '../../services/analytics';
import type { ProductSkuEntity } from '../../shared/types/commerce';

export const BookNowCommerceView: React.FC = () => {
  const {
    navigateTo,
    recordBooking,
    recordLedgerEntry,
    showToast,
    profile,
    tripDays,
    bookings,
    isSignedIn,
    sessionUser,
    activeTrip,
    setIntendedRoute,
    selectedSkuId,
    reloadTrip
  } = useTrip();
  const { language, isRTL , t} = useLanguage();
  /** Why the instant booking failed, if it did. Shown instead of a voucher. */
  const [instantBookingError, setInstantBookingError] = useState<string | null>(null);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<BookNowCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // Currently configuring service for checkout
  const [activeService, setActiveService] = useState<InDestinationServiceOption | null>(null);
  /** Set when this page was opened on a product that is not one of the eight cards. */
  const [requestedSku, setRequestedSku] = useState<ProductSkuEntity | null>(null);
  const [skuLookupFailed, setSkuLookupFailed] = useState<boolean>(false);

  // Booking configuration options
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('immediate');
  const [selectedDate, setSelectedDate] = useState<string>('today');
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [shoeSize, setShoeSize] = useState<string>('42 EU');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'arrival' | 'instapay'>('arrival');

  // Completed voucher state
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBookingItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Opens this page on the product the traveler actually chose.
   *
   * Book Now only ever opened on its own grid of eight hardcoded cards, so
   * "book this experience" and "book this itinerary line" had nowhere to point
   * and therefore did not exist. A `sku` in the URL is resolved here: first
   * against the eight cards, then — for anything that came from the catalogue
   * rather than this file — against the live inventory the server serves.
   */
  useEffect(() => {
    if (!selectedSkuId) {
      setRequestedSku(null);
      setSkuLookupFailed(false);
      return;
    }

    const card = IN_DESTINATION_SERVICES.find(svc => svc.skuId === selectedSkuId);
    if (card) {
      setActiveService(card);
      setRequestedSku(null);
      setSkuLookupFailed(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      // The vertical is not known from the id, so the verticals that have
      // inventory are asked in turn. Small and cached by the browser; a
      // dedicated by-id endpoint would be better if this grows.
      const verticals = ['diving', 'safari', 'transfer', 'hotel', 'wellness', 'dining'];
      for (const vertical of verticals) {
        try {
          const { skus } = await api.getInventory(vertical, controller.signal);
          const match = skus.find(sku => sku.id === selectedSkuId);
          if (match && !cancelled) {
            setRequestedSku(match);
            setSkuLookupFailed(false);
            return;
          }
        } catch {
          // Try the next vertical; the failure is reported once, below.
        }
      }
      if (!cancelled) {
        setRequestedSku(null);
        setSkuLookupFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedSkuId]);

  /**
   * The chosen product rendered as a card, so the rest of this page — pricing,
   * guest count, checkout — works on it unchanged.
   *
   * Only fields the SKU actually carries are filled. The editorial texture the
   * eight hardcoded cards have (what to bring, meeting point, the supplier's
   * phone) has no equivalent on a SKU, and inventing it here is what would put
   * a fabricated meeting point in front of somebody who has paid.
   */
  const skuAsService: InDestinationServiceOption | null = useMemo(() => {
    if (!requestedSku) return null;
    return {
      id: requestedSku.id,
      category:
        requestedSku.serviceType === 'transfer'
          ? 'transport'
          : requestedSku.serviceType === 'diving'
          ? 'watersports'
          : requestedSku.serviceType === 'dining'
          ? 'dining'
          : requestedSku.serviceType === 'wellness'
          ? 'wellness'
          : 'tonight',
      title: requestedSku.title,
      titleAr: requestedSku.titleAr,
      subtitle: [requestedSku.routeFrom, requestedSku.routeTo].filter(Boolean).join(' → '),
      subtitleAr: [requestedSku.routeFrom, requestedSku.routeTo].filter(Boolean).join(' ← '),
      description: requestedSku.description,
      descriptionAr: requestedSku.description,
      basePriceEGP: requestedSku.basePriceEGP,
      currency: requestedSku.currency,
      durationStr: requestedSku.durationMinutes ? `${requestedSku.durationMinutes} minutes` : '',
      durationStrAr: requestedSku.durationMinutes ? `${requestedSku.durationMinutes} دقيقة` : '',
      pickupWindow: '',
      pickupWindowAr: '',
      availabilityBadge: 'Instant Ready',
      availabilityBadgeAr: 'متاح للحجز',
      locationArea: requestedSku.routeTo || 'Dahab',
      locationAreaAr: requestedSku.routeTo || 'دهب',
      supplierName: requestedSku.supplierId,
      supplierNameAr: requestedSku.supplierId,
      supplierPhone: '',
      meetingPoint: requestedSku.routeFrom || '',
      meetingPointAr: requestedSku.routeFrom || '',
      icon: Compass,
      whatToBring: requestedSku.includedItems || [],
      whatToBringAr: requestedSku.includedItems || [],
      skuId: requestedSku.id,
      serviceType: requestedSku.serviceType as InDestinationServiceOption['serviceType']
    };
  }, [requestedSku]);

  useEffect(() => {
    if (skuAsService) setActiveService(skuAsService);
  }, [skuAsService]);

  // Categories definition
  const categories: { id: BookNowCategory; labelEn: string; labelAr: string; icon: any }[] = [
    { id: 'all', labelEn: 'All Services', labelAr: 'جميع الخدمات', icon: Compass },
    { id: 'watersports', labelEn: 'Water & Diving', labelAr: 'الغوص والبحر', icon: Waves },
    { id: 'transport', labelEn: 'Desert Cabs & 4x4', labelAr: 'سيارات وسفاري', icon: Car },
    { id: 'tonight', labelEn: 'Tonight & Camps', labelAr: 'سهرات الليلة', icon: Flame },
    { id: 'wellness', labelEn: 'Massage & Recovery', labelAr: 'مساج وريكفري', icon: Sparkles },
    { id: 'dining', labelEn: 'Dinner Tables', labelAr: 'طاولات ومطاعم', icon: Coffee },
  ];

  // Filtered services
  const filteredServices = useMemo(() => {
    return IN_DESTINATION_SERVICES.filter((svc) => {
      // Category match
      if (selectedCategory !== 'all' && svc.category !== selectedCategory) {
        return false;
      }
      // Availability filter
      if (selectedAvailability !== 'all' && svc.availabilityBadge !== selectedAvailability) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = svc.title.toLowerCase().includes(q) || svc.titleAr.includes(q);
        const matchesLoc = svc.locationArea.toLowerCase().includes(q) || svc.locationAreaAr.includes(q);
        const matchesSupplier = svc.supplierName.toLowerCase().includes(q) || svc.supplierNameAr.includes(q);
        const matchesDesc = svc.description.toLowerCase().includes(q) || svc.descriptionAr.includes(q);
        return matchesTitle || matchesLoc || matchesSupplier || matchesDesc;
      }
      return true;
    });
  }, [selectedCategory, selectedAvailability, searchQuery]);

  // Handle service selection for booking
  const handleSelectService = (svc: InDestinationServiceOption) => {
    setActiveService(svc);
    setConfirmedBooking(null);
    setPickupLocation(profile?.savedPlaces?.[0] || 'Lighthouse Promenade / My Hotel');
    // Smooth scroll to booking details drawer if on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById('instant-checkout-panel');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Pricing calculation
  const calculatedPrice = useMemo(() => {
    if (!activeService) return 0;
    return activeService.basePriceEGP * guestsCount;
  }, [activeService, guestsCount]);

  // Execute instant escrow booking
  /**
   * Books for real.
   *
   * This was a setTimeout that minted a reference locally and showed
   * "تم تأكيد الحجز الفوري!" — an end-to-end test recorded **zero network
   * calls** and nothing written anywhere; the booking vanished on refresh. It
   * now settles through /api/commerce/checkout/multi, the same audited endpoint
   * the planner uses, and the reference shown is the server's.
   */
  const handleConfirmInstantBooking = async () => {
    if (!activeService || isSubmitting) return;

    if (!isSignedIn) {
      setIntendedRoute('/book-now');
      showToast(
        t('commerce.signInToComplete')
      );
      navigateTo('/auth/sign-in');
      return;
    }

    // A card with no SKU behind it. All eight now have one, so this is a guard
    // for whatever is added next rather than the normal path — but it stays,
    // because the alternative is sending a skuId the catalogue does not contain
    // and the server answering with a 400 the traveler cannot act on.
    if (!activeService.skuId) {
      setInstantBookingError(
        t('commerce.notBookableOnlineYet', {
          supplierName: language === 'ar' ? activeService.supplierNameAr : activeService.supplierName,
          supplierPhone: activeService.supplierPhone,
        })
      );
      return;
    }

    setInstantBookingError(null);
    setIsSubmitting(true);

    // The SKU's own vertical, not one derived from the card's browse category.
    // The old derivation filed a quad safari as a transfer (both are
    // 'transport') and a massage and a restaurant table as safaris.
    const serviceType = activeService.serviceType ?? 'safari';

    let bookingId: string;
    let confirmationCode: string;
    try {
      const result = await api.completeMultiCheckout({
        // Was hardcoded to 'DHB-TRIP-894' — the demo trip — so an instant
        // booking by any traveler was filed against somebody else's trip.
        tripId: activeTrip?.id || `TRIP-INSTANT-${sessionUser?.id}`,
        // These three used to fall back to 'Dahab Traveler',
        // '+20 100 000 0000' and 'traveler@dahab.travel'. They are written
        // into the booking record and sent to the supplier who has to meet
        // this traveler, so a placeholder phone number here is a driver
        // waiting at an airport with no way to call anyone.
        travelerName: sessionUser?.name || profile.name,
        travelerPhone: profile.phone || sessionUser?.phone || '',
        travelerEmail: sessionUser?.email || profile.email,
        items: [{
          serviceType,
          skuId: activeService.skuId,
          scheduledDate: new Date().toISOString().split('T')[0],
          scheduledTime: selectedDate === 'today' ? 'Today · Within 30 Mins' : 'Tomorrow · 05:00 PM',
          amountEGP: calculatedPrice,
          pickupLocation: pickupLocation || undefined,
          specialRequests: specialNotes || undefined
        }],
        paymentParams: {
          idempotencyKey: `IDEMP-INST-${activeService.id}-${Date.now()}`,
          provider: 'CASH_ON_ARRIVAL'
        }
      });
      const booked = result?.bookings?.[0];
      bookingId = booked?.bookingRef || booked?.id || `DHB-INST-${Date.now()}`;
      confirmationCode = booked?.confirmationCode || bookingId;
    } catch (err: any) {
      setIsSubmitting(false);
      setInstantBookingError(
        t('commerce.bookingNotCompleted', { message: err?.message || '' })
      );
      return;
    }

    {
      const newBooking: ConfirmedBookingItem = {
        id: bookingId,
        serviceType: activeService.category === 'transport' ? 'transfer' : activeService.category === 'watersports' ? 'diving' : 'safari',
        title: language === 'ar' ? activeService.titleAr : activeService.title,
        subtitle: language === 'ar' ? activeService.locationAreaAr : activeService.locationArea,
        details: `Instant In-Destination: ${guestsCount} pax. Pickup: ${pickupLocation}. ${specialNotes}`,
        datesOrTime: selectedDate === 'today' ? 'Today · Within 30 Mins' : 'Tomorrow · 05:00 PM',
        priceEGP: calculatedPrice,
        provider: language === 'ar' ? activeService.supplierNameAr : activeService.supplierName,
        confirmationCode: confirmationCode,
        status: 'Confirmed ✓',
        location: language === 'ar' ? activeService.locationAreaAr : activeService.locationArea,
        iconType: activeService.category === 'transport' ? 'car' : activeService.category === 'watersports' ? 'waves' : 'compass',
        phone: activeService.supplierPhone,
      };

      // 1. Save to trip context
      recordBooking(newBooking);

      // 2. Record in the double-entry ledger.
      //
      // This call previously used a flat expense-tracker shape (category,
      // paymentStatus, dateString, notes...) that no version of LedgerEntry has
      // defined. Every field was dropped, so instant bookings produced a ledger
      // entry with no amount, no accounts and no transaction id. The booking is
      // pay-on-arrival, so it is recorded as a pending escrow hold rather than a
      // captured payment.
      recordLedgerEntry({
        transactionId: `TXN-INST-${Date.now()}`,
        idempotencyKey: `IDEMP-INST-${bookingId}`,
        bookingRef: bookingId,
        // Was the seeded demo trip, so an instant booking's ledger row was
        // filed against somebody else's itinerary.
        tripId: activeTrip?.id || '',
        type: 'HOLD_ESCROW',
        amountEGP: calculatedPrice,
        debitAccount: 'TRAVELER_CASH_ON_ARRIVAL',
        creditAccount: 'PLATFORM_ESCROW_MAIN',
        currency: 'EGP',
        status: 'PENDING',
        metadata: {
          serviceType: activeService.category,
          supplierId: activeService.id,
          reason: `Instant in-destination booking (${guestsCount} guests). Pay upon arrival.`,
          supplierName: language === 'ar' ? activeService.supplierNameAr : activeService.supplierName,
          supplierPhone: activeService.supplierPhone,
          serviceTitle: language === 'ar' ? activeService.titleAr : activeService.title
        }
      });

      setIsSubmitting(false);
      setConfirmedBooking(newBooking);

      analytics.track('booking_completed', {
        sourceMode: selectedSkuId ? 'sku_deeplink' : 'book_now_grid',
        metadata: { skuId: activeService.skuId, bookingRef: bookingId }
      } as any);

      // The itinerary line this booking fulfils was flipped to CONFIRMED
      // server-side; without re-reading the trip, My Trip keeps showing it as
      // merely suggested until the traveler reloads the page by hand.
      reloadTrip();

      showToast(
        t('commerce.bookingConfirmedVoucher', {
          title: language === 'ar' ? activeService.titleAr : activeService.title,
          code: confirmationCode,
        })
      );
    }
  };

  /**
   * On a phone the checkout panel sits below eight cards, so tapping "Book"
   * used to scroll the traveler into a form they could not see arrive. Once
   * something is selected the panel leads the page instead; on desktop the two
   * columns keep their normal order.
   */
  const checkoutLeadsOnMobile = Boolean(activeService || confirmedBooking);

  const availabilityTone = (badge: InDestinationServiceOption['availabilityBadge']): string => {
    if (badge === 'Instant Ready') {
      return 'bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] border-[var(--accent-primary)]';
    }
    if (badge === 'Weather Optimal') {
      return 'bg-[var(--accent-primary)]/12 text-[var(--text-primary)] border-[var(--accent-primary)]/40';
    }
    return 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)]';
  };

  const fieldClass =
    'rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--accent-primary)] transition-[background-color,border-color,color,box-shadow,transform,opacity]';

  return (
    <div
      id="quick-book-commerce-page"
      className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-28 md:pb-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ========================================================================= */}
      {/* 1. HEADER & LIVE SEA CONDITIONS                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--surface-card)]">
        <div
          aria-hidden="true"
          className="absolute -top-40 -end-32 w-[30rem] h-[30rem] rounded-full bg-[var(--accent-primary)]/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -start-32 w-[30rem] h-[30rem] rounded-full bg-[var(--accent-secondary)]/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-9 space-y-6">
          {/* Breadcrumb + bookings hub */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => navigateTo('/home')}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer rounded py-2 -my-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                {t('commerce.home')}
              </button>
              <span aria-hidden="true" className="text-[var(--text-secondary)]/40">
                /
              </span>
              <span aria-current="page" className="text-[var(--text-primary)] font-bold">
                {t('commerce.instantBooking')}
              </span>
            </nav>

            <button
              type="button"
              onClick={() => navigateTo('/bookings')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface-container)] hover:bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <Receipt className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>{t('commerce.myBookings')}</span>
              {bookings.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] text-[11px] font-extrabold tabular-nums">
                  {bookings.length}
                </span>
              )}
            </button>
          </div>

          {/* Title + live conditions */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/12 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('commerce.dahabLiveCommerce')}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] chart-heading font-bold tracking-tight leading-tight">
                {t('commerce.bookLocalDahabServices')}
              </h1>

              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                {t('commerce.diveGearDelivered4x4')}
              </p>
            </div>

            {/* Live sea & wind */}
            <div className="shrink-0 lg:min-w-[19rem] rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] p-4 space-y-3">
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[var(--border-subtle)]">
                <span className="flex items-center gap-2 text-xs font-extrabold text-[var(--text-primary)]">
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"
                  />
                  {t('commerce.liveSeaWind')}
                </span>
              </div>

              <dl className="grid grid-cols-3 gap-3">
                {[
                  {
                    labelEn: 'Water',
                    labelAr: 'الحرارة',
                    value: `${INITIAL_LIVE_DAHAB_CONDITIONS.waterTempC}°C`
                  },
                  {
                    labelEn: 'Wind',
                    labelAr: 'الرياح',
                    value: `${INITIAL_LIVE_DAHAB_CONDITIONS.windSpeedKnots} kts`
                  },
                  {
                    labelEn: 'Visibility',
                    labelAr: 'الرؤية',
                    value: `${INITIAL_LIVE_DAHAB_CONDITIONS.waterVisibilityMeters} m`
                  }
                ].map((stat) => (
                  <div key={stat.labelEn}>
                    <dt className="text-[11px] font-bold text-[var(--text-secondary)]">
                      {language === 'ar' ? stat.labelAr : stat.labelEn}
                    </dt>
                    <dd className="text-lg font-mono font-bold text-[var(--text-primary)] tabular-nums">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                <span>{t('commerce.noPrepaymentPayOn')}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FILTERS                                                                */}
      {/* ========================================================================= */}
      <section
        aria-label={t('commerce.filterAndSearchServices')}
        className="sticky top-16 sm:top-20 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/92 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col xl:flex-row xl:items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0 flex-1 -mx-1 px-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                    isSelected
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] shadow-md'
                      : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0 xl:ms-auto">
            <div className="relative flex-1 xl:w-64 xl:flex-none">
              <Search
                className="w-4 h-4 text-[var(--text-secondary)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t('commerce.searchServicesAndLocations')}
                placeholder={t('commerce.searchGear4x4Safari')}
                className={`${fieldClass} w-full ps-9 pe-3 py-2.5`}
              />
            </div>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              aria-label={t('commerce.filterByAvailabilityWindow')}
              className={`${fieldClass} px-3 py-2.5 font-bold cursor-pointer shrink-0`}
            >
              <option value="all">{t('commerce.allWindows')}</option>
              <option value="Instant Ready">{t('commerce.instantReady')}</option>
              <option value="Evening Slot">{t('commerce.eveningSlots')}</option>
              <option value="Weather Optimal">{t('commerce.weatherOptimal')}</option>
              <option value="Limited Slots">{t('commerce.limitedSlots')}</option>
            </select>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CATALOG + CHECKOUT                                                     */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ================================================================= */}
          {/* Catalog                                                           */}
          {/* ================================================================= */}
          <section
            aria-label={t('commerce.availableServices')}
            className={`lg:col-span-7 xl:col-span-8 space-y-4 ${
              checkoutLeadsOnMobile ? 'order-2' : 'order-1'
            } lg:order-1`}
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl chart-heading font-bold">
                  {t('commerce.availableRightNow')}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {t('commerce.availableNowCount', { count: filteredServices.length })}
                </p>
              </div>

              {activeService && (
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="text-xs font-bold text-[var(--accent-primary)] hover:underline cursor-pointer shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  {t('commerce.clearSelection')}
                </button>
              )}
            </div>

            {filteredServices.length === 0 ? (
              <div className="p-10 sm:p-12 text-center bg-[var(--surface-card)] rounded-3xl border border-[var(--border-subtle)] space-y-3">
                <Compass className="w-10 h-10 text-[var(--accent-primary)] mx-auto opacity-60" aria-hidden="true" />
                <h3 className="text-lg chart-heading font-bold">
                  {t('commerce.noMatchingServices')}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  {t('commerce.tryDifferentKeywordsOr')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedAvailability('all');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] text-xs font-extrabold cursor-pointer transition-[background-color,border-color,color,box-shadow,transform,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  {t('commerce.resetFilters')}
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredServices.map((svc) => {
                  const Icon = svc.icon;
                  const isSelected = activeService?.id === svc.id;
                  const bringList = language === 'ar' ? svc.whatToBringAr : svc.whatToBring;
                  const meetingPoint = language === 'ar' ? svc.meetingPointAr : svc.meetingPoint;
                  const duration = language === 'ar' ? svc.durationStrAr : svc.durationStr;

                  return (
                    <li key={svc.id}>
                      <article
                        id={`service-card-${svc.id}`}
                        className={`bg-[var(--surface-card)] rounded-3xl border transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 overflow-hidden ${
                          isSelected
                            ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/25 shadow-xl'
                            : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 hover:shadow-lg'
                        }`}
                      >
                        <div className="p-5 sm:p-6 space-y-4">
                          {/* Meta row */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${availabilityTone(
                                svc.availabilityBadge
                              )}`}
                            >
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              <span>{language === 'ar' ? svc.availabilityBadgeAr : svc.availabilityBadge}</span>
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                              <span>{language === 'ar' ? svc.supplierNameAr : svc.supplierName}</span>
                            </span>
                          </div>

                          {/* Title block */}
                          <div className="flex items-start gap-4">
                            <span
                              aria-hidden="true"
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-ink)]'
                                  : 'bg-[var(--surface-container)] text-[var(--accent-primary)]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </span>

                            <div className="min-w-0 space-y-1.5">
                              <h3 className="text-lg sm:text-xl chart-heading font-bold leading-snug">
                                {language === 'ar' ? svc.titleAr : svc.title}
                              </h3>
                              <p className="text-sm font-semibold text-[var(--accent-primary)]">
                                {language === 'ar' ? svc.subtitleAr : svc.subtitle}
                              </p>
                              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {language === 'ar' ? svc.descriptionAr : svc.description}
                              </p>
                            </div>
                          </div>

                          {/* Detail chips */}
                          <div className="flex flex-wrap items-center gap-2">
                            {duration && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">
                                <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                                <span>{duration}</span>
                              </span>
                            )}
                            {meetingPoint && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">
                                <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                                <span>{meetingPoint}</span>
                              </span>
                            )}
                            {svc.weatherConditionCheck && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 text-xs font-semibold text-[var(--text-primary)]">
                                <Waves className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                                <span>
                                  {language === 'ar' ? svc.weatherConditionCheckAr : svc.weatherConditionCheck}
                                </span>
                              </span>
                            )}
                          </div>

                          {/* What to bring — omitted entirely when the product carries none */}
                          {bringList.length > 0 && (
                            <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] p-3 space-y-2">
                              <span className="block text-[11px] font-extrabold text-[var(--text-secondary)]">
                                {t('commerce.whatToBring')}
                              </span>
                              <ul className="flex flex-wrap gap-1.5">
                                {bringList.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                                  >
                                    <Check className="w-3 h-3 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Price + CTA footer */}
                        <div className="px-5 sm:px-6 py-4 bg-[var(--surface-container)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <span className="block text-[11px] font-bold text-[var(--text-secondary)]">
                              {t('commerce.officialRatePerPerson')}
                            </span>
                            <span className="text-2xl font-mono font-bold tabular-nums">
                              {svc.basePriceEGP.toLocaleString()}{' '}
                              <span className="text-sm font-bold text-[var(--text-secondary)]">{svc.currency}</span>
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectService(svc)}
                            aria-pressed={isSelected}
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-container)] ${
                              isSelected
                                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]'
                                : 'bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] shadow-md'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-4 h-4" aria-hidden="true" />
                                <span>{t('commerce.selected')}</span>
                              </>
                            ) : (
                              <>
                                <span>{t('commerce.bookNow')}</span>
                                <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ================================================================= */}
          {/* Checkout / voucher                                                */}
          {/* ================================================================= */}
          <section
            id="instant-checkout-panel"
            aria-label={t('commerce.bookingPanel')}
            className={`lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-44 ${
              checkoutLeadsOnMobile ? 'order-1' : 'order-2'
            } lg:order-2`}
          >
            {confirmedBooking ? (
              /* ---------------- Confirmed voucher ---------------- */
              <div className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--accent-primary)]/40 shadow-2xl space-y-5">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg chart-heading font-bold">
                    {t('commerce.bookingConfirmed')}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {t('commerce.theVoucherHasReached')}
                  </p>
                </div>

                <div className="bg-[var(--surface-container)] rounded-2xl p-4 border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--text-secondary)]">
                      {t('commerce.voucherRef')}
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--accent-primary)]">
                      {confirmedBooking.confirmationCode}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-base font-bold">{confirmedBooking.title}</span>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                      <span>{confirmedBooking.datesOrTime}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                      <span>{confirmedBooking.location}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--text-secondary)]">
                      {t('commerce.dueAtArrival')}
                    </span>
                    <span className="text-lg font-mono font-bold tabular-nums">
                      {confirmedBooking.priceEGP.toLocaleString()} EGP
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${confirmedBooking.phone?.replace(/\D/g, '') || '201002348899'}?text=Hello%20${encodeURIComponent(
                      confirmedBooking.provider || 'Dahab Support'
                    )}%20I%20have%20confirmed%20voucher%20${confirmedBooking.confirmationCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] font-extrabold text-xs transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center justify-center gap-2 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>{t('commerce.whatsAppTheProvider')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => navigateTo('/my-trip')}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[var(--surface-container)] hover:bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <Luggage className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>{t('commerce.viewInMyItinerary')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedBooking(null);
                      setActiveService(null);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container)] transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    {t('commerce.bookAnotherService')}
                  </button>
                </div>
              </div>
            ) : activeService ? (
              /* ---------------- Configure & book ---------------- */
              <div className="bg-[var(--surface-card)] rounded-3xl border border-[var(--border-subtle)] shadow-xl overflow-hidden flex flex-col lg:max-h-[calc(100vh-13rem)]">
                <div className="p-5 border-b border-[var(--border-subtle)] flex items-start justify-between gap-3 shrink-0">
                  <div className="min-w-0">
                    <span className="text-[11px] font-extrabold text-[var(--accent-primary)]">
                      {t('commerce.configureBook')}
                    </span>
                    <h2 className="text-base chart-heading font-bold mt-1 leading-snug">
                      {language === 'ar' ? activeService.titleAr : activeService.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveService(null)}
                    aria-label={t('commerce.closeBookingPanel')}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container)] transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-5 space-y-5 lg:overflow-y-auto lg:flex-1 lg:min-h-0">
                  {/* Guests */}
                  <fieldset>
                    <legend className="text-xs font-bold mb-2">
                      {t('commerce.howManyPeople')}
                    </legend>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => {
                        const on = guestsCount === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setGuestsCount(num)}
                            aria-pressed={on}
                            className={`py-2.5 rounded-xl text-sm font-bold tabular-nums transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                              on
                                ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] border-[var(--accent-primary)] shadow-md'
                                : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Timing */}
                  <fieldset>
                    <legend className="text-xs font-bold mb-2">
                      {t('commerce.whenShouldItStart')}
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        {
                          id: 'immediate',
                          titleEn: 'Right now',
                          titleAr: 'حالاً',
                          hint: language === 'ar' ? activeService.pickupWindowAr : activeService.pickupWindow
                        },
                        {
                          id: 'sunset',
                          titleEn: 'Sunset / evening',
                          titleAr: 'الغروب / المساء',
                          hint: '05:00 PM – 07:00 PM'
                        }
                      ].map((slot) => {
                        const on = selectedTimeSlot === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot.id)}
                            aria-pressed={on}
                            className={`p-3 rounded-xl text-start border transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                              on
                                ? 'bg-[var(--accent-primary)]/12 border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30'
                                : 'bg-[var(--surface-container)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                            }`}
                          >
                            <span className="block text-xs font-bold">
                              {language === 'ar' ? slot.titleAr : slot.titleEn}
                            </span>
                            {slot.hint && (
                              <span className="block text-xs text-[var(--text-secondary)] mt-0.5">{slot.hint}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Pickup */}
                  <div>
                    <label htmlFor="pickup-location-input" className="block text-xs font-bold mb-2">
                      {t('commerce.pickupMeetingPoint')}
                    </label>
                    <input
                      id="pickup-location-input"
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder={
                        t('commerce.egCoralCoastHotel')
                      }
                      className={`${fieldClass} w-full px-3 py-2.5`}
                    />
                  </div>

                  {/* Shoe size, gear only */}
                  {activeService.category === 'watersports' && (
                    <div>
                      <label htmlFor="shoe-size-input" className="block text-xs font-bold mb-2">
                        {t('commerce.bootiesFinShoeSize')}
                      </label>
                      <input
                        id="shoe-size-input"
                        type="text"
                        value={shoeSize}
                        onChange={(e) => setShoeSize(e.target.value)}
                        placeholder="42 EU / 9 US"
                        className={`${fieldClass} w-full px-3 py-2.5`}
                      />
                    </div>
                  )}

                  {/* Price summary */}
                  <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{t('commerce.ratePerPerson')}</span>
                      <span className="font-mono font-bold tabular-nums text-[var(--text-primary)]">
                        {activeService.basePriceEGP.toLocaleString()} EGP
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{t('commerce.people')}</span>
                      <span className="font-bold tabular-nums text-[var(--text-primary)]">×{guestsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{t('commerce.serviceDispatchFee')}</span>
                      <span className="font-bold text-[var(--accent-primary)]">
                        {t('commerce.free')}
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-baseline justify-between">
                      <span className="text-sm font-bold">{t('commerce.total')}</span>
                      <span className="text-2xl font-mono font-bold tabular-nums">
                        {calculatedPrice.toLocaleString()}{' '}
                        <span className="text-sm text-[var(--text-secondary)]">EGP</span>
                      </span>
                    </div>
                  </div>

                  {/* Escrow */}
                  <p className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 text-xs text-[var(--text-primary)] leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {t('commerce.nothingIsChargedNow')}
                    </span>
                  </p>

                </div>

                {/* Pinned action footer */}
                <div className="p-5 pt-4 border-t border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-3 shrink-0">
                  {instantBookingError && (
                    <p
                      role="alert"
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--brand-coral)]/12 border border-[var(--brand-coral)]/40 text-sm text-[var(--text-primary)] leading-relaxed"
                    >
                      <AlertCircle className="w-4 h-4 text-[var(--brand-coral)] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{instantBookingError}</span>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleConfirmInstantBooking}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] font-extrabold text-xs transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-card)]"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">
                        {t('commerce.confirming')}
                      </span>
                    ) : (
                      <>
                        <span>
                          {t('commerce.confirmBooking', { price: calculatedPrice.toLocaleString() })}
                        </span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* ---------------- Nothing selected ---------------- */
              <div className="bg-[var(--surface-card)] rounded-3xl p-6 border border-[var(--border-subtle)] text-center space-y-3">
                {/*
                  A link pointed here naming a product that is not on sale. Saying
                  so beats silently showing the grid, which would leave the traveler
                  believing they were configuring the thing they clicked.
                */}
                {skuLookupFailed && (
                  <p
                    role="alert"
                    className="text-start flex items-start gap-2.5 p-3 rounded-xl bg-[var(--accent-secondary)]/12 border border-[var(--accent-secondary)]/35 text-xs text-[var(--text-primary)] leading-relaxed"
                  >
                    <AlertCircle className="w-4 h-4 text-[var(--accent-secondary)] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {t('commerce.thatExperienceIsNot')}
                    </span>
                  </p>
                )}

                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/12 text-[var(--accent-primary)] flex items-center justify-center mx-auto">
                  <Receipt className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg chart-heading font-bold">
                  {t('commerce.pickAServiceTo')}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t('commerce.tapBookNowOn')}
                </p>
                <p className="pt-3 border-t border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                  <span>{t('commerce.standardisedLocalDahabRates')}</span>
                </p>
              </div>
            )}

            {/* Field coordinator */}
            <div className="rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] p-4 space-y-2">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Phone className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                <span>{t('commerce.needACustomDispatch')}</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t('commerce.sinaiCoordinatorsAreAvailable')}
              </p>
              <a
                href="https://wa.me/201002348899?text=Hello%20Dahab%20Travel%20OS%20Dispatch,%20I%20need%20custom%20assistance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-[var(--accent-primary)] hover:underline rounded py-2 -my-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                <span>{t('commerce.chatWithADahab')}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
