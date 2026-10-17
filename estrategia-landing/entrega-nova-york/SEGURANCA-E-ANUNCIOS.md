# Segurança e preparação para anúncios

Nenhum site é "100% seguro". O que dá para fazer é reduzir ao mínimo as formas de dar errado. Esta página já nasce com pouca superfície de ataque, porque é estática: não tem banco de dados, login, formulário nem servidor seu para invadir. Abaixo, o que já está feito e o que depende de você.

## 1. O que já está feito na pasta de entrega

| Proteção | O que faz |
|---|---|
| **Sem scripts embutidos na página** | Todo o código vem de arquivos próprios (`app.min.js`, `textos.js`, `boot.js`, `config.js`). Isso permite uma política de segurança bem fechada. |
| **Content-Security-Policy (CSP)** | O navegador só executa código e carrega fontes/imagens do próprio site e, se você ativar a medição, do Google Analytics e do Pixel do Meta. Qualquer outro script injetado é bloqueado. |
| **Cabeçalhos de segurança** (`_headers`, `vercel.json`, `.htaccess`) | Impede que a página seja aberta dentro de outro site (clickjacking), força HTTPS, bloqueia câmera/microfone/localização, limita o que é enviado como origem ao clicar em links. |
| **Fonte Montserrat hospedada por nós** | Nenhuma chamada ao Google Fonts. Mais rápido, melhor para privacidade e a política de segurança fica mais fechada. |
| **Links externos protegidos** | Instagram, TikTok e YouTube abrem com `noopener noreferrer`. |
| **Só links `https`** | O botão de compra e o de contato só seguem links que começam com `https://`. Um valor errado ou malicioso no `config.js` vira `#` e não leva a lugar nenhum. |
| **Aviso de cookies com consentimento** | Se você colocar IDs de Google Analytics ou Pixel, **nada é carregado antes de a pessoa aceitar**. Se recusar, nada é carregado. |
| **Sem coleta de dados** | A página não guarda nada seu. A única memória é o idioma e a escolha do aviso, no navegador de quem visita. |
| **Parâmetros do anúncio repassados** | `utm_*`, `fbclid`, `gclid`, `ttclid` etc. são guardados na sessão e anexados ao link do checkout, para a venda ser atribuída ao anúncio certo. |
| **Termos e privacidade** | Rascunhos com seus dados e a informação sobre medição e consentimento. Revise antes de anunciar. |

## 2. O que depende de você (importante)

1. **Hospedagem com HTTPS.** Netlify, Vercel e Cloudflare Pages já dão HTTPS automático e leem o `_headers` ou o `vercel.json` desta pasta. Em hospedagem comum (cPanel/Apache), o `.htaccess` faz o mesmo. Depois de publicar, confira os cabeçalhos em securityheaders.com (nota esperada: A ou A+).
2. **Proteja o acesso à hospedagem e ao domínio.** É a maior brecha real: se alguém entrar na sua conta, pode trocar o link de checkout por outro. Use senha longa única e **verificação em duas etapas** na hospedagem, no registro do domínio, no e-mail, no Instagram e no checkout.
3. **Cloudflare (grátis) na frente do site.** Dá proteção contra picos de tráfego falso e ataques de negação de serviço, o que importa quando os anúncios trouxerem muita gente de uma vez.
4. **Domínio de e-mail seguro.** Para o `hello@camilamontreal.com` não ser falsificado e seus e-mails não caírem no spam, ative **SPF, DKIM e DMARC** no provedor do domínio.
5. **Proteja o PDF.** Quem entrega o guia é a plataforma de checkout. Confirme que o link do PDF só chega a quem comprou e peça à plataforma, se tiver, para limitar acessos ou usar marca d'água. Não deixe o link do guia em lugares públicos.
6. **Só você edita o `config.js`.** Mantenha esse arquivo fora de repositórios públicos.

## 3. Anúncios (Meta e Google)

### Regras da página (já atendidas)
- Política de privacidade e termos acessíveis no rodapé, contato visível, página que carrega rápido, sem pop-up agressivo, sem som automático, sem redirecionamento escondido.
- O que a página promete é o que o guia entrega (sem escassez falsa, sem números inventados). Os depoimentos são reais e autorizados.

### Cuidados com o texto dos anúncios
- Não prometa resultado garantido nem diga o que a plataforma não permite. Evite "você vai economizar X reais" sem prova. Mantenha o tom "organize sua viagem".
- Não use a foto de outras pessoas nem marcas sem autorização.
- Mantenha o preço e a garantia dos anúncios iguais aos da página.

### Medição, em 4 passos
1. No `config.js`, preencha `ga` e/ou `pixel`.
2. Publique de novo. O aviso de cookies aparece para quem visitar.
3. Confira com o **Meta Pixel Helper** (extensão do navegador) e com o relatório em tempo real do Google Analytics.
4. A **compra** só pode ser medida no checkout: ative o Pixel e a API de Conversões (ou a tag do Google) dentro da plataforma de checkout. A página mede até o clique em "comprar" (`click_buy`).

### Nomes de campanha (UTM)
Use sempre a mesma convenção para ver os resultados organizados, por exemplo:
`?utm_source=meta&utm_medium=cpc&utm_campaign=ny-lancamento&utm_content=reels-01`

### Verificação do domínio no Meta
Se o Meta pedir, adicione a metatag `facebook-domain-verification` no `<head>` do `index.html` ou o registro DNS que ele indicar. Eu posso incluir.

## 4. Se você ativar a medição, ajuste dois pontos
- A política de segurança já aceita os domínios do Google Analytics e do Pixel do Meta. **Não** aceita outros. Se for usar mais uma ferramenta (por exemplo TikTok Pixel), é preciso incluir o domínio dela na política (nos arquivos `_headers`, `vercel.json`, `.htaccess` e na metatag do `index.html`).
- Confira a `privacidade.html`: ela já descreve a medição e o consentimento.

## 5. Checklist antes de ligar o primeiro anúncio

- [ ] Site no ar em HTTPS e com nota A no securityheaders.com
- [ ] Links de checkout (BR e internacional) testados nos dois idiomas
- [ ] Compra de teste concluída e e-mail com o guia recebido
- [ ] Verificação em duas etapas ativa em hospedagem, domínio, e-mail, Instagram e checkout
- [ ] SPF/DKIM/DMARC configurados para `hello@camilamontreal.com`
- [ ] Cloudflare (ou equivalente) na frente do site
- [ ] Pixel/Analytics ativados e testados; compra medida no checkout
- [ ] Termos e privacidade revisados por um profissional
- [ ] Página testada no celular real, em 4G, nos dois idiomas
- [ ] Anúncios com as mesmas promessas, preço e garantia da página

## 6. O que continua fora do alcance da página
- Fraude de cartão, estorno e contestação são tratados pela plataforma de pagamento.
- Bots que clicam nos anúncios (cliques inválidos) são controlados pela própria plataforma de anúncios e pela Cloudflare.
- Se algum dia houver cadastro, conta de cliente ou área de membros, será preciso um back end e uma revisão de segurança à parte.
