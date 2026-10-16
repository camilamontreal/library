import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { content, areasFor } from '../../content'
import { AREAS } from '../../apps/FinderApp'
import { useOS } from '../../store/os'
import { useLang, ui, t } from '../../lib/i18n'
import { useWallpaper, useClock, fmtTime, fmtDate, dayPart } from '../../lib/hooks'
import { Media } from '../../ui/Media'
import { Icon } from '../../ui/icons'
import { Window } from './Window'
import { Widgets } from './Widgets'
import { DesktopIcon } from './DesktopIcon'
import { renderApp, appTitle } from '../../apps'
import { APP_LABEL, ALL_APPS } from '../../apps/registry'
import { Dock } from './Dock'
import './desktop.css'


export function Desktop() {
  const lang = useLang((s) => s.lang)
  const wall = useWallpaper()
  const { windows, open, audience, tidy } = useOS()
  const areaFolders = areasFor(audience).map((id) => {
    const key = AREAS.find((a) => a.id === id)!.key
    const inArea = content.projects.filter((p) => p.areas.includes(id as never))
    const top = [...inArea].sort((a, b) => b.featured - a.featured)[0]
    return { id, key, count: inArea.length, cover: top?.cover }
  })

  const [booted, setBooted] = useState(() => { try { return sessionStorage.getItem('camios.booted') === '1' } catch { return false } })
  useEffect(() => { if (booted) try { sessionStorage.setItem('camios.booted', '1') } catch { /* */ } }, [booted])

  return (
    <div className="desk" data-audience={audience} data-daypart={dayPart(useClock())}>
      <Media media={wall} className="desk__wall" label={`${ui('photo', lang)} · ${t(wall.alt, lang)}`} />
      <AnimatePresence>{!booted && <Login onEnter={() => setBooted(true)} />}</AnimatePresence>
      <MenuBar />
      <Widgets />
      <motion.div className="desk__icons" role="group" aria-label={ui('projects', lang)} initial="hidden" animate={booted ? 'show' : 'hidden'} variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
        {areaFolders.map((f, i) => (
          <DesktopIcon key={f.id} id={`area-${f.id}`} index={i} label={ui(f.key, lang)} sub={`${f.count}`} onOpen={() => open('finder', f.id)} cover={f.cover} />
        ))}
        <DesktopIcon id="finder" index={areaFolders.length} label={ui('allProjects', lang)} sub={`${content.projects.length} · ${ui('baggage', lang)}`} onOpen={() => open('finder')} />
      </motion.div>
      <button className="desk__tidy" onClick={tidy}>{ui('tidyDesk', lang)}</button>

      <AnimatePresence>
        {windows.map((w) => (
          <Window key={w.key} win={w} title={appTitle(w, lang)}>{renderApp(w)}</Window>
        ))}
      </AnimatePresence>

      <Toast />
      <Dock />
    </div>
  )
}

function MenuBar() {
  const { lang, setLang } = useLang()
  const now = useClock()
  const { audience, setAudience, open, setSpotlight } = useOS()
  const [menu, setMenu] = useState(false)
  const items = ALL_APPS.filter((id) => id !== 'trash').map((id) => ({ id, key: APP_LABEL[id], payload: undefined as string | undefined }))
  const [pop, setPop] = useState<'about' | 'clock' | null>(null)
  return (
    <header className="menubar">
      <div className="menubar__menu">
        <button className="menubar__brand" aria-haspopup="dialog" aria-expanded={pop === 'about'} onClick={() => setPop((p) => (p === 'about' ? null : 'about'))}>{content.profile.brandName}</button>
        {pop === 'about' && <AboutPop onClose={() => setPop(null)} />}
      </div>
      <button className="menubar__item" onClick={() => open('finder')}>{ui('projects', lang)}</button>
      <div className="menubar__menu">
        <button className="menubar__item" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>{ui('goTo', lang)}</button>
        {menu && (
          <ul className="menubar__dropdown glass" role="menu" onMouseLeave={() => setMenu(false)}>
            {items.map((it) => (
              <li key={it.id}><button role="menuitem" onClick={() => { open(it.id, it.payload); setMenu(false) }}>{ui(it.key, lang)}</button></li>
            ))}
          </ul>
        )}
      </div>
      <span className="menubar__sp" />
      <div className="menubar__seg" role="radiogroup" aria-label={ui('viewAs', lang)}>
        <span className="menubar__seglabel">{ui('viewAs', lang)}</span>
        <button role="radio" aria-checked={audience === 'marca'} className={audience === 'marca' ? 'on' : ''} onClick={() => setAudience('marca')}>{ui('brand', lang)}</button>
        <button role="radio" aria-checked={audience === 'recrutador'} className={audience === 'recrutador' ? 'on' : ''} onClick={() => setAudience('recrutador')}>{ui('recruiter', lang)}</button>
      </div>
      <div className="menubar__lang" role="radiogroup" aria-label="Language">
        {(['en', 'pt', 'fr'] as const).map((l) => (
          <button key={l} role="radio" aria-checked={lang === l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
        ))}
      </div>
      <button className="menubar__item" onClick={() => setSpotlight(true)} aria-label={`${ui('search', lang)} (⌘K)`} title={`${ui('search', lang)} (⌘K)`}><Icon.search width={15} height={15} /></button>
      <div className="menubar__menu">
        <button className="menubar__clock menubar__item" aria-haspopup="dialog" aria-expanded={pop === 'clock'} onClick={() => setPop((p) => (p === 'clock' ? null : 'clock'))}><time dateTime={now.toISOString()}>{fmtDate(now, lang)} · {fmtTime(now, lang)}</time></button>
        {pop === 'clock' && <ClockPop now={now} onClose={() => setPop(null)} />}
      </div>
    </header>
  )
}

/** Notificação que aparece ~20 s depois e abre um case (surpresa aprovada). */
function Toast() {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const project = content.projects.find((p) => p.id === 'air-canada-austin') ?? content.projects[0]
  useEffect(() => {
    if (dismissed) return
    const id = setTimeout(() => setShow(true), 20_000)
    return () => clearTimeout(id)
  }, [dismissed])
  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div className="toast glass" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} role="status">
          <button className="toast__body" onClick={() => { open('case', project.id); setDismissed(true) }}>
            <Media media={project.cover} className="toast__thumb" small />
            <span><b>{project.client.split('·')[0].trim()} · {ui('now', lang).toLowerCase()}</b><em>{ui('toastBody', lang)}</em></span>
          </button>
          <button className="toast__close" aria-label={ui('close', lang)} onClick={() => setDismissed(true)}><Icon.close width={16} height={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


/** Clicar no nome no canto da barra de menu abre um "Sobre este Mac" com a bio (surpresa). */
function AboutPop({ onClose }: { onClose: () => void }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const p = content.profile
  return (
    <div className="pop glass" role="dialog" aria-label={ui('aboutThis', lang)} onMouseLeave={onClose}>
      <Media media={p.avatar} className="pop__avatar" small />
      <b>{p.name}</b>
      <span className="muted">{p.brandName} · {p.location}</span>
      <p>{t(p.tagline, lang)}</p>
      <button className="btn btn--ghost" onClick={() => { open('about'); onClose() }}>{ui('moreInfo', lang)}</button>
    </div>
  )
}

/** Clicar no relógio mostra a hora de Montreal, a do visitante e a de São Paulo. */
function ClockPop({ now, onClose }: { now: Date; onClose: () => void }) {
  const lang = useLang((s) => s.lang)
  const at = (tz?: string) => now.toLocaleTimeString(lang === 'en' ? 'en-CA' : lang === 'fr' ? 'fr-CA' : 'pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz })
  const rows: [string, string][] = [['Montréal', at('America/Toronto')], [ui('yourTime', lang), at()], ['São Paulo', at('America/Sao_Paulo')]]
  return (
    <div className="pop pop--clock glass" role="dialog" onMouseLeave={onClose}>
      {rows.map(([k, v]) => <div key={k} className="pop__row"><span>{k}</span><b className="num">{v}</b></div>)}
    </div>
  )
}

/** Tela de login do Mac: foto, nome e campo de senha de brincadeira. Enter, clique ou qualquer tecla entram. */
function Login({ onEnter }: { onEnter: () => void }) {
  const lang = useLang((s) => s.lang)
  const now = useClock()
  const p = content.profile
  const [dots, setDots] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const go = () => { if (leaving) return; setLeaving(true); setDots(8); setTimeout(onEnter, 450) }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') return go()
      if (e.key === 'Backspace') return setDots((d) => Math.max(0, d - 1))
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) setDots((d) => Math.min(12, d + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  return (
    <motion.div className="login" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.45 }} role="dialog" aria-label={p.brandName}>
      <Media media={p.lockscreen} className="login__wall" label={`${ui('photo', lang)} · login`} />
      <div className="login__top"><span className="num">{fmtDate(now, lang)}</span> <span className="num">{fmtTime(now, lang)}</span></div>
      <div className="login__card">
        <Media media={p.avatar} className="login__avatar" label={t(p.avatar.alt, lang)} />
        <div className="login__name">{p.brandName}</div>
        <form className="login__field" onSubmit={(e) => { e.preventDefault(); go() }}>
          <span className="login__dots" aria-hidden>{dots ? '•'.repeat(dots) : <i>{ui('loginPass', lang)}</i>}</span>
          <button type="submit" className="login__go" aria-label={ui('loginHint', lang)}>→</button>
        </form>
        <div className="login__hint">{ui('loginTip', lang)}</div>
      </div>
      <div className="login__foot">{ui('loginHint', lang)}</div>
    </motion.div>
  )
}
