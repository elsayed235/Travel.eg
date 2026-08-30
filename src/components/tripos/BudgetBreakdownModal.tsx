import React from 'react';
import {
  X,
  Wallet,
  PieChart,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Shield,
  Percent
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';

interface BudgetBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetBreakdownModal: React.FC<BudgetBreakdownModalProps> = ({ isOpen, onClose }) => {
  const { language, isRTL } = useLanguage();
  const { budgetBreakdown, applyBudgetOptimization } = useTrip();

  if (!isOpen) return null;

  return (
    <div
      id="modal-budget-breakdown-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-breakdown-modal-dialog-1-title"
    >
      <div
        id="modal-budget-breakdown-container"
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-[#0E252C] text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span className="text-[12px] font-black uppercase tracking-wider text-amber-300 font-['Outfit',sans-serif]">
                {language === 'ar' ? 'تحليل التكاليف ومحرك التوفير' : 'TRIP OS COST ENGINE'}
              </span>
            </div>
            <h2 id="budget-breakdown-modal-dialog-1-title" className="text-xl sm:text-2xl font-extrabold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'تفاصيل الميزانية ومحركات التكلفة' : 'Budget Breakdown & Drivers'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'ar'
                ? 'توزيع شفاف للنفقات المتوقعة مع اقتراحات ذكية لتوفير الجنيهات.'
                : 'Transparent allocation of accommodation, marine permits, transfers, and dining.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="p-6 bg-[#FAF8F5] border-b border-slate-200 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              {language === 'ar' ? 'الإجمالي التقديري' : 'Estimated Total'}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-950 font-['Outfit',sans-serif]">
              {budgetBreakdown.estimatedTotalEGP.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              {language === 'ar' ? 'المسدد في السجل' : 'Settled in Ledger'}
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-600 font-['Outfit',sans-serif]">
              {budgetBreakdown.bookedTotalEGP.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              {language === 'ar' ? 'المتبقي المخطط' : 'Planned Balance'}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
              {budgetBreakdown.plannedRemainingEGP.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
            </div>
          </div>
        </div>

        {/* Cost Drivers Breakdown List */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'محركات التكلفة حسب الفئة' : 'Cost Drivers by Category'}
            </h3>

            <div className="space-y-2.5">
              {budgetBreakdown.costDrivers.map((driver) => (
                <div
                  key={driver.category}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: driver.color }}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {language === 'ar' ? driver.categoryAr : driver.category}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {driver.percentage}% of overall trip budget
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-extrabold text-slate-950">
                    {driver.amountEGP.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Budget Optimizations */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'اقتراحات توفير ذكية (1-Click Optimizations)' : 'Actionable Savings Opportunities'}
            </h3>

            <div className="space-y-2.5">
              {budgetBreakdown.optimizations.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    opt.applied
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {language === 'ar' ? `توفير ${opt.savingsEGP} ج.م` : `Save ${opt.savingsEGP} EGP`}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          {language === 'ar' ? opt.titleAr : opt.title}
                        </h4>
                      </div>
                      <p className="text-[12px] text-slate-600 leading-snug">
                        {language === 'ar' ? opt.descriptionAr : opt.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyBudgetOptimization(opt.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors shrink-0 ${
                        opt.applied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-950 text-amber-300 hover:bg-black'
                      }`}
                    >
                      {opt.applied
                        ? language === 'ar' ? 'مطبق ✓' : 'Applied ✓'
                        : language === 'ar' ? 'تطبيق التوفير' : 'Apply Savings'}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 italic">
                    <strong>{language === 'ar' ? 'التنازل:' : 'Trade-off:'}</strong>{' '}
                    {language === 'ar' ? opt.tradeOffGivesUpAr : opt.tradeOffGivesUp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs cursor-pointer transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
