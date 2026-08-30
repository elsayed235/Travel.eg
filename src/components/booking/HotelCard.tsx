import React from 'react';
import { 
  Star, 
  MapPin, 
  Check, 
  Sparkles, 
  Waves, 
  Info, 
  BedDouble, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { HotelOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface HotelCardProps {
  hotel: HotelOption;
  isSelected: boolean;
  onSelect: (hotelId: string) => void;
  onViewDetails: (hotel: HotelOption) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isSelected,
  onSelect,
  onViewDetails,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const hotelName = isAr && hotel.nameAr ? hotel.nameAr : hotel.name;
  const hotelLoc = isAr && hotel.locationAr ? hotel.locationAr : hotel.location;
  const hotelDesc = isAr && hotel.descriptionAr ? hotel.descriptionAr : hotel.description;
  const hotelReason = isAr && hotel.recommendationReasonAr ? hotel.recommendationReasonAr : hotel.recommendationReason;
  const hotelRoomType = isAr && hotel.roomTypeAr ? hotel.roomTypeAr : hotel.roomType;
  const hotelDistance = isAr && hotel.distanceToDivingAr ? hotel.distanceToDivingAr : hotel.distanceToDiving;
  const hotelNeighborhood = isAr && hotel.neighborhoodAr ? hotel.neighborhoodAr : hotel.neighborhood;
  const hotelAmenities = isAr && hotel.amenitiesAr ? hotel.amenitiesAr : hotel.amenities;
  const hotelStatus = isAr && hotel.availabilityStatusAr ? hotel.availabilityStatusAr : hotel.availabilityStatus;

  return (
    <div
      id={`hotel-card-${hotel.id}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-[#0E2520] text-[#F7F3EA] ${
        isSelected
          ? 'border-[#20A89A] ring-2 ring-[#20A89A]/30 shadow-lg'
          : hotel.isRecommended
          ? 'border-[#F4C36C]/40 hover:border-[#F4C36C] shadow-md'
          : 'border-white/10 hover:border-white/20 shadow-md'
      }`}
    >
      {/* Recommended Header Bar */}
      {hotel.isRecommended && (
        <div className="bg-[#13312B] border-b border-[#F4C36C]/30 px-5 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F4C36C]">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C36C] fill-[#F4C36C]" />
            <span>{isAr ? 'مرشح ومثالي لرحلتك' : 'Recommended for your trip'}</span>
          </div>
          <span className="text-[12px] font-medium text-[#F4C36C]/80 hidden sm:inline">
            {hotelReason}
          </span>
        </div>
      )}

      {/* Main Card Grid */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hotel Image (md:col-span-5) */}
        <div className="md:col-span-5 relative">
          <div className="relative h-52 sm:h-56 md:h-64 w-full rounded-2xl overflow-hidden bg-black/40">
            <img
              src={hotel.image}
              alt={hotelName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />

            {/* Rating badge — only when there is a measured rating. */}
            {typeof hotel.rating === 'number' && (
            <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-black/75 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-white/10`}>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
              {typeof hotel.reviewCount === 'number' && (
                <span className="text-white/70 text-[11px] font-normal">({hotel.reviewCount})</span>
              )}
            </div>
            )}

            {/* Selected Status Overlay badge */}
            {isSelected && (
              <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} bg-[#20A89A] text-[#081714] text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md animate-in zoom-in-90 duration-150`}>
                <Check className="w-3.5 h-3.5" />
                <span>{isAr ? 'تم الاختيار' : 'Selected'}</span>
              </div>
            )}

            {/* Neighborhood Pill */}
            <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} bg-[#081714]/85 backdrop-blur-md text-[#F7F3EA] text-[12px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow-xs`}>
              <MapPin className="w-3 h-3 text-[#52C4B7]" />
              <span>{hotelNeighborhood}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hotel Details & Pricing (md:col-span-7) */}
        <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            {/* Title & Location */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA] leading-tight">
                  {hotelName}
                </h3>
                <p className="text-xs text-[#D2E3DE]/70 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#52C4B7]" />
                  <span>{hotelLoc}</span>
                </p>
              </div>

              {/* Mobile quick price indicator */}
              <div className="md:hidden text-start">
                <div className="text-lg font-black text-[#F4C36C]">
                  {hotel.priceTotalEGP.toLocaleString()} {isAr ? 'جنيه' : 'EGP'}
                </div>
                <div className="text-[11px] text-[#D2E3DE]/60 font-medium">{isAr ? 'إجمالي ٥ ليالي' : 'total for 5 nights'}</div>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#D2E3DE]/90 mt-2.5 leading-relaxed font-normal">
              {hotelDesc}
            </p>

            {/* Room Type & Proximity Note */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#13312B] border border-white/10 text-[#F7F3EA] font-semibold">
                <BedDouble className="w-3.5 h-3.5 text-[#52C4B7]" />
                <span>{hotelRoomType}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#13312B] border border-white/10 text-[#D2E3DE]/80 font-medium text-[12px]">
                <Waves className="w-3 h-3 text-[#52C4B7]" />
                <span>{hotelDistance}</span>
              </span>
            </div>

            {/* Key Amenities */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#D2E3DE]/80 flex-wrap">
              <span className="font-semibold text-[#F7F3EA]">{isAr ? 'المميزات:' : 'Amenities:'}</span>
              <span>{hotelAmenities.slice(0, 4).join(' · ')}</span>
            </div>

            {/* Availability Status */}
            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#52C4B7] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20A89A] inline-block animate-pulse" />
              <span>{hotelStatus}</span>
            </div>
          </div>

          {/* Pricing Row & Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Pricing Details */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#F4C36C]">
                  {hotel.priceTotalEGP.toLocaleString()} {isAr ? 'جنيه' : 'EGP'}
                </span>
                <span className="text-xs font-bold text-[#D2E3DE]/60 uppercase tracking-wide">
                  {isAr ? 'الإجمالي' : 'total'}
                </span>
              </div>
              <div className="text-xs text-[#D2E3DE]/70 font-medium">
                {isAr ? '٥ ليالي · فردين' : '5 nights · 2 adults'} <span className="text-white/20">|</span> {hotel.pricePerNightEGP.toLocaleString()} {isAr ? 'جنيه / الليلة' : 'EGP / night'}
              </div>
            </div>

            {/* Buttons: View details & Select */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                id={`hotel-view-details-btn-${hotel.id}`}
                onClick={() => onViewDetails(hotel)}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-[#D2E3DE] hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isAr ? 'عرض التفاصيل' : 'View details'}</span>
              </button>

              <button
                type="button"
                id={`hotel-select-btn-${hotel.id}`}
                onClick={() => onSelect(hotel.id)}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] font-bold shadow-lg shadow-[#20A89A]/20'
                    : 'bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold hover:shadow'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isAr ? 'تم الاختيار ✓' : 'Selected ✓'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'اختيار' : 'Select'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

