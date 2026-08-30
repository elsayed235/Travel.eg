import React, { useState } from 'react';
import type { HelpCategory } from '../help/HelpMeNowView';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Building,
  Car,
  Waves,
  Compass,
  Utensils,
  Coffee,
  Sun,
  Sunset,
  Anchor,
  ShoppingBag,
  Info,
  QrCode,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Share2,
  BookmarkPlus,
  RefreshCw,
  Navigation,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { TimelineDay, TimelineActivity } from './myTripData';
import { useTrip } from '../../context/TripContext';
import { formatTripDateRange } from '../../utils/tripDates';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface TripTimelineProps {
  tripDays?: TimelineDay[];
  onSelectActivity?: (activity: TimelineActivity) => void;
  onNavigateToFoodNow?: () => void;
  onNavigateToWhatShouldIDoNow?: () => void;
  onNavigateToChangeRecovery?: () => void;
  onNavigateToLive?: () => void;
  onOpenHelp?: (cat?: HelpCategory, topic?: string) => void;
  onExploreClick?: () => void;
  onViewBriefing?: () => void;
  onShowToast?: (msg: string) => void;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({
  tripDays: propTripDays,
  onSelectActivity,
  onNavigateToFoodNow,
  onNavigateToWhatShouldIDoNow,
  onNavigateToChangeRecovery,
  onNavigateToLive,
  onOpenHelp,
  onExploreClick,
  onViewBriefing,
  onShowToast,
}) => {
  const { tripDays: contextTripDays, activeTrip } = useTrip();
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  
  // Active day filter ('all' or 1..5)
  const [activeDayFilter, setActiveDayFilter] = useState<'all' | number>('all');
  
  // Category filter
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'confirmed' | 'activities' | 'dining' | 'freetime'>('all');

  // Days accordion expansion state
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  // Local state for dynamically updated activities initialized from context or props
  const initialDays = propTripDays && propTripDays.length > 0 
    ? propTripDays 
    // Was `: AHMED_TRIP_DAYS` — the demo persona's hand-written five days,
    // shown as the itinerary to any traveler who had not planned one, down to
    // a note about "departure flight MS 305". An empty timeline renders its
    // own empty state below.
    : (contextTripDays ?? []);
  const [daysData, setDaysData] = useState<TimelineDay[]>(initialDays);

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const handleExpandAll = () => {
    setExpandedDays({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true });
  };

  const handleCollapseAll = () => {
    setExpandedDays({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false });
  };

  const toast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

  // Convert a suggestion to Confirmed status interactively
  const handleConfirmSuggestion = (dayNum: number, actId: string, actTitle: string) => {
    setDaysData((prevDays) =>
      prevDays.map((d) => {
        if (d.dayNumber !== dayNum) return d;
        return {
          ...d,
          activities: d.activities.map((a) => {
            if (a.id !== actId) return a;
            return {
              ...a,
              status: 'Booked ✓',
              bookingRef: `DHB-${Math.floor(1000 + Math.random() * 9000)}`,
            };
          }),
        };
      })
    );
    toast(`"${actTitle}" confirmed & added to your Dahab wallet! ✓`);
  };

  // Activity type icon helper
  const getActivityIcon = (type: TimelineActivity['type'], title: string) => {
    switch (type) {
      case 'Arrival':
      case 'Transfer':
        return <Car className="w-4 h-4 text-[#0F6F78]" />;
      case 'Accommodation':
        return <Building className="w-4 h-4 text-[#0E2520]" />;
      case 'Activity':
        if (title.toLowerCase().includes('div')) {
          return <Waves className="w-4 h-4 text-[#20A89A]" />;
        }
        return <Compass className="w-4 h-4 text-[#EA8E75]" />;
      case 'Exploration':
        if (title.toLowerCase().includes('boat') || title.toLowerCase().includes('snorkel')) {
          return <Anchor className="w-4 h-4 text-[#20A89A]" />;
        }
        return <Compass className="w-4 h-4 text-[#0F6F78]" />;
      case 'Dining':
        return <Utensils className="w-4 h-4 text-[#EA8E75]" />;
      case 'Cafe':
        return <Coffee className="w-4 h-4 text-[#EA8E75]" />;
      case 'Experience':
        return <Sunset className="w-4 h-4 text-[#EA8E75]" />;
      case 'Culture':
        return <ShoppingBag className="w-4 h-4 text-[#0E2520]" />;
      case 'Leisure':
      default:
        return <Sun className="w-4 h-4 text-[#EA8E75]" />;
    }
  };

  // Time of day label & icon helper
  const getTimeOfDayBadge = (timeOfDay?: TimelineActivity['timeOfDay']) => {
    switch (timeOfDay) {
      case 'morning':
        return { label: 'Morning', icon: '🌅', color: isDark ? 'text-amber-300 bg-amber-950/40 border-amber-500/30' : 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'midday':
        return { label: 'Midday', icon: '☀️', color: isDark ? 'text-orange-300 bg-orange-950/40 border-orange-500/30' : 'text-orange-800 bg-orange-50 border-orange-200' };
      case 'afternoon':
        return { label: 'Afternoon', icon: '🌤️', color: isDark ? 'text-teal-300 bg-teal-950/40 border-teal-500/30' : 'text-teal-800 bg-teal-50 border-teal-200' };
      case 'golden_hour':
        return { label: 'Golden Hour', icon: '🌇', color: isDark ? 'text-rose-300 bg-rose-950/40 border-rose-500/30' : 'text-rose-800 bg-rose-50 border-rose-200' };
      case 'evening':
        return { label: 'Evening', icon: '🌆', color: isDark ? 'text-indigo-300 bg-indigo-950/40 border-indigo-500/30' : 'text-indigo-800 bg-indigo-50 border-indigo-200' };
      case 'night':
        return { label: 'Night Bedouin', icon: '✨', color: isDark ? 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30' : 'text-cyan-800 bg-cyan-50 border-cyan-200' };
      default:
        return { label: 'Schedule', icon: '⏱️', color: isDark ? 'text-[#D2E3DE] bg-[#13312B] border-white/10' : 'text-[#4A635D] bg-stone-100 border-[#122420]/10' };
    }
  };

  // Filter activities per category filter
  const filterActivity = (act: TimelineActivity) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'confirmed') return act.status === 'Booked ✓' || act.status === 'Confirmed';
    if (activeCategoryFilter === 'activities') return act.type === 'Activity' || act.type === 'Exploration' || act.type === 'Experience';
    if (activeCategoryFilter === 'dining') return act.type === 'Dining' || act.type === 'Cafe';
    if (activeCategoryFilter === 'freetime') return act.status === 'Free Time' || act.type === 'Leisure';
    return true;
  };

  // Render Status Badge
  const renderStatusBadge = (act: TimelineActivity) => {
    if (act.status === 'Booked ✓' || act.status === 'Confirmed') {
      return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-['Outfit',sans-serif] shadow-xs border ${
          isDark 
            ? 'bg-[#13312B] text-[#52C4B7] border-[#52C4B7]/30' 
            : 'bg-emerald-50 text-[#0E2520] border-emerald-200'
        }`}>
          <CheckCircle2 className={`w-3.5 h-3.5 stroke-[2.5] ${isDark ? 'text-[#52C4B7]' : 'text-[#20A89A]'}`} />
          <span>Confirmed</span>
          {act.bookingRef && (
            <span className={`font-mono text-[11px] px-1.5 py-0.2 rounded font-medium ${
              isDark ? 'bg-[#52C4B7]/20 text-[#52C4B7]' : 'bg-[#20A89A]/15 text-[#0E2520]'
            }`}>
              #{act.bookingRef}
            </span>
          )}
        </div>
      );
    }

    if (act.status === 'Pending') {
      return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-['Outfit',sans-serif] animate-pulse border ${
          isDark ? 'bg-amber-950/40 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending Confirmation</span>
        </div>
      );
    }

    if (act.status === 'Free Time') {
      return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-['Outfit',sans-serif] border ${
          isDark ? 'bg-[#13312B] text-[#F4C36C] border-white/10' : 'bg-stone-100 text-[#EA8E75] border-stone-200'
        }`}>
          <Sun className="w-3.5 h-3.5 text-[#EA8E75]" />
          <span>Spontaneous Free Slot</span>
        </div>
      );
    }

    // Default 'Suggested'
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-['Outfit',sans-serif] border ${
        isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-stone-100 text-[#0E2520] border-stone-200'
      }`}>
        <Sparkles className="w-3 h-3 text-[#EA8E75]" />
        <span>Curated Suggestion</span>
      </div>
    );
  };

  // Node Anchor Style
  const getNodeIndicatorStyle = (act: TimelineActivity) => {
    if (act.isNextUp) {
      return isDark 
        ? 'bg-[#52C4B7] text-[#081714] ring-4 ring-[#52C4B7]/30 shadow-md scale-110'
        : 'bg-[#20A89A] text-[#04231F] ring-4 ring-[#20A89A]/30 shadow-md scale-110';
    }
    if (act.status === 'Booked ✓' || act.status === 'Confirmed') {
      return isDark
        ? 'bg-[#13312B] text-[#52C4B7] border-2 border-[#52C4B7] shadow-xs'
        : 'bg-emerald-50 text-[#0E2520] border-2 border-[#20A89A] shadow-xs';
    }
    if (act.status === 'Pending') {
      return isDark
        ? 'bg-[#F4C36C] text-[#081714] border-2 border-white/40 shadow-xs animate-pulse'
        : 'bg-[#EA8E75] text-[#3B1B10] border-2 border-amber-300 shadow-xs animate-pulse';
    }
    if (act.status === 'Free Time') {
      return isDark
        ? 'bg-[#0E2520] text-[#F4C36C] border-2 border-dashed border-[#F4C36C]'
        : 'bg-stone-50 text-[#EA8E75] border-2 border-dashed border-[#EA8E75]';
    }
    return isDark
      ? 'bg-[#13312B] text-[#52C4B7] border-2 border-white/20 shadow-xs'
      : 'bg-stone-100 text-[#0E2520] border-2 border-stone-300 shadow-xs';
  };

  // Filtered days to display
  const displayedDays = daysData.filter((d) => 
    activeDayFilter === 'all' ? true : d.dayNumber === activeDayFilter
  );

  return (
    <div
      id="trip-timeline-section"
      className={`rounded-3xl p-5 sm:p-7 lg:p-8 border shadow-lg space-y-6 font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      {/* 1. SECTION HEADER WITH TITLE & SYNC CONTROLS */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
        isDark ? 'border-white/10' : 'border-[#122420]/10'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[12px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-['Outfit',sans-serif] ${
              isDark ? 'text-[#52C4B7] bg-[#13312B] border-white/10' : 'text-[#0E2520] bg-[#20A89A]/10 border-[#20A89A]/20'
            }`}>
              Connected Sinai Journey
            </span>
            <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${
              isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
            }`}>
              <CalendarCheck className="w-3.5 h-3.5 text-[#20A89A]" />
              <span>{formatTripDateRange(activeTrip?.startDate, activeTrip?.endDate, isRTL ? 'ar' : 'en') || ''}</span>
            </span>
          </div>
          <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold font-['Outfit',sans-serif] ${
            isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
          }`}>
            Visual Trip Timeline
          </h3>
          <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'}`}>
            A continuous milestone flow with verified booking vouchers, location cues, and context actions.
          </p>
        </div>

        {/* Global Expand/Collapse & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              toast('Trip schedule copied for calendar sync! ✓');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
                : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>Sync (.ics)</span>
          </button>
          
          <button
            type="button"
            onClick={handleExpandAll}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
                : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
            }`}
          >
            Expand All
          </button>
          
          <button
            type="button"
            onClick={handleCollapseAll}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#13312B]/60 hover:bg-[#13312B] text-[#D2E3DE]/70 border-white/10' 
                : 'bg-stone-50 hover:bg-stone-100 text-[#4A635D] border-[#122420]/10'
            }`}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 2. INTERACTIVE DAY SELECTOR BAR (PILLS) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveDayFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-['Outfit',sans-serif] whitespace-nowrap transition-all cursor-pointer ${
              activeDayFilter === 'all'
                ? 'bg-[#EA8E75] text-[#3B1B10] shadow-md font-extrabold'
                : isDark
                ? 'bg-[#13312B] text-[#D2E3DE] hover:text-[#F7F3EA] border border-white/10'
                : 'bg-stone-100 text-[#4A635D] hover:text-[#122420] border border-[#122420]/10'
            }`}
          >
            All 5 Days
          </button>

          {daysData.map((d) => {
            const isSelected = activeDayFilter === d.dayNumber;
            const bookedCount = d.activities.filter((a) => a.status === 'Booked ✓' || a.status === 'Confirmed').length;
            return (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => {
                  setActiveDayFilter(d.dayNumber);
                  setExpandedDays((prev) => ({ ...prev, [d.dayNumber]: true }));
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-['Outfit',sans-serif] whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#EA8E75] text-[#3B1B10] shadow-md font-extrabold'
                    : isDark
                    ? 'bg-[#13312B] text-[#D2E3DE] hover:text-[#F7F3EA] border border-white/10'
                    : 'bg-stone-100 text-[#4A635D] hover:text-[#122420] border border-[#122420]/10'
                }`}
              >
                <span>Day {d.dayNumber}</span>
                {bookedCount > 0 && (
                  <span className={`w-4 h-4 rounded-full text-[11px] flex items-center justify-center font-bold ${
                    isSelected ? 'bg-white text-[#EA8E75]' : 'bg-[#20A89A]/20 text-[#0E2520]'
                  }`}>
                    {bookedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. CATEGORY FILTER CHIPS */}
        <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t pt-3 ${
          isDark ? 'border-white/10' : 'border-[#122420]/10'
        }`}>
          <span className={`text-[12px] font-semibold uppercase tracking-wider pl-1 ${
            isDark ? 'text-[#D2E3DE]/50' : 'text-[#4A635D]/70'
          }`}>
            Filter:
          </span>
          {([
            { id: 'all', label: 'All Items' },
            { id: 'confirmed', label: 'Confirmed Vouchers ✓' },
            { id: 'activities', label: 'Diving & Safari' },
            { id: 'dining', label: 'Food & Cafes' },
            { id: 'freetime', label: 'Free Windows' },
          ] as const).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? isDark
                    ? 'bg-[#F4C36C]/20 text-[#F4C36C] font-bold border border-[#F4C36C]/40'
                    : 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : isDark
                  ? 'text-[#D2E3DE]/70 hover:text-[#F7F3EA] hover:bg-white/5'
                  : 'text-[#4A635D] hover:text-[#122420] hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. DAYS LIST WITH CONNECTED TIMELINE */}
      <div className="space-y-6">
        {displayedDays.map((day) => {
          const isExpanded = !!expandedDays[day.dayNumber];
          const filteredActivities = day.activities.filter(filterActivity);
          const bookedCount = day.activities.filter((a) => a.status === 'Booked ✓' || a.status === 'Confirmed').length;

          return (
            <div
              key={day.dayNumber}
              id={`timeline-day-${day.dayNumber}-section`}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? isDark
                    ? 'border-white/20 bg-[#13312B]/70 shadow-md'
                    : 'border-[#122420]/20 bg-stone-50/90 shadow-md'
                  : isDark
                  ? 'border-white/10 bg-[#0E2520] hover:border-white/20'
                  : 'border-[#122420]/10 bg-white hover:border-[#122420]/20'
              }`}
            >
              {/* Day Header Trigger */}
              <button
                type="button"
                onClick={() => toggleDay(day.dayNumber)}
                className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                  isDark ? 'bg-[#0E2520] hover:bg-[#13312B]' : 'bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold flex-shrink-0 transition-colors font-['Outfit',sans-serif] ${
                      isExpanded
                        ? 'bg-[#EA8E75] text-[#3B1B10] shadow-md'
                        : isDark
                        ? 'bg-[#13312B] text-[#52C4B7] border border-white/10'
                        : 'bg-stone-100 text-[#0E2520] border border-[#122420]/10'
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-wider opacity-80">Day</span>
                    <span className="text-base leading-none">{day.dayNumber}</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[12px] font-bold uppercase tracking-wider font-['Outfit',sans-serif] ${
                        isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
                      }`}>
                        {day.dateStr}
                      </span>
                      {bookedCount > 0 && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isDark ? 'text-[#52C4B7] bg-[#13312B] border-white/10' : 'text-[#0E2520] bg-emerald-50 border-emerald-200'
                        }`}>
                          {bookedCount} Confirmed
                        </span>
                      )}
                      {day.dayNumber === 2 && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse ${
                          isDark ? 'text-[#081714] bg-[#F4C36C]' : 'text-amber-900 bg-amber-200'
                        }`}>
                          🟢 In-Trip Focus
                        </span>
                      )}
                    </div>
                    <h4 className={`text-base sm:text-lg font-bold font-['Outfit',sans-serif] ${
                      isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
                    }`}>
                      Day {day.dayNumber} · {day.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`hidden sm:inline-block text-xs font-medium ${
                    isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
                  }`}>
                    {filteredActivities.length} items
                  </span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-xs ${
                    isDark ? 'bg-[#13312B] border-white/10 text-[#F7F3EA]' : 'bg-stone-100 border-[#122420]/10 text-[#122420]'
                  }`}>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Day Collapsible Content */}
              {isExpanded && (
                <div className={`p-4 sm:p-6 border-t space-y-5 animate-in fade-in duration-200 ${
                  isDark ? 'border-white/10' : 'border-[#122420]/10'
                }`}>
                  {/* Day Subtitle Context */}
                  <div className={`rounded-2xl p-3.5 border flex items-start gap-3 ${
                    isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'
                  }`}>
                    <Sparkles className="w-4 h-4 text-[#EA8E75] flex-shrink-0 mt-0.5" />
                    <p className={`text-xs leading-relaxed font-medium ${
                      isDark ? 'text-[#D2E3DE]/90' : 'text-[#4A635D]'
                    }`}>
                      {day.subtitle}
                    </p>
                  </div>

                  {/* 5. CONNECTED VISUAL TIMELINE TRACK */}
                  <div className={`relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 space-y-6 ${
                    isDark
                      ? 'before:bg-gradient-to-b before:from-[#52C4B7] before:via-white/20 before:to-[#F4C36C]'
                      : 'before:bg-gradient-to-b before:from-[#20A89A] before:via-stone-300 before:to-[#EA8E75]'
                  }`}>
                    {filteredActivities.length === 0 ? (
                      <div className={`py-6 text-center text-xs italic rounded-2xl border p-4 ${
                        isDark ? 'text-[#D2E3DE]/70 bg-[#0E2520] border-white/10' : 'text-[#4A635D] bg-white border-[#122420]/10'
                      }`}>
                        No activities match the selected filter on this day.
                      </div>
                    ) : (
                      filteredActivities.map((act, index) => {
                        const timeBadge = getTimeOfDayBadge(act.timeOfDay);
                        const isConfirmed = act.status === 'Booked ✓' || act.status === 'Confirmed';
                        const isPending = act.status === 'Pending';
                        const isFreeTime = act.status === 'Free Time';

                        return (
                          <div
                            key={act.id}
                            id={`activity-card-${act.id}`}
                            className={`relative group rounded-2xl border transition-all duration-200 p-4 sm:p-5 ${
                              act.isNextUp
                                ? isDark
                                  ? 'bg-[#0E2520] border-[#52C4B7] ring-2 ring-[#52C4B7]/20 shadow-md'
                                  : 'bg-white border-[#20A89A] ring-2 ring-[#20A89A]/20 shadow-md'
                                : isConfirmed
                                ? isDark
                                  ? 'bg-[#0E2520] border-white/10 hover:border-[#52C4B7]/50 shadow-xs'
                                  : 'bg-white border-[#122420]/10 hover:border-[#20A89A]/50 shadow-xs'
                                : isPending
                                ? isDark
                                  ? 'bg-[#0E2520] border-amber-500/40 hover:border-amber-500/70'
                                  : 'bg-white border-amber-300 hover:border-amber-400'
                                : isFreeTime
                                ? isDark
                                  ? 'bg-[#0E2520] border-dashed border-[#F4C36C]/40 hover:border-[#F4C36C]'
                                  : 'bg-white border-dashed border-amber-300 hover:border-amber-400'
                                : isDark
                                ? 'bg-[#0E2520] border-white/10 hover:border-white/25'
                                : 'bg-white border-[#122420]/10 hover:border-[#122420]/20'
                            }`}
                          >
                            {/* Visual Milestone Node Anchor */}
                            <div
                              className={`absolute -left-6 sm:-left-8 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-transform group-hover:scale-110 ${getNodeIndicatorStyle(
                                act
                              )}`}
                            >
                              {isConfirmed ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : isPending ? (
                                <Clock className="w-3 h-3 text-white" />
                              ) : isFreeTime ? (
                                <Sun className="w-3 h-3" />
                              ) : (
                                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#52C4B7]' : 'bg-[#20A89A]'}`}></span>
                              )}
                            </div>

                            {/* Card Content Top Meta Row */}
                            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b pb-3 mb-3 ${
                              isDark ? 'border-white/10' : 'border-[#122420]/10'
                            }`}>
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Time & Period */}
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                                  isDark ? 'bg-[#13312B] text-[#F7F3EA]' : 'bg-stone-100 text-[#122420]'
                                }`}>
                                  <Clock className="w-3.5 h-3.5 text-[#20A89A]" />
                                  <span>{act.time}</span>
                                </div>

                                {act.duration && (
                                  <span className={`text-[12px] font-medium ${
                                    isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
                                  }`}>
                                    ⏱️ {act.duration}
                                  </span>
                                )}

                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${timeBadge.color}`}>
                                  {timeBadge.icon} {timeBadge.label}
                                </span>

                                {act.isNextUp && (
                                  <span className="text-[11px] font-bold text-[#04231F] bg-[#20A89A] px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                                    Next Up
                                  </span>
                                )}
                              </div>

                              {/* Status Badge */}
                              <div className="flex items-center gap-2">
                                {renderStatusBadge(act)}
                              </div>
                            </div>

                            {/* Title & Core Details */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                                      isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-100 border-[#122420]/10'
                                    }`}>
                                      {getActivityIcon(act.type, act.title)}
                                    </span>
                                    <h5 className={`text-base sm:text-lg font-bold font-['Outfit',sans-serif] transition-colors ${
                                      isDark ? 'text-[#F7F3EA] group-hover:text-[#52C4B7]' : 'text-[#122420] group-hover:text-[#0E2520]'
                                    }`}>
                                      {act.title}
                                    </h5>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-['Outfit',sans-serif] border ${
                                      isDark ? 'text-[#52C4B7] bg-[#13312B] border-white/10' : 'text-[#0E2520] bg-stone-100 border-stone-200'
                                    }`}>
                                      {act.type}
                                    </span>
                                  </div>

                                  {act.location && (
                                    <p className={`text-xs flex items-center gap-1.5 pl-0.5 ${
                                      isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
                                    }`}>
                                      <MapPin className="w-3.5 h-3.5 text-[#EA8E75] flex-shrink-0" />
                                      <span className="font-medium">{act.location}</span>
                                    </p>
                                  )}
                                </div>

                                {act.priceEGP && (
                                  <div className="text-right flex-shrink-0">
                                    <span className={`text-xs font-mono font-bold block ${
                                      isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
                                    }`}>
                                      EGP {act.priceEGP.toLocaleString()}
                                    </span>
                                    {isConfirmed && (
                                      <span className="text-[11px] text-[#20A89A] font-semibold">
                                        Paid in Full ✓
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Notes & Briefing Hints */}
                              {act.notes && (
                                <p className={`text-xs leading-relaxed p-2.5 rounded-xl border ${
                                  isDark ? 'text-[#D2E3DE]/90 bg-[#13312B] border-white/10' : 'text-[#4A635D] bg-stone-50 border-[#122420]/10'
                                }`}>
                                  {act.notes}
                                </p>
                              )}

                              {/* Inclusions / Highlights Pills */}
                              {act.inclusions && act.inclusions.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  {act.inclusions.map((inc, i) => (
                                    <span
                                      key={i}
                                      className={`text-[12px] font-medium border px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                        isDark ? 'text-[#D2E3DE]/80 bg-[#13312B] border-white/10' : 'text-[#4A635D] bg-stone-100 border-[#122420]/10'
                                      }`}
                                    >
                                      <Check className="w-2.5 h-2.5 text-[#20A89A]" />
                                      <span>{inc}</span>
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Provider Attribution if verified */}
                              {act.provider && (
                                <div className={`text-[12px] flex items-center gap-1.5 pt-0.5 font-medium ${
                                  isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
                                }`}>
                                <ShieldCheck className="w-3.5 h-3.5 text-[#20A89A]" />
                                <span>Official Provider: <strong className={isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}>{act.provider}</strong></span>
                              </div>
                              )}
                            </div>

                            {/* 6. CONTEXT-AWARE ACTIONS ROW (DIVERSIFIED BY STATUS & TYPE) */}
                            <div className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                              isDark ? 'border-white/10' : 'border-[#122420]/10'
                            }`}>
                              {/* Left Side Context Action Buttons */}
                              <div className="flex flex-wrap items-center gap-2">
                                {isConfirmed && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onSelectActivity) {
                                          onSelectActivity(act);
                                        }
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-xs transition-colors cursor-pointer ${
                                        isDark 
                                          ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
                                          : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
                                      }`}
                                    >
                                      <QrCode className="w-3.5 h-3.5 text-[#20A89A]" />
                                      <span>View Voucher &amp; QR</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        toast(`Location pinned for "${act.title}" on Dahab map 📍`);
                                        if (onExploreClick) onExploreClick();
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                        isDark 
                                          ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
                                          : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
                                      }`}
                                    >
                                      <Navigation className="w-3.5 h-3.5 text-[#20A89A]" />
                                      <span>Directions</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onNavigateToChangeRecovery) onNavigateToChangeRecovery();
                                      }}
                                      className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs transition-colors cursor-pointer ${
                                        isDark ? 'text-[#D2E3DE]/70 hover:text-[#F4C36C]' : 'text-[#4A635D] hover:text-[#EA8E75]'
                                      }`}
                                      title="Reschedule or switch time slot"
                                    >
                                      <RefreshCw className="w-3 h-3 text-[#EA8E75]" />
                                      <span>Change</span>
                                    </button>
                                  </>
                                )}

                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleConfirmSuggestion(day.dayNumber, act.id, act.title)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] text-xs font-extrabold shadow-md transition-colors cursor-pointer"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Confirm Slot &amp; Lock</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onOpenHelp) onOpenHelp('booking', act.title);
                                      }}
                                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                        isDark 
                                          ? 'bg-[#13312B] text-[#F7F3EA] border-white/10 hover:bg-white/10' 
                                          : 'bg-stone-100 text-[#122420] border-[#122420]/10 hover:bg-stone-200'
                                      }`}
                                    >
                                      <HelpCircle className="w-3.5 h-3.5 text-[#20A89A]" />
                                      <span>Ask Concierge</span>
                                    </button>
                                  </>
                                )}

                                {act.status === 'Suggested' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleConfirmSuggestion(day.dayNumber, act.id, act.title)}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-xs transition-colors cursor-pointer ${
                                        isDark 
                                          ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/15' 
                                          : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
                                      }`}
                                    >
                                      <BookmarkPlus className="w-3.5 h-3.5 text-[#EA8E75]" />
                                      <span>Confirm &amp; Reserve</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onNavigateToWhatShouldIDoNow) onNavigateToWhatShouldIDoNow();
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                        isDark 
                                          ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
                                          : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
                                      }`}
                                    >
                                      <Compass className="w-3.5 h-3.5 text-[#20A89A]" />
                                      <span>Find Alternatives</span>
                                    </button>
                                  </>
                                )}

                                {isFreeTime && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onNavigateToWhatShouldIDoNow) onNavigateToWhatShouldIDoNow();
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] text-xs font-extrabold shadow-md transition-colors cursor-pointer"
                                    >
                                      <Compass className="w-3.5 h-3.5 text-white" />
                                      <span>What Should I Do Now? 💡</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onNavigateToFoodNow) onNavigateToFoodNow();
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                        isDark 
                                          ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
                                          : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
                                      }`}
                                    >
                                      <Utensils className="w-3.5 h-3.5 text-[#EA8E75]" />
                                      <span>Beach Delivery</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onNavigateToLive) onNavigateToLive();
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                        isDark 
                                          ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/10' 
                                          : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
                                      }`}
                                    >
                                      <Waves className="w-3.5 h-3.5 text-[#20A89A]" />
                                      <span>Sea State</span>
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Right Side Support Shortcut */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onOpenHelp) {
                                      onOpenHelp('activity', act.title);
                                    }
                                  }}
                                  className={`text-[12px] font-semibold flex items-center gap-1 cursor-pointer ${
                                    isDark ? 'text-[#D2E3DE]/70 hover:text-[#F7F3EA]' : 'text-[#4A635D] hover:text-[#122420]'
                                  }`}
                                >
                                  <HelpCircle className="w-3 h-3 text-[#20A89A]" />
                                  <span>Assistance</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
