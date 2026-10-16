/**
 * SCHEMA DO CONTEÚDO
 * ------------------
 * Tudo que aparece no site vem de arquivos JSON em /src/content.
 * Este arquivo define o formato (com Zod) e valida na hora do build e dos testes.
 * Regra: nenhum nome, número ou link fica "chumbado" em componentes.
 *
 * Campos `exemplo: true` marcam conteúdo demonstrativo que precisa ser trocado.
 * `npm run check-content` lista tudo que ainda é exemplo.
 */
import { z } from 'zod'

/** Texto em três idiomas. Se faltar um idioma, o site cai para o inglês. */
export const I18n = z.object({ en: z.string(), pt: z.string().optional(), fr: z.string().optional() })
export type I18nText = z.infer<typeof I18n>

/** Mídia: caminho em /public/media. Se o arquivo não existir, o site mostra um placeholder "FOTO". */
export const Media = z.object({
  src: z.string().describe('caminho relativo a /public/media, ex.: projects/goalcast/cover.jpg'),
  kind: z.enum(['image', 'video']).default('image'),
  poster: z.string().optional().describe('para vídeo: imagem de capa'),
  alt: I18n.optional(),
  credit: z.string().optional().describe('crédito quando a imagem não é da Cami'),
  tone: z.string().optional().describe('cor dominante (hex) usada no placeholder e no fundo enquanto carrega'),
  exemplo: z.boolean().default(false),
})
export type MediaT = z.infer<typeof Media>

/** Métrica com proveniência obrigatória. Sem fonte, não entra. */
export const Metric = z.object({
  value: z.string().describe('como aparece: "146M", "+200%", "63,3%"'),
  label: I18n,
  source: z.string().describe('de onde veio: "TikTok Analytics", "Meta Insights", "Mídia kit 2026"'),
  period: z.string().optional().describe('"60 dias", "abr–jun/2026"'),
  comparison: I18n.optional().describe('contexto: "3,4× a média da conta"'),
  exemplo: z.boolean().default(false),
})
export type MetricT = z.infer<typeof Metric>

export const ProjectType = z.enum(['publicado', 'ugc', 'profissional'])
export const Area = z.enum(['conteudo', 'ugc', 'social-media', 'parcerias', 'estrategia', 'empreendedora'])
export const Template = z.enum(['campanha', 'estrategia', 'ugc'])

export const Project = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: I18n,
  folderName: I18n.optional().describe('nome curto da pasta na mesa; se faltar, usa o cliente'),
  client: z.string(),
  type: ProjectType.describe('publicado = nas redes da Cami; ugc = entregue ao cliente; profissional = para empresa'),
  areas: z.array(Area).min(1),
  template: Template.default('campanha'),
  period: z.string().describe('"2022–2023", "jun/2024"'),
  role: I18n,
  challenge: I18n.describe('uma frase'),
  actions: z.array(I18n).min(1).max(6),
  cover: Media,
  gallery: z.array(Media).default([]),
  metrics: z.array(Metric).default([]),
  headline: Metric.optional().describe('a métrica do canhoto do cartão de embarque'),
  route: z.object({ from: I18n, to: I18n }).optional().describe('origem → destino do cartão de embarque'),
  testimonial: z.object({ quote: I18n, author: z.string(), role: z.string().optional() }).optional(),
  links: z.array(z.object({ label: I18n, url: z.string().url() })).default([]),
  tools: z.array(z.string()).default([]),
  featured: z.number().int().min(0).max(99).default(0).describe('0 = não fica na mesa; maior = mais à frente'),
  audience: z.enum(['marca', 'recrutador', 'ambos']).default('ambos'),
  confidential: z.boolean().default(false).describe('true = esconde valores e mostra só o case qualitativo'),
  exemplo: z.boolean().default(false),
})
export type ProjectT = z.infer<typeof Project>

export const Network = z.object({
  id: z.enum(['instagram', 'tiktok', 'youtube', 'linkedin', 'site']),
  handle: z.string(),
  url: z.string().url(),
  displayName: z.string(),
  bio: I18n.optional(),
  avatar: Media.optional(),
  stats: z.array(Metric).default([]),
  updatedAt: z.string().describe('data da coleta, ex.: "2026-06-30"'),
  posts: z.array(z.object({
    media: Media,
    caption: I18n.optional(),
    metrics: z.array(Metric).default([]),
    url: z.string().url().optional(),
  })).default([]),
  exemplo: z.boolean().default(false),
})
export type NetworkT = z.infer<typeof Network>

export const Experience = z.object({
  company: z.string(),
  role: I18n,
  start: z.string().describe('"2022-09"'),
  end: z.string().optional().describe('vazio = atual'),
  location: z.string().optional(),
  highlights: z.array(I18n).max(4).default([]),
  projectIds: z.array(z.string()).default([]),
  exemplo: z.boolean().default(false),
})

export const Education = z.object({
  institution: z.string(),
  title: I18n,
  year: z.string(),
  url: z.string().url().optional(),
  kind: z.enum(['formacao', 'certificacao']),
  image: Media.optional(),
  exemplo: z.boolean().default(false),
})

export const Brand = z.object({
  name: z.string(),
  logo: Media.optional(),
  kind: z.enum(['parceria', 'evento', 'ugc', 'gestao']),
  projectId: z.string().optional(),
  year: z.string().optional(),
})

export const Profile = z.object({
  name: z.string(),
  brandName: z.string().describe('"Camila Montreal"'),
  handle: z.string(),
  positioning: I18n.describe('uma linha'),
  tagline: I18n,
  bio: I18n,
  location: z.string(),
  languages: z.array(z.string()),
  email: z.string().email(),
  whatsapp: z.string().optional().describe('deixe vazio para não expor'),
  avatar: Media,
  wallpapers: z.object({ morning: Media, afternoon: Media, evening: Media, night: Media }),
  lockscreen: Media,
  heroStats: z.array(Metric).length(4).describe('widget Milhas'),
  countries: z.number().int(),
  since: z.number().int().describe('ano em que começou'),
  tools: z.array(z.string()),
  trash: z.array(I18n).default([]).describe('"ideias que não deram certo", para a Lixeira'),
  mediaKitPdf: z.string().optional().describe('caminho em /public, ex.: mediakit.pdf'),
  exemplo: z.boolean().default(false),
})

/** Lugar no mapa de rotas (Mapas). `lat`/`lon` em graus decimais. */
export const Place = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: I18n,
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  kind: z.enum(['home', 'trip']).default('trip'),
  year: z.string().optional(),
  note: I18n.optional().describe('uma frase que aparece ao tocar no pino'),
  albumId: z.string().optional().describe('álbum do app Fotos'),
  projectIds: z.array(z.string()).default([]),
  exemplo: z.boolean().default(false),
})

/** Álbum do app Fotos. Se `cover` faltar, usa a primeira foto. */
export const Album = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: I18n,
  year: z.string().optional(),
  cover: Media.optional(),
  photos: z.array(Media).min(1),
  exemplo: z.boolean().default(false),
})

export const Track = z.object({
  title: z.string(),
  artist: z.string(),
  placeId: z.string().optional().describe('destino a que a música pertence (id de places.json)'),
  url: z.string().url().optional().describe('link para ouvir (Spotify, YouTube Music…)'),
  audio: z.string().optional().describe('arquivo em /public/media/music para tocar aqui (opcional)'),
})
export const Music = z.object({
  title: I18n,
  playlistUrl: z.string().url().optional(),
  tracks: z.array(Track),
  exemplo: z.boolean().default(false),
})

export const CalEvent = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  title: I18n,
  kind: z.enum(['trip', 'busy', 'open']),
  placeId: z.string().optional(),
})
export const CalendarData = z.object({
  bookingUrl: z.string().url().optional().describe('Calendly, Google Agenda… vazio = botão manda e-mail'),
  statusNote: I18n.describe('linha de disponibilidade no topo'),
  events: z.array(CalEvent).default([]),
  exemplo: z.boolean().default(false),
})

export const Topic = z.object({
  id: z.string(),
  q: I18n.describe('o que o visitante "diz" (botão)'),
  a: z.array(I18n).min(1).describe('balões de resposta, em sequência'),
  actions: z.array(z.object({
    label: I18n,
    app: z.string().optional().describe('abre um app do site (ex.: mediakit, departures, maps, notes, calendar)'),
    payload: z.string().optional(),
    email: z.boolean().optional().describe('true = abre o e-mail do perfil'),
    url: z.string().url().optional(),
  })).default([]),
})
export const Messages = z.object({ intro: I18n, topics: z.array(Topic).min(1), exemplo: z.boolean().default(false) })

export const Guestbook = z.object({
  welcomeTitle: I18n,
  welcomeBody: I18n,
  exemplo: z.boolean().default(false),
})

export const Content = z.object({
  profile: Profile,
  networks: z.array(Network),
  projects: z.array(Project),
  experience: z.array(Experience),
  education: z.array(Education),
  brands: z.array(Brand),
  places: z.array(Place),
  albums: z.array(Album),
  music: Music,
  calendar: CalendarData,
  messages: Messages,
  guestbook: Guestbook,
})
export type ContentT = z.infer<typeof Content>
