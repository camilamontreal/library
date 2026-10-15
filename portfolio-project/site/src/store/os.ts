import { create } from 'zustand'

/** Que app/janela está aberta. `payload` carrega o id do projeto, a aba do navegador etc. */
export type AppId = 'case' | 'finder' | 'browser' | 'miles' | 'passport' | 'departures' | 'about' | 'mediakit' | 'contact' | 'trash'
export type Win = { key: string; app: AppId; payload?: string; z: number; x: number; y: number; w: number; h: number }
export type Audience = 'marca' | 'recrutador'

const AUD_KEY = 'camios.audience'
function initialAudience(): Audience {
  try { const s = localStorage.getItem(AUD_KEY); if (s === 'marca' || s === 'recrutador') return s } catch { /* */ }
  return 'marca'
}

/** Tamanho padrão de cada app (desktop). O conteúdo é rolável dentro da janela. */
export const DEFAULT_SIZE: Record<AppId, [number, number]> = {
  case: [780, 640], finder: [860, 560], browser: [980, 660], miles: [820, 600], passport: [820, 600],
  departures: [860, 560], about: [720, 560], mediakit: [720, 520], contact: [520, 420], trash: [520, 420],
}

type State = {
  windows: Win[]
  zTop: number
  audience: Audience
  iconOffsets: Record<string, { dx: number; dy: number }>
  /** No mobile, o Mobile.tsx registra um handler que empilha telas em vez de abrir janelas. */
  openHandler: ((app: AppId, payload?: string) => void) | null
  setOpenHandler: (h: State['openHandler']) => void
  open: (app: AppId, payload?: string) => void
  close: (key: string) => void
  focus: (key: string) => void
  move: (key: string, x: number, y: number) => void
  setAudience: (a: Audience) => void
  moveIcon: (id: string, dx: number, dy: number) => void
  tidy: () => void
}

export const useOS = create<State>((set, get) => ({
  windows: [],
  zTop: 10,
  audience: initialAudience(),
  iconOffsets: {},
  openHandler: null,
  setOpenHandler: (openHandler) => set({ openHandler }),
  open: (app, payload) => {
    const handler = get().openHandler
    if (handler) return handler(app, payload)
    const key = payload ? `${app}:${payload}` : app
    const existing = get().windows.find((w) => w.key === key)
    if (existing) return get().focus(key)
    const n = get().windows.length
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900
    const w = Math.min(DEFAULT_SIZE[app][0], vw - 32)
    const h = Math.min(DEFAULT_SIZE[app][1], vh - 110)
    const x = Math.max(16, Math.min(vw - w - 16, (vw - w) / 2 + (n % 4) * 28))
    const y = Math.max(44, Math.min(vh - h - 80, (vh - h) / 2 + (n % 4) * 24))
    const z = get().zTop + 1
    set({ windows: [...get().windows, { key, app, payload, z, x, y, w, h }], zTop: z })
  },
  close: (key) => set({ windows: get().windows.filter((w) => w.key !== key) }),
  focus: (key) => {
    const z = get().zTop + 1
    set({ windows: get().windows.map((w) => (w.key === key ? { ...w, z } : w)), zTop: z })
  },
  move: (key, x, y) => set({ windows: get().windows.map((w) => (w.key === key ? { ...w, x, y } : w)) }),
  setAudience: (audience) => { try { localStorage.setItem(AUD_KEY, audience) } catch { /* */ } set({ audience }) },
  moveIcon: (id, dx, dy) => set({ iconOffsets: { ...get().iconOffsets, [id]: { dx, dy } } }),
  tidy: () => set({ iconOffsets: {} }),
}))
