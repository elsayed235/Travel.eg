import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface HomeSection {
  /** The id of the rendered section element. */
  id: string;
  label: string;
  labelAr: string;
}

interface HomeSectionNavProps {
  /**
   * Every section the composition *may* render. Entries whose element is not
   * in the DOM are dropped, so this stays correct as the homepage composition
   * changes between modes rather than listing sections that are not there.
   */
  sections: HomeSection[];
}

/**
 * Tells you where you are on a page that is eight screens long.
 *
 * Measured before this existed: six headings across 5,542px, with one stretch
 * of 1,837px — two and a half screens — between two of them. There was nothing
 * on screen at any point that said which part of the page you were in, and no
 * way to jump. The URL never changes either, so scroll position was the only
 * orientation signal a reader had.
 *
 * Deliberately labels rather than dots: the complaint is not "I cannot skip
 * ahead", it is "I do not know where I am", and a dot answers neither.
 */
export const HomeSectionNav: React.FC<HomeSectionNavProps> = ({ sections }) => {
  const { language } = useLanguage();
  const [present, setPresent] = useState<HomeSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Which of the candidate sections actually rendered.
  useEffect(() => {
    const found = sections.filter(section => document.getElementById(section.id));
    setPresent(found);
    setActiveId(found[0]?.id ?? null);
  }, [sections]);

  // Track the section occupying the reading area, and show the rail only once
  // the reader has left the hero — it is orientation, not chrome.
  useEffect(() => {
    if (present.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    present.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => setPinned(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [present]);

  // Keep the active chip in view when the rail itself has to scroll.
  //
  // Sets scrollLeft on the rail rather than calling scrollIntoView on the chip:
  // this effect fires exactly when a jump changes the active section, and
  // scrollIntoView — even with block:'nearest' — reaches the window and cancels
  // the page scroll that is still animating. Measured: four of seven jumps
  // never moved the page at all until this was made horizontal-only.
  useEffect(() => {
    const rail = listRef.current;
    if (!activeId || !rail) return;
    const chip = rail.querySelector<HTMLElement>(`[data-section="${CSS.escape(activeId)}"]`);
    if (!chip) return;

    const target = chip.offsetLeft - rail.clientWidth / 2 + chip.offsetWidth / 2;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
  }, [activeId]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Focus BEFORE scrolling, with preventScroll. Calling focus() after
    // starting a smooth scroll makes the browser resolve both at once and the
    // page lands hundreds of pixels off target — measured overshoots of up to
    // 2,557px before this order was fixed.
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });

    // window.scrollTo with an explicit offset, not scrollIntoView.
    //
    // scrollIntoView needs scroll-margin-top to clear the two stacked bars, and
    // setting that as an inline style in the same frame as the call is a race:
    // measured, three of seven jumps landed either behind the header or not at
    // all. This computes the target directly and lands on it every time.
    const HEADER_STACK = 140;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_STACK);
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  const activeIndex = useMemo(
    () => present.findIndex(section => section.id === activeId),
    [present, activeId]
  );

  if (present.length < 3) return null;

  return (
    <nav
      aria-label={language === 'ar' ? 'أقسام الصفحة' : 'Page sections'}
      className={`sticky top-[72px] z-30 transition-opacity duration-300 ${
        pinned ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Reading progress across the sections, as a hairline. */}
      <div className="h-[2px] w-full" style={{ background: 'var(--border-subtle)' }}>
        <div
          className="h-full transition-[width] duration-300"
          style={{
            width: `${((activeIndex + 1) / present.length) * 100}%`,
            background: 'var(--accent-primary)'
          }}
        />
      </div>

      <div
        ref={listRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1.5 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <span
          className="text-[12px] font-bold uppercase tracking-wider shrink-0 hidden sm:inline pe-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {language === 'ar' ? 'أنت في' : 'You are in'}
        </span>

        {present.map(section => {
          const isActive = section.id === activeId;
          return (
            <button
              key={section.id}
              type="button"
              data-section={section.id}
              onClick={() => jumpTo(section.id)}
              aria-current={isActive ? 'true' : undefined}
              className="shrink-0 min-h-[36px] px-3 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
              style={{
                background: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? 'var(--bg-canvas)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`
              }}
            >
              {language === 'ar' ? section.labelAr : section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
