import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { HomepageContent, CmsContentPage, CmsPageBlockWire, CmsPageWithBlocks, NavigationItemWire, ExploreCategoryWire } from '../services/api';

/**
 * CMS Content Hook — fetches published content from the CMS API
 * with automatic fallback to compiled static data when the API is unavailable.
 *
 * Usage:
 *   const { sections, hero, loading, fromCMS } = useHomepageContent();
 *   const { photos, loading } = useGalleryPhotos();
 *   const { programmes, loading } = useTripProgrammes();
 */

interface UseCmsResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fromCMS: boolean;
}

/**
 * Generic hook to fetch CMS data with fallback.
 */
function useCmsFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  fallback: T
): UseCmsResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fromCMS, setFromCMS] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchFn(controller.signal);
        setData(result);
        setFromCMS(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[CMS] API unavailable, using fallback:', err.message);
          setData(fallback);
          setFromCMS(false);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  return { data: data ?? fallback, loading, error, fromCMS };
}

// ============================================================================
// Homepage Content
// ============================================================================

const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: null,
  sections: [],
  featuredPrograms: [],
  featuredGallery: [],
  featuredStories: [],
};

export function useHomepageContent(): UseCmsResult<HomepageContent> {
  return useCmsFetch<HomepageContent>(
    async (signal) => {
      const data = await api.getCmsHomepage(signal);
      return data;
    },
    DEFAULT_HOMEPAGE
  );
}

// ============================================================================
// Gallery Photos
// ============================================================================

export function useGalleryPhotos(): UseCmsResult<CmsContentPage[]> {
  return useCmsFetch<CmsContentPage[]>(
    async (signal) => {
      const data = await api.getCmsGallery(signal);
      return data.photos || [];
    },
    []
  );
}

// ============================================================================
// Trip Programmes
// ============================================================================

export function useTripProgrammes(): UseCmsResult<CmsContentPage[]> {
  return useCmsFetch<CmsContentPage[]>(
    async (signal) => {
      const data = await api.getCmsProgrammes(signal);
      return data.programmes || [];
    },
    []
  );
}

// ============================================================================
// Curated Stories
// ============================================================================

export function useCuratedStories(): UseCmsResult<CmsContentPage[]> {
  return useCmsFetch<CmsContentPage[]>(
    async (signal) => {
      const data = await api.getCmsStories(signal);
      return data.stories || [];
    },
    []
  );
}

// ============================================================================
// Content Page by Slug (with blocks)
// ============================================================================

export function useContentPage(slug: string): UseCmsResult<CmsPageWithBlocks> {
  return useCmsFetch<CmsPageWithBlocks>(
    async (signal) => {
      const data = await api.getCmsPage(slug, signal);
      return data;
    },
    { page: null, blocks: [] }
  );
}

// ============================================================================
// Navigation
// ============================================================================

type NavigationItem = NavigationItemWire;

export function useNavigation(menuKey: string): UseCmsResult<NavigationItem[]> {
  return useCmsFetch<NavigationItem[]>(
    async (signal) => {
      const data = await api.getCmsNavigation(menuKey, signal);
      return data.items || [];
    },
    []
  );
}

// ============================================================================
// Explore Categories
// ============================================================================

export interface ExploreCategory {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  tagline_en: string;
  tagline_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
  highlights_en: string[];
  highlights_ar: string[];
  sort_order: number;
}

const DEFAULT_EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    id: 'diving', slug: 'cat-diving', title_en: 'Diving', title_ar: 'عالم الغطس والأعماق',
    tagline_en: 'Explore Dahab underwater.', tagline_ar: 'اكتشف عالم تحت المية والشعب المرجانية الأسطورية',
    description_en: 'World-renowned shore dives, the iconic Blue Hole, vibrant coral labyrinths at the Canyon, and serene freediving bays.',
    description_ar: 'أشهر مواقع الغطس الشاطئي في العالم، مغامرة البلو هول، متاهات الكانيون المرجانية، وبقاع الغوص الحر الهادية.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    highlights_en: ['Blue Hole & The Arch', 'The Canyon', 'Eel Garden Reef', 'Lighthouse Shore Dive'],
    highlights_ar: ['البلو هول وحيد الشعب', 'كانيون دهب الكهفي', 'محمية إيل جاردن', 'شاطئ اللايتهاوس'],
    sort_order: 0,
  },
  {
    id: 'adventure', slug: 'cat-adventure', title_en: 'Adventure', title_ar: 'المغامرة والوديان',
    tagline_en: 'Desert, mountains, and open roads.', tagline_ar: 'جبال شاهقة، كانيونز ملونة، ودروب الصحراء الواسعة',
    description_en: 'Climb the rugged Sinai mountain trails, canyon trekking through Wadi Gnai, starlit Bedouin nights, and quad safaris through ancient valleys.',
    description_ar: 'مسارات المشي وتسلق صخور سيناء، عبور كانيون وادي قني، سهرات عشاء بدوي تحت النجوم، وسفاري البيتش باجي في الوديان.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    highlights_en: ['Wadi Gnai Bouldering', 'Colored Canyon Trek', 'Mount Sinai Sunrise', 'Desert Quad Trails'],
    highlights_ar: ['تسلق وادي قني', 'الكانيون الملون', 'شروق جبل موسى', 'سفاري البيتش باجي'],
    sort_order: 1,
  },
  {
    id: 'beach', slug: 'cat-beach', title_en: 'Beach & Coastal Chill', title_ar: 'شواطئ وفصلان ع البحر',
    tagline_en: 'Slow down by the sea.', tagline_ar: 'افصل وريح دماغك مع نسيم البحر الأحمر الهادي',
    description_en: 'Unwind along quiet pebble shores, swim in crystalline shallow lagoons, catch calm morning breezes, and read under shaded thatched palapas.',
    description_ar: 'استجمام في شواطئ دهب الهادية، عوم في مياه البلو لاجون الفيروزية، قعدة شلتات مظللة وقراءة كتاب على البحر مع نسيم الصبح.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    highlights_en: ['Blue Lagoon Hammocks', 'Lighthouse Bay Promenade', 'Laguna Kite Beach', 'Secret Cove Relax'],
    highlights_ar: ['شلتات البلو لاجون', 'ممشى خليج اللايتهاوس', 'لاجونا الكايت سيرف', 'خلجان الاسترخاء الهادية'],
    sort_order: 2,
  },
  {
    id: 'food', slug: 'cat-food', title_en: 'Food & Cafés', title_ar: 'أكل ومطاعم وكافيهات',
    tagline_en: 'Discover local flavors and cafés.', tagline_ar: 'سمك البحر الأحمر الطازة، مخابز مميزة، وشاي الحبق البدوي',
    description_en: 'Fresh grilled Red Sea catch, traditional Bedouin flatbreads baked on open fire, artisan specialty coffee, and open-air seaside terraces.',
    description_ar: 'صيد اليوم المشوي ع الفحم مباشرة، العيش البدوي المخبوز ع الحطب، سبشيلتي كوفي طازة، وقعدات أكل بحرية مفتوحة ع الممشى.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    highlights_en: ['Bedouin Seafood BBQ', 'Artisan Bakery Courtyards', 'Seaside Mezzes & Tea', 'Sun-drenched Smoothie Cafés'],
    highlights_ar: ['مشاوي سمك ع البحر', 'مخابز كافيهات فريش', 'مقبلات وشاي بالحبق', 'عصاير وسموذي طبيعي'],
    sort_order: 3,
  },
  {
    id: 'local-life', slug: 'cat-local-life', title_en: 'Local Life & Soul', title_ar: 'حياة وروح دهب وأهلها',
    tagline_en: 'Experience Dahab beyond the usual tourist spots.', tagline_ar: 'عيش تفاصيل دهب الحقيقية بروقان وبساطة',
    description_en: 'Wander through Assalah market, meet local artisans and craftspeople, listen to acoustic oud melodies by the shore, and embrace the unhurried Sinai rhythm.',
    description_ar: 'تمشية في سوق العصلة، لقاء الحرفيين وصناع الفخار والفضة البدوية، دندنة العود ع الشط وقت الغروب، وعيش ريتم دهب اللي مفيش فيه أي استعجال.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    highlights_en: ['Assalah Artisan Market', 'Bedouin Herb & Tea Gathering', 'Acoustic Sunset Circles', 'Local Pottery & Weaving'],
    highlights_ar: ['سوق العصلة التراثي', 'قعدة أعشاب وشاي بدوي', 'دوائر عزف العود والغروب', 'فخار ونسيج يدوي سيناوي'],
    sort_order: 4,
  },
];

export function useExploreCategories(): UseCmsResult<ExploreCategory[]> {
  return useCmsFetch<ExploreCategory[]>(
    async (signal) => {
      const data = await api.getCmsExploreCategories(signal);
      return (data.categories || []).map(p => {
        const config = typeof p.config === 'string' ? JSON.parse(p.config) : (p.config || {});
        return {
          id: p.id,
          slug: p.slug,
          title_en: p.title_en,
          title_ar: p.title_ar,
          tagline_en: p.subtitle_en,
          tagline_ar: p.subtitle_ar,
          description_en: p.description_en,
          description_ar: p.description_ar,
          image: p.hero_image_url,
          highlights_en: config.highlights_en || [],
          highlights_ar: config.highlights_ar || [],
          sort_order: p.sort_order,
        };
      });
    },
    DEFAULT_EXPLORE_CATEGORIES
  );
}

// ============================================================================
// How It Works Steps
// ============================================================================

export interface HowItWorksStep {
  number: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  subtext_en: string;
  subtext_ar: string;
  iconName: string;
}

const DEFAULT_HOW_IT_WORKS: HowItWorksStep[] = [
  {
    number: '01', title_en: 'Tell us what you want', title_ar: 'أخبرنا ماذا تريد',
    description_en: 'Share your dates, budget, interests, and travel style.',
    description_ar: 'شاركنا تواريخك وميزانيتك واهتماماتك وأسلوب سفرك.',
    subtext_en: 'Whether you want non-stop dives or quiet seaside afternoons, start with what matters to you.',
    subtext_ar: 'سواء كنت تريد غوصًا متواصلًا أو ظهورًا هادئة على البحر، ابدأ بما يهمك.',
    iconName: 'Compass',
  },
  {
    number: '02', title_en: 'Build your trip', title_ar: ' ابنِ رحلتك',
    description_en: 'Get a trip shaped around the way you want to experience Dahab.',
    description_ar: 'احصل على رحلة مصممة حول طريقة رغبتك في تجربة دهب.',
    subtext_en: 'A cohesive schedule linking boutique stays, trusted guides, gear rental, and authentic meals.',
    subtext_ar: 'جدول متماسك يربط الإقامات البوتique والمرشدين الموثوقين وتأجير المعدات والوجبات الأصيلة.',
    iconName: 'Sparkles',
  },
  {
    number: '03', title_en: 'Enjoy the journey', title_ar: 'استمتع بالرحلة',
    description_en: 'Keep your trip organized and get help when you need it.',
    description_ar: 'حافظ على تنظيم رحلتك واحصل على المساعدة عندما تحتاجها.',
    subtext_en: 'One clear itinerary in your pocket with local tips, timing cues, and seamless support.',
    subtext_ar: 'خط سير واضح في جيبك مع نصائح محلية وإشارات توقيت ودعم سلس.',
    iconName: 'MapPin',
  },
];

export function useHowItWorks(): UseCmsResult<HowItWorksStep[]> {
  return useCmsFetch<HowItWorksStep[]>(
    async (signal) => {
      const data = await api.getCmsHowItWorks(signal);
      return (data.blocks || []).sort((a, b) => a.sort_order - b.sort_order).map(b => {
        const config = typeof b.config === 'string' ? JSON.parse(b.config) : (b.config || {});
        const numMatch = b.title_en.match(/^\d+\s*[—–-]\s*(.+)/);
        return {
          number: config.number || String(b.sort_order + 1).padStart(2, '0'),
          title_en: numMatch ? numMatch[1] : b.title_en,
          title_ar: b.title_ar?.replace(/^\d+\s*[—–-]\s*/, '') || b.title_en,
          description_en: b.body_en,
          description_ar: b.body_ar,
          subtext_en: config.subtext_en || '',
          subtext_ar: config.subtext_ar || '',
          iconName: config.iconName || 'Compass',
        };
      });
    },
    DEFAULT_HOW_IT_WORKS
  );
}

// ============================================================================
// Trip Preview Days
// ============================================================================

export interface TripPreviewDay {
  day: number;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  highlights_en: string[];
  highlights_ar: string[];
  tag: string;
  tag_ar: string;
}

const DEFAULT_TRIP_PREVIEW: TripPreviewDay[] = [
  {
    day: 1, title_en: 'Arrival · Hotel · Dinner', title_ar: 'الوصول · الفندق · العشاء',
    subtitle_en: 'Check into boutique seafront eco-lodge, coastal stroll along the promenade, and fresh Bedouin fish dinner by the water.',
    subtitle_ar: 'تسجيل الوصول في فندق بيتيك على الشاطئ، نزهة ساحلية على الممشى، وعشاء سمك بدوي طازج بجانب الماء.',
    highlights_en: ['Scenic transfer from Sharm/Tabah', 'Promenade sunset stroll', 'Authentic catch of the day by torchlight'],
    highlights_ar: ['نقل سياحي من شرم/طابا', 'نزولة عند الغروب على الممشى', 'صيد اليوم الطازج بالشمس'],
    tag: 'Arrival & Settle In', tag_ar: 'الوصول والاستقرار',
  },
  {
    day: 2, title_en: 'Diving · Lunch · Free Time', title_ar: 'الغوص · الغداء · وقت حر',
    subtitle_en: 'Morning 2-tank guided shore dive at The Canyon & Lighthouse Reef, seaside hummus lunch, and relaxed afternoon coffee.',
    subtitle_ar: 'غوص صباحي بخزانين في الكانيون وشعاب اللاителяوس، غداء حمص على البحر، وقهوة مسائية مسترخية.',
    highlights_en: ['2-tank coral reef dive with master guide', 'Fresh herb falafel & iced tea', 'Relaxed barefoot exploration'],
    highlights_ar: ['غوص شعاب مرجاني بخزانين مع مرشد', 'فلافل بالأعشاب الطازجة وشاي مثلج', 'استكشاف حافي القدمين'],
    tag: 'Underwater Day', tag_ar: 'يوم تحت الماء',
  },
  {
    day: 3, title_en: 'Desert · Canyon · Bedouin Camp', title_ar: 'الصحراء · الكانيون · مخيم بدوي',
    subtitle_en: '4x4 safari through Colored Canyon, Bedouin tea ceremony in a remote wadi, stargazing from camp.',
    subtitle_ar: 'سفاري بالدفع الرباعي عبر الكانيون الملون، مراسم شاي بدوية في وادي نائي، رص النجوم من المخيم.',
    highlights_en: ['Colored Canyon narrows trek', 'Bedouin tea under acacia trees', 'Starry sky from desert camp'],
    highlights_ar: ['عبور ممرات الكانيون الملون', 'شاي بدوي تحت أشجار الطلح', 'سماء مرصعة من مخيم الصحراء'],
    tag: 'Desert Explorer', tag_ar: 'مستكشف الصحراء',
  },
  {
    day: 4, title_en: 'Beach · Snorkel · Sunset', title_ar: 'الشاطئ · سنوركل · غروب',
    subtitle_en: 'Morning snorkeling at Blue Lagoon, hammock time, artisan lunch at Assalah, and sunset at Lighthouse.',
    subtitle_ar: 'سنوركل صباحي في البلو لاجون، وقت في الشلتات، غداء حرفي في العصلة، وغروب عند اللايتهاوس.',
    highlights_en: ['Blue Lagoon crystal snorkel', 'Assalah market lunch', 'Lighthouse sunset viewpoint'],
    highlights_ar: ['سنوركل في بلو لاجون الكريستال', 'غداء في سوق العصلة', 'نقطة مشاهدة الغروب عند اللايتهاوس'],
    tag: 'Coastal Relaxation', tag_ar: 'استرخاء ساحلي',
  },
  {
    day: 5, title_en: 'Free Day · Shopping · Farewell', title_ar: 'يوم حر · تسوق · وداع',
    subtitle_en: 'Flexible morning — yoga, diving, or relaxation. Afternoon souvenir shopping and farewell dinner.',
    subtitle_ar: 'صباح حر — يوغا أو غوص أو استرخاء. بعد الظهر تسوق للهدايا وعشاء وداع.',
    highlights_en: ['Flexible morning choice', 'Assalah souvenir shopping', 'Farewell Bedouin BBQ dinner'],
    highlights_ar: ['اختيار صباح حر', 'تسوق الهدايا في العصلة', 'عشاء وداع بدوي مشوي'],
    tag: 'Flexible Day', tag_ar: 'يوم مرن',
  },
];

export function useTripPreviewDays(): UseCmsResult<TripPreviewDay[]> {
  return useCmsFetch<TripPreviewDay[]>(
    async (signal) => {
      const data = await api.getCmsTripPreview(signal);
      return (data.blocks || []).sort((a, b) => a.sort_order - b.sort_order).map(b => {
        const config = typeof b.config === 'string' ? JSON.parse(b.config) : (b.config || {});
        return {
          day: config.day || b.sort_order + 1,
          title_en: b.title_en.replace(/^Day \d+:\s*/, ''),
          title_ar: b.title_ar?.replace(/^\u0627\u0644\u064a\u0648\u0645 \d+:\s*/, '') || b.title_en,
          subtitle_en: b.body_en,
          subtitle_ar: b.body_ar,
          highlights_en: config.highlights_en || [],
          highlights_ar: config.highlights_ar || [],
          tag: config.tag || '',
          tag_ar: config.tag_ar || '',
        };
      });
    },
    DEFAULT_TRIP_PREVIEW
  );
}

