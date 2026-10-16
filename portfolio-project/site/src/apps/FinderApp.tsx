import { useState } from 'react'
import { content } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t, tbc, type UIKey } from '../lib/i18n'
import { Media } from '../ui/Media'
import { Icon } from '../ui/icons'

export const AREAS: { id: string; key: UIKey }[] = [
  { id: 'all', key: 'all' }, { id: 'content', key: 'areaContent' }, { id: 'ugc', key: 'areaUgc' }, { id: 'events', key: 'areaEvents' },
  { id: 'social', key: 'areaSocial' }, { id: 'marketing', key: 'areaMarketing' }, { id: 'design', key: 'areaDesign' },
]
const TYPES = [
  { id: 'all', key: 'all' as UIKey }, { id: 'publicado', key: 'typePublicado' as UIKey }, { id: 'ugc', key: 'typeUgc' as UIKey }, { id: 'profissional', key: 'typeProfissional' as UIKey },
]

/** "Todos os projetos": barra lateral por área (um projeto aparece em várias áreas sem existir duas vezes) + filtro por tipo. */
export function FinderApp({ onOpen, initialArea }: { onOpen?: (id: string) => void; initialArea?: string }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const [area, setArea] = useState(initialArea && AREAS.some((a) => a.id === initialArea) ? initialArea : 'all')
  const [type, setType] = useState('all')
  const list = content.projects.filter((p) => (area === 'all' || p.areas.includes(area as never)) && (type === 'all' || p.type === type))
  const go = (id: string) => (onOpen ? onOpen(id) : open('case', id))

  return (
    <div className="finder">
      <aside className="finder__side">
        <div className="eyebrow finder__h">{ui('projects', lang)}</div>
        {AREAS.map((a) => (
          <button key={a.id} className={`finder__nav ${area === a.id ? 'on' : ''}`} onClick={() => setArea(a.id)}>
            <Icon.folder width={16} height={16} /> {ui(a.key, lang)}
            <span className="finder__count">{a.id === 'all' ? content.projects.length : content.projects.filter((p) => p.areas.includes(a.id as never)).length}</span>
          </button>
        ))}
        <div className="eyebrow finder__h">{ui('filterType', lang)}</div>
        <div className="finder__types">
          {TYPES.map((x) => (
            <button key={x.id} className={`finder__type ${type === x.id ? 'on' : ''} ${x.id !== 'all' ? 'tag tag--' + x.id : 'tag'}`} onClick={() => setType(x.id)}>{ui(x.key, lang)}</button>
          ))}
        </div>
      </aside>
      <div className="finder__grid">
        {list.map((p) => (
          <button key={p.id} className="fcard" onClick={() => go(p.id)}>
            <Media media={p.cover} className="fcard__cover" small />
            <div className="fcard__body">
              <div className="fcard__client">{p.client}</div>
              <div className="fcard__title">{t(p.title, lang)}</div>
              <div className="fcard__foot"><span className={`tag tag--${p.type}`}>{ui(p.type === 'publicado' ? 'typePublicado' : p.type === 'ugc' ? 'typeUgc' : 'typeProfissional', lang)}</span><span className="muted">{tbc(p.period, lang)}</span></div>
            </div>
            {(p.headline ?? p.metrics[0]) && !p.confidential && <div className="fcard__num num">{tbc((p.headline ?? p.metrics[0]).value, lang)}</div>}
          </button>
        ))}
        {list.length === 0 && <p className="muted">—</p>}
      </div>
    </div>
  )
}
