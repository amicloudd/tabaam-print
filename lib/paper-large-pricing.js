export const DESIGN_FEE = 800;

// цена в PRODUCTS.sizes[].price указана за 1000 шт
export const PRODUCTS = [
  {
    id: "business",
    label: "Визитки",
    printTypeLabel: "Двусторонняя",
    sizes: [{ id: "standard", label: "Стандарт", price: 3500 }],
  },
  {
    id: "cards",
    label: "Карточки",
    sizes: [
      { id: "10.5x7.5", label: "10,5 × 7,5 см", price: 4000 },
      { id: "15x10", label: "15 × 10 см", price: 6000 },
      { id: "21x15", label: "21 × 15 см", price: 10000 },
    ],
  },
  {
    id: "postcards",
    label: "Открытки",
    sizes: [
      { id: "10x9", label: "10 × 9 см", price: 5500 },
      { id: "5.5x17", label: "5,5 × 17 см", price: 5500 },
    ],
  },
  {
    id: "leaflets-group",
    label: "Листовки, флаеры, буклеты",
    sizes: [
      { id: "leaflets-15x10", label: "Листовки 15 × 10 см", price: 3500 },
      { id: "leaflets-21x15", label: "Листовки 21 × 15 см", price: 4000 },
      { id: "flyers-21x10", label: "Флаеры 21 × 10 см", price: 4000 },
      { id: "fold-a4", label: "Лифлеты (гармошка, тройной сгиб) A4", price: 9000 },
      { id: "fold-a3", label: "Лифлеты (гармошка, тройной сгиб) A3", price: 16500 },
      { id: "booklets-a6", label: "Буклеты (двойной сгиб) A6", price: 4000 },
      { id: "booklets-a5", label: "Буклеты (двойной сгиб) A5", price: 6000 },
      { id: "booklets-a4", label: "Буклеты (двойной сгиб) A4", price: 9000 },
      { id: "booklets-a3", label: "Буклеты (двойной сгиб) A3", price: 16000 },
      { id: "eurobooklet-21x20", label: "Евробуклет двойной сгиб 21 × 20 см", price: 7000 },
    ],
  },
  {
    id: "notebooks-catalogs",
    label: "Блокноты и каталоги",
    sizes: [{ id: "custom", label: "уточняется", price: null }],
  },
];

// цена на открытки считается поштучно (price / 1000), с ползунком тиража
export const POSTCARD_QTY_MIN = 50;
export const POSTCARD_QTY_MAX = 250;
export const POSTCARD_QTY_STEP = 20;
