import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { content, featuredProjects } from '../../content'
import { useOS, type AppId } from '../../store/os'
import { useLang, ui, t } from '../../lib/i18n'
import { useClock, fmtTime, fmtDate } from '../../lib/hooks'
import { Media } from '../../ui/Media'
import { AppIcon, Icon, type AppIconId } from '../../ui/icons'
import { renderApp, appTitle } from '../../apps'
import './mobile.css'

type Screen = { app: AppId; payload?: string }

/**
 * iPhone da Cami: tela de bloqueio (1 toque, pulável) → tela inicial (widget Milhas, apps, pasta Projetos) → app em tela cheia.
 * Navegação: botão voltar no topo, barra inferior com Início. Sem hover; alvos ≥ 44 px.
 */
export function Mobile() {
  const lang = useLang((s) => s.lang)
  const [locked, setLocked] = useState(() => { try { return sessionStorage.getItem('camios.unlocked') !== '1' } catch { return true } })
  const [stack, setStack] = useState<Screen[]>([])
  const unlock = () => { try { sessionStorage.setItem('camios.unlocked', '1') } catch { /* */ } setLocked(false) }
  const push = (app: AppId, payload?: string) => setStack((s) => [...s, { app, payload }])
  const pop = () => setStack((s) => s.slice(0, -1))
  const home = () => setStack([])
  const top = stack[stack.length - 1]

  // apps abertos por componentes internos (ex.: "próximo projeto") passam pelo store; aqui viram telas empilhadas
  const setOpenHandler = useOS((s) => s.setOpenHandler)
  useEffect(() => { setOpenHandler((app, payload) => setStack((s) => [...s, { app, payload }])); return () => setOpenHandler(null) }, [setOpenHandler])

  return (
    <div className="phone">
      <AnimatePresence>{locked && <LockScreen onUnlock={unlock} />}</AnimatePresence>
      <HomeScreen onOpen={push} />
      <AnimatePresence>
        {top && (
          <motion.section key={stack.length} className="pscreen" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }} role="dialog" aria-label={appTitle(top, lang)}>
            <header className="pscreen__bar">
              <button className="pscreen__btn" onClick={pop} aria-label={ui('back', lang)}><Icon.back /> {ui('back', lang)}</button>
              <span className="pscreen__title">{appTitle(top, lang)}</span>
              <button className="pscreen__btn" onClick={home} aria-label={ui('home', lang)}><Icon.home /></button>
            </header>
            <div className="pscreen__body">{renderApp(top)}</div>
          </motion.section>
        )}
      </AnimatePresence>
      <span className="sr-only">{content.profile.brandName}</span>
      {!top && <LangDot />}
    </div>
  )
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const lang = useLang((s) => s.lang)
  const now = useClock()
  const p = content.profile
  const audience = useOS((s) => s.audience)
  const [first, second] = featuredProjects(audience)
  const [s0, s1] = p.heroStats
  const notifs: { app: string; title: string; body: string; media?: typeof p.avatar; icon?: AppIconId }[] = [
    { app: 'Mensagens', title: p.brandName, body: t(p.tagline, lang), media: p.avatar },
    ...(first ? [{ app: 'Fotos', title: first.client, body: t(first.title, lang), icon: 'photos' as AppIconId }] : []),
    ...(second ? [{ app: 'Passaporte', title: second.client, body: t(second.title, lang), icon: 'passport' as AppIconId }] : []),
    { app: 'Analytics', title: `${s0.value} ${t(s0.label, lang)}`, body: `${s1.value} ${t(s1.label, lang)}`, icon: 'miles' as AppIconId },
  ]
  return (
    <motion.button className="lock" onClick={onUnlock} initial={{ opacity: 1 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.3 }} aria-label={ui('unlock', lang)}>
      <Media media={p.lockscreen} className="lock__wall" label={`${ui('photo', lang)} · lockscreen`} />
      <div className="lock__time"><div className="lock__date">{fmtDate(now, lang)}</div><div className="num lock__clock">{fmtTime(now, lang)}</div></div>
      <div className="lock__notifs">
        {notifs.map((n, i) => (
          <motion.div key={i} className="lock__notif glass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.25, duration: 0.4 }}>
            {n.media ? <span className="lock__avatar"><Media media={n.media} small /></span> : <AppIcon id={n.icon!} size={40} />}
            <div><em>{n.app}<small>{ui('notifNow', lang)}</small></em><b>{n.title}</b><span>{n.body}</span></div>
          </motion.div>
        ))}
      </div>
      <div className="lock__hint">{ui('unlock', lang)}</div>
    </motion.button>
  )
}

function HomeScreen({ onOpen }: { onOpen: (app: AppId, payload?: string) => void }) {
  const lang = useLang((s) => s.lang)
  const now = useClock()
  const p = content.profile
  const { audience } = useOS()
  const featured = featuredProjects(audience)
  const [cc, setCc] = useState(false)
  const setSpotlight = useOS((s) => s.setSpotlight)
  const apps: { id: AppId; payload?: string; label: string; icon: AppIconId }[] = [
    { id: 'notes', label: ui('notes', lang), icon: 'notes' },
    { id: 'messages', label: ui('messages', lang), icon: 'messages' },
    { id: 'photos', label: ui('photos', lang), icon: 'photos' },
    { id: 'passport', label: ui('passport', lang), icon: 'passport' },
    { id: 'departures', label: ui('departures', lang), icon: 'departures' },
    { id: 'about', label: ui('about', lang), icon: 'about' },
    { id: 'mediakit', label: ui('mediaKit', lang), icon: 'mediakit' },
  ]
  return (
    <div className="home">
      <Media media={p.wallpapers.evening} className="home__wall" label={`${ui('photo', lang)} · reel`} />
      <div className="home__status"><span>{fmtTime(now, lang)}</span>
        <button className="home__cc" onClick={() => setCc(true)} aria-label={ui('controlCenter', lang)}><span aria-hidden="true">●●● ▮</span></button>
      </div>
      {cc && <ControlCenter onClose={() => setCc(false)} />}
      <div className="home__apps">
        <button className="happ" onClick={() => onOpen('finder')}>
          <span className="happ__folder glass">{featured.slice(0, 6).map((f) => <Media key={f.id} media={f.cover} className="happ__mini" small />)}</span>
          <span>{ui('projects', lang)}</span>
        </button>
        {apps.map((a, i) => (
          <button key={i} className="happ" onClick={() => onOpen(a.id, a.payload)}><AppIcon id={a.icon} size={60} /><span>{a.label}</span></button>
        ))}
      </div>
      <button className="home__search glass" onClick={() => setSpotlight(true)}><Icon.search width={15} height={15} /> {ui('search', lang)}</button>
      <nav className="home__dock glass" aria-label="Dock">
        <button onClick={() => onOpen('contact')} aria-label={ui('contact', lang)}><AppIcon id="contact" size={58} /></button>
        <button onClick={() => onOpen('browser')} aria-label={ui('browser', lang)}><AppIcon id="browser" size={58} /></button>
        <button onClick={() => onOpen('finder')} aria-label={ui('allProjects', lang)}><AppIcon id="files" size={58} /></button>
        <button onClick={() => onOpen('miles')} aria-label={ui('miles', lang)}><AppIcon id="miles" size={58} /></button>
      </nav>
    </div>
  )
}

/** Central de Controle (toque nos ícones de status): idioma e "Ver como", que no celular não tinham onde ficar. */
function ControlCenter({ onClose }: { onClose: () => void }) {
  const { lang, setLang } = useLang()
  const { audience, setAudience } = useOS()
  return (
    <div className="cc" onClick={onClose}>
      <div className="cc__panel glass" role="dialog" aria-label={ui('controlCenter', lang)} onClick={(e) => e.stopPropagation()}>
        <div className="eyebrow">{ui('language', lang)}</div>
        <div className="cc__seg" role="radiogroup" aria-label={ui('language', lang)}>
          {(['en', 'pt', 'fr'] as const).map((l) => <button key={l} role="radio" aria-checked={lang === l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
        </div>
        <div className="eyebrow">{ui('viewAs', lang)}</div>
        <div className="cc__seg" role="radiogroup" aria-label={ui('viewAs', lang)}>
          <button role="radio" aria-checked={audience === 'marca'} className={audience === 'marca' ? 'on' : ''} onClick={() => setAudience('marca')}>{ui('brand', lang)}</button>
          <button role="radio" aria-checked={audience === 'recrutador'} className={audience === 'recrutador' ? 'on' : ''} onClick={() => setAudience('recrutador')}>{ui('recruiter', lang)}</button>
        </div>
      </div>
    </div>
  )
}

/** Seletor de idioma discreto no topo (3 letras). */
function LangDot() {
  const { lang, setLang } = useLang()
  return (
    <div className="plang" role="radiogroup" aria-label="Language">
      {(['en', 'pt', 'fr'] as const).map((l) => <button key={l} role="radio" aria-checked={lang === l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
    </div>
  )
}
