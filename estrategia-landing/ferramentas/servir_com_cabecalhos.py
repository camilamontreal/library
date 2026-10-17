#!/usr/bin/env python3
"""Serve uma pasta de entrega aplicando os cabeçalhos do arquivo _headers (para testar a CSP localmente).
Uso: python3 servir_com_cabecalhos.py PASTA [PORTA]"""
import sys, http.server, os, re
pasta = sys.argv[1]; porta = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
hdrs = []
for linha in open(os.path.join(pasta, '_headers')):
    m = re.match(r'^  ([A-Za-z-]+): (.*)$', linha.rstrip())
    if m and m.group(1) not in ('Cache-Control', 'Strict-Transport-Security'): hdrs.append(m.groups())
    if linha.startswith('/') and not linha.startswith('/*'): break
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=pasta, **k)
    def end_headers(s):
        for k, v in hdrs: s.send_header(k, v)
        super().end_headers()
    def log_message(s, *a): pass
http.server.ThreadingHTTPServer(('127.0.0.1', porta), H).serve_forever()
