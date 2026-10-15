import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useOS } from '../../store/os'
import { useLang, ui } from '../../lib/i18n'
import { FolderIcon } from '../../ui/icons'
import { Media } from '../../ui/Media'
import type { MediaT } from '../../content/schema'

/**
 * Ícone de pasta na mesa. Arrastável (surpresa aprovada), abre com clique/Enter.
 * Um clique curto abre; arrastar mais de 6 px só move.
 */
export function DesktopIcon({ id, index, label, sub, tag, cover, onOpen }:
  { id: string; index: number; label: string; sub?: string; tag?: 'publicado' | 'ugc' | 'profissional'; cover?: MediaT; onOpen: () => void }) {
  const lang = useLang((s) => s.lang)
  const { iconOffsets, moveIcon } = useOS()
  const off = iconOffsets[id] ?? { dx: 0, dy: 0 }
  const st = useRef<{ sx: number; sy: number; dx: number; dy: number; moved: boolean } | null>(null)

  const col = index % 2, row = Math.floor(index / 2)
  const base = { right: 22 + (1 - col) * 124, top: 46 + row * 118 }

  return (
    <motion.div className="dicon-wrap" style={{ right: base.right, top: base.top }} variants={{ hidden: { opacity: 0, y: -14 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}>
    <button
      className="dicon" style={{ transform: `translate(${off.dx}px, ${off.dy}px)` }}
      onPointerDown={(e) => { st.current = { sx: e.clientX, sy: e.clientY, dx: off.dx, dy: off.dy, moved: false }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => {
        if (!st.current) return
        const dx = e.clientX - st.current.sx, dy = e.clientY - st.current.sy
        if (Math.abs(dx) + Math.abs(dy) > 6) st.current.moved = true
        if (st.current.moved) moveIcon(id, st.current.dx + dx, st.current.dy + dy)
      }}
      onPointerUp={() => { if (st.current && !st.current.moved) onOpen(); st.current = null }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
      aria-label={`${label}${sub ? ' · ' + sub : ''}`}
    >
      <span className="dicon__art">
        <FolderIcon size={76} />
        {cover && <Media media={cover} className="dicon__cover" small />}
      </span>
      <span className="dicon__label">{label}</span>
      {tag && <span className={`tag tag--${tag}`}>{ui(tag === 'publicado' ? 'typePublicado' : tag === 'ugc' ? 'typeUgc' : 'typeProfissional', lang)}</span>}
      {!tag && sub && <span className="tag" style={{ background: 'rgba(255,255,255,.9)' }}>{sub}</span>}
    </button>
    </motion.div>
  )
}
