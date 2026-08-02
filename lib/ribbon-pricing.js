export const WIDTHS = [
  { value: 1.5, label: "1,5 см", base100: 1800 },
  { value: 2, label: "2 см", base100: 2000, isDefault: true },
  { value: 3, label: "3 см", base100: 2800 },
];

export const SILICONE_BASE_100 = 4500;
export const SILICONE_LABEL = "Матовый полупрозрачный силикон 2 см";
export const SILICONE_IMAGE = "/assets/ribbons/" + encodeURIComponent("силикон.png");

// discount % applied to the per-100m price, keyed by total meters ordered for that colour
const DISCOUNT_TABLE = {
  100: 0,
  200: 2.8,
  300: 5.6,
  400: 8.4,
  500: 11.1,
  600: 13.9,
  700: 16.7,
  800: 19.4,
  900: 22.2,
  1000: 25,
};
const MAX_DISCOUNT = 25;

export function widthByValue(value) {
  return WIDTHS.find((w) => w.value === value) || WIDTHS[1];
}

export function discountPercentFor(meters) {
  if (meters <= 0) return 0;
  const capped = Math.min(meters, 1000);
  const tier = Math.ceil(capped / 100) * 100;
  return DISCOUNT_TABLE[tier] ?? MAX_DISCOUNT;
}

// price for a single line, given total meters and the base price per 100m —
// the discount tier is derived from this line's own meters (used for silicone, which is priced independently)
export function lineTotal(meters, base100) {
  if (meters <= 0) return 0;
  const discount = discountPercentFor(meters);
  return priceWithDiscount(meters, base100, discount);
}

// price for a line given an already-known discount % (used for ribbon colours, whose
// discount tier is shared across every colour — pooled by total metres ordered, not per colour)
export function priceWithDiscount(meters, base100, discountPercent) {
  if (meters <= 0) return 0;
  const pricePer100 = base100 * (1 - discountPercent / 100);
  return pricePer100 * (meters / 100);
}

export { formatRub } from "./format";
