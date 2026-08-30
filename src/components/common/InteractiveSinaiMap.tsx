import React, { useMemo, useState } from 'react';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import { buildMapPlaces } from '../../services/placeMapper';
import {
  MapPin,
  Compass,
  Navigation,
  Clock,
  Star,
  Plus,
  ArrowRight,
  Waves,
  Car,
  Footprints,
  Sparkles,
  Heart
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface DahabSpot {
  id: string;
  name: string;
  nameAr: string;
  category: 'Dive Site' | 'Desert Valley' | 'Beach & Lagoon' | 'Café & Dining' | 'Local Culture';
  categoryAr: string;
  /** Absent: nothing measures these. Were invented 4.8–5.0 / 310–910. */
  rating?: number;
  reviews?: number;
  latPct: number;
  lngPct: number;
  distance: string;
  distanceAr: string;
  description: string;
  descriptionAr: string;
  /**
   * Editorial extras, kept only where an entry below describes a place the
   * corpus actually holds. A place the corpus has and the editorial list does
   * not simply has no photograph and no "best time" — rather than a plausible
   * one written to fill the field.
   */
  travelTime?: string;
  travelTimeAr?: string;
  travelMode?: 'walk' | 'taxi' | 'boat';
  image?: string;
  bestTime?: string;
  bestTimeAr?: string;
  highlight?: string;
  highlightAr?: string;
  /** When the record was last verified. Shown where a rating used to be. */
  verifiedAt?: string;
}

/**
 * The editorial layer: photographs, best-light windows and the one-line reason
 * to go, written by hand for the places they describe.
 *
 * This used to be the map's entire dataset — 12 spots with hand-placed
 * positions, hand-written distances and travel times — while
 * /api/dahab/places held 17 real records with real coordinates that nothing
 * had ever read. The corpus is the list now; this is merged onto it by name,
 * and is the fallback when the request fails.
 */
const EDITORIAL_SPOTS: DahabSpot[] = [
  {
    id: 'spot-blue-hole',
    name: 'The Blue Hole & Bells',
    nameAr: 'الثقب الأزرق (البلو هول) والبيلز',
    category: 'Dive Site',
    categoryAr: 'موقع غوص',
    latPct: 15,
    lngPct: 62,
    distance: '8.5 km North',
    distanceAr: '٨.٥ كم شمالاً',
    travelTime: '18 min 4x4',
    travelTimeAr: '١٨ دقيقة دفع رباعي',
    travelMode: 'taxi',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop',
    description: 'World-famous 100m+ submarine sinkhole. Famous chimney entry at Bells leading to the vertical coral saddle.',
    descriptionAr: 'حفرة بحرية عمودية بعمق ١٠٠م+ ذات شهرة عالمية. مدخل مدخنة البيلز الرائع يؤدي إلى سرج المرجان العمودي.',
    bestTime: '08:00 AM – 11:30 AM (Calm water)',
    bestTimeAr: '٠٨:٠٠ ص – ١١:٣٠ ص (مياه هادئة)',
    highlight: 'Global freediving capital & technical dive wonder',
    highlightAr: 'عاصمة الغوص الحر العالمية وأعجوبة الغوص التقني',
  },
  {
    id: 'spot-canyon',
    name: 'The Canyon & Fish Bowl',
    nameAr: 'الكانيون وحوض الأسماك الزجاجية',
    category: 'Dive Site',
    categoryAr: 'موقع غوص',
    latPct: 24,
    lngPct: 58,
    distance: '3.4 km North',
    distanceAr: '٣.٤ كم شمالاً',
    travelTime: '8 min taxi',
    travelTimeAr: '٨ دقائق بالتاكسي',
    travelMode: 'taxi',
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop',
    description: 'Dramatic underwater rock fissure opening at 10m and plunging to 30m with millions of glassfish.',
    descriptionAr: 'صدع صخري مذهل تحت الماء يفتح عند عمق ١٠ أمتار ويهبط إلى ٣٠ متراً مع أسراب الأسماك الزجاجية.',
    bestTime: '09:00 AM (Sun rays piercing the fissure)',
    bestTimeAr: '٠٩:٠٠ ص (أشعة الشمس تخترق الصدع)',
    highlight: 'Your Day 2 morning dive location',
    highlightAr: 'موقع غطستك الصباحية لليوم الثاني',
  },
  {
    id: 'spot-eel-garden',
    name: 'Eel Garden Marine Reserve',
    nameAr: 'محمية حديقة ثعابين البحر (إيل جاردن)',
    category: 'Dive Site',
    categoryAr: 'موقع غوص',
    latPct: 38,
    lngPct: 54,
    distance: '650m North',
    distanceAr: '٦٥٠م شمالاً',
    travelTime: '5 min walk',
    travelTimeAr: '٥ دقائق مشي',
    travelMode: 'walk',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop',
    description: 'Expansive sandy slope underwater teeming with hundreds of swaying garden eels and vibrant shallow reef.',
    descriptionAr: 'منحدر رملي واسع تحت الماء يعج بمئات من ثعابين البحر المتمايلة مع الشعاب المرجانية الضحلة.',
    bestTime: '10:00 AM – 01:00 PM (Crystal light)',
    bestTimeAr: '١٠:٠٠ ص – ٠١:٠٠ م (ضوء بلوري نقي)',
    highlight: 'Underwater photography heaven with calm shore access',
    highlightAr: 'جنة التصوير تحت الماء مع دخول شاطئي سهل',
  },
  {
    id: 'spot-lighthouse',
    name: 'Lighthouse Reef & Bay',
    nameAr: 'خليج وشعاب اللايتهاوس',
    category: 'Dive Site',
    categoryAr: 'موقع غوص',
    latPct: 48,
    lngPct: 48,
    distance: '180m from hotel',
    distanceAr: '١٨٠م من الفندق',
    travelTime: '2 min walk',
    travelTimeAr: 'دقيقتان مشي',
    travelMode: 'walk',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    description: 'The vibrant heart of Dahab promenade. Sloping coral garden with resident sea turtles, ideal for night dives.',
    descriptionAr: 'القلب النابض لممشى دهب. حديقة مرجانية متدرجة تضم سلاحف بحرية مستوطنة، مثالية للغطس الليلي والغروب.',
    bestTime: 'Open all day · Sunset swim & night dive',
    bestTimeAr: 'متاح طوال اليوم · سباحة الغروب والغطس الليلي',
    highlight: 'Gentle shore entry suitable for all levels',
    highlightAr: 'دخول شاطئي متدرج ومناسب لجميع المستويات',
  },
  {
    id: 'spot-ras-abu-galum',
    name: 'Ras Abu Galum Protected Reserve',
    nameAr: 'محمية رأس أبو جالوم الطبيعية',
    category: 'Desert Valley',
    categoryAr: 'وادي صحراوي ومحمية',
    latPct: 8,
    lngPct: 70,
    distance: '15 km North',
    distanceAr: '١٥ كم شمالاً',
    travelTime: '1.5 hr trek / boat',
    travelTimeAr: '١.٥ ساعة تراك أو قارب',
    travelMode: 'boat',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop',
    description: 'Pristine coastal national park accessible by scenic camel trek or speedboat. Untouched corals and desert peace.',
    descriptionAr: 'محمية ساحلية بكر يمكن الوصول إليها عبر الجمال بمحاذاة البحر أو بالقارب السريع. هدوء ومرجان لم يمسه إنسان.',
    bestTime: 'Full Day Excursion (09:00 AM – 05:00 PM)',
    bestTimeAr: 'رحلة يوم كامل (٠٩:٠٠ ص – ٠٥:٠٠ م)',
    highlight: 'Bedouin beach huts & untouched marine wilderness',
    highlightAr: 'عشش بدوية ساحلية وطبيعة بحرية بكر تماماً',
  },
  {
    id: 'spot-blue-lagoon',
    name: 'Blue Lagoon Natural Haven',
    nameAr: 'ملاذ البلو لاجون الفيروزي',
    category: 'Beach & Lagoon',
    categoryAr: 'شاطئ ولاجونا',
    latPct: 5,
    lngPct: 65,
    distance: '18 km North',
    distanceAr: '١٨ كم شمالاً',
    travelTime: '25 min pickup from Abu Galum',
    travelTimeAr: '٢٥ دقيقة بيك آب من أبو جالوم',
    travelMode: 'taxi',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    description: 'Off-grid paradise of turquoise shallow water enclosed by sandy spits. World destination for kitesurfing & peace.',
    descriptionAr: 'جنة فيروزية ضحلة معزولة عن صخب العالم تحيط بها الألسنة الرملية. قبلة عالمية لعشاق الكايت سيرف والهدوء.',
    bestTime: 'Overnight camping or afternoon wind session',
    bestTimeAr: 'تخييم مبيت أو جلسة كايت بعد الظهر',
    highlight: 'Zero light pollution & pure turquoise waters',
    highlightAr: 'انعدام تام للتلوث الضوئي ومياه فيروزية كريستالية',
  },
  {
    id: 'spot-lagoon',
    name: 'Dahab South Laguna & Baby Bay',
    nameAr: 'اللاجونا الجنوبية وخليج بيبي باي',
    category: 'Beach & Lagoon',
    categoryAr: 'شاطئ ولاجونا',
    latPct: 75,
    lngPct: 35,
    distance: '2.8 km South',
    distanceAr: '٢.٨ كم جنوباً',
    travelTime: '6 min taxi',
    travelTimeAr: '٦ دقائق بالتاكسي',
    travelMode: 'taxi',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    description: 'Expansive golden sand spit enclosing a flat turquoise bay with world-class kitesurfing and windsurfing schools.',
    descriptionAr: 'لسان رملي ذهبي واسع يحيط بخليج فيروزي بمياه مسطحة ومدارس ركوب أمواج وشراع معتمدة دولياً.',
    bestTime: '01:00 PM – 05:00 PM (Wind Peak)',
    bestTimeAr: '٠١:٠٠ م – ٠٥:٠٠ م (ذروة الرياح)',
    highlight: 'Shallow warm water and certified kite centers',
    highlightAr: 'مياه دافئة ضحلة ومراكز كايت معتمدة',
  },
  {
    id: 'spot-three-pools',
    name: 'Three Pools Reef (Southern Dahab)',
    nameAr: 'شعاب الثري بولز (جنوب دهب)',
    category: 'Dive Site',
    categoryAr: 'موقع غوص',
    latPct: 88,
    lngPct: 28,
    distance: '9 km South',
    distanceAr: '٩ كم جنوباً',
    travelTime: '15 min taxi',
    travelTimeAr: '١٥ دقيقة بالتاكسي',
    travelMode: 'taxi',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop',
    description: 'Three natural shallow pools in the reef table leading to an open coral garden with stingrays and morays.',
    descriptionAr: 'ثلاثة مسابح طبيعية ضحلة داخل الحاجز المرجاني تنفتح على حديقة مرجانية ثرية بأسماك الراي والموراي.',
    bestTime: '11:00 AM – 03:00 PM (High tide snorkeling)',
    bestTimeAr: '١١:٠٠ ص – ٠٣:٠٠ م (سنوركلنج وقت المد)',
    highlight: 'Relaxed Bedouin beach huts with seafood grills',
    highlightAr: 'جلسات بدوية شاطئية مريحة مع مشويات أسماك',
  },
  {
    id: 'spot-wadi-gnai',
    name: 'Wadi Gnai Desert Oasis & Stargazing',
    nameAr: 'واحة وادي قني ورصد النجوم',
    category: 'Desert Valley',
    categoryAr: 'وادي صحراوي ومحمية',
    latPct: 60,
    lngPct: 18,
    distance: '7.2 km West',
    distanceAr: '٧.٢ كم غرباً',
    travelTime: '15 min 4x4',
    travelTimeAr: '١٥ دقيقة دفع رباعي',
    travelMode: 'taxi',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop',
    description: 'Lush desert canyon with freshwater springs, granite climbing cliffs, and candlelit Bedouin dinners under the stars.',
    descriptionAr: 'وادي صحراوي خلاب يضم عيون مياه عذبة، صخور جرانيتية للتسلق، وعشاء بدوي على ضوء الشموع تحت النجوم.',
    bestTime: 'Sunset & Evening Stargazing (07:00 PM+)',
    bestTimeAr: 'الغروب ورصد النجوم ليلاً (٠٧:٠٠ م فما فوق)',
    highlight: 'Campfire Bedouin tea, Zarb dinner & Milky Way view',
    highlightAr: 'شاي ع الفحم، عشاء الزرب البدوي، ورؤية درب التبانة',
  },
  {
    id: 'spot-st-catherine',
    name: 'Mount Sinai & St. Catherine Monastery',
    nameAr: 'جبل موسى ودير سانت كاترين',
    category: 'Local Culture',
    categoryAr: 'تراث وثقافة محلية',
    latPct: 30,
    lngPct: 10,
    distance: '130 km Inland (Day Trip)',
    distanceAr: '١٣٠ كم في العمق (رحلة يوم)',
    travelTime: '2 hrs private transport',
    travelTimeAr: 'ساعتان بسيارة خاصة',
    travelMode: 'taxi',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop',
    description: 'UNESCO World Heritage 6th-century monastery at the foot of Mount Sinai. Famous for sunrise summit pilgrimages.',
    descriptionAr: 'دير تاريخي من القرن السادس الميلادي مدرج باليونسكو أسفل جبل موسى. مشهور برحلات شروق الشمس من القمة.',
    bestTime: 'Overnight climb for sunrise (02:00 AM start)',
    bestTimeAr: 'صعود ليلي لمشاهدة الشروق (الانطلاق ٠٢:٠٠ ص)',
    highlight: 'Historic manuscripts, burning bush & 2,285m summit panorama',
    highlightAr: 'مخطوطات نادرة، الشجرة العليقة وبانوراما القمة بارتفاع ٢٢٨٥م',
  },
  {
    id: 'spot-assalah',
    name: 'Assalah Artisan Village & Market',
    nameAr: 'قرية وسوق العصلة التراثي',
    category: 'Local Culture',
    categoryAr: 'تراث وثقافة محلية',
    latPct: 40,
    lngPct: 40,
    distance: '850m North',
    distanceAr: '٨٥٠م شمالاً',
    travelTime: '10 min walk',
    travelTimeAr: '١٠ دقائق مشي',
    travelMode: 'walk',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    description: 'Authentic Sinai local life with organic spice merchants, Bedouin bakeries, and handmade woven rugs.',
    descriptionAr: 'حياة سيناوية محلية أصيلة مع تجار التوابل العضوية، المخابز البدوية والمشغولات اليدوية والسجاد.',
    bestTime: 'Late afternoon & twilight',
    bestTimeAr: 'أواخر العصر ووقت الشفق',
    highlight: 'Traditional Sinai herbs, fresh falafel & pottery',
    highlightAr: 'أعشاب سينائية أصيلة، فلافل طازجة وفخار يدوي',
  },
];

/** Stable so useApiResource does not re-request on every render. */
const fetchPlaces = (signal: AbortSignal) => api.getDahabPlaces(signal);

export const InteractiveSinaiMap: React.FC = () => {
  const { addActivityToDay, showToast, savedItems, toggleSaveItem } = useTrip();
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  /**
   * The corpus is the list; the editorial entries above supply the photograph,
   * the best-light window and the reason to go for the places they cover.
   *
   * Matched on the English name rather than an id, because the two were written
   * independently and their ids do not correspond: the editorial list calls the
   * Blue Hole `spot-blue-hole`, the corpus calls it `place_blue_hole`.
   */
  const corpus = useApiResource(fetchPlaces);

  const spots: DahabSpot[] = useMemo(() => {
    if (!corpus.data?.places?.length) return EDITORIAL_SPOTS;

    const editorialByName = new Map(
      EDITORIAL_SPOTS.map(e => [e.name.toLowerCase().replace(/[^a-z]/g, ''), e])
    );
    const key = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '');

    return buildMapPlaces(corpus.data.places).map(place => {
      // A loose match: "The Blue Hole & Bells" against "The Blue Hole".
      const editorial =
        editorialByName.get(key(place.name)) ||
        EDITORIAL_SPOTS.find(e => key(e.name).includes(key(place.name)) || key(place.name).includes(key(e.name)));

      return {
        id: place.id,
        name: place.name,
        nameAr: place.nameAr,
        category: place.category,
        categoryAr: place.categoryAr,
        latPct: place.latPct,
        lngPct: place.lngPct,
        distance: place.distance,
        distanceAr: place.distanceAr,
        description: place.description,
        descriptionAr: place.descriptionAr,
        verifiedAt: place.verifiedAt,
        // Present only where an editorial entry describes this place.
        image: editorial?.image,
        bestTime: editorial?.bestTime,
        bestTimeAr: editorial?.bestTimeAr,
        highlight: editorial?.highlight,
        highlightAr: editorial?.highlightAr,
        travelTime: editorial?.travelTime,
        travelTimeAr: editorial?.travelTimeAr,
        travelMode: editorial?.travelMode
      };
    });
  }, [corpus.data]);

  const [selectedSpotId, setSelectedSpotId] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const selectedSpot = spots.find((s) => s.id === selectedSpotId) || spots[0];

  const filteredSpots = spots.filter((s) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Dive') return s.category.includes('Dive');
    if (activeFilter === 'Desert') return s.category.includes('Desert');
    if (activeFilter === 'Beach') return s.category.includes('Beach');
    if (activeFilter === 'Culture') return s.category.includes('Culture');
    return true;
  });

  const handleAddSpotToItinerary = (spot: DahabSpot) => {
    addActivityToDay(2, {
      id: `spot-act-${Date.now()}`,
      time: '03:30 PM',
      title: isAr ? spot.nameAr : spot.name,
      type: spot.category.includes('Dive') ? 'Activity' : spot.category.includes('Desert') ? 'Experience' : 'Leisure',
      // status is data, not display: writing the Arabic label here produced an
      // activity whose status matched no filter or comparison anywhere else.
      status: 'Added ✓',
      location: isAr ? spot.nameAr : spot.name,
      notes: [isAr ? spot.descriptionAr : spot.description, isAr ? spot.distanceAr : spot.distance]
        .filter(Boolean)
        .join(' · '),
      duration: isAr ? 'ساعتان' : '2 hours',
    });
    showToast(isAr ? `تمت إضافة "${spot.nameAr}" لجدول اليوم الثاني!` : `Added "${spot.name}" to Day 2 Itinerary!`);
  };

  const filterLabels: { key: string; labelEn: string; labelAr: string }[] = [
    { key: 'All', labelEn: 'All', labelAr: 'الكل' },
    { key: 'Dive', labelEn: 'Dive', labelAr: 'غطس' },
    { key: 'Desert', labelEn: 'Desert', labelAr: 'صحراء' },
    { key: 'Beach', labelEn: 'Beach', labelAr: 'شواطئ' },
    { key: 'Culture', labelEn: 'Culture', labelAr: 'ثقافة وتراث' },
  ];

  return (
    <section
      id="interactive-sinai-map-section"
      aria-label={isAr ? 'مستكشف مواقع دهب وسيناء التفاعلي' : 'Interactive Sinai and Dahab Location Explorer'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="relative rounded-3xl overflow-hidden border border-white/40 shadow-2xl">
        {/* Real Dahab Mountains and Sea Landscape Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1800&auto=format&fit=crop"
            alt="Dahab Desert Mountains and Sea Coast"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          {/* Frosted Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5]/92 via-white/88 to-[#F2EDE2]/92 backdrop-blur-xl backdrop-saturate-150" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-300/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F6F78] animate-pulse shadow-xs" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F6F78] font-['Outfit',sans-serif]">
                  {isAr ? 'الذكاء الجغرافي وخريطة سيناء' : 'Geographic Intelligence & Sinai Map'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight font-['Outfit',sans-serif]">
                {isAr ? 'استكشف معالم دهب الساحلية والصحراوية' : 'Explore Dahab Coastal & Desert Spots'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-700 font-normal mt-1">
                {isAr
                  ? 'دليل مكاني تفاعلي يربط بين شعاب خليج العقبة المرجانية، شقوق الكانيونات، ومحميات الصحراء البدوية.'
                  : 'Interactive spatial guide connecting the Gulf of Aqaba dive reefs, canyon rifts, and Bedouin desert sanctuaries.'}
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {filterLabels.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                    activeFilter === f.key
                      ? 'bg-[#062C35] text-[#F7F3EA] shadow-md border border-stone-800'
                      : 'bg-white/70 hover:bg-white/95 text-stone-800 hover:text-stone-900 border border-white/60 shadow-xs'
                  }`}
                >
                  {isAr ? f.labelAr : f.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Main Map + Card Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 1. INTERACTIVE VECTOR MAP CONTAINER */}
            <div className="lg:col-span-7 bg-[#04171D]/90 text-white rounded-3xl p-6 border border-[#20A89A]/30 shadow-xl relative min-h-[420px] flex flex-col justify-between overflow-hidden backdrop-blur-md">
              
              {/* Map Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#E7A83B]" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E7D3AE] font-['Outfit',sans-serif]">
                    {isAr ? 'ساحل جنوب سيناء · خليج العقبة' : 'South Sinai Coastline · Gulf of Aqaba'}
                  </span>
                </div>
                <span className="text-[12px] text-[#52C4B7] font-bold bg-[#062C35]/90 px-2.5 py-1 rounded-full border border-[#20A89A]/30 shadow-xs">
                  {isAr ? 'الفندق: فندق دهب باي' : 'Hotel: Dahab Bay Hotel'}
                </span>
              </div>

              {/* Stylized SVG Map of Dahab Coast & Sinai Mountains */}
              <div className="absolute inset-0 z-0">
                <svg
                  className="w-full h-full opacity-40"
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Sea Area */}
                  <path
                    d="M 280 0 Q 320 150 250 250 T 290 500 L 500 500 L 500 0 Z"
                    fill="#062C35"
                    opacity="0.8"
                  />
                  {/* Mountain Contours */}
                  <path
                    d="M 0 50 Q 80 80 120 200 T 70 450 L 0 500 Z"
                    fill="#0F6F78"
                    opacity="0.3"
                  />
                  {/* Coastal Road Route */}
                  <path
                    d="M 280 0 Q 315 150 248 250 T 288 500"
                    stroke="#E7A83B"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                  {/* Coral Reef Zone indicator */}
                  <path
                    d="M 300 0 Q 335 150 270 250 T 310 500"
                    stroke="#20A89A"
                    strokeWidth="6"
                    opacity="0.4"
                  />
                </svg>
              </div>

              {/* Interactive Geographic Map Pins */}
              <div className="relative z-10 my-auto w-full h-[320px]">
                {filteredSpots.map((spot) => {
                  const isSelected = spot.id === selectedSpotId;
                  const spotName = isAr ? spot.nameAr : spot.name;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setSelectedSpotId(spot.id)}
                      style={{
                        top: `${spot.latPct}%`,
                        left: `${spot.lngPct}%`,
                      }}
                      aria-label={`${spotName}, ${isAr ? spot.categoryAr : spot.category}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group focus:outline-none"
                    >
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg transition-transform backdrop-blur-md ${
                          isSelected
                            ? 'bg-[#E7A83B] text-[#04171D] border-[#E7A83B] scale-110 font-bold z-30'
                            : 'bg-[#062C35]/90 text-white border-[#20A89A]/30 hover:scale-105 z-10'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#20A89A]" aria-hidden="true" />
                        <span className="text-[12px] whitespace-nowrap">{spotName.split('(')[0].split('&')[0]}</span>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-[#E7A83B] rotate-45 mx-auto -mt-1 shadow-md" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Map Footer Legend */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#E7D3AE]/80 border-t border-[#20A89A]/20 pt-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#20A89A]" /> {isAr ? 'نطاق الشعاب المرجانية' : 'Coral Reef Zone'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#E7A83B]" /> {isAr ? 'المسار الساحلي' : 'Coastal Route'}
                  </span>
                </div>
                <span>{isAr ? 'اضغط على أي موقع للمعاينة' : 'Click any location to preview'}</span>
              </div>

            </div>

            {/* 2. SYNCHRONIZED LOCATION CARD DETAILS */}
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg flex flex-col justify-between space-y-4">
              
              <div className="space-y-4">
                {/* Spot Photo with Badges */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                  {selectedSpot.image ? (
                    <img
                      src={selectedSpot.image}
                      alt={isAr ? selectedSpot.nameAr : selectedSpot.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#13312B] to-[#04171D]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04171D]/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 start-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#04171D]/80 backdrop-blur-md text-[#E7A83B] text-[11px] font-bold uppercase tracking-wider border border-[#20A89A]/30 shadow-xs">
                      {isAr ? selectedSpot.categoryAr : selectedSpot.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveItem(selectedSpot.id)}
                    aria-label={savedItems.includes(selectedSpot.id) ? (isAr ? 'إزالة من المحفوظات' : 'Remove from saved') : (isAr ? 'حفظ الموقع' : 'Save location')}
                    className={`absolute top-3 end-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
                      savedItems.includes(selectedSpot.id)
                        ? 'bg-[#D96C4F] text-white'
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${savedItems.includes(selectedSpot.id) ? 'fill-white' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 start-3 end-3 text-white">
                    {typeof selectedSpot.rating === 'number' && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#E7A83B]">
                      <Star className="w-3.5 h-3.5 fill-[#E7A83B] text-[#E7A83B]" />
                      <span>{selectedSpot.rating}</span>
                      {typeof selectedSpot.reviews === 'number' && (
                        <span className="text-[#E7D3AE]/80">({selectedSpot.reviews} {isAr ? 'تقييم' : 'reviews'})</span>
                      )}
                    </div>
                    )}
                    <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] leading-tight">
                      {isAr ? selectedSpot.nameAr : selectedSpot.name}
                    </h3>
                  </div>
                </div>

                {/* Travel Time Strip */}
                <div className="bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-white/60 flex items-center justify-between text-xs shadow-xs">
                  {selectedSpot.travelTime ? (
                    <div className="flex items-center gap-2 font-bold text-[#142126]">
                      {selectedSpot.travelMode === 'walk' ? (
                        <Footprints className="w-4 h-4 text-[#0F6F78]" />
                      ) : (
                        <Car className="w-4 h-4 text-[#E7A83B]" />
                      )}
                      <span>{isAr ? selectedSpot.travelTimeAr : selectedSpot.travelTime}</span>
                    </div>
                  ) : (
                    <span />
                  )}
                  {/* Computed from the real coordinates, not written by hand. */}
                  <span className="text-stone-700 font-medium">{isAr ? selectedSpot.distanceAr : selectedSpot.distance}</span>
                  {selectedSpot.bestTime && (
                    <span className="text-[#0F6F78] font-bold bg-[#20A89A]/15 px-2 py-0.5 rounded-full border border-[#20A89A]/20">
                      {isAr ? selectedSpot.bestTimeAr : selectedSpot.bestTime}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  {isAr ? selectedSpot.descriptionAr : selectedSpot.description}
                </p>

                {selectedSpot.highlight && (
                  <div className="bg-[#FAF7F0]/90 backdrop-blur-md p-2.5 rounded-xl border border-[#E7A83B]/30 text-xs text-[#142126] font-medium shadow-xs">
                    💡 <strong className="text-[#0F6F78]">{isAr ? 'نصيحة للمسافر:' : 'Traveler Tip:'}</strong> {isAr ? selectedSpot.highlightAr : selectedSpot.highlight}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3 border-t border-stone-200/60">
                <button
                  type="button"
                  onClick={() => handleAddSpotToItinerary(selectedSpot)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#062C35] hover:bg-[#0A3A46] text-[#F7F3EA] text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#E7A83B]" />
                  <span>{isAr ? 'أضف لجدول اليوم الثاني' : 'Add to Day 2 Itinerary'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast(isAr ? `جاري فتح التوجيه إلى ${selectedSpot.nameAr}` : `Opening walking navigation to ${selectedSpot.name}`)}
                  className="py-3 px-4 rounded-2xl bg-white/80 hover:bg-white text-[#142126] border border-white/80 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs backdrop-blur-md"
                >
                  <Navigation className="w-4 h-4 text-[#0F6F78]" />
                  <span>{isAr ? 'توجيه' : 'Navigate'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

