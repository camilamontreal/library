# Checklist de publicação

## Antes de publicar

- [ ] `npm test` passa.
- [ ] `node scripts/check-content.mjs --strict` passa (zero itens de exemplo, zero mídias faltando). Se algo for ficar como exemplo de propósito, pelo menos saiba o quê.
- [ ] `npm run test:e2e` gera as capturas em `shots/` sem erro de console; olhe as 3 larguras e o modo escuro.
- [ ] Fotos ≤ 400 KB cada (use WebP), vídeos ≤ 4 MB cada. Total de `public/media` idealmente < 40 MB.
- [ ] `profile.json` → `whatsapp` vazio, a não ser que a Cami queira expor.
- [ ] Links das redes abrem o perfil certo (teste os 5 do navegador).
- [ ] `index.html`: `<title>`, `lang` e meta description corretos (ver abaixo).
- [ ] Favicon em `public/favicon.svg` (hoje não há; crie um "C" ou o avião).

## Meta tags (editar `site/index.html`)

```html
<html lang="en">
<title>Camila Montreal — Travel creator & social media strategist</title>
<meta name="description" content="600K+ community, 290M+ views, 50+ brand partners. Portfolio of Camila Montreal, Montreal-based travel creator and social media strategist.">
<meta property="og:title" content="Camila Montreal — Portfolio">
<meta property="og:image" content="https://portfolio.camilamontreal.com/og.jpg">  <!-- crie public/og.jpg 1200×630 -->
```

## Onde hospedar (sem custo)

O site é estático: `npm run build` gera `dist/`. Qualquer hospedagem de arquivos estáticos serve.

**Opção A — Vercel (recomendada).** `npm i -g vercel && cd site && vercel` (ou conecte o repositório Git no painel). Build command `npm run build`, output `dist`. Depois, em Settings → Domains, adicione `portfolio.camilamontreal.com`.

**Opção B — Netlify.** Arraste a pasta `dist/` em app.netlify.com/drop, ou conecte o Git. Domínio em Site settings → Domain management.

**Opção C — GitHub Pages.** `BASE=/<repo>/ npm run build` e publique `dist/` na branch `gh-pages`. Para domínio próprio, arquivo `public/CNAME`.

## Domínio: o site atual é Wix

O Wix não hospeda um site estático de terceiros numa subpasta (`camilamontreal.com/portfolio` continuará sendo uma página Wix). Caminhos possíveis:

1. **Subdomínio (recomendado):** no painel do Wix → Domínios → DNS, crie um registro `CNAME` `portfolio` apontando para o host da Vercel/Netlify (eles mostram o valor exato). Em 10–60 min `portfolio.camilamontreal.com` está no ar com HTTPS automático. No Wix, troque o link do menu "Portfolio" para esse subdomínio.
2. **Substituir o site inteiro:** apontar o domínio raiz para a Vercel; os roteiros/presets/e-books teriam que migrar ou ficar num subdomínio `loja.` — decisão da Cami.
3. **Subpasta de verdade** só se o domínio raiz sair do Wix e um proxy (Vercel rewrites) servir `/portfolio` deste projeto e o resto de outro lugar. Mais complexo; só se ela fizer questão da URL exata.

## Depois de publicar

- [ ] Abrir no celular real (iPhone e Android): tela de bloqueio, toque, navegação, vídeos mudos tocando.
- [ ] Testar modo escuro do sistema.
- [ ] Testar os 3 idiomas.
- [ ] Lighthouse (Chrome DevTools): desempenho e acessibilidade ≥ 90. Se a nota cair por causa do JS inicial, dividir os apps com `React.lazy`.
- [ ] Atualizar a bio das redes com o link.
- [ ] Marcar no calendário: atualizar os números em `networks.json` e `profile.json → heroStats` a cada 3 meses (`updatedAt` e `period` juntos).
