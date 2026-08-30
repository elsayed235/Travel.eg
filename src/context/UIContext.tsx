import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AppRoute, JourneyStage } from '../types';

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
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/home');
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
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

  const navigateTo = useCallback(
    (
      route: AppRoute,
      params?: { dayId?: number; activityId?: string; bookingId?: string }
    ) => {
      setCurrentRoute(route);
      if (params?.dayId !== undefined) setSelectedDayId(params.dayId);
      if (params?.activityId !== undefined) setSelectedActivityId(params.activityId);
      if (params?.bookingId !== undefined) setSelectedBookingId(params.bookingId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const openDayGiWithPrompt = useCallback(
    (prompt: string) => {
      setActiveDayGiPrompt(prompt);
      setCurrentRoute('/daygi');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

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
      setCurrentRoute,
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
