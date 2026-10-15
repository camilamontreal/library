# Guia de personalização

Tudo que aparece no site vem de **seis arquivos JSON** em `site/src/content/`. Você não precisa tocar em componente nenhum. Depois de editar, rode `npm test` (valida o formato) e `npm run check-content` (lista o que ainda é exemplo).

Textos têm três idiomas: `{ "en": "...", "pt": "...", "fr": "..." }`. Só `en` é obrigatório; se faltar `pt` ou `fr`, o site mostra o inglês.

| Quero trocar… | Arquivo | Campo |
| --- | --- | --- |
| Nome, @, frase de posicionamento, bio, cidade, idiomas, e-mail | `profile.json` | `name`, `handle`, `positioning`, `bio`, `location`, `languages`, `email` |
| WhatsApp (fica oculto se vazio) | `profile.json` | `whatsapp` (use o link `https://wa.me/...`) |
| Foto de perfil | `profile.json` + arquivo | `avatar.src` → `public/media/profile/avatar.jpg` (quadrada, ≥ 1200 px) |
| Papéis de parede (manhã/tarde/noite/madrugada) | `profile.json` + arquivos | `wallpapers.*.src` → `public/media/wallpapers/*.jpg` (horizontal, ≥ 2400 px; pode ser `.mp4` com `"kind": "video"` e `poster`) |
| Foto da tela de bloqueio (celular) | `profile.json` | `lockscreen` (vertical, ≥ 1200 × 2200) |
| Os 4 números do widget Milhas | `profile.json` | `heroStats` (exatamente 4, cada um com `source`) |
| Países, ano em que começou, ferramentas | `profile.json` | `countries`, `since`, `tools` |
| Itens da Lixeira | `profile.json` | `trash` |
| PDF do mídia kit | `profile.json` + arquivo | `mediaKitPdf: "mediakit.pdf"` → `public/mediakit.pdf` |
| Redes sociais (números, data, conteúdos) | `networks.json` | `stats`, `updatedAt`, `posts[]` (mídia + legenda + métrica + link) |
| Projetos/cases | `projects.json` | ver abaixo |
| Experiência profissional | `experience.json` | `company`, `role`, `start`/`end` (`"2022-10"`), `highlights`, `projectIds` |
| Formação e certificações | `education.json` | `kind: "formacao"` ou `"certificacao"`, `url` de verificação, `image` opcional |
| Marcas (carimbos do Passaporte) | `brands.json` | `name`, `kind` (`evento`/`parceria`/`ugc`/`gestao`), `projectId` (torna clicável), `logo` opcional |
| Textos da interface (botões, títulos de app) | `src/lib/i18n.ts` | objeto `UI` |
| Cor de destaque, raios, sombras | `src/styles/tokens.css` | `--acc` etc. |

## Adicionar um projeto (ex.: Disney)

Copie um bloco de `projects.json` e preencha:

```json
{
  "id": "disney-2025",                        // só letras minúsculas, números e hífen
  "title": { "en": "...", "pt": "...", "fr": "..." },
  "folderName": { "en": "Disney", "pt": "Disney" },   // nome curto da pasta (opcional)
  "client": "Walt Disney World",
  "type": "publicado",                        // publicado | ugc | profissional  (um só)
  "areas": ["conteudo", "parcerias"],         // conteudo | ugc | social-media | parcerias | estrategia | empreendedora
  "template": "campanha",                     // campanha (vídeos verticais) | estrategia (números antes) | ugc (entregáveis)
  "period": "nov/2025",
  "role": { "en": "Official media correspondent", "pt": "Correspondente oficial de mídia" },
  "challenge": { "en": "one sentence", "pt": "uma frase" },
  "actions": [ { "en": "...", "pt": "..." } ],
  "cover": { "src": "projects/disney-2025/cover.jpg", "tone": "#F3C9A6" },
  "gallery": [ { "src": "projects/disney-2025/01.mp4", "kind": "video", "poster": "projects/disney-2025/01.jpg" } ],
  "route": { "from": { "en": "press invitation" }, "to": { "en": "2.1M views" } },
  "headline": { "value": "2.1M", "label": { "en": "views" }, "source": "Instagram Insights", "period": "nov/2025" },
  "metrics": [ { "value": "2.1M", "label": { "en": "views" }, "source": "Instagram Insights", "period": "nov/2025" } ],
  "links": [ { "label": { "en": "Post" }, "url": "https://www.instagram.com/p/..." } ],
  "tools": ["CapCut"],
  "featured": 80,                              // 0 = só no Finder; maior = mais à frente na mesa (máx. 6 na mesa)
  "audience": "marca"                          // marca | recrutador | ambos
}
```

Coloque os arquivos em `site/public/media/projects/disney-2025/`. Pronto: pasta na mesa, card no Finder, carimbo no Passaporte (se adicionar em `brands.json` com `projectId`), e o case abre como cartão de embarque.

## Métricas: regras

- `value` é texto, do jeito que deve aparecer ("146M", "+200%", "63,3%").
- `source` é obrigatório ("TikTok Analytics", "Meta Insights", "Mídia kit 2026"). `period` quando houver.
- `comparison` (opcional) dá contexto: `{ "en": "3.4× the account average" }`.
- Se o cliente não permitir divulgar, use `"confidential": true` no projeto: os números somem e o case fica qualitativo.
- Enquanto um número for ilustrativo, mantenha `"exemplo": true`: aparece com selo EXEMPLO e `check-content` lembra de trocar.

## Mídias

- Caminhos são relativos a `site/public/media/`. Se o arquivo não existir, aparece um placeholder com a cor `tone`.
- `tone` (hex) é a cor dominante da foto: aparece enquanto carrega e no placeholder. Dica: abra a foto, pegue a cor média.
- Vídeos: MP4 H.264, mudo, curto, com `poster`. Tocam em loop automático e mudo (regra dos navegadores).
- `credit`: preencha quando a imagem não for da Cami.
