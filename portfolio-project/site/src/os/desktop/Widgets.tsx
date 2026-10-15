import { content } from '../../content'
import { useOS } from '../../store/os'
import { useLang, ui, t } from '../../lib/i18n'
import { Icon } from '../../ui/icons'
import { motion } from 'framer-motion'

/** Widgets da mesa (direção E3 aprovada): Milhas, Passaporte (carimbos de marcas) e Último embarque. */
export function Widgets() {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const p = content.profile
  const brands = content.brands.filter((b) => b.kind === 'evento' || b.kind === 'parceria')
  const stamps = brands.slice(0, 7)
  const last = content.projects.find((x) => x.id === 'air-canada-austin') ?? content.projects[0]

  return (
    <motion.div className="widgets" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
      <motion.button variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="widget glass widget--miles" onClick={() => open('miles')} aria-label={ui('miles', lang)}>
        <h4>{ui('miles', lang)} <small>{p.heroStats[1].period ?? ''}</small></h4>
        <div className="widget__grid">
          {p.heroStats.map((m, i) => (
            <div key={i}><div className="num widget__big">{m.value}</div><div className="widget__lab">{t(m.label, lang)}</div></div>
          ))}
        </div>
      </motion.button>

      <motion.button variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="widget glass glass--dark widget--passport" onClick={() => open('passport')} aria-label={ui('passport', lang)}>
        <h4>{ui('passport', lang)} <small>{ui('stamps', lang)}</small></h4>
        <div className="widget__stamps">
          {stamps.map((b) => <span key={b.name} className="stamp">{b.name}</span>)}
          <span className="stamp stamp--more">+{Math.max(0, brands.length - stamps.length)}</span>
        </div>
      </motion.button>

      <motion.button variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="widget glass widget--boarding" onClick={() => open('case', last.id)} aria-label={`${ui('lastBoarding', lang)}: ${last.client}`}>
        <div className="widget__bp">
          <div>
            <div className="eyebrow">{ui('lastBoarding', lang)}</div>
            <div className="num widget__route">{last.route ? `${t(last.route.from, lang)} → ${t(last.route.to, lang)}` : last.client}</div>
            <div className="widget__lab">{last.client} · {ui(last.type === 'publicado' ? 'typePublicado' : last.type === 'ugc' ? 'typeUgc' : 'typeProfissional', lang)}</div>
          </div>
          <div className="widget__stub"><Icon.plane width={18} height={18} />{ui('open', lang)}</div>
        </div>
      </motion.button>
    </motion.div>
  )
}
