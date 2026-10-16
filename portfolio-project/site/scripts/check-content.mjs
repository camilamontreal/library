// Lista tudo que ainda é conteúdo de exemplo e os arquivos de mídia que faltam em /public/media.
// Uso: npm run check-content
import { readFileSync, existsSync } from 'fs'
import path from 'path'

const read = (f) => JSON.parse(readFileSync(path.resolve('src/content', f), 'utf8'))
const profile = read('profile.json'), networks = read('networks.json'), projects = read('projects.json'), experience = read('experience.json'), education = read('education.json')
const places = read('places.json'), albums = read('albums.json'), music = read('music.json'), calendar = read('calendar.json'), messages = read('messages.json'), guestbook = read('guestbook.json')

const exemplos = [], missing = []
const media = (m, where) => { if (!m) return; if (m.exemplo) exemplos.push(`${where}: mídia ${m.src}`); for (const f of [m.src, m.poster]) if (f && !existsSync(path.resolve('public/media', f))) missing.push(`${where}: public/media/${f}`) }
const metric = (m, where) => { if (m?.exemplo) exemplos.push(`${where}: métrica "${m.value}" (${m.label.en})`) }

if (profile.exemplo) exemplos.push('profile: perfil inteiro marcado como exemplo')
media(profile.avatar, 'profile.avatar'); media(profile.lockscreen, 'profile.lockscreen')
for (const [k, v] of Object.entries(profile.wallpapers)) media(v, `profile.wallpapers.${k}`)
profile.heroStats.forEach((m, i) => metric(m, `profile.heroStats[${i}]`))
for (const n of networks) { if (n.exemplo) exemplos.push(`network ${n.id}`); media(n.avatar, `network ${n.id}.avatar`); n.stats.forEach((m, i) => metric(m, `network ${n.id}.stats[${i}]`)); n.posts.forEach((p, i) => { media(p.media, `network ${n.id}.posts[${i}]`); p.metrics.forEach((m, j) => metric(m, `network ${n.id}.posts[${i}].metrics[${j}]`)) }) }
for (const p of projects) { if (p.exemplo) exemplos.push(`project ${p.id}: inteiro`); media(p.cover, `project ${p.id}.cover`); p.gallery.forEach((m, i) => media(m, `project ${p.id}.gallery[${i}]`)); p.metrics.forEach((m, i) => metric(m, `project ${p.id}.metrics[${i}]`)); metric(p.headline, `project ${p.id}.headline`); if (p.period === 'a confirmar') exemplos.push(`project ${p.id}: período "a confirmar"`) }
experience.forEach((e, i) => { if (e.exemplo) exemplos.push(`experience[${i}] ${e.company}`) })
education.forEach((e, i) => { if (e.exemplo) exemplos.push(`education[${i}] ${e.institution}`); media(e.image, `education[${i}].image`) })

if (places.some((x) => x.exemplo)) exemplos.push('places.json: lugares marcados como exemplo')
for (const a of albums) { if (a.exemplo) exemplos.push(`album ${a.id}: marcado como exemplo`); a.photos.forEach((m, i) => media(m, `album ${a.id}.photos[${i}]`)); media(a.cover, `album ${a.id}.cover`) }
if (music.exemplo) exemplos.push('music.json: playlist de exemplo (títulos, artistas e links)')
if (!music.playlistUrl) exemplos.push('music.json: falta playlistUrl')
if (calendar.exemplo) exemplos.push('calendar.json: disponibilidade e viagens de exemplo')
if (!calendar.bookingUrl) exemplos.push('calendar.json: falta bookingUrl (sem ele o botão manda e-mail)')
if (messages.exemplo) exemplos.push('messages.json: respostas escritas como exemplo (revisar o tom)')
if (guestbook.exemplo) exemplos.push('guestbook.json: texto de boas-vindas de exemplo')

console.log(`\n== Conteúdo marcado como EXEMPLO (${exemplos.length}) ==`); exemplos.forEach((x) => console.log(' -', x))
console.log(`\n== Arquivos de mídia que faltam (${missing.length}) ==`); missing.forEach((x) => console.log(' -', x))
console.log('')
if (process.argv.includes('--strict') && (exemplos.length || missing.length)) process.exit(1)
