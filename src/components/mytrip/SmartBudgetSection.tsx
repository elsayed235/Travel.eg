import React from 'react';
import { DollarSign, TrendingDown, Sparkles, PieChart, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';

export const SmartBudgetSection: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const totalBudget = 850;
  const totalSpent = 490;
  const remaining = totalBudget - totalSpent;
  const percentSpent = Math.round((totalSpent / totalBudget) * 100);

  const budgetCategories = [
    { label: language === 'ar' ? 'أنشطة وغوص' : 'Diving & Tours', spent: 260, color: 'bg-teal-500' },
    { label: language === 'ar' ? 'إقامة وفنادق' : 'Accommodations', spent: 140, color: 'bg-amber-500' },
    { label: language === 'ar' ? 'مأكولات ومقاهي' : 'Dining & Cafes', spent: 65, color: 'bg-sky-500' },
    { label: language === 'ar' ? 'مواصلات سيناء' : 'Local Transfers', spent: 25, color: 'bg-purple-500' },
  ];

  return (
    <section 
      className={`rounded-3xl p-6 border shadow-lg space-y-5 ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-center justify-between border-b pb-4 ${
        isDark ? 'border-white/10' : 'border-[#122420]/10'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold border ${
            isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-[#20A89A]/10 text-[#0E2520] border-[#20A89A]/20'
          }`}>
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-base font-bold font-['Outfit',sans-serif] ${
              isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
            }`}>
              {t('budget.title')}
            </h2>
            <p className={`text-xs ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
              {language === 'ar' ? 'متابعة الإنفاق الفعلي والتحسين الذكي' : 'Live trip spend vs allocated budget'}
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
          isDark 
            ? 'bg-[#13312B] text-[#52C4B7] border-white/10' 
            : 'bg-emerald-50 text-[#0E2520] border-emerald-200'
        }`}>
          <TrendingDown className="w-3.5 h-3.5 text-[#20A89A]" />
          <span>-18% Spend</span>
        </span>
      </div>

      {/* Progress Metric */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs">
          <div>
            <span className={isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}>{t('budget.spent')}: </span>
            <span className={`text-base font-black ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>${totalSpent}</span>
          </div>
          <div>
            <span className={isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}>{t('budget.remaining')}: </span>
            <span className="text-base font-black text-[#EA8E75]">${remaining}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-3 rounded-full border overflow-hidden flex ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-100 border-[#122420]/10'
        }`}>
          <div style={{ width: `${percentSpent}%` }} className="h-full bg-gradient-to-r from-[#EA8E75] to-[#20A89A]" />
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {budgetCategories.map((cat, i) => (
          <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <span className={`font-medium ${isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'}`}>{cat.label}</span>
            </div>
            <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>${cat.spent}</span>
          </div>
        ))}
      </div>

      {/* AI Budget Insight Card */}
      <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 leading-relaxed ${
        isDark ? 'bg-[#13312B] border-[#F4C36C]/30 text-[#D2E3DE]' : 'bg-amber-50/70 border-amber-200 text-[#122420]'
      }`}>
        <Sparkles className="w-4 h-4 text-[#EA8E75] shrink-0 mt-0.5" />
        <p>{t('budget.insight')}</p>
      </div>
    </section>
  );
};
