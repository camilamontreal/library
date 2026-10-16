import { create } from 'zustand'
import type { I18nText } from '../content/schema'

export type Lang = 'en' | 'pt' | 'fr'
const KEY = 'camios.lang'

function initial(): Lang {
  try {
    const saved = localStorage.getItem(KEY) as Lang | null
    if (saved && ['en', 'pt', 'fr'].includes(saved)) return saved
  } catch { /* storage pode estar bloqueado */ }
  const nav = (navigator.language || 'en').slice(0, 2)
  return nav === 'pt' || nav === 'fr' ? (nav as Lang) : 'en'
}

export const useLang = create<{ lang: Lang; setLang: (l: Lang) => void }>((set) => ({
  lang: initial(),
  setLang: (lang) => { try { localStorage.setItem(KEY, lang) } catch { /* ignore */ } set({ lang }) },
}))

/** Texto de conteúdo (vindo dos JSON). Cai para inglês quando falta tradução. */
export function t(text: I18nText | undefined, lang: Lang): string {
  if (!text) return ''
  return text[lang] ?? text.en
}

/** Valores de conteúdo escritos como "a confirmar" aparecem no idioma da interface. */
export function tbc(s: string, lang: Lang): string {
  return s.replace(/a confirmar/i, UI.tbc[lang])
}

/** Strings da interface. Adicione aqui, nunca dentro de componentes. */
export const UI = {
  projects: { en: 'Projects', pt: 'Projetos', fr: 'Projets' },
  goTo: { en: 'Go to…', pt: 'Ir para…', fr: 'Aller à…' },
  viewAs: { en: 'View as', pt: 'Ver como', fr: 'Voir comme' },
  brand: { en: 'Brand', pt: 'Marca', fr: 'Marque' },
  recruiter: { en: 'Recruiter', pt: 'Recrutador(a)', fr: 'Recruteur' },
  miles: { en: 'Analytics', pt: 'Analytics', fr: 'Analytique' },
  passport: { en: 'Passport', pt: 'Passaporte', fr: 'Passeport' },
  stamps: { en: 'stamps', pt: 'carimbos', fr: 'tampons' },
  lastBoarding: { en: 'LAST BOARDING', pt: 'ÚLTIMO EMBARQUE', fr: 'DERNIER EMBARQUEMENT' },
  open: { en: 'open', pt: 'abrir', fr: 'ouvrir' },
  allProjects: { en: 'All projects', pt: 'Todos os projetos', fr: 'Tous les projets' },
  baggage: { en: 'baggage', pt: 'bagagem', fr: 'bagages' },
  browser: { en: 'Browser', pt: 'Navegador', fr: 'Navigateur' },
  departures: { en: 'Résumé', pt: 'Currículo', fr: 'CV' },
  about: { en: 'About', pt: 'Sobre', fr: 'À propos' },
  mediaKit: { en: 'Media kit', pt: 'Mídia kit', fr: 'Kit média' },
  contact: { en: 'Contact', pt: 'Contato', fr: 'Contact' },
  trash: { en: 'Trash', pt: 'Lixeira', fr: 'Corbeille' },
  trashTitle: { en: 'Ideas that did not work', pt: 'Ideias que não deram certo', fr: "Idées qui n'ont pas marché" },
  boardingPass: { en: 'boarding pass', pt: 'cartão de embarque', fr: "carte d'embarquement" },
  result: { en: 'RESULT', pt: 'RESULTADO', fr: 'RÉSULTAT' },
  gate: { en: 'GATE', pt: 'PORTÃO', fr: 'PORTE' },
  role: { en: 'Role', pt: 'Papel', fr: 'Rôle' },
  period: { en: 'Period', pt: 'Período', fr: 'Période' },
  source: { en: 'Source', pt: 'Fonte', fr: 'Source' },
  routeFrom: { en: 'FROM', pt: 'DE', fr: 'DE' },
  routeTo: { en: 'TO', pt: 'PARA', fr: 'À' },
  challenge: { en: 'The challenge', pt: 'O desafio', fr: 'Le défi' },
  whatIDid: { en: 'What I did', pt: 'O que eu fiz', fr: "Ce que j'ai fait" },
  theContent: { en: 'The content', pt: 'O conteúdo', fr: 'Le contenu' },
  results: { en: 'Results', pt: 'Resultados', fr: 'Résultats' },
  links: { en: 'Links', pt: 'Links', fr: 'Liens' },
  nextProject: { en: 'Next project', pt: 'Próximo projeto', fr: 'Projet suivant' },
  tools: { en: 'Tools', pt: 'Ferramentas', fr: 'Outils' },
  typePublicado: { en: 'published', pt: 'publicado', fr: 'publié' },
  typeUgc: { en: 'UGC', pt: 'UGC', fr: 'UGC' },
  typeProfissional: { en: 'professional', pt: 'profissional', fr: 'professionnel' },
  typeHelpPublicado: { en: 'Campaign published on my own channels', pt: 'Campanha publicada nas minhas redes', fr: 'Campagne publiée sur mes propres canaux' },
  typeHelpUgc: { en: 'Content delivered to the client for their channels', pt: 'Conteúdo entregue ao cliente para os canais dele', fr: 'Contenu livré au client pour ses canaux' },
  typeHelpProfissional: { en: 'Work done for a company as employee or consultant', pt: 'Trabalho feito para uma empresa como funcionária ou consultora', fr: 'Travail réalisé pour une entreprise' },
  areaContent: { en: 'Content & Video', pt: 'Content & Video', fr: 'Contenu & vidéo' },
  areaUgc: { en: 'UGC', pt: 'UGC', fr: 'UGC' },
  areaEvents: { en: 'Events & Activations', pt: 'Eventos & Ativações', fr: 'Événements & activations' },
  areaSocial: { en: 'Social Media', pt: 'Social Media', fr: 'Médias sociaux' },
  areaMarketing: { en: 'Marketing & Strategy', pt: 'Marketing & Estratégia', fr: 'Marketing & stratégie' },
  areaDesign: { en: 'Design & Web', pt: 'Design & Web', fr: 'Design & Web' },
  all: { en: 'All', pt: 'Todos', fr: 'Tous' },
  openRealProfile: { en: 'Open real profile ↗', pt: 'Abrir perfil real ↗', fr: 'Ouvrir le vrai profil ↗' },
  dataFrom: { en: 'data from', pt: 'dados de', fr: 'données du' },
  followers: { en: 'followers', pt: 'seguidores', fr: 'abonnés' },
  exemplo: { en: 'EXAMPLE', pt: 'EXEMPLO', fr: 'EXEMPLE' },
  notes: { en: 'Notes', pt: 'Notas', fr: 'Notes' },
  messages: { en: 'Messages', pt: 'Mensagens', fr: 'Messages' },
  photos: { en: 'Photos', pt: 'Fotos', fr: 'Photos' },
  maps: { en: 'Maps', pt: 'Mapas', fr: 'Cartes' },
  music: { en: 'Music', pt: 'Música', fr: 'Musique' },
  calendar: { en: 'Calendar', pt: 'Calendário', fr: 'Calendrier' },
  ticket: { en: 'Boarding pass', pt: 'Cartão de embarque', fr: "Carte d'embarquement" },
  search: { en: 'Search', pt: 'Buscar', fr: 'Rechercher' },
  searchHint: { en: 'Search projects, brands, places, apps…', pt: 'Buscar projetos, marcas, lugares, apps…', fr: 'Rechercher projets, marques, lieux, apps…' },
  noResults: { en: 'No results', pt: 'Nada encontrado', fr: 'Aucun résultat' },
  groupApps: { en: 'Apps', pt: 'Apps', fr: 'Apps' },
  groupProjects: { en: 'Projects', pt: 'Projetos', fr: 'Projets' },
  groupPlaces: { en: 'Places', pt: 'Lugares', fr: 'Lieux' },
  groupBrands: { en: 'Brands', pt: 'Marcas', fr: 'Marques' },
  groupTools: { en: 'Tools', pt: 'Ferramentas', fr: 'Outils' },
  newNote: { en: 'New note', pt: 'Nova nota', fr: 'Nouvelle note' },
  yourName: { en: 'Your name', pt: 'Seu nome', fr: 'Ton nom' },
  yourNote: { en: 'Write your note…', pt: 'Escreva seu recado…', fr: 'Écris ton mot…' },
  postNote: { en: 'Post note', pt: 'Publicar recado', fr: 'Publier le mot' },
  posting: { en: 'Posting…', pt: 'Publicando…', fr: 'Publication…' },
  notePosted: { en: 'Thank you! Your note is up.', pt: 'Obrigada! Seu recado está no ar.', fr: 'Merci ! Ton mot est publié.' },
  noteWait: { en: 'Easy there: one note per minute.', pt: 'Calma: um recado por minuto.', fr: 'Doucement : un mot par minute.' },
  noteLinks: { en: 'Links are not allowed in notes.', pt: 'Links não são permitidos nos recados.', fr: 'Les liens ne sont pas permis.' },
  noteShort: { en: 'Write a name and a short message.', pt: 'Escreva um nome e uma mensagem curta.', fr: 'Écris un nom et un court message.' },
  noteError: { en: 'Could not post. Please try again.', pt: 'Não deu para publicar. Tente de novo.', fr: "Publication impossible. Réessaie." },
  noteDemo: { en: 'Preview mode: notes stay on this device only.', pt: 'Modo prévia: os recados ficam só neste aparelho.', fr: "Mode aperçu : les mots restent sur cet appareil." },
  pinned: { en: 'Pinned', pt: 'Fixada', fr: 'Épinglée' },
  noteLoading: { en: 'Loading notes…', pt: 'Carregando recados…', fr: 'Chargement…' },
  getPass: { en: 'Get your boarding pass', pt: 'Pegue seu cartão de embarque', fr: "Reçois ta carte d'embarquement" },
  chooseQuestion: { en: 'Pick a question', pt: 'Escolha uma pergunta', fr: 'Choisis une question' },
  today: { en: 'Today', pt: 'Hoje', fr: "Aujourd'hui" },
  delivered: { en: 'Delivered', pt: 'Entregue', fr: 'Distribué' },
  albums: { en: 'Albums', pt: 'Álbuns', fr: 'Albums' },
  photoCount: { en: 'photos', pt: 'fotos', fr: 'photos' },
  showProjects: { en: 'Projects here', pt: 'Projetos aqui', fr: 'Projets ici' },
  openAlbum: { en: 'Open album', pt: 'Abrir álbum', fr: "Ouvrir l'album" },
  flightsFrom: { en: 'Flights from Montréal', pt: 'Voos a partir de Montreal', fr: 'Vols depuis Montréal' },
  playlist: { en: 'Playlist', pt: 'Playlist', fr: 'Playlist' },
  openPlaylist: { en: 'Open playlist ↗', pt: 'Abrir playlist ↗', fr: 'Ouvrir la playlist ↗' },
  listen: { en: 'Listen ↗', pt: 'Ouvir ↗', fr: 'Écouter ↗' },
  bookChat: { en: 'Book a chat', pt: 'Agendar conversa', fr: 'Réserver un échange' },
  evTrip: { en: 'Trip', pt: 'Viagem', fr: 'Voyage' },
  evBusy: { en: 'Booked', pt: 'Agenda fechada', fr: 'Réservé' },
  evOpen: { en: 'Open', pt: 'Disponível', fr: 'Disponible' },
  upcoming: { en: 'Coming up', pt: 'Próximos', fr: 'À venir' },
  passengerName: { en: 'Passenger name', pt: 'Nome do passageiro', fr: 'Nom du passager' },
  makePass: { en: 'Create pass', pt: 'Criar cartão', fr: 'Créer la carte' },
  savePass: { en: 'Save image', pt: 'Salvar imagem', fr: "Enregistrer l'image" },
  sharePass: { en: 'Share', pt: 'Compartilhar', fr: 'Partager' },
  aboutThis: { en: 'About Camila Montreal', pt: 'Sobre a Camila Montreal', fr: 'À propos de Camila Montreal' },
  moreInfo: { en: 'More info…', pt: 'Mais informações…', fr: "Plus d'infos…" },
  yourTime: { en: 'Your time', pt: 'Sua hora', fr: 'Ton heure' },
  controlCenter: { en: 'Control Center', pt: 'Central de Controle', fr: 'Centre de contrôle' },
  language: { en: 'Language', pt: 'Idioma', fr: 'Langue' },
  tbc: { en: 'TBC', pt: 'a confirmar', fr: 'à confirmer' },
  photo: { en: 'PHOTO', pt: 'FOTO', fr: 'PHOTO' },
  now: { en: 'NOW', pt: 'AGORA', fr: 'MAINTENANT' },
  newMessage: { en: 'New message', pt: 'Nova mensagem', fr: 'Nouveau message' },
  toastBody: { en: 'loved the inaugural flight coverage! 🛫', pt: 'adorei a cobertura do voo inaugural! 🛫', fr: "j'ai adoré la couverture du vol inaugural ! 🛫" },
  tidyDesk: { en: 'Tidy up', pt: 'Arrumar mesa', fr: 'Ranger' },
  skills: { en: 'Skills', pt: 'Competências', fr: 'Compétences' },
  experience: { en: 'Experience', pt: 'Experiência', fr: 'Expérience' },
  education: { en: 'Education & certifications', pt: 'Formação & certificações', fr: 'Formation & certifications' },
  present: { en: 'present', pt: 'atual', fr: "aujourd'hui" },
  brandsWorkedWith: { en: 'Brands I worked with', pt: 'Marcas com quem trabalhei', fr: "Marques avec lesquelles j'ai travaillé" },
  byNetwork: { en: 'By network', pt: 'Por rede', fr: 'Par réseau' },
  bestMoments: { en: 'Best moments', pt: 'Melhores momentos', fr: 'Meilleurs moments' },
  languages: { en: 'Languages', pt: 'Idiomas', fr: 'Langues' },
  sendEmail: { en: 'Send e-mail', pt: 'Enviar e-mail', fr: 'Envoyer un courriel' },
  responseTime: { en: 'I reply within 48 hours.', pt: 'Respondo em até 48 horas.', fr: 'Je réponds sous 48 heures.' },
  download: { en: 'Download PDF', pt: 'Baixar PDF', fr: 'Télécharger le PDF' },
  pdfSoon: { en: 'PDF not uploaded yet', pt: 'PDF ainda não enviado', fr: 'PDF pas encore téléversé' },
  unlock: { en: 'Tap to open', pt: 'Toque para abrir', fr: 'Touchez pour ouvrir' },
  home: { en: 'Home', pt: 'Início', fr: 'Accueil' },
  close: { en: 'Close', pt: 'Fechar', fr: 'Fermer' },
  back: { en: 'Back', pt: 'Voltar', fr: 'Retour' },
  skipIntro: { en: 'Skip', pt: 'Pular', fr: 'Passer' },
  filterType: { en: 'Type', pt: 'Tipo', fr: 'Type' },
  confidential: { en: 'Confidential client: figures withheld.', pt: 'Cliente confidencial: números não divulgados.', fr: 'Client confidentiel : chiffres non divulgués.' },
} as const satisfies Record<string, I18nText>

export type UIKey = keyof typeof UI
export const ui = (key: UIKey, lang: Lang) => t(UI[key], lang)
