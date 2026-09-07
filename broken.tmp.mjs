import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const url of ['http://127.0.0.1:3000/trip-builder','http://127.0.0.1:3000/my-trip','http://127.0.0.1:3000/food']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll('#root > *').length > 0, { timeout: 45000 });
  await page.waitForTimeout(5000);
  const bad = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && (i.src || '').startsWith('http')).map((i) => i.src.slice(0, 110) + ' ::alt=' + (i.alt || '').slice(0, 60)));
  console.log(url); bad.forEach((b) => console.log('  BROKEN:', b));
  await page.close();
}
await browser.close();
