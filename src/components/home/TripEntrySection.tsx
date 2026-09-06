import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { analytics } from '../../services/analytics';
import { READY_TRIP_PROGRAMS, ReadyTripProgram } from '../../data/readyTripsData';
import { ReadyTripCompareModal } from './ReadyTripCompareModal';
import { SmartTripMatchQuizModal } from './SmartTripMatchQuizModal';
import { ReadyMadeTripsCarousel } from './ReadyMadeTripsCarousel';
import {
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  Calendar,
  Users
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
  const {
    profile,
    tripDays,
    navigateTo,
    isSignedIn,
    updateProfile
  } = useTrip();

  // Modals state
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  const hasExistingTrip = Boolean(isSignedIn && tripDays && tripDays.length > 0);

  useEffect(() => {
    analytics.track('trip_entry_viewed');
  }, []);

  // Pathway Handlers
  const handleSelectBuildMyself = () => {
    analytics.track('build_myself_selected', {
      durationDays: profile.lengthDays || 5,
      travelersCount: profile.travelersCount || 2,
      budget: profile.budget || 'Moderate'
    });
    onStartCustomPlanner();
  };

  const handleSelectReadyTrips = () => {
    analytics.track('ready_trip_selected');
    const el = document.getElementById('ready-made-trips-subdeck');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigateTo('/programs', { programSlug: READY_TRIP_PROGRAMS[0].id });
    }
  };

  /**
   * Opens the planner as a page, not a dialog.
   *
   * It used to raise PlanItForMeModal over the homepage, which meant the five
   * questions could not be linked, survive a refresh, or be stepped back
   * through with the browser's own Back button. /plan-for-me is a real route,
   * so all three work by default.
   */
  const handleSelectAiMode = () => {
    analytics.track('plan_it_for_me_selected');
    navigateTo('/plan-for-me');
  };

  const handleOpenProgram = (program: ReadyTripProgram) => {
    analytics.track('ready_trip_previewed', {
      templateId: program.id,
      durationDays: program.durationDays,
      budget: program.defaultBudget
    });
    navigateTo('/programs', { programSlug: program.id });
  };

  return (
    <section
      id="how-do-you-want-to-experience-dahab"
      className="py-14 sm:py-20 border-b relative overflow-hidden transition-colors duration-300 bg-[var(--bg-canvas)] border-[var(--border-subtle)]"
      aria-label="Trip Planning Entry Experience"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Ambient Sinai Glow */}
      <div
        className={`absolute top-0 inset-x-0 h-96 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-[var(--surface-card)]/40 via-transparent to-transparent'
            : 'bg-gradient-to-b from-[var(--surface-container)]/70 via-transparent to-transparent'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Active Journey Resume Banner (if traveler has existing active trip) */}
        {hasExistingTrip && (
          <div
            id="active-trip-resume-banner"
            className={`relative mb-10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border overflow-hidden ${
              isDark
                ? 'border-[var(--accent-primary)]/40 bg-[var(--surface-card)]'
                : 'border-[var(--accent-primary)]/40 bg-[var(--surface-card)] text-[var(--text-primary)]'
            }`}
          >
            {/* Ambient Dahab reef backdrop */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src="/images/hero/coral-reef-split.jpg"
                alt="Active Trip Backdrop"
                loading="lazy"
                className="w-full h-full object-cover object-center scale-105 opacity-20 dark:opacity-15"
              />
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? 'bg-gradient-to-r from-[var(--surface-card)]/96 via-[var(--surface-card)]/90 to-[var(--surface-card)]/75 backdrop-blur-[1px]'
                    : 'bg-gradient-to-r from-[var(--surface-card)]/96 via-[var(--surface-card)]/92 to-[var(--surface-card)]/80 backdrop-blur-[1px]'
                }`}
              />
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md border ${
                  isDark
                    ? 'bg-[var(--surface-container)] text-[var(--accent-secondary)] border-[var(--border-subtle)]'
                    : 'bg-[var(--surface-container)] text-[var(--accent-secondary)] border-[var(--border-subtle)]'
                }`}
              >
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-primary)]/15 px-2.5 py-0.5 rounded-full border border-[var(--accent-primary)]/30">
                    {t('tripEntry.resume.badge')}
                  </span>
                  <span className={`text-xs font-medium text-[var(--text-secondary)]`}>
                    {tripDays.length} {t('home.daysScheduled')}
                  </span>
                </div>
                <h4 className="text-base font-bold mt-1 text-[var(--text-primary)]">
                  {t('tripEntry.resume.title')} · {profile.name || (t('home.traveler'))}
                </h4>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                id="resume-active-itinerary-btn"
                onClick={onOpenItinerary}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-card)] text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 hover:scale-105"
              >
                <span>{t('tripEntry.resume.cta')}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Unified Section Header: "What kind of trip do you want?" */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm mb-4 border bg-[var(--surface-card)] border-[var(--border-subtle)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
            <span
              id="trip-entry-eyebrow"
              className="text-[12px] font-extrabold uppercase tracking-widest text-[var(--accent-secondary)]"
            >
              {t('home.tripPlanningEntry')}
            </span>
          </div>

          <h2
            id="trip-entry-title"
            className="tidal-heading text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight font-bold text-[var(--text-primary)]"
          >
            {t('home.whatKindOfTrip')}
          </h2>

          <p
            id="trip-entry-subtitle"
            className="mt-3 text-base sm:text-lg leading-relaxed font-normal text-[var(--text-secondary)]"
          >
            {t('home.threeDistinctWaysTo')}
          </p>
        </div>

        {/* ONE PLANNING ENTRY EXPERIENCE: 3 BALANCED PATHWAYS */}
        <div
          id="trip-entry-doorways-grid"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          
          {/* ========================================================= */}
          {/* PATHWAY 1: I KNOW WHAT I WANT (Build It Yourself)         */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* PATHWAY 1: I KNOW WHAT I WANT (Build It Yourself)         */}
          {/* ========================================================= */}
          <div
            id="pathway-build-myself"
            className="tidal-card group rounded-3xl border hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden border-[var(--border-subtle)] hover:border-[var(--accent-secondary)]/40 text-[var(--text-primary)]"
          >
            {/* Photo Header */}
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src="/images/hero/golden-beach.jpg"
                alt="Build Custom Dahab Itinerary"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-black/40 to-black/20" />
              <div className="absolute top-4 start-4 end-4 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
                  {t('home.iKnowWhatI')}
                </span>
                <div className="w-10 h-10 rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-center text-white bg-black/40 shadow-xs group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-8 pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2 leading-tight text-[var(--text-primary)]">
                  {t('tripEntry.modeA.title')}
                </h3>

                <p className="text-sm leading-relaxed mb-6 font-normal text-[var(--text-secondary)]">
                  {t('home.buildYourCustomItinerary')}
                </p>

                {/* Concise Feature Highlights */}
                <div
                  className="space-y-2.5 p-4 rounded-2xl border mb-6 text-xs bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span>{t('home.customDurationGroupSize')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span>{t('home.curatedReefsSafarisSeafront')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span>{t('home.finetuneBookServicesIndividually')}</span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                id="build-my-trip-pathway-btn"
                onClick={handleSelectBuildMyself}
                className="w-full py-4 px-5 rounded-2xl active:scale-[0.98] text-xs font-bold flex items-center justify-center gap-2 border shadow-md transition-all cursor-pointer group/btn bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--accent-primary-ink)] border-[var(--accent-primary)]/20"
              >
                <span>{t('tripEntry.modeA.cta')}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PATHWAY 2: SHOW ME A GREAT TRIP (Ready-Made Itineraries)  */}
          {/* ========================================================= */}
          <div
            id="pathway-ready-trips"
            className="tidal-card group rounded-3xl border-2 border-[var(--accent-secondary)] shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden text-[var(--text-primary)] ring-1 ring-[var(--accent-secondary)]/20"
          >
            {/* Photo Header */}
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src="/images/hero/coral-reef-split.jpg"
                alt="Ready Made Dahab Itineraries"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-black/40 to-black/20" />
              {/* Highlight Ribbon */}
              <div className="absolute top-0 end-0 bg-gradient-to-l from-[var(--accent-secondary)] to-[var(--accent-secondary)] text-[var(--surface-card)] text-[11px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5 z-10">
                <Star className="w-3 h-3 fill-[var(--surface-card)] text-[var(--surface-card)]" />
                <span>{t('home.recommended')}</span>
              </div>
              <div className="absolute top-4 start-4 flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
                  {t('home.showMeAGreat')}
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-8 pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2 leading-tight text-[var(--text-primary)]">
                  {t('tripEntry.modeB.title')}
                </h3>

                <p className="text-sm leading-relaxed mb-6 font-normal text-[var(--text-secondary)]">
                  {t('home.startImmediatelyWith5')}
                </p>

                {/* Concise Feature Highlights */}
                <div
                  className="space-y-2.5 p-4 rounded-2xl border mb-6 text-xs bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--accent-secondary)] flex-shrink-0" />
                    <span>{t('home.fieldtestedByVerifiedBedouin')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span>{t('home.instantStartWithZero')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span>{t('home.100CustomizableAnytime')}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  type="button"
                  id="explore-ready-trips-pathway-btn"
                  onClick={handleSelectReadyTrips}
                  className="w-full py-4 px-5 rounded-2xl bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] active:scale-[0.98] text-[var(--surface-card)] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group/btn"
                >
                  <span>{t('tripEntry.modeB.cta')}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
                </button>

                {/* Compare / Match utilities */}
                <div className="flex items-center justify-between text-xs px-1 font-bold">
                  <button
                    type="button"
                    id="compare-programs-link"
                    onClick={() => setIsCompareOpen(true)}
                    className="cursor-pointer flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>{t('tripEntry.modeB.compareBtn')}</span>
                  </button>
                  <button
                    type="button"
                    id="quiz-match-programs-link"
                    onClick={() => setIsQuizOpen(true)}
                    className="cursor-pointer flex items-center gap-1 text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('tripEntry.modeB.whichIsRight')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PATHWAY 3: YOU CHOOSE FOR ME (AI Concierge in 60s)        */}
          {/* ========================================================= */}
          <div
            id="pathway-plan-it-for-me"
            className="tidal-card group rounded-3xl border hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--accent-secondary)]/40"
          >
            {/* Photo Header */}
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src="/images/hero/gulf-sunset.jpg"
                alt="AI Dahab Concierge"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-black/40 to-black/20" />
              <div className="absolute top-4 start-4 end-4 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
                  {t('home.youChooseForMe')}
                </span>
                <div className="w-10 h-10 rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-center text-white bg-black/40 shadow-xs group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-8 pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2 leading-tight text-[var(--text-primary)]">
                  {t('tripEntry.modeC.title')}
                </h3>

                <p className="text-sm leading-relaxed mb-6 font-normal text-[var(--text-secondary)]">
                  {t('home.tellUsYourVibe')}
                </p>

                {/* Concise Feature Highlights */}
                <div
                  className="space-y-2.5 p-4 rounded-2xl border mb-6 text-xs bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-secondary)] flex-shrink-0" />
                    <span>{t('home.bespokeScheduleDesignedIn')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span>{t('home.syncedWithLiveSea')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    <span>{t('home.curatedBoutiqueStaysSeaside')}</span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                id="plan-it-for-me-pathway-btn"
                onClick={handleSelectAiMode}
                className="w-full py-4 px-5 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)] active:scale-[0.98] text-[var(--surface-card)] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group/btn"
              >
                <Sparkles className="w-4 h-4 text-[var(--surface-card)]" />
                <span>{t('tripEntry.modeC.cta')}</span>
                <ArrowRight className="w-4 h-4 text-[var(--surface-card)] group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
              </button>
            </div>
          </div>

        </div>

        {/* 5 CURATED READY-MADE TRIPS EDITORIAL DISCOVERY RAIL */}
        <ReadyMadeTripsCarousel
          onPreviewProgram={handleOpenProgram}
          onOpenCompare={() => setIsCompareOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
        />

      </div>

      {/* Comparison Modal */}
      <ReadyTripCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectProgram={(program) => {
          setIsCompareOpen(false);
          handleOpenProgram(program);
        }}
      />

      {/* Smart Match Quiz Modal */}
      <SmartTripMatchQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectProgram={(program) => {
          setIsQuizOpen(false);
          handleOpenProgram(program);
        }}
      />

    </section>
  );
};
