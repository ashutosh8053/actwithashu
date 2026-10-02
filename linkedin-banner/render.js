const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cfg = require('./' + (process.argv[2]||'final.json'));
(async()=>{
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:1584,height:396},deviceScaleFactor:2});
  await p.addInitScript(c=>{window.BANNER=c}, cfg);
  await p.goto('file://'+__dirname+'/banner.html'); await p.waitForTimeout(1500);
  await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path: process.argv[3]||'banner@2x.png'});
  await b.close();
})();
