import type { AppRoute } from '../types';
import type { DestinationId } from '../design/destinations';
import type { PlanVibe } from '../services/planMatcher';

/**
 * Editorial home content per destination: the category doors, the picks for
 * places whose catalogue is still early, and the story frames.
 *
 * Arabic is light Egyptian colloquial (product decision). Images come from
 * the project library; Nuweiba and Siwa frames are representative until the
 * team's own photography of each place replaces them. Nothing here implies a
 * price or availability the catalogue cannot back: early-destination picks
 * carry no price and lead to the planner.
 */

export type PictogramId =
  | 'dive' | 'kite' | 'camel' | 'mountain' | 'dome' | 'jeep'
  | 'hut' | 'snorkel' | 'canyon' | 'stars' | 'hammock'
  | 'spring' | 'saltlake' | 'fortress' | 'palm' | 'lotus';

type Bi = { en: string; ar: string };

export interface CategoryDoor {
  id: string;
  pictogram: PictogramId;
  label: Bi;
  /** Live destinations open a real catalogue page… */
  route?: AppRoute;
  /** …early ones start the planner pre-filled with what the door promised. */
  planVibes?: PlanVibe[];
}

export interface EditorialPick {
  id: string;
  title: Bi;
  meta: Bi;
  /** Omitted when the library has no honest photo of it yet: the card draws the place's landscape art. */
  image?: string;
  vibes: PlanVibe[];
}

export interface StoryFrame {
  src: string;
  caption: Bi;
}

export const CATEGORY_DOORS: Record<DestinationId, CategoryDoor[]> = {
  dahab: [
    { id: 'dive', pictogram: 'dive', label: { en: 'Dive', ar: 'غطس' }, route: '/attractions' },
    { id: 'kite', pictogram: 'kite', label: { en: 'Kite', ar: 'كايت' }, route: '/attractions' },
    { id: 'desert', pictogram: 'camel', label: { en: 'Desert', ar: 'صحرا' }, route: '/attractions' },
    { id: 'sinai', pictogram: 'mountain', label: { en: 'Sinai', ar: 'سينا' }, route: '/attractions' },
    { id: 'stay', pictogram: 'dome', label: { en: 'Stay', ar: 'إقامة' }, route: '/hotels' },
    { id: 'rides', pictogram: 'jeep', label: { en: 'Rides', ar: 'مشاوير' }, route: '/transfers/local' },
  ],
  nuweiba: [
    { id: 'camps', pictogram: 'hut', label: { en: 'Beach camps', ar: 'كامبات' }, planVibes: ['unplug', 'sea'] },
    { id: 'snorkel', pictogram: 'snorkel', label: { en: 'Snorkel', ar: 'سنوركل' }, planVibes: ['sea'] },
    { id: 'canyons', pictogram: 'canyon', label: { en: 'Canyons', ar: 'كانيونات' }, planVibes: ['nature', 'adventure'] },
    { id: 'stars', pictogram: 'stars', label: { en: 'Stars', ar: 'نجوم' }, planVibes: ['stars'] },
    { id: 'unplug', pictogram: 'hammock', label: { en: 'Unplug', ar: 'فصلان' }, planVibes: ['unplug'] },
    { id: 'desert', pictogram: 'camel', label: { en: 'Desert', ar: 'صحرا' }, planVibes: ['desert'] },
  ],
  siwa: [
    { id: 'springs', pictogram: 'spring', label: { en: 'Springs', ar: 'عيون' }, planVibes: ['wellness'] },
    { id: 'salt', pictogram: 'saltlake', label: { en: 'Salt lakes', ar: 'بحيرات الملح' }, planVibes: ['wellness'] },
    { id: 'safari', pictogram: 'jeep', label: { en: 'Sand sea', ar: 'بحر الرمال' }, planVibes: ['desert', 'adventure'] },
    { id: 'heritage', pictogram: 'fortress', label: { en: 'Heritage', ar: 'تاريخ' }, planVibes: ['culture'] },
    { id: 'wellness', pictogram: 'lotus', label: { en: 'Wellness', ar: 'استشفاء' }, planVibes: ['wellness', 'unplug'] },
    { id: 'stars', pictogram: 'stars', label: { en: 'Stars', ar: 'نجوم' }, planVibes: ['stars'] },
  ],
};

/** Picks for destinations without a live catalogue yet. Dahab's come from the research overview API. */
export const EDITORIAL_PICKS: Partial<Record<DestinationId, EditorialPick[]>> = {
  nuweiba: [
    {
      id: 'nw-shore-snorkel',
      title: { en: 'Snorkel straight from your camp', ar: 'سنوركل من قدام الكامب على طول' },
      meta: { en: 'House reef · any time of day', ar: 'شعاب قريبة · في أي وقت' },
      image: '/images/attractions/attr-house-reef.webp',
      vibes: ['sea'],
    },
    {
      id: 'nw-colored-canyon',
      title: { en: 'Walk the Colored Canyon', ar: 'مشي في الكانيون الملوّن' },
      meta: { en: 'Half day · early start', ar: 'نص يوم · بدري' },
      image: '/images/attractions/attr-colored-canyon.webp',
      vibes: ['nature', 'adventure'],
    },
    {
      id: 'nw-fire-stars',
      title: { en: 'Bedouin dinner and stars', ar: 'عشا بدوي ونجوم' },
      meta: { en: 'Evening · at the camp', ar: 'بالليل · في الكامب' },
      image: '/images/gallery/story-campfire.webp',
      vibes: ['stars'],
    },
  ],
  siwa: [
    {
      id: 'sw-salt-float',
      title: { en: 'Float in the salt lakes', ar: 'تطفو في بحيرات الملح' },
      meta: { en: 'Half day · bring a towel', ar: 'نص يوم · هات فوطة' },
      vibes: ['wellness'],
    },
    {
      id: 'sw-sand-sea',
      title: { en: 'Into the Great Sand Sea', ar: 'جوه بحر الرمال الأعظم' },
      meta: { en: 'Afternoon to night · 4x4', ar: 'من العصر للّيل · دفع رباعي' },
      image: '/images/booking/book-desert-camp-2.webp',
      vibes: ['desert', 'adventure'],
    },
    {
      id: 'sw-shali',
      title: { en: 'Shali at golden hour', ar: 'شالي وقت المغرب' },
      meta: { en: '1–2 hours · old town', ar: 'ساعة لساعتين · البلد القديمة' },
      vibes: ['culture'],
    },
  ],
};

export const STORY_FRAMES_BY_DESTINATION: Partial<Record<DestinationId, StoryFrame[]>> = {
  nuweiba: [
    { src: '/images/explore/explore-beach-cove.webp', caption: { en: 'Shade, sand and the gulf', ar: 'ضل ورملة والخليج' } },
    { src: '/images/spontaneous/spont-morning-swim.webp', caption: { en: 'First swim of the day', ar: 'أول عومة في اليوم' } },
    { src: '/images/spontaneous/spont-beach-chill.webp', caption: { en: 'Nowhere to be', ar: 'ولا ورانا حاجة' } },
    { src: '/images/attractions/attr-colored-canyon.webp', caption: { en: 'Canyon colours', ar: 'ألوان الكانيون' } },
    { src: '/images/gallery/story-campfire.webp', caption: { en: 'Fire after dark', ar: 'نار بعد المغرب' } },
  ],
  siwa: [
    { src: '/images/hero/splash-desert-golden.webp', caption: { en: 'The sand sea begins', ar: 'هنا بيبدأ بحر الرمال' } },
    { src: '/images/booking/book-desert-camp-2.webp', caption: { en: 'Camp in the dunes', ar: 'كامب وسط الكثبان' } },
    { src: '/images/food/bedouin-tea-fire.webp', caption: { en: 'Tea on the coals', ar: 'شاي على الفحم' } },
    { src: '/images/booking/safari-sinai-stars.webp', caption: { en: 'A sky full of stars', ar: 'سما مليانة نجوم' } },
  ],
};
