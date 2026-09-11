import React from 'react';
import { useTrip } from '../../../context/TripContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ConciergeHero } from './ConciergeHero';
import { ServiceExplorer } from './ServiceExplorer';
import { FeaturedExperiences } from './FeaturedExperiences';
import { IntentSelector } from './IntentSelector';
import { ItineraryEditorial } from './ItineraryEditorial';
import { StoriesMasonry } from './StoriesMasonry';
import { FinalCTA } from '../../FinalCTA';
import { DahabFooter } from '../DahabFooter';

/**
 * Concierge homepage composition — one continuous experience.
 *
 * Order is the product decision: HERO → SERVICES (core, second screen) →
 * FEATURED EXPERIENCES → PLAN (intent) → ITINERARIES → STORIES → FINAL CTA.
 * Each section owns a distinct layout (full-bleed hero, asymmetric explorer,
 * cinematic showcase, pill matcher, magazine spread, masonry, closing moment)
 * so the page reads art-directed instead of a repeated card grid.
 */
export const ConciergeHome: React.FC = () => {
  const { navigateTo } = useTrip();
  const { isRTL } = useLanguage();

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full bg-[var(--bg-canvas)] text-[var(--text-primary)]"
    >
      <ConciergeHero
        onPlan={() => navigateTo('/trip-builder')}
        onExplore={() => navigateTo('/explore')}
      />

      <main id="concierge-main">
        <ServiceExplorer />
        <FeaturedExperiences />
        <IntentSelector />
        <ItineraryEditorial />
        <StoriesMasonry />
      </main>

      <FinalCTA
        onPlanTripClick={() => navigateTo('/trip-builder')}
        onExploreClick={() => navigateTo('/explore')}
      />

      <DahabFooter navigateTo={navigateTo} />
    </div>
  );
};
