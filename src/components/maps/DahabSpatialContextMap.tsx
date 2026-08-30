import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Compass,
  Waves,
  Sun,
  Clock,
  Car,
  Ship,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Mountain
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import { DAHAB_CENTRE, bearingLabel, buildMapPlaces, distanceKm } from '../../services/placeMapper';

export interface DahabPlaceMarker {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'dive' | 'beach' | 'desert' | 'hub' | 'summit';
  categoryLabelEn: string;
  categoryLabelAr: string;
  lat: number;
  lng: number;
  mapX: number; // Percent relative position for vector radar (0-100)
  mapY: number; // Percent relative position for vector radar (0-100)
  /**
   * Distance from the town centre, computed from the coordinates above.
   * Was `travelTimeFromCenter` — "18 min 4x4", written by hand next to
   * coordinates that were never used to derive it.
   */
  distanceFromCentre: string;
  /**
   * Editorial extras, present only where an entry below describes a place the
   * corpus holds. A place the corpus has and this list does not shows the
   * record's own description rather than an invented photograph and window.
   */
  travelTimeFromCenter?: string;
  transitType?: 'Walk' | '4x4 Taxi' | 'Camel / Boat' | 'Mountain Trek';
  transitTypeAr?: string;
  highlightEn: string;
  highlightAr: string;
  depthOrAltitude?: string;
  bestTime?: string;
  /** Absent: nothing measures a rating. Was an invented 4.7–5.0. */
  rating?: number;
  imageUrl?: string;
}

/**
 * The editorial layer: photographs, best-light windows and the reason to go.
 *
 * This was the map's whole dataset — eight markers with hand-placed radar
 * positions and hand-written travel times — while /api/dahab/places held 17
 * real records with real coordinates. Merged onto the corpus by name now, and
 * used alone only when the request fails.
 */
type EditorialMarker = Omit<DahabPlaceMarker, 'distanceFromCentre'>;

const EDITORIAL_MAP_SOURCE: EditorialMarker[] = [
  {
    id: 'spot-lighthouse',
    nameEn: 'Lighthouse Bay & Coral Slope',
    nameAr: 'خليج اللايتهاوس وممشى البحر',
    category: 'dive',
    categoryLabelEn: 'Diving & Social Hub',
    categoryLabelAr: 'غطس وكافيهات البحر',
    lat: 28.5028,
    lng: 34.5204,
    mapX: 52,
    mapY: 54,
    travelTimeFromCenter: '0 mins (Center)',
    transitType: 'Walk',
    transitTypeAr: 'مشي على الممشى',
    highlightEn: 'Sheltered bay ideal for morning snorkeling, freediving lines, and sunset Bedouin teas.',
    highlightAr: 'خليج هادي ومثالي للسنوركلينج الصبح، تدريب الفري دايفينج، وقعدة الشاي البدوي وقت الغروب.',
    depthOrAltitude: '0–25m reef slope',
    bestTime: 'Sunrise to Midnight',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spot-eel-garden',
    nameEn: 'Eel Garden Marine Reserve',
    nameAr: 'محمية الإيل جاردن (حديقة الثعابين)',
    category: 'dive',
    categoryLabelEn: 'Marine Sanctuary',
    categoryLabelAr: 'محمية بحرية',
    lat: 28.5105,
    lng: 34.5242,
    mapX: 55,
    mapY: 48,
    travelTimeFromCenter: '5 mins',
    transitType: 'Walk',
    transitTypeAr: 'مشي ٥ دقائق',
    highlightEn: 'Spectacular colony of garden eels swaying on a bright white sand slope with outer reef canyon.',
    highlightAr: 'مستعمرة نادرة من ثعابين البحر الرملية ومنحدر مرجاني أبيض ناصع مع جدار مفتوح.',
    depthOrAltitude: '9–30m depth',
    bestTime: 'Morning high tide',
    imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spot-canyon',
    nameEn: 'The Canyon & Fish Bowl',
    nameAr: 'الكانيون وغرفة الأسماك المرجانية',
    category: 'dive',
    categoryLabelEn: 'Deep Cavern',
    categoryLabelAr: 'كهف وأخدود بحري',
    lat: 28.5524,
    lng: 34.5286,
    mapX: 58,
    mapY: 34,
    travelTimeFromCenter: '12 mins',
    transitType: '4x4 Taxi',
    transitTypeAr: 'عربية 4x4',
    highlightEn: 'Ancient underwater volcanic fissure with celestial light beams piercing through natural archways.',
    highlightAr: 'صدع بركاني تحت البحر بأشعة شمس ملهمة تخترق الكهف المرجاني الطبيعي.',
    depthOrAltitude: '18–35m depth',
    bestTime: '10:00 AM – 2:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spot-blue-hole',
    nameEn: 'The Blue Hole & The Arch',
    nameAr: 'البلو هول والأرش البحري',
    category: 'dive',
    categoryLabelEn: 'Legendary Wonder',
    categoryLabelAr: 'أعجوبة دهب العالمية',
    lat: 28.5721,
    lng: 34.5369,
    mapX: 62,
    mapY: 26,
    travelTimeFromCenter: '18 mins',
    transitType: '4x4 Taxi',
    transitTypeAr: 'عربية 4x4',
    highlightEn: 'Submarine sinkhole over 100m deep surrounded by rich outer coral walls and Bedouin shade terraces.',
    highlightAr: 'حفرة بحرية بعمق أكتر من ١٠٠ متر محاطة بجدران مرجانية مذهلة وشلتات بدوية على الشاطئ.',
    depthOrAltitude: '100m+ drop-off',
    bestTime: '08:00 AM – 3:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cf96c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spot-laguna',
    nameEn: 'Dahab Laguna & Sandy Spit',
    nameAr: 'لاجون دهب واللسان الرملي',
    category: 'beach',
    categoryLabelEn: 'Lagoon & Kitesurf',
    categoryLabelAr: 'كايت وبحر رملي',
    lat: 28.4776,
    lng: 34.5023,
    mapX: 47,
    mapY: 67,
    travelTimeFromCenter: '8 mins',
    transitType: '4x4 Taxi',
    transitTypeAr: 'تاكسي / دراجة',
    highlightEn: 'Golden shallow turquoise water with continuous thermal wind, soft sandy bottom and mountain backdrop.',
    highlightAr: 'مياه فيروزية ضحلة ورمال ناعمة ورياح ثابتة لركوب الأمواج مع فيو جبال سيناء.',
    depthOrAltitude: 'Shallow sandbank',
    bestTime: 'Afternoon & Sunset',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spot-blue-lagoon',
    nameEn: 'Ras Abu Galum & Blue Lagoon',
    nameAr: 'محمية أبو جالوم والبلولاجون',
    category: 'desert',
    categoryLabelEn: 'Off-Grid Paradise',
    categoryLabelAr: 'روقان بدوي وبحر بكر',
    lat: 28.6500,
    lng: 34.5850,
    mapX: 68,
    mapY: 12,
    travelTimeFromCenter: '45 mins',
    transitType: 'Camel / Boat',
    transitTypeAr: 'لانش بحري / جمل',
    highlightEn: 'Raw electricity-free coastal haven between Sinai granite crags and ultra-clear neon water.',
    highlightAr: 'جنة معزولة بدون كهرباء بين جبال الجرانيت والمياه الفيروزية النقية مع أكل بدوي طازة.',
    depthOrAltitude: 'Pure flat water',
    bestTime: 'Full Day / Overnight',
    imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spot-wadi-qnai',
    nameEn: 'Wadi Qnai & Three Pools Oasis',
    nameAr: 'وادي قناي والثري بولز',
    category: 'desert',
    categoryLabelEn: 'Canyon & Palms',
    categoryLabelAr: 'واحة نخيل وبحر',
    lat: 28.4350,
    lng: 34.4250,
    mapX: 38,
    mapY: 82,
    travelTimeFromCenter: '20 mins',
    transitType: '4x4 Taxi',
    transitTypeAr: 'عربية سفاري',
    highlightEn: 'Secret date palm oasis, granite climbing crags, and shallow naturally protected reef lagoons.',
    highlightAr: 'واحة نخيل بلح ومسارات تسلق صخور وأحواض مرجانية طبيعية محمية.',
    depthOrAltitude: '3–15m pools',
    bestTime: 'Midday to Sunset',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'spot-sinai-summit',
    nameEn: 'Mount Sinai Summit & St. Catherine',
    nameAr: 'قمة جبل موسى ودير سانت كاترين',
    category: 'summit',
    categoryLabelEn: 'Sacred High Sinai',
    categoryLabelAr: 'قمة سيناء المقدسة',
    lat: 28.5394,
    lng: 33.9753,
    mapX: 18,
    mapY: 42,
    travelTimeFromCenter: '1 hr 45 mins',
    transitType: 'Mountain Trek',
    transitTypeAr: 'ميني باص وصعود قمة',
    highlightEn: '2,285m high granite peak with dawn sea of clouds, followed by 6th-century Byzantine monastery visit.',
    highlightAr: 'ارتفاع ٢٢٨٥ متر لرؤية شروق الشمس التاريخي بين السحب وزيارة أقدم دير مأهول في العالم.',
    depthOrAltitude: '2,285m Altitude',
    bestTime: 'Night trek for Sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
  }
];
/** Distances derived from each entry's own coordinates. */
export const EDITORIAL_MAP_SPOTS: DahabPlaceMarker[] = EDITORIAL_MAP_SOURCE.map(spot => {
  const km = distanceKm(DAHAB_CENTRE, { lat: spot.lat, lng: spot.lng });
  const bearing = bearingLabel(DAHAB_CENTRE, { lat: spot.lat, lng: spot.lng });
  return { ...spot, distanceFromCentre: km < 0.6 ? 'In town' : `${km} km ${bearing.en}` };
});


/** Stable so useApiResource does not re-request on every render. */
const fetchMapPlaces = (signal: AbortSignal) => api.getDahabPlaces(signal);

export const DahabSpatialContextMap: React.FC = () => {
  const { showToast, navigateTo } = useTrip();
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();

  /**
   * The corpus is the list; the editorial entries supply the photograph, the
   * best-light window and the reason to go for the places they cover.
   *
   * Matched on the English name, because the two lists were written
   * independently and their ids do not correspond.
   */
  const corpus = useApiResource(fetchMapPlaces);

  const spots: DahabPlaceMarker[] = useMemo(() => {
    if (!corpus.data?.places?.length) return EDITORIAL_MAP_SPOTS;

    const key = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '');
    return buildMapPlaces(corpus.data.places).map(place => {
      const editorial = EDITORIAL_MAP_SPOTS.find(
        e => key(e.nameEn).includes(key(place.name)) || key(place.name).includes(key(e.nameEn))
      );
      return {
        id: place.id,
        nameEn: place.name,
        nameAr: place.nameAr,
        category: editorial?.category ?? 'hub',
        categoryLabelEn: place.category,
        categoryLabelAr: place.categoryAr,
        lat: place.lat,
        lng: place.lng,
        // The radar draws in percentage space; these come from the real
        // coordinates rather than being hand-placed.
        mapX: place.lngPct,
        mapY: place.latPct,
        distanceFromCentre: place.distance,
        highlightEn: editorial?.highlightEn ?? place.description,
        highlightAr: editorial?.highlightAr ?? place.descriptionAr,
        depthOrAltitude: editorial?.depthOrAltitude,
        bestTime: editorial?.bestTime,
        imageUrl: editorial?.imageUrl,
        travelTimeFromCenter: editorial?.travelTimeFromCenter,
        transitType: editorial?.transitType,
        transitTypeAr: editorial?.transitTypeAr
      };
    });
  }, [corpus.data]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpot, setActiveSpot] = useState<DahabPlaceMarker | null>(null);
  const shownSpot = activeSpot ?? spots[0] ?? null;
  const [radarZoom, setRadarZoom] = useState<number>(1);
  const [mapStyle, setMapStyle] = useState<'topography' | 'satellite' | 'nautical'>('topography');
  const [gMapsError, setGMapsError] = useState<boolean>(false);

  // Check if a dedicated Google Maps API key is explicitly configured in Vite environment
  const viteMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isGoogleMapsConfigured = Boolean(viteMapsKey && viteMapsKey.trim().length > 10 && !gMapsError);

  const filteredSpots = useMemo(() => {
    if (selectedCategory === 'all') return spots;
    return spots.filter((s) => s.category === selectedCategory);
  }, [selectedCategory, spots]);

  return (
    <section
      id="dahab-spatial-context-map-section"
      aria-label="Dahab Geospatial & Route Intelligence Map"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all"
    >
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Header Strip */}
        <div className="p-6 sm:p-8 bg-[var(--surface-container)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F4C36C] text-[#081714] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الخريطة الذكية لدهب وسيناء' : 'Sinai Geospatial Radar'}</span>
                </span>
                <span className="text-[12px] font-semibold text-[#52C4B7] bg-black/20 dark:bg-white/5 px-3 py-1 rounded-full border border-[var(--border-subtle)]">
                  {language === 'ar' ? 'توقيتات حية ومسارات الطرق' : 'Live Routes & 4x4 Travel Estimates'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[var(--text-primary)]">
                {language === 'ar' ? 'خريطة السواحل والوديان والقمم' : 'Spatial Route & Terrain Companion'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
                {language === 'ar'
                  ? 'استكشف البلو هول، الكانيون، لاجون دهب، محمية أبو جالوم وقمة موسى مع حساب زمن الوصول ونوع وسيلة النقل.'
                  : 'Effortlessly track reef drop-offs, kite lagoons, Bedouin canyons, and Mt. Sinai transit with live geospatial awareness.'}
              </p>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start md:self-center">
              {[
                { id: 'all', labelEn: 'All Spots', labelAr: 'الكل' },
                { id: 'dive', labelEn: '🤿 Reefs & Caves', labelAr: 'شعاب وكهوف' },
                { id: 'beach', labelEn: '🏖️ Lagoons', labelAr: 'شواطئ ولاجون' },
                { id: 'desert', labelEn: '🏜️ Canyons & Oases', labelAr: 'وديان وواحات' },
                { id: 'summit', labelEn: '🌄 Summits', labelAr: 'قمم جبلية' },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? 'bg-[#20A89A] text-[#081714] border-[#20A89A] shadow-sm font-black'
                        : 'bg-[var(--surface-card)] hover:bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                    }`}
                  >
                    {language === 'ar' ? tab.labelAr : tab.labelEn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map Stage + Spot Inspector Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[500px]">
          
          {/* Main Map Render Container */}
          <div className="lg:col-span-8 relative w-full h-[380px] sm:h-[460px] lg:h-[560px] bg-[var(--bg-canvas)] overflow-hidden select-none">
            
            {/* If Google Maps API is explicitly configured, render Google Maps. Otherwise render the Interactive Vector Geospatial Radar */}
            {isGoogleMapsConfigured && viteMapsKey ? (
              <APIProvider apiKey={viteMapsKey} onError={() => setGMapsError(true)}>
                <Map
                  mapId="DAHAB_OS_MAP"
                  defaultCenter={{ lat: 28.5150, lng: 34.5200 }}
                  defaultZoom={11}
                  gestureHandling="cooperative"
                  disableDefaultUI={false}
                  zoomControl={true}
                  mapTypeControl={false}
                  streetViewControl={false}
                  fullscreenControl={true}
                  className="w-full h-full"
                >
                  {filteredSpots.map((spot) => {
                    const isSelected = shownSpot?.id === spot.id;
                    return (
                      <AdvancedMarker
                        key={spot.id}
                        position={{ lat: spot.lat, lng: spot.lng }}
                        title={spot.nameEn}
                        onClick={() => {
                          setActiveSpot(spot);
                          showToast(`Selected ${spot.nameEn}`);
                        }}
                      >
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold shadow-xl transition-all transform cursor-pointer border ${
                            isSelected
                              ? 'bg-[#F4C36C] text-[#081714] border-[#F4C36C] scale-110 ring-4 ring-[#081714]/60 font-black'
                              : 'bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-container)] border-[var(--border-subtle)] text-xs'
                          }`}
                        >
                          <span className="text-sm">
                            {spot.category === 'dive'
                              ? '🤿'
                              : spot.category === 'beach'
                              ? '🏖️'
                              : spot.category === 'desert'
                              ? '🏜️'
                              : '🌄'}
                          </span>
                          <span className="text-[12px] max-w-[120px] truncate">
                            {language === 'ar' ? spot.nameAr.split(' ')[0] : spot.nameEn.split(' ')[0]}
                          </span>
                        </div>
                      </AdvancedMarker>
                    );
                  })}
                </Map>
              </APIProvider>
            ) : (
              /* ========================================================================= */
              /* HIGH-CRAFT INTERACTIVE GEOSPATIAL VECTOR RADAR (OFFLINE / NO-KEY COMPLIANT) */
              /* ========================================================================= */
              <div className="relative w-full h-full bg-radial from-[#0C2A24] via-[#081714] to-[#040C0B] flex items-center justify-center p-4">
                
                {/* Visual Grid & Latitude Lines */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(rgba(82, 196, 183, 0.4) 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* SVG Vector Map Rendering */}
                <svg
                  viewBox="0 0 1000 700"
                  className="w-full h-full max-h-full transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${radarZoom})` }}
                >
                  <defs>
                    {/* Deep Sea Gradient */}
                    <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0B3038" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#062227" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#031317" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Sinai Mountain Relief Gradient */}
                    <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2A241A" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#17130D" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Coastal Coral Reef Glow */}
                    <linearGradient id="reefGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#20A89A" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#52C4B7" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* 1. Gulf of Aqaba Sea Mass */}
                  <path
                    d="M 500 0 L 1000 0 L 1000 700 L 450 700 Q 420 550 480 450 Q 550 320 620 180 Z"
                    fill="url(#seaGrad)"
                    stroke="#20A89A"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.85"
                  />

                  {/* 2. Coastal Coral Reef Fringing Buffer */}
                  <path
                    d="M 500 0 Q 560 120 580 200 Q 640 280 560 400 Q 500 500 450 700"
                    fill="none"
                    stroke="#52C4B7"
                    strokeWidth="8"
                    strokeOpacity="0.3"
                  />

                  {/* 3. Sinai Mountain Formations (West) */}
                  <path
                    d="M 0 0 L 500 0 Q 560 180 480 400 Q 430 550 0 700 Z"
                    fill="url(#mountainGrad)"
                    stroke="#F4C36C"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                  />

                  {/* Topographic Contour Lines */}
                  <path d="M 50 150 Q 200 120 320 280 Q 220 450 100 500" fill="none" stroke="#F4C36C" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.25" />
                  <path d="M 120 220 Q 250 200 350 340 Q 260 480 180 550" fill="none" stroke="#F4C36C" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.2" />

                  {/* 4. Active Transit Path Vector from Center (Lighthouse) to Active Spot */}
                  {shownSpot && (
                    <g>
                      <line
                        x1={520}
                        y1={378}
                        x2={shownSpot.mapX * 10}
                        y2={shownSpot.mapY * 7}
                        stroke="#F4C36C"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      <circle
                        cx={(520 + shownSpot.mapX * 10) / 2}
                        cy={(378 + shownSpot.mapY * 7) / 2}
                        r="12"
                        fill="#0E2520"
                        stroke="#F4C36C"
                        strokeWidth="1.5"
                      />
                      <text
                        x={(520 + shownSpot.mapX * 10) / 2}
                        y={(378 + shownSpot.mapY * 7) / 2 + 4}
                        fill="#F7F3EA"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {/* The distance, computed from the coordinates. Was a
                            hand-written travel time. */}
                        {shownSpot.distanceFromCentre.split(' ')[0]}
                      </text>
                    </g>
                  )}

                  {/* 5. Coastline Labels */}
                  <text x="800" y="200" fill="#52C4B7" fontSize="13" fontWeight="bold" opacity="0.4" letterSpacing="4">
                    GULF OF AQABA
                  </text>
                  <text x="120" y="200" fill="#F4C36C" fontSize="12" fontWeight="bold" opacity="0.35" letterSpacing="3">
                    SINAI HIGHLANDS
                  </text>
                </svg>

                {/* Interactive Clickable Pins (Rendered on top of vector map) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ transform: `scale(${radarZoom})`, transformOrigin: 'center' }}
                >
                  {filteredSpots.map((spot) => {
                    const isSelected = shownSpot?.id === spot.id;
                    return (
                      <div
                        key={spot.id}
                        style={{
                          left: `${spot.mapX}%`,
                          top: `${spot.mapY}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className="absolute pointer-events-auto z-20"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSpot(spot);
                            showToast(`Selected ${spot.nameEn}`);
                          }}
                          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold shadow-xl transition-all transform cursor-pointer border ${
                            isSelected
                              ? 'bg-[#F4C36C] text-[#081714] border-[#F4C36C] scale-115 ring-4 ring-[#081714]/70 font-black shadow-[0_0_20px_rgba(244,195,108,0.5)]'
                              : 'bg-[#0E2520]/90 text-[#F7F3EA] hover:bg-[#13312B] border-white/20 text-xs backdrop-blur-md hover:scale-105'
                          }`}
                        >
                          <span className="text-sm">
                            {spot.category === 'dive'
                              ? '🤿'
                              : spot.category === 'beach'
                              ? '🏖️'
                              : spot.category === 'desert'
                              ? '🏜️'
                              : '🌄'}
                          </span>
                          <span className="text-[12px] max-w-[120px] truncate whitespace-nowrap">
                            {language === 'ar' ? spot.nameAr.split(' ')[0] : spot.nameEn.split(' ')[0]}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Radar Floating Controls */}
                <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRadarZoom((z) => Math.min(z + 0.2, 1.8))}
                    title="Zoom In"
                    aria-label="Zoom in"
                    className="w-8 h-8 rounded-xl bg-[#0E2520]/90 hover:bg-[#173832] border border-white/15 text-[#F7F3EA] flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRadarZoom((z) => Math.max(z - 0.2, 0.8))}
                    title="Zoom Out"
                    aria-label="Zoom out"
                    className="w-8 h-8 rounded-xl bg-[#0E2520]/90 hover:bg-[#173832] border border-white/15 text-[#F7F3EA] flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRadarZoom(1)}
                    title="Reset Map View"
                    aria-label="Reset the map view"
                    className="w-8 h-8 rounded-xl bg-[#0E2520]/90 hover:bg-[#173832] border border-white/15 text-[#F7F3EA] flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Float overlay: Quick center indicator badge */}
            <div className="absolute top-4 left-4 z-20 bg-[#0E2520]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-[#F7F3EA] text-xs font-bold shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'ar' ? 'محمية دهب وسيناء · خليج العقبة' : 'Dahab Coast · Gulf of Aqaba'}</span>
            </div>
          </div>

          {/* Side Spot Inspector & Fast Booking Dispatch */}
          <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-[var(--surface-card)] border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] text-[var(--text-primary)]">
            {activeSpot ? (
              <div className="space-y-4">
                
                {/* Spot Header with Photo */}
                <div className="relative rounded-2xl overflow-hidden h-36 w-full border border-[var(--border-subtle)] shadow-sm">
                  <img
                    src={shownSpot.imageUrl}
                    alt={shownSpot.nameEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-[#F7F3EA]">
                    <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F4C36C] text-[#081714]">
                      {language === 'ar' ? shownSpot.categoryLabelAr : shownSpot.categoryLabelEn}
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white mt-1 leading-tight">
                      {language === 'ar' ? shownSpot.nameAr : shownSpot.nameEn}
                    </h3>
                  </div>
                </div>

                {/* Spot Details Breakdown */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] shadow-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#20A89A] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{language === 'ar' ? 'زمن الوصول' : 'Transit Time'}</span>
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                      {shownSpot.travelTimeFromCenter}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] shadow-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#F4C36C] font-bold">
                      <Car className="w-3 h-3" />
                      <span>{language === 'ar' ? 'طريقة الانتقال' : 'Vehicle Type'}</span>
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                      {language === 'ar' ? shownSpot.transitTypeAr : shownSpot.transitType}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {language === 'ar' ? shownSpot.highlightAr : shownSpot.highlightEn}
                </p>

                {/* Depth / Altitude & Best Time */}
                <div className="p-3 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[var(--text-primary)]">
                    <span className="text-[var(--text-secondary)] text-[12px] font-medium">
                      {language === 'ar' ? 'العمق / الارتفاع:' : 'Depth / Elevation:'}
                    </span>
                    <span className="font-bold text-[#20A89A]">{shownSpot.depthOrAltitude}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-primary)]">
                    <span className="text-[var(--text-secondary)] text-[12px] font-medium">
                      {language === 'ar' ? 'أفضل توقيت للزيارة:' : 'Prime Window:'}
                    </span>
                    <span className="font-bold text-[#F4C36C]">{shownSpot.bestTime}</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-[var(--text-secondary)] space-y-2">
                <MapPin className="w-8 h-8 text-[#F4C36C]" />
                <p className="text-xs">{language === 'ar' ? 'اختر نقطة من الخريطة لعرض تفاصيلها' : 'Select any pin on the map to view terrain & route details'}</p>
              </div>
            )}

            {/* Fast Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  window.open(`https://maps.google.com/?q=${activeSpot?.lat},${activeSpot?.lng}`, '_blank');
                  showToast(`Opening directions to ${activeSpot?.nameEn}...`);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Navigation className="w-4 h-4 text-[#081714]" />
                <span>{language === 'ar' ? 'فتح الاتجاهات المباشرة' : 'Get GPS Directions'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigateTo('/my-trip', { dayId: 2 });
                  showToast(`Viewing Day 2 itinerary for ${activeSpot?.nameEn}`);
                }}
                className="w-full py-3 rounded-2xl bg-[var(--surface-container)] hover:bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#20A89A]" />
                <span>{language === 'ar' ? 'إضافة إلى خطة الرحلة' : 'Schedule in 7-Day Plan'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
