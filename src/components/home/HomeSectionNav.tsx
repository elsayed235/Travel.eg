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
export const HomeSectionNav: React.FC<HomeSectionNavProps> = React.memo(({ sections }) => {
  const { language , t} = useLanguage();
  const [present, setPresent] = useState<HomeSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Which of the candidate sections actually rendered.
  //
  // This used to scan exactly once after mount, which silently dropped every
  // section that mounts later — the lazy essence bento, the research-gated
  // landmark atlas, anything above the fold's IntersectionObserver window. The
  // scan now retries on a short interval until every candidate is either found
  // or given up on (10s), so late-mounted sections appear instead of the rail
  // lying about the page for its whole life.
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const scan = () => {
      if (cancelled) return;
      const found = sections.filter(section => document.getElementById(section.id));
      if (found.length > 0) {
        setPresent(prev => {
          const same = prev.length === found.length && prev.every((s, i) => s.id === found[i].id);
          return same ? prev : found;
        });
        setActiveId(prev => prev ?? found[0]?.id ?? null);
      }
      attempts += 1;
      if (found.length < sections.length && attempts < 40) {
        timer = setTimeout(scan, 250);
      }
    };

    let timer: ReturnType<typeof setTimeout>;
    scan();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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

    const onScroll = () => {
      if (navRef.current) {
        const pinned = window.scrollY > window.innerHeight * 0.6;
        navRef.current.classList.toggle('opacity-100', pinned);
        navRef.current.classList.toggle('opacity-0', !pinned);
        navRef.current.classList.toggle('pointer-events-none', !pinned);
        navRef.current.classList.toggle('pointer-events-auto', pinned);
      }
    };
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
      ref={navRef}
      aria-label={t('home.pageSections')}
      className="sticky top-[76px] z-30 hidden md:flex justify-center px-4 transition-opacity duration-300 opacity-0 pointer-events-none"
    >
      {/* Floating pill: same glass language as the header pill above it, so the
          two read as one system instead of a slab docked under a pill. The
          wrapper stays transparent and click-through; only the pill takes
          pointer events. */}
      <div
        className="pointer-events-auto max-w-full rounded-full border border-[var(--border-subtle)] shadow-lg overflow-hidden"
        style={{
          background: 'var(--header-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
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
          className="flex items-center gap-1.5 overflow-x-auto px-2 py-1.5 max-w-[calc(100vw-2rem)]"
          style={{ scrollbarWidth: 'none' }}
        >
          {present.map(section => {
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                data-section={section.id}
                onClick={() => jumpTo(section.id)}
                aria-current={isActive ? 'true' : undefined}
                className="shrink-0 min-h-[44px] px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer"
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
      </div>
    </nav>
  );
});
