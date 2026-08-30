import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { analytics } from '../../services/analytics';
import {
  X,
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  Compass,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Waves
} from 'lucide-react';

interface PlanItForMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: () => void;
}

export const PlanItForMeModal: React.FC<PlanItForMeModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated
}) => {
  const { language, t, isRTL } = useLanguage();
  const { updateProfile, profile } = useTrip();

  const [days, setDays] = useState<number>(profile.lengthDays || 5);
  const [travelers, setTravelers] = useState<number>(profile.travelersCount || 2);
  const [budget, setBudget] = useState<'Budget' | 'Moderate' | 'Premium'>(profile.budget || 'Moderate');
  const [pace, setPace] = useState<'Relaxed' | 'Balanced' | 'Active'>(profile.pace || 'Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests || ['Diving', 'Adventure']);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  if (!isOpen) return null;

  const interestsList = [
    { id: 'Diving', label: 'Diving & Reefs', labelAr: 'غطس وشعاب مرجانية' },
    { id: 'Adventure', label: 'Desert & Canyons', labelAr: 'صحراء وكانيونات' },
    { id: 'Beach', label: 'Beach & Blue Lagoon', labelAr: 'شواطئ وبلو لاجون' },
    { id: 'Food', label: 'Seafood & Cafés', labelAr: 'مطاعم وكافيهات' },
    { id: 'Local Life', label: 'Bedouin Culture', labelAr: 'ثقافة وقعدات بدوية' },
    { id: 'Wellness', label: 'Yoga & Relaxation', labelAr: 'يوجا واسترخاء' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    analytics.track('plan_it_for_me_selected', {
      durationDays: days,
      travelersCount: travelers,
      budget,
      pace,
      interests: selectedInterests
    });

    // Animate AI Synthesis steps
    setTimeout(() => setLoadingStep(1), 500);
    setTimeout(() => setLoadingStep(2), 1100);
    setTimeout(() => {
      updateProfile({
        lengthDays: days,
        travelersCount: travelers,
        budget,
        pace,
        interests: selectedInterests
      });

      analytics.track('ai_plan_generated', {
        durationDays: days,
        travelersCount: travelers,
        budget
      });

      setIsGenerating(false);
      onPlanGenerated();
    }, 1800);
  };

  return (
    <div
      id="plan-it-for-me-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#1A1A1A]/10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FDFBF7] border-b border-[#1A1A1A]/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#C9A050]" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40]">
                {language === 'ar' ? 'مرشد دهب الذكي' : 'Dahab Travel Director'}
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A]">
                {language === 'ar' ? 'خططها لي على ذوقكم' : 'Plan It For Me'}
              </h2>
            </div>
          </div>

          <button
            id="close-plan-modal-btn"
            onClick={onClose}
            aria-label={t('readyTrip.close')}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F4EFEA] border border-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-[#1A1A1A]">
          {isGenerating ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#5A5A40]/10 border border-[#5A5A40]/20 flex items-center justify-center text-[#5A5A40] animate-pulse">
                <Waves className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                  {loadingStep === 0 && (language === 'ar' ? 'قراءة حالة المد والجزر والشعاب في دهب...' : 'Reading marine tides & dive windows in Dahab...')}
                  {loadingStep === 1 && (language === 'ar' ? 'مطابقة أفضل الفنادق ومرشدي سيناء الموثوقين...' : 'Matching boutique stays and vetted local guides...')}
                  {loadingStep === 2 && (language === 'ar' ? 'صياغة جدولك اليومي المتكامل...' : 'Synthesizing your personalized Dahab itinerary...')}
                </h3>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">
                  {language === 'ar' ? 'لحظات ورحلتك هتكون جاهزة تماماً' : 'Creating a cohesive flow grounded in Sinai reality'}
                </p>
              </div>
              <div className="flex justify-center">
                <Loader2 className="w-5 h-5 text-[#5A5A40] animate-spin" />
              </div>
            </div>
          ) : (
            <>
              {/* Question 1: Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">
                  1. {language === 'ar' ? 'مدة الإقامة في دهب' : 'Trip Duration'}
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDays(num)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        days === num
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FDFBF7] text-[#1A1A1A]/70 border-[#1A1A1A]/10 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {num} {language === 'ar' ? 'أيام' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Group Dynamic */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">
                  2. {language === 'ar' ? 'مسافر مع مين؟' : 'Who is traveling?'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { count: 1, label: 'Solo', labelAr: 'لوحدي' },
                    { count: 2, label: 'Couple', labelAr: 'زوجين' },
                    { count: 3, label: 'Friends', labelAr: 'أصحاب' },
                    { count: 4, label: 'Family', labelAr: 'عيلة' }
                  ].map((item) => (
                    <button
                      key={item.count}
                      onClick={() => setTravelers(item.count)}
                      className={`py-2.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                        travelers === item.count
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FDFBF7] text-[#1A1A1A]/70 border-[#1A1A1A]/10 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {language === 'ar' ? item.labelAr : item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Budget Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">
                  3. {language === 'ar' ? 'الميزانية المفضلة' : 'Target Budget'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Budget', 'Moderate', 'Premium'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        budget === b
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FDFBF7] text-[#1A1A1A]/70 border-[#1A1A1A]/10 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {b === 'Budget' ? (language === 'ar' ? 'اقتصادي' : 'Budget') : b === 'Moderate' ? (language === 'ar' ? 'متوسط' : 'Moderate') : (language === 'ar' ? 'فاخر' : 'Premium')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Experiences / Passions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">
                  4. {language === 'ar' ? 'أهم التجارب اللي حابب تعيشها' : 'Top Experiences'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestsList.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                            : 'bg-[#FDFBF7] text-[#1A1A1A]/80 border-[#1A1A1A]/10 hover:bg-[#F4EFEA]'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <span>{language === 'ar' ? item.labelAr : item.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 5: Pace */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2">
                  5. {language === 'ar' ? 'ريتم اليوم' : 'Daily Pace'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Relaxed', 'Balanced', 'Active'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPace(p)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        pace === p
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FDFBF7] text-[#1A1A1A]/70 border-[#1A1A1A]/10 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {p === 'Relaxed' ? (language === 'ar' ? 'رايق' : 'Relaxed') : p === 'Balanced' ? (language === 'ar' ? 'متوازن' : 'Balanced') : (language === 'ar' ? 'نشيط' : 'Active')}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isGenerating && (
          <div className="p-4 sm:p-6 bg-[#FDFBF7] border-t border-[#1A1A1A]/8 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
            >
              {t('readyTrip.close')}
            </button>

            <button
              id="generate-plan-btn"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#2E2E2E] active:scale-[0.98] text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-black/10"
            >
              <span>{t('tripEntry.modeC.cta')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
