# Removes only the flat purple backdrop: background-coloured pixels connected to the image border.
# The subject's pixels are copied unchanged; only the soft edge band gets a light purple-spill correction.
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
im = Image.open('portrait.png').convert('RGB'); a = np.asarray(im).astype(np.float32) / 255
r, g, b = a[..., 0], a[..., 1], a[..., 2]
bg = (b > r + 0.08) & (b > g + 0.08) & (a.max(-1) > 0.45)
m = Image.fromarray((bg * 255).astype(np.uint8), 'L').copy()
W, H = im.size
seeds = [(x, y) for x in range(0, W, 6) for y in (0, H - 1)] + [(x, y) for y in range(0, H, 6) for x in (0, W - 1)]
for p in seeds:
    if m.getpixel(p) == 255:
        ImageDraw.floodfill(m, p, 128)
bgc = np.asarray(m) == 128
alpha = Image.fromarray(((~bgc) * 255).astype(np.uint8), 'L')
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))
al = np.asarray(alpha).astype(np.float32) / 255
band = (al > 0.02) & (al < 0.98)
out = a.copy()
out[..., 2] = np.where(band, np.minimum(b, np.maximum(r, g) + 0.03), b)
Image.fromarray((np.dstack([out, al]) * 255).astype(np.uint8), 'RGBA').save('cutout.png')
print('background fraction', round(float(bgc.mean()), 3))
