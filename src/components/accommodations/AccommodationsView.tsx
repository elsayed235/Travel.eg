import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Star, MapPin, Info, Users, List, Map as MapIcon, Sparkles, Loader2 } from 'lucide-react';
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
  if (band === 'budget') return '#5f7042';
  if (band === 'moderate') return '#9a5a26';
  return '#5d5036';
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

  // Natural-language search — parses to the SAME AccommodationSearchFilters
  // shape the chips below control, then visibly applies them as pre-selected,
  // still-editable chips. There is no separate "AI results" path: the model
  // only ever produces a filter object, and the real GET /api/accommodations
  // query (via the client-side filter below) is what actually runs.
  const [nlQuery, setNlQuery] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlSource, setNlSource] = useState<'gemini' | 'fallback' | null>(null);
  const [nlError, setNlError] = useState<string | null>(null);

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

  const handleNlSearch = async () => {
    const query = nlQuery.trim();
    if (!query) return;
    setNlLoading(true);
    setNlError(null);
    try {
      const result = await api.parseAccommodationSearchIntent(query, isAr ? 'ar' : 'en');
      const f = result.filters;
      // Deliberately NOT setting searchQuery to the raw sentence: the plain
      // text box below drives a hard substring filter, and a whole NL
      // sentence ("quiet place near the sea for 2, not too expensive") will
      // never literally appear in a listing's name/tagline — it would zero
      // out every result. The NL parser already turned that sentence into
      // the structured filters below; those are what actually apply.
      setSearchQuery('');
      setActivePropertyTypes(f.propertyTypes?.length ? new Set(f.propertyTypes) : new Set(PROPERTY_TYPE_ORDER));
      setActiveCategories(f.categories?.length ? new Set(f.categories) : new Set(CATEGORY_ORDER));
      setActiveBands(f.priceBands?.length ? new Set(f.priceBands) : new Set(BAND_ORDER));
      setActiveAreas(f.areaIds?.length ? new Set(f.areaIds) : new Set());
      setGuests(f.guests && f.guests > 0 ? f.guests : 0);
      setNlSource(result.source);
    } catch (e: any) {
      setNlError(e?.message || (isAr ? 'تعذّر فهم هذا البحث.' : 'Could not understand that search.'));
    } finally {
      setNlLoading(false);
    }
  };

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
      className={`min-h-screen flex flex-col ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[var(--bg-canvas)] text-[var(--text-primary)]'
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
            : 'bg-gradient-to-r from-[var(--bg-canvas)]/96 via-[var(--bg-canvas)]/92 to-[var(--bg-canvas)]/80 backdrop-blur-[2px]'
        }`} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'}`}>
                {t('hotels.title')} · {t('hotels.ratingSource')}
              </span>
            </div>
            <h1 className="text-3xl chart-heading font-bold">
              {isAr ? 'أماكن الإقامة في دهب' : 'Places to stay in Dahab'}
            </h1>
            <p className={`text-sm max-w-xl ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[var(--text-secondary)]'}`}>
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
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}>
                  <span className="font-black">{stat.value}</span>{' '}{stat.label}
                </div>
              ))}
              {stats.updatedLabel && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]/80' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--accent-primary)]'
                }`}>
                  {stats.updatedLabel}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Natural-language search — parses to the same filters the chips below
            control; results always come from the real catalogue, never the AI. */}
        <div className={`mb-4 rounded-2xl border p-4 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'}`}>
          <div className={`flex items-center gap-1.5 text-xs font-bold mb-2 ${isDark ? 'text-[var(--accent-primary)]' : 'text-[#c97b3c]'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {isAr ? 'اسأل بلغتك الطبيعية' : 'Search in your own words'}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNlSearch(); }}
              placeholder={isAr ? 'مثال: مكان هادي قريب من البحر لشخصين، مش غالي' : 'e.g. quiet place near the sea for 2, not too expensive'}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-sm ${
                isDark
                  ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40'
                  : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50'
              } focus:outline-none focus:border-[var(--accent-primary)]`}
            />
            <button
              type="button"
              onClick={handleNlSearch}
              disabled={nlLoading || !nlQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--surface-container)] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {nlLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isAr ? 'بحث' : 'Search'}
            </button>
          </div>
          {nlError && <p className="text-[11px] text-rose-400 mt-2">{nlError}</p>}
          {nlSource && !nlError && (
            <p className={`text-[10.5px] mt-2 ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[var(--text-secondary)]/60'}`}>
              {isAr ? 'تم تطبيق الفلاتر أدناه — عدّلها متى شئت.' : 'Filters below were applied — adjust them anytime.'}
              {nlSource === 'fallback' && (isAr ? ' (مطابقة سريعة)' : ' (quick match)')}
            </p>
          )}
        </div>

        <div className="relative max-w-md mb-6">
          <Search className={`absolute ${isAr ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[var(--text-secondary)]/40' : 'text-[var(--text-secondary)]/40'}`} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('hotels.searchPlaceholder')}
            className={`w-full py-3 ${isAr ? 'pl-4 pr-10' : 'pl-10 pr-4'} rounded-xl border text-sm ${
              isDark
                ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:border-[var(--accent-primary)]'
                : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[var(--accent-primary)]'
            } focus:outline-none`}
          />
        </div>

        {/* Property type chips */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold me-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/60'}`}>
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] border cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]'
                }`}
              >
                {isAr ? label.ar : label.en}
              </button>
            );
          })}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold me-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/60'}`}>
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] border cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Price bands */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold me-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/60'}`}>
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] border cursor-pointer ${
                  active
                    ? 'text-white'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]'
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
          <span className={`text-xs font-bold me-1 flex items-center gap-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/60'}`}>
            <Users className="w-3.5 h-3.5" />
            {isAr ? 'الضيوف' : 'Guests'}:
          </span>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full border ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'}`}>
            <button
              type="button"
              onClick={() => setGuests(g => Math.max(0, g - 1))}
              className={`w-8 h-8 rounded-md transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${isDark ? 'hover:bg-[var(--surface-container)]' : 'hover:bg-[var(--surface-container)]'}`}
              aria-label="Fewer guests"
            >−</button>
            <span className="text-xs font-black w-6 text-center">{guests || (isAr ? 'أي' : 'Any')}</span>
            <button
              type="button"
              onClick={() => setGuests(g => Math.min(20, g + 1))}
              className={`w-8 h-8 rounded-md transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${isDark ? 'hover:bg-[var(--surface-container)]' : 'hover:bg-[var(--surface-container)]'}`}
              aria-label="More guests"
            >+</button>
          </div>
        </div>

        {/* Area chips */}
        {areas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className={`text-xs font-bold me-1 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/60'}`}>
              <MapPin className="w-3.5 h-3.5 inline me-0.5" />
              {t('hotels.areas')}:
            </span>
            <button
              type="button"
              onClick={() => setActiveAreas(new Set())}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] border cursor-pointer ${
                activeAreas.size === 0
                  ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                  : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              {t('hotels.all')}
            </button>
            {areas.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(setActiveAreas, a.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] border cursor-pointer ${
                  activeAreas.has(a.id)
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {isAr ? a.nameAr : a.name}
              </button>
            ))}
          </div>
        )}

        <section className="mb-10">
          <h2 className="chart-heading font-bold text-lg mb-3">
            {isAr ? 'كل الإقامات' : 'All stays'}
            <span className={`text-xs font-normal ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'}`}> ({filtered.length})</span>
          </h2>

          <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-6 lg:items-start">
            <div className={showMap ? 'hidden lg:block' : 'block'}>
              {filtered.length === 0 ? (
                <div className={`py-12 rounded-2xl border text-center text-sm ${
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
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
              isDark ? 'border-[var(--border-subtle)]' : 'border-[var(--border-subtle)]'
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
            <h2 className="chart-heading font-bold text-lg mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
              {t('hotels.exploreAreas')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map(a => (
                <div key={a.id} className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'}`}>
                  <h3 className={`font-bold text-sm mb-1.5 flex items-center gap-2 ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    {isAr ? a.nameAr : a.name}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-3 ${isDark ? 'text-[var(--text-secondary)]/75' : 'text-[var(--text-secondary)]'}`}>
                    {isAr ? a.descriptionAr : a.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {disclaimer && (
          <div className={`mb-12 rounded-2xl border p-5 flex items-start gap-3 ${
            isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'
          }`}>
            <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`} />
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
              {isAr ? disclaimer.ar : disclaimer.en}
            </p>
          </div>
        )}
      </div>

      {/* Floating list/map toggle — mobile only; desktop always shows both. */}
      <button
        type="button"
        onClick={() => setShowMap(v => !v)}
        className={`lg:hidden fixed bottom-24 ${isAr ? 'left-4' : 'right-4'} z-30 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold shadow-lg transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer active:scale-95 bg-[var(--accent-primary)] text-[var(--surface-container)]`}
      >
        {showMap ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
        {showMap ? (isAr ? 'القائمة' : 'List') : (isAr ? 'الخريطة' : 'Map')}
      </button>
    </div>
  );
};

export default AccommodationsView;
