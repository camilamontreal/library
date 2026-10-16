import re,subprocess,sys
from PIL import Image,ImageFilter
import sys
# uso: python3 desfocar_paginas_pdf.py PDF_DESKTOP.pdf PASTA_SAIDA 2 19 22 25 26 30
D=sys.argv[1] if len(sys.argv)>1 else ''
M=''
def lines(pdf,p):
    out=subprocess.run(['pdftotext','-bbox-layout','-f',str(p),'-l',str(p),pdf,'-'],capture_output=True,text=True).stdout
    r=[]
    for m in re.finditer(r'<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</line>',out,re.S):
        x0,y0,x1,y1=map(float,m.groups()[:4]);t=' '.join(re.findall(r'>([^<]+)</word>',m.group(5)))
        r.append((x0,y0,x1,y1,t))
    return r
def proc(pdf,p,dpi,name,lo,hi):
    subprocess.run(['pdftoppm','-r',str(dpi),'-f',str(p),'-l',str(p),'-png','-singlefile',pdf,'/tmp/_pg'])
    im=Image.open('/tmp/_pg.png').convert('RGB'); s=dpi/72
    n=0
    for x0,y0,x1,y1,t in lines(pdf,p):
        h=y1-y0
        sens=re.search(r'(Segredo|Cupom|Dica|Ingresso|CAMILAMONTREAL)',t)
        if (lo<=h<=hi) or sens:
            box=(int(x0*s)-3,int(y0*s)-2,int(x1*s)+3,int(y1*s)+3)
            reg=im.crop(box).filter(ImageFilter.GaussianBlur(4)); im.paste(reg,box); n+=1
    print(name,n,'blurred',im.size)
    return im
if __name__=='__main__':
    out=sys.argv[2]; pages=[int(x) for x in sys.argv[3:]]
    for n,p in enumerate(pages,1):
        im=proc(D,p,82,'g%d'%n,18.9,20.2)   # desfoca só texto corrido (altura de linha ~19-20pt); títulos e fotos ficam nítidos
        im.save('%s/g%d.webp'%(out,n),quality=72)
