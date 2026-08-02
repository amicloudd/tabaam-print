export const DESIGN_FEE = 800;

export const STANDARD = {
  sizeLabel: "5 × 9 см",
  widthMm: 50,
  heightMm: 90,
  material: "Мелованная бумага 300 г/м², глянец",
  minQty: 100,
  base100: 1200,
};

const STANDARD_DISCOUNT_TABLE = { 100: 0, 200: 8, 300: 16, 400: 24 };
const STANDARD_MAX_DISCOUNT = 24;

export function standardDiscountPercent(qty) {
  if (qty <= 0) return 0;
  if (qty >= 400) return STANDARD_MAX_DISCOUNT;
  const tier = Math.ceil(qty / 100) * 100;
  return STANDARD_DISCOUNT_TABLE[tier] ?? STANDARD_MAX_DISCOUNT;
}

export function standardLineTotal(qty) {
  if (qty <= 0) return 0;
  const discount = standardDiscountPercent(qty);
  const pricePer100 = STANDARD.base100 * (1 - discount / 100);
  return pricePer100 * (qty / 100);
}

// A3 sheet, mm
const A3 = { w: 420, h: 297 };

export function tagsPerSheet(wMm, hMm) {
  if (!wMm || !hMm) return 0;
  const a = Math.floor(A3.w / wMm) * Math.floor(A3.h / hMm);
  const b = Math.floor(A3.w / hMm) * Math.floor(A3.h / wMm);
  return Math.max(a, b, 0);
}

export function sheetPriceFor(maxDimMm) {
  const cm = maxDimMm / 10;
  if (cm <= 3) return 320;
  if (cm <= 5) return 190;
  return 120;
}

export function sheetsNeeded(qty, wMm, hMm) {
  const perSheet = tagsPerSheet(wMm, hMm);
  if (perSheet <= 0) return 0;
  return Math.ceil(qty / perSheet);
}

export function customLineTotal(qty, wMm, hMm) {
  const sheets = sheetsNeeded(qty, wMm, hMm);
  const price = sheetPriceFor(Math.max(wMm, hMm));
  return sheets * price;
}

export const DOUBLE_SIDED_PER_SHEET = 80;
export const ROUNDED_CORNERS_PER_TAG = 2;
export const TAG_HOLDER_PER_TAG = 2;

export const CHINA_INFO = {
  leadTime: "30–40 дней",
  minQty: "от 500 шт",
  note: "Самые выгодные цены для больших тиражей",
};

export const CHINA_UPCOMING = [
  { id: "double-sided", label: "Двусторонняя печать", kind: "toggle" },
  { id: "paper-density", label: "Плотность бумаги", kind: "slider" },
  { id: "designer-paper", label: "Дизайнерская бумага", kind: "swatches" },
  { id: "foil-gold", label: "Тиснение золотом", kind: "toggle" },
  { id: "foil-silver", label: "Тиснение серебром", kind: "toggle" },
  { id: "foil-designer", label: "Тиснение по дизайнерской бумаге", kind: "toggle" },
];

export const DESIGNER_PAPERS = ["Крафт", "Лён", "Перламутр", "Металлик", "Мрамор"];
