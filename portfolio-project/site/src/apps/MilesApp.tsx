import { content } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t } from '../lib/i18n'
import { MetricBlock } from '../ui/MetricBlock'
import { AppIcon } from '../ui/icons'

/** "Milhas": o painel de resultados. Agregado → por rede → melhores momentos (cases com número-manchete). */
export function MilesApp({ onOpen }: { onOpen?: (id: string) => void }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const p = content.profile
  const best = content.projects.filter((x) => (x.headline ?? x.metrics[0]) && !x.confidential && !x.exemplo).slice(0, 6)
  const go = (id: string) => (onOpen ? onOpen(id) : open('case', id))
  return (
    <div className="app miles">
      <section>
        <h2 className="app__h">{ui('miles', lang)} <small className="muted">{p.heroStats[1].period}</small></h2>
        <MetricBlock metrics={p.heroStats} size="lg" />
      </section>
      <section>
        <h2 className="app__h">{ui('byNetwork', lang)}</h2>
        <div className="miles__nets">
          {content.networks.filter((n) => n.id !== 'site').map((n) => (
            <div key={n.id} className="miles__net">
              <div className="miles__netHead"><AppIcon id={n.id} size={28} /><b>{n.displayName}</b><span className="muted">{n.handle}</span></div>
              <MetricBlock metrics={n.stats} size="sm" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="app__h">{ui('bestMoments', lang)}</h2>
        <div className="miles__best">
          {best.map((x) => {
            const m = x.headline ?? x.metrics[0]
            return (
              <button key={x.id} className="miles__card" onClick={() => go(x.id)}>
                <div className="num miles__big">{m.value}</div>
                <div className="miles__lab">{t(m.label, lang)}</div>
                <div className="miles__client">{x.client} <span className={`tag tag--${x.type}`}>{ui(x.type === 'publicado' ? 'typePublicado' : x.type === 'ugc' ? 'typeUgc' : 'typeProfissional', lang)}</span></div>
                <div className="metric__src">{m.source}{m.period ? ` · ${m.period}` : ''}</div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
