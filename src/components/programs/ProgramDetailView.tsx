import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useReadyProgrammes } from '../../hooks/useReadyProgrammes';
import { READY_TRIP_PROGRAMS, ReadyTripProgram } from '../../data/readyTripsData';
import { api } from '../../services/api';
import { analytics } from '../../services/analytics';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Coffee,
  Calendar,
  Clock,
  CheckCircle2,
  Sliders,
  Sparkles,
  MapPin,
  Compass,
  Star,
  Layers,
  ChevronRight,
  ChevronLeft,
  Users,
  Check
} from 'lucide-react';

export const ProgramDetailView: React.FC = () => {
  const {
    selectedProgramSlug,
    navigateTo,
    profile,
    updateProfile,
    isSignedIn,
    setIntendedRoute,
    showToast,
    openTrip
  } = useTrip();

  const { language, t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  // Served programmes from API with offline fallback
  const programmes = useReadyProgrammes();

  // Resolve current active program based on URL slug or fallback
  const activeProgram: ReadyTripProgram =
    programmes.find((p) => p.id === selectedProgramSlug) ||
    READY_TRIP_PROGRAMS.find((p) => p.id === selectedProgramSlug) ||
    programmes[0] ||
    READY_TRIP_PROGRAMS[0];

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isStartingTrip, setIsStartingTrip] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Scroll to top when active program changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedDayIdx(0);
    setActionError(null);

    analytics.track('ready_trip_previewed', {
      templateId: activeProgram.id,
      durationDays: activeProgram.durationDays,
      budget: activeProgram.defaultBudget
    });
  }, [activeProgram.id]);

  const activeDay = activeProgram.dayByDay[selectedDayIdx] || activeProgram.dayByDay[0];

  // Handle "Start This Trip" action
  const handleStartTrip = async () => {
    analytics.track('ready_trip_started', {
      templateId: activeProgram.id,
      durationDays: activeProgram.durationDays,
      budget: activeProgram.defaultBudget
    });

    if (!isSignedIn) {
      setIntendedRoute(`/programs/${activeProgram.id}`);
      showToast(
        language === 'ar'
          ? 'سجّل دخولك أولاً عشان نضيف البرنامج ده لرحلتك.'
          : 'Sign in so we can add this programme to your trips.'
      );
      navigateTo('/auth/sign-in');
      return;
    }

    setActionError(null);
    setIsStartingTrip(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + activeProgram.durationDays - 1);
      const iso = (d: Date) => d.toISOString().split('T')[0];

      const { trip } = await api.saveTrip({
        id: `TRIP-${activeProgram.id.toUpperCase()}-${Date.now()}`,
        title: language === 'ar' ? activeProgram.titleAr : activeProgram.title,
        status: 'PLANNED',
        lengthDays: activeProgram.durationDays,
        travelersCount: profile.travelersCount || 2,
        budget: activeProgram.defaultBudget,
        pace: activeProgram.pace,
        interests: activeProgram.defaultInterests,
        startDate: iso(startDate),
        endDate: iso(endDate),
        totalEstimatedEGP: activeProgram.startingPriceEGP,
        totalPaidEGP: 0
      });

      openTrip(trip.id);
      showToast(
        language === 'ar'
          ? `تمت إضافة «${activeProgram.titleAr}» لرحلتك — احجز خدماتك خطوة بخطوة.`
          : `"${trip.title}" added to your trips — explore and book services next.`
      );
      navigateTo('/my-trip');
    } catch (err: any) {
      setActionError(
        language === 'ar'
          ? `تعذّرت إضافة البرنامج: ${err?.message || ''}`
          : `The programme could not be added: ${err?.message || ''}`
      );
    } finally {
      setIsStartingTrip(false);
    }
  };

  // Handle "Customize" action
  const handleCustomizeTrip = () => {
    analytics.track('ready_trip_customized', {
      templateId: activeProgram.id,
      durationDays: activeProgram.durationDays,
      budget: activeProgram.defaultBudget
    });

    updateProfile({
      lengthDays: activeProgram.durationDays,
      budget: activeProgram.defaultBudget,
      interests: activeProgram.defaultInterests,
      pace: activeProgram.pace
    });

    navigateTo('/trip-preview');
  };

  // Other programs excluding current
  const otherPrograms = programmes.filter((p) => p.id !== activeProgram.id);

  return (
    <div
      id="program-detail-page"
      className={`min-h-screen pb-28 transition-colors duration-300 ${
        isDark ? 'bg-[#081714] text-[#F7F3EA]' : 'bg-[#FBF9F5] text-[#122420]'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP BREADCRUMB & WAYFINDING BAR */}
      <nav
        aria-label="Breadcrumb navigation"
        className={`border-b sticky top-16 sm:top-20 z-30 backdrop-blur-xl transition-colors ${
          isDark
            ? 'bg-[#081714]/85 border-white/10 text-[#D2E3DE]'
            : 'bg-[#FBF9F5]/90 border-[#122420]/10 text-[#4A635D]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="back-to-home-link"
              onClick={() => navigateTo('/home')}
              className={`inline-flex items-center gap-1.5 transition-colors hover:underline cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-[#122420]'
              }`}
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{t('programPage.breadcrumbHome')}</span>
            </button>

            <span className="opacity-40">/</span>

            <button
              type="button"
              id="back-to-ready-trips-link"
              onClick={() => {
                navigateTo('/home');
                setTimeout(() => {
                  const el = document.getElementById('ready-made-trips-subdeck');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`transition-colors hover:underline cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-[#122420]'
              }`}
            >
              {t('programPage.breadcrumbReady')}
            </button>

            <span className="opacity-40">/</span>

            <span className={`font-bold truncate max-w-[200px] sm:max-w-xs ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
              {language === 'ar' ? activeProgram.titleAr : activeProgram.title}
            </span>
          </div>

          {/* Quick Share / Back CTA */}
          <button
            type="button"
            id="back-to-discovery-top-btn"
            onClick={() => navigateTo('/home')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-[#13312B] hover:bg-[#173832] text-[#F7F3EA] border-white/10'
                : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/15 shadow-xs'
            }`}
          >
            {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t('programPage.backToDiscovery')}</span>
          </button>
        </div>
      </nav>

      {/* 2. FULL-WIDTH EDITORIAL HERO */}
      <section
        id="program-editorial-hero"
        aria-label={language === 'ar' ? activeProgram.titleAr : activeProgram.title}
        className="relative w-full overflow-hidden bg-stone-950 text-white min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex flex-col justify-end"
      >
        {/* Large Imagery Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeProgram.heroImage}
            alt={activeProgram.title}
            className="w-full h-full object-cover object-center opacity-70 filter saturate-[1.15] brightness-[0.85] transform scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Subtle multi-stop gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/40" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pb-16 w-full">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            
            {/* Badges & Trust Strip */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#F4C36C] text-[#081714] shadow-md">
                <Star className="w-3.5 h-3.5 fill-[#081714] text-[#081714]" />
                <span>{language === 'ar' ? activeProgram.badgeAr : activeProgram.badge}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20">
                <Calendar className="w-3.5 h-3.5 text-[#52C4B7]" />
                <span>
                  {activeProgram.durationDays} {language === 'ar' ? 'أيام مبرمجة' : 'Days'} · {language === 'ar' ? activeProgram.paceAr : activeProgram.pace}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('programPage.verifiedGuides')}</span>
              </span>
            </div>

            {/* Program Title */}
            <h1
              id="program-title"
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#F7F3EA] leading-[1.1]"
            >
              {language === 'ar' ? activeProgram.titleAr : activeProgram.title}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-xl text-[#D2E3DE] font-normal leading-relaxed max-w-2xl">
              {language === 'ar' ? activeProgram.taglineAr : activeProgram.tagline}
            </p>

            {/* Price & Primary Call to Action Strip */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              
              {/* Pricing Box */}
              <div className="bg-black/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 inline-block self-start">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/80 block">
                  {t('programPage.startingFrom')}
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#F4C36C]">
                  {activeProgram.startingPriceEGP.toLocaleString()}{' '}
                  <span className="text-xs font-sans font-normal text-white/80">
                    EGP / {language === 'ar' ? 'للفرد' : 'person'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Primary CTA: Start This Trip */}
                <button
                  type="button"
                  id="program-hero-start-trip-btn"
                  onClick={handleStartTrip}
                  disabled={isStartingTrip}
                  className="px-8 py-4 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] active:scale-[0.98] text-[#081714] text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer group/btn"
                >
                  <span>{isStartingTrip ? (language === 'ar' ? 'جاري الإضافة...' : 'Starting...') : t('programPage.startThisTrip')}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180 text-[#081714]" />
                </button>

                {/* Secondary CTA: Customize */}
                <button
                  type="button"
                  id="program-hero-customize-btn"
                  onClick={handleCustomizeTrip}
                  className="px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-[0.98] backdrop-blur-md text-[#F7F3EA] text-sm font-bold border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-[#52C4B7]" />
                  <span>{t('programPage.customizeThisTrip')}</span>
                </button>
              </div>

            </div>

            {actionError && (
              <div role="alert" className="mt-4 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-sm">
                {actionError}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. MAIN PAGE CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16">

        {/* SECTION A: PROGRAM FIT, PACING & INTENSITY GAUGES */}
        <section aria-labelledby="program-fit-heading" className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20A89A]" />
            <h2
              id="program-fit-heading"
              className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}
            >
              {t('programPage.overviewTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Ideal For Card */}
            <div className={`p-6 sm:p-7 rounded-3xl border shadow-md flex flex-col justify-between ${
              isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'
            }`}>
              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                  {t('programPage.whoIsThisFor')}
                </span>
                <h3 className={`text-xl font-serif font-bold leading-snug mb-3 ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? activeProgram.idealForAr : activeProgram.idealFor}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#20A89A] pt-4 border-t border-current/10">
                <Users className="w-4 h-4" />
                <span>{language === 'ar' ? 'مصممة لراحة المسافر ومرونة الوقت' : 'Designed for optimal group flow & pacing'}</span>
              </div>
            </div>

            {/* Pacing & Intensity Gauges */}
            <div className={`p-6 sm:p-7 rounded-3xl border shadow-md space-y-5 ${
              isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'
            }`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                {language === 'ar' ? 'ميزان الإيقاع والنشاط' : 'Pacing & Intensity Balance'}
              </span>

              {/* Activity Intensity */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#EA8E75]" />
                    <span>{t('readyTrip.intensity')}</span>
                  </span>
                  <span className={isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}>
                    Level {activeProgram.intensityScore} / 5
                  </span>
                </div>
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#EA8E75] transition-all duration-500"
                    style={{ width: `${(activeProgram.intensityScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Free Relaxation Time */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-[#20A89A]" />
                    <span>{t('readyTrip.freeTime')}</span>
                  </span>
                  <span className="text-[#20A89A]">{activeProgram.freeTimeScore}% Open Relax</span>
                </div>
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#20A89A] transition-all duration-500"
                    style={{ width: `${activeProgram.freeTimeScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sinai Verified Guarantee Card */}
            <div className={`p-6 sm:p-7 rounded-3xl border shadow-md flex flex-col justify-between ${
              isDark ? 'bg-[#13312B] border-emerald-500/20 text-[#F7F3EA]' : 'bg-emerald-50/70 border-emerald-900/15 text-[#122420]'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    {language === 'ar' ? 'ضمان دهب الميداني' : 'Sinai Local Guarantee'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium mt-2">
                  {t('programPage.lockRates')}
                </p>
              </div>

              <div className="pt-4 border-t border-current/10 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {t('programPage.instantStart')}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION B: DAY-BY-DAY ITINERARY PRESENTATION */}
        <section aria-labelledby="day-by-day-heading" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-current/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 text-[#20A89A]" />
                <span className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
                  {t('programPage.daysScheduled')}
                </span>
              </div>
              <h2
                id="day-by-day-heading"
                className={`text-2xl sm:text-4xl font-serif font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}
              >
                {t('programPage.dayByDayTitle')}
              </h2>
            </div>

            <div className={`text-xs font-medium ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
              {language === 'ar' ? `اليوم ${selectedDayIdx + 1} من إجمالي ${activeProgram.dayByDay.length} أيام` : `Day ${selectedDayIdx + 1} of ${activeProgram.dayByDay.length} days`}
            </div>
          </div>

          {/* Day Selection Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
            {activeProgram.dayByDay.map((day, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={day.day}
                  type="button"
                  id={`program-day-tab-${day.day}`}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2.5 shadow-sm ${
                    isSelected
                      ? 'bg-[#20A89A] text-[#081714] ring-2 ring-[#20A89A]/30 scale-[1.02]'
                      : isDark
                      ? 'bg-[#0E2520] text-[#D2E3DE] hover:bg-[#13312B] border border-white/10'
                      : 'bg-white text-[#4A635D] hover:bg-[#F2EFE9] border border-[#122420]/10'
                  }`}
                >
                  <span className="text-sm font-extrabold font-serif">
                    {language === 'ar' ? `يوم ٠${day.day}` : `Day 0${day.day}`}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#081714]/20 text-[#081714]'
                        : isDark
                        ? 'bg-[#13312B] text-[#9DB5AF]'
                        : 'bg-[#F2EFE9] text-[#6B7C83]'
                    }`}
                  >
                    {day.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Editorial Showcase Card */}
          <div
            id={`program-active-day-card-${activeDay.day}`}
            className={`p-6 sm:p-10 rounded-3xl border shadow-xl transition-all duration-300 ${
              isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
            }`}
          >
            {/* Active Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-current/10 gap-4">
              <div>
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
                  {language === 'ar' ? `محور اليوم ٠${activeDay.day}` : `Day 0${activeDay.day} Focus & Rhythm`}
                </span>
                <h3 className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {activeDay.title}
                </h3>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold self-start sm:self-auto ${
                isDark ? 'bg-[#13312B] border-white/10 text-[#52C4B7]' : 'bg-[#F2EFE9] border-[#122420]/10 text-[#0F6F78]'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{activeDay.timeEstimate}</span>
              </div>
            </div>

            {/* Narrative Subtitle */}
            <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-3xl font-normal ${
              isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'
            }`}>
              {activeDay.subtitle}
            </p>

            {/* Highlights Grid */}
            <div>
              <h4 className={`text-xs font-extrabold uppercase tracking-wider mb-4 ${
                isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'
              }`}>
                {language === 'ar' ? 'أبرز محطات اليوم:' : 'Curated Day Highlights:'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeDay.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#13312B]/70 border-white/10 hover:border-white/20'
                        : 'bg-[#FAF7F0] border-[#122420]/10 hover:border-[#122420]/25'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-snug">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION C: INCLUSIONS VS CUSTOMIZABILITY */}
        <section aria-labelledby="inclusions-heading" className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4C36C]" />
            <h2
              id="inclusions-heading"
              className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-[#F4C36C]' : 'text-[#8F7242]'}`}
            >
              {language === 'ar' ? 'التفاصيل والشفافية الكاملة' : 'Transparent Inclusions & Customization'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* What's Included Card */}
            <div className={`p-7 sm:p-8 rounded-3xl border shadow-xl ${
              isDark ? 'bg-[#0E2520] border-emerald-500/20' : 'bg-white border-emerald-900/15'
            }`}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-current/10">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-serif font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                    {t('programPage.includedTitle')}
                  </h3>
                  <span className={`text-xs ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                    {language === 'ar' ? 'مشمولة بالكامل ضمن السعر التقديري' : 'Standard in this curated itinerary'}
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5">
                {(language === 'ar' ? activeProgram.includedItemsAr : activeProgram.includedItems).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className={isDark ? 'text-[#D2E3DE]' : 'text-[#122420]'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Can Customize Card */}
            <div className={`p-7 sm:p-8 rounded-3xl border shadow-xl ${
              isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'
            }`}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-current/10">
                <div className="w-10 h-10 rounded-2xl bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center shadow-sm">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-serif font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                    {t('programPage.customizableTitle')}
                  </h3>
                  <span className={`text-xs ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                    {language === 'ar' ? 'تقدر تعدلها قبل أو أثناء الرحلة' : 'Adjust freely to match your vibe'}
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5">
                {(language === 'ar' ? activeProgram.customizableItemsAr : activeProgram.customizableItems).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className={isDark ? 'text-[#D2E3DE]' : 'text-[#122420]'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* SECTION D: OTHER CURATED READY-MADE TRIPS RAIL */}
        <section aria-labelledby="other-programs-heading" className={`pt-12 border-t ${
          isDark ? 'border-white/10' : 'border-[#122420]/10'
        }`}>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
                {t('programPage.allFivePrograms')}
              </span>
              <h2
                id="other-programs-heading"
                className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}
              >
                {t('programPage.exploreOtherPrograms')}
              </h2>
            </div>

            <button
              type="button"
              id="view-all-ready-trips-btn"
              onClick={() => {
                navigateTo('/home');
                setTimeout(() => {
                  const el = document.getElementById('ready-made-trips-subdeck');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isDark ? 'bg-[#13312B] text-[#F7F3EA] border-white/10' : 'bg-white text-[#122420] border-[#122420]/10'
              }`}
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {otherPrograms.map((prog) => (
              <button
                key={prog.id}
                type="button"
                id={`other-program-card-${prog.id}`}
                onClick={() => navigateTo('/programs', { programSlug: prog.id })}
                className={`group text-start rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl cursor-pointer ${
                  isDark
                    ? 'bg-[#0E2520] border-white/10 hover:border-white/25 text-[#F7F3EA]'
                    : 'bg-white border-[#122420]/10 hover:border-[#122420]/25 text-[#122420]'
                }`}
              >
                <div className="relative h-40 bg-stone-900 overflow-hidden w-full">
                  <img
                    src={prog.heroImage}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold text-[#52C4B7]">
                      {prog.durationDays} {language === 'ar' ? 'أيام' : 'Days'} · {language === 'ar' ? prog.paceAr : prog.pace}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-white leading-tight truncate mt-0.5">
                      {language === 'ar' ? prog.titleAr : prog.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? prog.taglineAr : prog.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-current/10">
                    <div>
                      <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                        {t('programPage.startingFrom')}
                      </span>
                      <span className={`text-xs font-bold font-serif ${isDark ? 'text-[#F4C36C]' : 'text-[#0E2520]'}`}>
                        {prog.startingPriceEGP.toLocaleString()} EGP
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#20A89A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform rtl:rotate-180">
                      <span>{t('programPage.viewOtherProgram')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* 4. PERSISTENT STICKY BOTTOM CONVERSION BAR */}
      <div
        id="program-bottom-sticky-bar"
        className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-black/80 backdrop-blur-xl border-t border-white/15 text-white transition-transform"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Price & Summary Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <span className="text-[11px] uppercase tracking-wider text-white/70 block">
                {language === 'ar' ? activeProgram.titleAr : activeProgram.title}
              </span>
              <div className="text-lg font-bold font-serif text-[#F4C36C]">
                {activeProgram.startingPriceEGP.toLocaleString()} <span className="text-xs font-normal text-white/80">EGP / {language === 'ar' ? 'فرد' : 'person'}</span>
              </div>
            </div>
            <div className="sm:hidden">
              <div className="text-base font-bold font-serif text-[#F4C36C]">
                {activeProgram.startingPriceEGP.toLocaleString()} <span className="text-[11px] font-normal text-white/80">EGP</span>
              </div>
              <span className="text-[10px] text-white/70 block">
                {activeProgram.durationDays} {language === 'ar' ? 'أيام' : 'Days'} · {language === 'ar' ? activeProgram.paceAr : activeProgram.pace}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="sticky-customize-btn"
              onClick={handleCustomizeTrip}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer border border-white/20"
            >
              <span className="hidden sm:inline">{t('programPage.customizeThisTrip')}</span>
              <span className="sm:hidden">{t('readyTrip.customize')}</span>
            </button>

            <button
              type="button"
              id="sticky-start-trip-btn"
              onClick={handleStartTrip}
              disabled={isStartingTrip}
              className="px-6 py-2.5 rounded-xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <span>{isStartingTrip ? '...' : t('programPage.startThisTrip')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
