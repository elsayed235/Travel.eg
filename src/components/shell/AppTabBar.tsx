import React from 'react';
import { Compass, Luggage, Sun, UserRound } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useDestination } from '../../context/DestinationContext';
import type { AppRoute } from '../../types';
import { haptic } from '../../design/feedback';

/**
 * Phone navigation: four places, always in the same order (plan §04).
 *
 *   Discover · Plan · Trip/Today · Account
 *
 * "Trip" becomes "Today" while the traveler is in the destination. The bar
 * sits above the home indicator (safe-area inset) and hides from `lg` up,
 * where the header carries navigation.
 */

type TabId = 'discover' | 'plan' | 'trip' | 'account';

const DISCOVER_ROUTES: string[] = ['/', '/home', '/discover', '/explore', '/attractions', '/experiences', '/programs', '/hotels', '/accommodations', '/food', '/restaurants', '/rentals', '/transfers', '/transfers/local', '/transfers/intercity', '/live', '/listings'];
const PLAN_ROUTES: string[] = ['/plan', '/plan-for-me', '/trip-builder', '/trip-preview', '/daygi', '/ai-director'];
const TRIP_ROUTES: string[] = ['/my-trip', '/my-trip/day', '/my-trip/activity', '/bookings', '/arrive', '/first-two-hours', '/help', '/change-recovery', '/departure', '/post-trip', '/memories'];

export function activeTabFor(route: string): TabId | null {
  if (DISCOVER_ROUTES.includes(route)) return 'discover';
  if (PLAN_ROUTES.includes(route)) return 'plan';
  if (TRIP_ROUTES.includes(route)) return 'trip';
  if (route === '/profile' || route.startsWith('/auth')) return 'account';
  return null;
}

/** Plan tab glyph: the DayGi orb, so the AI entry point reads as one thing everywhere. */
const PlanOrb: React.FC<{ active: boolean }> = ({ active }) => (
  <span
    aria-hidden="true"
    className={cn('block h-[22px] w-[22px] rounded-full transition-transform duration-300', active && 'scale-110')}
    style={{ background: 'conic-gradient(from 200deg, var(--dg-action), color-mix(in oklab, var(--dg-action) 35%, white), var(--dg-highlight), var(--dg-action))' }}
  />
);

export const AppTabBar: React.FC = () => {
  const { currentRoute, navigateTo, activeTrip, isSignedIn } = useTrip();
  const { t } = useLanguage();
  const { destination } = useDestination();
  const reduce = useReducedMotion();
  const active = activeTabFor(currentRoute);
  const inDestination = activeTrip?.status === 'IN_DESTINATION';

  const tabs: { id: TabId; label: string; route: AppRoute; icon: React.ReactNode }[] = [
    { id: 'discover', label: t('shell.tab.discover'), route: '/home', icon: <Compass className="h-[22px] w-[22px]" strokeWidth={1.7} /> },
    { id: 'plan', label: t('shell.tab.plan'), route: '/plan', icon: <PlanOrb active={active === 'plan'} /> },
    {
      id: 'trip',
      label: inDestination ? t('shell.tab.today') : t('shell.tab.trip'),
      route: '/my-trip',
      icon: inDestination ? <Sun className="h-[22px] w-[22px]" strokeWidth={1.7} /> : <Luggage className="h-[22px] w-[22px]" strokeWidth={1.7} />,
    },
    {
      id: 'account',
      label: t('shell.tab.account'),
      route: isSignedIn ? '/profile' : '/auth/sign-in',
      icon: <UserRound className="h-[22px] w-[22px]" strokeWidth={1.7} />,
    },
  ];

  return (
    <nav
      aria-label={t('shell.tabsLabel')}
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-dg-line bg-dg-chrome backdrop-blur-xl backdrop-saturate-150 pb-[var(--dg-safe-bottom)]"
    >
      <ul className="mx-auto grid h-[var(--dg-tabbar-h)] max-w-lg grid-cols-4">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <li key={tab.id} className="relative">
              <button
                type="button"
                onClick={() => {
                  haptic('tap');
                  navigateTo(tab.route);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-full w-full flex-col items-center justify-center gap-1 text-[0.75rem] font-medium transition-colors',
                  isActive ? 'text-dg-ink' : 'text-dg-ink-3 hover:text-dg-ink-2',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="tabbar-indicator"
                    className="absolute top-0 h-[3px] w-6 rounded-full bg-dg-action"
                    transition={reduce ? { duration: 0 } : destination.motion.layout}
                    aria-hidden="true"
                  />
                )}
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
