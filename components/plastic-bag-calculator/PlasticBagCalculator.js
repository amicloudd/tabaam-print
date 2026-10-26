"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import PlasticBagChina from "./PlasticBagChina";
import { DESIGN_FEE, PVD_SIZES, bagColorsFor, PRINT_COLOR_COUNTS } from "@/lib/plastic-bag-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./plastic-bag-calculator.css";

const WHATSAPP_PHONE = "79282699936";

export default function PlasticBagCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [production, setProduction] = useState(null); // "own" | "china"

  const [sizeId, setSizeId] = useState(null);
  const [colorId, setColorId] = useState(null);
  const [printColorsId, setPrintColorsId] = useState(null);

  const [cartOpen, setCartOpen] = useState(false);

  const size = PVD_SIZES.find((s) => s.id === sizeId);
  const colors = size ? bagColorsFor(size.colorGroup) : [];
  const color = colors.find((c) => c.id === colorId);
  const printColors = PRINT_COLOR_COUNTS.find((p) => p.id === printColorsId);

  const designFee = hasArtwork === false ? DESIGN_FEE : 0;
  const grandTotal = size && color && printColors ? size.price + color.surcharge + printColors.surcharge + designFee : null;
  const canSubmit = hasArtwork !== null && !!size && !!color && !!printColors;

  const order = useMemo(() => {
    if (!canSubmit) return null;
    return {
      sizeLabel: size.label,
      colorLabel: color.surcharge > 0 ? `${color.label} (+${color.surcharge} ₽)` : color.label,
      printColorsLabel: printColors.surcharge > 0 ? `${printColors.label} (+${printColors.surcharge} ₽)` : printColors.label,
      hasArtwork,
      designFee,
      grandTotal,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, size, color, printColors, hasArtwork, designFee, grandTotal]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать полиэтиленовые пакеты.", ""];
    lines.push("Производство: своё");
    lines.push(`Размер пакета: ${order.sizeLabel}`);
    lines.push(`Цвет пакета: ${order.colorLabel}`);
    lines.push(`Количество цветов печати: ${order.printColorsLabel}`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? `да (+${DESIGN_FEE} ₽)` : "нет, макет есть"}`);
    lines.push("");
    lines.push(`Итоговая стоимость: ${formatRub(order.grandTotal)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [order, hasArtwork]);

  function selectSize(id) {
    setSizeId(id);
    setColorId(null);
  }

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор полиэтиленовых пакетов</h1>
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
              <p className="rc-fee-line">+{DESIGN_FEE} ₽</p>
            </div>
          )}
        </div>

        {/* Производство */}
        <div className="rc-step">
          <span className="rc-step-title">Выберите производство</span>
          <div className="rc-choice-row">
            <button type="button" className={"rc-choice" + (production === "own" ? " is-active" : "")} onClick={() => setProduction("own")}>
              Наше производство
            </button>
            <button type="button" className={"rc-choice" + (production === "china" ? " is-active" : "")} onClick={() => setProduction("china")}>
              Производство в Китае
            </button>
          </div>
        </div>

        {production === "own" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">ПВД-пакеты — выберите размер</span>
              <div className="rc-choice-row">
                {PVD_SIZES.map((s) => (
                  <button key={s.id} type="button" className={"rc-choice" + (sizeId === s.id ? " is-active" : "")} onClick={() => selectSize(s.id)}>
                    {s.label} — {formatRub(s.price)}
                  </button>
                ))}
              </div>
              <p className="rc-hint">Все цены указаны за 100 шт.</p>
            </div>

            {size && (
              <div className="rc-step">
                <span className="rc-step-title">Цвет пакета</span>
                <div className="rc-choice-row">
                  {colors.map((c) => (
                    <button key={c.id} type="button" className={"rc-choice" + (colorId === c.id ? " is-active" : "")} onClick={() => setColorId(c.id)}>
                      {c.label}
                      {c.surcharge > 0 ? ` (+${c.surcharge} ₽)` : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rc-step">
              <span className="rc-step-title">Количество цветов печати</span>
              <div className="rc-choice-row">
                {PRINT_COLOR_COUNTS.map((p) => (
                  <button key={p.id} type="button" className={"rc-choice" + (printColorsId === p.id ? " is-active" : "")} onClick={() => setPrintColorsId(p.id)}>
                    {p.label}
                    {p.surcharge > 0 ? ` (+${p.surcharge} ₽)` : ""}
                  </button>
                ))}
              </div>
            </div>

            {order && (
              <div className="rc-summary">
                <span className="rc-step-title">Итог заказа</span>
                <div className="rc-total-row">
                  <span>Итоговая стоимость</span>
                  <span className="rc-total-value">{formatRub(order.grandTotal)}</span>
                </div>
                <button type="button" className="btn-primary rc-submit" onClick={() => setCartOpen(true)}>
                  <span>Добавить в корзину</span>
                  <span className="btn-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              </div>
            )}

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
          </>
        )}

        {production === "china" && <PlasticBagChina hasArtwork={hasArtwork} />}
      </div>
    </section>
  );
}
