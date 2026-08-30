import React from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wallet,
  Compass,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { PlanVariant } from '../../types/tripOs';

interface TradeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeOffModal: React.FC<TradeOffModalProps> = ({ isOpen, onClose }) => {
  const { language, isRTL } = useLanguage();
  const {
    planVariants,
    selectedPlanVariantId,
    selectPlanVariant,
    showToast,
  } = useTrip();

  if (!isOpen) return null;

  return (
    <div
      id="modal-tradeoffs-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    
      role="dialog"
      aria-modal="true"
      aria-labelledby="trade-off-modal-dialog-1-title"
    >
      <div
        id="modal-tradeoffs-container"
        className="bg-[#0E2520] text-[#F7F3EA] rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl border border-white/10 my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-[#081714] text-[#F7F3EA] flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4C36C]" />
              <span className="text-[12px] font-black uppercase tracking-wider text-[#F4C36C] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'محرك المفاضلة ومقارنة المسارات' : 'TRIP OS TRADE-OFF MATRIX'}
              </span>
            </div>
            <h2 id="trade-off-modal-dialog-1-title" className="text-xl sm:text-2xl font-extrabold font-['Outfit',sans-serif] text-[#F7F3EA]">
              {language === 'ar' ? 'المفاضلة الصريحة بين مسارات دهب' : 'Explicit Plan Variants & Trade-offs'}
            </h2>
            <p className="text-xs sm:text-sm text-[#D2E3DE]/70">
              {language === 'ar'
                ? 'قارن بدقة بين المكاسب والتنازلات في كل نموذج لتختار الأنسب لراحتك وميزانيتك.'
                : 'Every travel choice has trade-offs. Compare what you gain vs what you give up.'}
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

        {/* 3-Column Plan Variant Matrix */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {planVariants.map((variant) => {
            const isSelected = variant.id === selectedPlanVariantId;

            return (
              <div
                key={variant.id}
                className={`rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all border ${
                  isSelected
                    ? 'bg-[#13312B] border-[#F4C36C] shadow-xl ring-2 ring-[#F4C36C]/20'
                    : 'bg-[#13312B]/50 border-white/10 hover:border-white/20 shadow-xs'
                }`}
              >
                {/* Top Section */}
                <div className="space-y-4">
                  {/* Badge & Fit Score */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isSelected
                          ? 'bg-[#F4C36C] text-[#081714]'
                          : 'bg-white/10 text-[#D2E3DE]'
                      }`}
                    >
                      {isSelected
                        ? language === 'ar' ? 'المسار المعتمد حالياً' : 'Active Selection'
                        : language === 'ar' ? 'بديل متاح' : 'Alternative'}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-extrabold text-[#F7F3EA] bg-white/10 px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3 text-[#F4C36C]" />
                      <span>{variant.fitScore}% Fit</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-[#F7F3EA] font-['Outfit',sans-serif]">
                      {language === 'ar' ? variant.nameAr : variant.name}
                    </h3>
                    <p className="text-xs text-[#D2E3DE]/70 leading-relaxed">
                      {language === 'ar' ? variant.taglineAr : variant.tagline}
                    </p>
                  </div>

                  {/* Quick Specs Pill Row */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[12px] font-bold">
                    <div className="p-2 rounded-xl bg-[#081714] border border-white/10 flex items-center gap-1.5 text-[#F7F3EA]">
                      <Wallet className="w-3.5 h-3.5 text-[#F4C36C]" />
                      <span>{variant.totalCostEGP.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#081714] border border-white/10 flex items-center gap-1.5 text-[#F7F3EA]">
                      <Compass className="w-3.5 h-3.5 text-[#F4C36C]" />
                      <span>{variant.pace} Pace</span>
                    </div>
                  </div>

                  {/* Gains (What You Get) */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[12px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1 font-['Outfit',sans-serif]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'ar' ? 'ما تكسبه في هذا المسار:' : 'What You Gain:'}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-[#D2E3DE]">
                      {(language === 'ar' ? variant.gainsAr : variant.gains).map((gain, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{gain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gives Up (What You Sacrifice) */}
                  <div className="space-y-2 pt-1 border-t border-white/10">
                    <div className="text-[12px] font-black uppercase tracking-wider text-[#F4C36C] flex items-center gap-1 font-['Outfit',sans-serif]">
                      <AlertCircle className="w-3.5 h-3.5 text-[#F4C36C]" />
                      <span>{language === 'ar' ? 'ما تتنازل عنه أو الفروقات:' : 'What You Give Up:'}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-[#D2E3DE]/70">
                      {(language === 'ar' ? variant.givesUpAr : variant.givesUp).map((giveUp, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-[#F4C36C] font-bold">−</span>
                          <span>{giveUp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  type="button"
                  disabled={isSelected}
                  onClick={() => {
                    selectPlanVariant(variant.id);
                    onClose();
                  }}
                  className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-[#F4C36C] hover:bg-amber-300 text-[#081714] shadow-md'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'المسار المختار حالياً' : 'Currently Active'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'ar' ? 'اختيار هذا المسار' : 'Switch to This Variant'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#081714] border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-xs text-[#D2E3DE]/60">
            {language === 'ar'
              ? 'تغيير المسار يعيد فوراً ضبط الأنشطة، الجداول الزمنية، وميزانية الرحلة.'
              : 'Switching plan variants immediately re-tunes timeline anchors and budget metrics.'}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-[#F7F3EA] font-bold text-xs cursor-pointer transition-colors"
          >
            {language === 'ar' ? 'إغلاق النافذة' : 'Done & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
