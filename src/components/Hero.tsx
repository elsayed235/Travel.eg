import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

interface HeroProps {
  onPlanTripClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlanTripClick, onExploreClick }) => {
  return (
    <section id="hero-section" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[#14282B]">
      {/* Background Image Container with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80"
          alt="Dahab coastal Sinai mountains meeting the pristine Red Sea"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Deep Slate Ocean Twilight Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14282B] via-[#14282B]/60 to-[#14282B]/80" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#14282B]/40 to-[#14282B]/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        
        {/* Subtle Destination Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[12px] font-bold uppercase tracking-[0.2em] mb-8 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>South Sinai · Gulf of Aqaba</span>
        </div>

        {/* Main Headline with Bold Typography & Serif Italic contrast */}
        <h1
          id="hero-main-headline"
          className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.95] text-balance max-w-4xl mx-auto"
        >
          Your Dahab trip,<br />
          <span className="font-serif italic font-normal text-amber-100/95">built around you.</span>
        </h1>

        {/* Supporting text */}
        <p
          id="hero-supporting-text"
          className="mt-7 text-base sm:text-xl text-white/70 font-normal leading-relaxed max-w-2xl mx-auto text-balance"
        >
          Tell us what you want from your trip, and we'll help you build an experience that fits your time, interests, and budget.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            id="hero-plan-my-trip-cta"
            onClick={onPlanTripClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold tracking-tight text-[#1A1A1A] bg-[#FDFBF7] hover:bg-white active:scale-[0.98] shadow-lg shadow-black/20 hover:shadow-xl transition-all cursor-pointer group"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4 text-[#1A1A1A] group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            id="hero-explore-dahab-cta"
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-sm sm:text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Explore Dahab</span>
          </button>
        </div>

        {/* Small supporting line */}
        <div className="mt-9 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/40 font-bold">
          Personalized planning · Local experiences · One place to start
        </div>

      </div>

      {/* Subtle bottom fade into the warm ivory background */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none" />
    </section>
  );
};
