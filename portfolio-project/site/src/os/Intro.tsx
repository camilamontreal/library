import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { content } from '../content'
import { useLang, ui, t } from '../lib/i18n'
import { Media } from '../ui/Media'
import { Icon } from '../ui/icons'
import './intro.css'

const KEY = 'camios.intro'
/** Mini-filme de abertura (~4,5 s): foto, nome, frase, números. Uma vez por sessão; pular com clique, Esc ou Enter. */
export function introSeen(): boolean {
  try { return sessionStorage.getItem(KEY) === '1' || new URLSearchParams(location.search).has('nointro') } catch { return false }
}

const STEPS = [0, 900, 2000, 3200] // ms em que cada cena entra
const TOTAL = 4600

export function Intro({ onDone }: { onDone: () => void }) {
  const lang = useLang((s) => s.lang)
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const p = content.profile
  const photo = content.albums[0]?.photos[3] ?? p.wallpapers.evening
  const stats = [p.heroStats[0], p.heroStats[1], p.heroStats[3]]

  const finish = useCallback(() => {
    setLeaving(true)
    try { sessionStorage.setItem(KEY, '1'); sessionStorage.setItem('camios.booted', '1') } catch { /* */ }
    window.setTimeout(onDone, 450)
  }, [onDone])

  useEffect(() => {
    try { sessionStorage.setItem('camios.booted', '1') } catch { /* */ } // a tela de boot antiga não repete
    const total = reduce ? 1500 : TOTAL
    const ids = reduce ? [] : STEPS.slice(1).map((ms, i) => window.setTimeout(() => setStep(i + 1), ms))
    const end = window.setTimeout(finish, total)
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish() }
    window.addEventListener('keydown', key)
    return () => { ids.forEach(clearTimeout); clearTimeout(end); window.removeEventListener('keydown', key) }
  }, [finish, reduce])

  return (
    <motion.div className="intro" role="dialog" aria-label={p.brandName} onClick={finish} initial={{ opacity: 1 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.45 }}>
      <motion.div className="intro__photo" initial={{ opacity: 0, scale: 1.14 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0.2 : 4.4, ease: 'easeOut' }}>
        <Media media={photo} small />
      </motion.div>
      <div className="intro__shade" />
      <svg className="intro__route" viewBox="0 0 400 120" aria-hidden="true" preserveAspectRatio="none">
        <motion.path d="M10 100 Q200 -30 390 100" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 3.6, ease: 'easeInOut' }} />
      </svg>
      <div className="intro__body">
        <motion.div className="intro__mark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.25, duration: 0.6 }}>
          <Icon.plane width={18} height={18} /> {p.handle}
        </motion.div>
        <motion.h1 className="intro__name" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.35, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>{p.brandName}</motion.h1>
        <AnimatePresence mode="wait">
          {step >= 1 && step < 2 && (
            <motion.p key="tag" className="intro__tag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5 }}>{t(p.tagline, lang)}</motion.p>
          )}
          {step >= 2 && (
            <motion.ul key="stats" className="intro__stats" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.16 } } }}>
              {stats.map((m, i) => (
                <motion.li key={i} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                  <b className="num">{m.value}</b><span>{t(m.label, lang)}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <motion.div className="intro__bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduce ? 1.5 : TOTAL / 1000, ease: 'linear' }} />
      <button className="intro__skip" onClick={(e) => { e.stopPropagation(); finish() }}>{ui('skipIntro', lang)}</button>
    </motion.div>
  )
}
