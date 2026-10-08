// Renders cover.html to 1792x1024 and 3584x2048 PNGs.
// Usage: NODE_PATH=$(npm root -g) node render-cover.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  for (const [dpr, name] of [[1, 'cover-1792x1024.png'], [2, 'cover-3584x2048.png']]) {
    const page = await browser.newPage({ viewport: { width: 1792, height: 1024 }, deviceScaleFactor: dpr });
    await page.goto('file://' + path.join(__dirname, 'cover.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.locator('#cover').screenshot({ path: path.join(__dirname, name) });
    console.log('rendered', name);
  }
  await browser.close();
})();
