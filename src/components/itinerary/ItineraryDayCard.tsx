import React from 'react';
import { 
  Clock, 
  MapPin, 
  Sparkles, 
  Waves, 
  Coffee, 
  Utensils, 
  Compass, 
  Car, 
  Hotel, 
  RefreshCw, 
  ChevronRight, 
  Sun, 
  Moon, 
  Tag, 
  Info,
  Calendar
} from 'lucide-react';
import { ActivityDetailData } from './ActivityDetailModal';
import { useLanguage } from '../../i18n/LanguageContext';

export type ActivityStatus = 'suggested' | 'free_time' | 'booked';

export interface ItineraryItem {
  id: string;
  time: string;
  name: string;
  description?: string;
  location?: string;
  category: string;
  status: ActivityStatus;
  isHighlight?: boolean;
  hasAlternatives?: boolean;
  alternativeCount?: number;
  alternativeName?: string;
  image?: string;
  details?: {
    fullDetails: string;
    included: string[];
    tips: string;
  };
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  theme: string;
  badge?: string;
  summary: string;
  items: ItineraryItem[];
}

interface ItineraryDayCardProps {
  day: DayItinerary;
  onOpenActivityDetails: (data: ActivityDetailData) => void;
  onOpenAlternatives: (activityTitle: string, currentId: string) => void;
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({
  day,
  onOpenActivityDetails,
  onOpenAlternatives,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const getCategoryIcon = (category: string, status: ActivityStatus) => {
    if (status === 'free_time') {
      return <Sun className="w-3.5 h-3.5 text-amber-400" />;
    }
    switch (category.toLowerCase()) {
      case 'diving':
      case 'water activities':
      case 'water & boat':
        return <Waves className="w-3.5 h-3.5 text-[#F4C36C]" />;
      case 'food':
      case 'dining':
        return <Utensils className="w-3.5 h-3.5 text-[#F4C36C]" />;
      case 'coffee':
      case 'cafe':
        return <Coffee className="w-3.5 h-3.5 text-[#F4C36C]" />;
      case 'adventure':
      case 'desert & safari':
      case 'safari':
        return <Compass className="w-3.5 h-3.5 text-[#F4C36C]" />;
      case 'transfer':
      case 'logistics':
        return <Car className="w-3.5 h-3.5 text-[#F4C36C]" />;
      case 'stay':
      case 'hotel':
        return <Hotel className="w-3.5 h-3.5 text-[#F4C36C]" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-[#F4C36C]" />;
    }
  };

  return (
    <div 
      id={`itinerary-day-${day.dayNumber}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#0E2520] rounded-3xl border border-white/10 shadow-xs overflow-hidden transition-all mb-8 text-[#F7F3EA]"
    >
      {/* Day Card Header */}
      <div className="p-6 sm:p-7 border-b border-white/10 bg-[#13312B]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4C36C] text-[#081714] flex flex-col items-center justify-center font-bold flex-shrink-0 shadow-xs">
            <span className="text-[11px] uppercase tracking-widest leading-none text-[#081714]/80 font-black">
              {isAr ? 'يوم' : 'DAY'}
            </span>
            <span className="text-base font-serif font-black leading-none mt-0.5">{day.dayNumber}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA] tracking-tight">
                {day.title}
              </h3>
              {day.badge && (
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4C36C]/15 text-[#F4C36C] border border-[#F4C36C]/25">
                  {day.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#D2E3DE]/70 mt-0.5 font-normal">
              {day.summary}
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-[#F4C36C] flex items-center gap-1.5 self-start sm:self-center bg-[#13312B] px-3 py-1.5 rounded-full border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-[#F4C36C]" />
          <span>{day.theme}</span>
        </div>
      </div>

      {/* Vertical Timeline Activity List */}
      <div className="p-6 sm:p-8">
        <div className={`relative ${isRTL ? 'pr-6 sm:pr-8' : 'pl-6 sm:pl-8'} space-y-6 before:content-[''] before:absolute ${isRTL ? 'before:right-2 sm:before:right-3' : 'before:left-2 sm:before:left-3'} before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10`}>
          {day.items.map((item, idx) => {
            const isFreeTime = item.status === 'free_time';

            return (
              <div 
                key={item.id || idx}
                id={`timeline-item-${day.dayNumber}-${idx}`}
                className="relative group"
              >
                {/* Timeline Dot Node */}
                <div 
                  className={`absolute ${isRTL ? '-right-6 sm:-right-8' : '-left-6 sm:-left-8'} top-1.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    item.isHighlight
                      ? 'bg-[#F4C36C] border-[#081714] ring-2 ring-[#F4C36C] shadow-2xs'
                      : isFreeTime
                      ? 'bg-amber-400 border-amber-600'
                      : 'bg-[#13312B] border-[#F4C36C]'
                  }`}
                >
                  {item.isHighlight && <span className="w-1.5 h-1.5 rounded-full bg-[#081714]" />}
                </div>

                {/* Activity Box Container */}
                <div 
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    item.isHighlight
                      ? 'bg-gradient-to-r from-[#F4C36C]/10 via-[#13312B] to-[#13312B] border-[#F4C36C]/30 shadow-2xs'
                      : isFreeTime
                      ? 'bg-amber-950/20 border-amber-500/20'
                      : 'bg-[#13312B]/70 hover:bg-[#13312B] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Time & Title Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Time Label */}
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-[#F7F3EA] bg-[#081714]/80 px-2.5 py-0.5 rounded-full border border-white/10 shadow-2xs">
                          <Clock className="w-3 h-3 text-[#F4C36C]" />
                          <span>{item.time}</span>
                        </div>

                        {/* Category Pill */}
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#D2E3DE]/70 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                          {getCategoryIcon(item.category, item.status)}
                          <span>{item.category}</span>
                        </span>

                        {/* Status Label: Suggested vs Free Time */}
                        <span 
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isFreeTime
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-white/5 text-[#D2E3DE]/60 border border-white/5'
                          }`}
                        >
                          {isFreeTime ? (isAr ? 'وقت حر ومسترخي' : 'Free Time') : (isAr ? 'مقترح' : 'Suggested')}
                        </span>

                        {/* Highlight Badge */}
                        {item.isHighlight && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4C36C] text-[#081714] shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5 text-[#081714]" />
                            <span>{isAr ? 'تجربة مميزة' : 'Highlight'}</span>
                          </span>
                        )}
                      </div>

                      {/* Activity Name */}
                      <h4 className="text-base sm:text-lg font-bold text-[#F7F3EA] tracking-tight mt-1">
                        {item.name}
                      </h4>

                      {/* Short Description */}
                      {item.description && (
                        <p className="text-xs sm:text-sm text-[#D2E3DE]/80 mt-1 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      )}

                      {/* Location reference if present */}
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs text-[#F4C36C] font-medium mt-2">
                          <MapPin className="w-3.5 h-3.5 text-[#F4C36C]" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Controls */}
                    <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 pt-1">
                      {/* View Details Action */}
                      {item.details && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenActivityDetails({
                              time: item.time,
                              dayNumber: day.dayNumber,
                              dayTitle: day.title,
                              name: item.name,
                              location: item.location || 'Dahab, South Sinai',
                              category: item.category,
                              description: item.description || '',
                              fullDetails: item.details?.fullDetails || '',
                              included: item.details?.included || [],
                              tips: item.details?.tips || '',
                              image: item.image,
                              isHighlight: item.isHighlight,
                            })
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#F7F3EA] hover:text-white bg-[#081714]/80 hover:bg-[#081714] border border-white/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                        >
                          <span>{isAr ? 'عرض التفاصيل' : 'View details'}</span>
                          <ChevronRight className={`w-3 h-3 text-[#F4C36C] ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      )}

                      {/* See Alternatives Option */}
                      {item.hasAlternatives && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenAlternatives(
                              item.name,
                              item.alternativeName || 'canyon-4x4'
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D2E3DE] hover:text-[#F7F3EA] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-2xs"
                        >
                          <RefreshCw className="w-3 h-3 text-[#F4C36C]" />
                          <span>{isAr ? `تصفح ${item.alternativeCount || 3} بدائل` : `See ${item.alternativeCount || 3} alternatives`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

