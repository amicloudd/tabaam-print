import {
  IMG_BAG,
  IMG_RIBBON,
  IMG_BOX,
  IMG_TAG,
  IMG_PATCH,
  IMG_WRAP,
  IMG_SOUVENIR,
  IMG_STAMP,
  IMG_PAPER,
  IMG_ROLL,
  IMG_PLASTICBAG,
  IMG_CHOCO,
  IMG_SIGN,
} from "@/lib/assets";

// spotX/spotY — center of the print area as % of the mockup's own box
// spotW — width of the print area as % of the mockup's own box (drives logo scale)
export const MOCKUPS = [
  { slug: "bag", alt: "Картонные брендированные пакеты", src: IMG_BAG, spotX: 48, spotY: 54, spotW: 32 },
  { slug: "ribbon", alt: "Брендированная лента", src: IMG_RIBBON, spotX: 50, spotY: 57, spotW: 15 },
  { slug: "box", alt: "Брендированные коробки", src: IMG_BOX, spotX: 50, spotY: 58, spotW: 28 },
  { slug: "tag", alt: "Подвесные картонные бирки", src: IMG_TAG, spotX: 50, spotY: 60, spotW: 26 },
  { slug: "patch", alt: "Пришивные бирки", src: IMG_PATCH, spotX: 50, spotY: 48, spotW: 13 },
  { slug: "stickers", alt: "Наклейки", src: IMG_WRAP, spotX: 50, spotY: 48, spotW: 26 },
  { slug: "souvenir", alt: "Корпоративная сувенирная продукция", src: IMG_SOUVENIR, spotX: 50, spotY: 44, spotW: 17 },
  { slug: "stamp", alt: "Штамп/печать", src: IMG_STAMP, spotX: 38, spotY: 52, spotW: 24 },
  { slug: "paper", alt: "Бумажная продукция", src: IMG_PAPER, spotX: 50, spotY: 50, spotW: 18 },
  { slug: "tissue", alt: "Тишью/калька/крафт", src: IMG_ROLL, spotX: 40, spotY: 50, spotW: 14 },
  { slug: "plastic-bag", alt: "Полиэтиленовые брендированные пакеты", src: IMG_PLASTICBAG, spotX: 50, spotY: 55, spotW: 24 },
  { slug: "chocolate", alt: "Брендированные шоколадки", src: IMG_CHOCO, spotX: 50, spotY: 50, spotW: 24 },
  { slug: "sign", alt: "Вывески и баннеры", src: IMG_SIGN, spotX: 50, spotY: 50, spotW: 34 },
];
