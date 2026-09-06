import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Car,
  Bus,
  Crown,
  MapPin,
  Navigation,
  Search,
  Calendar,
  Clock,
  Users,
  Plane,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Route as RouteIcon,
  Mountain,
  Timer,
  LocateFixed,
  ChevronDown,
  X,
  Zap
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import type { TransferDetectedPlace, TransferOriginOption, TransferRouteQuote, TransferType } from '../../shared/types/transfers';

type TabId = 'within_dahab' | 'anywhere';
type GeoState = 'idle' | 'detecting' | 'detected' | 'failed' | 'denied';
type BookingState = 'idle' | 'preparing' | 'settling' | 'done';

const PRESET_TIMES = ['08:00 AM', '10:30 AM', '01:00 PM', '04:30 PM', '08:00 PM', '11:30 PM'];
const TIER_ICONS: Record<string, typeof Car> = { shared: Bus, private: Car, premium: Crown };

const TIER_ACCENTS: Record<string, string> = {
  shared: 'border-[var(--border-subtle)] hover:border-white/25',
  private: 'border-[var(--accent-secondary)]/40 hover:border-[var(--accent-secondary)]',
  premium: 'border-[var(--accent-primary)]/50 hover:border-[var(--accent-primary)]'
};

export const TransfersHubView: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const { showToast, navigateTo, sessionUser, isSignedIn, activeTrip } = useTrip();

  // ------------------------------------------------------------------ tabs
  const [activeTab, setActiveTab] = useState<TabId>('within_dahab');
  // ----------------------------------------------------------- within dahab
  const [withinOrigins, setWithinOrigins] = useState<TransferOriginOption[]>([]);
  const [withinOriginId, setWithinOriginId] = useState<string>('');
  // -------------------------------------------------------------- anywhere
  const [anywhereOrigins, setAnywhereOrigins] = useState<TransferOriginOption[]>([]);
  const [anywhereQuery, setAnywhereQuery] = useState('');
  const [anywherePickerOpen, setAnywherePickerOpen] = useState(false);
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [geoOrigin, setGeoOrigin] = useState<TransferOriginOption | null>(null);
  const [geoDetected, setGeoDetected] = useState<TransferDetectedPlace | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<TransferOriginOption | null>(null);
  const [flightNumber, setFlightNumber] = useState('');
  // ---------------------------------------------------------------- shared
  const [mode, setMode] = useState<'asap' | 'scheduled'>('asap');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:30 AM');
  const [passengers, setPassengers] = useState(2);
  const [roundTrip, setRoundTrip] = useState(false);
  const [quotes, setQuotes] = useState<TransferRouteQuote[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState('private');
  const [booking, setBooking] = useState<BookingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [bookedRef, setBookedRef] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOriginId = activeTab === 'within_dahab' ? withinOriginId : selectedOrigin?.id || geoOrigin?.id || '';

  // ------------------------------------------------------- load origin lists
  useEffect(() => {
    api.getTransferOrigins('within_dahab').then((r) => {
      setWithinOrigins(r.origins || []);
      if (!withinOriginId && r.origins?.length) setWithinOriginId(r.origins[0].id);
    }).catch(() => showToast(t('transfers.loadError', 'تعذّر تحميل مناطق دهب')));
  }, []);

  useEffect(() => {
    if (activeTab === 'within_dahab') return;
    api.getTransferOrigins('anywhere').then((r) => setAnywhereOrigins(r.origins || []))
      .catch(() => showToast(t('transfers.loadError', 'تعذّر تحميل قايمة المدن')));
  }, [activeTab]);

  // --------------------------------------------------------------------- geo
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoState('failed');
      return;
    }
    setGeoState('detecting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await api.resolveTransferGeo(pos.coords.latitude, pos.coords.longitude);
          setGeoDetected(res?.detected || null);
          if (res?.origin) {
            setGeoOrigin(res.origin);
            setSelectedOrigin(res.origin);
            setGeoState('detected');
          } else if (res?.detected) {
            setGeoOrigin(null);
            setSelectedOrigin(null);
            setGeoState('detected');
            showToast(t('transfers.notServed', 'مش هنقدر نخدم المدينة دي مباشرة — حنشاور أقرب مدينة برضه، أو دور يدوي.'));
          } else {
            setGeoState('failed');
          }
        } catch {
          setGeoState('failed');
        }
      },
      (err) => setGeoState(err?.code === err?.PERMISSION_DENIED ? 'denied' : 'failed'),
      { timeout: 8000, maximumAge: 0 }
    );
  }, []);

  // ------------------------------------------------------------ quote on change
  useEffect(() => {
    if (!selectedOriginId) return;
    setQuotes([]);
    setError(null);
    api.getTransferRoute(selectedOriginId)
      .then((r) => {
        setQuotes(r.quotes || []);
        setSelectedRoute(r.route || null);
      })
      .catch((e: any) => { setError(String(e?.message || 'Quote failed')); });
  }, [selectedOriginId]);

  const activeQ = useMemo(() => quotes.find((q) => q.tier.id === selectedTier) || quotes[0], [quotes, selectedTier]);
  const bookingIdle = booking === 'idle';
  const bookingPreparing = booking === 'preparing';
  const bookingSettling = booking === 'settling';
  const bookingBusy = bookingPreparing || bookingSettling;
  const filteredAnywhere = useMemo(() => {
    const q = anywhereQuery.trim().toLowerCase();
    const list = q ? anywhereOrigins.filter((o) => o.labelEn.toLowerCase().includes(q) || o.labelAr.includes(anywhereQuery.trim())) : anywhereOrigins;
    return list.slice(0, 50);
  }, [anywhereOrigins, anywhereQuery]);

  const isAirport = selectedRoute?.originType === 'airport';

  // ------------------------------------------------------------------ book
  const handleBook = async () => {
    setError(null);
    if (!isSignedIn || !sessionUser) {
      showToast(t('transfers.signInToBook', 'سجّل دخولك عشان تحجز انتقالتك'));
      navigateTo('/auth/sign-in');
      return;
    }
    if (!activeTrip) {
      showToast(t('transfers.noTrip', 'محتاج رحلة نشطة عشان تحجز — ابدأ رحلة الأول.'));
      navigateTo('/plan-for-me');
      return;
    }
    if (!selectedOriginId || !activeQ) {
      setError(t('transfers.chooseOrigin', 'اختار نقطة الانطلاق الأول'));
      return;
    }

    setBooking('preparing');
    const dateISO = mode === 'asap' ? new Date().toISOString().split('T')[0] : date;
    const timeSlot = mode === 'asap' ? 'ASAP' : time;
    const idempotencyKey = `IDEMP-TRF-${selectedOriginId}-${selectedTier}-${Date.now()}`;

    try {
      const prep = await api.prepareTransferBooking({
        tripId: activeTrip.id,
        originId: selectedOriginId,
        tierId: selectedTier as any,
        date: dateISO,
        timeSlot,
        passengersCount: passengers,
        idempotencyKey
      });

      setBooking('settling');
      const settle = await api.completeTransferBooking({
        holdToken: prep.hold.holdToken,
        tripId: activeTrip.id,
        travelerName: sessionUser.name || sessionUser.email?.split('@')[0] || 'Traveler',
        travelerPhone: sessionUser.phone || '',
        travelerEmail: sessionUser.email || '',
        pickupLocation: selectedRoute?.originEn || selectedOriginId,
        dropoffLocation: 'Dahab',
        flightNumber: isAirport ? flightNumber : undefined,
        specialRequests: roundTrip ? 'Round trip (return leg arranged separately)' : undefined,
        scheduledDate: dateISO,
        scheduledTime: timeSlot,
        idempotencyKey: `${idempotencyKey}-SETTLE`,
        provider: 'CASH_ON_ARRIVAL'
      });

      setBookedRef(settle.booking?.bookingRef || prep.hold.holdToken);
      setBooking('done');
      showToast(t('transfers.bookedMessage', 'حجز انتقالتك اتأكد. هتلاقي تتبع السواق في رحلتي.'));
    } catch (e: any) {
      setBooking('idle');
      const msg = String(e?.message || '');
      setError(
        /Sign in|401/i.test(msg)
          ? t('transfers.signInToBook', 'سجّل دخولك عشان تحجز انتقالتك')
          : msg
      );
    }
  };

  const resetForTab = (tab: TabId) => {
    // Re-tapping the tab you are already on must not destroy an in-progress
    // selection: keep the chosen origin, quotes and booking state intact.
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSelectedRoute(null);
    setQuotes([]);
    setError(null);
    setBooking('idle');
    setSelectedTier('private');
    if (tab === 'anywhere' && geoState === 'idle') detectLocation();
  };

  // ---------------------------------------------------------------- render
  const TabButton = ({ id, icon: Icon, label, desc }: { id: TabId; icon: any; label: string; desc: string }) => (
    <button
      type="button"
      onClick={() => resetForTab(id)}
      className={`flex-1 text-start rounded-2xl px-5 py-4 border transition-all cursor-pointer ${
        activeTab === id
          ? 'bg-[var(--surface-container)] border-[var(--accent-primary)]/50 shadow-md'
          : 'bg-[var(--surface-card)]/50 border-[var(--border-subtle)] hover:border-white/25'
      }`}
      aria-pressed={activeTab === id}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            activeTab === id ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'bg-[var(--surface-container)] text-[var(--text-secondary)]'
          }`}>
            <Icon className="w-5 h-5" />
          </span>
          <div>
            <div className={`text-sm font-bold ${activeTab === id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{label}</div>
            <div className="text-[11px] text-[var(--text-secondary)]/60 font-normal">{desc}</div>
          </div>
        </div>
        {activeTab === id && <span className="w-1.5 h-6 rounded-full bg-[var(--accent-primary)]" />}
      </div>
    </button>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]/70 mb-1.5">{children}</div>
  );

  const FieldShell = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)] px-4 py-3">{children}</div>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* ---------------- hero ---------------- */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-3">
            <Car className="w-3.5 h-3.5" />
            <span>Dahab Transfers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            {t('transfers.title', 'Ride the coast your way')}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[var(--text-secondary)]/80 font-normal leading-relaxed">
            {t('transfers.subtitle', 'On-demand cars inside Dahab and private transfers from anywhere in Egypt')}
          </p>

          {/* trust strip */}
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-[var(--text-secondary)]/80">
            {[
              { icon: ShieldCheck, key: 'transfers.trust.fixed' },
              { icon: Clock, key: 'transfers.trust.onTime' },
              { icon: LocateFixed, key: 'transfers.trust.peace' }
            ].map(({ icon: Icon, key }) => (
              <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                <Icon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                {t(key, key)}
              </span>
            ))}
          </div>
        </div>

        {/* ---------------- tabs ---------------- */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <TabButton id="within_dahab" icon={MapPin} label={t('transfers.tab.within', 'Inside Dahab')} desc={t('transfers.tab.within.desc', 'Hop between Dahab districts')} />
          <TabButton id="anywhere" icon={Navigation} label={t('transfers.tab.anywhere', 'From anywhere in Egypt')} desc={t('transfers.tab.anywhere.desc', 'Fixed price from any city or airport')} />
        </div>

        {/* ---------------- body ---------------- */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* ================== form column ================== */}
          <div className="lg:col-span-7 space-y-5 rounded-3xl bg-[var(--surface-container)] border border-[var(--border-subtle)] p-5 sm:p-6">
            {/* mode toggle (within + anywhere both offer ASAP or scheduled) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('asap')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                  mode === 'asap' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/40' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                }`}
              >
                <Zap className="w-4 h-4" />
                {t('transfers.asap', 'ASAP now')}
              </button>
              <button
                type="button"
                onClick={() => setMode('scheduled')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                  mode === 'scheduled' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/40' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                {t('transfers.scheduled', 'Scheduled')}
              </button>
            </div>

            {/* -------- within dahab: zone chips -------- */}
            {activeTab === 'within_dahab' && (
              <div>
                <Label>{t('transfers.origin.within.placeholder', 'Pick a Dahab area')}</Label>
                <div className="flex flex-wrap gap-2">
                  {withinOrigins.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setWithinOriginId(o.id)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        withinOriginId === o.id
                          ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/40'
                          : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-white/25'
                      }`}
                    >
                      {isAr ? o.labelAr : o.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* -------- anywhere: origin picker + geo -------- */}
            {activeTab === 'anywhere' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={geoState === 'detecting'}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/25 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {geoState === 'detecting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                    {geoState === 'detecting' ? t('transfers.detecting', 'Detecting…') : t('transfers.detectLocation', 'Use my location')}
                  </button>
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[var(--text-secondary)]/50 absolute top-1/2 -translate-y-1/2 start-3" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={anywhereQuery}
                      onChange={(e) => { setAnywhereQuery(e.target.value); setAnywherePickerOpen(true); }}
                      onFocus={() => setAnywherePickerOpen(true)}
                      placeholder={t('transfers.origin.anywhere.placeholder', 'Enter your city or airport')}
                      className="w-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl ps-10 pe-4 py-3 text-sm placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-primary)]/50"
                    />
                    {anywherePickerOpen && (
                      <div className="absolute z-30 top-full mt-2 w-full max-h-64 overflow-y-auto rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                        {filteredAnywhere.length === 0 && (
                          <div className="px-4 py-6 text-center text-xs text-[var(--text-secondary)]/60">{t('transfers.loadError', 'No matching origins')}</div>
                        )}
                        {filteredAnywhere.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                              setSelectedOrigin(o);
                              setGeoOrigin(null);
                              setAnywherePickerOpen(false);
                              setAnywhereQuery('');
                            }}
                            className="w-full flex items-center justify-between gap-2 px-4 py-3 text-start text-sm hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
                          >
                            <span className="font-medium">{isAr ? o.labelAr : o.labelEn}</span>
                            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-secondary)]/60 font-bold uppercase">
                              {o.originType === 'airport' ? <Plane className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                              {o.distanceKm} {t('transfers.km', 'km')}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {(geoState === 'failed' || geoState === 'denied') && (
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs px-4 py-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {geoState === 'denied' ? t('transfers.locationDenied', 'Location permission denied — search manually.') : t('transfers.locationFailed', 'Could not read your location — pick a city below.')}
                  </div>
                )}

                {(geoState === 'detected' && (geoOrigin || geoDetected)) && (
                  <div className="rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-xs px-4 py-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('transfers.locationDetected', 'Detected')}: {geoDetected ? (isAr ? (geoDetected.labelAr || geoDetected.label) : geoDetected.label) : (isAr ? (geoOrigin?.labelAr || '') : (geoOrigin?.labelEn || ''))}
                      {geoDetected?.region && <span className="font-medium text-[var(--accent-primary)]/70">· {geoDetected.region}</span>}
                      {geoDetected && geoOrigin && geoDetected.label !== (isAr ? geoOrigin.labelAr : geoOrigin.labelEn) && (
                        <span className="font-medium text-[var(--accent-primary)]/70">
                          · {t('transfers.pricedFrom', 'priced from')} {isAr ? geoOrigin.labelAr : geoOrigin.labelEn}
                        </span>
                      )}
                    </span>
                    <button type="button" onClick={() => { setGeoOrigin(null); setGeoDetected(null); setSelectedOrigin(null); setGeoState('idle'); }} className="hover:opacity-80 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {(geoState === 'detected' && geoDetected && !geoOrigin) && (
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs px-4 py-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {t('transfers.notServed', 'هذه القراءة خارج المدن اللي بنخدمها — دور يدوي على أقرب مدينة.')}
                  </div>
                )}

                {selectedOrigin && (
                  <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                      {isAr ? selectedOrigin.labelAr : selectedOrigin.labelEn}
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]/60">
                        · {selectedOrigin.distanceKm} {t('transfers.km', 'km')} {t('transfers.to', 'to Dahab')}
                      </span>
                    </span>
                    {selectedOrigin.originType === 'airport' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[var(--accent-secondary)]">
                        <Plane className="w-3 h-3" /> Airport
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* -------- round trip (anywhere only) -------- */}
            {activeTab === 'anywhere' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRoundTrip(!roundTrip)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                    roundTrip ? 'bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)] border-[var(--accent-secondary)]/40' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                  }`}
                >
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  {t('transfers.roundTrip', 'Return')}
                </button>
                <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]/80 font-medium">
                  <Car className="w-4 h-4 text-[var(--accent-primary)]" />
                  {t('transfers.oneWay', 'One-way')}
                </div>
              </div>
            )}

            {/* -------- date / time / passengers -------- */}
            <div className="grid grid-cols-2 gap-3">
              {mode === 'scheduled' && (
                <>
                  <FieldShell>
                    <Label><Calendar className="w-3.5 h-3.5 inline me-1 text-[var(--accent-primary)]" />{t('transfers.date', 'Travel date')}</Label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                    />
                  </FieldShell>
                  <FieldShell>
                    <Label><Clock className="w-3.5 h-3.5 inline me-1 text-[var(--accent-primary)]" />{t('transfers.time', 'Pickup time')}</Label>
                    <div className="relative">
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full appearance-none bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                      >
                        {PRESET_TIMES.map((tm) => <option key={tm} value={tm}>{tm}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]/50 pointer-events-none absolute top-1/2 -translate-y-1/2 end-0" />
                    </div>
                  </FieldShell>
                </>
              )}
              <FieldShell>
                <Label><Users className="w-3.5 h-3.5 inline me-1 text-[var(--accent-primary)]" />{t('transfers.passengers', 'Passengers')}</Label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPassengers((p) => Math.max(1, p - 1))} className="w-8 h-8 rounded-full bg-[var(--surface-container)] border border-[var(--border-subtle)] text-sm font-bold hover:border-[var(--accent-primary)]/40 cursor-pointer">−</button>
                  <span className="flex-1 text-center text-base font-bold">{passengers}</span>
                  <button type="button" onClick={() => setPassengers((p) => Math.min(14, p + 1))} className="w-8 h-8 rounded-full bg-[var(--surface-container)] border border-[var(--border-subtle)] text-sm font-bold hover:border-[var(--accent-primary)]/40 cursor-pointer">+</button>
                </div>
              </FieldShell>
              {isAirport && (
                <FieldShell>
                  <Label><Plane className="w-3.5 h-3.5 inline me-1 text-[var(--accent-primary)]" />{t('transfers.flightNumber', 'Flight number')}</Label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    placeholder="MS 028"
                    className="w-full bg-transparent text-sm font-medium uppercase placeholder:text-[var(--text-secondary)]/40 focus:outline-none"
                  />
                </FieldShell>
              )}
            </div>
          </div>

          {/* ================== quote column ================== */}
          <div className="lg:col-span-5 space-y-3">
            {(error && !quotes.length && !activeQ) && (
              <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs px-4 py-3">{error}</div>
            )}

            {!selectedOriginId && (
              <div className="rounded-3xl bg-[var(--surface-card)] border border-dashed border-[var(--border-subtle)] p-8 text-center">
                <RouteIcon className="w-8 h-8 text-[var(--text-secondary)]/40 mx-auto mb-2" />
                <p className="text-xs text-[var(--text-secondary)]/60">
                  {activeTab === 'anywhere'
                    ? t('transfers.chooseOrigin', 'Pick your city or airport to see fixed prices.')
                    : t('transfers.chooseOrigin', 'Pick a Dahab area to see fixed prices.')}
                </p>
              </div>
            )}

            {selectedRoute && bookingIdle && (
              <>
                {/* route summary */}
                <div className="rounded-3xl bg-[var(--surface-card)] border border-[var(--border-subtle)] p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold">{isAr ? selectedRoute.originAr : selectedRoute.originEn}</div>
                    <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-primary)]/50 to-[var(--accent-secondary)]/50 mx-2 relative">
                      <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center"><Car className="w-3.5 h-3.5 text-[var(--accent-secondary)] bg-[var(--surface-card)]" /></span>
                    </div>
                    <div className="text-sm font-bold flex items-center gap-1"><MapPin className="w-4 h-4 text-[var(--accent-primary)]" />Dahab</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-secondary)]/70 font-medium">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('transfers.duration', '≈')} {selectedRoute.baseDurationMinutes} {t('transfers.minutes', 'min')} {t('transfers.km', '')}({selectedRoute.distanceKm} km)</span>
                    {selectedRoute.originType === 'airport' && (
                      <span className="inline-flex items-center gap-1 text-[var(--accent-secondary)]"><Timer className="w-3.5 h-3.5" /> {t('transfers.airportWait', '60-min wait on delayed flights')}</span>
                    )}
                  </div>
                </div>

                {/* tier cards */}
                {quotes.map((quote) => {
                  const Icon = TIER_ICONS[quote.tier.id];
                  const selected = selectedTier === quote.tier.id;
                  return (
                    <button
                      key={quote.tier.id}
                      type="button"
                      onClick={() => setSelectedTier(quote.tier.id)}
                      className={`w-full text-start rounded-3xl bg-[var(--surface-card)] border p-5 transition-all cursor-pointer ${TIER_ACCENTS[quote.tier.id]} ${selected ? 'ring-2 ring-[var(--accent-primary)]/30 shadow-lg' : 'shadow-sm hover:shadow-md'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${quote.tier.id === 'premium' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'bg-[var(--surface-container)] text-[var(--accent-secondary)]'}`}>
                            <Icon className="w-5 h-5" />
                          </span>
                          <div>
                            <div className="font-bold text-sm">{isAr ? quote.tier.labelAr : quote.tier.labelEn}</div>
                            <div className="text-[11px] text-[var(--text-secondary)]/60 font-normal">{isAr ? quote.tier.vehicleAr : quote.tier.vehicleEn}</div>
                            <div className="text-[11px] text-[var(--text-secondary)]/60 font-normal mt-0.5 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {quote.tier.capacity}
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="text-xl font-black text-[var(--accent-secondary)]">{quote.priceEGP.toLocaleString()}</div>
                          <div className="text-[10px] text-[var(--text-secondary)]/50 font-bold uppercase">{t('transfers.quote', 'Fixed price')}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* book button */}
                <button
                  type="button"
                  onClick={handleBook}
                  disabled={bookingBusy}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold text-[var(--surface-container)] shadow-lg transition-all cursor-pointer disabled:opacity-60 ${
                    bookingBusy
                      ? 'bg-[var(--text-secondary)]/40'
                      : 'bg-[var(--accent-primary)] hover:bg-[#1a8c80] active:scale-[0.99]'
                  }`}
                >
                  {bookingBusy ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {bookingSettling ? t('transfers.settling', 'Confirming…') : t('transfers.preparing', 'Holding your ride…')}</>
                  ) : (
                    <><Car className="w-4 h-4" /> {t('transfers.book', 'Book this ride')}{activeQ ? ` · ${activeQ.priceEGP.toLocaleString()} EGP` : ''}</>
                  )}
                </button>

                {error && <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs px-4 py-3">{error}</div>}
              </>
            )}

            {/* booked confirmation */}
            {booking === 'done' && (
              <div className="rounded-3xl bg-[var(--surface-card)] border border-[var(--accent-primary)]/40 p-6 text-center animate-in zoom-in-90 duration-200">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/40 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-serif font-bold text-lg">{t('transfers.bookedTitle', 'Ride on the way')}</div>
                <p className="text-xs text-[var(--text-secondary)]/70 mt-1">{bookedRef}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('/my-trip')}
                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-[var(--accent-primary)] text-[var(--surface-container)] cursor-pointer hover:bg-[#1a8c80] transition-colors"
                  >
                    {t('transfers.viewMyTrip', 'View My Trip')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBooking('idle'); }}
                    className="flex-1 py-3 rounded-xl text-xs font-bold border border-[var(--border-subtle)] text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--surface-container)] transition-colors"
                  >
                    {t('transfers.another', 'Book another ride')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};