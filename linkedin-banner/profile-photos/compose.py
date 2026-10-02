import numpy as np
from PIL import Image, ImageFilter, ImageDraw
def hx(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)])/255
def screen(b,c,a): return 1-(1-b)*(1-c*a[...,None])
def rim(p):
    a=np.asarray(p).astype(np.float32)/255; al=Image.fromarray((a[...,3]*255).astype(np.uint8))
    r=max(3,p.width//250)
    er=np.asarray(al.filter(ImageFilter.MinFilter(2*r+1)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32)/255
    band=np.asarray(Image.fromarray((np.clip(a[...,3]-er,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r*.6))).astype(np.float32)/255*a[...,3]
    h,w=band.shape; xs=np.linspace(0,1,w)[None,:]; ys=np.linspace(0,1,h)[:,None]
    rgb=a[...,:3]
    rgb=screen(rgb,hx('#8c96ff'),band*np.clip(1.2-xs*1.5,0,1)*np.clip(1.15-ys,0.2,1)*0.8)   # blue-violet stage rim, upper left
    rgb=screen(rgb,hx('#67e8f9'),band*np.clip((xs-0.55)*2,0,1)*np.clip(1.1-ys*.7,0,1)*0.45) # cool cyan rim, right
    return Image.fromarray((np.dstack([rgb,a[...,3]])*255).astype(np.uint8))
def background(N):
    y,x=np.mgrid[0:N,0:N]/N
    bg=hx('#0f1534')*(1-y[...,None])+hx('#100c26')*y[...,None]                      # near-black navy-indigo stage
    g=lambda cx,cy,sx,sy: np.exp(-(((x-cx)**2)/sx+((y-cy)**2)/sy))
    bg=screen(bg,hx('#26357a'),g(.5,.18,.12,.07)*.55)                               # blue stage haze behind head
    bg=screen(bg,hx('#2fb3c4'),g(-.02,.78,.05,.16)*.9)                               # cyan aurora rising up the left side
    bg=screen(bg,hx('#7262d0'),g(1.02,.62,.05,.16)*.75)                              # violet on the right side
    bg=screen(bg,hx('#6a2f86'),g(.82,1.0,.05,.04)*.4)                                # faint plum, lower right
    bg=np.clip(bg+np.random.default_rng(1).normal(0,0.008,bg.shape),0,1)
    return Image.fromarray((bg*255).astype(np.uint8)).convert('RGBA')
def compose(cut_path,cx,top,S,out_name,k=2.048,size=1200):
    cut=Image.open(cut_path).convert('RGBA')
    al=cut.split()[3].filter(ImageFilter.MinFilter(5)).point(lambda v:0 if v<90 else min(255,int((v-90)*255/120)))   # tighten matte, drop wall halo
    cut.putalpha(al.filter(ImageFilter.GaussianBlur(1.2)))
    S=int(S*k); x0=int(cx*k-S/2); y0=int(top*k)
    p=Image.new('RGBA',(S,S),(0,0,0,0))
    crop=cut.crop((max(0,x0),max(0,y0),min(cut.width,x0+S),min(cut.height,y0+S)))
    p.alpha_composite(crop,(max(0,-x0),max(0,-y0)))
    p=rim(p); base=background(S); base.alpha_composite(p)
    out=base.convert('RGB').resize((size,size),Image.LANCZOS); out.save(out_name+'.png')
    m=Image.new('L',out.size,0); ImageDraw.Draw(m).ellipse((0,0,size-1,size-1),fill=255)
    prev=Image.new('RGB',(size+100,size+100),(0,0,0)); prev.paste(out,(50,50),m); prev.resize((650,650)).save(out_name+'-circle.png')
jobs=[('dp_cutout.png',730,100,1700,'linkedin-dp-1'),('dp1_cutout.png',740,525,900,'linkedin-dp-2'),
      ('dp2_cutout.png',695,365,1015,'linkedin-dp-3'),('dp3_cutout.png',720,45,1760,'linkedin-dp-4')]
for j in jobs: compose(*j)
sheet=Image.new('RGB',(1300,1300)); 
for i,j in enumerate(jobs): sheet.paste(Image.open(j[-1]+'-circle.png'),((i%2)*650,(i//2)*650))
sheet.save('dp_sheet.jpg',quality=88)
