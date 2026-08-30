import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import type { ReadyTripProgram } from '../../data/readyTripsData';
import { useReadyProgrammes } from '../../hooks/useReadyProgrammes';
import { analytics } from '../../services/analytics';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Users,
  Heart,
  ChevronRight,
  Clock,
  Zap,
  MapPin,
  ShieldCheck,
  Check,
  RotateCcw,
  Star,
  Sun,
  Waves,
  Coffee
} from 'lucide-react';

interface QuickStartWizardProps {
  onOpenReadyProgram: (program: ReadyTripProgram) => void;
  onOpenPlanItForMe: () => void;
  onOpenBuildMyself: () => void;
  onDismissToPathways?: () => void;
}

export const QuickStartWizard: React.FC<QuickStartWizardProps> = ({
  onOpenReadyProgram,
  onOpenPlanItForMe,
  onOpenBuildMyself,
  onDismissToPathways
}) => {
  // Served content, with the compiled array as the offline fallback.
  const programmes = useReadyProgrammes();

  const { language, t, isRTL } = useLanguage();
  const { updateProfile } = useTrip();

  // Wizard state: 0 = First Time Ask, 1 = Pick Vibe & Instant Result
  const [firstTimeChoice, setFirstTimeChoice] = useState<'yes' | 'no' | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<'highlights' | 'relax' | 'adventure' | 'diving' | 'couples'>('highlights');

  useEffect(() => {
    analytics.track('quickstart_opened');
  }, []);

  const getRecommendedProgram = (): { program: ReadyTripProgram; reasonEn: string; reasonAr: string } => {
    switch (selectedVibe) {
      case 'adventure':
        return {
          program: programmes.find(p => p.id === 'dahab-adventure') || programmes[1],
          reasonEn: 'Balanced canyon hikes, quad biking, and Bedouin dinners without physical overload.',
          reasonAr: 'تجمع بين سفاري الكانيون، بيتش باجي الغروب، وعشاء الجبل بدون إجهاد.'
        };
      case 'diving':
        return {
          program: programmes.find(p => p.id === 'diving-week') || programmes[3],
          reasonEn: 'World-class shore dives at Blue Hole & Canyon with dedicated rest days.',
          reasonAr: 'أشهر غطسات البلو هول والكانيون مع فترات راحة كافية بين الغطسات.'
        };
      case 'couples':
        return {
          program: programmes.find(p => p.id === 'couples-escape') || programmes[4],
          reasonEn: 'Intimate beachfront boutique stays, romantic candlelight dinners, and calm lagoon days.',
          reasonAr: 'إقامة رايقة ع البحر مباشرة مع عشاء رومانسي وأجواء هادية وخاصة.'
        };
      case 'relax':
        return {
          program: programmes.find(p => p.id === 'slow-dahab') || programmes[2],
          reasonEn: 'Unhurried seaside cafes, snorkeling at your own pace, and zero morning alarms.',
          reasonAr: 'روقان كامل على الممشى، سنوركلينج براحتك، وبدون أي مواعيد تصحيك بدري.'
        };
      case 'highlights':
      default:
        return {
          program: programmes.find(p => p.id === 'dahab-first-timer') || programmes[0],
          reasonEn: 'The classic Dahab introduction: Blue Hole, Ras Abu Galum, Laguna sunset, and verified seafood.',
          reasonAr: 'أفضل بداية لدهب: البلو هول، رأس أبو جالوم، غروب اللاجونا، وأشهى سمك طازة.'
        };
    }
  };

  const { program: matched, reasonEn, reasonAr } = getRecommendedProgram();

  const handleFirstTimeResponse = (isFirst: boolean) => {
    const choice = isFirst ? 'yes' : 'no';
    setFirstTimeChoice(choice);
    analytics.track('first_time_selected', {
      metadata: { isFirstTime: isFirst }
    });

    if (!isFirst && onDismissToPathways) {
      onDismissToPathways();
    }
  };

  const handleSelectVibe = (vibe: 'highlights' | 'relax' | 'adventure' | 'diving' | 'couples') => {
    setSelectedVibe(vibe);
    analytics.track('vibe_selected', {
      metadata: { vibe }
    });
    analytics.track('ready_trip_recommended', {
      templateId: matched.id
    });
  };

  const handleOpenRecommended = () => {
    analytics.track('ready_trip_started', {
      templateId: matched.id,
      durationDays: matched.durationDays,
      budget: matched.defaultBudget
    });
    onOpenReadyProgram(matched);
  };

  const handlePickAnother = () => {
    analytics.track('ready_trip_rejected', {
      templateId: matched.id
    });
    if (onDismissToPathways) {
      onDismissToPathways();
    }
  };

  return (
    <div
      id="first-time-traveler-quickstart"
      className="mb-10 bg-white border border-[#0F6F78]/25 rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#0F6F78]/5 rounded-full blur-3xl pointer-events-none" />

      {/* STEP 1: INITIAL QUESTION ("New to Dahab?") */}
      {firstTimeChoice === null && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#92400E] text-[12px] font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('tripEntry.newToDahab')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#142126]">
              {language === 'ar' ? 'أول مرة تزور دهب؟' : 'First time visiting Dahab?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#142126]/70 mt-1 leading-relaxed">
              {t('tripEntry.firstTimePrompt')}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <button
              id="first-time-yes-btn"
              onClick={() => handleFirstTimeResponse(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0F6F78] hover:bg-[#0A535A] text-white text-xs font-bold transition-all shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#52C4B7]" />
              <span>{t('tripEntry.firstTimeYes')}</span>
            </button>

            <button
              id="first-time-no-btn"
              onClick={() => handleFirstTimeResponse(false)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#F7F3EA] hover:bg-[#EFE8DA] text-[#142126] border border-[#142126]/10 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t('tripEntry.firstTimeNo')}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EXPERIENCED TRAVELER QUICK DISMISSAL MESSAGE */}
      {firstTimeChoice === 'no' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F6F78]/10 text-[#0F6F78] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#142126]">
                {language === 'ar' ? 'أهلاً بعودتك لدهب! اختر المسار اللي يناسبك بالأسفل' : 'Welcome back to Dahab! Pick any pathway below'}
              </h4>
              <p className="text-xs text-[#142126]/60">
                {language === 'ar' ? 'سواء عايز تبني رحلة من الصفر أو تستخدم الذكاء الاصطناعي' : 'Full custom building and AI directors are available below.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setFirstTimeChoice('yes')}
            className="text-xs text-[#0F6F78] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'أو وريني المقترحات السريعة' : 'Or show me quick recommendations'}</span>
          </button>
        </div>
      )}

      {/* STEP 3: NEW TRAVELER GUIDED EXPERIENCE (2-3 TAPS TO START) */}
      {firstTimeChoice === 'yes' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Bar: Vibe Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F6F78] block">
                  {language === 'ar' ? 'الخطوة ٢ من ٢' : 'Step 2 of 2'}
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-[#142126]">
                  {t('tripEntry.quickStartVibe')}
                </h4>
              </div>

              <button
                onClick={() => setFirstTimeChoice(null)}
                className="text-[12px] text-[#142126]/50 hover:text-[#142126] font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'ar' ? 'تغيير' : 'Reset'}</span>
              </button>
            </div>

            {/* Vibe Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {([
                { id: 'highlights', label: 'Top Highlights', labelAr: 'أشهر المعالم', icon: Star },
                { id: 'relax', label: 'Chill & Sea', labelAr: 'بحر وروقان', icon: Coffee },
                { id: 'adventure', label: 'Safari & Trek', labelAr: 'سفاري وجبال', icon: Zap },
                { id: 'diving', label: 'Diving Reefs', labelAr: 'غطس وشعاب', icon: Waves },
                { id: 'couples', label: 'Couples Mood', labelAr: 'رومانسي وهادي', icon: Heart },
              ] as const).map((item) => {
                const Icon = item.icon;
                const isSelected = selectedVibe === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectVibe(item.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left font-bold transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-[#142126] text-white border-[#142126] shadow-sm scale-[1.02]'
                        : 'bg-[#F7F3EA]/70 text-[#142126]/80 hover:bg-[#EFE8DA] border-[#142126]/8'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#F4C36C]' : 'text-[#0F6F78]'}`} />
                    <span className="text-xs leading-tight">
                      {language === 'ar' ? item.labelAr : item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Ready Trip Result Card ("Your Dahab Starts Here") */}
          <div className="bg-[#FAF7F0] rounded-2xl p-4 sm:p-5 border border-[#0F6F78]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={matched.heroImage}
                alt={matched.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F6F78] bg-[#0F6F78]/10 px-2.5 py-0.5 rounded-full">
                    {t('tripEntry.recommendedBadge')}
                  </span>
                  <span className="text-xs text-[#142126]/60 font-semibold">
                    {matched.durationDays} {language === 'ar' ? 'أيام' : 'Days'} · {language === 'ar' ? matched.paceAr : matched.pace}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-serif font-bold text-[#142126] leading-tight">
                  {language === 'ar' ? matched.titleAr : matched.title}
                </h4>

                <p className="text-xs text-[#142126]/75 mt-1 font-medium leading-relaxed max-w-xl">
                  <span className="font-bold text-[#0F6F78]">
                    {language === 'ar' ? 'ليه تناسبك؟ ' : 'Why this fits you: '}
                  </span>
                  {language === 'ar' ? reasonAr : reasonEn}
                </p>

                {/* Trust Signal */}
                <div className="flex items-center gap-2 mt-2 text-[12px] text-[#142126]/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F6F78]" />
                  <span>{t('tripEntry.noCommitment')}</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#142126]/10">
              <button
                id="quickstart-see-trip-btn"
                onClick={handleOpenRecommended}
                className="flex-1 sm:flex-initial w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0F6F78] hover:bg-[#0A535A] text-white text-xs font-bold transition-all shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>{t('tripEntry.seeMyTrip')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="quickstart-pick-another-btn"
                onClick={handlePickAnother}
                className="px-4 py-2 text-xs font-bold text-[#142126]/60 hover:text-[#142126] transition-colors cursor-pointer"
              >
                {t('tripEntry.pickAnother')}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
