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

export const SHEET_PRICE = 300;

export function sheetPriceFor() {
  return SHEET_PRICE;
}

export function sheetsNeeded(qty, wMm, hMm) {
  const perSheet = tagsPerSheet(wMm, hMm);
  if (perSheet <= 0) return 0;
  return Math.ceil(qty / perSheet);
}

// цена считается поштучно: цена листа делится на то, сколько штук помещается на лист
export function customUnitPrice(wMm, hMm) {
  const perSheet = tagsPerSheet(wMm, hMm);
  return perSheet > 0 ? SHEET_PRICE / perSheet : 0;
}

export function customLineTotal(qty, wMm, hMm) {
  return customUnitPrice(wMm, hMm) * qty;
}

export const DOUBLE_SIDED_PER_SHEET = 80;
export const ROUNDED_CORNERS_PER_TAG = 2;
export const TAG_HOLDER_PER_TAG = 2;

export function doubleSidedUnitFee(wMm, hMm) {
  const perSheet = tagsPerSheet(wMm, hMm);
  return perSheet > 0 ? DOUBLE_SIDED_PER_SHEET / perSheet : 0;
}

export const CHINA_INFO = {
  leadTime: "около 40 дней",
  minQty: "от 500 шт",
  note: "Самые выгодные цены для больших тиражей",
};

export const CHINA_DENSITY_PHOTO = "/assets/china/tag-density.jpg";
export const CHINA_EFFECTS_PHOTO = "/assets/china/tag-effects.jpg";

export const CHINA_DENSITIES = [
  { id: "300", label: "300 г/м²", sub: "0,35 мм · лёгкая бумага" },
  { id: "350", label: "350 г/м²", sub: "0,38 мм · бумага для визиток" },
  { id: "400", label: "400 г/м²", sub: "0,45 мм · плотная бумага" },
  { id: "700", label: "700 г/м²", sub: "0,8–0,85 мм · картон средней плотности", badge: "Рекомендуем" },
  { id: "900", label: "900 г/м²", sub: "1,05 мм · плотный двусторонний картон" },
];
export const CHINA_DEFAULT_DENSITY = "700";

export const CHINA_LAMINATION = [
  { id: "gloss", label: "Глянцевая" },
  { id: "matte", label: "Матовая" },
];

export const CHINA_PAPER_TYPES = [
  { id: "coated", label: "Мелованная", sub: "ровная гладкая поверхность" },
  { id: "designer", label: "Дизайнерская", sub: "текстурная поверхность" },
];

export const CHINA_FINISHES = [
  { id: "color", label: "Цветная печать" },
  { id: "gloss-gold", label: "Глянцевое золото" },
  { id: "matte-gold", label: "Матовый золотой" },
  { id: "silver", label: "Серебряная фольга" },
  { id: "rose-gold", label: "Розовое золото" },
  { id: "black-foil", label: "Чёрная фольга" },
  { id: "holo", label: "Голографическая фольга" },
  { id: "uv", label: "Выборочный УФ-лак" },
  { id: "deboss", label: "Бесцветное тиснение" },
  { id: "emboss", label: "Бесцветное конгревное тиснение" },
];
