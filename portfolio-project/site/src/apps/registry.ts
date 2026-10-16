import type { AppId } from '../store/os'
import type { UIKey } from '../lib/i18n'

/** Nome (chave de i18n) de cada app. Uma fonte só para dock, menu "Ir para…", tela inicial e busca. */
export const APP_LABEL: Record<AppId, UIKey> = {
  browser: 'browser', miles: 'miles', passport: 'passport', departures: 'departures', about: 'about', mediakit: 'mediaKit', contact: 'contact',
  trash: 'trash', finder: 'allProjects', case: 'projects', notes: 'notes', messages: 'messages', photos: 'photos', maps: 'maps', music: 'music',
  calendar: 'calendar', ticket: 'ticket',
}

/** Apps que aparecem no dock do desktop (a Lixeira fica à parte). */
export const DOCK: AppId[] = ['browser', 'notes', 'messages', 'photos', 'maps', 'music', 'departures', 'about', 'mediakit', 'contact']

/** Apps listados em "Ir para…" e na busca. */
export const ALL_APPS: AppId[] = ['finder', 'browser', 'notes', 'messages', 'photos', 'maps', 'music', 'miles', 'passport', 'departures', 'about', 'mediakit', 'contact', 'ticket', 'trash']
