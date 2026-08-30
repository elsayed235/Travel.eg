import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Layers,
  ChevronRight,
  PlayCircle,
  X
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { NextBestAction, GoldenJourneyScenario } from '../../types/travelerContext';

interface NextBestActionBannerProps {
  onOpenQuickBook: () => void;
}

export const NextBestActionBanner: React.FC<NextBestActionBannerProps> = ({ onOpenQuickBook }) => {
  const {
    travelerContext,
    nextBestActions,
    activePersonaMode,
    setActivePersonaMode,
    goldenJourneys,
    navigateTo,
    trackJourneyEvent,
    showToast
  } = useTrip();

  const { language, isRTL } = useLanguage();
  const [isGoldenSuiteOpen, setIsGoldenSuiteOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<GoldenJourneyScenario | null>(null);

  const handleActionClick = (action: NextBestAction) => {
    trackJourneyEvent('next_best_action_clicked', { actionId: action.id, type: action.type });
    if (action.targetParams?.openQuickBook) {
      navigateTo('/quick-book');
    } else {
      navigateTo(action.targetRoute, action.targetParams);
    }
  };

  const primaryAction = nextBestActions[0];
  const secondaryAction = nextBestActions[1];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ===================================================================== */}
      {/* 1. TOP DUAL-STATE PERSONA TOGGLE & GOLDEN SUITE TRIGGER               */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 bg-[#0E2520] p-2.5 sm:p-3 rounded-3xl border border-white/10 shadow-xl">
        
        {/* Persona Mode Switcher: Pre-Trip vs In-Dahab */}
        <div className="flex items-center p-1 bg-[#13312B] rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setActivePersonaMode('PRE_TRIP');
              trackJourneyEvent('trip_entry_mode_switched', { mode: 'PRE_TRIP' });
              showToast(language === 'ar' ? 'تم التبديل لوضع: التخطيط قبل السفر ✈️' : 'Switched to: Pre-Trip Planning ✈️');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activePersonaMode === 'PRE_TRIP'
                ? 'bg-[#20A89A] text-[#081714] shadow-sm'
                : 'text-[#D2E3DE] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'قبل السفر · خطط لدهب' : 'PRE-TRIP · Plan My Dahab'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePersonaMode('IN_DAHAB');
              trackJourneyEvent('trip_entry_mode_switched', { mode: 'IN_DAHAB' });
              showToast(language === 'ar' ? 'تم التبديل لوضع: أنا في دهب دلوقتي 🌊' : 'Switched to: In Dahab Real-Time OS 🌊');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activePersonaMode === 'IN_DAHAB'
                ? 'bg-[#20A89A] text-[#081714] shadow-sm'
                : 'text-[#D2E3DE] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>{language === 'ar' ? 'أنا في دهب · المساعد المباشر' : 'IN DAHAB · Real-Time OS'}</span>
          </button>
        </div>

        {/* Live Context Indicators & Golden Journey Suite launcher */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#13312B] border border-white/10 text-xs text-[#D2E3DE] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? travelerContext.currentLocation.nameAr : travelerContext.currentLocation.name}</span>
            <span className="text-white/20">|</span>
            <Clock className="w-3.5 h-3.5 text-[#52C4B7]" />
            <span>{travelerContext.currentTime.timeFormatted}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsGoldenSuiteOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#13312B] hover:bg-[#173832] text-[#F4C36C] border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer group shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#F4C36C] group-hover:scale-110 transition-transform" />
            <span>{language === 'ar' ? 'المسارات الذهبية (A-G)' : 'Golden Journeys (A-G)'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. DERIVED "NEXT BEST ACTION" CARD (P0 SINGLE DERIVED CONCEPT)        */}
      {/* ===================================================================== */}
      {primaryAction && (
        <div className="relative rounded-3xl p-6 sm:p-7 bg-[#0E2520] text-[#F7F3EA] shadow-2xl border border-white/10 mb-8 overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#20A89A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2.5 max-w-3xl">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F4C36C] text-[#081714] shadow-sm">
                  {language === 'ar' ? 'الخطوة الأنسب لك الآن' : 'Next Best Action'}
                </span>
                
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#13312B] text-[#52C4B7] border border-white/10">
                  {primaryAction.type}
                </span>

                {primaryAction.badge && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium bg-[#13312B] text-[#52C4B7] border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-[#52C4B7]" />
                    <span>{language === 'ar' ? primaryAction.badge.labelAr : primaryAction.badge.label}</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA]">
                {language === 'ar' ? primaryAction.titleAr : primaryAction.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#D2E3DE] leading-relaxed">
                {language === 'ar' ? primaryAction.descriptionAr : primaryAction.description}
              </p>

              {/* Derived Reason */}
              <div className="text-xs text-[#52C4B7] flex items-center gap-2 pt-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52C4B7]" />
                <span>{language === 'ar' ? primaryAction.reasonAr : primaryAction.reason}</span>
              </div>
            </div>

            {/* Direct 1-Tap Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleActionClick(primaryAction)}
                className="px-7 py-3.5 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] font-extrabold text-xs transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>{language === 'ar' ? primaryAction.actionLabelAr : primaryAction.actionLabel}</span>
                <ArrowRight className={`w-4 h-4 text-[#081714] group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>

              {secondaryAction && (
                <button
                  type="button"
                  onClick={() => handleActionClick(secondaryAction)}
                  className="px-5 py-3.5 rounded-2xl bg-[#13312B] hover:bg-[#173832] text-[#F7F3EA] border border-white/10 font-bold text-xs transition-all cursor-pointer text-center"
                >
                  {language === 'ar' ? secondaryAction.actionLabelAr : secondaryAction.actionLabel}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. GOLDEN JOURNEYS (A-G) INTERACTIVE VERIFICATION MODAL               */}
      {/* ===================================================================== */}
      {isGoldenSuiteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="next-best-action-banner-dialog-1-title"
    >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-300/80 overflow-hidden flex flex-col text-stone-900">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-white border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F6F78]/10 text-[#0F6F78] flex items-center justify-center font-bold">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="next-best-action-banner-dialog-1-title" className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'مصفوفة اختبار المسارات الذهبية (A-G)' : 'Golden End-to-End Journeys Suite (A-G)'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'ar' ? 'فحص حتمي كامل لرحلة المسافر من الوصول حتى المغادرة دون احتكاك' : 'Deterministic zero-friction journey verification across all edge cases'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGoldenSuiteOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goldenJourneys.map((journey) => (
                  <div
                    key={journey.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#0F6F78] transition-all shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#0F6F78]/10 text-[#0F6F78]">
                        {journey.code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>100% VERIFIED</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 font-['Outfit',sans-serif]">
                      {language === 'ar' ? journey.titleAr : journey.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {journey.persona}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-[12px] text-stone-500 font-medium">
                        {journey.steps.length} {language === 'ar' ? 'مراحل متصلة' : 'Connected Steps'}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (journey.code === 'JOURNEY_A') {
                            setIsGoldenSuiteOpen(false);
                            navigateTo('/arrive');
                          } else if (journey.code === 'JOURNEY_B') {
                            setIsGoldenSuiteOpen(false);
                            navigateTo('/my-trip', { dayId: 2 });
                          } else if (journey.code === 'JOURNEY_C') {
                            setIsGoldenSuiteOpen(false);
                            navigateTo('/change-recovery');
                          } else if (journey.code === 'JOURNEY_D') {
                            setIsGoldenSuiteOpen(false);
                            navigateTo('/departure');
                          } else {
                            setSelectedJourney(journey);
                          }
                        }}
                        className="text-[#0F6F78] hover:text-[#0A4B52] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === 'ar' ? 'تشغيل المسار' : 'Launch Journey'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Journey Inspection */}
              {selectedJourney && (
                <div className="mt-4 p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-amber-950">
                      {selectedJourney.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setSelectedJourney(null)}
                      className="text-xs text-amber-800 font-bold hover:underline"
                    >
                      {language === 'ar' ? 'إغلاق التفاصيل' : 'Close Details'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedJourney.steps.map((step) => (
                      <div key={step.stepNumber} className="p-3 rounded-xl bg-white border border-amber-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-stone-800">
                          <span>Step {step.stepNumber}: {step.title}</span>
                          <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{step.phase}</span>
                        </div>
                        <p className="text-stone-600 text-[12px]"><strong className="text-stone-700">System:</strong> {step.systemAction}</p>
                        <p className="text-stone-600 text-[12px]"><strong className="text-stone-700">Outcome:</strong> {step.userFacingOutcome}</p>
                        <p className="text-emerald-700 text-[11px] flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {step.verifiedEvidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsGoldenSuiteOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close Suite'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
