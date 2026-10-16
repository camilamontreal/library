import { useRef, useState } from 'react'
import { content, placeById } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t } from '../lib/i18n'
import { Icon } from '../ui/icons'

const BASE = `${import.meta.env.BASE_URL}media/`

/** Música: playlist de viagem, uma faixa por destino. Toca aqui se houver arquivo de áudio; senão abre o link (Spotify etc.). Nunca simula reprodução. */
export function MusicApp() {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const m = content.music
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState<number | null>(null)

  const toggle = (i: number, src: string) => {
    const a = audio.current; if (!a) return
    if (playing === i) { a.pause(); setPlaying(null); return }
    a.src = BASE + src; a.play().then(() => setPlaying(i)).catch(() => setPlaying(null))
  }

  return (
    <div className="music">
      <audio ref={audio} onEnded={() => setPlaying(null)} />
      <header className="music__head">
        <div className="music__art" aria-hidden="true"><Icon.music width={46} height={46} /></div>
        <div>
          <div className="eyebrow">{ui('playlist', lang)} {m.exemplo && <span className="exemplo-badge" style={{ position: 'static' }}>{ui('exemplo', lang)}</span>}</div>
          <h2 className="music__title">{t(m.title, lang)}</h2>
          <p className="muted">{content.profile.name} · {m.tracks.length}</p>
          {m.playlistUrl && <a className="btn" href={m.playlistUrl} target="_blank" rel="noreferrer">{ui('openPlaylist', lang)}</a>}
        </div>
      </header>
      <ol className="music__list">
        {m.tracks.map((tr, i) => {
          const pl = tr.placeId ? placeById(tr.placeId) : undefined
          return (
            <li key={i} className={`music__row ${playing === i ? 'on' : ''}`}>
              <span className="music__n num">{i + 1}</span>
              <div className="music__main"><b>{tr.title}</b><span className="muted">{tr.artist}</span></div>
              {pl && <button className="music__place" onClick={() => open('maps', pl.id)}>{t(pl.name, lang)}</button>}
              {tr.audio ? <button className="music__play" onClick={() => toggle(i, tr.audio!)} aria-label={playing === i ? 'Pause' : 'Play'}>{playing === i ? '❚❚' : '▶'}</button>
                : tr.url ? <a className="music__play music__play--link" href={tr.url} target="_blank" rel="noreferrer">{ui('listen', lang)}</a> : <span className="music__play music__play--off" />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
