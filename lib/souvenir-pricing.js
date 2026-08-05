export const DESIGN_FEE_FROM = 800;

export const TSHIRT_MIN_QTY = 10;
export const TSHIRT_PRICE = 900;
export const TSHIRT_PRINT_SIZES = [
  { id: "a4", label: "A4", price: 400 },
  { id: "a3", label: "A3", price: 500 },
];

export const MUG_MIN_QTY = 10;
export const MUG_PRICE = 300;

export const CAP_MIN_QTY = 1;
export const CAP_PRICE = 600;

export const PEN_TIERS = [
  { id: "small", label: "От 1 до 50 шт", maxQty: 50, price: 250 },
  { id: "bulk", label: "От 100 шт", price: 75 },
];

export function penUnitPrice(qty) {
  return qty <= 50 ? PEN_TIERS[0].price : PEN_TIERS[1].price;
}

export const BADGE_MIN_QTY = 1;
export const BADGE_MATERIALS = [
  { id: "metal", label: "Металл", price: 500 },
  { id: "acrylic", label: "Акрил", price: 550 },
];

export const PLASTIC_CARD_SIZE = "86 × 54 мм";
export const PLASTIC_CARD_TIERS = [
  { id: "50", qty: 50, price: 3500 },
  { id: "100", qty: 100, price: 4000 },
];
