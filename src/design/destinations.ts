import type { Transition } from 'motion/react';

/**
 * The places REHLA covers (brand board §03). Dahab is the default and the
 * only destination with a full live catalogue today; Nuweiba and Siwa open
 * with editorial content and a growing supplier list (`catalogue: 'early'`),
 * which screens use to set expectations honestly instead of showing empty
 * grids.
 *
 * Colour and tempo live in src/styles/tokens.css under data-destination;
 * this file holds what code needs: names, copy, imagery, and the motion
 * personality for `motion/react`.
 */

export const DESTINATION_IDS = ['dahab', 'nuweiba', 'siwa'] as const;
export type DestinationId = (typeof DESTINATION_IDS)[number];
export const DEFAULT_DESTINATION: DestinationId = 'dahab';

export interface Destination {
  id: DestinationId;
  name: { en: string; ar: string };
  /** Design-system name for the palette (shown in staff tools only). */
  system: string;
  tagline: { en: string; ar: string };
  mood: { en: string[]; ar: string[] };
  catalogue: 'live' | 'early';
  /** Theme colour for the browser chrome, per theme. */
  chrome: { abyss: string; salt: string };
  /** Representative swatch pair for pickers (water/land). */
  swatch: [string, string];
  /** Hero imagery under public/images; destinations without photography yet use their landscape art. */
  heroImage?: string;
  /** Motion personality: how springs feel in this place. */
  motion: {
    spring: Transition;
    layout: Transition;
    /** Multiplier for stagger delays between list items. */
    stagger: number;
  };
}

export const DESTINATIONS: Record<DestinationId, Destination> = {
  dahab: {
    id: 'dahab',
    name: { en: 'Dahab', ar: 'دهب' },
    system: 'Granite & Lagoon',
    tagline: { en: 'Where the desert meets the sea', ar: 'هنا الصحرا بتقابل البحر' },
    mood: { en: ['Energetic', 'Adventurous', 'Social'], ar: ['نشاط', 'مغامرة', 'ناس'] },
    catalogue: 'live',
    chrome: { abyss: '#0B151C', salt: '#F5F4F0' },
    swatch: ['#1F9D97', '#9A5642'],
    heroImage: '/images/hero/conc-hero-reef.webp',
    motion: {
      spring: { type: 'spring', stiffness: 420, damping: 30 },
      layout: { type: 'spring', stiffness: 380, damping: 32 },
      stagger: 1,
    },
  },
  nuweiba: {
    id: 'nuweiba',
    name: { en: 'Nuweiba', ar: 'نويبع' },
    system: 'Driftwood & Shallows',
    tagline: { en: 'A hut on the shore, and time is yours', ar: 'عشة على البحر، والوقت ملكك' },
    mood: { en: ['Still', 'Simple', 'Unplugged'], ar: ['هدوء', 'بساطة', 'بعيد عن الدوشة'] },
    catalogue: 'early',
    chrome: { abyss: '#0F1A1E', salt: '#F2F1EB' },
    swatch: ['#6FB3BF', '#B6A28C'],
    motion: {
      spring: { type: 'tween', duration: 0.48, ease: [0.45, 0, 0.2, 1] },
      layout: { type: 'tween', duration: 0.5, ease: [0.45, 0, 0.2, 1] },
      stagger: 1.6,
    },
  },
  siwa: {
    id: 'siwa',
    name: { en: 'Siwa', ar: 'سيوة' },
    system: 'Salt & Palm',
    tagline: { en: 'An oasis that heals', ar: 'واحة بتداوي' },
    mood: { en: ['Healing', 'Warm', 'Contemplative'], ar: ['استشفاء', 'دفا', 'تأمّل'] },
    catalogue: 'early',
    chrome: { abyss: '#16130F', salt: '#F6F2EA' },
    swatch: ['#4A7445', '#D9B583'],
    motion: {
      spring: { type: 'tween', duration: 0.6, ease: [0.37, 0, 0.2, 1] },
      layout: { type: 'tween', duration: 0.7, ease: [0.37, 0, 0.2, 1] },
      stagger: 2,
    },
  },
};

export const isDestinationId = (v: unknown): v is DestinationId =>
  typeof v === 'string' && (DESTINATION_IDS as readonly string[]).includes(v);
