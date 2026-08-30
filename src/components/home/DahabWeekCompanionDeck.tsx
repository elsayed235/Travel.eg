import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Sun,
  Waves,
  Compass,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Zap,
  Phone,
  MessageCircle,
  Eye,
  Sliders,
  Car,
  HeartHandshake
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface DahabWeekCompanionDeckProps {
  onOpenQuickBook: () => void;
}

export const DahabWeekCompanionDeck: React.FC<DahabWeekCompanionDeckProps> = ({ onOpenQuickBook }) => {
  const {
    tripDays,
    navigateTo,
    isEasyMode,
    toggleEasyMode,
    showToast
  } = useTrip();

  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [activeDayNumber, setActiveDayNumber] = useState<number>(2); // Default to Day 2 (Dahab prime day)

  /**
   * The day to show, or none at all.
   *
   * `tripDays` used to be permanently empty in one direction and permanently
   * the demo persona's five days in the other; either way this component could
   * assume `tripDays[0]` existed. Now that the days come from the traveler's
   * own trip, a traveler without one has an empty array — and the fallback
   * `|| tripDays[0]` is then `undefined`, which crashed the homepage into its
   * ErrorBoundary on `selectedDay.dayNumber`.
   */
  const selectedDay = tripDays.find((d) => d.dayNumber === activeDayNumber) || tripDays[0];

  // Nothing to show a traveler who has not planned a trip yet. The homepage has
  // its own entry points for that; a week deck with no week is noise.
  if (!selectedDay) return null;

  // Quick 7-Day Themes metadata for intuitive visual scanning
  const DAY_THEMES = [
    { day: 1, icon: '🛬', tagEn: 'Arrival & Bay Sunset', tagAr: 'وصول وغروب الخليج', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-400/40' },
    { day: 2, icon: '🤿', tagEn: 'Canyon & Deep Reefs', tagAr: 'الكانيون والبلو هول', color: 'from-cyan-500/20 to-teal-500/20', border: 'border-cyan-400/40' },
    { day: 3, icon: '🏜️', tagEn: 'Colored Canyon & Bedouin Feast', tagAr: 'الكانيون الملون ووادي قناي', color: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-400/40' },
    { day: 4, icon: '⛵', tagEn: 'Ras Abu Galum & Blue Lagoon', tagAr: 'أبو جالوم والبلولاجون', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-400/40' },
    { day: 5, icon: '🌄', tagEn: 'Mt. Sinai Summit & Monastery', tagAr: 'قمة موسى ودير سانت كاترين', color: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-400/40' },
    { day: 6, icon: '🪁', tagEn: 'Laguna Kitesurf & Sound Healing', tagAr: 'كايت اللاجون ويوجا الغروب', color: 'from-sky-500/20 to-blue-500/20', border: 'border-sky-400/40' },
    { day: 7, icon: '🛍️', tagEn: 'Old Souk & VIP Departure', tagAr: 'سوق العصلة وتوديع دهب', color: 'from-stone-500/20 to-amber-500/20', border: 'border-stone-400/40' },
  ];

  return (
    <section
      id="dahab-week-companion-deck"
      aria-label="7-Day Dahab Week Master Planner & Easy Action Deck"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all"
    >
      <div className={`rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
        isEasyMode
          ? 'bg-[#13312B] border-[#52C4B7] ring-4 ring-[#F4C36C]/40 text-[#F7F3EA]'
          : isDark
          ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]'
          : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}>
        
        {/* ========================================================================= */}
        {/* 1. HEADER WITH EASY/SUNLIGHT MODE TOGGLE & 7-DAY OVERVIEW                 */}
        {/* ========================================================================= */}
        <div className={`p-6 sm:p-8 border-b ${
          isDark
            ? 'border-white/10 bg-[#13312B] text-[#F7F3EA]'
            : 'border-[#122420]/10 bg-[#F2EFE9] text-[#122420]'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#F4C36C] text-[#081714] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'أسبوع دهب المثالي (٧ أيام)' : '7-Day Sinai Master Flow'}</span>
                </span>
                <span className={`text-[12px] font-semibold px-3 py-1 rounded-full border ${
                  isDark ? 'text-[#52C4B7] bg-[#173832] border-white/10' : 'text-[#0F6F78] bg-white border-[#122420]/10'
                }`}>
                  {language === 'ar' ? 'موزونة بين المغامرة والروقان' : '3 Adventures · 2 Expeditions · 2 Slow Days'}
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight font-serif ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                {language === 'ar' ? 'جدول أسبوعك في دهب وسيناء' : 'Your 7-Day Dahab Week Companion'}
              </h2>
              <p className={`text-xs sm:text-sm max-w-2xl font-normal ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                {language === 'ar'
                  ? 'تنقل بسهولة بين أيام الأسبوع السبعة من لحظة وصولك للمطار لحد توديع البحر والشعاب المرجانية.'
                  : 'Effortlessly switch between Day 1 to Day 7. Crafted for casual travelers, families, and beachgoers.'}
              </p>
            </div>

            {/* Easy Mode & Sunlight Toggle */}
            <div className="flex items-center gap-3 self-start lg:self-center flex-wrap">
              <button
                type="button"
                id="toggle-sunlight-easy-mode-btn"
                onClick={toggleEasyMode}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md border ${
                  isEasyMode
                    ? 'bg-[#F4C36C] text-[#081714] border-[#F4C36C] font-black'
                    : isDark
                    ? 'bg-[#173832] hover:bg-[#1E453E] text-[#F7F3EA] border-white/10'
                    : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/10'
                }`}
              >
                <Sun className={`w-4 h-4 ${isEasyMode ? 'text-[#081714]' : 'text-[#F4C36C]'}`} />
                <span>
                  {language === 'ar'
                    ? (isEasyMode ? '☀️ وضع القراءة السهلة (مفعّل)' : '☀️ تشغيل وضع القراءة السهلة')
                    : (isEasyMode ? '☀️ Easy Mode: ACTIVE' : '☀️ Switch to Easy Mode')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/my-trip', { dayId: activeDayNumber })}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-[#173832] hover:bg-[#1E453E] text-[#F7F3EA] border-white/10'
                    : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/10 shadow-xs'
                }`}
              >
                <span>{language === 'ar' ? 'فتح في مدير الرحلة' : 'Open in Full Trip OS'}</span>
                <ChevronRight className="w-4 h-4 text-[#F4C36C] rtl:rotate-180" />
              </button>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 2. 7-DAY INTERACTIVE DAY SELECTOR BAR (1 to 7)                             */}
          {/* ========================================================================= */}
          <div className={`mt-6 pt-5 border-t overflow-x-auto pb-2 scrollbar-thin ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
            <div className="flex items-center gap-2.5 min-w-max">
              {tripDays.slice(0, 7).map((day) => {
                const isSelected = day.dayNumber === activeDayNumber;
                const meta = DAY_THEMES.find((t) => t.day === day.dayNumber) || DAY_THEMES[0];

                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => {
                      setActiveDayNumber(day.dayNumber);
                      showToast(`Switched to Day ${day.dayNumber} · ${day.title}`);
                    }}
                    className={`p-3.5 rounded-2xl transition-all flex flex-col items-start gap-1 cursor-pointer text-left rtl:text-right border ${
                      isSelected
                        ? 'bg-[#20A89A] text-[#081714] border-[#20A89A] shadow-lg font-bold'
                        : isDark
                        ? 'bg-[#173832] hover:bg-[#1E453E] text-[#F7F3EA] border-white/10'
                        : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/10 shadow-xs'
                    }`}
                    style={{ minWidth: '150px' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base">{meta.icon}</span>
                      <span className={`text-[11px] uppercase font-mono px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#081714] text-[#F4C36C]'
                          : isDark
                          ? 'bg-[#13312B] text-[#D2E3DE]'
                          : 'bg-[#F2EFE9] text-[#4A635D]'
                      }`}>
                        Day {day.dayNumber}
                      </span>
                    </div>
                    <span className="text-xs font-bold line-clamp-1">
                      {language === 'ar' ? meta.tagAr : meta.tagEn}
                    </span>
                    <span className={`text-[11px] line-clamp-1 ${
                      isSelected
                        ? 'text-[#081714]/80 font-medium'
                        : isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'
                    }`}>
                      {day.dateStr.split('·')[1] || `Oct ${11 + day.dayNumber}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ACTIVE DAY FLOW & SCHEDULE SPOTLIGHT (HIGH CONTRAST & ACCESSIBLE)      */}
        {/* ========================================================================= */}
        <div className={`p-6 sm:p-8 space-y-6 ${isDark ? 'bg-[#0E2520]' : 'bg-white'}`}>
          
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#20A89A] animate-pulse" />
                <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-[#52C4B7]' : 'text-[#0F6F78]'}`}>
                  {language === 'ar' ? `تفاصيل اليوم ${selectedDay.dayNumber} · ${selectedDay.dateStr}` : `Active Schedule · Day ${selectedDay.dayNumber} (${selectedDay.dateStr})`}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                  isDark ? 'bg-[#13312B] text-[#F4C36C] border-white/10' : 'bg-[#F2EFE9] text-[#0E2520] border-[#122420]/10'
                }`}>
                  {selectedDay.activities.length} {language === 'ar' ? 'أنشطة' : 'Experiences'}
                </span>
              </div>
              <h3 className={`font-serif font-bold text-xl sm:text-2xl ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                {selectedDay.title}
              </h3>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                {selectedDay.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('/quick-book')}
              className="px-6 py-3.5 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 text-xs active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#081714]" />
              <span>{language === 'ar' ? 'احجز نشاط إضافي لهذا اليوم' : 'Add Activity to this Day'}</span>
            </button>
          </div>

          {/* Activities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDay.activities.map((act, idx) => {
              const isFirst = idx === 0;

              return (
                <div
                  key={act.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isDark
                      ? isFirst
                        ? 'bg-[#13312B] text-[#F7F3EA] border-[#52C4B7]/40 shadow-lg'
                        : 'bg-[#13312B]/70 hover:bg-[#13312B] text-[#F7F3EA] border-white/10 shadow-sm hover:shadow-md'
                      : isFirst
                      ? 'bg-[#F2EFE9] text-[#122420] border-[#20A89A]/40 shadow-md'
                      : 'bg-white hover:bg-[#F2EFE9] text-[#122420] border-[#122420]/10 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className={`w-3.5 h-3.5 ${isFirst ? 'text-[#F4C36C]' : 'text-[#20A89A]'}`} />
                        <span className={`text-xs ${isFirst ? 'text-[#E7A83B] font-bold' : isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                          {act.time}
                        </span>
                      </div>

                      <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        act.status.includes('Booked') || act.status.includes('Confirmed')
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30'
                      }`}>
                        {act.status}
                      </span>
                    </div>

                    <h4 className={`font-serif font-bold text-base ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                      {act.title}
                    </h4>

                    <p className={`line-clamp-2 text-xs leading-relaxed ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>
                      {act.notes || 'Curated experience in Dahab.'}
                    </p>
                  </div>

                  <div className={`pt-3 border-t text-[12px] flex items-center justify-between font-medium ${
                    isDark ? 'border-white/10 text-[#9DB5AF]' : 'border-[#122420]/10 text-[#6B7C83]'
                  }`}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F4C36C]" />
                      <span className="line-clamp-1">{act.location || 'Dahab Coast'}</span>
                    </span>
                    <span>{act.duration || '2 hrs'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 4. 1-TAP INSTANT SINAI ACTION DOCK (IDEAL FOR BEACH / CASUAL USERS)       */}
          {/* ========================================================================= */}
          <div className={`mt-8 pt-6 border-t space-y-4 ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <h4 className={`font-serif font-bold text-base ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'أزرار سريعة بلمسة واحدة (أثناء تواجدك في دهب)' : '1-Tap Dahab Quick Dock'}
                </h4>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isDark ? 'text-[#52C4B7] bg-[#13312B] border-white/10' : 'text-[#0F6F78] bg-[#F2EFE9] border-[#122420]/10'
              }`}>
                {language === 'ar' ? 'أسعار محددة وبدون فصال' : 'Fixed Rates & Local Verified'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              
              {/* 1. Taxi / 4x4 Call */}
              <button
                type="button"
                onClick={() => {
                  window.open('https://wa.me/201002345678?text=Hello%20Dahab%20Transport,%20I%20need%20a%20ride%20now', '_blank');
                  showToast('Connecting to verified Dahab Driver via WhatsApp...');
                }}
                className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all text-start cursor-pointer flex flex-col gap-2 group ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#173832] border-white/10 hover:border-[#F4C36C]/40'
                    : 'bg-[#F2EFE9] hover:bg-stone-200 border-[#122420]/10 hover:border-[#F4C36C]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#F4C36C]/20 text-[#F4C36C] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Car className="w-4 h-4" />
                </div>
                <span className={`font-bold text-xs ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'طلب تاكسي / 4x4' : '1-Tap Taxi / 4x4'}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                  {language === 'ar' ? 'العصلة · البلو هول · اللاجون' : '50–120 EGP Local Rate'}
                </span>
              </button>

              {/* 2. Dive / Gear Pass */}
              <button
                type="button"
                onClick={onOpenQuickBook}
                className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all text-start cursor-pointer flex flex-col gap-2 group ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#173832] border-white/10 hover:border-[#52C4B7]/40'
                    : 'bg-[#F2EFE9] hover:bg-stone-200 border-[#122420]/10 hover:border-[#20A89A]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Waves className="w-4 h-4" />
                </div>
                <span className={`font-bold text-xs ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'تأجير ماسك وغطس' : 'Rent Mask / Dive'}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                  {language === 'ar' ? 'استلام فوري من اللايتهاوس' : 'Instant pickup Lighthouse'}
                </span>
              </button>

              {/* 3. Food Now */}
              <button
                type="button"
                onClick={() => navigateTo('/food')}
                className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all text-start cursor-pointer flex flex-col gap-2 group ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#173832] border-white/10 hover:border-[#EA8E75]/40'
                    : 'bg-[#F2EFE9] hover:bg-stone-200 border-[#122420]/10 hover:border-[#EA8E75]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#EA8E75]/20 text-[#EA8E75] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className={`font-bold text-xs ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'أكل على البحر دلوقتي' : 'Beach Food Delivery'}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                  {language === 'ar' ? 'توصيل للشلتة أو الفندق' : 'Direct to your beach spot'}
                </span>
              </button>

              {/* 4. Local WhatsApp Host */}
              <button
                type="button"
                onClick={() => {
                  window.open('https://wa.me/201002345678?text=Marhaba%20Dahab%20Host,%20I%20have%20a%20question%20about%20today', '_blank');
                  showToast('Opening Dahab Local Host Concierge...');
                }}
                className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all text-start cursor-pointer flex flex-col gap-2 group ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#173832] border-white/10 hover:border-[#52C4B7]/40'
                    : 'bg-[#F2EFE9] hover:bg-stone-200 border-[#122420]/10 hover:border-[#20A89A]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#20A89A]/20 text-[#20A89A] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className={`font-bold text-xs ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'شات واتساب المضيف' : 'Local WhatsApp Host'}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-[#9DB5AF]' : 'text-[#6B7C83]'}`}>
                  {language === 'ar' ? 'رد في دقيقتين' : 'Replies in <2 mins'}
                </span>
              </button>

              {/* 5. SOS Emergency */}
              <button
                type="button"
                onClick={() => navigateTo('/help')}
                className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all text-start cursor-pointer flex flex-col gap-2 group ${
                  isDark
                    ? 'bg-[#13312B] hover:bg-[#173832] border-white/10 hover:border-[#EA8E75]/40'
                    : 'bg-[#F2EFE9] hover:bg-stone-200 border-[#122420]/10 hover:border-[#EA8E75]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#EA8E75]/20 text-[#EA8E75] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className={`font-bold text-xs ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'طوارئ سيناء وغرفة الضغط' : 'Sinai SOS & Hyperbaric'}
                </span>
                <span className="text-[11px] text-[#EA8E75] font-bold">
                  {language === 'ar' ? 'اتصال مباشر ٢٤ ساعة' : '24/7 Decompression Chamber'}
                </span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
