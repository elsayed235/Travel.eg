import React, { useCallback, useState } from 'react';
import {
  ArrowLeft, Star, MapPin, BedDouble, CalendarDays, Info, Sparkles,
  Check, AlertTriangle, SkipBack, Loader2, BadgeHelp
} from 'lucide-react';
import { WhatsAppIcon } from '../common/icons/WhatsAppIcon';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import type { HotelEntity, HotelDetailResponse } from '../../shared/types/commerce';

const CATEGORY_LABEL: Record<HotelEntity['category'], { en: string; ar: string }> = {
  'budget': { en: 'Budget', ar: 'ميزانية' },
  'mid-range': { en: 'Mid-range', ar: 'متوسط' },
  'boutique': { en: 'Boutique', ar: 'بوتيك' },
  'resort': { en: 'Resort', ar: 'منتجع' },
};

const BAND_LABEL: Record<HotelEntity['priceBand'], { en: string; ar: string }> = {
  budget: { en: 'Budget stay', ar: 'إقامة اقتصادية' },
  moderate: { en: 'Moderate', ar: 'متوسط' },
  premium: { en: 'Premium', ar: 'فاخر' },
};

const HOTEL_GALLERIES: Record<string, string[]> = {
  'jaz-dahabeya': ['/images/hotels/le-meridien.jpg', '/images/hotels/le-meridien-2.jpg', '/images/hero/coral-reef-split.jpg'],
  'safir-dahab-resort': ['/images/hotels/le-meridien-2.jpg', '/images/hotels/tropitel-dahab-oasis-pool.jpg', '/images/hotels/swiss-inn-resort-2.jpg'],
  'the-bridge-dahab-hotel': ['/images/hotels/el-primo.jpg', '/images/restaurants/boho-beach-cafe.jpg', '/images/hero/gulf-sunset.jpg'],
  'brother-hotel-dahab': ['/images/hotels/ganet-sinai.jpg', '/images/hotels/sindbad-camp.jpg', '/images/hero/boho-cafe-dreams.jpg'],
  'dahab-paradise-hotel': ['/images/hotels/dahab-paradise.jpg', '/images/hotels/dahab-paradise-2.jpg', '/images/hotels/dahab-paradise-3.jpg'],
  'sheikh-ali-dahab-resort': ['/images/hotels/bedouin-moon.jpg', '/images/hotels/ghazala-hotel.jpg', '/images/restaurants/breakfast-by-the-sea.jpg'],
  'tree-house-hotel-dahab': ['/images/hotels/daniela-village.jpg', '/images/hotels/daniela-village-2.jpg', '/images/attractions/bouldering-wadi-gnai.jpg'],
  'tropitel-dahab-oasis': ['/images/hotels/tropitel-dahab-oasis.jpg', '/images/hotels/tropitel-dahab-oasis-2.jpg', '/images/hotels/tropitel-dahab-oasis-3.jpg', '/images/hotels/tropitel-dahab-oasis-pool.jpg'],
  'dahab-lagoon-club-resort': ['/images/hotels/ibis-styles-lagoon.jpg', '/images/hotels/ibis-styles-lagoon-2.jpg', '/images/hero/blue-lagoon-kitesurf.jpg'],
  'swiss-inn-resort-dahab': ['/images/hotels/swiss-inn-resort.jpg', '/images/hotels/swiss-inn-resort-2.jpg', '/images/hotels/swiss-inn-resort-3.jpg'],
  'penguin-village-dahab': ['/images/hotels/ghazala-hotel.jpg', '/images/hotels/sindbad-camp.jpg', '/images/restaurants/the-roof-restaurant.jpg'],
  'carmine-hotel-dahab': ['/images/hotels/red-rock.jpg', '/images/hotels/sea-sun-hotel.jpg', '/images/hero/golden-beach.jpg'],
  'golden-europe-hotel': ['/images/hotels/sindbad-camp.jpg', '/images/hotels/bedouin-moon.jpg', '/images/hero/camels-beach.jpg'],
};

interface HotelDetailViewProps {
  hotelSlug: string;
  onBackToList: () => void;
}

export const HotelDetailView: React.FC<HotelDetailViewProps> = ({ hotelSlug, onBackToList }) => {
  const { navigateTo, sessionUser } = useTrip();
  const { language, isRTL, t } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';

  const detail = useApiResource<HotelDetailResponse>(
    useCallback((signal) => api.getHotelBySlug(hotelSlug, signal), [hotelSlug])
  );
  const hotel = detail.data?.hotel ?? null;

  // Booking widget state
  const [checkIn, setCheckIn] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [rooms, setRooms] = useState<number>(1);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<{ date: string; rooms: number } | null>(null);
  const [availError, setAvailError] = useState<string | null>(null);
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);

  if (detail.status === 'loading' && !hotel) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className={`w-6 h-6 animate-spin ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className={`max-w-3xl mx-auto px-4 py-14 text-center ${isDark ? 'text-[var(--text-primary)]' : 'text-[#122420]'}`}>
        <AlertTriangle className={`w-8 h-8 mx-auto mb-4 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`} />
        <h1 className="font-serif font-bold text-xl mb-2">{t('hotels.notFoundTitle')}</h1>
        <p className={`text-sm mb-6 ${isDark ? 'text-[var(--text-secondary)]/75' : 'text-[#4A635D]'}`}>
          {t('hotels.notFoundBody')}
        </p>
        <button
          type="button"
          onClick={onBackToList}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--surface-container)] text-sm font-bold transition-all cursor-pointer"
        >
          {t('hotels.backToList')}
        </button>
      </div>
    );
  }

  const { sku, supplier, areaGuide, disclaimer } = detail.data!;
  const pageTitle = isAr ? hotel.nameAr : hotel.name;
  const chips = isAr ? (hotel.typeChipsAr?.length ? hotel.typeChipsAr : hotel.typeChips) : hotel.typeChips;
  const amenities = isAr ? (hotel.amenitiesAr?.length ? hotel.amenitiesAr : hotel.amenities) : hotel.amenities;

  const handleCheckAvailability = async () => {
    setAvailability(null);
    setAvailError(null);
    setChecking(true);
    try {
      await api.checkHotelAvailability(hotel.skuId, checkIn, rooms);
      setAvailability({ date: checkIn, rooms });
    } catch (e: any) {
      setAvailError(String(e?.message || ''));
    } finally {
      setChecking(false);
    }
  };

  const handleBook = () => {
    if (!hotel.bookable?.skuId) {
      setBookingMsg(isAr ? 'الإقامة دي لسه مش متاحة للحجز أونلاين — كلّم AskDayGI مباشرة.' : 'This stay is not bookable online yet — arrange it directly with AskDayGI.');
      return;
    }
    if (!sessionUser) {
      navigateTo('/auth/sign-in');
      return;
    }
    // Open the canonical checkout on this SKU — it files a real hold,
    // charges cash-on-arrival and records the booking ledger entry.
    navigateTo('/book-now', { skuId: hotel.bookable.skuId });
  };

  const waNumber = '+201002328005';
  const waBody = encodeURIComponent(t('hotels.planWhatsAppBody', { hotel: hotel.name }));

  const faq = isAr ? [
    { q: 'إيه الفرق بين المناطق؟', a: 'المشرية واللايتهاوس قريبين من الممشى والأكل؛ عسلة هادية وقريبة من رأس أبو جالوم؛ اللاجونا مثالية للسباحة الهادئة والغرقى الصغار.' },
    { q: 'الباقة شاملة إيه؟', a: 'باقة ٥ ليالٍ تعرض سعر الليلة مضروب في ٥. أيام السفر والصعود الإضافية تُحدد مع AskDayGI عند التخطيط.' },
    { q: 'إني أحجز بكروت الدفع؟', a: 'احجز نقداً عند الوصول من المنصة، أو خطط عبر واتساب وادفع بأي طريقة تريحك للمكان نفسه.' },
    { q: 'هل التقييمات من جوجل؟', a: 'أجل — التقييمات وعدد المراجعات لقطة حقيقية من جوجل، وأسعار الليلة تقديرية تُؤكد عند الحجز.' },
  ] : [
    { q: 'What’s the difference between the areas?', a: 'Mashraba and the Lighthouse are closest to the promenade and dining; Assalah is quiet and nearer Ras Abu Galum; the lagoon is best for calm swims and children.' },
    { q: 'What does the package include?', a: 'The 5-night package is the nightly rate × 5. Exact dates, extra nights and room upgrades are settled with AskDayGI when you plan.' },
    { q: 'Can I pay by card?', a: 'Book cash-on-arrival through the platform, or plan via WhatsApp and settle with the property however suits you.' },
    { q: 'Are the ratings from Google?', a: 'Yes — ratings and review counts are a live Google snapshot, and nightly rates are estimates confirmed at booking.' },
  ];

  const reasons = hotel.bestFor
    ? hotel.bestFor.split(/[.;،]/).map(s => s.trim()).filter(Boolean).slice(0, 5)
    : [];

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'
      }`}
    >
      {/* Top bar */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-md ${isDark ? 'bg-[var(--surface-card)]/95 border-[var(--border-subtle)]' : 'bg-white/95 border-[#122420]/10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className={`flex items-center gap-1.5 text-sm font-bold transition-all cursor-pointer ${
              isDark ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' : 'text-[#4A635D] hover:text-[#122420]'
            }`}
          >
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <SkipBack className="w-4 h-4" />}
            {t('hotels.backToList')}
          </button>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
          }`}>
            {isAr ? (supplier?.businessNameAr || supplier?.businessName || hotel.areaNameAr) : (supplier?.businessName || hotel.areaName)}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Photo Gallery Grid */}
        {(() => {
          const hotelGallery = HOTEL_GALLERIES[hotelSlug] || ['/images/hotels/swiss-inn-resort.jpg', '/images/hotels/swiss-inn-resort-2.jpg', '/images/hero/coral-reef-split.jpg'];
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-3xl overflow-hidden shadow-md border border-[var(--border-subtle)]">
              <div className="md:col-span-2 relative h-72 sm:h-96 overflow-hidden group">
                <img
                  src={hotelGallery[0]}
                  alt={pageTitle}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 start-4 text-white">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                    {isAr ? 'الصورة الرئيسية' : 'Featured View'}
                  </span>
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-3 h-96">
                <div className="relative flex-1 overflow-hidden group rounded-2xl">
                  <img
                    src={hotelGallery[1] || hotelGallery[0]}
                    alt={pageTitle}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="relative flex-1 overflow-hidden group rounded-2xl">
                  <img
                    src={hotelGallery[2] || hotelGallery[0]}
                    alt={pageTitle}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {hotelGallery.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm backdrop-blur-xs">
                      +{hotelGallery.length - 2} {isAr ? 'صور إضافية' : 'more photos'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Hero header */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#c97b3c' }}>
                {isAr ? CATEGORY_LABEL[hotel.category].ar : CATEGORY_LABEL[hotel.category].en}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDark ? 'bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
              }`}>
                {isAr ? BAND_LABEL[hotel.priceBand].ar : BAND_LABEL[hotel.priceBand].en}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                isDark ? 'bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]/70' : 'bg-white border-[#122420]/10 text-[#4A635D]/70'
              }`}>
                {t('hotels.updatedLabel')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">{pageTitle}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-[var(--accent-primary)]' : 'text-[#c97b3c]'}`}>
                <Star className="w-4 h-4 fill-current" />
                {hotel.rating.toFixed(1)}
                <span className={`font-normal ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]/70'}`}>({hotel.reviewCount})</span>
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                <MapPin className="w-4 h-4" />
                {isAr ? hotel.areaNameAr : hotel.areaName}
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                <BedDouble className="w-4 h-4" />
                {hotel.rooms} {isAr ? 'غرفة' : 'rooms'}
              </span>
            </div>

            {hotel.ratingSource && (
              <p className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/60'}`}>
                {t('hotels.ratingSource')} · {t('hotels.updatedLabel')}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-2">
              {chips.slice(0, 8).map((c, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  {c}
                </span>
              ))}
            </div>

            <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
              {isAr ? hotel.descriptionAr : hotel.description}
            </p>

            {hotel.note && (
              <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]/80'}`}>
                {isAr ? hotel.noteAr || hotel.note : hotel.note}
              </p>
            )}
          </div>

          {/* Book widget */}
          <aside className={`lg:w-80 shrink-0 rounded-2xl border p-5 space-y-4 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-2xl ${isDark ? 'text-[var(--accent-primary)]' : 'text-[#122420]'}`}>
                {hotel.perNightEGP.toLocaleString()} EGP
              </span>
              <span className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/70'}`}>
                / {isAr ? 'الليلة' : 'night'}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
              {t('hotels.package')}: <span className="font-bold">{hotel.packageTotalEGP.toLocaleString()} EGP</span>
            </p>

            <label className="block">
              <span className={`text-xs font-bold mb-1 flex items-center gap-1.5 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`}>
                <CalendarDays className="w-3.5 h-3.5" />
                {t('hotels.checkInDate')}
              </span>
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => { setCheckIn(e.target.value); setAvailability(null); }}
                className={`w-full py-2 px-3 rounded-xl border text-sm ${isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] border-[#122420]/10 text-[#122420]'} focus:outline-none focus:border-[var(--accent-primary)]`}
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <span className={`text-xs font-bold ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`}>
                <BedDouble className="w-3.5 h-3.5 inline mr-1" />
                {t('hotels.roomsLabel')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRooms(r => Math.max(1, r - 1))}
                  className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${
                    isDark ? 'border-[var(--border-subtle)] hover:bg-[var(--surface-container)]' : 'border-[#122420]/15 hover:bg-[#F2EFE9]'
                  }`}
                  aria-label="Fewer rooms"
                >−</button>
                <span className="text-sm font-black w-5 text-center">{rooms}</span>
                <button
                  type="button"
                  onClick={() => setRooms(r => Math.min(9, r + 1))}
                  className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${
                    isDark ? 'border-[var(--border-subtle)] hover:bg-[var(--surface-container)]' : 'border-[#122420]/15 hover:bg-[#F2EFE9]'
                  }`}
                  aria-label="More rooms"
                >+</button>
              </div>
            </div>

            <p className={`text-[10px] ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[#4A635D]/50'}`}>
              {t('hotels.checkInSlots')}
            </p>

            {bookingMsg && (
              <div role="status" className={`text-xs p-3 rounded-xl ${
                isDark ? 'bg-[var(--surface-container)] text-[var(--text-secondary)]' : 'bg-[#F2EFE9] text-[#4A635D]'
              }`}>
                {bookingMsg}
              </div>
            )}
            {availability && (
              <div role="status" className={`text-xs p-3 rounded-xl flex items-start gap-2 ${
                isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-700'
              }`}>
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {t('hotels.availabilityOpen', { date: availability.date, rooms: availability.rooms })}
              </div>
            )}
            {availError && (
              <div role="alert" className={`text-xs p-3 rounded-xl ${isDark ? 'bg-rose-500/10 text-rose-300' : 'bg-rose-500/10 text-rose-700'}`}>
                {t('hotels.availabilityCheckFailed', { error: availError })}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={checking}
              className={`w-full py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isDark ? 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'border-[#122420]/15 text-[#4A635D] hover:bg-[#F2EFE9]'
              } disabled:opacity-50`}
            >
              {checking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {t('hotels.checkAvailability')}
            </button>

            <button
              type="button"
              onClick={handleBook}
              className="w-full py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-container)] text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {t('hotels.bookThisStay')}
            </button>

            <a
              href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${waBody}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              {t('hotels.planWithConcierge')}
            </a>

            {disclaimer && (
              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[#4A635D]/50'}`}>
                {isAr ? disclaimer.ar : disclaimer.en}
              </p>
            )}
          </aside>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3">{isAr ? 'وسائل الراحة' : 'Amenities'}</h2>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 14).map((a, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                    isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
                  }`}
                >
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Why plan here */}
        {(reasons.length > 0 || hotel.bestFor) && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
              {t('hotels.whyTitle')}
            </h2>
            <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
              <p className={`text-sm mb-3 font-bold ${isDark ? 'text-[var(--text-primary)]' : 'text-[#122420]'}`}>
                {isAr ? hotel.bestForAr || hotel.bestFor : hotel.bestFor}
              </p>
              {reasons.length > 1 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reasons.slice(1).map((r, i) => (
                    <li key={i} className={`text-xs flex items-start gap-2 ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
                      <Check className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Area guide */}
        {areaGuide && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
              {isAr ? areaGuide.nameAr : areaGuide.name}
            </h2>
            <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
              <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
                {isAr ? areaGuide.descriptionAr : areaGuide.description}
              </p>
              {(areaGuide.spotsAr?.length ? areaGuide.spotsAr : areaGuide.spots || []).map((s, i) => (
                <span key={i} className="inline-block mr-1.5 mb-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Good to know */}
        <section className="mb-10">
          <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-[var(--accent-primary)]" />
            {t('hotels.goodToKnow')}
          </h2>
          <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
              {isAr ? hotel.noteAr || hotel.note : hotel.note}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
            <BadgeHelp className="w-5 h-5 text-[var(--accent-primary)]" />
            {t('hotels.faqTitle')}
          </h2>
          <div className={`rounded-2xl border divide-y ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] divide-[var(--border-subtle)]' : 'bg-white border-[#122420]/10 divide-[#122420]/10'}`}>
            {faq.map(f => (
              <details key={f.q} className="group px-5 py-4">
                <summary className={`cursor-pointer text-sm font-bold flex items-center justify-between gap-3 ${isDark ? 'text-[var(--text-primary)]' : 'text-[#122420]'}`}>
                  {f.q}
                  <span className={`transition-transform group-open:rotate-180 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`}>▾</span>
                </summary>
                <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Prototype notice + back */}
        <div className="mb-14">
          <button
            type="button"
            onClick={onBackToList}
            className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all cursor-pointer ${
              isDark ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' : 'text-[#4A635D] hover:text-[#122420]'
            }`}
          >
            <SkipBack className="w-4 h-4" />
            {t('hotels.backToList')}
          </button>
        </div>
      </main>
    </div>
  );
};