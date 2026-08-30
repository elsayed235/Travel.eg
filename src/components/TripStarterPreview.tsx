import React, { useState } from 'react';
import { Calendar, Users, DollarSign, Sparkles, ArrowRight, Check } from 'lucide-react';

interface TripStarterPreviewProps {
  onStartPlanning: () => void;
}

export const TripStarterPreview: React.FC<TripStarterPreviewProps> = ({ onStartPlanning }) => {
  // Visual interactive states modeled after Ahmed's 5-day adventure with a friend
  const [selectedDays, setSelectedDays] = useState<number>(5);
  const [selectedTravelers, setSelectedTravelers] = useState<number>(2);
  const [selectedBudget, setSelectedBudget] = useState<'Moderate' | 'Budget' | 'Premium'>('Moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Diving', 'Adventure', 'Food']);

  const allInterests = ['Diving', 'Adventure', 'Food', 'Beach', 'Local Life'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <section id="trip-starter-preview" className="py-20 sm:py-28 bg-[#FDFBF7] relative border-b border-[#1A1A1A]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            id="trip-starter-badge"
            className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-3 block"
          >
            Trip Starter Preview
          </h2>
          <h3
            id="trip-starter-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-tight"
          >
            What kind of Dahab trip are you looking for?
          </h3>
          <p
            id="trip-starter-supporting-text"
            className="mt-4 text-base sm:text-lg text-[#1A1A1A]/70 leading-relaxed font-normal"
          >
            Answer a few simple questions and start building a trip around you.
          </p>
        </div>

        {/* Visual Preview Card */}
        <div
          id="trip-starter-card"
          className="bg-white border border-[#1A1A1A]/8 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-md"
        >
          {/* Card Context Tag */}
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/5 pb-5 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5A5A40] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]">
                Interactive Trip Preview
              </span>
            </div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 bg-[#FDFBF7] px-3.5 py-1 rounded-full border border-[#1A1A1A]/8">
              Ahmed’s Trip Model
            </span>
          </div>

          {/* Grid of Trip Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* 1. Trip Length */}
            <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#1A1A1A]/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] uppercase opacity-50 font-bold tracking-widest mb-2 text-[#1A1A1A]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Trip length
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-[#1A1A1A]">
                  {selectedDays} Days
                </div>
                <div className="flex gap-1.5 mt-3">
                  {[3, 5, 7].map((days) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDays(days)}
                      className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        selectedDays === days
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Travelers */}
            <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#1A1A1A]/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] uppercase opacity-50 font-bold tracking-widest mb-2 text-[#1A1A1A]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Travelers
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-[#1A1A1A]">
                  {selectedTravelers} People
                </div>
                <div className="flex gap-1.5 mt-3">
                  {[1, 2, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedTravelers(num)}
                      className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        selectedTravelers === num
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {num === 1 ? 'Solo' : num === 2 ? '2' : '4+'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Budget */}
            <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#1A1A1A]/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] uppercase opacity-50 font-bold tracking-widest mb-2 text-[#1A1A1A]">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Budget
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-[#1A1A1A]">
                  {selectedBudget}
                </div>
                <div className="flex gap-1.5 mt-3">
                  {(['Budget', 'Moderate', 'Premium'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBudget(b)}
                      className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        selectedBudget === b
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {b === 'Moderate' ? 'Mod' : b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Interests */}
            <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#1A1A1A]/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] uppercase opacity-50 font-bold tracking-widest mb-2 text-[#1A1A1A]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Interests
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#1A1A1A] line-clamp-1">
                  {selectedInterests.join(' · ')}
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {allInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#5A5A40] text-white'
                            : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:bg-[#F4EFEA]'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-[#1A1A1A]/5">
            <div className="text-xs sm:text-sm text-[#1A1A1A]/60 text-center sm:text-left font-medium">
              Tailored for <span className="font-bold text-[#1A1A1A]">{selectedDays} days</span> with a <span className="font-bold text-[#1A1A1A]">{selectedBudget.toLowerCase()}</span> pace
            </div>

            <button
              id="trip-starter-start-planning-btn"
              onClick={onStartPlanning}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl sm:rounded-full font-bold text-sm text-white bg-[#1A1A1A] hover:bg-[#2E2E2E] active:scale-[0.98] shadow-md shadow-black/10 transition-all cursor-pointer group"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
