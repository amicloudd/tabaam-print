export const DESIGN_FEE = 800;

// colorGroup "full" -> все 4 цвета доступны (цветной/прозрачный с наценкой)
// colorGroup "basic" -> только белый/чёрный
// цены указаны за 100 шт
export const PVD_SIZES = [
  { id: "20x30", label: "20 × 30 см", price: 3400, colorGroup: "full" },
  { id: "30x40", label: "30 × 40 см", price: 3600, colorGroup: "full" },
  { id: "40x50", label: "40 × 50 см", price: 4000, colorGroup: "full" },
  { id: "45x45", label: "45 × 45 см", price: 4500, colorGroup: "basic" },
  { id: "50x60", label: "50 × 60 см", price: 5500, colorGroup: "basic" },
  { id: "60x50", label: "60 × 50 см", price: 5500, colorGroup: "basic" },
  { id: "70x60", label: "70 × 60 см", price: 6100, colorGroup: "basic" },
];

export const BAG_COLORS_FULL = [
  { id: "white", label: "Белый", surcharge: 0 },
  { id: "black", label: "Чёрный", surcharge: 0 },
  { id: "color", label: "Цветной", surcharge: 300 },
  { id: "transparent", label: "Прозрачный", surcharge: 300 },
];

export const BAG_COLORS_BASIC = [
  { id: "white", label: "Белый", surcharge: 0 },
  { id: "black", label: "Чёрный", surcharge: 0 },
];

export function bagColorsFor(colorGroup) {
  return colorGroup === "full" ? BAG_COLORS_FULL : BAG_COLORS_BASIC;
}

export const PRINT_COLOR_COUNTS = [
  { id: "1", label: "1 цвет", surcharge: 0 },
  { id: "2", label: "2 цвета", surcharge: 2000 },
];

export const CHINA_INFO = {
  leadTime: "около 40 дней",
  note: "Более выгодные цены при больших тиражах",
};

export const CHINA_PALETTE_PHOTO = "/assets/china/plastic-bag-palette.jpg";

// цвета по фото палитры
export const CHINA_BAG_COLORS = [
  { id: "white", label: "Белый", hex: "#F7F7F5" },
  { id: "black", label: "Чёрный", hex: "#151515" },
  { id: "grey", label: "Серый", hex: "#BDBDBD" },
  { id: "red", label: "Красный", hex: "#E8261C" },
  { id: "orange", label: "Оранжевый", hex: "#F26A1B" },
  { id: "yellow", label: "Жёлтый", hex: "#F6CB16" },
  { id: "green", label: "Зелёный", hex: "#3FCB2B" },
  { id: "blue", label: "Голубой", hex: "#21A6EE" },
  { id: "light-blue", label: "Светло-голубой", hex: "#A9DDF5" },
  { id: "pink", label: "Розовый", hex: "#F4A2C8" },
  { id: "light-pink", label: "Нежно-розовый", hex: "#F6C9D9" },
  { id: "fuchsia", label: "Фуксия", hex: "#EC2A86" },
  { id: "lilac", label: "Сиреневый", hex: "#A08DC9" },
  { id: "violet", label: "Фиолетовый", hex: "#A863E0" },
  { id: "gold-brown", label: "Карамельный", hex: "#B8834F" },
  { id: "brown", label: "Коричневый", hex: "#4A1F17" },
  { id: "dark-brown", label: "Тёмно-коричневый", hex: "#2A1E17" },
];

export const CHINA_BAG_SIZES = [
  { id: "20x28", label: "20 × 28 см" },
  { id: "25x35", label: "25 × 35 см" },
  { id: "30x40", label: "30 × 40 см" },
  { id: "35x45", label: "35 × 45 см" },
  { id: "40x50", label: "40 × 50 см" },
  { id: "45x55", label: "45 × 55 см" },
];

export const CHINA_BAG_THICKNESS = [
  { id: "12", label: "0,12 мм", sub: "12 丝" },
  { id: "16", label: "0,16 мм", sub: "16 丝 · плотнее и прочнее", badge: "Рекомендуем" },
];
export const CHINA_DEFAULT_THICKNESS = "16";
