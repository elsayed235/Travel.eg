import React, { useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ConciergeHome } from './concierge/ConciergeHome';

interface V2HomeCockpitProps {
  onOpenQuickBook: () => void;
}

/**
 * Concierge homepage shell (2026 rebuild).
 *
 * Replaces the previous cockpit — stats band, landmarks bento, trip-entry
 * triple cards, micro-experiences rail, stories rail, photo showcase,
 * essence bento, practical-services panels, AI widget and wayfinder —
 * with one continuous concierge experience (see concierge/ConciergeHome).
 *
 * This shell keeps only global chrome: back-to-top and the screen-reader
 * h1. Old section components remain in the tree for CMS/admin reference
 * but are no longer rendered on the public homepage.
 */
export const V2HomeCockpit: React.FC<V2HomeCockpitProps> = () => {
  const { t, isRTL } = useLanguage();
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 600;
      backToTopRef.current?.classList.toggle('opacity-100', show);
      backToTopRef.current?.classList.toggle('translate-y-0', show);
      backToTopRef.current?.classList.toggle('pointer-events-auto', show);
      backToTopRef.current?.classList.toggle('opacity-0', !show);
      backToTopRef.current?.classList.toggle('translate-y-4', !show);
      backToTopRef.current?.classList.toggle('pointer-events-none', !show);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="w-full bg-[var(--bg-canvas)] pb-28 text-[var(--text-primary)] transition-colors duration-300 md:pb-20"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="sr-only">{t('home.yourDahabTrip')}</h1>

      <ConciergeHome />

      <button
        ref={backToTopRef}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('home.backToTop')}
        className="fixed bottom-24 end-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] opacity-0 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl translate-y-4 pointer-events-none"
      >
        <ChevronUp className="h-5 w-5 text-[var(--text-primary)]" />
      </button>
    </div>
  );
};
