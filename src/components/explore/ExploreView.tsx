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
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
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
const fetchDestinationCorpus = (signal: AbortSignal) =>
  Promise.all([api.getDahabActivities(signal), api.getDahabPlaces(signal)]).then(
    ([activities, places]) => ({ activities: activities.activities, places: places.places })
  );

export const ExploreView: React.FC = () => {
  // `trip` was destructured but never used, and has never existed on the context.
  const { addActivityToDay, navigateTo } = useTrip();
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'near_me' | 'categories'>('near_me');
  const [nearMeFilter, setNearMeFilter] = useState<'all' | 'food' | 'coffee' | 'beach' | 'experience' | 'nightlife'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Quick Add modal
  const [itemToAdd, setItemToAdd] = useState<any | null>(null);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState<NearMeItem | null>(null);
  const [targetDayForAdd, setTargetDayForAdd] = useState<number>(2);

  const tabListRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleFavorite = (id: string, name: string) => {
    setSavedFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(language === 'ar' ? `تم إزالة ${name} من المفضلة` : `Removed ${name} from favorites`);
        return prev.filter(item => item !== id);
      } else {
        showToast(language === 'ar' ? `تم حفظ ${name} في المفضلة ✓` : `Saved ${name} to favorites ✓`);
        return [...prev, id];
      }
    });
  };

  const handleQuickAddClick = (item: any) => {
    setItemToAdd(item);
    setIsDaySelectorOpen(true);
  };

  const confirmAddActivityToTargetDay = (dayNumber: number) => {
    if (!itemToAdd) return;
    
    // Was built with `category`/`cost`/`bookingStatus` — none of which exist on
    // TimelineActivity — and without the required id, type and status. The
    // resulting activities had no id, so they could not be removed or updated,
    // and rendered with a blank status.
    addActivityToDay(dayNumber, {
      id: `explore-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: language === 'ar' && itemToAdd.nameAr ? itemToAdd.nameAr : itemToAdd.name || itemToAdd.title,
      time: '04:30 PM',
      type: 'Exploration',
      status: 'Added ✓',
      location: language === 'ar' && itemToAdd.locationAr ? itemToAdd.locationAr : itemToAdd.location || 'Dahab Promenade',
      notes: itemToAdd.priceLevel ? `${itemToAdd.priceLevel} · approx. 150 EGP` : 'Free / Moderate',
    });

    setIsDaySelectorOpen(false);
    setItemToAdd(null);
    showToast(
      language === 'ar' 
        ? `تمت إضافة "${itemToAdd.nameAr || itemToAdd.name || itemToAdd.title}" إلى اليوم ${dayNumber} بنجاح ✓`
        : `Added "${itemToAdd.name || itemToAdd.title}" to Day ${dayNumber} successfully ✓`
    );
  };

  const handleAddNearMeToTrip = (place: NearMeItem, dayNumber: number = 2) => {
    addActivityToDay(dayNumber, {
      id: `nearme-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: language === 'ar' && place.nameAr ? place.nameAr : place.name,
      time: '04:00 PM',
      type: place.category === 'food' ? 'Dining' : 'Exploration',
      status: 'Added ✓',
      location: language === 'ar' && place.locationAr ? place.locationAr : place.location,
      notes: `${place.priceLevel} · approx. 150-300 EGP`,
    });

    setSelectedPlaceDetail(null);
    showToast(
      language === 'ar' 
        ? `تمت إضافة "${place.nameAr || place.name}" إلى اليوم ${dayNumber} في جدولك ✓` 
        : `Added "${place.name}" to Day ${dayNumber} itinerary ✓`
    );
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
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-28 md:pb-16 selection:bg-[#F4C36C]/20 ${
        isDark ? 'bg-[#081714] text-[#F7F3EA]' : 'bg-[#FBF9F5] text-[#122420]'
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

      {/* Main Hero Banner */}
      <section className={`relative border-b overflow-hidden ${
        isDark ? 'bg-[#0E2520] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
      }`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F4C36C_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
                isDark ? 'bg-[#13312B] border-white/10 text-[#F4C36C]' : 'bg-white border-[#122420]/10 text-[#0E2520]'
              }`}>
                <Compass className="w-3.5 h-3.5 text-[#20A89A]" />
                <span>{language === 'ar' ? 'استكشاف دهب الحي' : 'Dahab Live Discovery'}</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight ${
                isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
              }`}>
                {language === 'ar' ? 'أماكن وتجارب قريبة منك' : 'Curated Spots Around You'}
              </h1>
              <p className={`text-xs sm:text-sm max-w-2xl font-medium ${
                isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
              }`}>
                {language === 'ar'
                  ? 'ممشى اللايتهاوس، كافيهات الغروب، عشاء السي فود الطازة، والشواطئ الهادية على بعد خطوات.'
                  : 'Hand-picked cafes, beach entries, seafood grills, and sunset terraces around Lighthouse & Dahab bay.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('/food')}
                className="px-4 py-2.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'أكل ودليفري ع الشط' : 'Food Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/my-trip')}
                className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#1a4038] text-[#D2E3DE] border-white/10'
                    : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/15'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{language === 'ar' ? 'الرجوع لجدولي' : 'My Trip'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[#D2E3DE]/50' : 'text-[#4A635D]/50'}`} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={language === 'ar' ? 'ابحث في أماكن دهب' : 'Search Dahab places'}
              placeholder={language === 'ar' ? 'ابحث عن مكان، كافيه، مطعم، أو شاطئ...' : 'Search places, cafes, seafood, reef entries...'}
              className={`w-full py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-2xl border text-xs sm:text-sm shadow-inner transition-colors ${
                isDark
                  ? 'bg-[#13312B] border-white/10 text-[#F7F3EA] placeholder:text-[#D2E3DE]/40 focus:border-[#F4C36C]'
                  : 'bg-white border-[#122420]/15 text-[#122420] placeholder:text-[#4A635D]/50 focus:border-[#20A89A]'
              } focus:outline-none`}
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow space-y-8">
        
        {/* Filter Pills */}
        <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border ${
          isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10 shadow-xs'
        }`}>
          <div className="flex flex-wrap items-center gap-1.5">
            {([
              { id: 'all', label: language === 'ar' ? 'الكل' : 'All Places' },
              { id: 'food', label: language === 'ar' ? '🍽️ أكل وسي فود' : '🍽️ Food & Seafood' },
              { id: 'coffee', label: language === 'ar' ? '☕ كافيهات وقهوة' : '☕ Artisan Coffee' },
              { id: 'beach', label: language === 'ar' ? '🏖️ شواطئ ونزول بحر' : '🏖️ Reef & Beach' },
              { id: 'nightlife', label: language === 'ar' ? '🌙 سهرات ومزيكا' : '🌙 Evening Chill' },
              { id: 'experience', label: language === 'ar' ? '🧭 مغامرات وغطس' : '🧭 Experiences' },
            ] as const).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setNearMeFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  nearMeFilter === f.id
                    ? 'bg-[#20A89A] text-[#081714] shadow-xs'
                    : isDark
                    ? 'bg-[#13312B] text-[#D2E3DE] hover:text-[#F7F3EA] hover:bg-[#1a4038] border border-white/5'
                    : 'bg-[#F2EFE9] text-[#122420] hover:bg-[#EAE6DD] border border-[#122420]/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className={`text-xs px-2 ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]'}`}>
            {filteredNearMe.length} {language === 'ar' ? 'أماكن متاحة' : 'spots available'}
          </span>
        </div>

        {/* Places Grid.
            The place names inside are correctly h3 — they are the items — but
            there was no h2 above them, so the page ran h1 straight to h3 with
            nothing naming the results. Visually hidden because the filter row
            immediately above already states the count on screen. */}
        <h2 className="sr-only">
          {language === 'ar' ? 'الأماكن المتاحة' : 'Available places'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNearMe.map((place) => {
            const isFav = savedFavorites.includes(place.id);
            return (
              <div
                key={place.id}
                className={`rounded-3xl border transition-all overflow-hidden shadow-xl flex flex-col group ${
                  isDark
                    ? 'bg-[#0E2520] border-white/10 hover:border-[#F4C36C]/40 text-[#F7F3EA]'
                    : 'bg-white border-[#122420]/10 hover:border-[#20A89A] text-[#122420]'
                }`}
              >
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0E2520]">
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
                    <div className="w-full h-full bg-gradient-to-br from-[#13312B] via-[#0E2520] to-[#081714]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    {place.distance ? (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-[#F4C36C] border border-white/10">
                        {place.distance}
                        {place.walkMinutes
                          ? ` (${place.walkMinutes} ${language === 'ar' ? 'دقيقة مشي' : 'min walk'})`
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
                        ? (language === 'ar' ? 'إزالة من المفضلة' : 'Remove from favourites')
                        : (language === 'ar' ? 'إضافة إلى المفضلة' : 'Add to favourites')}: ${language === 'ar' && place.nameAr ? place.nameAr : place.name}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                        isFav ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:bg-black/80'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Tag */}
                  <div className="absolute bottom-2.5 inset-x-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block drop-shadow-md">
                      {language === 'ar' && place.tagAr ? place.tagAr : place.tag}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-serif font-bold text-lg leading-snug ${
                        isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
                      }`}>
                        {language === 'ar' && place.nameAr ? place.nameAr : place.name}
                      </h3>
                      {/* Was always rendered, over a hardcoded 4.6–4.9. */}
                      {typeof place.rating === 'number' && (
                        <div className="flex items-center gap-1 text-xs font-bold text-[#F4C36C] flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed line-clamp-2 ${
                      isDark ? 'text-[#D2E3DE]/75' : 'text-[#4A635D]'
                    }`}>
                      {language === 'ar' && place.descriptionAr ? place.descriptionAr : place.description}
                    </p>

                    <div className={`flex items-center gap-2 text-xs pt-1 ${
                      isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 text-[#20A89A]" />
                      <span>{language === 'ar' && place.locationAr ? place.locationAr : place.location}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className={`pt-3 border-t flex items-center gap-2 ${
                    isDark ? 'border-white/10' : 'border-[#122420]/10'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setSelectedPlaceDetail(place)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isDark
                          ? 'bg-[#13312B] hover:bg-[#1a4038] text-[#D2E3DE] hover:text-[#F7F3EA] border-white/5'
                          : 'bg-[#F2EFE9] hover:bg-[#EAE6DD] text-[#122420] border-[#122420]/10'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickAddClick(place)}
                      className="flex-1 py-2.5 rounded-xl bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'إضافة للجدول' : 'Add to Trip'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* PLACE DETAIL MODAL */}
      {selectedPlaceDetail && (
        <div 
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPlaceDetail(null)}
        
      role="dialog"
      aria-modal="true"
      aria-labelledby="explore-view-dialog-1-title"
    >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border space-y-5 animate-in zoom-in-95 duration-200 ${
              isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/15 text-[#122420]'
            }`}
          >
            <div className="relative h-56 w-full overflow-hidden bg-black/40">
              <img 
                src={selectedPlaceDetail.image} 
                alt="" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              
              <button
                type="button"
                onClick={() => setSelectedPlaceDetail(null)}
                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 inset-x-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F4C36C] block">
                  {language === 'ar' && selectedPlaceDetail.tagAr ? selectedPlaceDetail.tagAr : selectedPlaceDetail.tag}
                </span>
                <h3 id="explore-view-dialog-1-title" className="text-2xl font-serif font-bold text-white leading-tight">
                  {language === 'ar' && selectedPlaceDetail.nameAr ? selectedPlaceDetail.nameAr : selectedPlaceDetail.name}
                </h3>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'
              }`}>
                {language === 'ar' && selectedPlaceDetail.descriptionAr ? selectedPlaceDetail.descriptionAr : selectedPlaceDetail.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                }`}>
                  <span className={`block text-[11px] mb-0.5 ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]'}`}>{language === 'ar' ? 'مواعيد العمل:' : 'Opening Hours:'}</span>
                  <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                    {language === 'ar' && selectedPlaceDetail.openHoursAr ? selectedPlaceDetail.openHoursAr : selectedPlaceDetail.openHours}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                }`}>
                  <span className={`block text-[11px] mb-0.5 ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]'}`}>{language === 'ar' ? 'المسافة والمشي:' : 'Distance & Walk:'}</span>
                  <span className="font-bold text-[#EA8E75]">
                    {selectedPlaceDetail.distance} ({selectedPlaceDetail.walkMinutes} {language === 'ar' ? 'دقيقة' : 'mins'})
                  </span>
                </div>
              </div>

              {/* Day Selector */}
              <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
                <span className={`text-xs font-bold block ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'حدد اليوم لإضافة النشاط لجدولك:' : 'Select which day to add this to:'}
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTargetDayForAdd(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        targetDayForAdd === d
                          ? 'bg-[#F4C36C] text-[#081714] shadow-xs'
                          : isDark
                          ? 'bg-[#13312B] text-[#D2E3DE] hover:bg-[#1a4038] border border-white/5'
                          : 'bg-[#F2EFE9] text-[#122420] hover:bg-[#EAE6DD] border border-[#122420]/10'
                      }`}
                    >
                      {language === 'ar' ? `يوم ${d}` : `Day ${d}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    showToast(
                      language === 'ar'
                        ? `تم فتح الخريطة إلى ${selectedPlaceDetail.nameAr || selectedPlaceDetail.name}`
                        : `Directions opened for ${selectedPlaceDetail.name}`
                    );
                  }}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                    isDark
                      ? 'bg-[#13312B] hover:bg-[#1a4038] text-[#D2E3DE] border-white/10'
                      : 'bg-[#F2EFE9] hover:bg-[#EAE6DD] text-[#122420] border-[#122420]/10'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-[#20A89A]" />
                  <span>{language === 'ar' ? 'الاتجاهات' : 'Get Directions'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddNearMeToTrip(selectedPlaceDetail, targetDayForAdd)}
                  className="flex-1 py-3 rounded-2xl bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? `إضافة لليوم ${targetDayForAdd}` : `Add to Day ${targetDayForAdd}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            className={`rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border animate-in zoom-in-95 duration-150 text-start rtl:text-right ${
              isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/15 text-[#122420]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#20A89A]">
                  {language === 'ar' ? 'إضافة إلى خطة الرحلة' : 'Add Experience to Itinerary'}
                </span>
                <h3 id="explore-view-dialog-2-title" className={`text-lg font-serif font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' && itemToAdd.nameAr ? itemToAdd.nameAr : itemToAdd.name || itemToAdd.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDaySelectorOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-[#13312B] text-white/70 hover:bg-white/10' : 'bg-[#F2EFE9] text-[#122420] hover:bg-[#EAE6DD]'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
              {language === 'ar' 
                ? 'اختر اليوم اللي تحب تضيف النشاط ده فيه لجدولك في دهب:' 
                : 'Select which day in your Dahab journey to place this activity:'}
            </p>

            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => confirmAddActivityToTargetDay(d)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer group ${
                    isDark
                      ? 'bg-[#13312B] hover:bg-[#F4C36C] hover:text-[#081714] text-[#D2E3DE] border-white/5'
                      : 'bg-[#F2EFE9] hover:bg-[#20A89A] hover:text-[#081714] text-[#122420] border-[#122420]/10'
                  }`}
                >
                  <span className={`text-[11px] group-hover:text-[#081714]/80 font-normal ${isDark ? 'text-[#D2E3DE]/60' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? 'يوم' : 'Day'}
                  </span>
                  <span className="text-sm font-black">{d}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsDaySelectorOpen(false)}
              className={`w-full py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isDark ? 'bg-[#13312B] hover:bg-white/10 text-[#D2E3DE]' : 'bg-[#F2EFE9] hover:bg-[#EAE6DD] text-[#122420]'
              }`}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Global Toast Message */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 border ${
          isDark ? 'bg-[#13312B] text-[#F7F3EA] border-[#F4C36C]/40' : 'bg-white text-[#122420] border-[#20A89A] shadow-lg'
        }`}>
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
