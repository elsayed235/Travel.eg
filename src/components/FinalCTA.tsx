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
      className="relative py-24 sm:py-32 overflow-hidden bg-[#14282B]"
    >
      {/* Atmospheric Dahab Sunset Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2000&auto=format&fit=crop"
          alt="Atmospheric sunset over the Dahab coastline and Sinai desert mountains"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 mix-blend-overlay scale-105"
        />
        {/* Deep Slate Ocean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14282B] via-[#14282B]/85 to-[#14282B]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14282B] via-transparent to-[#14282B]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Icon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[12px] font-bold uppercase tracking-[0.2em] mb-6">
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>{isAr ? 'ابدأ رحلتك في سيناء' : 'Start Your Sinai Journey'}</span>
        </div>

        {/* Headline with Serif contrast */}
        <h2
          id="final-cta-headline"
          className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-[1.05] text-balance"
        >
          {isAr ? 'جاهز تكتشف دهب' : 'Ready to discover Dahab'} <br className="hidden sm:inline" />
          <span className="italic text-amber-100/90 font-normal">{isAr ? 'على مزاجك؟' : 'your way?'}</span>
        </h2>

        {/* Supporting text */}
        <p
          id="final-cta-supporting-text"
          className="mt-6 text-base sm:text-xl text-white/70 font-normal leading-relaxed max-w-xl mx-auto text-balance"
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
            /*
              Uses the theme's CTA tokens rather than a literal light hex.
              index.css carries a global rule that rewrites light background
              utilities (bg-[#FDFBF7] among them) to var(--bg-canvas) with
              !important under dark themes — intended to darken light surfaces,
              but it also flattened this deliberately light-on-dark primary
              button to charcoal-on-charcoal, erasing its prominence. The tokens
              are immune to that rule and follow the active theme.
            */
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold tracking-tight bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] active:scale-[0.98] shadow-lg shadow-black/25 hover:shadow-xl transition-all cursor-pointer group"
          >
            <span>{isAr ? 'خطط لرحلتي' : 'Plan My Trip'}</span>
            <ArrowRight className="w-4 h-4 text-[var(--btn-book-text)] group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
          </button>

          <button
            id="final-cta-explore-btn"
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-sm sm:text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{isAr ? 'استكشف دهب' : 'Explore Dahab'}</span>
          </button>
        </div>

        <div className="mt-8 text-[12px] font-bold uppercase tracking-[0.2em] text-white/40">
          {isAr
            ? 'الاستكشاف من غير تسجيل · ترشيحات محلية على مزاجك'
            : 'No sign-up required to explore · Personalized local recommendations'}
        </div>

      </div>
    </section>
  );
};
