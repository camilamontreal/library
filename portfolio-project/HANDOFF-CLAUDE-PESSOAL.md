# HANDOFF — para o Claude pessoal da Cami

Você está recebendo um portfólio **praticamente pronto do ponto de vista visual e funcional**. Seu trabalho é **curadoria, personalização, integração e publicação**, não redesenhar nem reprogramar. Leia este arquivo inteiro antes de qualquer coisa.

## 1. O objetivo

Portfólio online da Camila Monteiro ("Camila Montreal", @camilamontreal): criadora de conteúdo de viagem e estrategista de social media em Montreal. Dois públicos num site só: **marcas** (que contratam conteúdo/UGC) e **recrutadores** (que avaliam experiência em marketing). Precisa ser memorável pela criatividade, fácil de navegar e convincente pelos resultados.

## 2. O conceito (aprovado pela Cami, não mudar)

> Os dois aparelhos onde o trabalho dela acontece viram a interface: **o Mac dela no desktop, o iPhone dela no celular**, fiéis à Apple, com o papel de parede sendo as fotos dela e um tema de viagem nos widgets e nos nomes.

- Desktop (≥ 768 px): mesa com papel de parede (muda com a hora do dia), barra de menu, 3 widgets de vidro fosco (**Milhas** = números-manchete, **Passaporte** = carimbos das marcas, **Último embarque** = último case), pastas com capa de foto (uma por projeto em destaque + "Todos os projetos"), dock com apps, janelas arrastáveis, notificação após 20 s, Lixeira com "ideias que não deram certo", seletor **Ver como: Marca / Recrutador(a)** (reordena os destaques, não esconde nada), idiomas **EN/PT/FR**, claro/escuro pelo sistema.
- Celular (< 768 px): tela de bloqueio de 1 toque (pulável) → tela inicial com widget Milhas, pasta Projetos, apps → cada app em tela cheia com Voltar e Início.
- Cada **case é um cartão de embarque**: capa (foto/vídeo) → rota "de → para" → desafio → o que eu fiz → conteúdo → resultados (com fonte e período) → links → próximo projeto; canhoto azul com o número-manchete.
- **Chrome** com 5 abas (Instagram, TikTok, YouTube, LinkedIn, camilamontreal.com): réplicas estáticas feitas com os dados de `networks.json`, sempre com botão "Abrir perfil real". **Nunca** trocar por embeds oficiais (decisão registrada: instáveis e pesados).
- Regra de ouro dos projetos: cada um tem exatamente **um tipo** — `publicado` (nas redes dela), `ugc` (entregue ao cliente), `profissional` (para empresa) — e uma ou mais **áreas** (filtros). Um projeto nunca é duplicado.
- **Nunca inventar métricas.** Toda métrica tem `source` e, quando possível, `period`. Sem fonte, não entra.

Todas as decisões e o que foi descartado estão em `portfolio/direcao-criativa.md` (seção 10). As referências analisadas, em `portfolio/referencias.md`. O inventário de conteúdo público, em `portfolio/conteudo.md`.

## 3. O que já está feito e testado

- Site completo em **Vite + React 19 + TypeScript**, estático, sem backend, sem serviço pago.
- Conteúdo 100% em JSON (`site/src/content/*.json`) validado por Zod (`schema.ts`). Nenhum nome, número ou link está dentro de componente.
- Desktop, mobile e tablet funcionando; claro e escuro; EN/PT/FR.
- Testes: `npm test` (schema, referências, destaques) passam. `npm run test:e2e` gera capturas em 3 larguras e falha se houver erro de console.
- `npm run check-content` lista tudo que ainda é **exemplo** e os arquivos de mídia que faltam.
- Build de prévia em arquivo único (`npm run build:preview`) e build normal (`npm run build`).

## 4. O que ainda precisa ser feito (seu trabalho)

1. **Fotos e vídeos.** Esta conta não tinha acesso a nenhuma imagem da Cami. Todas as mídias são placeholders (blocos coloridos com etiqueta FOTO). Coloque os arquivos em `site/public/media/` com os caminhos exatos listados por `npm run check-content` (ou mude os caminhos nos JSON). Formatos: JPG/WebP para fotos (máx. ~2400 px no lado maior), MP4 H.264 curtos (≤ 10 s, mudo) com poster JPG para vídeos. Veja `site/public/media/README.md`.
2. **Dados marcados `exemplo: true`.** Rode `npm run check-content`. Substitua pelos dados reais da Cami (histórico Goalcast, CrowdRiff, campanhas, certificações, datas "a confirmar"). Ao trocar, mude `exemplo` para `false` ou remova o campo.
3. **Curadoria.** Escolha os 4–6 cases em destaque (`featured` > 0; maior = mais à frente) cobrindo os dois públicos (`audience`). Projetos sem destaque continuam no Finder.
4. **Redes.** Atualize `networks.json`: números, `updatedAt`, 6–12 conteúdos selecionados por rede com arquivo, legenda, métrica e link real.
5. **Mídia kit PDF** (opcional): coloque em `site/public/mediakit.pdf` e preencha `profile.mediaKitPdf`.
6. **Lixeira**: a Cami escreve 3–5 "ideias que não deram certo" em `profile.json` → `trash`.
7. **Revisão final**: `npm test`, `npm run check-content --strict` (deve passar sem itens), `npm run test:e2e` e olhar as capturas em `site/shots/`.
8. **Publicar** seguindo `docs/publicacao.md`.

## 5. Estrutura dos arquivos

```
portfolio-project/
├── HANDOFF-CLAUDE-PESSOAL.md      ← este arquivo
├── portfolio/                     ← decisões, referências, inventário (leitura)
├── docs/
│   ├── arquitetura.md             ← como o site funciona por dentro
│   ├── design-system.md           ← cores, tipografia, espaçamento, componentes, animação
│   ├── personalizacao.md          ← onde trocar cada coisa (textos, fotos, projetos, métricas…)
│   └── publicacao.md              ← checklist para colocar no ar em camilamontreal.com
└── site/                          ← o código
    ├── src/content/               ← TODO o conteúdo (JSON + schema.ts)
    ├── src/os/desktop/            ← mesa, janelas, widgets, dock
    ├── src/os/mobile/             ← tela de bloqueio, tela inicial, telas cheias
    ├── src/apps/                  ← Case, Finder, Browser, Milhas, Passaporte, Partidas, Sobre, Mídia kit, Contato, Lixeira
    ├── src/ui/                    ← Media (placeholder), MetricBlock, ícones
    ├── src/styles/tokens.css      ← design tokens (claro/escuro)
    ├── src/lib/i18n.ts            ← strings da interface em EN/PT/FR
    ├── public/media/              ← fotos e vídeos (hoje vazio)
    └── scripts/                   ← check-content, shots (capturas)
```

## 6. Como executar

```bash
cd site
npm install
npm run dev          # http://localhost:5173
npm test             # testes do conteúdo
npm run check-content
npm run build        # gera dist/ para publicar
```

Requer Node 20+. Para `npm run test:e2e` é preciso Chromium (`npx playwright install chromium`, ou defina `PW_CHROME=/caminho/do/chrome`).

## 7. Decisões que precisam ser preservadas

- Conceito Mac/iPhone fiel à Apple; sem objetos ilustrados "de brinquedo" (a Cami rejeitou).
- Uma cor de destaque só (azul-lilás `#5B6BD5`); o resto da cor vem das fotos. Tons sóbrios; nada de turquesa+rosa+lilás juntos (rejeitado como "infantil").
- Sem serifa: Inter em tudo.
- Sem intro longa: boot de 1,5 s pulável, uma vez por sessão.
- Réplicas estáticas das redes, nunca embeds.
- Tipos de projeto e proveniência de métricas (seção 2).
- Toda pergunta à Cami vai por pop-up de múltipla escolha (ela não quer ler documentos longos).

## 8. Problemas e limitações conhecidos

- Sem fotos reais, o site parece "chapado": é esperado; some quando as mídias entram.
- O `Finder` abre atrás de janelas já abertas se o ícone estiver coberto (comportamento de desktop normal).
- Vídeos com autoplay só tocam mudos; em dados móveis alguns navegadores não iniciam vídeo de fundo. O poster cobre isso.
- O seletor de idioma no celular some quando um app está aberto (fica na tela inicial).
- `npm run build` avisa sobre chunk > 500 kB (React + Framer Motion); aceitável para um site estático; se quiser, faça code-splitting por app com `React.lazy`.
- LinkedIn não tem números públicos; a aba mostra "a confirmar".
- A reprodução de `.mp4` no artefato de prévia do claude.ai não foi testada (prévia é só para layout).

## 9. Integração com camilamontreal.com

Hoje o site da Cami é Wix. Duas opções (detalhes em `docs/publicacao.md`): subdomínio `portfolio.camilamontreal.com` apontando para Vercel/Netlify (recomendado; o Wix fica intacto), ou substituir o site inteiro. Em subpasta de Wix não dá (Wix não serve arquivos estáticos de terceiros).
