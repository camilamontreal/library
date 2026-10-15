import { useState } from 'react'
import type { MediaT } from '../content/schema'
import { useLang, ui, t } from '../lib/i18n'

const BASE = `${import.meta.env.BASE_URL}media/`

/**
 * Renderiza uma imagem ou vídeo de /public/media. Se o arquivo não existir (ou ainda for exemplo),
 * mostra um placeholder com a cor dominante e a etiqueta "FOTO".
 */
export function Media({ media, className = '', small = false, label, autoPlay = true, style }:
  { media: MediaT; className?: string; small?: boolean; label?: string; autoPlay?: boolean; style?: React.CSSProperties }) {
  const lang = useLang((s) => s.lang)
  const [failed, setFailed] = useState(false)
  const showFile = !failed
  const text = label ?? `${ui('photo', lang)}${media.alt ? ' · ' + t(media.alt, lang) : ''}`
  return (
    <div className={`media ${small ? 'media--small' : ''} ${className}`} style={{ ...style, ['--tone' as string]: media.tone ?? '#7A6A5E' }} role="img" aria-label={t(media.alt, lang) || text}>
      {showFile && media.kind === 'video' && (
        <video src={BASE + media.src} poster={media.poster ? BASE + media.poster : undefined} muted loop playsInline autoPlay={autoPlay} onError={() => setFailed(true)} />
      )}
      {showFile && media.kind !== 'video' && (
        <img src={BASE + media.src} alt="" loading="lazy" onError={() => setFailed(true)} />
      )}
      {(failed || media.exemplo) && !small && <span className="media__label">{text}</span>}
      {media.exemplo && !small && <span className="exemplo-badge">{ui('exemplo', lang)}</span>}
    </div>
  )
}
