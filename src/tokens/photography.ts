/**
 * DAHAB VISUAL LANGUAGE SYSTEM
 * Photography Tokens & Aspect Ratio Standards
 */

export const DAHAB_PHOTOGRAPHY = {
  aspectRatios: {
    hero: '16/9',
    panoramic: '21/9',
    story: '4/3',
    portrait: '3/4',
    square: '1/1',
  },

  overlays: {
    heroDark: 'linear-gradient(180deg, rgba(4, 23, 29, 0.4) 0%, rgba(4, 23, 29, 0.85) 100%)',
    cardBottom: 'linear-gradient(0deg, rgba(4, 23, 29, 0.9) 0%, rgba(4, 23, 29, 0.25) 50%, transparent 100%)',
    subtleGlass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
  },

  rules: {
    filmGrainOpacity: 0.035,
    borderRadius: '1.5rem', // 24px rounded-3xl
  },
} as const;
