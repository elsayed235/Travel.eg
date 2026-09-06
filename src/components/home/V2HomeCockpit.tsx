import React, { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import {
  Waves,
  Compass,
  UtensilsCrossed,
  LifeBuoy,
  ChevronUp
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { CinematicVideoHero } from '../common/CinematicVideoHero';
import { TripEntrySection } from './TripEntrySection';
import { HomeSectionNav, HomeSection } from './HomeSectionNav';
import { TidalSeasonStrip } from '../common/TidalSeasonStrip';
import { CuratedStoriesRail } from '../common/CuratedStoriesRail';
import { DahabMicroExperiences } from '../common/DahabMicroExperiences';
import { DahabLandmarksBento } from './DahabLandmarksBento';
import { DahabPhotoShowcase } from '../gallery/DahabPhotoShowcase';
import { useResearchOverview } from '../../hooks/useResearchOverview';
import { FinalCTA } from '../FinalCTA';
import { resolveHomepageComposition } from '../../services/homepageCompositionResolver';

// Tripadvisor-style "Plan with AI" planning chat on the hero. Kept lazy so the
// homepage critical path stays thin — the composer only arrives as the hero
// itself is being read.
const PlanWithAiWidget = lazy(() => import('./PlanWithAiWidget').then((m) => ({ default: m.default })));

const HOME_SECTIONS: HomeSection[] = [
  { id: 'cinematic-hero-cockpit', label: 'Overview', labelAr: 'نظرة عامة' },
  { id: 'trip-planning', label: 'Plan your trip', labelAr: 'خطط رحلتك' },
  { id: 'curated-experiences', label: 'Experiences', labelAr: 'التجارب' },
  { id: 'sinai-landmarks-bento', label: 'Landmarks', labelAr: 'المعالم' },
  { id: 'dahab-gallery-showcase', label: 'Gallery', labelAr: 'معرض الصور' },
  { id: 'final-cta-section', label: 'Get started', labelAr: 'ابدأ' }
];

interface V2HomeCockpitProps {
  onOpenQuickBook: () => void;
}

export const V2HomeCockpit: React.FC<V2HomeCockpitProps> = ({ onOpenQuickBook }) => {
  const {
    profile,
    tripDays,
    bookings,
    activeFoodOrder,
    navigateTo,
    activePersonaMode,
    journeyStage,
    travelerContext,
    nextBestActions,
    transferTracking,
    user,
    isSignedIn
  } = useTrip();

  const { t, language, isRTL } = useLanguage();

  const research = useResearchOverview();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
      setShowBackToTop(scrollTop > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const composition = useMemo(() => {
    return resolveHomepageComposition({
      journeyStage,
      profile,
      tripDays,
      bookings,
      transferTracking,
      travelerContext,
      nextBestActions,
      isAuthenticated: isSignedIn
    });
  }, [journeyStage, profile, tripDays, bookings, transferTracking, travelerContext, nextBestActions, isSignedIn]);

  return (
    <div
      className="w-full pb-28 md:pb-20 transition-colors duration-300 bg-[var(--bg-canvas)] text-[var(--text-primary)]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Tidal scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent" aria-hidden="true">
        <div
          className="h-full transition-[width] duration-150 ease-out rounded-full"
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, #E7D3AE, #20A89A, #0F6F78)`,
            boxShadow: '0 0 8px rgba(32,168,154,0.4)',
          }}
        />
      </div>

      {/* Back to Top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('home.backToTop')}
        className={`fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-xl ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5 text-[var(--text-primary)]" />
      </button>

      {/* Section wayfinder */}
      <HomeSectionNav sections={HOME_SECTIONS} />

      {/* Hidden h1 for compositions that suppress the hero */}
      {!composition.flags.showHero && (
        <h1 className="sr-only">
          {t('home.yourDahabTrip')}
        </h1>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO — the first viewport thesis                                      */}
      {/* ========================================================================= */}
      {composition.flags.showHero && (
        <CinematicVideoHero
          profile={profile}
          onOpenMyTrip={() => navigateTo('/my-trip', { dayId: 2 })}
          onOpenExplore={() => navigateTo('/explore')}
          onOpenFood={() => navigateTo('/food')}
          onOpenPlanner={() => {
            const el = document.getElementById('trip-planning');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              navigateTo('/trip-builder');
            }
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 1b. PLAN WITH AI — Tripadvisor-style planning chat over the hero         */}
      {/* ========================================================================= */}
      {composition.flags.showHero && (
        <Suspense fallback={null}>
          <PlanWithAiWidget />
        </Suspense>
      )}

      {/* ========================================================================= */}
      {/* 2. SEASON STRIP — lightweight seasonal context                            */}
      {/* ========================================================================= */}
      {research && <TidalSeasonStrip overview={research} />}

      {/* ========================================================================= */}
      {/* 3. TRIP PLANNING — the core conversion section                            */}
      {/* ========================================================================= */}
      {composition.flags.showTripEntry && (
        <TripEntrySection
          onStartCustomPlanner={() => navigateTo('/trip-builder')}
          onOpenItinerary={() => navigateTo('/my-trip', { dayId: 2 })}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. CURATED EXPERIENCES — stories + priced activities                      */}
      {/* ========================================================================= */}
      <CuratedStoriesRail />

      {research && (
        <DahabMicroExperiences overview={research} onPlanClick={() => navigateTo('/trip-builder')} />
      )}

      {/* ========================================================================= */}
      {/* 4b. 2026 BENTO ATLAS: NATURAL LANDMARKS & WILDERNESS EXPEDITIONS          */}
      {/* ========================================================================= */}
      {research && (
        <DahabLandmarksBento
          overview={research}
          onExploreLandmark={() => navigateTo('/explore')}
        />
      )}

      {/* ========================================================================= */}
      {/* 4c. AUTHENTIC DAHAB PHOTO SHOWCASE & LIGHTBOX                             */}
      {/* ========================================================================= */}
      <DahabPhotoShowcase />

      {/* ========================================================================= */}
      {/* 5. QUICK SERVICES — 2026 Living Travel Bento Cockpit                      */}
      {/* ========================================================================= */}
      <section
        aria-label="Dahab Quick Actions"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="max-w-3xl">
          <p className="text-sm text-[var(--text-secondary)]">{t('home.quickServices.eyebrow')}</p>
          <h2 className="tidal-heading text-3xl tracking-tight text-[var(--text-primary)] mt-2">
            {t('home.quickServices.title')}
          </h2>
          <div
            className="mt-4 h-[2px] w-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #E7D3AE, #20A89A 45%, #0F6F78)' }}
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {/* Dive */}
          <button
            type="button"
            onClick={() => onOpenQuickBook()}
            className="group relative rounded-3xl overflow-hidden p-6 min-h-[220px] flex flex-col justify-between border border-white/20 dark:border-white/10 hover:border-[var(--accent-primary)]/60 transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98] text-start cursor-pointer ring-1 ring-black/5"
          >
            <img
              src="/images/attractions/blue-hole.jpg"
              alt="Diving"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/25" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/25 backdrop-blur-md border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-sm">
                <Waves className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-200 bg-teal-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-teal-400/30">
                100m+ Depth
              </span>
            </div>
            <div className="relative z-10">
              <span className="block font-serif text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                {t('home.quickServices.dive.title')}
              </span>
              <span className="block text-xs font-normal leading-relaxed text-white/80 mt-1 line-clamp-2">
                {t('home.quickServices.dive.desc')}
              </span>
            </div>
          </button>

          {/* Food */}
          <button
            type="button"
            onClick={() => navigateTo('/food')}
            className="group relative rounded-3xl overflow-hidden p-6 min-h-[220px] flex flex-col justify-between border border-white/20 dark:border-white/10 hover:border-[var(--accent-secondary)]/60 transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98] text-start cursor-pointer ring-1 ring-black/5"
          >
            <img
              src="/images/restaurants/ali-baba-restaurant.jpg"
              alt="Food & Dining"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/25" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/25 backdrop-blur-md border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-sm">
                <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200 bg-amber-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30">
                Local Catch
              </span>
            </div>
            <div className="relative z-10">
              <span className="block font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                {t('home.quickServices.food.title')}
              </span>
              <span className="block text-xs font-normal leading-relaxed text-white/80 mt-1 line-clamp-2">
                {t('home.quickServices.food.desc')}
              </span>
            </div>
          </button>

          {/* Explore */}
          <button
            type="button"
            onClick={() => navigateTo('/explore')}
            className="group relative rounded-3xl overflow-hidden p-6 min-h-[220px] flex flex-col justify-between border border-white/20 dark:border-white/10 hover:border-emerald-500/60 transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98] text-start cursor-pointer ring-1 ring-black/5"
          >
            <img
              src="/images/attractions/bouldering-wadi-gnai.jpg"
              alt="Explore Dahab"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/25" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/25 backdrop-blur-md border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-sm">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 bg-emerald-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/30">
                Sinai Canyons
              </span>
            </div>
            <div className="relative z-10">
              <span className="block font-serif text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t('home.exploreDahab')}
              </span>
              <span className="block text-xs font-normal leading-relaxed text-white/80 mt-1 line-clamp-2">
                {t('home.discoverLandmarksActivitiesAnd')}
              </span>
            </div>
          </button>

          {/* Support */}
          <button
            type="button"
            onClick={() => navigateTo('/help')}
            className="group relative rounded-3xl overflow-hidden p-6 min-h-[220px] flex flex-col justify-between border border-white/20 dark:border-white/10 hover:border-sky-500/60 transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98] text-start cursor-pointer ring-1 ring-black/5"
          >
            <img
              src="/images/hero/camels-beach.jpg"
              alt="Help & Support"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/25" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/25 backdrop-blur-md border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-sm">
                <LifeBuoy className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200 bg-sky-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-sky-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                24/7 On-Call
              </span>
            </div>
            <div className="relative z-10">
              <span className="block font-serif text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                {t('home.quickServices.help.title')}
              </span>
              <span className="block text-xs font-normal leading-relaxed text-white/80 mt-1 line-clamp-2">
                {t('home.quickServices.help.desc')}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FINAL CTA — closing conversion moment                                 */}
      {/* ========================================================================= */}
      {composition.mode === 'PRE_BOOKING' && (
        <FinalCTA
          onPlanTripClick={() => {
            const el = document.getElementById('trip-planning');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else navigateTo('/trip-builder');
          }}
          onExploreClick={() => navigateTo('/explore')}
        />
      )}

      {/* ========================================================================= */}
      {/* 7. FOOTER — tidal close                                                   */}
      {/* ========================================================================= */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-[var(--border-subtle)]" role="contentinfo">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E7D3AE] via-[#20A89A] to-[#0F6F78] text-[var(--bg-canvas)] flex items-center justify-center text-sm font-bold shadow-md" aria-hidden="true">
                D
              </div>
              <span className="font-serif font-bold tracking-wide text-[var(--text-primary)]">
                {t('brand.name')}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">· {t('brand.tagline')}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('home.footer.tagline')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[var(--text-secondary)]">
            <button type="button" onClick={() => navigateTo('/my-trip')} className="cursor-pointer hover:text-[var(--text-primary)] transition-colors">
              {t('nav.myTrip')}
            </button>
            <button type="button" onClick={() => navigateTo('/explore')} className="cursor-pointer hover:text-[var(--text-primary)] transition-colors">
              {t('home.explore')}
            </button>
            <button type="button" onClick={() => navigateTo('/food')} className="cursor-pointer hover:text-[var(--text-primary)] transition-colors">
              {t('food.title')}
            </button>
            <button type="button" onClick={() => navigateTo('/help')} className="cursor-pointer hover:text-[var(--text-primary)] transition-colors">
              {t('nav.help')}
            </button>
          </div>
        </div>

        <div className="py-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-secondary)]">
          <span>{t('home.footer.copyright')}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            {t('home.footer.hyperbaricHotline')}: <strong className="font-semibold text-[var(--text-primary)]">+20 69 364 0400</strong>
          </span>
        </div>
      </footer>
    </div>
  );
};
