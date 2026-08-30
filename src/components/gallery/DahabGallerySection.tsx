import React, { useState } from 'react';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import {
  Camera,
  MapPin,
  Heart,
  Share2,
  Download,
  Sparkles,
  Maximize2,
  X,
  Compass,
  Info,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sun,
  Waves
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';

export interface DahabPhotoItem {
  id: string;
  title: string;
  titleAr: string;
  spot: string;
  spotAr: string;
  category: 'diving' | 'sunset' | 'desert' | 'lagoon' | 'bedouin' | 'local';
  categoryLabel: string;
  categoryLabelAr: string;
  imageUrl: string;
  photographer: string;
  resolution: string;
  description: string;
  descriptionAr: string;
  bestTime: string;
  bestTimeAr: string;
  tags: string[];
  depthOrHeight?: string;
}

/**
 * The offline fallback.
 *
 * These photographs now come from GET /api/dahab/content/gallery, served from
 * server/db/seeds/editorialContent.ts, so a caption change no longer needs a
 * rebuild. This copy is what the section shows when that request fails — the
 * same pattern Explore and Food use.
 */
export const DAHAB_GALLERY_PHOTOS: DahabPhotoItem[] = [
  {
    id: 'photo-blue-hole-bells',
    title: 'The Blue Hole & The Bells Chimney',
    titleAr: 'الثقب الأزرق (البلو هول) ومدخنة البيلز الصخرية',
    spot: 'Blue Hole Protected Area',
    spotAr: 'محمية البلو هول البحرية',
    category: 'diving',
    categoryLabel: 'Iconic Dive Site',
    categoryLabelAr: 'موقع غوص عالمي',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Red Sea Marine Explorer',
    resolution: '4K Ultra HD',
    description: 'The world-famous 100m+ submarine sinkhole with crystal clear water and vertical coral saddle walls.',
    descriptionAr: 'الحفرة الزرقاء الأيقونية بعمق يتجاوز ١٠٠ متر وجدران المرجان العمودية النادرة للغوص الحر.',
    bestTime: '08:00 AM – 11:30 AM (Calm water)',
    bestTimeAr: '٠٨:٠٠ ص – ١١:٣٠ ص (مياه فائقة الهدوء)',
    tags: ['BlueHole', 'Freediving', 'CoralWall', 'SinaiDiving'],
    depthOrHeight: 'Depth: 100m+',
  },
  {
    id: 'photo-blue-lagoon',
    title: 'Blue Lagoon Turquoise Solitude',
    titleAr: 'البلو لاجون ومياه البحر الفيروزية الهادئة',
    spot: 'Ras Abu Galum Reserve',
    spotAr: 'محمية رأس أبو جالوم',
    category: 'lagoon',
    categoryLabel: 'Pristine Waters',
    categoryLabelAr: 'بحيرة شاطئية بكر',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Sinai Nomad Travel',
    resolution: '4K Ultra HD',
    description: 'Off-grid paradise of shallow emerald-turquoise water enclosed by sandbars beneath granite mountains.',
    descriptionAr: 'جنة دهب الهادئة ذات المياه الضحلة الكريستالية والمخيمات البدوية البسيطة بعيداً عن صخب العالم.',
    bestTime: '11:00 AM – 04:00 PM (Crystal sunlight)',
    bestTimeAr: '١١:٠٠ ص – ٠٤:٠٠ م (ضوء الشمس الساطع)',
    tags: ['BlueLagoon', 'Kitesurf', 'SinaiWilderness', 'BeachChill'],
    depthOrHeight: 'Shallow 1-2m',
  },
  {
    id: 'photo-canyon-rift',
    title: 'The Submarine Canyon Sun Rays',
    titleAr: 'الشق الصخري المرجاني في الكانيون وأشعة الشمس',
    spot: 'The Canyon Dive Area',
    spotAr: 'منطقة غوص الكانيون',
    category: 'diving',
    categoryLabel: 'Cave & Reef Rift',
    categoryLabelAr: 'مغارة وشق صخري',
    imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Coral Sanctuary Project',
    resolution: '4K Ultra HD',
    description: 'Underwater geological marvel opening at 10m and plunging into a cavern filled with glassy sweepers.',
    descriptionAr: 'شق صخري تحت الماء يمتد لعمق ٣٠ متراً حيث تنفذ أشعة الصباح الذهبية وسط آلاف الأسماك الزجاجية.',
    bestTime: '09:00 AM – 11:00 AM (Sun Ray Angle)',
    bestTimeAr: '٠٩:٠٠ ص – ١١:٠٠ ص (زاوية اختراق الشمس)',
    tags: ['TheCanyon', 'ReefRift', 'GlassFish', 'RedSeaTreasures'],
    depthOrHeight: 'Depth: 30m',
  },
  {
    id: 'photo-wadi-gnai-desert',
    title: 'Wadi Gnai Canyon & Oasis',
    titleAr: 'كانيون وادي قني والواحة الصحراوية',
    spot: 'South Dahab Desert',
    spotAr: 'صحراء جنوب دهب',
    category: 'desert',
    categoryLabel: 'Granite & Palms',
    categoryLabelAr: 'جبال جرانيت ونخيل',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Bedouin Heritage Guides',
    resolution: '4K Ultra HD',
    description: 'Dramatic pink granite boulders, sweet freshwater springs, and palm trees thriving inside the canyon.',
    descriptionAr: 'أودية الجرانيت الوردي الشاهقة، عيون المياه العذبة الطبيعية، وأشجار النخيل المتغلغلة بين الجبال.',
    bestTime: '04:00 PM – 06:30 PM (Golden hour & Dusk)',
    bestTimeAr: '٠٤:٠٠ م – ٠٦:٣٠ م (ساعة الغروب الذهبية)',
    tags: ['WadiGnai', 'Bouldering', 'SinaiMountains', 'BedouinOasis'],
    depthOrHeight: 'Altitude: 350m',
  },
  {
    id: 'photo-lighthouse-sunset',
    title: 'Lighthouse Promenade Golden Sunset',
    titleAr: 'غروب الشمس الذهبي بممشى اللايتهاوس وخليج العقبة',
    spot: 'Lighthouse Bay',
    spotAr: 'خليج وممشى اللايتهاوس',
    category: 'sunset',
    categoryLabel: 'Seaside Magic',
    categoryLabelAr: 'سحر الغروب الشاطئي',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Dahab Promenade Collective',
    resolution: '4K Ultra HD',
    description: 'Seaside cushions, Bedouin habak tea, and glowing twilight over the Gulf of Aqaba mountain range.',
    descriptionAr: 'الجلسات الشاطئية على الوسائد المريحة ورائحة شاي الحبق مع تدرج ألوان الشفق الوردي فوق جبال الحجاز.',
    bestTime: '05:15 PM – 06:45 PM (Sunset Twilight)',
    bestTimeAr: '٠٥:١٥ م – ٠٦:٤٥ م (شفق الغروب الساحر)',
    tags: ['LighthouseSunset', 'HabakTea', 'GulfOfAqaba', 'DahabVibe'],
  },
  {
    id: 'photo-south-laguna-wind',
    title: 'Dahab South Laguna Kite Spot',
    titleAr: 'شاطئ لاجونا دهب الجنوبي ورياضة التزلج الشراعي',
    spot: 'South Laguna Bay',
    spotAr: 'خليج اللاجونا الجنوبي',
    category: 'lagoon',
    categoryLabel: 'Wind & Watersports',
    categoryLabelAr: 'رياح ورياضات مائية',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Red Sea Kite Masters',
    resolution: '4K Ultra HD',
    description: 'Golden sandy spit enclosing flat warm turquoise water with steady thermal wind for windsurfing and kite.',
    descriptionAr: 'لسان رملي ذهبي يحيط بمياه دافئة مسطحة ورياح حرارية منتظمة تجعلها عاصمة التزلج الشراعي الأولى.',
    bestTime: '01:00 PM – 05:00 PM (18-knot Thermal Wind)',
    bestTimeAr: '٠١:٠٠ م – ٠٥:٠٠ م (رياح حرارية ١٨ عقدة)',
    tags: ['DahabLaguna', 'Kitesurfing', 'Windsurfing', 'BabyBay'],
  },
  {
    id: 'photo-st-catherine-dawn',
    title: 'Mount Sinai Dawn & St. Catherine',
    titleAr: 'شروق الشمس الأسطوري من قمة جبل موسى وسانت كاترين',
    spot: 'Mount Sinai Summit (2,285m)',
    spotAr: 'قمة جبل موسى (٢٢٨٥م)',
    category: 'desert',
    categoryLabel: 'Spiritual Summit',
    categoryLabelAr: 'قمة جبلية تاريخية',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Sinai Peak Trekkers',
    resolution: '4K Ultra HD',
    description: 'Awe-inspiring sunrise breaking over hundreds of sharp desert mountain ridges across the Sinai peninsula.',
    descriptionAr: 'مشهد الشروق المهيب فوق سلاسل الجبال الوعرة لشبه جزيرة سيناء عند ارتفاع ٢٢٨٥ متراً.',
    bestTime: '05:00 AM – 06:15 AM (Summit Sunrise)',
    bestTimeAr: '٠٥:٠٠ ص – ٠٦:١٥ ص (شروق القمة)',
    tags: ['MountSinai', 'StCatherine', 'SinaiDawn', 'PilgrimageTrek'],
    depthOrHeight: 'Summit: 2,285m',
  },
  {
    id: 'photo-bedouin-campfire',
    title: 'Bedouin Zarb Feast & Stargazing',
    titleAr: 'جلسة السمر البدوي وعشاء الزرب تحت النجوم',
    spot: 'Wadi Gnai / Abu Galum Camp',
    spotAr: 'مخيمات وادي قني وأبو جالوم',
    category: 'bedouin',
    categoryLabel: 'Sinai Hospitality',
    categoryLabelAr: 'كرم الضيافة البدوية',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Sinai Bedouin Cultural Circle',
    resolution: '4K Ultra HD',
    description: 'Traditional underground sand-oven Zarb cooking, acoustic oud campfire songs, and Milky Way stargazing.',
    descriptionAr: 'طريقة الطهي البدوية التقليدية تحت رمال الصحراء، عزف العود والسمسمية، وسماء مرصعة بالنجوم اللامعة.',
    bestTime: '07:30 PM – 11:00 PM (Deep Starlight)',
    bestTimeAr: '٠٧:٣٠ م – ١١:٠٠ م (صفاء مجرة درب التبانة)',
    tags: ['BedouinZarb', 'MilkyWay', 'CampfireAcoustics', 'SinaiNights'],
  },
  {
    id: 'photo-eel-garden-corals',
    title: 'Eel Garden Pristine Coral Garden',
    titleAr: 'حديقة ثعابين البحر والشعاب المرجانية النابضة',
    spot: 'Eel Garden Marine Reserve',
    spotAr: 'محمية إيل جاردن البحرية',
    category: 'diving',
    categoryLabel: 'Macro Life & Corals',
    categoryLabelAr: 'شعاب مرجانية وكائنات دقيقة',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
    photographer: 'Red Sea Marine Biology Group',
    resolution: '4K Ultra HD',
    description: 'Sloping sandy reef plateau covered with hundreds of dancing garden eels and resident hawkfish.',
    descriptionAr: 'منحدر رملي مرجاني نادر تعيش فيه مئات ثعابين البحر الدقيقة التي تتمايل مع حركة التيارات المائية.',
    bestTime: '10:00 AM – 01:00 PM (Peak Water Clarity)',
    bestTimeAr: '١٠:٠٠ ص – ٠١:٠٠ م (ذروة نقاء المياه)',
    tags: ['EelGarden', 'RedSeaEcosystem', 'SnorkelingHeaven', 'MarineLife'],
    depthOrHeight: 'Depth: 5-20m',
  },
];

/** Stable so useApiResource does not re-request on every render. */
const fetchGalleryPhotos = (signal: AbortSignal) => api.getGalleryPhotos(signal);

export const DahabGallerySection: React.FC = () => {
  /** Served content, with the compiled copy above as the offline fallback. */
  const remote = useApiResource(fetchGalleryPhotos);
  const photos = remote.data?.photos?.length ? remote.data.photos : DAHAB_GALLERY_PHOTOS;

  const { language, isRTL } = useLanguage();
  const { showToast } = useTrip();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<DahabPhotoItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({
    'photo-blue-hole-bells': true,
    'photo-blue-lagoon': true,
  });

  const categories = [
    { id: 'all', labelEn: 'All Photos (9)', labelAr: 'كل الصور (٩)' },
    { id: 'diving', labelEn: '🤿 Marine & Dives', labelAr: '🤿 غطس وشعاب مرجانية' },
    { id: 'lagoon', labelEn: '🌊 Lagoons & Beaches', labelAr: '🌊 لاجونا وشواطئ' },
    { id: 'desert', labelEn: '🏜 Mountains & Safari', labelAr: '🏜 جبال وسفاري' },
    { id: 'sunset', labelEn: '🌅 Golden Sunset', labelAr: '🌅 قعدات الغروب' },
    { id: 'bedouin', labelEn: '⛺ Bedouin Culture', labelAr: '⛺ سهرات وتراث بدوي' },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos((prev) => {
      const nextState = !prev[id];
      showToast(
        nextState
          ? (language === 'ar' ? 'اتحفظت في المفضلة ❤️' : 'Saved to favorites ❤️')
          : (language === 'ar' ? 'اتشالت من المفضلة' : 'Removed from favorites')
      );
      return { ...prev, [id]: nextState };
    });
  };

  const handleShare = (photo: DahabPhotoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(photo.imageUrl);
      showToast(
        language === 'ar'
          ? `اتنسخ لينك الصورة: ${photo.titleAr} 📸`
          : `Copied photo link: ${photo.title} 📸`
      );
    }
  };

  return (
    <section
      id="dahab-visual-gallery"
      aria-label="Dahab Visual Photo Gallery"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0E2520] shadow-2xl">
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F4C36C] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#52C4B7] font-serif">
                  {language === 'ar' ? 'ألبوم صور دهب وجبال سيناء' : 'DAHAB VISUAL PHOTOGRAPHY ARCHIVE'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F3EA] tracking-tight font-serif">
                {language === 'ar' ? 'شوف دهب بكاميرات وأعين زوارها الحقيقيين 4K' : 'Explore Dahab Through High-Definition Frames'}
              </h2>
              <p className="text-xs sm:text-sm text-[#D2E3DE] font-normal max-w-2xl leading-relaxed">
                {language === 'ar'
                  ? 'أحلى لقطات للبلو هول، مياه اللاجونا، شقوق الكانيون، وسهرات الصحراء مع أنسب مواعيد لكل مكان.'
                  : 'Curated high-resolution frames of the Blue Hole, Blue Lagoon, submarine rifts, and Sinai canyons with prime golden-hour shooting windows.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <div className="px-3.5 py-1.5 rounded-2xl bg-[#13312B] border border-white/10 text-[#F4C36C] text-xs font-bold flex items-center gap-2 shadow-sm">
                <Camera className="w-4 h-4 text-[#F4C36C]" />
                <span>{language === 'ar' ? '٩ صور بجودة 4K' : '9 High-Res Curated Shots'}</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#20A89A] text-[#081714] shadow-md font-extrabold'
                      : 'bg-[#13312B] hover:bg-[#173832] text-[#D2E3DE] border border-white/10'
                  }`}
                >
                  {language === 'ar' ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>

        {/* Photo Grid Bento Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo, idx) => {
            const isLiked = !!likedPhotos[photo.id];
            const isFeatured = idx === 0;

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={`group relative rounded-3xl overflow-hidden bg-[#081714] border border-white/10 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end ${
                  isFeatured ? 'sm:col-span-2 lg:col-span-2 min-h-[360px] sm:min-h-[420px]' : 'min-h-[320px]'
                }`}
              >
                {/* Photo Background Image */}
                <img
                  src={photo.imageUrl}
                  alt={language === 'ar' ? photo.titleAr : photo.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.88] group-hover:brightness-[0.95]"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay for Crisp Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#081714]/95 via-[#081714]/40 to-transparent pointer-events-none" />

                {/* Top Action Badge Chips */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#081714]/80 backdrop-blur-md border border-white/10 text-[12px] font-bold text-[#F4C36C] flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3 h-3 text-[#F4C36C]" />
                    <span>{language === 'ar' ? photo.spotAr : photo.spot}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Share photo"
                      onClick={(e) => handleShare(photo, e)}
                      className="w-8 h-8 rounded-full bg-[#081714]/60 hover:bg-[#081714] backdrop-blur-md border border-white/10 text-[#F7F3EA] flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Favorite photo"
                      onClick={(e) => toggleLike(photo.id, e)}
                      className={`w-8 h-8 rounded-full backdrop-blur-md border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                        isLiked
                          ? 'bg-[#EA8E75] border-[#EA8E75] text-[#081714]'
                          : 'bg-[#081714]/60 hover:bg-[#081714] border-white/10 text-[#F7F3EA]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="relative p-5 sm:p-6 z-10 space-y-2 text-[#F7F3EA]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#13312B] text-[#52C4B7] border border-white/10">
                      {language === 'ar' ? photo.categoryLabelAr : photo.categoryLabel}
                    </span>
                    {photo.depthOrHeight && (
                      <span className="text-[11px] font-semibold text-[#F4C36C] bg-[#173832] px-2 py-0.5 rounded-full border border-white/10">
                        {photo.depthOrHeight}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#F7F3EA] tracking-tight leading-snug group-hover:text-[#52C4B7] transition-colors">
                    {language === 'ar' ? photo.titleAr : photo.title}
                  </h3>

                  <p className="text-xs text-[#D2E3DE] line-clamp-2 font-normal leading-relaxed">
                    {language === 'ar' ? photo.descriptionAr : photo.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[12px] text-[#D2E3DE] border-t border-white/10">
                    <span className="flex items-center gap-1 text-[#F4C36C]">
                      <Sun className="w-3 h-3" />
                      <span>{language === 'ar' ? photo.bestTimeAr : photo.bestTime}</span>
                    </span>
                    <span className="text-[#9DB5AF] group-hover:text-[#F7F3EA] flex items-center gap-1 font-semibold transition-colors">
                      <span>{language === 'ar' ? 'عرض مكبّر' : 'Expand'}</span>
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHOTO LIGHTBOX MODAL DIALOG                                              */}
      {/* ========================================================================= */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo view"
          className="fixed inset-0 z-50 bg-[#081714]/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0E2520] text-[#F7F3EA] rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#081714]/80 hover:bg-[#081714] text-[#F7F3EA] flex items-center justify-center transition-all cursor-pointer border border-white/15"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Photo Frame */}
            <div className="md:w-3/5 bg-[#081714] flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              <img
                src={selectedPhoto.imageUrl}
                alt={language === 'ar' ? selectedPhoto.titleAr : selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[75vh]"
              />
              <span className="absolute bottom-3 left-3 bg-[#081714]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-[#D2E3DE] border border-white/10">
                {selectedPhoto.resolution} · {selectedPhoto.photographer}
              </span>
            </div>

            {/* Sidebar Photo Details */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#52C4B7]">
                    {language === 'ar' ? selectedPhoto.categoryLabelAr : selectedPhoto.categoryLabel}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#F7F3EA]">
                    {language === 'ar' ? selectedPhoto.titleAr : selectedPhoto.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#F4C36C] font-semibold pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F4C36C]" />
                    <span>{language === 'ar' ? selectedPhoto.spotAr : selectedPhoto.spot}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#D2E3DE] leading-relaxed">
                  {language === 'ar' ? selectedPhoto.descriptionAr : selectedPhoto.description}
                </p>

                {/* Best Visit Conditions */}
                <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-[#F4C36C] flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'أحسن وقت للزيارة والتصوير' : 'Prime Light & Visit Window'}</span>
                  </div>
                  <div className="text-xs text-[#F7F3EA]">
                    {language === 'ar' ? selectedPhoto.bestTimeAr : selectedPhoto.bestTime}
                  </div>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPhoto.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-[#13312B] text-[#D2E3DE] text-[11px] font-medium border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions inside Lightbox */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => toggleLike(selectedPhoto.id, e)}
                  className={`flex-1 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    likedPhotos[selectedPhoto.id]
                      ? 'bg-[#EA8E75] text-[#081714]'
                      : 'bg-[#13312B] hover:bg-[#173832] text-[#F7F3EA] border border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPhotos[selectedPhoto.id] ? 'fill-current' : ''}`} />
                  <span>{likedPhotos[selectedPhoto.id] ? (language === 'ar' ? 'في المفضلة ❤️' : 'Favorited') : (language === 'ar' ? 'حفظ في المفضلة' : 'Add to Favorites')}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShare(selectedPhoto, e)}
                  className="px-5 py-2.5 rounded-2xl bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#081714]" />
                  <span>{language === 'ar' ? 'مشاركة الصورة' : 'Share'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
