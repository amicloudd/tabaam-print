export const CATEGORIES = [
  { id: "signs", label: "Вывески" },
  { id: "banners", label: "Баннеры и плакаты" },
  { id: "holders", label: "Реквизитницы и визитницы" },
  { id: "rollup", label: "Ролл-ап" },
];

export const SIGN_TYPES = [
  { id: "lit", label: "Световые вывески" },
  { id: "unlit", label: "Несветовые вывески" },
  { id: "neon", label: "Неоновые" },
];

// ---- Баннеры и плакаты ----
export const BANNER_MATERIALS = [
  { id: "film", label: "Плёнка" },
  { id: "paper", label: "Бумага/фотобумага", note: "под рамки, чертежи, лекала" },
];
export const BANNER_PRICE_PER_M2 = 800;

export const RING_PRICE = 20;
export const RING_HINT = "В среднем на одну сторону нужно 3–4 кольца.";

// priced: true — считаем по цене; false — стоимость только по запросу
export const BANNER_MOUNTS = [
  { id: "rings", label: "Кольца", priced: true },
  { id: "wood-frame", label: "Деревянный каркас", priced: false },
  { id: "stand", label: "Стенд", priced: false },
];

// ---- Реквизитницы и визитницы ----
// конкретные размеры/варианты уточняются — три ценовых варианта из ТЗ
export const HOLDER_OPTIONS = [
  { id: "1", label: "Вариант 1", price: 1600 },
  { id: "2", label: "Вариант 2", price: 2000 },
  { id: "3", label: "Вариант 3", price: 3000 },
];

// ---- Ролл-ап ----
export const ROLLUP_OPTIONS = [
  { id: "200x85", label: "200 × 85 см", price: 5000 },
  { id: "200x100", label: "200 × 100 см", price: 5500 },
  { id: "own-mechanism", label: "Есть свой механизм — только печать баннера", price: 2000 },
];
