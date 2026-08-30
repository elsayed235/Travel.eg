import React, { useState } from 'react';
import { TRIP_PREVIEW_DAYS, AHMED_PROFILE } from '../data/dahabContent';
import { Calendar, Clock, MapPin, CheckCircle2, ChevronRight, Sparkles, Navigation, Layers } from 'lucide-react';

interface TripPreviewSectionProps {
  onPlanTripClick: () => void;
}

export const TripPreviewSection: React.FC<TripPreviewSectionProps> = ({ onPlanTripClick }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const activeDay = TRIP_PREVIEW_DAYS[selectedDayIndex];

  return (
    <section id="trip-preview-section" className="py-24 sm:py-32 bg-[#FDFBF7] border-t border-[#1A1A1A]/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block mb-3">
            Product Experience
          </span>
          <h2
            id="trip-preview-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight"
          >
            See your trip before you go.
          </h2>
          <p
            id="trip-preview-supporting-text"
            className="mt-4 text-base sm:text-lg text-[#1A1A1A]/70 leading-relaxed font-normal"
          >
            Your stay, activities, and plans organized in one simple view.
          </p>
        </div>

        {/* Realistic Product Interface Mockup Card */}
        <div
          id="trip-preview-product-container"
          className="max-w-5xl mx-auto bg-white border border-[#1A1A1A]/8 rounded-3xl shadow-md overflow-hidden transition-all duration-300"
        >
          {/* Mock Product Top Bar */}
          <div className="bg-[#FDFBF7] border-b border-[#1A1A1A]/5 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-sm">
                D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                    Dahab · 5 Days
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#5A5A40]/10 text-[#5A5A40]">
                    Balanced Pace
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/60">
                  Curated for Ahmed & Companion · Diving, Adventure & Local Flavors
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#1A1A1A]/8 text-xs font-bold text-[#1A1A1A]">
                <Layers className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>5 Days · 8 Experiences</span>
              </div>
            </div>
          </div>

          {/* Interactive Day Selector Tabs */}
          <div className="bg-white border-b border-[#1A1A1A]/5 px-4 sm:px-8 overflow-x-auto scrollbar-none">
            <div className="flex space-x-2 sm:space-x-3 py-3 min-w-max">
              {TRIP_PREVIEW_DAYS.map((dayItem, index) => {
                const isActive = selectedDayIndex === index;
                return (
                  <button
                    key={dayItem.day}
                    onClick={() => setSelectedDayIndex(index)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#5A5A40] text-white shadow-xs'
                        : 'bg-[#FDFBF7] text-[#1A1A1A]/70 hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <span>Day {dayItem.day}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/60'
                    }`}>
                      {dayItem.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Day Content Preview Area */}
          <div className="p-6 sm:p-10">
            
            {/* Active Day Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#1A1A1A]/5 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#5A5A40]/10 px-3 py-0.5 rounded-full border border-[#5A5A40]/20">
                    Day 0{activeDay.day} Focus
                  </span>
                  <span className="text-xs text-[#1A1A1A]/60 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-[#5A5A40]" />
                    {activeDay.timeEstimate}
                  </span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] tracking-tight">
                  {activeDay.title}
                </h4>
              </div>

              <div className="text-xs sm:text-sm text-[#1A1A1A]/70 bg-[#FDFBF7] px-4 py-2.5 rounded-xl border border-[#1A1A1A]/5 max-w-sm font-normal">
                {activeDay.subtitle}
              </div>
            </div>

            {/* Itinerary Timeline Cards for this Day */}
            <div className="space-y-4 mb-8">
              {activeDay.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/5 hover:border-[#5A5A40]/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-[#1A1A1A]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#1A1A1A] shadow-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1A1A1A]">
                      {highlight}
                    </div>
                    <div className="text-xs text-[#1A1A1A]/55 mt-0.5 flex items-center gap-2 font-normal">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A5A40]" />
                      <span>Verified local spot · Dahab vetted host</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center text-xs font-medium text-[#5A5A40]">
                    <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick 5-Day Overview Matrix */}
            <div className="bg-[#FDFBF7] rounded-2xl p-5 sm:p-6 border border-[#1A1A1A]/5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4">
                Full 5-Day Itinerary Snapshot
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {TRIP_PREVIEW_DAYS.map((dayItem, i) => (
                  <div
                    key={dayItem.day}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedDayIndex === i
                        ? 'bg-white border-[#5A5A40] shadow-sm ring-1 ring-[#5A5A40]'
                        : 'bg-white/70 border-[#1A1A1A]/5 hover:bg-white'
                    }`}
                  >
                    <div className="text-[12px] font-bold uppercase tracking-wider text-[#5A5A40] mb-1">
                      Day {dayItem.day}
                    </div>
                    <div className="text-xs font-bold text-[#1A1A1A] line-clamp-2">
                      {dayItem.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Product Interface Footer Callout */}
          <div className="bg-[#FDFBF7] border-t border-[#1A1A1A]/5 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#1A1A1A]/60 text-center sm:text-left font-medium">
              Real itineraries update seamlessly with travel dates, local weather conditions, and seasonal dive tides.
            </span>
            <button
              id="trip-preview-plan-cta"
              onClick={onPlanTripClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5A5A40] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              <span>Build your personalized preview</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
