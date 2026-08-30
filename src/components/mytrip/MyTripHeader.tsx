import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Share2, 
  SlidersHorizontal, 
  Sparkles
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatTripDateRange } from '../../utils/tripDates';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface MyTripHeaderProps {
  onManageTrip: () => void;
  onShareTrip: () => void;
}

export const MyTripHeader: React.FC<MyTripHeaderProps> = ({
  onManageTrip,
  onShareTrip,
}) => {
  const { profile, tripBrief, user, activeTrip } = useTrip();
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const dateRange = formatTripDateRange(activeTrip?.startDate, activeTrip?.endDate, language === 'ar' ? 'ar' : 'en');

  const travelerDisplayName = profile.name || user?.displayName || (language === 'ar' ? 'مسافر دهب' : 'Traveler');
  const durationDays = tripBrief.durationDays || profile.lengthDays || 5;
  const travelersCount = tripBrief.travelersCount || profile.travelersCount || 2;

  return (
    <div className="space-y-6">
      {/* 1. WELCOME GREETING & PAGE TITLE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#20A89A] tracking-wide font-['Outfit',sans-serif]">
              {language === 'ar' 
                ? `مرحباً، ${travelerDisplayName} 👋 · مرحلة التجهيز للرحلة` 
                : `Marhaba, ${travelerDisplayName} 👋 · Pre-Trip Stage`}
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-['Outfit',sans-serif] tracking-tight ${
            isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
          }`}>
            {language === 'ar' ? 'رحلتك لدهب' : 'Your Dahab Trip'}
          </h1>

          <div className={`flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm pt-1 font-medium ${
            isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
          }`}>
            <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
              {language === 'ar' 
                ? `${durationDays} أيام · ${travelersCount} مسافرين` 
                : `${durationDays} Days · ${travelersCount} Travelers`}
            </span>
            {dateRange && (
              <>
                <span className="opacity-30">•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#20A89A]" />
                  <span>{dateRange}</span>
                </span>
              </>
            )}
            <span className="opacity-30">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#EA8E75]" />
              <span>{language === 'ar' ? 'دهب، جنوب سيناء' : 'Dahab, South Sinai'}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons: Manage Trip & Share */}
        <div className="flex items-center gap-2.5 flex-shrink-0 pt-1 md:pt-0">
          <button
            type="button"
            id="manage-trip-header-btn"
            onClick={onManageTrip}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border shadow-xs transition-all cursor-pointer font-['Outfit',sans-serif] ${
              isDark
                ? 'bg-[#0E2520] hover:bg-[#13312B] text-[#F7F3EA] border-white/10'
                : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/15'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>{language === 'ar' ? 'إدارة الرحلة' : 'Manage Trip'}</span>
          </button>

          <button
            type="button"
            id="share-trip-header-btn"
            onClick={onShareTrip}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border shadow-xs transition-all cursor-pointer font-['Outfit',sans-serif] ${
              isDark
                ? 'bg-[#0E2520] hover:bg-[#13312B] text-[#F7F3EA] border-white/10'
                : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/15'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>{language === 'ar' ? 'مشاركة الجدول' : 'Share Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* 2. BEAUTIFUL DAHAB VISUAL ANCHOR CARD */}
      <div 
        id="mytrip-visual-hero-anchor"
        className="relative rounded-3xl overflow-hidden shadow-lg border border-white/10 h-56 sm:h-72 lg:h-80 w-full group"
      >
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1400&auto=format&fit=crop"
          alt="Dahab coastal reef and golden mountain ridge"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700 ease-out"
        />
        
        {/* Soft Contrast Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-[#52C4B7] border border-white/15 text-xs font-bold backdrop-blur-md shadow-xs font-['Outfit',sans-serif]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#52C4B7]" />
            <span>{language === 'ar' ? 'برنامج معتمد ✓' : 'Confirmed Itinerary ✓'}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-[#F7F3EA] border border-white/15 text-[12px] font-mono backdrop-blur-md">
            <span>Trip Code: DHB-8942</span>
          </span>
        </div>

        {/* Bottom Hero Information & Anchor Details */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F4C36C] uppercase tracking-widest font-['Outfit',sans-serif]">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>Dahab Travel OS · In-Trip Hub</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F7F3EA] font-['Outfit',sans-serif] leading-tight">
            {language === 'ar' 
              ? `${durationDays} أيام من الغوص المرجاني وسكينة صحراء سيناء` 
              : `${durationDays} Days of Red Sea Diving & Sinai Desert Peace`}
          </h2>

          <p className="text-xs sm:text-sm text-[#D2E3DE]/90 max-w-xl line-clamp-1 font-medium">
            {language === 'ar'
              ? `كل تفاصيل رحلة ${travelerDisplayName}: الإقامة، سيارة المطار، رحلة الكانيون والغوص في جدول واحد منسق.`
              : `Coordinated travel details for ${travelerDisplayName}: Hotel, airport car, canyon safari & reef diving organized in one connected timeline.`}
          </p>
        </div>
      </div>
    </div>
  );
};
