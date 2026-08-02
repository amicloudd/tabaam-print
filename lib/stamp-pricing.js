export const DESIGN_FEE = 400;

export const INK_COLORS = [
  { id: "black", label: "Чёрный (стандарт)" },
  { id: "blue", label: "Синий" },
  { id: "red", label: "Красный" },
  { id: "green", label: "Зелёный" },
  { id: "other", label: "Другой" },
];

export const DOCUMENT_STAMP = {
  shapeLabel: "Круглая",
  mechanismLabel: "Автоматическая",
  diameterLabel: "Диаметр 5 см",
  price: 3000,
};

export const RECT_SIZES = [
  { id: "custom-small", label: "До 10 × 5 см", isCustom: true, maxW: 10, maxH: 5, priceMin: 2500, priceMax: 3000 },
  { id: "11x6", label: "11 × 6 см", price: 3500 },
  { id: "14x4", label: "14 × 4 см", price: 4100 },
  { id: "15x5", label: "15 × 5 см", price: 4300 },
  { id: "14x8", label: "14 × 8 см", price: 4500 },
  { id: "15x7", label: "15 × 7 см", price: 4500 },
  { id: "15x8", label: "15 × 8 см", price: 4800 },
];
