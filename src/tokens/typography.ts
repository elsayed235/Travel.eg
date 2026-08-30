/**
 * DAHAB VISUAL LANGUAGE SYSTEM
 * Typography Token System - 2026 Bilingual Scale & Font Stacks
 * Harmonized pairing of modern Latin & Arabic scripts
 */

export const DAHAB_TYPOGRAPHY = {
  fontFamilies: {
    // English & Latin Typography
    display: "'Outfit', 'Space Grotesk', sans-serif",
    serif: "'Playfair Display', 'El Messiri', Georgia, serif",
    body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Space Grotesk', ui-monospace, monospace",

    // Arabic Typography (Modern 2026 Curated Stacks)
    arabicDisplay: "'Alexandria', 'Readex Pro', 'Cairo', sans-serif",
    arabicBody: "'Alexandria', 'IBM Plex Sans Arabic', 'Readex Pro', 'Cairo', -apple-system, sans-serif",
    arabicSerif: "'El Messiri', 'Playfair Display', Georgia, serif",
    arabicEditorial: "'Alexandria', 'El Messiri', sans-serif",
  },

  scale: {
    display2xl: {
      fontSize: '4.0rem', // 64px
      lineHeight: '1.08',
      letterSpacing: '-0.035em',
      fontWeight: '300',
      arabicLineHeight: '1.30',
      arabicLetterSpacing: '0.000em',
    },
    displayXl: {
      fontSize: '3.0rem', // 48px
      lineHeight: '1.12',
      letterSpacing: '-0.025em',
      fontWeight: '400',
      arabicLineHeight: '1.32',
      arabicLetterSpacing: '0.000em',
    },
    displayLg: {
      fontSize: '2.25rem', // 36px
      lineHeight: '1.18',
      letterSpacing: '-0.020em',
      fontWeight: '600',
      arabicLineHeight: '1.35',
      arabicLetterSpacing: '0.000em',
    },
    title: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.28',
      letterSpacing: '-0.015em',
      fontWeight: '700',
      arabicLineHeight: '1.40',
      arabicLetterSpacing: '0.000em',
    },
    subtitle: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.40',
      letterSpacing: '-0.010em',
      fontWeight: '600',
      arabicLineHeight: '1.45',
      arabicLetterSpacing: '0.000em',
    },
    body: {
      fontSize: '0.9375rem', // 15px
      lineHeight: '1.62',
      letterSpacing: '0.000em',
      fontWeight: '400',
      arabicLineHeight: '1.70',
      arabicLetterSpacing: '0.000em',
    },
    caption: {
      fontSize: '0.8125rem', // 13px
      lineHeight: '1.52',
      letterSpacing: '+0.010em',
      fontWeight: '500',
      arabicLineHeight: '1.60',
      arabicLetterSpacing: '0.000em',
    },
    utility: {
      fontSize: '0.6875rem', // 11px
      lineHeight: '1.35',
      letterSpacing: '+0.040em',
      textTransform: 'uppercase' as const,
      fontWeight: '700',
      arabicLineHeight: '1.45',
      arabicLetterSpacing: '0.000em',
    },
    micro: {
      fontSize: '0.625rem', // 10px
      lineHeight: '1.25',
      letterSpacing: '+0.060em',
      textTransform: 'uppercase' as const,
      fontWeight: '800',
      arabicLineHeight: '1.35',
      arabicLetterSpacing: '0.000em',
    },
  },
} as const;
