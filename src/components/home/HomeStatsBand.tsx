import React, { useEffect, useRef, useState } from 'react';
import { Anchor, Eye, Mountain, HeartPulse } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { SectionReveal } from '../common/SectionReveal';
import type { CmsHomepageSection } from '../../services/api';

interface SoundingItem {
  id: string;
  icon: React.ReactNode;
  value: string;
  suffix: string;
  labelKey: string;
  accent: string;
  label_en?: string;
  label_ar?: string;
}

/** CMS config icon name → lucide component. */
const ICONS: Record<string, React.ReactNode> = {
  anchor: <Anchor className="w-5 h-5" />,
  eye: <Eye className="w-5 h-5" />,
  mountain: <Mountain className="w-5 h-5" />,
  heart: <HeartPulse className="w-5 h-5" />,
};

const SOUNDINGS: SoundingItem[] = [
  {
    id: 'bluehole',
    icon: <Anchor className="w-5 h-5" />,
    value: '100',
    suffix: 'm+',
    labelKey: 'home.sounding.bluehole.l',
    accent: 'text-[var(--accent-primary)]',
  },
  {
    id: 'visibility',
    icon: <Eye className="w-5 h-5" />,
    value: '30',
    suffix: 'm+',
    labelKey: 'home.sounding.visibility.l',
    accent: 'text-cyan-400',
  },
  {
    id: 'summit',
    icon: <Mountain className="w-5 h-5" />,
    value: '2285',
    suffix: 'm',
    labelKey: 'home.sounding.summit.l',
    accent: 'text-[var(--accent-secondary)]',
  },
  {
    id: 'sos',
    icon: <HeartPulse className="w-5 h-5" />,
    value: '24',
    suffix: '/7',
    labelKey: 'home.sounding.sos.l',
    accent: 'text-rose-400',
  },
];

/** Counts 0→target once when started; renders final text immediately under reduced motion. */
const useCountUp = (target: number, start: boolean, duration = 1400) => {
  const [n, setN] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return n;
};

const SoundingCell: React.FC<{ item: SoundingItem; start: boolean; last: boolean }> = React.memo(({
  item, start, last,
}) => {
  const { language, t } = useLanguage();
  const { reducedMotion } = useTheme();
  const n = useCountUp(Number(item.value), start);

  return (
    <div
      className="relative px-5 sm:px-8 py-7 sm:py-9 flex items-center gap-4 group hover:bg-[var(--surface-container)]/40 transition-all duration-300 aurora-hover"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        borderInlineEnd: last ? undefined : '1px solid var(--border-subtle)',
      }}
    >
      <span className={`w-10 h-10 rounded-xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.accent}`}>
        {item.icon}
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] tabular-nums">
            {reducedMotion ? item.value : n}
          </span>
          <span className={`text-sm font-bold ${item.accent}`}>{item.suffix}</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-snug mt-0.5 truncate">
          {item.label_en && item.label_ar
            ? (language === 'ar' ? item.label_ar : item.label_en)
            : t(item.labelKey)}
        </p>
      </div>
      {/* Screen readers get the final number immediately, never a spinning counter */}
      <span className="sr-only">{`${item.value}${item.suffix}`}</span>
    </div>
  );
});

/**
 * "The coast in numbers" — depth soundings band.
 *
 * Four real, verifiable figures set as equal soundings on a hairline grid.
 * Numbers count up once when scrolled into view (IntersectionObserver,
 * disconnects after firing), respecting prefers-reduced-motion.
 *
 * The figures, labels and visibility can be edited from the CMS dashboard
 * (Homepage tab → stats section); the compiled array below is the fallback
 * when no section config exists.
 */
export const HomeStatsBand: React.FC<{ cmsSection?: CmsHomepageSection | null }> = ({ cmsSection }) => {
  const { language, isRTL, t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const cmsItems = cmsSection?.config?.items;
  const items: SoundingItem[] = Array.isArray(cmsItems) && cmsItems.length > 0
    ? cmsItems.map((raw: any) => ({
        id: raw.id || 'stat',
        icon: ICONS[raw.icon] || ICONS.anchor,
        value: String(raw.value ?? ''),
        suffix: raw.suffix || '',
        labelKey: '',
        label_en: raw.label_en,
        label_ar: raw.label_ar,
        accent: raw.accent || 'text-[var(--accent-primary)]',
      }))
    : SOUNDINGS;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // CMS visibility flag: a section explicitly set to hidden suppresses the band.
  // (checked after the hooks so hook order never varies with data)
  if (cmsSection && cmsSection.visible === 0) return null;

  return (
    <SectionReveal offset={16}>
      <section
        aria-label={t('home.sounding.label')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-5 sm:mb-6">
          <span className="chart-badge chart-badge-live text-[11px] font-semibold">
            {t('home.sounding.eyebrow')}
          </span>
          <h2 className="chart-heading text-2xl sm:text-3xl font-bold tracking-tight mt-2">
            {t('home.sounding.label')}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-lg">
            {t('home.sounding.subtitle')}
          </p>
        </div>
        <div
          ref={ref}
          className="relative chart-card rounded-3xl overflow-hidden"
          role="group"
          aria-label={t('home.sounding.label')}
          lang={language}
        >
          {/* Ambient Blue Hole backdrop */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/images/hero/blue-hole-signature.jpg"
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-center scale-105 opacity-20 dark:opacity-15"
            />
            <div className="absolute inset-0 bg-[var(--bg-canvas)]/85 backdrop-blur-[1.5px]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <SoundingCell
                key={item.id}
                item={item}
                start={visible}
                last={i === items.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </SectionReveal>
  );
};

export default HomeStatsBand;
