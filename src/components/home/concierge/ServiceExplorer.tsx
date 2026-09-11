import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTrip } from '../../../context/TripContext';
import { SectionReveal } from '../../common/SectionReveal';
import { CONCIERGE_SERVICES } from './conciergeData';

/**
 * Service explorer — the core product interface of the homepage.
 *
 * Asymmetric editorial selector: a scannable index on one side, one large
 * visual panel on the other. Selecting a service swaps image + copy + CTA
 * without navigating away. Exactly one primary action per service.
 *
 * Mobile: the index becomes a horizontal chip rail; the panel stacks below.
 * Fully keyboard-operable (real buttons + tablist semantics + arrow keys).
 */
export const ServiceExplorer: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { navigateTo } = useTrip();
  const [active, setActive] = useState(0);
  const service = CONCIERGE_SERVICES[active];

  const onIndexKeys = (e: React.KeyboardEvent) => {
    const forward = isRTL ? 'ArrowLeft' : 'ArrowRight';
    const backward = isRTL ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % CONCIERGE_SERVICES.length);
    } else if (e.key === backward || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + CONCIERGE_SERVICES.length) % CONCIERGE_SERVICES.length);
    }
  };

  return (
    <SectionReveal>
      <section
        id="concierge-services"
        aria-label={t('concierge.services.title')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        {/* Header — editorial split, not a centered card title */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              {t('concierge.services.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] text-balance sm:text-5xl">
              {t('concierge.services.title')}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)] md:text-end">
            {t('concierge.services.subtitle')}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
          {/* Index */}
          <div
            role="tablist"
            aria-label={t('concierge.services.title')}
            aria-orientation="vertical"
            onKeyDown={onIndexKeys}
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {CONCIERGE_SERVICES.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={`group flex min-h-[56px] flex-1 cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-2xl border px-5 text-start transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] lg:whitespace-normal ${
                    selected
                      ? 'border-[var(--accent-primary)]/50 bg-[var(--surface-card)] text-[var(--text-primary)]'
                      : 'border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className={`font-mono text-[11px] font-bold ${selected ? 'text-[var(--accent-primary)]' : 'opacity-60'}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block text-base font-bold leading-tight">{t(s.labelKey)}</span>
                      <span className="mt-0.5 hidden text-xs font-normal opacity-75 lg:block">
                        {t(s.lineKey)}
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full transition-colors ${selected ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-subtle)] group-hover:bg-[var(--accent-primary)]/50'}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Detail panel — one strong image, concise copy, one action */}
          <div
            role="tabpanel"
            aria-live="polite"
            className="relative min-h-[420px] overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] sm:min-h-[480px]"
          >
            {CONCIERGE_SERVICES.map((s, i) => (
              <img
                key={s.id}
                src={s.image}
                alt=""
                aria-hidden="true"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                {String(active + 1).padStart(2, '0')} / {String(CONCIERGE_SERVICES.length).padStart(2, '0')}
              </p>
              <h3 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
                {t(service.labelKey)}
              </h3>
              <p className="mt-1 text-sm font-medium text-white/75">{t(service.lineKey)}</p>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                {t(service.detailKey)}
              </p>
              <button
                type="button"
                onClick={() => navigateTo(service.route)}
                aria-label={`${t('concierge.services.open')} — ${t(service.labelKey)}`}
                className="mt-5 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[var(--accent-primary)] px-6 text-sm font-bold text-[var(--accent-primary-ink)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t('concierge.services.open')} · {t(service.labelKey)}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
};
