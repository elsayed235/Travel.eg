import React from 'react';
import {
  Waves,
  Wind,
  Sun,
  MapPin,
  Utensils,
  Footprints,
  Compass,
  WifiOff,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import {
  getDahabPlaceById,
  getNearbyFoodAfterActivity,
  evaluateActivityConditionSuitability
} from '../../services/dahabLocalEngine';
import { INITIAL_LIVE_DAHAB_CONDITIONS } from '../../data/dahabGeography';

interface DahabLocalIntelligenceCardProps {
  currentPlaceId?: string;
  activityName?: string;
  onOpenOfflinePack?: () => void;
  onOpenFoodNow?: () => void;
}

export const DahabLocalIntelligenceCard: React.FC<DahabLocalIntelligenceCardProps> = ({
  currentPlaceId = 'place-lighthouse',
  activityName = 'Guided Shore Dive & Sunset',
  onOpenOfflinePack,
  onOpenFoodNow
}) => {
  const { language, isRTL } = useLanguage();
  const { showToast, navigateTo } = useTrip();

  const place = getDahabPlaceById(currentPlaceId) || getDahabPlaceById('place-lighthouse')!;
  const conditionAssessment = evaluateActivityConditionSuitability(place, activityName, INITIAL_LIVE_DAHAB_CONDITIONS);
  const nearbyFoods = getNearbyFoodAfterActivity(place.id);

  return (
    <div className="bg-[#0E2520] text-[#F7F3EA] rounded-3xl p-5 border border-white/10 shadow-lg overflow-hidden relative">
      
      {/* Header with Provenance Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#13312B] text-[#F4C36C] flex items-center justify-center border border-white/10">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-wider text-[#52C4B7] font-bold font-['Outfit',sans-serif]">
                {language === 'ar' ? 'ذكاء المكان المحلي' : 'Dahab Local Intelligence'}
              </span>
              <span className="text-[11px] bg-[#13312B] text-[#D2E3DE]/70 px-1.5 py-0.5 rounded border border-white/10">
                {place.provenance.status}
              </span>
            </div>
            <h3 className="font-['Outfit',sans-serif] font-bold text-base text-[#F7F3EA]">
              {language === 'ar' ? place.nameAr : place.canonicalName}
            </h3>
          </div>
        </div>

        {place.isExpeditionModeTrigger && (
          <button
            onClick={onOpenOfflinePack}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition animate-pulse"
          >
            <WifiOff className="w-3 h-3" />
            {language === 'ar' ? 'وضع المحمية المعزولة (حزمة أوفلاين)' : 'Expedition Mode (Offline Pack)'}
          </button>
        )}
      </div>

      {/* 3-Column Local Logic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">

        {/* 1. Shore Entry & Access */}
        <div className="bg-[#13312B] rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#52C4B7] font-medium mb-1">
            <Footprints className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? 'طبيعة الدخول والتنقل' : 'Shore Entry & Access'}</span>
          </div>
          <p className="text-xs font-semibold text-[#F7F3EA]">
            {language === 'ar' ? place.shoreEntryLabelAr : place.shoreEntryLabel}
          </p>
          <div className="mt-2 text-[12px] text-[#D2E3DE]/70 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#D2E3DE]/50" />
            <span>{place.relationToCenter}</span>
          </div>
        </div>

        {/* 2. Live Weather & Marine Condition */}
        <div className="bg-[#13312B] rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#52C4B7] font-medium mb-1">
            <Wind className="w-3.5 h-3.5 text-[#52C4B7]" />
            <span>{language === 'ar' ? 'حالة البحر والرياح المعتمدة' : 'Verified Ocean & Wind'}</span>
          </div>
          <p className="text-xs font-semibold text-[#52C4B7]">
            {language === 'ar' ? conditionAssessment.badgeLabelAr : conditionAssessment.badgeLabel}
          </p>
          <div className="mt-2 text-[12px] text-[#D2E3DE]/70 flex items-center gap-1">
            <Sun className="w-3 h-3 text-[#F4C36C]" />
            <span>{INITIAL_LIVE_DAHAB_CONDITIONS.waterTempC}°C Sea · {INITIAL_LIVE_DAHAB_CONDITIONS.waterVisibilityMeters}m Vis</span>
          </div>
        </div>

        {/* 3. Sunset Anchor & Mood */}
        <div className="bg-[#13312B] rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#52C4B7] font-medium mb-1">
            <Sun className="w-3.5 h-3.5 text-[#F4C36C]" />
            <span>{language === 'ar' ? 'ساعة الغروب الذهبية' : 'Sunset Recommendation'}</span>
          </div>
          <p className="text-xs font-semibold text-[#F4C36C]">
            {place.bestSunsetType === 'social_sunset'
              ? (language === 'ar' ? 'غروب اجتماعي حيوي على الممشى' : 'Social Sunset on Seafront Promenade')
              : place.bestSunsetType === 'quiet_sunset'
              ? (language === 'ar' ? 'غروب هادئ جداً على شلتات البحر' : 'Quiet Sunset on Barefoot Beach Cushions')
              : place.bestSunsetType === 'desert_sunset'
              ? (language === 'ar' ? 'غروب صحراوي ساحر بين الجبال' : 'Desert Sunset with Bedouin Fireplace')
              : (language === 'ar' ? 'غروب فيروزي على لسان البحر' : 'Open Horizon Sea Sunset')}
          </p>
          <div className="mt-2 text-[12px] text-[#D2E3DE]/70 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D2E3DE]/50" />
            <span>{language === 'ar' ? 'موعد الغروب: ' : 'Sunset at '} {INITIAL_LIVE_DAHAB_CONDITIONS.sunsetTimeStr}</span>
          </div>
        </div>

      </div>

      {/* Food Near Activity Finish Banner */}
      {nearbyFoods.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#F4C36C] shrink-0" />
            <span className="text-[#D2E3DE]/80">
              {language === 'ar' ? 'أقرب مطعم معتمد بعد نشاطك: ' : 'Verified food near activity finish: '}
              <strong className="text-[#F7F3EA]">
                {language === 'ar' ? nearbyFoods[0].nameAr : nearbyFoods[0].name}
              </strong>{' '}
              ({nearbyFoods[0].walkingMinutesFromReefs[place.id] || 3} min walk · {nearbyFoods[0].priceLevel})
            </span>
          </div>

          <button
            onClick={onOpenFoodNow || (() => navigateTo('/food'))}
            className="text-[#F4C36C] hover:text-[#E5B55D] font-bold inline-flex items-center gap-1 transition cursor-pointer"
          >
            {language === 'ar' ? 'عرض خيارات الأكل' : 'View Food Options'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
