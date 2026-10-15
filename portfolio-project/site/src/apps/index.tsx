import type { Win } from '../store/os'
import { type Lang, ui, t } from '../lib/i18n'
import { content, projectById } from '../content'
import { CaseApp } from './CaseApp'
import { FinderApp } from './FinderApp'
import { BrowserApp } from './BrowserApp'
import { MilesApp } from './MilesApp'
import { PassportApp } from './PassportApp'
import { DeparturesApp } from './DeparturesApp'
import { AboutApp, MediaKitApp, ContactApp, TrashApp } from './SmallApps'
import './apps.css'

/** Mapeia uma janela para o app que ela mostra. Usado no desktop (janelas) e no mobile (telas cheias). */
export function renderApp(win: Pick<Win, 'app' | 'payload'>) {
  switch (win.app) {
    case 'case': return <CaseApp id={win.payload ?? content.projects[0].id} />
    case 'finder': return <FinderApp />
    case 'browser': return <BrowserApp initial={win.payload} />
    case 'miles': return <MilesApp />
    case 'passport': return <PassportApp />
    case 'departures': return <DeparturesApp />
    case 'about': return <AboutApp />
    case 'mediakit': return <MediaKitApp />
    case 'contact': return <ContactApp />
    case 'trash': return <TrashApp />
  }
}

export function appTitle(win: Pick<Win, 'app' | 'payload'>, lang: Lang): string {
  switch (win.app) {
    case 'case': { const p = projectById(win.payload ?? ''); return p ? `${p.client} — ${ui('boardingPass', lang)}` : ui('projects', lang) }
    case 'finder': return ui('allProjects', lang)
    case 'browser': return ui('browser', lang)
    case 'miles': return ui('miles', lang)
    case 'passport': return ui('passport', lang)
    case 'departures': return ui('departures', lang)
    case 'about': return ui('about', lang)
    case 'mediakit': return ui('mediaKit', lang)
    case 'contact': return ui('contact', lang)
    case 'trash': return t({ en: 'Trash', pt: 'Lixeira', fr: 'Corbeille' }, lang)
  }
}
