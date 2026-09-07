import React, { useEffect, useState } from 'react';
import { Waves, Sun, Sunset, BadgeCheck, LifeBuoy, CalendarCheck, Compass } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import type { CmsHomepageSection } from '../../services/api';

interface HomeLiveTickerProps {
  /** Rendered above the ticker as its heading anchor for the section nav. */
  id?: string;
  cmsSection?: CmsHomepageSection | null;
}

interface LiveConditions {
  airTemperatureC?: number;
  waterTemperatureC?: number | null;
  condition?: string;
  conditionAr?: string;
  astronomy?: { sunrise: string | null; sunset: string | null };
}

/**
 * "Dahab right now" — a single marquee of live, real facts.
 *
 * Telemetry comes from the same /api/telemetry/weather feed the hero reads.
 * When it is unavailable the static trust facts still carry the band, and the
 * "live" dot is honestly switched off — nothing on it is ever invented.
 *
 * Marquee duplication: the content row is rendered twice for a seamless loop;
 * both copies are aria-hidden and the whole band is re-announced once below as
 * plain text for screen readers.
 */
export const HomeLiveTicker: React.FC<HomeLiveTickerProps> = ({ id, cmsSection }) => {
  const { language, isRTL, t } = useLanguage();
  const { isDark, reducedMotion } = useTheme();
  const isAr = language === 'ar';

  const [live, setLive] = useState<LiveConditions | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getWeatherTelemetry().then((data) => {
      if (isMounted && data) setLive(data as LiveConditions);
    }).catch(() => { /* static facts still carry the band */ });
    return () => { isMounted = false; };
  }, []);

  // CMS visibility flag: hide the band from the dashboard (Homepage tab).
  // Checked after the hooks so hook order never varies with data.
  if (cmsSection && cmsSection.visible === 0) return null;

  const fmtTime = (iso: string | null | undefined) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleTimeString(isAr ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  const seaTemp = live?.waterTemperatureC != null ? Math.round(live.waterTemperatureC) : null;
  const airTemp = live?.airTemperatureC != null ? Math.round(live.airTemperatureC) : null;
  const sunset = fmtTime(live?.astronomy?.sunset);

  type Item = { icon: React.ReactNode; text: string; live?: boolean };
  const items: Item[] = [];

  if (seaTemp != null) items.push({ icon: <Waves className="w-3.5 h-3.5" />, text: t('home.liveTicker.sea', { temp: String(seaTemp) }), live: true });
  if (airTemp != null) items.push({ icon: <Sun className="w-3.5 h-3.5" />, text: t('home.liveTicker.air', { temp: String(airTemp) }), live: true });
  if (sunset) items.push({ icon: <Sunset className="w-3.5 h-3.5" />, text: t('home.liveTicker.sunset', { time: sunset }), live: true });
  items.push({ icon: <BadgeCheck className="w-3.5 h-3.5" />, text: t('home.liveTicker.direct') });
  items.push({ icon: <Compass className="w-3.5 h-3.5" />, text: t('home.liveTicker.guides') });
  items.push({ icon: <LifeBuoy className="w-3.5 h-3.5" />, text: t('home.liveTicker.support') });
  items.push({ icon: <CalendarCheck className="w-3.5 h-3.5" />, text: t('home.liveTicker.flex') });

  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex items-center gap-8 pe-8 shrink-0" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">
          <span className="text-[var(--accent-primary)]">{item.icon}</span>
          {item.live && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          )}
          <span className="text-[var(--text-primary)]/90">{item.text}</span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      id={id}
      aria-label={t('home.liveTicker.label')}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full border-y border-[var(--border-subtle)] bg-[var(--surface-card)]/60 backdrop-blur-xl overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 h-11">
        {/* Label chip */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400' : 'bg-[var(--text-secondary)]/40'} ${live && !reducedMotion ? 'animate-pulse' : ''}`}
            aria-hidden="true"
          />
          <span className="text-[11px] font-black text-[var(--accent-primary)] whitespace-nowrap">
            {t('home.liveTicker.label')}
          </span>
        </div>

        <span className="w-px h-4 bg-[var(--border-subtle)] shrink-0" aria-hidden="true" />

        {/* Marquee */}
        <div className="relative flex-1 overflow-hidden" dir="ltr">
          <div className={`flex w-max ${reducedMotion ? '' : isRTL ? 'dahab-marquee-rtl' : 'dahab-marquee'}`}>
            <Row hidden />
            <Row hidden />
          </div>
          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--bg-canvas)] to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--bg-canvas)] to-transparent pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Screen-reader announcement (single, calm) */}
      <p className="sr-only">
        {items.map((i) => i.text).join(' · ')}
      </p>
    </section>
  );
};

export default HomeLiveTicker;
