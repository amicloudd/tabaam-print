export const DESIGN_FEE = 800;

export const PRODUCT_TYPES = [
  { id: "business", label: "Визитки" },
  { id: "cards", label: "Карточки/открытки" },
  { id: "folded", label: "Складные открытки" },
  { id: "certificate", label: "Сертификат А4" },
  { id: "foil", label: "Тиснение золотом" },
  { id: "notebooks-catalogs", label: "Блокноты и каталоги" },
];

export const PRINT_SIDES = [
  { id: "single", label: "Односторонняя" },
  { id: "double", label: "Двусторонняя" },
];

// ---- Визитки ----
export const BUSINESS_CARD_PRICE = { single: 8, double: 10 };
export const BUSINESS_CARD_MIN_QTY = 100;
export const BUSINESS_CARD_MAX_QTY = 500;
const BUSINESS_CARD_MAX_DISCOUNT = 3;

export function businessCardDiscount(qty) {
  const tier = Math.floor(qty / 100) - 1;
  return Math.min(Math.max(tier, 0), BUSINESS_CARD_MAX_DISCOUNT);
}

export function businessCardLineTotal(qty, basePrice) {
  if (qty <= 0) return 0;
  const discount = businessCardDiscount(qty);
  return Math.max(basePrice - discount, 0) * qty;
}

// ---- Карточки ----
export const CARD_SIZES = [
  { id: "10.5x7.5", label: "10,5 × 7,5 см", single: 10, double: 12 },
  { id: "15x10", label: "15 × 10 см", single: 18, double: 20 },
  { id: "21x15", label: "21 × 15 см", single: 35, double: 40 },
  { id: "other", label: "Другой размер", single: null, double: null },
];
export const CARD_MIN_QTY = 100;
export const CARD_MAX_QTY = 500;
export const CARD_QTY_STEP = 50;

// ---- Складные открытки ----
export const FOLDED_CARD = {
  formatLabel: "10 × 15 см",
  typeLabel: "Складная (двойная)",
  price: 30,
  minQty: 50,
};

// ---- Сертификат А4 (обычная печать) ----
export const CERTIFICATE_PRICE = 100;

// ---- Тиснение золотом ----
export const FOIL_ITEMS = [
  { id: "business", label: "Визитки", sizeLabel: "стандарт", price: 50, minQty: 40, step: 20, maxQty: 500 },
  { id: "certificate", label: "Сертификат А4", sizeLabel: "А4", price: 700, minQty: 2, step: 2, maxQty: 50 },
];
