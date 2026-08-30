import React, { useRef } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Compass,
  Layers,
  X
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { AppRoute, JourneyStage } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface StageItem {
  id: JourneyStage;
  label: string;
  shortLabel: string;
  labelAr: string;
  shortLabelAr: string;
  route: AppRoute;
  icon: string;
  tag: string;
  tagAr: string;
}

export const JOURNEY_STAGES: StageItem[] = [
  { id: 'discover', label: '1. Discover (Home)', shortLabel: '1. Discover', labelAr: '١. الاستكشاف (الرئيسية)', shortLabelAr: '١. استكشاف', route: '/home', icon: '🌴', tag: 'Inspiration', tagAr: 'إلهام' },
  { id: 'plan', label: '2. Trip Builder', shortLabel: '2. Plan', labelAr: '٢. بناء الرحلة', shortLabelAr: '٢. تخطيط', route: '/trip-builder', icon: '✍️', tag: 'Preferences', tagAr: 'تفضيلات' },
  { id: 'preview', label: '3. Preview & Customize', shortLabel: '3. Preview', labelAr: '٣. المعاينة والتخصيص', shortLabelAr: '٣. معاينة', route: '/trip-preview', icon: '📋', tag: 'Itinerary', tagAr: 'البرنامج' },
  { id: 'prepare', label: '4. Pre-Arrival (24h)', shortLabel: '4. Briefing', labelAr: '٤. قبل الوصول (٢٤ ساعة)', shortLabelAr: '٤. إرشادات', route: '/my-trip', icon: '🎒', tag: '24h Countdown', tagAr: 'العد التنازلي' },
  { id: 'arrive', label: '5. Early Arrival', shortLabel: '5. Arrive', labelAr: '٥. الوصول المبكر', shortLabelAr: '٥. وصول', route: '/my-trip', icon: '🏨', tag: 'Luggage & 2h', tagAr: 'الأمتعة' },
  { id: 'experience', label: '6. Day 2 Companion', shortLabel: '6. Day 2', labelAr: '٦. مرافق اليوم الثاني', shortLabelAr: '٦. اليوم ٢', route: '/my-trip', icon: '☀️', tag: 'Live Experience', tagAr: 'تجربة حية' },
  { id: 'spontaneous', label: '7. What Should I Do Now?', shortLabel: '7. Spontaneous', labelAr: '٧. ماذا أفعل الآن؟', shortLabelAr: '٧. عفوي', route: '/my-trip', icon: '🧭', tag: 'Free Window', tagAr: 'وقت حر' },
  { id: 'food', label: '8. Food Now', shortLabel: '8. Food Now', labelAr: '٨. طلب أكل', shortLabelAr: '٨. طعام', route: '/food', icon: '🍲', tag: 'Contextual Eats', tagAr: 'مطاعم' },
  { id: 'recovery', label: '9. Change & Recovery', shortLabel: '9. Recovery', labelAr: '٩. التعديل والطقس', shortLabelAr: '٩. مرونة', route: '/change-recovery', icon: '⚡', tag: 'Weather Shift', tagAr: 'تغير الطقس' },
  { id: 'help', label: '10. Help Me Now', shortLabel: '10. Help', labelAr: '١٠. المساعدة الفورية', shortLabelAr: '١٠. طوارئ', route: '/help', icon: '🆘', tag: 'Instant Support', tagAr: 'دعم فوري' },
  { id: 'departure', label: '11. Departure Day', shortLabel: '11. Depart', labelAr: '١١. يوم المغادرة', shortLabelAr: '١١. مغادرة', route: '/departure', icon: '🚗', tag: 'Heading Home', tagAr: 'العودة' },
  { id: 'post_trip', label: '12. Post-Trip Hub', shortLabel: '12. Post-Trip', labelAr: '١٢. ذكريات الرحلة', shortLabelAr: '١٢. تقييم', route: '/post-trip', icon: '⭐', tag: 'Completed', tagAr: 'مكتملة' },
];

export const JourneyStageSwitcher: React.FC<{
  onSelectSpecialStage?: (stage: JourneyStage) => void;
}> = ({ onSelectSpecialStage }) => {
  const { currentRoute, journeyStage, setJourneyStage, navigateTo, showToast } = useTrip();
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleStageClick = (stage: StageItem) => {
    setJourneyStage(stage.id);
    if (onSelectSpecialStage) {
      onSelectSpecialStage(stage.id);
    }
    navigateTo(stage.route);
    showToast(isAr ? `تم التبديل لمرحلة: ${stage.labelAr}` : `Switched to journey stage: ${stage.label}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % JOURNEY_STAGES.length;
      const nextTab = tabListRef.current?.children[nextIndex] as HTMLButtonElement;
      nextTab?.focus();
      handleStageClick(JOURNEY_STAGES[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + JOURNEY_STAGES.length) % JOURNEY_STAGES.length;
      const prevTab = tabListRef.current?.children[prevIndex] as HTMLButtonElement;
      prevTab?.focus();
      handleStageClick(JOURNEY_STAGES[prevIndex]);
    }
  };

  const activeStage = JOURNEY_STAGES.find((s) => s.id === journeyStage) || JOURNEY_STAGES[5];

  return (
    <nav
      id="journey-stage-bar"
      aria-label="Trip Lifecycle Stages"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#091B1F]/95 backdrop-blur-xl text-white border-b border-white/10 px-3.5 py-2 text-xs relative z-30 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Current Active Stage Pill */}
        <div className="flex items-center gap-2 flex-shrink-0" aria-live="polite">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 hidden sm:inline font-['Outfit',sans-serif]">
            {isAr ? 'مرحلة الرحلة:' : 'Journey Phase:'}
          </span>
          <span className="text-[12px] font-bold text-white tracking-wide">
            {isAr ? activeStage.labelAr : activeStage.label}
          </span>
        </div>

        {/* Middle/Right: Interactive Accessible Tabs with Keyboard Arrow Navigation */}
        <div 
          ref={tabListRef}
          role="tablist" 
          aria-label="Trip Stages List"
          className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar"
        >
          {JOURNEY_STAGES.map((s, idx) => {
            const isSelected = journeyStage === s.id;
            return (
              <button
                key={s.id}
                role="tab"
                id={`journey-tab-${s.id}`}
                aria-selected={isSelected}
                aria-label={`Stage ${isAr ? s.labelAr : s.label} (${isAr ? s.tagAr : s.tag})`}
                tabIndex={isSelected ? 0 : -1}
                type="button"
                onClick={() => handleStageClick(s)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-400 text-[#0F172A] border-amber-300 shadow-md font-black ring-2 ring-amber-400/40'
                    : 'bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/10'
                }`}
              >
                <span aria-hidden="true">{s.icon}</span>
                <span className="hidden md:inline">{isAr ? s.shortLabelAr : s.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

