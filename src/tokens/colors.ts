/**
 * DAHAB VISUAL LANGUAGE SYSTEM
 * Color Token System - Native Sinai & Red Sea Palette
 */

export const DAHAB_COLORS = {
  // Deep Red Sea & Night Foundations
  night: '#04171D',
  deepSea: '#062C35',
  deepSeaLight: '#0A3A46',
  deepSeaSurface: '#104957',

  // Red Sea Teal & Lagoon
  teal: '#0F6F78',
  tealDark: '#0A535A',
  tealLight: '#158F9B',
  lagoon: '#20A89A',
  lagoonLight: '#52C4B7',
  lagoonSoft: '#D5F3EF',
  lagoonDark: '#15796E',

  // Sinai Sand & Desert Granites
  canvas: '#F7F3EA',
  sandSoft: '#EFE8D8',
  sand: '#E7D3AE',
  warmSand: '#C7A56A',
  sandDark: '#8F7242',

  // Sunset Coral & Emotional Accents
  coral: '#D96C4F',
  coralDark: '#B94E33',
  coralLight: '#EA8E75',
  coralSoft: '#FCECE8',

  // Sinai Sun Gold & Premium Highlights
  gold: '#E7A83B',
  goldDark: '#A86F14',
  goldLight: '#F4C36C',
  goldSoft: '#FDF4E3',

  // Typography Ink & Contrast
  ink: '#142126',
  inkSecondary: '#3D4E55',
  inkMuted: '#6B7C83',
  inkSubtle: '#9AA8AE',
  inkLight: '#F7F3EA',
} as const;

export type DahabColorToken = keyof typeof DAHAB_COLORS;
