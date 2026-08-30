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
  const { language, isRTL } = useLanguage();
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
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* Minimal Header */}
      <header className="border-b border-white/10 bg-[#081714]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onReturnHome}
            className="text-xl font-black tracking-widest text-[#F7F3EA] font-['Outfit',sans-serif] hover:text-[#F4C36C] transition-colors"
          >
            DAHAB
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13312B] text-[#52C4B7] border border-white/10 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#52C4B7]" />
              <span>{language === 'ar' ? 'جاري تجهيز الرحلة' : 'Trip Generator Active'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col justify-center items-center text-center">
        {/* Subtle Animated Compass / Wave Pulse Indicator */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#13312B] border border-white/10 flex items-center justify-center relative shadow-inner">
            {/* Outer soft pulse ring */}
            <div className="absolute inset-0 rounded-full border border-[#52C4B7]/40 animate-ping opacity-35" />
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F4C36C] text-[#081714] flex items-center justify-center shadow-xl shadow-black/60">
              <Compass className="w-8 h-8 animate-[spin_8s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Primary Status Headline */}
        <h1
          id="building-trip-title"
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F3EA] tracking-tight leading-[1.15]"
        >
          {language === 'ar' ? 'بنظبطلك رحلتك في دهب...' : 'Building your Dahab trip...'}
        </h1>

        {/* Supporting Explanation */}
        <p
          id="building-trip-subtitle"
          className="mt-3.5 sm:mt-4 text-base sm:text-lg text-[#D2E3DE] leading-relaxed font-normal max-w-xl"
        >
          {language === 'ar'
            ? 'بنوفق بين قعدات الراحة، نزلة البحر، والمغامرة عشان تعيش دهب على مزاجك.'
            : 'Finding the right balance of places, experiences, and free time for you.'}
        </p>

        {/* Dynamic Subtle Progress Stage Text */}
        <div className="mt-8 px-5 py-3 rounded-full bg-[#0E2520] border border-white/10 shadow-lg inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#52C4B7]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span key={phaseIndex} className="animate-in fade-in duration-300 text-[#F7F3EA]">
            {generationPhases[phaseIndex]}
          </span>
        </div>

        {/* Calibrated Travel Blueprint Summary Card */}
        <div className="w-full mt-10 p-6 sm:p-8 rounded-3xl bg-[#0E2520] border border-white/10 shadow-2xl text-start">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F4C36C]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F4C36C]">
                {language === 'ar' ? 'تفاصيل رحلتك المضبوطة' : 'Calibrated Dahab Blueprint'}
              </span>
            </div>
            <span className="text-xs text-[#52C4B7] font-semibold">
              {language === 'ar' ? 'جاهز للتوليد' : 'Ready for generation'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#D2E3DE]/70 block mb-1">
                {language === 'ar' ? 'المدة وعدد الأفراد' : 'Duration & Party'}
              </span>
              <span className="font-bold text-[#F7F3EA]">
                {durationLabel} · {adultsCount} {language === 'ar' ? 'أفراد' : 'Adults'} {tripDynamic ? `(${tripDynamic})` : ''}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#D2E3DE]/70 block mb-1">
                {language === 'ar' ? 'الميزانية' : 'Budget Tier'}
              </span>
              <span className="font-bold text-[#F7F3EA]">
                {language === 'ar' ? budgetMapAr[selectedBudget] : `${budgetMapEn[selectedBudget]} · Balanced Comfort`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#D2E3DE]/70 block mb-1">
                {language === 'ar' ? 'الاهتمامات الأساسية' : 'Core Interests'}
              </span>
              <span className="font-bold text-[#F7F3EA]">{interestNames}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#D2E3DE]/70 block mb-1">
                {language === 'ar' ? 'طبيعة الجدول' : 'Pace & Flow'}
              </span>
              <span className="font-bold text-[#F7F3EA]">
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
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D2E3DE] hover:text-[#F7F3EA] px-5 py-2.5 rounded-full hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{language === 'ar' ? 'تعديل الاختيارات' : 'Edit Preferences'}</span>
          </button>

          {onComplete && (
            <button
              type="button"
              id="building-instant-view-btn"
              onClick={onComplete}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#081714] bg-[#F4C36C] hover:bg-[#E7A83B] px-6 py-2.5 rounded-full shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <span>{language === 'ar' ? 'ورّيني الجدول دلوقتي' : 'View Itinerary Now'}</span>
              <Sparkles className="w-4 h-4 text-[#081714]" />
            </button>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-4 text-center text-xs text-[#D2E3DE]/60 bg-[#081714]">
        {language === 'ar'
          ? 'منصة دهب · تجربة أصيلة وموثوقة في جنوب سيناء'
          : 'Dahab Travel Platform · Authentic South Sinai Experience'}
      </footer>
    </div>
  );
};
