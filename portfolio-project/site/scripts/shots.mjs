// Captura o site em 3 larguras (1440, 768, 390) a partir do build em dist/, servindo por um servidor local.
// Uso: node scripts/shots.mjs [pasta-de-saida]
import { chromium } from 'playwright'
import { createServer } from 'http'
import { readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const dist = path.resolve('dist')
const out = path.resolve(process.argv[2] ?? 'shots')
await mkdir(out, { recursive: true })
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json' }
const server = createServer(async (req, res) => {
  let p = path.join(dist, decodeURIComponent((req.url ?? '/').split('?')[0]))
  if (!existsSync(p) || p.endsWith('/')) p = path.join(dist, 'index.html')
  try { res.setHeader('Content-Type', types[path.extname(p)] ?? 'application/octet-stream'); res.end(await readFile(p)) } catch { res.statusCode = 404; res.end() }
})
await new Promise((r) => server.listen(0, r))
const port = server.address().port
// Em ambientes com Chromium já instalado, defina PW_CHROME=/caminho/do/chrome para não baixar nada.
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {})
const shots = [
  { name: 'desktop-1440', w: 1440, h: 900, steps: ['open-case', 'open-browser', 'open-finder'] },
  { name: 'tablet-768', w: 768, h: 1024, steps: ['open-case'] },
  { name: 'mobile-390', w: 390, h: 844, mobile: true, steps: ['unlock', 'open-case', 'open-browser'] },
  { name: 'desktop-dark', w: 1440, h: 900, dark: true, steps: ['open-case'] },
]
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, isMobile: !!s.mobile, hasTouch: !!s.mobile, colorScheme: s.dark ? 'dark' : 'light' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  if (!s.mobile) { await page.screenshot({ path: `${out}/${s.name}-boot.png` }); await page.locator('.boot').click().catch(() => {}) }
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${out}/${s.name}-home.png` })
  for (const step of s.steps) {
    if (step === 'unlock') { await page.locator('.lock').click(); await page.waitForTimeout(500); await page.screenshot({ path: `${out}/${s.name}-home-unlocked.png` }) }
    if (step === 'open-case') {
      if (s.mobile) { await page.locator('.happ').first().click(); await page.waitForTimeout(500); await page.locator('.fcard').first().click() }
      else await page.locator('.dicon').first().click()
      await page.waitForTimeout(600); await page.screenshot({ path: `${out}/${s.name}-case.png` })
      if (s.mobile) { await page.locator('.pscreen__body').evaluate((el) => el.scrollTo(0, 700)); await page.waitForTimeout(300); await page.screenshot({ path: `${out}/${s.name}-case-2.png` }); await page.locator('.pscreen__btn').last().click(); await page.waitForTimeout(400) }
    }
    if (step === 'open-browser') {
      if (s.mobile) await page.locator('.happ', { hasText: 'Instagram' }).click(); else await page.locator('.dock__app').first().click()
      await page.waitForTimeout(600); await page.screenshot({ path: `${out}/${s.name}-browser.png` })
      if (s.mobile) { await page.locator('.pscreen__btn').last().click(); await page.waitForTimeout(300) }
    }
    if (step === 'open-finder') { await page.locator('.dicon').last().click({ force: true }); await page.waitForTimeout(600); await page.screenshot({ path: `${out}/${s.name}-finder.png` }) }
  }
  console.log(s.name, errors.length ? 'ERRORS: ' + errors.join(' | ') : 'ok')
  await ctx.close()
}
await browser.close(); server.close()
