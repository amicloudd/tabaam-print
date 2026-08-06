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
  leadTime: "30–40 дней",
  note: "Более выгодные цены при больших тиражах",
};
