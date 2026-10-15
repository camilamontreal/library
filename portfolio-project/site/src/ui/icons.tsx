/** Ícones do sistema. Todos em SVG inline, cor por `currentColor`, para funcionar no claro e no escuro. */
import type { AppId } from '../store/os'

type P = React.SVGProps<SVGSVGElement>
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const Icon = {
  plane: (p: P = {}) => <svg {...base} {...p}><path d="M10.5 13.5 3 11l1.5-1.5 7 1.2 5.3-5.3a2 2 0 0 1 2.8 2.8L14.3 13.5l1.2 7L14 22l-2.5-7.5-3 3V21l-1.5 1-1-4-4-1 1-1.5h3.5l3-3Z"/></svg>,
  passport: (p: P = {}) => <svg {...base} {...p}><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><circle cx="12" cy="10" r="3.2"/><path d="M8.5 16.5h7"/></svg>,
  departures: (p: P = {}) => <svg {...base} {...p}><path d="M3 20h18"/><path d="m4 15 5.5-1.6 2.3 2.1 4.6-1.4 2.6-4.2-2.3-.3-2.5 2.4-4.3-3.3L7 9.7l2.5 3.1L4 14.2Z"/></svg>,
  compass: (p: P = {}) => <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></svg>,
  person: (p: P = {}) => <svg {...base} {...p}><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>,
  doc: (p: P = {}) => <svg {...base} {...p}><path d="M7 2.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10.5A1.5 1.5 0 0 1 5.5 20V4A1.5 1.5 0 0 1 7 2.5Z"/><path d="M14 2.5v5h5M8.5 13h7M8.5 17h5"/></svg>,
  mail: (p: P = {}) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>,
  trash: (p: P = {}) => <svg {...base} {...p}><path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>,
  folder: (p: P = {}) => <svg {...base} {...p}><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18Z"/></svg>,
  grid: (p: P = {}) => <svg {...base} {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>,
  close: (p: P = {}) => <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  back: (p: P = {}) => <svg {...base} {...p}><path d="m15 5-7 7 7 7"/></svg>,
  external: (p: P = {}) => <svg {...base} {...p}><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>,
  play: (p: P = {}) => <svg {...base} {...p}><path d="M8 5.5v13l10-6.5Z" fill="currentColor"/></svg>,
  instagram: (p: P = {}) => <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/></svg>,
  tiktok: (p: P = {}) => <svg {...base} {...p}><path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 3 2.5 4.5 5 4.8"/></svg>,
  youtube: (p: P = {}) => <svg {...base} {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9v6l5-3Z" fill="currentColor"/></svg>,
  linkedin: (p: P = {}) => <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.5M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>,
  globe: (p: P = {}) => <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>,
  home: (p: P = {}) => <svg {...base} {...p}><path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/></svg>,
  list: (p: P = {}) => <svg {...base} {...p}><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.5M3.5 12h.5M3.5 18h.5"/></svg>,
}

/** Ícone colorido estilo app (quadrado arredondado com gradiente), usado no dock e na tela inicial. */
export const APP_META: Record<AppId | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'site', { a: string; b: string; icon: keyof typeof Icon }> = {
  browser: { a: '#5AC8FA', b: '#007AFF', icon: 'compass' },
  miles: { a: '#8E9BF0', b: '#5B6BD5', icon: 'plane' },
  passport: { a: '#3A3F58', b: '#0F1629', icon: 'passport' },
  departures: { a: '#FFD60A', b: '#FF9F0A', icon: 'departures' },
  about: { a: '#FFB3C7', b: '#FF2D55', icon: 'person' },
  mediakit: { a: '#C7D2FE', b: '#8E9BF0', icon: 'doc' },
  contact: { a: '#5AC8FA', b: '#007AFF', icon: 'mail' },
  trash: { a: '#E5E5EA', b: '#AEAEB2', icon: 'trash' },
  finder: { a: '#8FC0F2', b: '#5E9BE0', icon: 'folder' },
  case: { a: '#8FC0F2', b: '#5E9BE0', icon: 'folder' },
  instagram: { a: '#F58529', b: '#DD2A7B', icon: 'instagram' },
  tiktok: { a: '#3A3F58', b: '#0F1629', icon: 'tiktok' },
  youtube: { a: '#FF4E45', b: '#E53935', icon: 'youtube' },
  linkedin: { a: '#2E8BE6', b: '#0A66C2', icon: 'linkedin' },
  site: { a: '#5AC8FA', b: '#007AFF', icon: 'globe' },
}

export function AppIcon({ id, size = 52 }: { id: keyof typeof APP_META; size?: number }) {
  const m = APP_META[id]
  const I = Icon[m.icon]
  return (
    <span className="appicon" style={{ width: size, height: size, borderRadius: size * 0.24, background: `linear-gradient(180deg, ${m.a}, ${m.b})` }} aria-hidden="true">
      <I width={size * 0.5} height={size * 0.5} stroke={m.icon === 'passport' || m.icon === 'tiktok' ? '#fff' : '#fff'} />
    </span>
  )
}

/** Pasta azul do macOS, com capa de foto opcional. */
export function FolderIcon({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 72 56" aria-hidden="true" className="foldericon">
      <defs>
        <linearGradient id="fb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9CCBF7"/><stop offset="1" stopColor="#5E9BE0"/></linearGradient>
        <linearGradient id="ff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B7DBFA"/><stop offset="1" stopColor="#6FA8E6"/></linearGradient>
      </defs>
      <path d="M4 10a4 4 0 0 1 4-4h18l5 5h33a4 4 0 0 1 4 4v33a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="url(#fb)"/>
      <rect x="4" y="18" width="64" height="34" rx="4" fill="url(#ff)"/>
    </svg>
  )
}
