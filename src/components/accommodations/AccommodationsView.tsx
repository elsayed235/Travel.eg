import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Star, MapPin, Info, Users, List, Map as MapIcon } from 'lucide-react';
import { AccommodationCard, PROPERTY_TYPE_LABEL } from './AccommodationCard';
import { AccommodationDetailView } from './AccommodationDetailView';
import { AccommodationsMap } from './AccommodationsMap';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import type { AccommodationCatalogueResponse, PropertyType } from '../../shared/types/commerce';

type HotelCategory = 'budget' | 'mid-range' | 'boutique' | 'resort';
type HotelPriceBand = 'budget' | 'moderate' | 'premium';

const PROPERTY_TYPE_ORDER: PropertyType[] = [
  'hotel', 'resort', 'boutique-hotel', 'hostel', 'apartment', 'studio', 'villa', 'guesthouse', 'camp', 'eco-lodge'
];
const CATEGORY_ORDER: HotelCategory[] = ['budget', 'mid-range', 'boutique', 'resort'];
const BAND_ORDER: HotelPriceBand[] = ['budget', 'moderate', 'premium'];

function chipColor(band: HotelPriceBand): string {
  if (band === 'budget') return '#7a8c5c';
  if (band === 'moderate') return '#c97b3c';
  return '#7a6a4a';
}

/** Reads/writes filter state to the URL query string, independent of
 *  routeUrl.ts (which owns the ?hotelSlug path segment for the detail page)
 *  — same separation AttractionsView.tsx already uses for its own filters. */
function readParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}
function readCsvParam<T extends string>(name: string): Set<T> {
  const raw = readParam(name);
  return raw ? new Set(raw.split(',').filter(Boolean) as T[]) : new Set();
}

export const AccommodationsView: React.FC = () => {
  const { navigateTo, selectedHotelSlug } = useTrip();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState(() => readParam('q') || '');
  const [activePropertyTypes, setActivePropertyTypes] = useState<Set<PropertyType>>(() => {
    const fromUrl = readCsvParam<PropertyType>('propertyType');
    return fromUrl.size > 0 ? fromUrl : new Set(PROPERTY_TYPE_ORDER);
  });
  const [activeCategories, setActiveCategories] = useState<Set<HotelCategory>>(() => {
    const fromUrl = readCsvParam<HotelCategory>('category');
    return fromUrl.size > 0 ? fromUrl : new Set(CATEGORY_ORDER);
  });
  const [activeBands, setActiveBands] = useState<Set<HotelPriceBand>>(() => {
    const fromUrl = readCsvParam<HotelPriceBand>('priceBand');
    return fromUrl.size > 0 ? fromUrl : new Set(BAND_ORDER);
  });
  const [activeAreas, setActiveAreas] = useState<Set<string>>(() => readCsvParam<string>('areaId'));
  const [guests, setGuests] = useState<number>(() => {
    const raw = readParam('guests');
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  });
  // Mobile toggle between list and map; desktop always shows both side by
  // side, so this only matters below the lg breakpoint.
  const [showMap, setShowMap] = useState(false);

  // Re-derive the query string from state whenever any filter changes — a
  // single effect avoids the stale-closure trap of calling a memoized
  // syncUrl from inside each setState callback (that captures the value of
  // the state *before* the update it was scheduled from applies).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchQuery.trim()) params.set('q', searchQuery.trim()); else params.delete('q');
    if (activePropertyTypes.size > 0 && activePropertyTypes.size < PROPERTY_TYPE_ORDER.length) {
      params.set('propertyType', [...activePropertyTypes].join(','));
    } else params.delete('propertyType');
    if (activeCategories.size > 0 && activeCategories.size < CATEGORY_ORDER.length) {
      params.set('category', [...activeCategories].join(','));
    } else params.delete('category');
    if (activeBands.size > 0 && activeBands.size < BAND_ORDER.length) {
      params.set('priceBand', [...activeBands].join(','));
    } else params.delete('priceBand');
    if (activeAreas.size > 0) params.set('areaId', [...activeAreas].join(',')); else params.delete('areaId');
    if (guests > 0) params.set('guests', String(guests)); else params.delete('guests');
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [searchQuery, activePropertyTypes, activeCategories, activeBands, activeAreas, guests]);

  const corpus = useApiResource<AccommodationCatalogueResponse>(
    useCallback((signal) => api.getAccommodations(undefined, signal), [])
  );

  const accommodations = corpus.data?.accommodations ?? [];

  // Every hook in this component must run before any early return (the
  // detail-view branch below), so this stays above that branch even though
  // its result is unused there — moving it after the return previously broke
  // the Rules of Hooks ("Rendered fewer hooks than expected").
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return accommodations.filter(a => {
      if (!activePropertyTypes.has(a.propertyType)) return false;
      if (!activeCategories.has(a.category)) return false;
      if (!activeBands.has(a.priceBand)) return false;
      if (activeAreas.size > 0 && !activeAreas.has(a.areaId)) return false;
      if (guests > 0 && a.maxGuests < guests) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        (a.nameAr || '').toLowerCase().includes(q) ||
        (a.areaName || '').toLowerCase().includes(q) ||
        (a.areaNameAr || '').toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q)
      );
    });
  }, [accommodations, activePropertyTypes, activeCategories, activeBands, activeAreas, guests, searchQuery]);

  if (selectedHotelSlug) {
    return (
      <AccommodationDetailView
        accommodationSlug={selectedHotelSlug}
        onBackToList={() => navigateTo('/hotels')}
      />
    );
  }

  const areas = corpus.data?.areas ?? [];

  const toggle = <T,>(set: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    set(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const stats = corpus.data?.stats;
  const disclaimer = corpus.data?.disclaimer;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'
      }`}
    >
      <div className="relative border-b overflow-hidden">
        <img
          src="/images/hotels/swiss-inn-resort.jpg"
          alt="Dahab Stays"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-r from-[var(--surface-container)]/95 via-[var(--surface-container)]/90 to-[var(--surface-container)]/75 backdrop-blur-[2px]'
            : 'bg-gradient-to-r from-[#FBF9F5]/96 via-[#FBF9F5]/92 to-[#FBF9F5]/80 backdrop-blur-[2px]'
        }`} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
              <span className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'}`}>
                {t('hotels.title')} · {t('hotels.ratingSource')}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold">
              {isAr ? 'أماكن الإقامة في دهب' : 'Places to stay in Dahab'}
            </h1>
            <p className={`text-sm max-w-xl ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
              {t('hotels.subtitle', { count: stats?.total ?? accommodations.length })}
            </p>
          </div>

          {stats && (
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                { label: isAr ? 'إقامة' : 'stays', value: stats.total },
                { label: t('hotels.statsAvgRating'), value: `${stats.averageRating.toFixed(1)}★` },
                { label: t('hotels.statsReviews'), value: stats.totalReviews.toLocaleString() },
              ].map(stat => (
                <div key={stat.label} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
                }`}>
                  <span className="font-black">{stat.value}</span>{' '}{stat.label}
                </div>
              ))}
              {stats.updatedLabel && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]/80' : 'bg-white border-[#122420]/10 text-[var(--accent-primary)]'
                }`}>
                  {stats.updatedLabel}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="relative max-w-md mb-6">
          <Search className={`absolute ${isAr ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[var(--text-secondary)]/40' : 'text-[#4A635D]/40'}`} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('hotels.searchPlaceholder')}
            className={`w-full py-3 ${isAr ? 'pl-4 pr-10' : 'pl-10 pr-4'} rounded-xl border text-sm ${
              isDark
                ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:border-[var(--accent-primary)]'
                : 'bg-white border-[#122420]/10 text-[#122420] placeholder:text-[#4A635D]/50 focus:border-[var(--accent-primary)]'
            } focus:outline-none`}
          />
        </div>

        {/* Property type chips */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold mr-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/60'}`}>
            {isAr ? 'نوع الإقامة' : 'Type'}:
          </span>
          {PROPERTY_TYPE_ORDER.map(pt => {
            const active = activePropertyTypes.has(pt);
            const label = PROPERTY_TYPE_LABEL[pt];
            return (
              <button
                key={pt}
                type="button"
                onClick={() => toggle(setActivePropertyTypes, pt)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'bg-white border-[#122420]/10 text-[#4A635D] hover:bg-[#EAE6DD]'
                }`}
              >
                {isAr ? label.ar : label.en}
              </button>
            );
          })}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold mr-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/60'}`}>
            {t('hotels.categories')}:
          </span>
          {CATEGORY_ORDER.map(cat => {
            const active = activeCategories.has(cat);
            const label = isAr
              ? { budget: 'ميزانية', 'mid-range': 'متوسط', boutique: 'بوتيك', resort: 'منتجع' }[cat]
              : cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggle(setActiveCategories, cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'bg-white border-[#122420]/10 text-[#4A635D] hover:bg-[#EAE6DD]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Price bands */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold mr-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/60'}`}>
            {t('hotels.priceBands')}:
          </span>
          {BAND_ORDER.map(band => {
            const active = activeBands.has(band);
            const label = isAr
              ? { budget: 'اقتصادي', moderate: 'متوسط', premium: 'فاخر' }[band]
              : band;
            return (
              <button
                key={band}
                type="button"
                onClick={() => toggle(setActiveBands, band)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  active
                    ? 'text-[var(--surface-container)]'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'bg-white border-[#122420]/10 text-[#4A635D] hover:bg-[#EAE6DD]'
                }`}
                style={active ? { backgroundColor: chipColor(band), borderColor: chipColor(band) } : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Guests stepper */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold mr-1 flex items-center gap-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/60'}`}>
            <Users className="w-3.5 h-3.5" />
            {isAr ? 'الضيوف' : 'Guests'}:
          </span>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full border ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
            <button
              type="button"
              onClick={() => setGuests(g => Math.max(0, g - 1))}
              className={`w-6 h-6 rounded-md transition-all cursor-pointer ${isDark ? 'hover:bg-[var(--surface-container)]' : 'hover:bg-[#F2EFE9]'}`}
              aria-label="Fewer guests"
            >−</button>
            <span className="text-xs font-black w-6 text-center">{guests || (isAr ? 'أي' : 'Any')}</span>
            <button
              type="button"
              onClick={() => setGuests(g => Math.min(20, g + 1))}
              className={`w-6 h-6 rounded-md transition-all cursor-pointer ${isDark ? 'hover:bg-[var(--surface-container)]' : 'hover:bg-[#F2EFE9]'}`}
              aria-label="More guests"
            >+</button>
          </div>
        </div>

        {/* Area chips */}
        {areas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className={`text-xs font-bold mr-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/60'}`}>
              <MapPin className="w-3.5 h-3.5 inline mr-0.5" />
              {t('hotels.areas')}:
            </span>
            <button
              type="button"
              onClick={() => setActiveAreas(new Set())}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                activeAreas.size === 0
                  ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                  : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
              }`}
            >
              {t('hotels.all')}
            </button>
            {areas.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(setActiveAreas, a.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  activeAreas.has(a.id)
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
                }`}
              >
                {isAr ? a.nameAr : a.name}
              </button>
            ))}
          </div>
        )}

        <section className="mb-10">
          <h2 className="font-serif font-bold text-lg mb-3">
            {isAr ? 'كل الإقامات' : 'All stays'}
            <span className={`text-xs font-normal ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]'}`}> ({filtered.length})</span>
          </h2>

          <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-6 lg:items-start">
            <div className={showMap ? 'hidden lg:block' : 'block'}>
              {filtered.length === 0 ? (
                <div className={`py-12 rounded-2xl border text-center text-sm ${
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
                }`}>
                  {isAr ? 'لا توجد إقامات تلائم التصفية — جرّب توسيع النوع أو الفئة السعرية.' : 'No stays match that filter — try a wider type or price band.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                  {filtered.map(a => (
                    <AccommodationCard key={a.id} accommodation={a} isDark={isDark} onOpen={(slug) => navigateTo('/hotels', { hotelSlug: slug })} />
                  ))}
                </div>
              )}
            </div>

            <div className={`${showMap ? 'block' : 'hidden'} lg:block h-[420px] lg:h-[640px] lg:sticky lg:top-20 rounded-2xl border overflow-hidden ${
              isDark ? 'border-[var(--border-subtle)]' : 'border-[#122420]/10'
            }`}>
              <AccommodationsMap
                accommodations={filtered.filter(a => a.latitude !== undefined && a.longitude !== undefined)}
                isDark={isDark}
                isAr={isAr}
                onSelect={(slug) => navigateTo('/hotels', { hotelSlug: slug })}
              />
            </div>
          </div>
        </section>

        {areas.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif font-bold text-lg mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
              {t('hotels.exploreAreas')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map(a => (
                <div key={a.id} className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'}`}>
                  <h3 className={`font-bold text-sm mb-1.5 flex items-center gap-2 ${isDark ? 'text-[var(--text-primary)]' : 'text-[#122420]'}`}>
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    {isAr ? a.nameAr : a.name}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-3 ${isDark ? 'text-[var(--text-secondary)]/75' : 'text-[#4A635D]'}`}>
                    {isAr ? a.descriptionAr : a.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {disclaimer && (
          <div className={`mb-12 rounded-2xl border p-5 flex items-start gap-3 ${
            isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'
          }`}>
            <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`} />
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
              {isAr ? disclaimer.ar : disclaimer.en}
            </p>
          </div>
        )}
      </div>

      {/* Floating list/map toggle — mobile only; desktop always shows both. */}
      <button
        type="button"
        onClick={() => setShowMap(v => !v)}
        className={`lg:hidden fixed bottom-24 ${isAr ? 'left-4' : 'right-4'} z-30 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all cursor-pointer active:scale-95 bg-[var(--accent-primary)] text-[var(--surface-container)]`}
      >
        {showMap ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
        {showMap ? (isAr ? 'القائمة' : 'List') : (isAr ? 'الخريطة' : 'Map')}
      </button>
    </div>
  );
};

export default AccommodationsView;
