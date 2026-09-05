/**
 * Shared constants for the E2E suite. Must stay in sync with playwright.config.ts.
 */
export const BASE_URL = 'http://localhost:3100';
export const SEED_USER_PASSWORD = 'PlaywrightQA2026!Secure';
export const HOME_URL = BASE_URL;

export const SEED_EMAILS = {
  traveler: 'ahmed.traveler@example.com',
  supplier: 'captain.mahmoud@sinai-shuttle.com',
  ops: 'ops.director@dahab.travel',
  admin: 'admin@dahab.travel',
} as const;