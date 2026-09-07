import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigation } from '../../hooks/useCMSContent';
import type { NavigationItemWire } from '../../services/api';
import type { CmsHomepageSection } from '../../services/api';
import type { AppRoute } from '../../types';

interface DahabFooterProps {
  navigateTo: (route: AppRoute, opts?: Record<string, unknown>) => void;
  cmsSection?: CmsHomepageSection | null;
}

/** Compiled fallback — the CMS footer menu overrides this when published. */
const FALLBACK_LINKS: Array<{ route: string; labelEn: string; labelAr: string }> = [
  { route: '/my-trip', labelEn: 'My Trip', labelAr: 'رحلتي' },
  { route: '/explore', labelEn: 'Explore Dahab', labelAr: 'استكشف دهب' },
  { route: '/food', labelEn: 'Food', labelAr: 'الأكل' },
  { route: '/help', labelEn: 'Help & SOS', labelAr: 'المساعدة والنجدة' },
];

/**
 * Site footer — the link columns come from the CMS footer navigation menu
 * (Navigation tab → footer), with the compiled list above as fallback. The
 * hyperbaric hotline and copyright lines are bilingual i18n strings.
 */
export const DahabFooter: React.FC<DahabFooterProps> = ({ navigateTo, cmsSection }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const { data: cmsLinks, fromCMS } = useNavigation('footer');

  const links = fromCMS && cmsLinks && cmsLinks.length > 0
    ? (cmsLinks as NavigationItemWire[]).map((item) => ({
        route: item.route || item.external_url || '#',
        labelEn: item.label_en,
        labelAr: item.label_ar,
        external: !!item.external_url,
        group: item.group_label_en || '',
      }))
    : FALLBACK_LINKS.map((l) => ({ ...l, external: false, group: '' }));

  // CMS visibility flag: hide the footer from the dashboard (Homepage tab).
  if (cmsSection && cmsSection.visible === 0) return null;

  const handleClick = (link: { route: string; external: boolean }) => {
    if (link.external) {
      window.open(link.route, '_blank', 'noopener,noreferrer');
      return;
    }
    // CMS routes that are not in the app's route union fall back to a plain
    // hash link rather than crashing the router.
    if (link.route.startsWith('/') && !link.route.includes(' ')) {
      navigateTo(link.route as AppRoute);
    }
  };

  return (
    <footer
      id="dahab-footer"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-[var(--border-subtle)]"
      role="contentinfo"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8">
        <div className="space-y-2 max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0A1128] via-[#E8A33D] to-[#1B9A8B] text-[#F2EDDF] flex items-center justify-center text-sm font-bold shadow-md" aria-hidden="true">
              D
            </div>
            <span className="chart-heading font-bold tracking-wide text-[var(--text-primary)]">
              {t('brand.name')}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">· {t('brand.tagline')}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('home.footer.tagline')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[var(--text-secondary)]">
          {links.map((link, i) => (
            <button
              key={`${link.route}-${i}`}
              type="button"
              onClick={() => handleClick(link)}
              className="cursor-pointer hover:text-[var(--text-primary)] transition-colors py-2 -my-2"
            >
              {isAr ? link.labelAr || link.labelEn : link.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className="py-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-secondary)]">
        <span>{t('home.footer.copyright')}</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          {t('home.footer.hyperbaricHotline')}: <strong className="font-semibold text-[var(--text-primary)]">+20 69 364 0400</strong>
        </span>
      </div>
    </footer>
  );
};

export default DahabFooter;