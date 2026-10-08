const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/thumbnail-3d.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
await p.screenshot({path:__dirname+'/shut-up-and-take-my-money-3d.png'});await b.close();})();
