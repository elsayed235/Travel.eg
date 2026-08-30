import React from 'react';
import { Check, Sparkles, ShieldCheck, Clock, Users, Luggage, Car, Zap } from 'lucide-react';
import { TransferOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface TransferOptionCardProps {
  transfer: TransferOption;
  isSelected: boolean;
  onSelect: (transferId: string) => void;
}

export const TransferOptionCard: React.FC<TransferOptionCardProps> = ({
  transfer,
  isSelected,
  onSelect,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const title = isAr && transfer.titleAr ? transfer.titleAr : transfer.title;
  const vehicleType = isAr && transfer.vehicleTypeAr ? transfer.vehicleTypeAr : transfer.vehicleType;
  const description = isAr && transfer.descriptionAr ? transfer.descriptionAr : transfer.description;
  const capacity = isAr && transfer.capacityAr ? transfer.capacityAr : transfer.capacity;
  const luggage = isAr && transfer.luggageAr ? transfer.luggageAr : transfer.luggage;
  const estimatedTime = isAr && transfer.estimatedTimeAr ? transfer.estimatedTimeAr : transfer.estimatedTime;
  const features = isAr && transfer.featuresAr ? transfer.featuresAr : transfer.features;
  const badgeLabel = isAr && transfer.badgeLabelAr ? transfer.badgeLabelAr : transfer.badgeLabel;

  const getBadgeStyle = () => {
    switch (transfer.badgeType) {
      case 'recommended':
        return 'bg-[#F4C36C]/20 text-[#F4C36C] border-[#F4C36C]/40';
      case 'value':
        return 'bg-[#20A89A]/20 text-[#52C4B7] border-[#20A89A]/40';
      case 'comfort':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-white/10 text-[#D2E3DE] border-white/10';
    }
  };

  return (
    <div
      id={`transfer-card-${transfer.id}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={() => onSelect(transfer.id)}
      className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-[#0E2520] text-[#F7F3EA] cursor-pointer relative ${
        isSelected
          ? 'border-[#20A89A] ring-2 ring-[#20A89A]/30 shadow-lg'
          : transfer.badgeType === 'recommended'
          ? 'border-[#F4C36C]/40 hover:border-[#F4C36C] shadow-md'
          : 'border-white/10 hover:border-white/20 shadow-md'
      }`}
    >
      {/* Recommended/Highlight Top Banner if applicable */}
      {transfer.badgeType === 'recommended' && (
        <div className="bg-[#13312B] border-b border-[#F4C36C]/30 px-5 sm:px-6 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4C36C]">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C36C] fill-[#F4C36C]" />
            <span>{isAr ? 'مرشح ومثالي لرحلتك' : 'Recommended for your trip'}</span>
          </div>
          <span className="text-[12px] font-medium text-[#F4C36C]/80 hidden sm:inline">
            {isAr ? 'انتقال مباشر ومريح للمسافرين الاثنين معاً' : 'Direct and convenient for 2 travelers sharing'}
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Image & Badges (md:col-span-4) */}
        <div className="md:col-span-4 relative">
          <div className="relative h-44 sm:h-48 md:h-52 w-full rounded-2xl overflow-hidden bg-black/40">
            <img
              src={transfer.image}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />

            {/* Top Badge */}
            {badgeLabel && (
              <div
                className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-[12px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-xs ${getBadgeStyle()}`}
              >
                {badgeLabel}
              </div>
            )}

            {/* Selected Status Overlay badge */}
            {isSelected && (
              <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} bg-[#20A89A] text-[#081714] text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md animate-in zoom-in-90 duration-150`}>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isAr ? 'تم الاختيار' : 'Selected'}</span>
              </div>
            )}

            {/* Estimated Duration Pill */}
            <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} bg-black/75 backdrop-blur-md text-white text-[12px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs border border-white/10`}>
              <Clock className="w-3 h-3 text-[#F4C36C]" />
              <span>{estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Description, Included Features, Price & Action (md:col-span-8) */}
        <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
          <div>
            {/* Header: Title & Price */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA]">
                  {title}
                </h3>
                <p className="text-xs text-[#D2E3DE]/70 flex items-center gap-1.5 mt-0.5 font-medium">
                  <Car className="w-3.5 h-3.5 text-[#52C4B7]" />
                  <span>{vehicleType}</span>
                </p>
              </div>

              <div className="text-start sm:text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-2xl font-black text-[#F4C36C]">
                    {transfer.priceEGP.toLocaleString()} {isAr ? 'جنيه' : 'EGP'}
                  </span>
                </div>
                <div className="text-[12px] text-[#D2E3DE]/60 font-medium">
                  {isAr ? 'إجمالي للمسافرين الاثنين' : 'Total for 2 travelers'}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#D2E3DE]/90 mt-2 leading-relaxed font-normal">
              {description}
            </p>

            {/* Quick Spec Pills */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#13312B] border border-white/10 text-[#D2E3DE] font-medium">
                <Users className="w-3.5 h-3.5 text-[#52C4B7]" />
                <span>{capacity}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#13312B] border border-white/10 text-[#D2E3DE] font-medium">
                <Luggage className="w-3.5 h-3.5 text-[#52C4B7]" />
                <span>{luggage}</span>
              </span>
            </div>

            {/* Key Features List */}
            <ul className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#D2E3DE]/80">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52C4B7] flex-shrink-0" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Card Action Bar */}
          <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="text-[12px] text-[#D2E3DE]/70 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#52C4B7]" />
              <span>{isAr ? 'استقبال مباشر من مطار شرم الشيخ' : 'Direct Sharm Airport pickup'}</span>
            </div>

            <button
              type="button"
              id={`select-transfer-btn-${transfer.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(transfer.id);
              }}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] font-bold shadow-md'
                  : 'bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold hover:shadow-xs'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isAr ? 'تم الاختيار ✓' : 'Selected ✓'}</span>
                </>
              ) : (
                <span>{isAr ? 'اختيار وسيلة الانتقال' : 'Select this transfer'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

