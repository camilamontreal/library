import { content } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t, tbc } from '../lib/i18n'
import { Media } from '../ui/Media'
import { MetricBlock } from '../ui/MetricBlock'
import { AppIcon } from '../ui/icons'

const BASE = import.meta.env.BASE_URL

/** "Sobre": cartão de contato + bio + idiomas + ferramentas (clicáveis: filtram os projetos onde foram usadas). */
export function AboutApp({ onOpen }: { onOpen?: (id: string) => void }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const p = content.profile
  const go = (id: string) => (onOpen ? onOpen(id) : open('case', id))
  const toolProjects = (tool: string) => content.projects.filter((x) => x.tools.includes(tool))
  return (
    <div className="app about">
      <header className="about__head">
        <Media media={p.avatar} className="about__avatar" small />
        <div>
          <h2 className="about__name">{p.name}</h2>
          <div className="muted">{p.brandName} · {p.handle} · {p.location}</div>
          <p className="about__pos">{t(p.positioning, lang)}</p>
        </div>
      </header>
      <p className="about__bio">{t(p.bio, lang)}</p>
      <div className="about__row">
        <div><div className="eyebrow">{ui('languages', lang)}</div><p>{p.languages.join(' · ')}</p></div>
        <div><div className="eyebrow">{t({ en: 'Countries', pt: 'Países', fr: 'Pays' }, lang)}</div><p className="num" style={{ fontSize: 28 }}>{p.countries}</p></div>
        <div><div className="eyebrow">{t({ en: 'Since', pt: 'Desde', fr: 'Depuis' }, lang)}</div><p className="num" style={{ fontSize: 28 }}>{p.since}</p></div>
      </div>
      <div className="eyebrow">{ui('tools', lang)}</div>
      <div className="about__tools">
        {p.tools.map((tool) => {
          const used = toolProjects(tool)
          return <button key={tool} className="about__tool" disabled={!used.length} onClick={() => used[0] && go(used[0].id)} title={used.map((x) => x.client).join(', ')}>{tool}{used.length ? <small> {used.length}</small> : null}</button>
        })}
      </div>
    </div>
  )
}

/** "Mídia kit": resumo para marcas + download do PDF (se existir em /public). */
export function MediaKitApp() {
  const lang = useLang((s) => s.lang)
  const p = content.profile
  return (
    <div className="app mediakit">
      <h2 className="app__h">{ui('mediaKit', lang)} <small className="muted">2026</small></h2>
      <p className="about__pos">{t(p.tagline, lang)}</p>
      <MetricBlock metrics={p.heroStats} />
      <div className="mediakit__nets">
        {content.networks.filter((n) => n.stats.length && n.id !== 'site').map((n) => (
          <div key={n.id} className="mediakit__net"><AppIcon id={n.id} size={24} /><b>{tbc(n.stats[0].value, lang)}</b><span className="muted">{t(n.stats[0].label, lang)}</span></div>
        ))}
      </div>
      <div className="eyebrow">{t({ en: 'Formats', pt: 'Formatos', fr: 'Formats' }, lang)}</div>
      <p>Instagram Stories · Reels · TikTok · YouTube · {t({ en: 'event coverage · hosting · UGC · campaigns', pt: 'cobertura de eventos · apresentação · UGC · campanhas', fr: 'couverture d’événements · animation · UGC · campagnes' }, lang)}</p>
      {p.mediaKitPdf ? <a className="btn" href={BASE + p.mediaKitPdf} download>{ui('download', lang)}</a> : <span className="btn btn--ghost" aria-disabled="true">{ui('pdfSoon', lang)}</span>}
    </div>
  )
}

/** "Contato": mailto com assunto pronto; WhatsApp só se preenchido no JSON. */
export function ContactApp() {
  const lang = useLang((s) => s.lang)
  const p = content.profile
  const subject = encodeURIComponent(t({ en: 'Partnership with Camila Montreal', pt: 'Parceria com Camila Montreal', fr: 'Partenariat avec Camila Montreal' }, lang))
  return (
    <div className="app contact">
      <h2 className="app__h">{ui('contact', lang)}</h2>
      <p className="about__pos">{t({ en: 'Partnerships, press trips, brand campaigns, speaking.', pt: 'Parcerias, press trips, campanhas com marcas, palestras.', fr: 'Partenariats, voyages de presse, campagnes, conférences.' }, lang)}</p>
      <a className="btn" href={`mailto:${p.email}?subject=${subject}`}>{ui('sendEmail', lang)} · {p.email}</a>
      {p.whatsapp && <a className="btn btn--ghost" href={p.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>}
      <p className="muted">{ui('responseTime', lang)}</p>
      <div className="contact__nets">
        {content.networks.map((n) => <a key={n.id} href={n.url} target="_blank" rel="noreferrer" className="contact__net"><AppIcon id={n.id} size={34} /><span>{n.handle}</span></a>)}
      </div>
    </div>
  )
}

/** "Lixeira": ideias que não deram certo (autoironia aprovada). Cami escreve os itens em profile.json → trash. */
export function TrashApp() {
  const lang = useLang((s) => s.lang)
  return (
    <div className="app trash">
      <h2 className="app__h">{ui('trashTitle', lang)}</h2>
      <ul className="trash__list">{content.profile.trash.map((x, i) => <li key={i}>🗑 {t(x, lang)}</li>)}</ul>
    </div>
  )
}
