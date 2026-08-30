import React, { useState } from 'react';
import { READY_TRIP_PROGRAMS, ReadyTripProgram } from '../../data/readyTripsData';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { analytics } from '../../services/analytics';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Coffee,
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ReadyTripPreviewModalProps {
  programId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram: (program: ReadyTripProgram, mode: 'book' | 'customize') => void;
  onOpenCompare: () => void;
}

export const ReadyTripPreviewModal: React.FC<ReadyTripPreviewModalProps> = ({
  programId,
  isOpen,
  onClose,
  onSelectProgram,
  onOpenCompare
}) => {
  const { language, t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  if (!isOpen || !programId) return null;

  const currentProgram = READY_TRIP_PROGRAMS.find(p => p.id === programId) || READY_TRIP_PROGRAMS[0];
  const activeDay = currentProgram.dayByDay[selectedDayIdx] || currentProgram.dayByDay[0];

  const handleBook = () => {
    analytics.track('ready_trip_started', {
      templateId: currentProgram.id,
      durationDays: currentProgram.durationDays,
      budget: currentProgram.defaultBudget
    });
    onSelectProgram(currentProgram, 'book');
  };

  const handleCustomize = () => {
    analytics.track('ready_trip_customized', {
      templateId: currentProgram.id,
      durationDays: currentProgram.durationDays,
      budget: currentProgram.defaultBudget
    });
    onSelectProgram(currentProgram, 'customize');
  };

  const handlePickAnother = () => {
    analytics.track('ready_trip_rejected', {
      templateId: currentProgram.id
    });
    onClose();
  };

  return (
    <div
      id="ready-trip-preview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={`rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border animate-in fade-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]'
            : 'bg-white border-[#122420]/10 text-[#122420]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Hero Image Backdrop */}
        <div className="relative h-48 sm:h-56 bg-stone-950 overflow-hidden flex-shrink-0">
          <img
            src={currentProgram.heroImage}
            alt={currentProgram.title}
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            id="close-preview-modal-btn"
            onClick={onClose}
            aria-label={t('readyTrip.close')}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10 border border-white/20`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Metadata Overlay */}
          <div className={`absolute bottom-4 ${isRTL ? 'right-6 left-6' : 'left-6 right-6'} flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white`}>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-[#20A89A] text-[#081714] px-2.5 py-0.5 rounded-full font-bold">
                  {t('readyTrip.planTitle')}
                </span>
                <span className="text-[12px] font-medium bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full">
                  {currentProgram.durationDays} {language === 'ar' ? 'أيام' : 'Days'} · {language === 'ar' ? currentProgram.paceAr : currentProgram.pace}
                </span>
                <span className="text-[12px] font-medium bg-emerald-500/20 text-emerald-300 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {t('tripEntry.verifiedLocal')}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                {language === 'ar' ? currentProgram.titleAr : currentProgram.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-normal max-w-xl line-clamp-1">
                {language === 'ar' ? currentProgram.taglineAr : currentProgram.tagline}
              </p>
            </div>

            <div className={`text-${isRTL ? 'left' : 'right'} bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 self-start sm:self-auto`}>
              <div className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                {t('readyTrip.startingFrom')}
              </div>
              <div className="text-lg sm:text-xl font-bold text-[#F4C36C]">
                {currentProgram.startingPriceEGP.toLocaleString()} <span className="text-xs font-normal text-white/80">EGP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className={`overflow-y-auto p-4 sm:p-8 space-y-6 flex-1 ${isDark ? 'text-[#D2E3DE]' : 'text-[#122420]'}`}>
          {/* Trust Banner */}
          <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${
            isDark
              ? 'bg-amber-500/10 border-amber-500/20 text-[#F4C36C]'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <Sparkles className="w-4 h-4 text-[#F4C36C] flex-shrink-0" />
            <span>{t('tripEntry.noCommitment')}</span>
          </div>

          {/* Quick Metrics Strip */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl border text-xs ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#F2EFE9] border-[#122420]/10'
          }`}>
            <div>
              <span className={`block text-[11px] uppercase font-bold tracking-wider ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                {t('readyTrip.intensity')}
              </span>
              <div className={`flex items-center gap-1 font-bold mt-0.5 ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                <Zap className="w-3.5 h-3.5 text-[#EA8E75]" />
                <span>Level {currentProgram.intensityScore} / 5</span>
              </div>
            </div>

            <div>
              <span className={`block text-[11px] uppercase font-bold tracking-wider ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                {t('readyTrip.freeTime')}
              </span>
              <div className="flex items-center gap-1 font-bold text-[#20A89A] mt-0.5">
                <Coffee className="w-3.5 h-3.5" />
                <span>{currentProgram.freeTimeScore}% Open Relax</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-2">
              <span className={`block text-[11px] uppercase font-bold tracking-wider ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                {language === 'ar' ? 'أنسب لمين' : 'Ideal For'}
              </span>
              <div className={`font-medium line-clamp-1 mt-0.5 ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                {language === 'ar' ? currentProgram.idealForAr : currentProgram.idealFor}
              </div>
            </div>
          </div>

          {/* Day by Day Itinerary View */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
                <Calendar className="w-4 h-4" />
                <span>{t('readyTrip.dayByDay')}</span>
              </h3>
              <span className={`text-xs ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                {selectedDayIdx + 1} of {currentProgram.dayByDay.length}
              </span>
            </div>

            {/* Day Selector Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {currentProgram.dayByDay.map((day, idx) => (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedDayIdx === idx
                      ? 'bg-[#20A89A] text-[#081714] shadow-xs'
                      : isDark
                      ? 'bg-[#13312B] text-[#D2E3DE] hover:bg-[#173832] border border-white/10'
                      : 'bg-[#F2EFE9] text-[#122420] hover:bg-[#EAE6DD] border border-[#122420]/10'
                  }`}
                >
                  <span>{language === 'ar' ? `يوم ${day.day}` : `Day ${day.day}`}</span>
                  <span className={`text-[11px] font-normal px-1.5 py-0.5 rounded ${
                    selectedDayIdx === idx ? 'bg-[#081714]/20 text-[#081714] font-bold' : isDark ? 'bg-white/10 text-[#D2E3DE]' : 'bg-black/5 text-[#4A635D]'
                  }`}>
                    {day.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Day Detail Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border mt-3 ${
              isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#FAF7F0] border-[#122420]/10'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b gap-2 ${
                isDark ? 'border-white/10' : 'border-[#122420]/10'
              }`}>
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
                    {language === 'ar' ? `اليوم ٠${activeDay.day}` : `Day 0${activeDay.day} Focus`}
                  </span>
                  <h4 className={`text-lg font-bold font-serif ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                    {activeDay.title}
                  </h4>
                </div>
                <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                  <Clock className="w-3 h-3 text-[#20A89A]" />
                  {activeDay.timeEstimate}
                </span>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                {activeDay.subtitle}
              </p>

              {/* Day Highlights */}
              <div className="space-y-2">
                {activeDay.highlights.map((h, i) => (
                  <div key={i} className={`flex items-start gap-2 text-xs p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20A89A] flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Included vs Customizable Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* What's Inside Your Dahab */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-emerald-950/30 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-900/10'
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                isDark ? 'text-emerald-300' : 'text-emerald-900'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{t('readyTrip.included')}</span>
              </h4>
              <ul className={`space-y-2 text-xs ${isDark ? 'text-[#D2E3DE]' : 'text-emerald-950/80'}`}>
                {(language === 'ar' ? currentProgram.includedItemsAr : currentProgram.includedItems).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20A89A] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Can Change Later */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#FAF7F0] border-[#122420]/10'
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'
              }`}>
                <Sliders className="w-4 h-4 text-[#20A89A]" />
                <span>{t('readyTrip.customizable')}</span>
              </h4>
              <ul className={`space-y-2 text-xs ${isDark ? 'text-[#D2E3DE]' : 'text-[#122420]/80'}`}>
                {(language === 'ar' ? currentProgram.customizableItemsAr : currentProgram.customizableItems).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20A89A] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className={`border-t p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0 ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-[#FAF7F0] border-[#122420]/10'
        }`}>
          <button
            id="preview-pick-another-btn"
            onClick={handlePickAnother}
            className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              isDark ? 'text-[#9DB5AF] hover:text-[#F7F3EA]' : 'text-[#4A635D] hover:text-[#122420]'
            }`}
          >
            {t('readyTrip.pickAnother')}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Customize Action */}
            <button
              id="preview-customize-btn"
              onClick={handleCustomize}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0E2520] hover:bg-[#173832] text-[#F7F3EA] border-white/10'
                  : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/15'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#20A89A]" />
              <span>{t('readyTrip.customize')}</span>
            </button>

            {/* Start This Trip Action */}
            <button
              id="preview-start-trip-btn"
              onClick={handleBook}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-[#081714] bg-[#F4C36C] hover:bg-[#E7A83B] active:scale-[0.98] shadow-md transition-all cursor-pointer group"
            >
              <span>{t('readyTrip.bookNow')}</span>
              <ArrowRight className={`w-3.5 h-3.5 text-[#081714] ${isRTL ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'} transition-transform rtl:rotate-180`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
