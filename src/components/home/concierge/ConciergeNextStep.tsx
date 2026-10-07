import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTrip } from '../../../context/TripContext';
import { resolveHomeNextStep } from '../../../services/homeNextStepResolver';

/**
 * The homepage's next-step gate: one card, one decision, two real routes.
 *
 * Purely presentational. Every word, route and reading comes from
 * `resolveHomeNextStep` — this file decides nothing, so the behaviour can be
 * exercised in a unit test without a browser (tests/domain/homeNextStep) and
 * the only thing left here is layout.
 *
 * Ink follows the system's brand recipe (plate on `--surface-container` with
 * `--text-accent*` ink — the same pair the navbar chip and the footer mark
 * use), so the card inherits all six themes instead of pinning its own.
 */
export const ConciergeNextStep: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { lifecycle, activeTrip, navigateTo } = useTrip();

  const step = resolveHomeNextStep(lifecycle, { activeTrip });

  return (
    <section
      aria-label={t('home.nextStep.label')}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="dahab-shell pt-10 sm:pb-10"
    >
      {/* The plate bleeds to the section's own box and pads by the same gutter the
          section pads by, so its eyebrow and title land on the page's text column
          (x=146 desktop / 16 mobile) instead of 32px inside it. Every sibling
          section puts its title on the canvas at that column; a padded card at the
          column's edge can only ever indent it further.  */}
      <div
        id="concierge-nextstep"
        data-nextstep={step.mode}
        className="-mx-4 flex flex-col gap-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container)] px-4 py-6 text-[var(--text-primary)] sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-7 lg:-mx-8 lg:px-8"
      >
        <div className="max-w-xl">
          <p
            data-nextstep="eyebrow"
            className="dahab-eyebrow text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-accent-strong)]"
          >
            {t(step.eyebrowKey)}
          </p>
          <h2
            data-nextstep="title"
            className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] text-balance sm:text-5xl lg:text-[3.5rem]"
          >
            {t(step.titleKey)}
          </h2>
          <p
            data-nextstep="body"
            className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]"
          >
            {t(step.bodyKey)}
          </p>
          {step.liveValue && (
            <p className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
              <span
                data-nextstep="live"
                className="truncate text-xs font-semibold text-[var(--text-secondary)]"
              >
                {step.liveValue}
              </span>
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => navigateTo(step.primaryRoute)}
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--accent-primary)] px-6 text-sm font-bold text-[var(--accent-primary-ink)] shadow-lg transition-transform duration-200 hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            <span data-nextstep="primary">{t(step.primaryKey)}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </button>

          {step.secondaryKey && step.secondaryRoute && (
            <button
              type="button"
              onClick={() => navigateTo(step.secondaryRoute!)}
              className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-6 text-sm font-bold text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--surface-container)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <span data-nextstep="secondary">{t(step.secondaryKey)}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
