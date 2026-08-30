import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  MapPin, 
  Luggage, 
  Coffee, 
  Waves, 
  Footprints, 
  Building, 
  Check, 
  X, 
  RotateCcw,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface FirstTwoHoursPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptPlan: () => void;
  onChangePlan?: () => void;
}

export const FirstTwoHoursPlanModal: React.FC<FirstTwoHoursPlanModalProps> = ({
  isOpen,
  onClose,
  onAcceptPlan,
  onChangePlan,
}) => {
  const { language, isRTL, t } = useLanguage();
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  if (!isOpen) return null;

  const planSteps = [
    {
      time: '10:00',
      title: language === 'ar' ? 'الوصول لدهب' : 'Arrive in Dahab',
      desc: language === 'ar' ? 'النزول عند ممشى اللايتهاوس واستقبال نسيم البحر المنعش.' : 'Private transfer drop-off at Lighthouse promenade. Meet the sea breeze.',
      icon: MapPin,
      iconBg: 'bg-[#13312B] text-[#52C4B7]',
    },
    {
      time: '10:15',
      title: language === 'ar' ? 'حفظ الحقائب' : 'Leave bags',
      desc: language === 'ar' ? 'تسليم الشنط بأمان في استقبال فندق خليج دهب (دقيقتين مشي).' : 'Drop luggage securely at Dahab Bay Hotel front desk (2 min walk).',
      icon: Luggage,
      iconBg: 'bg-[#13312B] text-[#52C4B7]',
    },
    {
      time: '10:30',
      title: language === 'ar' ? 'الفطار الساحلي' : 'Breakfast',
      desc: language === 'ar' ? 'عصير مانجا فريش وعيش سخن وشكشوكة على ترابيزة مطلة ع البحر مباشرة.' : 'Fresh mango juice, warm pita, and Shakshuka at seaside cafe table.',
      icon: Coffee,
      iconBg: 'bg-[#13312B] text-[#F4C36C]',
    },
    {
      time: '11:15',
      title: language === 'ar' ? 'قهوة وتمشية' : 'Coffee / Walk',
      desc: language === 'ar' ? 'قهوة بدوية بحبّهان وتمشية هادية ومشمسة في ممشى الفنون.' : 'Bedouin spiced coffee and a slow, sunlit stroll along the arts promenade.',
      icon: Footprints,
      iconBg: 'bg-[#13312B] text-[#52C4B7]',
    },
    {
      time: '12:00',
      title: language === 'ar' ? 'قعدة الشاطئ' : 'Beach',
      desc: language === 'ar' ? 'استرخاء على شلتات الشاطئ المظللة مع إطلالة بانورامية لخليج العقبة.' : 'Relax on shaded shore cushions with panoramic view of the Gulf of Aqaba.',
      icon: Waves,
      iconBg: 'bg-[#13312B] text-[#52C4B7]',
    },
    {
      time: '12:30',
      title: language === 'ar' ? 'التوجه للفندق' : 'Head toward hotel',
      desc: language === 'ar' ? 'تمشية هادية للعودة للاستقبال واستلام مفتاح الغرفة.' : 'Slow walk back to Dahab Bay Hotel lounge for room key preparation.',
      icon: Building,
      iconBg: 'bg-[#13312B] text-[#52C4B7]',
    },
    {
      time: language === 'ar' ? '٣:٠٠ م' : '3:00 PM',
      title: language === 'ar' ? 'استلام الغرفة' : 'Check-in',
      desc: language === 'ar' ? 'الغرفة جاهزة! استلم مفتاحك، ارتاح في غرفتك المطلة ع البحر وفرّغ الشنط.' : 'Room ready! Check into your Sea View Deluxe room and unpack.',
      icon: Check,
      iconBg: 'bg-[#52C4B7] text-[#081714]',
      isHighlight: true,
    },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div 
        className="bg-[#0E2520] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto text-[#F7F3EA]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#13312B] text-[#F4C36C] flex items-center justify-center font-bold border border-white/10">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                {language === 'ar' ? 'خطة مقترحة مصغرة' : 'Suggested Mini-Plan'}
              </span>
              <h3 className="text-xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                {language === 'ar' ? 'أول ساعتين لك في دهب' : 'Your first 2 hours'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#D2E3DE] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Context Banner */}
        <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F4C36C]" />
            <span className="text-[#D2E3DE]/70">{language === 'ar' ? 'الوقت المتاح:' : 'Time available:'}</span>
            <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'ساعتين و٢٠ دقيقة حتى الاستلام' : '2h 20m before check-in'}</span>
          </div>
          <span className="text-[12px] font-bold text-[#52C4B7] bg-[#0E2520] px-2.5 py-0.5 rounded-full border border-white/10">
            {language === 'ar' ? 'بدون أي استعجال' : 'Zero Rush'}
          </span>
        </div>

        {/* Timeline Steps */}
        <div className={`space-y-3 relative ${isRTL ? 'pr-2 before:absolute before:right-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10' : 'pl-2 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10'}`}>
          {planSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className={`relative flex items-start gap-3.5 p-2.5 rounded-2xl transition-colors ${
                  step.isHighlight ? 'bg-[#13312B] border border-[#52C4B7]/30' : 'hover:bg-[#13312B]/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 font-bold text-xs shadow-xs border border-white/10 ${step.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#F4C36C]">
                      {step.time}
                    </span>
                    <h4 className="text-sm font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[12px] text-[#D2E3DE]/50 italic text-center">
          {language === 'ar' ? '* هذه خطة مرنة ومقترحة، يمكنك تغييرها أو تعديلها في أي وقت.' : '* This is an adaptive suggestion and can be customized at any time.'}
        </p>

        {/* Actions */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            id="change-plan-btn"
            onClick={() => {
              if (onChangePlan) onChangePlan();
              else onClose();
            }}
            className="py-3 px-4 rounded-full bg-[#13312B] hover:bg-white/10 text-xs font-bold text-[#F7F3EA] border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تعديل الخطة' : 'Change plan'}</span>
          </button>

          <button
            type="button"
            id="accept-plan-btn"
            onClick={() => {
              onAcceptPlan();
              onClose();
            }}
            className="py-3 px-4 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-xs font-bold text-[#081714] shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-['Outfit',sans-serif]"
          >
            <Check className="w-3.5 h-3.5 text-[#081714] stroke-[2.5]" />
            <span>{language === 'ar' ? 'بدء أول ساعتين الآن' : 'Start my first 2 hours'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

