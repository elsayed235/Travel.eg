import React from 'react';
import { Sparkle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import type { CmsHomepageSection } from '../../services/api';

const MarqueeRow: React.FC<{ items: string }> = React.memo(({ items }) => (
  <span className="inline-flex items-center shrink-0" aria-hidden="true">
    {items.split('—').filter(Boolean).map((place, i) => (
      <span key={i} className="inline-flex items-center gap-6 pe-6">
        <span className="text-sm chart-heading-accent text-[var(--text-secondary)]/90 whitespace-nowrap">
          {place.trim()}
        </span>
        <Sparkle className="w-3 h-3 text-[var(--accent-secondary)]/70 shrink-0" aria-hidden="true" />
      </span>
    ))}
  </span>
));

/**
 * Destination marquee — a slow, hairline divider that rolls the Sinai coast
 * past the reader between the editorial sections.
 *
 * The text row is rendered twice for a seamless CSS loop; both copies are
 * aria-hidden and the real content is announced once as plain text below.
 * Under prefers-reduced-motion the animation is disabled by the .dahab-marquee
 * rules themselves, so nothing moves.
 *
 * The destination list can be edited from the CMS dashboard (Homepage tab →
 * marquee section, config.items_en / items_ar); the i18n string is the
 * fallback when no section config exists.
 */
export const HomeMarquee: React.FC<{ cmsSection?: CmsHomepageSection | null }> = React.memo(({ cmsSection }) => {
  const { language, isRTL, t } = useLanguage();
  const { reducedMotion } = useTheme();

  const cmsItems = cmsSection?.config?.[language === 'ar' ? 'items_ar' : 'items_en'];
  const items = (typeof cmsItems === 'string' && cmsItems.trim())
    ? cmsItems
    : t('home.marquee.items');

  if (cmsSection && cmsSection.visible === 0) return null;

  return (
    <section
      aria-label={t('home.marquee.items')}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full overflow-hidden border-y border-[var(--border-subtle)]/60 py-5 select-none"
    >
      <div className="flex w-max" dir="ltr">
        <div className={`flex ${reducedMotion ? '' : isRTL ? 'dahab-marquee-rtl' : 'dahab-marquee'}`}>
          <MarqueeRow items={items} />
          <MarqueeRow items={items} />
        </div>
      </div>
      <p className="sr-only">{t('home.marquee.items')}</p>
    </section>
  );
});

export default HomeMarquee;
