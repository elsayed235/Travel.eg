import React from 'react';
import { ChevronRight, MapPin, BedDouble, Users, Heart } from 'lucide-react';
import type { AccommodationEntity, PropertyType } from '../../shared/types/commerce';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';

const CATEGORY_LABEL: Record<AccommodationEntity['category'], { en: string; ar: string }> = {
  'budget': { en: 'Budget', ar: 'ميزانية' },
  'mid-range': { en: 'Mid-range', ar: 'متوسط' },
  'boutique': { en: 'Boutique', ar: 'بوتيك' },
  'resort': { en: 'Resort', ar: 'منتجع' },
};

export const PROPERTY_TYPE_LABEL: Record<PropertyType, { en: string; ar: string }> = {
  hotel: { en: 'Hotel', ar: 'فندق' },
  hostel: { en: 'Hostel', ar: 'نُزل' },
  apartment: { en: 'Apartment', ar: 'شقة' },
  studio: { en: 'Studio', ar: 'استوديو' },
  villa: { en: 'Villa', ar: 'فيلا' },
  guesthouse: { en: 'Guesthouse', ar: 'بيت ضيافة' },
  camp: { en: 'Camp', ar: 'مخيم' },
  'eco-lodge': { en: 'Eco-lodge', ar: 'نُزل بيئي' },
  'boutique-hotel': { en: 'Boutique hotel', ar: 'فندق بوتيك' },
  resort: { en: 'Resort', ar: 'منتجع' },
};

const BAND_ACCENT: Record<AccommodationEntity['priceBand'], string> = {
  budget: '#7a8c5c',
  moderate: '#c97b3c',
  premium: '#7a6a4a',
};

const HOTEL_IMAGES: Record<string, string> = {
  'jaz-dahabeya': '/images/hotels/le-meridien.jpg',
  'safir-dahab-resort': '/images/hotels/le-meridien-2.jpg',
  'the-bridge-dahab-hotel': '/images/hotels/el-primo.jpg',
  'brother-hotel-dahab': '/images/hotels/ganet-sinai.jpg',
  'dahab-paradise-hotel': '/images/hotels/dahab-paradise.jpg',
  'sheikh-ali-dahab-resort': '/images/hotels/bedouin-moon.jpg',
  'tree-house-hotel-dahab': '/images/hotels/daniela-village.jpg',
  'tropitel-dahab-oasis': '/images/hotels/tropitel-dahab-oasis.jpg',
  'dahab-lagoon-club-resort': '/images/hotels/ibis-styles-lagoon.jpg',
  'swiss-inn-resort-dahab': '/images/hotels/swiss-inn-resort.jpg',
  'penguin-village-dahab': '/images/hotels/ghazala-hotel.jpg',
  'carmine-hotel-dahab': '/images/hotels/red-rock.jpg',
  'golden-europe-hotel': '/images/hotels/sindbad-camp.jpg',
};

const FALLBACK_IMAGE = '/images/hotels/swiss-inn-resort.jpg';

interface AccommodationCardProps {
  accommodation: AccommodationEntity;
  isDark: boolean;
  onOpen: (slug: string) => void;
  /** Larger image, bigger title, room for a longer tagline — used for the
   *  single top-pick slot above the regular grid (see AccommodationsView). */
  featured?: boolean;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = React.memo(({ accommodation, isDark, onOpen, featured = false }) => {
  const { language, t } = useLanguage();
  const { savedItems, toggleSaveItem } = useTrip();
  const isAr = language === 'ar';
  const chipped = isAr ? (accommodation.typeChipsAr?.length ? accommodation.typeChipsAr : accommodation.typeChips) : accommodation.typeChips;
  const image = HOTEL_IMAGES[accommodation.slug] || FALLBACK_IMAGE;
  const typeLabel = PROPERTY_TYPE_LABEL[accommodation.propertyType];
  const isSaved = savedItems.includes(accommodation.id);
  const isStayLike = accommodation.propertyType === 'hotel' || accommodation.propertyType === 'resort' || accommodation.propertyType === 'boutique-hotel';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`rounded-3xl border overflow-hidden transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300 group shadow-sm hover:shadow-xl aurora-hover ${
        isDark
          ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50'
          : 'bg-white border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
      } ${featured ? 'sm:flex sm:flex-row' : ''}`}
    >
      <div className={`relative overflow-hidden bg-[var(--surface-container)] flex items-end p-4 ${featured ? 'h-64 sm:h-auto sm:w-[46%] shrink-0' : 'h-60 w-full'}`}>
        <img
          src={image}
          alt={isAr ? accommodation.nameAr : accommodation.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            {featured && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] shadow-xs">
                {isAr ? 'الأعلى تقييمًا' : 'Top pick'}
              </span>
            )}
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs"
              style={{ color: '#ffffff', backgroundColor: `${BAND_ACCENT[accommodation.priceBand]}cc` }}
            >
              {isAr ? typeLabel.ar : typeLabel.en}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs">
            <span className="text-amber-300">★</span>
            {accommodation.rating.toFixed(1)}
            <span className="text-white/70">({accommodation.reviewCount})</span>
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleSaveItem(accommodation.id); }}
          aria-label={isSaved ? (isAr ? 'إزالة من المحفوظات' : 'Remove from saved') : (isAr ? 'حفظ الإقامة' : 'Save stay')}
          className={`absolute z-10 top-3.5 ${isAr ? 'left-3.5' : 'right-3.5'} p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-[background-color,border-color,color,box-shadow,transform,opacity] cursor-pointer active:scale-90 ${
            isSaved
              ? 'bg-[var(--accent-secondary)] text-[var(--accent-secondary-ink)] shadow-md'
              : 'bg-black/45 text-white hover:bg-black/60 backdrop-blur-md'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className={`p-4 ${featured ? 'sm:p-6 sm:flex sm:flex-col sm:justify-center' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-display font-semibold leading-snug line-clamp-2 ${featured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
            {isAr ? accommodation.nameAr : accommodation.name}
          </h3>
        </div>

        <div className={`mt-1.5 flex items-center gap-1.5 text-xs flex-wrap ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
          <MapPin className="w-3.5 h-3.5" />
          {isAr ? accommodation.areaNameAr : accommodation.areaName}
          <span className={`flex items-center gap-1 ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[var(--text-secondary)]/60'}`}>
            <span className="mx-0.5">
              {isStayLike ? <BedDouble className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
            </span>
            {isStayLike ? accommodation.rooms : `${accommodation.maxGuests} ${isAr ? 'ضيوف' : 'guests'}`}
          </span>
        </div>

        {accommodation.tagline && (
          <p className={`text-xs mt-2 leading-relaxed ${featured ? 'sm:text-sm sm:line-clamp-3' : 'line-clamp-2'} ${isDark ? 'text-[var(--text-secondary)]/75' : 'text-[var(--text-secondary)]'}`}>
            {isAr ? accommodation.taglineAr || accommodation.tagline : accommodation.tagline}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {chipped.slice(0, featured ? 5 : 3).map((c, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-black ${featured ? 'text-base' : 'text-sm'} ${isDark ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
              {accommodation.perNightEGP.toLocaleString()} EGP
            </span>
            <span className={`text-[11px] ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]/70'}`}>
              / {isAr ? 'الليلة' : 'night'}
            </span>
          </div>
          {accommodation.packageNights > 1 && (
            <span className={`text-[10.5px] ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[var(--text-secondary)]/60'}`}>
              {isAr ? `باقة ${accommodation.packageNights} ليالٍ` : `${accommodation.packageNights}-night pkg`} · {accommodation.packageTotalEGP.toLocaleString()} EGP
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpen(accommodation.slug)}
          className="mt-4 w-full py-2.5 min-h-[44px] rounded-xl text-xs font-bold border transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center justify-center gap-1.5 cursor-pointer bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20"
        >
          {t('hotels.viewStay')}
          <ChevronRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
});
