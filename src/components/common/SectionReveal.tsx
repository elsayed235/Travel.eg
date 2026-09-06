import React, { useRef, useEffect, useState } from 'react';

interface SectionRevealProps {
  children: React.ReactNode;
  /** Delay before animation starts (ms), for staggered reveals. Default: 0 */
  delay?: number;
  /** Animation duration (ms). Default: 600 */
  duration?: number;
  /** Vertical offset to slide from (px). Default: 24 */
  offset?: number;
  /** Additional className to merge */
  className?: string;
}

/**
 * Scroll-triggered entrance animation using IntersectionObserver.
 *
 * Sections fade in and slide up as they enter the viewport, creating
 * a premium, layered reveal effect. Respects prefers-reduced-motion.
 *
 * Lightweight: no animation library, just CSS transforms + IO.
 */
export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  duration = 600,
  offset = 24,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : `translateY(${offset}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
