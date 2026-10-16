import { useEffect, useRef, useState } from 'react'
import { content } from '../content'
import { useOS, type AppId } from '../store/os'
import { useLang, ui, t } from '../lib/i18n'
import type { I18nText } from '../content/schema'
import { Media } from '../ui/Media'

type Action = (typeof content.messages.topics)[number]['actions'][number]
type Bubble = { id: number; side: 'me' | 'them'; text?: I18nText; actions?: Action[] }

const TYPING_MS = 650

/** Mensagens: o visitante toca numa pergunta e a Cami "responde" em balões, com botões que levam a outros apps. */
export function MessagesApp() {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const m = content.messages
  const nextId = useRef(1)
  const [bubbles, setBubbles] = useState<Bubble[]>([{ id: 0, side: 'them', text: m.intro }])
  const [asked, setAsked] = useState<string[]>([])
  const [typing, setTyping] = useState(false)
  const timers = useRef<number[]>([])
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }) }, [bubbles, typing])

  const push = (b: Omit<Bubble, 'id'>) => setBubbles((x) => [...x, { ...b, id: nextId.current++ }])
  const ask = (id: string) => {
    const topic = m.topics.find((x) => x.id === id)
    if (!topic || typing) return
    setAsked((a) => [...a, id])
    push({ side: 'me', text: topic.q })
    setTyping(true)
    const steps: Omit<Bubble, 'id'>[] = topic.a.map((text) => ({ side: 'them' as const, text }))
    if (topic.actions.length) steps.push({ side: 'them', actions: topic.actions })
    steps.forEach((s, i) => {
      timers.current.push(window.setTimeout(() => { push(s); if (i === steps.length - 1) setTyping(false) }, TYPING_MS * (i + 1)))
    })
  }
  const run = (a: Action) => {
    if (a.app) open(a.app as AppId, a.payload)
    else if (a.email) window.location.href = `mailto:${content.profile.email}`
    else if (a.url) window.open(a.url, '_blank', 'noopener')
  }
  const left = m.topics.filter((x) => !asked.includes(x.id))

  return (
    <div className="msgs">
      <header className="msgs__head">
        <Media media={content.profile.avatar} className="msgs__avatar" small />
        <div className="msgs__who"><b>{content.profile.name.split(' ')[0]}</b><span>{content.profile.handle}</span></div>
      </header>
      <div className="msgs__thread" role="log" aria-live="polite">
        <div className="msgs__date">{ui('today', lang)}</div>
        {bubbles.map((b) => b.actions ? (
          <div key={b.id} className="msgs__actions">{b.actions.map((a, i) => <button key={i} className="msgs__action" onClick={() => run(a)}>{t(a.label, lang)}</button>)}</div>
        ) : (
          <div key={b.id} className={`msgs__bubble msgs__bubble--${b.side}`}>{t(b.text, lang)}</div>
        ))}
        {typing && <div className="msgs__bubble msgs__bubble--them msgs__typing" aria-label="…"><i /><i /><i /></div>}
        <div ref={end} />
      </div>
      <footer className="msgs__chips">
        <div className="eyebrow">{left.length ? ui('chooseQuestion', lang) : ''}</div>
        <div className="msgs__chiprow">{left.map((x) => <button key={x.id} className="msgs__chip" disabled={typing} onClick={() => ask(x.id)}>{t(x.q, lang)}</button>)}</div>
      </footer>
    </div>
  )
}
