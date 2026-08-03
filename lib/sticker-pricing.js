export const SHEET_MM = { w: 510, h: 500 };

// packing efficiency vs. a perfect grid tiling — только фигурная режется с потерей места
export const SHAPES = [
  { id: "round", label: "Круг / Овал", efficiency: 1 },
  { id: "rect", label: "Квадрат / Прямоугольник", efficiency: 1 },
  { id: "figured", label: "Фигурная (сложная)", efficiency: 0.9 },
];

export const COLOR_SHEET_BASE = 800;
export const COLOR_SHEET_STEP_DISCOUNT = 150;
export const COLOR_SHEET_MAX_DISCOUNT = 300;
export const COLOR_SHEET_MIN_PRICE = COLOR_SHEET_BASE - COLOR_SHEET_MAX_DISCOUNT;

export function stickersPerSheet(wCm, hCm, shapeId) {
  const wMm = wCm * 10;
  const hMm = hCm * 10;
  if (!wMm || !hMm) return 0;
  const shape = SHAPES.find((s) => s.id === shapeId) || SHAPES[1];
  const a = Math.floor(SHEET_MM.w / wMm) * Math.floor(SHEET_MM.h / hMm);
  const b = Math.floor(SHEET_MM.w / hMm) * Math.floor(SHEET_MM.h / wMm);
  const raw = Math.max(a, b);
  return Math.max(Math.floor(raw * shape.efficiency), 0);
}

export function sheetPrice(index) {
  return Math.max(COLOR_SHEET_BASE - COLOR_SHEET_STEP_DISCOUNT * (index - 1), COLOR_SHEET_MIN_PRICE);
}

export function colorPrintCalc(qty, wCm, hCm, shapeId) {
  const perSheet = stickersPerSheet(wCm, hCm, shapeId);
  if (perSheet <= 0 || qty <= 0) return { sheets: 0, total: 0, perSheet };
  const sheets = Math.ceil(qty / perSheet);
  let total = 0;
  for (let i = 1; i <= sheets; i++) total += sheetPrice(i);
  return { sheets, total, perSheet };
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

export const FILM_MAX_DISCOUNT = 3;

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
