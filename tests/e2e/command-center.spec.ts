import { expect, test } from 'playwright/test';
import { signInAsSeed } from './helpers/auth';
import { SEED_EMAILS } from './helpers/config';

/**
 * Operations console smoke. The seeded Ops account is required — self-service
 * registration always produces a Traveler, which the console denies.
 *
 * The console shell and its CommandPalette mount asynchronously (React.lazy +
 * Suspense), so keypress/CLI steps must first wait on chrome that only exists
 * once the shell has mounted and its effects attached.
 */
test.describe('Command Center', () => {
  // The console shell mounts inside the app-wide <main> (role name 'Dahab
  // Sinai Travel Platform'); a fixed-position journey widget also renders an
  // <aside> (complementary) on this route but it sits OUTSIDE that main. Scoping
  // everything to the app main keeps the console chrome unambiguous.
  const consoleShell = (page: import('playwright/test').Page) =>
    page.getByRole('main', { name: 'Dahab Sinai Travel Platform' });

  test('loads for an Operations user without an auth wall', async ({ page, context }) => {
    await signInAsSeed(context, SEED_EMAILS.ops);
    await page.goto('/ops-console');
    const body = page.locator('body');
    await expect(body).not.toContainText('Sign in required', { timeout: 20000 });
    await expect(body).not.toContainText('do not have access');
    const appMain = consoleShell(page);
    const sidebar = appMain.getByRole('complementary');
    await expect(sidebar).toBeVisible();
    await expect(appMain.getByRole('main')).toBeVisible();
    const navBtns = sidebar.locator('nav button');
    expect(await navBtns.count()).toBeGreaterThanOrEqual(6);
    await page.screenshot({ path: 'test-results/ops-console.png' });
  });

  test('no horizontal overflow and working layout at 1440px', async ({ page, context }) => {
    await signInAsSeed(context, SEED_EMAILS.ops);
    await page.goto('/ops-console');
    await expect(consoleShell(page).getByRole('complementary')).toBeVisible();
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBeFalsy();
  });

  test('command palette opens with Ctrl+K', async ({ page, context }) => {
    await signInAsSeed(context, SEED_EMAILS.ops);
    await page.goto('/ops-console');
    // Wait until the shell has mounted (its nav buttons exist only then) so the
    // window keydown listener that toggles the palette is attached.
    await expect(consoleShell(page).getByRole('complementary').locator('nav button').first()).toBeVisible();
    await page.keyboard.press('Control+k');
    const palette = page.locator('.fixed.inset-0.z-50');
    await expect(palette).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('Escape');
    await expect(palette).toHaveCount(0);
  });
});