import { useEffect, useMemo, useState } from 'react'
import { useOS } from '../store/os'
import { useLang, ui, type UIKey } from '../lib/i18n'
import { buildIndex, search, type Group, type Hit } from '../lib/search'
import { Icon } from '../ui/icons'
import './spotlight.css'

const GROUP_LABEL: Record<Group, UIKey> = { apps: 'groupApps', projects: 'groupProjects', places: 'groupPlaces', brands: 'groupBrands', tools: 'groupTools' }

/** Busca (⌘K / Ctrl+K): projetos, marcas, lugares, ferramentas e apps. Setas e Enter funcionam; Esc fecha. */
export function Spotlight() {
  const spotlight = useOS((s) => s.spotlight)
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); useOS.getState().setSpotlight(!useOS.getState().spotlight) }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])
  return spotlight ? <SpotlightBox /> : null
}

function SpotlightBox() {
  const lang = useLang((s) => s.lang)
  const { setSpotlight, open } = useOS()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const index = useMemo(() => buildIndex(lang), [lang])
  const hits = useMemo(() => search(index, q), [index, q])

  const go = (h: Hit) => { setSpotlight(false); open(h.app, h.payload) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSpotlight(false)
    else if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(hits.length - 1, x + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)) }
    else if (e.key === 'Enter' && hits[i]) go(hits[i])
  }
  return (
    <div className="spot" role="dialog" aria-modal="true" aria-label={ui('search', lang)} onMouseDown={(e) => { if (e.target === e.currentTarget) setSpotlight(false) }}>
      <div className="spot__box glass" onKeyDown={onKey}>
        <div className="spot__field">
          <Icon.search width={20} height={20} />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setI(0) }} placeholder={ui('searchHint', lang)} aria-label={ui('search', lang)} aria-controls="spot-list" autoComplete="off" spellCheck={false} />
          <button className="spot__esc" onClick={() => setSpotlight(false)} aria-label={ui('close', lang)}>esc</button>
        </div>
        <ul id="spot-list" className="spot__list" role="listbox">
          {hits.length === 0 && <li className="spot__none muted">{ui('noResults', lang)}</li>}
          {hits.map((h, n) => {
            const head = n === 0 || hits[n - 1].group !== h.group ? <li className="spot__head eyebrow" role="presentation">{ui(GROUP_LABEL[h.group], lang)}</li> : null
            return (
              <li key={h.id} role="presentation" className="spot__item">
                {head}
                <button role="option" aria-selected={n === i} className={n === i ? 'on' : ''} onMouseEnter={() => setI(n)} onClick={() => go(h)}>
                  <b>{h.title}</b>{h.sub && <span className="muted">{h.sub}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
