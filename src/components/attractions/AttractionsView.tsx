import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Mountain, Star, Clock, MapPin, ExternalLink, Search, X, Sparkles, Ticket,
  Phone, MessageCircle, Globe, Instagram, Hash
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import type { DahabAttraction, AttractionCategory } from '../../shared/types/knowledge';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const durationLabel = (minutes?: number): string => {
  if (!minutes || minutes <= 0) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = minutes / 60;
  return h === Math.floor(h) ? `${h} h` : `${Math.floor(h)}–${Math.ceil(h)} h`;
};

const BUCKET_EMOJI: Record<string, string> = {
  'nature-wildlife': '🐠',
  'diving-snorkeling': '🤿',
  'beaches-lagoons': '🏖️',
  'sights-landmarks': '🏛️',
  'desert-mountains': '🏜️',
  wellness: '🧘',
  culture: '🪕'
};

// ---------------------------------------------------------------------------
// AttractionCard — one ranked row in the Tripadvisor-style list
// ---------------------------------------------------------------------------

interface AttractionCardProps {
  item: DahabAttraction;
  rank: number;
  onViewDetails: (item: DahabAttraction) => void;
  onBook: (item: DahabAttraction) => void;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ item, rank, onViewDetails, onBook }) => {
  const { language , t} = useLanguage();
  const { isDark } = useTheme();
  const rtl = language === 'ar';

  const name = language === 'ar' && item.nameAr ? item.nameAr : item.nameEn;
  const categoryLabel = language === 'ar' ? item.categoryLabelAr : item.categoryLabelEn;
  const description = language === 'ar' ? item.descriptionAr : item.descriptionEn;
  const area = language === 'ar' ? item.areaLabelAr : item.areaLabelEn;
  const duration = durationLabel(item.durationMinutes);
  const hasRating = typeof item.rating === 'number';

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={`group relative flex gap-4 sm:gap-5 rounded-2xl border p-3 sm:p-4 transition-all cursor-pointer ${
        isDark
          ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
          : 'bg-white border-[#122420]/10 hover:border-[var(--accent-primary)]'
      }`}
    >
      {/* Rank */}
      <div className="hidden sm:flex flex-col items-center justify-start pt-2 w-8 flex-shrink-0">
        <span className="font-serif font-bold text-2xl leading-none text-[var(--text-secondary)]/40">
          {rank}
        </span>
      </div>

      {/* Image */}
      <button
        type="button"
        onClick={() => onViewDetails(item)}
        aria-label={name}
        className="relative w-28 sm:w-40 h-28 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--surface-container)] cursor-pointer group/img"
      >
        {item.image ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform group-hover/img:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--surface-container)] to-[var(--surface-card)] flex items-center justify-center">
            <span className="text-3xl opacity-50">{BUCKET_EMOJI[item.bucket] || '✨'}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate">
          {categoryLabel}
        </span>
      </button>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col">
        <button
          type="button"
          onClick={() => onViewDetails(item)}
          className="text-left cursor-pointer"
        >
          <h3 className="font-serif font-bold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-[var(--accent-primary)]">
            {name}
          </h3>
        </button>

        {/* Rating — only when real; the corpus measures none for sights/activities */}
        <div className="flex items-center gap-2 mt-1.5 text-xs">
          {hasRating ? (
            <>
              <span className="flex items-center gap-1 font-bold text-[var(--accent-secondary)]">
                <Star className="w-3.5 h-3.5 fill-current" />
                {item.rating?.toFixed(1)}
              </span>
              <span className="text-[var(--text-secondary)]/70">
                {item.reviewCount} {t('attractions.reviews')}
              </span>
            </>
          ) : (
            <span className="text-[var(--text-secondary)]/50">
              {t('attractions.noRatingsYet')}
            </span>
          )}

          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            item.kind === 'sight'
              ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
              : item.kind === 'activity'
                ? 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]'
                : 'bg-amber-500/10 text-amber-600'
          }`}>
            {item.kind === 'sight' ? t('attractions.kindSight') : item.kind === 'activity' ? t('attractions.kindActivity') : t('attractions.kindProvider')}
          </span>
        </div>

        {/* Facts: duration / price / area */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-[var(--text-secondary)]/80">
          {item.durationMinutes ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
          ) : null}
          {item.priceEGP ? (
            <span className="flex items-center gap-1 font-bold text-[var(--accent-primary)]">
              <span className="text-[var(--text-secondary)]/60 font-normal">
                {t('attractions.from')}
              </span>
              {item.priceEGP.toLocaleString()} EGP
            </span>
          ) : null}
          {area ? (
            <span className="flex items-center gap-1 truncate max-w-[40%]">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{area}</span>
            </span>
          ) : null}
          {item.difficulty ? (
            <span className="px-1.5 py-0.5 rounded bg-[var(--surface-container)] text-[10px] font-bold">
              {item.difficulty}
            </span>
          ) : null}
        </div>

        {/* Description */}
        {description && (
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]/70 line-clamp-2">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t('attractions.viewDetails')}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          {item.bookable && item.skuId ? (
            <button
              type="button"
              onClick={() => onBook(item)}
              className="px-3.5 py-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-container)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Ticket className="w-3.5 h-3.5" />
              {t('attractions.bookNow')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// AttractionDetailModal — ?attraction=<id>
// ---------------------------------------------------------------------------

interface AttractionDetailModalProps {
  item: DahabAttraction;
  language: 'en' | 'ar';
  isDark: boolean;
  onClose: () => void;
  onBook: (item: DahabAttraction) => void;
}

const AttractionDetailModal: React.FC<AttractionDetailModalProps> = ({
  item, language, isDark, onClose, onBook
}) => {
  const { t } = useLanguage();
  const rtl = language === 'ar';
  const name = language === 'ar' && item.nameAr ? item.nameAr : item.nameEn;
  const categoryLabel = language === 'ar' ? item.categoryLabelAr : item.categoryLabelEn;
  const description = language === 'ar' ? item.descriptionAr : item.descriptionEn;
  const area = language === 'ar' ? item.areaLabelAr : item.areaLabelEn;
  const duration = durationLabel(item.durationMinutes);
  const hasRating = typeof item.rating === 'number';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl ${
        isDark ? 'bg-[var(--surface-card)] text-[var(--text-primary)]' : 'bg-white text-[#122420]'
      }`}>
        {/* Image banner */}
        <div className="relative h-52 sm:h-64 w-full">
          {item.image ? (
            <img src={item.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--surface-container)] to-[var(--surface-card)] flex items-center justify-center">
              <span className="text-6xl opacity-40">{BUCKET_EMOJI[item.bucket] || '✨'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label={t('attractions.close')}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="inline-block px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold">
              {categoryLabel}
            </span>
            <h2 className="mt-1.5 font-serif font-bold text-xl sm:text-2xl text-white leading-snug">
              {name}
            </h2>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Rating row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {hasRating ? (
              <>
                <span className="flex items-center gap-1 font-bold text-[var(--accent-secondary)]">
                  <Star className="w-4 h-4 fill-current" />
                  {item.rating?.toFixed(1)}
                </span>
                <span className="text-[var(--text-secondary)]/70">
                  {item.reviewCount} {t('attractions.reviews')}
                </span>
              </>
            ) : (
              <span className="text-[var(--text-secondary)]/60 text-xs">
                {t('attractions.noCollectedRatingsYet')}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              item.kind === 'sight'
                ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                : item.kind === 'activity'
                  ? 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]'
                  : 'bg-amber-500/10 text-amber-600'
            }`}>
              {item.kind === 'sight' ? t('attractions.kindSightLandmark') : item.kind === 'activity' ? t('attractions.kindActivity') : t('attractions.kindVerifiedProvider')}
            </span>
          </div>

          {/* Facts grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {item.durationMinutes ? (
              <div className={`rounded-xl p-3 border ${isDark ? 'border-[var(--border-subtle)] bg-[var(--surface-container)]' : 'border-[#122420]/10 bg-[#FBF9F5]'}`}>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]/60">
                  {t('attractions.duration')}
                </div>
                <div className="mt-0.5 text-sm font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                  {duration}
                </div>
              </div>
            ) : null}
            {item.priceEGP ? (
              <div className={`rounded-xl p-3 border ${isDark ? 'border-[var(--border-subtle)] bg-[var(--surface-container)]' : 'border-[#122420]/10 bg-[#FBF9F5]'}`}>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]/60">
                  {t('attractions.price')}
                </div>
                <div className="mt-0.5 text-sm font-bold text-[var(--accent-primary)]">
                  {t('attractions.from')} {item.priceEGP.toLocaleString()} EGP
                </div>
              </div>
            ) : null}
            {area ? (
              <div className={`rounded-xl p-3 border ${isDark ? 'border-[var(--border-subtle)] bg-[var(--surface-container)]' : 'border-[#122420]/10 bg-[#FBF9F5]'}`}>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]/60">
                  {t('attractions.area')}
                </div>
                <div className="mt-0.5 text-sm font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-secondary)] flex-shrink-0" />
                  <span className="truncate">{area}</span>
                </div>
              </div>
            ) : null}
            {item.difficulty ? (
              <div className={`rounded-xl p-3 border ${isDark ? 'border-[var(--border-subtle)] bg-[var(--surface-container)]' : 'border-[#122420]/10 bg-[#FBF9F5]'}`}>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]/60">
                  {t('attractions.difficulty')}
                </div>
                <div className="mt-0.5 text-sm font-bold">{item.difficulty}</div>
              </div>
            ) : null}
            {item.coordinates ? (
              <div className={`rounded-xl p-3 border ${isDark ? 'border-[var(--border-subtle)] bg-[var(--surface-container)]' : 'border-[#122420]/10 bg-[#FBF9F5]'}`}>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]/60">
                  {t('attractions.location')}
                </div>
                <div className="mt-0.5 text-sm font-bold flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                  {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}
                </div>
              </div>
            ) : null}
          </div>

          {/* Description */}
          {description && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]/60">
                {t('attractions.aboutThisPlace')}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]/90">
                {description}
              </p>
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.slice(0, 8).map(tag => (
                <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isDark ? 'bg-[var(--surface-container)] text-[var(--text-secondary)]' : 'bg-[#EAE6DD] text-[#4A635D]'
                }`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Contact — only for providers that actually have one */}
          {item.contact && (item.contact.whatsapp || item.contact.phone || item.contact.website || item.contact.instagram) ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.contact.whatsapp && (
                <a
                  href={`https://wa.me/${item.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-green-600/90 hover:bg-green-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              )}
              {item.contact.phone && (
                <a
                  href={`tel:${item.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                    isDark ? 'border-[var(--border-subtle)] text-[var(--text-primary)]' : 'border-[#122420]/10 text-[#122420]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {t('attractions.call')}
                </a>
              )}
              {item.contact.website && (
                <a
                  href={item.contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                    isDark ? 'border-[var(--border-subtle)] text-[var(--text-primary)]' : 'border-[#122420]/10 text-[#122420]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {t('attractions.website')}
                </a>
              )}
              {item.contact.instagram && (
                <a
                  href={`https://instagram.com/${item.contact.instagram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                    isDark ? 'border-[var(--border-subtle)] text-[var(--text-primary)]' : 'border-[#122420]/10 text-[#122420]'
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram
                </a>
              )}
            </div>
          ) : null}

          {/* Book CTA */}
          {item.bookable && item.skuId ? (
            <button
              type="button"
              onClick={() => onBook(item)}
              className="mt-5 w-full py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-container)] text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Ticket className="w-4 h-4" />
              {t('attractions.bookThisExperience')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// AttractionsView — the "Things to Do" page
// ---------------------------------------------------------------------------

type AttractionSort = 'top' | 'rating' | 'popular' | 'name';

const SORTS: Array<{ id: AttractionSort; label: string; labelAr: string }> = [
  { id: 'top', label: 'Top attractions', labelAr: 'أفضل المعالم' },
  { id: 'rating', label: 'Traveler favorites', labelAr: 'الأعلى تقييماً' },
  { id: 'popular', label: 'Most reviewed', labelAr: 'الأكثر مراجعة' },
  { id: 'name', label: 'A–Z', labelAr: 'أبجدياً' }
];

export const AttractionsView: React.FC = () => {
  const { navigateTo } = useTrip();
  const { language , t} = useLanguage();
  const { isDark } = useTheme();

  // ---- URL-seeded state ----
  const [activeBucket, setActiveBucket] = useState<string | null>(() => {
    const raw = new URLSearchParams(window.location.search).get('category');
    return raw && raw !== 'all' ? raw : null;
  });

  const [sort, setSort] = useState<AttractionSort>(() => {
    const raw = new URLSearchParams(window.location.search).get('sort');
    return (SORTS.some(s => s.id === raw) ? raw as AttractionSort : 'top');
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get('q') || '';
  });

  // Detail panel, carried in the URL (?attraction=id) so a specific page is
  // linkable and survives a refresh — the same contract as /restaurants.
  const [detailId, setDetailId] = useState<string | null>(() => {
    return new URLSearchParams(window.location.search).get('attraction');
  });

  // ---- Fetch (server-driven: the /api/dahab/attractions endpoint filters) ----
  const attractionsFetcher = useCallback(
    (signal: AbortSignal) =>
      api.getDahabAttractions(
        {
          category: activeBucket || undefined,
          q: searchQuery.trim() || undefined,
          sort,
          // Name sorts A→Z; rating/popular/top are naturally descending.
          order: sort === 'name' ? 'asc' : undefined
        },
        signal
      ),
    [activeBucket, searchQuery, sort]
  );
  const corpus = useApiResource(attractionsFetcher);

  const attractions = useMemo<DahabAttraction[]>(() => corpus.data?.attractions || [], [corpus.data]);
  const categories = useMemo<AttractionCategory[]>(() => corpus.data?.categories || [], [corpus.data]);

  // ---- URL sync helpers ----
  const syncUrl = useCallback((mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(window.location.search);
    mutate(params);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, []);

  const selectBucket = useCallback((bucketId: string | null) => {
    setActiveBucket(bucketId);
    syncUrl(params => {
      if (bucketId) params.set('category', bucketId);
      else params.delete('category');
    });
  }, [syncUrl]);

  const selectSort = useCallback((next: AttractionSort) => {
    setSort(next);
    syncUrl(params => {
      if (next === 'top') params.delete('sort');
      else params.set('sort', next);
    });
  }, [syncUrl]);

  const setSearch = useCallback((q: string) => {
    setSearchQuery(q);
    syncUrl(params => {
      if (q) params.set('q', q);
      else params.delete('q');
    });
  }, [syncUrl]);

  const viewDetails = useCallback((item: DahabAttraction) => {
    setDetailId(item.id);
    syncUrl(params => params.set('attraction', item.id));
  }, [syncUrl]);

  const closeDetails = useCallback(() => {
    setDetailId(null);
    syncUrl(params => params.delete('attraction'));
  }, [syncUrl]);

  const bookAttraction = useCallback((item: DahabAttraction) => {
    if (item.skuId) navigateTo('/book-now', { skuId: item.skuId });
  }, [navigateTo]);

  // ---- Render ----
  const detailItem = detailId ? attractions.find(a => a.id === detailId) || null : null;
  const totalCount = corpus.data?.count ?? attractions.length;

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[#FBF9F5] text-[#122420]'
      }`}>

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
          <Mountain className="w-4 h-4" />
          {t('attractions.dahab')} · {t('attractions.activities')}
        </div>
        <h1 className="mt-1 text-3xl sm:text-4xl font-serif font-bold">
          {t('attractions.thingsToDoIn')}
        </h1>
        <p className={`mt-1.5 text-sm max-w-2xl ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
          {t('attractions.sightsDiveSitesDesert')}
        </p>

        {/* Guide tabs — the reference page's destination header cross-links
            Hotels / Things to Do / Restaurants; same idea here. */}
        <nav aria-label={t('attractions.dahabGuide')} className="mt-4 flex flex-wrap items-center gap-1 sm:gap-2 text-sm font-bold">
          {[
            { route: '/hotels' as const, labelEn: 'Hotels', labelAr: 'فنادق' },
            { route: '/attractions' as const, labelEn: 'Things to Do', labelAr: 'أنشطة' },
            { route: '/restaurants' as const, labelEn: 'Restaurants', labelAr: 'مطاعم' }
          ].map(tab => {
            const active = tab.route === '/attractions';
            return (
              <button
                key={tab.route}
                type="button"
                onClick={() => !active && navigateTo(tab.route)}
                aria-current={active ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                    : isDark
                      ? 'bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:bg-[#1a4038]'
                      : 'bg-white/60 text-[#4A635D] border-[#122420]/10 hover:text-[#122420] hover:bg-white'
                }`}>
                {language === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-3">
        <div className="relative max-w-md">
          <Search className={`absolute ${language === 'ar' ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[var(--text-secondary)]/40' : 'text-[#4A635D]/40'}`} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('attractions.searchSightsActivitiesPlaces')}
            className={`w-full py-2.5 pl-${language === 'ar' ? '4' : '10'} pr-${language === 'ar' ? '10' : '4'} rounded-xl border text-sm ${
              isDark
                ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:border-[var(--accent-primary)]'
                : 'bg-white border-[#122420]/10 text-[#122420] placeholder:text-[#4A635D]/50 focus:border-[var(--accent-primary)]'
            } focus:outline-none`}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Category rail — sidebar on desktop, scrollable chips on mobile */}
        <aside className="lg:w-60 flex-shrink-0">
          <h2 className={`hidden lg:block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/70'}`}>
            {t('attractions.categories')}
          </h2>
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            <button
              type="button"
              onClick={() => selectBucket(null)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeBucket === null
                  ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                  : isDark
                    ? 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                    : 'bg-white text-[#4A635D] border-[#122420]/10 hover:text-[#122420]'
              }`}>
              <span>{t('attractions.allThingsToDo')}</span>
              <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                activeBucket === null ? 'bg-white/20' : isDark ? 'bg-[var(--surface-container)]' : 'bg-[#EAE6DD]'
              }`}>
                {totalCount}
              </span>
            </button>
            {categories.map(cat => {
              const active = activeBucket === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectBucket(active ? null : cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                      : isDark
                        ? 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                        : 'bg-white text-[#4A635D] border-[#122420]/10 hover:text-[#122420]'
                  }`}>
                  <span className="flex-shrink-0">{BUCKET_EMOJI[cat.id] || '✨'}</span>
                  <span className="whitespace-nowrap lg:whitespace-normal">
                    {language === 'ar' ? cat.labelAr : cat.labelEn}
                  </span>
                  <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ml-auto ${
                    active ? 'bg-white/20' : isDark ? 'bg-[var(--surface-container)]' : 'bg-[#EAE6DD]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          {/* Sort tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {SORTS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => selectSort(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  sort === s.id
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : isDark
                      ? 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                      : 'bg-white text-[#4A635D] border-[#122420]/10 hover:text-[#122420]'
                }`}>
                {language === 'ar' ? s.labelAr : s.label}
              </button>
            ))}
            <span className={`text-xs ml-auto ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/70'}`}>
              {attractions.length} {t('attractions.results')}
            </span>
          </div>

          {/* Ranked list */}
          {attractions.length === 0 ? (
            <div className={`py-16 text-center rounded-2xl border ${
              isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-white border-[#122420]/10'
            }`}>
              <Sparkles className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-[var(--text-secondary)]/40' : 'text-[#4A635D]/40'}`} />
              <p className={`text-sm ${isDark ? 'text-[var(--text-secondary)]' : 'text-[#4A635D]'}`}>
                {t('attractions.noAttractionsMatchThat')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {attractions.map((item, idx) => (
                <AttractionCard
                  key={item.id}
                  item={item}
                  rank={idx + 1}
                  onViewDetails={viewDetails}
                  onBook={bookAttraction}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Detail modal */}
      {detailItem && (
        <AttractionDetailModal
          item={detailItem}
          language={language as 'en' | 'ar'}
          isDark={isDark}
          onClose={closeDetails}
          onBook={bookAttraction}
        />
      )}
    </div>
  );
};

export default AttractionsView;