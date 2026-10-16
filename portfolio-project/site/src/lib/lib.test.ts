import { describe, it, expect } from 'vitest'
import { checkNote, LIMITS } from './guestbook'
import { buildIndex, search, norm } from './search'
import { passData } from './ticket'
import { fitView } from './geo'
import { content } from '../content'
import { ALL_APPS, DOCK, APP_LABEL } from '../apps/registry'

describe('livro de visitas', () => {
  it('aceita um recado normal e limpa espaços', () => {
    expect(checkNote('  Ana  ', ' Amei   o site! ')).toEqual({ ok: true, name: 'Ana', message: 'Amei o site!' })
  })
  it('recusa vazio, curto demais e repetição de spam', () => {
    for (const [n, m] of [['', 'oi'], ['Ana', ''], ['Ana', 'a'], ['Ana', 'aaaaaaaaaaaaaaaa']] as const) expect(checkNote(n, m)).toEqual({ ok: false, reason: 'short' })
  })
  it('recusa links em qualquer forma', () => {
    for (const m of ['veja https://x.com', 'www.site.com', 'meu site: loja.com', 'oi spam.xyz']) expect(checkNote('Ana', m)).toEqual({ ok: false, reason: 'links' })
    expect(checkNote('visite.com', 'oi tudo bem')).toEqual({ ok: false, reason: 'links' })
  })
  it('corta nome e mensagem nos limites', () => {
    const r = checkNote('x'.repeat(100), 'ab '.repeat(200))
    expect(r.ok && r.name.length).toBe(LIMITS.name)
    expect(r.ok && r.message.length).toBeLessThanOrEqual(LIMITS.message)
  })
})

describe('busca', () => {
  const idx = buildIndex('en')
  it('ignora acento e maiúsculas', () => {
    expect(norm('Québec')).toBe('quebec')
    expect(search(idx, 'QUEBEC').some((h) => h.id === 'place:quebec-city')).toBe(true)
  })
  it('acha app em qualquer idioma', () => {
    expect(search(idx, 'mapas')[0].app).toBe('maps')
    expect(search(idx, 'mensagens')[0].app).toBe('messages')
  })
  it('acha projeto pela ferramenta e pelo cliente', () => {
    expect(search(idx, 'disney').some((h) => h.app === 'case' && h.payload === 'disney-universal-media')).toBe(true)
  })
  it('busca vazia sugere apps', () => { expect(search(idx, '').every((h) => h.group === 'apps')).toBe(true) })
  it('todos os termos precisam casar', () => { expect(search(idx, 'goalcast zzzz')).toEqual([]) })
})

describe('conteúdo dos novos apps', () => {
  it('referências existem (lugar→álbum/projeto, música→lugar, evento→lugar)', () => {
    for (const p of content.places) {
      if (p.albumId) expect(content.albums.some((a) => a.id === p.albumId), p.albumId).toBe(true)
      for (const id of p.projectIds) expect(content.projects.some((x) => x.id === id), id).toBe(true)
    }
    for (const t of content.music.tracks) if (t.placeId) expect(content.places.some((p) => p.id === t.placeId), t.placeId).toBe(true)
    for (const e of content.calendar.events) if (e.placeId) expect(content.places.some((p) => p.id === e.placeId), e.placeId).toBe(true)
  })
  it('há exatamente um lugar "home"', () => { expect(content.places.filter((p) => p.kind === 'home')).toHaveLength(1) })
  it('ações das mensagens abrem apps que existem', () => {
    for (const t of content.messages.topics) for (const a of t.actions) if (a.app) expect(ALL_APPS as string[]).toContain(a.app)
  })
  it('dock e lista de apps usam só apps com nome', () => {
    for (const id of [...DOCK, ...ALL_APPS]) expect(APP_LABEL[id]).toBeDefined()
  })
})

describe('cartão de embarque e mapa', () => {
  it('o assento do mesmo nome é sempre o mesmo', () => {
    expect(passData('Maria').seat).toBe(passData(' maria ').seat)
    expect(passData('Maria').seat).toMatch(/^\d{1,2}[A-F]$/)
  })
  it('assento, portão e voo são válidos para qualquer nome', () => {
    for (let i = 0; i < 2000; i++) { const d = passData(`pessoa ${i} ${i * 7919}`); expect(d.seat).toMatch(/^\d{1,2}[A-F]$/); expect(d.gate).toMatch(/^[A-D]\d{1,2}$/); expect(d.flight).toMatch(/^CM \d{3}$/); expect(d.bars.every((b) => b >= 1 && b <= 4)).toBe(true) }
  })
  it('o mapa encaixa todos os pontos dentro da área', () => {
    const v = fitView(content.places, false, 390, 630)
    for (const p of content.places) { const q = v.project(p.lon, p.lat); expect(q.x).toBeGreaterThanOrEqual(0); expect(q.x).toBeLessThanOrEqual(390); expect(q.y).toBeGreaterThanOrEqual(0); expect(q.y).toBeLessThanOrEqual(630) }
  })
})
