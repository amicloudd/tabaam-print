"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import { BAG_PRICE, BAG_SIZE_NOTE, BAG_IMAGE } from "@/lib/bag-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./bag-calculator.css";

const WHATSAPP_PHONE = "79282699936";
const PRODUCT_LABEL = "Картонные брендированные пакеты";

export default function BagCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [qty, setQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);

  const grandTotal = qty > 0 ? BAG_PRICE * qty : null;
  const canSubmit = hasArtwork !== null && qty > 0;

  const order = useMemo(() => {
    if (!canSubmit) return null;
    return {
      productLabel: PRODUCT_LABEL,
      sizeLabel: BAG_SIZE_NOTE,
      qty,
      hasArtwork,
      grandTotal,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, qty, hasArtwork, grandTotal]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать картонные брендированные пакеты.", ""];
    lines.push(`Размер: ${order.sizeLabel}`);
    lines.push(`Количество: ${order.qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да, стоимость уточняется" : "нет, макет есть"}`);
    lines.push("");
    lines.push(`Итоговая стоимость: ${formatRub(order.grandTotal)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [order, hasArtwork]);

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор картонных брендированных пакетов</h1>
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
              <p className="rc-fee-line">Уточняется</p>
            </div>
          )}
        </div>

        <div className="bag-hero-photo">
          <img src={BAG_IMAGE} alt={PRODUCT_LABEL} loading="lazy" />
        </div>

        <div className="rc-step">
          <span className="rc-step-title">{PRODUCT_LABEL}</span>
          <dl className="cart-fact-list">
            <div className="cart-fact">
              <dt>Цена</dt>
              <dd>{formatRub(BAG_PRICE)}/шт</dd>
            </div>
            <div className="cart-fact">
              <dt>Размер</dt>
              <dd>{BAG_SIZE_NOTE}</dd>
            </div>
          </dl>

          <label className="bag-field" style={{ marginTop: 16 }}>
            <span>Количество, шт</span>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </label>
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
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
    </section>
  );
}
