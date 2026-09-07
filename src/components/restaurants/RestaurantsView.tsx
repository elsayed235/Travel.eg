import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, Star, Clock, MapPin, ChevronRight, Heart,
  Filter, Bot, Info
} from 'lucide-react';
import { WhatsAppIcon } from '../common/icons/WhatsAppIcon';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import { toCuisineList } from '../../shared/diningVenue';

// ---------------------------------------------------------------------------
// Types (mirror askdahab.com restaurant shape)
// ---------------------------------------------------------------------------

interface Restaurant {
  id: string;
  name: string;
  nameAr: string;
  cuisine: string[];
  cuisineAr: string[];
  priceBand: 'Budget ($)' | 'Moderate ($$)' | 'Premium ($$$)';
  averageMealPriceEGP: number;
  rating?: number;
  reviewCount?: number;
  openingHours: string;
  openingHoursAr?: string;
  dietaryOptions: {
    vegan: boolean;
    vegetarian: boolean;
    halal: boolean;
    freshSeafoodCatch: boolean;
  };
  areaId: string;
  areaName?: string;
  areaNameAr?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  description?: string;
  descriptionAr?: string;
  coordinates?: { lat: number; lng: number };
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  language: 'en' | 'ar';
  isDark: boolean;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

function priceTierLabel(band: Restaurant['priceBand'], language: 'en' | 'ar'): string {
  if (language === 'ar') {
    if (band === 'Budget ($)') return 'ميزانية ($)';
    if (band === 'Moderate ($$)') return 'متوسط ($$)';
    return 'فاخر ($$$)';
  }
  return band;
}

const RESTAURANT_FALLBACK_IMAGES = [
  '/images/restaurants/ali-baba-restaurant.jpg',
  '/images/restaurants/the-roof-restaurant.jpg',
  '/images/restaurants/boho-beach-cafe.jpg',
  '/images/restaurants/breakfast-by-the-sea.jpg',
  '/images/hero/boho-cafe-dreams.jpg',
  '/images/hero/gulf-sunset.jpg',
];

function getRestaurantImage(r: { id: string; name?: string }): string {
  const key = (r.id || '').toLowerCase();
  const name = (r.name || '').toLowerCase();
  if (key.includes('ali') || name.includes('ali')) return '/images/restaurants/ali-baba-restaurant.jpg';
  if (key.includes('roof') || name.includes('roof')) return '/images/restaurants/the-roof-restaurant.jpg';
  if (name.includes('breakfast') || name.includes('bakery')) return '/images/restaurants/breakfast-by-the-sea.jpg';
  if (name.includes('seafood') || name.includes('fish')) return '/images/restaurants/ali-baba-restaurant.jpg';

  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return RESTAURANT_FALLBACK_IMAGES[hash % RESTAURANT_FALLBACK_IMAGES.length];
}

// ---------------------------------------------------------------------------
// Restaurant Card
// ---------------------------------------------------------------------------

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  language,
  isDark,
  isFav,
  onToggleFav,
  onViewDetails,
}) => {
  const { t } = useLanguage();
  const rtl = language === 'ar';
  const imgUrl = getRestaurantImage(restaurant);

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={`rounded-2xl border overflow-hidden transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300 group shadow-sm hover:shadow-xl ${
        isDark
          ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50'
          : 'bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
      }`}
    >
      {/* Header with authentic restaurant photo */}
      <div className="relative h-48 w-full bg-[var(--surface-container)] flex items-end p-4 overflow-hidden">
        <img
          src={imgUrl}
          alt={language === 'ar' ? restaurant.nameAr : restaurant.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative z-10 flex items-center justify-between w-full">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs"
            style={{
              color: '#ffffff',
              backgroundColor: restaurant.priceBand === 'Budget ($)' ? '#7a8c5ccc' : restaurant.priceBand === 'Moderate ($$)' ? '#c97b3ccc' : '#7a6a4acc',
            }}>
            {priceTierLabel(restaurant.priceBand, language)}
          </span>
          {restaurant.rating && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              {restaurant.rating.toFixed(1)}
              {restaurant.reviewCount && <span className="text-white/70">({restaurant.reviewCount})</span>}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={`p-4 ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="chart-heading font-bold text-base leading-snug line-clamp-2">
            {language === 'ar' ? restaurant.nameAr : restaurant.name}
          </h3>
          <button
            type="button"
            onClick={() => onToggleFav(restaurant.id)}
            aria-label={isFav ? t('explore.removeFromFavourites') : t('explore.addToFavourites')}
            aria-pressed={isFav}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-[background-color,border-color,color,box-shadow,transform,opacity] ${
              isFav ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:bg-black/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Cuisine tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {(restaurant.cuisine || []).slice(0, 4).map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
              {language === 'ar' ? (restaurant.cuisineAr?.[i] || c) : c}
            </span>
          ))}
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
            isDark ? 'text-[var(--text-secondary)]/75' : 'text-[var(--text-secondary)]'
          }`}>
            {language === 'ar' ? restaurant.descriptionAr : restaurant.description}
          </p>
        )}

        {/* Info row */}
        <div className={`mt-3 flex items-center gap-3 text-xs ${
          isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'
        }`}>
          {restaurant.openingHours && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {language === 'ar' ? (restaurant.openingHoursAr || restaurant.openingHours) : restaurant.openingHours}
            </span>
          )}
          {restaurant.areaName && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {language === 'ar' ? (restaurant.areaNameAr || restaurant.areaName) : restaurant.areaName}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onViewDetails?.(restaurant.id)}
            className="flex-1 py-2 rounded-xl text-xs font-bold border transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center justify-center gap-1.5 cursor-pointer bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20"
          >
            {t('viewRestaurant')}
            <ChevronRight className="w-3 h-3" />
          </button>
          {restaurant.whatsapp && (
            <a
              href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] flex items-center gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              {t('wA')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Restaurant detail modal
// ---------------------------------------------------------------------------

const RestaurantDetailModal: React.FC<{
  restaurant: Restaurant;
  language: 'en' | 'ar';
  isDark: boolean;
  onClose: () => void;
  onBook: (restaurant: Restaurant) => void;
}> = ({ restaurant, language, isDark, onClose, onBook }) => {
  const { t } = useLanguage();
  const rtl = language === 'ar';

  const dietary = restaurant.dietaryOptions
    ? [
        { key: 'vegan', label: t('vegan'), value: restaurant.dietaryOptions.vegan },
        { key: 'vegetarian', label: t('vegetarian'), value: restaurant.dietaryOptions.vegetarian },
        { key: 'halal', label: t('halal'), value: restaurant.dietaryOptions.halal },
        { key: 'seafood', label: t('freshSeafood'), value: restaurant.dietaryOptions.freshSeafoodCatch },
      ].filter(d => d.value)
    : [];

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="restaurant-detail-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-150 ${
          isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'
        }`}
      >
        {/* Header photo */}
        <div className="relative h-48 bg-[var(--surface-container)] overflow-hidden flex items-end p-5 text-white">
          <img
            src={getRestaurantImage(restaurant)}
            alt={language === 'ar' ? restaurant.nameAr : restaurant.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="relative z-10 flex items-end justify-between w-full gap-3">
            <div className="min-w-0">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1.5 backdrop-blur-md shadow-xs"
                style={{
                  color: '#ffffff',
                  backgroundColor: restaurant.priceBand === 'Budget ($)' ? '#7a8c5ccc' : restaurant.priceBand === 'Moderate ($$)' ? '#c97b3ccc' : '#7a6a4acc',
                }}>
                {priceTierLabel(restaurant.priceBand, language)}
              </span>
              <h3 id="restaurant-detail-title" className="chart-heading font-bold text-xl leading-tight truncate text-white drop-shadow-sm">
                {language === 'ar' ? restaurant.nameAr : restaurant.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 flex-shrink-0 cursor-pointer"
              aria-label={t('attractions.close')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className={`p-5 space-y-4 ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
          {/* Rating + price */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {restaurant.rating && (
              <span className="flex items-center gap-1 font-bold">
                <Star className="w-4 h-4 fill-[var(--accent-secondary)] text-[var(--accent-secondary)]" />
                {restaurant.rating.toFixed(1)}
                {restaurant.reviewCount && <span className={`${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'}`}>({restaurant.reviewCount})</span>}
              </span>
            )}
            {restaurant.averageMealPriceEGP > 0 && (
              <span className={`font-bold ${isDark ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                {t('avgMeal')} {Math.round(restaurant.averageMealPriceEGP)} EGP
              </span>
            )}
          </div>

          {/* Cuisine tags */}
          {(restaurant.cuisine || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(restaurant.cuisine || []).slice(0, 6).map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  {language === 'ar' ? (restaurant.cuisineAr?.[i] || c) : c}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {restaurant.description && (
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/75' : 'text-[var(--text-secondary)]'}`}>
              {language === 'ar' ? restaurant.descriptionAr : restaurant.description}
            </p>
          )}

          {/* Fact grid */}
          <div className={`grid grid-cols-2 gap-2 text-xs`}>
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)]' : 'bg-[var(--surface-container)] border-[var(--border-subtle)]'}`}>
              <div className={`flex items-center gap-1.5 mb-1 font-bold ${isDark ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-primary)]'}`}>
                <Clock className="w-3 h-3" />
                {t('hours')}
              </div>
              <span className={isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}>
                {language === 'ar' ? (restaurant.openingHoursAr || restaurant.openingHours) : restaurant.openingHours}
              </span>
            </div>
            {restaurant.areaName && (
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[var(--surface-container)] border-[var(--border-subtle)]' : 'bg-[var(--surface-container)] border-[var(--border-subtle)]'}`}>
                <div className={`flex items-center gap-1.5 mb-1 font-bold ${isDark ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-primary)]'}`}>
                  <MapPin className="w-3 h-3" />
                  {t('attractions.area')}
                </div>
                <span className={isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}>
                  {language === 'ar' ? (restaurant.areaNameAr || restaurant.areaName) : restaurant.areaName}
                </span>
              </div>
            )}
          </div>

          {/* Dietary options */}
          {dietary.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dietary.map(d => (
                <span key={d.key} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  ✓ {d.label}
                </span>
              ))}
            </div>
          )}

          {/* Contact actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {restaurant.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-[background-color,border-color,color,box-shadow,transform,opacity]"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                {t('whatsAppTheRestaurant')}
              </a>
            )}
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-[background-color,border-color,color,box-shadow,transform,opacity] hover:bg-[var(--surface-container)]"
              >
                {t('attractions.website')}
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => onBook(restaurant)}
            className="w-full py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--surface-container)] text-sm font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {t('bookATableOrder')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Price guide section
// ---------------------------------------------------------------------------

const PriceGuideSection: React.FC<{ language: 'en' | 'ar'; isDark: boolean }> = ({ language, isDark }) => {
  const { t } = useLanguage();
  /**
   * The tier label and the example were both rendered as
   * `language === 'ar' ? row.tier : row.tier` — identical branches, because
   * no Arabic field existed to put on the left-hand side. An Arabic reader was
   * shown "Budget ($)" and "Street ta'ameya, baladi bread, tea".
   */
  const rows = [
    {
      tier: 'Budget ($)',
      tierAr: 'اقتصادي ($)',
      en: '$1–$5',
      ar: '٥–٢٠ جنيه',
      example: "Street ta'ameya, baladi bread, tea",
      exampleAr: 'طعمية من عربية الشارع، عيش بلدي، شاي',
    },
    {
      tier: 'Moderate ($$)',
      tierAr: 'متوسط ($$)',
      en: '$5–$15',
      ar: '٢٠–٧٠ جنيه',
      example: 'Seafront seafood, Bedouin grill, shawarma',
      exampleAr: 'أسماك على البحر، مشاوي بدوية، شاورما',
    },
    {
      tier: 'Premium ($$$)',
      tierAr: 'مميز ($$$)',
      en: '$15–$40+',
      ar: '٧٠–٢٠٠+ جنيه',
      example: 'Full table-service dinner, sunset terrace',
      exampleAr: 'عشاء كامل بخدمة طاولات، تراس على الغروب',
    },
  ];

  return (
    <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'}`}>
      <h3 className={`chart-heading font-bold text-base mb-3 ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
        {t('quickPriceGuide')}
      </h3>
      <div className="space-y-2">
        {rows.map(row => (
          <div key={row.tier} className={`flex items-center gap-3 text-xs py-1.5 px-2 rounded-lg ${
            isDark ? 'bg-[var(--surface-container)] text-[var(--text-secondary)]' : 'bg-[var(--surface-container)] text-[var(--text-secondary)]'
          }`}>
            <span className="font-bold w-24 flex-shrink-0">
              {language === 'ar' ? row.tierAr : row.tier}
            </span>
            <span className="font-bold w-24 flex-shrink-0">
              {language === 'ar' ? row.ar : row.en}
            </span>
            <span className="truncate">{language === 'ar' ? row.exampleAr : row.example}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Best-for chips
// ---------------------------------------------------------------------------

const BEST_FOR: { key: string; en: string; ar: string }[] = [
  { key: 'seafood', en: 'Seafood', ar: 'سي فود طازج' },
  { key: 'egyptian', en: 'Egyptian', ar: 'أكل مصري' },
  { key: 'italian', en: 'Italian', ar: 'إيطالي' },
  { key: 'indian', en: 'Indian', ar: 'هندي' },
  { key: 'asian', en: 'Asian', ar: 'آسيوي' },
  { key: 'brunch', en: 'Brunch', ar: 'برانش ع شمرة' },
  { key: 'mediterranean', en: 'Mediterranean', ar: 'متوسطي' },
  { key: 'openlate', en: 'Open late', ar: 'مفتوح متأخر' },
  { key: 'cheap', en: 'Cheap eats', ar: 'أكل رخيص' },
  { key: 'datenight', en: 'Date night', ar: 'مكان رومانسى' },
];

const BestForSection: React.FC<{ language: 'en' | 'ar'; onFilter: (cuisines: string[]) => void }> = ({ language, onFilter }) => {
  const { t } = useLanguage();
  const [active, setActive] = useState<Set<string>>(new Set());
  const toggle = (key: string) => {
    const next = new Set(active);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setActive(next);
    onFilter([...next]);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
        <h3 className="chart-heading font-bold text-sm">
          {t('bestFor')}
        </h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {BEST_FOR.map(b => (
          <button key={b.key} type="button"
            onClick={() => toggle(b.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-[background-color,border-color,color,box-shadow,transform,opacity] ${
              active.has(b.key)
                ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]'
            }`}>
            {language === 'ar' ? b.ar : b.en}
          </button>
        ))}
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Comparison table
// ---------------------------------------------------------------------------

const ComparisonTable: React.FC<{
  restaurants: Restaurant[];
  language: 'en' | 'ar';
  isDark: boolean;
}> = ({ restaurants, language, isDark }) => {
  const { t } = useLanguage();
  if (restaurants.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[var(--accent-primary)]" />
        <h3 className="chart-heading font-bold text-sm">
          {t('quickComparison')}
        </h3>
      </div>
      <div className={`rounded-2xl border overflow-x-auto ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'}`}>
        <table className="w-full text-start text-xs">
          <thead>
            <tr className={isDark ? 'bg-[var(--surface-container)]' : 'bg-[var(--surface-container)]'}>
              <th className={`px-3 py-2.5 font-bold ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                {t('restaurant')}
              </th>
              <th className={`px-3 py-2.5 font-bold ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                {t('type')}
              </th>
              <th className={`px-3 py-2.5 font-bold ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                {t('explore.rating')}
              </th>
              <th className={`px-3 py-2.5 font-bold ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                {t('hours')}
              </th>
              <th className={`px-3 py-2.5 font-bold ${isDark ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                {t('attractions.price')}
              </th>
            </tr>
          </thead>
          <tbody>
            {restaurants.slice(0, 12).map(r => (
              <tr key={r.id} className={`border-t ${isDark ? 'border-[var(--border-subtle)]' : 'border-[var(--border-subtle)]'}`}>
                <td className={`px-3 py-2.5 font-medium ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                  <div className="flex items-center gap-2">
                    {r.rating && (
                      <span className="flex items-center gap-0.5 text-amber-400 flex-shrink-0">
                        <Star className="w-3 h-3 fill-current" />
                        {r.rating.toFixed(1)}
                      </span>
                    )}
                    <span className="truncate">{language === 'ar' ? r.nameAr : r.name}</span>
                  </div>
                </td>
                <td className={`px-3 py-2.5 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
                  {(r.cuisine || []).slice(0, 2).join(', ')}
                </td>
                <td className={`px-3 py-2.5 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
                  {r.rating ? `${r.rating.toFixed(1)} (${r.reviewCount || 0})` : '—'}
                </td>
                <td className={`px-3 py-2.5 ${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>
                  {r.openingHours || '—'}
                </td>
                <td className={`px-3 py-2.5 font-bold ${isDark ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                  {r.averageMealPriceEGP ? `${Math.round(r.averageMealPriceEGP)} EGP` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Get 3 picks WhatsApp CTA
// ---------------------------------------------------------------------------

const Get3PicksCta: React.FC<{ language: 'en' | 'ar' }> = ({ language }) => {
  const { t } = useLanguage();
  return (
    <section className="rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5">
      <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center flex-shrink-0">
        <Bot className="w-6 h-6 text-[var(--accent-primary)]" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="chart-heading font-bold text-base">
          {t('threePicksThatActually')}
        </p>
        <p className="text-xs text-[var(--text-secondary)]/70">
          {t('tellUsYourTime')}
        </p>
      </div>
      <a
        href={language === 'ar'
          ? 'https://wa.me/201222124840?text=%D8%B9%D8%A7%D9%8A%D8%B2%203%20%D8%A7%D9%82%D8%AA%D8%B1%D8%A7%D8%AD%D8%A7%D8%AA%20%D9%85%D8%B7%D8%A7%D8%B9%D9%85%20%D9%81%D9%8A%20%D8%AF%D9%87%D8%A8'
          : 'https://wa.me/201222124840?text=Hi!%20I%27d%20like%203%20restaurant%20picks%20in%20Dahab'}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold flex items-center gap-2 transition-[background-color,border-color,color,box-shadow,transform,opacity] shadow-xs cursor-pointer active:scale-[0.98]"
      >
        <WhatsAppIcon className="w-4 h-4" />
        {t('get3Picks')}
        <ChevronRight className="w-3 h-3" />
      </a>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Before you arrive guide
// ---------------------------------------------------------------------------

const BeforeYouArriveGuide: React.FC<{ language: 'en' | 'ar'; isDark: boolean }> = ({ language, isDark }) => {
  const { t } = useLanguage();
  const bullets = [t('restaurants.dahabBullet1'), t('restaurants.dahabBullet2'), t('restaurants.dahabBullet3')];

  const tips = [t('restaurants.whatsAppTip1'), t('restaurants.whatsAppTip2')];

  return (
    <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)]'}`}>
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
        <div className="space-y-3">
          <h3 className={`chart-heading font-bold text-sm ${isDark ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
            {t('beforeYouArrive')}
          </h3>
          <div className="space-y-1.5">
            {bullets.map((b, i) => (
              <li key={i} className={`text-xs leading-relaxed ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[var(--text-secondary)]'}`}>
                <span className="text-[var(--accent-primary)]">•</span> {b}
              </li>
            ))}
          </div>
          <div className="pt-2 space-y-1.5">
            {tips.map((tipItem, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold">
                  {t('tip')}
                </span>
                <span className={`${isDark ? 'text-[var(--text-secondary)]/70' : 'text-[var(--text-secondary)]'}`}>{tipItem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Main RestaurantsView
// ---------------------------------------------------------------------------

const fetchRestaurantSuppliers = (signal: AbortSignal) => api.getCommerceSuppliers(signal).then(r => r.suppliers);

export const RestaurantsView: React.FC = () => {
  const { navigateTo } = useTrip();
  const { language , t} = useLanguage();
  const { isDark } = useTheme();

  // ---- State ----
  const [searchQuery, setSearchQuery] = useState('');
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(true);

  // Detail panel, carried in the URL like every other selection (?restaurant=id)
  // so a specific restaurant page is linkable and survives a refresh.
  const [detailId, setDetailId] = useState<string | null>(() => {
    const raw = new URLSearchParams(window.location.search).get('restaurant');
    return raw || null;
  });

  // Filter state, seeded from the URL once, then owned by React: a chip click
  // must re-render the grid immediately, not wait for a popstate event nobody
  // dispatches. Declared above the fetcher so the server-driven request below
  // can read them.
  const PRICE_BAND_COUNT = 3;

  const [activePriceBands, setActivePriceBands] = useState<Set<Restaurant['priceBand']>>(() => {
    const raw = new URLSearchParams(window.location.search).get('price');
    if (!raw || raw === 'all') return new Set(['Budget ($)', 'Moderate ($$)', 'Premium ($$$)']);
    return new Set(raw.split(',') as Restaurant['priceBand'][]);
  });

  const [activeCuisines, setActiveCuisines] = useState<Set<string>>(() => {
    const raw = new URLSearchParams(window.location.search).get('cuisine');
    if (!raw) return new Set();
    return new Set(raw.split(',').filter(Boolean));
  });

  // ---- Fetch ----
  // The server /api/dahab/food endpoint filters by cuisine / price / query, so
  // the fetcher is rebuilt (and the request re-run) whenever those change —
  // the documented useApiResource pattern for parameterised resources.
  const diningFetcher = useCallback(
    (signal: AbortSignal) =>
      api.getDahabDining(
        {
          q: searchQuery.trim() || undefined,
          price: activePriceBands.size === 3 ? undefined : [...activePriceBands],
        },
        signal
      ).then(r => r.venues),
    [searchQuery, activePriceBands]
  );
  const diningCorpus = useApiResource(diningFetcher);
  const suppliersCorpus = useApiResource(fetchRestaurantSuppliers);

  // ---- Merge restaurants ----
  // The wire shapes (DahabDiningVenue / SupplierEntity) carry the core fields;
  // the extras below — rating, reviewCount, phone, website, description — are
  // optional on the server record, so they are read defensively off a widened
  // view of each record rather than a hard type contract.
  const restaurants = useMemo<Restaurant[]>(() => {
    const out: Restaurant[] = [];

    // From dining corpus (primary)
    for (const raw of (diningCorpus.data || [])) {
      const v = raw as Record<string, any>;
      out.push({
        id: v.id,
        name: v.nameEn,
        nameAr: v.nameAr,
        // Coerced, not just defaulted: four corpus rows carry `cuisine` as a
        // string, and `.slice(0, 4).map(...)` on a string throws.
        cuisine: toCuisineList(v.cuisine).length ? toCuisineList(v.cuisine) : ['Dahab'],
        cuisineAr: v.cuisineAr || ['دهب'],
        priceBand: v.priceBand || 'Moderate ($$)',
        averageMealPriceEGP: v.averageMealPriceEGP || 0,
        rating: v.rating,
        reviewCount: v.reviewCount,
        openingHours: v.openingHours || 'Open daily',
        openingHoursAr: v.openingHoursAr,
        dietaryOptions: v.dietaryOptions || { vegan: false, vegetarian: false, halal: true, freshSeafoodCatch: false },
        areaId: v.areaId,
        areaName: v.areaName,
        areaNameAr: v.areaNameAr,
        phone: v.phone,
        whatsapp: v.whatsapp,
        website: v.website,
        instagram: v.instagram,
        description: v.description,
        descriptionAr: v.descriptionAr,
        coordinates: v.coordinates,
      });
    }

    // Supplement from commerce suppliers (restaurant-categorized)
    for (const rawS of (suppliersCorpus.data || [])) {
      const s = rawS as Record<string, any>;
      if ((s.category || '').toLowerCase() !== 'restaurant') continue;
      if (out.some(r => r.id === s.id)) continue;
      out.push({
        id: s.id,
        name: s.businessName || '',
        nameAr: s.businessNameAr || '',
        cuisine: (s.serviceTypes || []).filter(Boolean).slice(0, 4),
        cuisineAr: [],
        priceBand: s.tier && s.tier.toLowerCase().includes('tier 1') ? 'Premium ($$$)' : s.tier && s.tier.toLowerCase().includes('tier 2') ? 'Moderate ($$)' : 'Budget ($)',
        averageMealPriceEGP: s.averageMealPriceEGP || 0,
        rating: s.rating,
        reviewCount: s.reviewCount,
        openingHours: s.openingHours || 'Open daily',
        dietaryOptions: { vegan: false, vegetarian: false, halal: true, freshSeafoodCatch: false },
        areaId: s.area || '',
        areaName: s.area,
        phone: s.phone,
        whatsapp: s.whatsappNumber || s.whatsapp,
        website: s.website,
        instagram: s.instagram,
        description: s.businessType ? `Provided by ${s.businessType}.` : undefined,
        coordinates: s.coordinates ? { lat: s.coordinates.lat, lng: s.coordinates.lng } : undefined,
      });
    }

    return out;
  }, [diningCorpus.data, suppliersCorpus.data]);

  // ---- Filters ----

  // "Best for" chips carry semantic tags ("cheap", "open late", "brunch") that
  // are not cuisine names. Matching them naively against the cuisine list would
  // empty the grid — "Open late" matches no cuisine — so each key maps to a
  // rule: a cuisine name, or an hours/price heuristic.
  const matchesBestFor = useCallback((r: Restaurant): boolean => {
    if (activeCuisines.size === 0) return true;
    return [...activeCuisines].some(k => {
      if (k === 'cheap') return r.priceBand === 'Budget ($)';
      if (k === 'openlate') return /(00:00|24:00|midnight|1[2]?:00 AM|12:00 AM|01:00)/i.test(r.openingHours || '');
      if (k === 'brunch') return /(breakfast|morning|brunch|0[89]|1[01]:00)/i.test(r.openingHours || '');
      return (r.cuisine || []).some(c => c.toLowerCase() === k);
    });
  }, [activeCuisines]);

  const filtered = useMemo<Restaurant[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    /**
     * With every band selected there is no price filter to apply.
     *
     * Testing `activePriceBands.has(r.priceBand)` instead meant a venue whose
     * band was not one of the three display labels failed the check even in the
     * unfiltered state, and no chip could bring it back. Four venues stored
     * with the research importer's 'MID' spelling were invisible that way: the
     * stats tile counted 15 restaurants and the grid listed 11.
     */
    const priceFilterActive = activePriceBands.size < PRICE_BAND_COUNT;
    return restaurants.filter(r => {
      const matchesPrice = !priceFilterActive || activePriceBands.has(r.priceBand);
      const matchesCuisine = matchesBestFor(r);
      const matchesSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        (r.nameAr && r.nameAr.toLowerCase().includes(q)) ||
        (r.cuisine || []).some(c => c.toLowerCase().includes(q));
      return matchesPrice && matchesCuisine && matchesSearch;
    });
  }, [restaurants, activePriceBands, matchesBestFor, searchQuery]);

  const toggleFav = useCallback((id: string) => {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const viewDetails = useCallback((id: string) => {
    setDetailId(id);
    const params = new URLSearchParams(window.location.search);
    params.set('restaurant', id);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailId(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('restaurant');
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, []);

  const bookRestaurant = useCallback((r: Restaurant) => {
    navigateTo('/food');
  }, [navigateTo]);

  const handleCuisineFilter = useCallback((cuisines: string[]) => {
    setActiveCuisines(new Set(cuisines.map(c => c.toLowerCase())));
    const params = new URLSearchParams(window.location.search);
    if (cuisines.length === 0) params.delete('cuisine');
    else params.set('cuisine', cuisines.join(','));
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, []);

  // ---- Render ----
  const favList = restaurants.filter(r => favs.has(r.id));

  /**
   * Both stats are derived from what the corpus actually carries.
   *
   * `Price tiers` was the literal 3, which would keep claiming three bands if
   * the corpus ever held two — and it is exactly that kind of unchecked
   * assumption about the band vocabulary that hid four restaurants here.
   */
  const priceTierCount = new Set(
    restaurants.map(r => r.priceBand).filter(Boolean)
  ).size;

  const mealPrices = restaurants
    .map(r => r.averageMealPriceEGP)
    .filter((n): n is number => typeof n === 'number' && n > 0);
  const avgMealPriceLabel = mealPrices.length
    ? `${Math.round(mealPrices.reduce((a, b) => a + b, 0) / mealPrices.length)} EGP`
    : '—';
  const visible = showAll ? filtered : favList;

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col ${
        isDark ? 'bg-[var(--surface-container)] text-[var(--text-primary)]' : 'bg-[var(--bg-canvas)] text-[var(--text-primary)]'
      }`}>

      {/* Hero with authentic Dahab cafe backdrop */}
      <div className="relative border-b overflow-hidden">
        <img
          src="/images/restaurants/boho-beach-cafe.jpg"
          alt="Dahab Dining & Cafes"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-r from-[var(--surface-container)]/95 via-[var(--surface-container)]/90 to-[var(--surface-container)]/75 backdrop-blur-[2px]'
            : 'bg-gradient-to-r from-[var(--bg-canvas)]/96 via-[var(--bg-canvas)]/92 to-[var(--bg-canvas)]/80 backdrop-blur-[2px]'
        }`} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl chart-heading font-bold">
                {t('restaurantsInDahab')}
              </h1>
              <p className={`text-sm max-w-lg ${isDark ? 'text-[var(--text-secondary)]/80' : 'text-[var(--text-secondary)]'}`}>
                {t('restaurants.heroCountMap', { count: restaurants.length })}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button"
                onClick={() => setShowAll(true)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] ${
                  showAll
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)]'
                    : isDark ? 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                }`}>
                {t('all')}
              </button>
              <button type="button"
                onClick={() => setShowAll(false)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] ${
                  !showAll
                    ? 'bg-rose-500 text-white'
                    : isDark ? 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                }`}>
                {t('favourites')} ({favList.length})
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { label: t('restaurants'), value: restaurants.length },
              { label: t('priceTiers'), value: priceTierCount },
              { label: t('cuisines'), value: new Set(restaurants.flatMap(r => r.cuisine || [])).size },
              {
                /**
                 * Was `Avg rating`, averaged over `r.rating` — a field the
                 * /api/dahab/food payload has never carried. Every venue failed
                 * the `filter(r => r.rating)` guard, so the tile rendered a
                 * confident `0` next to "Avg rating" on every load. The corpus
                 * does carry averageMealPriceEGP, which is the honest stat.
                 */
                label: t('avgMeal-2'),
                value: avgMealPriceLabel,
              },
            ].map(stat => (
              <div key={stat.label} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }`}>
                <span className="font-black">{stat.value}</span>
                {' '}
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className={`absolute ${language === 'ar' ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[var(--text-secondary)]/40' : 'text-[var(--text-secondary)]/40'}`} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchRestaurantsSeafoodBrunch')}
            className={`w-full py-3 pl-${language === 'ar' ? '4' : '10'} pr-${language === 'ar' ? '10' : '4'} rounded-xl border text-sm ${
              isDark
                ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 focus:border-[var(--accent-primary)]'
                : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[var(--accent-primary)]'
            } focus:outline-none`}
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {(['Budget ($)', 'Moderate ($$)', 'Premium ($$$)'] as const).map(band => {
            const active = activePriceBands.has(band);
            return (
              <button key={band} type="button"
                onClick={() => {
                  const next = new Set(activePriceBands);
                  if (next.has(band)) next.delete(band);
                  else next.add(band);
                  setActivePriceBands(next);
                  const params = new URLSearchParams(window.location.search);
                  if (next.size === 3) params.delete('price');
                  else params.set('price', [...next].join(','));
                  window.history.replaceState(null, '', `?${params.toString()}`);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] border ${
                  active
                    ? 'bg-[var(--accent-primary)] text-[var(--surface-container)] border-[var(--accent-primary)]'
                    : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-container)]'
                }`}>
                {priceTierLabel(band, language)}
              </button>
            );
          })}
        </div>

        {/* Featured / top picks */}
        {!showAll && (
          <section className="mb-8">
            <h2 className="chart-heading font-bold text-lg mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              {t('yourFavourites')}
            </h2>
            {favList.length === 0 ? (
              <div className={`py-8 rounded-2xl border text-center text-sm ${
                isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }`}>
                {t('noFavouritesYetTap')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favList.map(r => (
                  <RestaurantCard
                    key={r.id}
                    restaurant={r}
                    language={language as 'en' | 'ar'}
                    isDark={isDark}
                    isFav={true}
                    onToggleFav={toggleFav}
                    onViewDetails={viewDetails}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Results grid */}
        <section className="mb-10">
          <h2 className="chart-heading font-bold text-lg mb-3 flex items-center gap-2">
            {t('allRestaurants')}
            <span className={`text-xs font-normal ${isDark ? 'text-[var(--text-secondary)]/60' : 'text-[var(--text-secondary)]'}`}>
              ({visible.length})
            </span>
          </h2>
          {visible.length === 0 ? (
            <div className={`py-12 rounded-2xl border text-center text-sm ${
              isDark ? 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
            }`}>
              {t('noRestaurantsMatchThat')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map(r => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  language={language as 'en' | 'ar'}
                  isDark={isDark}
                  isFav={favs.has(r.id)}
                  onToggleFav={toggleFav}
                  onViewDetails={viewDetails}
                />
              ))}
            </div>
          )}
        </section>

        {/* Comparison table */}
        <ComparisonTable
          restaurants={filtered.slice(0, 12)}
          language={language as 'en' | 'ar'}
          isDark={isDark}
        />

        {/* Price guide */}
        <div className="mt-8">
          <PriceGuideSection language={language as 'en' | 'ar'} isDark={isDark} />
        </div>

        {/* Best for */}
        <div className="mt-8">
          <BestForSection language={language as 'en' | 'ar'} onFilter={handleCuisineFilter} />
        </div>

        {/* Get 3 picks */}
        <div className="mt-8 mb-8">
          <Get3PicksCta language={language as 'en' | 'ar'} />
        </div>

        {/* Before you arrive */}
        <div className="mb-12">
          <BeforeYouArriveGuide language={language as 'en' | 'ar'} isDark={isDark} />
        </div>
      </div>

      {/* Restaurant detail modal */}
      {detailId && (() => {
        const detailRestaurant = restaurants.find(r => r.id === detailId);
        if (!detailRestaurant) return null;
        return (
          <RestaurantDetailModal
            restaurant={detailRestaurant}
            language={language as 'en' | 'ar'}
            isDark={isDark}
            onClose={closeDetails}
            onBook={bookRestaurant}
          />
        );
      })()}
    </div>
  );
};

export default RestaurantsView;
