import { content, projectById } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t } from '../lib/i18n'
import { Media } from '../ui/Media'
import { MetricBlock } from '../ui/MetricBlock'
import { Icon } from '../ui/icons'

const TYPE_KEY = { publicado: 'typePublicado', ugc: 'typeUgc', profissional: 'typeProfissional' } as const
const TYPE_HELP = { publicado: 'typeHelpPublicado', ugc: 'typeHelpUgc', profissional: 'typeHelpProfissional' } as const

/**
 * O case como cartão de embarque. Ordem fixa: capa → rota → desafio → o que eu fiz → conteúdo → resultados → depoimento → links → próximo.
 * `template` muda só a seção "conteúdo": campanha (vídeos verticais), estrategia (números antes), ugc (entregáveis lado a lado).
 */
export function CaseApp({ id }: { id: string }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const p = projectById(id)
  if (!p) return <div className="app"><p>Not found</p></div>
  const idx = content.projects.findIndex((x) => x.id === id)
  const next = content.projects[(idx + 1) % content.projects.length]
  const headline = p.headline ?? p.metrics[0]

  return (
    <article className="case">
      <header className="case__cover">
        <Media media={p.cover} className="case__coverMedia" />
        <div className="case__chip"><span className={`tag tag--${p.type}`} title={ui(TYPE_HELP[p.type], lang)}>{ui(TYPE_KEY[p.type], lang)}</span> · {t(p.role, lang)} · {p.period}</div>
        <div className="case__coverText">
          <small>{p.client}</small>
          <h1>{t(p.title, lang)}</h1>
        </div>
      </header>

      <div className="case__pass">
        <div className="case__main">
          {p.route && (
            <div className="route">
              <div><div className="num route__code">{t(p.route.from, lang)}</div><div className="route__lab">{ui('routeFrom', lang)}</div></div>
              <div className="route__plane"><Icon.plane /></div>
              <div><div className="num route__code">{t(p.route.to, lang)}</div><div className="route__lab">{ui('routeTo', lang)}</div></div>
            </div>
          )}
          <section className="case__sec">
            <h2 className="eyebrow">{ui('challenge', lang)}</h2>
            <p className="case__lead">{t(p.challenge, lang)}</p>
          </section>
          <section className="case__sec">
            <h2 className="eyebrow">{ui('whatIDid', lang)}</h2>
            <ul className="case__actions">{p.actions.map((a, i) => <li key={i}>{t(a, lang)}</li>)}</ul>
          </section>
          {p.template === 'estrategia' && p.metrics.length > 0 && (
            <section className="case__sec"><h2 className="eyebrow">{ui('results', lang)}</h2><MetricBlock metrics={p.metrics} confidential={p.confidential} /></section>
          )}
          {p.gallery.length > 0 && (
            <section className="case__sec">
              <h2 className="eyebrow">{ui('theContent', lang)}</h2>
              <div className={`gallery gallery--${p.template}`}>
                {p.gallery.map((m, i) => (
                  <div key={i} className={m.kind === 'video' || p.template === 'campanha' ? 'gallery__phone' : 'gallery__item'}>
                    <Media media={m} className="gallery__media" />
                  </div>
                ))}
              </div>
            </section>
          )}
          {p.template !== 'estrategia' && p.metrics.length > 0 && (
            <section className="case__sec"><h2 className="eyebrow">{ui('results', lang)}</h2><MetricBlock metrics={p.metrics} confidential={p.confidential} /></section>
          )}
          {p.testimonial && (
            <blockquote className="case__quote">“{t(p.testimonial.quote, lang)}”<footer>— {p.testimonial.author}{p.testimonial.role ? `, ${p.testimonial.role}` : ''}</footer></blockquote>
          )}
          {(p.links.length > 0 || p.tools.length > 0) && (
            <section className="case__sec case__meta">
              {p.links.length > 0 && <div><h2 className="eyebrow">{ui('links', lang)}</h2>{p.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="case__link">{t(l.label, lang)} <Icon.external width={14} height={14} /></a>)}</div>}
              {p.tools.length > 0 && <div><h2 className="eyebrow">{ui('tools', lang)}</h2><p className="muted">{p.tools.join(' · ')}</p></div>}
            </section>
          )}
          <button className="case__next" onClick={() => open('case', next.id)}>
            <span className="eyebrow">{ui('nextProject', lang)}</span>
            <strong>{next.client}</strong> <span className="muted">{t(next.title, lang)}</span>
          </button>
        </div>

        <aside className="case__stub">
          <div>
            <div className="case__stubK">{ui('result', lang)}</div>
            {headline && !p.confidential ? (<><div className={`num case__stubBig ${headline.value.length > 6 ? 'case__stubBig--long' : ''}`}>{headline.value}</div><div className="case__stubSl">{t(headline.label, lang)}{headline.period ? <><br />{headline.period}</> : null}</div></>) : (<div className="case__stubSl">{p.client}</div>)}
          </div>
          <div className="case__stubMeta">
            <div><span className="case__stubK">{ui('role', lang)}</span>{t(p.role, lang)}</div>
            <div><span className="case__stubK">{ui('period', lang)}</span>{p.period}</div>
            {headline && <div><span className="case__stubK">{ui('source', lang)}</span>{headline.source}</div>}
          </div>
          <div>
            <div className="case__stubK">{ui('gate', lang)} · {ui(TYPE_KEY[p.type], lang).toUpperCase()}</div>
            <div className="barcode" aria-hidden="true" />
          </div>
        </aside>
      </div>
    </article>
  )
}
