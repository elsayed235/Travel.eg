import { expect, test } from 'playwright/test';
import { registerBasicTraveler } from './helpers/auth';

const plusDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString().split('T')[0];

const VIEW_STAY = /View stay|عرض الفندق/;
const BOOK_STAY = /Book this stay|احجز الإقامة/;
const CHECK_AVAILABILITY = /Check availability|تحقق من التوفر/;

async function firstHotel(page: import('playwright/test').Page) {
  const res = await page.request.get('/api/hotels');
  expect(res.ok()).toBeTruthy();
  const cat = await res.json();
  expect(cat.hotels?.length).toBeGreaterThan(0);
  return cat.hotels[0];
}

test.describe('Hotels', () => {
  test('catalogue API contract + filters', async ({ request }) => {
    const r = await request.get('/api/hotels');
    expect(r.ok()).toBeTruthy();
    const cat = await r.json();
    const count = cat.hotels?.length ?? 0;
    expect(count).toBeGreaterThan(0);
    expect(cat.stats?.total).toBe(count);

    const filtered = await (await request.get('/api/hotels?category=resort')).json();
    expect(filtered.hotels?.length ?? 0).toBeGreaterThan(0);
    expect(filtered.hotels.length).toBeLessThan(count);

    const premium = await (await request.get('/api/hotels?priceBand=premium')).json();
    expect(premium.hotels?.length ?? 0).toBeGreaterThan(0);
  });

  test('list page renders cards, search and category chips', async ({ page }) => {
    await page.goto('/hotels');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('button', { hasText: VIEW_STAY }).first()).toBeVisible();
    await expect(page.locator('input[type="search"]')).toHaveCount(1);
    await page.screenshot({ path: 'test-results/hotels-list.png' });
  });

  test('card opens detail with price widget and a WhatsApp concierge link', async ({ page }) => {
    const first = await firstHotel(page);
    await page.goto(`/hotels/${encodeURIComponent(first.slug)}`);
    await expect(page.locator('button', { hasText: BOOK_STAY })).toBeVisible();
    // Digits render in the active locale (Western 12,500 vs Arabic-Indic), so
    // assert on the currency literal that both languages keep instead of a
    // specific digit string.
    const priceWidget = page.locator('main').getByText('EGP').first();
    await expect(priceWidget).toBeVisible();
    const wa = page.locator('a[href*="wa.me"]').first();
    await expect(wa).toHaveAttribute('href', /wa\.me\/\d+/);
  });

  test('availability check renders a status/alert response', async ({ page, context }) => {
    await registerBasicTraveler(context, 'Hotels QA');
    const first = await firstHotel(page);
    await page.goto(`/hotels/${encodeURIComponent(first.slug)}`);
    await page.locator('input[type="date"]').fill(plusDays(30));
    await page.locator('button', { hasText: CHECK_AVAILABILITY }).click();
    const response = page.locator('main [role="status"], main [role="alert"]').first();
    await expect(response).toBeVisible({ timeout: 15000 });
  });

  test('signed-in book hands off to /book-now with the SKU', async ({ page, context }) => {
    await registerBasicTraveler(context, 'Hotels QA');
    const first = await firstHotel(page);
    await page.goto(`/hotels/${encodeURIComponent(first.slug)}`);
    await page.locator('button', { hasText: BOOK_STAY }).click();
    await expect(page).toHaveURL(/\/book-now\?sku=SKU-HTL-/, { timeout: 15000 });
  });

  test('signed-out book redirects to sign-in', async ({ page }) => {
    const first = await firstHotel(page);
    await page.goto(`/hotels/${encodeURIComponent(first.slug)}`);
    await page.locator('button', { hasText: BOOK_STAY }).click();
    await expect(page).toHaveURL(/\/auth\/sign-in/, { timeout: 15000 });
  });

  test('mobile list page has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/hotels');
    const d = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      view: window.innerWidth,
    }));
    expect(d.doc, `overflow ${d.doc}px vs ${d.view}px`).toBeLessThanOrEqual(d.view + 2);
  });
});