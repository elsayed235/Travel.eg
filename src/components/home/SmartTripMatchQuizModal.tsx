import React, { useState } from 'react';
import { READY_TRIP_PROGRAMS, ReadyTripProgram } from '../../data/readyTripsData';
import { useLanguage } from '../../i18n/LanguageContext';
import { analytics } from '../../services/analytics';
import { X, Sparkles, ArrowRight, CheckCircle2, RotateCcw, Compass } from 'lucide-react';

interface SmartTripMatchQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram: (program: ReadyTripProgram) => void;
}

export const SmartTripMatchQuizModal: React.FC<SmartTripMatchQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectProgram
}) => {
  const { language, t, isRTL } = useLanguage();

  const [step, setStep] = useState<'quiz' | 'result'>('quiz');
  const [selectedVibe, setSelectedVibe] = useState<string>('first_timer');
  const [selectedDays, setSelectedDays] = useState<number>(5);
  const [selectedPace, setSelectedPace] = useState<'Relaxed' | 'Balanced' | 'Active'>('Balanced');
  const [matchedProgram, setMatchedProgram] = useState<ReadyTripProgram>(READY_TRIP_PROGRAMS[0]);

  if (!isOpen) return null;

  const vibes = [
    {
      id: 'first_timer',
      title: 'First-timer icons & essentials',
      titleAr: 'أول مرة في دهب وعايز أشوف أشهر المعالم',
      targetId: 'dahab-first-timer'
    },
    {
      id: 'adventure',
      title: 'Adrenaline, Sinai peaks & canyon treks',
      titleAr: 'مغامرة وتسلق جبال وكانيونات وسفاري',
      targetId: 'dahab-adventure'
    },
    {
      id: 'slow',
      title: 'Deep decompression, quiet beaches & bakeries',
      titleAr: 'روقان وفصلان تام، بحر هادي وشاي بالحبق',
      targetId: 'slow-dahab'
    },
    {
      id: 'diving',
      title: 'Dedicated reef & boat diving week',
      titleAr: 'أسبوع غطس شاطئي وباليخت في أشهر الشعب',
      targetId: 'diving-week'
    },
    {
      id: 'couples',
      title: 'Romantic getaway, private boat & candlelit dinners',
      titleAr: 'رحلة رومانسية خاصة وعشاء بالشموع ع الشط',
      targetId: 'couples-escape'
    }
  ];

  const handleCalculateMatch = () => {
    const selectedVibeObj = vibes.find(v => v.id === selectedVibe);
    const targetProgramId = selectedVibeObj ? selectedVibeObj.targetId : 'dahab-first-timer';
    const match = READY_TRIP_PROGRAMS.find(p => p.id === targetProgramId) || READY_TRIP_PROGRAMS[0];

    setMatchedProgram(match);
    setStep('result');

    analytics.track('smart_match_quiz_completed', {
      templateId: match.id,
      durationDays: selectedDays,
      pace: selectedPace
    });
  };

  const handleReset = () => {
    setStep('quiz');
  };

  const handleApplyMatch = () => {
    onSelectProgram(matchedProgram);
  };

  return (
    <div
      id="smart-trip-match-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--surface-card)] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#1A1A1A]/10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FDFBF7] border-b border-[#1A1A1A]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-[#5A5A40]">
                {t('home.smartProgramMatcher')}
              </span>
              <h2 className="text-lg sm:text-xl chart-heading font-bold text-[#1A1A1A]">
                {t('home.whichDahabTripIs')}
              </h2>
            </div>
          </div>

          <button
            id="close-quiz-modal-btn"
            onClick={onClose}
            aria-label={t('readyTrip.close')}
            className="w-9 h-9 rounded-full bg-[var(--surface-card)] hover:bg-[#F4EFEA] border border-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#1A1A1A]">
          {step === 'quiz' ? (
            <>
              {/* Question 1: Vibe */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A40] mb-3">
                  1. {t('home.whatVibeAreYou')}
                </label>
                <div className="space-y-2">
                  {vibes.map((v) => {
                    const isSelected = selectedVibe === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVibe(v.id)}
                        className={`w-full text-start p-3.5 rounded-2xl border transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer flex items-center justify-between text-xs sm:text-sm font-medium ${
                          isSelected
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                            : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#1A1A1A]/8 hover:bg-[#F4EFEA]'
                        } ${isRTL ? 'text-end' : 'text-start'}`}
                      >
                        <span>{language === 'ar' ? v.titleAr : v.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Length */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A40] mb-2">
                  2. {t('home.howManyDaysDo')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 5, 6].map((days) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDays(days)}
                      className={`p-3 rounded-xl text-center text-xs font-bold border transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${
                        selectedDays === days
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FDFBF7] text-[#1A1A1A]/70 border-[#1A1A1A]/8 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {days} {t('home.days-3')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Pace */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A40] mb-2">
                  3. {t('home.whatPaceFeelsBest')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Relaxed', 'Balanced', 'Active'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPace(p)}
                      className={`p-3 rounded-xl text-center text-xs font-bold border transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer ${
                        selectedPace === p
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FDFBF7] text-[#1A1A1A]/70 border-[#1A1A1A]/8 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {p === 'Relaxed' ? (t('home.relaxed')) : p === 'Balanced' ? (t('home.balanced')) : (t('home.active'))}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Result View */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center">
                <span className="text-xs font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-3 py-1 rounded-full border border-[#5A5A40]/20">
                  {t('home.your98Match')}
                </span>
                <h3 className="text-2xl sm:text-3xl chart-heading font-bold text-[#1A1A1A] mt-3">
                  {language === 'ar' ? matchedProgram.titleAr : matchedProgram.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-2 max-w-md mx-auto">
                  {language === 'ar' ? matchedProgram.taglineAr : matchedProgram.tagline}
                </p>
              </div>

              {/* Matched Card Preview */}
              <div className="bg-[#FDFBF7] rounded-2xl p-4 sm:p-5 border border-[#1A1A1A]/10 flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={matchedProgram.heroImage}
                  alt={matchedProgram.title}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">{matchedProgram.durationDays} {t('home.days-3')}</span>
                    <span>·</span>
                    <span className="text-[#5A5A40] font-semibold">{language === 'ar' ? matchedProgram.paceAr : matchedProgram.pace}</span>
                  </div>
                  <div className="text-[#1A1A1A]/70 line-clamp-2">
                    {(language === 'ar' ? matchedProgram.highlightsAr : matchedProgram.highlights).slice(0, 2).join(' · ')}
                  </div>
                  <div className="text-sm font-bold text-[#1A1A1A] pt-1">
                    {t('readyTrip.startingFrom')} {matchedProgram.startingPriceEGP.toLocaleString()} EGP
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-900/10 rounded-2xl p-4 text-xs text-amber-950">
                <div className="font-bold mb-1">
                  {t('home.whyThisTripFits')}
                </div>
                <div>
                  {t('home.itineraryPaceBlend', {
                    pace: language === 'ar' ? matchedProgram.paceAr : matchedProgram.pace,
                    freeTimeScore: matchedProgram.freeTimeScore,
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#FDFBF7] border-t border-[#1A1A1A]/8 flex items-center justify-between gap-3">
          {step === 'quiz' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
              >
                {t('readyTrip.close')}
              </button>

              <button
                id="calculate-match-btn"
                onClick={handleCalculateMatch}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-xs font-bold cursor-pointer transition-[background-color,border-color,color,box-shadow,transform,opacity]"
              >
                <span>{t('home.revealBestMatch')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#1A1A1A]/70 hover:text-[#1A1A1A] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('home.retakeQuiz')}</span>
              </button>

              <button
                id="apply-match-btn"
                onClick={handleApplyMatch}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-xs font-bold cursor-pointer transition-[background-color,border-color,color,box-shadow,transform,opacity]"
              >
                <span>{t('home.previewStartTrip')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
