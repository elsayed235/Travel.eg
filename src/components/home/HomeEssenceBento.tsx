import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Compass,
  LifeBuoy,
  UtensilsCrossed,
  Waves,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useTrip } from '../../context/TripContext';
import { SectionReveal } from '../common/SectionReveal';
import type { CmsHomepageSection } from '../../services/api';

interface HomeEssenceBentoProps {
  onOpenQuickBook: () => void;
  cmsSection?: CmsHomepageSection | null;
}

/**
 * "The Dahab Edit" — the essence bento.
 *
 * Replaces the flat four-equal-cards quick-services grid with an asymmetric
 * 2026 spotlight mosaic: the dive experience earns a double cell (it is the
 * reason most travelers come), stays and help close the grid with real exits.
 *
 * Every tile is a real <button>/<a> with an accessible name; the hover glow is
 * a pointer-follower (disabled under reduced motion and on touch, where there
 * is no hover to follow).
 */
export const HomeEssenceBento: React.FC<HomeEssenceBentoProps> = ({ onOpenQuickBook, cmsSection }) => {
  const { language, isRTL, t } = useLanguage();
  const { navigateTo } = useTrip();
  const { reducedMotion } = useTheme();
  const isAr = language === 'ar';

  // Editorial copy from the CMS dashboard (Homepage tab → essence section),
  // with the i18n string as fallback per field. Tile layout/routes stay
  // compiled — only the words an editor would change are data-driven.
  const pick = (path: string, fallbackKey: string): string => {
    const node = path.split('.').reduce<any>(
      (acc, key) => (acc == null ? undefined : acc[key]),
      cmsSection?.config
    );
    const value = node && typeof node === 'object' ? (node as any)[language] : node;
    return value || t(fallbackKey);
  };

  if (cmsSection && cmsSection.visible === 0) return null;
  const onSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !e.currentTarget.matches(':hover')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const tileBase =
    'dahab-spotlight group relative rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.99] transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-500 text-start cursor-pointer flex flex-col justify-between';

  return (
    <SectionReveal>
      <section
        id="dahab-essence-bento"
        aria-label={isAr ? 'جو دهب حسب مزاجك' : 'The Dahab Edit — pick your mood'}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <p className="text-sm text-[var(--text-secondary)]">{pick('eyebrow', 'home.essence.eyebrow')}</p>
          <h2 className="chart-heading text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)] mt-2">
            {pick('title', 'home.essence.title')}
          </h2>
          <div
            className="mt-4 h-[2px] w-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #1B2452, #E8A33D 45%, #1B9A8B)' }}
            aria-hidden="true"
          />
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{pick('subtitle', 'home.essence.subtitle')}</p>
        </div>

        {/* Bento mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[180px] sm:auto-rows-[210px] gap-4">
          {/* ── DIVE — double-wide spotlight tile ─────────────────────── */}
          <button
            type="button"
            onClick={onOpenQuickBook}
            onMouseMove={onSpotlightMove}
            aria-label={pick('dive.title', 'home.quickServices.dive.title')}
            className={`${tileBase} md:col-span-2 md:row-span-2 p-6 sm:p-7`}
          >
            <img
              src="/images/attractions/blue-hole.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/20" aria-hidden="true" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/25 backdrop-blur-md border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-sm">
                <Waves className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-extrabold text-teal-200 bg-teal-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-teal-400/30">
                {pick('dive.kicker', 'home.essence.dive.kicker')}
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="chart-heading text-2xl sm:text-3xl font-bold text-white group-hover:text-teal-300 transition-colors">
                {pick('dive.title', 'home.quickServices.dive.title')}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/85 max-w-lg">
                {pick('dive.line', 'home.essence.dive.line')}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-teal-300">
                {pick('dive.desc', 'home.quickServices.dive.desc')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" aria-hidden="true" />
              </span>
            </div>
          </button>

          {/* ── FOOD ──────────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => navigateTo('/food')}
            onMouseMove={onSpotlightMove}
            aria-label={pick('food.title', 'home.quickServices.food.title')}
            className={`${tileBase} p-6`}
          >
            <img
              src="/images/restaurants/ali-baba-restaurant.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/20" aria-hidden="true" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/25 backdrop-blur-md border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-sm">
                <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 chart-heading text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                {pick('food.title', 'home.quickServices.food.title')}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/80 line-clamp-2">
                {pick('food.line', 'home.essence.food.line')}
              </p>
            </div>
            <ArrowUpRight className="absolute top-5 end-5 z-10 w-4 h-4 text-white/70 group-hover:text-amber-300 group-hover:rotate-45 transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300" aria-hidden="true" />
          </button>

          {/* ── EXPLORE ───────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => navigateTo('/explore')}
            onMouseMove={onSpotlightMove}
            aria-label={pick('explore.title', 'home.exploreDahab')}
            className={`${tileBase} p-6`}
          >
            <img
              src="/images/attractions/bouldering-wadi-gnai.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/20" aria-hidden="true" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/25 backdrop-blur-md border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-sm">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 chart-heading text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {pick('explore.title', 'home.exploreDahab')}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/80 line-clamp-2">
                {pick('explore.line', 'home.essence.explore.line')}
              </p>
            </div>
            <ArrowUpRight className="absolute top-5 end-5 z-10 w-4 h-4 text-white/70 group-hover:text-emerald-300 group-hover:rotate-45 transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300" aria-hidden="true" />
          </button>

          {/* ── STAYS — wide, panel style (stands out against photo tiles) ── */}
          <button
            type="button"
            onClick={() => navigateTo('/hotels')}
            className="group relative rounded-3xl overflow-hidden p-6 border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-500 text-start cursor-pointer md:col-span-2 flex flex-col justify-between"
          >
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{ background: 'radial-gradient(120% 160% at 85% 0%, rgba(32,168,154,0.14), transparent 55%)' }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)]">
                <BedDouble className="w-5 h-5" aria-hidden="true" />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-[background-color,border-color,color,box-shadow,transform,opacity] rtl:rotate-180" aria-hidden="true" />
            </div>
            <div className="relative z-10">
              <h3 className="chart-heading text-xl font-bold text-[var(--text-primary)]">{pick('stay.title', 'home.essence.stay.title')}</h3>
              <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">{pick('stay.line', 'home.essence.stay.line')}</p>
            </div>
            <span className="relative z-10 mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] group-hover:brightness-110 transition-[background-color,border-color,color,box-shadow,transform,opacity]">
              {pick('stay.cta', 'home.essence.stay.cta')}
            </span>
          </button>

          {/* ── HELP ──────────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => navigateTo('/help')}
            onMouseMove={onSpotlightMove}
            aria-label={pick('help.title', 'home.quickServices.help.title')}
            className={`${tileBase} p-6`}
          >
            <img
              src="/images/hero/camels-beach.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/25" aria-hidden="true" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-sky-200 bg-sky-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-sky-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                {pick('help.kicker', 'home.essence.help.kicker')}
              </span>
              <div className="mt-3 w-11 h-11 rounded-2xl bg-sky-500/25 backdrop-blur-md border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-sm">
                <LifeBuoy className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 chart-heading text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                {pick('help.title', 'home.essence.help.title')}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/80 line-clamp-2">
                {pick('help.line', 'home.essence.help.line')}
              </p>
            </div>
            <span className="relative z-10 mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-sky-300">
              {pick('help.cta', 'home.essence.help.cta')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:rotate-180" aria-hidden="true" />
            </span>
          </button>
        </div>
      </section>
    </SectionReveal>
  );
};

export default HomeEssenceBento;
