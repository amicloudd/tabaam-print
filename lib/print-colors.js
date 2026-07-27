export const PRINT_COLOR_GROUPS = [
  {
    title: "Основные",
    colors: [
      { id: "gold", label: "Золото", swatch: "linear-gradient(135deg,#E7C878,#9C7423)" },
      { id: "silver", label: "Серебро", swatch: "linear-gradient(135deg,#E7E7E4,#9C9C97)" },
      { id: "black", label: "Чёрный", swatch: "#171310" },
      { id: "white", label: "Белый", swatch: "#FFFFFF", needsBorder: true },
    ],
  },
  {
    title: "Дополнительные",
    colors: [
      { id: "grey", label: "Серый", swatch: "#8B8B85" },
      { id: "blue", label: "Синий", swatch: "#2A54A0" },
      { id: "lightblue", label: "Голубой", swatch: "#4FB4DE" },
      { id: "green", label: "Зелёный", swatch: "#3D8B4C" },
      { id: "pink", label: "Розовый", swatch: "#E896B5" },
      { id: "fuchsia", label: "Фуксия", swatch: "#C6317A" },
      { id: "violet", label: "Фиолетовый", swatch: "#7B4FA6" },
      { id: "brown", label: "Коричневый", swatch: "#6B4A32" },
      { id: "orange", label: "Оранжевый", swatch: "#E0792E" },
      { id: "yellow", label: "Жёлтый", swatch: "#E8C93A" },
    ],
  },
  {
    title: "Глянцевые металлики",
    colors: [
      { id: "metallic-red", label: "Красный металлик", swatch: "linear-gradient(135deg,#D46A6A,#8E2E2E)", metallic: true },
      { id: "metallic-blue", label: "Синий металлик", swatch: "linear-gradient(135deg,#6E96D1,#2E5FA8)", metallic: true },
      { id: "metallic-green", label: "Зелёный металлик", swatch: "linear-gradient(135deg,#6FBE8C,#3F8F5C)", metallic: true },
      { id: "metallic-pink", label: "Розовый металлик", swatch: "linear-gradient(135deg,#EBAAC6,#D67AA0)", metallic: true },
      { id: "metallic-lightblue", label: "Голубой металлик", swatch: "linear-gradient(135deg,#8FD3E8,#4FA9C9)", metallic: true },
    ],
  },
];

export function findPrintColor(id) {
  for (const group of PRINT_COLOR_GROUPS) {
    const found = group.colors.find((c) => c.id === id);
    if (found) return found;
  }
  return null;
}

export function findPrintColors(ids) {
  return ids.map(findPrintColor).filter(Boolean);
}
