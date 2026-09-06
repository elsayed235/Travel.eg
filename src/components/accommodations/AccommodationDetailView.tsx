import React, { useCallback, useState } from 'react';
import {
  ArrowLeft, Star, MapPin, BedDouble, Users, CalendarDays, Info, Sparkles,
  Check, AlertTriangle, SkipBack, Loader2, ExternalLink
} from 'lucide-react';
import { WhatsAppIcon } from '../common/icons/WhatsAppIcon';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import type { AccommodationEntity, AccommodationDetailResponse, PropertySourceEntity } from '../../shared/types/commerce';
import { PROPERTY_TYPE_LABEL } from './AccommodationCard';

const CATEGORY_LABEL: Record<AccommodationEntity['category'], { en: string; ar: string }> = {
  'budget': { en: 'Budget', ar: 'ميزانية' },
  'mid-range': { en: 'Mid-range', ar: 'متوسط' },
  'boutique': { en: 'Boutique', ar: 'بوتيك' },
  'resort': { en: 'Resort', ar: 'منتجع' },
};

const BAND_LABEL: Record<AccommodationEntity['priceBand'], { en: string; ar: string }> = {
  budget: { en: 'Budget stay', ar: 'إقامة اقتصادية' },
  moderate: { en: 'Moderate', ar: 'متوسط' },
  premium: { en: 'Premium', ar: 'فاخر' },
};

const SOURCE_LABEL: Record<PropertySourceEntity['sourceType'], { en: string; ar: string }> = {
  WHATSAPP: { en: 'Message on WhatsApp', ar: 'راسل عبر واتساب' },
  INSTAGRAM: { en: 'Also on Instagram', ar: 'أيضًا على إنستغرام' },
  WEBSITE: { en: 'Visit website', ar: 'زيارة الموقع' },
  BOOKING_COM: { en: 'Also listed on Booking.com', ar: 'مُدرج أيضًا على Booking.com' },
  AIRBNB: { en: 'Also listed on Airbnb', ar: 'مُدرج أيضًا على Airbnb' },
  OTHER: { en: 'More information', ar: 'مزيد من المعلومات' }
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
const DEFAULT_GALLERY = ['/images/hotels/swiss-inn-resort.jpg', '/images/hotels/swiss-inn-resort-2.jpg', '/images/hero/coral-reef-split.jpg'];

interface AccommodationDetailViewProps {
  accommodationSlug: string;
  onBackToList: () => void;
}

export const AccommodationDetailView: React.FC<AccommodationDetailViewProps> = ({ accommodationSlug, onBackToList }) => {
  const { navigateTo, sessionUser } = useTrip();
  const { language, isRTL, t } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';

  const detail = useApiResource<AccommodationDetailResponse>(
    useCallback((signal) => api.getAccommodationBySlug(accommodationSlug, signal), [accommodationSlug])
  );
  const accommodation = detail.data?.accommodation ?? null;

  const [checkIn, setCheckIn] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [rooms, setRooms] = useState<number>(1);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<{ date: string; rooms: number } | null>(null);
  const [availError, setAvailError] = useState<string | null>(null);
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);

  if (detail.status === 'loading' && !accommodation) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className={`w-6 h-6 animate-spin ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`} />
      </div>
    );
  }

  if (!accommodation) {
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

  const { sku, areaGuide, sources, disclaimer } = detail.data!;
  const pageTitle = isAr ? accommodation.nameAr : accommodation.name;
  const chips = isAr ? (accommodation.typeChipsAr?.length ? accommodation.typeChipsAr : accommodation.typeChips) : accommodation.typeChips;
  const amenities = isAr ? (accommodation.amenitiesAr?.length ? accommodation.amenitiesAr : accommodation.amenities) : accommodation.amenities;
  const typeLabel = PROPERTY_TYPE_LABEL[accommodation.propertyType];
  const isRoomBased = accommodation.propertyType === 'hotel' || accommodation.propertyType === 'resort' || accommodation.propertyType === 'boutique-hotel';

  const handleCheckAvailability = async () => {
    setAvailability(null);
    setAvailError(null);
    setChecking(true);
    try {
      await api.checkHotelAvailability(accommodation.skuId, checkIn, rooms);
      setAvailability({ date: checkIn, rooms });
    } catch (e: any) {
      setAvailError(String(e?.message || ''));
    } finally {
      setChecking(false);
    }
  };

  const handleBook = () => {
    if (!accommodation.bookable?.skuId) {
      setBookingMsg(isAr ? 'الإقامة دي لسه مش متاحة للحجز أونلاين — كلّم AskDayGI مباشرة.' : 'This stay is not bookable online yet — arrange it directly with AskDayGI.');
      return;
    }
    if (!sessionUser) {
      navigateTo('/auth/sign-in');
      return;
    }
    navigateTo('/book-now', { skuId: accommodation.bookable.skuId });
  };

  const waNumber = '+201002328005';
  const waBody = encodeURIComponent(t('hotels.planWhatsAppBody', { hotel: accommodation.name }));

  const reasons = accommodation.bestFor
    ? accommodation.bestFor.split(/[.;،]/).map(s => s.trim()).filter(Boolean).slice(0, 5)
    : [];

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'
      }`}
    >
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
            {isAr ? accommodation.areaNameAr : accommodation.areaName}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {(() => {
          const gallery = HOTEL_GALLERIES[accommodationSlug] || DEFAULT_GALLERY;
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-3xl overflow-hidden shadow-md border border-[var(--border-subtle)]">
              <div className="md:col-span-2 relative h-72 sm:h-96 overflow-hidden group">
                <img src={gallery[0]} alt={pageTitle} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="hidden md:flex flex-col gap-3 h-96">
                <div className="relative flex-1 overflow-hidden group rounded-2xl">
                  <img src={gallery[1] || gallery[0]} alt={pageTitle} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="relative flex-1 overflow-hidden group rounded-2xl">
                  <img src={gallery[2] || gallery[0]} alt={pageTitle} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          );
        })()}

        <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#c97b3c' }}>
                {isAr ? typeLabel.ar : typeLabel.en}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDark ? 'bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
              }`}>
                {isAr ? CATEGORY_LABEL[accommodation.category].ar : CATEGORY_LABEL[accommodation.category].en}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDark ? 'bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
              }`}>
                {isAr ? BAND_LABEL[accommodation.priceBand].ar : BAND_LABEL[accommodation.priceBand].en}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">{pageTitle}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-[var(--accent-primary)]' : 'text-[#c97b3c]'}`}>
                <Star className="w-4 h-4 fill-current" />
                {accommodation.rating.toFixed(1)}
                <span className={`font-normal ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]/70'}`}>({accommodation.reviewCount})</span>
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                <MapPin className="w-4 h-4" />
                {isAr ? accommodation.areaNameAr : accommodation.areaName}
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                {isRoomBased ? <BedDouble className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                {isRoomBased ? `${accommodation.rooms} ${isAr ? 'غرفة' : 'rooms'}` : `${isAr ? 'حتى' : 'up to'} ${accommodation.maxGuests} ${isAr ? 'ضيوف' : 'guests'}`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {chips.slice(0, 8).map((c, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">{c}</span>
              ))}
            </div>

            <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
              {isAr ? accommodation.descriptionAr : accommodation.description}
            </p>

            {accommodation.note && (
              <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]/80'}`}>
                {isAr ? accommodation.noteAr || accommodation.note : accommodation.note}
              </p>
            )}
          </div>

          <aside className={`lg:w-80 shrink-0 rounded-2xl border p-5 space-y-4 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-2xl ${isDark ? 'text-[var(--accent-primary)]' : 'text-[#122420]'}`}>
                {accommodation.perNightEGP.toLocaleString()} EGP
              </span>
              <span className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/70'}`}>/ {isAr ? 'الليلة' : 'night'}</span>
            </div>
            {accommodation.packageNights > 1 && (
              <p className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
                {t('hotels.package')}: <span className="font-bold">{accommodation.packageTotalEGP.toLocaleString()} EGP</span>
              </p>
            )}

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
                <button type="button" onClick={() => setRooms(r => Math.max(1, r - 1))} className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${isDark ? 'border-[var(--border-subtle)] hover:bg-[var(--surface-container)]' : 'border-[#122420]/15 hover:bg-[#F2EFE9]'}`} aria-label="Fewer rooms">−</button>
                <span className="text-sm font-black w-5 text-center">{rooms}</span>
                <button type="button" onClick={() => setRooms(r => Math.min(9, r + 1))} className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${isDark ? 'border-[var(--border-subtle)] hover:bg-[var(--surface-container)]' : 'border-[#122420]/15 hover:bg-[#F2EFE9]'}`} aria-label="More rooms">+</button>
              </div>
            </div>

            <p className={`text-[10px] ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[#4A635D]/50'}`}>{t('hotels.checkInSlots')}</p>

            {bookingMsg && (
              <div role="status" className={`text-xs p-3 rounded-xl ${isDark ? 'bg-[var(--surface-container)] text-[var(--text-secondary)]' : 'bg-[#F2EFE9] text-[#4A635D]'}`}>{bookingMsg}</div>
            )}
            {availability && (
              <div role="status" className={`text-xs p-3 rounded-xl flex items-start gap-2 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-700'}`}>
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
              className={`w-full py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isDark ? 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'border-[#122420]/15 text-[#4A635D] hover:bg-[#F2EFE9]'} disabled:opacity-50`}
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

        {amenities.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3">{isAr ? 'وسائل الراحة' : 'Amenities'}</h2>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 14).map((a, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'}`}>{a}</span>
              ))}
            </div>
          </section>
        )}

        {(reasons.length > 0 || accommodation.bestFor) && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
              {t('hotels.whyTitle')}
            </h2>
            <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
              <p className={`text-sm mb-3 font-bold ${isDark ? 'text-[var(--text-primary)]' : 'text-[#122420]'}`}>
                {isAr ? accommodation.bestForAr || accommodation.bestFor : accommodation.bestFor}
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

        {areaGuide && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
              {isAr ? areaGuide.nameAr : areaGuide.name}
            </h2>
            <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
                {isAr ? areaGuide.descriptionAr : areaGuide.description}
              </p>
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[var(--accent-primary)]" />
              {isAr ? 'روابط خارجية' : 'Also listed on'}
            </h2>
            <div className={`rounded-2xl border p-5 space-y-2 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
              <div className="flex flex-wrap gap-2">
                {sources.map(s => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      isDark ? 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'border-[#122420]/15 text-[#4A635D] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {s.label || (isAr ? SOURCE_LABEL[s.sourceType].ar : SOURCE_LABEL[s.sourceType].en)}
                  </a>
                ))}
              </div>
              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[#4A635D]/50'}`}>
                {isAr
                  ? 'روابط معلوماتية غير موثّقة تلقائيًا وليست شراكة رسمية — لا تعكس بالضرورة أفضل سعر متاح.'
                  : 'Informational links, not automatically verified and not an official partnership — they do not necessarily reflect the best available price.'}
              </p>
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-[var(--accent-primary)]" />
            {t('hotels.goodToKnow')}
          </h2>
          <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
              {isAr ? accommodation.noteAr || accommodation.note : accommodation.note}
            </p>
          </div>
        </section>

        <div className="mb-14">
          <button
            type="button"
            onClick={onBackToList}
            className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all cursor-pointer ${isDark ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' : 'text-[#4A635D] hover:text-[#122420]'}`}
          >
            <SkipBack className="w-4 h-4" />
            {t('hotels.backToList')}
          </button>
        </div>
      </main>
    </div>
  );
};
