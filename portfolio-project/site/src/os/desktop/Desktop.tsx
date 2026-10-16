import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { content, featuredProjects } from '../../content'
import { useOS } from '../../store/os'
import { useLang, ui, t } from '../../lib/i18n'
import { useWallpaper, useClock, fmtTime, fmtDate } from '../../lib/hooks'
import { Media } from '../../ui/Media'
import { AppIcon, Icon } from '../../ui/icons'
import { Window } from './Window'
import { Widgets } from './Widgets'
import { DesktopIcon } from './DesktopIcon'
import { renderApp, appTitle } from '../../apps'
import { APP_LABEL, DOCK, ALL_APPS } from '../../apps/registry'
import './desktop.css'


export function Desktop() {
  const lang = useLang((s) => s.lang)
  const wall = useWallpaper()
  const { windows, open, audience, tidy } = useOS()
  const projects = featuredProjects(audience)

  const [booted, setBooted] = useState(() => { try { return sessionStorage.getItem('camios.booted') === '1' } catch { return false } })
  useEffect(() => { if (booted) return; const id = setTimeout(() => { setBooted(true); try { sessionStorage.setItem('camios.booted', '1') } catch { /* */ } }, 1500); return () => clearTimeout(id) }, [booted])

  return (
    <div className="desk" data-audience={audience}>
      <Media media={wall} className="desk__wall" label={`${ui('photo', lang)} · ${t(wall.alt, lang)}`} />
      <AnimatePresence>
        {!booted && (
          <motion.button className="boot" onClick={() => setBooted(true)} initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} aria-label={ui('skipIntro', lang)}>
            <motion.span className="boot__logo" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>{content.profile.brandName}</motion.span>
            <motion.span className="boot__bar"><motion.i initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.3, ease: 'easeInOut' }} /></motion.span>
            <span className="boot__skip">{ui('skipIntro', lang)}</span>
          </motion.button>
        )}
      </AnimatePresence>
      <MenuBar />
      <Widgets />
      <motion.div className="desk__icons" role="group" aria-label={ui('projects', lang)} initial="hidden" animate={booted ? 'show' : 'hidden'} variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
        {projects.map((p, i) => (
          <DesktopIcon key={p.id} id={p.id} index={i} label={p.folderName ? t(p.folderName, lang) : p.client} sub={t(p.title, lang)}
            tag={p.type} onOpen={() => open('case', p.id)} cover={p.cover} />
        ))}
        <DesktopIcon id="finder" index={projects.length} label={ui('allProjects', lang)} sub={`${content.projects.length} · ${ui('baggage', lang)}`} onOpen={() => open('finder')} />
      </motion.div>
      <button className="desk__tidy" onClick={tidy}>{ui('tidyDesk', lang)}</button>

      <AnimatePresence>
        {windows.map((w) => (
          <Window key={w.key} win={w} title={appTitle(w, lang)}>{renderApp(w)}</Window>
        ))}
      </AnimatePresence>

      <Toast />
      <nav className="dock glass" aria-label="Dock">
        {DOCK.map((id) => (
          <button key={id} className="dock__app" onClick={() => open(id)} aria-label={ui(APP_LABEL[id], lang)}>
            <AppIcon id={id} />
            <span className="dock__label">{ui(APP_LABEL[id], lang)}</span>
            {windows.some((w) => w.app === id) && <i className="dock__dot" />}
          </button>
        ))}
        <span className="dock__sep" />
        <button className="dock__app" onClick={() => open('trash')} aria-label={ui('trash', lang)}>
          <AppIcon id="trash" /><span className="dock__label">{ui('trash', lang)}</span>
        </button>
      </nav>
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
