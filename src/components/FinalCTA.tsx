import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FinalCTAProps {
  onPlanTripClick: () => void;
  onExploreClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onPlanTripClick, onExploreClick }) => {
  // This section existed fully built but was never rendered anywhere, and was
  // English-only while the rest of the product is bilingual.
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  return (
    <section
      id="final-cta-section"
      aria-label={isAr ? 'ابدأ رحلتك في دهب' : 'Start your Dahab journey'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative py-24 sm:py-32 overflow-hidden tidal-gradient-section"
    >
      {/* Tidal depth overlay: desert surface sinking into ocean night */}
      <div className="absolute inset-0 z-0 tidal-gradient-hero opacity-60" />
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
      <div className="absolute inset-x-0 -top-px h-px tidal-gradient-hero opacity-80" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Tidal Badge */}
        <div className="tidal-badge tidal-badge-sunset mb-6">
          <Compass className="w-3.5 h-3.5" />
          <span>{isAr ? 'ابدأ رحلتك في سيناء' : 'Start Your Sinai Journey'}</span>
        </div>

        {/* Headline: light display with a serif-italic turn on the second
            line. Same ink throughout — the italic carries the voice, not a
            contrasting color. */}
        <h2
          id="final-cta-headline"
          className="tidal-heading text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.05] text-balance"
        >
          {isAr ? 'جاهز تكتشف دهب' : 'Ready to discover Dahab'} <br className="hidden sm:inline" />
          <span className="tidal-heading-accent">{isAr ? 'على مزاجك؟' : 'your way?'}</span>
        </h2>

        {/* Supporting text */}
        <p
          id="final-cta-supporting-text"
          className="mt-6 text-base sm:text-xl text-[var(--text-muted)] font-normal leading-relaxed max-w-xl mx-auto text-balance"
        >
          {isAr
            ? 'جاوب على كام سؤال بسيط، وإحنا نبنيلك الرحلة على مقاسك.'
            : 'Start with a few simple questions and build your trip around you.'}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            id="final-cta-plan-trip-btn"
            onClick={onPlanTripClick}
            className="tidal-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 group"
          >
            <span>{isAr ? 'خطط لرحلتي' : 'Plan My Trip'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
          </button>

          <button
            id="final-cta-explore-btn"
            onClick={onExploreClick}
            className="tidal-cta-secondary w-full sm:w-auto inline-flex items-center justify-center text-white"
          >
            <span>{isAr ? 'استكشف دهب' : 'Explore Dahab'}</span>
          </button>
        </div>

        <p className="mt-8 text-sm font-normal text-white/70 max-w-xl mx-auto leading-relaxed">
          {isAr
            ? 'الاستكشاف من غير تسجيل، والترشيحات من ناس دهب نفسها.'
            : 'Explore without signing up. Picks come from Dahab locals.'}
        </p>

      </div>
    </section>
  );
};
