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
  const isAr = language === 'ar';
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

      {/* ONE dominant featured trip + the rest as a compact rail — five equal
          cards all competing for attention was the exact "catalog, not
          curation" problem this section needed to stop having. */}
      {(() => {
        if (filteredPrograms.length === 0) return null;
        const featuredId = filteredPrograms.some(p => p.id === 'dahab-first-timer') ? 'dahab-first-timer' : filteredPrograms[0].id;
        const featured = filteredPrograms.find(p => p.id === featuredId)!;
        const secondary = filteredPrograms.filter(p => p.id !== featuredId);

        return (
          <div className="space-y-5">
            {/* Featured trip — hero card */}
            <button
              type="button"
              id={`ready-trip-card-${featured.id}`}
              onClick={() => handleSelect(featured)}
              aria-label={`${t('home.viewProgram')}: ${language === 'ar' ? featured.titleAr || featured.title : featured.title}`}
              className="group w-full text-start rounded-3xl overflow-hidden relative cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row md:h-96"
            >
              <div className="relative h-64 md:h-full md:w-3/5 bg-stone-900 overflow-hidden shrink-0">
                <img
                  src={featured.heroImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950/85 via-stone-950/10 to-transparent" />
                <span className="absolute top-4 start-4 text-[11px] font-extrabold bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20">
                  {isAr ? 'الرحلة المميزة' : 'Featured Trip'}
                </span>
              </div>

              <div className="relative flex-1 p-6 sm:p-8 flex flex-col justify-between bg-[var(--surface-card)] border border-t-0 md:border-t md:border-s-0 border-[var(--border-subtle)] rounded-b-3xl md:rounded-b-none md:rounded-e-3xl">
                <div>
                  <span className="text-[11px] font-extrabold text-[var(--accent-secondary)]">
                    {language === 'ar' ? featured.badgeAr : featured.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl chart-heading font-bold text-[var(--text-primary)] leading-tight mt-1.5 group-hover:text-[var(--accent-secondary)] transition-colors">
                    {language === 'ar' ? featured.titleAr : featured.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed line-clamp-2">
                    {language === 'ar' ? featured.taglineAr : featured.tagline}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-semibold mt-4">
                    <span>{featured.durationDays} {t('home.days-3')}</span>
                    <span>•</span>
                    <span>{language === 'ar' ? featured.paceAr : featured.pace}</span>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] block font-bold text-[var(--text-secondary)]">
                      {t('readyTrip.startingFrom')}
                    </span>
                    <div className="text-lg font-extrabold chart-heading tabular-nums text-[var(--accent-secondary)]">
                      {featured.startingPriceEGP.toLocaleString()} <span className="text-xs font-sans font-normal text-[var(--text-secondary)]">EGP</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] group-hover:brightness-110 transition-[filter] shadow-md">
                    <span>{isAr ? 'اكتشف الرحلة' : 'Discover the Trip'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                  </span>
                </div>
              </div>
            </button>

            {/* Secondary trips — compact rail */}
            {secondary.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {secondary.map((program) => (
                  <button
                    key={program.id}
                    type="button"
                    id={`ready-trip-card-${program.id}`}
                    onClick={() => handleSelect(program)}
                    aria-label={`${t('home.viewProgram')}: ${language === 'ar' ? program.titleAr || program.title : program.title}`}
                    className="group text-start rounded-2xl overflow-hidden cursor-pointer border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-[var(--accent-primary)]/40 transition-all duration-300 shadow-sm hover:shadow-lg aurora-hover"
                  >
                    <div className="relative h-32 w-full overflow-hidden bg-stone-900">
                      <img
                        src={program.heroImage}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 to-transparent" />
                      <div className="absolute bottom-2 start-3 end-3 text-white text-xs font-semibold">
                        {program.durationDays} {t('home.days-3')}
                      </div>
                    </div>
                    <div className="p-3.5">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug line-clamp-1">
                        {language === 'ar' ? program.titleAr : program.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-[var(--accent-secondary)] tabular-nums">
                          {program.startingPriceEGP.toLocaleString()} <span className="text-[10px] font-normal text-[var(--text-secondary)]">EGP</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-[color,transform] rtl:rotate-180" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </section>
  );
};
