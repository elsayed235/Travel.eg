import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { analytics } from '../../services/analytics';
import { READY_TRIP_PROGRAMS, ReadyTripProgram } from '../../data/readyTripsData';
import { ReadyTripPreviewModal } from './ReadyTripPreviewModal';
import { ReadyTripCompareModal } from './ReadyTripCompareModal';
import { SmartTripMatchQuizModal } from './SmartTripMatchQuizModal';
import { PlanItForMeModal } from './PlanItForMeModal';
import { ReadyMadeTripsCarousel } from './ReadyMadeTripsCarousel';
import { QuickStartWizard } from './QuickStartWizard';
import {
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Sliders,
  RotateCcw,
  Check,
  Zap,
  MapPin,
  ChevronRight,
  Flame,
  Waves,
  Star,
  ShieldCheck,
  Sun,
  Eye,
  HelpCircle,
  Clock
} from 'lucide-react';

interface TripEntrySectionProps {
  onStartCustomPlanner: () => void;
  onOpenItinerary: () => void;
}

export const TripEntrySection: React.FC<TripEntrySectionProps> = ({
  onStartCustomPlanner,
  onOpenItinerary
}) => {
  const { language, t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const { profile, updateProfile, tripDays, navigateTo, user, isSignedIn, sessionUser, setIntendedRoute, showToast, openTrip } = useTrip();
  const [readyTripError, setReadyTripError] = useState<string | null>(null);
  const [isBookingReadyTrip, setIsBookingReadyTrip] = useState(false);

  // Mode experience filter
  const [selectedDoorwayFilter, setSelectedDoorwayFilter] = useState<'all' | 'custom' | 'ready' | 'ai'>('all');

  // Modals state
  const [previewProgramId, setPreviewProgramId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);

  // Micro-interactive parameters for Doorway A
  const [customDays, setCustomDays] = useState<number>(profile.lengthDays || 5);
  const [customTravelers, setCustomTravelers] = useState<number>(profile.travelersCount || 2);
  const [customBudget, setCustomBudget] = useState<'Budget' | 'Moderate' | 'Premium'>(profile.budget || 'Moderate');
  const [customPace, setCustomPace] = useState<'Relaxed' | 'Balanced' | 'Active'>('Balanced');

  // Micro-interactive parameters for Doorway C
  const [aiVibe, setAiVibe] = useState<string>('Diving');

  // Was gated on the Firebase user, so a signed-in traveler with a real
  // itinerary was still offered the "start a new trip" path.
  const hasExistingTrip = Boolean(isSignedIn && tripDays && tripDays.length > 0);

  useEffect(() => {
    analytics.track('trip_entry_viewed');
  }, []);

  const handleFilterChange = (filterId: 'all' | 'custom' | 'ready' | 'ai') => {
    const prev = selectedDoorwayFilter;
    setSelectedDoorwayFilter(filterId);
    analytics.track('entry_mode_switched', {
      sourceMode: prev,
      targetMode: filterId
    });
  };

  // Mode Handlers
  const handleSelectModeA = () => {
    analytics.track('build_myself_selected', {
      durationDays: customDays,
      travelersCount: customTravelers,
      budget: customBudget,
      pace: customPace
    });
    updateProfile({
      lengthDays: customDays,
      travelersCount: customTravelers,
      budget: customBudget,
      pace: customPace
    });
    onStartCustomPlanner();
  };

  const handleOpenProgramPreview = (program: ReadyTripProgram) => {
    setPreviewProgramId(program.id);
    setIsPreviewOpen(true);
    analytics.track('ready_trip_previewed', {
      templateId: program.id,
      durationDays: program.durationDays,
      budget: program.defaultBudget
    });
  };

  const handleSelectReadyTripsMode = () => {
    analytics.track('ready_trip_selected', {
      templateId: READY_TRIP_PROGRAMS[0].id
    });
    handleOpenProgramPreview(READY_TRIP_PROGRAMS[0]);
  };

  const handleSelectAiMode = () => {
    analytics.track('plan_it_for_me_selected', {
      metadata: { aiVibe }
    });
    setIsPlanModalOpen(true);
  };

  const handleApplyReadyTrip = (program: ReadyTripProgram, mode: 'book' | 'customize') => {
    setIsPreviewOpen(false);
    updateProfile({
      lengthDays: program.durationDays,
      budget: program.defaultBudget,
      interests: program.defaultInterests,
      pace: program.pace
    });

    analytics.track('trip_created', {
      templateId: program.id,
      durationDays: program.durationDays,
      metadata: { mode }
    });

    if (mode !== 'book') {
      navigateTo('/trip-preview');
      return;
    }

    // "Start this trip" creates the trip. It does not charge for it.
    //
    // Two wrong versions preceded this. The original was
    // navigateTo('/bookings') and nothing else — verified end to end: zero API
    // calls, no trip, no booking, and the bookings page then showed an
    // unrelated hardcoded reference. The second put the whole programme
    // through checkout as a single hotel item with `skuId: program.id` — a
    // programme id, not a product — which the server answered by substituting
    // an unrelated SKU and dispatching to its supplier, while charging the
    // starting price.
    //
    // A ready-made programme is an itinerary template: a duration, a pace, a
    // budget band and a set of interests, with a *starting* price and no
    // inventory behind it. Starting one is planning, not buying, which is also
    // what the button says. The traveler books the individual services
    // afterwards, through the flows that do have inventory.
    if (!isSignedIn) {
      setIntendedRoute('/home');
      showToast(
        language === 'ar'
          ? 'سجّل دخولك عشان نضيف البرنامج ده لرحلتك.'
          : 'Sign in so we can add this programme to your trips.'
      );
      navigateTo('/auth/sign-in');
      return;
    }

    setReadyTripError(null);
    setIsBookingReadyTrip(true);
    void (async () => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + program.durationDays - 1);
        const iso = (d: Date) => d.toISOString().split('T')[0];

        const { trip } = await api.saveTrip({
          id: `TRIP-${program.id.toUpperCase()}-${Date.now()}`,
          title: program.title,
          status: 'PLANNED',
          lengthDays: program.durationDays,
          travelersCount: profile.travelersCount || 1,
          budget: program.defaultBudget,
          pace: program.pace,
          interests: program.defaultInterests,
          startDate: iso(startDate),
          endDate: iso(endDate),
          // A *starting* price is not a total and must not be recorded as one.
          totalEstimatedEGP: program.startingPriceEGP,
          totalPaidEGP: 0
        });

        // Open on the trip they just started, not on whichever one ranks highest.
        openTrip(trip.id);
        showToast(
          language === 'ar'
            ? `تمت إضافة «${program.titleAr}» لرحلاتك — دلوقتي احجز الخدمات اللي فيها.`
            : `"${trip.title}" added to your trips — book its services next.`
        );
        navigateTo('/my-trip');
      } catch (err: any) {
        setReadyTripError(
          language === 'ar'
            ? `تعذّرت إضافة البرنامج: ${err?.message || ''}`
            : `The programme could not be added: ${err?.message || ''}`
        );
      } finally {
        setIsBookingReadyTrip(false);
      }
    })();
  };

  const handlePlanGenerated = () => {
    setIsPlanModalOpen(false);
    analytics.track('trip_created', {
      metadata: { source: 'ai_director' }
    });
    navigateTo('/trip-preview');
  };

  return (
    <section
      id="how-do-you-want-to-experience-dahab"
      className={`py-14 sm:py-20 border-b relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#081714] border-white/10' : 'bg-[#FBF9F5] border-[#122420]/10'
      }`}
      aria-label="Trip Entry Experience"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle Sinai Ambient Gradient Backdrop */}
      <div className={`absolute top-0 inset-x-0 h-96 pointer-events-none ${
        isDark
          ? 'bg-gradient-to-b from-[#0E2520]/40 via-transparent to-transparent'
          : 'bg-gradient-to-b from-[#F2EFE9]/60 via-transparent to-transparent'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Active Journey Resume Banner (if traveler has existing active trip) */}
        {hasExistingTrip && (
          <div
            id="active-trip-resume-banner"
            className={`mb-10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${
              isDark
                ? 'bg-[#0E2520] border-[#20A89A]/40'
                : 'bg-white border-[#20A89A]/40 text-[#122420]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md border ${
                isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-[#F2EFE9] text-[#0F6F78] border-[#122420]/10'
              }`}>
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#20A89A] bg-[#20A89A]/15 px-2.5 py-0.5 rounded-full border border-[#20A89A]/30">
                    {t('tripEntry.resume.badge')}
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                    {tripDays.length} {language === 'ar' ? 'أيام مبرمجة وجاهزة' : 'Days Scheduled'}
                  </span>
                </div>
                <h4 className={`text-base font-bold mt-1 ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {t('tripEntry.resume.title')} · {profile.name || (language === 'ar' ? 'المسافر' : 'Traveler')}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="resume-active-itinerary-btn"
                onClick={onOpenItinerary}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span>{t('tripEntry.resume.cta')}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Master Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm mb-4 border ${
            isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#52C4B7]" />
            <span
              id="trip-entry-eyebrow"
              className={`text-[12px] font-extrabold uppercase tracking-widest ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}
            >
              {t('tripEntry.eyebrow')}
            </span>
          </div>

          <h2
            id="trip-entry-title"
            className={`text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight leading-tight font-bold ${
              isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
            }`}
          >
            {t('tripEntry.title')}
          </h2>

          <p
            id="trip-entry-subtitle"
            className={`mt-3 text-base sm:text-lg leading-relaxed font-normal ${
              isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'
            }`}
          >
            {t('tripEntry.subtitle')}
          </p>

          {/* User Persona Filter Pill Bar */}
          <div className={`mt-7 inline-flex p-1.5 rounded-2xl border ${
            isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10 shadow-xs'
          }`}>
            {([
              { id: 'all', label: 'All 3 Pathways', labelAr: 'المسارات الثلاثة' },
              { id: 'ready', label: 'Ready Trips (Easiest)', labelAr: 'رحلات جاهزة (الأسهل)' },
              { id: 'custom', label: 'Build Myself (Full Control)', labelAr: 'صمم بنفسك (تحكم كامل)' },
              { id: 'ai', label: 'Plan It For Me (60s)', labelAr: 'خططها لي (في دقيقة)' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDoorwayFilter === tab.id
                    ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)] shadow-none'
                    : isDark ? 'text-[#D2E3DE] hover:text-white' : 'text-[#4A635D] hover:text-[#122420]'
                }`}
              >
                {language === 'ar' ? tab.labelAr : tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Three Master Doorway Cards Grid */}
        <div id="trip-entry-doorways-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* DOORWAY A: BUILD MYSELF (Full Control)                    */}
          {/* ========================================================= */}
          {(selectedDoorwayFilter === 'all' || selectedDoorwayFilter === 'custom') && (
            <div
              id="doorway-card-build-my-dahab"
              className={`group rounded-3xl p-7 sm:p-8 border shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isDark
                  ? 'bg-[#0E2520] border-white/10 hover:border-white/25 text-[#F7F3EA]'
                  : 'bg-white border-[#122420]/10 hover:border-[#122420]/25 text-[#122420]'
              }`}
            >
              <div>
                {/* Header Tag + Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#20A89A] bg-[#20A89A]/15 px-3 py-1 rounded-full border border-[#20A89A]/30">
                    {t('tripEntry.modeA.tag')}
                  </span>
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-[#20A89A] shadow-sm group-hover:scale-105 transition-transform ${
                    isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                  }`}>
                    <Compass className="w-5 h-5" />
                  </div>
                </div>

                <h3 className={`text-2xl font-serif font-bold mb-2 leading-tight ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {t('tripEntry.modeA.title')}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-6 font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                  {t('tripEntry.modeA.desc')}
                </p>

                {/*
                  Interactive Micro-Customizer Console — desktop only.

                  This card's job on mobile is "choose this path", but it was
                  also asking the traveler to configure duration and party size
                  before they had chosen anything. That pushed the three
                  doorways to ~2 screens on a 375px viewport, so the chooser
                  could not actually be compared — you saw one option at a time.

                  The planner asks both questions anyway (StepDuration and
                  StepTravelers), so nothing is lost: mobile users compare three
                  compact cards, pick one, and configure inside the flow where
                  the question belongs. Desktop keeps the shortcut, where three
                  columns sit side by side and the space is free.
                */}
                <div className={`hidden sm:block space-y-4 p-4 rounded-2xl border mb-6 text-xs ${
                  isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                }`}>
                  
                  {/* Duration Picker */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                        {language === 'ar' ? 'المدة' : 'Trip Length'}
                      </span>
                      <span className="text-xs font-bold text-[#20A89A]">
                        {customDays} {language === 'ar' ? 'أيام' : 'Days'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 4, 5, 7].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setCustomDays(d)}
                          className={`py-2 rounded-xl font-bold text-center text-xs transition-all cursor-pointer ${
                            customDays === d
                              ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)] shadow-none'
                              : isDark
                              ? 'bg-[#0E2520] text-[#D2E3DE] hover:bg-[#081714] border border-white/10'
                              : 'bg-white text-[#4A635D] hover:bg-stone-100 border border-[#122420]/10'
                          }`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Travelers Picker */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                        {language === 'ar' ? 'المسافرين' : 'Travelers'}
                      </span>
                      <span className="text-xs font-bold text-[#20A89A]">
                        {customTravelers === 1 ? 'Solo' : customTravelers === 2 ? 'Couple' : `${customTravelers} Guests`}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { count: 1, label: 'Solo', labelAr: 'فردي' },
                        { count: 2, label: 'Couple', labelAr: 'زوجين' },
                        { count: 4, label: 'Crew (4+)', labelAr: 'شلة (٤+)' }
                      ].map((item) => (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => setCustomTravelers(item.count)}
                          className={`py-2 rounded-xl font-bold text-center text-xs transition-all cursor-pointer ${
                            customTravelers === item.count
                              ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)] shadow-none'
                              : isDark
                              ? 'bg-[#0E2520] text-[#D2E3DE] hover:bg-[#081714] border border-white/10'
                              : 'bg-white text-[#4A635D] hover:bg-stone-100 border border-[#122420]/10'
                          }`}
                        >
                          {language === 'ar' ? item.labelAr : item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Primary Action Button */}
              <button
                id="build-my-dahab-cta-btn"
                onClick={handleSelectModeA}
                className={`w-full py-4 px-5 rounded-2xl active:scale-[0.98] text-xs font-bold flex items-center justify-center gap-2 border shadow-md transition-all cursor-pointer group/btn ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#20A89A] hover:text-[#081714] text-[#F7F3EA] border-white/10'
                    : 'bg-[#122420] hover:bg-[#20A89A] text-[#F7F3EA] border-[#122420]/20'
                }`}
              >
                <span>{t('tripEntry.modeA.cta')}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* DOORWAY B: READY TRIPS (Easiest Start - Recommended)      */}
          {/* ========================================================= */}
          {(selectedDoorwayFilter === 'all' || selectedDoorwayFilter === 'ready') && (
            <div
              id="doorway-card-ready-made-trip"
              className={`group rounded-3xl p-7 sm:p-8 border-2 border-[#F4C36C] shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isDark ? 'bg-[#0E2520] text-[#F7F3EA]' : 'bg-white text-[#122420]'
              }`}
            >
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-0 bg-[#F4C36C] text-[#081714] text-[11px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-[#081714] text-[#081714]" />
                <span>{t('tripEntry.recommendedBadge')}</span>
              </div>

              <div>
                {/* Header Tag + Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E7A83B] bg-[#F4C36C]/15 px-3 py-1 rounded-full border border-[#F4C36C]/30">
                    {t('tripEntry.modeB.tag')}
                  </span>
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-sm text-[#F4C36C] group-hover:scale-105 transition-transform ${
                    isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                  }`}>
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

                <h3 className={`text-2xl font-serif font-bold mb-2 leading-tight ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {t('tripEntry.modeB.title')}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-6 font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                  {t('tripEntry.modeB.desc')}
                </p>

                {/* 3 Featured Programs Mini Rail */}
                {/*
                  Desktop only: this card previews three ready trips, and the
                  full Ready Trips carousel renders directly beneath this grid
                  with the same programs. On mobile that duplication cost a
                  screen and pushed the third doorway further out of reach,
                  for content the traveler reaches two seconds later anyway.
                */}
                <div className="hidden sm:block space-y-2.5 mb-6">
                  {READY_TRIP_PROGRAMS.slice(0, 3).map((prog) => (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => handleOpenProgramPreview(prog)}
                      aria-label={`${language === 'ar' ? 'اعرض برنامج' : 'Preview trip'}: ${language === 'ar' ? prog.titleAr : prog.title}`}
                      className={`group/item w-full text-start p-3 rounded-2xl border flex items-center gap-3.5 cursor-pointer transition-all shadow-sm ${
                        isDark
                          ? 'bg-[#13312B] hover:bg-[#173832] border-white/10 hover:border-[#F4C36C]/40'
                          : 'bg-[#F2EFE9] hover:bg-[#EAE6DF] border-[#122420]/10 hover:border-[#E7A83B]/40'
                      }`}
                    >
                      <img
                        src={prog.heroImage}
                        alt={prog.title}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold truncate group-hover/item:text-[#F4C36C] transition-colors ${
                            isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
                          }`}>
                            {language === 'ar' ? prog.titleAr : prog.title}
                          </h4>
                          <span className={`text-xs font-extrabold ${isDark ? 'text-[#F4C36C]' : 'text-[#0E2520]'}`}>
                            {prog.startingPriceEGP.toLocaleString()} <span className={`text-[11px] font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>EGP</span>
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-[12px] mt-0.5 ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                          <span>{prog.durationDays} {language === 'ar' ? 'أيام' : 'Days'}</span>
                          <span>•</span>
                          <span className="text-[#20A89A] font-semibold">{language === 'ar' ? prog.paceAr : prog.pace}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#F4C36C] opacity-70 group-hover/item:translate-x-1 transition-all flex-shrink-0 rtl:rotate-180" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {readyTripError && (
                  <div role="alert" className="mb-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm">
                    {readyTripError}
                  </div>
                )}

                <button
                  id="explore-ready-trips-btn"
                  onClick={handleSelectReadyTripsMode}
                  className="w-full py-4 px-5 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] active:scale-[0.98] text-[#081714] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group/btn"
                >
                  <span>{t('tripEntry.modeB.cta')}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
                </button>

                {/* Sub utilities */}
                <div className="flex items-center justify-between text-xs px-1 font-bold">
                  <button
                    id="compare-programs-quick-link"
                    onClick={() => setIsCompareOpen(true)}
                    className={`cursor-pointer flex items-center gap-1 ${isDark ? 'text-[#D2E3DE] hover:text-white' : 'text-[#4A635D] hover:text-[#122420]'}`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#20A89A]" />
                    <span>{t('tripEntry.modeB.compareBtn')}</span>
                  </button>
                  <button
                    id="quiz-programs-quick-link"
                    onClick={() => setIsQuizOpen(true)}
                    className={`cursor-pointer flex items-center gap-1 ${isDark ? 'text-[#F4C36C] hover:text-[#E7A83B]' : 'text-[#8F7242] hover:text-[#0E2520]'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('tripEntry.modeB.whichIsRight')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* DOORWAY C: PLAN IT FOR ME (Done With You in 60s)          */}
          {/* ========================================================= */}
          {(selectedDoorwayFilter === 'all' || selectedDoorwayFilter === 'ai') && (
            <div
              id="doorway-card-plan-it-for-me"
              className={`group rounded-3xl p-7 sm:p-8 border shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isDark
                  ? 'bg-[#0E2520] text-[#F7F3EA] border-white/10 hover:border-white/25'
                  : 'bg-white text-[#122420] border-[#122420]/10 hover:border-[#122420]/25'
              }`}
            >
              <div className="relative z-10">
                {/* Header Tag + Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#20A89A] bg-[#20A89A]/15 px-3 py-1 rounded-full border border-[#20A89A]/30">
                    {t('tripEntry.modeC.tag')}
                  </span>
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${
                    isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                  }`}>
                    <Sparkles className="w-5 h-5 text-[#F4C36C]" />
                  </div>
                </div>

                <h3 className={`text-2xl font-serif font-bold mb-2 leading-tight ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {t('tripEntry.modeC.title')}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-6 font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                  {t('tripEntry.modeC.desc')}
                </p>

                {/* AI Features & Trust Highlights */}
                <div className={`space-y-3 p-4 rounded-2xl border mb-6 text-xs ${
                  isDark ? 'bg-[#13312B] border-white/10 text-[#F7F3EA]' : 'bg-[#F2EFE9] border-[#122420]/10 text-[#122420]'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#20A89A]/20 flex items-center justify-center flex-shrink-0 text-[#20A89A]">
                      <Waves className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'ar' ? 'مربوط بحالة البحر والرياح المباشرة' : 'Live sea tides & wind conditions sync'}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E7A83B]/20 flex items-center justify-center flex-shrink-0 text-[#F4C36C]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'ar' ? 'أماكن وفنادق معتمدة ومجربة' : 'Curated boutique stays & seaside tables'}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#20A89A]/20 flex items-center justify-center flex-shrink-0 text-[#20A89A]">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'ar' ? 'جدول كامل ومفصل في ٦٠ ثانية' : 'Cohesive schedule created in 60s'}</span>
                  </div>
                </div>

                {/*
                  Quick Sinai Vibe Selector — desktop only.

                  This selection only feeds an analytics metadata field
                  (`aiVibe`); the actual interests that shape the plan are
                  collected by PlanItForMeModal, which asks the same question
                  with the same options. On mobile it was therefore asked twice
                  and made the third doorway taller and harder to reach.
                */}
                <div className="hidden sm:block mb-6">
                  <span className={`text-[12px] font-extrabold uppercase tracking-wider block mb-2 ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                    {language === 'ar' ? 'اختر الطابع المفضل:' : 'Choose your preferred focus:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Diving', label: 'Diving & Reefs', labelAr: 'غطس وشعاب' },
                      { id: 'Adventure', label: 'Canyons & Safari', labelAr: 'كانيونات وسفاري' },
                      { id: 'Slow', label: 'Slow & Relaxation', labelAr: 'روقان واسترخاء' },
                      { id: 'Romantic', label: 'Couples Escape', labelAr: 'رومانسي وفاخر' },
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setAiVibe(v.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          aiVibe === v.id
                            ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)] shadow-none font-extrabold'
                            : isDark
                            ? 'bg-[#13312B] hover:bg-[#173832] text-[#D2E3DE] border border-white/10'
                            : 'bg-white hover:bg-stone-100 text-[#4A635D] border border-[#122420]/10'
                        }`}
                      >
                        {language === 'ar' ? v.labelAr : v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary AI CTA */}
              <button
                id="plan-it-for-me-cta-btn"
                onClick={handleSelectAiMode}
                className="w-full py-4 px-5 rounded-2xl bg-[#20A89A] hover:bg-[#52C4B7] active:scale-[0.98] text-[#081714] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group/btn relative z-10"
              >
                <Sparkles className="w-4 h-4 text-[#081714]" />
                <span>{t('tripEntry.modeC.cta')}</span>
                <ArrowRight className="w-4 h-4 text-[#081714] group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
              </button>
            </div>
          )}

        </div>

        {/* 5 Curated Ready-Made Trips Carousel Subdeck */}
        <ReadyMadeTripsCarousel
          onPreviewProgram={handleOpenProgramPreview}
          onOpenCompare={() => setIsCompareOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
        />

      </div>

      {/* Program Preview Modal */}
      <ReadyTripPreviewModal
        programId={previewProgramId}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelectProgram={handleApplyReadyTrip}
        onOpenCompare={() => {
          setIsPreviewOpen(false);
          setIsCompareOpen(true);
        }}
      />

      {/* Program Comparison Modal */}
      <ReadyTripCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectProgram={(p) => {
          setIsCompareOpen(false);
          handleOpenProgramPreview(p);
        }}
      />

      {/* Smart Match Quiz Modal */}
      <SmartTripMatchQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectProgram={(p) => {
          setIsQuizOpen(false);
          handleOpenProgramPreview(p);
        }}
      />

      {/* Plan It For Me Modal */}
      <PlanItForMeModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onPlanGenerated={handlePlanGenerated}
      />

    </section>
  );
};

