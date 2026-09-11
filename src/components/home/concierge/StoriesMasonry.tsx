import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useTrip } from '../../../context/TripContext';
import { SectionReveal } from '../../common/SectionReveal';
import { STORY_FRAMES } from './conciergeData';

/**
 * Visual inspiration — asymmetric editorial mosaic, minimal text.
 *
 * Photography only (already-shipped assets), no card chrome, no fake
 * metadata. One wide cinematic frame anchors the set; the rest fall into
 * an intentional uneven rhythm. Maximum visual impact, near-zero copy.
 */
export const StoriesMasonry: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { navigateTo } = useTrip();
  const isAr = language === 'ar';

  return (
    <SectionReveal>
      <section
        id="concierge-stories"
        aria-label={t('concierge.stories.title')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              {t('concierge.stories.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] text-balance sm:text-5xl">
              {t('concierge.stories.title')}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)] md:text-end">
            {t('concierge.stories.subtitle')}
          </p>
        </div>

        {/* Mosaic: 12-col asymmetric rhythm.
            Desktop: wide + tall + standard mix. Mobile: single column, kept tall enough to feel cinematic. */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
          {STORY_FRAMES.map((frame, i) => {
            const span =
              i === 0
                ? 'col-span-2 lg:col-span-7 h-72 sm:h-96 lg:h-[440px]'
                : i === 1
                  ? 'col-span-2 sm:col-span-1 lg:col-span-5 h-64 sm:h-80 lg:h-[440px]'
                  : i === 2
                    ? 'col-span-1 lg:col-span-4 h-56 sm:h-72 lg:h-80'
                    : i === 3
                      ? 'col-span-1 lg:col-span-4 h-56 sm:h-72 lg:h-80'
                      : i === 4
                        ? 'col-span-2 lg:col-span-4 h-64 sm:h-72 lg:h-80'
                        : 'col-span-1 lg:col-span-6 h-56 sm:h-64 lg:h-72';
            return (
              <figure
                key={frame.src}
                className={`group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] ${span}`}
              >
                <img
                  src={frame.src}
                  alt={frame.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80"
                  aria-hidden="true"
                />
                <figcaption className="absolute bottom-3 start-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  {isAr ? frame.captionAr : frame.captionEn}
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigateTo('/explore')}
            className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-6 text-sm font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/50 hover:text-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {t('concierge.stories.openGallery')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </section>
    </SectionReveal>
  );
};
