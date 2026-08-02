"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import { DESIGN_FEE, WEIGHT_LABEL, TIRAZH_OPTIONS } from "@/lib/chocolate-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";

const WHATSAPP_PHONE = "79282699936";
const PRODUCT_LABEL = "Шоколадки 5 г";

export default function ChocolateCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [tirazhId, setTirazhId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const tirazh = TIRAZH_OPTIONS.find((t) => t.id === tirazhId);

  const designFee = hasArtwork === false ? DESIGN_FEE : 0;
  const grandTotal = tirazh ? tirazh.price + designFee : null;
  const canSubmit = hasArtwork !== null && !!tirazh;

  const order = useMemo(() => {
    if (!canSubmit) return null;
    return {
      productLabel: PRODUCT_LABEL,
      weightLabel: WEIGHT_LABEL,
      qty: tirazh.qty,
      hasArtwork,
      designFee,
      grandTotal,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, tirazh, hasArtwork, designFee, grandTotal]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать брендированные шоколадки.", ""];
    lines.push(`Вид продукции: ${order.productLabel}`);
    lines.push(`Вес шоколадки: ${order.weightLabel}`);
    lines.push(`Количество: ${order.qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? `да (+${DESIGN_FEE} ₽)` : "нет, макет есть"}`);
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
          <h1 className="section-title">Калькулятор брендированных шоколадок</h1>
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

        {/* Продукция */}
        <div className="rc-step">
          <span className="rc-step-title">Шоколадки {WEIGHT_LABEL}</span>
          <dl className="cart-fact-list">
            <div className="cart-fact">
              <dt>Вес шоколадки</dt>
              <dd>{WEIGHT_LABEL}</dd>
            </div>
          </dl>
        </div>

        {/* Количество */}
        <div className="rc-step">
          <span className="rc-step-title">Выберите тираж</span>
          <div className="rc-choice-row">
            {TIRAZH_OPTIONS.map((t) => (
              <button key={t.id} type="button" className={"rc-choice" + (tirazhId === t.id ? " is-active" : "")} onClick={() => setTirazhId(t.id)}>
                {t.qty} шт — {formatRub(t.price)}
              </button>
            ))}
          </div>
        </div>

        {order && (
          <div className="rc-summary">
            <span className="rc-step-title">Итог заказа</span>
            <dl className="cart-fact-list">
              <div className="cart-fact">
                <dt>Вид продукции</dt>
                <dd>{order.productLabel}</dd>
              </div>
              <div className="cart-fact">
                <dt>Вес шоколадки</dt>
                <dd>{order.weightLabel}</dd>
              </div>
              <div className="cart-fact">
                <dt>Количество</dt>
                <dd>{order.qty} шт</dd>
              </div>
              <div className="cart-fact">
                <dt>Нужен дизайн</dt>
                <dd>{order.hasArtwork ? "Нет, макет готов" : `Да (+${order.designFee} ₽)`}</dd>
              </div>
            </dl>
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
