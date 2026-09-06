import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Compass,
  Sun,
  Waves,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Film,
  X,
  Image as ImageIcon,
  Moon,
  Star
} from 'lucide-react';
import { TravelerProfile } from '../../types';
import { CinematicVideo } from './CinematicVideo';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export interface CinematicScene {
  id: string;
  label: string;
  labelAr: string;
  subLabel: string;
  subLabelAr: string;
  location: string;
  locationAr: string;
  videoUrl: string;
  posterUrl: string;
  youtubeId: string;
  ambientTag: string;
  ambientTagAr: string;
  scheduledActivity: string;
  scheduledActivityAr: string;
  activityTime: string;
  activityTimeAr: string;
  activityLead: string;
  activityLeadAr: string;
  conditions: string;
  conditionsAr: string;
  shortTag: string;
  shortTagAr: string;
}

const CINEMATIC_SCENES: CinematicScene[] = [
  {
    id: 'reef',
    label: 'Coral Reef & Blue Hole',
    labelAr: 'شعاب المرجان والبلو هول',
    subLabel: 'World-famous vertical sinkhole and submarine wall',
    subLabelAr: 'الحفرة الزرقاء الأيقونية ومدخنة البيلز للغوص الحر',
    location: 'The Blue Hole & The Bells',
    locationAr: 'الثقب الأزرق (البلو هول) والبيلز',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-underwater-view-of-a-coral-reef-41544-large.mp4',
    posterUrl: '/images/hero/coral-reef-split.jpg',
    youtubeId: 'qjP4QdZKlns',
    ambientTag: '25m Coral Visibility · Peak Light',
    ambientTagAr: 'رؤية مرجانية نقية ٢٥م+ · ذروة الضوء',
    scheduledActivity: 'The Canyon & Blue Hole Guided Dive',
    scheduledActivityAr: 'غطسة استكشاف الكانيون والبلو هول (تانكين)',
    activityTime: '08:45 AM Briefing',
    activityTimeAr: '٠٨:٤٥ ص التوجيه والمعدات',
    activityLead: 'Master Diver Youssef',
    activityLeadAr: 'كابتن يوسف · غطاس محترف',
    conditions: 'Calm water · 24°C Sea · 0.3m Swell',
    shortTag: 'Reef',
    shortTagAr: 'ريف',
    conditionsAr: 'مياه هادئة · حرارة ٢٤°م · موج ٠.٣م',
  },
  {
    id: 'desert',
    label: 'Sinai Desert & Canyons',
    labelAr: 'صحراء سيناء ووادي قني',
    subLabel: 'Granite climbing cliffs and Bedouin Zarb dinners',
    subLabelAr: 'جبال الجرانيت الوردي وعشاء الزرب والسمر البدوي',
    location: 'Wadi Gnai Canyon',
    locationAr: 'واحة كانيون وادي قني',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-desert-dunes-under-a-blue-sky-40432-large.mp4',
    posterUrl: '/images/hero/camels-beach.jpg',
    youtubeId: '8y1g4q9hUe0',
    ambientTag: 'Wadi Gnai Granite Formations · Stargazing',
    ambientTagAr: 'جرانيت وادي قني · رصد مجرة درب التبانة',
    scheduledActivity: 'Sunset Rock Bouldering & Bedouin Feast',
    scheduledActivityAr: 'تسلق صخور الغروب وعشاء الزرب البدوي',
    activityTime: '04:30 PM Departure',
    activityTimeAr: '٠٤:٣٠ م الانطلاق بسيارة 4x4',
    activityLead: 'Guide Salem Al-Bedouin',
    activityLeadAr: 'المرشد سالم البدوي',
    conditions: 'Clear Night Sky · Zero Light Pollution',
    shortTag: 'Safari',
    shortTagAr: 'سفاري',
    conditionsAr: 'سماء صافية · انعدام تام للتلوث الضوئي',
  },
  {
    id: 'lagoon',
    label: 'Lagoon & Turquoise Coast',
    labelAr: 'اللاجونا والبحيرة الفيروزية',
    subLabel: 'Flat turquoise bay with world-class thermal winds',
    subLabelAr: 'مياه مسطحة دافئة ورياح حرارية مثالية للتزلج الشراعي',
    location: 'Dahab South Laguna & Blue Lagoon',
    locationAr: 'شاطئ اللاجونا الجنوبي والبلو لاجون',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    posterUrl: '/images/hero/blue-lagoon-kitesurf.jpg',
    youtubeId: '9M7oV07_6mI',
    ambientTag: '18-Knot Thermal Wind · Flat Turquoise Waters',
    ambientTagAr: 'رياح حرارية ١٨ عقدة · مياه فيروزية مسطحة',
    scheduledActivity: 'Afternoon Kitesurfing & Wind Session',
    scheduledActivityAr: 'جلسة كايت سيرف وركوب أمواج اللاجونا',
    activityTime: '01:30 PM Wind Peak',
    activityTimeAr: '٠١:٣٠ م ذروة قوة الرياح',
    activityLead: 'Kite Master Karim',
    activityLeadAr: 'كريم · مدرب شراع دولي',
    conditions: '18 Knots Steady NNE · Shallow Sand Spit',
    shortTag: 'Lagoon',
    shortTagAr: 'لاجونا',
    conditionsAr: '١٨ عقدة رياح شمالية شرقية · لسان رملي ضحل',
  },
  {
    id: 'sunset',
    label: 'Lighthouse Sunset & Promenade',
    labelAr: 'غروب اللايتهاوس والممشى',
    subLabel: 'Bohemian seaside cushions, habak tea & acoustic music',
    subLabelAr: 'وسائد الجلوس الشاطئية، شاي الحبق، وألوان الشفق',
    location: 'Lighthouse Promenade Bay',
    locationAr: 'ممشى وخليج اللايتهاوس',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    posterUrl: '/images/hero/boho-cafe-dreams.jpg',
    youtubeId: 'WkR_C7W248Y',
    ambientTag: 'Golden Twilight · Habak Tea · Arabian Gulf View',
    ambientTagAr: 'شفق ذهبي ساحر · شاي حبق · إطلالة خليج العقبة',
    scheduledActivity: 'Seaside Sunset Relax & Fresh Fish Dinner',
    scheduledActivityAr: 'استرخاء الغروب وعشاء المأكولات البحرية الطازجة',
    activityTime: '05:15 PM Sunset Glow',
    activityTimeAr: '٠٥:١٥ م توقيت الشفق الذهبي',
    activityLead: 'Chef Youssef Seafood House',
    activityLeadAr: 'مطعم أسماك اللايتهاوس الطازجة',
    conditions: 'Mild 25°C Evening Breeze',
    shortTag: 'Sunset',
    shortTagAr: 'غروب',
    conditionsAr: 'نسيم مسائي عليل ٢٥°م',
  },
  {
    id: 'summit',
    label: 'Mount Sinai & St. Catherine',
    labelAr: 'قمة جبل موسى وسانت كاترين',
    subLabel: 'Spiritual dawn summit at 2,285m and 6th-century monastery',
    subLabelAr: 'شروق الشمس الأسطوري من قمة سيناء ودير سانت كاترين',
    location: 'Mount Sinai Summit (2,285m)',
    locationAr: 'قمة جبل موسى (٢٢٨٥م)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-desert-dunes-under-a-blue-sky-40432-large.mp4',
    posterUrl: '/images/hero/gulf-sunset.jpg',
    youtubeId: 'L_LUpnjgPso',
    ambientTag: '2,285m Altitude · Historic UNESCO Site',
    ambientTagAr: 'ارتفاع ٢٢٨٥م · موقع تراث عالمي لليونسكو',
    scheduledActivity: 'Overnight Trek & Summit Dawn Pilgrimage',
    scheduledActivityAr: 'صعود جبل موسى فجراً وزيارة دير سانت كاترين',
    activityTime: '02:00 AM Night Ascent',
    activityTimeAr: '٠٢:٠٠ ص بدء مسار الصعود الليلي',
    activityLead: 'Bedouin Mountain Tribe Guides',
    activityLeadAr: 'أدلاء قبيلة الجبل البدوية',
    conditions: 'Crisp 12°C Peak · Endless Horizon',
    shortTag: 'Summit',
    shortTagAr: 'قمة',
    conditionsAr: 'أجواء جبلية منعشة ١٢°م · أفق لا نهائي',
  },
];

const AUTO_SLIDE_INTERVAL = 7000; // 7 seconds — slower, more cinematic

interface CinematicVideoHeroProps {
  profile: TravelerProfile;
  onOpenMyTrip: () => void;
  onOpenExplore: () => void;
  onOpenFood: () => void;
  onOpenPlanner: () => void;
}

export const CinematicVideoHero: React.FC<CinematicVideoHeroProps> = ({
  profile,
  onOpenMyTrip,
  onOpenExplore,
  onOpenFood,
  onOpenPlanner,
}) => {
  const { language, isRTL , t} = useLanguage();
  const { theme, isDark } = useTheme();
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [liveConditions, setLiveConditions] = useState<{
    available?: boolean;
    airTemperatureC?: number;
    waterTemperatureC?: number | null;
    condition?: string;
    conditionAr?: string;
    astronomy?: { sunrise: string | null; sunset: string | null };
  } | null>(null);

  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getWeatherTelemetry().then((data) => {
      if (isMounted && data) setLiveConditions(data);
    }).catch(() => { /* graceful fallback to nothing */ });
    return () => { isMounted = false; };
  }, []);

  const currentScene = CINEMATIC_SCENES[activeSceneIndex];

  const handleNextSlide = useCallback(() => {
    setActiveSceneIndex((prev) => (prev + 1) % CINEMATIC_SCENES.length);
    setSlideProgress(0);
  }, []);

  const handlePrevSlide = useCallback(() => {
    setActiveSceneIndex((prev) => (prev - 1 + CINEMATIC_SCENES.length) % CINEMATIC_SCENES.length);
    setSlideProgress(0);
  }, []);

  const handleSelectScene = (index: number) => {
    setActiveSceneIndex(index);
    setSlideProgress(0);
  };

  useEffect(() => {
    if (!isAutoPlaying) {
      setSlideProgress(0);
      return;
    }

    const stepMs = 40;
    const increment = (stepMs / AUTO_SLIDE_INTERVAL) * 100;

    progressTimerRef.current = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isAutoPlaying, handleNextSlide]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'ar') {
      if (hour < 12) return 'صباح الخير والهدوء';
      if (hour < 18) return 'مساء الروقان والسكينة';
      return 'مساء النور والنجوم';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Tidal depth: LTR starts with sand on left fading to ocean on right; RTL flips
  const shoreDirection = isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r';

  return (
    <section
      id="cinematic-hero-cockpit"
      aria-label="Dahab Cinematic Travel Cockpit & Slider"
      className="relative w-full min-h-[92vh] sm:min-h-[95vh] flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 bg-[var(--bg-canvas)] text-[var(--text-primary)]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC BACKGROUND SCENE — the desert-to-sea meeting point           */}
      {/*    Video sits inside a tidal-gradient frame so sand warms the top edge    */}
      {/*    and ocean cools toward the base, literally showing the convergence.    */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <CinematicVideo
          key={currentScene.id}
          src={currentScene.videoUrl}
          poster={currentScene.posterUrl}
          alt={`Dahab scenery: ${language === 'ar' ? currentScene.labelAr : currentScene.label}`}
          isPlaying={isVideoPlaying}
          muted={isMuted}
          loop={true}
          autoPlay={true}
          playsInline={true}
          className="absolute inset-0 object-cover transition-opacity duration-1000"
          overlayClassName={
            isDark
              ? 'absolute inset-0 opacity-0'
              : 'absolute inset-0 opacity-0'
          }
          showOverlay={false}
        />

        {/* Tidal convergence overlay — desert sand at top melting into ocean depth */}
        <div className={`absolute inset-0 ${shoreDirection} from-[var(--bg-canvas)]/95 via-[var(--bg-canvas)]/55 to-[var(--bg-canvas)]/30`} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)] via-transparent to-[var(--bg-canvas)]/40" aria-hidden="true" />

        {/* Night sky accents for the summit & evening scenes */}
        <div className="absolute top-8 right-10 text-[var(--text-primary)]/30 pointer-events-none" aria-hidden="true">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50 mr-2" />
          <span className="inline-block w-1 h-1 rounded-full bg-white/30 mr-2" />
          <span className="inline-block w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP BAR: location capsule + scene selector                             */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-26 flex flex-col md:flex-row md:items-center gap-4">
        {/* Location capsule (part of the first-viewport story) */}
        <div className="tidal-glass inline-flex items-center gap-3 px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-primary)]">
          <span className="inline-flex items-center gap-2 text-[var(--accent-secondary)]">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            {profile.name
              ? language === 'ar' ? `${getGreeting()}, ${profile.name}` : `${getGreeting()}, ${profile.name}`
              : t('common.welcomeToDahab')
            }
          </span>
          <span className="w-px h-3 bg-[var(--border-subtle)]" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            {language === 'ar' ? currentScene.locationAr : currentScene.location}
          </span>
        </div>

        {/* Scene selector chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 pe-6 sm:pe-0 py-1 md:ms-auto">
          <div role="tablist" aria-label="Cinematic video scene views" className="flex items-center gap-1.5 backdrop-blur-xl p-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)]/80 shadow-lg">
            {CINEMATIC_SCENES.map((scene, idx) => {
              const isSelected = activeSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectScene(idx)}
                  className={`relative px-3.5 min-h-[44px] sm:min-h-0 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap overflow-hidden flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/50'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]/5'
                  }`}
                >
                  <img src={scene.posterUrl} alt={scene.label} className="w-3.5 h-3.5 rounded-full object-cover border border-white/30" />
                  <span className="relative z-10">{language === 'ar' ? scene.labelAr : scene.label}</span>
                  {isSelected && isAutoPlaying && (
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-75"
                      style={{ width: `${slideProgress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            aria-label={isAutoPlaying ? 'Pause automatic slider' : 'Start automatic slider'}
            className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)]/80 hover:bg-[var(--surface-container)] text-[var(--text-primary)] transition-all cursor-pointer shadow-md"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HERO CONTENT — the shoreline thesis                                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 my-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-10">
        {/* Left content column */}
        <div className="max-w-2xl w-full space-y-7">
          <div className="space-y-4 animate-tidal-reveal">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] font-['Outfit',sans-serif] text-[var(--text-primary)]">
              {t('common.whereTheDesertMeets')}{' '}
              <span className="tidal-heading-accent">{t('common.theSea')}</span>
            </h1>
            <p className="text-base sm:text-lg font-normal leading-relaxed max-w-xl text-[var(--text-secondary)]">
              {t('common.discoverAndBookYour')}{' '}
              <strong className="font-semibold text-[var(--text-primary)]">{t('common.dahabSinaiJourney')}</strong>{' '}
              {t('common.discoverAndBookYourPost')}
            </p>
          </div>

          {/* CTAs */}
          <div className="pt-1 flex flex-wrap items-center gap-4">
            <button
              type="button"
              id="hero-start-trip-cta"
              onClick={onOpenPlanner}
              aria-label="Plan Your Dahab Trip"
              className="tidal-cta-primary inline-flex items-center gap-3 text-sm active:scale-95 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-current" aria-hidden="true" />
              <span>{t('common.planYourDahabTrip')}</span>
              <ArrowRight className="w-4 h-4 text-current group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </button>

            <button
              type="button"
              id="hero-browse-experiences-cta"
              onClick={onOpenExplore}
              aria-label="Browse Experiences"
              className="tidal-cta-secondary inline-flex items-center gap-2 text-sm cursor-pointer group"
            >
              <Compass className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>{t('common.browseExperiences')}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span>{t('common.directVerifiedBookings')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)]" />
              <span>{t('common.flexibleCancellation')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{t('common.localBedouinGuides')}</span>
            </span>
          </div>
        </div>

        {/* Right: destination stack as receding tide pools */}
        <div className="w-full lg:max-w-sm flex flex-col gap-1.5 tidal-glass p-4 rounded-3xl text-[var(--text-primary)]">
          <div className="flex items-center justify-between px-2 pb-2.5 border-b border-[var(--border-subtle)] mb-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
              <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="font-['Outfit',sans-serif]">
                {t('common.sinaiIconicDestinations')}
              </span>
            </div>
            <span className="text-[12px] font-bold tabular-nums text-[var(--accent-primary)]">
              {String(activeSceneIndex + 1).padStart(2, '0')}<span className="text-[var(--text-secondary)]">/{String(CINEMATIC_SCENES.length).padStart(2, '0')}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {CINEMATIC_SCENES.map((scene, idx) => {
              const isSelected = activeSceneIndex === idx;
              // Receding depth: rows farther from the shoreline (active scene)
              // sink toward ocean night, reading as tide pools at different depths.
              const depth = Math.min(Math.abs(idx - activeSceneIndex), 2);
              const depthOpacity = isSelected ? 1 : 1 - depth * 0.16;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  aria-pressed={isSelected}
                  aria-label={language === 'ar' ? scene.labelAr : scene.label}
                  style={{ opacity: depthOpacity }}
                  className={`group w-full text-start flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                    isSelected
                      ? 'border border-[var(--accent-primary)]/40 shadow-md'
                      : 'hover:bg-[var(--surface-container)]/50 border border-transparent'
                  } ${isSelected ? 'tidal-gradient-section' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--surface-container)]">
                      <img
                        src={scene.posterUrl}
                        alt={scene.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {isSelected && (
                        <span className="absolute inset-0 ring-1 ring-inset ring-white/20" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {language === 'ar' ? scene.labelAr : scene.label}
                      </span>
                      <span className="text-[12px] truncate text-[var(--text-secondary)] opacity-70">
                        {language === 'ar' ? scene.locationAr : scene.location}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                    isSelected ? 'tidal-badge-ocean' : 'text-[var(--text-secondary)]'
                  }`}>
                    {language === 'ar' ? scene.shortTagAr : scene.shortTag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM CONDITIONS — living weather strip                                 */}
      {/* ========================================================================= */}
      <div className="relative z-20 border-t border-[var(--border-subtle)] py-3.5 px-4 sm:px-6 lg:px-8 backdrop-blur-2xl bg-[var(--surface-card)]/75 text-[var(--text-primary)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-container)]/50 backdrop-blur-sm">
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span className="font-semibold text-[var(--text-primary)]">
                {liveConditions?.airTemperatureC != null ? `${Math.round(liveConditions.airTemperatureC)}°C` : (language === 'ar' ? '—' : '—')}
              </span>
              <span className="text-[var(--text-secondary)]">
                {liveConditions?.conditionAr || liveConditions?.condition || (t('common.air'))}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-container)]/50 backdrop-blur-sm">
              <Waves className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span className="font-semibold text-[var(--text-primary)]">
                {liveConditions?.waterTemperatureC != null ? `${Math.round(liveConditions.waterTemperatureC)}°C` : (language === 'ar' ? '—' : '—')}
              </span>
              <span className="text-[var(--text-secondary)]">{t('common.waterTemp')}</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-[var(--text-secondary)]">
              <span>{t('common.sunset')}</span>
              <span className="font-semibold text-[var(--accent-secondary)]">
                {liveConditions?.astronomy?.sunset
                  ? new Date(liveConditions.astronomy.sunset).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })
                  : (t('common._item_'))}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex lg:hidden items-center gap-1">
              <button
                type="button"
                onClick={isRTL ? handleNextSlide : handlePrevSlide}
                aria-label="Previous"
                className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border border-[var(--border-subtle)] bg-[var(--surface-card)]/60 hover:bg-[var(--surface-container)] text-[var(--text-primary)]"
              >
                {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={isRTL ? handlePrevSlide : handleNextSlide}
                aria-label="Next"
                className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border border-[var(--border-subtle)] bg-[var(--surface-card)]/60 hover:bg-[var(--surface-container)] text-[var(--text-primary)]"
              >
                {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            <span className="tidal-glass inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px]">
              <span className={`w-1.5 h-1.5 rounded-full ${liveConditions ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} aria-hidden="true" />
              {t('common.liveSeaWeather')}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. HERO VIDEO MODAL PLAYER                                                */}
      {/* ========================================================================= */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hero Scene Video Player"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0E171A] text-stone-100 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-['Outfit',sans-serif]">
                    {language === 'ar' ? currentScene.labelAr : currentScene.label} · 4K Ultra HD
                  </h4>
                  <p className="text-[12px] text-stone-400">
                    {language === 'ar' ? currentScene.locationAr : currentScene.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[var(--surface-card)]/10 hover:bg-[var(--surface-card)]/20 text-white flex items-center justify-center transition-all cursor-pointer border border-[var(--border-subtle)]"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${currentScene.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3&fs=1`}
                title={language === 'ar' ? currentScene.labelAr : currentScene.label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            {/*
              Video modal close via the X button only — clicking the backdrop
              also works. The film-scene call to open it lives inside the
              CinematicVideo control surface which we suppress in this layout;
              left intact for a11y/API compatibility.
            */}
          </div>
        </div>
      )}
    </section>
  );
};
