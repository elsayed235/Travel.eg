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
      className={`py-14 sm:py-20 border-b relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#081714] border-white/10' : 'bg-[#FBF9F5] border-[#122420]/10'
      }`}
      aria-label="Trip Planning Entry Experience"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Ambient Sinai Glow */}
      <div
        className={`absolute top-0 inset-x-0 h-96 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-[#0E2520]/40 via-transparent to-transparent'
            : 'bg-gradient-to-b from-[#F2EFE9]/70 via-transparent to-transparent'
        }`}
      />

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
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md border ${
                  isDark
                    ? 'bg-[#13312B] text-[#52C4B7] border-white/10'
                    : 'bg-[#F2EFE9] text-[#0F6F78] border-[#122420]/10'
                }`}
              >
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
                type="button"
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

        {/* Unified Section Header: "What kind of trip do you want?" */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm mb-4 border ${
              isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#52C4B7]" />
            <span
              id="trip-entry-eyebrow"
              className={`text-[12px] font-extrabold uppercase tracking-widest ${
                isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'
              }`}
            >
              {language === 'ar' ? 'تخطيط رحلتك إلى دهب' : 'Trip Planning Entry'}
            </span>
          </div>

          <h2
            id="trip-entry-title"
            className={`text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight leading-tight font-bold ${
              isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
            }`}
          >
            {language === 'ar' ? 'عايز رحلتك لدهب تكون إزاي؟' : 'What kind of trip do you want?'}
          </h2>

          <p
            id="trip-entry-subtitle"
            className={`mt-3 text-base sm:text-lg leading-relaxed font-normal ${
              isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'
            }`}
          >
            {language === 'ar'
              ? '٣ مسارات واضحة تبدأ بيهم نفس الرحلة حسب أسلوبك وتفضيلك.. وكل طريق بيوصلك لجدول مصمم على ذوقك.'
              : 'Three distinct ways to start the same unforgettable Dahab journey. Choose how you want to begin.'}
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
          <div
            id="pathway-build-myself"
            className={`group rounded-3xl p-7 sm:p-8 border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              isDark
                ? 'bg-[#0E2520] border-white/10 hover:border-white/25 text-[#F7F3EA]'
                : 'bg-white border-[#122420]/10 hover:border-[#122420]/25 text-[#122420]'
            }`}
          >
            <div>
              {/* Header Badge + Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#20A89A] bg-[#20A89A]/15 px-3 py-1 rounded-full border border-[#20A89A]/30">
                  {language === 'ar' ? 'عارف طلبي · تحكم كامل' : 'I know what I want'}
                </span>
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-[#20A89A] shadow-sm group-hover:scale-105 transition-transform ${
                    isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                  }`}
                >
                  <Compass className="w-5 h-5" />
                </div>
              </div>

              <h3 className={`text-2xl font-serif font-bold mb-2 leading-tight ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                {t('tripEntry.modeA.title')}
              </h3>

              <p className={`text-sm leading-relaxed mb-6 font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                {language === 'ar'
                  ? 'اختار التواريخ، عدد المسافرين، ميزانيتك، والأنشطة اللي في بالك بكل حرية ومرونة.'
                  : 'Build your custom itinerary step-by-step with full control over dates, pace, budget, and activities.'}
              </p>

              {/* Concise Feature Highlights */}
              <div
                className={`space-y-2.5 p-4 rounded-2xl border mb-6 text-xs ${
                  isDark ? 'bg-[#13312B] border-white/10 text-[#D2E3DE]' : 'bg-[#FAF7F0] border-[#122420]/10 text-[#4A635D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
                  <span>{language === 'ar' ? 'تحديد مدة الرحلة وعدد المسافرين' : 'Custom duration & group size'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
                  <span>{language === 'ar' ? 'اختيار الأنشطة والمطاعم البحرية' : 'Curated reefs, safaris & seafront tables'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
                  <span>{language === 'ar' ? 'تعديل وحجز كل خدمة خطوة بخطوة' : 'Fine-tune & book services individually'}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              id="build-my-trip-pathway-btn"
              onClick={handleSelectBuildMyself}
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

          {/* ========================================================= */}
          {/* PATHWAY 2: SHOW ME A GREAT TRIP (Ready-Made Itineraries)  */}
          {/* ========================================================= */}
          <div
            id="pathway-ready-trips"
            className={`group rounded-3xl p-7 sm:p-8 border-2 border-[#F4C36C] shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              isDark ? 'bg-[#0E2520] text-[#F7F3EA]' : 'bg-white text-[#122420]'
            }`}
          >
            {/* Highlight Ribbon */}
            <div className="absolute top-0 right-0 bg-[#F4C36C] text-[#081714] text-[11px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-[#081714] text-[#081714]" />
              <span>{language === 'ar' ? 'الأكثر ترشيحاً' : 'Recommended'}</span>
            </div>

            <div>
              {/* Header Badge + Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E7A83B] bg-[#F4C36C]/15 px-3 py-1 rounded-full border border-[#F4C36C]/30">
                  {language === 'ar' ? 'جاهزة ومجربة' : 'Show me a great trip'}
                </span>
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-sm text-[#F4C36C] group-hover:scale-105 transition-transform ${
                    isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <h3 className={`text-2xl font-serif font-bold mb-2 leading-tight ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                {t('tripEntry.modeB.title')}
              </h3>

              <p className={`text-sm leading-relaxed mb-6 font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                {language === 'ar'
                  ? 'برامج كاملة مصممة من خبراء دهب بإيقاع متوازن، أسعار عادلة، ومرونة كاملة للتعديل.'
                  : 'Start immediately with 5 field-tested itineraries featuring verified stays, guides, and locked rates.'}
              </p>

              {/* Concise Feature Highlights */}
              <div
                className={`space-y-2.5 p-4 rounded-2xl border mb-6 text-xs ${
                  isDark ? 'bg-[#13312B] border-white/10 text-[#D2E3DE]' : 'bg-[#FAF7F0] border-[#122420]/10 text-[#4A635D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F4C36C] flex-shrink-0" />
                  <span>{language === 'ar' ? 'برامج مختبرة وموثقة من أهل دهب' : 'Field-tested by verified Bedouin guides'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
                  <span>{language === 'ar' ? 'إضافة فورية للرحلة بدون تعقيد' : 'Instant start with zero guesswork'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#52C4B7] flex-shrink-0" />
                  <span>{language === 'ar' ? 'قابلة للتخصيص والتعديل في أي وقت' : '100% customizable anytime'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                id="explore-ready-trips-pathway-btn"
                onClick={handleSelectReadyTrips}
                className="w-full py-4 px-5 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] active:scale-[0.98] text-[#081714] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group/btn"
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
                  className={`cursor-pointer flex items-center gap-1 ${
                    isDark ? 'text-[#D2E3DE] hover:text-white' : 'text-[#4A635D] hover:text-[#122420]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#20A89A]" />
                  <span>{t('tripEntry.modeB.compareBtn')}</span>
                </button>
                <button
                  type="button"
                  id="quiz-match-programs-link"
                  onClick={() => setIsQuizOpen(true)}
                  className={`cursor-pointer flex items-center gap-1 ${
                    isDark ? 'text-[#F4C36C] hover:text-[#E7A83B]' : 'text-[#8F7242] hover:text-[#0E2520]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('tripEntry.modeB.whichIsRight')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PATHWAY 3: YOU CHOOSE FOR ME (AI Concierge in 60s)        */}
          {/* ========================================================= */}
          <div
            id="pathway-plan-it-for-me"
            className={`group rounded-3xl p-7 sm:p-8 border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              isDark
                ? 'bg-[#0E2520] text-[#F7F3EA] border-white/10 hover:border-white/25'
                : 'bg-white text-[#122420] border-[#122420]/10 hover:border-[#122420]/25'
            }`}
          >
            <div>
              {/* Header Badge + Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#20A89A] bg-[#20A89A]/15 px-3 py-1 rounded-full border border-[#20A89A]/30">
                  {language === 'ar' ? 'فصلّي على ذوقي' : 'You choose for me'}
                </span>
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${
                    isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-[#F4C36C]" />
                </div>
              </div>

              <h3 className={`text-2xl font-serif font-bold mb-2 leading-tight ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                {t('tripEntry.modeC.title')}
              </h3>

              <p className={`text-sm leading-relaxed mb-6 font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                {language === 'ar'
                  ? 'قول لنا إيه أكتر جو يعجبك وإحنا نبني لك جدول كامل متناسق في ٦٠ ثانية.'
                  : 'Tell us your vibe and preferences, and our Sinai travel engine will generate a bespoke schedule in 60s.'}
              </p>

              {/* Concise Feature Highlights */}
              <div
                className={`space-y-2.5 p-4 rounded-2xl border mb-6 text-xs ${
                  isDark ? 'bg-[#13312B] border-white/10 text-[#D2E3DE]' : 'bg-[#FAF7F0] border-[#122420]/10 text-[#4A635D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F4C36C] flex-shrink-0" />
                  <span>{language === 'ar' ? 'جدول ذكي متفصل على مودك في دقيقة' : 'Bespoke schedule designed in 60 seconds'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
                  <span>{language === 'ar' ? 'مربوط بحالة البحر والرياح المباشرة' : 'Synced with live sea tides & wind conditions'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
                  <span>{language === 'ar' ? 'توصيات أماكن وفنادق معتمدة' : 'Curated boutique stays & seaside spots'}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              id="plan-it-for-me-pathway-btn"
              onClick={handleSelectAiMode}
              className="w-full py-4 px-5 rounded-2xl bg-[#20A89A] hover:bg-[#52C4B7] active:scale-[0.98] text-[#081714] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group/btn"
            >
              <Sparkles className="w-4 h-4 text-[#081714]" />
              <span>{t('tripEntry.modeC.cta')}</span>
              <ArrowRight className="w-4 h-4 text-[#081714] group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
            </button>
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
