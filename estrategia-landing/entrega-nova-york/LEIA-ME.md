# Página do guia de Nova York: como publicar

Esta pasta está pronta para subir em qualquer hospedagem de site estático (Netlify, Vercel, Cloudflare Pages, o seu site, etc.). Não precisa instalar nada.

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `index.html` | A página |
| `config.js` | **O único arquivo que você precisa editar** (links, medição, contato) |
| `styles.min.css`, `app.min.js` | Estilo e funcionamento, já compactados. Não mexa |
| `img/` | Fotos da página |
| `og.jpg` | Imagem que aparece quando o link é enviado no WhatsApp ou Instagram |
| `termos.html`, `privacidade.html` | Rascunhos das páginas de termos e privacidade |

## 1. Colocar os links de checkout

Abra o `config.js` e troque os dois links:

```js
buy: { pt: "https://LINK-DO-CHECKOUT-BRASIL", en: "https://LINK-DO-CHECKOUT-INTERNACIONAL" },
```

- `pt` é o link que o botão usa quando a página está em português (R$ 67,90).
- `en` é o link usado quando a página está em inglês (preço em CAD 21; confirme a moeda).
- Os dois valem para o botão grande, para a barra de compra no celular e para o redirecionamento.

Se o preço internacional for em USD, avise ou troque `CAD 21` por `USD 21` no texto do app (procure `price: "CAD 21"` em `app.min.js`, ou me peça para ajustar).

## 2. Contato

Ainda no `config.js`, a linha `contact` define o link do "Dúvidas? Fale comigo no Instagram". Hoje abre a conversa em `ig.me/m/camilamontreal`. Pode trocar por WhatsApp ou e-mail (`mailto:...`).

## 3. Termos e privacidade

Abra `termos.html` e `privacidade.html` e preencha tudo que está marcado de amarelo: nome ou razão social, CPF/CNPJ, e-mail de contato e data. São textos-base e devem ser revisados por um profissional antes de valerem como definitivos.

## 4. Imagem de compartilhamento (WhatsApp/Instagram)

No `index.html`, procure a linha com `og:image` e troque `content="og.jpg"` pelo endereço completo da imagem depois de publicar, por exemplo:

```html
<meta property="og:image" content="https://seusite.com/nova-york/og.jpg">
```

Sem o endereço completo, algumas redes não mostram a imagem.

## 5. Medição de cliques (opcional)

Ainda no `config.js`:

```js
ga: "G-XXXXXXXXXX",      // ID do Google Analytics 4
pixel: "123456789012345" // ID do Pixel do Meta
```

Deixando vazio, nada é carregado. Com os IDs, a página envia estes eventos:

- `view_price`: a pessoa chegou na seção de preço.
- `click_buy`: clicou em comprar (no card ou na barra do celular). No Pixel do Meta vira `InitiateCheckout`.
- `change_language`: trocou entre PT e EN.
- `click_help`: clicou em "Dúvidas? Fale comigo".

Se ativar a medição, mantenha o item correspondente na `privacidade.html`.

## 6. Checklist antes de divulgar

1. Abrir a página no celular e no computador, em português e em inglês (botão PT/EN no topo).
2. Clicar em **Comprar** nos dois idiomas e confirmar que cada um abre o checkout certo.
3. Conferir o preço nos dois idiomas.
4. Abrir `termos.html` e `privacidade.html` e ver se não sobrou nenhum campo amarelo.
5. Enviar o link para você mesma no WhatsApp e ver se a imagem de compartilhamento aparece.
6. Rolar a página inteira no celular e ver se todas as fotos aparecem.

## Peso da página

Cerca de 130 KB de código e 750 KB de imagens. As fotos são pré-carregadas depois que a página abre, para não ficarem em branco na rolagem.
