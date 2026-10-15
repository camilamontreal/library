# Design system

Fonte da verdade: `site/src/styles/tokens.css` (cores, raios, sombras, movimento) e `site/src/styles/base.css` (primitivos). Tudo o mais usa `var(--token)`.

## Princípio

Um sistema operacional **fiel à Apple** (macOS no desktop, iOS no celular), sem imitar logos nem ícones da Apple. A personalidade vem do **conteúdo** (as fotos e os números da Cami), de **uma cor de destaque** e do **vocabulário de viagem** (Milhas, Passaporte, Partidas, cartão de embarque, bagagem). Vidro fosco e sombras suaves dão a profundidade; nada é chapado, nada é "de brinquedo".

## Cor

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--acc` | `#5B6BD5` | igual | a única cor de destaque: botões, canhoto do cartão de embarque, estado ativo |
| `--acc-soft` | `rgba(91,107,213,.14)` | `.26` | fundos leves de destaque |
| `--ink` / `--ink-2` / `--ink-3` | `#0F1629` / `#5B6480` / `#8B93AB` | `#F2F4FA` / `#B5BCD1` / `#7F879F` | texto principal / secundário / terciário |
| `--paper` / `--paper-2` | `#FFFFFF` / `#F4F5F9` | `#171B2C` / `#1F2437` | fundo de janela / cartões internos |
| `--glass` / `--glass-strong` / `--glass-dark` | branco 62 % / 82 % · navy 46 % | navy 62 % / 84 % / 55 % | widgets, dock, barras (sempre com `backdrop-filter`) |
| `--line` | preto 10 % | branco 10 % | divisórias finas (só dentro de janelas) |
| `--tag-publicado` / `--tag-ugc` / `--tag-profissional` | `#F2C14E` / `#8FE0C3` / `#C7D2FE` | iguais | etiquetas de tipo de projeto (texto sempre `#0F1629`) |

Regras: nunca introduzir uma segunda cor de destaque; a cor "viva" da página vem das fotos. Ícones de app usam gradientes verticais curtos (fiel ao iOS); fora deles, nada de gradiente decorativo. Semântica: LIVE no painel de Partidas é `#3DD68C`.

## Tipografia

Uma família: **Inter Variable** (`@fontsource-variable/inter`, embutida no build; fallback `-apple-system, system-ui`). Sem serifa em lugar nenhum (decisão da Cami).

| Papel | Tamanho / peso | Onde |
| --- | --- | --- |
| Número grande | 36–52 px / 800 / tracking −0.04em / `tabular-nums` | widget Milhas, canhoto, métricas |
| Título de case | clamp(26–40 px) / 800 / −0.035em / leading 1.02 / máx. 18 ch | capa do cartão de embarque |
| Título de app | 20 px / 800 | cabeçalho dos apps |
| Corpo | 14–15 px / 400–500 / leading 1.45–1.55 | textos |
| Rótulo (eyebrow) | 11 px / 700 / caixa alta / +0.06em | seções do case, cabeçalhos do Finder |
| Interface | 12–13 px / 600 | barra de menu, abas, dock, tags |

Títulos têm no máximo duas linhas na largura da janela (o `max-width: 18ch` garante).

## Espaçamento e forma

- Escala de 4 px: 4, 8, 12, 16, 22, 26, 30.
- Raios: janela 12 px; cartões/widgets 20 px; ícones de app 24 % do tamanho; pílulas 999 px.
- Sombras: janela `0 30px 70px rgba(10,14,30,.38)` + contorno 0,5 px; cartão `0 12px 32px rgba(10,14,30,.18)`; ícone `0 4px 10px rgba(0,0,0,.25)`. Nada mais tem sombra.
- Vidro: `backdrop-filter: blur(26px) saturate(1.5)` + contorno interno branco 0,5 px.
- Desktop: barra de menu 30 px; widgets 300 px de largura à esquerda; pastas em grade de 2 colunas à direita (118 px); dock centralizado com ícones de 52 px.
- Celular: alvo mínimo de toque 44 px; apps 62 px; dock 92 px.

## Componentes

- **Widget** (`.widget`, variantes `--miles`, `--passport`, `--boarding`): botão inteiro clicável, vidro, título 13 px + número grande.
- **Pasta** (`.dicon`): ícone SVG azul macOS com capa de foto; etiqueta de tipo embaixo; arrastável; abre no clique curto.
- **Janela** (`.win`): barra 40 px com três luzes, título central cinza; corpo rolável; fecha no vermelho, no Esc ou duplo clique na barra.
- **Cartão de embarque** (`.case`): capa 290 px com texto sobre gradiente escuro → corpo em 2 colunas (conteúdo | canhoto azul 236 px com linha tracejada e código de barras).
- **Bloco de métricas** (`.metrics`, tamanhos `sm/md/lg`): número + rótulo + comparação + fonte·período; selo EXEMPLO quando ilustrativo; contorno tracejado amarelo.
- **Finder** (`.finder`): barra lateral 220 px com áreas e contagem + filtro por tipo; grade de cards 190 px com capa 4:3 e número no canto.
- **Navegador** (`.browser`): abas, barra de endereço com cadeado e botão "Abrir perfil real"; perfil com avatar 88 px, contadores e grade (1:1 Instagram, 9:16 TikTok, 16:9 YouTube/site).
- **Painel de Partidas** (`.board`): fundo navy, hora em amarelo `#FFD60A`, linha "LIVE" em verde.
- **Carimbos** (`.stamp`, `.pstamp`): borda tracejada, leve rotação alternada; clicáveis quando ligados a um case.
- **Tag** (`.tag--publicado/ugc/profissional`): pílula 10 px, texto escuro.
- **Placeholder de mídia** (`.media`): gradiente radial a partir de `tone` + etiqueta "FOTO" + selo EXEMPLO.

## Movimento

Tokens: `--dur: 240ms`, `--ease: cubic-bezier(.2,.8,.2,1)`. `prefers-reduced-motion` zera tudo.

- Boot: 1,5 s, barra de progresso, pulável, uma vez por sessão.
- Entrada da mesa: widgets sobem 16 px com stagger 80 ms; pastas descem 14 px com stagger 60 ms.
- Janela: abre com escala 0,96→1 e 12 px de subida em 220 ms; fecha ao contrário.
- Dock: hover sobe 6 px e escala 1,08; rótulo aparece.
- Cards: hover sobe 2–3 px.
- Notificação: entra de baixo (40 px) após 20 s.
- Telas do celular: deslizam de baixo em 280 ms.
Só `transform` e `opacity` animam.

## Responsividade

- ≥ 1024: desktop completo. 768–1023: desktop compacto (widgets 230 px, menu sem rótulo "Ver como", ícones do dock 44 px, janelas limitadas à tela). < 768: iPhone.
- Janelas nunca ultrapassam `viewport − 32 px` de largura e `− 110 px` de altura.
- No celular, o cartão de embarque vira uma coluna (canhoto embaixo, linha tracejada no topo); galerias em 2 colunas; Finder com filtros em linha.

## Acessibilidade

- Tudo é `button` ou `a`; foco visível (`outline` na cor de destaque).
- Janelas são `role="dialog"` com `aria-label`; Esc fecha.
- Seletores de público e idioma são `radiogroup`.
- Ícones têm `aria-hidden`; mídias têm `role="img"` + `aria-label` do `alt`.
- Contraste: texto sobre vidro claro usa `--ink`; sobre foto usa branco com `text-shadow`.
