# Ícones e Dock

Os ícones de app são **desenhos originais em SVG** (`site/src/ui/appicons.tsx`), na linguagem visual do macOS/iOS: forma "squircle" (curvatura contínua), luz vinda de cima, gradientes suaves, brilho sutil no topo, contorno fino e detalhes próprios de cada app. São vetores, então ficam nítidos de 16 px a telas retina.

## Por que não usamos os ícones oficiais da Apple
Os ícones dos apps da Apple (Notas, Mensagens, Fotos, Mapas…) são marcas e obras protegidas. As diretrizes da Apple para uso de marcas e direitos autorais pedem **permissão por escrito** para usar ícones e gráficos da empresa, e os modelos do Apple Design Resources servem para criar apps para as plataformas da Apple, não para reproduzir os ícones dela num site. Por isso cada ícone aqui é redesenhado do zero, reconhecível pela mesma ideia visual (ex.: Notas = papel pautado com faixa amarela; Mensagens = balão branco sobre verde), sem copiar arquivos nem arte.

- **Google Chrome**: o ícone do navegador usa o anel vermelho/verde/amarelo com centro azul, que é a marca do Chrome (do Google). É um redesenho próprio, mas a marca é do Google. Se preferir evitar, troque por outro navegador genérico em `SPECS.browser` (ex.: `SAFARI`).
- Redes sociais (Instagram, TikTok, YouTube, LinkedIn) seguem o mesmo princípio: desenhos próprios que lembram as marcas, que pertencem às respectivas empresas.

## Como funciona
- `AppIcon id size` renderiza qualquer ícone; `size="100%"` preenche o contêiner (usado no Dock para a ampliação).
- Cada app tem uma entrada em `SPECS` (cores do fundo + desenho). Para trocar um ícone, edite só essa entrada.
- **Calendário** mostra o dia e o dia da semana reais (no idioma do visitante).
- **Lixeira** no Mac é o cesto de metal, sem ladrilho (como no macOS); no celular usa `trashTile`.
- No iPhone, o dock usa **Arquivos** (pasta azul), como no iOS, no lugar do Finder.

## Dock (`site/src/os/desktop/Dock.tsx`)
Vidro translúcido, ampliação por proximidade do cursor (mola suave), indicador de app aberto, ícone que salta ao abrir um app que ainda não está aberto, dica com o nome acima do ícone (também aparece ao focar com o teclado) e separador antes da Lixeira. Respeita "reduzir movimento" (sem ampliação nem salto). O tamanho base muda com a largura da tela (58, 50 ou 42 px).

## Capturas antes/depois
Em `docs/capturas-icones/`: `antes-*` e `depois-*` do Dock (em repouso e com 2 apps abertos + cursor sobre um ícone), da tela inicial do iPhone, em claro e escuro, e o catálogo dos ícones em 150, 32 e 16 px.
