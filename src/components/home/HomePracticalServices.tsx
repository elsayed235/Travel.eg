import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { SectionReveal } from '../common/SectionReveal';
import type { AppRoute } from '../../types';

/**
 * Concierge services showcase — the five bookable services as an animated
 * expanding-panel gallery instead of an icon grid. One panel holds focus at a
 * time (auto-advancing, pausable); the active panel reveals its photo, tagline
 * and exit. The whole panel is a single button so there are no nested
 * controls and no hover-only path: tap, click, Enter/Space and arrow keys all
 * work, and reduced-motion users get the same content with no rotation.
 */
interface ShowcaseService {
  route: AppRoute;
  image: string;
  labelKey: string;
  lineKey: string;
}

const SERVICES: ShowcaseService[] = [
  { route: '/hotels', image: '/images/hotels/le-meridien.jpg', labelKey: 'home.svcHotels', lineKey: 'home.svcHotelsLine' },
  { route: '/food', image: '/images/restaurants/breakfast-by-the-sea.jpg', labelKey: 'home.svcFood', lineKey: 'home.svcFoodLine' },
  { route: '/restaurants', image: '/images/restaurants/ali-baba-restaurant.jpg', labelKey: 'home.svcRestaurants', lineKey: 'home.svcRestaurantsLine' },
  { route: '/transfers/intercity', image: '/images/attractions/sinai-desert-safari.jpg', labelKey: 'home.svcTransfers', lineKey: 'home.svcTransfersLine' },
  { route: '/rentals', image: '/images/hero/golden-beach.jpg', labelKey: 'home.svcBikes', lineKey: 'home.svcBikesLine' },
];

const ADVANCE_MS = 6000;

export const HomePracticalServices: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { navigateTo } = useTrip();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-rotation with three independent brakes: explicit pause toggle,
  // hover/focus presence, and reduced motion. Never rotates without a visible
  // pause control (the toggle in the section header).
  useEffect(() => {
    if (paused || hovering || reducedMotion) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % SERVICES.length), ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [active, paused, hovering, reducedMotion]);

  const step = useCallback((dir: 1 | -1) => {
    setActive((i) => (i + dir + SERVICES.length) % SERVICES.length);
  }, []);

  const onKeys = (e: React.KeyboardEvent) => {
    // Follow the visual order: in RTL the row runs right-to-left.
    const forward = isRTL ? 'ArrowLeft' : 'ArrowRight';
    const backward = isRTL ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward) { e.preventDefault(); step(1); }
    else if (e.key === backward) { e.preventDefault(); step(-1); }
  };

  return (
    <SectionReveal>
      <section
        id="home-practical-services"
        aria-label={t('home.servicesTitle')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
      >
        {/* Editorial split header */}
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8 sm:mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              {t('home.servicesEyebrow')}
            </p>
            <h2 className="chart-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--text-primary)] mt-2 text-balance">
              {t('home.servicesTitle')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden md:block max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
              {t('home.servicesSubtitle')}
            </p>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={t(paused ? 'home.servicesPlay' : 'home.servicesPause')}
              className="w-11 h-11 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 flex items-center justify-center cursor-pointer transition-colors shrink-0"
            >
              {paused ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Expanding panels */}
        <div
          role="group"
          aria-label={t('home.servicesTitle')}
          onKeyDown={onKeys}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          className="flex flex-col md:flex-row gap-3 h-[640px] md:h-[540px] lg:h-[580px]"
        >
          {SERVICES.map((service, index) => {
            const isActive = index === active;
            const num = String(index + 1).padStart(2, '0');
            return (
              <button
                key={service.route}
                type="button"
                onClick={() => (isActive ? navigateTo(service.route) : setActive(index))}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${t(service.labelKey)} — ${t(service.lineKey)}`}
                style={{ flexGrow: isActive ? 3.4 : 1, flexBasis: 0 }}
                className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] text-start cursor-pointer min-h-[64px] md:min-h-0 md:min-w-[84px] transition-[flex-grow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                <img
                  src={service.image}
                  alt=""
                  aria-hidden="true"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-105 opacity-70'}`}
                />
                {/* Legibility scrim, measured for white text over photography. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" aria-hidden="true" />

                {/* Index */}
                <span className={`absolute top-4 start-4 text-xs font-black font-['JetBrains_Mono',monospace] px-2 py-1 rounded-md backdrop-blur-md border border-white/15 ${isActive ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] border-transparent' : 'bg-black/45 text-white/85'}`}>
                  {num}
                </span>

                {/* Collapsed rail label */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 md:start-4 md:translate-x-0 md:rtl:translate-x-0 text-white/90 text-sm font-bold whitespace-nowrap transition-opacity duration-300 [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] md:rotate-180 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                >
                  {t(service.labelKey)}
                </span>

                {/* Expanded detail */}
                <span className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  <span className="block text-2xl sm:text-3xl chart-heading font-semibold text-white leading-tight text-balance">
                    {t(service.labelKey)}
                  </span>
                  <span className="block text-sm text-white/75 mt-1">
                    {t(service.lineKey)}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] text-xs font-bold px-4 py-2.5">
                    {t('home.servicesExplore')}
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </SectionReveal>
  );
};

export default HomePracticalServices;
