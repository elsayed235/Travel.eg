import React from 'react';
import { DahabIcon } from './DahabIcons';
import { useLanguage } from '../../i18n/LanguageContext';

export interface WindData {
  speedKnots: number;
  directionDeg: number;
  directionLabel: string;
  directionLabelAr?: string;
  condition: string;
  conditionAr?: string;
}

export interface SwellData {
  heightMeters: number;
  state: 'Glassy' | 'Gentle Ripple' | 'Moderate Chop' | 'Active Swell';
  stateAr?: string;
}

export interface VisibilityData {
  depthMeters: number;
  quality: 'Ultra Crystal' | 'Excellent' | 'Good' | 'Moderate';
  qualityAr?: string;
}

export interface TempData {
  airCelsius: number;
  waterCelsius: number;
}

/**
 * 1. Circular Wind Gauge with Rotating Kinetic Vector
 */
export const WindGauge: React.FC<{ data: WindData; className?: string }> = ({
  data,
  className = '',
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const getWindColor = (kn: number) => {
    if (kn < 9) return 'text-[#20A89A] border-[#20A89A]/30 bg-[#20A89A]/10';
    if (kn < 18) return 'text-[#0F6F78] border-[#0F6F78]/30 bg-[#0F6F78]/10';
    if (kn < 26) return 'text-[#E7A83B] border-[#E7A83B]/30 bg-[#E7A83B]/10';
    return 'text-[#D96C4F] border-[#D96C4F]/30 bg-[#D96C4F]/10';
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`flex items-center gap-3 p-3 rounded-2xl border border-dahab-ink/10 bg-white/60 backdrop-blur-sm ${className}`}>
      {/* Rotating Arrow Compass */}
      <div className={`relative w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-transform ${getWindColor(data.speedKnots)}`}>
        <div
          className="transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${data.directionDeg}deg)` }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
            <path d="M12 2L18 19L12 15L6 19L12 2Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-dahab-ink-secondary">
            {isAr ? `الرياح · ${data.directionLabelAr || data.directionLabel}` : `Wind · ${data.directionLabel}`}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-dahab-ink font-mono">
            {data.speedKnots} <span className="text-xs font-medium text-dahab-ink-secondary">{isAr ? 'عقدة' : 'kn'}</span>
          </span>
          <span className="text-[12px] font-semibold text-dahab-teal">
            ({isAr ? (data.conditionAr || data.condition) : data.condition})
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Wave & Sea Swell Instrument Bar
 */
export const WaveSwellBar: React.FC<{ data: SwellData; className?: string }> = ({
  data,
  className = '',
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const stateMapAr: Record<string, string> = {
    'Glassy': 'هادئ كالزجاج',
    'Gentle Ripple': 'تموجات لطيفة',
    'Moderate Chop': 'موج خفيف معتدل',
    'Active Swell': 'موج نشط',
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`flex items-center gap-3 p-3 rounded-2xl border border-dahab-ink/10 bg-white/60 backdrop-blur-sm ${className}`}>
      <div className="w-10 h-10 rounded-full bg-[#0F6F78]/10 text-[#0F6F78] border border-[#0F6F78]/25 flex items-center justify-center flex-shrink-0">
        <DahabIcon name="wave" size={20} />
      </div>

      <div className="space-y-0.5">
        <span className="text-xs font-bold uppercase tracking-wider text-dahab-ink-secondary">
          {isAr ? 'حالة البحر والمد' : 'Sea Swell & Tides'}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-dahab-ink font-mono">
            {data.heightMeters} <span className="text-xs font-medium text-dahab-ink-secondary">{isAr ? 'م' : 'm'}</span>
          </span>
          <span className="text-[12px] font-semibold text-[#0F6F78]">
            · {isAr ? (data.stateAr || stateMapAr[data.state] || data.state) : data.state}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Submarine Visibility Depth Meter
 */
export const VisibilityMeter: React.FC<{ data: VisibilityData; className?: string }> = ({
  data,
  className = '',
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const qualityMapAr: Record<string, string> = {
    'Ultra Crystal': 'رؤية بلورية فائقة',
    'Excellent': 'ممتازة جداً',
    'Good': 'جيدة',
    'Moderate': 'متوسطة',
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`flex items-center gap-3 p-3 rounded-2xl border border-dahab-ink/10 bg-white/60 backdrop-blur-sm ${className}`}>
      <div className="w-10 h-10 rounded-full bg-[#20A89A]/15 text-[#15796E] border border-[#20A89A]/30 flex items-center justify-center flex-shrink-0">
        <DahabIcon name="fin" size={20} />
      </div>

      <div className="space-y-0.5">
        <span className="text-xs font-bold uppercase tracking-wider text-dahab-ink-secondary">
          {isAr ? 'وضوح الرؤية تحت الماء' : 'Underwater Clarity'}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-dahab-ink font-mono">
            {data.depthMeters} <span className="text-xs font-medium text-dahab-ink-secondary">{isAr ? 'م' : 'm'}</span>
          </span>
          <span className="text-[12px] font-semibold text-[#15796E]">
            · {isAr ? (data.qualityAr || qualityMapAr[data.quality] || data.quality) : data.quality}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Dual Air vs Sea Water Temperature
 */
export const DualTempMeter: React.FC<{ data: TempData; className?: string }> = ({
  data,
  className = '',
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`flex items-center gap-3 p-3 rounded-2xl border border-dahab-ink/10 bg-white/60 backdrop-blur-sm ${className}`}>
      <div className="w-10 h-10 rounded-full bg-[#E7A83B]/15 text-[#A86F14] border border-[#E7A83B]/30 flex items-center justify-center flex-shrink-0">
        <DahabIcon name="sun" size={20} />
      </div>

      <div className="space-y-0.5">
        <span className="text-xs font-bold uppercase tracking-wider text-dahab-ink-secondary">
          {isAr ? 'حرارة الجو والبحر' : 'Air & Sea Temp'}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-dahab-ink font-mono">
            {data.airCelsius}°C <span className="text-xs font-normal text-dahab-ink-muted">{isAr ? 'الجو' : 'Air'}</span>
          </span>
          <span className="text-xs font-bold text-[#0F6F78] font-mono">
            / {data.waterCelsius}°C <span className="text-[11px] font-normal text-dahab-ink-muted">{isAr ? 'البحر' : 'Sea'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. Composite Sinai Marine Instrument Strip
 */
export const SinaiMarineInstrumentStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 ${className}`}>
      <WindGauge
        data={{
          speedKnots: 17,
          directionDeg: 35,
          directionLabel: 'NNE',
          directionLabelAr: 'شمال شرق',
          condition: 'Lagoon Windsurfing Ready',
          conditionAr: 'مثالي للشراع والكايت باللاجونا',
        }}
      />
      <WaveSwellBar
        data={{
          heightMeters: 0.3,
          state: 'Gentle Ripple',
          stateAr: 'تموجات هادئة ولطيفة',
        }}
      />
      <VisibilityMeter
        data={{
          depthMeters: 32,
          quality: 'Ultra Crystal',
          qualityAr: 'رؤية بلورية فائقة',
        }}
      />
      <DualTempMeter
        data={{
          airCelsius: 28,
          waterCelsius: 24,
        }}
      />
    </div>
  );
};

