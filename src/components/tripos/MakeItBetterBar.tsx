import React, { useState } from 'react';
import {
  Sparkles,
  Coffee,
  Wallet,
  Compass,
  MapPin,
  UtensilsCrossed,
  Clock,
  Heart,
  Zap,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { ImprovementActionType, ChangeImpactPreview } from '../../types/tripOs';
import { computeImprovementPreview } from '../../data/tripOsDefaults';

interface ActionPillConfig {
  id: ImprovementActionType;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
  tagline: string;
  taglineAr: string;
}

export const MakeItBetterBar: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { applyImprovementAction } = useTrip();

  const [activePreview, setActivePreview] = useState<{
    actionType: ImprovementActionType;
    preview: ChangeImpactPreview;
  } | null>(null);

  const actions: ActionPillConfig[] = [
    {
      id: 'make_relaxed',
      label: 'More Relaxed',
      labelAr: 'أكثر روقاناً',
      icon: <Coffee className="w-3.5 h-3.5 text-amber-500" />,
      tagline: 'Start later & add seaside chill',
      taglineAr: 'بداية متأخرة وشاي غروب',
    },
    {
      id: 'make_cheaper',
      label: 'Save EGP',
      labelAr: 'توفير ميزانية',
      icon: <Wallet className="w-3.5 h-3.5 text-emerald-500" />,
      tagline: 'Smart bundling & dining swaps',
      taglineAr: 'خصومات وبدائل محلية',
    },
    {
      id: 'add_diving',
      label: 'Add Marine Dive',
      labelAr: 'زيادة غطس',
      icon: <Compass className="w-3.5 h-3.5 text-sky-500" />,
      tagline: 'The Bells deep chimney dive',
      taglineAr: 'إضافة غطسة شق البيلز',
    },
    {
      id: 'reduce_driving',
      label: 'Less Driving',
      labelAr: 'تنقل أقل',
      icon: <MapPin className="w-3.5 h-3.5 text-indigo-500" />,
      tagline: 'Cluster nearby spots in Lighthouse',
      taglineAr: 'تجميع الأماكن بالممشى',
    },
    {
      id: 'more_local_food',
      label: 'Local Bedouin Food',
      labelAr: 'أكل بدوي أصيل',
      icon: <UtensilsCrossed className="w-3.5 h-3.5 text-rose-500" />,
      tagline: 'Wood-fired fish tagines & tea',
      taglineAr: 'طواجن فخار وشاي حطب',
    },
    {
      id: 'more_free_time',
      label: '4h Open Windows',
      labelAr: 'وقت حر إضافي',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
      tagline: 'Unscheduled afternoon freedom',
      taglineAr: 'ظهيرة مفتوحة للاسترخاء',
    },
    {
      id: 'couple_friendly',
      label: 'Romantic Vibe',
      labelAr: 'أجواء رومانسية',
      icon: <Heart className="w-3.5 h-3.5 text-pink-500" />,
      tagline: 'Private candlelit beach table',
      taglineAr: 'طاولة شاطئية خاصة بالشموع',
    },
    {
      id: 'more_adventurous',
      label: 'More Adventure',
      labelAr: 'مغامرة وأكشن',
      icon: <Zap className="w-3.5 h-3.5 text-orange-500" />,
      tagline: 'Sinai quad trails & bouldering',
      taglineAr: 'بيتش باجي وتسلق صخور',
    },
  ];

  const handleOpenPreview = (actionType: ImprovementActionType) => {
    const preview = computeImprovementPreview(actionType);
    setActivePreview({ actionType, preview });
  };

  const handleConfirmAction = () => {
    if (!activePreview) return;
    applyImprovementAction(activePreview.actionType);
    setActivePreview(null);
  };

  return (
    <section
      id="make-it-better-bar"
      className="w-full bg-[#0E2520] text-[#F7F3EA] rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl space-y-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#13312B] border border-[#F4C36C]/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#F4C36C]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#F7F3EA] font-['Outfit',sans-serif]">
              {language === 'ar' ? 'تحسين المخطط بضغطة واحدة (Make It Better)' : '1-Click Itinerary Optimizers'}
            </h3>
            <p className="text-[12px] text-[#D2E3DE]/70">
              {language === 'ar'
                ? 'اختر التعديل المطلوب ليعيد محرك الذكاء الاصطناعي موازنة أوقات ومصروفات الرحلة.'
                : 'Select an instant optimization to recalculate timing, pacing, and logistics.'}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Action Buttons */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar pt-1">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => handleOpenPreview(act.id)}
            className="p-3 rounded-2xl bg-[#13312B] hover:bg-[#13312B]/80 border border-white/10 hover:border-[#F4C36C]/40 transition-all cursor-pointer flex items-center gap-2.5 shrink-0 group text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-[#081714] border border-white/10 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              {act.icon}
            </div>
            <div className="space-y-0.5 pr-2 rtl:pr-0 rtl:pl-2">
              <div className="text-xs font-bold text-[#F7F3EA] group-hover:text-[#F4C36C] transition-colors whitespace-nowrap">
                {language === 'ar' ? act.labelAr : act.label}
              </div>
              <div className="text-[11px] text-[#D2E3DE]/60 whitespace-nowrap">
                {language === 'ar' ? act.taglineAr : act.tagline}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Impact Preview Modal */}
      {activePreview && (
        <div
          id="modal-impact-preview"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        
      role="dialog"
      aria-modal="true"
      aria-labelledby="make-it-better-bar-dialog-1-title"
    >
          <div className="bg-[#0E2520] text-[#F7F3EA] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-white/10 space-y-5 p-6 sm:p-7">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'معاينة التأثير والنتائج' : 'TRIP OS IMPACT PREVIEW'}
                </span>
                <h4 id="make-it-better-bar-dialog-1-title" className="text-lg font-extrabold text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {language === 'ar'
                    ? activePreview.preview.changeTitleAr
                    : activePreview.preview.changeTitle}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 text-[#F7F3EA] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-0.5">
                <span className="text-[11px] text-[#D2E3DE]/70 font-bold">{language === 'ar' ? 'التكلفة' : 'Cost Delta'}</span>
                <div className={`text-xs font-black ${activePreview.preview.costDeltaEGP < 0 ? 'text-emerald-400' : 'text-[#F7F3EA]'}`}>
                  {activePreview.preview.costDeltaEGP > 0 ? `+${activePreview.preview.costDeltaEGP}` : activePreview.preview.costDeltaEGP} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-0.5">
                <span className="text-[11px] text-[#D2E3DE]/70 font-bold">{language === 'ar' ? 'الوقت الحر' : 'Free Time'}</span>
                <div className={`text-xs font-black ${activePreview.preview.freeTimeDeltaHours > 0 ? 'text-emerald-400' : 'text-[#F7F3EA]'}`}>
                  {activePreview.preview.freeTimeDeltaHours > 0 ? `+${activePreview.preview.freeTimeDeltaHours}h` : `${activePreview.preview.freeTimeDeltaHours}h`}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-0.5">
                <span className="text-[11px] text-[#D2E3DE]/70 font-bold">{language === 'ar' ? 'المجهود البدني' : 'Intensity'}</span>
                <div className="text-xs font-black text-[#F7F3EA]">
                  {activePreview.preview.intensityDeltaScore > 0 ? `+${activePreview.preview.intensityDeltaScore}` : activePreview.preview.intensityDeltaScore}
                </div>
              </div>
            </div>

            {/* Gains List */}
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'المكاسب والتحسينات:' : 'What You Gain:'}</span>
              </div>
              <ul className="space-y-1 text-xs text-[#D2E3DE]">
                {(language === 'ar' ? activePreview.preview.gainsAr : activePreview.preview.gains).map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gives up List */}
            {activePreview.preview.givesUp.length > 0 && activePreview.preview.givesUp[0] !== 'None' && (
              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'ar' ? 'التغييرات أو التنازلات:' : 'Trade-offs:'}</span>
                </div>
                <ul className="space-y-1 text-xs text-[#D2E3DE]/80">
                  {(language === 'ar' ? activePreview.preview.givesUpAr : activePreview.preview.givesUp).map((gu, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-[#F4C36C] font-bold">−</span>
                      <span>{gu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-[#D2E3DE] hover:text-[#F7F3EA] font-bold text-xs cursor-pointer transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-6 py-2.5 rounded-2xl bg-[#F4C36C] hover:bg-amber-300 text-[#081714] font-extrabold text-xs shadow-lg cursor-pointer transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#081714]" />
                <span>{language === 'ar' ? 'تطبيق التعديل على الرحلة' : 'Apply Optimization'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
