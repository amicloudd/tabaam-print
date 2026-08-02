export const DESIGN_FEE = 400;

export const SATIN_SIZES = [
  { id: "15x8", label: "1,5 × 8 см" },
  { id: "25x8", label: "2,5 × 8 см (двойная бирка)" },
];
export const SATIN_PRICE_PER_UNIT = 8;
export const SATIN_MIN_QTY = 100;

export function satinLineTotal(qty) {
  if (qty <= 0) return 0;
  return qty * SATIN_PRICE_PER_UNIT;
}

export const PRINT_COLORS = [
  { id: "gold", label: "Золото", swatch: "linear-gradient(135deg,#E7C878,#9C7423)" },
  { id: "silver", label: "Серебро", swatch: "linear-gradient(135deg,#E7E7E4,#9C9C97)" },
  { id: "black", label: "Чёрный", swatch: "#171310" },
  { id: "other", label: "Другой", swatch: null },
];

export const JACQUARD_MIN_QTY = 500;
export const JACQUARD_SIZES = [
  { id: "20x80", label: "20 × 80 мм" },
  { id: "25x90", label: "25 × 90 мм" },
  { id: "30x80", label: "30 × 80 мм" },
  { id: "other", label: "Другой размер" },
];

export const CHINA_INFO = {
  leadTime: "30–40 дней",
  note: "Самые выгодные цены при больших тиражах",
};
