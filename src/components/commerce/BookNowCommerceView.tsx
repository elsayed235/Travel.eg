import React, { useState, useMemo } from 'react';
import { api } from '../../services/api';
import {
  Waves,
  Car,
  Compass,
  Building,
  Coffee,
  Flame,
  Wind,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Receipt,
  QrCode,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Check,
  Luggage,
  Sparkle
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ConfirmedBookingItem, TimelineActivity } from '../../types';
import { IN_DESTINATION_SERVICES, InDestinationServiceOption, BookNowCategory } from './BookNowCommerceModal';
import { INITIAL_LIVE_DAHAB_CONDITIONS } from '../../data/dahabGeography';

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
    setIntendedRoute
  } = useTrip();
  const { language, isRTL } = useLanguage();
  /** Why the instant booking failed, if it did. Shown instead of a voucher. */
  const [instantBookingError, setInstantBookingError] = useState<string | null>(null);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<BookNowCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // Currently configuring service for checkout
  const [activeService, setActiveService] = useState<InDestinationServiceOption | null>(null);

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
        language === 'ar' ? 'سجّل دخولك عشان نكمّل الحجز.' : 'Sign in to complete this booking.'
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
        language === 'ar'
          ? `الخدمة دي لسه مش متاحة للحجز أونلاين. كلّم ${activeService.supplierNameAr} على ${activeService.supplierPhone} مباشرة.`
          : `This service is not bookable online yet. Call ${activeService.supplierName} on ${activeService.supplierPhone} to arrange it directly.`
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
        language === 'ar'
          ? `لم يتم إتمام الحجز: ${err?.message || ''}`
          : `The booking was not completed: ${err?.message || ''}`
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
      showToast(
        language === 'ar'
          ? `تم تأكيد حجز ${activeService.titleAr} بنجاح! رقم القسيمة: ${confirmationCode}`
          : `Booking confirmed for ${activeService.title}! Voucher: ${confirmationCode}`
      );
    }
  };

  return (
    <div
      id="quick-book-commerce-page"
      className="min-h-screen bg-[#FDFBF7] text-[#142126] pb-24 font-['Plus_Jakarta_Sans',sans-serif]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ========================================================================= */}
      {/* 1. MASTER HEADER & ENVIRONMENTAL INTELLIGENCE TICKER                       */}
      {/* ========================================================================= */}
      <section className="bg-[#062C35] text-[#F7F3EA] border-b border-[#20A89A]/20 pt-8 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#20A89A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#E7A83B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#E7D3AE]/80">
              <button
                type="button"
                onClick={() => navigateTo('/home')}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
              </button>
              <span>/</span>
              <span className="text-[#E7A83B] font-bold">
                {language === 'ar' ? 'نظام الحجز الفوري' : 'Instant In-Destination Booking'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('/bookings')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#E7D3AE] hover:text-white text-xs font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-[#E7A83B]" />
                <span>{language === 'ar' ? 'سجل الحجوزات' : 'My Bookings Hub'}</span>
                {bookings.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#E7A83B] text-[#062C35] text-[11px] font-extrabold">
                    {bookings.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Main Title & Value Prop */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#04171D]/60 border border-[#20A89A]/30 text-[#E7A83B] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'خدمات وتجارب دهب الفورية' : 'Dahab Live Commerce & Instant Dispatch'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F7F3EA] tracking-tight font-serif">
                {language === 'ar' ? 'احجز خدماتك في دهب الآن بدون وسيط' : 'Book Local Dahab Services & Trips Instantly'}
              </h1>
              <p className="text-xs sm:text-sm text-[#E7D3AE] leading-relaxed">
                {language === 'ar'
                  ? 'معدات غوص، جيب البلو هول، سفاري وادي قني، وعشاء بدوي تحت النجوم مع أسعار موحدة وحماية بنظام الضمان المالي بدون مخاطرة.'
                  : 'Verified dive gear drop-off, 4x4 canyon transfers, Bedouin desert BBQ, and recovery wellness with guaranteed fixed pricing and local escrow protection.'}
              </p>
            </div>

            {/* Live Environmental Ribbon */}
            <div className="bg-[#04171D]/80 backdrop-blur-md border border-[#20A89A]/30 rounded-2xl p-3.5 sm:p-4 text-xs space-y-2 shrink-0 md:min-w-[280px]">
              <div className="flex items-center justify-between text-[12px] font-bold text-[#E7A83B] border-b border-white/10 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#20A89A] animate-pulse" />
                  {language === 'ar' ? 'حالة الطقس والبحر الحالية' : 'Live Dahab Sea & Wind Radar'}
                </span>
                <span className="text-[#52C4B7]">{INITIAL_LIVE_DAHAB_CONDITIONS.waterTempC}°C Water</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[12px] text-[#F7F3EA]">
                <div>
                  <span className="text-[#E7D3AE]/70 block">{language === 'ar' ? 'سرعة الرياح' : 'Wind Speed'}</span>
                  <span className="font-bold font-mono">{INITIAL_LIVE_DAHAB_CONDITIONS.windSpeedKnots} kts NE</span>
                </div>
                <div>
                  <span className="text-[#E7D3AE]/70 block">{language === 'ar' ? 'الرؤية بالبحر' : 'Visibility'}</span>
                  <span className="font-bold font-mono">{INITIAL_LIVE_DAHAB_CONDITIONS.waterVisibilityMeters}m (Clear)</span>
                </div>
              </div>
              <div className="text-[11px] text-[#52C4B7] font-medium pt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#20A89A]" />
                <span>{language === 'ar' ? 'ضمان الدفع عند الوصول فقط' : 'Zero prepayment risk · Pay upon arrival'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY SELECTOR & SEARCH BAR                                         */}
      {/* ========================================================================= */}
      <section
        aria-label={language === 'ar' ? 'تصفية وبحث الخدمات' : 'Filter and search services'}
        className="bg-white border-b border-[#142126]/10 sticky top-14 sm:top-16 z-30 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#062C35] text-[#F7F3EA] shadow-sm'
                        : 'bg-[#F2ECE1]/60 text-[#142126]/75 hover:bg-[#F2ECE1] hover:text-[#142126]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E7A83B]' : 'text-[#0F6F78]'}`} />
                    <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Availability Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#142126]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={language === 'ar' ? 'ابحث عن خدمة أو موقع' : 'Search services and locations'}
                  placeholder={language === 'ar' ? 'بحث عن خدمة، سائق، أو موقع...' : 'Search gear, 4x4, safari...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F3EA] border border-[#142126]/10 text-xs font-medium text-[#142126] focus:outline-none focus:ring-2 focus:ring-[#0F6F78]/30 focus:border-[#0F6F78]"
                />
              </div>

              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                aria-label={language === 'ar' ? 'تصفية حسب وقت التوفّر' : 'Filter by availability window'}
                className="px-3 py-2 rounded-xl bg-[#F7F3EA] border border-[#142126]/10 text-xs font-bold text-[#142126] focus:outline-none focus:ring-2 focus:ring-[#0F6F78]/30 cursor-pointer"
              >
                <option value="all">{language === 'ar' ? 'جميع الأوقات' : 'All Windows'}</option>
                <option value="Instant Ready">{language === 'ar' ? 'توصيل فوري (١٥ د)' : 'Instant Ready'}</option>
                <option value="Evening Slot">{language === 'ar' ? 'فترة المساء' : 'Evening Slots'}</option>
                <option value="Weather Optimal">{language === 'ar' ? 'حسب ملائمة الرياح' : 'Weather Optimal'}</option>
                <option value="Limited Slots">{language === 'ar' ? 'أماكن محدودة' : 'Limited Slots'}</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN INTERACTIVE CONTENT (SERVICES GRID + CHECKOUT DRAWER)             */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: SERVICE CATALOG CARDS                                    */}
          {/* ===================================================================== */}
          <section
            aria-label={language === 'ar' ? 'الخدمات المتاحة للحجز' : 'Available services'}
            className="lg:col-span-7 xl:col-span-8 space-y-5"
          >
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#142126] font-serif">
                  {language === 'ar' ? 'الخدمات والتجارب المتاحة للحجز الفوري' : 'Instant In-Destination Experiences'}
                </h2>
                <p className="text-xs text-[#142126]/60">
                  {language === 'ar'
                    ? `عرض ${filteredServices.length} من التجارب المعتمدة مع جاهزية التحرك الفوري`
                    : `Showing ${filteredServices.length} verified instant-dispatch options`}
                </p>
              </div>

              {activeService && (
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="text-xs text-[#0F6F78] hover:underline font-bold"
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear Selection'}
                </button>
              )}
            </div>

            {filteredServices.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#142126]/10 space-y-3">
                <Compass className="w-10 h-10 text-[#0F6F78] mx-auto opacity-50" />
                <h3 className="text-base font-bold text-[#142126]">
                  {language === 'ar' ? 'لم يتم العثور على خدمات مطابقة' : 'No matching services found'}
                </h3>
                <p className="text-xs text-[#142126]/60 max-w-sm mx-auto">
                  {language === 'ar' ? 'جرب البحث بكلمات أخرى أو اختر جميع التصنيفات' : 'Try searching with different keywords or reset category filters.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedAvailability('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#062C35] text-white text-xs font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((svc) => {
                  const Icon = svc.icon;
                  const isSelected = activeService?.id === svc.id;

                  return (
                    <div
                      key={svc.id}
                      id={`service-card-${svc.id}`}
                      className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 relative overflow-hidden ${
                        isSelected
                          ? 'border-[#0F6F78] ring-2 ring-[#0F6F78]/20 shadow-lg'
                          : 'border-[#142126]/10 hover:border-[#0F6F78]/40 hover:shadow-md'
                      }`}
                    >
                      {/* Top Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Availability Badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-extrabold uppercase tracking-wider ${
                            svc.availabilityBadge === 'Instant Ready'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : svc.availabilityBadge === 'Weather Optimal'
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{language === 'ar' ? svc.availabilityBadgeAr : svc.availabilityBadge}</span>
                          </span>

                          {/* Pickup Window */}
                          <span className="text-[12px] font-semibold text-[#142126]/60 bg-[#F7F3EA] px-2.5 py-0.5 rounded-full">
                            {language === 'ar' ? svc.pickupWindowAr : svc.pickupWindow}
                          </span>
                        </div>

                        {/* Verified Supplier Tag */}
                        <div className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0F6F78]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#20A89A]" />
                          <span>{language === 'ar' ? svc.supplierNameAr : svc.supplierName}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-[#142126] font-serif leading-snug">
                            {language === 'ar' ? svc.titleAr : svc.title}
                          </h3>
                          <p className="text-xs font-semibold text-[#0F6F78]">
                            {language === 'ar' ? svc.subtitleAr : svc.subtitle}
                          </p>
                          <p className="text-xs text-[#142126]/75 leading-relaxed">
                            {language === 'ar' ? svc.descriptionAr : svc.description}
                          </p>
                        </div>

                        {/* Big Pricing Column */}
                        <div className="bg-[#FDFBF7] border border-[#142126]/10 p-3.5 rounded-2xl text-right sm:text-left shrink-0 min-w-[130px] flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#142126]/50 block">
                              {language === 'ar' ? 'السعر الرسمي' : 'Official Rate'}
                            </span>
                            <span className="text-xl sm:text-2xl font-mono font-bold text-[#062C35] block">
                              {svc.basePriceEGP.toLocaleString()} <span className="text-xs font-bold text-[#0F6F78]">{svc.currency}</span>
                            </span>
                            <span className="text-[11px] text-[#142126]/60 block font-medium">
                              {language === 'ar' ? svc.durationStrAr : svc.durationStr}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectService(svc)}
                            className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                              isSelected
                                ? 'bg-[#0F6F78] text-white'
                                : 'bg-[#062C35] hover:bg-[#0F6F78] text-[#F7F3EA]'
                            }`}
                          >
                            <span>{isSelected ? (language === 'ar' ? 'محدد حالياً' : 'Selected') : (language === 'ar' ? 'احجز فوراً' : 'Book Now')}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Location & Conditions Bar */}
                      <div className="mt-4 pt-3 border-t border-[#142126]/8 flex flex-wrap items-center justify-between gap-3 text-xs text-[#142126]/70">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#E7A83B] shrink-0" />
                          <span>{language === 'ar' ? svc.meetingPointAr : svc.meetingPoint}</span>
                        </div>

                        {svc.weatherConditionCheck && (
                          <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0F6F78] bg-[#0F6F78]/8 px-2.5 py-1 rounded-lg">
                            <Waves className="w-3 h-3 text-[#20A89A]" />
                            <span>{language === 'ar' ? svc.weatherConditionCheckAr : svc.weatherConditionCheck}</span>
                          </div>
                        )}
                      </div>

                      {/* Expandable "What to Bring" Section */}
                      <div className="mt-3 bg-[#F7F3EA]/70 rounded-xl p-2.5 text-[12px] text-[#142126]/80 space-y-1">
                        <span className="font-bold text-[#062C35] block">
                          {language === 'ar' ? 'المطلوب توفيره / الإرشادات:' : 'Required / What to bring:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(language === 'ar' ? svc.whatToBringAr : svc.whatToBring).map((item, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-[#142126]/5">
                              <Check className="w-2.5 h-2.5 text-[#20A89A]" />
                              <span>{item}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </section>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: STICKY INSTANT CHECKOUT & VOUCHER GENERATOR             */}
          {/* ===================================================================== */}
          <section
            id="instant-checkout-panel"
            aria-label={language === 'ar' ? 'لوحة الحجز والدفع' : 'Booking panel'}
            className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-4"
          >
            {/* When a Booking is Just Confirmed */}
            {confirmedBooking ? (
              <div className="bg-[#062C35] text-[#F7F3EA] rounded-3xl p-6 border border-[#20A89A]/30 shadow-2xl space-y-5 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center mx-auto border border-[#20A89A]/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-[#F7F3EA]">
                    {language === 'ar' ? 'تم تأكيد الحجز الفوري!' : 'Instant Booking Confirmed!'}
                  </h3>
                  <p className="text-xs text-[#E7D3AE]">
                    {language === 'ar' ? 'تم إصدار قسيمة الحجز وتنبيه السائق / المزود في دهب.' : 'Voucher dispatched to local Sinai dispatch network.'}
                  </p>
                </div>

                {/* Voucher Card */}
                <div className="bg-[#04171D] rounded-2xl p-4 border border-[#E7A83B]/30 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[#E7D3AE]/70 font-sans text-[12px]">{language === 'ar' ? 'رقم القسيمة' : 'Voucher Ref'}</span>
                    <span className="text-[#E7A83B] font-bold">{confirmedBooking.confirmationCode}</span>
                  </div>
                  <div className="space-y-1 text-[12px] font-sans">
                    <span className="text-white font-bold block text-sm">{confirmedBooking.title}</span>
                    <div className="text-[#E7D3AE] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#20A89A]" />
                      <span>{confirmedBooking.datesOrTime}</span>
                    </div>
                    <div className="text-[#E7D3AE] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E7A83B]" />
                      <span>{confirmedBooking.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[#E7D3AE]/70 font-sans">{language === 'ar' ? 'المبلغ المطلوب' : 'Due at Arrival'}</span>
                    <span className="text-base font-bold text-[#E7A83B]">{confirmedBooking.priceEGP} EGP</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${confirmedBooking.phone?.replace(/\D/g, '') || '201002348899'}?text=Hello%20${encodeURIComponent(confirmedBooking.provider || 'Dahab Support')}%20I%20have%20confirmed%20voucher%20${confirmedBooking.confirmationCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#20A89A] hover:bg-[#1C8D81] text-[#04171D] font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تواصل مع السائق / المركز عبر واتساب' : 'WhatsApp Driver / Guide'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => navigateTo('/my-trip')}
                    className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-[#E7D3AE] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Luggage className="w-3.5 h-3.5 text-[#E7A83B]" />
                    <span>{language === 'ar' ? 'عرض في خطة رحلتي' : 'View in My Trip Itinerary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedBooking(null);
                      setActiveService(null);
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-white/5 text-[#E7D3AE]/70 hover:text-white text-xs font-medium transition-all text-center cursor-pointer"
                  >
                    {language === 'ar' ? 'حجز خدمة أو تجربة أخرى' : 'Book Another Service'}
                  </button>
                </div>
              </div>
            ) : activeService ? (
              /* Active Service Checkout Drawer */
              <div className="bg-white rounded-3xl p-6 border border-[#142126]/10 shadow-xl space-y-5">
                
                {/* Header */}
                <div className="border-b border-[#142126]/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F6F78] bg-[#0F6F78]/10 px-2 py-0.5 rounded-full">
                      {language === 'ar' ? 'إعداد الحجز الفوري' : 'Configure & Book'}
                    </span>
                    <h3 className="text-base font-bold text-[#142126] font-serif mt-1">
                      {language === 'ar' ? activeService.titleAr : activeService.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveService(null)}
                    className="text-xs text-[#142126]/40 hover:text-[#142126] font-bold p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Booking Options Form */}
                <div className="space-y-4 text-xs">
                  
                  {/* Guests Selector */}
                  <div>
                    <label className="font-bold text-[#142126] block mb-1.5">
                      {language === 'ar' ? 'عدد الأفراد / المسافرين' : 'Number of Guests / Travelers'}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestsCount(num)}
                          className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                            guestsCount === num
                              ? 'bg-[#062C35] text-white shadow-xs'
                              : 'bg-[#F7F3EA] text-[#142126]/70 hover:bg-[#ECE4D5]'
                          }`}
                        >
                          {num} {num === 1 ? (language === 'ar' ? 'فرد' : 'Pax') : (language === 'ar' ? 'أفراد' : 'Pax')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timing Option */}
                  <div>
                    <label className="font-bold text-[#142126] block mb-1.5">
                      {language === 'ar' ? 'وقت الانطلاق المطلوب' : 'Preferred Timing'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTimeSlot('immediate')}
                        className={`p-2.5 rounded-xl text-left font-bold transition-all cursor-pointer border ${
                          selectedTimeSlot === 'immediate'
                            ? 'bg-[#0F6F78]/10 border-[#0F6F78] text-[#0F6F78]'
                            : 'bg-[#F7F3EA] border-transparent text-[#142126]/70'
                        }`}
                      >
                        <span className="block text-xs">{language === 'ar' ? 'تحرك فوري الآن' : 'Instant Dispatch'}</span>
                        <span className="block text-[11px] font-normal text-[#142126]/60">
                          {language === 'ar' ? activeService.pickupWindowAr : activeService.pickupWindow}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTimeSlot('sunset')}
                        className={`p-2.5 rounded-xl text-left font-bold transition-all cursor-pointer border ${
                          selectedTimeSlot === 'sunset'
                            ? 'bg-[#0F6F78]/10 border-[#0F6F78] text-[#0F6F78]'
                            : 'bg-[#F7F3EA] border-transparent text-[#142126]/70'
                        }`}
                      >
                        <span className="block text-xs">{language === 'ar' ? 'موعد الغروب / المساء' : 'Sunset / Evening'}</span>
                        <span className="block text-[11px] font-normal text-[#142126]/60">05:00 PM – 07:00 PM</span>
                      </button>
                    </div>
                  </div>

                  {/* Pickup Point Input */}
                  <div>
                    <label className="font-bold text-[#142126] block mb-1.5">
                      {language === 'ar' ? 'مكان الاستلام أو الشاطئ' : 'Pickup / Meeting Location'}
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: فندق كورال كوست أو اللايتهاوس...' : 'e.g., Coral Coast Hotel or Lighthouse arch...'}
                      className="w-full p-2.5 rounded-xl bg-[#F7F3EA] border border-[#142126]/10 text-xs font-medium text-[#142126] focus:outline-none focus:ring-2 focus:ring-[#0F6F78]/30"
                    />
                  </div>

                  {/* If Gear Rental: Shoe Size */}
                  {activeService.category === 'watersports' && (
                    <div>
                      <label className="font-bold text-[#142126] block mb-1.5">
                        {language === 'ar' ? 'مقاس الحذاء الصخري / الزعانف' : 'Booties / Fin Shoe Size'}
                      </label>
                      <input
                        type="text"
                        value={shoeSize}
                        onChange={(e) => setShoeSize(e.target.value)}
                        placeholder="e.g., 42 EU / 9 US"
                        className="w-full p-2 rounded-xl bg-[#F7F3EA] border border-[#142126]/10 text-xs font-medium text-[#142126]"
                      />
                    </div>
                  )}

                  {/* Transparent Price Summary */}
                  <div className="bg-[#F7F3EA] rounded-2xl p-3.5 space-y-2 border border-[#142126]/8">
                    <div className="flex items-center justify-between text-xs text-[#142126]/70">
                      <span>{language === 'ar' ? 'سعر الخدمة للفرد' : 'Base Rate per Pax'}</span>
                      <span className="font-mono font-bold">{activeService.basePriceEGP} EGP</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#142126]/70">
                      <span>{language === 'ar' ? 'عدد الأفراد' : 'Guests Count'}</span>
                      <span className="font-bold">{guestsCount}x</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#142126]/70">
                      <span>{language === 'ar' ? 'رسوم التوصيل والخدمة' : 'Service & Dispatch Fee'}</span>
                      <span className="text-emerald-700 font-bold">{language === 'ar' ? 'مجاني' : 'FREE'}</span>
                    </div>
                    <div className="pt-2 border-t border-[#142126]/10 flex items-center justify-between text-sm font-bold text-[#062C35]">
                      <span>{language === 'ar' ? 'الإجمالي المطلوب' : 'Total Due'}</span>
                      <span className="text-base font-mono text-[#0F6F78] font-extrabold">{calculatedPrice.toLocaleString()} EGP</span>
                    </div>
                  </div>

                  {/* Escrow Guarantee Pill */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === 'ar'
                        ? 'حماية كاملة: الدفع عند وصول السائق أو استلام المعدات فقط بدون أي خصومات مسبقة.'
                        : 'Escrow Guarantee: Zero upfront charge. You inspect equipment & pay directly to the verified provider.'}
                    </span>
                  </div>

                  {/* Confirm CTA Button */}
                  {instantBookingError && (
                    <div role="alert" className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-sm">
                      {instantBookingError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleConfirmInstantBooking}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#062C35] hover:bg-[#0F6F78] text-[#F7F3EA] font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">{language === 'ar' ? 'جاري تأكيد الحجز...' : 'Confirming Booking...'}</span>
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'تأكيد الحجز الفوري وإصدار القسيمة' : 'Confirm & Generate Instant Voucher'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            ) : (
              /* Default Empty State Prompt */
              <div className="bg-white rounded-3xl p-6 border border-[#142126]/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0F6F78]/10 text-[#0F6F78] flex items-center justify-center mx-auto">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#142126] font-serif">
                  {language === 'ar' ? 'اختر خدمة لبدء الحجز' : 'Select a Service to Book'}
                </h3>
                <p className="text-xs text-[#142126]/60 leading-relaxed">
                  {language === 'ar'
                    ? 'اضغط على زر «احجز فوراً» في أي بطاقة لضبط عدد الأفراد، الموعد، ومكان الاستلام بدون أي دفع مقدم.'
                    : 'Click "Book Now" on any experience to configure guests, timing, and pickup location with zero upfront risk.'}
                </p>
                <div className="pt-3 border-t border-[#142126]/8 text-[12px] text-[#0F6F78] font-bold flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'أسعار موحدة ومعتمدة من أهل دهب' : 'Standardized local Dahab rates'}</span>
                </div>
              </div>
            )}

            {/* Quick Support Card */}
            <div className="bg-[#F2ECE1]/70 rounded-2xl p-4 border border-[#142126]/8 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#062C35]">
                <Phone className="w-4 h-4 text-[#0F6F78]" />
                <span>{language === 'ar' ? 'تحتاج مساعدة خاصة أو سيارة فورية؟' : 'Need custom dispatch or group bus?'}</span>
              </div>
              <p className="text-[12px] text-[#142126]/70 leading-normal">
                {language === 'ar'
                  ? 'فريق الدعم الميداني في دهب متاح للتنسيق المباشر عبر واتساب على مدار الساعة.'
                  : 'Sinai local coordinators are available 24/7 for custom expeditions and immediate transport.'}
              </p>
              <a
                href="https://wa.me/201002348899?text=Hello%20Dahab%20Travel%20OS%20Dispatch,%20I%20need%20custom%20assistance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#0F6F78] hover:underline"
              >
                <span>{language === 'ar' ? 'تحدث مع منسق العمليات الآن' : 'Chat with Dahab Field Coordinator'}</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>

          </section>

        </div>

      </div>
    </div>
  );
};
