import React, { useState } from 'react';
import { Calendar, Clock, Check, ArrowRight, ArrowLeft, Sparkles, CalendarDays } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface DurationOption {
  id: string;
  labelKey: string;
  subtitleKey: string;
  descKey: string;
  tagKey?: string;
  isCustom?: boolean;
}

const DURATION_OPTIONS: DurationOption[] = [
  {
    id: '2-3',
    labelKey: 'planner.step1.2-3.label',
    subtitleKey: 'planner.step1.2-3.subtitle',
    descKey: 'planner.step1.2-3.desc',
    tagKey: 'planner.step1.2-3.tag',
  },
  {
    id: '4-5',
    labelKey: 'planner.step1.4-5.label',
    subtitleKey: 'planner.step1.4-5.subtitle',
    descKey: 'planner.step1.4-5.desc',
    tagKey: 'planner.step1.4-5.tag',
  },
  {
    id: '6-7',
    labelKey: 'planner.step1.6-7.label',
    subtitleKey: 'planner.step1.6-7.subtitle',
    descKey: 'planner.step1.6-7.desc',
    tagKey: 'planner.step1.6-7.tag',
  },
  {
    id: '8+',
    labelKey: 'planner.step1.8plus.label',
    subtitleKey: 'planner.step1.8plus.subtitle',
    descKey: 'planner.step1.8plus.desc',
    tagKey: 'planner.step1.8plus.tag',
  },
  {
    id: 'custom',
    labelKey: 'planner.step1.custom.label',
    subtitleKey: 'planner.step1.custom.subtitle',
    descKey: 'planner.step1.custom.desc',
    isCustom: true,
  },
];

interface StepDurationProps {
  selectedDurationId: string;
  onSelectDuration: (id: string, label: string) => void;
  startDate: string;
  endDate: string;
  onDatesChange: (start: string, end: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const StepDuration: React.FC<StepDurationProps> = ({
  selectedDurationId,
  onSelectDuration,
  startDate,
  endDate,
  onDatesChange,
  onContinue,
  onBack,
}) => {
  const { t, isRTL } = useLanguage();
  const [showDatePicker, setShowDatePicker] = useState(selectedDurationId === 'custom');

  const handleOptionClick = (option: DurationOption) => {
    onSelectDuration(option.id, t(option.labelKey));
    if (option.isCustom) {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  // Calculate day difference if custom dates are selected
  const getCustomDaysCount = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const customDays = getCustomDaysCount();

  return (
    <div id="step-duration-container" className="w-full">
      {/* Question Header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#13312B] text-[#52C4B7] border border-white/10 text-xs font-bold uppercase tracking-widest mb-4">
          <Clock className="w-3.5 h-3.5 text-[#52C4B7]" />
          <span>{t('planner.step1.badge')}</span>
        </div>
        
        <h1
          id="duration-question-title"
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F3EA] tracking-tight leading-[1.12]"
        >
          {t('planner.step1.title')}
        </h1>
        
        <p
          id="duration-supporting-text"
          className="mt-3 sm:mt-4 text-base sm:text-lg text-[#D2E3DE] leading-relaxed font-normal"
        >
          {t('planner.step1.subtitle')}
        </p>
      </div>

      {/* Duration Options Grid */}
      <div className="space-y-3 sm:space-y-3.5 mb-8" role="radiogroup" aria-label="Trip duration options">
        {DURATION_OPTIONS.map((option) => {
          const isSelected = selectedDurationId === option.id;
          
          return (
            <div key={option.id} className="transition-all duration-200">
              <button
                type="button"
                id={`duration-option-${option.id}`}
                onClick={() => handleOptionClick(option)}
                aria-checked={isSelected}
                role="radio"
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 relative ${
                  isSelected
                    ? 'bg-[#13312B] border-[#F4C36C] shadow-lg ring-2 ring-[#F4C36C]/30'
                    : 'bg-[#0E2520] hover:bg-[#13312B] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  {/* Selection Radio Circle */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 sm:mt-0 transition-colors flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#F4C36C] text-[#081714] font-bold'
                        : 'border-2 border-white/30 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  {/* Option Text */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className={`text-lg sm:text-xl font-bold tracking-tight ${isSelected ? 'text-[#F4C36C]' : 'text-[#F7F3EA]'}`}>
                        {t(option.labelKey)}
                      </span>
                      {option.tagKey && (
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/40'
                              : 'bg-[#13312B] text-[#52C4B7] border border-white/10'
                          }`}
                        >
                          {t(option.tagKey)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#D2E3DE] mt-0.5 leading-relaxed font-normal">
                      {t(option.subtitleKey)} · {t(option.descKey)}
                    </p>
                  </div>
                </div>

                {/* Right decorative pill / date indicator */}
                {option.isCustom && (
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#F4C36C] bg-[#13312B] border border-white/10 px-3 py-1.5 rounded-xl">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{customDays ? `${customDays} ${t('planner.step1.custom.daysSelected')}` : t('planner.step1.custom.label')}</span>
                  </div>
                )}
              </button>

              {/* Expandable Custom Date Picker when 'Choose dates' is selected */}
              {option.isCustom && isSelected && (
                <div
                  id="custom-date-picker-panel"
                  className="mt-3 p-5 rounded-2xl bg-[#0E2520] border border-[#F4C36C]/40 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-4 h-4 text-[#F4C36C]" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#F7F3EA]">
                      {t('planner.step1.custom.subtitle')}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="trip-start-date" className="block text-xs font-bold text-[#D2E3DE] mb-1.5">
                        {t('planner.step1.custom.start')}
                      </label>
                      <input
                        type="date"
                        id="trip-start-date"
                        value={startDate}
                        onChange={(e) => onDatesChange(e.target.value, endDate)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#13312B] text-sm text-[#F7F3EA] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#F4C36C]/40 focus:border-[#F4C36C]"
                      />
                    </div>
                    <div>
                      <label htmlFor="trip-end-date" className="block text-xs font-bold text-[#D2E3DE] mb-1.5">
                        {t('planner.step1.custom.end')}
                      </label>
                      <input
                        type="date"
                        id="trip-end-date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => onDatesChange(startDate, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#13312B] text-sm text-[#F7F3EA] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#F4C36C]/40 focus:border-[#F4C36C]"
                      />
                    </div>
                  </div>

                  {customDays !== null && (
                    <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#F4C36C] font-bold">
                      <span>{t('planner.step1.custom.daysSelected')}:</span>
                      <span className="bg-[#13312B] border border-white/10 px-3 py-1 rounded-full text-[#F7F3EA]">
                        {customDays} {t('planner.step1.custom.daysSelected')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer Navigation */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
        {/* Back Button */}
        <button
          type="button"
          id="planner-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#D2E3DE] hover:text-[#F7F3EA] px-4 py-3 rounded-full hover:bg-white/5 transition-all cursor-pointer"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('planner.common.back')}</span>
        </button>

        {/* Primary Continue Button */}
        <button
          type="button"
          id="planner-continue-btn"
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold tracking-tight text-[#081714] bg-[#F4C36C] hover:bg-[#E7A83B] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer group"
        >
          <span>{t('planner.step1.continueBtn')}</span>
          {isRTL ? (
            <ArrowLeft className="w-4 h-4 text-[#081714] group-hover:-translate-x-0.5 transition-transform" />
          ) : (
            <ArrowRight className="w-4 h-4 text-[#081714] group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};

