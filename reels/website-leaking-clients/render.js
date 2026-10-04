const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+__dirname+'/thumbnail.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
await p.screenshot({path:__dirname+'/website-leaking-clients-thumbnail.png'});await b.close();})();
