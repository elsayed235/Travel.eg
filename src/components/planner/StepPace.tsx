import React from 'react';
import { Gauge, Check, Sparkles, ArrowLeft, ArrowRight, Info, Coffee, Sun, Flame } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type PaceType = 'slow' | 'balanced' | 'packed';

export interface PaceOption {
  id: PaceType;
  titleKey: string;
  descriptionKey: string;
  sublabelKey: string;
  image: string;
  icon: React.ReactNode;
}

const PACE_OPTIONS: PaceOption[] = [
  {
    id: 'slow',
    titleKey: 'planner.step5.slow.title',
    descriptionKey: 'planner.step5.slow.desc',
    sublabelKey: 'planner.step5.slow.sub',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    icon: <Coffee className="w-4 h-4" />,
  },
  {
    id: 'balanced',
    titleKey: 'planner.step5.balanced.title',
    descriptionKey: 'planner.step5.balanced.desc',
    sublabelKey: 'planner.step5.balanced.sub',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    icon: <Sun className="w-4 h-4" />,
  },
  {
    id: 'packed',
    titleKey: 'planner.step5.packed.title',
    descriptionKey: 'planner.step5.packed.desc',
    sublabelKey: 'planner.step5.packed.sub',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
    icon: <Flame className="w-4 h-4" />,
  },
];

interface StepPaceProps {
  selectedPace: PaceType;
  onSelectPace: (pace: PaceType) => void;
  onBuildTrip: () => void;
  onBack: () => void;
}

export const StepPace: React.FC<StepPaceProps> = ({
  selectedPace,
  onSelectPace,
  onBuildTrip,
  onBack,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div id="step-pace-container" className="w-full">
      {/* Question Header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#13312B] text-[#52C4B7] border border-white/10 text-xs font-bold uppercase tracking-widest mb-4">
          <Gauge className="w-3.5 h-3.5 text-[#52C4B7]" />
          <span>{t('planner.step5.badge')}</span>
        </div>

        <h1
          id="pace-question-title"
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F3EA] tracking-tight leading-[1.12]"
        >
          {t('planner.step5.title')}
        </h1>

        <p
          id="pace-supporting-text"
          className="mt-3 sm:mt-4 text-base sm:text-lg text-[#D2E3DE] leading-relaxed font-normal"
        >
          {t('planner.step5.subtitle')}
        </p>
      </div>

      {/* 3 Pace Option Cards */}
      <div
        className="space-y-4 mb-8"
        role="radiogroup"
        aria-label="Travel pace options"
      >
        {PACE_OPTIONS.map((option) => {
          const isSelected = selectedPace === option.id;

          return (
            <button
              type="button"
              key={option.id}
              id={`pace-option-${option.id}`}
              onClick={() => onSelectPace(option.id)}
              aria-checked={isSelected}
              role="radio"
              className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group ${
                isSelected
                  ? 'bg-[#13312B] border-[#F4C36C] shadow-lg ring-2 ring-[#F4C36C]/30'
                  : 'bg-[#0E2520] hover:bg-[#13312B] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 flex-1">
                {/* Radio Checkbox Indicator */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 sm:mt-0.5 transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#F4C36C] text-[#081714] font-bold'
                      : 'border-2 border-white/30 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className={`text-lg sm:text-xl font-bold tracking-tight ${isSelected ? 'text-[#F4C36C]' : 'text-[#F7F3EA]'}`}>
                      {t(option.titleKey)}
                    </span>

                    {/* Small sublabel pill */}
                    <span
                      className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/40'
                          : 'bg-[#13312B] text-[#52C4B7] border border-white/10'
                      }`}
                    >
                      {t(option.sublabelKey)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#D2E3DE] mt-1.5 leading-relaxed font-normal">
                    {t(option.descriptionKey)}
                  </p>
                </div>
              </div>

              {/* Right Visual Thumbnail */}
              <div className="sm:w-28 sm:h-20 h-24 w-full rounded-xl overflow-hidden relative flex-shrink-0 bg-[#081714] border border-white/10">
                <img
                  src={option.image}
                  alt={t(option.titleKey)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-[#081714]/25" />
                <div className={`absolute bottom-1.5 ${isRTL ? 'left-1.5' : 'right-1.5'} p-1 rounded-md bg-[#081714]/80 backdrop-blur-xs text-[#F4C36C]`}>
                  {option.icon}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer Navigation */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
        {/* Back Button */}
        <button
          type="button"
          id="planner-pace-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#D2E3DE] hover:text-[#F7F3EA] px-4 py-3 rounded-full hover:bg-white/5 transition-all cursor-pointer"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('planner.common.back')}</span>
        </button>

        {/* Primary Build My Trip CTA Button */}
        <button
          type="button"
          id="planner-build-trip-btn"
          onClick={onBuildTrip}
          className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold tracking-tight text-[#081714] bg-[#F4C36C] hover:bg-[#E7A83B] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-[#081714] group-hover:rotate-12 transition-transform" />
          <span>{t('planner.step5.buildBtn')}</span>
        </button>
      </div>
    </div>
  );
};
