import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { CmsHomepageSection } from '../services/api';

interface FinalCTAProps {
  onPlanTripClick: () => void;
  onExploreClick: () => void;
  cmsSection?: CmsHomepageSection | null;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onPlanTripClick, onExploreClick, cmsSection }) => {
  // This section existed fully built but was never rendered anywhere, and was
  // English-only while the rest of the product is bilingual.
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  // CMS-editable copy (Homepage tab → finalcta section), per-language fallback
  // to the compiled strings below. Layout stays compiled; only the words an
  // editor would change are data-driven.
  const pick = (path: string, fallbackEn: string, fallbackAr: string): string => {
    const node = path.split('.').reduce<any>(
      (acc, key) => (acc == null ? undefined : acc[key]),
      cmsSection?.config
    );
    const value = node && typeof node === 'object' ? (node as any)[language] : node;
    return value || (isAr ? fallbackAr : fallbackEn);
  };

  if (cmsSection && cmsSection.visible === 0) return null;

  return (
    <section
      id="final-cta-section"
      aria-label={isAr ? 'ابدأ رحلتك في دهب' : 'Start your Dahab journey'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative py-24 sm:py-32 overflow-hidden chart-gradient-section"
    >
      {/* Tidal depth overlay: desert surface sinking into ocean night */}
      <div className="absolute inset-0 z-0 chart-gradient-hero opacity-60" />
      {/* Atmospheric Dahab Sunset Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero/gulf-sunset.jpg"
          alt="Atmospheric sunset over the Dahab coastline and Sinai desert mountains"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)] via-[var(--bg-canvas)]/80 to-transparent" />
      </div>
      {/* Shoreline glass divider at the top of the close */}
      <div className="absolute inset-x-0 -top-px h-px chart-gradient-hero opacity-80" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Tidal Badge */}
        <div className="chart-badge chart-badge-ember mb-6">
          <Compass className="w-3.5 h-3.5" />
          <span>{pick('badge', 'Start Your Sinai Journey', 'ابدأ رحلتك في سيناء')}</span>
        </div>

        {/* Headline: light display with a serif-italic turn on the second
            line. Same ink throughout — the italic carries the voice, not a
            contrasting color. */}
        <h2
          id="final-cta-headline"
          className="chart-heading text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.05] text-balance"
        >
          {pick('headline', 'Ready to discover Dahab', 'جاهز تكتشف دهب')} <br className="hidden sm:inline" />
          <span className="chart-heading-accent">{pick('headlineAccent', 'your way?', 'على مزاجك؟')}</span>
        </h2>

        {/* Supporting text */}
        <p
          id="final-cta-supporting-text"
          className="mt-6 text-base sm:text-xl text-[var(--text-muted)] font-normal leading-relaxed max-w-xl mx-auto text-balance"
        >
          {pick('supporting', 'Start with a few simple questions and build your trip around you.', 'جاوب على كام سؤال بسيط، وإحنا نبنيلك الرحلة على مقاسك.')}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            id="final-cta-plan-trip-btn"
            onClick={onPlanTripClick}
            className="chart-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 group"
          >
            <span>{pick('ctaPrimary', 'Plan My Trip', 'خطط لرحلتي')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
          </button>

          <button
            id="final-cta-explore-btn"
            onClick={onExploreClick}
            className="chart-cta-secondary w-full sm:w-auto inline-flex items-center justify-center text-white"
          >
            <span>{pick('ctaSecondary', 'Explore Dahab', 'استكشف دهب')}</span>
          </button>
        </div>

        <p className="mt-8 text-sm font-normal text-white/70 max-w-xl mx-auto leading-relaxed">
          {pick('footnote', 'Explore without signing up. Picks come from Dahab locals.', 'الاستكشاف من غير تسجيل، والترشيحات من ناس دهب نفسها.')}
        </p>

      </div>
    </section>
  );
};
