import React, { useState } from 'react';
import { EXPLORE_CATEGORIES } from '../data/dahabContent';
import { ArrowUpRight, Waves, Mountain, Sun, Utensils, Heart } from 'lucide-react';

interface ExploreCategoriesProps {
  onPlanTripClick: () => void;
}

export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({ onPlanTripClick }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'diving':
        return <Waves className="w-4 h-4 text-cyan-300" />;
      case 'adventure':
        return <Mountain className="w-4 h-4 text-amber-300" />;
      case 'beach':
        return <Sun className="w-4 h-4 text-yellow-300" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-orange-300" />;
      case 'local-life':
        return <Heart className="w-4 h-4 text-rose-300" />;
      default:
        return null;
    }
  };

  return (
    <section id="explore-dahab" className="py-24 sm:py-32 bg-[#FDFBF7] border-t border-[#1A1A1A]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block mb-3">
            Dahab Discovery
          </span>
          <h2
            id="explore-dahab-headline"
            className="text-4xl sm:text-6xl font-serif text-[#1A1A1A] tracking-tight leading-[1.05]"
          >
            Find your kind of Dahab.
          </h2>
          <p
            id="explore-dahab-supporting-text"
            className="mt-5 text-lg sm:text-xl text-[#1A1A1A]/70 leading-relaxed max-w-2xl font-normal"
          >
            Adventure, diving, slow mornings, local food, and everything in between.
          </p>
        </div>

        {/* 5 Visual Categories Grid */}
        {/* Editorial layout: 2 prominent cards on top row, 3 cards on bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Top Row - 2 Large Editorial Feature Cards */}
          {EXPLORE_CATEGORIES.slice(0, 2).map((cat, idx) => (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              className="md:col-span-6 group relative rounded-3xl overflow-hidden bg-[#1A1A1A] min-h-[420px] sm:min-h-[480px] flex flex-col justify-end p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#1A1A1A]/10"
              onClick={onPlanTripClick}
            >
              {/* Background Photography */}
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
              />
              
              {/* Refined gradient overlay for text clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14282B] via-[#14282B]/60 to-transparent" />

              {/* Category Badge */}
              <div className="relative z-10 mb-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  {getCategoryIcon(cat.id)}
                  <span>Category {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 pt-6">
                <h3 className="text-2xl sm:text-4xl font-serif font-normal text-white tracking-tight mb-2">
                  {cat.title}
                </h3>
                <p className="text-base sm:text-lg font-medium text-amber-100/90 mb-3">
                  {cat.tagline}
                </p>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none mb-5 font-normal">
                  {cat.description}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/15">
                  {cat.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-[12px] font-bold text-white/90 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs tracking-wide"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Row - 3 Balanced Editorial Cards */}
          {EXPLORE_CATEGORIES.slice(2, 5).map((cat, idx) => (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-[#1A1A1A] min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#1A1A1A]/10"
              onClick={onPlanTripClick}
            >
              {/* Background Photography */}
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14282B] via-[#14282B]/60 to-transparent" />

              {/* Category Badge */}
              <div className="relative z-10 mb-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-wider">
                  {getCategoryIcon(cat.id)}
                  <span>{cat.title}</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 pt-4">
                <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight mb-1.5">
                  {cat.title}
                </h3>
                <p className="text-sm sm:text-base font-medium text-amber-100/90 mb-2">
                  {cat.tagline}
                </p>
                <p className="text-xs text-white/75 leading-relaxed line-clamp-2 mb-4 font-normal">
                  {cat.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1 pt-3 border-t border-white/15">
                  {cat.highlights.slice(0, 2).map((highlight) => (
                    <span
                      key={highlight}
                      className="text-[11px] font-bold text-white/90 bg-white/15 px-2.5 py-0.5 rounded-full tracking-wide"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
