#!/usr/bin/env python3
"""Gera a pasta de entrega e a versão do Artifact a partir do site-fonte.

Uso:  python3 build_entrega.py PASTA_DO_SITE PASTA_DE_ENTREGA PASTA_DO_ARTIFACT
Antes, rode `python3 build.py` dentro da pasta do site (gera o index.html com os textos PT/EN).
Requer esbuild:  mkdir -p /tmp/esb && cd /tmp/esb && npm init -y && npm install esbuild
"""
import re, subprocess, shutil, os, sys, json
E = os.environ.get('ESBUILD', '/tmp/esb/node_modules/.bin/esbuild')
site, entrega, art = sys.argv[1:4]
os.makedirs(entrega + '/img', exist_ok=True); os.makedirs(art, exist_ok=True)
h = open(site + '/index.html').read()
css = re.sub(r'@font-face\s*\{[^}]*\}', '', open(site + '/styles.css').read())
js = open(site + '/app.js').read(); cfg = open(site + '/config.js').read()
mcss = subprocess.run([E, '--minify', '--loader=css'], input=css, capture_output=True, text=True).stdout
mjs = subprocess.run([E, '--minify', '--target=es2018'], input=js, capture_output=True, text=True).stdout
open(entrega + '/styles.min.css', 'w').write(mcss); open(entrega + '/app.min.js', 'w').write(mjs)
shutil.copy(site + '/config.js', entrega + '/config.js')
for f in os.listdir(site):
    if f.endswith('.html') and f != 'index.html' and not f.endswith('.tpl.html'): shutil.copy(site + '/' + f, entrega + '/' + f)
    if f.endswith('.jpg'): shutil.copy(site + '/' + f, entrega + '/' + f)
used = sorted(set(re.findall(r'img/([\w-]+\.webp)', h + js)))
for f in os.listdir(entrega + '/img'):
    if f not in used: os.remove(entrega + '/img/' + f)
for u in used: shutil.copy(site + '/img/' + u, entrega + '/img/' + u)
open(entrega + '/index.html', 'w').write(h.replace('href="styles.css"', 'href="styles.min.css"').replace('src="app.js"', 'src="app.min.js"'))
a = h.replace('<link rel="stylesheet" href="styles.css">', '<style>' + mcss + '</style>')
a = a.replace('<script src="config.js"></script>', '<script>' + cfg + '</script>').replace('<script src="app.js"></script>', '<script>' + mjs + '</script>')
open(art + '/index.html', 'w').write(a)
print('artifact html', len(a) // 1024, 'KB; imagens usadas:', len(used))
print('files p/ Artifact:', json.dumps({'img/' + u: 'img/' + u for u in used}))
