# Arquitetura

## Stack

Vite 8 · React 19 · TypeScript · Zustand (estado das janelas) · Framer Motion (animações) · Zod (validação do conteúdo) · Vitest (testes) · Playwright (capturas). Sem backend, sem CMS, sem serviço pago. Build estático em `dist/`.

## Fluxo de dados

```
src/content/*.json ──► src/content/index.ts (Zod.parse) ──► componentes
                                              │
                          featuredProjects(audience)  ← seletor Marca/Recrutador
```

- `schema.ts` é o contrato. Um JSON errado derruba o build com a mensagem apontando o campo.
- `content.ts` exporta `content` (tudo), `projectById`, `featuredProjects`.
- Textos: `I18n = {en, pt?, fr?}`; `t(text, lang)` cai para `en`. Strings da interface em `lib/i18n.ts` → `UI`.

## Estado (Zustand, `store/os.ts`)

- `windows[]`: janelas abertas (`key = app[:payload]`, posição, tamanho, z-index). `open()` reutiliza a janela se já existe.
- `audience`: `marca | recrutador` (persistido em `localStorage`).
- `iconOffsets`: deslocamento das pastas arrastadas; `tidy()` zera.
- `openHandler`: no celular, `Mobile.tsx` registra um handler que empilha telas; assim os apps chamam `open('case', id)` sem saber se estão no desktop ou no celular.
- Idioma em `lib/i18n.ts` (`useLang`), também persistido.

## Camadas

| Camada | Pasta | Responsabilidade |
| --- | --- | --- |
| Shell desktop | `os/desktop/` | `Desktop` (mesa, boot, menu, dock, toast), `Window`, `Widgets`, `DesktopIcon` |
| Shell mobile | `os/mobile/` | `Mobile` (lock, home, pilha de telas) |
| Apps | `apps/` | `renderApp(win)` e `appTitle(win)` roteiam para `CaseApp`, `FinderApp`, `BrowserApp`, `MilesApp`, `PassportApp`, `DeparturesApp`, `SmallApps` (About, MediaKit, Contact, Trash). Os apps são os mesmos nos dois shells. |
| UI | `ui/` | `Media` (imagem/vídeo com placeholder), `MetricBlock`, `icons` (SVG + `AppIcon` + `FolderIcon`) |
| Estilo | `styles/tokens.css`, `styles/base.css`, `os/desktop/desktop.css`, `os/mobile/mobile.css`, `apps/apps.css` | tokens → primitivos → shells → apps |

`App.tsx` escolhe o shell por `matchMedia('(max-width: 767px)')`.

## Convenções

- Sem CSS-in-JS; classes BEM-ish (`.bloco__elemento--variante`).
- Nenhum texto fixo em componente: tudo em `UI` ou no conteúdo.
- Animações só com `transform`/`opacity`; respeitar `prefers-reduced-motion` (tokens zeram a duração).
- Acessibilidade: tudo clicável é `button`/`a`; `aria-label` onde o texto não é visível.
- Mídias nunca "quebram": `Media` mostra placeholder se o arquivo não existir.

## Scripts

- `npm run dev` · `npm run build` (+ `BASE=/sub/` para subpasta) · `npm run build:preview` (arquivo único) · `npm test` · `npm run test:e2e` (capturas em 3 larguras + modo escuro, falha em erro de console) · `npm run check-content [--strict]`.

## Onde mexer para…

- Mudar a ordem/quantidade de apps no dock: `DOCK` em `Desktop.tsx`; no celular, `apps[]` em `Mobile.tsx`.
- Mudar o tamanho padrão de uma janela: `DEFAULT_SIZE` em `store/os.ts`.
- Mudar a hora em que o papel de parede troca: `dayPart()` em `lib/hooks.ts`.
- Trocar o tempo da notificação (20 s): `Toast` em `Desktop.tsx`.
- Adicionar um app: criar em `apps/`, registrar em `renderApp`/`appTitle`, `AppId` no store, ícone em `APP_META`, rótulo em `UI`, e colocá-lo no dock/tela inicial.
- Adicionar um idioma: `Lang` em `i18n.ts`, chaves em `UI`, campos nos JSON.
