import { useEffect, useRef, useState } from 'react'
import { useLang, ui } from '../lib/i18n'
import { drawPass, passData } from '../lib/ticket'
import { content } from '../content'

/** Cartão de embarque do visitante: ele digita o nome, vê o cartão e salva a imagem (ou compartilha). */
export function TicketApp({ initial }: { initial?: string }) {
  const lang = useLang((s) => s.lang)
  const [name, setName] = useState(initial ?? '')
  const canvas = useRef<HTMLCanvasElement>(null)
  const label = (en: string, pt: string, fr: string) => ({ en, pt, fr })[lang]

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const d = passData(name || label('Your name', 'Seu nome', 'Ton nom'))
    drawPass(c, d, {
      passenger: label('Passenger', 'Passageiro', 'Passager'), from: label('From', 'De', 'De'), to: label('To', 'Para', 'À'),
      seat: label('Seat', 'Assento', 'Siège'), gate: label('Gate', 'Portão', 'Porte'), flight: label('Flight', 'Voo', 'Vol'), date: label('Date', 'Data', 'Date'),
      title: ui('boardingPass', lang),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, lang])

  const toBlob = () => new Promise<Blob | null>((res) => canvas.current?.toBlob(res, 'image/png'))
  const save = async () => {
    const b = await toBlob(); if (!b) return
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `boarding-pass-${(name || 'guest').toLowerCase().replace(/\W+/g, '-')}.png`; a.click(); URL.revokeObjectURL(a.href)
  }
  const share = async () => {
    const b = await toBlob(); if (!b) return
    const file = new File([b], 'boarding-pass.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: `${content.profile.brandName} ${content.profile.handle}` }).catch(() => {})
    else save()
  }

  return (
    <div className="app ticket">
      <h2 className="app__h">{ui('ticket', lang)}</h2>
      <label className="eyebrow" htmlFor="tk-name">{ui('passengerName', lang)}</label>
      <input id="tk-name" className="notes__input" value={name} maxLength={28} placeholder={ui('yourName', lang)} onChange={(e) => setName(e.target.value)} />
      <canvas ref={canvas} className="ticket__canvas" aria-label={ui('ticket', lang)} />
      <div className="ticket__btns">
        <button className="btn" onClick={save} disabled={!name.trim()}>{ui('savePass', lang)}</button>
        <button className="btn btn--ghost" onClick={share} disabled={!name.trim()}>{ui('sharePass', lang)}</button>
      </div>
    </div>
  )
}
