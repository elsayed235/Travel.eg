import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Clock, 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Luggage, 
  Coffee, 
  Waves, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface EarlyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'luggage' | 'breakfast' | 'beach') => void;
}

export const EarlyCheckInModal: React.FC<EarlyCheckInModalProps> = ({
  isOpen,
  onClose,
  onSelectOption,
}) => {
  const { language, isRTL, t } = useLanguage();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setIsChecking(true);
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div 
        className="bg-[#0E2520] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#13312B] text-[#52C4B7] flex items-center justify-center font-bold border border-white/10">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                {language === 'ar' ? 'فندق خليج دهب' : 'Dahab Bay Hotel'}
              </span>
              <h3 className="text-lg font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                {language === 'ar' ? 'حالة تسجيل الوصول المبكر' : 'Early Check-in Status'}
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

        {/* Dynamic Checking vs Result State */}
        {isChecking ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#13312B] text-[#52C4B7] flex items-center justify-center mx-auto animate-spin border border-white/10">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-[#F7F3EA]">
                {language === 'ar' ? 'جاري التحقق مع إدارة الفندق...' : 'Checking with your hotel...'}
              </p>
              <p className="text-xs text-[#D2E3DE]/70">
                {language === 'ar' ? 'التواصل مع قسم الإشراف الداخلي واستقبال Dahab Bay Hotel' : 'Contacting Dahab Bay Hotel front desk housekeeping'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reassuring Notification */}
            <div className="p-4 rounded-2xl bg-[#13312B] border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-['Outfit',sans-serif]">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{language === 'ar' ? 'الغرفة لسه بتجهز ومش متاحة حالياً.' : "Early check-in isn't available yet."}</span>
              </div>
              <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                {language === 'ar' ? (
                  <>غرفة الديلوكس المطلة ع البحر بتخضع لعملية تعقيم وتنظيف شاملة وميعاد الاستلام الأساسي مازال <strong className="text-[#F7F3EA]">٣:٠٠ عصراً</strong>.</>
                ) : (
                  <>Your Sea View Deluxe room is currently undergoing thorough turnover cleaning. Your room is still scheduled for <strong className="text-[#F7F3EA]">3:00 PM</strong>.</>
                )}
              </p>
            </div>

            {/* Alternatives - Do not leave user at a dead end */}
            <div className="space-y-2 pt-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#D2E3DE]/70 block font-['Outfit',sans-serif]">
                {language === 'ar' ? 'اقتراحات ممتازة لقضاء الساعتين القادمتين:' : 'Great ways to spend the next 2h 20m:'}
              </span>

              <button
                type="button"
                id="early-checkin-alt-luggage"
                onClick={() => {
                  onClose();
                  onSelectOption('luggage');
                }}
                className="w-full p-3 rounded-2xl bg-[#13312B] hover:bg-white/10 border border-white/10 text-left rtl:text-right flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0E2520] text-[#52C4B7] flex items-center justify-center border border-white/10">
                    <Luggage className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#F7F3EA] block">
                      {language === 'ar' ? 'سيب شنطك في استقبال الفندق' : 'Leave your bags at reception'}
                    </span>
                    <span className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'خدمة أمانات مجانية وآمنة (دقيقتين مشي)' : 'Complimentary & safe luggage drop (2 min walk)'}
                    </span>
                  </div>
                </div>
                {isRTL ? <ArrowLeft className="w-4 h-4 text-[#D2E3DE]/40 group-hover:text-[#F4C36C] transition-colors" /> : <ArrowRight className="w-4 h-4 text-[#D2E3DE]/40 group-hover:text-[#F4C36C] transition-colors" />}
              </button>

              <button
                type="button"
                id="early-checkin-alt-breakfast"
                onClick={() => {
                  onClose();
                  onSelectOption('breakfast');
                }}
                className="w-full p-3 rounded-2xl bg-[#13312B] hover:bg-white/10 border border-white/10 text-left rtl:text-right flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0E2520] text-[#F4C36C] flex items-center justify-center border border-white/10">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#F7F3EA] block">
                      {language === 'ar' ? 'افطر فطار ساحلي ع البحر' : 'Grab seaside breakfast'}
                    </span>
                    <span className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'عصائر فريش وشكشوكة وشاي بدوي ع الممشى' : 'Fresh juice & Shakshuka along the promenade'}
                    </span>
                  </div>
                </div>
                {isRTL ? <ArrowLeft className="w-4 h-4 text-[#D2E3DE]/40 group-hover:text-[#F4C36C] transition-colors" /> : <ArrowRight className="w-4 h-4 text-[#D2E3DE]/40 group-hover:text-[#F4C36C] transition-colors" />}
              </button>

              <button
                type="button"
                id="early-checkin-alt-beach"
                onClick={() => {
                  onClose();
                  onSelectOption('beach');
                }}
                className="w-full p-3 rounded-2xl bg-[#13312B] hover:bg-white/10 border border-white/10 text-left rtl:text-right flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0E2520] text-[#52C4B7] flex items-center justify-center border border-white/10">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#F7F3EA] block">
                      {language === 'ar' ? 'استرخي على شاطئ اللايتهاوس' : 'Relax by the Lighthouse beach'}
                    </span>
                    <span className="text-[12px] text-[#D2E3DE]/70">
                      {language === 'ar' ? 'شلت مظللة ونسيم بحري هادي' : 'Shaded cushions & calm sea breeze'}
                    </span>
                  </div>
                </div>
                {isRTL ? <ArrowLeft className="w-4 h-4 text-[#D2E3DE]/40 group-hover:text-[#F4C36C] transition-colors" /> : <ArrowRight className="w-4 h-4 text-[#D2E3DE]/40 group-hover:text-[#F4C36C] transition-colors" />}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-xs font-bold text-[#D2E3DE] border border-white/10 transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

