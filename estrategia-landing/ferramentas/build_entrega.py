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
# ---- versão de entrega endurecida: sem scripts inline, fonte própria, cabeçalhos de segurança ----
here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(entrega + '/fonts', exist_ok=True)
shutil.copy(here + '/fontes/montserrat-latin.woff2', entrega + '/fonts/montserrat-latin.woff2')
FACE = '@font-face{font-family:Montserrat;font-style:normal;font-weight:500 800;font-display:swap;src:url(fonts/montserrat-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}'
open(entrega + '/styles.min.css', 'w').write(FACE + mcss)
CSP = ("default-src 'self'; script-src 'self' https://www.googletagmanager.com https://connect.facebook.net; "
       "style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.facebook.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; "
       "font-src 'self'; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net; "
       "frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests")
hd = h.replace('href="styles.css"', 'href="styles.min.css"').replace('src="app.js"', 'src="app.min.js"')
hd = re.sub(r'<link rel="preconnect"[^>]*>', '', hd)
hd = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', '', hd)
m = re.search(r'<script>window\.TXT=.*?;</script>', hd, re.S)
open(entrega + '/textos.js', 'w').write(m.group(0)[len('<script>'):-len('</script>')])
hd = hd.replace(m.group(0), '<script src="textos.js"></script>')
hd = hd.replace('<script>document.documentElement.classList.add("js")</script>', '<script src="boot.js"></script>')
open(entrega + '/boot.js', 'w').write('document.documentElement.classList.add("js");')
hd = hd.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="' + CSP + '">', 1)
open(entrega + '/index.html', 'w').write(hd)
for f in os.listdir(entrega):
    if f.endswith('.html') and f != 'index.html':   # páginas legais: mesma fonte própria, sem Google Fonts
        p = open(entrega + '/' + f).read()
        p = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', '', p)
        p = p.replace('<style>', '<style>' + FACE.replace('url(fonts/', 'url(fonts/'), 1)
        p = p.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="' + CSP + '">', 1)
        open(entrega + '/' + f, 'w').write(p)
SEC = [('Content-Security-Policy', CSP + "; frame-ancestors 'none'"), ('Strict-Transport-Security', 'max-age=63072000; includeSubDomains'),
       ('X-Content-Type-Options', 'nosniff'), ('X-Frame-Options', 'DENY'), ('Referrer-Policy', 'strict-origin-when-cross-origin'),
       ('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'), ('Cross-Origin-Opener-Policy', 'same-origin')]
open(entrega + '/_headers', 'w').write('# Netlify e Cloudflare Pages\n/*\n' + ''.join('  %s: %s\n' % kv for kv in SEC) +
    '/img/*\n  Cache-Control: public, max-age=604800\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n'
    '/index.html\n  Cache-Control: no-cache\n/config.js\n  Cache-Control: no-cache\n/app.min.js\n  Cache-Control: public, max-age=3600\n')
open(entrega + '/vercel.json', 'w').write(json.dumps({'headers': [{'source': '/(.*)', 'headers': [{'key': k, 'value': v} for k, v in SEC]},
    {'source': '/img/(.*)', 'headers': [{'key': 'Cache-Control', 'value': 'public, max-age=604800'}]},
    {'source': '/fonts/(.*)', 'headers': [{'key': 'Cache-Control', 'value': 'public, max-age=31536000, immutable'}]}]}, indent=2))
open(entrega + '/.htaccess', 'w').write('# Apache (mod_headers)\n<IfModule mod_headers.c>\n' + ''.join('  Header always set %s "%s"\n' % kv for kv in SEC) + '</IfModule>\nOptions -Indexes\n')
a = h.replace('<link rel="stylesheet" href="styles.css">', '<style>' + mcss + '</style>')
a = a.replace('<script src="config.js"></script>', '<script>' + cfg + '</script>').replace('<script src="app.js"></script>', '<script>' + mjs + '</script>')
open(art + '/index.html', 'w').write(a)
print('artifact html', len(a) // 1024, 'KB; imagens usadas:', len(used))
print('files p/ Artifact:', json.dumps({'img/' + u: 'img/' + u for u in used}))
