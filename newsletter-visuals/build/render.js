// Renders each SVG to a 2x PNG with the real web fonts loaded.
// Usage: NODE_PATH=$(npm root -g) node render.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SVG = path.join(__dirname, '..', 'svg'), PNG = path.join(__dirname, '..', 'png');
fs.mkdirSync(PNG, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const file of fs.readdirSync(SVG).filter(f => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(SVG, file), 'utf8');
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('svg').first().screenshot({ path: path.join(PNG, file.replace('.svg', '.png')) });
    console.log('rendered', file);
  }
  await browser.close();
})();
