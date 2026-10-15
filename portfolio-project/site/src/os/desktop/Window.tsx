import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useOS, type Win } from '../../store/os'
import { useLang, ui } from '../../lib/i18n'

/** Janela estilo macOS: arrastável pela barra, foco ao clicar, fecha pelo botão vermelho ou Esc. */
export function Window({ win, children, title }: { win: Win; children: ReactNode; title?: string }) {
  const { close, focus, move } = useOS()
  const lang = useLang((s) => s.lang)
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    drag.current = { sx: e.clientX, sy: e.clientY, ox: win.x, oy: win.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const nx = Math.max(-win.w + 120, Math.min(window.innerWidth - 120, drag.current.ox + e.clientX - drag.current.sx))
    const ny = Math.max(28, Math.min(window.innerHeight - 60, drag.current.oy + e.clientY - drag.current.sy))
    move(win.key, nx, ny)
  }
  const onPointerUp = () => { drag.current = null }

  return (
    <motion.section
      className="win" role="dialog" aria-label={title ?? win.app}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerDown={() => focus(win.key)}
      onKeyDown={(e) => { if (e.key === 'Escape') close(win.key) }}
    >
      <div className="win__bar" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onDoubleClick={() => close(win.key)}>
        <button className="win__light win__light--close" aria-label={ui('close', lang)} onClick={() => close(win.key)} />
        <span className="win__light win__light--min" aria-hidden="true" />
        <span className="win__light win__light--max" aria-hidden="true" />
        <span className="win__title" id={`${win.key}-title`}>{title}</span>
      </div>
      <div className="win__body">{children}</div>
    </motion.section>
  )
}
