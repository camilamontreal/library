import { content } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t } from '../lib/i18n'
import { Media } from '../ui/Media'

const KIND_LABEL = {
  evento: { en: 'Events & press', pt: 'Eventos & imprensa', fr: 'Événements & presse' },
  parceria: { en: 'Brand campaigns', pt: 'Campanhas com marcas', fr: 'Campagnes de marques' },
  ugc: { en: 'UGC clients', pt: 'Clientes de UGC', fr: 'Clients UGC' },
  gestao: { en: 'Social media management clients', pt: 'Clientes de gestão de social media', fr: 'Clients en gestion de médias sociaux' },
}

/** "Passaporte": carimbos das marcas (clicáveis quando há case) + formação e certificações. */
export function PassportApp({ onOpen }: { onOpen?: (id: string) => void }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const go = (id: string) => (onOpen ? onOpen(id) : open('case', id))
  const kinds = ['evento', 'parceria', 'ugc', 'gestao'] as const
  return (
    <div className="app passport">
      <section>
        <h2 className="app__h">{ui('brandsWorkedWith', lang)} <small className="muted">{content.brands.length}</small></h2>
        {kinds.map((k) => (
          <div key={k} className="passport__page">
            <div className="eyebrow">{t(KIND_LABEL[k], lang)}</div>
            <div className="passport__stamps">
              {content.brands.filter((b) => b.kind === k).map((b, i) => (
                <button key={b.name} className={`pstamp ${b.projectId ? 'pstamp--link' : ''}`} style={{ ['--rot' as string]: `${((i % 5) - 2) * 1.6}deg` }} onClick={() => b.projectId && go(b.projectId)} disabled={!b.projectId}>
                  {b.logo ? <Media media={b.logo} className="pstamp__logo" small /> : <span className="pstamp__name">{b.name}</span>}
                  {b.year && <span className="pstamp__year">{b.year}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section>
        <h2 className="app__h">{ui('education', lang)}</h2>
        <div className="passport__edu">
          {content.education.map((e, i) => (
            <div key={i} className={`edu ${e.kind === 'certificacao' ? 'edu--cert' : ''}`}>
              {e.image && <Media media={e.image} className="edu__img" small />}
              <div className="edu__title">{t(e.title, lang)}</div>
              <div className="muted">{e.institution} · {e.year}</div>
              {e.url && <a href={e.url} target="_blank" rel="noreferrer" className="edu__verify">verify ↗</a>}
              {e.exemplo && <span className="exemplo-badge">{ui('exemplo', lang)}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
