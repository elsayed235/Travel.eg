import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Waves, 
  Wifi, 
  Coffee, 
  Wind, 
  Calendar, 
  Users, 
  Clock, 
  BedDouble, 
  Maximize2, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { HotelOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface HotelDetailModalProps {
  hotel: HotelOption | null;
  isSelected: boolean;
  onSelect: (hotelId: string) => void;
  onClose: () => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  isSelected,
  onSelect,
  onClose,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!hotel) return null;

  const images = hotel.galleryImages && hotel.galleryImages.length > 0
    ? hotel.galleryImages
    : [hotel.image];

  const hotelName = isAr && hotel.nameAr ? hotel.nameAr : hotel.name;
  const hotelLoc = isAr && hotel.locationAr ? hotel.locationAr : hotel.location;
  const hotelDetailedDesc = isAr && hotel.detailedDescriptionAr ? hotel.detailedDescriptionAr : hotel.detailedDescription;
  const hotelReason = isAr && hotel.recommendationReasonAr ? hotel.recommendationReasonAr : hotel.recommendationReason;
  const hotelRoomType = isAr && hotel.roomTypeAr ? hotel.roomTypeAr : hotel.roomType;
  const hotelBedConfig = isAr && hotel.bedConfigAr ? hotel.bedConfigAr : hotel.bedConfig;
  const hotelDistanceDive = isAr && hotel.distanceToDivingAr ? hotel.distanceToDivingAr : hotel.distanceToDiving;
  const hotelDistanceCoast = isAr && hotel.distanceToCoastAr ? hotel.distanceToCoastAr : hotel.distanceToCoast;
  const hotelNeighborhood = isAr && hotel.neighborhoodAr ? hotel.neighborhoodAr : hotel.neighborhood;
  const hotelAmenities = isAr && hotel.amenitiesAr ? hotel.amenitiesAr : hotel.amenities;
  const hotelIncluded = isAr && hotel.includedItemsAr ? hotel.includedItemsAr : hotel.includedItems;
  const hotelPolicy = isAr && hotel.cancellationPolicyAr ? hotel.cancellationPolicyAr : hotel.cancellationPolicy;

  return (
    <div
      id="hotel-detail-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={hotel.name}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="hotel-detail-modal-card"
        dir={isRTL ? 'rtl' : 'ltr'}
        className="bg-[#0E2520] text-[#F7F3EA] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-white/15 my-auto relative max-h-[90vh] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E2520] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#52C4B7] bg-[#13312B] border border-white/10 px-2.5 py-1 rounded-full">
              {isAr ? 'ضمن رحلتك لدهب · الخطوة الأولى' : 'Part of your Dahab trip · Step 01'}
            </span>
            {hotel.isRecommended && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[12px] font-bold text-[#F4C36C] bg-[#F4C36C]/20 border border-[#F4C36C]/40 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-[#F4C36C]" />
                {isAr ? 'مرشح ومثالي لرحلتك' : 'Recommended for your trip'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close hotel details"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#D2E3DE] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Hotel Gallery View */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-xs">
              <img
                src={images[activeImageIndex] || hotel.image}
                alt={hotelName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex items-center gap-2`}>
                {typeof hotel.rating === 'number' && (
                <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-[#F4C36C] text-[#F4C36C]" />
                  <span>{hotel.rating}</span>
                  {typeof hotel.reviewCount === 'number' && (
                    <span className="text-white/70 text-[12px] font-normal">({hotel.reviewCount} {isAr ? 'تقييم' : 'reviews'})</span>
                  )}
                </div>
                )}
              </div>

              <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} bg-black/75 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10`}>
                <MapPin className="w-3.5 h-3.5 text-[#F4C36C]" />
                <span>{hotelLoc}</span>
              </div>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#20A89A] ring-2 ring-[#20A89A]/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${hotelName} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hotel Title & Key Quick Fit */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA]">
                  {hotelName}
                </h2>
                <p className="text-sm text-[#D2E3DE]/70 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#52C4B7]" />
                  <span>{hotelLoc} · {hotelNeighborhood}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-2xl font-black text-[#F4C36C]">
                  {hotel.priceTotalEGP.toLocaleString()} {isAr ? 'جنيه' : 'EGP'}
                </div>
                <div className="text-xs text-[#D2E3DE]/60 font-medium">
                  {hotel.pricePerNightEGP.toLocaleString()} {isAr ? 'جنيه/ليلة · إجمالي ٥ ليالي' : 'EGP/night · 5 nights total'}
                </div>
              </div>
            </div>

            {hotel.isRecommended && (
              <div className="mt-4 p-4 rounded-2xl bg-[#13312B] border border-[#F4C36C]/30 text-xs sm:text-sm text-[#F7F3EA] flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F4C36C]/20 text-[#F4C36C] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F4C36C]/40">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-[#F4C36C] mb-0.5">
                    {isAr ? 'لماذا تم ترشيح هذا الفندق لرحلتك:' : 'Why we selected this for your Dahab trip:'}
                  </span>
                  <p className="text-[#D2E3DE]/90 leading-relaxed font-normal text-xs sm:text-sm">
                    {hotelReason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-[#13312B] p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#52C4B7]">
              {isAr ? 'عن هذا الفندق والإقامة' : 'About This Stay'}
            </h3>
            <p className="text-sm text-[#D2E3DE]/90 leading-relaxed font-normal">
              {hotelDetailedDesc}
            </p>
          </div>

          {/* Room Information & Bed Configuration */}
          <div className="bg-[#13312B] p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#52C4B7] flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-[#52C4B7]" />
              <span>{isAr ? 'تفاصيل الغرفة لشخصين بالغين' : 'Room Allocation for 2 Adults'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0E2520] border border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60 block">
                  {isAr ? 'نوع الغرفة' : 'Room Type'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#F7F3EA] block mt-0.5">
                  {hotelRoomType}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E2520] border border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60 block">
                  {isAr ? 'مساحة الغرفة' : 'Room Size'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#F7F3EA] block mt-0.5">
                  {hotel.roomSize}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E2520] border border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60 block">
                  {isAr ? 'توزيع الأسرة' : 'Beds'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#F7F3EA] block mt-0.5">
                  {hotelBedConfig}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Proximity */}
          <div className="bg-[#13312B] p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#52C4B7]">
              {isAr ? 'موقع الفندق والقرب من الأنشطة' : 'Trip Convenience & Proximity'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0E2520] border border-white/10">
                <Waves className="w-4 h-4 text-[#52C4B7] flex-shrink-0" />
                <span className="text-[#D2E3DE]">{hotelDistanceCoast}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0E2520] border border-white/10">
                <Compass className="w-4 h-4 text-[#52C4B7] flex-shrink-0" />
                <span className="text-[#D2E3DE]">{hotelDistanceDive}</span>
              </div>
            </div>
          </div>

          {/* Key Amenities */}
          <div className="bg-[#13312B] p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#52C4B7]">
              {isAr ? 'المرافق والخدمات' : 'Amenities & Facilities'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {hotelAmenities.map((amenity, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-[#0E2520] border border-white/10 text-xs font-semibold text-[#D2E3DE] flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#52C4B7]" />
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          </div>

          {/* What's Included & Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#13312B] p-5 rounded-2xl border border-white/10 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#52C4B7]">
                {isAr ? 'ما تشمله الإقامة' : "What's Included"}
              </h3>
              <ul className="space-y-2 text-xs text-[#D2E3DE]">
                {hotelIncluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20A89A] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#13312B] p-5 rounded-2xl border border-white/10 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#52C4B7]">
                {isAr ? 'سياسة الإلغاء والمرونة' : 'Cancellation & Policy'}
              </h3>
              <div className="p-3.5 rounded-xl bg-[#0E2520] border border-[#20A89A]/30 text-xs text-[#D2E3DE] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#52C4B7]">
                  <ShieldCheck className="w-4 h-4 text-[#52C4B7]" />
                  <span>{isAr ? 'حجز مرن ومضمون' : 'Flexible Dahab Booking'}</span>
                </div>
                <p className="text-[12px] text-[#D2E3DE]/80 leading-relaxed">
                  {hotelPolicy}. {isAr ? 'يمكنك تعديل الحجز بسهولة مع تطور خطتك.' : 'Changes can be made as your trip plan evolves.'}
                </p>
              </div>

              <div className="text-[12px] text-[#D2E3DE]/60 space-y-1 pt-1">
                <p>• {isAr ? 'تسجيل الوصول: ١:٠٠ ظهراً (متوافق مع موعد وصولك)' : 'Check-in: 1:00 PM (Aligned with Day 1 transfer)'}</p>
                <p>• {isAr ? 'تسجيل المغادرة: ١١:٠٠ صباحاً (متوافق مع موعد العودة)' : 'Check-out: 11:00 AM (Aligned with Day 5 departure)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Select CTA */}
        <div className="p-5 border-t border-white/10 bg-[#0E2520] flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          <div>
            <span className="text-xs text-[#D2E3DE]/60 block">{isAr ? 'الإجمالي لإقامة ٥ ليالي (شخصين)' : 'Total for 5-night stay (2 adults)'}</span>
            <div className="text-xl font-black text-[#F4C36C]">
              {hotel.priceTotalEGP.toLocaleString()} {isAr ? 'جنيه' : 'EGP'} <span className="text-xs font-normal text-[#D2E3DE]/60">{isAr ? 'شامل كل الضرائب' : 'all taxes included'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-full text-xs font-bold text-[#D2E3DE] hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              {isAr ? 'العودة للفنادق' : 'Back to stays'}
            </button>

            <button
              type="button"
              id={`modal-select-hotel-${hotel.id}`}
              onClick={() => {
                onSelect(hotel.id);
                onClose();
              }}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] font-bold'
                  : 'bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'تم الاختيار ✓' : 'Selected ✓'}</span>
                </>
              ) : (
                <>
                  <span>{isAr ? 'اختيار هذا الفندق' : 'Select this stay'}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

