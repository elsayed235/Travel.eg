import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Building,
  Car,
  Waves,
  Compass,
  Check,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Copy,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Smartphone,
  Mail,
  User,
  HeartHandshake,
  QrCode,
  Send,
  Zap,
  MessageSquare
} from 'lucide-react';
import {
  HotelOption,
  TransferOption,
  DivingOption,
  SafariOption
} from './bookingData';
import { BookingReviewTermsModal } from './BookingReviewTermsModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { formatTripDateRange } from '../../utils/tripDates';
import { api } from '../../services/api';

interface BookingPaymentStepProps {
  selectedHotel: HotelOption | null;
  selectedTransfer: TransferOption | null;
  selectedDiving: DivingOption | null;
  selectedSafari: SafariOption | null;
  flightNumber?: string;
  divingDay?: number;
  divingTime?: string;
  safariDay?: number;
  safariTime?: string;
  onBackToReview: () => void;
  onViewMyTrip?: () => void;
}

export const BookingPaymentStep: React.FC<BookingPaymentStepProps> = ({
  selectedHotel,
  selectedTransfer,
  selectedDiving,
  selectedSafari,
  flightNumber = '',
  divingDay = 2,
  divingTime = '09:00 AM',
  safariDay = 3,
  safariTime = '02:00 PM',
  onBackToReview,
  onViewMyTrip,
}) => {
  const { language, isRTL, t } = useLanguage();
  const { recordLedgerEntry, showToast, navigateTo, setIntendedRoute, isSignedIn, sessionUser, profile, activeTrip, arePaymentsSimulated } = useTrip();
  // Payment Method Selection: 'card' (default) | 'wallet' | 'instapay' | 'arrival' | 'cash'
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'instapay' | 'arrival' | 'cash'>('card');
  const [cardGateway, setCardGateway] = useState<'PAYMOB' | 'STRIPE'>('PAYMOB');
  const [walletProvider, setWalletProvider] = useState<'vodafone' | 'orange' | 'etisalat' | 'wepay'>('vodafone');
  const [walletPhone, setWalletPhone] = useState<string>('01001234567');
  const [instapayAddress, setInstapayAddress] = useState<string>('sherif.dahab@instapay');

  // Card form. Deliberately empty.
  //
  // These four fields used to arrive pre-filled with 'Sherif Ahmed',
  // '1234 5678 9012 3456', '09 / 28' and CVV '842'. A payment form that opens
  // holding a card number invites a traveler to submit it without noticing it
  // is not theirs, and it is the reason a walkthrough of this flow could reach
  // the pay button without anyone entering a card at all.
  // The party size the traveler actually configured. Was "2 Adults (Ahmed &
  // Companion)" for everyone, including a solo traveler.
  const travelers = activeTrip?.travelersCount ?? profile.travelersCount ?? 1;
  const travelersLabel =
    language === 'ar'
      ? `${travelers} ${travelers === 1 ? 'بالغ' : 'بالغين'}`
      : `${travelers} ${travelers === 1 ? 'Adult' : 'Adults'}`;

  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');

  // Billing details, pre-filled from the traveler's own session record rather
  // than from a fictional 'sherif.ahmed@example.com'.
  const [billingName, setBillingName] = useState<string>(profile.name || sessionUser?.name || '');
  const [billingEmail, setBillingEmail] = useState<string>(profile.email || sessionUser?.email || '');
  const [billingPhone, setBillingPhone] = useState<string>(profile.phone || sessionUser?.phone || '');

  // Terms agreement
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  /**
   * Why the settlement failed, if it did.
   *
   * Before this, the catch below logged "settled locally" and the component
   * then set isConfirmed(true) unconditionally. An end-to-end test signed out
   * produced two 401s from /api/commerce/checkout and the traveller was still
   * shown "Confirmed ✓" with a booking reference that existed nowhere.
   */
  const [settlementError, setSettlementError] = useState<string | null>(null);
  // Removed: `smsDispatched`, which defaulted to true and was never read after
  // the client-side SMS dispatch above was taken out.

  // Success view details toggle & share modal
  const [showDetailsVoucher, setShowDetailsVoucher] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Price calculations
  const hotelPrice = selectedHotel ? selectedHotel.priceTotalEGP : 7500;
  const transferPrice = selectedTransfer ? selectedTransfer.priceEGP : 1200;
  const divingPrice = selectedDiving ? selectedDiving.pricePerPersonEGP * travelers : 3000;
  const safariPrice = selectedSafari ? selectedSafari.pricePerPersonEGP * travelers : 2800;
  const totalTripPrice = hotelPrice + transferPrice + divingPrice + safariPrice;

  /**
   * The traveler's own trip.
   *
   * Two literals used to stand in for it: every money path filed against
   * 'DHB-TRIP-894' (the seeded demo trip), so a booking, its payment and its
   * ledger rows all attached to somebody else's itinerary; and the confirmation
   * screen displayed 'DHB-8942-SINA', a reference that existed nowhere.
   *
   * A traveler reaching this screen has a trip — the planner created one and
   * sign-in is required before booking — so this is their id. The fallback is
   * empty rather than a demo id: an empty reference on screen is a visible
   * problem, a plausible wrong one is not.
   */
  const tripId = activeTrip?.id || '';
  const bookingTripId = tripId;

  const handlePayAndConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms || isProcessing) return;

    setIsProcessing(true);

    try {
      const idempotencyKey = `IDEMP-PAY-${Date.now()}`;
      let holdToken: string | undefined;
      const holdRaw = sessionStorage.getItem('current_transfer_hold');
      if (holdRaw) {
        try {
          const parsed = JSON.parse(holdRaw);
          holdToken = parsed.holdToken;
        } catch {}
      }

      const paymentProvider = paymentMethod === 'card' ? cardGateway : paymentMethod === 'wallet' ? 'PAYMOB' : 'CASH_ON_ARRIVAL';

      // Authoritative backend checkout settlement
      await api.completeCheckout({
        holdToken,
        tripId: bookingTripId,
        travelerName: billingName,
        travelerPhone: billingPhone,
        travelerEmail: billingEmail,
        pickupLocation: 'Sharm El Sheikh Intl Airport (SSH) Terminal 1',
        dropoffLocation: selectedHotel ? selectedHotel.name : 'Dahab Bay Hotel',
        flightNumber: flightNumber || 'MS-028',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '10:30 AM',
        idempotencyKey,
        // Only the last four digits leave the browser. The full PAN, expiry and
        // CVV must never reach our API — a real integration replaces these
        // fields with a hosted gateway iframe and sends its token instead.
        cardLast4: paymentMethod === 'card' ? cardNumber.replace(/\D/g, '').slice(-4) : undefined,
        cardBrand: paymentMethod === 'card' ? cardGateway : undefined,
        cardHolderName: paymentMethod === 'card' ? cardholderName : billingName,
        provider: paymentProvider,
        amountEGP: totalTripPrice,
        serviceType: 'multi_service',
        supplierId: 'SUP-SHUTTLE-01'
      });

      /*
        Removed: two SMS dispatches fired from the browser on every checkout.

        The first texted a hardcoded number, +20 100 876 5432, addressed to
        "Mahmoud Salem (Driver)" — a driver nobody had assigned, at a number
        written into this file — telling them a transfer was confirmed. The
        second told the traveler "Driver assigned", which was not true either:
        a booking now starts at PENDING_CONFIRMATION and carries no assignment
        until the supplier accepts it.

        Neither could have worked in any case. /api/sms/* is restricted to
        Operations and Admin, so a traveler's call returns 403 — and the failure
        was swallowed into a console warning while `setSmsDispatched(true)`
        never ran. Supplier dispatch belongs on the server, after checkout, to
        the supplier the SKU actually resolves to.
      */

      // Update local ledger
      const debitAccount = paymentMethod === 'card'
        ? `TRAVELER_CARD_${cardNumber.slice(-4)}`
        : paymentMethod === 'wallet'
        ? `TRAVELER_WALLET_${walletProvider.toUpperCase()}`
        : paymentMethod === 'instapay'
        ? `INSTAPAY_IPA_${instapayAddress.split('@')[0]}`
        : 'TRAVELER_CASH_ON_ARRIVAL';

      recordLedgerEntry({
        transactionId: `TXN-${Date.now().toString().slice(-6)}-PAY`,
        idempotencyKey,
        bookingRef: `DHB-TRIP-2026-${Math.floor(100 + Math.random() * 900)}`,
        tripId: bookingTripId,
        type: 'PAYMENT_CAPTURED',
        amountEGP: totalTripPrice,
        debitAccount,
        creditAccount: 'PLATFORM_ESCROW_MAIN',
        currency: 'EGP',
        status: 'SETTLED',
        metadata: {
          serviceType: 'all',
          travelerName: billingName,
          method: paymentMethod,
          gateway: cardGateway,
          reason: `Full Trip Checkout Settlement (${selectedHotel?.name || 'Hotel'}, Transfer, Diving, Safari)`
        }
      });
      // Only now, with the backend having actually settled, is this confirmed.
      setIsProcessing(false);
      setIsConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setIsProcessing(false);
      const message = String(err?.message || '');
      setSettlementError(
        /401|Sign in|Authentication/i.test(message)
          ? (isRTL
              ? 'محتاج تسجّل دخولك قبل إتمام الدفع. حجزك محفوظ — سجّل دخولك وحاول تاني.'
              : 'You need to sign in before paying. Your selections are kept — sign in and try again.')
          : (isRTL
              ? `تعذّر إتمام الدفع: ${message}. لم يتم خصم أي مبلغ.`
              : `The payment could not be completed: ${message}. Nothing was charged.`)
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShareClick = () => {
    navigator.clipboard?.writeText?.(`https://dahab.travel/trip/${tripId}`);
    setCopiedLink(true);
    setShowShareToast(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 3000);
  };

  /* ========================================================================
     SUCCESS STATE (Trip Confirmed)
     ======================================================================== */
  if (isConfirmed) {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] font-['Plus_Jakarta_Sans',sans-serif] pb-28 lg:pb-16 animate-in fade-in duration-300"
      >
        {/* Top Minimal Dahab Bar */}
        <header className="bg-white border-b border-[#1A1A1A]/10 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold text-sm">
                D
              </div>
              <div>
                <span className="text-[11px] font-black tracking-widest uppercase text-[#5A5A40] block">
                  DAHAB
                </span>
                <span className="text-xs font-bold text-[#1A1A1A]">
                  {language === 'ar' ? 'تأكيد حجز الرحلة' : 'Trip Confirmation'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ar' ? 'رحلتك مؤكدة ✓' : 'Confirmed ✓'}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
          {/* 1. HERO SUCCESS BANNER */}
          <div
            id="confirmation-hero-banner"
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-800 ring-8 ring-emerald-50 mb-1 shadow-sm">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {language === 'ar' ? 'رحلتك لدهب اتأكدت خلاص! 🎉' : 'Your Dahab trip is confirmed! 🎉'}
              </h1>
              <p className="text-sm sm:text-base text-[#1A1A1A]/75 max-w-xl mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'كل حاجة جاهزة، ورتبنالك كل الحجوزات في جدول رحلة واحد مريح.'
                  : "Everything is ready. We've organized your bookings into one trip."}
              </p>
            </div>

            {arePaymentsSimulated && (
              <div
                role="note"
                className="max-w-xl mx-auto rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3"
              >
                <p className="text-sm text-amber-900 leading-relaxed">
                  {language === 'ar'
                    ? 'ملاحظة مهمة: مفيش أي مبلغ اتخصم من كارتك. الحجز اتسجّل ووصل للمزوّد، والدفع بيتم معاه مباشرة.'
                    : 'Important: your card was not charged. The booking is recorded and has gone to the provider — you pay them directly.'}
                </p>
              </div>
            )}

            <div className="inline-flex items-center gap-2 bg-white border border-[#1A1A1A]/10 px-4 py-1.5 rounded-full text-xs text-[#1A1A1A]/70 shadow-2xs font-mono">
              <span>{language === 'ar' ? 'كود الرحلة:' : 'Trip ID:'}</span>
              <span className="font-bold text-[#1A1A1A]">{tripId}</span>
            </div>
          </div>

          {/* 2. ONE TRIP MAIN UNIFIED CONTAINER */}
          <div
            id="confirmed-trip-card"
            className="bg-white rounded-3xl border border-[#1A1A1A]/10 shadow-sm overflow-hidden"
          >
            {/* Visual Cover Header */}
            <div className="relative h-44 sm:h-52 w-full bg-[#1A1A1A]/10">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1200&auto=format&fit=crop"
                alt="Dahab turquoise sea and coastal mountains"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  id="share-trip-header-btn"
                  onClick={handleShareClick}
                  className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] text-xs font-bold backdrop-blur-md shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>{language === 'ar' ? 'شارك الرحلة' : 'Share Trip'}</span>
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <span>{language === 'ar' ? 'رحلتي' : 'My Trip'}</span>
                  <span>•</span>
                  <span>{language === 'ar' ? 'دهب، جنوب سيناء' : 'Dahab, South Sinai'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-0.5">
                  Dahab · 5 Days
                </h2>
                <p className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                  5 days · 2 travelers · 4 coordinated services
                </p>
              </div>
            </div>

            {/* Trip Status Bar */}
            <div className="p-4 sm:p-5 bg-[#FDFBF7] border-b border-[#1A1A1A]/8 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[#1A1A1A]/50 block text-[12px]">{language === 'ar' ? 'الحالة' : 'Status'}</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>Confirmed ✓</span>
                  </span>
                </div>

                <div className="h-6 w-px bg-[#1A1A1A]/10" />

                <div>
                  <span className="text-[#1A1A1A]/50 block text-[12px]">{language === 'ar' ? 'المسافرون' : 'Travelers'}</span>
                  <span className="font-bold text-[#1A1A1A]">{travelersLabel}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[#1A1A1A]/50 block text-[12px]">{language === 'ar' ? 'الإجمالي المؤكَّد' : 'Total Paid / Confirmed'}</span>
                <span className="text-sm font-black text-[#1A1A1A]">
                  EGP {totalTripPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Confirmed Services List (Clean & Unified to Same Trip) */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#5A5A40]">
                  {language === 'ar' ? 'الخدمات المؤكَّدة (كلها في جدول واحد)' : 'Confirmed Services (All in One Itinerary)'}
                </h3>
                <span className="text-xs text-emerald-800 font-semibold">
                  {language === 'ar' ? 'بتنسيق كونسيرج دهب' : 'Coordinated by Dahab Concierge'}
                </span>
              </div>

              <div className="space-y-3">
                {/* 01 HOTEL */}
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 flex items-start justify-between gap-3 hover:border-[#1A1A1A]/20 transition-all">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1A1A1A]">
                          {selectedHotel ? selectedHotel.name : 'Dahab Bay Hotel'}
                        </h4>
                        <span className="text-[12px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                          Confirmed ✓
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70">
                        {selectedHotel ? selectedHotel.location : 'Lighthouse Area, Dahab'} · 5 nights
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 text-xs font-bold text-[#1A1A1A]">
                    EGP {hotelPrice.toLocaleString()}
                  </div>
                </div>

                {/* 02 TRANSFER */}
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 flex items-start justify-between gap-3 hover:border-[#1A1A1A]/20 transition-all">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Car className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1A1A1A]">
                          {selectedTransfer ? selectedTransfer.title : 'Private Car'}
                        </h4>
                        <span className="text-[12px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                          Confirmed ✓
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70">
                        Sharm El Sheikh Airport → Dahab Hotel {flightNumber ? `· Flight ${flightNumber}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 text-xs font-bold text-[#1A1A1A]">
                    EGP {transferPrice.toLocaleString()}
                  </div>
                </div>

                {/* 03 DIVING */}
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 flex items-start justify-between gap-3 hover:border-[#1A1A1A]/20 transition-all">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Waves className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1A1A1A]">
                          {selectedDiving ? selectedDiving.title : 'Guided Diving Experience'}
                        </h4>
                        <span className="text-[12px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                          Confirmed ✓
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70">
                        Day {divingDay} · {divingTime} · 2 Divers
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 text-xs font-bold text-[#1A1A1A]">
                    EGP {divingPrice.toLocaleString()}
                  </div>
                </div>

                {/* 04 SAFARI */}
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 flex items-start justify-between gap-3 hover:border-[#1A1A1A]/20 transition-all">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1A1A1A]">
                          {selectedSafari ? selectedSafari.title : 'Desert Safari'}
                        </h4>
                        <span className="text-[12px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                          Confirmed ✓
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70">
                        Day {safariDay} · {safariTime} · 2 Guests
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 text-xs font-bold text-[#1A1A1A]">
                    EGP {safariPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Expandable Booking Details / Voucher */}
              <div className="pt-3">
                <button
                  type="button"
                  id="toggle-booking-details-btn"
                  onClick={() => setShowDetailsVoucher(!showDetailsVoucher)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white border border-[#1A1A1A]/10 text-xs font-bold text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showDetailsVoucher ? 'Hide Booking Details' : 'View Booking Details & Provider References'}</span>
                  {showDetailsVoucher ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showDetailsVoucher && (
                  <div className="mt-3 p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 text-xs text-[#1A1A1A]/80 space-y-2.5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <span className="text-[#1A1A1A]/50 text-[12px] block">{language === 'ar' ? 'المسافر الأساسي' : 'Lead Traveler'}</span>
                        <span className="font-semibold text-[#1A1A1A]">{billingName || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[#1A1A1A]/50 text-[12px] block">{language === 'ar' ? 'البريد الإلكتروني' : 'Contact Email'}</span>
                        <span className="font-semibold text-[#1A1A1A]">sherif.ahmed@example.com</span>
                      </div>
                      <div>
                        <span className="text-[#1A1A1A]/50 text-[12px] block">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</span>
                        <span className="font-semibold text-[#1A1A1A]">
                          {/* Was hardcoded to '•••• 3456' — the digits of the
                              fake card this form used to arrive pre-filled with. */}
                          {paymentMethod === 'card'
                            ? `${language === 'ar' ? 'بطاقة' : 'Card'} ${cardNumber ? `•••• ${cardNumber.replace(/\D/g, '').slice(-4)}` : ''}`.trim()
                            : paymentMethod === 'arrival'
                              ? language === 'ar' ? 'الدفع عند الوصول' : 'Pay on arrival'
                              : language === 'ar' ? 'كاش' : 'Cash'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#1A1A1A]/50 text-[12px] block">{language === 'ar' ? 'رقم الحجز الداخلي' : 'Internal Booking Token'}</span>
                        {/* Was the literal 'DHB-VCH-8942-AUTH' on every booking. */}
                        <span className="font-mono text-[#5A5A40] font-bold">{tripId || '—'}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#1A1A1A]/8 text-[12px] text-[#1A1A1A]/60">
                      {language === 'ar'
                        ? 'كل قسائم المزوّدين متجمّعة تحت حساب رحلتك. مش محتاج تطبع أي حاجة.'
                        : 'All provider vouchers are unified under your Dahab Trip account. No paper printouts needed upon arrival.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. CONFIRMATION MESSAGE & INTRODUCING NEXT PHASE */}
            <div className="p-6 sm:p-7 bg-[#5A5A40]/10 border-t border-[#5A5A40]/20 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                <h4 className="text-base font-serif font-bold text-[#1A1A1A]">
                  {language === 'ar' ? 'رحلتك بقت شغّالة.' : 'Your trip is now live.'}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                We'll keep your bookings, schedule, updates, and important information together here.
              </p>

              {/*
                Removed: a green badge reading "Twilio SMS Alerts Dispatched",
                "Driver (Mahmoud) & Dive Center received instant booking
                manifests" and a DELIVERED pill. This component sends no SMS —
                /api/sms/* is Operations-only and answers a traveler with 403,
                so it could not have — and the driver it named is the same
                invented one the booking record used to carry. Supplier dispatch
                is the supplier's acceptance step, and the booking now correctly
                starts at PENDING_CONFIRMATION until that happens.
              */}
              <div className="p-3.5 rounded-2xl bg-[#5A5A40]/5 border border-[#5A5A40]/20 flex items-center gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-[#1A1A1A]/80 leading-relaxed">
                  {language === 'ar'
                    ? 'الحجز راح للمزوّد، وهتوصلك رسالة أول ما يأكّده.'
                    : 'Your booking has gone to the provider. You will hear from us as soon as they confirm it.'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. PRIMARY & SECONDARY ACTIONS */}
          <div className="space-y-3 pt-2 text-center">
            <button
              type="button"
              id="view-my-trip-btn"
              onClick={() => {
                if (onViewMyTrip) {
                  onViewMyTrip();
                } else {
                  alert('Transitioning to My Trip workspace (next phase).');
                }
              }}
              className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-full bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-bold text-sm sm:text-base transition-all shadow-md active:scale-98 inline-flex items-center justify-center gap-2.5 cursor-pointer mx-auto"
            >
              <span>{language === 'ar' ? 'افتح رحلتي' : 'View My Trip'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div>
              <button
                type="button"
                id="share-trip-bottom-btn"
                onClick={handleShareClick}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] hover:text-[#1A1A1A] transition-colors py-2 px-4 rounded-full hover:bg-white cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Trip Link Copied! ✓' : 'Share Trip with Companion'}</span>
              </button>
            </div>
          </div>

          {/* Share notification toast */}
          {showShareToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Trip link copied to clipboard! Share it with your companion.</span>
            </div>
          )}
        </main>
      </div>
    );
  }

  /* ========================================================================
     PAYMENT & FINAL BOOKING SCREEN (Before Confirming)
     ======================================================================== */
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] font-['Plus_Jakarta_Sans',sans-serif] pb-28 lg:pb-16">
      {/* 1. TOP DAHAB BRANDING & COMPACT PROGRESS BAR */}
      <header className="bg-white border-b border-[#1A1A1A]/10 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold text-sm">
              D
            </div>
            <div>
              <span className="text-[11px] font-black tracking-widest uppercase text-[#5A5A40] block">
                DAHAB
              </span>
              <h1 className="text-sm font-bold text-[#1A1A1A]">
                {language === 'ar' ? 'إتمام الحجز' : 'Complete your booking'}
              </h1>
            </div>
          </div>

          {/* Compact Progress Indicator: Trip ✓, Hotel ✓, Transfer ✓, Activities ✓, Payment ● */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 text-xs">
            <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex-shrink-0">
              <span className="text-[11px]">✓</span>
              <span>{language === 'ar' ? 'الرحلة' : 'Trip'}</span>
            </div>

            <span className="text-[#1A1A1A]/30 text-xs flex-shrink-0">›</span>

            <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex-shrink-0">
              <span className="text-[11px]">✓</span>
              <span>{language === 'ar' ? 'الفندق' : 'Hotel'}</span>
            </div>

            <span className="text-[#1A1A1A]/30 text-xs flex-shrink-0">›</span>

            <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex-shrink-0">
              <span className="text-[11px]">✓</span>
              <span>{language === 'ar' ? 'الانتقالات' : 'Transfer'}</span>
            </div>

            <span className="text-[#1A1A1A]/30 text-xs flex-shrink-0">›</span>

            <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex-shrink-0">
              <span className="text-[11px]">✓</span>
              <span>{language === 'ar' ? 'الأنشطة' : 'Activities'}</span>
            </div>

            <span className="text-[#1A1A1A]/30 text-xs flex-shrink-0">›</span>

            {/* Payment Active */}
            <div className="flex items-center gap-1.5 text-[#5A5A40] font-bold bg-[#5A5A40]/10 px-3 py-1 rounded-full border border-[#5A5A40]/30 flex-shrink-0 ring-1 ring-[#5A5A40]/20">
              <Lock className="w-3 h-3 text-[#5A5A40]" />
              <span>Payment ●</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Breadcrumb / Back Button */}
        <div className="mb-6">
          <button
            type="button"
            id="back-to-review-btn"
            onClick={onBackToReview}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] hover:text-[#1A1A1A] transition-colors cursor-pointer bg-white px-3.5 py-1.5 rounded-full border border-[#1A1A1A]/10 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الرجوع لمراجعة الحجز' : 'Back to Booking Review'}</span>
          </button>
        </div>

        {/* Page Heading & Supporting Text */}
        <div className="mb-8 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-bold border border-[#5A5A40]/20 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الخطوة الأخيرة' : 'Final step'}</span>
            </span>
            <span className="text-xs text-[#1A1A1A]/60 font-semibold">
              {language === 'ar' ? 'فاضل خطوة واحدة على رحلتك في دهب' : 'You\'re one step away from your Dahab trip'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
            {language === 'ar' ? 'إتمام الحجز' : 'Complete your booking'}
          </h2>
          <p className="text-sm sm:text-base text-[#1A1A1A]/70 max-w-3xl leading-relaxed">
            {language === 'ar' ? 'أكّد بياناتك واختار طريقة الدفع اللي تناسبك.' : 'Confirm your details and choose how you\'d like to pay.'}
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left = Forms & Trust, Right = Trip Summary & Price */}
        <form onSubmit={handlePayAndConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Payment Methods, Card Form, Billing Info, Trust & Terms (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. PAYMENT METHOD SELECTION */}
            <div
              id="payment-method-section"
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#1A1A1A]/10 shadow-xs space-y-5"
            >
              <div className="border-b border-[#1A1A1A]/8 pb-3">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#5A5A40] block">
                  {language === 'ar' ? 'طرق الدفع' : 'Payment Options'}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A] mt-0.5">
                  How would you like to pay?
                </h3>
              </div>

              <div className="space-y-3">
                {/* Option 1: Card (Paymob / Stripe Gateway) */}
                <label
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#5A5A40] bg-[#FDFBF7] shadow-xs'
                      : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 w-4 h-4 text-[#5A5A40] focus:ring-[#5A5A40]"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#5A5A40]" />
                        <span className="text-sm font-bold text-[#1A1A1A]">{language === 'ar' ? 'بطاقة (Paymob / Stripe)' : 'Card (Paymob / Stripe)'}</span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70 font-medium">
                        {language === 'ar'
                          ? 'فيزا، ماستركارد، ميزة · بنبعت آخر ٤ أرقام بس'
                          : 'Visa, Mastercard, Meeza · only the last 4 digits are sent'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {language === 'ar' ? 'حجز فوري' : 'Instant Hold'}
                  </span>
                </label>

                {/* Option 2: Mobile Wallets (Vodafone Cash, Orange, Etisalat, WE) */}
                <label
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between cursor-pointer ${
                    paymentMethod === 'wallet'
                      ? 'border-[#5A5A40] bg-[#FDFBF7] shadow-xs'
                      : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="mt-1 w-4 h-4 text-[#5A5A40] focus:ring-[#5A5A40]"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#5A5A40]" />
                        <span className="text-sm font-bold text-[#1A1A1A]">{language === 'ar' ? 'فودافون كاش ومحافظ مصر' : 'Vodafone Cash / Egypt Wallets'}</span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70 font-medium">
                        {language === 'ar' ? 'فودافون كاش، أورنج موني، اتصالات كاش، وي باي (بيطلب الرقم السري فورًا)' : 'Vodafone Cash, Orange Money, Etisalat Cash, WE Pay (Instant PIN Prompt)'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {language === 'ar' ? 'محافظ محلية' : 'Local Wallets'}
                  </span>
                </label>

                {/* Option 3: InstaPay Egypt (IPA / Instant Bank Transfer) */}
                <label
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between cursor-pointer ${
                    paymentMethod === 'instapay'
                      ? 'border-[#5A5A40] bg-[#FDFBF7] shadow-xs'
                      : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="instapay"
                      checked={paymentMethod === 'instapay'}
                      onChange={() => setPaymentMethod('instapay')}
                      className="mt-1 w-4 h-4 text-[#5A5A40] focus:ring-[#5A5A40]"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#5A5A40]" />
                        <span className="text-sm font-bold text-[#1A1A1A]">{language === 'ar' ? 'إنستاباي مصر (IPN)' : 'InstaPay Egypt (IPN)'}</span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70 font-medium">
                        {language === 'ar' ? 'تحويل فوري بدون رسوم عبر شبكة البنك المركزي المصري' : 'Instant zero-fee transfer via Central Bank of Egypt IPN network'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {language === 'ar' ? 'بدون رسوم' : 'Zero Fees'}
                  </span>
                </label>

                {/* Option 4: Pay on arrival */}
                <label
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between cursor-pointer ${
                    paymentMethod === 'arrival'
                      ? 'border-[#5A5A40] bg-[#FDFBF7] shadow-xs'
                      : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="arrival"
                      checked={paymentMethod === 'arrival'}
                      onChange={() => setPaymentMethod('arrival')}
                      className="mt-1 w-4 h-4 text-[#5A5A40] focus:ring-[#5A5A40]"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#5A5A40]" />
                        <span className="text-sm font-bold text-[#1A1A1A]">{language === 'ar' ? 'ادفع عند الوصول (في دهب)' : 'Pay on arrival (Dahab Check-in)'}</span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70">
                        {language === 'ar' ? 'احجز بقسيمة ضمان، وادفع في الفندق أو مركز الغطس' : 'Hold with booking guarantee voucher, settle in hotel / dive center'}
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 5: Cash */}
                <label
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-[#5A5A40] bg-[#FDFBF7] shadow-xs'
                      : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="mt-1 w-4 h-4 text-[#5A5A40] focus:ring-[#5A5A40]"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#5A5A40]" />
                        <span className="text-sm font-bold text-[#1A1A1A]">{language === 'ar' ? 'كاش للمرشد البدوي أو السائق' : 'Cash to Bedouin Guide / Driver'}</span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/70">
                        {language === 'ar' ? 'الدفع كاش وقت المقابلة (جنيه، دولار، أو يورو)' : 'Settle directly in cash (EGP, USD, or EUR) upon meetup'}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Realistic Policy Notice */}
              <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 flex items-start gap-2.5 text-xs text-[#1A1A1A]/75">
                <Info className="w-4 h-4 text-[#5A5A40] flex-shrink-0 mt-0.5" />
                <p>
                  All bookings trigger real-time Twilio SMS confirmations to drivers and dive masters for flawless synchronization.
                </p>
              </div>
            </div>

            {/* 2. SPECIFIC PAYMENT FORM DETAILS */}
            {paymentMethod === 'card' && (
              <div
                id="card-payment-form-card"
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#1A1A1A]/10 shadow-xs space-y-5 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/8 pb-3">
                  <div>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#5A5A40] block">
                      {language === 'ar' ? 'بيانات البطاقة' : 'Card Details'}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mt-0.5">
                      {language === 'ar' ? 'بوابة بطاقات الائتمان والخصم' : 'Credit & Debit Card Gateway'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#FDFBF7] p-1 rounded-xl border border-[#1A1A1A]/10 text-xs">
                      <button
                        type="button"
                        onClick={() => setCardGateway('PAYMOB')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${cardGateway === 'PAYMOB' ? 'bg-[#5A5A40] text-white shadow-xs' : 'text-[#1A1A1A]/70'}`}
                      >
                        Paymob
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardGateway('STRIPE')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${cardGateway === 'STRIPE' ? 'bg-[#5A5A40] text-white shadow-xs' : 'text-[#1A1A1A]/70'}`}
                      >
                        Stripe
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
                      <Lock className="w-3 h-3 text-emerald-700" />
                      <span>
                        {language === 'ar' ? 'رقم الكارت مبيخرجش من جهازك' : 'Card number stays on your device'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                      {language === 'ar' ? 'اسم حامل البطاقة' : 'Cardholder name'}
                    </label>
                    <input
                      type="text"
                      id="cardholder-name-input"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم كما هو على البطاقة' : 'Name as printed on the card'}
                      className="w-full px-4 py-3 rounded-2xl border border-[#1A1A1A]/15 focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] bg-white text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                      {language === 'ar' ? 'رقم البطاقة' : 'Card number'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="card-number-input"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-2xl border border-[#1A1A1A]/15 focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] bg-white text-sm font-mono"
                        required
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-[#1A1A1A]/40" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                        {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry date'}
                      </label>
                      <input
                        type="text"
                        id="card-expiry-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        maxLength={7}
                        className="w-full px-4 py-3 rounded-2xl border border-[#1A1A1A]/15 focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] bg-white text-sm text-center font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                        CVV
                      </label>
                      <input
                        type="password"
                        id="card-cvv-input"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 rounded-2xl border border-[#1A1A1A]/15 focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] bg-white text-sm text-center font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#5A5A40] flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#1A1A1A] block">
                        Verified by {cardGateway}
                      </span>
                      <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                        {language === 'ar' ? 'معالجة فورية للدفع مع تحقق 3D Secure.' : 'Instant payment processing with 3D Secure verification.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div
                id="wallet-payment-form-card"
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#1A1A1A]/10 shadow-xs space-y-5 animate-in fade-in duration-200"
              >
                <div className="border-b border-[#1A1A1A]/8 pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-red-700 block">
                    {language === 'ar' ? 'المحفظة الإلكترونية - مصر' : 'Mobile Wallet Egypt'}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mt-0.5">
                    {language === 'ar' ? 'فودافون كاش ومحافظ شركات الاتصالات' : 'Vodafone Cash & Telecom Wallets'}
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {([
                    { id: 'vodafone', name: 'Vodafone', color: 'border-red-500 text-red-700' },
                    { id: 'orange', name: 'Orange', color: 'border-orange-500 text-orange-700' },
                    { id: 'etisalat', name: 'Etisalat', color: 'border-emerald-500 text-emerald-700' },
                    { id: 'wepay', name: 'WE Pay', color: 'border-purple-500 text-purple-700' }
                  ] as const).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWalletProvider(w.id)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold text-center transition-all ${
                        walletProvider === w.id
                          ? 'border-[#5A5A40] bg-[#5A5A40] text-white shadow-xs'
                          : 'border-[#1A1A1A]/10 bg-[#FDFBF7] text-[#1A1A1A]/80 hover:border-[#1A1A1A]/30'
                      }`}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A1A1A]">
                    {language === 'ar' ? 'رقم المحفظة المسجّل (مثال: ٠١٠، ٠١١، ٠١٢، ٠١٥)' : 'Registered Wallet Number (e.g. 010, 011, 012, 015)'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="wallet-phone-input"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="0100 123 4567"
                      className="w-full px-4 py-3 rounded-2xl border border-[#1A1A1A]/15 focus:outline-none focus:border-[#5A5A40] font-mono text-sm"
                      required
                    />
                    <Smartphone className="w-4 h-4 text-[#1A1A1A]/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[12px] text-[#1A1A1A]/65">
                    You will receive an instant push authorization request or OTP on your mobile wallet app.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'instapay' && (
              <div
                id="instapay-payment-form-card"
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#1A1A1A]/10 shadow-xs space-y-5 animate-in fade-in duration-200"
              >
                <div className="border-b border-[#1A1A1A]/8 pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-purple-700 block">
                    {language === 'ar' ? 'شبكة الدفع الفوري - البنك المركزي' : 'Central Bank Instant Payment Network'}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mt-0.5">
                    {language === 'ar' ? 'إنستاباي مصر (عنوان IPA)' : 'InstaPay Egypt (IPA Handle)'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A1A1A]">
                    {language === 'ar' ? 'عنوان الإنستاباي بتاعك (IPA)' : 'Your InstaPay Address (IPA)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="instapay-handle-input"
                      value={instapayAddress}
                      onChange={(e) => setInstapayAddress(e.target.value)}
                      placeholder="username@instapay"
                      className="w-full px-4 py-3 rounded-2xl border border-[#1A1A1A]/15 focus:outline-none focus:border-[#5A5A40] font-mono text-sm"
                      required
                    />
                    <Zap className="w-4 h-4 text-purple-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/50 text-xs text-purple-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-700 flex-shrink-0" />
                    <span>{language === 'ar' ? 'خصم فوري بدون رسوم مباشرة من حسابك البنكي المصري.' : 'Instant debit with 0% transaction fees directly from your Egyptian bank account.'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BILLING INFORMATION (Optional / Pre-filled) */}
            <div
              id="billing-info-section"
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#1A1A1A]/10 shadow-xs space-y-4"
            >
              <div className="border-b border-[#1A1A1A]/8 pb-3">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#5A5A40] block">
                  {language === 'ar' ? 'بيانات التواصل' : 'Traveler Contact'}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mt-0.5">
                  {language === 'ar' ? 'بيانات الفوترة' : 'Billing information'}
                </h3>
                <p className="text-xs text-[#1A1A1A]/60">
                  {language === 'ar' ? 'متعبّية من ملفك الشخصي' : 'Pre-filled from your traveler profile'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    id="billing-name-input"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#1A1A1A]/15 bg-white text-sm focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    {language === 'ar' ? 'إيميل التأكيد' : 'Email for Confirmation'}
                  </label>
                  <input
                    type="email"
                    id="billing-email-input"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#1A1A1A]/15 bg-white text-sm focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    {language === 'ar' ? 'الموبايل (تحديثات واتساب)' : 'Phone (WhatsApp updates)'}
                  </label>
                  <input
                    type="tel"
                    id="billing-phone-input"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#1A1A1A]/15 bg-white text-sm focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>
            </div>

            {/* 4. BOOKING PROTECTION / TRUST */}
            <div
              id="booking-protection-trust-card"
              className="p-5 sm:p-6 rounded-3xl bg-[#FDFBF7] border border-[#1A1A1A]/10 space-y-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]">
                {language === 'ar' ? 'حماية الحجز' : 'Booking Protection'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#1A1A1A]/85 font-medium">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#1A1A1A]/8">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                  <span>{language === 'ar' ? 'دفع آمن' : 'Secure checkout'}</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#1A1A1A]/8">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                  <span>{language === 'ar' ? 'البيانات محفوظة في رحلتك' : 'Details saved in trip'}</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#1A1A1A]/8">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                  <span>{language === 'ar' ? 'دعم لو خططك اتغيّرت' : 'Support if plans change'}</span>
                </div>
              </div>
            </div>

            {/* 5. TERMS CONFIRMATION CHECKBOX */}
            <div
              id="payment-terms-agreement-card"
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#1A1A1A]/10 shadow-xs space-y-3"
            >
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="payment-agree-terms-checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-[#1A1A1A]/30 cursor-pointer"
                />
                <div className="text-xs sm:text-sm text-[#1A1A1A]/90 leading-relaxed font-medium">
                  <span>{language === 'ar' ? 'أوافق على شروط الحجز وسياسات الإلغاء.' : 'I agree to the booking terms and cancellation policies.'}</span>
                  <div className="mt-1">
                    <button
                      type="button"
                      id="view-payment-terms-modal-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowTermsModal(true);
                      }}
                      className="text-xs font-bold text-[#5A5A40] hover:text-[#1A1A1A] underline underline-offset-4 cursor-pointer"
                    >
                      {language === 'ar' ? 'اعرض الشروط' : 'View terms'}
                    </button>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN: Trip Summary + Price Breakdown + Sticky CTA (lg:col-span-5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            {/* 1. COMPACT TRIP SUMMARY AT TOP */}
            <div
              id="payment-trip-summary-card"
              className="bg-white rounded-3xl p-6 border border-[#1A1A1A]/10 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between border-b border-[#1A1A1A]/8 pb-3">
                <div>
                  <span className="text-[11px] font-black tracking-wider uppercase text-[#5A5A40] block">
                    {language === 'ar' ? 'الملخّص' : 'Summary'}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                    {language === 'ar' ? 'رحلة دهب' : 'Dahab Trip'}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                    {[
                      `${activeTrip?.lengthDays ?? profile.lengthDays ?? 5} ${language === 'ar' ? 'أيام' : 'Days'}`,
                      travelersLabel,
                      formatTripDateRange(activeTrip?.startDate, activeTrip?.endDate, language === 'ar' ? 'ar' : 'en')
                    ].filter(Boolean).join(' · ')}
                  </p>
                </div>

                <button
                  type="button"
                  id="edit-trip-from-payment-btn"
                  onClick={onBackToReview}
                  className="text-xs font-bold text-[#5A5A40] hover:text-[#1A1A1A] underline underline-offset-4 cursor-pointer"
                >
                  {language === 'ar' ? 'تعديل الرحلة' : 'Edit trip'}
                </button>
              </div>

              {/* 4 Compact Component List */}
              <div className="space-y-2.5 text-xs text-[#1A1A1A]/85">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF7] border border-[#1A1A1A]/6">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>{selectedHotel ? selectedHotel.name : 'Dahab Bay Hotel'}</span>
                  </span>
                  <span className="text-[#1A1A1A]/60 text-[12px]">5 nights</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF7] border border-[#1A1A1A]/6">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Car className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>{selectedTransfer ? selectedTransfer.title : 'Private Car'}</span>
                  </span>
                  <span className="text-[#1A1A1A]/60 text-[12px]">Airport → Hotel</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF7] border border-[#1A1A1A]/6">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Waves className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{selectedDiving ? selectedDiving.title : 'Guided Diving'}</span>
                  </span>
                  <span className="text-[#1A1A1A]/60 text-[12px]">Day {divingDay} · {divingTime}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF7] border border-[#1A1A1A]/6">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Compass className="w-3.5 h-3.5 text-amber-700" />
                    <span>{selectedSafari ? selectedSafari.title : 'Desert Safari'}</span>
                  </span>
                  <span className="text-[#1A1A1A]/60 text-[12px]">Day {safariDay} · {safariTime}</span>
                </div>
              </div>
            </div>

            {/* 2. PRICE SUMMARY CARD */}
            <div
              id="payment-price-breakdown-card"
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#1A1A1A]/10 shadow-sm space-y-5"
            >
              <div className="border-b border-[#1A1A1A]/8 pb-3">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#5A5A40] block">
                  {language === 'ar' ? 'تفاصيل التكلفة' : 'Cost Breakdown'}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mt-0.5">
                  {language === 'ar' ? 'إجمالي الرحلة' : 'Trip Total'}
                </h3>
              </div>

              {/* Exact Line Items without invented fees */}
              <div className="space-y-3 text-xs text-[#1A1A1A]/80">
                <div className="flex items-center justify-between">
                  <span>{language === 'ar' ? 'الفندق' : 'Hotel'}</span>
                  <span className="font-bold text-[#1A1A1A]">
                    EGP {hotelPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>{language === 'ar' ? 'الانتقالات' : 'Transfer'}</span>
                  <span className="font-bold text-[#1A1A1A]">
                    EGP {transferPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>{language === 'ar' ? 'الغطس' : 'Diving'}</span>
                  <span className="font-bold text-[#1A1A1A]">
                    EGP {divingPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>{language === 'ar' ? 'السفاري' : 'Safari'}</span>
                  <span className="font-bold text-[#1A1A1A]">
                    EGP {safariPrice.toLocaleString()}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-[#1A1A1A]/10 pt-3" />

                {/* Trip Total */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-[#1A1A1A]">
                      {language === 'ar' ? 'إجمالي الرحلة:' : 'Trip total:'}
                    </span>
                    <span className="text-2xl font-black text-[#1A1A1A]">
                      EGP {totalTripPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#1A1A1A]/60 font-semibold">
                    {language === 'ar'
                      ? `الإجمالي التقديري لـ${travelersLabel}`
                      : `Estimated total for ${travelersLabel.toLowerCase()}`}
                  </div>
                </div>
              </div>

              {/* A failed settlement has to be visible here. The traveller
                  previously saw the confirmation screen regardless. */}
              {settlementError && (
                <div
                  role="alert"
                  className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2"
                >
                  <p className="font-bold text-sm">
                    {isRTL ? 'لم يتم إتمام الحجز' : 'Your booking was not completed'}
                  </p>
                  <p className="text-sm leading-relaxed">{settlementError}</p>
                  {/^.*(سجّل دخولك|sign in).*$/i.test(settlementError) && (
                    <button
                      type="button"
                      onClick={() => {
                        setIntendedRoute('/trip-builder');
                        navigateTo('/auth/sign-in');
                      }}
                      className="mt-1 px-4 py-2 rounded-full bg-rose-900 text-white text-xs font-bold cursor-pointer"
                    >
                      {isRTL ? 'تسجيل الدخول' : 'Sign in'}
                    </button>
                  )}
                </div>
              )}

              {/* No gateway is integrated, so nothing is charged. The traveler
                  is told before they press the button, not after — the flow
                  otherwise takes a card number, says "Confirmed" and leaves
                  them believing they have paid. */}
              {arePaymentsSimulated && (
                <div
                  role="note"
                  className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 space-y-1"
                >
                  <p className="text-sm font-bold text-amber-900">
                    {language === 'ar'
                      ? 'مفيش أي مبلغ هيتخصم دلوقتي'
                      : 'No money will be taken now'}
                  </p>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    {language === 'ar'
                      ? 'المنصّة لسه مش موصولة ببوابة دفع. الحجز هيتسجّل وهيوصل للمزوّد، والدفع بيتم معاه مباشرة.'
                      : 'This platform is not connected to a payment gateway yet. Your booking is recorded and sent to the provider, and you pay them directly.'}
                  </p>
                </div>
              )}

              {/* Primary & Secondary CTA Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  id="pay-and-confirm-trip-btn"
                  disabled={!agreedToTerms || isProcessing}
                  className={`w-full py-4 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    agreedToTerms && !isProcessing
                      ? 'bg-[#5A5A40] hover:bg-[#4A4A35] text-white active:scale-98'
                      : 'bg-[#1A1A1A]/10 text-[#1A1A1A]/40 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {arePaymentsSimulated
                      ? language === 'ar'
                        ? `أكّد الحجز (${totalTripPrice.toLocaleString()} ج.م تُدفع للمزوّد)`
                        : `Confirm Booking (EGP ${totalTripPrice.toLocaleString()}, paid to the provider)`
                      : language === 'ar'
                        ? `ادفع وأكّد الرحلة (${totalTripPrice.toLocaleString()} ج.م)`
                        : `Pay & Confirm Trip (EGP ${totalTripPrice.toLocaleString()})`}
                  </span>
                </button>

                <button
                  type="button"
                  id="payment-back-to-review-btn"
                  onClick={onBackToReview}
                  className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الرجوع للمراجعة' : 'Back to Review'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* 3. MOBILE FIXED BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1A1A1A]/10 p-4 shadow-lg flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#5A5A40] uppercase tracking-wider">
            {language === 'ar' ? `الإجمالي لـ${travelersLabel}` : `Total for ${travelersLabel.toLowerCase()}`}
          </div>
          <div className="text-base font-black text-[#1A1A1A]">
            EGP {totalTripPrice.toLocaleString()}
          </div>
        </div>

        <button
          type="button"
          id="mobile-pay-and-confirm-btn"
          disabled={!agreedToTerms || isProcessing}
          onClick={handlePayAndConfirm}
          className={`px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
            agreedToTerms && !isProcessing
              ? 'bg-[#5A5A40] hover:bg-[#4A4A35] text-white'
              : 'bg-[#1A1A1A]/10 text-[#1A1A1A]/40 cursor-not-allowed'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'ادفع وأكّد' : 'Pay & Confirm'}</span>
        </button>
      </div>

      {/* 4. REALISTIC PROCESSING STATE MODAL */}
      {isProcessing && (
        <div
          id="payment-processing-modal"
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-payment-step-dialog-1-title"
    >
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#1A1A1A]/10 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center mx-auto ring-8 ring-[#5A5A40]/5 animate-pulse">
              <Sparkles className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h3 id="booking-payment-step-dialog-1-title" className="text-xl font-serif font-bold text-[#1A1A1A]">
                {language === 'ar' ? 'بنأكد حجز رحلتك في دهب...' : 'Confirming your Dahab trip...'}
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed">
                {language === 'ar'
                  ? 'بنقفل حجوزاتك ونجمعها كلها في كارت رحلة واحد منظم.'
                  : "We're confirming your bookings and putting everything together in one trip."}
              </p>
            </div>

            {/* Micro Activity Checkpoints */}
            <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 text-[12px] text-[#1A1A1A]/70 space-y-1.5 text-start">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {language === 'ar' ? 'الأوضة اتأكدت مع فندق دهب باي' : 'Hotel room locked with Dahab Bay Hotel'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {language === 'ar' ? 'اتعينلك سواق خاص للمطار ومستنيك' : 'Private airport driver assigned'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {language === 'ar' ? 'معدات الغطس والمرشد اتحجزوا' : 'Diving gear & guide reserved'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {language === 'ar' ? 'تصريح السفاري البدوي اتجهز' : 'Desert Bedouin safari permit issued'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TERMS MODAL */}
      {showTermsModal && (
        <BookingReviewTermsModal onClose={() => setShowTermsModal(false)} />
      )}
    </div>
  );
};
