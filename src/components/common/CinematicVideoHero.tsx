import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Compass,
  Luggage,
  UtensilsCrossed,
  Sun,
  Waves,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Film,
  X,
  Tv,
  Share2,
  Image as ImageIcon,
  ZoomIn,
  Eye,
  Maximize2,
  Camera
} from 'lucide-react';
import { TravelerProfile } from '../../types';
import { CinematicVideo } from './CinematicVideo';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

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
    posterUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000&auto=format&fit=crop',
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
    posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000&auto=format&fit=crop',
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
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
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
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop',
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
    posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000&auto=format&fit=crop',
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
    conditionsAr: 'أجواء جبلية منعشة ١٢°م · أفق لا نهائي',
  },
];

const AUTO_SLIDE_INTERVAL = 6000; // 6 seconds

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
  const { language, isRTL } = useLanguage();
  const { theme, isDark } = useTheme();
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [slideProgress, setSlideProgress] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleOpenPhotoLightbox = (index?: number) => {
    setLightboxIndex(typeof index === 'number' ? index : activeSceneIndex);
    setIsPhotoLightboxOpen(true);
  };

  // Progress Bar & Auto-sliding loop
  useEffect(() => {
    if (!isAutoPlaying) {
      setSlideProgress(0);
      return;
    }

    const stepMs = 50;
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

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swiped Left
        if (isRTL) handlePrevSlide();
        else handleNextSlide();
      } else {
        // Swiped Right
        if (isRTL) handleNextSlide();
        else handlePrevSlide();
      }
    }
    setTouchStartX(null);
  };

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

  return (
    <section
      id="cinematic-hero-cockpit"
      aria-label="Dahab Cinematic Travel Cockpit & Slider"
      className="relative w-full min-h-[92vh] sm:min-h-[95vh] flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 bg-[var(--bg-canvas)] text-[var(--text-primary)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC BACKGROUND VIDEO / POSTER CONTAINER WITH FROSTED GLASS TINTS */}
      {/* ========================================================================= */}
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
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        overlayClassName={
          isDark
            ? 'absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)] via-[var(--bg-canvas)]/80 to-[var(--bg-canvas)]/45 backdrop-blur-[1px]'
            : 'absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)] via-[var(--bg-canvas)]/75 to-[var(--bg-canvas)]/30 backdrop-blur-[1px]'
        }
        showOverlay={true}
      />

      {/*
        Reading scrim.

        The vertical overlay alone blends the photo into the page but does not
        guarantee the headline is readable: with the scenery layer finally
        rendering, "رحلتك في دهب" lands on a bright reef in the light themes.
        This second pass is anchored to the text column — strongest behind the
        copy, clear on the far side so the photograph still reads as a photo.
        It is painted in the canvas colour, so it darkens for light text in the
        dark themes and lightens for dark text in the light ones.
      */}
      <div
        className={`hidden md:block absolute inset-0 z-0 pointer-events-none ${
          isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
        } from-[var(--bg-canvas)] via-[var(--bg-canvas)]/55 to-transparent`}
        aria-hidden="true"
      />

      {/* Radiant Sinai Ambient Light Blooms */}
      <div className="absolute top-1/4 right-10 w-[30rem] h-[30rem] bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/3 left-10 w-[26rem] h-[26rem] bg-[var(--accent-secondary)]/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* 2. TOP HERO SLIDER BAR (MINIMAL PROGRESS & SCENE SELECTION)              */}
      {/* ========================================================================= */}
      {/* The location + ambient-conditions capsule that used to open this row
          was removed; the scene selector keeps its original end alignment
          rather than sliding across now that it is the only child. */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-26 flex flex-col md:flex-row md:items-center md:justify-end gap-4">

        {/*
          Right: Scene Selector Slider Tabs & Playback Toggle.
          The row scrolls horizontally on mobile but `no-scrollbar` hides the
          only cue that it does, so the chips simply looked cut off at the screen
          edge. snap scrolling plus a trailing gutter makes the overflow legible.
          Tabs are also given a 44px touch height on mobile (they were 28px).
        */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 pe-6 sm:pe-0 py-1">
          <div 
            role="tablist" 
            aria-label="Cinematic video scene views"
            className="flex items-center gap-1.5 backdrop-blur-xl p-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)]/80 shadow-lg"
          >
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
                      ? // Tinted rather than a solid accent fill: this is a
                        // "which scene is playing" indicator sitting in the same
                        // viewport as the hero's primary CTA, and a solid fill
                        // made the two compete for the same attention.
                        'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/50'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                >
                  <img
                    src={scene.posterUrl}
                    alt={scene.label}
                    className="w-3.5 h-3.5 rounded-full object-cover border border-white/30"
                  />
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
            title={isAutoPlaying ? (language === 'ar' ? 'إيقاف التبديل التلقائي' : 'Pause Auto-slide') : (language === 'ar' ? 'تشغيل التبديل التلقائي' : 'Play Auto-slide')}
            className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)]/80 hover:bg-[var(--surface-container)] text-[var(--text-primary)] transition-all cursor-pointer shadow-md"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. HERO CONTENT: CLEAN TYPOGRAPHY, SINGLE PRIMARY CTA & REFINED STACK     */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 my-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-10">
        
        {/* Left / Center Content Column */}
        <div className="max-w-2xl w-full space-y-6">
          
          {/*
            Eyebrow carries the category for a first-time visitor, and the
            personal greeting for a returning one. The greeting used to BE the
            <h1> — the largest, most prominent text on the page said
            "Good afternoon" and the actual value proposition was demoted to
            body copy, so a first-time visitor's most important question
            ("what is this?") was answered by the smallest text in the block.
          */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[var(--accent-primary)]" aria-hidden="true" />
            <span className="text-xs font-bold tracking-widest uppercase font-['Outfit',sans-serif] text-[var(--accent-primary)]">
              {profile.name
                ? `${getGreeting()}, ${profile.name}`
                : language === 'ar' ? 'رحلات وتجارب سيناء الأصيلة' : 'Authentic Sinai Travel Planner'}
            </span>
          </div>

          {/* Value proposition as the page's primary heading. */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.12] font-['Outfit',sans-serif] text-[var(--text-primary)]">
              {language === 'ar' ? (
                <>
                  رحلتك في دهب،{' '}
                  <span className="font-bold text-[var(--accent-secondary)]">متفصّلة على مزاجك</span>
                </>
              ) : (
                <>
                  Your Dahab trip,{' '}
                  <span className="font-bold text-[var(--accent-secondary)]">built around you</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg font-normal leading-relaxed max-w-xl text-[var(--text-secondary)]">
              {language === 'ar' ? (
                <>
                  خطط لرحلتك المثالية في <strong className="font-semibold text-[var(--text-primary)]">دهب وجنوب سيناء</strong> مع برامج متكاملة، حجوزات مباشرة، ومعلومات بحرية وطقس لحظية.
                </>
              ) : (
                <>
                  Discover and book your tailored <strong className="font-semibold text-[var(--text-primary)]">Dahab & Sinai journey</strong> with verified handcrafted itineraries, direct local bookings, and live sea intelligence.
                </>
              )}
            </p>
          </div>

          {/* Clean Primary & Secondary CTA Block (Clear Visual Hierarchy) */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* ONE Clear Primary CTA Button */}
            <button
              type="button"
              id="hero-start-trip-cta"
              onClick={onOpenPlanner}
              aria-label="Plan Your Dahab Trip"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] active:scale-95 transition-all shadow-xl cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-current" aria-hidden="true" />
              <span>{language === 'ar' ? 'خطط لرحلتك في دهب' : 'Plan Your Dahab Trip'}</span>
              <ArrowRight className="w-4 h-4 text-current group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </button>

            {/* Subtle Secondary Outline Action */}
            <button
              type="button"
              id="hero-browse-experiences-cta"
              onClick={onOpenExplore}
              aria-label="Browse Experiences"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer shadow-md bg-[var(--surface-card)] hover:bg-[var(--surface-container)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
            >
              <Compass className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>{language === 'ar' ? 'استكشف التجارب والبرامج' : 'Browse Experiences'}</span>
            </button>
          </div>

          {/* Quick Verified Highlights Pill */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span>{language === 'ar' ? 'حجوزات مباشرة معتمدة' : 'Direct Verified Bookings'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)]" />
              <span>{language === 'ar' ? 'إلغاء مرن ودفع آمن' : 'Flexible Cancellation'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{language === 'ar' ? 'إرشاد بدوي محلي' : 'Local Bedouin Guides'}</span>
            </span>
          </div>

        </div>

        {/* Right Side: Re-imagined Clean Single Stack of Sinai Highlights */}
        <div className="w-full lg:max-w-sm flex flex-col gap-3 backdrop-blur-xl p-5 rounded-3xl border border-[var(--border-subtle)] shadow-2xl bg-[var(--surface-card)]/90 text-[var(--text-primary)]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
              <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="font-['Outfit',sans-serif]">
                {language === 'ar' ? 'أبرز وجهات دهب المميزة' : 'Sinai Iconic Destinations'}
              </span>
            </div>
            <span className="text-[12px] font-mono text-[var(--accent-primary)]">
              0{activeSceneIndex + 1}/0{CINEMATIC_SCENES.length}
            </span>
          </div>

          {/* Clean Vertical Stack */}
          <div className="flex flex-col gap-2">
            {CINEMATIC_SCENES.map((scene, idx) => {
              const isSelected = activeSceneIndex === idx;
              // These five destination rows are a primary discovery affordance in
              // the first viewport. They were clickable <div>s, so they could not
              // be reached with Tab, did not respond to Enter/Space, and were not
              // announced as interactive. As real buttons with aria-pressed they
              // keep the identical appearance and gain keyboard + screen-reader
              // access.
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  aria-pressed={isSelected}
                  aria-label={language === 'ar' ? scene.labelAr : scene.label}
                  className={`group w-full text-start flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                    isSelected
                      ? 'bg-[var(--surface-container)] border border-[var(--accent-primary)]/50 shadow-md'
                      : 'hover:bg-[var(--surface-container)]/60 border border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--surface-container)]">
                      <img
                        src={scene.posterUrl}
                        alt={scene.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-bold truncate ${
                        isSelected
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)]'
                      }`}>
                        {language === 'ar' ? scene.labelAr : scene.label}
                      </span>
                      <span className="text-[12px] truncate text-[var(--text-secondary)] opacity-70">
                        {language === 'ar' ? scene.locationAr : scene.location}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    isSelected
                      ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)]'
                  }`}>
                    {idx === 0 ? 'Reef' : idx === 1 ? 'Safari' : idx === 2 ? 'Lagoon' : idx === 3 ? 'Sunset' : 'Summit'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. SLIDER DOTS & NUMERIC COUNTER                                          */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex items-center justify-center gap-2 pb-2">
        <span className="text-[12px] font-bold font-mono text-[var(--accent-primary)]">
          0{activeSceneIndex + 1}
        </span>
        <div className="flex items-center gap-1.5">
          {CINEMATIC_SCENES.map((_, idx) => (
            /* The button used to BE the 8x6px dot. The bar is now an inner
               span so the control carries a real touch area without changing
               how the indicator looks. */
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectScene(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={activeSceneIndex === idx ? 'true' : undefined}
              className="flex items-center justify-center py-2.5 -my-2.5 px-2 cursor-pointer"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${
                  activeSceneIndex === idx
                    ? 'w-8 bg-[var(--accent-primary)] shadow-xs'
                    : 'w-2 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/60'
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-[12px] font-bold font-mono text-[var(--text-secondary)]">
          0{CINEMATIC_SCENES.length}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CONDITIONS QUICK-RADAR STRIP (FROSTED GLASS)                    */}
      {/* ========================================================================= */}
      <div className="relative z-20 border-t border-[var(--border-subtle)] py-3.5 px-4 sm:px-6 lg:px-8 backdrop-blur-2xl bg-[var(--surface-card)]/80 text-[var(--text-primary)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Weather & Sea Indicators */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-container)]/50 backdrop-blur-sm">
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span className="font-semibold text-[var(--text-primary)]">28°C</span>
              <span className="text-[var(--text-secondary)]">{language === 'ar' ? 'مشمس صافٍ' : 'Sunny'}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-container)]/50 backdrop-blur-sm">
              <Waves className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span className="font-semibold text-[var(--text-primary)]">24°C</span>
              <span className="text-[var(--text-secondary)]">{language === 'ar' ? 'حرارة البحر' : 'Water Temp'}</span>
            </div>

            {/* Removed: a "25m+ Peak · Coral Visibility" chip. Nothing measures
                underwater visibility here — no buoy and no dive-centre feed —
                and it sat beside the air and water temperatures, which are
                real readings, so it read as one too. */}

            <div className="hidden md:flex items-center gap-1.5 text-[var(--text-secondary)]">
              <span>{language === 'ar' ? 'الغروب:' : 'Sunset:'}</span>
              <span className="font-semibold text-[var(--accent-secondary)]">05:42 PM ({language === 'ar' ? 'خلف جبال سيناء' : 'Sinai Peaks'})</span>
            </div>
          </div>

          {/* Quick link & Mobile Prev/Next */}
          <div className="flex items-center gap-3">
            <div className="flex lg:hidden items-center gap-1">
              <button
                type="button"
                onClick={isRTL ? handleNextSlide : handlePrevSlide}
                aria-label="Previous"
                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border ${
                  isDark ? 'bg-white/15 hover:bg-white/25 text-white border-white/20' : 'bg-black/5 hover:bg-black/10 text-[#122420] border-black/10'
                }`}
              >
                {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={isRTL ? handlePrevSlide : handleNextSlide}
                aria-label="Next"
                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border ${
                  isDark ? 'bg-white/15 hover:bg-white/25 text-white border-white/20' : 'bg-black/5 hover:bg-black/10 text-[#122420] border-black/10'
                }`}
              >
                {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className={`text-[12px] backdrop-blur-sm px-3 py-1 rounded-full border ${
              isDark ? 'text-[#E7D3AE] bg-white/10 border-white/15' : 'text-[#4A635D] bg-black/5 border-black/10'
            }`}>
              {language === 'ar' ? 'رقم الحجز:' : 'Active Booking:'} <strong className={`font-medium ${isDark ? 'text-white' : 'text-[#122420]'}`}>#DHB-2026-OCT-894</strong>
            </span>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. IMMERSIVE HERO VIDEO MODAL PLAYER                                      */}
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
            {/* Top Modal Bar */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
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
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Embed / Responsive 16:9 Viewport */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${currentScene.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3&fs=1`}
                title={language === 'ar' ? currentScene.labelAr : currentScene.label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Bottom Modal Info & Scene Switcher */}
            <div className="p-4 sm:p-5 bg-[#062C35] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-stone-300 font-normal">
                  {language === 'ar' ? currentScene.subLabelAr : currentScene.subLabel}
                </p>
                <span className="text-[12px] text-[#52C4B7] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#20A89A]" />
                  {language === 'ar' ? currentScene.ambientTagAr : currentScene.ambientTag}
                </span>
              </div>

              {/* Other scenes quick selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {CINEMATIC_SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => handleSelectScene(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeSceneIndex === idx
                        ? 'bg-[#0F6F78] text-white shadow-sm border border-[#20A89A]/40'
                        : 'bg-white/10 text-[#E7D3AE] hover:bg-white/15'
                    }`}
                  >
                    {language === 'ar' ? scene.labelAr : scene.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. FULLSCREEN HIGH-RES 4K PHOTO LIGHTBOX MODAL                            */}
      {/* ========================================================================= */}
      {isPhotoLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dahab 4K Photo Lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsPhotoLightboxOpen(false)}
        >
          <div
            className="relative max-w-6xl w-full bg-[#04171D] text-stone-100 rounded-3xl overflow-hidden border border-[#20A89A]/30 shadow-2xl flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-[#52C4B7]" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-['Outfit',sans-serif]">
                    {language === 'ar' ? CINEMATIC_SCENES[lightboxIndex].labelAr : CINEMATIC_SCENES[lightboxIndex].label} · 4K Ultra HD Photo
                  </h4>
                  <p className="text-xs text-[#E7D3AE]/80">
                    {language === 'ar' ? CINEMATIC_SCENES[lightboxIndex].locationAr : CINEMATIC_SCENES[lightboxIndex].location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#E7D3AE] font-mono px-2.5 py-1 rounded-full bg-white/10">
                  {lightboxIndex + 1} / {CINEMATIC_SCENES.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPhotoLightboxOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                  aria-label="Close photo lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Main Image Display */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={CINEMATIC_SCENES[lightboxIndex].posterUrl}
                alt={CINEMATIC_SCENES[lightboxIndex].label}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next Buttons */}
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev - 1 + CINEMATIC_SCENES.length) % CINEMATIC_SCENES.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev + 1) % CINEMATIC_SCENES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Thumbnails Rail */}
            <div className="p-3 sm:p-4 bg-[#062C35] flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                {CINEMATIC_SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setLightboxIndex(idx);
                      handleSelectScene(idx);
                    }}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
                      lightboxIndex === idx
                        ? 'ring-2 ring-[#20A89A] scale-105 opacity-100 shadow-md'
                        : 'opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img src={scene.posterUrl} alt={scene.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="hidden sm:block text-right">
                <p className="text-xs text-stone-300">
                  {language === 'ar' ? CINEMATIC_SCENES[lightboxIndex].subLabelAr : CINEMATIC_SCENES[lightboxIndex].subLabel}
                </p>
                <span className="text-[12px] text-[#52C4B7]">
                  {language === 'ar' ? CINEMATIC_SCENES[lightboxIndex].ambientTagAr : CINEMATIC_SCENES[lightboxIndex].ambientTag}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

