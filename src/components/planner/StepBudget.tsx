import React from 'react';
import { Wallet, Check, ArrowRight, ArrowLeft, Info, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type BudgetTier = 'budget' | 'moderate' | 'premium';

export interface BudgetOption {
  id: BudgetTier;
  titleKey: string;
  supportingTextKey: string;
  badgeLabelKey: string;
  isRecommended?: boolean;
}

const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'budget',
    titleKey: 'planner.step3.budget.title',
    supportingTextKey: 'planner.step3.budget.desc',
    badgeLabelKey: 'planner.step3.budget.badge',
  },
  {
    id: 'moderate',
    titleKey: 'planner.step3.moderate.title',
    supportingTextKey: 'planner.step3.moderate.desc',
    badgeLabelKey: 'planner.step3.moderate.badge',
    isRecommended: true,
  },
  {
    id: 'premium',
    titleKey: 'planner.step3.premium.title',
    supportingTextKey: 'planner.step3.premium.desc',
    badgeLabelKey: 'planner.step3.premium.badge',
  },
];

interface StepBudgetProps {
  selectedBudget: BudgetTier;
  onSelectBudget: (tier: BudgetTier) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const StepBudget: React.FC<StepBudgetProps> = ({
  selectedBudget,
  onSelectBudget,
  onContinue,
  onBack,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div id="step-budget-container" className="w-full">
      {/* Question Header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#13312B] text-[#52C4B7] border border-white/10 text-xs font-bold uppercase tracking-widest mb-4">
          <Wallet className="w-3.5 h-3.5 text-[#52C4B7]" />
          <span>{t('planner.step3.badge')}</span>
        </div>

        <h1
          id="budget-question-title"
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F3EA] tracking-tight leading-[1.12]"
        >
          {t('planner.step3.title')}
        </h1>

        <p
          id="budget-supporting-text"
          className="mt-3 sm:mt-4 text-base sm:text-lg text-[#D2E3DE] leading-relaxed font-normal"
        >
          {t('planner.step3.subtitle')}
        </p>
      </div>

      {/* 3 Budget Option Cards */}
      <div
        className="space-y-4 mb-8"
        role="radiogroup"
        aria-label="Trip budget tiers"
      >
        {BUDGET_OPTIONS.map((option) => {
          const isSelected = selectedBudget === option.id;

          return (
            <button
              type="button"
              key={option.id}
              id={`budget-option-${option.id}`}
              onClick={() => onSelectBudget(option.id)}
              aria-checked={isSelected}
              role="radio"
              className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 relative ${
                isSelected
                  ? 'bg-[#13312B] border-[#F4C36C] shadow-lg ring-2 ring-[#F4C36C]/30'
                  : 'bg-[#0E2520] hover:bg-[#13312B] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4 flex-1">
                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 sm:mt-0 transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#F4C36C] text-[#081714] font-bold'
                      : 'border-2 border-white/30 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                {/* Option Text Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className={`text-lg sm:text-xl font-bold tracking-tight ${isSelected ? 'text-[#F4C36C]' : 'text-[#F7F3EA]'}`}>
                      {t(option.titleKey)}
                    </span>

                    {/* Tag badge */}
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/40'
                          : 'bg-[#13312B] text-[#52C4B7] border border-white/10'
                      }`}
                    >
                      {t(option.badgeLabelKey)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#D2E3DE] mt-1 leading-relaxed font-normal">
                    {t(option.supportingTextKey)}
                  </p>
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
          id="planner-budget-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#D2E3DE] hover:text-[#F7F3EA] px-4 py-3 rounded-full hover:bg-white/5 transition-all cursor-pointer"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('planner.common.back')}</span>
        </button>

        {/* Primary Continue Button */}
        <button
          type="button"
          id="planner-budget-continue-btn"
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold tracking-tight text-[#081714] bg-[#F4C36C] hover:bg-[#E7A83B] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer group"
        >
          <span>{t('planner.step3.continueBtn')}</span>
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
