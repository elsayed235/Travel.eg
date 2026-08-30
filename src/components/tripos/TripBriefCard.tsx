import React from 'react';
import {
  CheckCircle2,
  Lock,
  Heart,
  Ban,
  Users,
  Calendar,
  Wallet,
  Compass,
  Sparkles,
  Edit3
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';

interface TripBriefCardProps {
  onOpenEditModal: () => void;
}

export const TripBriefCard: React.FC<TripBriefCardProps> = ({ onOpenEditModal }) => {
  const { language, isRTL } = useLanguage();
  const { tripBrief, profile, user } = useTrip();

  return (
    <section
      id="trip-brief-summary-card"
      className="w-full bg-[#0E2520] text-[#F7F3EA] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4C36C]" />
            <span className="text-[12px] font-black uppercase tracking-wider text-[#F4C36C] font-['Outfit',sans-serif]">
              {language === 'ar' ? 'ملخص ومحددات الرحلة الرسمية' : 'AUTHORITATIVE TRIP BRIEF'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F7F3EA] font-['Outfit',sans-serif]">
            {/* Falls back to the traveler's own name, then to a neutral title.
                The default used to be the literal 'Sarah & Karim'. */}
            {(() => {
              const who = tripBrief.travelerName || profile.name || user?.displayName || '';
              if (!who) return language === 'ar' ? 'ملخص رحلتك في دهب' : 'Your Dahab Operating Brief';
              return language === 'ar' ? `رحلة دهب: ${who}` : `${who}'s Dahab Operating Brief`;
            })()}
          </h2>
          <p className="text-xs sm:text-sm text-[#D2E3DE]/70">
            {language === 'ar'
              ? 'المحددات والشروط التي تم بناء واختبار هذا المخطط على أساسها لضمان تجربة مثالية.'
              : 'The core constraints and preferences shaping your optimized Dahab travel plan.'}
          </p>
        </div>

        <button
          id="btn-edit-trip-brief"
          type="button"
          onClick={onOpenEditModal}
          className="px-4 py-2.5 rounded-2xl bg-[#13312B] hover:bg-[#13312B]/80 text-[#F7F3EA] font-bold text-xs border border-white/10 transition-all cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#F4C36C]" />
          <span>{language === 'ar' ? 'تعديل المحددات' : 'Edit Brief & Goals'}</span>
        </button>
      </div>

      {/* Meta Specs Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[#D2E3DE]/60 text-[12px]">
            <Calendar className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? 'المدة' : 'Duration'}</span>
          </div>
          <div className="text-sm font-extrabold text-[#F7F3EA]">
            {language === 'ar' ? `${tripBrief.durationDays} أيام` : `${tripBrief.durationDays} Days / 4 Nights`}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[#D2E3DE]/60 text-[12px]">
            <Users className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? 'المسافرين' : 'Travelers'}</span>
          </div>
          <div className="text-sm font-extrabold text-[#F7F3EA]">
            {language === 'ar' ? `${tripBrief.travelersCount} أفراد (${tripBrief.tripDynamic})` : `${tripBrief.travelersCount} (${tripBrief.tripDynamic})`}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[#D2E3DE]/60 text-[12px]">
            <Compass className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? 'إيقاع الرحلة' : 'Pace & Energy'}</span>
          </div>
          <div className="text-sm font-extrabold text-[#F7F3EA]">
            {language === 'ar'
              ? tripBrief.pace === 'Relaxed' ? 'رايق وهادئ' : tripBrief.pace === 'Balanced' ? 'متوازن ومريح' : 'نشيط ومغامرة'
              : `${tripBrief.pace} Pace`}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[#D2E3DE]/60 text-[12px]">
            <Wallet className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? 'الميزانية المستهدفة' : 'Target Budget'}</span>
          </div>
          <div className="text-sm font-extrabold text-[#F7F3EA]">
            {tripBrief.estimatedBudgetEGP.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
          </div>
        </div>
      </div>

      {/* Constraints Triple Column Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Must-Haves */}
        <div className="p-4 rounded-2xl bg-[#13312B] border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300 font-['Outfit',sans-serif]">
                {language === 'ar' ? 'الشروط الأساسية (Must-Haves)' : 'MUST-HAVES'}
              </h3>
            </div>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {tripBrief.mustHaves.length} {language === 'ar' ? 'شروط' : 'Locked'}
            </span>
          </div>

          <ul className="space-y-2 text-xs">
            {tripBrief.mustHaves.map((mh) => (
              <li key={mh.id} className="p-2.5 rounded-xl bg-[#081714] border border-emerald-500/20 space-y-1">
                <div className="flex items-center justify-between font-bold text-[#F7F3EA]">
                  <span>{language === 'ar' ? mh.labelAr : mh.label}</span>
                  {mh.isLocked && <Lock className="w-3 h-3 text-[#D2E3DE]/40" />}
                </div>
                <p className="text-[12px] text-[#D2E3DE]/60">
                  {language === 'ar' ? mh.descriptionAr || mh.description : mh.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Preferences */}
        <div className="p-4 rounded-2xl bg-[#13312B] border border-[#F4C36C]/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#F4C36C]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#F4C36C] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'التفضيلات المفضلة (Preferences)' : 'PREFERENCES'}
              </h3>
            </div>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/30">
              {tripBrief.preferences.length} {language === 'ar' ? 'تفضيلات' : 'Prioritized'}
            </span>
          </div>

          <ul className="space-y-2 text-xs">
            {tripBrief.preferences.map((pref) => (
              <li key={pref.id} className="p-2.5 rounded-xl bg-[#081714] border border-[#F4C36C]/20 space-y-1">
                <div className="font-bold text-[#F7F3EA]">
                  {language === 'ar' ? pref.labelAr : pref.label}
                </div>
                <p className="text-[12px] text-[#D2E3DE]/60">
                  {language === 'ar' ? pref.descriptionAr || pref.description : pref.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Avoidances */}
        <div className="p-4 rounded-2xl bg-[#13312B] border border-rose-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-300 font-['Outfit',sans-serif]">
                {language === 'ar' ? 'الممنوعات والتجنب (Avoidances)' : 'AVOIDANCES'}
              </h3>
            </div>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {tripBrief.avoidances.length} {language === 'ar' ? 'ممنوعات' : 'Excluded'}
            </span>
          </div>

          <ul className="space-y-2 text-xs">
            {tripBrief.avoidances.map((av) => (
              <li key={av.id} className="p-2.5 rounded-xl bg-[#081714] border border-rose-500/20 space-y-1">
                <div className="font-bold text-[#F7F3EA]">
                  {language === 'ar' ? av.labelAr : av.label}
                </div>
                <p className="text-[12px] text-[#D2E3DE]/60">
                  {language === 'ar' ? av.descriptionAr || av.description : av.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
