"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import { SOUVENIR_MODULES } from "./registry";
import { DESIGN_FEE_FROM } from "@/lib/souvenir-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./souvenir-calculator.css";

const WHATSAPP_PHONE = "79282699936";

export default function SouvenirCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [productId, setProductId] = useState(null);
  const [moduleOrder, setModuleOrder] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const productModule = SOUVENIR_MODULES.find((m) => m.id === productId);
  const ModuleComponent = productModule?.Component;

  function selectProduct(id) {
    setProductId(id);
    setModuleOrder(null);
  }

  const grandTotal = moduleOrder?.total ?? null;
  const isEstimate = !!moduleOrder && (moduleOrder.isEstimate || grandTotal === null);
  const canSubmit = hasArtwork !== null && !!moduleOrder?.canSubmit;

  const order = useMemo(() => {
    if (!moduleOrder || !productModule) return null;
    return {
      productLabel: productModule.label,
      facts: moduleOrder.facts,
      qty: moduleOrder.qty,
      hasArtwork,
      isEstimate,
      grandTotal,
    };
  }, [moduleOrder, productModule, hasArtwork, isEstimate, grandTotal]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать корпоративную сувенирную продукцию.", ""];
    lines.push(`Товар: ${order.productLabel}`);
    order.facts.forEach((f) => lines.push(`${f.label}: ${f.value}`));
    lines.push(`Количество: ${order.qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? `да (от ${DESIGN_FEE_FROM} ₽)` : "нет, макет есть"}`);
    lines.push("");
    lines.push(
      order.grandTotal === null
        ? "Стоимость: уточняется"
        : `${order.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}: ${formatRub(order.grandTotal)}`
    );
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [order, hasArtwork]);

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор корпоративной сувенирной продукции</h1>
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
              <p className="rc-fee-line">от {DESIGN_FEE_FROM} ₽</p>
            </div>
          )}
        </div>

        {/* Товар */}
        <div className="rc-step">
          <span className="rc-step-title">Товар</span>
          <div className="rc-choice-row">
            {SOUVENIR_MODULES.map((m) => (
              <button key={m.id} type="button" className={"rc-choice" + (productId === m.id ? " is-active" : "")} onClick={() => selectProduct(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {ModuleComponent && <ModuleComponent onOrderChange={setModuleOrder} />}

        {moduleOrder && (
          <div className="rc-summary">
            <span className="rc-step-title">Итог заказа</span>
            <div className="rc-total-row">
              <span>{isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}</span>
              <span className="rc-total-value">{grandTotal === null ? "Уточняется" : formatRub(grandTotal)}</span>
            </div>
            <button type="button" className="btn-primary rc-submit" disabled={!canSubmit} onClick={() => setCartOpen(true)}>
              <span>Добавить в корзину</span>
              <span className="btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
            {!canSubmit && <p className="rc-hint rc-hint--center">Ответьте про макет, чтобы продолжить.</p>}
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
    </section>
  );
}
