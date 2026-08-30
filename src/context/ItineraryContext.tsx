import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  TravelerProfile,
  TimelineDay,
  TimelineActivity,
  FoodOrderItem
} from '../types';
import { ANONYMOUS_PROFILE } from '../data/dahabContent';
// Fetched only when there is a cloud write to make. See AuthContext.
const loadFirebase = () => import('../lib/firebase');
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import { useCommerce } from './CommerceContext';
import { buildTimelineDays } from '../services/tripBookingMapper';

export interface ItineraryContextType {
  profile: TravelerProfile;
  setProfile: React.Dispatch<React.SetStateAction<TravelerProfile>>;
  updateProfile: (updates: Partial<TravelerProfile>) => void;
  tripDays: TimelineDay[];
  setTripDays: React.Dispatch<React.SetStateAction<TimelineDay[]>>;
  addActivityToDay: (dayNumber: number, activity: TimelineActivity) => void;
  removeActivityFromDay: (dayNumber: number, activityId: string) => void;
  updateActivityInDay: (dayNumber: number, activityId: string, updates: Partial<TimelineActivity>) => void;
  shiftActivityBetweenDays: (activityId: string, fromDay: number, toDay: number, newTimeSlot?: string) => void;
  activeFoodOrder: FoodOrderItem | null;
  setActiveFoodOrder: React.Dispatch<React.SetStateAction<FoodOrderItem | null>>;
  savedItems: string[];
  setSavedItems: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSaveItem: (itemId: string) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<TravelerProfile>(ANONYMOUS_PROFILE);
  const [tripDays, setTripDays] = useState<TimelineDay[]>([]);
  const [activeFoodOrder, setActiveFoodOrder] = useState<FoodOrderItem | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const { user, sessionUser } = useAuth();
  const { showToast } = useUI();
  const { activeTrip, activeTripItems } = useCommerce();

  /**
   * Fill the traveler's identity and trip settings from the session and their
   * real trip.
   *
   * `profile` started at ANONYMOUS_PROFILE and nothing ever moved it, so every
   * greeting in the app — Food's "جعان يا أحمد؟", Help's "محتاج مساعدة يا
   * أحمد؟", DayGI's "Welcome, Ahmed!" — was either a hardcoded demo name or an
   * empty string, and the trip settings shown as "yours" were the defaults.
   *
   * Nothing here is invented: the name, email and phone come from the session
   * record; the length, party size, budget, pace and interests come from the
   * traveler's own trip when they have one. Fields the backend does not hold
   * (passport, emergency contact) are left exactly as they were.
   */
  useEffect(() => {
    if (!sessionUser) {
      setProfile(ANONYMOUS_PROFILE);
      return;
    }

    setProfile(previous => ({
      ...previous,
      name: sessionUser.name || previous.name,
      email: sessionUser.email || previous.email,
      phone: sessionUser.phone || previous.phone
    }));
  }, [sessionUser]);

  useEffect(() => {
    if (!activeTrip) return;
    setProfile(previous => ({
      ...previous,
      lengthDays: activeTrip.lengthDays,
      travelersCount: activeTrip.travelersCount,
      budget: activeTrip.budget,
      pace: activeTrip.pace,
      interests: activeTrip.interests.length > 0 ? activeTrip.interests : previous.interests
    }));
  }, [activeTrip]);

  /**
   * Fill the timeline from the traveler's real trip.
   *
   * `tripDays` started empty and nothing ever filled it, so TripTimeline fell
   * through to AHMED_TRIP_DAYS — a hand-authored five-day plan for the demo
   * persona, shown to every traveler as their own itinerary. When there is a
   * real trip the days come from its items; when there is not, this leaves the
   * array empty and the timeline keeps its illustrative plan, which is the
   * empty state rather than a claim about anyone's booking.
   */
  useEffect(() => {
    if (!activeTrip) return;
    const days = buildTimelineDays(activeTrip, activeTripItems);
    if (days.length > 0) setTripDays(days);
  }, [activeTrip, activeTripItems]);

  const updateProfile = useCallback((updates: Partial<TravelerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const addActivityToDay = useCallback(
    (dayNumber: number, activity: TimelineActivity) => {
      setTripDays(prevDays =>
        prevDays.map(day => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: [...day.activities, activity]
            };
          }
          return day;
        })
      );

      // Cloud persistence if user is authenticated
      if (user?.uid) {
        void loadFirebase().then(firebase => firebase.persistActivityToCloud(
          {
            id: activity.id,
            userId: user.uid,
            dayNumber,
            time: activity.time,
            title: activity.title,
            location: activity.location || 'Dahab',
            status: activity.status,
            notes: activity.notes || ''
          },
          dayNumber,
          user.uid
        )).catch(() => {});
      }

      showToast(`Added "${activity.title}" to Day ${dayNumber} ✓`);
    },
    [user, showToast]
  );

  const removeActivityFromDay = useCallback(
    (dayNumber: number, activityId: string) => {
      setTripDays(prevDays =>
        prevDays.map(day => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: day.activities.filter(act => act.id !== activityId)
            };
          }
          return day;
        })
      );
      showToast('Activity removed from itinerary');
    },
    [showToast]
  );

  const updateActivityInDay = useCallback(
    (dayNumber: number, activityId: string, updates: Partial<TimelineActivity>) => {
      setTripDays(prevDays =>
        prevDays.map(day => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: day.activities.map(act =>
                act.id === activityId ? { ...act, ...updates } : act
              )
            };
          }
          return day;
        })
      );
    },
    []
  );

  const shiftActivityBetweenDays = useCallback(
    (activityId: string, fromDay: number, toDay: number, newTimeSlot?: string) => {
      let movedActivity: TimelineActivity | null = null;

      setTripDays(prevDays => {
        const updated = prevDays.map(d => {
          if (d.dayNumber === fromDay) {
            const act = d.activities.find(a => a.id === activityId);
            if (act) movedActivity = { ...act };
            return {
              ...d,
              activities: d.activities.filter(a => a.id !== activityId)
            };
          }
          return d;
        });

        if (!movedActivity) return prevDays;

        const actToInsert: TimelineActivity = {
          ...movedActivity,
          time: newTimeSlot || (movedActivity as TimelineActivity).time,
          notes:
            ((movedActivity as TimelineActivity).notes
              ? (movedActivity as TimelineActivity).notes + ' · '
              : '') + 'تم النقل بواسطة DayGI'
        };

        const targetDayExists = updated.some(d => d.dayNumber === toDay);
        if (!targetDayExists) {
          const newDay: TimelineDay = {
            dayNumber: toDay,
            dateStr: `Day ${toDay}`,
            title: `Day ${toDay}`,
            subtitle: `Custom Day · اليوم ${toDay}`,
            activities: [actToInsert]
          };
          return [...updated, newDay].sort((a, b) => a.dayNumber - b.dayNumber);
        }

        return updated.map(d => {
          if (d.dayNumber === toDay) {
            return {
              ...d,
              activities: [...d.activities, actToInsert].sort((a, b) => a.time.localeCompare(b.time))
            };
          }
          return d;
        });
      });

      showToast(`تم نقل النشاط إلى اليوم ${toDay} بنجاح ✨`);
    },
    [showToast]
  );

  const toggleSaveItem = useCallback(
    (itemId: string) => {
      setSavedItems(prev => {
        const exists = prev.includes(itemId);
        const updated = exists ? prev.filter(id => id !== itemId) : [...prev, itemId];
        showToast(exists ? 'Removed from saved experiences' : 'Saved to your Dahab bucket list ⭐');
        return updated;
      });
    },
    [showToast]
  );

  // See the note in UIContext.
  const value = useMemo<ItineraryContextType>(
    () => ({
      profile,
      setProfile,
      updateProfile,
      tripDays,
      setTripDays,
      addActivityToDay,
      removeActivityFromDay,
      updateActivityInDay,
      shiftActivityBetweenDays,
      activeFoodOrder,
      setActiveFoodOrder,
      savedItems,
      setSavedItems,
      toggleSaveItem
    }),
    [
      profile,
      updateProfile,
      tripDays,
      addActivityToDay,
      removeActivityFromDay,
      updateActivityInDay,
      shiftActivityBetweenDays,
      activeFoodOrder,
      savedItems,
      toggleSaveItem
    ]
  );

  return <ItineraryContext.Provider value={value}>{children}</ItineraryContext.Provider>;
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};
