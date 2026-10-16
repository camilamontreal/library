import { content } from '../content'
import type { AppId } from '../store/os'
import { UI, ui, t, type Lang, type UIKey } from './i18n'
import { ALL_APPS, APP_LABEL } from '../apps/registry'

export type Group = 'apps' | 'projects' | 'places' | 'brands' | 'tools'
export type Hit = { id: string; group: Group; title: string; sub?: string; app: AppId; payload?: string }
type Entry = Hit & { hay: string }

/** Minúsculas e sem acento: "Québec" casa com "quebec". */
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const allLangs = (x: { en: string; pt?: string; fr?: string }) => [x.en, x.pt, x.fr].filter(Boolean).join(' ')

export function buildIndex(lang: Lang): Entry[] {
  const out: Entry[] = []
  const add = (h: Hit, extra: string) => out.push({ ...h, hay: norm(`${h.title} ${h.sub ?? ''} ${extra}`) })
  for (const app of ALL_APPS) {
    const k: UIKey = APP_LABEL[app]
    add({ id: `app:${app}`, group: 'apps', title: ui(k, lang), app }, allLangs(UI[k]) + ' ' + app)
  }
  for (const p of content.projects) {
    add({ id: `project:${p.id}`, group: 'projects', title: p.folderName ? t(p.folderName, lang) : p.client, sub: t(p.title, lang), app: 'case', payload: p.id },
      `${p.client} ${allLangs(p.title)} ${p.tools.join(' ')} ${p.areas.join(' ')} ${p.type} ${p.period}`)
  }
  for (const pl of content.places) {
    add({ id: `place:${pl.id}`, group: 'places', title: t(pl.name, lang), sub: pl.year, app: 'maps', payload: pl.id }, allLangs(pl.name))
  }
  for (const b of content.brands) {
    add({ id: `brand:${b.name}`, group: 'brands', title: b.name, app: b.projectId ? 'case' : 'passport', payload: b.projectId }, b.kind)
  }
  for (const tool of content.profile.tools) {
    const used = content.projects.find((p) => p.tools.includes(tool))
    if (used) add({ id: `tool:${tool}`, group: 'tools', title: tool, sub: used.client, app: 'case', payload: used.id }, '')
  }
  return out
}

/** Todos os termos digitados precisam aparecer; título que começa com o termo sobe na lista. */
export function search(index: Entry[], query: string, limit = 12): Hit[] {
  const terms = norm(query).split(/\s+/).filter(Boolean)
  const base = terms.length ? index.filter((e) => terms.every((w) => e.hay.includes(w))) : index.filter((e) => e.group === 'apps')
  const score = (e: Entry) => (terms.length && norm(e.title).startsWith(terms[0]) ? 0 : 1) + (e.group === 'apps' ? 0 : 0.5)
  return [...base].sort((a, b) => score(a) - score(b)).slice(0, limit).map(({ hay: _h, ...h }) => h)
}
