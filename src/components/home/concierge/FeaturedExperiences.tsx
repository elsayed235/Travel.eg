import React, { useMemo } from 'react';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTrip } from '../../../context/TripContext';
import { SectionReveal } from '../../common/SectionReveal';
import { useResearchOverview, pick } from '../../../hooks/useResearchOverview';

const PHOTOS: Record<string, string> = {
  'act-laguna-kitesurf': '/images/hero/blue-lagoon-kitesurf.jpg',
  'act-promenade-bike': '/images/hero/camels-beach.jpg',
  'act-canyon-dive': '/images/attractions/underwater-elephant.jpg',
  'act-twilat-sunset': '/images/attractions/bouldering-wadi-gnai.jpg',
};

/**
 * Featured experiences — cinematic showcase, not a card row.
 *
 * One strong featured outing (largest image, full metadata) beside two
 * compact supporting previews. Data is REAL: research-backed experiences
 * with genuine local EGP price ranges. Empty state renders nothing rather
 * than invented content.
 */
export const FeaturedExperiences: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { navigateTo } = useTrip();
  const overview = useResearchOverview();

  const items = useMemo(() => (overview?.experiences ?? []).slice(0, 3), [overview]);
  if (!overview || items.length === 0) return null;

  const [featured, ...rest] = items;

  return (
    <SectionReveal>
      <section
        id="concierge-experiences"
        aria-label={t('concierge.experiences.title')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full border-y border-[var(--border-subtle)] bg-[var(--surface-card)]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                {t('concierge.experiences.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] text-balance sm:text-5xl">
                {t('concierge.experiences.title')}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)] md:text-end">
              {t('concierge.experiences.subtitle')}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Featured — spans 7 cols, tall image-led composition */}
            <article className="group relative min-h-[440px] overflow-hidden rounded-3xl border border-[var(--border-subtle)] sm:min-h-[520px] lg:col-span-7">
              <img
                src={PHOTOS[featured.id] ?? '/images/attractions/blue-hole.jpg'}
                alt={pick(featured.name, language)}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {pick(featured.duration, language)} · {featured.priceEgp}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-white text-balance sm:text-4xl">
                  {pick(featured.name, language)}
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  {pick(featured.skill, language)} · {pick(featured.modality, language)}
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('/trip-builder')}
                  className="mt-5 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[var(--accent-primary)] px-6 text-sm font-bold text-[var(--accent-primary-ink)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {t('concierge.experiences.book')}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </button>
              </div>
            </article>

            {/* Supporting previews — stacked editorial list, not equal cards */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              {rest.map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => navigateTo('/explore')}
                  className="group flex flex-1 cursor-pointer items-stretch gap-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-start transition-colors duration-200 hover:border-[var(--accent-primary)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  <span className="relative block w-32 shrink-0 overflow-hidden rounded-2xl sm:w-40">
                    <img
                      src={PHOTOS[exp.id] ?? '/images/attractions/three-pools.jpg'}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col justify-center py-2 pe-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                      {pick(exp.duration, language)} · {exp.priceEgp}
                    </span>
                    <span className="mt-1 font-display text-xl font-semibold leading-snug text-[var(--text-primary)]">
                      {pick(exp.name, language)}
                    </span>
                    <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {pick(exp.modality, language)}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--text-primary)]">
                      {t('concierge.experiences.book')}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => navigateTo('/explore')}
                className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/50 hover:text-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                {t('concierge.experiences.viewAll')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
};
