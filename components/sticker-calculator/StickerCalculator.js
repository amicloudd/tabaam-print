"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import {
  SHAPES,
  colorPrintCalc,
  COLOR_PRICE_PER_M2,
  COLOR_QTY_MIN,
  COLOR_QTY_MAX,
  COLOR_QTY_STEP,
  FILM_COLORS,
  FILM_SIZES,
  filmDiscountPerUnit,
  filmLineTotal,
  NO_BACKING_PRICE,
  NO_BACKING_MIN_QTY,
  NO_BACKING_DEFAULT,
  noBackingTotal,
  WORK_HOURS_STICKER_PRICE,
} from "@/lib/sticker-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./sticker-calculator.css";

const WHATSAPP_PHONE = "79282699936";

const STICKER_TYPES = [
  { id: "color", label: "Цветная печать" },
  { id: "film", label: "Печать на прозрачной плёнке" },
  { id: "no-backing", label: "Наклейки без подложки (зеркальный перенос)" },
];

const NB_MODES = [
  { id: "custom", label: "Свой размер" },
  { id: "hours", label: `Наклейка «Режим работы» — ${WORK_HOURS_STICKER_PRICE} ₽` },
];

export default function StickerCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [stickerType, setStickerType] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // цветная печать
  const [shapeId, setShapeId] = useState(null);
  const [colorW, setColorW] = useState(5);
  const [colorH, setColorH] = useState(5);
  const [colorQty, setColorQty] = useState(COLOR_QTY_MIN);

  // плёнка
  const [filmColorId, setFilmColorId] = useState(null);
  const [filmSizeId, setFilmSizeId] = useState(null);
  const [filmQty, setFilmQty] = useState(100);

  // без подложки
  const [nbMode, setNbMode] = useState(null);
  const [nbW, setNbW] = useState(NO_BACKING_DEFAULT.wCm);
  const [nbH, setNbH] = useState(NO_BACKING_DEFAULT.hCm);
  const [nbQty, setNbQty] = useState(NO_BACKING_MIN_QTY);
  const [hoursQty, setHoursQty] = useState(1);

  const typeLabel = STICKER_TYPES.find((t) => t.id === stickerType)?.label || "—";

  // ---- цветная печать ----
  const colorCalc = useMemo(() => colorPrintCalc(colorQty, colorW, colorH), [colorQty, colorW, colorH]);
  const shapeLabel = SHAPES.find((s) => s.id === shapeId)?.label;
  const canSubmitColor = hasArtwork !== null && shapeId !== null && colorW > 0 && colorH > 0 && colorQty > 0;

  // ---- плёнка ----
  const filmSize = FILM_SIZES.find((s) => s.id === filmSizeId);
  const filmColor = FILM_COLORS.find((c) => c.id === filmColorId);
  const filmDiscount = filmDiscountPerUnit(filmQty);
  const filmTotal = filmSize ? filmLineTotal(filmQty, filmSize.price) : 0;
  const canSubmitFilm = hasArtwork !== null && filmColorId !== null && filmSizeId !== null && filmQty > 0;

  // ---- без подложки: свой размер ----
  const nbTotal = noBackingTotal(nbQty);
  const canSubmitNb = hasArtwork !== null && nbW > 0 && nbH > 0 && nbQty >= NO_BACKING_MIN_QTY;

  // ---- без подложки: режим работы ----
  const hoursTotal = hoursQty > 0 ? hoursQty * WORK_HOURS_STICKER_PRICE : 0;
  const canSubmitHours = hasArtwork !== null && hoursQty > 0;

  function buildOrder(kind) {
    if (kind === "color") {
      return {
        typeLabel,
        facts: [
          { label: "Форма", value: shapeLabel || "—" },
          { label: "Размер", value: `${colorW} × ${colorH} см` },
          { label: "Площадь", value: `${colorCalc.areaM2.toFixed(2)} м² × ${formatRub(COLOR_PRICE_PER_M2)}/м²` },
        ],
        qty: colorQty,
        hasArtwork,
        isEstimate: false,
        grandTotal: colorCalc.total,
      };
    }
    if (kind === "film") {
      return {
        typeLabel,
        facts: [
          { label: "Цвет нанесения", value: filmColor?.label || "—" },
          { label: "Размер", value: filmSize?.label || "—" },
          { label: "Цена за штуку", value: formatRub(Math.max((filmSize?.price || 0) - filmDiscount, 0)) },
        ],
        qty: filmQty,
        hasArtwork,
        isEstimate: false,
        grandTotal: filmTotal,
      };
    }
    if (kind === "no-backing-hours") {
      return {
        typeLabel,
        facts: [{ label: "Наклейка", value: "Режим работы" }],
        qty: hoursQty,
        hasArtwork,
        isEstimate: false,
        grandTotal: hoursTotal,
      };
    }
    // no-backing (свой размер)
    return {
      typeLabel,
      facts: [{ label: "Размер", value: `${nbW} × ${nbH} см` }],
      qty: nbQty,
      hasArtwork,
      isEstimate: true,
      grandTotal: nbTotal,
    };
  }

  const [activeOrderKind, setActiveOrderKind] = useState(null);
  const order = useMemo(() => (activeOrderKind ? buildOrder(activeOrderKind) : null), [
    activeOrderKind,
    typeLabel,
    shapeLabel,
    colorW,
    colorH,
    colorCalc,
    colorQty,
    filmColor,
    filmSize,
    filmDiscount,
    filmTotal,
    filmQty,
    nbW,
    nbH,
    nbTotal,
    nbQty,
    hoursQty,
    hoursTotal,
    hasArtwork,
  ]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать наклейки.", ""];
    lines.push(`Тип наклейки: ${order.typeLabel}`);
    order.facts.forEach((f) => lines.push(`${f.label}: ${f.value}`));
    lines.push(`Количество: ${order.qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    lines.push("");
    lines.push(`${order.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}: ${formatRub(order.grandTotal)}`);
    if (order.isEstimate) lines.push("(подтверждается после проверки макета)");
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [order, hasArtwork]);

  function openCart(kind) {
    setActiveOrderKind(kind);
    setCartOpen(true);
  }

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор наклеек</h1>
        </div>

        {/* Макет — общий блок для всех калькуляторов */}
        <div className="rc-step">
          <span className="rc-step-title">Есть ли у вас готовый макет?</span>
          <div className="rc-choice-row">
            <button type="button" className={"rc-choice" + (hasArtwork === true ? " is-active" : "")} onClick={() => setHasArtwork(true)}>
              Да, у меня есть готовый макет
            </button>
            <button type="button" className={"rc-choice" + (hasArtwork === false ? " is-active" : "")} onClick={() => setHasArtwork(false)}>
              Нет, нужен дизайн
            </button>
          </div>

          {hasArtwork === true && (
            <div className="rc-note rc-note--fade">
              <p>Не забудьте прикрепить его к собранному заказу!</p>
              <a className="text-link" href="/artwork-requirements">
                <span className="link-text">Требования к макету</span>
                <span className="link-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
            </div>
          )}

          {hasArtwork === false && (
            <div className="rc-note rc-note--fade rc-note--fee">
              <p>Стоимость разработки дизайна</p>
              <p className="rc-fee-line">400–800 ₽</p>
            </div>
          )}
        </div>

        {/* Тип наклейки */}
        <div className="rc-step">
          <span className="rc-step-title">Тип наклейки</span>
          <div className="rc-choice-row">
            {STICKER_TYPES.map((t) => (
              <button key={t.id} type="button" className={"rc-choice" + (stickerType === t.id ? " is-active" : "")} onClick={() => setStickerType(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ЦВЕТНАЯ ПЕЧАТЬ */}
        {stickerType === "color" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Форма наклейки</span>
              <div className="rc-choice-row">
                {SHAPES.map((s) => (
                  <button key={s.id} type="button" className={"rc-choice" + (shapeId === s.id ? " is-active" : "")} onClick={() => setShapeId(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Размер наклейки</span>
              <div className="tag-custom-inputs">
                <label className="tag-input-field">
                  <span>Ширина, см</span>
                  <input type="number" min={1} step={0.5} value={colorW} onChange={(e) => setColorW(Number(e.target.value))} />
                </label>
                <label className="tag-input-field">
                  <span>Высота, см</span>
                  <input type="number" min={1} step={0.5} value={colorH} onChange={(e) => setColorH(Number(e.target.value))} />
                </label>
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <div className="rc-slider-block">
                <div className="rc-slider-row">
                  <input
                    type="range"
                    min={COLOR_QTY_MIN}
                    max={COLOR_QTY_MAX}
                    step={COLOR_QTY_STEP}
                    value={colorQty}
                    onChange={(e) => setColorQty(Number(e.target.value))}
                  />
                  <span className="rc-slider-value">{colorQty} шт</span>
                </div>
              </div>
            </div>

            <div className="rc-summary">
              <span className="rc-step-title">Итог заказа</span>
              <div className="rc-total-row">
                <span>Итоговая стоимость</span>
                <span className="rc-total-value">{formatRub(colorCalc.total)}</span>
              </div>
              <button type="button" className="btn-primary rc-submit" disabled={!canSubmitColor} onClick={() => openCart("color")}>
                <span>Добавить в корзину</span>
                <span className="btn-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              {!canSubmitColor && <p className="rc-hint rc-hint--center">Ответьте про макет, выберите форму и укажите размер.</p>}
            </div>
          </>
        )}

        {/* ПРОЗРАЧНАЯ ПЛЁНКА */}
        {stickerType === "film" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Цвет нанесения</span>
              <div className="rc-swatch-row">
                {FILM_COLORS.map((c) => (
                  <button key={c.id} type="button" className={"rc-swatch" + (filmColorId === c.id ? " is-active" : "")} onClick={() => setFilmColorId(c.id)}>
                    <span className="rc-swatch-dot" style={{ background: c.swatch }} />
                    <span className="rc-swatch-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Размер</span>
              <div className="rc-choice-row">
                {FILM_SIZES.map((s) => (
                  <button key={s.id} type="button" className={"rc-choice" + (filmSizeId === s.id ? " is-active" : "")} onClick={() => setFilmSizeId(s.id)}>
                    {s.label} — {s.price} ₽/шт
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <div className="rc-slider-block">
                <div className="rc-slider-row">
                  <input type="range" min={100} max={1000} step={100} value={filmQty} onChange={(e) => setFilmQty(Number(e.target.value))} />
                  <span className="rc-slider-value">{filmQty} шт</span>
                </div>
                {filmSize && (
                  <div className="rc-order-item">
                    <span>
                      {filmQty} шт × {formatRub(Math.max(filmSize.price - filmDiscount, 0))}
                      {filmDiscount > 0 && ` (скидка ${filmDiscount} ₽/шт)`}
                    </span>
                    <span className="rc-order-price">{formatRub(filmTotal)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rc-summary">
              <span className="rc-step-title">Итог заказа</span>
              <div className="rc-total-row">
                <span>Итоговая стоимость</span>
                <span className="rc-total-value">{formatRub(filmTotal)}</span>
              </div>
              <button type="button" className="btn-primary rc-submit" disabled={!canSubmitFilm} onClick={() => openCart("film")}>
                <span>Добавить в корзину</span>
                <span className="btn-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              {!canSubmitFilm && <p className="rc-hint rc-hint--center">Ответьте про макет, выберите цвет нанесения и размер.</p>}
            </div>
          </>
        )}


        {/* БЕЗ ПОДЛОЖКИ */}
        {stickerType === "no-backing" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Вариант</span>
              <div className="rc-choice-row">
                {NB_MODES.map((m) => (
                  <button key={m.id} type="button" className={"rc-choice" + (nbMode === m.id ? " is-active" : "")} onClick={() => setNbMode(m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {nbMode === "custom" && (
              <>
                <div className="rc-step">
                  <span className="rc-step-title">Размер</span>
                  <div className="tag-custom-inputs">
                    <label className="tag-input-field">
                      <span>Ширина, см</span>
                      <input type="number" min={1} step={0.5} value={nbW} onChange={(e) => setNbW(Number(e.target.value))} />
                    </label>
                    <label className="tag-input-field">
                      <span>Высота, см</span>
                      <input type="number" min={1} step={0.5} value={nbH} onChange={(e) => setNbH(Number(e.target.value))} />
                    </label>
                  </div>
                  <p className="rc-hint">
                    Стандарт: {NO_BACKING_DEFAULT.wCm} × {NO_BACKING_DEFAULT.hCm} см · ориентировочная стоимость {NO_BACKING_PRICE} ₽/шт · минимальный заказ {NO_BACKING_MIN_QTY} шт
                  </p>
                </div>

                <div className="rc-step">
                  <span className="rc-step-title">Количество</span>
                  <div className="rc-slider-block">
                    <div className="rc-slider-row">
                      <input type="range" min={NO_BACKING_MIN_QTY} max={500} step={10} value={nbQty} onChange={(e) => setNbQty(Number(e.target.value))} />
                      <span className="rc-slider-value">{nbQty} шт</span>
                    </div>
                    <div className="rc-order-item">
                      <span>{nbQty} шт × {NO_BACKING_PRICE} ₽ (ориентировочно)</span>
                      <span className="rc-order-price">{formatRub(nbTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="tag-shipping-note">
                  Итоговая стоимость зависит от сложности макета и подтверждается после проверки. Макет должен быть максимально
                  простым: чёрный контур, белый фон, без мелких и сложных элементов.
                </div>

                <div className="rc-summary">
                  <span className="rc-step-title">Итог заказа</span>
                  <div className="rc-total-row">
                    <span>Ориентировочная стоимость</span>
                    <span className="rc-total-value">{formatRub(nbTotal)}</span>
                  </div>
                  <button type="button" className="btn-primary rc-submit" disabled={!canSubmitNb} onClick={() => openCart("no-backing")}>
                    <span>Добавить в корзину</span>
                    <span className="btn-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                  {!canSubmitNb && <p className="rc-hint rc-hint--center">Ответьте про макет и укажите размер (минимум {NO_BACKING_MIN_QTY} шт).</p>}
                </div>
              </>
            )}

            {nbMode === "hours" && (
              <>
                <div className="rc-step">
                  <span className="rc-step-title">Количество</span>
                  <div className="tag-custom-inputs">
                    <label className="tag-input-field">
                      <span>Штук</span>
                      <input type="number" min={1} value={hoursQty} onChange={(e) => setHoursQty(Number(e.target.value))} />
                    </label>
                  </div>
                </div>

                <div className="rc-summary">
                  <span className="rc-step-title">Итог заказа</span>
                  <div className="rc-total-row">
                    <span>Итоговая стоимость</span>
                    <span className="rc-total-value">{formatRub(hoursTotal)}</span>
                  </div>
                  <button type="button" className="btn-primary rc-submit" disabled={!canSubmitHours} onClick={() => openCart("no-backing-hours")}>
                    <span>Добавить в корзину</span>
                    <span className="btn-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                  {!canSubmitHours && <p className="rc-hint rc-hint--center">Ответьте про макет и укажите количество.</p>}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
    </section>
  );
}
