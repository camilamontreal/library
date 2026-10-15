# Direção criativa — portfólio da Cami

Documento vivo de decisões. Cada item tem um status:
**PROPOSTA** (ideia minha, aguardando a Cami) · **APROVADA** (Cami aprovou) · **DESCARTADA** (com o motivo) · **FIXA** (regra dada pela Cami, não se discute).

Última atualização: 15/10/2026 — primeira rodada, nada aprovado ainda além das regras fixas.

---

## 0. Regras fixas (vindas do briefing)

- FIXA — Equilíbrio: criatividade + experiência do usuário + credibilidade profissional.
- FIXA — Sem intro longa; sem animação obrigatória antes do conteúdo; navegação não pode confundir.
- FIXA — Surpresas pontuais, distribuídas, não um playground.
- FIXA — Métricas e resultados em todo lugar onde existirem dados reais; nunca inventar; nunca tratar dado fictício como real.
- FIXA — Diferenciar sempre: campanha publicada nas redes dela / UGC entregue ao cliente / projeto profissional para empresa.
- FIXA — Um site só para dois públicos (marcas e recrutadores).
- FIXA — Experiência mobile própria (tela inicial de celular), não um desktop encolhido.
- FIXA — Conteúdo centralizado em arquivos de dados; nenhum dado pessoal espalhado em componentes; dados demonstrativos claramente marcados.
- FIXA — Sem serviços pagos, sem contas pessoais conectadas, projeto executável fora desta conta, documentação completa para handoff.
- FIXA — Não programar antes da aprovação da direção criativa.

---

## 1. Conceito principal — PROPOSTA

### A ideia em uma frase

> Neste site, **os dois aparelhos onde o trabalho da Cami acontece — o Mac onde ela planeja e mede, e o celular onde ela cria e publica — viram a própria interface do portfólio.**

Por que isso e não um café, um quarto ou um escritório: o teste do concorrente. "Uma cafeteria" funciona para qualquer pessoa que gosta de café. "Um estúdio de criadora com dois aparelhos que contam histórias diferentes" só funciona para alguém que vive entre os dois lados — criar conteúdo (celular) e gerir marketing (laptop). É exatamente o problema dos dois públicos, resolvido pela metáfora:

- **No desktop**, o visitante entra pelo **Mac da Cami**: pastas de projetos, apps de resultados, certificados, experiência. É o lado "marketing profissional", com a criação de conteúdo dentro dele.
- **No celular**, o visitante entra pelo **iPhone da Cami**: tela inicial com apps, pastas e widgets. É o lado "criadora", com o profissional dentro dele.
- Os dois lêem **os mesmos dados**. Mudam a embalagem e a ordem, não o conteúdo.

### Rodada 2 — o que o site da Cami mudou na ideia (15/10, após ler camilamontreal.com)

A Cami não é "uma criadora genérica": é uma **criadora de viagem** ("A passport, a lens, a story"), 27 países, ex-tripulante de cruzeiro, queria ser comissária de bordo, cobre lançamentos de rotas aéreas (Air Canada, BermudAir, LATAM) e eventos Disney/Universal como correspondente oficial. Isso é o que só ela tem. Então a camada visual do "OS" ganha um tema:

> **O sistema operacional da Cami é um sistema de viagem.** A mesa é um mapa com pinos dos países; cada case abre como um **cartão de embarque** (origem = desafio, destino = resultado, "assento" = papel dela); marcas e certificações são **carimbos de passaporte**; a experiência profissional é um **painel de partidas** de aeroporto (ano, empresa, cargo, status "concluído/em curso"); o widget de resultados é um **"milhas acumuladas"** (600K+ comunidade, 290M+ views, 50+ marcas); o Finder é o **"despacho de bagagem"** com etiquetas de tipo (publicado / UGC / profissional) como tags de mala.

Teste do concorrente: outra criadora de lifestyle não pode usar um painel de partidas sem parecer fantasia; para a Cami é literal. A mecânica do site (desktop/celular, pastas, janelas, Chrome) **não muda**; muda a pele, o vocabulário e os ícones. Nada disso vira intro: o mapa já é a mesa.

Status: **APROVADA** (pop-up 15/10).

### Próximo passo antes de programar

1. Três direções visuais (paleta, fontes, estilo de ícones, mesa e cartão de embarque) em imagem, para escolha por pop-up.
2. Receber o restante das referências da Cami e atualizar `referencias.md`.
3. Com a direção visual escolhida e as referências fechadas, a Cami libera o desenvolvimento.

### O que descarta a cena do café da Júlia

DESCARTADA — Cena ilustrada "ambiente" (café, quarto, escritório) antes do desktop. Motivo: é a intro longa que a Cami não quer, depende de uma ilustração cara e não editável, e não pertence à Cami (teste do concorrente falha).

### Tom visual (a decidir com você — ver seção 8)

Não quero decidir paleta e tipografia antes de ouvir você sobre identidade. O que já está definido pelos princípios:

- O sistema operacional é um **"OS da Cami"**, não uma cópia pixel-a-pixel do macOS/iOS (evita parecer imitação, dá liberdade de cor e evita problemas de marca registrada com ícones da Apple).
- Interface limpa de OS (barras, janelas, ícones) **+ conteúdo quente e fotográfico** (as fotos e vídeos dela são a cor do site).
- Uma fonte de interface + possivelmente uma fonte de display para títulos dos cases.

---

## 2. Página inicial (desktop) — PROPOSTA

### Sem intro, com uma surpresa de 2 segundos

- O site abre **direto na área de trabalho**, já utilizável. A única "cena" é uma **animação de boot curtíssima** (≈1,5 s, pulável, só na primeira visita): a tela acende, os ícones "pousam" na mesa. Nada bloqueia o clique.
- Alternativa DESCARTADA: tela de login com dois perfis ("Sou uma marca" / "Sou recrutador(a)"). Motivo: é um passo a mais antes do conteúdo e força o visitante a se classificar. Mantida como **toggle opcional** na barra de menu: "Ver como: Marca · Recrutador(a)" — reorganiza o que está em destaque sem esconder nada. **Decidir com você.**

### O que está na área de trabalho

Papel de parede: uma foto real da Cami ou de uma gravação (não uma montanha genérica). Em cima dela:

| Elemento | O que é | Para quem |
| --- | --- | --- |
| **Widget "Resultados"** (canto superior) | 3–4 números-chave agregados, estilo widget de sistema, com data de atualização. Ex.: alcance total, seguidores, campanhas entregues, crescimento de audiência. | os dois |
| **Pastas em destaque** (4–6) | Os cases mais fortes, uma pasta por projeto/cliente. | os dois |
| **Pasta "Todos os projetos"** | Abre o Finder com a navegação por área (seção 3). | os dois |
| **Dock** | Apps: Chrome (redes), Resultados, Sobre, Experiência, Certificados, Mídia kit, Contato. | os dois |
| **Barra de menu** | Nome da Cami, menu "Ir para…" (atalho textual para tudo, para quem não quer explorar), toggle Marca/Recrutador, relógio real, idioma PT/EN. | recrutador(a) |
| **Post-it ou nota** | Uma frase de posicionamento ("Criadora de conteúdo e estrategista de social media — X anos, Y marcas"). | os dois |

Regra: **tudo que está na mesa é clicável**. Nada de logos decorativos (erro da Júlia).

### A surpresa distribuída (candidatas, escolher 2–3, não todas)

1. Uma **notificação** que aparece depois de ~20 s: "Nova mensagem de [marca fictícia]: adorei o vídeo!" — abre o case correspondente.
2. **Arrastar ícones** de verdade na área de trabalho (e um botão "arrumar mesa").
3. O **papel de parede muda** conforme a hora real do dia (manhã/tarde/noite).
4. Um **player de música** no dock com uma playlist (só visual, sem áudio automático).
5. A **Lixeira** com "ideias que não deram certo" — autoironia, humaniza.
6. **Modo claro/escuro** seguindo o sistema do visitante.

---

## 3. Pastas e projetos — PROPOSTA

### Duas camadas, zero duplicação

Problema das categorias iniciais: "Content Creator", "UGC", "Social Media", "Brand Partnerships" e "Marketing Strategy & Content Production" se sobrepõem (uma campanha com marca é ao mesmo tempo conteúdo, parceria e produção).

Solução: **um projeto é uma coisa só** (um arquivo de dados), e ele carrega três informações separadas:

1. **Tipo de trabalho** (obrigatório, exatamente um — regra sua):
   - `publicado` — campanha publicada nas redes da Cami (ela é a mídia).
   - `ugc` — conteúdo entregue ao cliente para os canais dele (ela é a produtora; ex.: CrowdRiff).
   - `profissional` — projeto feito como funcionária/consultora de uma empresa (ex.: Goalcast).
2. **Áreas** (uma ou mais, servem de filtro): Criação de conteúdo · UGC · Social media & marketing digital · Parcerias & influencer marketing · Estratégia & produção.
3. **Cliente/marca**.

### Como aparece

- **Área de trabalho:** só as pastas em destaque (pasta = projeto).
- **Finder "Todos os projetos":** janela com **barra lateral por área** à esquerda (como o Finder tem "Favoritos"), lista/grade de projetos à direita. Clicar numa área filtra; o projeto que pertence a duas áreas aparece nas duas sem existir duas vezes. Filtro secundário por tipo (publicado/UGC/profissional) com **etiquetas coloridas** estilo "tags" do Finder — fica visível em todo lugar de que tipo é cada trabalho.
- **Janela do case:** ver seção 7.

### Prioridade de destaque

Os 4–6 cases da mesa devem cobrir os dois públicos: pelo menos 2 cases `profissional` com resultados de negócio (recrutadores) e pelo menos 2 `publicado`/`ugc` com números de audiência (marcas).

---

## 4. Redes sociais — o "Chrome" — PROPOSTA

### Como funciona

App de navegador na dock, com **5 abas** (APROVADA): Instagram · TikTok · YouTube · LinkedIn · camilamontreal.com. Cada aba é uma **réplica em HTML do perfil**, construída com os dados e as mídias da Cami, rolável, com um botão fixo **"Abrir perfil real ↗"**.

### Decisão técnica importante — por que réplica e não embed

- Embeds oficiais (Instagram/TikTok/YouTube) são lentos, carregam scripts de terceiros, exigem cookies, quebram com bloqueadores e mudam sem aviso. O TikTok embed em especial é instável. Instagram exige token para a API e bloqueia iframes do perfil.
- Réplica estática: zero dependência externa, carrega instantâneo, funciona offline e nunca quebra. Custo: os números ficam "congelados". Solução: cada rede tem um arquivo de dados com `seguidores`, `atualizadoEm`, e a interface mostra "dados de DD/MM/AAAA". Atualizar = editar um número.
- **Vídeos:** o reel/tiktok em destaque pode ser um mp4 curto hospedado no próprio site (muted, loop, poster) — isso é estável. Para os demais, thumbnail + link.
- Exceção aceitável: **YouTube** permite iframe de vídeo individual com `loading="lazy"`; podemos usar para 1–2 vídeos dentro da aba YouTube, com fallback de thumbnail.

### O que cada aba mostra

- Cabeçalho do perfil (foto, @, contadores com data), **grade de 6–12 conteúdos selecionados** (não o feed inteiro), cada um com visualizações/curtidas se houver dado, e ao clicar abre um "post" com o vídeo/imagem + legenda + métrica + link real.

---

## 5. Mobile — PROPOSTA

### A tela inicial do iPhone da Cami

Em telas estreitas o site **não renderiza o desktop**; renderiza outra composição com os mesmos dados:

- **Tela de bloqueio** de 1 toque (opcional, pulável): foto + hora real + uma notificação com a frase de posicionamento. Deslizar/tocar abre. Pode ser desligada; é a única "intro" e dura o tempo de um toque.
- **Tela inicial:** grade de apps, um **widget grande de Resultados**, uma **pasta "Projetos"** (abre em tela cheia com os mesmos filtros por área e tipo), apps Instagram/TikTok/YouTube (cada um abre a réplica em tela cheia, como um app nativo), Sobre, Experiência, Certificados, Contato.
- **Barra inferior** fixa com gesto/botão "início" e um menu de lista para quem não quer tocar em ícones.
- **Cases** abrem como uma tela de app com scroll vertical (não uma janela flutuante).
- Toque mínimo de 44 px; nada de hover obrigatório (tudo que no desktop é hover, no mobile é visível ou é toque).

### Por que isso resolve o problema

A Júlia (não verificado no mobile) provavelmente reduz a cena; aqui o celular **é** a metáfora certa para a criadora — é onde o conteúdo dela existe de fato. Fica mais natural no mobile do que no desktop, e isso é bom: a maioria das marcas vai abrir o link pelo celular.

### Ponto de quebra

Desktop ≥ 1024 px; tablet 768–1023 px usa o desktop com janelas em tela cheia; < 768 px usa o celular. (Confirmar nos testes.)

---

## 6. Métricas e resultados — PROPOSTA

Três níveis, todos alimentados por dados estruturados:

1. **Widget agregado** (mesa / tela inicial): 3–4 números que resumem tudo, com data. É o primeiro número que uma marca vê.
2. **App "Resultados"**: painel com os números por área e por rede, pequenos gráficos de crescimento quando houver série histórica, e os "melhores momentos" (top 5 conteúdos por alcance; campanha com melhor conversão; melhor open rate de e-mail…). Cada número tem **fonte** (ex.: "Instagram Insights, set/2026") e, quando possível, **comparação** ("3,4× a média da conta").
3. **Bloco de resultados em cada case**: 2–4 métricas grandes + 1 frase do que isso significou para o cliente. Componente único, reaproveitado.

Regras: toda métrica tem `valor`, `rótulo`, `fonte`, `periodo` e `comparacao` (opcional). Se não tem fonte, não entra. Métricas demonstrativas carregam `exemplo: true` e aparecem com um selo "exemplo" até serem substituídas.

---

## 7. Cases e experiência profissional — PROPOSTA

### Template de case (janela no desktop, tela no mobile)

Ordem fixa, campos opcionais somem se vazios:

1. **Capa**: nome do projeto, cliente, etiqueta de tipo (publicado/UGC/profissional), áreas, período, papel da Cami.
2. **Em uma frase**: o desafio.
3. **O que eu fiz**: 3–5 frases ou tópicos curtos, verbos de ação.
4. **O conteúdo**: galeria (vídeos mp4 curtos, imagens, carrossel) em mockup de celular quando for conteúdo de rede.
5. **Resultados**: bloco de métricas (seção 6).
6. **Depoimento** (só se real).
7. **Links**: post real, site do cliente.
8. **Próximo projeto** (navegação entre cases sem voltar à mesa).

Três **variações visuais** do mesmo template, escolhidas por campo `template`: `campanha` (foco em vídeo vertical), `estrategia` (foco em antes/depois e números), `ugc` (foco em entregáveis, várias peças lado a lado).

### Experiência, formação e certificações

- **App "Experiência"**: linha do tempo horizontal (desktop) / vertical (mobile) com empresas, cargos, períodos e 2–3 conquistas numéricas por cargo. Clicar numa empresa lista os cases relacionados.
- **App "Certificados"**: galeria estilo app de Fotos, cada certificado como "foto" com instituição, data e link de verificação. Formação acadêmica no topo.
- **App "Sobre"**: cartão de contato estilo "Contatos" + texto curto + foto + idiomas + ferramentas (grade de logos clicáveis que filtram os projetos onde a ferramenta foi usada — isso transforma a grade da Sofia em algo útil).
- **Mídia kit**: botão que gera/baixa um PDF de uma página com os números e contato (para marcas). Pode ser estático na v1.

---

## 8. Decisões que preciso de você

FIXA (15/10) — **Toda pergunta/aprovação vai por pop-up de múltipla escolha no chat.** Os documentos são registro, não lista de tarefas para a Cami ler. As respostas entram na tabela da seção 10.

Perguntas da rodada 2 (enviadas por pop-up em 15/10):

1. **Conceito "dois aparelhos"** — aprova a ideia central? (seção 1)
2. **Toggle Marca/Recrutador** na barra de menu — quer, ou prefere uma mesa única sem modos?
3. **Surpresas**: escolha 2–3 da lista da seção 2.
4. **Tela de bloqueio no mobile**: quer o toque único ou abrir direto na tela inicial?
5. **Identidade visual**: você tem cores/fontes/logo já usados nas suas redes? Se sim, mando propostas em cima deles. Se não, proponho 3 direções de paleta na próxima rodada (e aí uso a skill de direção de arte para sortear direções).
6. **Idiomas**: PT e EN desde o início, ou só um?
7. **Nome do site/OS**: "CamiOS"? Algo com seu @? Quero o nome antes de desenhar ícones.
8. **Redes do Chrome**: Instagram, TikTok, YouTube e qual quarta aba (site, LinkedIn, Pinterest)?

---

## 9. Stack técnica — PROPOSTA (para aprovar antes de programar)

| Decisão | Proposta | Motivo |
| --- | --- | --- |
| Framework | **Vite + React + TypeScript**, site estático | Simples de rodar (`npm install && npm run dev`), zero servidor, publica em Vercel/Netlify/GitHub Pages/qualquer hospedagem, fácil de transferir. Next.js seria mais do que precisamos. |
| Animação | **Framer Motion** (janelas, ícones, transições) + CSS | Padrão de mercado em React, boa documentação para o próximo Claude. |
| Estado das janelas | Zustand (leve) | Janelas abertas, foco, posição. |
| Conteúdo | **Arquivos JSON/MDX em `/content`** (perfil, redes, projetos, métricas, experiência, certificados) com **schema validado (Zod)** | Trocar conteúdo sem tocar em componente; erro de preenchimento aparece na hora. |
| Mídia | `/public/media/<projeto>/` com nomes previsíveis; vídeos mp4 H.264 curtos + poster | Sem CDN paga, sem API. |
| Estilo | CSS Modules ou Tailwind com tokens em CSS variables | Design system documentado em um lugar. |
| Testes | Vitest para o schema e lógica de janelas; Playwright para 3 larguras | Garante que a transferência vem com testes verdes. |
| Hospedagem futura | qualquer estático; instruções para Vercel e para subpasta do site atual | Checklist no handoff. |
| Idiomas | i18n por arquivo (`pt.json`, `en.json`) se aprovado | |

Sem CMS pago. Se um dia quiser editar sem código, um CMS baseado em Git (Decap/Keystatic) encaixa em cima dos mesmos arquivos.

---

## 10. Registro de decisões

| Data | Decisão | Status | Observação |
| --- | --- | --- | --- |
| 15/10/2026 | Regras do briefing (seção 0) | FIXA | |
| 15/10/2026 | Cena ilustrada antes do desktop | DESCARTADA | intro longa, custo, não pertence à Cami |
| 15/10/2026 | Tela de login com dois perfis | DESCARTADA → virou toggle opcional | passo a mais |
| 15/10/2026 | Embeds oficiais de Instagram/TikTok | DESCARTADA | instabilidade e desempenho; réplica + link real |
| 15/10/2026 | Logos de marcas decorativos na mesa | DESCARTADA | tudo na mesa é clicável |
| 15/10/2026 | Conceito "dois aparelhos" (Mac no desktop, iPhone no celular) | **APROVADA** | pop-up rodada 2 |
| 15/10/2026 | Tema de viagem no OS (mapa, cartão de embarque, carimbos, painel de partidas, "milhas") | **APROVADA** | pop-up rodada 2 |
| 15/10/2026 | Seletor "Ver como: Marca / Recrutador(a)" na barra de menu | **APROVADA** | reorganiza destaques, não esconde nada |
| 15/10/2026 | Tela de bloqueio de 1 toque no mobile (pulável) | **APROVADA** | |
| 15/10/2026 | Idiomas: EN + PT + FR | **APROVADA** | abre em EN; seletor na barra de menu; 3 arquivos de texto |
| 15/10/2026 | Identidade visual do zero; eu proponho 3 paletas em imagem | **APROVADA** | próxima rodada, escolha por pop-up |
| 15/10/2026 | Surpresas: papel de parede por hora real, notificação após ~20 s, arrastar ícones, Lixeira com "ideias que não deram certo" | **APROVADA** (as 4) | Cami escreve os itens da Lixeira depois |
| 15/10/2026 | Métricas do mídia kit = últimos 90 dias (abr–jun/2026) | **APROVADA** | rotular assim em todo lugar |
| 15/10/2026 | Clientes de gestão com nome e número (Goalcast, Paradigm, Life Stories, House Inn, Mundo Mágico) | **APROVADA** | viram cases completos |
| 15/10/2026 | CrowdRiff = UGC para destinos clientes da plataforma | **APROVADA** | tipo `ugc`; case qualitativo até ter números |
| 15/10/2026 | Chrome com 5 abas: Instagram, TikTok, YouTube, LinkedIn, camilamontreal.com | **APROVADA** | |
| 15/10/2026 | Produtos próprios entram como case "empreendedora" (uma pasta) | **APROVADA** | roteiros, presets, e-books, mentoria, guia de Montreal, podcast |
| 15/10/2026 | Stack Vite + React + TypeScript, estático, conteúdo em JSON | **APROVADA** | |
| 15/10/2026 | Toda pergunta à Cami vai por pop-up de múltipla escolha | FIXA | |
| 15/10/2026 | Direções A/B/C (Carimbo, Terminal, Céu) | DESCARTADAS | "chapadas, frias, cores erradas" |
| 15/10/2026 | Direção D (serifa itálica, azul-lilás + turquesa + rosa, objetos ilustrados) | DESCARTADA | paleta infantil, objetos "de brinquedo"; manteve-se vidro fosco e cartão de embarque |
| 15/10/2026 | **Direção E3 aprovada**: Mac/iPhone fiéis à Apple, papel de parede = foto dela, vidro fosco, widgets como objetos (Milhas, Passaporte com carimbos das marcas, Último embarque), pastas com foto de capa, case como cartão de embarque | **APROVADA** | imagem `direcoes-visuais/E3-widgets-objetos.png` |
| 15/10/2026 | Tipografia: sem serifa (Inter) em tudo, inclusive títulos dos cases | **APROVADA** | |
| 15/10/2026 | Cor de destaque: azul-lilás do mídia kit (#5B6BD5), uma só; o resto vem das fotos; tons sóbrios | **APROVADA** | |
| 15/10/2026 | Modo claro e escuro seguindo o sistema | **APROVADA** | |
| 15/10/2026 | Fotos: nenhuma disponível nesta conta; placeholders marcados FOTO; Cami anexa depois ou o Claude pessoal insere | FIXA | |
| 15/10/2026 | Desenvolvimento liberado | **APROVADA** | |
