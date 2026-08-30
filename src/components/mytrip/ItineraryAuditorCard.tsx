import React, { useState } from 'react';
import { 
  Bike, 
  Sparkles, 
  Clock, 
  Check, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Zap,
  DollarSign
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const ItineraryAuditorCard: React.FC = () => {
  const { addActivityToDay, showToast } = useTrip();
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddScooter = () => {
    addActivityToDay(2, {
      id: `scooter-rental-${Date.now()}`,
      time: '08:30 AM',
      title: language === 'ar' ? 'استلام سكوتر دهب (توفير تنقلات)' : 'Dahab Scooter Rental (Mobility Pass)',
      type: 'Activity',
      status: 'Added ✓',
      location: 'Lighthouse Seafront Rental Hub',
      notes: language === 'ar' ? 'يوفر ساعة و٤٠ دقيقة بين مواقع الغوص والغروب' : 'Saves 1h 40m between dive sites & sunset spots',
      duration: 'Full Day (24 hrs)',
      priceEGP: 350,
      meetingPoint: 'Lighthouse main strip',
      whatToBring: ['Driver license or ID', 'Helmet included', 'Deposit refunded on return'],
    });
    setIsAdded(true);
    showToast(
      language === 'ar' 
        ? 'تمت إضافة السكوتر لجدول اليوم الثاني بنجاح 🛵' 
        : 'Scooter rental added to Day 2 itinerary 🛵'
    );
  };

  return (
    <div
      id="itinerary-auditor-scooter-card"
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`rounded-3xl p-5 sm:p-6 border shadow-lg relative overflow-hidden space-y-4 ${
        isDark ? 'bg-[#0E2520] text-[#F7F3EA] border-white/10' : 'bg-white text-[#122420] border-[#122420]/10'
      }`}
    >
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#EA8E75]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-['Outfit',sans-serif] ${
            isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-amber-50 text-[#0E2520] border-amber-200'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-[#EA8E75]" />
            <span>
              {language === 'ar' ? 'اقتراح استباقي ذكي (وكيل السفر)' : 'Contextual Travel Insight (User Story #4)'}
            </span>
          </span>
        </div>

        <span className={`text-[12px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
          isDark ? 'text-[#52C4B7] bg-[#13312B] border-white/10' : 'text-[#0E2520] bg-[#20A89A]/10 border-[#20A89A]/20'
        }`}>
          {language === 'ar' ? 'وفر 1h 40m مشي' : 'Save 1h 40m transit'}
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className={`text-lg sm:text-xl font-bold font-['Outfit',sans-serif] flex items-center gap-2 ${
          isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
        }`}>
          <Bike className="w-5 h-5 text-[#EA8E75]" />
          <span>
            {language === 'ar' 
              ? 'عندك ٣ أنشطة متباعدة غداً — سكوتر هيوفر عليك وقت وفلوس' 
              : 'You have 3 distant spots tomorrow — a Scooter will save time'}
          </span>
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed ${
          isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'
        }`}>
          {language === 'ar'
            ? 'لاحظ النظام أن جدول الغد يضم (غطس الكانيون + غداء العصلة + غروب اللايتهاوس). استئجار سكوتر يمنحك حرية كاملة ويوفر أكثر من 300 جنيه بدلاً من طلب تاكسيات متكررة.'
            : 'The platform noticed tomorrow spans Canyon Diving, Assalah local lunch, and Lighthouse sunset. A local scooter gives you total mobility and saves repeated taxi calls.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className={`p-2.5 rounded-xl border space-y-0.5 ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`text-[11px] ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>{language === 'ar' ? 'سعر اليوم' : 'Daily Rate'}</span>
          <div className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>350 EGP</div>
        </div>
        <div className={`p-2.5 rounded-xl border space-y-0.5 ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`text-[11px] ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>{language === 'ar' ? 'الاستلام' : 'Pickup'}</span>
          <div className={`font-bold ${isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'}`}>Lighthouse Strip</div>
        </div>
        <div className={`col-span-2 sm:col-span-1 p-2.5 rounded-xl border space-y-0.5 ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`text-[11px] ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>{language === 'ar' ? 'الخوذة والتأمين' : 'Helmet & Lock'}</span>
          <div className="font-bold text-[#EA8E75]">{language === 'ar' ? 'شامل مجاناً' : 'Included free'}</div>
        </div>
      </div>

      <div className={`pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t ${
        isDark ? 'border-white/10' : 'border-[#122420]/10'
      }`}>
        <div className={`flex items-center gap-2 text-xs ${
          isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'
        }`}>
          <ShieldCheck className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
          <span>{language === 'ar' ? 'دفع عند الاستلام مع إمكانية الإلغاء المجاني' : 'Pay on pickup · Free cancellation'}</span>
        </div>

        {isAdded ? (
          <button
            type="button"
            disabled
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs border ${
              isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-emerald-50 text-[#0E2520] border-emerald-200'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{language === 'ar' ? 'تمت الإضافة للرحلة ✓' : 'Added to Itinerary ✓'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddScooter}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] font-extrabold text-xs transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Bike className="w-4 h-4 text-white" />
            <span>{language === 'ar' ? 'إضافة سكوتر لجدول الغد' : 'Add Scooter to Tomorrow'}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
