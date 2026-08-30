import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface WhatsNextCardProps {
  onViewPreparation: () => void;
}

export const WhatsNextCard: React.FC<WhatsNextCardProps> = ({
  onViewPreparation,
}) => {
  const { profile, user } = useTrip();
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const travelerName = profile.name || user?.displayName || (language === 'ar' ? 'المسافر ومرافقيه' : 'you and your companion');

  return (
    <div
      id="whats-next-section-card"
      className={`rounded-3xl p-6 sm:p-7 border shadow-lg relative overflow-hidden space-y-4 font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      {/* Soft Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#F4C36C]/5 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-['Outfit',sans-serif] ${
            isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-[#20A89A]/10 text-[#0E2520] border-[#20A89A]/20'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-[#EA8E75]" />
            <span>{language === 'ar' ? 'ملخص ما قبل الوصول جاهز' : 'Pre-Arrival Briefing Ready'}</span>
          </span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
          isDark ? 'text-[#F4C36C] bg-[#13312B] border-white/10' : 'text-[#0E2520] bg-stone-100 border-[#122420]/10'
        }`}>
          <Clock className="w-3.5 h-3.5 text-[#20A89A]" />
          <span>{language === 'ar' ? 'تبدأ غداً' : 'Starts tomorrow'}</span>
        </span>
      </div>

      {/* Main Focus Content */}
      <div className="space-y-1.5 pt-1">
        <h3 className={`text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif] tracking-tight ${
          isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
        }`}>
          {language === 'ar' ? 'غداً في دهب 🌊' : 'Tomorrow in Dahab 🌊'}
        </h3>
        <p className="text-sm font-bold text-[#20A89A]">
          {language === 'ar' ? 'دليل وتعليمات ما قبل السفر أصبحت نشطة' : 'Your pre-arrival travel briefing is now active'}
        </p>
        <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl pt-1 ${
          isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
        }`}>
          {language === 'ar'
            ? `كل تفاصيل وتجهيزات الرحلة منظمة لـ ${travelerName}. راجع تفاصيل مقابلة سائق المطار، تسجيل الوصول للفندق، وجدول الغوص وحقيبة السفر.`
            : `Everything is organized for ${travelerName}. Review your airport driver instructions, hotel check-in details, diving schedule, and packing essentials.`}
        </p>
      </div>

      {/* Action CTA & Quick Info */}
      <div className={`pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t ${
        isDark ? 'border-white/10' : 'border-[#122420]/10'
      }`}>
        <div className={`flex items-center gap-2 text-xs ${
          isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
        }`}>
          <ShieldCheck className="w-4 h-4 text-[#20A89A] flex-shrink-0" />
          <span>{language === 'ar' ? 'متابعة الرحلة نشطة · السائق معتمد' : 'Flight MS 304 tracked · Driver assigned'}</span>
        </div>

        <button
          type="button"
          id="view-trip-prep-btn"
          onClick={onViewPreparation}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] font-extrabold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95"
        >
          <span>{language === 'ar' ? 'افتح دليل ما قبل الوصول' : 'Open Pre-Arrival Briefing'}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
