import { content, projectById } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t, tbc } from '../lib/i18n'

/** "Partidas": a experiência profissional como painel de aeroporto. Linha = cargo; status = em curso/concluído; clicar lista os cases. */
export function DeparturesApp({ onOpen }: { onOpen?: (id: string) => void }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const go = (id: string) => (onOpen ? onOpen(id) : open('case', id))
  const rows = [...content.experience].sort((a, b) => b.start.localeCompare(a.start))
  const fmt = (s?: string) => (s ? s.replace('-', '/') : ui('present', lang))
  return (
    <div className="app departures">
      <h2 className="app__h">{ui('experience', lang)}</h2>
      <div className="board">
        {rows.map((e, i) => (
          <div key={i} className={`board__row ${e.end ? '' : 'board__row--live'}`}>
            <div className="board__time num">{fmt(e.start)}<span className="board__to">→ {fmt(e.end)}</span></div>
            <div className="board__main">
              <div className="board__company">{tbc(e.company, lang)} {e.exemplo && <span className="exemplo-badge" style={{ position: 'static' }}>{ui('exemplo', lang)}</span>}</div>
              <div className="board__role">{t(e.role, lang)}{e.location ? <span className="muted"> · {e.location}</span> : null}</div>
              <ul className="board__hl">{e.highlights.map((h, j) => <li key={j}>{t(h, lang)}</li>)}</ul>
              {e.projectIds.length > 0 && (
                <div className="board__links">
                  {e.projectIds.map((id) => { const p = projectById(id); return p ? <button key={id} className="btn btn--ghost" onClick={() => go(id)}>{p.client}</button> : null })}
                </div>
              )}
            </div>
            <div className={`board__status ${e.end ? '' : 'on'}`}>{e.end ? '●' : '● LIVE'}</div>
          </div>
        ))}
      </div>
      <h2 className="app__h">{ui('education', lang)}</h2>
      <div className="passport__edu">
        {content.education.map((e, i) => (
          <div key={i} className={`edu ${e.kind === 'certificacao' ? 'edu--cert' : ''}`}>
            <div className="edu__title">{t(e.title, lang)}</div>
            <div className="muted">{tbc(e.institution, lang)} · {e.year}</div>
          </div>
        ))}
      </div>
      <h2 className="app__h">{ui('skills', lang)}</h2>
      <div className="about__tools">{content.profile.tools.map((x) => <span key={x} className="about__tool">{x}</span>)}</div>
      <p className="muted">{ui('languages', lang)}: {content.profile.languages.join(' · ')}</p>
    </div>
  )
}
