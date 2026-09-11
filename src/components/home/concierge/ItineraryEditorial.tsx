import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTrip } from '../../../context/TripContext';
import { SectionReveal } from '../../common/SectionReveal';
import { READY_TRIP_PROGRAMS } from '../../../data/readyTripsData';

/**
 * Curated itineraries — travel-magazine composition, not a card grid.
 *
 * One large featured itinerary (image + duration + summary + CTA) with a
 * compact side index. Uses the REAL ReadyTripProgram dataset: genuine
 * durations, starting EGP prices and day-by-day structure. No fabricated
 * availability or ratings.
 */
export const ItineraryEditorial: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { navigateTo } = useTrip();
  const [featuredId, setFeaturedId] = useState(READY_TRIP_PROGRAMS[0].id);
  const featured = READY_TRIP_PROGRAMS.find((p) => p.id === featuredId) ?? READY_TRIP_PROGRAMS[0];
  const isAr = language === 'ar';

  return (
    <SectionReveal>
      <section
        id="concierge-itineraries"
        aria-label={t('concierge.trips.title')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full border-y border-[var(--border-subtle)] bg-[var(--surface-card)]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              {t('concierge.trips.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] text-balance sm:text-5xl">
              {t('concierge.trips.title')}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* Featured spread */}
            <article
              key={featured.id}
              className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)]"
            >
              <div className="relative h-64 overflow-hidden sm:h-80">
                <img
                  src={featured.heroImage}
                  alt={isAr ? featured.titleAr : featured.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                <div className="absolute bottom-4 start-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--accent-primary)] px-3 py-1 text-[11px] font-bold text-[var(--accent-primary-ink)]">
                    {isAr ? featured.badgeAr : featured.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    <CalendarDays className="h-3 w-3" aria-hidden="true" />
                    {t('concierge.trips.days', { n: featured.durationDays })}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-3xl font-semibold text-[var(--text-primary)] text-balance sm:text-4xl">
                  {isAr ? featured.titleAr : featured.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                  {isAr ? featured.taglineAr : featured.tagline}
                </p>
                <ul className="mt-4 space-y-2">
                  {(isAr ? featured.highlightsAr : featured.highlights).slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-primary)]" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => navigateTo('/programs', { programSlug: featured.id })}
                    className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent-primary)] px-7 text-sm font-bold text-[var(--accent-primary-ink)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    {t('concierge.trips.viewProgram')}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </button>
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    {t('concierge.intent.from')} {featured.startingPriceEGP.toLocaleString(isAr ? 'ar-EG' : 'en-US')} EGP
                  </p>
                </div>
              </div>
            </article>

            {/* Index — the other four programmes as a quiet list */}
            <div className="flex flex-col">
              <div
                role="tablist"
                aria-label={t('concierge.trips.eyebrow')}
                className="flex flex-1 flex-col divide-y divide-[var(--border-subtle)] overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)]"
              >
                {READY_TRIP_PROGRAMS.map((program) => {
                  const selected = program.id === featuredId;
                  return (
                    <button
                      key={program.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setFeaturedId(program.id)}
                      className={`group flex w-full flex-1 cursor-pointer items-center gap-4 p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] sm:p-5 ${
                        selected ? 'bg-[var(--surface-container)]/70' : 'hover:bg-[var(--surface-container)]/40'
                      }`}
                    >
                      <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={program.heroImage}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-sm font-bold ${selected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                          {isAr ? program.titleAr : program.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                          {t('concierge.trips.days', { n: program.durationDays })} · {isAr ? program.paceAr : program.pace}
                        </span>
                      </span>
                      <ArrowUpRight
                        className={`h-4 w-4 shrink-0 transition-all ${selected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] opacity-60 group-hover:text-[var(--text-primary)] group-hover:opacity-100'}`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/programs', { programSlug: READY_TRIP_PROGRAMS[0].id })}
                className="mt-4 inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-2xl text-sm font-bold text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                {t('concierge.trips.compare')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
};
