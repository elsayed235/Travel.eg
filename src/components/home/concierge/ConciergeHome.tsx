import React from 'react';
import { useTrip } from '../../../context/TripContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useHomepageContent } from '../../../hooks/useCMSContent';
import type { HomeSectionId } from '../../../shared/homeSections';
import { resolveHomeLayout, resolveHeroContent } from './homeLayout';
import { ConciergeHero } from './ConciergeHero';
import { ConciergeNextStep } from './ConciergeNextStep';
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
 * The order below is the product decision (HERO → NEXT STEP → SERVICES →
 * EXPERIENCES → PLAN → ITINERARIES → STORIES → CLOSING), and each section
 * owns a distinct layout so the page reads art-directed instead of a repeated
 * card grid. Since this pass the list is also the CMS's vocabulary: an
 * operator's `visible`/`sort_order` rows reorder or drop these same sections
 * (see homeLayout.ts), and the shipped order is what a database with no rows
 * renders — the CMS is an override, never a prerequisite.
 *
 * `sections` is a `Record<HomeSectionId, …>`, so adding a section to the
 * shared list without rendering it is a type error rather than a silently
 * missing block.
 */
export const ConciergeHome: React.FC = () => {
  const { navigateTo } = useTrip();
  const { language, isRTL } = useLanguage();
  const { data } = useHomepageContent();

  const layout = resolveHomeLayout(data?.sections);
  const hero = resolveHeroContent(data?.hero ?? null, language);

  const sections: Record<HomeSectionId, React.ReactNode> = {
    hero: (
      <ConciergeHero
        hero={hero}
        onPlan={() => navigateTo('/trip-builder')}
        onExplore={() => navigateTo('/explore')}
      />
    ),
    next_step: <ConciergeNextStep />,
    services: <ServiceExplorer />,
    experiences: <FeaturedExperiences />,
    intent: <IntentSelector />,
    itineraries: <ItineraryEditorial />,
    stories: <StoriesMasonry />,
    final_cta: (
      <FinalCTA
        onPlanTripClick={() => navigateTo('/trip-builder')}
        onExploreClick={() => navigateTo('/explore')}
      />
    ),
    footer: <DahabFooter navigateTo={navigateTo} />
  };

  return (
    /* One wrapper, ordered children. Still a div, not a <main>: App already
       renders the page's <main> (id="main-app-content") and HTML forbids
       nesting one inside another — the two landmarks landed on top of each
       other in the accessibility tree. The id stays because the splash-gate
       e2e specs locate the homepage by `#concierge-main`, and it now spans the
       whole composed page so a reordered section is still inside it. */
    <div
      id="concierge-main"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full bg-[var(--bg-canvas)] text-[var(--text-primary)]"
    >
      {layout.map(id => (
        <React.Fragment key={id}>{sections[id]}</React.Fragment>
      ))}
    </div>
  );
};
