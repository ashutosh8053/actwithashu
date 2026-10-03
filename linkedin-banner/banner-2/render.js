const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1584,height:396},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/banner-2.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
await p.screenshot({path:__dirname+'/linkedin-banner-2@2x.png'});await b.close();})();
