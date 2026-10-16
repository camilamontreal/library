import { useEffect, useMemo, useRef, useState } from 'react'
import { content, projectById } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t } from '../lib/i18n'
import { fitView, arc, gridStep } from '../lib/geo'
import { LAND } from '../lib/world'
import { Icon } from '../ui/icons'

const range = (a: number, b: number, step: number) => { const out: number[] = []; for (let v = Math.ceil(a / step) * step; v <= b; v += step) out.push(v); return out }

/** Mapas: rotas de voo a partir de Montreal até cada lugar. Silhueta estilizada, sem serviço externo; tocar no pino abre o lugar. */
export function MapsApp({ initial }: { initial?: string }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const places = content.places
  const home = places.find((p) => p.kind === 'home') ?? places[0]
  const [sel, setSel] = useState<string | null>(initial && places.some((p) => p.id === initial) ? initial : null)
  const [world, setWorld] = useState(false)
  // o mapa usa o tamanho real do espaço: textos e pinos ficam sempre em pixels legíveis (inclusive no celular)
  const stage = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 900, h: 480 })
  useEffect(() => {
    const el = stage.current; if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.max(200, Math.round(e.contentRect.width)), h: Math.max(200, Math.round(e.contentRect.height)) }))
    ro.observe(el); return () => ro.disconnect()
  }, [])
  const { w: MAP_W, h: MAP_H } = size
  const view = useMemo(() => fitView(places, world, MAP_W, MAP_H), [places, world, MAP_W, MAP_H])
  const sp = view.project
  const place = places.find((p) => p.id === sel)
  const step = gridStep(view.lonRange[1] - view.lonRange[0])
  const h = sp(home.lon, home.lat)
  const selArc = place && place.id !== home.id ? arc(h, sp(place.lon, place.lat)) : null

  return (
    <div className="maps">
      <div className="maps__stage" ref={stage}>
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="maps__svg" role="group" aria-label={ui('maps', lang)}>
          <rect width={MAP_W} height={MAP_H} className="maps__sea" />
          <g className="maps__grid">
            {range(view.lonRange[0], view.lonRange[1], step).map((lon) => <line key={`x${lon}`} x1={sp(lon, 0).x} x2={sp(lon, 0).x} y1={0} y2={MAP_H} />)}
            {range(view.latRange[0], view.latRange[1], step).map((lat) => <line key={`y${lat}`} y1={sp(0, lat).y} y2={sp(0, lat).y} x1={0} x2={MAP_W} />)}
          </g>
          <g className="maps__land">{LAND.map((poly, i) => <polygon key={i} points={poly.map(([lon, lat]) => { const p = sp(lon, lat); return `${p.x.toFixed(1)},${p.y.toFixed(1)}` }).join(' ')} />)}</g>
          <g className="maps__routes">
            {places.filter((p) => p.id !== home.id).map((p) => <path key={p.id} d={arc(h, sp(p.lon, p.lat))} className={p.id === sel ? 'on' : ''} />)}
          </g>
          {selArc && (
            <g className="maps__plane">
              <path d="M-9 0 L9 0 M0 -7 L9 0 L0 7" />
              <animateMotion dur="3.2s" repeatCount="indefinite" path={selArc} rotate="auto" />
            </g>
          )}
          {places.map((p, idx) => {
            const q = sp(p.lon, p.lat)
            // etiqueta acima do pino; abaixo quando outro pino está colado (ex.: Montréal e Québec)
            const near = places.some((o, j) => j !== idx && (p.kind === 'home' || (j < idx && o.kind !== 'home')) && Math.abs(sp(o.lon, o.lat).x - q.x) < 80 && Math.abs(sp(o.lon, o.lat).y - q.y) < 26)
            const showLabel = !world || p.id === sel || p.kind === 'home'
            return (
              <g key={p.id} className={`maps__pin ${p.id === sel ? 'on' : ''} ${p.kind === 'home' ? 'home' : ''}`} transform={`translate(${q.x} ${q.y})`} role="button" tabIndex={0}
                aria-label={t(p.name, lang)} onClick={() => setSel(p.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(p.id) } }}>
                <circle className="maps__pulse" r={12} />
                <circle className="maps__dot" r={p.kind === 'home' ? 8 : 6} />
                {showLabel && <text className="maps__label" y={near ? 24 : -14} textAnchor="middle">{t(p.name, lang)}</text>}
              </g>
            )
          })}
        </svg>
        <button className="maps__zoom" onClick={() => setWorld((w) => !w)}>{world ? '⌖' : '🌍'} {world ? t({ en: 'Zoom in', pt: 'Aproximar', fr: 'Rapprocher' }, lang) : t({ en: 'World', pt: 'Mundo', fr: 'Monde' }, lang)}</button>
        <span className="maps__title">{ui('flightsFrom', lang)}</span>
      </div>
      <div className="maps__card">
        {!place && <div className="maps__chips">{places.map((p) => <button key={p.id} className="msgs__chip" onClick={() => setSel(p.id)}>{t(p.name, lang)}</button>)}</div>}
        {place && (
          <div className="maps__info">
            <div><b>{t(place.name, lang)}</b> {place.year && <span className="muted">· {place.year}</span>}{place.note && <p className="muted">{t(place.note, lang)}</p>}</div>
            <div className="maps__btns">
              {place.albumId && <button className="btn btn--ghost" onClick={() => open('photos', place.albumId)}><Icon.photos width={16} height={16} /> {ui('openAlbum', lang)}</button>}
              {place.projectIds.map((id) => { const p = projectById(id); return p && <button key={id} className="btn btn--ghost" onClick={() => open('case', id)}>{p.folderName ? t(p.folderName, lang) : p.client}</button> })}
              <button className="btn btn--ghost" onClick={() => setSel(null)} aria-label={ui('close', lang)}><Icon.close width={16} height={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
