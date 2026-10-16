import { Content, type ContentT } from './schema'
import profile from './profile.json'
import networks from './networks.json'
import projects from './projects.json'
import experience from './experience.json'
import education from './education.json'
import brands from './brands.json'
import places from './places.json'
import albums from './albums.json'
import music from './music.json'
import calendar from './calendar.json'
import messages from './messages.json'
import guestbook from './guestbook.json'

/** Valida uma vez ao carregar. Um erro aqui aponta exatamente o campo errado no JSON. */
export const content: ContentT = Content.parse({ profile, networks, projects, experience, education, brands, places, albums, music, calendar, messages, guestbook })

export const placeById = (id: string) => content.places.find((p) => p.id === id)
export const albumById = (id: string) => content.albums.find((a) => a.id === id)
export const projectById = (id: string) => content.projects.find((p) => p.id === id)

/** Pastas em destaque na mesa, ordenadas pelo público escolhido. */
export function featuredProjects(audience: 'marca' | 'recrutador') {
  return content.projects
    .filter((p) => p.featured > 0)
    .sort((a, b) => {
      const boost = (p: ContentT['projects'][number]) => (p.audience === audience ? 100 : p.audience === 'ambos' ? 50 : 0)
      return boost(b) + b.featured - (boost(a) + a.featured)
    })
    .slice(0, 6)
}
