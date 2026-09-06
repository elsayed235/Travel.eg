import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, SkipBack, Star, MapPin, Bike, Truck, ShieldCheck, Clock } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import type {
  RentalAvailabilityResult,
  RentalBookingView,
  RentalDetailResponse,
  RentalQuoteResult
} from '../../shared/types/commerce';

function fmtLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return fmtLocalDate(d);
}

function daysBetween(start: string, end: string): number {
  const a = new Date(`${start}T12:00:00`).getTime();
  const b = new Date(`${end}T12:00:00`).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

interface RentalDetailViewProps {
  rentalSlug: string;
  onBackToList: () => void;
}

export const RentalDetailView: React.FC<RentalDetailViewProps> = ({ rentalSlug, onBackToList }) => {
  const { navigateTo, sessionUser, activeTrip, arePaymentsSimulated } = useTrip();
  const { language, isRTL, t } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';

  const today = fmtLocalDate(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addDays(today, 1));
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [deliveryZoneId, setDeliveryZoneId] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [extraIds, setExtraIds] = useState<Set<string>>(() => new Set());
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<RentalAvailabilityResult | null>(null);
  const [quote, setQuote] = useState<RentalQuoteResult | null>(null);
  const [booking, setBooking] = useState<RentalBookingView | null>(null);
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [holdKey, setHoldKey] = useState<string | null>(null);
  const [payKey, setPayKey] = useState<string | null>(null);
  const [cardLast4, setCardLast4] = useState('');
  const [cardBrand, setCardBrand] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const detail = useApiResource<RentalDetailResponse>(
    useCallback((signal) => api.getRentalBySlug(rentalSlug, signal), [rentalSlug])
  );

  useEffect(() => {
    if (detail.error) return;
    const listing = detail.data?.rental;
    if (listing && listing.deliveryZones.length > 0 && !deliveryZoneId) {
      setDeliveryZoneId(listing.deliveryZones[0].zoneId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.data?.rental?.id]);

  const rental = detail.data?.rental;
  const zoneLabel = (id: string) =>
    detail.data?.zones.find(z => z.id === id) || { name: id, nameAr: id };

  const toggleExtra = (id: string) => {
    setExtraIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCheck = async () => {
    if (!rental) return;
    setChecking(true);
    setCheckError(null);
    setAvailability(null);
    setQuote(null);
    try {
      const extraList = [...extraIds];
      const [avail, priceQuote] = await Promise.all([
        api.checkRentalAvailability({ listingId: rental.id, startDate, endDate, quantity }),
        api.quoteRental({
          listingId: rental.id,
          startDate,
          endDate,
          quantity,
          extraIds: extraList,
          deliveryMode,
          deliveryZoneId: deliveryMode === 'DELIVERY' ? deliveryZoneId : undefined
        })
      ]);
      setAvailability(avail);
      setQuote(priceQuote);
    } catch (e: any) {
      setCheckError(String(e?.message || e || ''));
    } finally {
      setChecking(false);
    }
  };

  const handleHoldAndPay = async () => {
    if (!rental || !quote) return;
    setBookingError(null);
    setBookingMsg(null);
    if (!sessionUser) {
      navigateTo('/auth/sign-in');
      return;
    }
    if (!activeTrip) {
      setBookingMsg('trip-first');
      return;
    }

    // Generate the idempotency keys once per attempt so double-clicks replay,
    // never duplicate.
    const hold = holdKey || `IDEMP-REN-HOLD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const pay = payKey || `IDEMP-REN-PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setHoldKey(hold);
    setPayKey(pay);

    try {
      const created = await api.createRentalBooking({
        listingId: rental.id,
        tripId: activeTrip.id,
        startDate,
        endDate,
        quantity,
        deliveryMode,
        deliveryZoneId: deliveryMode === 'DELIVERY' ? deliveryZoneId : undefined,
        deliveryAddress: deliveryMode === 'DELIVERY' ? deliveryAddress : undefined,
        pickupTime: pickupTime || undefined,
        extraIds: [...extraIds],
        idempotencyKey: hold
      });
      setBooking(created.booking);

      const checkout = await api.checkoutRentalBooking({
        rentalBookingId: created.booking.id,
        tripId: activeTrip.id,
        idempotencyKey: pay,
        provider: 'CASH_ON_ARRIVAL',
        cardLast4: cardLast4 || undefined,
        cardBrand: cardBrand || undefined,
        cardHolderName: cardHolderName || undefined
      });
      setBooking(prev => (prev ? { ...prev, bookingRef: checkout.bookingRef } : prev));
      setBookingMsg('success');
      setBookingError(null);
    } catch (e: any) {
      setBookingError(String(e?.message || e || ''));
    }
  };

  const days = startDate && endDate ? daysBetween(startDate, endDate) : 0;

  const specRows = useMemo(() => {
    if (!rental) return [];
    return Object.entries(rental.specs || {});
  }, [rental]);

  if (detail.status === 'loading') {
    return (
      <div className={`min-h-screen flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] ${isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'}`}>
        <span className="text-sm font-bold opacity-60">{isAr ? 'جاري التحميل…' : 'Loading…'}</span>
      </div>
    );
  }

  if (detail.error || !rental) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center font-['Plus_Jakarta_Sans',sans-serif] ${isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'}`}>
        <div className="text-4xl">🚲</div>
        <h1 className="text-xl font-serif font-bold">{t('rentals.notFoundTitle')}</h1>
        <p className={`text-sm max-w-sm ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
          {t('rentals.notFoundBody')}
        </p>
        <button
          type="button"
          onClick={onBackToList}
          className="mt-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-bold cursor-pointer"
        >
          {t('rentals.viewRental')}
        </button>
      </div>
    );
  }

  const name = isAr && rental.nameAr ? rental.nameAr : rental.name;
  const tagline = isAr && rental.taglineAr ? rental.taglineAr : rental.tagline;
  const description = isAr && rental.descriptionAr ? rental.descriptionAr : rental.description;
  const features = isAr && rental.featuresAr?.length ? rental.featuresAr : rental.features;
  const supplierName = isAr
    ? rental.supplier?.businessNameAr || rental.supplier?.businessName
    : rental.supplier?.businessName;
  const policies = isAr ? rental.policies.ar : rental.policies.en;

  const inputCls = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${
    isDark
      ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)]'
      : 'bg-white border-[#122420]/10 text-[#122420]'
  }`;
  const labelCls = `block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'}`}>
      {/* Top bar */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-md ${isDark ? 'bg-[var(--surface-card)]/95 border-[var(--border-subtle)]' : 'bg-white/95 border-[#122420]/10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className={`flex items-center gap-1.5 text-sm font-bold transition-all cursor-pointer ${isDark ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' : 'text-[#4A635D] hover:text-[#122420]'}`}
          >
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <SkipBack className="w-4 h-4" />}
            {t('rentals.backToList')}
          </button>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'}`}>
            {supplierName || t('rentals.pickupOnly')}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
          {/* Hero header */}
          <div className="relative w-full lg:w-2/5 h-64 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--surface-container)] to-[var(--surface-card)]">
            {rental.images?.[0] && (
              <img src={rental.images[0]} alt={name} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 text-amber-300" />
                  {rental.rating != null ? `${rental.rating.toFixed(1)}` : '—'}
                  {rental.reviewCount ? <span className="text-white/70">({rental.reviewCount})</span> : null}
                </span>
                {rental.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[var(--accent-primary)]/90 px-2 py-0.5 rounded-full">
                    {t('rentals.featured')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-serif font-bold">{name}</h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>{tagline}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'}`}>
                <MapPin className="w-3 h-3" />
                {zoneLabel(rental.pickupZoneId).name}
              </span>
              {rental.deliveryZones.length > 0 ? (
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--accent-secondary)]' : 'bg-white border-[#122420]/10 text-[#3c7a6a]'}`}>
                  <Truck className="w-3 h-3" />
                  {t('rentals.deliveryAvailable')}
                </span>
              ) : (
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'}`}>
                  <Bike className="w-3 h-3" />
                  {t('rentals.pickupOnly')}
                </span>
              )}
            </div>

            <div className={`mt-4 text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-[var(--text-secondary)]/90' : 'text-[#33413d]'}`}>
              {description}
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-serif font-bold mb-2">{t('rentals.features')}</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
                  {features.map((f, i) => (
                    <li key={i} className={`flex items-center gap-1.5 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#33413d]'}`}>
                      <span className="text-[var(--accent-primary)]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {specRows.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-serif font-bold mb-2">{t('rentals.specs')}</h2>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {specRows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 border-b border-dotted border-[#122420]/15 pb-1">
                      <dt className={`capitalize ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>{k.replace(/_/g, ' ')}</dt>
                      <dd className="font-bold text-right">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Provider */}
            {rental.supplier && (
              <div className="mt-6">
                <h2 className="text-sm font-serif font-bold mb-2">{t('rentals.provider')}</h2>
                <div className={`rounded-xl border p-3 flex items-center justify-between ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
                  <div>
                    <div className="text-sm font-bold">{supplierName}</div>
                    <div className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                      {rental.supplier.area ? `${rental.supplier.area}${rental.supplier.city ? ` · ${rental.supplier.city}` : ''}` : rental.supplier.city || ''}
                    </div>
                  </div>
                  {rental.supplier.rating != null && (
                    <span className="flex items-center gap-1 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      {rental.supplier.rating.toFixed(1)}
                      {rental.supplier.reviewCount ? <span className={`opacity-60 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`}>({rental.supplier.reviewCount})</span> : null}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Policies */}
            <div className="mt-6">
              <h2 className="text-sm font-serif font-bold mb-2">{t('rentals.policies')}</h2>
              <p className={`text-sm ${isDark ? 'text-[var(--text-secondary)]/90' : 'text-[#33413d]'}`}>{policies}</p>
              <p className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('rentals.deposit')}
              </p>
              <p className={`mt-1 flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                <Clock className="w-3.5 h-3.5" />
                {t('rentals.cancellationPolicy', { hours: rental.cancellationPolicyHours })}
              </p>
            </div>
          </div>

          {/* Booking widget */}
          <aside className={`w-full lg:w-[380px] shrink-0 ${isDark ? '' : ''}`}>
            <div className={`rounded-2xl border p-5 space-y-4 lg:sticky lg:top-20 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10 shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-serif font-bold">{t('rentals.bookingWidget')}</h2>
                <div className="text-right">
                  <span className={`text-lg font-black ${isDark ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-primary)]'}`}>
                    {rental.dailyRateEGP.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-bold ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`}> EGP / {isAr ? 'يوم' : 'day'}</span>
                </div>
              </div>

              {/* Dates + quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t('rentals.startDate')}</label>
                  <input type="date" min={today} value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('rentals.endDate')}</label>
                  <input type="date" min={startDate} value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>{t('rentals.quantity')}</label>
                <select value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className={inputCls}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Delivery mode */}
              <div>
                <label className={labelCls}>{t('rentals.deliveryMode')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('PICKUP')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold cursor-pointer transition-all ${
                      deliveryMode === 'PICKUP'
                        ? 'bg-[var(--accent-primary)] text-white border-transparent'
                        : isDark
                          ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                          : 'bg-white border-[#122420]/10 text-[#4A635D]'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    {t('rentals.pickup')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('DELIVERY')}
                    disabled={rental.deliveryZones.length === 0}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold cursor-pointer transition-all ${
                      deliveryMode === 'DELIVERY'
                        ? 'bg-[var(--accent-secondary)] text-white border-transparent'
                        : isDark
                          ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-secondary)] disabled:opacity-40'
                          : 'bg-white border-[#122420]/10 text-[#4A635D] disabled:opacity-40'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    {t('rentals.delivery')}
                  </button>
                </div>
              </div>

              {deliveryMode === 'DELIVERY' && rental.deliveryZones.length > 0 && (
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>{t('rentals.deliveryZone')}</label>
                    <select value={deliveryZoneId} onChange={e => setDeliveryZoneId(e.target.value)} className={inputCls}>
                      {rental.deliveryZones.map(z => (
                        <option key={z.zoneId} value={z.zoneId}>
                          {zoneLabel(z.zoneId).name} — {z.feeEGP} EGP
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t('rentals.deliveryAddress')}</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder={isAr ? 'مثال: كمب البدوية، عسلة' : 'e.g. Bedouin Camp, Assalah'}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={labelCls}>{t('rentals.pickupTime')}</label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  placeholder={isAr ? 'مثال: 10 صباحاً' : 'e.g. 10:00 AM'}
                  className={inputCls}
                />
              </div>

              {/* Extras */}
              {rental.extras.length > 0 && (
                <div>
                  <label className={labelCls}>{t('rentals.extras')}</label>
                  <div className="space-y-1.5">
                    {rental.extras.map(extra => {
                      const checked = extraIds.has(extra.id);
                      const extraPrice = extra.pricingBasis === 'FLAT' ? extra.priceEGP : extra.priceEGP * days;
                      return (
                        <label
                          key={extra.id}
                          className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-all ${
                            checked
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                              : isDark
                                ? 'bg-[var(--surface-container)] border-[var(--border-subtle)]'
                                : 'bg-white border-[#122420]/10'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-xs font-semibold">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleExtra(extra.id)}
                              className="accent-[var(--accent-primary)] w-3.5 h-3.5"
                            />
                            {isAr ? extra.nameAr || extra.name : extra.name}
                          </span>
                          <span className="text-xs font-bold opacity-80">
                            {extraPrice.toLocaleString()} EGP
                            {extra.pricingBasis === 'PER_DAY' ? ` / ${isAr ? 'يوم' : 'day'}` : ''}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {checkError && (
                <div className={`text-xs font-bold rounded-xl border px-3 py-2.5 ${isDark ? 'border-red-500/40 text-red-400 bg-red-500/10' : 'border-red-500/30 text-red-600 bg-red-50'}`}>
                  {checkError}
                </div>
              )}

              {/* Availability + quote */}
              {availability && quote && (
                <div className={`rounded-xl border p-3 space-y-1.5 text-xs ${isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)]' : 'bg-[#FBF9F5] border-[#122420]/10'}`}>
                  {availability.available ? (
                    <p className={`font-bold ${isDark ? 'text-[var(--accent-secondary)]' : 'text-[#3c7a6a]'}`}>
                      ✓ {t('rentals.available')}
                    </p>
                  ) : (
                    <p className="font-bold text-red-500">
                      ✕ {t('rentals.notAvailable', { available: availability.windowAvailable, day: availability.reasonDay || '' })}
                    </p>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-[#122420]/15">
                    <span>{t('rentals.days', { count: quote.breakdown.days })}</span>
                    <span>{quote.breakdown.baseEGP.toLocaleString()} EGP</span>
                  </div>
                  {quote.breakdown.discountEGP > 0 && (
                    <div className="flex justify-between text-[var(--accent-secondary)]">
                      <span>{t('rentals.discount')}</span>
                      <span>−{quote.breakdown.discountEGP.toLocaleString()} EGP</span>
                    </div>
                  )}
                  {quote.breakdown.extrasEGP > 0 && (
                    <div className="flex justify-between">
                      <span>{t('rentals.extrasTotal')}</span>
                      <span>{quote.breakdown.extrasEGP.toLocaleString()} EGP</span>
                    </div>
                  )}
                  {quote.deliveryFeeEGP > 0 && (
                    <div className="flex justify-between">
                      <span>{t('rentals.deliveryFee')}</span>
                      <span>{quote.deliveryFeeEGP.toLocaleString()} EGP</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-[#122420]/15 text-sm font-black">
                    <span>{t('rentals.total')}</span>
                    <span>{quote.breakdown.totalEGP.toLocaleString()} EGP</span>
                  </div>
                  <p className={`text-[10px] ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                    {t('rentals.deposit')}: {quote.breakdown.depositEGP.toLocaleString()} EGP
                  </p>
                </div>
              )}

              {bookingMsg === 'trip-first' && (
                <div className={`text-xs font-bold rounded-xl border px-3 py-2.5 ${isDark ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' : 'border-amber-500/30 text-amber-700 bg-amber-50'}`}>
                  {t('rentals.needTripFirst')}
                </div>
              )}
              {bookingMsg === 'success' && booking && (
                <div className={`text-xs font-bold rounded-xl border px-3 py-2.5 ${isDark ? 'border-[var(--accent-secondary)]/40 text-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10' : 'border-[#3c7a6a]/30 text-[#3c7a6a] bg-[#3c7a6a]/5'}`}>
                  ✓ {t('rentals.checkoutSuccess', { ref: booking.bookingRef || booking.id })}
                </div>
              )}
              {bookingError && (
                <div className={`text-xs font-bold rounded-xl border px-3 py-2.5 ${isDark ? 'border-red-500/40 text-red-400 bg-red-500/10' : 'border-red-500/30 text-red-600 bg-red-50'}`}>
                  {bookingError}
                </div>
              )}

              <button
                type="button"
                onClick={handleCheck}
                disabled={checking || !startDate || !endDate}
                className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer disabled:opacity-50 ${
                  isDark
                    ? 'bg-[var(--surface-container)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40'
                    : 'bg-white border border-[#122420]/15 text-[#122420] hover:border-[var(--accent-primary)]'
                }`}
              >
                {checking ? (isAr ? 'جاري التحقق…' : 'Checking…') : t('rentals.checkAvailability')}
              </button>

              <button
                type="button"
                onClick={handleHoldAndPay}
                disabled={!quote || !availability?.available || bookingMsg === 'success'}
                className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark ? 'bg-[var(--accent-primary)] text-white hover:opacity-90' : 'bg-[var(--accent-primary)] text-white hover:opacity-90'
                }`}
              >
                {t('rentals.holdAndPay')}
              </button>
              {!sessionUser && (
                <button
                  type="button"
                  onClick={() => navigateTo('/auth/sign-in')}
                  className={`w-full text-xs font-bold underline underline-offset-2 cursor-pointer ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`}
                >
                  {t('rentals.signInToBook')}
                </button>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};