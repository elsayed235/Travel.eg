import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';

/**
 * Concierge hero — one cinematic frame, one thesis, two actions.
 *
 * Deliberately still: a single high-quality photograph with a calm
 * theme-aware scrim. No video carousel, no auto-rotation, no shader
 * layer — the previous hero cycled five scenes behind a cinema-glass
 * plate and competed with its own headline for attention.
 */
export const ConciergeHero: React.FC<{
  onPlan: () => void;
  onExplore: () => void;
}> = ({ onPlan, onExplore }) => {
  const { t, isRTL } = useLanguage();

  return (
    <section
      aria-label="Dahab digital concierge"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full overflow-hidden bg-[var(--bg-canvas)] text-white"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/hero/coral-reef-split.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        {/* Sophisticated overlay: deep charcoal base, stronger on the reading side.
            Theme-aware via color-mix so light themes lift instead of assuming night. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isRTL
              ? 'linear-gradient(to left, color-mix(in oklab, var(--bg-canvas) 88%, transparent) 0%, color-mix(in oklab, var(--bg-canvas) 55%, transparent) 42%, color-mix(in oklab, var(--bg-canvas) 12%, transparent) 75%, transparent 100%)'
              : 'linear-gradient(to right, color-mix(in oklab, var(--bg-canvas) 88%, transparent) 0%, color-mix(in oklab, var(--bg-canvas) 55%, transparent) 42%, color-mix(in oklab, var(--bg-canvas) 12%, transparent) 75%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to top, color-mix(in oklab, var(--bg-canvas) 92%, transparent) 0%, transparent 38%, color-mix(in oklab, var(--bg-canvas) 30%, transparent) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-36 sm:px-6 sm:pb-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
            {t('concierge.hero.eyebrow')}
          </p>

          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {t('concierge.hero.titleA')}
            <br />
            <span className="italic text-[var(--accent-secondary)]">{t('concierge.hero.titleB')}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t('concierge.hero.subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onPlan}
              className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--accent-primary)] px-7 text-sm font-bold text-[var(--accent-primary-ink)] shadow-xl transition-transform duration-200 hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t('concierge.hero.plan')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              {t('concierge.hero.explore')}
            </button>
          </div>

          <p className="mt-6 text-xs font-medium tracking-wide text-white/60">
            {t('concierge.hero.note')}
          </p>
        </div>
      </div>
    </section>
  );
};
