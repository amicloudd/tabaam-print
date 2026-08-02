export const DESIGN_FEE = 800;

export const MATERIALS = [
  { id: "tissue", label: "Тишью" },
  { id: "parchment", label: "Пергамент" },
  { id: "kraft", label: "Крафт" },
];

export const TISSUE_SIZES = [
  { id: "25m", label: "84 см × 25 м", price: 4000 },
  { id: "50m", label: "84 см × 50 м", price: 6000 },
];

export const PARCHMENT_KRAFT_SIZES = [
  { id: "25m", label: "84 см × 25 м", price: 5000 },
  { id: "50m", label: "84 см × 50 м", price: 8500 },
];

export function sizesForMaterial(materialId) {
  return materialId === "tissue" ? TISSUE_SIZES : PARCHMENT_KRAFT_SIZES;
}

export const CHINA_INFO = {
  leadTime: "30–40 дней",
  note: "Более выгодная стоимость при больших тиражах",
};
