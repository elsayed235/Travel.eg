import React, { useState } from 'react';
import type { ReadyTripProgram } from '../../data/readyTripsData';
import { useReadyProgrammes } from '../../hooks/useReadyProgrammes';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { analytics } from '../../services/analytics';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Star,
  Compass,
  Flame,
  Waves,
  Calendar,
  Users,
  ChevronRight
} from 'lucide-react';

interface ReadyMadeTripsCarouselProps {
  onPreviewProgram: (program: ReadyTripProgram) => void;
  onOpenCompare: () => void;
  onOpenQuiz: () => void;
}

export const ReadyMadeTripsCarousel: React.FC<ReadyMadeTripsCarouselProps> = ({
  onPreviewProgram,
  onOpenCompare,
  onOpenQuiz
}) => {
  const programmes = useReadyProgrammes();
  const { language, t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All 5 Programs', labelAr: 'جميع البرامج الـ ٥', icon: Layers },
    { id: 'popular', label: 'First Timers', labelAr: 'أول مرة في دهب', icon: Star },
    { id: 'adventure', label: 'Adventure & Safari', labelAr: 'مغامرة وسفاري', icon: Flame },
    { id: 'diving', label: 'Diving & Reefs', labelAr: 'غطس وشعاب', icon: Waves },
    { id: 'slow', label: 'Slow & Wellness', labelAr: 'روقان وهدوء', icon: Compass },
  ];

  const filteredPrograms = programmes.filter((prog) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'popular') return prog.id === 'dahab-first-timer' || prog.id === 'couples-escape';
    if (activeCategory === 'adventure') return prog.id === 'dahab-adventure';
    if (activeCategory === 'diving') return prog.id === 'diving-week';
    if (activeCategory === 'slow') return prog.id === 'slow-dahab';
    return true;
  });

  const handleSelect = (program: ReadyTripProgram) => {
    analytics.track('ready_trip_previewed', {
      templateId: program.id,
      durationDays: program.durationDays,
      budget: program.defaultBudget
    });
    onPreviewProgram(program);
  };

  return (
    <section
      id="ready-made-trips-subdeck"
      aria-label={t('home.readymadeTripProgrammes')}
      className={`mt-16 pt-12 border-t border-[var(--border-subtle)]`}
    >
      {/* Sub-header with Title and Smart Action Utilities */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className={`text-2xl sm:text-3xl chart-heading font-bold tracking-tight text-[var(--text-primary)]`}>
            {t('home.5HandcraftedDahabItineraries')}
          </h2>
          <p className={`text-sm mt-1 max-w-xl text-[var(--text-secondary)]`}>
            {t('home.engineeredWithOptimalDaily')}
          </p>
        </div>

        {/* Action utility pills */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Smart Matcher Button */}
          <button
            type="button"
            id="ready-trips-smart-match-btn"
            onClick={onOpenQuiz}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform] cursor-pointer shadow-sm active:scale-95 ${
              isDark
                ? 'bg-[var(--surface-container)] hover:bg-[var(--surface-container)] text-[var(--accent-secondary)] border-[var(--border-subtle)]'
                : 'bg-[var(--surface-card)] hover:bg-stone-100 text-[var(--text-primary)] border-[var(--text-primary)]/10 shadow-xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[var(--accent-secondary)]" />
            <span>{t('tripEntry.modeB.whichIsRight')}</span>
          </button>

          {/* Compare Button */}
          <button
            type="button"
            id="ready-trips-compare-btn"
            onClick={onOpenCompare}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform] cursor-pointer shadow-sm active:scale-95 ${
              isDark
                ? 'bg-[var(--surface-card)] hover:bg-[var(--surface-container)] text-[var(--text-primary)] border-[var(--border-subtle)]'
                : 'bg-[var(--surface-card)] hover:bg-stone-100 text-[var(--text-primary)] border-[var(--text-primary)]/10 shadow-xs'
            }`}
          >
            <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>{t('tripEntry.modeB.compareBtn')}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-[var(--surface-card)] shadow-sm'
                  : isDark
                  ? 'bg-[var(--surface-card)] hover:bg-[var(--surface-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  : 'bg-[var(--surface-card)] hover:bg-stone-100 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--text-primary)]/10 shadow-xs'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--surface-card)]' : 'text-[var(--accent-primary)]'}`} />
              <span>{language === 'ar' ? cat.labelAr : cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editorial Discovery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {filteredPrograms.map((program) => {
          const isFeatured = program.id === 'dahab-first-timer';
          return (
            <button
              key={program.id}
              type="button"
              id={`ready-trip-card-${program.id}`}
              onClick={() => handleSelect(program)}
              aria-label={`${t('home.viewProgram')}: ${language === 'ar' ? program.titleAr || program.title : program.title}`}
              className={`group w-full text-start rounded-3xl border transition-[border-color,box-shadow] duration-300 flex flex-col justify-between cursor-pointer overflow-hidden relative shadow-md hover:shadow-2xl ${
                isDark
                  ? isFeatured
                    ? 'bg-[var(--surface-card)] border-[var(--accent-secondary)]/60 ring-1 ring-[var(--accent-secondary)]/25'
                    : 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
                  : isFeatured
                  ? 'bg-[var(--surface-card)] border-[var(--accent-secondary)] ring-1 ring-[var(--accent-secondary)]/30'
                  : 'bg-[var(--surface-card)] border-[var(--text-primary)]/10 hover:border-[var(--text-primary)]/25'
              }`}
            >
              {/* Card Image Header */}
              <div className="relative h-48 bg-stone-900 overflow-hidden w-full">
                <img
                  src={program.heroImage}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 opacity-90"
                  referrerPolicy="no-referrer"
                />
                
                {/* Clean vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

                {/* Floating Top Category Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[11px] font-extrabold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-[var(--border-subtle)] shadow-sm">
                    {language === 'ar' ? program.badgeAr : program.badge}
                  </span>
                </div>

                {/* Overlay Duration & Title */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--accent-primary)] font-semibold mb-0.5">
                    <span>{program.durationDays} {t('home.days-3')}</span>
                    <span>•</span>
                    <span>{language === 'ar' ? program.paceAr : program.pace}</span>
                  </div>
                  <h3 className="text-base chart-heading font-bold text-white leading-tight line-clamp-1 group-hover:text-[var(--accent-secondary)] transition-colors">
                    {language === 'ar' ? program.titleAr : program.title}
                  </h3>
                </div>
              </div>

              {/* Card Body: Fit, Price, and Compact Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                {/* 1. Who is it for? */}
                <div>
                  <span className={`text-[10px] font-bold block mb-1 ${'text-[var(--text-secondary)]'}`}>
                    {t('home.idealFor')}
                  </span>
                  <p className={`text-xs font-medium line-clamp-2 leading-relaxed text-[var(--text-secondary)]`}>
                    {language === 'ar' ? program.idealForAr : program.idealFor}
                  </p>
                </div>

                {/* 2. Starting Price & Single Compact CTA */}
                <div className={`pt-3 border-t flex items-center justify-between border-[var(--border-subtle)]`}>
                  <div>
                    <span className={`text-[10px] block font-bold ${'text-[var(--text-secondary)]'}`}>
                      {t('readyTrip.startingFrom')}
                    </span>
                    <div                     className={`text-sm font-extrabold chart-heading tabular-nums text-[var(--accent-secondary)]`}>
                      {program.startingPriceEGP.toLocaleString()} <span className={`text-[11px] font-sans font-normal text-[var(--text-secondary)]`}>EGP</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-[background-color,color] shadow-xs ${
                      isDark
                        ? 'bg-[var(--surface-container)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--accent-primary-ink)] text-[var(--text-primary)]'
                        : 'bg-[var(--surface-container)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--accent-primary-ink)] text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{t('experiences.view')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
