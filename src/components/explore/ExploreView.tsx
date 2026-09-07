import React, { useState, useRef, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Search, 
  Sparkles, 
  Heart, 
  Star, 
  Clock, 
  Plus, 
  Check, 
  ChevronRight, 
  ExternalLink, 
  Filter, 
  Navigation, 
  ArrowRight, 
  Eye, 
  Waves, 
  Sun, 
  Coffee, 
  Utensils, 
  Share2, 
  X, 
  Info, 
  Calendar, 
  Phone, 
  Flame, 
  ArrowLeft 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TravelerNav } from '../mytrip/TravelerNav';
import { EXPLORE_CATEGORIES } from '../../data/dahabContent';
import { NearMeItem } from '../../types';
import { sanitizeText } from '../../utils/sanitize';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import { buildExploreItems } from '../../services/exploreMapper';

export const NEAR_ME_DATA: NearMeItem[] = [
  {
    id: 'near-ralphs',
    name: "Ralph's German Bakery",
    nameAr: 'مخبز رالف الألماني',
    category: 'coffee',
    distance: '180m',
    walkMinutes: 2,
    priceLevel: '$$',
    tag: 'Artisan Bakery & Cafe',
    tagAr: 'مخبز يدوي وكافيه روقان',
    image: '/images/restaurants/breakfast-by-the-sea.jpg',
    description: 'Famous for freshly baked sourdough, apple strudel, pretzels, and fresh organic Sinai herbal teas.',
    descriptionAr: 'أشهر مخبز في دهب للعيش الساوردو الفريش، فطيرة التفاح (أبل شترودل)، البريتزل، وشاي الأعشاب السيناوية العضوية.',
    location: 'Lighthouse Area, Dahab',
    locationAr: 'منطقة اللايتهاوس، دهب',
    openHours: '07:00 AM – 10:00 PM',
    openHoursAr: '٠٧:٠٠ ص – ١٠:٠٠ م',
    bestFor: 'Breakfast & Afternoon Coffee',
    bestForAr: 'فطار الصبح وقهوة العصرية',
  },
  {
    id: 'near-ali-baba',
    name: 'Ali Baba Waterfront Restaurant',
    nameAr: 'مطعم علي بابا ع الممشى',
    category: 'food',
    distance: '320m',
    walkMinutes: 4,
    priceLevel: '$$',
    tag: 'Seafood & Bedouin Grill',
    tagAr: 'سي فود ومشاوي ع البحر',
    image: '/images/restaurants/ali-baba-restaurant.jpg',
    description: 'Pick your fresh Red Sea catch directly from the ice counter, grilled over charcoal right by the sea.',
    descriptionAr: 'اختار سمكتك الطازة من التلج مباشرة، وتتشوي ع الفحم وتجيلك على طاولة ممتدة ع البحر مع الشوربة والمقبلات.',
    location: 'Lighthouse Promenade',
    locationAr: 'ممشى اللايتهاوس السياحي',
    openHours: '12:00 PM – 12:00 AM',
    openHoursAr: '١٢:٠٠ ظ – ١٢:٠٠ منتصف الليل',
    bestFor: 'Seaside Catch of the Day',
    bestForAr: 'عشاء سمك طازة ومشاوي ع البحر',
  },
  {
    id: 'near-lighthouse-reef',
    name: 'Lighthouse Reef Shore Entry',
    nameAr: 'شاطئ ورصيف اللايتهاوس للغطس والسنوركلينج',
    category: 'beach',
    distance: '120m',
    walkMinutes: 1,
    priceLevel: '$',
    tag: 'Snorkeling & Coral Entry',
    tagAr: 'نزلة بحر وسنوركلينج شاطئي سهل',
    image: '/images/attractions/coral-gardens.jpg',
    description: 'One of the easiest shore dives and snorkeling spots with vibrant table corals, clownfish, and eagle rays.',
    descriptionAr: 'أسهل نزلة بحر شاطئية في دهب؛ مياه هادية، شعب مرجانية ملونة، سمك نيمو وشعاع الراي على بعد خطوات من الشاطئ.',
    location: 'Lighthouse Bay',
    locationAr: 'خليج اللايتهاوس',
    openHours: 'Open 24/7 (Best in Daylight)',
    openHoursAr: 'مفتوح ٢٤ ساعة (أفضل وقت بالنهار)',
    bestFor: 'Spontaneous Swim & Snorkel',
    bestForAr: 'غطسة سريعة أو عومة في أي وقت',
  },
  {
    id: 'near-everyday-cafe',
    name: 'Everyday Cafe & Music Lounge',
    nameAr: 'إيفري داي كافيه وسهرات العود',
    category: 'nightlife',
    distance: '250m',
    walkMinutes: 3,
    priceLevel: '$$',
    tag: 'Acoustic Music & Sea Terrace',
    tagAr: 'تراس بحري وموسيقى لايف',
    image: '/images/restaurants/the-roof-restaurant.jpg',
    description: 'Iconic seafront terrace with hanging swings over the water, live acoustic guitar and Bedouin tea.',
    descriptionAr: 'قعدة مريحة على البحر ومراجيح خشبية فوق المية، وعزف عود وجيتار هادئ مع شاي المرمية والشيشة.',
    location: 'Mashraba Promenade',
    locationAr: 'ممشى المشربة، دهب',
    openHours: '08:00 AM – 01:00 AM',
    openHoursAr: '٠٨:٠٠ ص – ٠١:٠٠ بعد منتصف الليل',
    bestFor: 'Sunset Chill & Live Music',
    bestForAr: 'قعدة غروب وسهرات رايقة',
  },
  {
    id: 'near-blue-hole',
    name: 'Blue Hole & Bells Marine Sanctuary',
    nameAr: 'محمية البلو هول والبلز للغطس الحر',
    category: 'experience',
    distance: '8.5km',
    walkMinutes: 15,
    priceLevel: '$$$',
    tag: 'World Heritage Dive Site',
    tagAr: 'أشهر موقع غطس عالمي',
    image: '/images/attractions/blue-hole.jpg',
    description: 'The legendary 120m deep blue submarine sinkhole surrounded by dramatic coral walls.',
    descriptionAr: 'الثقب الأزرق الأسطوري بعمق ١٢٠ متراً وجدران مرجانية عمودية تبهر الغطاسين من كل أنحاء العالم.',
    location: 'North Dahab Coastal Protected Zone',
    locationAr: 'شمال دهب (منطقة المحميات الساحلية)',
    openHours: '08:00 AM – 05:00 PM',
    openHoursAr: '٠٨:٠٠ ص – ٠٥:٠٠ م',
    bestFor: 'Deep Reef Snorkel & Scuba',
    bestForAr: 'سنوركلينج وغوص عميق',
  },
  {
    id: 'near-eel-garden',
    name: 'Eel Garden Marine Garden',
    nameAr: 'شاطئ وحديقة ثعابين البحر (إيل جاردن)',
    category: 'beach',
    distance: '650m',
    walkMinutes: 8,
    priceLevel: '$',
    tag: 'Natural Marine Phenomenon',
    tagAr: 'ظاهرة بحرية رملية ممتعة',
    image: '/images/attractions/underwater-elephant.jpg',
    description: 'Sandy bottom hosting hundreds of garden eels swaying like tall grass with gentle water currents.',
    descriptionAr: 'قاع رملي ساحر يضم مئات من ثعابين البحر الرملية المسالمة اللي بتتراقص مع تيار المية اللطيف.',
    location: 'Eel Garden Bay, Dahab',
    locationAr: 'خليج إيل جاردن، دهب',
    openHours: 'Open 24/7 (Morning Best)',
    openHoursAr: 'مفتوح دائماً (أفضل وقت صباحاً مع المد)',
    bestFor: 'Underwater Photography & Calm Swim',
    bestForAr: 'تصوير تحت المية وعومة هادية',
  }
];

/**
 * Reads the destination corpus once. Defined outside the component because
 * useApiResource takes the fetcher as a dependency — an inline arrow would
 * re-request on every render.
 */
export const fetchDestinationCorpus = (signal: AbortSignal) =>
  Promise.all([
    api.getDahabActivities(signal).catch(() => ({ activities: [] })),
    api.getDahabPlaces(signal).catch(() => ({ places: [] })),
    api.getDahabAreas(signal).catch(() => ({ areas: [] }))
  ]).then(([activities, places, areas]) => ({
    activities: activities.activities,
    places: places.places,
    areas: areas.areas as Array<{
      id: string; nameEn: string; nameAr: string;
      atmosphere: string; atmosphereAr: string;
      walkabilityScore: number;
      noiseProfile: string;
      transportFriction: string;
      stayProfile: string; eveningProfile: string;
    }>
  }));

export const ExploreView: React.FC = () => {
  // `trip` was destructured but never used, and has never existed on the context.
  const { addActivityToDay, navigateTo, savedItems, setSavedItems } = useTrip();
  const { language, isRTL , t} = useLanguage();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'near_me' | 'areas' | 'categories'>('near_me');
  const [nearMeFilter, setNearMeFilter] = useState<'all' | 'food' | 'coffee' | 'beach' | 'experience' | 'nightlife'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Quick Add modal
  const [itemToAdd, setItemToAdd] = useState<any | null>(null);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);

  const tabListRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /**
   * One save system: hearts here write straight into the shared bucket list
   * the profile dossier reads, so a saved place actually appears under Saved.
   * The named toast stays local; setSavedItems itself stays silent, which is
   * what keeps a single toast per tap instead of two.
   */
  const toggleFavorite = (id: string, name: string) => {
    const exists = savedItems.includes(id);
    setSavedItems(exists ? savedItems.filter(item => item !== id) : [...savedItems, id]);
    showToast(exists ? t('explore.removedFromFavorites', { name }) : t('explore.savedToFavorites', { name }));
  };

  const handleQuickAddClick = (item: any) => {
    setItemToAdd(item);
    setIsDaySelectorOpen(true);
  };

  const handleOpenExperienceDetail = (item: NearMeItem) => {
    navigateTo('/experiences', { experienceSlug: item.id });
  };

  const confirmAddActivityToTargetDay = async (dayNumber: number) => {
    if (!itemToAdd) return;

    const priceEGP = typeof itemToAdd.basePriceEGP === 'number' ? itemToAdd.basePriceEGP : 0;

    setIsDaySelectorOpen(false);
    setItemToAdd(null);

    // No success message here. addActivityToDay is the only caller that knows
    // whether the write reached the server, and it reports the outcome itself.
    // Announcing success from both places is how "was not added" and "added
    // successfully" ended up on screen together.
    await addActivityToDay(dayNumber, {
      id: `explore-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: language === 'ar' && itemToAdd.nameAr ? itemToAdd.nameAr : itemToAdd.name || itemToAdd.title,
      time: '04:30 PM',
      type: 'Exploration',
      status: itemToAdd.skuId ? 'Suggested' : 'Added ✓',
      // Carried so this line can be booked from the trip timeline later.
      // Without them, anything added from Explore was a dead end.
      skuId: itemToAdd.skuId,
      serviceType: itemToAdd.serviceType,
      priceEGP,
      location: language === 'ar' && itemToAdd.locationAr ? itemToAdd.locationAr : itemToAdd.location || 'Dahab Promenade',
      // Was `approx. 150 EGP` on every card regardless of what it actually costs.
      notes: priceEGP > 0
        ? `${itemToAdd.priceLevel || ''} · ${priceEGP.toLocaleString()} EGP`.trim()
        : (t('explore.freeEntry'))
    });
  };

  /**
   * The real 22 activities and 17 places, with the six curated venues as the
   * fallback.
   *
   * Explore rendered NEAR_ME_DATA and nothing else while both endpoints sat
   * unused. The curated list is kept deliberately: it is what the page shows
   * when the request fails or the corpus is empty, so a bad connection
   * degrades the page instead of blanking it.
   */
  const corpus = useApiResource(fetchDestinationCorpus);

  const exploreItems = useMemo(() => {
    if (!corpus.data || corpus.data.activities.length === 0) return NEAR_ME_DATA;
    return buildExploreItems(corpus.data.activities, corpus.data.places, language === 'ar');
  }, [corpus.data, language]);

  const areaProfiles = useMemo(() => {
    return corpus.data?.areas ?? [];
  }, [corpus.data]);

  const filteredNearMe = useMemo(() => {
    const cleanQuery = sanitizeText(searchQuery).toLowerCase().trim();
    return exploreItems.filter(item => {
      const matchesCategory = nearMeFilter === 'all' || item.category === nearMeFilter;
      const matchesSearch = !cleanQuery || 
        item.name.toLowerCase().includes(cleanQuery) ||
        (item.nameAr && item.nameAr.toLowerCase().includes(cleanQuery)) ||
        item.tag.toLowerCase().includes(cleanQuery) ||
        (item.tagAr && item.tagAr.toLowerCase().includes(cleanQuery)) ||
        item.location.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesSearch;
    });
  }, [exploreItems, nearMeFilter, searchQuery]);

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col pb-28 md:pb-16 selection:bg-[var(--accent-secondary)]/20 ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[var(--bg-canvas)] text-[var(--text-primary)]'
      }`}
    >
      {/* Traveler Top Navigation */}
      <TravelerNav
        activeTab="explore"
        onNavigate={(tab) => {
          if (tab === 'mytrip' || tab === 'home') navigateTo('/my-trip');
          else if (tab === 'explore') navigateTo('/explore');
          else if (tab === 'bookings') navigateTo('/my-trip');
        }}
      />

      {/* Main Hero Banner with authentic photography backdrop */}
      <section className="relative border-b overflow-hidden">
        <img
          src="/images/hero/golden-beach.jpg"
          alt="Dahab Live Discovery"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-r from-[var(--surface-container)]/95 via-[var(--surface-container)]/90 to-[var(--surface-container)]/75 backdrop-blur-[2px]'
            : 'bg-gradient-to-r from-[var(--bg-canvas)]/96 via-[var(--bg-canvas)]/92 to-[var(--bg-canvas)]/80 backdrop-blur-[2px]'
        }`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
                isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--accent-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[#8F5F14]'
              }`}>
                <Compass className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{t('explore.dahabLiveDiscovery')}</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl chart-heading font-bold tracking-tight ${
                isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'
              }`}>
                {t('explore.curatedSpotsAroundYou')}
              </h1>
              <p className={`text-xs sm:text-sm max-w-2xl font-medium ${
                isDark ? 'text-[var(--text-secondary)]/80' : 'text-[var(--text-secondary)]'
              }`}>
                {t('explore.handpickedCafesBeachEntries')}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('/food')}
                className="px-4 py-2.5 rounded-full bg-[var(--accent-secondary)] hover:brightness-110 text-[#1A1206] text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>{t('explore.foodNow')}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/my-trip')}
                className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-[var(--surface-container)] hover:bg-[#1a4038] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                    : 'bg-[var(--surface-card)] hover:bg-[var(--surface-container)] text-[var(--text-primary)] border-[var(--border-subtle)]'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{t('explore.myTrip')}</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[var(--text-secondary)]/50'}`} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t('explore.searchDahabPlaces')}
              placeholder={t('explore.searchPlacesCafesSeafood')}
              className={`w-full py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-2xl border text-xs sm:text-sm shadow-inner transition-colors ${
                isDark
                  ? 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:border-[var(--accent-secondary)]'
                  : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[var(--accent-primary)]'
              } focus:outline-none`}
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow space-y-8">
        
        {/* Filter Pills */}
        <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border ${
          isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] shadow-xs'
        }`}>
          <div className="flex flex-wrap items-center gap-1.5">
            {([
              { id: 'all', label: t('explore.allPlaces') },
              { id: 'food', label: t('explore.foodSeafood') },
              { id: 'coffee', label: t('explore.artisanCoffee') },
              { id: 'beach', label: t('explore.reefBeach') },
              { id: 'nightlife', label: t('explore.eveningChill') },
              { id: 'experience', label: t('explore.experiences') },
            ] as const).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setNearMeFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${
                  nearMeFilter === f.id
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] shadow-xs'
                    : isDark
                    ? 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#1a4038] border border-white/5'
                    : 'bg-[var(--surface-container)] text-[var(--text-primary)] hover:bg-[var(--surface-card)] border border-[var(--border-subtle)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className={`text-xs px-2 ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'}`}>
            {filteredNearMe.length} {t('explore.spotsAvailable')}
          </span>
        </div>

        {/* Places Grid.
            The place names inside are correctly h3 — they are the items — but
            there was no h2 above them, so the page ran h1 straight to h3 with
            nothing naming the results. Visually hidden because the filter row
            immediately above already states the count on screen. */}
        <h2 className="sr-only">
          {t('explore.availablePlaces')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNearMe.map((place) => {
            const isFav = savedItems.includes(place.id);
            return (
              <div
                key={place.id}
                className={`rounded-3xl border transition-[background-color,border-color,color,box-shadow,transform,opacity] overflow-hidden shadow-xl flex flex-col group ${
                  isDark
                    ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-secondary)]/40 text-[var(--text-primary)]'
                    : 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-primary)]'
                }`}
              >
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-[var(--surface-card)]">
                  {/* Records from the destination corpus carry no photograph.
                      A tinted panel is the honest stand-in; a stock image
                      would imply the platform has a picture of this place. */}
                  {place.image ? (
                    <img
                      src={place.image}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--surface-container)] via-[var(--surface-card)] to-[var(--surface-container)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    {place.distance ? (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-[var(--accent-secondary)] border border-[var(--border-subtle)]">
                        {place.distance}
                        {place.walkMinutes
                          ? ` (${place.walkMinutes} ${t('explore.minWalk')})`
                          : ''}
                      </span>
                    ) : (
                      <span />
                    )}

                    <button
                      type="button"
                      onClick={() => toggleFavorite(place.id, language === 'ar' && place.nameAr ? place.nameAr : place.name)}
                      aria-pressed={isFav}
                      aria-label={`${isFav
                        ? (t('explore.removeFromFavourites'))
                        : (t('explore.addToFavourites'))}: ${language === 'ar' && place.nameAr ? place.nameAr : place.name}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${
                        isFav ? 'bg-rose-500 text-[var(--text-primary)]' : 'bg-black/50 text-[var(--text-primary)] hover:bg-black/80'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Tag */}
                  <div className="absolute bottom-2.5 inset-x-3">
                    <span className="text-[11px] font-black text-[var(--accent-primary)] block drop-shadow-md">
                      {language === 'ar' && place.tagAr ? place.tagAr : place.tag}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`chart-heading font-bold text-lg leading-snug cursor-pointer hover:text-[var(--accent-primary)] transition-colors ${
                        isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'
                      }`}
                      onClick={() => handleOpenExperienceDetail(place)}
                      >
                        {language === 'ar' && place.nameAr ? place.nameAr : place.name}
                      </h3>
                      {typeof place.rating === 'number' && (
                        <div className="flex items-center gap-1 text-xs font-bold text-[var(--accent-secondary)] flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed line-clamp-2 ${
                      isDark ? 'text-[var(--text-secondary)]/75' : 'text-[var(--text-secondary)]'
                    }`}>
                      {language === 'ar' && place.descriptionAr ? place.descriptionAr : place.description}
                    </p>

                    <div className={`flex items-center gap-2 text-xs pt-1 ${
                      isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <span>{language === 'ar' && place.locationAr ? place.locationAr : place.location}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className={`pt-3 border-t flex items-center gap-2 ${
                    isDark ? 'border-[var(--border-subtle)]' : 'border-[var(--border-subtle)]'
                  }`}>
                    <button
                      type="button"
                      id={`explore-card-details-btn-${place.id}`}
                      onClick={() => handleOpenExperienceDetail(place)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isDark
                          ? 'bg-[var(--surface-container)] hover:bg-[#1a4038] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-white/5'
                          : 'bg-[var(--surface-container)] hover:bg-[var(--surface-card)] text-[var(--text-primary)] border-[var(--border-subtle)]'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('explore.details')}</span>
                    </button>

                    <button
                      type="button"
                      id={`explore-card-add-btn-${place.id}`}
                      onClick={() => handleQuickAddClick(place)}
                      className="flex-1 py-2.5 rounded-xl bg-[var(--accent-secondary)] hover:brightness-110 text-[#1A1206] text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('explore.addToTrip')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Area Profiles Section */}
        {areaProfiles.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
              <h2 className={`text-lg chart-heading font-bold ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                {t('explore.dahabAreas')}
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
              {t('explore.exploreDahabNeighborhoodsBy')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areaProfiles.map((area) => (
                <div
                  key={area.id}
                  className={`p-4 rounded-2xl border transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer hover:shadow-md ${
                    isDark
                      ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                      : 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`chart-heading font-bold text-sm ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                      {language === 'ar' ? area.nameAr : area.nameEn}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] text-[10px] font-bold">
                      {area.walkabilityScore}/10
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
                    {language === 'ar' ? area.atmosphereAr : area.atmosphere}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-[var(--surface-container)] text-[var(--text-secondary)]/60' : 'bg-[var(--surface-container)] text-[var(--text-secondary)]'}`}>
                      {area.noiseProfile}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-[var(--surface-container)] text-[var(--text-secondary)]/60' : 'bg-[var(--surface-container)] text-[var(--text-secondary)]'}`}>
                      {area.transportFriction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* QUICK ADD TO TARGET DAY MODAL */}
      {isDaySelectorOpen && itemToAdd && (
        <div 
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsDaySelectorOpen(false)}
        
      role="dialog"
      aria-modal="true"
      aria-labelledby="explore-view-dialog-2-title"
    >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border animate-in zoom-in-95 duration-150 text-start rtl:text-end ${
              isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[var(--accent-primary)]">
                  {t('explore.addExperienceToItinerary')}
                </span>
                <h3 id="explore-view-dialog-2-title" className={`text-lg chart-heading font-bold ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                  {language === 'ar' && itemToAdd.nameAr ? itemToAdd.nameAr : itemToAdd.name || itemToAdd.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDaySelectorOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]/70 hover:bg-[var(--surface-card)]/10' : 'bg-[var(--surface-container)] text-[var(--text-primary)] hover:bg-[var(--surface-card)]'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
              {t('explore.selectWhichDayIn')}
            </p>

            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => confirmAddActivityToTargetDay(d)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex flex-col items-center gap-1 cursor-pointer group ${
                    isDark
                      ? 'bg-[var(--surface-container)] hover:bg-[var(--accent-secondary)] hover:text-[var(--surface-container)] text-[var(--text-secondary)] border-white/5'
                      : 'bg-[var(--surface-container)] hover:bg-[var(--accent-primary)] hover:text-[var(--surface-container)] text-[var(--text-primary)] border-[var(--border-subtle)]'
                  }`}
                >
                  <span className={`text-[11px] group-hover:text-[var(--surface-container)]/80 font-normal ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'}`}>
                    {t('explore.day')}
                  </span>
                  <span className="text-sm font-black">{d}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsDaySelectorOpen(false)}
              className={`w-full py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isDark ? 'bg-[var(--surface-container)] hover:bg-[var(--surface-card)]/10 text-[var(--text-secondary)]' : 'bg-[var(--surface-container)] hover:bg-[var(--surface-card)] text-[var(--text-primary)]'
              }`}
            >
              {t('explore.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Global Toast Message */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 border ${
          isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)] border-[var(--accent-secondary)]/40' : 'bg-[var(--surface-card)] text-[var(--text-primary)] border-[var(--accent-primary)] shadow-lg'
        }`}>
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
