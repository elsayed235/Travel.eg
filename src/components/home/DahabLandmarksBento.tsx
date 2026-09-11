import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Waves,
  Mountain,
  Signal,
  WifiOff,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import type { Landmark, ResearchOverview } from '../../hooks/useResearchOverview';
import { pick } from '../../hooks/useResearchOverview';
import type { CmsHomepageSection } from '../../services/api';

interface DahabLandmarksBentoProps {
  overview?: ResearchOverview | null;
  onExploreLandmark?: (landmark: Landmark) => void;
  cmsSection?: CmsHomepageSection | null;
}

const LANDMARK_PHOTOS: Record<string, string> = {
  'landmark-blue-hole': '/images/attractions/blue-hole.jpg',
  'landmark-abu-galum': '/images/attractions/ras-abu-galum-spit.jpg',
  'landmark-canyon': '/images/attractions/underwater-elephant.jpg',
  'landmark-three-pools': '/images/attractions/three-pools.jpg',
  'landmark-st-catherine': '/images/attractions/sinai-desert-safari.jpg',
};

const LANDMARK_TAGS: Record<string, { en: string; ar: string }> = {
  'landmark-blue-hole': { en: 'Top Marine Wonder', ar: 'أشهر أعجوبة بحرية' },
  'landmark-abu-galum': { en: 'Protected Wilderness', ar: 'برية ساحلية محمية' },
  'landmark-canyon': { en: 'Underwater Cathedral', ar: 'كاتدرائية تحت الماء' },
  'landmark-three-pools': { en: 'Coral Lagoons', ar: 'بحيرات مرجانية هادئة' },
  'landmark-st-catherine': { en: 'UNESCO World Heritage', ar: 'تراث عالمي لليونسكو' },
};

export const DahabLandmarksBento: React.FC<DahabLandmarksBentoProps> = ({
  overview,
  onExploreLandmark,
  cmsSection
}) => {
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const isAr = language === 'ar';

  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);

  // CMS visibility flag: hide this bento from the dashboard (Homepage tab).
  if (cmsSection && cmsSection.visible === 0) return null;

  if (!overview || !overview.landmarks || overview.landmarks.length === 0) {
    return null;
  }

  const landmarks = overview.landmarks;
  const blueHole = landmarks.find((l) => l.id === 'landmark-blue-hole') || landmarks[0];
  const abuGalum = landmarks.find((l) => l.id === 'landmark-abu-galum');
  const canyon = landmarks.find((l) => l.id === 'landmark-canyon');
  const threePools = landmarks.find((l) => l.id === 'landmark-three-pools');
  const stCatherine = landmarks.find((l) => l.id === 'landmark-st-catherine');

  const handleTileClick = (landmark: Landmark) => {
    if (onExploreLandmark) {
      onExploreLandmark(landmark);
    } else {
      setSelectedLandmark(landmark);
    }
  };

  return (
    <section
      id="sinai-landmarks-bento"
      aria-label={isAr ? 'عجائب ومعالم سيناء الطبيعية' : 'Sinai Natural Landmarks Bento'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      {/* 2026 Bento Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-[11px] font-extrabold text-[var(--accent-primary)] chart-heading">
              {isAr ? 'أطلس سيناء الجغرافي · 2026' : 'Sinai Geographic Atlas · 2026'}
            </span>
          </div>
          <h2 className="chart-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {isAr ? 'عجائب دهب ومعالم سيناء الخالدة' : 'Iconic Sinai Landmarks'}
            <span className="chart-heading-accent"> {isAr ? 'في شبكة ذكية' : '· Bento Atlas'}</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-2xl leading-relaxed">
            {isAr
              ? 'دليل استكشافي ذكي لأهم المحميات الطبيعية والصدوع البحرية والمعالم التاريخية مع حقائق الوصول وشبكات الاتصال.'
              : 'A modern, high-density bento atlas of Dahab’s protected marine sanctuaries, geological rifts, and wilderness expeditions.'}
          </p>
        </div>

        {/* Live Protection Chip */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <div className="chart-glass px-4 py-2 rounded-2xl border border-[var(--border-subtle)] flex items-center gap-2 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {isAr ? 'محميات طبيعية معتمدة' : 'Verified Sanctuaries'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2026 Bento Grid Layout                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[230px] sm:auto-rows-[250px]">
        {/* --------------------------------------------------------------------- */}
        {/* TILE 1 (Hero 2x2 Bento): The Blue Hole                                */}
        {/* --------------------------------------------------------------------- */}
        {blueHole && (
          <div
            onClick={() => handleTileClick(blueHole)}
            className="group relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-500 cursor-pointer flex flex-col justify-between p-6 sm:p-8 aurora-hover"
          >
            <img
              src={LANDMARK_PHOTOS[blueHole.id] || '/images/attractions/blue-hole.jpg'}
              alt={pick(blueHole.name, language)}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25" />

            {/* Top badges */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold bg-teal-500/30 text-teal-200 border border-teal-400/40 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                  {isAr ? LANDMARK_TAGS[blueHole.id]?.ar : LANDMARK_TAGS[blueHole.id]?.en}
                </span>
                <span className="text-[11px] font-bold text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                  {pick(blueHole.tier, language)}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom info */}
            <div className="relative z-10 space-y-3">
              <div>
                <h3 className="text-2xl sm:text-3xl chart-heading font-bold text-white group-hover:text-teal-300 transition-colors">
                  {pick(blueHole.name, language)}
                </h3>
                <p className="text-xs sm:text-sm text-white/85 mt-1.5 line-clamp-2 leading-relaxed max-w-xl">
                  {pick(blueHole.fact, language)}
                </p>
              </div>

              {/* Status footer inside tile */}
              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-white/90">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-300" />
                    {pick(blueHole.access, language)}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-white/75">
                    <Signal className="w-3.5 h-3.5 text-amber-300" />
                    {pick(blueHole.connectivity, language)}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-teal-300 group-hover:underline flex items-center gap-1">
                  {isAr ? 'عرض التفاصيل' : 'Explore Landmark'}
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* TILE 2 (Wide 2x1 Bento): Ras Abu Galum Reserve                        */}
        {/* --------------------------------------------------------------------- */}
        {abuGalum && (
          <div
            onClick={() => handleTileClick(abuGalum)}
            className="group relative md:col-span-2 md:row-span-1 rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-500 cursor-pointer flex flex-col justify-between p-6"
          >
            <img
              src={LANDMARK_PHOTOS[abuGalum.id] || '/images/attractions/ras-abu-galum-spit.jpg'}
              alt={pick(abuGalum.name, language)}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold bg-amber-500/30 text-amber-200 border border-amber-400/40 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                {isAr ? LANDMARK_TAGS[abuGalum.id]?.ar : LANDMARK_TAGS[abuGalum.id]?.en}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl chart-heading font-bold text-white group-hover:text-amber-300 transition-colors">
                {pick(abuGalum.name, language)}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/90">
                <span className="flex items-center gap-1.5 font-medium">
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  {pick(abuGalum.access, language)}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-400/30">
                  <WifiOff className="w-3 h-3" />
                  {pick(abuGalum.connectivity, language)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* TILE 3 (1x1 Bento): The Canyon                                        */}
        {/* --------------------------------------------------------------------- */}
        {canyon && (
          <div
            onClick={() => handleTileClick(canyon)}
            className="group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-500 cursor-pointer flex flex-col justify-between p-5"
          >
            <img
              src={LANDMARK_PHOTOS[canyon.id] || '/images/attractions/underwater-elephant.jpg'}
              alt={pick(canyon.name, language)}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold bg-sky-500/30 text-sky-200 border border-sky-400/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                {isAr ? '٣٠–٥٢م عمق' : '30–52m Depth'}
              </span>
              <Waves className="w-4 h-4 text-sky-300" />
            </div>

            <div className="relative z-10">
              <h3 className="text-lg chart-heading font-bold text-white group-hover:text-sky-300 transition-colors">
                {pick(canyon.name, language)}
              </h3>
              <p className="text-[11px] text-white/80 mt-1 line-clamp-1">
                {pick(canyon.access, language)}
              </p>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* TILE 4 (1x1 Bento): Three Pools                                       */}
        {/* --------------------------------------------------------------------- */}
        {threePools && (
          <div
            onClick={() => handleTileClick(threePools)}
            className="group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-500 cursor-pointer flex flex-col justify-between p-5"
          >
            <img
              src={LANDMARK_PHOTOS[threePools.id] || '/images/attractions/three-pools.jpg'}
              alt={pick(threePools.name, language)}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                {isAr ? 'جنوب دهب' : 'South Dahab'}
              </span>
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>

            <div className="relative z-10">
              <h3 className="text-lg chart-heading font-bold text-white group-hover:text-emerald-300 transition-colors">
                {pick(threePools.name, language)}
              </h3>
              <p className="text-[11px] text-white/80 mt-1 line-clamp-1">
                {pick(threePools.fact, language)}
              </p>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* TILE 5 (Wide Panorama Bento): St. Catherine's Monastery               */}
        {/* --------------------------------------------------------------------- */}
        {stCatherine && (
          <div
            onClick={() => handleTileClick(stCatherine)}
            className="group relative md:col-span-3 lg:col-span-4 md:row-span-1 rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-500 cursor-pointer flex flex-col justify-between p-6"
          >
            <img
              src={LANDMARK_PHOTOS[stCatherine.id] || '/images/attractions/sinai-desert-safari.jpg'}
              alt={pick(stCatherine.name, language)}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/95 via-black/60 to-black/30" />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/40 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                  {isAr ? LANDMARK_TAGS[stCatherine.id]?.ar : LANDMARK_TAGS[stCatherine.id]?.en}
                </span>
                <span className="hidden sm:inline-block text-xs text-white/80 font-medium">
                  {pick(stCatherine.tier, language)}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h3 className="text-xl sm:text-2xl chart-heading font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">
                  {pick(stCatherine.name, language)}
                </h3>
                <p className="text-xs sm:text-sm text-white/85 mt-1 leading-relaxed line-clamp-2">
                  {pick(stCatherine.fact, language)}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/90 shrink-0">
                <span className="flex items-center gap-1.5 font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Mountain className="w-3.5 h-3.5 text-purple-300" />
                  {pick(stCatherine.access, language)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2026 Interactive Landmark Detail Modal                                    */}
      {/* ========================================================================= */}
      {selectedLandmark && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedLandmark(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] shadow-2xl transition-[background-color,border-color,color,box-shadow,transform,opacity]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-56 w-full overflow-hidden bg-stone-900">
              <img
                src={LANDMARK_PHOTOS[selectedLandmark.id] || '/images/attractions/blue-hole.jpg'}
                alt={pick(selectedLandmark.name, language)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-[var(--surface-card)]/40 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedLandmark(null)}
                aria-label="Close"
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 start-6 end-6">
                <span className="text-[11px] font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 px-2.5 py-0.5 rounded-full">
                  {pick(selectedLandmark.tier, language)}
                </span>
                <h3 className="text-2xl chart-heading font-bold text-[var(--text-primary)] mt-1.5">
                  {pick(selectedLandmark.name, language)}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {pick(selectedLandmark.fact, language)}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                    <Compass className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    {isAr ? 'الوصول والطريق' : 'Access & Road'}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {pick(selectedLandmark.access, language)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                    <Signal className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                    {isAr ? 'تغطية الشبكة' : 'Cell Coverage'}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {pick(selectedLandmark.connectivity, language)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLandmark(null)}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
