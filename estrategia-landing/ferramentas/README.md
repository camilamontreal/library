# Ferramentas usadas nas landing pages

Todas foram usadas para construir a página de Nova York. Rodam neste ambiente (Playwright e Chromium já instalados).

| Arquivo | O que faz |
|---|---|
| `build_entrega.py` | Compacta CSS/JS (esbuild), copia só as imagens usadas e gera: a pasta de entrega e o `index.html` único para o Artifact. Imprime o mapa `files` para publicar. |
| `checar.mjs` | Abre a página em PT/EN, celular/desktop e acusa erro de JavaScript, rolagem lateral, imagem quebrada e 404. |
| `secao.mjs` | Rola até um seletor e tira uma captura de tela, para revisar uma seção. |
| `desfocar_paginas_pdf.py` | Renderiza páginas do PDF do guia em webp e **desfoca só o texto corrido**, deixando títulos e fotos nítidos (assim a espiada não entrega o conteúdo). |
| `podar_css.py` | Remove do CSS as regras e animações que não aparecem mais no HTML/JS. |

## Preparação (uma vez por sessão)

```bash
# esbuild (compactação)
mkdir -p /tmp/esb && cd /tmp/esb && npm init -y && npm install esbuild
# para o checar.mjs e secao.mjs acharem o playwright
ln -s /opt/node22/lib/node_modules /home/user/library/estrategia-landing/ferramentas/node_modules
```

## Fluxo de cada atualização

1. Editar `index.tpl.html`, `styles.css`, `app.js`, `build.py` (textos PT/EN) e `config.js`.
2. `cd pasta-do-site && python3 build.py` (gera o `index.html` com os textos nos dois idiomas).
3. `node ferramentas/checar.mjs file:///.../index.html`
4. `node .claude/skills/taste-skill/scripts/lint.mjs pasta-do-site` e o `inspect.mjs` (ver PLAYBOOK).
5. `python3 ferramentas/build_entrega.py pasta-do-site pasta-de-entrega pasta-do-artifact`
6. Publicar o Artifact com o mapa `files` impresso, depois `git add -A && git commit && git push`.

## Cuidados que já nos pegaram

- `desfocar_paginas_pdf.py`: o limite de altura de linha (18,9 a 20,2 pt) vale para os PDFs de Nova York. Confira nas páginas de Paris com `pdftotext -bbox-layout` e ajuste.
- Imagens de página: nunca aplicar `filter: blur` no CSS sobre a imagem inteira. O desfoque já está dentro do arquivo.
