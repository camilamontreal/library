import type { MetricT } from '../content/schema'
import { useLang, ui, t, tbc } from '../lib/i18n'

/** Bloco de métricas reutilizado em cases, redes e no app Milhas. Toda métrica mostra fonte e período. */
export function MetricBlock({ metrics, size = 'md', confidential = false }: { metrics: MetricT[]; size?: 'sm' | 'md' | 'lg'; confidential?: boolean }) {
  const lang = useLang((s) => s.lang)
  if (confidential) return <p className="muted metric__conf">{ui('confidential', lang)}</p>
  if (!metrics.length) return null
  return (
    <div className={`metrics metrics--${size}`}>
      {metrics.map((m, i) => (
        <div key={i} className={`metric ${m.exemplo ? 'metric--exemplo' : ''}`}>
          <div className="num metric__value">{tbc(m.value, lang)}</div>
          <div className="metric__label">{t(m.label, lang)}</div>
          {m.comparison && <div className="metric__cmp">{t(m.comparison, lang)}</div>}
          <div className="metric__src">{m.source}{m.period ? ` · ${m.period}` : ''}</div>
          {m.exemplo && <span className="exemplo-badge">{ui('exemplo', lang)}</span>}
        </div>
      ))}
    </div>
  )
}
