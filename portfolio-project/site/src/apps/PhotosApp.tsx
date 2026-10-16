import { useEffect, useState } from 'react'
import { content, albumById } from '../content'
import { useOS } from '../store/os'
import { useLang, ui, t } from '../lib/i18n'
import { Media } from '../ui/Media'
import { Icon } from '../ui/icons'

/** Fotos: álbuns por viagem. Clicar na foto abre em tela cheia (setas e Esc funcionam). */
export function PhotosApp({ initial }: { initial?: string }) {
  const lang = useLang((s) => s.lang)
  const open = useOS((s) => s.open)
  const [albumId, setAlbumId] = useState<string | null>(initial && albumById(initial) ? initial : null)
  const [shot, setShot] = useState<number | null>(null)
  const album = albumId ? albumById(albumId) : undefined
  const place = album ? content.places.find((p) => p.albumId === album.id) : undefined
  const n = album?.photos.length ?? 0

  useEffect(() => {
    if (shot === null) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); setShot(null) }
      if (e.key === 'ArrowRight') setShot((s) => (s === null ? s : (s + 1) % n))
      if (e.key === 'ArrowLeft') setShot((s) => (s === null ? s : (s - 1 + n) % n))
    }
    window.addEventListener('keydown', on, true)
    return () => window.removeEventListener('keydown', on, true)
  }, [shot, n])

  return (
    <div className="photos">
      <div className="photos__scroll">
      {!album && (
        <>
          <h2 className="app__h">{ui('albums', lang)}</h2>
          <div className="photos__albums">
            {content.albums.map((a) => (
              <button key={a.id} className="photos__album" onClick={() => setAlbumId(a.id)}>
                <Media media={a.cover ?? a.photos[0]} className="photos__cover" small />
                <b>{t(a.title, lang)}</b><span className="muted">{a.photos.length} {ui('photoCount', lang)}{a.year ? ` · ${a.year}` : ''}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {album && (
        <>
          <div className="photos__bar">
            <button className="photos__back" onClick={() => { setAlbumId(null); setShot(null) }}><Icon.back width={18} height={18} /> {ui('albums', lang)}</button>
            <h2 className="app__h">{t(album.title, lang)} <small className="muted">{album.year}</small></h2>
          </div>
          <div className="photos__grid">
            {album.photos.map((p, i) => <button key={i} className="photos__cell" onClick={() => setShot(i)} aria-label={t(p.alt, lang)}><Media media={p} small /></button>)}
          </div>
          {place && (
            <div className="photos__more">
              <button className="btn btn--ghost" onClick={() => open('maps', place.id)}><Icon.map width={16} height={16} /> {ui('maps', lang)}</button>
              {place.projectIds.map((id) => { const p = content.projects.find((x) => x.id === id); return p && <button key={id} className="btn btn--ghost" onClick={() => open('case', id)}>{p.folderName ? t(p.folderName, lang) : p.client}</button> })}
            </div>
          )}
        </>
      )}
      </div>
      {album && shot !== null && (
        <div className="photos__light" role="dialog" aria-label={t(album.photos[shot].alt, lang)} onClick={() => setShot(null)}>
          <Media media={album.photos[shot]} className="photos__big" />
          <button className="photos__x" aria-label={ui('close', lang)} onClick={() => setShot(null)}><Icon.close /></button>
          <button className="photos__nav photos__nav--l" aria-label="‹" onClick={(e) => { e.stopPropagation(); setShot((shot - 1 + n) % n) }}>‹</button>
          <button className="photos__nav photos__nav--r" aria-label="›" onClick={(e) => { e.stopPropagation(); setShot((shot + 1) % n) }}>›</button>
          <span className="photos__count">{shot + 1} / {n}</span>
        </div>
      )}
    </div>
  )
}
