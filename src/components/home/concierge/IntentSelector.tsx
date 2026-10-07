import React, { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Wallet } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTrip } from '../../../context/TripContext';
import { SectionReveal } from '../../common/SectionReveal';
import { READY_TRIP_PROGRAMS } from '../../../data/readyTripsData';
import { CONCIERGE_INTENTS } from './conciergeData';

/**
 * Plan-your-trip intent selector — SELECT → SEE MATCHES → TAKE ACTION.
 *
 * Six refined pill choices (not cards). Matching is honest: intents map to
 * ReadyTripProgram.defaultInterests, the real curated dataset. No invented
 * recommendations, no extra steps.
 */
export const IntentSelector: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { navigateTo } = useTrip();
  const [intentId, setIntentId] = useState<string>('sea');
  const isAr = language === 'ar';

  const intent = CONCIERGE_INTENTS.find((i) => i.id === intentId) ?? CONCIERGE_INTENTS[0];

  const matches = useMemo(() => {
    const needles = intent.match.map((m) => m.toLowerCase());
    const scored = READY_TRIP_PROGRAMS.map((p) => ({
      program: p,
      score: p.defaultInterests.filter((interest) =>
        needles.some((n) => interest.toLowerCase().includes(n)),
      ).length,
    }));
    const withHits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
    return (withHits.length > 0 ? withHits : scored.slice(0, 2)).slice(0, 2).map((s) => s.program);
  }, [intent]);

  return (
    <SectionReveal>
      <section
        id="concierge-intent"
        aria-label={t('concierge.intent.title')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="dahab-shell py-12 sm:py-16"
      >
        <div className="max-w-2xl">
          <p className="dahab-eyebrow text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-accent)]">
            {t('concierge.intent.eyebrow')}
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] text-balance sm:text-5xl lg:text-[3.5rem]">
            {t('concierge.intent.title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {t('concierge.intent.subtitle')}
          </p>
        </div>

        {/* Intent pills */}
        <div className="mt-7 flex flex-wrap gap-2.5" role="group" aria-label={t('concierge.intent.title')}>
          {CONCIERGE_INTENTS.map((option) => {
            const selected = option.id === intentId;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setIntentId(option.id)}
                className={`min-h-[48px] cursor-pointer rounded-full border px-6 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] active:scale-[0.97] ${
                  selected
                    ? 'border-transparent bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] shadow-lg'
                    : 'border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]'
                }`}
              >
                {t(option.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Matches — split rows, editorial not cards */}
        <div className="dahab-card mt-6 overflow-hidden">
          <p className="border-b border-[var(--border-subtle)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            {t('concierge.intent.matches')} · {t(intent.labelKey)}
          </p>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {matches.map((program) => (
              <li key={program.id}>
                <button
                  type="button"
                  onClick={() => navigateTo('/programs', { programSlug: program.id })}
                  className="group flex w-full cursor-pointer flex-col gap-4 p-5 text-start transition-colors hover:bg-[var(--surface-container)]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                >
                  <span className="relative block h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-44">
                    <img
                      src={program.heroImage}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
                      {isAr ? program.titleAr : program.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-[var(--text-secondary)]">
                      {isAr ? program.taglineAr : program.tagline}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-[var(--text-secondary)]">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                        {t('concierge.trips.days', { n: program.durationDays })}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                        {t('concierge.intent.from')} {program.startingPriceEGP.toLocaleString(isAr ? 'ar-EG' : 'en-US')} EGP
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-[var(--border-subtle)] px-5 text-xs font-bold text-[var(--text-primary)] transition-colors group-hover:border-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--accent-primary-ink)]">
                    {t('concierge.intent.view')}
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Escape hatch to the full planner */}
        <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl px-1 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--text-secondary)]">{t('concierge.intent.custom')}</p>
          <button
            type="button"
            onClick={() => navigateTo('/trip-builder')}
            className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[var(--surface-card)] px-6 text-sm font-bold text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors hover:border-[var(--accent-primary)]/50 hover:text-[var(--text-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {t('concierge.intent.customCta')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </section>
    </SectionReveal>
  );
};
