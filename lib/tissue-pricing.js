export const DESIGN_FEE = 800;

export const MATERIALS = [
  { id: "tissue", label: "Тишью" },
  { id: "parchment", label: "Пергамент" },
  { id: "kraft", label: "Крафт" },
];

export const TISSUE_SIZES = [
  { id: "25m", label: "84 см × 25 м", price: 3500 },
  { id: "50m", label: "84 см × 50 м", price: 5500 },
];

export const PARCHMENT_KRAFT_SIZES = [
  { id: "25m", label: "84 см × 25 м", price: 4500 },
  { id: "50m", label: "84 см × 50 м", price: 8000 },
];

export function sizesForMaterial(materialId) {
  return materialId === "tissue" ? TISSUE_SIZES : PARCHMENT_KRAFT_SIZES;
}

export const CHINA_INFO = {
  leadTime: "30–40 дней",
  note: "Более выгодная стоимость при больших тиражах",
};
