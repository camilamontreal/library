import { describe, it, expect } from 'vitest'
import { content, featuredProjects, projectById } from './index'

describe('conteúdo', () => {
  it('valida contra o schema (se este teste falhar, o erro aponta o campo errado no JSON)', () => {
    expect(content.projects.length).toBeGreaterThan(0)
  })
  it('todo projeto tem exatamente um tipo e pelo menos uma área', () => {
    for (const p of content.projects) {
      expect(['publicado', 'ugc', 'profissional']).toContain(p.type)
      expect(p.areas.length).toBeGreaterThan(0)
    }
  })
  it('toda métrica tem fonte', () => {
    const all = [...content.profile.heroStats, ...content.projects.flatMap((p) => [...p.metrics, ...(p.headline ? [p.headline] : [])]), ...content.networks.flatMap((n) => n.stats)]
    for (const m of all) expect(m.source.length).toBeGreaterThan(0)
  })
  it('ids referenciados existem', () => {
    for (const e of content.experience) for (const id of e.projectIds) expect(projectById(id), id).toBeDefined()
    for (const b of content.brands) if (b.projectId) expect(projectById(b.projectId), b.projectId).toBeDefined()
  })
  it('destaques respeitam o público e nunca passam de 6', () => {
    const marca = featuredProjects('marca'), rec = featuredProjects('recrutador')
    expect(marca.length).toBeLessThanOrEqual(6)
    expect(rec.length).toBeLessThanOrEqual(6)
    expect(marca[0].audience === 'marca' || marca[0].audience === 'ambos').toBe(true)
    expect(rec[0].audience === 'recrutador' || rec[0].audience === 'ambos').toBe(true)
  })
})
