# Playbook: landing pages dos guias da Camila Montreal

Documento de passagem. Resume tudo que foi decidido e aprendido ao construir a página de **Nova York** (versão final = `site-v9/`, entrega em `entrega-nova-york/`), para a página de **Paris** (e as próximas) começarem do ponto em que Nova York terminou, sem refazer discussões.

> Se você é uma nova sessão do Claude: leia este arquivo inteiro, depois `nova-york.md` (estratégia e copy aprovadas), depois o `LEIA-ME.md` de `entrega-nova-york/`. Só então converse com a Camila.

---

## 1. Como trabalhar com a Camila

- **Ela escreve em português.** Responda sempre em português do Brasil, sem jargão técnico solto.
- **Toda pergunta ou necessidade vai em pop-up** (`AskUserQuestion`). Foi pedido explicitamente. Use opções claras, com a recomendada primeiro.
- **Ela comenta direto no Artifact** (balões de comentário). Leia com `ArtifactComments action:"read"` (pagine com `cursor`). Comentários de versões antigas aparecem como "carried from an earlier version". Eles só mudam de estado quando ela os envia para o Claude, então liste o que é novo olhando as datas e a ordem (mais recentes primeiro).
- **Ela dita feedback por voz**, então as frases chegam picotadas. Quando um comentário estiver ambíguo (por exemplo, preso à página inteira sem apontar a seção), **pergunte por pop-up com as seções como opções** antes de mexer.
- **Ela vê a página no celular.** Teste no celular (390 px) tanto quanto no desktop. Dois bugs só apareceram lá (ver seção 6).
- **Ritmo que funcionou:** estratégia e copy aprovadas primeiro, depois design, depois rodadas curtas de comentário → ajuste → publicação no mesmo link.
- **Nunca invente** depoimento, número, estatística, escassez ou promessa. Tudo precisa vir dela ou do guia. Marque dúvida como `[A CONFIRMAR]` e pergunte.
- **Não crie PR** a menos que ela peça. Faça commit e push na branch da sessão. Termine commits com as linhas de atribuição que o sistema pedir.
- **Honestidade nos resultados:** se algo não foi testado (por exemplo, celular físico), diga.

## 2. Processo recomendado para uma nova página

1. **Receber o material:** PDF desktop e PDF celular do guia (ela envia). Extrair imagens (`pdfimages`) e texto.
2. **Estratégia e copy (sem código):** aprovar com ela estrutura de seções, headline, preço, garantia, FAQ, autoridade. Usar `nova-york.md` como molde. **Só depois do "fechada, pode ir para o design" começa o design.**
3. **Pedir identidade visual do guia novo.** O PDF de Paris tem cores e tipografia próprias: leia o PDF e extraia a paleta. Não presuma que é igual à de Nova York.
4. **Brainstorm criativo por pop-up** (tema, aberturas, personagens, interações), com opções para ela aprovar.
5. **Construir a partir de `site-v9/`** (copiar a pasta, trocar conteúdo e tema). Ver seção 5.
6. **Rodadas de comentário** no Artifact até ela dizer que fechou.
7. **Otimização, medição, termos e entrega** (seção 7).

## 3. Decisões de produto e comercial (valem para todos os guias, salvo aviso)

- **Produto:** PDF interativo, entregue por **link enviado por e-mail** após a confirmação do pagamento. Vem em **duas versões**: desktop (para planejar) e celular (para consultar na viagem). Ambas podem ser baixadas para uso offline (links e vídeos precisam de internet).
- **Atualizações gratuitas** pelo mesmo link. **Garantia de 7 dias** (comunicar de forma discreta, não pedir reembolso na cara da cliente).
- **Links com desconto** pagam comissão à Camila dependendo do parceiro. Aviso genérico de transparência no rodapé e no FAQ.
- **Preço Nova York:** R$ 67,90 à vista (até 9× com juros a partir de 2×, Pix, cartão, boleto, PayPal) e CAD 21 no exterior (cartão, PayPal, Klarna). **Confirmar a moeda internacional** (CAD ou USD). Preço de Paris: perguntar.
- **Dois checkouts, um por idioma.** O botão PT/EN no topo troca textos, preço e link de checkout. Não existem dois botões de preço.
- **Roteiro adaptável**, nunca "roteiro de 4 dias". O guia é organizado por **região/bairro**; a pessoa monta os dias que tiver. Evitar "Dia 1, Dia 2" nos títulos e imagens públicas.
- **Autoria (Nova York):** 32 anos, 38 países, mora em Montreal (Canadá) há 4 anos, seguidores 600 mil+, "perdi a conta de quantas visitas" a NY, leva grupos de viagem pelo mundo e ama compartilhar experiências. Não citar formação em Marketing. **Para Paris, perguntar o que se aplica** (quantas vezes foi, há quanto tempo, o que a liga à cidade).
- **Depoimentos:** só os reais e aprovados (10 de Nova York em `site-v9/index.tpl.html`). Paris precisa dos seus próprios, enviados por ela.
- **Cupom:** `CAMILAMONTREAL5` aparece nas páginas do guia. Fica borrado na espiada.
- **Dados de contato nos termos:** razão social Camila Montreal, e-mail hello@camilamontreal.com. Contato rápido via `ig.me/m/camilamontreal`.
- **Regra de copy:** vender sem entregar as dicas. Falar do assunto, nunca da instrução ("Um segredo numa estação famosa", não qual).

## 4. Decisões de design (Nova York) e o que ela gostou ou rejeitou

### Identidade e tom
- **Base visual = identidade do próprio guia**: azul-acinzentado e azul-marinho (`#f7f9fa`, `#e9eff1`, `#2e3052`, `#4f6f95`, `#93b6be`, `#d8e2e6`) com verde-água `#31a593`; fonte **Montserrat**. Cores de linha do metrô só em bolinhas, ícones e detalhes. **Nada de seção inteira laranja/amarela/preta** ("carnaval").
- **Conceito:** metrô da cidade como fio condutor, **criativo mas leve** (CSS/SVG, sem vídeo, imagens pequenas em webp).
- Referências dela: páginas da Julia Alvarenga, The Yard (thecollegeyard.com), e as suas `/nyc2026` e `/ny` (ela gostou: cabeçalho impactante com a cidade atrás, explicação antes do produto, menu de dias com prévia, caixinhas do que está incluso, vision board, estátua saindo entre seções, troca de idioma, muitas fotos dela, banner de atualizações grátis).

### Estrutura final (ordem das seções)
1. Abertura com a foto aérea da cidade ("O guia perfeito de Nova York" + "roteiro completo, adaptado para quantos dias você tiver")
2. "O que é este guia?" (+200 locais, +20 locações, +60 paradas, + ideias extras)
3. Faixa "Dentro do guia": rua cinza com táxi que passa uma vez, dicas superficiais que giram, botão "Mais dicas"
4. "Por onde você quer começar?": mapa de linhas + grid de fotos por região + paradas em formato de linha de metrô
5. "Uma espiada por dentro": folheador de 6 páginas do guia (texto corrido borrado, títulos e fotos nítidos)
6. "Duas versões do mesmo guia": 3 quadradinhos animados (desktop com a página inteira, celular rolando, offline com Wi-Fi cortado e avião)
7. "O que está incluso?": **skyline de 9 prédios** que sobem ao clicar; King Kong no Empire State avisa "Toque em um prédio" e pula para o escolhido; helicóptero passa sem texto; só ícones nos prédios
8. Placa de metrô de atualizações (bolinhas 1-2-3 que acendem com a mensagem): "Lugar novo? Chega no seu guia, de graça."
9. "Você já se vê lá?": 12 fotos quadradas
10. "Quem já usou o guia": 10 depoimentos em **placas pretas de entrada de metrô**, carrossel
11. "Quanto custa não se planejar?": placas de rua verdes (só esse estilo)
12. "Economize tempo e fuja das filas": slider de hora com dois vagões com pessoas (ilustração, não dado real)
13. "Pare de salvar reels. Comece a planejar."
14. "Quem é a sua guia?": colagem de fotos + 4 números + redes como bolinhas de metrô
15. "Embarque aqui se / Talvez não seja sua linha se"
16. "Garanta o seu guia": foto dela + MetroCard + checklist + card com preço, depoimento, botão que pulsa, selos de pagamento
17. FAQ (10 perguntas) e fechamento
18. Rodapé com bichos (pombo, rato, carrinho de hot-dog) + esquilo no Central Park
19. **Barra de compra no celular** (estilo luz de táxi), só da 5ª seção até a de preço

### Rejeitado ou removido (não repetir sem ela pedir)
- Estátuas da Liberdade desenhadas (ela achou feias, mesmo depois de redesenhar)
- Balão gigante do Thanksgiving; botão e som do metrô; letras de linha (N, R, 4, 7) como bolinhas: **use números** (parecia aleatório para quem nunca foi)
- Texto "Passe o cartão", tarja preta agressiva; MetroCard sobre a foto; celular se mexendo dentro do preço
- Depoimentos logo abaixo da abertura ("muito em cima"); frase "depoimentos enviados por clientes"
- Dicas completas à mostra; "4 dias"; "Planejar leva pouco tempo"; foco em reembolso
- Botão "Eu quero" na barra de cima (o PT/EN precisa ser o destaque)
- Tags de bairros; texto longo em cards; imagens gigantes
- Títulos em duas linhas: **todos os títulos de seção em uma linha** no desktop (`.one`), e a segunda frase de títulos duplos em cor de destaque

### Gostou
Fotos dela em tudo; animações leves e com função (trem na lateral, King Kong ensinando a clicar, pessoas entrando no vagão, táxi na rua); linguagem visual de **placas** (rua, metrô, táxi) para dar variedade; botão que pulsa; esquilo parado; carrinho de hot-dog.

## 5. Arquitetura técnica (copie `site-v9/`)

```
site-v9/
  index.tpl.html   # HTML. Textos viram {{chave|texto em português}}
  build.py         # dicionário EN + gera index.html com window.TXT = {pt, en}
  styles.css       # estilos
  app.js           # interações, dados dinâmicos PT/EN (DYN), medição, troca de idioma
  config.js        # links de checkout, IDs de medição, contato (o que ela edita)
  termos.html, privacidade.html, og.jpg, img/
```

- `{{chave|texto}}` vira `<span data-k="chave">texto</span>`; o EN fica em `build.py` (`EN.update({...})`). **Atenção:** só entra no EN o que também existe no PT. Se escrever HTML estático com `data-k` à mão (sem `{{}}`), o texto some na outra língua. Isso já causou bug (botão da barra em português no modo inglês).
- `app.js` repinta tudo em `applyLang()`. Strings dinâmicas (preço, mapa, dicas, selos) vivem em `DYN.pt` e `DYN.en`.
- **Trem lateral:** `position: sticky` dentro de `.trainwrap` (e a barra colorida é um `::before` do trem). Antes era movido por JavaScript e travava no celular.
- **Revelar ao rolar** (`[data-r]`): `IntersectionObserver` + verificação no scroll (rolagem rápida pula elementos). Imagens com `loading="lazy"` são trocadas para eager 600 ms após o `load` para nunca ficarem em branco.
- **Pausar animações fora da tela:** classe `off-screen` por seção, com **lista explícita de seletores** animados (nunca `*`, que deixa a rolagem pesada).
- **Peso:** webp, fotos de abertura com versão menor para celular (`srcset`), vision board em quadrados pré-cortados. Meta: cerca de 130 KB de código e 750 KB de imagens.
- **Medição:** `config.js` aceita `ga` e `pixel`. Eventos: `view_price`, `click_buy` (vira `InitiateCheckout`), `change_language`, `click_help`. Vazio = nada carregado.
- **Artifact:** um HTML único com CSS e JS inline + imagens em `files`. Publicar sempre no **mesmo link** (`url`), com `label` curto. O Artifact só aceita Google Fonts como fonte externa.

### Qualidade (taste-skill)
```bash
node .claude/skills/taste-skill/scripts/lint.mjs estrategia-landing/<site>
# o inspect precisa de um wrapper do Chromium sem sandbox:
printf '#!/bin/bash\nexec /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox --disable-gpu "$@"\n' > /tmp/chrome.sh && chmod +x /tmp/chrome.sh
CHROME_PATH=/tmp/chrome.sh node .claude/skills/taste-skill/scripts/inspect.mjs estrategia-landing/<site>/index.html --allow eyebrow,covered-text,small-text,statement-length
```
Foi combinado com a Camila de **sobrepor** algumas regras da skill: placas-rótulo (eyebrow), LED fixo cobrindo texto, texto pequeno (rodapé, a pedido), frases longas. O resto deve passar com 0 FAIL. Padrões decorativos como as janelas dos prédios levam `/* taste-skill-ignore */`.

Ferramentas prontas (build, checagem, capturas, desfoque de páginas do PDF, poda de CSS): ver `ferramentas/README.md`.

## 6. Armadilhas já resolvidas (não repetir)

1. **Trem travando no celular:** mover elemento por JavaScript no scroll. Use `sticky`.
2. **Fotos "não carregam" ao rolar rápido:** reveal por IntersectionObserver sozinho + lazy nativo. Use a verificação no scroll e o pré-carregamento.
3. **Texto sumindo no outro idioma:** `data-k` sem `{{}}` (ver seção 5).
4. **Pessoas no vagão aparecendo no canto:** CSS `transform` sobrescreve o atributo `transform` de SVG. Separe em dois `<g>`.
5. **Foto "embaçada" na espiada:** havia `filter: blur` no CSS da imagem inteira. O desfoque deve estar só nas linhas de texto, dentro do arquivo.
6. **Rolagem lateral no celular em inglês:** títulos `nowrap` não cabem em EN. Em telas pequenas, deixe quebrar.
7. **Cobertura de botão com texto claro sobre amarelo:** contraste. Botões são marinho com "portas" verde-água no hover.
8. **Sticky + `overflow:hidden`:** use `overflow: clip`. E `html, body { overflow-x: clip }` para animações que saem da tela.
9. **CSS acumulado de versões antigas:** rode `podar_css.py` e compare capturas antes e depois.

## 7. Entrega

`ferramentas/build_entrega.py` gera a pasta de entrega (como `entrega-nova-york/`) com `LEIA-ME.md` para ela: links no `config.js`, imagem de compartilhamento (`og:image` com endereço completo), termos e privacidade (rascunhos), medição e checklist.

### Segurança (já embutida no build)
`build_entrega.py` gera a pasta endurecida: sem scripts inline (`textos.js`, `boot.js`), CSP restrita (aceita só o próprio site + Google Analytics e Pixel do Meta), cabeçalhos em `_headers`/`vercel.json`/`.htaccess`, fonte própria (`ferramentas/fontes/`), links só `https`, `rel="noopener noreferrer"`, repasse de UTM/fbclid ao checkout, aviso de cookies que só libera a medição após aceite. Teste local com `ferramentas/servir_com_cabecalhos.py`. Regras ao criar páginas novas: **nada de `<script>` inline nem `onclick`**, nada de domínio externo sem incluir na CSP, nenhum dado coletado pela página. Ver `entrega-nova-york/SEGURANCA-E-ANUNCIOS.md` (serve de molde).

## 8. O que falta de Nova York (para a Camila resolver na instalação)

Links de checkout (BR e internacional), moeda internacional (CAD ou USD), e confirmar parcelamento, garantia e atualizações.

## 9. Ideias para adaptar o tema a Paris (a aprovar com ela por pop-up, nada decidido)

Só sugestões para o brainstorm. A Camila decide.

- **Fio condutor:** Métro de Paris. LED "Prochaine station / Próxima estação"; linhas **1 a 14** com as cores oficiais; entradas **Art Nouveau de Guimard** (verde-escuro com letreiro "Métropolitain") no lugar das placas pretas de Nova York; bilhete/cartão **Navigo** ou "t+" no lugar do MetroCard.
- **Skyline → telhados de Paris:** Eiffel, Arco do Triunfo, Sacré-Cœur, Notre-Dame, Pompidou, Louvre (pirâmide). Cada prédio sobe ao clicar, como em NY.
- **Mascote no topo:** ideia de um gárgula de Notre-Dame no lugar do King Kong. **Veículo aéreo:** balão de ar quente ou biplano com faixa. **Táxi:** Citroën 2CV ou bicicleta Vélib'.
- **Bichos de rodapé:** pombo (fica), baguete andando no lugar do rato, carrinho de crepe no lugar do hot-dog.
- **Placas:** placas de rua azuis de Paris (esmalte azul, letras brancas, "Rue de...") para "Quanto custa não se planejar".
- **Foto de abertura:** vista de Paris com ela. Preço e checkout próprios.
- **Cuidado:** a identidade visual do guia de Paris pode ser diferente da de Nova York. Extraia do PDF antes de escolher as cores.
