"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import SewnTagChina from "./SewnTagChina";
import {
  DESIGN_FEE,
  SATIN_SIZES,
  SATIN_PRICE_PER_UNIT,
  SATIN_MIN_QTY,
  satinLineTotal,
  SATIN_COLORS,
  PRINT_COLORS,
} from "@/lib/sewn-tags-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./sewn-tag-calculator.css";

const WHATSAPP_PHONE = "79282699936";
const SATIN_STEPS = Array.from({ length: 10 }, (_, i) => (i + 1) * 100);

export default function SewnTagCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [production, setProduction] = useState(null); // "own" | "china"

  const [satinSizeId, setSatinSizeId] = useState(SATIN_SIZES[0].id);
  const [satinQty, setSatinQty] = useState(100);
  const [tagColorId, setTagColorId] = useState(null);
  const [printColorId, setPrintColorId] = useState(null);
  const [printColorCustom, setPrintColorCustom] = useState("");

  const [cartOpen, setCartOpen] = useState(false);

  const satinSize = SATIN_SIZES.find((s) => s.id === satinSizeId);
  const tagColor = SATIN_COLORS.find((c) => c.id === tagColorId);
  const printColor = PRINT_COLORS.find((c) => c.id === printColorId);
  const printColorLabel = printColor ? (printColor.id === "other" ? printColorCustom.trim() || "другой цвет" : printColor.label) : "—";

  const designFee = hasArtwork === false ? DESIGN_FEE : 0;
  const satinBaseTotal = satinLineTotal(satinQty);
  const satinGrandTotal = satinBaseTotal + designFee;

  const canSubmitSatin =
    hasArtwork !== null &&
    satinQty > 0 &&
    tagColorId !== null &&
    printColorId !== null &&
    (printColorId !== "other" || printColorCustom.trim().length > 0);

  const order = useMemo(
    () => ({
      tagTypeLabel: "Пришивные сатиновые",
      productionLabel: "Своё производство",
      sizeLabel: satinSize?.label || "—",
      tagColorLabel: tagColor?.label || "—",
      printColorLabel,
      qty: satinQty,
      hasArtwork,
      designFee,
      grandTotal: satinGrandTotal,
    }),
    [satinSize, tagColor, printColorLabel, satinQty, hasArtwork, designFee, satinGrandTotal]
  );

  const whatsappUrl = useMemo(() => {
    const lines = ["Здравствуйте!", "Хочу заказать пришивные бирки.", ""];
    lines.push("Тип бирок: пришивные сатиновые");
    lines.push("Производство: своё");
    lines.push(`Размер: ${satinSize?.label || "—"}`);
    lines.push(`Цвет бирки: ${tagColor?.label || "—"}`);
    lines.push(`Цвет печати: ${printColorLabel.toLowerCase()}`);
    lines.push(`Количество: ${satinQty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    lines.push("");
    lines.push(`Итоговая стоимость: ${formatRub(satinGrandTotal)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [satinSize, tagColor, printColorLabel, satinQty, hasArtwork, satinGrandTotal]);

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор пришивных бирок</h1>
        </div>

        {/* 1. Макет — общий блок для всех калькуляторов */}
        <div className="rc-step">
          <span className="rc-step-title">1. Есть ли у вас готовый макет?</span>
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

        {/* 2. Производство */}
        <div className="rc-step">
          <span className="rc-step-title">2. Выберите производство</span>
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
              <span className="rc-step-title">Пришивные сатиновые бирки</span>
              <p className="rc-hint">Размер</p>
              <div className="rc-choice-row">
                {SATIN_SIZES.map((s) => (
                  <button key={s.id} type="button" className={"rc-choice" + (satinSizeId === s.id ? " is-active" : "")} onClick={() => setSatinSizeId(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>

              <dl className="cart-fact-list" style={{ marginTop: 18 }}>
                <div className="cart-fact">
                  <dt>Стоимость</dt>
                  <dd>{SATIN_PRICE_PER_UNIT} ₽ / шт</dd>
                </div>
                <div className="cart-fact">
                  <dt>Минимальный заказ</dt>
                  <dd>{SATIN_MIN_QTY} шт</dd>
                </div>
              </dl>

              <div className="rc-slider-block">
                <div className="rc-slider-row">
                  <input
                    type="range"
                    min={100}
                    max={1000}
                    step={100}
                    value={satinQty}
                    onChange={(e) => setSatinQty(Number(e.target.value))}
                    list="satin-tag-steps"
                  />
                  <datalist id="satin-tag-steps">
                    {SATIN_STEPS.map((n) => (
                      <option value={n} key={n} />
                    ))}
                  </datalist>
                  <span className="rc-slider-value">{satinQty} шт</span>
                </div>
                <div className="rc-order-item">
                  <span>{satinQty} шт × {SATIN_PRICE_PER_UNIT} ₽</span>
                  <span className="rc-order-price">{formatRub(satinBaseTotal)}</span>
                </div>
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Выберите цвет бирки</span>
              <div className="rc-carousel">
                {SATIN_COLORS.map((c) => (
                  <div className={"ribbon-card" + (tagColorId === c.id ? " is-selected" : "")} key={c.id}>
                    <button type="button" className="ribbon-card-tap" onClick={() => setTagColorId(c.id)} aria-label={`Цвет бирки: ${c.label}`}>
                      <span className="ribbon-card-photo">
                        <img src={c.src} alt={c.label} loading="lazy" />
                      </span>
                      <span className="ribbon-card-name">{c.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Выберите цвет печати</span>
              <div className="rc-swatch-row">
                {PRINT_COLORS.map((c) => (
                  <button key={c.id} type="button" className={"rc-swatch" + (printColorId === c.id ? " is-active" : "")} onClick={() => setPrintColorId(c.id)}>
                    <span className={"rc-swatch-dot" + (c.id === "other" ? " is-other" : "")} style={c.swatch ? { background: c.swatch } : undefined}>
                      {c.id === "other" && "?"}
                    </span>
                    <span className="rc-swatch-label">{c.label}</span>
                  </button>
                ))}
              </div>
              {printColorId === "other" && (
                <label className="stc-text-field">
                  <span>Укажите желаемый цвет печати</span>
                  <input type="text" value={printColorCustom} onChange={(e) => setPrintColorCustom(e.target.value)} placeholder="например, бордовый" />
                </label>
              )}
            </div>

            <div className="rc-summary">
              <span className="rc-step-title">Итог заказа</span>
              <div className="rc-total-row">
                <span>Итоговая стоимость</span>
                <span className="rc-total-value">{formatRub(satinGrandTotal)}</span>
              </div>
              <button type="button" className="btn-primary rc-submit" disabled={!canSubmitSatin} onClick={() => setCartOpen(true)}>
                <span>Добавить в корзину</span>
                <span className="btn-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              {!canSubmitSatin && <p className="rc-hint rc-hint--center">Ответьте про макет, выберите цвет бирки и цвет печати.</p>}
            </div>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
          </>
        )}

        {production === "china" && <SewnTagChina hasArtwork={hasArtwork} />}
      </div>
    </section>
  );
}
