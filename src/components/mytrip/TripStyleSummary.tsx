import React from 'react';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Users, 
  Wallet, 
  Gauge, 
  HeartHandshake 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTrip } from '../../context/TripContext';

/** Formats the trip's own dates. Falls back to the length when it has none. */
function durationLabel(lengthDays: number, startDate?: string, endDate?: string): string {
  const nights = `${lengthDays} ${lengthDays === 1 ? 'day' : 'days'}`;
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return nights;

  const day = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${nights} (${day(start)} – ${day(end)})`;
}

/**
 * The traveler's trip settings, read from their trip record.
 *
 * Every row here used to be a literal: "5 days (Oct 12 – 16)",
 * "2 (Ahmed & Companion)", "Moderate", "Diving · Adventure · Food",
 * "Balanced". A traveler who chose a relaxed 3-day solo trip was shown
 * somebody else's, under the heading "Your trip style".
 */
export const TripStyleSummary: React.FC = () => {
  const { isDark } = useTheme();
  const { activeTrip, profile, user } = useTrip();

  const travelerName = profile.name || user?.displayName || '';
  const travelers = activeTrip?.travelersCount ?? profile.travelersCount ?? 1;
  const travelersLabel =
    travelers > 1 && travelerName
      ? `${travelers} (${travelerName} + ${travelers - 1})`
      : `${travelers} ${travelers === 1 ? 'traveler' : 'travelers'}`;
  const interests = activeTrip?.interests?.length
    ? activeTrip.interests.join(' · ')
    : profile.interests?.length
      ? profile.interests.join(' · ')
      : '—';

  return (
    <div
      id="your-trip-style-section"
      className={`rounded-3xl p-6 border shadow-lg space-y-4 ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      <div className={`border-b pb-3 ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
        <span className={`text-[11px] font-bold uppercase tracking-wider block font-['Outfit',sans-serif] ${
          isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
        }`}>
          Travel Blueprint
        </span>
        <h2 className={`text-lg font-bold font-['Outfit',sans-serif] ${
          isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
        }`}>
          Your trip style
        </h2>
      </div>

      <div className="space-y-3 text-xs">
        <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
            <MapPin className="w-3.5 h-3.5 text-[#EA8E75]" />
            <span>Destination</span>
          </span>
          <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Dahab, South Sinai</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
            <Clock className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>Duration</span>
          </span>
          <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{activeTrip ? durationLabel(activeTrip.lengthDays, activeTrip.startDate, activeTrip.endDate) : '—'}</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
            <Users className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>Travelers</span>
          </span>
          <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{travelersLabel}</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
            <Wallet className="w-3.5 h-3.5 text-[#EA8E75]" />
            <span>Budget</span>
          </span>
          <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{activeTrip?.budget || profile.budget || '—'}</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
            <HeartHandshake className="w-3.5 h-3.5 text-[#EA8E75]" />
            <span>Interests</span>
          </span>
          <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{interests}</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
            <Gauge className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>Pace</span>
          </span>
          <span className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{activeTrip?.pace || profile.pace || '—'}</span>
        </div>
      </div>
    </div>
  );
};
