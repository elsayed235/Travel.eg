import React, { useState, useEffect } from 'react';
import {
  Sun,
  Waves,
  Wind,
  Eye,
  Thermometer,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';

interface SinaiRadarWidgetProps {
  onPlanDiveClick?: () => void;
  onViewTidesClick?: () => void;
}

export const SinaiRadarWidget: React.FC<SinaiRadarWidgetProps> = ({
  onPlanDiveClick,
  onViewTidesClick,
}) => {
  const { language, isRTL } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<'diving' | 'kitesurf' | 'sunset' | 'temperatures'>('diving');
  /**
   * The reading, or null.
   *
   * This widget already called /api/telemetry/weather — and then rendered four
   * cards of hardcoded numbers regardless of what came back: 28°C air, 24°C
   * water, "25m+" visibility, "0.2m" swell, "18 kts NW" with "Gusts: 21 kts",
   * and a 5:42 PM sunset. Under a pulsing dot, "Real-Time Marine Radar" and an
   * "Updated 5m ago" badge.
   */
  const [telemetry, setTelemetry] = useState<{
    available?: boolean;
    observedAt?: string;
    airTemperatureC?: number;
    waterTemperatureC?: number | null;
    condition?: string;
    conditionAr?: string;
    wind?: { speedKnots: number; direction: string; description: string; descriptionAr: string };
    astronomy?: { sunrise: string | null; sunset: string | null };
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getWeatherTelemetry().then((data) => {
      if (isMounted && data) {
        setTelemetry(data);
      }
    }).catch(() => {
      // Graceful fallback to static telemetry
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isAr = language === 'ar';

  const observedLabel = telemetry?.observedAt
    ? new Date(telemetry.observedAt).toLocaleTimeString(isAr ? 'ar-EG' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const timeOnly = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleTimeString(isAr ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })
      : null;
  const sunsetLabel = timeOnly(telemetry?.astronomy?.sunset);
  const sunriseLabel = timeOnly(telemetry?.astronomy?.sunrise);

  // Golden hour derived from the published sunset rather than fixed at 5:15 PM.
  const goldenHourLabel = telemetry?.astronomy?.sunset
    ? timeOnly(new Date(new Date(telemetry.astronomy.sunset).getTime() - 40 * 60 * 1000).toISOString())
    : null;

  return (
    <section
      id="sinai-sea-radar-v2"
      aria-label="Real-Time Sinai Atmospheric & Marine Intelligence"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0E2520] shadow-2xl transition-all">
        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 text-[#F7F3EA] space-y-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#52C4B7]">
                  {isAr ? 'حالة الجو والبحر في دهب' : 'Dahab Sea & Air Conditions'}
                </span>
                {/* Was "Updated 5m ago" beside a pulsing dot, on numbers that
                    never changed. This is the time of the actual reading. */}
                <span className="text-[11px] font-semibold text-[#D2E3DE] bg-[#13312B] px-2.5 py-0.5 rounded-full border border-white/10">
                  {observedLabel
                    ? isAr ? `قراءة ${observedLabel}` : `reading ${observedLabel}`
                    : isAr ? 'القراءة مش متاحة' : 'reading unavailable'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA] tracking-tight">
                {isAr ? 'حالة البحر والجو في دهب دلوقتي' : 'Sinai Sea & Reef Intelligence'}
              </h2>
            </div>

            {/* Metric Selector Tabs */}
            <div 
              role="tablist" 
              aria-label="Weather Intelligence Categories"
              className="flex items-center gap-1.5 bg-[#13312B] p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar"
            >
              {([
                { id: 'diving', label: isAr ? '🤿 مؤشر الغطس والشعاب' : '🤿 Reef & Dive Index' },
                { id: 'kitesurf', label: isAr ? '🪁 هوا اللاجونا والكايت' : '🪁 Lagoon Wind' },
                { id: 'sunset', label: isAr ? '🌅 وقت الغروب الذهبي' : '🌅 Sunset & Golden Hour' },
                { id: 'temperatures', label: isAr ? '🌡️ الجو وحرارة المية' : '🌡️ Air & Water' },
              ] as const).map((tab) => {
                const active = selectedMetric === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedMetric(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-[#20A89A] text-[#081714] font-bold shadow-md'
                        : 'text-[#D2E3DE] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Metric Display Content: Modern Deep-Teal Cards */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Water & Air Temperature */}
            <div className="bg-[#13312B] hover:bg-[#173832] rounded-2xl p-5 border border-white/10 hover:border-[#52C4B7]/40 shadow-lg space-y-3 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F7F3EA]">
                  <Thermometer className="w-4 h-4 text-[#F4C36C] group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span>{isAr ? 'درجات الحرارة' : 'Temperatures'}</span>
                </div>
                {/* Was an unconditional "Optimal" badge. */}
                <span className="text-[11px] font-bold text-[#52C4B7] bg-[#20A89A]/20 px-2.5 py-0.5 rounded-full border border-[#52C4B7]/30">
                  {(isAr ? telemetry?.conditionAr : telemetry?.condition) || (isAr ? '—' : '—')}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#F7F3EA]">
                    {telemetry?.airTemperatureC != null ? `${telemetry.airTemperatureC}°C` : '—'}
                  </span>
                  <span className="text-xs text-[#9DB5AF]">{isAr ? 'حرارة الجو' : 'Ambient Air'}</span>
                </div>
                <div className="flex items-baseline gap-2 text-[#52C4B7] text-sm font-semibold">
                  <span>
                    {telemetry?.waterTemperatureC != null
                      ? isAr ? `المية: ${telemetry.waterTemperatureC}°م` : `Water: ${telemetry.waterTemperatureC}°C`
                      : isAr ? 'حرارة المية مش منشورة' : 'Water temp not published'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#D2E3DE] font-normal leading-relaxed pt-2 border-t border-white/10">
                {/* The UV index was invented; nothing here measures one. */}
                {isAr
                  ? 'شمس سيناء قوية طول النهار — واقي الشمس ضروري.'
                  : 'The Sinai sun is strong through the day — sun protection matters.'}
              </p>
            </div>

            {/*
              Card 2 was "Reef Visibility 25m+" and "Swell: 0.2m" under a
              "Crystal Peak" badge. Nothing measures underwater visibility or
              wave height here — no buoy, no dive-centre feed — and visibility
              is what a diver checks before entering the water. The card now
              carries the wind, which is measured.
            */}
            <div className="bg-[#13312B] hover:bg-[#173832] rounded-2xl p-5 border border-white/10 hover:border-[#52C4B7]/40 shadow-lg space-y-3 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F7F3EA]">
                  <Wind className="w-4 h-4 text-[#52C4B7] group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span>{isAr ? 'الرياح' : 'Wind'}</span>
                </div>
                <span className="text-[11px] font-bold text-[#F4C36C] bg-[#E7A83B]/20 px-2.5 py-0.5 rounded-full border border-[#F4C36C]/30">
                  {(isAr ? telemetry?.wind?.descriptionAr : telemetry?.wind?.description) || '—'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#52C4B7]">
                    {telemetry?.wind ? `${telemetry.wind.speedKnots}` : '—'}
                  </span>
                  <span className="text-xs text-[#9DB5AF]">
                    {isAr ? 'عقدة' : 'knots'} {telemetry?.wind?.direction ?? ''}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#D2E3DE] font-normal leading-relaxed pt-2 border-t border-white/10">
                {isAr
                  ? 'وضوح الرؤية تحت المية وارتفاع الموج مش مرصودين هنا — اسأل مركز الغطس قبل ما تنزل.'
                  : 'Underwater visibility and swell are not measured here — check with your dive centre before entering.'}
              </p>
            </div>

            {/*
              Card 3 was a second wind card: "18 kts NW Thermal", "Gusts: 21
              kts", "9m–12m kites" — a gust figure nothing observes, and a kite
              size recommended from it. The wind is on card 2 now, measured
              once; this carries first light, which the source publishes.
            */}
            <div className="bg-[#13312B] hover:bg-[#173832] rounded-2xl p-5 border border-white/10 hover:border-[#52C4B7]/40 shadow-lg space-y-3 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F7F3EA]">
                  <Sun className="w-4 h-4 text-[#F4C36C] group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span>{isAr ? 'الشروق' : 'Sunrise'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#F7F3EA]">{sunriseLabel || '—'}</span>
                  <span className="text-xs text-[#9DB5AF]">{isAr ? 'أول ضوء' : 'First light'}</span>
                </div>
              </div>

              <p className="text-xs text-[#D2E3DE] font-normal leading-relaxed pt-2 border-t border-white/10">
                {isAr
                  ? 'الغطس الصباحي بيبدأ مع أول ضوء عادةً — البحر بيكون أهدى قبل ما الهوا يزيد.'
                  : 'Morning dives usually start at first light, before the wind builds.'}
              </p>
            </div>

            {/* Card 4: Sunset & Golden Hour */}
            <div className="bg-[#13312B] hover:bg-[#173832] rounded-2xl p-5 border border-white/10 hover:border-[#F4C36C]/40 shadow-lg space-y-3 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F7F3EA]">
                  <Sun className="w-4 h-4 text-[#EA8E75] group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span>{isAr ? 'الغروب الذهبي' : 'Golden Hour'}</span>
                </div>
                {/* Was a fixed 5:15 PM golden hour beside a fixed 5:42 PM
                    sunset. Golden hour is derived from the published sunset. */}
                <span className="text-[11px] font-bold text-[#F4C36C] bg-[#EA8E75]/20 px-2.5 py-0.5 rounded-full border border-[#EA8E75]/30">
                  {goldenHourLabel || '—'}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#F4C36C]">{sunsetLabel || '—'}</span>
                  <span className="text-xs text-[#9DB5AF]">{isAr ? 'غروب سيناء' : 'Sinai Sunset'}</span>
                </div>
                <div className="flex items-baseline gap-2 text-[#EA8E75] text-sm font-semibold">
                  <span>{isAr ? 'شاي بالحبق ع البحر' : 'Habak Tea Time'}</span>
                  <span className="text-[12px] text-[#9DB5AF] font-normal">{isAr ? 'قعدة اللايتهاوس' : 'Lighthouse Bay'}</span>
                </div>
              </div>

              <p className="text-xs text-[#D2E3DE] font-normal leading-relaxed pt-2 border-t border-white/10">
                {isAr
                  ? 'أحلى إضاءة للتصوير في آخر ٤٠ دقيقة قبل الغروب فوق خليج العقبة.'
                  : 'The best light for photographs is the last 40 minutes before sunset over the Gulf of Aqaba.'}
              </p>
            </div>

          </div>

          {/* Bottom Recommendation Intelligence Strip */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-[#13312B] rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-[#F7F3EA]">
              <ShieldCheck className="w-4 h-4 text-[#52C4B7] flex-shrink-0" aria-hidden="true" />
              <span>
                <strong className="font-bold text-[#52C4B7]">{isAr ? 'نصيحة الغطاسين:' : 'Diver Recommendation:'}</strong>{' '}
                <span className="text-[#D2E3DE]">
                  {/* Was an unconditional "shore entry is calm until 1 PM",
                      stated whatever the wind. Now it follows the reading. */}
                  {telemetry?.wind && telemetry.wind.speedKnots >= 18
                    ? isAr
                      ? `الهوا ${telemetry.wind.speedKnots} عقدة دلوقتي — الدخول من الشاطئ ممكن يكون صعب.`
                      : `Wind is ${telemetry.wind.speedKnots} kn right now — shore entry may be difficult.`
                    : isAr
                      ? 'اسأل مركز الغطس على حالة الدخول من الشاطئ قبل ما تنزل.'
                      : 'Ask your dive centre about shore entry conditions before you go in.'}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Named a specific doctor as being "on duty" — a rota nothing
                  here reads. The chamber is real and worth naming; who is on
                  shift is not something this system knows. */}
              <span className="text-[#9DB5AF] text-[12px]">
                {isAr
                  ? 'غرفة الضغط وطوارئ الغطس في دهب متاحة على مدار اليوم.'
                  : 'The Dahab hyperbaric chamber operates around the clock.'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
