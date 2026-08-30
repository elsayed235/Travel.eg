import React from 'react';
import { DahabIcon } from './DahabIcons';
import { DahabMotif } from './DahabMotifs';
import { useLanguage } from '../../i18n/LanguageContext';

export interface DahabLoadingScreenProps {
  message?: string;
  subtext?: string;
  fullscreen?: boolean;
}

/**
 * DAHAB VISUAL LANGUAGE SYSTEM
 * Organic Loading Screen Primitive with Wave Rhythm
 */
export const DahabLoadingScreen: React.FC<DahabLoadingScreenProps> = ({
  message,
  subtext,
  fullscreen = false,
}) => {
  const { t, isRTL } = useLanguage();

  const displayMessage = message || t('loading.tripBuilding', 'Finding your Dahab rhythm...');
  const displaySubtext = subtext || t('loading.tripSub', 'Syncing tides, trusted Bedouin guides & golden-hour timing');

  const containerClasses = fullscreen
    ? 'fixed inset-0 z-50 bg-[#04171D] text-[#F7F3EA] flex flex-col items-center justify-center p-6'
    : 'w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-[#04171D]/90 text-[#F7F3EA] rounded-3xl border border-[#20A89A]/20 shadow-xl';

  return (
    <div className={containerClasses} role="status" aria-live="polite" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Topo Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <DahabMotif name="topo-contour" className="text-[#20A89A]/30" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm">
        {/* Pulsing Dahab Icon Container */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#062C35] border border-[#20A89A]/40 text-[#20A89A] flex items-center justify-center shadow-lg animate-pulse">
            <DahabIcon name="diver" size={32} accent />
          </div>
          {/* Subtle Orbiting Gold Ring */}
          <div className="absolute -inset-1 rounded-2xl border border-[#E7A83B]/30 animate-spin [animation-duration:8s] pointer-events-none" />
        </div>

        {/* Text */}
        <div className="space-y-1 text-center">
          <h4 className="text-base sm:text-lg font-bold text-[#F7F3EA] font-['Outfit',sans-serif]">
            {displayMessage}
          </h4>
          <p className="text-xs text-[#E7D3AE]/80">
            {displaySubtext}
          </p>
        </div>

        {/* Organic Wave Divider Indicator */}
        <div className="w-48 text-[#20A89A]/40 pt-2">
          <DahabMotif name="wave-divider" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};
