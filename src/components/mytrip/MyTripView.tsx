import React, { useState, useMemo } from 'react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { formatTripDateRange } from '../../utils/tripDates';
import { ConfirmedBookingItem, TimelineActivity, TimelineDay } from './myTripData';
import { ManageTripModal } from './ManageTripModal';
import { BookingDetailModal } from './BookingDetailModal';
import { OfflineTripPackModal } from '../expedition/OfflineTripPackModal';

// Sub-flow views
import { PreArrivalBriefing } from '../briefing/PreArrivalBriefing';
import { EarlyArrivalView } from '../arrival/EarlyArrivalView';
import { FirstTwoHoursView } from '../arrival/FirstTwoHoursView';
import { DailyCompanionDay2View } from '../companion/DailyCompanionDay2View';
import { WhatShouldIDoNowView } from '../spontaneous/WhatShouldIDoNowView';
import { FoodNowView } from '../food/FoodNowView';
import { ChangeAndRecoveryView } from '../recovery/ChangeAndRecoveryView';
import { HelpMeNowView, HelpCategory } from '../help/HelpMeNowView';

import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Navigation,
  MessageCircle,
  Eye,
  Trash2,
  MoveRight,
  Utensils,
  Car,
  Building,
  Waves,
  Compass,
  AlertTriangle,
  FileText,
  CreditCard,
  Users,
  Sun,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';

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
  const {
    profile,
    tripBrief,
    user,
    activeTrip,
    tripDays,
    bookings,
    removeActivityFromDay,
    shiftActivityBetweenDays,
    navigateTo,
    showToast
  } = useTrip();

  const { language, isRTL, t } = useLanguage();
  const { isDark } = useTheme();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'timeline' | 'bookings' | 'tools'>('timeline');

  // Active Day Filter in Timeline ('all' or 1..5)
  const [selectedDayFilter, setSelectedDayFilter] = useState<'all' | number>('all');

  // Sub-Flow States
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

  // Modals
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isOfflinePackOpen, setIsOfflinePackOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ConfirmedBookingItem | null>(null);

  // Shift day selector state (for moving an activity)
  const [shiftingActivity, setShiftingActivity] = useState<{ id: string; fromDay: number } | null>(null);

  // Expanded days accordion
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const travelerDisplayName = profile.name || user?.displayName || (language === 'ar' ? 'أحمد' : 'Ahmed');
  const durationDays = tripBrief.durationDays || profile.lengthDays || (tripDays.length > 0 ? tripDays.length : 4);
  const travelersCount = tripBrief.travelersCount || profile.travelersCount || 2;
  const dateRange = formatTripDateRange(activeTrip?.startDate, activeTrip?.endDate, language === 'ar' ? 'ar' : 'en');

  // Next Up activity (finds first upcoming non-completed activity)
  const nextUpActivity = useMemo(() => {
    for (const day of tripDays) {
      for (const act of day.activities) {
        if (act.status !== 'Confirmed') {
          return { dayNumber: day.dayNumber, dayTitle: day.title, activity: act };
        }
      }
    }
    return null;
  }, [tripDays]);

  // Handle Share Trip
  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: language === 'ar' ? `رحلة دهب لـ ${travelerDisplayName}` : `${travelerDisplayName}'s Dahab Journey`,
        text: language === 'ar' ? 'راجع جدول رحلتي المؤكدة وحجوزاتي في دهب.' : 'Review my confirmed Dahab trip itinerary and bookings.',
        url: window.location.href,
      }).catch(() => {
        showToast(language === 'ar' ? 'تم نسخ رابط الرحلة للحافظة ✓' : 'Trip link copied to clipboard ✓');
      });
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast(language === 'ar' ? 'تم نسخ رابط الرحلة للحافظة ✓' : 'Trip link copied to clipboard ✓');
    }
  };

  const toggleDayExpanded = (dayNum: number) => {
    setExpandedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleExpandAll = () => {
    setExpandedDays({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true });
  };

  const handleCollapseAll = () => {
    setExpandedDays({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false });
  };

  // Activity icon helper
  const getActivityIcon = (type: TimelineActivity['type'] | string, title: string) => {
    const tLower = title.toLowerCase();
    if (tLower.includes('div') || tLower.includes('reef') || tLower.includes('غطس') || tLower.includes('شعب')) {
      return <Waves className="w-4 h-4 text-[#20A89A]" />;
    }
    if (tLower.includes('food') || tLower.includes('eat') || tLower.includes('bakery') || tLower.includes('cafe') || tLower.includes('أكل') || tLower.includes('مطعم') || tLower.includes('سمك')) {
      return <Utensils className="w-4 h-4 text-[#F4C36C]" />;
    }
    if (tLower.includes('safari') || tLower.includes('canyon') || tLower.includes('سفاري') || tLower.includes('كانيون') || tLower.includes('وادي')) {
      return <Compass className="w-4 h-4 text-[#EA8E75]" />;
    }
    if (type === 'Transfer' || type === 'Arrival' || tLower.includes('transfer') || tLower.includes('توصيل') || tLower.includes('تاكسي')) {
      return <Car className="w-4 h-4 text-[#0F6F78]" />;
    }
    if (type === 'Accommodation' || tLower.includes('hotel') || tLower.includes('فندق') || tLower.includes('منتجع')) {
      return <Building className="w-4 h-4 text-[#52C4B7]" />;
    }
    return <Sparkles className="w-4 h-4 text-[#20A89A]" />;
  };

  // =========================================================================
  // SUB-FLOW ROUTING
  // =========================================================================
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
        onOpenHelp={() => {
          setIsFoodNowOpen(false);
          setIsHelpMeNowOpen(true);
        }}
        onMealAddedToTrip={(meal) => {
          showToast(`"${meal.title}" added to your timeline ✓`);
        }}
      />
    );
  }

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
        onOpenHelp={() => {
          setIsWhatShouldIDoNowOpen(false);
          setIsHelpMeNowOpen(true);
        }}
        onActivityAddedToTrip={(act) => {
          showToast(`"${act.title}" added to schedule ✓`);
        }}
      />
    );
  }

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
        onOpenHelp={() => {
          setIsDay2CompanionOpen(false);
          setIsHelpMeNowOpen(true);
        }}
      />
    );
  }

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
        onOpenHelp={() => {
          setIsFirstTwoHoursOpen(false);
          setIsHelpMeNowOpen(true);
        }}
      />
    );
  }

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
        onOpenHelp={() => {
          setIsEarlyArrivalOpen(false);
          setIsHelpMeNowOpen(true);
        }}
      />
    );
  }

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
          showToast(language === 'ar' ? 'أهلاً بك في دهب! تم تفعيل خطة الساعتين الأولى.' : 'Welcome to Dahab! First 2 Hours mini-plan activated.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHelp={() => {
          setIsBriefingViewOpen(false);
          setIsHelpMeNowOpen(true);
        }}
      />
    );
  }

  // Filtered days list
  const displayedDays = selectedDayFilter === 'all'
    ? tripDays
    : tripDays.filter(d => d.dayNumber === selectedDayFilter);

  return (
    <div
      id="mytrip-command-dashboard"
      className={`min-h-screen pb-28 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 ${
        isDark ? 'bg-[#081714] text-[#F7F3EA]' : 'bg-[#FAF8F5] text-[#122420]'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP TRAVELER COCKPIT HEADER */}
      <header className={`border-b sticky top-16 sm:top-20 z-30 backdrop-blur-xl transition-colors ${
        isDark ? 'bg-[#081714]/85 border-white/10 text-[#D2E3DE]' : 'bg-[#FAF8F5]/90 border-[#122420]/10 text-[#4A635D]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <button
              type="button"
              id="mytrip-back-home-btn"
              onClick={onBackToHome}
              className={`hover:underline flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-[#122420]'
              }`}
            >
              {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </button>
            <span className="opacity-40">/</span>
            <span className="font-bold text-[#20A89A]">
              {t('myTrip.title')}
            </span>
          </div>

          {/* Quick Concierge Shortcut Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="cockpit-sos-btn"
              onClick={() => {
                setIsHelpMeNowOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🆘</span>
              <span>{language === 'ar' ? 'طوارئ سيناء ٢٤ ساعة' : '24/7 SOS Help'}</span>
            </button>

            <button
              type="button"
              id="cockpit-food-btn"
              onClick={() => {
                setIsFoodNowOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-full text-xs font-bold bg-[#F4C36C]/20 text-[#F4C36C] hover:bg-[#F4C36C]/30 border border-[#F4C36C]/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Utensils className="w-3 h-3" />
              <span>{language === 'ar' ? 'اطلب أكل لمكانك 🍽️' : 'Food Now 🍽️'}</span>
            </button>

            <button
              type="button"
              id="cockpit-offline-btn"
              onClick={() => setIsOfflinePackOpen(true)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isDark ? 'bg-[#13312B] text-[#D2E3DE] hover:bg-[#1a4038] border-white/10' : 'bg-white text-[#122420] hover:bg-stone-100 border-[#122420]/10'
              }`}
            >
              <Download className="w-3 h-3 text-[#20A89A]" />
              <span>{t('myTrip.offlinePack')}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HERO COMMAND SHOWCASE CARD */}
        <section
          aria-label="Trip overview header"
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-stone-950 text-white min-h-[300px] flex flex-col justify-end p-6 sm:p-10"
        >
          {/* Background Photography with deep gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1400&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-60 filter saturate-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/50" />
          </div>

          {/* Foreground details */}
          <div className="relative z-10 space-y-4 max-w-3xl">
            
            {/* Stage Pill & Weather ticker */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#20A89A] text-[#081714] shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('myTrip.confirmedBadge')}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20">
                <Sun className="w-3.5 h-3.5 text-[#F4C36C]" />
                <span>{t('myTrip.weatherCalm')}</span>
              </span>
            </div>

            {/* Greeting & Title */}
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#52C4B7] block mb-1">
                {language === 'ar' ? `مرحباً بك يا ${travelerDisplayName} 👋` : `Welcome back, ${travelerDisplayName} 👋`}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F7F3EA] leading-tight">
                {language === 'ar'
                  ? `${durationDays} أيام من الغوص المرجاني وسكينة صحراء سيناء`
                  : `${durationDays} Days of Coral Diving & Sinai Desert Serenity`}
              </h1>
            </div>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#D2E3DE] font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#20A89A]" />
                <span>{dateRange || (language === 'ar' ? '١ - ٥ سبتمبر ٢٠٢٦' : '1 - 5 Sep 2026')}</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#F4C36C]" />
                <span>{language === 'ar' ? `${travelersCount} مسافرين` : `${travelersCount} Travelers`}</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EA8E75]" />
                <span>{language === 'ar' ? 'دهب، جنوب سيناء' : 'Dahab, South Sinai'}</span>
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="hero-share-trip-btn"
                onClick={handleShareTrip}
                className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#52C4B7]" />
                <span>{t('myTrip.shareItinerary')}</span>
              </button>

              <button
                type="button"
                id="hero-manage-trip-btn"
                onClick={() => setIsManageModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#F4C36C]" />
                <span>{t('myTrip.manageTrip')}</span>
              </button>

              <button
                type="button"
                id="hero-add-exp-btn"
                onClick={() => navigateTo('/explore')}
                className="px-6 py-2.5 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#081714]" />
                <span>{t('myTrip.addActivity')}</span>
              </button>
            </div>

          </div>
        </section>

        {/* 3. NEXT UP LIVE COMPANION BANNER */}
        {nextUpActivity && (
          <section
            aria-labelledby="next-up-heading"
            className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
              isDark
                ? 'bg-gradient-to-br from-[#0E2520] to-[#13312B] border-white/10 text-[#F7F3EA]'
                : 'bg-gradient-to-br from-white to-[#FFFDF9] border-[#122420]/10 text-[#122420]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#20A89A]/20 text-[#20A89A] border border-[#20A89A]/30 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{t('myTrip.nextUpTitle')} · {language === 'ar' ? `اليوم ٠${nextUpActivity.dayNumber}` : `Day 0${nextUpActivity.dayNumber}`}</span>
                </span>
                <span className="text-xs font-bold text-[#EA8E75]">
                  {nextUpActivity.activity.time}
                </span>
              </div>

              <h2 id="next-up-heading" className="text-xl sm:text-2xl font-serif font-bold">
                {nextUpActivity.activity.title}
              </h2>

              <div className={`flex flex-wrap items-center gap-4 text-xs font-medium ${
                isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
              }`}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#20A89A]" />
                  <span>{nextUpActivity.activity.location}</span>
                </span>
                {nextUpActivity.activity.notes && (
                  <>
                    <span className="opacity-30">•</span>
                    <span>{nextUpActivity.activity.notes}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Next Up Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                id="next-up-directions-btn"
                onClick={() => {
                  showToast(
                    language === 'ar'
                      ? `تم فتح الاتجاهات إلى ${nextUpActivity.activity.location}`
                      : `Opening directions to ${nextUpActivity.activity.location}`
                  );
                }}
                className={`px-5 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#1a4038] text-[#D2E3DE] border-white/10'
                    : 'bg-[#F2EFE9] hover:bg-[#EAE6DD] text-[#122420] border-[#122420]/10'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 text-[#20A89A]" />
                <span>{t('myTrip.directions')}</span>
              </button>

              <button
                type="button"
                id="next-up-whatsapp-btn"
                onClick={() => {
                  showToast(
                    language === 'ar'
                      ? 'جاري فتح محادثة WhatsApp مع دليل سيناء المحلي...'
                      : 'Connecting with Sinai Local Guide on WhatsApp...'
                  );
                }}
                className="px-6 py-3 rounded-2xl bg-[#20A89A] hover:bg-[#52C4B7] text-[#081714] text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#081714]" />
                <span>{t('myTrip.contactHost')}</span>
              </button>
            </div>
          </section>
        )}

        {/* 4. COMMAND CENTER TABS */}
        <section aria-label="Trip dashboard sections" className="space-y-6">
          
          {/* Tab Navigation Ribbon */}
          <div className="flex items-center justify-between gap-4 border-b pb-4 flex-wrap border-current/10">
            <div className="flex items-center gap-2">
              {[
                { id: 'timeline', label: t('myTrip.tabTimeline'), icon: Calendar },
                { id: 'bookings', label: t('myTrip.tabBookings'), icon: CreditCard },
                { id: 'tools', label: t('myTrip.tabTools'), icon: Compass }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    id={`dashboard-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                      isActive
                        ? 'bg-[#20A89A] text-[#081714] scale-105 shadow-md'
                        : isDark
                        ? 'bg-[#0E2520] text-[#D2E3DE] hover:bg-[#13312B] border border-white/5'
                        : 'bg-white text-[#122420] hover:bg-stone-100 border border-[#122420]/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Expand / Collapse buttons when in Timeline tab */}
            {activeTab === 'timeline' && (
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  type="button"
                  id="timeline-expand-all-btn"
                  onClick={handleExpandAll}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark ? 'bg-[#0E2520] text-[#D2E3DE] border-white/10 hover:bg-[#13312B]' : 'bg-white text-[#122420] border-[#122420]/10 hover:bg-stone-50'
                  }`}
                >
                  {t('myTrip.expandAll')}
                </button>
                <button
                  type="button"
                  id="timeline-collapse-all-btn"
                  onClick={handleCollapseAll}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark ? 'bg-[#0E2520] text-[#D2E3DE] border-white/10 hover:bg-[#13312B]' : 'bg-white text-[#122420] border-[#122420]/10 hover:bg-stone-50'
                  }`}
                >
                  {t('myTrip.collapseAll')}
                </button>
              </div>
            )}
          </div>

          {/* =========================================================================
              TAB 1: DAILY TIMELINE & EXPERIENCES
             ========================================================================= */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              
              {/* Day Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  type="button"
                  id="filter-day-all-btn"
                  onClick={() => setSelectedDayFilter('all')}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDayFilter === 'all'
                      ? 'bg-[#F4C36C] text-[#081714] shadow-md'
                      : isDark
                      ? 'bg-[#0E2520] text-[#D2E3DE] hover:bg-[#13312B] border border-white/5'
                      : 'bg-white text-[#122420] hover:bg-stone-100 border border-[#122420]/10'
                  }`}
                >
                  {t('myTrip.allDays')} ({tripDays.length})
                </button>

                {tripDays.map(day => (
                  <button
                    key={day.dayNumber}
                    type="button"
                    id={`filter-day-${day.dayNumber}-btn`}
                    onClick={() => setSelectedDayFilter(day.dayNumber)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedDayFilter === day.dayNumber
                        ? 'bg-[#F4C36C] text-[#081714] shadow-md'
                        : isDark
                        ? 'bg-[#0E2520] text-[#D2E3DE] hover:bg-[#13312B] border border-white/5'
                        : 'bg-white text-[#122420] hover:bg-stone-100 border border-[#122420]/10'
                    }`}
                  >
                    {language === 'ar' ? `اليوم ٠${day.dayNumber}` : `Day 0${day.dayNumber}`}
                  </button>
                ))}
              </div>

              {/* Days List */}
              <div className="space-y-6">
                {displayedDays.map(day => {
                  const isExpanded = expandedDays[day.dayNumber] ?? true;

                  return (
                    <div
                      key={day.dayNumber}
                      id={`timeline-day-${day.dayNumber}-card`}
                      className={`rounded-3xl border shadow-xl overflow-hidden transition-all ${
                        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
                      }`}
                    >
                      {/* Day Header Accordion Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleDayExpanded(day.dayNumber)}
                        className={`w-full p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors cursor-pointer text-start ${
                          isDark ? 'hover:bg-[#13312B]/60' : 'hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-10 h-10 rounded-2xl bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center font-bold text-sm font-serif shadow-xs">
                            {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                          </span>
                          <div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold leading-tight">
                              {day.title}
                            </h3>
                            <span className={`text-xs ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                              {day.dateStr} · {day.activities.length} {language === 'ar' ? 'أنشطة وتجارب' : 'Activities'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#20A89A] hidden sm:inline">
                            {isExpanded ? t('myTrip.collapseAll') : t('myTrip.expandAll')}
                          </span>
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            isDark ? 'border-white/10' : 'border-[#122420]/10'
                          }`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Day Activities Content */}
                      {isExpanded && (
                        <div className="p-5 sm:p-6 pt-0 space-y-4 border-t border-current/10">
                          {day.activities.length === 0 ? (
                            <div className="py-8 text-center space-y-3">
                              <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                                {t('myTrip.emptyDay')}
                              </p>
                              <button
                                type="button"
                                onClick={() => navigateTo('/explore')}
                                className="px-5 py-2.5 rounded-2xl bg-[#20A89A] hover:bg-[#52C4B7] text-[#081714] text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-md"
                              >
                                <Plus className="w-4 h-4 text-[#081714]" />
                                <span>{t('myTrip.exploreSpots')}</span>
                              </button>
                            </div>
                          ) : (
                            day.activities.map((act, actIdx) => (
                              <div
                                key={act.id || actIdx}
                                id={`activity-row-${act.id}`}
                                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                  isDark ? 'bg-[#13312B]/70 border-white/5 hover:border-white/20' : 'bg-[#FAF8F5] border-[#122420]/10 hover:border-[#122420]/20'
                                }`}
                              >
                                <div className="flex items-start gap-3.5">
                                  <div className="w-9 h-9 rounded-2xl bg-[#20A89A]/15 text-[#20A89A] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                                    {getActivityIcon(act.type, act.title)}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-extrabold text-[#F4C36C]">
                                        {act.time}
                                      </span>
                                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-current">
                                        {act.type}
                                      </span>
                                      {act.status && (
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                          {act.status}
                                        </span>
                                      )}
                                    </div>

                                    <h4 className="text-base font-serif font-bold text-current">
                                      {act.title}
                                    </h4>

                                    <div className={`flex flex-wrap items-center gap-3 text-xs ${
                                      isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
                                    }`}>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-[#20A89A]" />
                                        <span>{act.location}</span>
                                      </span>
                                      {act.notes && (
                                        <>
                                          <span className="opacity-30">•</span>
                                          <span>{act.notes}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Activity Row Interactive Actions */}
                                <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-current/10 w-full sm:w-auto justify-end">
                                  
                                  {/* Shift Day Selector */}
                                  {shiftingActivity?.id === act.id ? (
                                    <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                                      <span className="text-[10px] font-bold">{t('myTrip.shiftDay')}:</span>
                                      {[1, 2, 3, 4, 5].map(d => (
                                        <button
                                          key={d}
                                          type="button"
                                          onClick={() => {
                                            shiftActivityBetweenDays(act.id, day.dayNumber, d);
                                            setShiftingActivity(null);
                                            showToast(
                                              language === 'ar'
                                                ? `تم نقل «${act.title}» إلى اليوم ${d} بنجاح ✓`
                                                : `Moved "${act.title}" to Day ${d} ✓`
                                            );
                                          }}
                                          className={`w-6 h-6 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            d === day.dayNumber
                                              ? 'bg-stone-500 text-white'
                                              : 'bg-[#F4C36C] text-[#081714] hover:scale-110'
                                          }`}
                                        >
                                          {d}
                                        </button>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => setShiftingActivity(null)}
                                        className="text-xs text-rose-400 px-1 hover:underline cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      id={`shift-act-btn-${act.id}`}
                                      onClick={() => setShiftingActivity({ id: act.id, fromDay: day.dayNumber })}
                                      title={t('myTrip.shiftDay')}
                                      className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
                                        isDark ? 'bg-[#0E2520] hover:bg-[#1a4038] text-[#D2E3DE] border-white/10' : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/10'
                                      }`}
                                    >
                                      <MoveRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                    </button>
                                  )}

                                  {/* View Experience Detail Page */}
                                  <button
                                    type="button"
                                    id={`view-details-act-btn-${act.id}`}
                                    onClick={() => {
                                      // Search for matching experience slug
                                      const slug = act.title.toLowerCase().includes('blue hole')
                                        ? 'near-blue-hole'
                                        : act.title.toLowerCase().includes('light')
                                        ? 'near-lighthouse-reef'
                                        : act.title.toLowerCase().includes('ralph')
                                        ? 'near-ralphs'
                                        : act.title.toLowerCase().includes('ali')
                                        ? 'near-ali-baba'
                                        : 'near-blue-hole';
                                      navigateTo('/experiences', { experienceSlug: slug });
                                    }}
                                    title={t('myTrip.viewDetails')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                      isDark ? 'bg-[#0E2520] hover:bg-[#1a4038] text-[#52C4B7] border-white/10' : 'bg-white hover:bg-stone-100 text-[#0F6F78] border-[#122420]/10'
                                    }`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{t('myTrip.viewDetails')}</span>
                                  </button>

                                  {/* Remove Activity */}
                                  <button
                                    type="button"
                                    id={`remove-act-btn-${act.id}`}
                                    onClick={() => {
                                      removeActivityFromDay(day.dayNumber, act.id);
                                      showToast(
                                        language === 'ar'
                                          ? `تم حذف «${act.title}» من اليوم ${day.dayNumber}`
                                          : `Removed "${act.title}" from Day ${day.dayNumber}`
                                      );
                                    }}
                                    title={t('myTrip.remove')}
                                    className="p-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                </div>
                              </div>
                            ))
                          )}

                          {/* Add Experience to This Specific Day */}
                          <div className="pt-2">
                            <button
                              type="button"
                              id={`add-to-day-${day.dayNumber}-btn`}
                              onClick={() => navigateTo('/explore')}
                              className={`w-full py-3 rounded-2xl border-2 border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                isDark
                                  ? 'border-white/15 text-[#52C4B7] hover:bg-white/5 hover:border-[#20A89A]'
                                  : 'border-[#122420]/15 text-[#0F6F78] hover:bg-stone-50 hover:border-[#20A89A]'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? `إضافة نشاط إلى اليوم ${day.dayNumber}` : `Add Experience to Day ${day.dayNumber}`}</span>
                            </button>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: BOOKINGS, BUDGET & GROUP TRAVEL
             ========================================================================= */}
          {activeTab === 'bookings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Bookings Matrix (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
                  isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#20A89A]">
                        {t('myTrip.bookingsTitle')}
                      </span>
                      <h3 className="text-xl font-serif font-bold mt-1">
                        {language === 'ar' ? 'قسائم الحجز وتأكيدات الانتقالات' : 'Active Vouchers & Logistics'}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                      {bookings.length} {language === 'ar' ? 'حجوزات مؤكدة' : 'Confirmed'}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {bookings.map(b => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isDark ? 'bg-[#13312B] border-white/5 hover:border-white/20' : 'bg-[#FAF8F5] border-[#122420]/10 hover:border-[#122420]/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#20A89A]/15 text-[#20A89A] flex items-center justify-center font-bold">
                            {b.serviceType === 'hotel' ? <Building className="w-5 h-5" /> : b.serviceType === 'transfer' ? <Car className="w-5 h-5" /> : <Waves className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-serif font-bold text-current">{b.title}</h4>
                            <span className={`text-xs ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                              #{b.confirmationCode} · {b.provider}
                            </span>
                          </div>
                        </div>

                        <div className="text-end">
                          <span className="text-sm font-bold font-serif text-[#F4C36C] block">{b.priceEGP.toLocaleString()} EGP</span>
                          <span className="text-[10px] font-bold text-emerald-400">✓ {b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Right Column: Budget & Group Split (5/12) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Budget Card */}
                <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif font-bold flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#F4C36C]" />
                      <span>{t('myTrip.budgetTitle')}</span>
                    </h3>
                    <span className="text-xs font-bold text-[#20A89A]">
                      0% {t('myTrip.spent')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}>{t('myTrip.remaining')}:</span>
                      <span className="text-lg font-bold font-serif text-[#F4C36C]">7,600 EGP</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#20A89A] rounded-full w-[25%]" />
                    </div>
                  </div>

                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar'
                      ? 'أنت تصرف بمعدل 18% أقل من المخطط. متبقي معاك حوالي 160 دولار يكفوا رحلة سفاري في الكانيون.'
                      : 'You are spending 18% below your planned budget. You have approx. $160 buffer for a desert safari.'}
                  </p>
                </div>

                {/* Group Travel Split Card */}
                <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif font-bold flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#52C4B7]" />
                      <span>{t('myTrip.groupTravel')}</span>
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#20A89A]/20 text-[#20A89A]">
                      {travelersCount} {language === 'ar' ? 'مسافرين' : 'Travelers'}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar'
                      ? 'شارك رابط الدعوة مع أصحابك عشان يصوتوا على الأنشطة وتتقاسموا مصاريف التاكسي والفندق بنقرة واحدة.'
                      : 'Share an invite link with your travel buddies to vote on activities and split accommodation/transfer costs.'}
                  </p>

                  <button
                    type="button"
                    onClick={handleShareTrip}
                    className="w-full py-3 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] text-xs font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    <Users className="w-3.5 h-3.5 text-[#081714]" />
                    <span>{t('myTrip.inviteFriend')}</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 3: CONCIERGE, LOCAL TOOLS & DAHAB ESSENTIALS
             ========================================================================= */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. Food Now */}
              <button
                type="button"
                id="tool-card-food"
                onClick={() => {
                  setIsFoodNowOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-6 rounded-3xl border text-start shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-white/10 hover:border-[#F4C36C]/40 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 hover:border-[#F4C36C] text-[#122420]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F4C36C]/20 text-[#F4C36C] flex items-center justify-center font-bold">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold">{t('myTrip.foodNow')}</h3>
                  <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? 'فطار مصري، سي فود، وشاي بدوي واصل لحد مكانك ع البحر.' : 'Fresh breakfast, seafood, and Bedouin tea delivered to your spot.'}
                  </p>
                </div>
              </button>

              {/* 2. What Should I Do Now */}
              <button
                type="button"
                id="tool-card-spontaneous"
                onClick={() => {
                  setIsWhatShouldIDoNowOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-6 rounded-3xl border text-start shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-white/10 hover:border-[#20A89A]/40 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 hover:border-[#20A89A] text-[#122420]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold">{t('myTrip.whatShouldIDo')}</h3>
                  <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? 'اقتراحات فورية حسب موعدك الحالي وحالة الطقس ورياح دهب.' : 'Real-time smart recommendations matched to your free hours and sea tides.'}
                  </p>
                </div>
              </button>

              {/* 3. Pre-Arrival Briefing */}
              <button
                type="button"
                id="tool-card-briefing"
                onClick={() => {
                  setIsBriefingViewOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-6 rounded-3xl border text-start shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-white/10 hover:border-[#52C4B7]/40 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 hover:border-[#52C4B7] text-[#122420]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#52C4B7]/20 text-[#52C4B7] flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold">{t('myTrip.briefing')}</h3>
                  <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? 'تعليمات ما قبل السفر، شنطة الغطس، وأرقام السائقين.' : 'Pre-trip checklist, dive gear essentials, and driver pickup coordinates.'}
                  </p>
                </div>
              </button>

              {/* 4. SOS 24/7 Emergency */}
              <button
                type="button"
                id="tool-card-sos"
                onClick={() => {
                  setIsHelpMeNowOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-6 rounded-3xl border text-start shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-rose-500/30 hover:border-rose-500 text-[#F7F3EA]' : 'bg-white border-rose-300 hover:border-rose-500 text-[#122420]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold">{t('myTrip.sosEmergency')}</h3>
                  <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? 'غرفة علاج الضغط، شرطة السياحة، وإسعاف دهب التخصصي.' : 'Dahab Hyperbaric Chamber, Tourist Police, and 24/7 Decompression doctor.'}
                  </p>
                </div>
              </button>

              {/* 5. Offline Companion Pack */}
              <button
                type="button"
                id="tool-card-offline-pack"
                onClick={() => setIsOfflinePackOpen(true)}
                className={`p-6 rounded-3xl border text-start shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-white/10 hover:border-[#F4C36C]/40 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 hover:border-[#F4C36C] text-[#122420]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F4C36C]/20 text-[#F4C36C] flex items-center justify-center font-bold">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold">{t('myTrip.offlinePack')}</h3>
                  <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? 'احفظ قسائم الحجز والخرائط بدون الحاجة لشبكة إنترنت.' : 'Download vouchers, taxi contacts, and dive maps for zero-connectivity.'}
                  </p>
                </div>
              </button>

              {/* 6. Explore All Dahab */}
              <button
                type="button"
                id="tool-card-explore"
                onClick={() => navigateTo('/explore')}
                className={`p-6 rounded-3xl border text-start shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 ${
                  isDark ? 'bg-[#0E2520] border-white/10 hover:border-[#20A89A]/40 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 hover:border-[#20A89A] text-[#122420]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold">{t('myTrip.exploreSpots')}</h3>
                  <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? 'تصفح كل شواطئ، كافيهات، ومحميات دهب الطبيعية.' : 'Browse all natural reefs, beachfront cafes, and Sinai sanctuaries.'}
                  </p>
                </div>
              </button>

            </div>
          )}

        </section>

      </main>

      {/* 5. MODALS */}
      {isManageModalOpen && (
        <ManageTripModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          onSelectOption={(opt) => {
            setIsManageModalOpen(false);
            showToast(`Opening "${opt}" settings...`);
          }}
        />
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {isOfflinePackOpen && (
        <OfflineTripPackModal
          isOpen={isOfflinePackOpen}
          onClose={() => setIsOfflinePackOpen(false)}
        />
      )}

    </div>
  );
};
