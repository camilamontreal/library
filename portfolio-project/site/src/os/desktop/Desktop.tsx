import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { content, featuredProjects } from '../../content'
import { useOS, type AppId } from '../../store/os'
import { useLang, ui, t } from '../../lib/i18n'
import { useWallpaper, useClock, fmtTime, fmtDate } from '../../lib/hooks'
import { Media } from '../../ui/Media'
import { AppIcon, Icon } from '../../ui/icons'
import { Window } from './Window'
import { Widgets } from './Widgets'
import { DesktopIcon } from './DesktopIcon'
import { renderApp, appTitle } from '../../apps'
import './desktop.css'

const DOCK: AppId[] = ['browser', 'miles', 'passport', 'departures', 'about', 'mediakit', 'contact']
const APP_LABEL: Record<AppId, Parameters<typeof ui>[0]> = { browser: 'browser', miles: 'miles', passport: 'passport', departures: 'departures', about: 'about', mediakit: 'mediaKit', contact: 'contact', trash: 'trash', finder: 'allProjects', case: 'projects' }

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
  const { audience, setAudience, open } = useOS()
  const [menu, setMenu] = useState(false)
  const items: { id: AppId; key: Parameters<typeof ui>[0]; payload?: string }[] = [
    { id: 'finder', key: 'allProjects' }, { id: 'browser', key: 'browser' }, { id: 'miles', key: 'miles' }, { id: 'passport', key: 'passport' },
    { id: 'departures', key: 'departures' }, { id: 'about', key: 'about' }, { id: 'mediakit', key: 'mediaKit' }, { id: 'contact', key: 'contact' },
  ]
  return (
    <header className="menubar">
      <strong className="menubar__brand">{content.profile.brandName}</strong>
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
      <time className="menubar__clock" dateTime={now.toISOString()}>{fmtDate(now, lang)} · {fmtTime(now, lang)}</time>
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

