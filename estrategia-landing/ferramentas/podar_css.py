import re
import sys
site=sys.argv[1] if len(sys.argv)>1 else '.'
css=open(site+'/styles.css',encoding='utf-8').read()
html=open(site+'/index.tpl.html',encoding='utf-8').read()
js=open(site+'/app.js',encoding='utf-8').read()
bld=open(site+'/build.py',encoding='utf-8').read()
hay=html+js
# strip comments
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
def present(tok):
    return re.search(r'(?<![\w-])'+re.escape(tok)+r'(?![\w-])',hay) is not None
def sel_alive(sel):
    # ignore things inside :not(...) args / attribute selectors
    s=re.sub(r'\[[^\]]*\]','',sel)
    for m in re.finditer(r'\.([A-Za-z_][\w-]*)',s):
        if not present(m.group(1)): return False
    for m in re.finditer(r'#([A-Za-z_][\w-]*)',s):
        if not present(m.group(1)): return False
    # element-only tags used? skip
    return True
def split_top(s,sep=','):
    out=[];d=0;cur=''
    for ch in s:
        if ch in '([': d+=1
        if ch in ')]': d-=1
        if ch==sep and d==0: out.append(cur);cur=''
        else: cur+=ch
    out.append(cur); return out
def parse(s):
    i=0;n=len(s);res=[]
    while i<n:
        j=s.find('{',i)
        if j<0:
            tail=s[i:].strip()
            if tail: res.append(('raw',tail))
            break
        head=s[i:j].strip()
        d=1;k=j+1
        while k<n and d>0:
            if s[k]=='{': d+=1
            elif s[k]=='}': d-=1
            k+=1
        body=s[j+1:k-1]
        res.append((head,body)); i=k
    return res
def render(rules):
    out=[]
    for head,body in rules:
        if head=='raw': out.append(body);continue
        if head.startswith('@media') or head.startswith('@supports'):
            inner=render(prune(parse(body)))
            if inner.strip(): out.append(head+'{'+inner+'}')
        elif head.startswith('@keyframes') or head.startswith('@font-face'):
            out.append(head+'{'+body+'}')
        else:
            out.append(head+'{'+body.strip()+'}')
    return '\n'.join(out)
def prune(rules):
    kept=[]
    for head,body in rules:
        if head=='raw' or head.startswith('@'):
            kept.append((head,body));continue
        sels=[x.strip() for x in split_top(head)]
        alive=[x for x in sels if sel_alive(x)]
        if alive: kept.append((', '.join(alive),body))
    return kept
rules=prune(parse(css))
out=render(rules)
# keyframes: drop if unused
def kf_used(name,text): return re.search(r'(?<![\w-])'+re.escape(name)+r'(?![\w-])',text.replace('@keyframes '+name,'')) is not None
for m in list(re.finditer(r'@keyframes\s+([\w-]+)\s*\{',out)):
    pass
names=re.findall(r'@keyframes\s+([\w-]+)',out)
for nme in names:
    if not kf_used(nme,out):
        # remove block
        st=out.index('@keyframes '+nme)
        j=out.index('{',st);d=1;k=j+1
        while d>0:
            if out[k]=='{': d+=1
            elif out[k]=='}': d-=1
            k+=1
        out=out[:st]+out[k:]
        print('kf removed',nme)
open(site+'/styles.pruned.css','w',encoding='utf-8').write(out)
print(len(open(site+'/styles.css').read()),'->',len(out))
