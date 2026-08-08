export const SHAPES = [
  { id: "round", label: "Круг / Овал" },
  { id: "rect", label: "Квадрат / Прямоугольник" },
  { id: "figured", label: "Фигурная (сложная)" },
];

export const COLOR_PRICE_PER_M2 = 3400;
export const COLOR_QTY_MIN = 100;
export const COLOR_QTY_MAX = 2000;
export const COLOR_QTY_STEP = 50;

export function colorPrintCalc(qty, wCm, hCm) {
  if (!wCm || !hCm || qty <= 0) return { areaM2: 0, total: 0 };
  const areaM2 = (wCm / 100) * (hCm / 100) * qty;
  return { areaM2, total: areaM2 * COLOR_PRICE_PER_M2 };
}

export const FILM_COLORS = [
  { id: "gold", label: "Золото", swatch: "linear-gradient(135deg,#E7C878,#9C7423)" },
  { id: "silver", label: "Серебро", swatch: "linear-gradient(135deg,#E7E7E4,#9C9C97)" },
  { id: "black", label: "Чёрный", swatch: "#171310" },
];

export const FILM_SIZES = [
  { id: "5x10", label: "5 × 10 см", price: 12 },
  { id: "round5", label: "Круг 5 см", price: 8 },
  { id: "4x6", label: "4 × 6 см", price: 8 },
  { id: "2x8", label: "2 × 8 см", price: 8 },
];

export const FILM_MAX_DISCOUNT = 2;

export function filmDiscountPerUnit(qty) {
  const tier = Math.floor(qty / 100) - 1;
  return Math.min(Math.max(tier, 0), FILM_MAX_DISCOUNT);
}

export function filmLineTotal(qty, basePrice) {
  if (qty <= 0) return 0;
  const discount = filmDiscountPerUnit(qty);
  return Math.max(basePrice - discount, 0) * qty;
}

export const NO_BACKING_PRICE = 30;
export const NO_BACKING_MIN_QTY = 30;
export const NO_BACKING_DEFAULT = { wCm: 10, hCm: 5 };

export function noBackingTotal(qty) {
  if (qty <= 0) return 0;
  return qty * NO_BACKING_PRICE;
}

export const WORK_HOURS_STICKER_PRICE = 1000;
