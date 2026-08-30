import React, { useState } from 'react';
import {
  Sparkles,
  Anchor,
  Clock,
  Compass,
  Zap,
  Coffee,
  ChevronDown,
  ChevronUp,
  MapPin,
  Plus
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { DayIntelligence } from '../../types/tripOs';

interface DayIntelligenceHeaderProps {
  dayNumber: number;
}

export const DayIntelligenceHeader: React.FC<DayIntelligenceHeaderProps> = ({ dayNumber }) => {
  const { language, isRTL } = useLanguage();
  const { dayIntelligence, addActivityToDay, showToast } = useTrip();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayData: DayIntelligence | undefined =
    dayIntelligence.find((d) => d.dayNumber === dayNumber) ||
    dayIntelligence[0];

  if (!dayData) return null;

  const getIntensityBadge = (score: number) => {
    if (score <= 2) {
      return {
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: language === 'ar' ? 'هادئ وخفيف' : 'Relaxed Pace',
      };
    }
    if (score <= 4) {
      return {
        bg: 'bg-[#F4C36C]/20 text-[#F4C36C] border-[#F4C36C]/30',
        dot: 'bg-[#F4C36C]',
        label: language === 'ar' ? 'متوازن ومريح' : 'Balanced Energy',
      };
    }
    return {
      bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      dot: 'bg-orange-400',
      label: language === 'ar' ? 'نشيط ومغامرة' : 'Active Energy',
    };
  };

  const intensityMeta = getIntensityBadge(dayData.intensity.score);

  return (
    <div
      id={`day-${dayNumber}-intelligence-banner`}
      className="w-full bg-[#0E2520] text-[#F7F3EA] rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg space-y-4 mb-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top Banner: Anchor & Supporting Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#13312B] text-[#F4C36C] border border-white/10 font-['Outfit',sans-serif]">
              {language === 'ar' ? `اليوم ${dayNumber} · المحطة الرئيسية` : `Day ${dayNumber} Anchor`}
            </span>

            <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${intensityMeta.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${intensityMeta.dot}`} />
              <span>{intensityMeta.label} ({dayData.intensity.score}/10)</span>
            </span>

            <span className="text-[12px] font-bold text-[#D2E3DE] bg-[#13312B] px-2.5 py-0.5 rounded-full border border-white/10">
              {language === 'ar' ? dayData.freeTimeFormattedAr : dayData.freeTimeFormatted}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-[#F7F3EA] font-['Outfit',sans-serif]">
            {language === 'ar' ? dayData.themeAr : dayData.theme}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[#D2E3DE]/70">
            <div className="flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-[#F4C36C] shrink-0" />
              <span className="font-bold text-[#F7F3EA]">
                {language === 'ar' ? 'النشاط الأساسي:' : 'Main Anchor:'}
              </span>
              <span>{language === 'ar' ? dayData.mainAnchorAr : dayData.mainAnchor}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F4C36C] shrink-0" />
              <span className="font-bold text-[#F7F3EA]">
                {language === 'ar' ? 'النشاط الداعم:' : 'Supporting:'}
              </span>
              <span>{language === 'ar' ? dayData.supportingActivityAr : dayData.supportingActivity}</span>
            </div>
          </div>
        </div>

        {/* Free Time Suggestion Toggle */}
        {dayData.freeTimeSuggestions && dayData.freeTimeSuggestions.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="px-3.5 py-2 rounded-2xl bg-[#13312B] hover:bg-[#13312B]/80 text-[#F7F3EA] font-bold text-xs border border-white/10 cursor-pointer transition-all flex items-center gap-1.5 self-start md:self-center shrink-0 shadow-2xs"
          >
            <Coffee className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>
              {language === 'ar'
                ? `اقتراحات الوقت الحر (${dayData.freeTimeSuggestions.length})`
                : `Free Time Ideas (${dayData.freeTimeSuggestions.length})`}
            </span>
            {showSuggestions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Expandable Free Time Suggestions Shelf */}
      {showSuggestions && dayData.freeTimeSuggestions && (
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="text-[12px] font-black uppercase tracking-wider text-[#D2E3DE]/60 font-['Outfit',sans-serif]">
            {language === 'ar' ? 'أماكن وتجارب مقترحة لأوقات فراغك اليوم:' : 'Handpicked Ideas to Fill Your Free Time Today:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {dayData.freeTimeSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-3 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#F7F3EA]">
                    {language === 'ar' ? sug.titleAr : sug.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#D2E3DE]/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D2E3DE]/40" />
                      <span>{sug.location}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D2E3DE]/40" />
                      <span>{sug.duration}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addActivityToDay(dayNumber, {
                      id: `sug-act-${Date.now()}`,
                      time: '04:30 PM',
                      title: language === 'ar' ? sug.titleAr : sug.title,
                      type: 'Activity',
                      status: 'Added ✓',
                      location: sug.location,
                      duration: sug.duration,
                      priceEGP: sug.priceEGP,
                      notes: 'Added from Trip OS free time suggestions.',
                    });
                    showToast(
                      language === 'ar'
                        ? `تمت إضافة "${sug.titleAr}" لجدول اليوم ${dayNumber}!`
                        : `Added "${sug.title}" to Day ${dayNumber} Itinerary!`
                    );
                  }}
                  className="p-2 rounded-xl bg-[#081714] hover:bg-[#F4C36C] hover:text-[#081714] text-[#F7F3EA] font-bold text-xs transition-colors cursor-pointer shrink-0 border border-white/10"
                  title="Add to Itinerary"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
