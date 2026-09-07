import { chromium } from 'playwright';
const jobs = [
  ['http://127.0.0.1:3000/trip-builder', 'tests/browser-qa/screenshots/wave4/planner-desktop.png', 1440, 900],
  ['http://127.0.0.1:3000/live', 'tests/browser-qa/screenshots/wave4/live-desktop.png', 1440, 900],
  ['http://127.0.0.1:3000/my-trip', 'tests/browser-qa/screenshots/wave4/mytrip-desktop.png', 1440, 900],
  ['http://127.0.0.1:3000/food', 'tests/browser-qa/screenshots/wave4/food-desktop.png', 1440, 900],
];
const browser = await chromium.launch();
for (const [url, out, w, h] of jobs) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  try {
    await page.waitForFunction(() => document.querySelectorAll('#root > *').length > 0, { timeout: 45000 });
    await page.waitForTimeout(5000);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && (i.src || '').startsWith('http')).length);
    await page.screenshot({ path: out });
    console.log('OK', out, 'brokenRemoteImgs=' + broken, errs.length ? 'PAGEERRORS: ' + errs.join(' | ') : '');
  } catch (e) {
    console.log('FAIL', out, e.message.slice(0, 120));
  }
  await page.close();
}
await browser.close();
