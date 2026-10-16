import { describe, it, expect } from 'vitest'
import { content, featuredProjects, projectById, areasFor } from './index'

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
  it('as 6 áreas aparecem para os dois públicos (só a ordem muda) e todas têm projetos', () => {
    const a = areasFor('marca'), b = areasFor('recrutador')
    expect([...a].sort()).toEqual([...b].sort())
    expect(a).toHaveLength(6)
    for (const id of a) expect(content.projects.some((p) => p.areas.includes(id as never)), id).toBe(true)
    expect(a[0]).not.toBe(b[0])
  })
  it('nenhum projeto fica sem pasta: toda área do projeto existe na lista', () => {
    for (const p of content.projects) for (const id of p.areas) expect(areasFor('marca')).toContain(id)
  })
})
