import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Compass,
  Calendar,
  UtensilsCrossed,
  LifeBuoy,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute } from '../../types';

interface SearchResultItem {
  id: string;
  title: string;
  titleAr?: string;
  category: 'Experience' | 'Booking' | 'Food & Cafe' | 'Help & Safety' | 'Itinerary';
  categoryAr?: string;
  subtitle: string;
  subtitleAr?: string;
  route: AppRoute;
  actionParams?: { dayId?: number; activityId?: string; bookingId?: string; experienceSlug?: string; programSlug?: string };
}

/**
 * The navigational entries: the pages and tools a traveler might be looking for.
 *
 * This used to be the search's *entire* index — eight items, four of them
 * places — while the destination corpus held 17 places, 22 activities and 10
 * dining venues that the search had never seen. Typing "Eel Garden" or
 * "Ras Abu Galum" returned nothing.
 */
const NAVIGATION_CATALOG: SearchResultItem[] = [
  {
    id: 's-blue-hole',
    title: 'The Blue Hole & The Arch',
    titleAr: 'البلو هول وحيد الشعب المرجانية',
    category: 'Experience',
    categoryAr: 'تجارب',
    subtitle: '100m coral sinkhole, world premier freediving & dive wall',
    subtitleAr: 'أشهر بقعة غطس وحر بالعالم مع جدار مرجاني مهيب',
    route: '/experiences',
    actionParams: { experienceSlug: 'near-blue-hole' },
  },
  {
    id: 's-canyon',
    title: 'The Canyon Guided Dive',
    titleAr: 'غطسة الكانيون مع مرشد محلي',
    category: 'Itinerary',
    categoryAr: 'جدول الرحلة',
    subtitle: 'Scheduled today at 08:45 AM (Day 2 Activity)',
    subtitleAr: 'ميعادها النهارده ٨:٤٥ صباحاً (نشاط اليوم التاني)',
    route: '/my-trip',
    actionParams: { dayId: 2 },
  },
  {
    id: 's-hotel-booking',
    title: 'Dahab Bay Hotel (Sea View Deluxe)',
    titleAr: 'فندق دهب باي (أوضة ديلوكس ع البحر)',
    category: 'Booking',
    categoryAr: 'حجوزات',
    subtitle: 'Confirmation #DHB-HTL-4091 · 4 nights reserved',
    subtitleAr: 'رقم التأكيد #DHB-HTL-4091 · ٤ ليالي مؤكدة',
    route: '/bookings',
    actionParams: { bookingId: 'b-hotel-1' },
  },
  {
    id: 's-ralphs',
    title: "Ralph's German Bakery",
    titleAr: 'مخبز رالفز الألماني',
    category: 'Food & Cafe',
    categoryAr: 'أكل وكافيهات',
    subtitle: 'Fresh sourdough, cinnamon rolls & iced hibiscus tea',
    subtitleAr: 'ساوردو فريش، سينابون رول، وكركديه ساقع ع البحر',
    route: '/food',
  },
  {
    id: 's-ali-baba',
    title: 'Ali Baba Waterfront Seafood',
    titleAr: 'مطعم علي بابا للسمك الطازة',
    category: 'Food & Cafe',
    categoryAr: 'أكل وكافيهات',
    subtitle: 'Fresh catch of the day by the sea, charcoal grilled',
    subtitleAr: 'صيد اليوم مشوي ع الفحم مباشرة قدام الممشى',
    route: '/food',
  },
  {
    id: 's-hyperbaric',
    title: 'Dahab Hyperbaric Chamber Emergency Hotline',
    titleAr: 'طوارئ مركز دهب لطب الأعماق والضغط',
    category: 'Help & Safety',
    categoryAr: 'طوارئ وأمان',
    subtitle: '24/7 Decompression doctor: +20 69 364 0530',
    subtitleAr: 'طبيب علاج ضغط مناوب ٢٤/٧: 0530 364 69 20+',
    route: '/help',
  },
  {
    id: 's-safari',
    title: 'Wadi Gnai 4x4 Desert Safari & Dinner',
    titleAr: 'سفاري وادي قني ٤×٤ وعشاء بدوي',
    category: 'Booking',
    categoryAr: 'حجوزات',
    subtitle: 'Scheduled Day 3 at 03:00 PM · Sinai Bedouin Guides',
    subtitleAr: 'ميعادها اليوم التالت ٣:٠٠ عصراً · مرشدين بدو سيناء',
    route: '/bookings',
    actionParams: { bookingId: 'b-safari-1' },
  },
  {
    id: 's-blue-lagoon',
    title: 'Blue Lagoon & Ras Abu Galum Boat Trip',
    titleAr: 'مركب البلو لاجون ورأس أبو جالوم',
    category: 'Experience',
    categoryAr: 'تجارب',
    subtitle: 'Crystal shallow waters, hammock palapas, mountain backdrop',
    subtitleAr: 'مية فيروزية صافية، شلتات بحر هادية، وخلفية جبلية ساحرة',
    route: '/explore',
  },
];

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The destination corpus, fetched once. Stable so useApiResource does not
 * re-request on every keystroke.
 */
const fetchSearchCorpus = (signal: AbortSignal) =>
  Promise.all([
    api.getDahabPlaces(signal).catch(() => ({ places: [] })),
    api.getDahabActivities(signal).catch(() => ({ activities: [] })),
    api.getDahabDining(undefined, signal).catch(() => ({ venues: [] }))
  ]).then(([p, a, v]) => ({ places: p.places, activities: a.activities, venues: v.venues }));

export const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const corpus = useApiResource(fetchSearchCorpus);
  const { navigateTo } = useTrip();
  const { language, isRTL, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /**
   * Everything the search can find: the pages above, plus the destination
   * corpus — its places, its things to do and its restaurants.
   *
   * The index used to be the eight navigation entries alone, so a traveler
   * typing the name of a real Dahab place got "no results" for somewhere the
   * platform holds a verified record of.
   */
  const catalog: SearchResultItem[] = [
    ...NAVIGATION_CATALOG,
    ...(corpus.data?.places ?? []).map<SearchResultItem>(place => ({
      id: `place-${place.id}`,
      title: place.nameEn,
      titleAr: place.nameAr,
      category: 'Experience',
      categoryAr: 'أماكن',
      subtitle: place.descriptionEn,
      subtitleAr: place.descriptionAr,
      route: '/experiences',
      actionParams: { experienceSlug: place.id }
    })),
    ...(corpus.data?.activities ?? []).map<SearchResultItem>(activity => ({
      id: `activity-${activity.id}`,
      title: activity.titleEn,
      titleAr: activity.titleAr,
      category: 'Experience',
      categoryAr: 'تجارب',
      subtitle: `${activity.difficulty} · ${activity.basePriceEGP} EGP`,
      subtitleAr: `${activity.difficulty} · ${activity.basePriceEGP} ج.م`,
      route: '/experiences',
      actionParams: { experienceSlug: activity.id }
    })),
    ...(corpus.data?.venues ?? []).map<SearchResultItem>(venue => ({
      id: `venue-${venue.id}`,
      title: venue.nameEn,
      titleAr: venue.nameAr,
      category: 'Food & Cafe',
      categoryAr: 'أكل وكافيهات',
      subtitle: `${venue.cuisine.join(' · ')} · ${venue.openingHours}`,
      subtitleAr: `${venue.cuisine.join(' · ')} · ${venue.openingHours}`,
      route: '/food'
    }))
  ];

  const term = searchTerm.trim().toLowerCase();
  const filtered = (
    term
      ? catalog.filter(
          (item) =>
            item.title.toLowerCase().includes(term) ||
            (item.titleAr && item.titleAr.includes(searchTerm.trim())) ||
            item.subtitle.toLowerCase().includes(term) ||
            (item.subtitleAr && item.subtitleAr.includes(searchTerm.trim())) ||
            item.category.toLowerCase().includes(term) ||
            (item.categoryAr && item.categoryAr.includes(searchTerm.trim()))
        )
      : NAVIGATION_CATALOG
  ).slice(0, 30);

  const handleSelect = (item: SearchResultItem) => {
    navigateTo(item.route, item.actionParams);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Dahab Search & Spotlight"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full max-w-2xl bg-[var(--surface-card)] text-[var(--text-primary)] rounded-3xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--surface-container)]">
          <Search className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              t('common.searchDiveSitesBookings')
            }
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full bg-[var(--surface-card)] hover:opacity-80 text-[var(--text-primary)] border border-[var(--border-subtle)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-secondary)] space-y-2">
              <Compass className="w-8 h-8 mx-auto text-[var(--text-secondary)] opacity-60" />
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {t('common.noResultsFoundFor', { searchTerm })}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {t('common.trySearchingForDiving')}
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const displayTitle = language === 'ar' ? item.titleAr || item.title : item.title;
              const displayCategory = language === 'ar' ? item.categoryAr || item.category : item.category;
              const displaySubtitle = language === 'ar' ? item.subtitleAr || item.subtitle : item.subtitle;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-start p-3.5 rounded-2xl hover:bg-[var(--surface-container)] transition-colors flex items-center justify-between gap-3 group cursor-pointer border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                          item.category === 'Experience'
                            ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                            : item.category === 'Booking'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : item.category === 'Food & Cafe'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : item.category === 'Help & Safety'
                            ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20'
                            : 'bg-[var(--surface-container)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {displayCategory}
                      </span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {displayTitle}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{displaySubtitle}</p>
                  </div>

                  <ArrowRight className={`w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-[background-color,border-color,color,box-shadow,transform,opacity] flex-shrink-0 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[var(--surface-container)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[12px] text-[var(--text-secondary)] px-4">
          <span>{t('common.navigateWithEnter')}</span>
          <span>{t('common.eSCToDismiss')}</span>
        </div>
      </div>
    </div>
  );
};
