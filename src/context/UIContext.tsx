import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AppRoute, JourneyStage } from '../types';
import { DEFAULT_ROUTE, routeFromUrl, urlFromRoute, type RouteParams } from '../lib/routeUrl';

/**
 * The address bar is the source of truth for which page is open.
 *
 * Reading it in a lazy useState initialiser rather than an effect matters:
 * an effect runs after the first paint, so a deep link would flash the
 * homepage before correcting itself.
 */
const readLocation = (): { route: AppRoute; params: RouteParams } =>
  typeof window === 'undefined'
    ? { route: DEFAULT_ROUTE, params: {} }
    : routeFromUrl(window.location.pathname, window.location.search);

export interface UIContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  selectedDayId: number | null;
  setSelectedDayId: (dayId: number | null) => void;
  selectedActivityId: string | null;
  setSelectedActivityId: (activityId: string | null) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (bookingId: string | null) => void;
  journeyStage: JourneyStage;
  setJourneyStage: (stage: JourneyStage) => void;
  isEasyMode: boolean;
  setIsEasyMode: (val: boolean) => void;
  toggleEasyMode: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
  navigateTo: (route: AppRoute, params?: { dayId?: number; activityId?: string; bookingId?: string }) => void;
  activeDayGiPrompt: string | null;
  setActiveDayGiPrompt: (prompt: string | null) => void;
  openDayGiWithPrompt: (prompt: string) => void;
  activePersonaMode: 'PRE_TRIP' | 'IN_DAHAB';
  setActivePersonaMode: (mode: 'PRE_TRIP' | 'IN_DAHAB') => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => readLocation().route);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(
    () => readLocation().params.dayId ?? null
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    () => readLocation().params.activityId ?? null
  );
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    () => readLocation().params.bookingId ?? null
  );
  const [journeyStage, setJourneyStage] = useState<JourneyStage>('discover');
  const [activeDayGiPrompt, setActiveDayGiPrompt] = useState<string | null>(null);
  const [activePersonaMode, setActivePersonaMode] = useState<'PRE_TRIP' | 'IN_DAHAB'>('PRE_TRIP');
  const [toast, setToast] = useState<string | null>(null);

  const [isEasyMode, setIsEasyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dahab_easy_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Hold the dismiss timer so a second toast cannot be cut short by the first
  // toast's still-pending timeout, and so nothing fires after unmount.
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(msg);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const toggleEasyMode = useCallback(() => {
    setIsEasyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dahab_easy_mode', String(next));
      } catch {
        // noop
      }
      showToast(next ? '🌴 Easy & Sunlight High-Visibility Mode ON' : 'Standard Dahab Cockpit Mode ON');
      return next;
    });
  }, [showToast]);

  /**
   * Moves the address bar to match a route.
   *
   * Skipping an unchanged URL is not just tidiness: re-tapping the current nav
   * tab would otherwise stack duplicate history entries, and the traveler would
   * need several Back presses to leave a page they visited once.
   */
  const pushRoute = useCallback((route: AppRoute, params?: RouteParams) => {
    if (typeof window === 'undefined') return;
    const next = urlFromRoute(route, params);
    if (`${window.location.pathname}${window.location.search}` === next) return;
    window.history.pushState({ route }, '', next);
  }, []);

  const navigateTo = useCallback(
    (
      route: AppRoute,
      params?: { dayId?: number; activityId?: string; bookingId?: string }
    ) => {
      setCurrentRoute(route);
      if (params?.dayId !== undefined) setSelectedDayId(params.dayId);
      if (params?.activityId !== undefined) setSelectedActivityId(params.activityId);
      if (params?.bookingId !== undefined) setSelectedBookingId(params.bookingId);
      pushRoute(route, params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pushRoute]
  );

  /**
   * Exposed on the context (and re-exported by TripContext) in place of the raw
   * useState setter, so that a direct setCurrentRoute call cannot leave the
   * address bar pointing at a different page than the one on screen.
   */
  const setRoute = useCallback(
    (route: AppRoute) => {
      setCurrentRoute(route);
      pushRoute(route);
    },
    [pushRoute]
  );

  const openDayGiWithPrompt = useCallback(
    (prompt: string) => {
      setActiveDayGiPrompt(prompt);
      setCurrentRoute('/daygi');
      pushRoute('/daygi');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pushRoute]
  );

  /**
   * Back and Forward.
   *
   * This restores state FROM the URL and deliberately does not push: pushing
   * here would append a new entry instead of consuming one, and the Back button
   * would never make progress.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onPopState = () => {
      const { route, params } = readLocation();
      setCurrentRoute(route);
      setSelectedDayId(params.dayId ?? null);
      setSelectedActivityId(params.activityId ?? null);
      setSelectedBookingId(params.bookingId ?? null);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /**
   * Canonicalises the entry URL once, so an unrecognised path that resolved to
   * /home does not stay visible in the address bar — otherwise a later Back
   * press would return to a URL that never rendered.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { route, params } = readLocation();
    const canonical = urlFromRoute(route, params);
    if (`${window.location.pathname}${window.location.search}` !== canonical) {
      window.history.replaceState({ route }, '', canonical);
    }
  }, []);

  // Sync stage with route if relevant
  useEffect(() => {
    if (currentRoute === '/home') setJourneyStage('discover');
    else if (currentRoute === '/trip-builder') setJourneyStage('plan');
    else if (currentRoute === '/trip-preview') setJourneyStage('preview');
    else if (currentRoute === '/departure') setJourneyStage('departure');
    else if (currentRoute === '/post-trip') setJourneyStage('post_trip');
  }, [currentRoute]);

  // Memoised so this object is only a new reference when something in it
  // actually changed. Without this, TripContext's own useMemo — which depends on
  // the context objects themselves — is invalidated on every render, and all 67
  // useTrip() consumers re-render on any state change anywhere in the app.
  const value = useMemo<UIContextType>(
    () => ({
      currentRoute,
      setCurrentRoute: setRoute,
      selectedDayId,
      setSelectedDayId,
      selectedActivityId,
      setSelectedActivityId,
      selectedBookingId,
      setSelectedBookingId,
      journeyStage,
      setJourneyStage,
      isEasyMode,
      setIsEasyMode,
      toggleEasyMode,
      toast,
      showToast,
      navigateTo,
      activeDayGiPrompt,
      setActiveDayGiPrompt,
      openDayGiWithPrompt,
      activePersonaMode,
      setActivePersonaMode
    }),
    [
      currentRoute,
      setRoute,
      selectedDayId,
      selectedActivityId,
      selectedBookingId,
      journeyStage,
      isEasyMode,
      toggleEasyMode,
      toast,
      showToast,
      navigateTo,
      activeDayGiPrompt,
      openDayGiWithPrompt,
      activePersonaMode
    ]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
