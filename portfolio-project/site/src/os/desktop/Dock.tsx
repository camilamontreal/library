import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import { useOS, type AppId } from '../../store/os'
import { useLang, ui } from '../../lib/i18n'
import { useMediaQuery } from '../../lib/hooks'
import { AppIcon } from '../../ui/icons'
import { APP_LABEL, DOCK } from '../../apps/registry'

type ItemProps = { id: AppId; label: string; base: number; mouseX: MotionValue<number>; still: boolean; isOpen: boolean; bouncing: boolean; onClick: () => void }

/** Um ícone do Dock: cresce conforme a proximidade do cursor (como no macOS), com mola suave. */
function DockItem({ id, label, base, mouseX, still, isOpen, bouncing, onClick }: ItemProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const distance = useTransform(mouseX, (x) => { const r = ref.current?.getBoundingClientRect(); return r ? x - (r.left + r.width / 2) : Infinity })
  const target = useTransform(distance, [-190, -120, -55, 0, 55, 120, 190], [base, base * 1.1, base * 1.36, base * 1.72, base * 1.36, base * 1.1, base])
  const size = useSpring(target, { mass: 0.1, stiffness: 190, damping: 13 })
  return (
    <motion.button ref={ref} className="dock__app" style={{ width: still ? base : size, height: still ? base : size }} onClick={onClick} aria-label={label} whileTap={{ scale: 0.92 }}>
      <motion.span className="dock__bounce" animate={bouncing ? { y: [0, -36, 0, -22, 0, -10, 0] } : { y: 0 }} transition={{ duration: 1.15, ease: 'easeOut' }}>
        <AppIcon id={id} size="100%" />
      </motion.span>
      <span className="dock__label" role="tooltip">{label}</span>
      {isOpen && <i className="dock__dot" aria-hidden="true" />}
    </motion.button>
  )
}

/** Dock do macOS: vidro translúcido, ampliação por proximidade, indicador de app aberto, ícone que salta ao abrir e dica com o nome. */
export function Dock() {
  const lang = useLang((s) => s.lang)
  const { windows, open } = useOS()
  const mouseX = useMotionValue(Infinity)
  const reduce = useReducedMotion() ?? false
  const wide = useMediaQuery('(min-width: 1200px)'), mid = useMediaQuery('(min-width: 900px)')
  const base = wide ? 58 : mid ? 50 : 42
  const [bouncing, setBouncing] = useState<AppId | null>(null)

  const launch = (id: AppId) => {
    if (!windows.some((w) => w.app === id)) { setBouncing(id); window.setTimeout(() => setBouncing(null), 1250) }
    open(id)
  }
  const item = (id: AppId) => (
    <DockItem key={id} id={id} base={base} mouseX={mouseX} still={reduce} label={ui(APP_LABEL[id], lang)} isOpen={windows.some((w) => w.app === id)} bouncing={bouncing === id} onClick={() => launch(id)} />
  )
  return (
    <nav className="dock" aria-label="Dock" style={{ ['--dock-base' as string]: `${base}px` }}
      onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)}>
      {DOCK.map(item)}
      <span className="dock__sep" aria-hidden="true" />
      {item('trash')}
    </nav>
  )
}
