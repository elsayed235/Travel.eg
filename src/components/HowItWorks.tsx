import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/dahabContent';
import { SlidersHorizontal, Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onPlanTripClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onPlanTripClick }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <SlidersHorizontal className="w-5 h-5 text-[#1C1917]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#1C1917]" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-[#1C1917]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#1C1917]" />;
    }
  };

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#FDFBF7] border-t border-[#1A1A1A]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block mb-3">
            Simple Process
          </span>
          <h2
            id="how-it-works-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight"
          >
            Planning Dahab should be easy.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#1A1A1A]/70 leading-relaxed font-normal">
            No endless tabs or guesswork. A straightforward way to turn your ideas into a real Dahab itinerary.
          </p>
        </div>

        {/* 3 Step Cards - Horizontal on desktop, Stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          
          {/* Subtle connecting line across desktop steps */}
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#1A1A1A]/10 to-transparent z-0" />

          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.number}
              id={`how-it-works-step-${step.number}`}
              className="relative z-10 bg-white border border-[#1A1A1A]/8 rounded-3xl p-8 sm:p-10 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step Number & Icon Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#1A1A1A]/8 flex items-center justify-center text-[#5A5A40]">
                    {getStepIcon(step.iconName)}
                  </div>
                  <span className="text-3xl sm:text-4xl font-serif italic text-[#5A5A40]/30 font-normal">
                    0{step.number}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] tracking-tight mb-3">
                  {step.title}
                </h3>

                {/* Step Primary Description */}
                <p className="text-sm sm:text-base font-medium text-[#1A1A1A]/80 leading-relaxed mb-3">
                  {step.description}
                </p>

                {/* Subtext */}
                {step.subtext && (
                  <p className="text-xs sm:text-sm text-[#1A1A1A]/55 leading-relaxed font-normal">
                    {step.subtext}
                  </p>
                )}
              </div>

              {/* Step indicator badge at bottom */}
              <div className="mt-8 pt-4 border-t border-[#1A1A1A]/5 flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-[#5A5A40]">
                <span>Phase 0{idx + 1}</span>
                <span className="opacity-40">/ 03</span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
