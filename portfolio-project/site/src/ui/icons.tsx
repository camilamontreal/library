/** Ícones do sistema. Todos em SVG inline, cor por `currentColor`, para funcionar no claro e no escuro. */

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
  notes: (p: P = {}) => <svg {...base} {...p}><path d="M6 3h12a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 6 3Z"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/></svg>,
  chat: (p: P = {}) => <svg {...base} {...p}><path d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6.5L7 20.5v-4H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"/></svg>,
  photos: (p: P = {}) => <svg {...base} {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17.5 5-4.5 3.5 3 3-2.5 5 4"/></svg>,
  map: (p: P = {}) => <svg {...base} {...p}><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>,
  music: (p: P = {}) => <svg {...base} {...p}><path d="M9 17.5V5.5l10-2v12"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/></svg>,
  calendar: (p: P = {}) => <svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>,
  ticket: (p: P = {}) => <svg {...base} {...p}><path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5v1.8a1.7 1.7 0 0 0 0 3.4v1.8A1.5 1.5 0 0 1 19 17H5a1.5 1.5 0 0 1-1.5-1.5v-1.8a1.7 1.7 0 0 0 0-3.4Z"/><path d="M14.5 7v10" strokeDasharray="1.5 2.5"/></svg>,
  search: (p: P = {}) => <svg {...base} {...p}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>,
  send: (p: P = {}) => <svg {...base} {...p}><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>,
  list: (p: P = {}) => <svg {...base} {...p}><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.5M3.5 12h.5M3.5 18h.5"/></svg>,
}

/** Ícones de app (SVG vetorial, desenho original): ver ui/appicons.tsx */
export { AppIcon, type AppIconId } from './appicons'

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
