import React from 'react';
import { Calendar, MapPin, Plus, Share2, ShieldCheck, SlidersHorizontal, Sun, Users } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';

interface TripHeroCardProps {
  travelerDisplayName: string;
  durationDays: number;
  travelersCount: number;
  dateRange: string | null;
  /** The trip's own title. Falls back to the duration phrasing when unset. */
  tripTitle?: string | null;
  /** Drives the status pill. Undefined renders no pill rather than a wrong one. */
  tripStatus?: string | null;
  /** Live conditions, or null when the weather service could not be read. */
  weather?: { airTemperatureC: number; condition: string; conditionAr: string } | null;
  onShare: () => void;
  onManageTrip: () => void;
  onAddActivity: () => void;
}

/**
 * The status pill, in the trip's real vocabulary.
 *
 * This pill was a constant: `t('myTrip.confirmedBadge')` — "Trip Confirmed &
 * Synchronized" — rendered on every trip regardless of state. The seeded trip
 * it shipped on is PLANNED, with zero bookings and totalPaidEGP 0, and it still
 * told the traveller the trip was confirmed and synchronised.
 */
const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  DRAFT: { en: 'Draft itinerary', ar: 'مسودة رحلة' },
  PLANNED: { en: 'Planned — not booked yet', ar: 'مخططة — لم تُحجز بعد' },
  CONFIRMED: { en: 'Trip confirmed ✓', ar: 'الرحلة مؤكدة ✓' },
  IN_DESTINATION: { en: 'In Dahab now', ar: 'في دهب الآن' },
  COMPLETED: { en: 'Trip completed', ar: 'رحلة منتهية' },
  CANCELLED: { en: 'Trip cancelled', ar: 'رحلة ملغاة' },
};

export const TripHeroCard: React.FC<TripHeroCardProps> = ({
  travelerDisplayName,
  durationDays,
  travelersCount,
  dateRange,
  tripTitle,
  tripStatus,
  weather,
  onShare,
  onManageTrip,
  onAddActivity,
}) => {
  const { language, t } = useLanguage();

  const statusLabel = tripStatus ? STATUS_LABELS[tripStatus] : undefined;
  const conditionText = weather
    ? `${Math.round(weather.airTemperatureC)}°C · ${language === 'ar' ? weather.conditionAr : weather.condition}`
    : null;

  return (
    <section
      aria-label="Trip overview header"
      className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] bg-stone-950 text-[var(--text-primary)] min-h-[300px] flex flex-col justify-end p-6 sm:p-10"
    >
      {/* Background Photography with deep gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1400&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-60 filter saturate-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/50" />
      </div>

      {/* Foreground details */}
      <div className="relative z-10 space-y-4 max-w-3xl">
        
        {/* Stage Pill & Weather ticker */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {statusLabel && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[var(--accent-primary)] text-[var(--surface-container)] shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? statusLabel.ar : statusLabel.en}</span>
            </span>
          )}

          {/*
            Was t('myTrip.weatherCalm') — the fixed string "28°C · Sunny · Calm
            Red Sea Swell", shown whatever the sea was doing, on the page a
            diver opens before heading out. The live reading is the one the
            /live page already renders; with no reading, this pill is absent
            rather than reassuring.
          */}
          {conditionText && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface-card)]/15 backdrop-blur-md text-[var(--text-primary)] border border-white/20">
              <Sun className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
              <span>{conditionText}</span>
            </span>
          )}
        </div>

        {/* Greeting & Title */}
        <div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--accent-primary)] block mb-1">
            {t('myTrip.welcomeBack', { travelerDisplayName })}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] leading-tight">
            {/*
              The trip's own title wins. The duration phrasing below is a
              fallback for a trip that has none — it used to be the only thing
              rendered, so a trip called "Dahab First Timer" was displayed to
              its owner as "5 Days of Coral Diving & Sinai Desert Serenity".
            */}
            {tripTitle
              ? tripTitle
              : t('myTrip.daysInDahab', { durationDays })}
          </h1>
        </div>

        {/* Metadata pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--text-secondary)] font-medium pt-1">
          {/*
            No invented dates. This read `dateRange || '1 - 5 Sep 2026'`, so a
            trip with no start or end date was given a specific, plausible,
            wrong week — which is worse than showing no dates at all.
          */}
          {dateRange && (
            <>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>{dateRange}</span>
              </span>
              <span className="opacity-40">•</span>
            </>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[var(--accent-secondary)]" />
            <span>{t('myTrip.travelers-2', { travelersCount })}</span>
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#EA8E75]" />
            <span>{t('myTrip.dahabSouthSinai')}</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="hero-share-trip-btn"
            onClick={onShare}
            className="px-5 py-2.5 rounded-2xl bg-[var(--surface-card)]/15 hover:bg-[var(--surface-card)]/25 active:scale-95 text-[var(--text-primary)] text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>{t('myTrip.shareItinerary')}</span>
          </button>

          <button
            type="button"
            id="hero-manage-trip-btn"
            onClick={onManageTrip}
            className="px-5 py-2.5 rounded-2xl bg-[var(--surface-card)]/15 hover:bg-[var(--surface-card)]/25 active:scale-95 text-[var(--text-primary)] text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[var(--accent-secondary)]" />
            <span>{t('myTrip.manageTrip')}</span>
          </button>

          <button
            type="button"
            id="hero-add-exp-btn"
            onClick={onAddActivity}
            className="px-6 py-2.5 rounded-2xl bg-[var(--accent-secondary)] hover:bg-[#E7A83B] text-[var(--surface-container)] text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-[var(--surface-container)]" />
            <span>{t('myTrip.addActivity')}</span>
          </button>
        </div>

      </div>
    </section>
  );
};