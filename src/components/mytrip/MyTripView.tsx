import React, { useState } from 'react';
import { TravelerNav } from './TravelerNav';
import { MyTripHeader } from './MyTripHeader';
import { MyTripStatusBadge } from './MyTripStatusBadge';
import { WhatsNextCard } from './WhatsNextCard';
import { TodaysContextCard } from './TodaysContextCard';
import { TripTimeline } from './TripTimeline';
import { BookingsSection } from './BookingsSection';
import { TripToolsSection } from './TripToolsSection';
import { TripStyleSummary } from './TripStyleSummary';
import { SupportCard } from './SupportCard';
import { ManageTripModal } from './ManageTripModal';
import { BookingDetailModal } from './BookingDetailModal';
import { TripToolInfoModal } from './TripToolInfoModal';
import { PreparationPreviewModal } from './PreparationPreviewModal';
import { ConfirmedBookingItem, TimelineActivity } from './myTripData';
import { useTrip } from '../../context/TripContext';
import { Check, Share2, Sparkles, ArrowLeft, FileText, Compass, MapPin, Utensils } from 'lucide-react';
import { PreArrivalBriefing } from '../briefing/PreArrivalBriefing';
import { EarlyArrivalView } from '../arrival/EarlyArrivalView';
import { FirstTwoHoursView } from '../arrival/FirstTwoHoursView';
import { DailyCompanionDay2View } from '../companion/DailyCompanionDay2View';
import { WhatShouldIDoNowView } from '../spontaneous/WhatShouldIDoNowView';
import { FoodNowView } from '../food/FoodNowView';
import { ChangeAndRecoveryView } from '../recovery/ChangeAndRecoveryView';
import { HelpMeNowView, HelpCategory } from '../help/HelpMeNowView';
import { GroupTravelSection } from './GroupTravelSection';
import { SmartBudgetSection } from './SmartBudgetSection';
import { ItineraryAuditorCard } from './ItineraryAuditorCard';
import { DahabLocalIntelligenceCard } from '../tripos/DahabLocalIntelligenceCard';
import { OfflineTripPackModal } from '../expedition/OfflineTripPackModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface MyTripViewProps {
  onBackToHome?: () => void;
  onExploreClick?: () => void;
  initialBriefingOpen?: boolean;
  initialArrivalOpen?: boolean;
  initialFirstTwoHoursOpen?: boolean;
  initialDay2CompanionOpen?: boolean;
  initialWhatShouldIDoNowOpen?: boolean;
  initialFoodNowOpen?: boolean;
  initialChangeRecoveryOpen?: boolean;
  initialHelpMeNowOpen?: boolean;
}

export const MyTripView: React.FC<MyTripViewProps> = ({
  onBackToHome,
  onExploreClick,
  initialBriefingOpen = false,
  initialArrivalOpen = false,
  initialFirstTwoHoursOpen = false,
  initialDay2CompanionOpen = false,
  initialWhatShouldIDoNowOpen = false,
  initialFoodNowOpen = false,
  initialChangeRecoveryOpen = false,
  initialHelpMeNowOpen = false,
}) => {
  // The traveler's real bookings, loaded once by CommerceContext.
  const { bookings } = useTrip();
  const [activeTab, setActiveTab] = useState<'home' | 'mytrip' | 'explore' | 'bookings' | 'profile'>('mytrip');
  const [isHelpMeNowOpen, setIsHelpMeNowOpen] = useState<boolean>(initialHelpMeNowOpen);
  const [helpCategory, setHelpCategory] = useState<HelpCategory | undefined>(undefined);
  const [helpTopic, setHelpTopic] = useState<string | undefined>(undefined);
  const [isChangeRecoveryOpen, setIsChangeRecoveryOpen] = useState<boolean>(initialChangeRecoveryOpen);
  const [isFoodNowOpen, setIsFoodNowOpen] = useState<boolean>(initialFoodNowOpen);
  const [isWhatShouldIDoNowOpen, setIsWhatShouldIDoNowOpen] = useState<boolean>(initialWhatShouldIDoNowOpen);
  const [isDay2CompanionOpen, setIsDay2CompanionOpen] = useState<boolean>(initialDay2CompanionOpen);
  const [isFirstTwoHoursOpen, setIsFirstTwoHoursOpen] = useState<boolean>(initialFirstTwoHoursOpen);
  const [isEarlyArrivalOpen, setIsEarlyArrivalOpen] = useState<boolean>(initialArrivalOpen);
  const [isBriefingViewOpen, setIsBriefingViewOpen] = useState<boolean>(initialBriefingOpen);
  
  // Modals state
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isOfflinePackOpen, setIsOfflinePackOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ConfirmedBookingItem | null>(null);
  const [selectedTool, setSelectedTool] = useState<{ id: string; title: string; description: string } | null>(null);
  const { isDark } = useTheme();
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNavigate = (tab: 'home' | 'mytrip' | 'explore' | 'bookings' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home' && onBackToHome) {
      onBackToHome();
    } else if (tab === 'explore' && onExploreClick) {
      onExploreClick();
    } else if (tab === 'bookings') {
      setIsBriefingViewOpen(false);
      setIsEarlyArrivalOpen(false);
      setIsFirstTwoHoursOpen(false);
      const el = document.getElementById('your-bookings-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (tab === 'profile') {
      showToast('Logged in as Ahmed (ahmed.traveler@example.com)');
    }
  };

  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ahmed’s 5-Day Dahab Trip',
        text: 'Review my confirmed Dahab trip itinerary and bookings.',
        url: window.location.href,
      }).catch(() => {
        showToast('Trip itinerary link copied to clipboard! ✓');
      });
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast('Trip itinerary link copied to clipboard! ✓');
    }
  };

  const handleSelectManageOption = (opt: string) => {
    showToast(`Opening "${opt}" settings...`);
  };

  const handleOpenTool = (id: string, title: string, description: string, cat?: HelpCategory, topic?: string) => {
    if (id === 'help-me-now') {
      setHelpCategory(cat);
      setHelpTopic(topic);
      setIsHelpMeNowOpen(true);
      setIsChangeRecoveryOpen(false);
      setIsFoodNowOpen(false);
      setIsWhatShouldIDoNowOpen(false);
      setIsDay2CompanionOpen(false);
      setIsFirstTwoHoursOpen(false);
      setIsEarlyArrivalOpen(false);
      setIsBriefingViewOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSelectedTool({ id, title, description });
  };

  // If in dedicated "Help Me Now" Experience (Real-time live problem resolution)
  if (isHelpMeNowOpen) {
    return (
      <HelpMeNowView
        onBackToMyTrip={() => {
          setIsHelpMeNowOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToCompanion={() => {
          setIsHelpMeNowOpen(false);
          setIsDay2CompanionOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToChangeRecovery={() => {
          setIsHelpMeNowOpen(false);
          setIsChangeRecoveryOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToArrival={() => {
          setIsHelpMeNowOpen(false);
          setIsEarlyArrivalOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreClick={onExploreClick}
        initialCategory={helpCategory}
        initialTopic={helpTopic}
      />
    );
  }

  // If in dedicated "Change & Recovery" Disruption Resolution Mode (Current real-time state: 10:00 AM Boat Trip change)
  if (isChangeRecoveryOpen) {
    return (
      <ChangeAndRecoveryView
        onBackToMyTrip={() => {
          setIsChangeRecoveryOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToCompanion={() => {
          setIsChangeRecoveryOpen(false);
          setIsDay2CompanionOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreClick={onExploreClick}
        onOpenHelp={(topic) => {
          setIsChangeRecoveryOpen(false);
          setHelpCategory('activity');
          setHelpTopic(topic || 'Activity changed');
          setIsHelpMeNowOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onTripUpdated={({ activity, newTime, day }) => {
          showToast(`"${activity}" confirmed for ${day || newTime} ✓`);
        }}
      />
    );
  }

  // If in dedicated "Food Now" Experience (Current real-time state: 01:00 PM, hungry, 2h before 03:00 PM activity)
  if (isFoodNowOpen) {
    return (
      <FoodNowView
        onBackToMyTrip={() => {
          setIsFoodNowOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToCompanion={() => {
          setIsFoodNowOpen(false);
          setIsDay2CompanionOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreClick={onExploreClick}
        onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
        onMealAddedToTrip={(meal) => {
          showToast(`"${meal.title}" added to Day 2 timeline ✓`);
        }}
      />
    );
  }

  // If in dedicated "What Should I Do Now?" Spontaneous Decision Mode (Current real-time state)
  if (isWhatShouldIDoNowOpen) {
    return (
      <WhatShouldIDoNowView
        onBackToMyTrip={() => {
          setIsWhatShouldIDoNowOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToCompanion={() => {
          setIsWhatShouldIDoNowOpen(false);
          setIsDay2CompanionOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToFoodNow={() => {
          setIsWhatShouldIDoNowOpen(false);
          setIsFoodNowOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreClick={onExploreClick}
        onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
        onActivityAddedToTrip={(act) => {
          showToast(`"${act.title}" added to Day 2 schedule ✓`);
        }}
      />
    );
  }

  // If in dedicated Daily Trip Companion — Day 2 Mode
  if (isDay2CompanionOpen) {
    return (
      <DailyCompanionDay2View
        onBackToMyTrip={() => {
          setIsDay2CompanionOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToChangeRecovery={() => {
          setIsDay2CompanionOpen(false);
          setIsChangeRecoveryOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToFoodNow={() => {
          setIsDay2CompanionOpen(false);
          setIsFoodNowOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToWhatShouldIDoNow={() => {
          setIsDay2CompanionOpen(false);
          setIsWhatShouldIDoNowOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToFirstTwoHours={() => {
          setIsDay2CompanionOpen(false);
          setIsFirstTwoHoursOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToEarlyArrival={() => {
          setIsDay2CompanionOpen(false);
          setIsEarlyArrivalOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreClick={onExploreClick}
        onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
      />
    );
  }

  // If in dedicated First 2 Hours - Personalized Mini Itinerary Mode
  if (isFirstTwoHoursOpen) {
    return (
      <FirstTwoHoursView
        onBackToMyTrip={() => {
          setIsFirstTwoHoursOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToEarlyArrival={() => {
          setIsFirstTwoHoursOpen(false);
          setIsEarlyArrivalOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreClick={onExploreClick}
        onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
      />
    );
  }

  // If in dedicated Early Arrival Experience Mode (Current live trip state)
  if (isEarlyArrivalOpen) {
    return (
      <EarlyArrivalView
        onBackToMyTrip={() => {
          setIsEarlyArrivalOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToFirstTwoHours={() => {
          setIsEarlyArrivalOpen(false);
          setIsFirstTwoHoursOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreClick={onExploreClick}
        onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
      />
    );
  }

  // If in dedicated Pre-Arrival Briefing Mode
  if (isBriefingViewOpen) {
    return (
      <PreArrivalBriefing
        onBackToMyTrip={() => {
          setIsBriefingViewOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReadyConfirmed={() => {
          setIsBriefingViewOpen(false);
          setIsFirstTwoHoursOpen(true);
          showToast("Welcome to Dahab! Live First 2 Hours mini-plan activated.");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 md:pb-16 transition-colors duration-200 ${
      isDark ? 'bg-[#081714] text-[#F7F3EA]' : 'bg-[#FAF8F5] text-[#122420]'
    }`}>
      {/* 1. TOP TRAVELER NAVIGATION */}
      <TravelerNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-grow">
        {/* Subtle Back link for convenience + Direct Briefing Pill */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToHome}
            className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'text-[#D2E3DE]/70 hover:text-[#F7F3EA]' : 'text-[#4A635D] hover:text-[#122420]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dahab Home</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="open-help-me-now-quick-btn"
              onClick={() => {
                setIsHelpMeNowOpen(true);
                setIsChangeRecoveryOpen(false);
                setIsFoodNowOpen(false);
                setIsWhatShouldIDoNowOpen(false);
                setIsDay2CompanionOpen(false);
                setIsFirstTwoHoursOpen(false);
                setIsEarlyArrivalOpen(false);
                setIsBriefingViewOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-xs transition-colors cursor-pointer ${
                isDark 
                  ? 'text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border-rose-500/30' 
                  : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border-rose-200'
              }`}
            >
              <span>🆘</span>
              <span>Help Me Now</span>
            </button>

            <button
              type="button"
              id="open-change-recovery-quick-btn"
              onClick={() => {
                setIsChangeRecoveryOpen(true);
                setIsHelpMeNowOpen(false);
                setIsFoodNowOpen(false);
                setIsWhatShouldIDoNowOpen(false);
                setIsDay2CompanionOpen(false);
                setIsFirstTwoHoursOpen(false);
                setIsEarlyArrivalOpen(false);
                setIsBriefingViewOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-xs transition-colors cursor-pointer ${
                isDark 
                  ? 'text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border-amber-500/30' 
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200'
              }`}
            >
              <span>⚠️</span>
              <span>Change &amp; Recovery</span>
            </button>

            <button
              type="button"
              id="open-food-now-quick-btn"
              onClick={() => {
                setIsFoodNowOpen(true);
                setIsChangeRecoveryOpen(false);
                setIsWhatShouldIDoNowOpen(false);
                setIsDay2CompanionOpen(false);
                setIsFirstTwoHoursOpen(false);
                setIsEarlyArrivalOpen(false);
                setIsBriefingViewOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-xs transition-colors cursor-pointer font-['Outfit',sans-serif] ${
                isDark ? 'text-[#081714] bg-[#F4C36C] hover:bg-[#E5B55D]' : 'text-[#3B1B10] bg-[#EA8E75] hover:bg-[#DE7C62]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Food Now 🍽️</span>
            </button>

            <button
              type="button"
              id="open-what-should-i-do-now-quick-btn"
              onClick={() => {
                setIsWhatShouldIDoNowOpen(true);
                setIsFoodNowOpen(false);
                setIsDay2CompanionOpen(false);
                setIsFirstTwoHoursOpen(false);
                setIsEarlyArrivalOpen(false);
                setIsBriefingViewOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                isDark 
                  ? 'text-[#52C4B7] bg-[#13312B] hover:bg-[#13312B]/80 border-white/10' 
                  : 'text-[#0E2520] bg-stone-100 hover:bg-stone-200 border-[#122420]/10'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-[#52C4B7]' : 'text-[#20A89A]'}`} />
              <span>What Should I Do Now?</span>
            </button>

            <button
              type="button"
              id="open-day2-companion-quick-btn"
              onClick={() => {
                setIsDay2CompanionOpen(true);
                setIsWhatShouldIDoNowOpen(false);
                setIsFirstTwoHoursOpen(false);
                setIsEarlyArrivalOpen(false);
                setIsBriefingViewOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                isDark 
                  ? 'text-[#D2E3DE] bg-[#13312B] hover:bg-[#13312B]/80 border-white/10' 
                  : 'text-[#122420] bg-stone-100 hover:bg-stone-200 border-[#122420]/10'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'}`} />
              <span>Day 2 Companion</span>
            </button>

            <button
              type="button"
              id="open-first-two-hours-quick-btn"
              onClick={() => {
                setIsFirstTwoHoursOpen(true);
                setIsDay2CompanionOpen(false);
                setIsEarlyArrivalOpen(false);
                setIsBriefingViewOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                isDark 
                  ? 'text-[#52C4B7] bg-[#13312B] hover:bg-[#13312B]/80 border-white/10' 
                  : 'text-[#0E2520] bg-stone-100 hover:bg-stone-200 border-[#122420]/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#52C4B7]' : 'bg-[#20A89A]'}`}></span>
              <span>Day 1 (First 2 Hours)</span>
            </button>

            <button
              type="button"
              id="open-pre-arrival-briefing-quick-btn"
              onClick={() => {
                setIsBriefingViewOpen(true);
                setIsDay2CompanionOpen(false);
                setIsEarlyArrivalOpen(false);
                setIsFirstTwoHoursOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                isDark 
                  ? 'text-[#D2E3DE] bg-[#13312B] hover:bg-[#13312B]/80 border-white/10' 
                  : 'text-[#122420] bg-stone-100 hover:bg-stone-200 border-[#122420]/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Briefing</span>
            </button>

            <button
              type="button"
              id="open-offline-pack-quick-btn"
              onClick={() => setIsOfflinePackOpen(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-colors cursor-pointer shadow-xs ${
                isDark 
                  ? 'text-[#F4C36C] bg-[#13312B] hover:bg-[#13312B]/80 border-white/10' 
                  : 'text-[#EA8E75] bg-stone-100 hover:bg-stone-200 border-[#122420]/10'
              }`}
            >
              <span>🏕️</span>
              <span>Offline Pack</span>
            </button>

            <span className={`hidden sm:inline-block text-[12px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isDark ? 'bg-[#0E2520] text-[#52C4B7] border-white/10' : 'bg-stone-100 text-[#0E2520] border-[#122420]/10'
            }`}>
              5-Day Trip
            </span>
          </div>
        </div>

        {/* 2. TRIP HEADER & VISUAL ANCHOR */}
        <MyTripHeader
          onManageTrip={() => setIsManageModalOpen(true)}
          onShareTrip={handleShareTrip}
        />

        {/* 3. RESPONSIVE 2-COLUMN LAYOUT (DESKTOP) / SINGLE-COLUMN (MOBILE) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* PRIMARY COLUMN (7/12 on Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* What's Next Card */}
            <WhatsNextCard
              onViewPreparation={() => {
                setIsBriefingViewOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Contextual Itinerary Auditor & Mobility Insight */}
            <ItineraryAuditorCard />

            {/* Dahab Local Intelligence & Environment Context */}
            <DahabLocalIntelligenceCard
              currentPlaceId="place-lighthouse"
              activityName="Guided Shore Dive & Sunset"
              onOpenOfflinePack={() => setIsOfflinePackOpen(true)}
              onOpenFoodNow={() => {
                setIsFoodNowOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Today's Context Card (Pre-Trip State) */}
            <TodaysContextCard
              onPrepareForDahab={() => {
                setIsBriefingViewOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Full 5-Day Itinerary Timeline */}
            <TripTimeline
              onSelectActivity={(act) => {
                if (act.status === 'Booked ✓' || act.status === 'Confirmed') {
                  // Matched against the traveler's real bookings. This used to
                  // search AHMED_BOOKINGS — the demo persona's list — and when
                  // nothing matched it fabricated the booking outright: a
                  // random confirmation code, a 1,200 EGP price, a provider
                  // called "Dahab Verified Provider" and the word "Confirmed".
                  // A traveler could open an itinerary row and read a voucher
                  // number that had never existed.
                  //
                  // The item's own id is the reliable link: buildTimelineDays
                  // sets activity.id to the trip item's id, and the item's
                  // bookingRef is carried through as well.
                  const matchedBooking = bookings.find(
                    (b) => b.id === act.id || (act.bookingRef ? b.confirmationCode === act.bookingRef : false)
                  );
                  if (matchedBooking) {
                    setSelectedBooking(matchedBooking);
                  } else {
                    // No booking record behind this row. Everything below comes
                    // from the activity itself; what it does not carry is left
                    // blank rather than filled in.
                    setSelectedBooking({
                      id: act.id,
                      serviceType: act.type === 'Activity' ? 'diving' : act.type === 'Accommodation' ? 'hotel' : act.type === 'Transfer' ? 'transfer' : 'safari',
                      title: act.type,
                      subtitle: act.title,
                      details: act.notes || '',
                      datesOrTime: act.time,
                      priceEGP: act.priceEGP ?? 0,
                      provider: act.provider || '—',
                      confirmationCode: act.bookingRef || '—',
                      status: act.status === 'Booked ✓' || act.status === 'Confirmed' ? 'Confirmed ✓' : 'Pending',
                      location: act.location || 'Dahab',
                      iconType: act.type === 'Activity' ? 'waves' : act.type === 'Accommodation' ? 'building' : act.type === 'Transfer' ? 'car' : 'compass',
                    });
                  }
                }
              }}
              onNavigateToFoodNow={() => {
                setIsFoodNowOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToWhatShouldIDoNow={() => {
                setIsWhatShouldIDoNowOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToChangeRecovery={() => {
                setIsChangeRecoveryOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToLive={() => {
                showToast("Opening Dahab Live Marine & Weather radar...");
                if (onExploreClick) onExploreClick();
              }}
              onOpenHelp={(cat, topic) => {
                setHelpCategory(cat);
                setHelpTopic(topic);
                setIsHelpMeNowOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreClick={onExploreClick}
              onViewBriefing={() => {
                setIsBriefingViewOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
            />
          </div>

          {/* SECONDARY SUPPORTING COLUMN (5/12 on Desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Trip Status Compact Badge */}
            <MyTripStatusBadge
              onViewBookings={() => {
                const el = document.getElementById('your-bookings-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Compact Bookings Section */}
            <section aria-label="Your bookings">
            <BookingsSection
              onViewBooking={(booking) => setSelectedBooking(booking)}
            />
            </section>

            {/* Smart Budget Section */}
            <section aria-label="Trip budget">
            <SmartBudgetSection />
            </section>

            {/* Group Travel & Voting Section */}
            <section aria-label="Group travel and voting">
            <GroupTravelSection />
            </section>

            {/* Trip Tools Utility Section */}
            <section aria-label="Trip tools">
            <TripToolsSection
              onOpenTool={handleOpenTool}
            />
            </section>

            {/* Your Trip Style Summary */}
            <section aria-label="Your trip style">
            <TripStyleSummary />
            </section>

            {/* Persistent Support Access */}
            <SupportCard
              onOpenHelp={() => handleOpenTool('help-me-now', 'Help Me Now', 'Get immediate 24/7 Dahab concierge assistance for bookings, transport changes, or local recommendations.')}
            />
          </div>
        </div>
      </main>

      {/* MOBILE STICKY FLOATING QUICK ACTION DOCK */}
      <div className={`lg:hidden fixed bottom-4 left-3 right-3 z-40 backdrop-blur-md p-2 rounded-2xl border shadow-xl flex items-center justify-between gap-1 font-['Outfit',sans-serif] ${
        isDark ? 'bg-[#0E2520]/95 text-white border-[#52C4B7]/30' : 'bg-white/95 text-[#122420] border-[#122420]/15'
      }`}>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('trip-timeline-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex-1 py-2 px-1 text-center rounded-xl transition-colors flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isDark ? 'hover:bg-white/10 text-[#F4C36C]' : 'hover:bg-stone-100 text-[#EA8E75]'
          }`}
        >
          <span>Day 2 🤿</span>
          <span className={`text-[11px] font-normal ${isDark ? 'text-white/70' : 'text-[#4A635D]'}`}>Next Up</span>
        </button>

        <div className={`w-px h-6 ${isDark ? 'bg-white/15' : 'bg-[#122420]/15'}`} />

        <button
          type="button"
          onClick={() => {
            setIsFoodNowOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2 px-1 text-center rounded-xl transition-colors flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-stone-100 text-[#122420]'
          }`}
        >
          <span>Food Now 🍽️</span>
          <span className={`text-[11px] font-normal ${isDark ? 'text-white/70' : 'text-[#4A635D]'}`}>Beach Eats</span>
        </button>

        <div className={`w-px h-6 ${isDark ? 'bg-white/15' : 'bg-[#122420]/15'}`} />

        <button
          type="button"
          onClick={() => {
            setIsWhatShouldIDoNowOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2 px-1 text-center rounded-xl transition-colors flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isDark ? 'hover:bg-white/10 text-[#52C4B7]' : 'hover:bg-stone-100 text-[#0E2520]'
          }`}
        >
          <span>What Now? 🧭</span>
          <span className={`text-[11px] font-normal ${isDark ? 'text-white/70' : 'text-[#4A635D]'}`}>Spontaneous</span>
        </button>

        <div className={`w-px h-6 ${isDark ? 'bg-white/15' : 'bg-[#122420]/15'}`} />

        <button
          type="button"
          onClick={() => {
            setIsHelpMeNowOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2 px-1 text-center rounded-xl transition-colors flex flex-col items-center gap-0.5 text-[11px] font-bold ${
            isDark ? 'bg-[#F4C36C]/20 text-[#F4C36C] hover:bg-[#F4C36C]/30' : 'bg-[#EA8E75]/15 text-[#EA8E75] hover:bg-[#EA8E75]/25'
          }`}
        >
          <span>SOS Help 🆘</span>
          <span className={`text-[11px] font-normal ${isDark ? 'text-[#F4C36C]/80' : 'text-[#EA8E75]'}`}>24/7 Desk</span>
        </button>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-xs font-bold shadow-xl border flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 font-['Outfit',sans-serif] ${
          isDark ? 'bg-[#0E2520] text-[#F7F3EA] border-white/15' : 'bg-white text-[#122420] border-[#122420]/15'
        }`}>
          <Check className={`w-4 h-4 ${isDark ? 'text-[#52C4B7]' : 'text-[#20A89A]'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      <ManageTripModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSelectOption={handleSelectManageOption}
      />

      <BookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      <TripToolInfoModal
        tool={selectedTool}
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
      />

      <PreparationPreviewModal
        isOpen={isPrepModalOpen}
        onClose={() => setIsPrepModalOpen(false)}
      />

      <OfflineTripPackModal
        isOpen={isOfflinePackOpen}
        onClose={() => setIsOfflinePackOpen(false)}
      />
    </div>
  );
};
