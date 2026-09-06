import React from 'react';
import { ChevronRight, MapPin, BedDouble } from 'lucide-react';
import type { HotelEntity } from '../../shared/types/commerce';
import { useLanguage } from '../../i18n/LanguageContext';

const CATEGORY_LABEL: Record<HotelEntity['category'], { en: string; ar: string }> = {
  'budget': { en: 'Budget', ar: 'ميزانية' },
  'mid-range': { en: 'Mid-range', ar: 'متوسط' },
  'boutique': { en: 'Boutique', ar: 'بوتيك' },
  'resort': { en: 'Resort', ar: 'منتجع' },
};

const BAND_ACCENT: Record<HotelEntity['priceBand'], string> = {
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

interface HotelCardProps {
  hotel: HotelEntity;
  isDark: boolean;
  onOpen: (slug: string) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, isDark, onOpen }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const chipped = isAr ? (hotel.typeChipsAr?.length ? hotel.typeChipsAr : hotel.typeChips) : hotel.typeChips;
  const hotelImage = HOTEL_IMAGES[hotel.slug] || '/images/hotels/swiss-inn-resort.jpg';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`rounded-2xl border overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-xl ${
        isDark
          ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50'
          : 'bg-white border-[#122420]/10 hover:border-[var(--accent-primary)]'
      }`}
    >
      {/* Header photo strip */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--surface-container)] flex items-end p-4">
        <img
          src={hotelImage}
          alt={isAr ? hotel.nameAr : hotel.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        {/* Scrim overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        <div className="relative z-10 flex items-center justify-between w-full">
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs"
            style={{ color: '#ffffff', backgroundColor: `${BAND_ACCENT[hotel.priceBand]}cc` }}
          >
            {isAr ? CATEGORY_LABEL[hotel.category].ar : CATEGORY_LABEL[hotel.category].en}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs">
            <span className="text-amber-300">★</span>
            {hotel.rating.toFixed(1)}
            <span className="text-white/70">({hotel.reviewCount})</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-serif font-bold text-base leading-snug line-clamp-2 ${isDark ? 'text-[var(--text-primary)]' : 'text-[#122420]'}`}>
            {isAr ? hotel.nameAr : hotel.name}
          </h3>
        </div>

        <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[#4A635D]'}`}>
          <MapPin className="w-3.5 h-3.5" />
          {isAr ? hotel.areaNameAr : hotel.areaName}
          <span className={`flex items-center gap-1 mr-1 ${isDark ? 'text-[var(--text-secondary)]/50' : 'text-[#4A635D]/60'}`}>
            <BedDouble className="w-3.5 h-3.5" />
            {hotel.rooms}
          </span>
        </div>

        {hotel.tagline && (
          <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/75' : 'text-[#4A635D]'}`}>
            {isAr ? hotel.taglineAr || hotel.tagline : hotel.tagline}
          </p>
        )}

        {/* Type chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {chipped.slice(0, 4).map((c, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className={`font-black text-sm ${isDark ? 'text-[var(--accent-primary)]' : 'text-[#122420]'}`}>
            {hotel.perNightEGP.toLocaleString()} EGP
          </span>
          <span className={`text-[11px] ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[#4A635D]/70'}`}>
            / night · {isAr ? 'باقة ٥ ليالٍ' : '5-night package'} {hotel.packageTotalEGP.toLocaleString()} EGP
          </span>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={() => onOpen(hotel.slug)}
          className="mt-4 w-full py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20"
        >
          {isAr ? 'عرض الفندق' : 'View stay'}
          <ChevronRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};