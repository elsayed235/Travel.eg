import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  Heart,
  Shield,
  Sliders,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';

interface TripFitScoreCardProps {
  onOpenTradeOffs: () => void;
  onOpenBudget: () => void;
}

export const TripFitScoreCard: React.FC<TripFitScoreCardProps> = ({
  onOpenTradeOffs,
  onOpenBudget,
}) => {
  const { language, isRTL } = useLanguage();
  const { tripFit } = useTrip();

  const getIcon = (type: string) => {
    switch (type) {
      case 'clock':
        return <Clock className="w-3.5 h-3.5 text-[#F4C36C] shrink-0" />;
      case 'wallet':
        return <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'heart':
        return <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'shield':
        return <Shield className="w-3.5 h-3.5 text-[#52C4B7] shrink-0" />;
      case 'check':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#F4C36C] shrink-0" />;
    }
  };

  return (
    <section
      id="trip-fit-score-card"
      className="w-full bg-[#0E2520] text-[#F7F3EA] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4C36C] animate-pulse" />
            <span className="text-[12px] font-black uppercase tracking-wider text-[#F4C36C] font-['Outfit',sans-serif]">
              {language === 'ar' ? 'مؤشر توافق وجودة المخطط' : 'TRIP OS FIT ENGINE'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-[#F7F3EA]">
            {language === 'ar' ? 'معدل التوافق العام للرحلة' : 'Authoritative Trip Fit Score'}
          </h2>
          <p className="text-xs sm:text-sm text-[#D2E3DE]/80">
            {language === 'ar'
              ? tripFit.tradeOffSummaryAr
              : tripFit.tradeOffSummary}
          </p>
        </div>

        {/* Overall Score Dial Widget */}
        <div className="flex items-center gap-4 bg-[#13312B] p-4 sm:p-5 rounded-2xl border border-white/10 shrink-0 self-start lg:self-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#F4C36C]"
                strokeDasharray={`${tripFit.overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl sm:text-2xl font-black text-[#F4C36C] leading-none">
                {tripFit.overallScore}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C]/80">
              {language === 'ar' ? 'تقييم الجودة' : 'STATUS'}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#F7F3EA] font-['Outfit',sans-serif]">
              {tripFit.grade}
            </div>
            <div className="text-[12px] text-[#D2E3DE]/70">
              {language === 'ar' ? '٦ أبعاد تم التحقق منها' : '6 Dimensions Verified'}
            </div>
          </div>
        </div>
      </div>

      {/* 6 Dimensions Multi-Bar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {tripFit.dimensions.map((dim) => (
          <div
            key={dim.id}
            className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-2 hover:bg-[#13312B]/80 transition-colors"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F7F3EA]">
                {language === 'ar' ? dim.nameAr : dim.name}
              </span>
              <span className="font-black text-[#F4C36C]">
                {dim.score}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F4C36C] to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${dim.score}%` }}
              />
            </div>

            <p className="text-[12px] text-[#D2E3DE]/70 line-clamp-2">
              {language === 'ar' ? dim.explanationAr : dim.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Why Highlights & Action Buttons Row */}
      <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="text-[12px] font-black uppercase tracking-wider text-[#F4C36C] font-['Outfit',sans-serif]">
            {language === 'ar' ? 'لماذا يناسبك هذا المخطط تحديداً؟' : 'GROUNDED WHY HIGHLIGHTS'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#D2E3DE]">
            {tripFit.whyHighlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {getIcon(hl.iconType)}
                <span className="leading-snug">
                  {language === 'ar' ? hl.textAr : hl.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            id="btn-explore-tradeoffs"
            type="button"
            onClick={onOpenTradeOffs}
            className="px-4 py-2.5 rounded-2xl bg-[#F4C36C] hover:bg-amber-300 text-[#081714] font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مقارنة الخيارات والبدائل' : 'Compare Plan Trade-offs'}</span>
          </button>

          <button
            id="btn-view-budget-drivers"
            type="button"
            onClick={onOpenBudget}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-[#F7F3EA] font-bold text-xs border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? 'تفاصيل التكلفة' : 'Cost Breakdown'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
