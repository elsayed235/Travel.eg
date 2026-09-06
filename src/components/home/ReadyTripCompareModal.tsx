import React from 'react';
import type { ReadyTripProgram } from '../../data/readyTripsData';
import { useReadyProgrammes } from '../../hooks/useReadyProgrammes';
import { useLanguage } from '../../i18n/LanguageContext';
import { analytics } from '../../services/analytics';
import { X, Check, ArrowRight, Zap, Clock, DollarSign, Sparkles } from 'lucide-react';

interface ReadyTripCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram: (program: ReadyTripProgram) => void;
}

export const ReadyTripCompareModal: React.FC<ReadyTripCompareModalProps> = ({
  isOpen,
  onClose,
  onSelectProgram
}) => {
  // Served content, with the compiled array as the offline fallback.
  const programmes = useReadyProgrammes();

  const { language, t, isRTL } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (program: ReadyTripProgram) => {
    analytics.track('ready_trip_previewed', {
      templateId: program.id,
      durationDays: program.durationDays
    });
    onSelectProgram(program);
  };

  return (
    <div
      id="ready-trip-compare-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--surface-card)] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#1A1A1A]/10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#FDFBF7] border-b border-[#1A1A1A]/8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40]">
              {t('home.compareAll5Programs')}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">
              {t('home.whichDahabTripFits')}
            </h2>
          </div>

          <button
            id="close-compare-modal-btn"
            onClick={onClose}
            aria-label={t('readyTrip.close')}
            className="w-9 h-9 rounded-full bg-[var(--surface-card)] hover:bg-[#F4EFEA] border border-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="overflow-x-auto p-4 sm:p-6 flex-1 text-[#1A1A1A]">
          <div className="min-w-[700px] grid grid-cols-6 gap-3 pb-4">
            {/* Attribute Label Column */}
            <div className="col-span-1 space-y-6 pt-12 text-xs font-bold text-[#1A1A1A]/60">
              <div className="h-10 flex items-center">
                {t('attractions.duration')}
              </div>
              <div className="h-10 flex items-center">
                {t('home.pace')}
              </div>
              <div className="h-10 flex items-center">
                {t('home.intensity')}
              </div>
              <div className="h-10 flex items-center">
                {t('home.freeTime')}
              </div>
              <div className="h-10 flex items-center">
                {t('home.startingFrom')}
              </div>
              <div className="h-28 flex items-center">
                {t('home.topHighlights')}
              </div>
            </div>

            {/* 5 Program Cards */}
            {programmes.map((prog) => (
              <div
                key={prog.id}
                className="col-span-1 bg-[#FDFBF7] rounded-2xl p-3.5 border border-[#1A1A1A]/8 hover:border-[#5A5A40] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40] bg-[#5A5A40]/10 px-2 py-0.5 rounded-full inline-block mb-1">
                    {language === 'ar' ? prog.badgeAr : prog.badge}
                  </span>
                  <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 mb-3">
                    {language === 'ar' ? prog.titleAr : prog.title}
                  </h3>

                  <div className="space-y-6 text-xs text-[#1A1A1A]">
                    <div className="h-10 flex items-center font-bold">
                      {prog.durationDays} {t('home.days-3')}
                    </div>

                    <div className="h-10 flex items-center">
                      <span className="bg-[var(--surface-card)] border border-[#1A1A1A]/10 px-2 py-0.5 rounded text-[12px] font-medium">
                        {language === 'ar' ? prog.paceAr : prog.pace}
                      </span>
                    </div>

                    <div className="h-10 flex items-center gap-1 font-semibold text-[12px]">
                      <Zap className="w-3 h-3 text-[#5A5A40]" />
                      <span>{prog.intensityScore}/5</span>
                    </div>

                    <div className="h-10 flex items-center font-semibold text-[12px] text-[#5A5A40]">
                      {prog.freeTimeScore}%
                    </div>

                    <div className="h-10 flex items-center font-bold text-xs">
                      {prog.startingPriceEGP.toLocaleString()} <span className="text-[11px] text-[#1A1A1A]/50 font-normal ms-1">EGP</span>
                    </div>

                    <div className="h-28 text-[11px] text-[#1A1A1A]/70 line-clamp-4 leading-relaxed overflow-hidden">
                      {(language === 'ar' ? prog.highlightsAr : prog.highlights).slice(0, 2).join(' · ')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelect(prog)}
                  className="mt-4 w-full py-2 bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  {t('home.viewProgram-2')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
