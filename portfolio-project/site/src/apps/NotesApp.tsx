import { useCallback, useEffect, useState } from 'react'
import { content } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t, type Lang } from '../lib/i18n'
import { fetchNotes, postNote, welcomeNote, guestbookLive, LIMITS, type Note } from '../lib/guestbook'
import { Icon } from '../ui/icons'

const locale = (l: Lang) => (l === 'en' ? 'en-CA' : l === 'fr' ? 'fr-CA' : 'pt-BR')
const when = (iso: string, l: Lang) => new Date(iso).toLocaleDateString(locale(l), { day: 'numeric', month: 'short', year: 'numeric' })

/** Notas = livro de visitas. Lista à esquerda, nota aberta à direita (no celular, uma de cada vez). */
export function NotesApp() {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const [notes, setNotes] = useState<Note[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [sel, setSel] = useState<string>('welcome') // 'welcome' | 'new' | id da nota
  const [view, setView] = useState<'list' | 'detail'>('list') // só importa em tela estreita
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [trap, setTrap] = useState('')
  const [status, setStatus] = useState<'idle' | 'busy' | 'short' | 'links' | 'wait' | 'error'>('idle')
  const [justPosted, setJustPosted] = useState<Note | null>(null)

  const load = useCallback(() => { fetchNotes().then((n) => { setNotes(n); setFailed(false) }).catch(() => { setNotes([]); setFailed(true) }) }, [])
  useEffect(load, [load])

  const welcome = welcomeNote()
  const current = notes?.find((n) => n.id === sel)
  const choose = (id: string) => { setSel(id); setView('detail'); setStatus('idle') }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('busy')
    const r = await postNote(name, msg, lang, trap)
    if (!r.ok) { setStatus(r.reason); return }
    setNotes((n) => [r.note, ...(n ?? [])]); setJustPosted(r.note); setSel(r.note.id); setMsg(''); setStatus('idle')
  }
  const err = status === 'short' ? 'noteShort' : status === 'links' ? 'noteLinks' : status === 'wait' ? 'noteWait' : status === 'error' ? 'noteError' : null

  return (
    <div className="notes">
    <div className="notes__in" data-view={view}>
      <aside className="notes__list" aria-label={ui('notes', lang)}>
        <div className="notes__top">
          <h2>{ui('notes', lang)}</h2>
          <button className="notes__compose" onClick={() => choose('new')} aria-label={ui('newNote', lang)} title={ui('newNote', lang)}><Icon.notes width={20} height={20} /></button>
        </div>
        {!guestbookLive && <p className="notes__demo">{ui('noteDemo', lang)}</p>}
        <div className="eyebrow notes__sec">📌 {ui('pinned', lang)}</div>
        <button className={`notes__row ${sel === 'welcome' ? 'on' : ''}`} onClick={() => choose('welcome')}>
          <b>{t(welcome.title, lang)}</b><span>{content.profile.name} · {t(welcome.body, lang)}</span>
        </button>
        {notes === null && <p className="muted notes__empty">{ui('noteLoading', lang)}</p>}
        {failed && <p className="muted notes__empty">{ui('noteError', lang)} <button className="notes__retry" onClick={load}>↻</button></p>}
        {notes && notes.length > 0 && <div className="eyebrow notes__sec">{ui('notes', lang)}</div>}
        {notes?.map((n) => (
          <button key={n.id} className={`notes__row ${sel === n.id ? 'on' : ''}`} onClick={() => choose(n.id)}>
            <b>{n.name}</b><span><time dateTime={n.createdAt}>{when(n.createdAt, lang)}</time> · {n.message}</span>
          </button>
        ))}
      </aside>

      <section className="notes__page">
        <button className="notes__back" onClick={() => setView('list')}><Icon.back width={18} height={18} /> {ui('notes', lang)}</button>
        {sel === 'welcome' && (
          <article className="notes__sheet">
            <h3>{t(welcome.title, lang)}</h3>
            <p>{t(welcome.body, lang)}</p>
            <button className="btn" onClick={() => setSel('new')}>{ui('newNote', lang)}</button>
          </article>
        )}
        {sel === 'new' && (
          <form className="notes__sheet notes__form" onSubmit={submit}>
            <h3>{ui('newNote', lang)}</h3>
            <label className="sr-only" htmlFor="gb-name">{ui('yourName', lang)}</label>
            <input id="gb-name" className="notes__input" value={name} maxLength={LIMITS.name} placeholder={ui('yourName', lang)} autoComplete="given-name" onChange={(e) => setName(e.target.value)} required />
            <label className="sr-only" htmlFor="gb-msg">{ui('yourNote', lang)}</label>
            <textarea id="gb-msg" className="notes__input notes__area" value={msg} maxLength={LIMITS.message} rows={6} placeholder={ui('yourNote', lang)} onChange={(e) => setMsg(e.target.value)} required />
            <input className="notes__trap" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
            <div className="notes__foot">
              <span className="muted">{msg.length}/{LIMITS.message}</span>
              <button className="btn" disabled={status === 'busy'}>{status === 'busy' ? ui('posting', lang) : ui('postNote', lang)}</button>
            </div>
            <p className="notes__msg" role="status" aria-live="polite">{err ? ui(err, lang) : ''}</p>
          </form>
        )}
        {current && (
          <article className="notes__sheet">
            {justPosted?.id === current.id && <p className="notes__thanks" role="status">{ui('notePosted', lang)}</p>}
            <div className="eyebrow">{when(current.createdAt, lang)}</div>
            <h3>{current.name}</h3>
            <p className="notes__body">{current.message}</p>
            {justPosted?.id === current.id && <button className="btn btn--ghost" onClick={() => open('ticket', current.name)}><Icon.ticket width={16} height={16} /> {ui('getPass', lang)}</button>}
          </article>
        )}
      </section>
    </div>
    </div>
  )
}
