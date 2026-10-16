/**
 * Ícones de app em SVG vetorial (viewBox 120×120), desenhados do zero para este projeto.
 * Seguem a linguagem visual atual do macOS/iOS: forma "squircle" (curvatura contínua), luz vinda de cima,
 * gradientes suaves, brilho sutil no topo, contorno fino e detalhes próprios de cada app.
 * Nenhum arquivo, glifo ou ilustração da Apple é usado ou copiado; são desenhos originais.
 * Escalam para qualquer tamanho (de 16 px a 1024 px) porque são vetores.
 */
import { useId, type ReactNode } from 'react'
import type { AppId } from '../store/os'
import { useLang } from '../lib/i18n'

export type AppIconId = AppId | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'site' | 'files' | 'trashTile'

/** Superelipse (n = 5) que aproxima a "continuous corner" dos ícones da Apple. */
function squircle(cx: number, cy: number, r: number, n = 5): string {
  const pts: string[] = []
  const steps = 128
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const c = Math.cos(t), s = Math.sin(t)
    const x = cx + r * Math.sign(c) * Math.abs(c) ** (2 / n)
    const y = cy + r * Math.sign(s) * Math.abs(s) ** (2 / n)
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return pts.join('') + 'Z'
}
const SQ = squircle(60, 60, 59.4)

/** Avião (aponta para cima), usado em Partidas, Milhas e Cartão de embarque. */
const PLANE = 'M60 12 C64 12 66.5 20 66.5 30 L66.5 51 L102 74 L102 85 L66.5 74 L66.5 92 L77 100 L77 107 L60 102 L43 107 L43 100 L53.5 92 L53.5 74 L18 85 L18 74 L53.5 51 L53.5 30 C53.5 20 56 12 60 12 Z'

type Ctx = { u: string; lang: string }
type Spec = { from: string; to: string; art: (c: Ctx) => ReactNode }

const Stops = ({ a, b }: { a: string; b: string }) => (<><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></>)
const Soft = ({ id, d = 1.6 }: { id: string; d?: number }) => (<filter id={id} x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation={d} /></filter>)

const rad = (a: number) => (a * Math.PI) / 180
function pie(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => `${(cx + r * Math.cos(rad(a))).toFixed(2)} ${(cy + r * Math.sin(rad(a))).toFixed(2)}`
  return `M${cx} ${cy} L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z`
}

/* ---------- Apps com equivalente na Apple (desenho original, mesma linguagem) ---------- */
const NOTES: Spec = {
  from: '#FFFFFF', to: '#F1EFE7',
  art: ({ u }) => (<>
    <defs><linearGradient id={`${u}h`} x1="0" y1="0" x2="0" y2="1"><Stops a="#FFE75E" b="#FFC21A" /></linearGradient></defs>
    <rect width="120" height="38" fill={`url(#${u}h)`} />
    <rect y="37" width="120" height="1.6" fill="#C98F00" opacity=".28" />
    <rect y="38.6" width="120" height="8" fill="#000" opacity=".04" />
    {[58, 74, 90, 106].map((y) => <rect key={y} x="16" y={y} width="88" height="1.8" rx=".9" fill="#CFCCBF" />)}
    <path d="M18 22 H62" stroke="#B87F00" strokeWidth="5" strokeLinecap="round" opacity=".55" />
    <path d="M18 50 H70" stroke="#3A3A3C" strokeWidth="3.2" strokeLinecap="round" opacity=".78" />
  </>),
}

const MESSAGES: Spec = {
  from: '#70F087', to: '#12AF35',
  art: ({ u }) => (<>
    <defs><Soft id={`${u}s`} d={2.4} /><linearGradient id={`${u}b`} x1="0" y1="0" x2="0" y2="1"><Stops a="#FFFFFF" b="#E4F7E8" /></linearGradient></defs>
    <path transform="translate(0 3.5)" filter={`url(#${u}s)`} fill="#05601B" opacity=".42" d="M60 26 C36 26 20 40 20 56 C20 66 26 74 35 80 C34 86 31 92 25 97 C35 97 43 93 49 88 C52 88.5 56 89 60 89 C84 89 100 74 100 57 C100 40 84 26 60 26Z" />
    <path fill={`url(#${u}b)`} d="M60 26 C36 26 20 40 20 56 C20 66 26 74 35 80 C34 86 31 92 25 97 C35 97 43 93 49 88 C52 88.5 56 89 60 89 C84 89 100 74 100 57 C100 40 84 26 60 26Z" />
  </>),
}

const PETALS = ['#FF5F57', '#FF9F0A', '#FFD60A', '#7ED957', '#2EC9B8', '#3FA9F5', '#7D6BF2', '#E85BB0']
const PHOTOS: Spec = {
  from: '#FFFFFF', to: '#EEEEF3',
  art: () => (
    <g style={{ isolation: 'isolate' }}>
      {PETALS.map((c, i) => (
        <ellipse key={c} cx="60" cy="38" rx="15" ry="22" fill={c} opacity=".9" transform={`rotate(${i * 45} 60 60)`} style={{ mixBlendMode: 'multiply' }} />
      ))}
    </g>
  ),
}

const MUSIC: Spec = {
  from: '#FF6E8A', to: '#E1143C',
  art: () => {
    const note = (
      <>
        <path d="M46 36 L88 26 L88 42 L46 52 Z" />
        <rect x="46" y="36" width="7.5" height="48" /><rect x="80.5" y="26" width="7.5" height="48" />
        <ellipse cx="40" cy="84" rx="12.5" ry="9.5" transform="rotate(-20 40 84)" /><ellipse cx="74.5" cy="74" rx="12.5" ry="9.5" transform="rotate(-20 74.5 74)" />
      </>
    )
    return (<><g fill="#7A0020" opacity=".35" transform="translate(0 3)">{note}</g><g fill="#fff">{note}</g></>)
  },
}

const CALENDAR: Spec = {
  from: '#FFFFFF', to: '#F0F0F4',
  art: ({ lang }) => {
    const d = new Date()
    const loc = lang === 'en' ? 'en-CA' : lang === 'fr' ? 'fr-CA' : 'pt-BR'
    const wd = d.toLocaleDateString(loc, { weekday: 'short' }).replace('.', '').toUpperCase()
    return (<>
      <text x="60" y="35" textAnchor="middle" fontSize="17" fontWeight="700" letterSpacing="2" fill="#FF3B30" fontFamily="inherit">{wd}</text>
      <text x="60" y="97" textAnchor="middle" fontSize="68" fontWeight="300" fill="#1C1C1E" fontFamily="inherit" letterSpacing="-2">{d.getDate()}</text>
    </>)
  },
}

const MAPS: Spec = {
  from: '#F1EEE3', to: '#E6E1D1',
  art: ({ u }) => (<>
    <defs><Soft id={`${u}s`} d={2} /></defs>
    <path d="M58 0 H120 V54 C98 48 80 30 58 0Z" fill="#B5DB97" />
    <path d="M0 68 C30 62 54 84 72 120 H0Z" fill="#A3D2F1" />
    <path d="M-4 42 C30 54 62 50 124 80" stroke="#fff" strokeWidth="9" fill="none" />
    <path d="M0 92 L74 100" stroke="#fff" strokeWidth="4" fill="none" /><path d="M86 0 L92 120" stroke="#fff" strokeWidth="3" fill="none" opacity=".9" />
    <path d="M30 126 C42 92 62 60 106 -6" stroke="#fff" strokeWidth="13" fill="none" /><path d="M30 126 C42 92 62 60 106 -6" stroke="#F6B04A" strokeWidth="8" fill="none" />
    <path transform="translate(0 3)" filter={`url(#${u}s)`} d="M60 38 L80 86 L60 75 L40 86 Z" fill="#0B2A66" opacity=".45" />
    <path d="M60 38 L80 86 L60 75 L40 86 Z" fill="#2F7BFF" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
  </>),
}

const FINDER: Spec = {
  from: '#8ED3FF', to: '#3BA7F5',
  art: ({ u }) => (<>
    <defs><linearGradient id={`${u}r`} x1="0" y1="0" x2="0" y2="1"><Stops a="#3A93F0" b="#1257C9" /></linearGradient></defs>
    <path d="M64 0 H120 V120 H62 C68 92 60 64 64 0 Z" fill={`url(#${u}r)`} />
    <g stroke="#0B2A5B" strokeLinecap="round" fill="none" opacity=".88">
      <path d="M38 34 V56" strokeWidth="6.5" /><path d="M84 34 V56" strokeWidth="6.5" />
      <path d="M66 36 C64 52 62 62 60 70 C62 72 66 72 70 70" strokeWidth="4" />
      <path d="M28 82 Q60 108 94 82" strokeWidth="5.5" />
    </g>
  </>),
}

const CHROME: Spec = {
  from: '#FFFFFF', to: '#E9ECF1',
  art: ({ u }) => (<>
    <defs>
      <linearGradient id={`${u}r`} x1="0" y1="0" x2="0" y2="1"><Stops a="#F0554A" b="#D93025" /></linearGradient>
      <linearGradient id={`${u}g`} x1="0" y1="0" x2="1" y2="1"><Stops a="#3FB75F" b="#168A3A" /></linearGradient>
      <linearGradient id={`${u}y`} x1="1" y1="0" x2="0" y2="1"><Stops a="#FDC62B" b="#F9A800" /></linearGradient>
      <linearGradient id={`${u}b`} x1="0" y1="0" x2="0" y2="1"><Stops a="#5A9BF8" b="#1768DF" /></linearGradient>
      <Soft id={`${u}s`} d={2} />
    </defs>
    <circle cx="60" cy="63" r="40" fill="#000" opacity=".22" filter={`url(#${u}s)`} />
    <path d={pie(60, 60, 40, 210, 330)} fill={`url(#${u}r)`} />
    <path d={pie(60, 60, 40, 90, 210)} fill={`url(#${u}g)`} />
    <path d={pie(60, 60, 40, 330, 450)} fill={`url(#${u}y)`} />
    <circle cx="60" cy="60" r="21.5" fill="#fff" />
    <circle cx="60" cy="60" r="17" fill={`url(#${u}b)`} />
    <circle cx="60" cy="60" r="40" fill="none" stroke="#000" strokeOpacity=".1" />
  </>),
}

const MAIL: Spec = {
  from: '#63C4FF', to: '#1670F0',
  art: ({ u }) => (<>
    <defs><Soft id={`${u}s`} d={2.2} /><linearGradient id={`${u}e`} x1="0" y1="0" x2="0" y2="1"><Stops a="#FFFFFF" b="#E5EEFB" /></linearGradient></defs>
    <rect x="20" y="40" width="80" height="56" rx="9" fill="#06307E" opacity=".4" filter={`url(#${u}s)`} />
    <rect x="20" y="36" width="80" height="56" rx="9" fill={`url(#${u}e)`} />
    <path d="M23 43 L60 71 L97 43" fill="none" stroke="#86B1F3" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
  </>),
}

const CONTACTS: Spec = {
  from: '#F6F3EA', to: '#DAD6CA',
  art: ({ u }) => (<>
    <defs><linearGradient id={`${u}h`} x1="0" y1="0" x2="0" y2="1"><Stops a="#9A9AA1" b="#6C6C73" /></linearGradient></defs>
    <rect width="9" height="120" fill="#000" opacity=".07" />
    {['#FF9F0A', '#FFD60A', '#32D74B', '#5AC8FA', '#0A84FF', '#BF5AF2', '#FF375F', '#98989D'].map((c, i) => <rect key={c} x="104" y={10 + i * 12.5} width="16" height="9" rx="2" fill={c} opacity=".92" />)}
    <circle cx="54" cy="46" r="16" fill={`url(#${u}h)`} />
    <path d="M24 106 C24 82 38 70 54 70 C70 70 84 82 84 106 Z" fill={`url(#${u}h)`} />
  </>),
}

const TRASH_BIN = (u: string) => {
  const lines = [-3, -2, -1, 0, 1, 2, 3].map((k) => `M${60 + k * 11} 38 L${60 + k * 7.6} 106`)
  return (<>
    <defs>
      <linearGradient id={`${u}t`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#C2C9D4" /><stop offset=".35" stopColor="#F5F7FA" /><stop offset=".7" stopColor="#D5DAE2" /><stop offset="1" stopColor="#A9B1BE" /></linearGradient>
      <linearGradient id={`${u}o`} x1="0" y1="0" x2="0" y2="1"><Stops a="#6F7888" b="#B7BEC9" /></linearGradient>
      <Soft id={`${u}s`} d={2.4} />
    </defs>
    <ellipse cx="60" cy="110" rx="38" ry="5" fill="#000" opacity=".28" filter={`url(#${u}s)`} />
    <path d="M23 38 L31 103 Q32 110 40 110 H80 Q88 110 89 103 L97 38 Z" fill={`url(#${u}t)`} opacity=".92" stroke="#8D96A5" strokeWidth="1.2" />
    <path d={lines.join(' ')} stroke="#6E7788" strokeWidth="1.3" fill="none" opacity=".5" />
    {[56, 74, 92].map((y, i) => <path key={y} d={`M${27 + i * 1.4} ${y} Q60 ${y + 8} ${93 - i * 1.4} ${y}`} stroke="#fff" strokeWidth="1.6" fill="none" opacity=".65" />)}
    <ellipse cx="60" cy="38" rx="38" ry="9.5" fill="#F7F9FC" stroke="#B5BDC9" strokeWidth="1.4" />
    <ellipse cx="60" cy="39" rx="33" ry="6.5" fill={`url(#${u}o)`} />
  </>)
}

/* ---------- Apps exclusivos do portfólio (mesma linguagem, identidade própria) ---------- */
const MEDIAKIT: Spec = {
  from: '#FFB84F', to: '#F2740A',
  art: ({ u }) => (<>
    <defs><Soft id={`${u}s`} d={2.4} /></defs>
    <rect x="31" y="26" width="52" height="72" rx="7" fill="#7A2E00" opacity=".4" filter={`url(#${u}s)`} />
    <rect x="30" y="22" width="52" height="72" rx="7" fill="#fff" />
    <rect x="38" y="31" width="26" height="6" rx="3" fill="#F2740A" />
    {[46, 55, 64, 73].map((y, i) => <rect key={y} x="38" y={y} width={i === 3 ? 24 : 36} height="3" rx="1.5" fill="#D8D8DE" />)}
    <g transform="rotate(38 86 82)"><rect x="80" y="52" width="12" height="40" rx="3.5" fill="#FFE2B8" stroke="#C45C00" strokeWidth="1.6" /><path d="M80 92 L86 106 L92 92 Z" fill="#fff" stroke="#C45C00" strokeWidth="1.6" strokeLinejoin="round" /><path d="M84.2 100.4 L86 105 L87.8 100.4Z" fill="#3A3A3C" /></g>
  </>),
}

const DEPARTURES: Spec = {
  from: '#FFD83D', to: '#FF8A00',
  art: ({ u }) => (<>
    <defs><Soft id={`${u}s`} d={2.2} /></defs>
    <g transform="translate(3 6) rotate(45 60 56) scale(.62) translate(36.6 22)" fill="#8A3A00" opacity=".4" filter={`url(#${u}s)`}><path d={PLANE} /></g>
    <g transform="rotate(45 60 56) scale(.62) translate(36.6 22)" fill="#fff"><path d={PLANE} /></g>
    {[18, 52, 86].map((x) => <rect key={x} x={x} y="102" width="16" height="3.6" rx="1.8" fill="#fff" opacity=".75" />)}
  </>),
}

const MILES: Spec = {
  from: '#8A98F4', to: '#3B46B6',
  art: ({ u }) => (<>
    <defs><Soft id={`${u}s`} d={2.2} /></defs>
    <path d="M20 96 Q34 40 90 26" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 8" fill="none" opacity=".6" />
    <circle cx="20" cy="96" r="5" fill="#fff" opacity=".85" />
    <g transform="translate(3 6) rotate(45 60 58) scale(.62) translate(36.6 22)" fill="#10145E" opacity=".4" filter={`url(#${u}s)`}><path d={PLANE} /></g>
    <g transform="rotate(45 60 58) scale(.62) translate(36.6 22)" fill="#fff"><path d={PLANE} /></g>
  </>),
}

const PASSPORT: Spec = {
  from: '#38456F', to: '#0C1226',
  art: ({ u }) => (<>
    <defs><linearGradient id={`${u}g`} x1="0" y1="0" x2="1" y2="1"><Stops a="#FBE9AE" b="#B98A2E" /></linearGradient></defs>
    <rect width="11" height="120" fill="#000" opacity=".28" /><rect x="11" width="1.4" height="120" fill="#fff" opacity=".08" />
    <rect x="20" y="10" width="90" height="100" rx="8" fill="none" stroke={`url(#${u}g)`} strokeWidth="1.2" strokeDasharray="3 3" opacity=".55" />
    <g stroke={`url(#${u}g)`} strokeWidth="2.6" fill="none"><circle cx="66" cy="52" r="21" /><ellipse cx="66" cy="52" rx="9" ry="21" /><path d="M45 52 H87 M49 40 Q66 46 83 40 M49 64 Q66 58 83 64" strokeWidth="1.8" /></g>
    <text x="66" y="93" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="3" fill={`url(#${u}g)`} fontFamily="inherit">PASSPORT</text>
  </>),
}

const TICKET: Spec = {
  from: '#94A2F7', to: '#3F4BC0',
  art: ({ u }) => (<>
    <defs><Soft id={`${u}s`} d={2.4} /></defs>
    <g transform="rotate(-12 60 60)">
      <path transform="translate(0 4)" filter={`url(#${u}s)`} fill="#10145E" opacity=".4" d="M24 36 h72 a6 6 0 0 1 6 6 v9 a9 9 0 0 0 0 18 v9 a6 6 0 0 1 -6 6 H24 a6 6 0 0 1 -6 -6 v-9 a9 9 0 0 0 0 -18 v-9 a6 6 0 0 1 6 -6Z" />
      <path fill="#fff" d="M24 36 h72 a6 6 0 0 1 6 6 v9 a9 9 0 0 0 0 18 v9 a6 6 0 0 1 -6 6 H24 a6 6 0 0 1 -6 -6 v-9 a9 9 0 0 0 0 -18 v-9 a6 6 0 0 1 6 -6Z" />
      <path d="M80 40 V80" stroke="#B9C0E8" strokeWidth="2" strokeDasharray="3 3" />
      <g transform="translate(34 59) rotate(60) scale(.34) translate(-60 -60)" fill="#4350C8"><path d={PLANE} /></g>
      {[85, 88.5, 92, 96].map((x, i) => <rect key={x} x={x} y="46" width={i % 2 ? 1.6 : 2.6} height="28" fill="#2A3590" />)}
    </g>
  </>),
}

const FILES: Spec = {
  from: '#FFFFFF', to: '#EDEFF4',
  art: ({ u }) => (<>
    <defs>
      <linearGradient id={`${u}b`} x1="0" y1="0" x2="0" y2="1"><Stops a="#4AB1FF" b="#1B86F2" /></linearGradient>
      <linearGradient id={`${u}f`} x1="0" y1="0" x2="0" y2="1"><Stops a="#72C8FF" b="#2D9BFA" /></linearGradient>
      <Soft id={`${u}s`} d={2} />
    </defs>
    <path transform="translate(0 3)" filter={`url(#${u}s)`} fill="#0A3E88" opacity=".35" d="M26 36 h22 l8 9 h38 a6 6 0 0 1 6 6 v38 a6 6 0 0 1 -6 6 H26 a6 6 0 0 1 -6 -6 V42 a6 6 0 0 1 6 -6Z" />
    <path fill={`url(#${u}b)`} d="M26 34 h22 l8 9 h38 a6 6 0 0 1 6 6 v38 a6 6 0 0 1 -6 6 H26 a6 6 0 0 1 -6 -6 V40 a6 6 0 0 1 6 -6Z" />
    <path fill={`url(#${u}f)`} d="M20 54 h80 v32 a6 6 0 0 1 -6 6 H26 a6 6 0 0 1 -6 -6Z" />
  </>),
}

/* ---------- Redes sociais (reconhecíveis, no mesmo acabamento) ---------- */
const INSTAGRAM: Spec = {
  from: '#F58529', to: '#8134AF',
  art: ({ u }) => (<>
    <defs><linearGradient id={`${u}i`} x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75" /><stop offset=".28" stopColor="#FA7E1E" /><stop offset=".55" stopColor="#D62976" /><stop offset=".8" stopColor="#962FBF" /><stop offset="1" stopColor="#4F5BD5" /></linearGradient></defs>
    <rect width="120" height="120" fill={`url(#${u}i)`} />
    <g fill="none" stroke="#fff" strokeWidth="7"><rect x="30" y="30" width="60" height="60" rx="17" /><circle cx="60" cy="60" r="14.5" /></g>
    <circle cx="79.5" cy="40.5" r="4.6" fill="#fff" />
  </>),
}
const TIKTOK: Spec = {
  from: '#232328', to: '#000000',
  art: () => {
    const d = 'M63 27 h13.5 c1 9 7.5 15 17.5 16 v13 c-6.5 0-12.5-2-17.5-5.6 v25 a19.5 19.5 0 1 1-19.5-19.5 c1.4 0 2.7.15 4 .45 v13.4 a6.6 6.6 0 1 0 2.4 5.1 Z'
    return (<><path d={d} fill="#25F4EE" transform="translate(-2.6 -2.2)" /><path d={d} fill="#FE2C55" transform="translate(2.6 2.2)" /><path d={d} fill="#fff" /></>)
  },
}
const YOUTUBE: Spec = {
  from: '#FFFFFF', to: '#F1F1F3',
  art: ({ u }) => (<>
    <defs><linearGradient id={`${u}y`} x1="0" y1="0" x2="0" y2="1"><Stops a="#FF4B3E" b="#E00D0D" /></linearGradient><Soft id={`${u}s`} d={2} /></defs>
    <rect x="16" y="38" width="88" height="52" rx="15" fill="#600" opacity=".3" filter={`url(#${u}s)`} />
    <rect x="16" y="34" width="88" height="52" rx="15" fill={`url(#${u}y)`} />
    <path d="M52 47 L52 73 L75 60 Z" fill="#fff" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
  </>),
}
const LINKEDIN: Spec = {
  from: '#2F8FE9', to: '#0A5CB3',
  art: () => <text x="60" y="87" textAnchor="middle" fontSize="68" fontWeight="800" fill="#fff" fontFamily="inherit" letterSpacing="-3">in</text>,
}
const SAFARI: Spec = {
  from: '#6FD2FF', to: '#0A7BF5',
  art: ({ u }) => (<>
    <defs><linearGradient id={`${u}f`} x1="0" y1="0" x2="0" y2="1"><Stops a="#FFFFFF" b="#DDE8F6" /></linearGradient><Soft id={`${u}s`} d={2.2} /></defs>
    <circle cx="60" cy="64" r="42" fill="#05367E" opacity=".4" filter={`url(#${u}s)`} />
    <circle cx="60" cy="60" r="42" fill={`url(#${u}f)`} stroke="#000" strokeOpacity=".12" />
    {Array.from({ length: 36 }).map((_, i) => { const a = rad(i * 10), r1 = i % 3 === 0 ? 34 : 37.5; return <line key={i} x1={60 + 40 * Math.cos(a)} y1={60 + 40 * Math.sin(a)} x2={60 + r1 * Math.cos(a)} y2={60 + r1 * Math.sin(a)} stroke="#7C8BA3" strokeWidth={i % 3 === 0 ? 1.8 : 1} /> })}
    <g transform="rotate(45 60 60)"><path d="M60 24 L68 60 L52 60Z" fill="#FF3B30" /><path d="M60 96 L68 60 L52 60Z" fill="#fff" stroke="#C5CEDB" strokeWidth="1" /></g>
    <circle cx="60" cy="60" r="3.2" fill="#fff" stroke="#8A94A6" strokeWidth="1" />
  </>),
}

const SPECS: Record<Exclude<AppIconId, 'trash'>, Spec> = {
  notes: NOTES, messages: MESSAGES, photos: PHOTOS, music: MUSIC, calendar: CALENDAR, maps: MAPS, finder: FINDER, browser: CHROME,
  contact: MAIL, about: CONTACTS, mediakit: MEDIAKIT, departures: DEPARTURES, miles: MILES, passport: PASSPORT, ticket: TICKET,
  files: FILES, case: FILES, instagram: INSTAGRAM, tiktok: TIKTOK, youtube: YOUTUBE, linkedin: LINKEDIN, site: SAFARI,
  trashTile: { from: '#F6F6F8', to: '#D2D3DA', art: ({ u }) => <g transform="translate(60 62) scale(.66) translate(-60 -62)">{TRASH_BIN(u)}</g> },
}

/**
 * Ícone de app. `size` em px (ou "100%" para preencher o contêiner, usado no Dock com ampliação).
 * A Lixeira do macOS não tem "ladrilho": é só o cesto de metal (`trash`); no iOS usa `trashTile`.
 */
export function AppIcon({ id, size = 52 }: { id: AppIconId; size?: number | string }) {
  const u = 'i' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const lang = useLang((s) => s.lang)
  const common = { viewBox: '0 0 120 120', width: size, height: size, className: `appicon appicon--${id}`, 'aria-hidden': true as const, focusable: false as const }
  if (id === 'trash') return <svg {...common}>{TRASH_BIN(u)}</svg>
  const s = SPECS[id]
  return (
    <svg {...common}>
      <defs>
        <clipPath id={`${u}cp`}><path d={SQ} /></clipPath>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="0" y2="1"><Stops a={s.from} b={s.to} /></linearGradient>
        <linearGradient id={`${u}gl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".34" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <linearGradient id={`${u}rm`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".26" /></linearGradient>
      </defs>
      <g clipPath={`url(#${u}cp)`}>
        <rect width="120" height="120" fill={`url(#${u}bg)`} />
        {s.art({ u, lang })}
        <rect width="120" height="60" fill={`url(#${u}gl)`} />
      </g>
      <path d={SQ} fill="none" stroke={`url(#${u}rm)`} strokeWidth="1.4" />
    </svg>
  )
}
