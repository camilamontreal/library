import { useEffect, useState } from 'react'
import { content } from '../content'

export function useMediaQuery(q: string) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

/** Relógio real, atualizado a cada 30 s. */
export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30_000); return () => clearInterval(id) }, [])
  return now
}

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night'
export function dayPart(d: Date): DayPart {
  const h = d.getHours()
  if (h >= 6 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 20) return 'evening'
  return 'night'
}

/** Papel de parede conforme a hora do visitante (surpresa aprovada). */
export function useWallpaper() {
  const now = useClock()
  return content.profile.wallpapers[dayPart(now)]
}

export function fmtTime(d: Date, lang: string) {
  return d.toLocaleTimeString(lang === 'en' ? 'en-CA' : lang === 'fr' ? 'fr-CA' : 'pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
}
export function fmtDate(d: Date, lang: string) {
  return d.toLocaleDateString(lang === 'en' ? 'en-CA' : lang === 'fr' ? 'fr-CA' : 'pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
}
