import { content } from '../content'

/** Número de 0 a 2^32 estável para o mesmo nome (assim o assento do visitante nunca muda). */
export function hash(s: string): number {
  let h = 2166136261
  for (const c of s.toLowerCase().trim()) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export type PassData = { name: string; seat: string; gate: string; flight: string; date: string; bars: number[] }

export function passData(name: string, now = new Date()): PassData {
  const h = hash(name)
  const seat = `${1 + (h % 32)}${'ABCDEF'[(h >>> 5) % 6]}`
  const gate = `${'ABCD'[(h >>> 8) % 4]}${1 + ((h >>> 11) % 24)}`
  const flight = `CM ${100 + ((h >>> 3) % 900)}`
  const bars = Array.from({ length: 46 }, (_, i) => 1 + ((h >>> (i % 24)) + i * 7) % 4)
  const date = now.toLocaleDateString('en-CA', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  return { name: name.trim().toUpperCase().slice(0, 28), seat, gate, flight, date, bars }
}

/** Desenha o cartão de embarque do visitante (PNG 1200×500) com o mesmo visual do site. */
export async function drawPass(canvas: HTMLCanvasElement, d: PassData, strings: { passenger: string; from: string; to: string; seat: string; gate: string; flight: string; date: string; title: string }) {
  const W = 1200, H = 500, STUB = 330
  canvas.width = W; canvas.height = H
  const g = canvas.getContext('2d')!
  try { await document.fonts.load('800 40px "Inter Variable"'); await document.fonts.load('600 20px "Inter Variable"') } catch { /* usa a fonte do sistema */ }
  const font = (w: number, px: number) => `${w} ${px}px "Inter Variable", Inter, -apple-system, system-ui, sans-serif`
  const rr = (x: number, y: number, w: number, h: number, r: number) => { g.beginPath(); g.roundRect(x, y, w, h, r) }

  g.clearRect(0, 0, W, H)
  // corpo
  rr(0, 0, W, H, 36); g.fillStyle = '#FFFFFF'; g.fill()
  g.save(); rr(0, 0, W, H, 36); g.clip()
  const grad = g.createLinearGradient(0, 0, W - STUB, 150); grad.addColorStop(0, '#0F1629'); grad.addColorStop(1, '#2A3170')
  g.fillStyle = grad; g.fillRect(0, 0, W - STUB, 128)
  // canhoto azul
  g.fillStyle = '#5B6BD5'; g.fillRect(W - STUB, 0, STUB, H)
  g.restore()
  // picote
  g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.moveTo(W - STUB, 28); g.lineTo(W - STUB, H - 28); g.stroke(); g.setLineDash([])

  const ink = '#0F1629', soft = '#5B6480'
  g.textBaseline = 'alphabetic'
  g.fillStyle = '#fff'; g.font = font(800, 34); g.fillText(content.profile.brandName, 48, 62)
  g.font = font(600, 20); g.globalAlpha = 0.8; g.fillText(strings.title.toUpperCase(), 48, 98); g.globalAlpha = 1
  g.font = font(800, 30); g.textAlign = 'right'; g.fillText(d.flight, W - STUB - 48, 74); g.textAlign = 'left'

  const label = (s: string, x: number, y: number) => { g.fillStyle = soft; g.font = font(700, 16); g.fillText(s.toUpperCase(), x, y) }
  const val = (s: string, x: number, y: number, px = 38) => { g.fillStyle = ink; g.font = font(800, px); g.fillText(s, x, y) }
  label(strings.passenger, 48, 182); val(d.name, 48, 228, d.name.length > 18 ? 34 : 44)
  label(strings.from, 48, 292); val('ANYWHERE', 48, 340)
  g.fillStyle = '#5B6BD5'; g.font = font(800, 44); g.fillText('✈', 330, 338)
  label(strings.to, 420, 292); val('MONTRÉAL · YUL', 420, 340)
  label(strings.seat, 48, 412); val(d.seat, 48, 456)
  label(strings.gate, 240, 412); val(d.gate, 240, 456)
  label(strings.date, 420, 412); val(d.date, 420, 456, 30)

  // canhoto
  const sx = W - STUB + 40
  g.fillStyle = '#fff'; g.font = font(700, 16); g.globalAlpha = 0.85; g.fillText(strings.passenger.toUpperCase(), sx, 70); g.globalAlpha = 1
  g.font = font(800, 28); g.fillText(d.name.slice(0, 16), sx, 108)
  g.font = font(800, 78); g.fillText('YUL', sx, 218)
  g.font = font(600, 20); g.globalAlpha = 0.9; g.fillText(`${strings.seat} ${d.seat}  ·  ${strings.gate} ${d.gate}`, sx, 258); g.globalAlpha = 1
  // código de barras decorativo
  g.fillStyle = '#fff'; let x = sx
  for (const b of d.bars) { g.fillRect(x, 300, b * 2, 96); x += b * 2 + 3; if (x > W - 40) break }
  g.font = font(700, 20); g.fillText(content.profile.handle, sx, 444)
}
