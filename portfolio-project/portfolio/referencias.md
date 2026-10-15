# Biblioteca de referências

Documento vivo. Cada referência que a Cami enviar entra aqui com o mesmo formato.
Convenção: **[VERIFICADO]** = eu abri a página e confirmei; **[INTERPRETADO]** = baseado na descrição da Cami ou em dedução, não confirmado.

Última atualização: 15/10/2026

---

## Referência 1 — Júlia Alvarenga

- **Link:** https://www.juliaalvarenga.com/
- **Nome:** Julia Alvarenga — Portfolio ("Julia's world")
- **Perfil dela:** estudante de Economia em Harvard, marketing criativo, co-fundadora do Harvard Marketing Group.
- **Status da análise:** desktop **[VERIFICADO]** no Chrome em 1469×762; mobile **[NÃO VERIFICADO]** (não consegui redimensionar a janela do Chrome; precisa de teste no celular real ou DevTools).

### Como funciona a navegação (verificado)

A página é uma sequência linear de "cenas" controladas pelo scroll, até chegar ao ambiente interativo:

1. **Abertura:** fundo marrom-café, logo manuscrito "Julia's world". Ao rolar, objetos ilustrados (crachá "Hello my name is Cool Marketing Kid", croissant, xícara, carta de baralho, boné com H, cupom, CD com foto de infância) entram e se espalham em volta do logo. É uma "mesa de colagem" — cada objeto representa algo da vida dela.
2. **Bio curta:** "Made in Brazil, now in SF. Economics at Harvard. Loves creating things, writing, and, duh, coffee." com instrução "(hover over the bold stuff)" — as palavras em negrito revelam algo no hover.
3. **Cena da xícara:** avatar 3D dela pulando numa caneca gigante (transição visual, sem conteúdo).
4. **Frase de transição:** "One big cup, one small leap. Sip, then conquer." em fundo creme.
5. **A cafeteria (cena principal):** ilustração/colagem fotográfica de um balcão de café com máquina La Marzocco, prateleira com sacos de café ("welcome to my brain"), quadro de cortiça com logos de marcas (poppi, Red Bull, LinkedIn, Larroudé, Alex Mill, CapCut…), vitrine de croissants, flores, câmera Canon, cappuccino, AirPods, celular, óculos e um **MacBook aberto no centro**. Vários objetos têm um botão "+" (hotspot). Os hotspots têm nomes temáticos: "go here for coffee", "say cheese", "what's in my cup", "press play", "the pastry case", "what's on the table", "say hi".
6. **O desktop (ao clicar no laptop):** a tela do Mac ocupa o navegador inteiro. Tem barra de menu macOS (Finder, File, Edit…, relógio real), papel de parede de montanha com frase manuscrita, **6 pastas azuis à direita** (Harvard Marketing Group, Harvard Student Agencies, The Harvard Shop, Crimson Creators, ThirdLayer, Fun Endeavors), uma grade de **15 logos de marcas à esquerda** (LinkedIn, Alex Mill, Larroudé, Bon Me, Everyday Dose, poppi, Red Bull, Astor, Universal, CapCut, Undercover, Jobright, MIRA, Crebit, Xf) e um **dock** com ícones (Finder, Safari, Chrome, Messages, Mail, Notes, Photos, Music, Settings, Lixeira). Botão "voltar para a cafeteria" no canto superior esquerdo.

### Interações que existem (verificado)

- **Pastas abrem uma janela estilo macOS** (três bolinhas, título da pasta) com um case completo dentro, rolável: título do cargo ("Co-Founder / President"), parágrafo de contexto, grade de posts do Instagram, colagem de objetos da campanha, seções com eyebrow ("PHASE I · THE PARTY", "PHASE II · THE TAKEOVER"), métricas em destaque ("600 hand-delivered letters", "393 Partiful RSVPs", "20+ clients within a year", "2026 Outstanding New Organization").
- **O Chrome do dock abre um navegador falso** com 4 abas: LinkedIn, Substack, Instagram (@juliasalvarenga) e "the yard" (link externo real). Cada aba é uma **réplica estática em HTML** da rede (header do LinkedIn com capa, foto, "23,341 followers"; perfil do Instagram com contadores e grade de reels). Dá para trocar de aba e rolar a grade. **Não é embed real** — é uma recriação visual com imagens dela.
- **Os 15 logos de marcas na área de trabalho NÃO são clicáveis** (testei clicando em "poppi": nada abriu; na árvore de acessibilidade só existem botões para as 6 pastas, o Chrome e os hotspots da cafeteria). Funcionam como "wall of logos", não como projetos.
- Os ícones do dock além do Chrome aparentam ser decorativos (só o Chrome está registrado como botão).
- Hover nas palavras em negrito da bio **[INTERPRETADO]**: a instrução existe; não testei o conteúdo do hover.

### Como os projetos são apresentados (verificado)

Cada pasta = um cliente/organização. Dentro, um case narrativo em formato de "janela": contexto → fases da campanha com imagens reais → resultados em números grandes. Só 6 projetos têm case; o resto é logo.

### Como as informações profissionais estão organizadas

Não há currículo, lista de competências ou certificações. O LinkedIn falso dentro do Chrome é o único ponto "formal". A credibilidade vem do volume de marcas e dos cases.

### Recursos técnicos (parcialmente verificado)

- **[VERIFICADO]** o HTML tem atributos que o Next.js costuma injetar (`meta name="next-size-adjust"`), então provavelmente é **Next.js/React**. Não confirmei o framework de animação.
- **[INTERPRETADO]** as cenas de scroll (objetos entrando, caneca, avatar pulando) parecem animações de scroll-trigger (GSAP ScrollTrigger ou Framer Motion com `useScroll`); a cafeteria parece uma imagem composta com hotspots posicionados por coordenadas percentuais; o desktop e as janelas são componentes React com estado (janela aberta/fechada); o "Chrome" é um componente com abas e conteúdo estático.
- Fontes: sem-serif geométrica (parece Outfit/Jost) + manuscrita no logo.
- Sem backend aparente; todo o conteúdo é estático.

### O que vale a pena adaptar

- A **metáfora espacial** (um lugar que é "a cabeça" dela) em vez de uma landing page. Para a Cami, o lugar precisa ser outro — não um café.
- **Pasta = cliente, janela = case** com contexto, imagens reais e números grandes. Esse padrão é exatamente o que casa com a exigência de resultados.
- **Navegador falso com abas** para redes sociais: funciona, é estável (nada depende de API) e dá a sensação de "estar navegando". Só precisa de um botão claro "abrir perfil real".
- **Um relógio real na barra de menu** e detalhes vivos (pequenos truques que fazem o desktop parecer de verdade).
- **Hotspots com nomes criativos** ("say cheese" para fotos, "press play" para vídeos).

### O que evitar

- **Intro longa:** são 4 cenas de scroll antes de chegar em qualquer conteúdo. A Cami pediu explicitamente para não ter isso.
- **Logos decorativos não clicáveis:** o visitante tenta clicar e nada acontece; frustra e desperdiça credibilidade. Se uma marca está na área de trabalho, tem que abrir algo (mesmo que seja um card curto).
- **Ausência de competências/certificações/experiência:** para recrutadores isso é um buraco.
- **Nenhum caminho "rápido":** não há menu ou atalho para quem só quer ver os trabalhos.
- **Dependência de uma ilustração única e cara** (a cafeteria é uma arte composta sob medida). Para a Cami, precisamos de uma cena que seja construída em código/CSS ou com fotos próprias dela, para ser editável depois.

### Dificuldades técnicas prováveis

- Cena com hotspots posicionados por coordenadas quebra fácil em telas diferentes; precisa de `aspect-ratio` fixo + posições em %.
- Janelas sobrepostas, foco de teclado e acessibilidade (leitor de tela precisa entender "janela aberta").
- Réplicas de redes sociais ficam desatualizadas (número de seguidores "congelado"). Solução: números em arquivo de dados com data de atualização.
- Mobile: um desktop com janelas e dock **não funciona num celular** sem redesenho (texto minúsculo, hotspots pequenos, janelas que não cabem). Precisa de um layout próprio.

### Ideias de aplicação ao portfólio da Cami

Registradas em `direcao-criativa.md` (seção "Propostas").

---

## Referência 2 — Reel do Instagram (compilado de portfólios interativos)

- **Link:** https://www.instagram.com/reels/DauzoEdoYSP/
- **Status:** **NÃO ASSISTIDO.** Tentei de duas formas: a ferramenta de leitura de páginas foi bloqueada pelo Instagram (robots) e o seu Chrome não tem permissão para a extensão abrir instagram.com. Não vou inventar a análise.
- **O que preciso:** gravação de tela do reel (mp4/mov) ou screenshots, ou a lista dos portfólios mostrados (nomes/links) — aí eu abro cada um e documento.
- **Critérios que já ficaram definidos a partir do que você descreveu** (e que vou aplicar quando analisar): aceitar surpresas pontuais, pequenas animações e navegação que desperta curiosidade; rejeitar intro longa, animação obrigatória antes do conteúdo e navegação confusa.

---

## Referência 3 — Sofia Valdez (portfólio de marketing)

- **Link:** https://mktgportfolio.com/sofia-valdez/#social-media
- **Nome:** Sofia's Marketing Portfolio (Sofia Valdez 2026)
- **Perfil dela:** estudante de marketing (Santa Clara University), estagiária de marketing digital na Sky Society.
- **Status:** desktop **[VERIFICADO]**; mobile **[NÃO VERIFICADO]**.

### Como funciona a navegação (verificado)

Página única, rolagem vertical longa, sem menu fixo visível. Ordem das seções:

1. Hero: cartão rendado ("doily") com o título "marketing portfolio" (animação de entrada).
2. "YOUR NEXT HIRE!" + "Hi I'm Sofia" com foto dentro de uma câmera Sony digital ilustrada + 3 parágrafos de bio.
3. "MARKETING EXPERIENCE": 5 cards arredondados com ilustrações estilo aquarela (email marketing, social media, paid ads & virtual events, influencer marketing, seo & copywriting), cada um com botão "VIEW WORK" que leva à âncora da seção.
4. "SKILLS & CERTS": grade de logos de ferramentas (Office, Semrush, beehiiv, monday, HubSpot, Google Analytics, Slack, Notion, CapCut, Canva, G Suite, redes) + 4 certificados em molduras douradas sobre papel de parede listrado + lista textual das certificações.
5. Seções por competência, cada uma com fundo de cor diferente e mockup de dispositivo (celular, laptop, monitor):
   - **Email marketing:** "63.32% OPEN RATE", "2.12% CTR", newsletter para "31,000 subscribers" no beehiiv.
   - **Social media:** dois celulares com stories/reels; "1.1K interactions on one Instagram story".
   - **SEO & copywriting:** blog post otimizado com Semrush "NOW RANKED 2ND ON GOOGLE'S FRONT PAGE!", press release, botão "READ ME!".
   - **Influencer marketing:** mockups de perfis de micro-influencers; "10+ micro influencers… 2 unpaid partnerships", "15+ micro-influencers… gifted partnership".
   - **Paid ads:** anúncio no Canva, público-alvo descrito, "CPC $0.25, 64% lower than industry standard of $0.70".
   - **Virtual events:** workshop de nostalgia marketing para a Skims, "200+ attendees", botão "VIEW ME!".
6. "LET'S CONNECT!" sobre textura de couro de crocodilo, com cidade, telefone, LinkedIn e e-mail.

### Interações (verificado)

Quase nenhuma: botões de âncora, um vídeo embutido (há um "seek bar" na árvore de acessibilidade), links externos. Animações de entrada simples. Nada de hover rico ou estado.

### Como os projetos são apresentados

Por **competência**, não por cliente. Cada seção = uma habilidade, com 1–3 "mini cases" descritos em frases curtas em caixa alta, mockup de dispositivo e a métrica em destaque.

### Como as informações profissionais são organizadas

Bio → competências → ferramentas + certificados (visualmente, como diplomas na parede) → evidências por competência → contato. É um currículo visual.

### Recursos técnicos (verificado)

A meta tag `app-name: export_website` e a estrutura de assets (`/_assets/images/`) indicam **exportação de uma ferramenta de design** (padrão de export do Canva Websites ou similar). Tudo é imagem posicionada; textos em caixa alta são parte do design. Consequência: pouco acessível, pesado e difícil de editar.

### O que vale a pena adaptar

- **A estrutura "competência → evidência → métrica"**. Cada competência tem pelo menos um número concreto.
- **Métricas com comparação** ("64% lower than the industry standard"). Um número sozinho vale menos que um número com contexto.
- **Certificações tratadas como objetos** (molduras na parede) em vez de lista — a ideia é boa, a execução é literal demais.
- **Grade de ferramentas** como prova rápida de competência técnica.
- **Mockups de dispositivos** para mostrar conteúdo de rede social no contexto real.

### O que evitar (verificado e alinhado com o que você disse)

- Estilo de ilustração aquarela/"girly" e texturas (renda, couro, papel de parede).
- Blocos de texto em caixa alta, longos, sem hierarquia.
- Visual de apresentação exportada: cada seção parece um slide.
- Seções muito altas com uma única informação (muito scroll para pouco conteúdo).
- Mistura de 6+ paletas (uma cor por seção sem sistema).
- Dados de contato pessoais (telefone) expostos em texto puro.

### Dificuldades técnicas

Nenhuma relevante para a Sofia; para nós, a lição é o oposto: tudo que a Sofia fez em imagem, nós fazemos em **componentes com dados** (métrica = componente, certificado = componente, case = template).

### Ideias de aplicação

Ver `direcao-criativa.md`.

---

## Resumo cruzado (o que cada uma ensina)

| Princípio | Júlia | Sofia | Vamos fazer |
| --- | --- | --- | --- |
| Metáfora do espaço | sim (café + Mac) | não | sim, com um espaço nosso |
| Projeto por cliente | sim (pastas) | não | sim (pastas) |
| Organização por competência | não | sim | sim (uma camada acima das pastas) |
| Métricas | dentro dos cases | em toda seção | em toda seção **e** num painel agregado |
| Certificações/formação | ausentes | presentes, literais | presentes, como "app" ou objeto do espaço |
| Redes sociais | Chrome falso com abas | mockups estáticos | Chrome falso com abas + botão para o perfil real |
| Tempo até o conteúdo | ~4 telas de scroll | imediato | imediato, com surpresa opcional |
| Mobile | não verificado | não verificado | experiência própria (tela inicial de celular) |
