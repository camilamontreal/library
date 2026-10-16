// Uso: node checar.mjs file:///caminho/index.html [prefixo-das-capturas]
// Verifica erros de JavaScript, rolagem lateral e carregamento em PT/EN, celular e desktop.
// Requer playwright (já instalado em /opt/node22/lib) e o Chromium em /opt/pw-browsers.
import { chromium } from 'playwright';
const [,, url, prefix] = process.argv;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
for (const loc of ['pt-BR','en-US']) for (const [w,h] of [[390,844],[1440,900]]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, locale:loc });
  const errs=[], bad=[];
  p.on('pageerror', e=>errs.push(e.message));
  p.on('response', r=>{ if (r.status()>=400) bad.push(r.url()); });
  await p.goto(url); await p.waitForTimeout(1500);
  const H = await p.evaluate(()=>document.documentElement.scrollHeight);
  for (const y of [0, H*0.3, H*0.6, H-h]) { await p.evaluate(y=>window.scrollTo(0,y), y); await p.waitForTimeout(400); }
  const r = await p.evaluate(()=>({sw:document.documentElement.scrollWidth, imgs:[...document.images].filter(i=>!(i.complete&&i.naturalWidth)).length}));
  console.log(loc, w, 'overflow-x:', r.sw>w?'SIM ('+r.sw+')':'não', '| imagens quebradas:', r.imgs, '| erros JS:', errs.length?errs:'nenhum', '| 404:', bad.length?bad:'nenhum');
  if (prefix) await p.screenshot({ path:`${prefix}-${loc}-${w}.png`, fullPage:false });
  await p.close();
}
await b.close();
