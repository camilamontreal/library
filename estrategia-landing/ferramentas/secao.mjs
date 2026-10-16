// Uso: node secao.mjs file:///index.html saida.png 1440 900 "#seletor" [pt-BR|en-US]
// Rola até o seletor, espera as animações e tira uma captura da tela.
import { chromium } from 'playwright';
const [,, url, out, w, h, sel, lang] = process.argv;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const p = await b.newPage({ viewport:{width:+w,height:+h}, locale: lang||'pt-BR' });
await p.goto(url); await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelectorAll('img').forEach(i=>{i.loading='eager'}));
await p.evaluate(s=>{const e=document.querySelector(s);window.scrollTo(0,e.getBoundingClientRect().top+scrollY-70)}, sel);
await p.waitForTimeout(3500);
await p.screenshot({ path: out });
await b.close();
