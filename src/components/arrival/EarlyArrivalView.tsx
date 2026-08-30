import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  MapPin, 
  Building, 
  Luggage, 
  Coffee, 
  Waves, 
  Footprints, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  Calendar,
  AlertCircle,
  Navigation,
  Info
} from 'lucide-react';
import { EarlyCheckInModal } from './EarlyCheckInModal';
import { LuggageStorageModal } from './LuggageStorageModal';
import { FirstTwoHoursPlanModal } from './FirstTwoHoursPlanModal';
import { ActivityOptionModal } from './ActivityOptionModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { useArrivalClock } from '../../hooks/useArrivalClock';
import { formatClock, formatDayAndMonth, formatDuration } from '../../utils/arrivalTime';

interface EarlyArrivalViewProps {
  onBackToMyTrip: () => void;
  onNavigateToFirstTwoHours?: () => void;
  onExploreClick?: () => void;
  onOpenHelp?: () => void;
}

export const EarlyArrivalView: React.FC<EarlyArrivalViewProps> = ({
  onBackToMyTrip,
  onNavigateToFirstTwoHours,
  onExploreClick,
  onOpenHelp,
}) => {
  const { language, isRTL, t } = useLanguage();
  const { profile, user } = useTrip();

  // This page used to display a frozen 10:00 AM arrival, a fixed "2h 20m
  // remaining", a hardcoded one-third progress bar and a static 3:00 PM
  // check-in — all literal strings in translations.ts. A traveler opening it at
  // any other hour was shown someone else's morning.
  const clock = useArrivalClock();
  const lang = language === 'ar' ? 'ar' : 'en';
  const nowLabel = formatClock(clock.now, lang);
  const checkInLabel = formatClock(clock.checkInAt, lang);
  const remainingLabel = formatDuration(clock.minutesUntilCheckIn, lang);

  // This page greeted every visitor as "Ahmed" and reported their group as
  // "Ahmed + 1 Companion" — the demo user's name was baked into the translation
  // strings themselves, in both languages. The real profile was never read.
  const travelerName = profile.name || user?.displayName || '';
  const companions = Math.max(0, (profile.travelersCount || 1) - 1);
  const groupLabel = travelerName
    ? (companions > 0
        ? `${travelerName} + ${companions} ${companions === 1 ? t('arrival.companion', 'Companion') : t('arrival.companions', 'Companions')}`
        : travelerName)
    : `${profile.travelersCount || 1} ${t('arrival.travelers', 'Travelers')}`;

  // Modals state
  const [isLuggageModalOpen, setIsLuggageModalOpen] = useState<boolean>(false);
  const [isEarlyCheckInModalOpen, setIsEarlyCheckInModalOpen] = useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [activityModalType, setActivityModalType] = useState<'breakfast' | 'beach' | 'walk' | null>(null);

  // User feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className={`min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-28 md:pb-16 selection:bg-[#F4C36C]/20 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-grow">
        
        {/* Subtle Top Breadcrumb / Return Pill */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            id="arrival-back-to-trip-btn"
            onClick={onBackToMyTrip}
            className="inline-flex items-center gap-1.5 py-3.5 -my-2 text-xs font-semibold text-[#D2E3DE]/70 hover:text-[#F7F3EA] transition-colors cursor-pointer"
          >
            {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t('arrival.returnItinerary', 'Return to Full Itinerary')}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#52C4B7] bg-[#13312B] px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#52C4B7] animate-pulse"></span>
              <span>{t('arrival.liveBadge', 'Live: Just Arrived in Dahab')}</span>
            </span>
          </div>
        </div>

        {/* 2. MAIN HEADER */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13312B] text-[#52C4B7] border border-white/10 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F4C36C]" />
              <span>{t('arrival.assistancePill', 'Real-Time Arrival Assistance · Lighthouse Area')}</span>
            </div>

            {/* Visual Time Available Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2520] border border-white/10 text-[#F7F3EA] text-xs font-bold shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#F4C36C]" />
              <span>{`${t('arrival.currentTimeLabel', 'Current time:')} ${nowLabel}`}</span>
              <span className="text-[#D2E3DE]/40">•</span>
              <span className="text-[#F4C36C] font-bold">
                {clock.checkInReached
                  ? t('arrival.checkInOpen', 'Check-in is open')
                  : `${t('arrival.timeAvailableLabel', 'Time available:')} ${remainingLabel}`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA] tracking-tight">
              {travelerName
                ? `${t('arrival.titleNamed', 'Welcome to Dahab,')} ${travelerName} 👋`
                : t('arrival.title', 'Welcome to Dahab 👋')}
            </h1>
            <p className="text-base sm:text-lg text-[#D2E3DE]/80 max-w-2xl font-medium">
              {clock.checkInReached
                ? t('arrival.subtitleReady', "You're here! Your room should be ready now.")
                : `${t('arrival.subtitleWaiting', "You're here! Your room will be ready at")} ${checkInLabel}.`}
            </p>
          </div>
        </div>

        {/* 3. RESPONSIVE LAYOUT (2 Columns on Desktop, Single Column on Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================ */}
          {/* MAIN AREA (7/12 on Desktop) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. HOTEL STATUS CARD (Prominent & Positive) */}
            <section
              id="arrival-hotel-status-card"
              aria-label={t('arrival.regionRoomStatus', 'Room status')}
              className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-lg space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#13312B] text-[#F4C36C] flex items-center justify-center font-bold border border-white/10">
                    <Building className="w-4 h-4 text-[#F4C36C]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                      {t('arrival.hotelName', 'Dahab Bay Hotel')}
                    </span>
                    <h2 className="text-xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                      {t('arrival.roomNotReady', "Your room isn't ready yet")}
                    </h2>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13312B] text-[#F4C36C] text-xs font-bold border border-white/10 font-['Outfit',sans-serif]">
                  <Clock className="w-3.5 h-3.5 text-[#F4C36C]" />
                  <span>{t('arrival.waitingCheckIn', 'Waiting for check-in')}</span>
                </span>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                  <span className="text-[#D2E3DE]/60 font-semibold">{t('arrival.scheduledCheckIn', 'Scheduled Check-in')}</span>
                  <p className="font-bold text-[#F7F3EA] text-sm">
                    {`${checkInLabel} (${formatDayAndMonth(clock.checkInAt, lang)})`}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                  <span className="text-[#D2E3DE]/60 font-semibold">{t('arrival.reservedRoom', 'Reserved Room')}</span>
                  <p className="font-bold text-[#F7F3EA] text-sm">
                    {t('arrival.roomTypeVal', 'Sea View Deluxe (2 Guests)')}
                  </p>
                </div>
              </div>

              {/* Positive Reassuring Framing */}
              <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-1 text-xs">
                <p className="font-bold text-[#52C4B7] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F4C36C]" />
                  <span>{t('arrival.reassuranceHeader', "No worries — we've found a few easy ways to use the time before your room is ready.")}</span>
                </p>
                <p className="text-[#D2E3DE]/70 leading-relaxed pt-0.5">
                  {clock.checkInReached
                    ? t('arrival.reassuranceDescReady', 'Check-in has opened — head to reception whenever you are ready.')
                    : `${t('arrival.reassuranceDescPre', 'You have approximately')} ${remainingLabel} ${t('arrival.reassuranceDescPost', 'of relaxed time right here on the Lighthouse promenade.')}`}
                </p>
              </div>
            </section>

            {/* 2. PRIMARY DECISION ("What would you like to do?") */}
            <section
              id="arrival-decision-section"
              aria-label={t('arrival.choicesTitle', 'What would you like to do?')}
              className="space-y-4"
            >
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                  {t('arrival.choicesTag', 'Curated Early Arrival Choices')}
                </span>
                <h2 className="text-2xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                  {t('arrival.choicesTitle', 'What would you like to do?')}
                </h2>
                <p className="text-xs sm:text-sm text-[#D2E3DE]/70 mt-0.5 font-medium">
                  {t('arrival.choicesDesc', "We've kept the options close, easy, and within the time you have.")}
                </p>
              </div>

              {/* 5 Highly Relevant Option Cards */}
              <div className="space-y-3">
                
                {/* OPTION 1 — LEAVE BAGS (Most practical option) */}
                <div 
                  id="option-leave-bags-card"
                  className="bg-[#0E2520] rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#13312B] text-white flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
                      🧳
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                          {t('arrival.optLeaveBags', 'Leave your bags')}
                        </h3>
                        <span className="text-[11px] font-bold text-[#52C4B7] bg-[#13312B] px-2 py-0.5 rounded-full border border-white/10">
                          {t('arrival.optRecFirst', 'Recommended First')}
                        </span>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/80 leading-relaxed max-w-md">
                        {t('arrival.optLeaveBagsDesc', 'Drop your luggage somewhere convenient and explore without carrying it around.')}
                      </p>
                      <span className="text-[12px] text-[#52C4B7] font-semibold flex items-center gap-1 pt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{t('arrival.optLeaveBagsLoc', 'Hotel Concierge · 120m away (Free with stay)')}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="find-nearby-luggage-btn"
                    onClick={() => setIsLuggageModalOpen(true)}
                    className="sm:self-center px-5 py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border border-white/10 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap active:scale-98"
                  >
                    <span>{t('arrival.optLeaveBagsBtn', 'Find a nearby option')}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5 text-[#F4C36C]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#F4C36C]" />}
                  </button>
                </div>

                {/* OPTION 2 — BREAKFAST */}
                <div 
                  id="option-breakfast-card"
                  className="bg-[#0E2520] rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/20 shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#13312B] text-[#F4C36C] flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
                      ☕
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                          {t('arrival.optBreakfast', 'Breakfast')}
                        </h3>
                        <span className="text-[11px] font-bold text-[#D2E3DE]/60 bg-[#13312B] px-2 py-0.5 rounded-full border border-white/10">
                          {t('arrival.optBreakfastTime', '15–20 min away')}
                        </span>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/80 leading-relaxed max-w-md">
                        {t('arrival.optBreakfastDesc', 'Grab something to eat before you start exploring.')}
                      </p>
                      <span className="text-[12px] text-[#52C4B7] font-semibold flex items-center gap-1 pt-0.5">
                        <span>{t('arrival.optBreakfastVibe', 'Seaside cafes & fresh bakery spots')}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="find-breakfast-btn"
                    onClick={() => setActivityModalType('breakfast')}
                    className="sm:self-center px-5 py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border border-white/10 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98"
                  >
                    <span>{t('arrival.optBreakfastBtn', 'Find breakfast')}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5 text-[#F4C36C]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#F4C36C]" />}
                  </button>
                </div>

                {/* OPTION 3 — BEACH */}
                <div 
                  id="option-beach-card"
                  className="bg-[#0E2520] rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/20 shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#13312B] text-[#52C4B7] flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
                      🏖
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                          {t('arrival.optBeach', 'Beach')}
                        </h3>
                        <span className="text-[11px] font-bold text-[#52C4B7] bg-[#13312B] px-2 py-0.5 rounded-full border border-white/10">
                          {t('arrival.optBeachTag', 'Nearby')}
                        </span>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/80 leading-relaxed max-w-md">
                        {t('arrival.optBeachDesc', 'Take it easy by the sea while you wait.')}
                      </p>
                      <span className="text-[12px] text-[#52C4B7] font-semibold flex items-center gap-1 pt-0.5">
                        <span>{t('arrival.optBeachVibe', 'Shaded cushions & calm shallow reef')}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="explore-beach-btn"
                    onClick={() => setActivityModalType('beach')}
                    className="sm:self-center px-5 py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border border-white/10 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98"
                  >
                    <span>{t('arrival.optBeachBtn', 'Explore')}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5 text-[#F4C36C]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#F4C36C]" />}
                  </button>
                </div>

                {/* OPTION 4 — WALK */}
                <div 
                  id="option-walk-card"
                  className="bg-[#0E2520] rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/20 shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#13312B] text-[#52C4B7] flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
                      🚶
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                          {t('arrival.optWalk', 'Walk around')}
                        </h3>
                        <span className="text-[11px] font-bold text-[#D2E3DE]/60 bg-[#13312B] px-2 py-0.5 rounded-full border border-white/10">
                          {t('arrival.optWalkTag', 'Easy pace')}
                        </span>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/80 leading-relaxed max-w-md">
                        {t('arrival.optWalkDesc', 'Take a relaxed walk and get your first feel of Dahab.')}
                      </p>
                      <span className="text-[12px] text-[#52C4B7] font-semibold flex items-center gap-1 pt-0.5">
                        <span>{t('arrival.optWalkVibe', 'Car-free coastal walkway')}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="explore-walk-btn"
                    onClick={() => setActivityModalType('walk')}
                    className="sm:self-center px-5 py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border border-white/10 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98"
                  >
                    <span>{t('arrival.optWalkBtn', 'Explore')}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5 text-[#F4C36C]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#F4C36C]" />}
                  </button>
                </div>

                {/* OPTION 5 — EARLY CHECK-IN */}
                <div 
                  id="option-early-checkin-card"
                  className="bg-[#0E2520] rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/20 shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#13312B] text-[#52C4B7] flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
                      🏨
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                          {t('arrival.optCheckIn', 'Early check-in')}
                        </h3>
                        <span className="text-[11px] font-bold text-[#52C4B7] bg-[#13312B] px-2 py-0.5 rounded-full border border-white/10">
                          {t('arrival.optCheckInTag', 'Hotel Sync')}
                        </span>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/80 leading-relaxed max-w-md">
                        {t('arrival.optCheckInDesc', 'See if your hotel can prepare the room earlier.')}
                      </p>
                      <span className="text-[12px] text-[#D2E3DE]/50 italic">
                        {t('arrival.optCheckInNote', '*Subject to housekeeping readiness')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="check-early-checkin-btn"
                    onClick={() => setIsEarlyCheckInModalOpen(true)}
                    className="sm:self-center px-5 py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border border-white/10 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98"
                  >
                    <span>{t('arrival.optCheckInBtn', 'Check availability')}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5 text-[#F4C36C]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#F4C36C]" />}
                  </button>
                </div>

              </div>
            </section>

            {/* 3. RECOMMENDATION ("Our suggestion") */}
            <section
              id="arrival-recommendation-card"
              aria-label={t('arrival.regionSuggestion', 'Our suggestion')}
              className="bg-[#0E2520] text-[#F7F3EA] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 relative overflow-hidden border border-white/10"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13312B] text-[#52C4B7] text-xs font-bold border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C36C]" />
                  <span>{t('arrival.suggestionTag', 'Our suggestion')}</span>
                </div>

                <h2 className="text-2xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA] tracking-tight">
                  {t('arrival.suggestionTitle', 'Leave your bags, grab breakfast, and take a short walk by the sea.')}
                </h2>

                <p className="text-xs sm:text-sm text-[#D2E3DE]/85 leading-relaxed font-medium max-w-xl">
                  {t('arrival.suggestionDesc', "You'll have enough time to enjoy Dahab without rushing before check-in.")}
                </p>
              </div>

              {/* Primary Action Button (Single Primary Gold CTA) */}
              <div className="pt-2">
                <button
                  type="button"
                  id="build-first-two-hours-btn"
                  onClick={() => {
                    if (onNavigateToFirstTwoHours) {
                      onNavigateToFirstTwoHours();
                    } else {
                      setIsPlanModalOpen(true);
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 font-['Outfit',sans-serif]"
                >
                  <Sparkles className="w-4 h-4 text-[#081714]" />
                  <span>{t('arrival.build2Hours', 'Build my first 2 hours')}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4 text-[#081714]" /> : <ArrowRight className="w-4 h-4 text-[#081714]" />}
                </button>
              </div>
            </section>

          </div>

          {/* ============================================================ */}
          {/* SECONDARY AREA (5/12 on Desktop) */}
          {/* ============================================================ */}
          <aside className="lg:col-span-5 space-y-6" aria-label={t('arrival.regionContext', 'Arrival context and trip details')}>

            {/* 1. DYNAMIC TIME AWARENESS & STATUS CARD */}
            <div 
              id="arrival-time-budget-card"
              className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                    {t('arrival.contextTag', 'Real-Time Context')}
                  </span>
                  <h2 className="text-lg font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                    {t('arrival.timeWindow', 'Available Time Window')}
                  </h2>
                </div>

                <span className="text-xs font-mono font-bold text-[#F4C36C] bg-[#13312B] px-2.5 py-1 rounded-full border border-white/10">
                  {nowLabel}
                </span>
              </div>

              {/* Visual Progress / Time breakdown */}
              <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F7F3EA]">
                    {clock.checkInReached
                      ? t('arrival.checkInOpenLong', 'Check-in is open — your room should be ready.')
                      : `${t('arrival.timeRemainingPre', 'You have')} ${remainingLabel} ${t('arrival.timeRemainingPost', 'before check-in.')}`}
                  </span>
                  <span className="font-semibold text-[#52C4B7]">{t('arrival.onSchedule', 'On Schedule')}</span>
                </div>

                <div
                  className="w-full h-2.5 rounded-full bg-[#0E2520] overflow-hidden border border-white/5"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={clock.waitProgress}
                  aria-label={t('arrival.waitProgressLabel', 'Time elapsed until check-in')}
                >
                  <div
                    className="h-full rounded-full bg-[#52C4B7] transition-[width] duration-700"
                    style={{ width: `${clock.waitProgress}%` }}
                  ></div>
                </div>

                {/* Arrived -> transition -> check-in only describes a wait that is
                    still ahead. Someone opening this page in the evening has an
                    arrival moment LATER than check-in, and the strip then reads
                    backwards: 9:06 PM (Arrived) -> 6:03 PM -> 3:00 PM (Check-in). */}
                {clock.checkInReached ? (
                  <div className="text-[11px] text-[#D2E3DE]/60 text-center">
                    {`${t('arrival.checkInOpenedAt', 'Check-in opened at')} ${checkInLabel}`}
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-[#D2E3DE]/60">
                    <span>{`${formatClock(clock.arrivedAt, lang)} (${t('arrival.timelineArrivedLabel', 'Arrived')})`}</span>
                    <span>{`${formatClock(clock.transitionAt, lang)} (${t('arrival.timelineTransLabel', 'Transition')})`}</span>
                    <span>{`${checkInLabel} (${t('arrival.timelineCheckInLabel', 'Check-in')})`}</span>
                  </div>
                )}
              </div>

              {/* Contextual parameters summary */}
              <div className="space-y-1.5 text-xs text-[#D2E3DE]/80">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>{t('arrival.currentArea', 'Current Area')}</span>
                  <span className="font-bold text-[#F7F3EA]">{t('arrival.currentAreaVal', 'Lighthouse Promenade')}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>{t('arrival.tripPace', 'Trip Pace')}</span>
                  <span className="font-bold text-[#F7F3EA]">{t(`profile.pace.${profile.pace}`, profile.pace)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>{t('arrival.groupLabel', 'Group')}</span>
                  <span className="font-bold text-[#F7F3EA]">{groupLabel}</span>
                </div>
              </div>
            </div>

            {/* 2. TRIP INTEGRATION ("Coming up") */}
            <div 
              id="arrival-coming-up-card"
              className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                    {t('arrival.itinTag', 'Itinerary Integration')}
                  </span>
                  <h2 className="text-lg font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                    {t('arrival.comingUp', 'Coming up')}
                  </h2>
                </div>

                <span className="text-[12px] font-bold text-[#52C4B7] bg-[#13312B] px-2 py-0.5 rounded-full border border-white/10">
                  {t('itinerary.booked', 'Confirmed ✓')}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Milestone 1: Hotel Check-in */}
                <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0E2520] text-[#52C4B7] flex items-center justify-center flex-shrink-0 font-bold mt-0.5 border border-white/10">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#52C4B7] uppercase tracking-wider font-['Outfit',sans-serif]">
                      {`${t('arrival.today', 'Today')} · ${checkInLabel}`}
                    </span>
                    <h3 className="font-bold text-sm text-[#F7F3EA]">
                      {t('arrival.milestone1Title', 'Hotel Check-in')}
                    </h3>
                    <p className="text-[#D2E3DE]/70 text-[12px]">
                      {t('arrival.milestone1Desc', 'Dahab Bay Hotel · Sea View Deluxe Room')}
                    </p>
                  </div>
                </div>

                {/* Milestone 2: Tomorrow Diving */}
                <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0E2520] text-[#52C4B7] flex items-center justify-center flex-shrink-0 font-bold mt-0.5 border border-white/10">
                    <Waves className="w-4 h-4 text-[#52C4B7]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#52C4B7] uppercase tracking-wider font-['Outfit',sans-serif]">
                      {t('arrival.milestone2Tag', 'Tomorrow · 09:00 AM')}
                    </span>
                    <h3 className="font-bold text-sm text-[#F7F3EA]">
                      {t('arrival.milestone2Title', 'Guided Diving Experience')}
                    </h3>
                    <p className="text-[#D2E3DE]/70 text-[12px]">
                      {t('arrival.milestone2Desc', 'Canyon & Blue Hole Reefs · Full gear reserved')}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-[#D2E3DE]/50 italic">
                {t('arrival.itinFootnote', '*Your temporary early morning choices do not alter your main itinerary.')}
              </p>
            </div>

            {/* 3. HOTEL INFORMATION SHORTCUT CARD */}
            <div 
              id="arrival-hotel-info-card"
              className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-lg space-y-3.5"
            >
              <div className="border-b border-white/10 pb-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                  {t('arrival.accomTag', 'Accommodation')}
                </span>
                <h2 className="text-base font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                  {t('arrival.hotelDetailsTitle', 'Dahab Bay Hotel Details')}
                </h2>
              </div>

              <div className="space-y-2 text-xs text-[#D2E3DE]/80">
                <p className="flex items-center justify-between">
                  <span className="text-[#D2E3DE]/60">{t('arrival.locLabel', 'Location:')}</span>
                  <span className="font-bold text-[#F7F3EA]">{t('arrival.currentAreaVal', 'Lighthouse Promenade')}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-[#D2E3DE]/60">{t('arrival.refLabel', 'Booking Ref:')}</span>
                  <span className="font-mono font-bold text-[#F4C36C]">DBH-8942-ROOM</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-[#D2E3DE]/60">{t('arrival.frontDeskLabel', 'Front Desk:')}</span>
                  <span className="font-semibold text-[#52C4B7]">{t('arrival.frontDeskVal', '24/7 Monitored')}</span>
                </p>
              </div>

              <button
                type="button"
                id="arrival-luggage-drop-quick-btn"
                onClick={() => setIsLuggageModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-full bg-[#13312B] hover:bg-white/10 text-xs font-bold text-[#F7F3EA] border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Luggage className="w-3.5 h-3.5 text-[#F4C36C]" />
                <span>{t('arrival.dropBagsDeskBtn', 'Drop Bags at Hotel Desk (Free)')}</span>
              </button>
            </div>

            {/* 4. PERSISTENT SUPPORT */}
            <div 
              id="arrival-support-card"
              className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#13312B] text-[#52C4B7] flex items-center justify-center flex-shrink-0 border border-white/10">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                    {t('arrival.needAssistance', 'Need immediate assistance?')}
                  </h2>
                  <p className="text-[12px] text-[#D2E3DE]/65">
                    {t('arrival.conciergeDesc', 'Our local Dahab concierge team is available right now.')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="arrival-help-me-now-btn"
                onClick={onOpenHelp}
                className="w-full py-2.5 px-4 rounded-full bg-[#13312B] hover:bg-white/10 text-xs font-bold text-rose-300 border border-rose-500/30 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('arrival.helpMeNowBtn', 'Help Me Now')}</span>
              </button>
            </div>

          </aside>

        </div>

      </main>

      {/* MOBILE STICKY BOTTOM ACTION ("Build my first 2 hours") */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081714]/95 backdrop-blur-lg border-t border-white/10 p-3 shadow-xl flex items-center gap-3">
        <button
          type="button"
          id="build-first-two-hours-mobile-sticky-btn"
          onClick={() => {
            if (onNavigateToFirstTwoHours) {
              onNavigateToFirstTwoHours();
            } else {
              setIsPlanModalOpen(true);
            }
          }}
          className="w-full py-3 px-5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
        >
          <Sparkles className="w-4 h-4 text-[#081714]" />
          <span>{t('arrival.build2Hours', 'Build my first 2 hours')}</span>
          {isRTL ? <ArrowLeft className="w-4 h-4 text-[#081714]" /> : <ArrowRight className="w-4 h-4 text-[#081714]" />}
        </button>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#0E2520] text-[#F7F3EA] text-xs font-bold shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#52C4B7]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      <LuggageStorageModal
        isOpen={isLuggageModalOpen}
        onClose={() => setIsLuggageModalOpen(false)}
        onConfirmStorage={(storageName) => {
          showToast(language === 'ar' ? `تم تأكيد ترك الحقائب في ${storageName} ✓` : `Luggage drop confirmed at ${storageName} ✓`);
        }}
      />

      <EarlyCheckInModal
        isOpen={isEarlyCheckInModalOpen}
        onClose={() => setIsEarlyCheckInModalOpen(false)}
        onSelectOption={(option) => {
          if (option === 'luggage') setIsLuggageModalOpen(true);
          else if (option === 'breakfast') setActivityModalType('breakfast');
          else if (option === 'beach') setActivityModalType('beach');
        }}
      />

      <FirstTwoHoursPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onAcceptPlan={() => {
          showToast(language === 'ar' ? 'تم تفعيل خطة أول ساعتين في دهب! صباح رايق في سيناء ✓' : 'First 2 hours plan activated! Enjoy your Dahab morning ✓');
        }}
        onChangePlan={() => {
          setIsPlanModalOpen(false);
          showToast(language === 'ar' ? 'اختر أي نشاط من الأعلى لتخصيص جدول صباحك.' : 'Select any option above to customize your morning plan.');
        }}
      />

      <ActivityOptionModal
        type={activityModalType}
        onClose={() => setActivityModalType(null)}
        onSelectAction={(actionTitle) => {
          showToast(language === 'ar' ? `تم اختيار ${actionTitle}! ✓` : `${actionTitle} selected! ✓`);
        }}
      />

    </div>
  );
};
