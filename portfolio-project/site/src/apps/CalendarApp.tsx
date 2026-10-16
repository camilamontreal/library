import { useMemo, useState } from 'react'
import { content, placeById } from '../content'
import { useLang, ui, t, type Lang } from '../lib/i18n'

const locale = (l: Lang) => (l === 'en' ? 'en-CA' : l === 'fr' ? 'fr-CA' : 'pt-BR')
const pad = (n: number) => String(n).padStart(2, '0')
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

/** Calendário: quando a Cami está viajando, ocupada ou disponível, com botão para marcar uma conversa. */
export function CalendarApp() {
  const lang = useLang((s) => s.lang)
  const c = content.calendar
  const [today] = useState(() => new Date())
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate())

  const days = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1).getDay()
    const count = new Date(cursor.y, cursor.m + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)] as (number | null)[]
  }, [cursor])
  const kindOn = (d: string) => c.events.find((e) => d >= e.date && d <= (e.endDate ?? e.date))
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString(locale(lang), { month: 'long', year: 'numeric' })
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + i).toLocaleDateString(locale(lang), { weekday: 'narrow' }))
  const move = (n: number) => setCursor(({ y, m }) => { const d = new Date(y, m + n, 1); return { y: d.getFullYear(), m: d.getMonth() } })
  const upcoming = c.events.filter((e) => (e.endDate ?? e.date) >= todayIso).sort((a, b) => a.date.localeCompare(b.date))
  const fmt = (s: string) => new Date(`${s}T12:00:00`).toLocaleDateString(locale(lang), { day: 'numeric', month: 'short' })
  const kindLabel = { trip: 'evTrip', busy: 'evBusy', open: 'evOpen' } as const
  const subject = encodeURIComponent(t({ en: 'Chat with Camila Montreal', pt: 'Conversa com Camila Montreal', fr: 'Échange avec Camila Montreal' }, lang))
  const book = c.bookingUrl ?? `mailto:${content.profile.email}?subject=${subject}`

  return (
    <div className="cal app">
      <header className="cal__head">
        <div>
          <h2 className="app__h" style={{ marginBottom: 2 }}>{ui('calendar', lang)} {c.exemplo && <span className="exemplo-badge" style={{ position: 'static' }}>{ui('exemplo', lang)}</span>}</h2>
          <p className="cal__status"><i className="cal__led" />{t(c.statusNote, lang)}</p>
        </div>
        <a className="btn" href={book} {...(c.bookingUrl ? { target: '_blank', rel: 'noreferrer' } : {})}>{ui('bookChat', lang)}</a>
      </header>
      <div className="cal__nav">
        <button onClick={() => move(-1)} aria-label="‹">‹</button>
        <b>{monthLabel}</b>
        <button onClick={() => move(1)} aria-label="›">›</button>
      </div>
      <div className="cal__grid" role="grid" aria-label={monthLabel}>
        {weekdays.map((w, i) => <span key={i} className="cal__wd">{w}</span>)}
        {days.map((d, i) => {
          if (!d) return <span key={i} />
          const key = iso(cursor.y, cursor.m, d), ev = kindOn(key)
          return <span key={i} className={`cal__day ${ev ? `cal__day--${ev.kind}` : ''} ${key === todayIso ? 'cal__day--today' : ''}`} title={ev ? t(ev.title, lang) : undefined}>{d}</span>
        })}
      </div>
      <div className="cal__legend">
        {(['trip', 'busy', 'open'] as const).map((k) => <span key={k}><i className={`cal__dot cal__dot--${k}`} />{ui(kindLabel[k], lang)}</span>)}
      </div>
      {upcoming.length > 0 && (
        <>
          <div className="eyebrow">{ui('upcoming', lang)}</div>
          <ul className="cal__list">
            {upcoming.map((e, i) => (
              <li key={i}><i className={`cal__dot cal__dot--${e.kind}`} /><b>{t(e.title, lang)}</b><span className="muted">{fmt(e.date)}{e.endDate ? ` – ${fmt(e.endDate)}` : ''}{e.placeId && placeById(e.placeId) ? ` · ${t(placeById(e.placeId)!.name, lang)}` : ''}</span></li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
