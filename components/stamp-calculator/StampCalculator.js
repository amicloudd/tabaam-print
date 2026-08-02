"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import { DESIGN_FEE, INK_COLORS, DOCUMENT_STAMP, RECT_SIZES } from "@/lib/stamp-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./stamp-calculator.css";

const WHATSAPP_PHONE = "79282699936";

function priceRangeText(min, max) {
  return min === max ? formatRub(min) : `${formatRub(min)}–${formatRub(max)}`;
}

export default function StampCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [inkColorId, setInkColorId] = useState("black");
  const [inkColorCustom, setInkColorCustom] = useState("");
  const [stampType, setStampType] = useState(null); // "document" | "rect"
  const [rectSizeId, setRectSizeId] = useState(null);
  const [customW, setCustomW] = useState(10);
  const [customH, setCustomH] = useState(5);
  const [cartOpen, setCartOpen] = useState(false);

  const inkColor = INK_COLORS.find((c) => c.id === inkColorId);
  const inkColorLabel = inkColor ? (inkColor.id === "other" ? inkColorCustom.trim() || "другой цвет" : inkColor.label) : "—";

  const rectSize = RECT_SIZES.find((s) => s.id === rectSizeId);
  const isCustomSize = !!rectSize?.isCustom;

  let baseMin = null;
  let baseMax = null;
  let sizeLabel = "—";
  let typeLabel = "—";

  if (stampType === "document") {
    typeLabel = "Печать для документов";
    sizeLabel = DOCUMENT_STAMP.diameterLabel;
    baseMin = baseMax = DOCUMENT_STAMP.price;
  } else if (stampType === "rect" && rectSize) {
    typeLabel = "Прямоугольный штамп";
    if (isCustomSize) {
      sizeLabel = `${customW} × ${customH} см (в пределах ${rectSize.label})`;
      baseMin = rectSize.priceMin;
      baseMax = rectSize.priceMax;
    } else {
      sizeLabel = rectSize.label;
      baseMin = baseMax = rectSize.price;
    }
  }

  const designFee = hasArtwork === false ? DESIGN_FEE : 0;
  const totalMin = baseMin !== null ? baseMin + designFee : null;
  const totalMax = baseMax !== null ? baseMax + designFee : null;
  const isEstimate = isCustomSize;

  const canSubmit =
    hasArtwork !== null &&
    inkColorId !== null &&
    (inkColorId !== "other" || inkColorCustom.trim().length > 0) &&
    stampType !== null &&
    (stampType === "document" || (rectSizeId !== null && (!isCustomSize || (customW > 0 && customH > 0))));

  const order = useMemo(() => {
    if (totalMin === null) return null;
    return {
      typeLabel,
      sizeLabel,
      inkColorLabel,
      hasArtwork,
      designFee,
      isEstimate,
      totalText: priceRangeText(totalMin, totalMax),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeLabel, sizeLabel, inkColorLabel, hasArtwork, designFee, isEstimate, totalMin, totalMax]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать штамп.", ""];
    lines.push(`Тип штампа: ${order.typeLabel}`);
    lines.push(`Размер: ${order.sizeLabel}`);
    lines.push(`Цвет подушки: ${order.inkColorLabel.toLowerCase()}`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    lines.push("");
    lines.push(`${order.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}: ${order.totalText}`);
    if (order.isEstimate) lines.push("(точная стоимость зависит от размера и сложности макета)");
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [order, hasArtwork]);

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор штампов</h1>
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

        {/* Цвет красящей подушки */}
        <div className="rc-step">
          <span className="rc-step-title">Цвет красящей подушки</span>
          <div className="rc-choice-row">
            {INK_COLORS.map((c) => (
              <button key={c.id} type="button" className={"rc-choice" + (inkColorId === c.id ? " is-active" : "")} onClick={() => setInkColorId(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          {inkColorId === "other" && (
            <label className="stc-text-field">
              <span>Укажите желаемый цвет подушки</span>
              <input type="text" value={inkColorCustom} onChange={(e) => setInkColorCustom(e.target.value)} placeholder="например, фиолетовый" />
            </label>
          )}
        </div>

        {/* Тип штампа */}
        <div className="rc-step">
          <span className="rc-step-title">Выберите тип штампа</span>
          <div className="rc-choice-row">
            <button type="button" className={"rc-choice" + (stampType === "document" ? " is-active" : "")} onClick={() => setStampType("document")}>
              Печать для документов
            </button>
            <button type="button" className={"rc-choice" + (stampType === "rect" ? " is-active" : "")} onClick={() => setStampType("rect")}>
              Прямоугольные штампы
            </button>
          </div>
        </div>

        {stampType === "document" && (
          <div className="rc-step">
            <dl className="cart-fact-list">
              <div className="cart-fact">
                <dt>Форма</dt>
                <dd>{DOCUMENT_STAMP.shapeLabel}</dd>
              </div>
              <div className="cart-fact">
                <dt>Механизм</dt>
                <dd>{DOCUMENT_STAMP.mechanismLabel}</dd>
              </div>
              <div className="cart-fact">
                <dt>Диаметр</dt>
                <dd>{DOCUMENT_STAMP.diameterLabel}</dd>
              </div>
              <div className="cart-fact">
                <dt>Стоимость</dt>
                <dd>{formatRub(DOCUMENT_STAMP.price)}</dd>
              </div>
            </dl>
          </div>
        )}

        {stampType === "rect" && (
          <div className="rc-step">
            <span className="rc-hint">Выберите размер</span>
            <div className="rc-choice-row">
              {RECT_SIZES.map((s) => (
                <button key={s.id} type="button" className={"rc-choice" + (rectSizeId === s.id ? " is-active" : "")} onClick={() => setRectSizeId(s.id)}>
                  {s.label} — {s.isCustom ? priceRangeText(s.priceMin, s.priceMax) : formatRub(s.price)}
                </button>
              ))}
            </div>

            {isCustomSize && (
              <>
                <div className="stamp-custom-inputs">
                  <label className="stc-text-field" style={{ marginTop: 0 }}>
                    <span>Ширина, см (до {rectSize.maxW})</span>
                    <input type="number" min={1} max={rectSize.maxW} step={0.5} value={customW} onChange={(e) => setCustomW(Number(e.target.value))} />
                  </label>
                  <label className="stc-text-field" style={{ marginTop: 0 }}>
                    <span>Высота, см (до {rectSize.maxH})</span>
                    <input type="number" min={1} max={rectSize.maxH} step={0.5} value={customH} onChange={(e) => setCustomH(Number(e.target.value))} />
                  </label>
                </div>
                <div className="rc-order-item">
                  <span>Ориентировочная стоимость</span>
                  <span className="rc-order-price">{priceRangeText(rectSize.priceMin, rectSize.priceMax)}</span>
                </div>
                <p className="rc-hint">Точная стоимость зависит от размера и сложности макета.</p>
              </>
            )}
          </div>
        )}

        {order && (
          <div className="rc-summary">
            <span className="rc-step-title">Итог заказа</span>
            <div className="rc-total-row">
              <span>{isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}</span>
              <span className="rc-total-value">{order.totalText}</span>
            </div>
            <button type="button" className="btn-primary rc-submit" disabled={!canSubmit} onClick={() => setCartOpen(true)}>
              <span>Добавить в корзину</span>
              <span className="btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
    </section>
  );
}
