import TshirtModule from "./modules/TshirtModule";
import MugModule from "./modules/MugModule";
import PenModule from "./modules/PenModule";
import CapModule from "./modules/CapModule";
import BadgeModule from "./modules/BadgeModule";
import PlasticCardModule from "./modules/PlasticCardModule";
import ChocolateModule from "./modules/ChocolateModule";
import NotebookCatalogModule from "./modules/NotebookCatalogModule";

/**
 * Контракт модуля товара
 * ----------------------
 * Компонент модуля получает единственный проп onOrderChange(order) и обязан
 * вызывать его при каждом изменении своего состояния:
 *
 *   onOrderChange(null)  — данных ещё недостаточно для расчёта
 *   onOrderChange({
 *     qty: number,
 *     facts: [{ label, value }],   // произвольные строки для сводки/корзины
 *     total: number | null,        // null = цена пока не известна ("уточняется")
 *     isEstimate: boolean,         // показать как ориентировочную стоимость
 *     canSubmit: boolean,          // можно ли добавить в корзину
 *   })
 *
 * Сам модуль верстает свои шаги (rc-step) как захочет — общий калькулятор
 * (SouvenirCalculator) ничего не знает про конкретные товары.
 *
 * Чтобы добавить новый товар (ежедневники, флешки, пакеты, термокружки,
 * зонты, шопперы и т.д.): создать components/souvenir-calculator/modules/*.js
 * по этому контракту и добавить одну строку в массив ниже. Остальной
 * калькулятор менять не нужно.
 */
export const SOUVENIR_MODULES = [
  { id: "tshirt", label: "Футболки", Component: TshirtModule },
  { id: "mug", label: "Кружки", Component: MugModule },
  { id: "pen", label: "Ручки", Component: PenModule },
  { id: "cap", label: "Кепки", Component: CapModule },
  { id: "notebook-catalog", label: "Блокноты и каталоги", Component: NotebookCatalogModule },
  { id: "badge", label: "Бейджики", Component: BadgeModule },
  { id: "plastic-card", label: "Пластиковые карты", Component: PlasticCardModule },
  { id: "chocolate", label: "Шоколадки", Component: ChocolateModule },
];
