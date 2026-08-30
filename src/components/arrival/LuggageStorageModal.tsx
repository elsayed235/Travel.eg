import React, { useState } from 'react';
import { 
  Luggage, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Navigation, 
  X, 
  Check, 
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface LuggageStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStorage: (storageName: string) => void;
}

export const LuggageStorageModal: React.FC<LuggageStorageModalProps> = ({
  isOpen,
  onClose,
  onConfirmStorage,
}) => {
  const { language, isRTL, t } = useLanguage();
  const [selectedStorage, setSelectedStorage] = useState<'hotel' | 'locker'>('hotel');

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div 
        className="bg-[#0E2520] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#13312B] text-[#F4C36C] flex items-center justify-center font-bold border border-white/10">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                {language === 'ar' ? 'أمانات وحفظ الحقائب' : 'Luggage Storage'}
              </span>
              <h3 className="text-lg font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                {language === 'ar' ? 'تحب تسيب الشنط فين؟' : 'Where would you like to leave your bags?'}
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

        {/* Recommended Option Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#52C4B7] flex items-center gap-1.5 font-['Outfit',sans-serif]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4C36C]" />
              <span>{language === 'ar' ? 'مقترح ليك' : 'Recommended for you'}</span>
            </span>
            <span className="text-[12px] font-bold text-[#52C4B7] bg-[#13312B] px-2 py-0.5 rounded-full border border-white/10">
              {language === 'ar' ? 'مجاناً مع حجزك' : 'Free with your booking'}
            </span>
          </div>

          {/* Primary Recommended Option: Dahab Bay Hotel Concierge */}
          <div 
            onClick={() => setSelectedStorage('hotel')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              selectedStorage === 'hotel'
                ? 'border-[#F4C36C] bg-[#13312B] shadow-md'
                : 'border-white/10 bg-[#0E2520] hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0E2520] text-[#52C4B7] flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Outfit',sans-serif] font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'استقبال فندق خليج دهب (Dahab Bay Hotel)' : 'Dahab Bay Hotel Concierge'}
                  </h4>
                  <p className="text-xs text-[#D2E3DE]/70 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#52C4B7]" />
                    <span>{language === 'ar' ? 'ممشى اللايتهاوس · على بعد ١٢٠م (دقيقتين مشي)' : 'Lighthouse Promenade · 120m away (2 min walk)'}</span>
                  </p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                selectedStorage === 'hotel'
                  ? 'border-[#F4C36C] bg-[#F4C36C] text-[#081714]'
                  : 'border-white/30'
              }`}>
                {selectedStorage === 'hotel' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Key Storage Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-[#0E2520] border border-white/5 space-y-0.5">
                <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/40 block font-['Outfit',sans-serif]">{language === 'ar' ? 'المواعيد' : 'Opening'}</span>
                <span className="font-bold text-[#52C4B7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52C4B7]"></span>
                  <span>{language === 'ar' ? 'مفتوح الآن (٢٤/٧)' : 'Open Now (24/7)'}</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0E2520] border border-white/5 space-y-0.5">
                <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/40 block font-['Outfit',sans-serif]">{language === 'ar' ? 'التكلفة' : 'Cost'}</span>
                <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'مجاناً / مشمول بالحجز' : 'Free / Included'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0E2520] border border-white/5 space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/40 block font-['Outfit',sans-serif]">{language === 'ar' ? 'المدة' : 'Duration'}</span>
                <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'حتى ٣:٠٠ عصراً أو بعده' : 'Until 3:00 PM or later'}</span>
              </div>
            </div>

            {/* Directions & Security note */}
            <div className="p-3 rounded-xl bg-[#0E2520] border border-white/10 text-xs text-[#D2E3DE]/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#52C4B7] font-['Outfit',sans-serif]">
                <Navigation className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الاتجاهات من موقع نزولك الحالي' : 'Directions from your dropoff'}</span>
              </div>
              <p className="text-[12px] leading-relaxed">
                {language === 'ar' 
                  ? 'امشي ١٠٠م في الممشى المبلط باتجاه فنار اللايتهاوس، واسأل الاستقبال على خدمة حفظ الشنط.'
                  : 'Head 100m straight down the paved promenade toward the lighthouse beacon, and ask the front desk for luggage storage.'}
              </p>
            </div>
          </div>

          {/* Secondary Nearby Option */}
          <div 
            onClick={() => setSelectedStorage('locker')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedStorage === 'locker'
                ? 'border-[#F4C36C] bg-[#13312B]'
                : 'border-white/10 bg-[#0E2520] hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#13312B] text-[#D2E3DE] flex items-center justify-center flex-shrink-0 border border-white/10">
                <Luggage className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-[#F7F3EA] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'خزائن شاطئ اللايتهاوس' : 'Lighthouse Beach Locker Hub'}
                </h5>
                <p className="text-[12px] text-[#D2E3DE]/70">
                  {language === 'ar' ? 'على الشاطئ مباشرة · على بعد ١٨٠م · ٥٠ ج.م / ساعة' : 'Directly on the beach front · 180m away · 50 EGP / hour'}
                </p>
              </div>
            </div>

            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              selectedStorage === 'locker'
                ? 'border-[#F4C36C] bg-[#F4C36C] text-[#081714]'
                : 'border-white/30'
            }`}>
              {selectedStorage === 'locker' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
          <button
            type="button"
            id="confirm-luggage-choice-btn"
            onClick={() => {
              const name = selectedStorage === 'hotel' 
                ? (language === 'ar' ? 'استقبال فندق خليج دهب' : 'Dahab Bay Hotel Concierge')
                : (language === 'ar' ? 'خزائن شاطئ اللايتهاوس' : 'Lighthouse Beach Locker Hub');
              onConfirmStorage(name);
              onClose();
            }}
            className="w-full py-3.5 px-5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 font-['Outfit',sans-serif]"
          >
            <Check className="w-4 h-4 text-[#081714] stroke-[2.5]" />
            <span>{language === 'ar' ? 'اختيار هذا المكان' : 'Choose this place'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

