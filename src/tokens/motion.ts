/**
 * DAHAB VISUAL LANGUAGE SYSTEM
 * Motion Token System - Organic Sinai Physics
 */

export const DAHAB_MOTION = {
  easings: {
    water: 'cubic-bezier(0.25, 1, 0.5, 1)',      // Viscous, fluid deceleration
    desert: 'cubic-bezier(0.16, 1, 0.3, 1)',     // Grounded, instant authority
    wind: 'cubic-bezier(0.45, 0, 0.55, 1)',      // Sinusoidal directional sway
    sunset: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Gradual color crossfade
    journey: 'cubic-bezier(0.22, 1, 0.36, 1)',   // Linear momentum with milestone snapping
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.15)', // Organic slight bounce
  },

  durations: {
    instant: '100ms',
    fast: '200ms',
    base: '320ms',
    deliberate: '480ms',
    cinematic: '800ms',
    ambient: '3200ms',
  },

  transitions: {
    waterSlide: 'all 320ms cubic-bezier(0.25, 1, 0.5, 1)',
    desertPress: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
    sunsetFade: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), background-color 800ms cubic-bezier(0.4, 0, 0.2, 1)',
    windHover: 'transform 240ms cubic-bezier(0.45, 0, 0.55, 1)',
    journeySlide: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
} as const;
