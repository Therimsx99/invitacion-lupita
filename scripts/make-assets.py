"""Recorta las flores de la invitación original (fondo transparente) y genera la imagen OG.
Uso: python scripts/make-assets.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design" / "invitacion.png"
OUT = ROOT / "public"
OUT.mkdir(exist_ok=True)

im = Image.open(SRC).convert("RGB")


def cut(box, name, tol=11, hlines=(), vlines=(), blank=None, rects=()):
    crop = im.crop(box)
    a = np.asarray(crop).astype(int)
    bgc = np.array([249, 243, 231])
    x0, y0 = box[0], box[1]
    near = lambda p: np.abs(p - bgc).max(axis=-1) < tol
    for (ya, yb) in hlines:  # filas de marco; se borra si arriba y abajo hay fondo
        ya -= y0; yb -= y0
        for x in range(a.shape[1]):
            if 0 <= ya - 4 and yb + 4 < a.shape[0] and near(a[ya - 4, x]) and near(a[yb + 4, x]):
                a[ya:yb + 1, x] = bgc
    for (xa, xb) in vlines:
        xa -= x0; xb -= x0
        for y in range(a.shape[0]):
            if 0 <= xa - 4 and xb + 4 < a.shape[1] and near(a[y, xa - 4]) and near(a[y, xb + 4]):
                a[y, xa:xb + 1] = bgc
    if blank:
        bx, by = blank
        a[by - y0:, bx - x0:] = bgc
    for (ra, rb, rc, rd) in rects:
        a[rb - y0:rd - y0, ra - x0:rc - x0] = bgc
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(edge, axis=0)
    diff = np.abs(a - bg).max(axis=2)
    is_bg = diff < tol
    reach = np.zeros_like(is_bg)
    reach[0, :] = is_bg[0, :]
    reach[-1, :] = is_bg[-1, :]
    reach[:, 0] = is_bg[:, 0]
    reach[:, -1] = is_bg[:, -1]
    while True:
        n = reach.copy()
        n[1:, :] |= reach[:-1, :]
        n[:-1, :] |= reach[1:, :]
        n[:, 1:] |= reach[:, :-1]
        n[:, :-1] |= reach[:, 1:]
        n &= is_bg
        if (n == reach).all():
            break
        reach = n
    alpha = Image.fromarray(np.where(reach, 0, 255).astype("uint8"))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.9))
    rgba = crop.convert("RGBA")
    rgba.putalpha(alpha)
    rgba = rgba.crop(rgba.getbbox())
    rgba.save(OUT / name, optimize=True)
    print(name, rgba.size)


cut((0, 0, 462, 570), "flor-sup-izq.png", hlines=[(23, 26)], vlines=[(31, 34)], blank=(290, 140))
cut((702, 1072, 1024, 1536), "flor-inf-der.png", hlines=[(1504, 1507)], vlines=[(989, 992)], rects=[(702, 1310, 770, 1360)])

og = im.crop((0, 118, 1024, 118 + 536)).resize((1200, 628), Image.LANCZOS)
og.convert("RGB").save(OUT / "og.jpg", quality=82, optimize=True)
print("og.jpg", og.size)
