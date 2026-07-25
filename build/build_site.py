import os
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "hero_template.html")
OUT = os.path.join(HERE, "..", "index.html")

def rel(filename):
    return "assets/" + quote(filename)

mapping = {
    "__LOGO__": rel("1Ресурс 224@3x-11.png"),
    "__IMG_BAG__": rel("image-25-07-26-04-31-12.png"),
    "__IMG_RIBBON__": rel("image-25-07-26-04-31-13.png"),
    "__IMG_BOX__": rel("image-25-07-26-04-31-1.png"),
    "__IMG_TAG__": rel("image-25-07-26-04-31-4.png"),
    "__IMG_PATCH__": rel("image-25-07-26-04-31-9.png"),
    "__IMG_WRAP__": rel("image-25-07-26-04-31-8.png"),
    "__IMG_SOUVENIR__": rel("image-25-07-26-08-34-1.png"),
    "__IMG_STAMP__": rel("image-25-07-26-04-31-2.png"),
    "__IMG_PAPER_SMALL__": rel("image-25-07-26-08-34.png"),
    "__IMG_ROLL__": rel("image-25-07-26-04-31-5.png"),
    "__IMG_PLASTICBAG__": rel("image-25-07-26-04-31-7.png"),
    "__IMG_PAPER_LARGE__": rel("image-25-07-26-08-34.png"),
    "__IMG_CHOCO__": rel("image-25-07-26-04-31-11.png"),
    "__IMG_SIGN__": rel("2608F680-9E3E-4B5F-B77D-B0F15A550930.PNG"),
    "__BG_DESIGN__": rel("5BE5C914-8811-4318-BE8F-98CBE0A01E3B.PNG"),
}

with open(TEMPLATE, "r", encoding="utf-8") as f:
    body = f.read()

for token, uri in mapping.items():
    body = body.replace(token, uri)

html = """<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>tabaam.print</title>
</head>
<body>
""" + body + """
</body>
</html>
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)

print("Written:", OUT, os.path.getsize(OUT), "bytes")
