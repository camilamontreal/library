import { useState } from 'react'
import { content } from '../content'
import { useLang, ui, t } from '../lib/i18n'
import { Media } from '../ui/Media'
import { MetricBlock } from '../ui/MetricBlock'
import { AppIcon, Icon } from '../ui/icons'
import type { NetworkT } from '../content/schema'

/**
 * "Chrome" com 5 abas. Cada aba é uma réplica estática do perfil, feita com os dados em networks.json.
 * Decisão registrada: nada de embed oficial (instável/pesado). Botão "Abrir perfil real" em toda aba.
 */
const NAMES = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn', site: 'camilamontreal.com' } as const

export function BrowserApp({ initial }: { initial?: string }) {
  const lang = useLang((s) => s.lang)
  const nets = content.networks
  const [cur, setCur] = useState(initial && nets.some((n) => n.id === initial) ? initial : nets[0].id)
  const n = nets.find((x) => x.id === cur) ?? nets[0]

  return (
    <div className="browser">
      <div className="browser__tabs" role="tablist">
        {nets.map((x) => (
          <button key={x.id} role="tab" aria-selected={cur === x.id} className={`browser__tab ${cur === x.id ? 'on' : ''}`} onClick={() => setCur(x.id)}>
            <AppIcon id={x.id} size={16} /> <span>{NAMES[x.id]}</span>
          </button>
        ))}
      </div>
      <div className="browser__url">
        <span className="browser__nav"><Icon.back width={14} height={14} /></span>
        <span className="browser__addr">🔒 {n.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
        <a className="btn browser__real" href={n.url} target="_blank" rel="noreferrer">{ui('openRealProfile', lang)}</a>
      </div>
      <div className="browser__page" role="tabpanel">
        <Profile n={n} />
      </div>
    </div>
  )
}

function Profile({ n }: { n: NetworkT }) {
  const lang = useLang((s) => s.lang)
  const p = content.profile
  const isVideoFeed = n.id === 'tiktok' || n.id === 'youtube'
  return (
    <div className={`profile profile--${n.id}`}>
      <header className="profile__head">
        <Media media={p.avatar} className="profile__avatar" small />
        <div>
          <h2 className="profile__name">{n.displayName} {n.id === 'instagram' || n.id === 'tiktok' ? <span className="profile__verified" title="verified">✓</span> : null}</h2>
          <div className="muted">{n.handle}</div>
          {n.bio && <p className="profile__bio">{t(n.bio, lang)}</p>}
          <div className="profile__stats">
            {n.stats.map((s, i) => <span key={i}><b className="num">{s.value}</b> {t(s.label, lang)}</span>)}
          </div>
          <div className="profile__updated muted">{ui('dataFrom', lang)} {n.updatedAt}{n.exemplo ? ` · ${ui('exemplo', lang)}` : ''}</div>
        </div>
      </header>
      {n.posts.length > 0 ? (
        <div className={`profile__grid ${isVideoFeed ? 'profile__grid--video' : ''} ${n.id === 'youtube' || n.id === 'site' ? 'profile__grid--wide' : ''}`}>
          {n.posts.map((post, i) => (
            <a key={i} className="post" href={post.url ?? n.url} target="_blank" rel="noreferrer">
              <Media media={post.media} className="post__media" small />
              {post.media.kind === 'video' && <span className="post__play"><Icon.play width={16} height={16} /></span>}
              {post.caption && <span className="post__cap">{t(post.caption, lang)}</span>}
              {post.metrics[0] && <span className="post__metric">{post.metrics[0].value} {t(post.metrics[0].label, lang)}</span>}
            </a>
          ))}
        </div>
      ) : (
        <div className="profile__empty">
          <MetricBlock metrics={n.stats} size="sm" />
          <p className="muted">{t(p.positioning, lang)}</p>
        </div>
      )}
    </div>
  )
}
