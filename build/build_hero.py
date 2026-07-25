import base64
import io
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
TEMPLATE = os.path.join(HERE, "hero_template.html")
OUT = os.path.join(HERE, "..", "dist", "tabaam-hero-standalone.html")

def jpeg_data_uri(filename, max_dim=1000, quality=86):
    path = os.path.join(ASSETS, filename)
    im = Image.open(path).convert("RGB")
    w, h = im.size
    if max(w, h) > max_dim:
        ratio = max_dim / float(max(w, h))
        im = im.resize((round(w * ratio), round(h * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    print(filename, "->", len(buf.getvalue()) / 1024, "KB")
    return "data:image/jpeg;base64," + b64

def png_logo_data_uri(filename, max_dim=1100, pad=24):
    path = os.path.join(ASSETS, filename)
    im = Image.open(path).convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        l, t, r, b = bbox
        l = max(0, l - pad); t = max(0, t - pad)
        r = min(im.width, r + pad); b = min(im.height, b + pad)
        im = im.crop((l, t, r, b))
    w, h = im.size
    if max(w, h) > max_dim:
        ratio = max_dim / float(max(w, h))
        im = im.resize((round(w * ratio), round(h * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    print(filename, "(logo) ->", len(buf.getvalue()) / 1024, "KB", "final size", im.size)
    return "data:image/png;base64," + b64

_paper_uri = jpeg_data_uri("image-25-07-26-08-34.png")

mapping = {
    "__LOGO__": png_logo_data_uri("1Ресурс 224@3x-11.png"),
    "__IMG_BAG__": jpeg_data_uri("image-25-07-26-04-31-12.png"),
    "__IMG_RIBBON__": jpeg_data_uri("image-25-07-26-04-31-13.png"),
    "__IMG_BOX__": jpeg_data_uri("image-25-07-26-04-31-1.png"),
    "__IMG_TAG__": jpeg_data_uri("image-25-07-26-04-31-4.png"),
    "__IMG_PATCH__": jpeg_data_uri("image-25-07-26-04-31-9.png"),
    "__IMG_WRAP__": jpeg_data_uri("image-25-07-26-04-31-8.png"),
    "__IMG_SOUVENIR__": jpeg_data_uri("image-25-07-26-08-34-1.png"),
    "__IMG_STAMP__": jpeg_data_uri("image-25-07-26-04-31-2.png"),
    "__IMG_PAPER_SMALL__": _paper_uri,
    "__IMG_ROLL__": jpeg_data_uri("image-25-07-26-04-31-5.png"),
    "__IMG_PLASTICBAG__": jpeg_data_uri("image-25-07-26-04-31-7.png"),
    "__IMG_PAPER_LARGE__": _paper_uri,
    "__IMG_CHOCO__": jpeg_data_uri("image-25-07-26-04-31-11.png"),
}

with open(TEMPLATE, "r", encoding="utf-8") as f:
    html = f.read()

for token, uri in mapping.items():
    html = html.replace(token, uri)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)

print("\nOutput size:", os.path.getsize(OUT) / (1024 * 1024), "MB")
