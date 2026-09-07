import React, { useEffect, useState } from 'react';
import { Sparkles, Compass, CheckCircle2, Waves, MapPin, ArrowLeft, Clock, Users, Wallet, Flame } from 'lucide-react';
import { TripDynamicType } from './StepTravelers';
import { BudgetTier } from './StepBudget';
import { InterestId, INTERESTS_DATA } from './StepInterests';
import { PaceType } from './StepPace';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';

interface BuildingTripStateProps {
  durationLabel: string;
  adultsCount: number;
  childrenCount: number;
  tripDynamic: TripDynamicType | null;
  selectedBudget: BudgetTier;
  selectedInterests: InterestId[];
  selectedPace: PaceType;
  onComplete?: () => void;
  onBackToPlanner: () => void;
  onReturnHome: () => void;
}

const GENERATION_PHASES_EN = [
  'Connecting with local Dahab hosts and dive spots...',
  'Balancing morning reef sessions with afternoon canyon explorations...',
  'Selecting authentic Lighthouse and Eel Garden seaside dining...',
  'Finalizing your customized 5-day Sinai itinerary...',
];

const GENERATION_PHASES_AR = [
  'بنتواصل مع كباتن الغطس وأهل البلد في دهب...',
  'بنوفق بين نزلة البحر الصبح وقعدة الكانيون بعد الضهر...',
  'بنختارلك أماكن أكل رايقة على ممشى اللايتهاوس وإيل جاردن...',
  'بنقفل جدول الـ ٥ أيام ونظبط كل تفصيلة ع الرايق...',
];

export const BuildingTripState: React.FC<BuildingTripStateProps> = ({
  durationLabel,
  adultsCount,
  childrenCount,
  tripDynamic,
  selectedBudget,
  selectedInterests,
  selectedPace,
  onComplete,
  onBackToPlanner,
  onReturnHome,
}) => {
  const { language, isRTL , t} = useLanguage();
  const [phaseIndex, setPhaseIndex] = useState(0);

  const generationPhases = language === 'ar' ? GENERATION_PHASES_AR : GENERATION_PHASES_EN;

  useEffect(() => {
    // Proactively call server-side Gemini AI Trip Generator in background
    const daysNum = durationLabel.includes('3') ? 3 : durationLabel.includes('7') ? 7 : 5;
    api.generateAiTrip({
      durationDays: daysNum,
      adultsCount,
      childrenCount,
      dynamic: tripDynamic || 'Friends',
      budget: selectedBudget,
      interests: selectedInterests,
      pace: selectedPace,
      language
    }).catch((e) => console.log('AI Trip Generation background info:', e));

    const interval = setInterval(() => {
      setPhaseIndex((prev) => {
        if (prev < generationPhases.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    const completionTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimer);
    };
  }, [onComplete, generationPhases.length]);

  const interestNames = INTERESTS_DATA.filter((i) => selectedInterests.includes(i.id))
    .map((i) => (language === 'ar' ? i.nameAr || i.name : i.name))
    .join(' · ');

  const paceMapEn: Record<PaceType, string> = {
    slow: 'Slow & Easy',
    balanced: 'Balanced (Best of both)',
    packed: 'See It All (Maximum exploration)',
  };

  const paceMapAr: Record<PaceType, string> = {
    slow: 'رايق وهادي ع الآخر',
    balanced: 'متوازن (ميكس راحة ومغامرة)',
    packed: 'مليان تجارب واكتشاف',
  };

  const budgetMapEn: Record<BudgetTier, string> = {
    budget: 'Budget',
    moderate: 'Moderate',
    premium: 'Premium',
  };

  const budgetMapAr: Record<BudgetTier, string> = {
    budget: 'اقتصادي وشبابي',
    moderate: 'متوسط ومريح',
    premium: 'فاخر ومميز',
  };

  return (
    <div
      id="building-trip-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[var(--surface-card)] text-[var(--text-primary)] flex flex-col"
    >
      {/* Minimal Header */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onReturnHome}
            className="text-xl font-black text-[var(--text-primary)] hover:text-[var(--accent-secondary)] transition-colors"
          >
            DAHAB
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-container)] text-[var(--accent-primary)] border border-[var(--border-subtle)] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" />
              <span>{t('planner.tripGeneratorActive')}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col justify-center items-center text-center">
        {/* Subtle Animated Compass / Wave Pulse Indicator */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[var(--surface-container)] border border-[var(--border-subtle)] flex items-center justify-center relative shadow-inner">
            {/* Outer soft pulse ring */}
            <div className="absolute inset-0 rounded-full border border-[var(--accent-primary)]/40 animate-ping opacity-35" />
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[var(--accent-secondary)] text-[var(--surface-card)] flex items-center justify-center shadow-xl shadow-black/60">
              <Compass className="w-8 h-8 animate-[spin_8s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Primary Status Headline */}
        <h1
          id="building-trip-title"
          className="text-3xl sm:text-4xl md:text-5xl chart-heading text-[var(--text-primary)] tracking-tight leading-[1.15]"
        >
          {t('planner.buildingYourDahabTrip')}
        </h1>

        {/* Supporting Explanation */}
        <p
          id="building-trip-subtitle"
          className="mt-3.5 sm:mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal max-w-xl"
        >
          {t('planner.findingTheRightBalance')}
        </p>

        {/* Dynamic Subtle Progress Stage Text */}
        <div className="mt-8 px-5 py-3 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-lg inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[var(--accent-primary)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span key={phaseIndex} className="animate-in fade-in duration-300 text-[var(--text-primary)]">
            {generationPhases[phaseIndex]}
          </span>
        </div>

        {/* Calibrated Travel Blueprint Summary Card */}
        <div className="w-full mt-10 p-6 sm:p-8 rounded-3xl bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xl text-start">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--accent-secondary)]" />
              <span className="text-xs font-bold text-[var(--accent-secondary)]">
                {t('planner.calibratedDahabBlueprint')}
              </span>
            </div>
            <span className="text-xs text-[var(--accent-primary)] font-semibold">
              {t('planner.readyForGeneration')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <span className="text-[12px] font-bold text-[var(--text-secondary)]/70 block mb-1">
                {t('planner.durationParty')}
              </span>
              <span className="font-bold text-[var(--text-primary)]">
                {durationLabel} · {adultsCount} {t('planner.adults')} {tripDynamic ? `(${tripDynamic})` : ''}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <span className="text-[12px] font-bold text-[var(--text-secondary)]/70 block mb-1">
                {t('planner.budgetTier')}
              </span>
              <span className="font-bold text-[var(--text-primary)]">
                {language === 'ar' ? budgetMapAr[selectedBudget] : `${budgetMapEn[selectedBudget]} · Balanced Comfort`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <span className="text-[12px] font-bold text-[var(--text-secondary)]/70 block mb-1">
                {t('planner.coreInterests')}
              </span>
              <span className="font-bold text-[var(--text-primary)]">{interestNames}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <span className="text-[12px] font-bold text-[var(--text-secondary)]/70 block mb-1">
                {t('planner.paceFlow')}
              </span>
              <span className="font-bold text-[var(--text-primary)]">
                {language === 'ar' ? paceMapAr[selectedPace] : paceMapEn[selectedPace]}
              </span>
            </div>
          </div>
        </div>

        {/* Back and Edit Options */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            id="building-back-btn"
            onClick={onBackToPlanner}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-5 py-2.5 rounded-full hover:bg-[var(--btn-util-bg)] transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('planner.editPreferences')}</span>
          </button>

          {onComplete && (
            <button
              type="button"
              id="building-instant-view-btn"
              onClick={onComplete}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[var(--surface-card)] bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] px-6 py-2.5 rounded-full shadow-lg transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer active:scale-95"
            >
              <span>{t('planner.viewItineraryNow')}</span>
              <Sparkles className="w-4 h-4 text-[var(--surface-card)]" />
            </button>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-4 text-center text-xs text-[var(--text-secondary)]/60 bg-[var(--surface-card)]">
        {t('planner.dahabTravelPlatformAuthentic')}
      </footer>
    </div>
  );
};
