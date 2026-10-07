import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { HERO_IMAGE_DEFAULT, HERO_VEIL_DEFAULT } from '../../../shared/homeSections';
import type { HeroContent } from './homeLayout';

/**
 * Concierge hero — one cinematic frame, one thesis, two actions.
 *
 * Deliberately still: a single high-quality photograph with a calm
 * theme-aware scrim. No video carousel, no auto-rotation, no shader
 * layer — the previous hero cycled five scenes behind a cinema-glass
 * plate and competed with its own headline for attention.
 *
 * Text colour is NOT hardcoded white. The scrim is mixed from
 * `--bg-canvas`, so on the two light themes it resolves to near-white —
 * white type on it measured 1.05:1 (the headline essentially vanished).
 * Because the scrim makes the photograph behave like the canvas, the ink
 * follows the same canvas tokens: `--text-primary` is white on the dark
 * themes and dark ink on the light ones, correct in both by construction.
 *
 * The photo, headline line A, subtitle and scrim strength now come from the
 * CMS (`hero` in homeLayout.ts) and fall back to the shipped values
 * individually — a CMS that sets only the photo leaves the copy alone, and a
 * CMS image that 404s falls back to the shipped photograph instead of
 * leaving a blank frame. Line B (the italic accent) and the eyebrow stay
 * translated.
 */
export const ConciergeHero: React.FC<{
  hero?: HeroContent;
  onPlan: () => void;
  onExplore: () => void;
}> = ({ hero, onPlan, onExplore }) => {
  const { t, isRTL } = useLanguage();
  const [imageFailed, setImageFailed] = useState(false);

  const image = imageFailed || !hero?.imageUrl ? HERO_IMAGE_DEFAULT : hero.imageUrl;

  /* Scrim stops are the shipped calibration scaled by one operator number.
     k = 1 (the 88 default) reproduces the previous values exactly, so the
     measured contrast of this section is unchanged unless someone edits it. */
  const k = (hero?.veil ?? HERO_VEIL_DEFAULT) / HERO_VEIL_DEFAULT;
  const stop = (base: number) => `${Math.round(base * k * 100) / 100}%`;

  return (
    <section
      aria-label="Dahab digital concierge"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative w-full overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)]"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={image}
          alt=""
          fetchPriority="high"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover object-center"
        />
        {/* Sophisticated overlay: deep charcoal base, stronger on the reading side.
            Theme-aware via color-mix so light themes lift instead of assuming night.

            The mid stops carry the reading column, so they have to be strong
            enough to actually stand in for the canvas: at 55%/42% the subtitle
            sat on rgb(166,200,197) and measured 4.25:1 against lagoon-breeze's
            `--text-secondary` (4.26:1 — a fail, not a rounding error). The veil
            now holds ~70% across the text block and falls away after it, so the
            photograph still owns the right-hand two fifths. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isRTL
              ? `linear-gradient(to left, color-mix(in oklab, var(--bg-canvas) ${stop(88)}, transparent) 0%, color-mix(in oklab, var(--bg-canvas) ${stop(70)}, transparent) 45%, color-mix(in oklab, var(--bg-canvas) ${stop(18)}, transparent) 80%, transparent 100%)`
              : `linear-gradient(to right, color-mix(in oklab, var(--bg-canvas) ${stop(88)}, transparent) 0%, color-mix(in oklab, var(--bg-canvas) ${stop(70)}, transparent) 45%, color-mix(in oklab, var(--bg-canvas) ${stop(18)}, transparent) 80%, transparent 100%)`
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              `linear-gradient(to top, color-mix(in oklab, var(--bg-canvas) ${stop(92)}, transparent) 0%, color-mix(in oklab, var(--bg-canvas) ${stop(50)}, transparent) 24%, transparent 44%, color-mix(in oklab, var(--bg-canvas) ${stop(30)}, transparent) 100%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-36 sm:px-6 sm:pb-20 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
            {t('concierge.hero.eyebrow')}
          </p>

          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-[5rem]">
            {hero?.titleA ?? t('concierge.hero.titleA')}
            <br />
            <span className="italic text-[var(--accent-secondary)]">{t('concierge.hero.titleB')}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {hero?.subtitle ?? t('concierge.hero.subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onPlan}
              className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--accent-primary)] px-7 text-sm font-bold text-[var(--accent-primary-ink)] shadow-xl transition-transform duration-200 hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              {t('concierge.hero.plan')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-7 text-sm font-bold text-[var(--text-primary)] backdrop-blur-sm transition-colors duration-200 hover:bg-[var(--surface-container)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              {t('concierge.hero.explore')}
            </button>
          </div>

          <p className="mt-6 text-xs font-medium tracking-wide text-[var(--text-secondary)]">
            {t('concierge.hero.note')}
          </p>
        </div>
      </div>
    </section>
  );
};
