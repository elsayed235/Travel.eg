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
      aria-label={language === 'ar' ? 'برامج رحلات جاهزة' : 'Ready-made trip programmes'}
      className={`mt-16 pt-12 border-t ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}
    >
      {/* Sub-header with Title and Smart Action Utilities */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#20A89A] animate-ping" />
            <span className={`text-[12px] font-extrabold uppercase tracking-widest ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
              {language === 'ar' ? 'رحلات كاملة ومختبرة ميدانياً' : 'Field-Tested Sinai Curations'}
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
            {language === 'ar' ? '٥ برامج متكاملة من خبراء دهب' : '5 Handcrafted Dahab Itineraries'}
          </h2>
          <p className={`text-sm mt-1 max-w-xl ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
            {language === 'ar'
              ? 'مصممة بإيقاع متوازن يجمع بين أشهر المعالم، أوقات الراحة المفتوحة، والمطاعم المعتمدة.'
              : 'Engineered with optimal daily pacing, unhurried seaside windows, and verified local partners.'}
          </p>
        </div>

        {/* Action utility pills */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Smart Matcher Button */}
          <button
            type="button"
            id="ready-trips-smart-match-btn"
            onClick={onOpenQuiz}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 ${
              isDark
                ? 'bg-[#13312B] hover:bg-[#173832] text-[#F4C36C] border-white/10'
                : 'bg-white hover:bg-stone-100 text-[#0E2520] border-[#122420]/10 shadow-xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F4C36C]" />
            <span>{t('tripEntry.modeB.whichIsRight')}</span>
          </button>

          {/* Compare Button */}
          <button
            type="button"
            id="ready-trips-compare-btn"
            onClick={onOpenCompare}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 ${
              isDark
                ? 'bg-[#0E2520] hover:bg-[#13312B] text-[#F7F3EA] border-white/10'
                : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/10 shadow-xs'
            }`}
          >
            <Layers className="w-4 h-4 text-[#20A89A]" />
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#20A89A] text-[#081714] shadow-sm'
                  : isDark
                  ? 'bg-[#0E2520] hover:bg-[#13312B] text-[#D2E3DE] hover:text-white border border-white/10'
                  : 'bg-white hover:bg-stone-100 text-[#4A635D] hover:text-[#122420] border border-[#122420]/10 shadow-xs'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#081714]' : 'text-[#20A89A]'}`} />
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
              aria-label={`${language === 'ar' ? 'عرض برنامج' : 'View program'}: ${language === 'ar' ? program.titleAr || program.title : program.title}`}
              className={`group w-full text-start rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden relative shadow-md hover:shadow-2xl hover:-translate-y-1.5 ${
                isDark
                  ? isFeatured
                    ? 'bg-[#0E2520] border-[#F4C36C]/60 ring-1 ring-[#F4C36C]/25'
                    : 'bg-[#0E2520] border-white/10 hover:border-white/25'
                  : isFeatured
                  ? 'bg-white border-[#F4C36C] ring-1 ring-[#F4C36C]/30'
                  : 'bg-white border-[#122420]/10 hover:border-[#122420]/25'
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
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#F7F3EA] px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
                    {language === 'ar' ? program.badgeAr : program.badge}
                  </span>
                </div>

                {/* Overlay Duration & Title */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-2 text-[11px] text-[#52C4B7] font-semibold mb-0.5">
                    <span>{program.durationDays} {language === 'ar' ? 'أيام' : 'Days'}</span>
                    <span>•</span>
                    <span>{language === 'ar' ? program.paceAr : program.pace}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#F7F3EA] leading-tight line-clamp-1 group-hover:text-[#F4C36C] transition-colors">
                    {language === 'ar' ? program.titleAr : program.title}
                  </h3>
                </div>
              </div>

              {/* Card Body: Fit, Price, and Compact Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                {/* 1. Who is it for? */}
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                    {language === 'ar' ? 'مناسب لمين:' : 'Ideal For:'}
                  </span>
                  <p className={`text-xs font-medium line-clamp-2 leading-relaxed ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                    {language === 'ar' ? program.idealForAr : program.idealFor}
                  </p>
                </div>

                {/* 2. Starting Price & Single Compact CTA */}
                <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
                  <div>
                    <span className={`text-[10px] uppercase tracking-wider block font-bold ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                      {t('readyTrip.startingFrom')}
                    </span>
                    <div className={`text-sm font-extrabold font-serif ${isDark ? 'text-[#F4C36C]' : 'text-[#0E2520]'}`}>
                      {program.startingPriceEGP.toLocaleString()} <span className={`text-[11px] font-sans font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>EGP</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isDark
                        ? 'bg-[#13312B] group-hover:bg-[#20A89A] group-hover:text-[#081714] text-[#F7F3EA]'
                        : 'bg-[#F2EFE9] group-hover:bg-[#20A89A] group-hover:text-[#081714] text-[#122420]'
                    }`}
                  >
                    <span>{language === 'ar' ? 'استكشف' : 'View'}</span>
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
