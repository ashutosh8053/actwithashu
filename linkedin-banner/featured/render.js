const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{const f=process.argv[2]||'landing-pages-for-coaches';
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:627},deviceScaleFactor:2});
  await p.goto('file://'+__dirname+'/'+f+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
  await p.screenshot({path:__dirname+'/'+f+'@2x.png'});await b.close();})();
