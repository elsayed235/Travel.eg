import React, { useCallback, useMemo, useState } from 'react';
import { Search, Star, MapPin, Info } from 'lucide-react';
import { HotelCard } from './HotelCard';
import { HotelDetailView } from './HotelDetailView';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import type { HotelCategory, HotelCatalogueResponse, HotelEntity, HotelPriceBand } from '../../shared/types/commerce';

const CATEGORY_ORDER: HotelCategory[] = ['budget', 'mid-range', 'boutique', 'resort'];
const BAND_ORDER: HotelPriceBand[] = ['budget', 'moderate', 'premium'];

function chipColor(band: HotelPriceBand): string {
  if (band === 'budget') return '#7a8c5c';
  if (band === 'moderate') return '#c97b3c';
  return '#7a6a4a';
}

export const HotelsView: React.FC = () => {
  const { navigateTo, selectedHotelSlug } = useTrip();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';

  const corpus = useApiResource<HotelCatalogueResponse>(
    useCallback((signal) => api.getHotels(undefined, signal), [])
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<HotelCategory>>(() => new Set(CATEGORY_ORDER));
  const [activeBands, setActiveBands] = useState<Set<HotelPriceBand>>(() => new Set(BAND_ORDER));
  const [activeAreas, setActiveAreas] = useState<Set<string>>(() => new Set());

  // Detail page wins when the URL carries a hotel slug.
  if (selectedHotelSlug) {
    return (
      <HotelDetailView
        hotelSlug={selectedHotelSlug}
        onBackToList={() => navigateTo('/hotels')}
      />
    );
  }

  const hotels = corpus.data?.hotels ?? [];
  const areas = corpus.data?.areas ?? [];
  const areaOptions = areas.map(a => a.id);

  const toggle = <T,>(set: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    set(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const filtered = useMemo<HotelEntity[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    return hotels.filter(h => {
      if (!activeCategories.has(h.category)) return false;
      if (!activeBands.has(h.priceBand)) return false;
      if (activeAreas.size > 0 && !activeAreas.has(h.area)) return false;
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        (h.nameAr || '').toLowerCase().includes(q) ||
        (h.areaName || '').toLowerCase().includes(q) ||
        (h.areaNameAr || '').toLowerCase().includes(q) ||
        h.tagline.toLowerCase().includes(q)
      );
    });
  }, [hotels, activeCategories, activeBands, activeAreas, searchQuery]);

  const stats = corpus.data?.stats;
  const disclaimer = corpus.data?.disclaimer;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'
      }`}
    >
      {/* Hero with authentic Dahab backdrop */}
      <div className="relative border-b overflow-hidden">
        <img
          src="/images/hotels/swiss-inn-resort.jpg"
          alt="Dahab Stays & Resorts"
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
              {t('hotels.title')}
            </h1>
            <p className={`text-sm max-w-xl ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[#4A635D]'}`}>
              {t('hotels.subtitle', { count: stats?.total ?? hotels.length })}
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex flex-wrap gap-3 mt-5">
              {[ 
                { label: t('hotels.statsHotels'), value: stats.total },
                { label: t('hotels.statsAvgRating'), value: `${stats.averageRating.toFixed(1)}★` },
                { label: t('hotels.statsReviews'), value: stats.totalReviews.toLocaleString() },
              ].map(stat => (
                <div key={stat.label} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
                }`}>
                  <span className="font-black">{stat.value}</span>
                  {' '}{stat.label}
                </div>
              ))}
              {stats.updatedLabel && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]/80' : 'bg-white border-[#122420]/10 text-[var(--accent-primary)]'
                }`}>
                  {isAr ? 'أُحدث في أبريل ٢٠٢٦' : stats.updatedLabel}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Search */}
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

        {/* Area chips */}
        {areaOptions.length > 0 && (
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

        {/* Results */}
        <section className="mb-10">
          <h2 className="font-serif font-bold text-lg mb-3">
            {t('hotels.viewAllHotels')}
            <span className={`text-xs font-normal ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]'}`}>
              {' '}({filtered.length})
            </span>
          </h2>
          {filtered.length === 0 ? (
            <div className={`py-12 rounded-2xl border text-center text-sm ${
              isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-white border-[#122420]/10 text-[#4A635D]'
            }`}>
              {isAr ? 'لا توجد فنادق تلائم التصفية — جرّب فئة أو فئة سعرية أوسع.' : 'No hotels match that filter — try a wider category or price band.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(h => (
                <HotelCard key={h.id} hotel={h} isDark={isDark} onOpen={(slug) => navigateTo('/hotels', { hotelSlug: slug })} />
              ))}
            </div>
          )}
        </section>

        {/* Area guide */}
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
                  {(a.spotsAr?.length ? a.spotsAr : a.spots || []).slice(0, 5).map((s, i) => (
                    <span key={i} className="inline-block mr-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      {s}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
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
    </div>
  );
};

export default HotelsView;