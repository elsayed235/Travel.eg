import React, { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import {
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
import { useHomepageContent } from '../../hooks/useCMSContent';
import { FinalCTA } from '../FinalCTA';
import { resolveHomepageComposition } from '../../services/homepageCompositionResolver';
import { SectionReveal } from '../common/SectionReveal';
import { HomeLiveTicker } from './HomeLiveTicker';
import { HomeStatsBand } from './HomeStatsBand';
import { HomeMarquee } from './HomeMarquee';
import { DahabFooter } from './DahabFooter';

// Tripadvisor-style "Plan with AI" planning chat on the hero. Kept lazy so the
// homepage critical path stays thin — the composer only arrives as the hero
// itself is being read.
const PlanWithAiWidget = lazy(() => import('./PlanWithAiWidget').then((m) => ({ default: m.default })));
// 2026 essence bento (dive/food/explore/stays/help mosaic). Lazy: it replaces
// the old inline quick-services grid and only needs to exist by the time the
// reader scrolls past the landmarks.
const HomeEssenceBento = lazy(() => import('./HomeEssenceBento').then((m) => ({ default: m.HomeEssenceBento })));

const HOME_SECTIONS: HomeSection[] = [
  { id: 'cinematic-hero-cockpit', label: 'Overview', labelAr: 'نظرة عامة' },
  // ids must match the real DOM ids of the rendered sections — the wayfinder
  // drops entries whose element is not in the document.
  { id: 'how-do-you-want-to-experience-dahab', label: 'Plan your trip', labelAr: 'خطط رحلتك' },
  { id: 'curated-stories-editorial-rail', label: 'Experiences', labelAr: 'التجارب' },
  { id: 'sinai-landmarks-bento', label: 'Landmarks', labelAr: 'المعالم' },
  { id: 'dahab-gallery-showcase', label: 'Gallery', labelAr: 'معرض الصور' },
  { id: 'dahab-essence-bento', label: 'Essentials', labelAr: 'الأساسيات' },
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

  // CMS-authored homepage sections (dashboard → Homepage tab). The compiled
  // copy is the fallback inside each component, so an unreachable CMS changes
  // nothing — and an editor can flip a section's visibility flag to hide it.
  const { data: homepageContent } = useHomepageContent();
  const homepageSections = homepageContent?.sections ?? [];
  const statsSection = homepageSections.find(s => s.section_key === 'stats') ?? null;
  const marqueeSection = homepageSections.find(s => s.section_key === 'marquee') ?? null;
  const essenceSection = homepageSections.find(s => s.section_key === 'essence') ?? null;
  const tickerSection = homepageSections.find(s => s.section_key === 'ticker') ?? null;
  const seasonSection = homepageSections.find(s => s.section_key === 'season') ?? null;
  const tripEntrySection = homepageSections.find(s => s.section_key === 'trip_entry') ?? null;
  const storiesSection = homepageSections.find(s => s.section_key === 'stories') ?? null;
  const microSection = homepageSections.find(s => s.section_key === 'micro') ?? null;
  const landmarksSection = homepageSections.find(s => s.section_key === 'landmarks') ?? null;
  const gallerySection = homepageSections.find(s => s.section_key === 'gallery') ?? null;
  const finalCtaSection = homepageSections.find(s => s.section_key === 'final_cta') ?? null;
  const footerSection = homepageSections.find(s => s.section_key === 'footer') ?? null;

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
      {/* Chart progress rail — night ink plotted through firelight into live teal */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent" aria-hidden="true">
        <div
          className="h-full transition-[width] duration-150 ease-out rounded-full"
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, #1B2452, #E8A33D, #1B9A8B)`,
            boxShadow: '0 0 8px rgba(232,163,61,0.45)',
          }}
        />
      </div>

      {/* Back to Top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('home.backToTop')}
        className={`fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-lg flex items-center justify-center transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300 cursor-pointer hover:scale-110 hover:shadow-xl ${
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
          cmsHero={homepageContent?.hero ?? null}
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
      {/* Rendered in every composition: the returning-traveler variant used to
          hide it behind the hero flag, so a traveler with a saved trip — the
          person most likely to plan the next one — lost the primary planning
          entry and QA could not see their own edits. */}
      <Suspense fallback={null}>
        <PlanWithAiWidget />
      </Suspense>

      {/* ========================================================================= */}
      {/* 1c. LIVE TICKER — "Dahab right now" band under the hero                   */}
      {/* ========================================================================= */}
      <HomeLiveTicker id="dahab-live-ticker" cmsSection={tickerSection} />

      {/* ========================================================================= */}
      {/* 1d. DEPTH SOUNDINGS — the coast in numbers (animated counters)            */}
      {/* ========================================================================= */}
      <HomeStatsBand cmsSection={statsSection} />

      {/* ========================================================================= */}
      {/* 2. SEASON STRIP — lightweight seasonal context                            */}
      {/* ========================================================================= */}
      {research && <TidalSeasonStrip overview={research} cmsSection={seasonSection} />}

      {/* ========================================================================= */}
      {/* 3. TRIP PLANNING — the core conversion section                            */}
      {/* ========================================================================= */}
      {composition.flags.showTripEntry && (
        <TripEntrySection
          onStartCustomPlanner={() => navigateTo('/trip-builder')}
          onOpenItinerary={() => navigateTo('/my-trip', { dayId: 2 })}
          cmsSection={tripEntrySection}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. CURATED EXPERIENCES — stories + priced activities, revealed on scroll  */}
      {/* ========================================================================= */}
      <SectionReveal>
        <CuratedStoriesRail cmsSection={storiesSection} />
      </SectionReveal>

      <HomeMarquee cmsSection={marqueeSection} />

      {research && (
        <SectionReveal>
          <DahabMicroExperiences overview={research} onPlanClick={() => navigateTo('/trip-builder')} cmsSection={microSection} />
        </SectionReveal>
      )}

      {/* ========================================================================= */}
      {/* 4b. 2026 BENTO ATLAS: NATURAL LANDMARKS & WILDERNESS EXPEDITIONS          */}
      {/* ========================================================================= */}
      {research && (
        <SectionReveal>
          <DahabLandmarksBento
            overview={research}
            onExploreLandmark={() => navigateTo('/explore')}
            cmsSection={landmarksSection}
          />
        </SectionReveal>
      )}

      {/* ========================================================================= */}
      {/* 4c. AUTHENTIC DAHAB PHOTO SHOWCASE & LIGHTBOX                             */}
      {/* ========================================================================= */}
      <SectionReveal>
        <DahabPhotoShowcase cmsSection={gallerySection} />
      </SectionReveal>

      {/* ========================================================================= */}
      {/* 5. THE DAHAB EDIT — 2026 essence bento (dive/food/explore/stays/help)     */}
      {/*    Replaces the flat four-card quick-services grid: the dive experience   */}
      {/*    earns a double cell, stays and help close the grid with real exits.    */}
      {/* ========================================================================= */}
      <Suspense fallback={null}>
        <HomeEssenceBento onOpenQuickBook={onOpenQuickBook} cmsSection={essenceSection} />
      </Suspense>

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
          cmsSection={finalCtaSection}
        />
      )}

      {/* ========================================================================= */}
      {/* 7. FOOTER — night-chart close, links from the CMS footer menu             */}
      {/* ========================================================================= */}
      <DahabFooter navigateTo={navigateTo} cmsSection={footerSection} />
    </div>
  );
};
