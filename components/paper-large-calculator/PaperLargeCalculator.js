"use client";

import { useEffect, useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import { DESIGN_FEE, PRODUCTS } from "@/lib/paper-large-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";

const WHATSAPP_PHONE = "79282699936";

export default function PaperLargeCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [productId, setProductId] = useState(null);
  const [sizeId, setSizeId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId);
  const hasSizeChoice = product && product.sizes.length > 1;
  const size = product ? product.sizes.find((s) => s.id === sizeId) || (!hasSizeChoice ? product.sizes[0] : null) : null;

  // при товаре с единственным размером — выбираем его автоматически
  useEffect(() => {
    if (product && !hasSizeChoice) {
      setSizeId(product.sizes[0].id);
    } else {
      setSizeId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const designFee = hasArtwork === false ? DESIGN_FEE : 0;
  const grandTotal = size ? size.price + designFee : null;
  const canSubmit = hasArtwork !== null && !!product && !!size;

  const order = useMemo(() => {
    if (!canSubmit) return null;
    return {
      productLabel: product.label,
      sizeLabel: size.label,
      hasArtwork,
      designFee,
      grandTotal,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, product, size, hasArtwork, designFee, grandTotal]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать бумажную продукцию (большой тираж).", ""];
    lines.push(`Вид продукции: ${order.productLabel}`);
    lines.push(`Размер: ${order.sizeLabel}`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? `да (+${DESIGN_FEE} ₽)` : "нет, макет есть"}`);
    lines.push("");
    lines.push(`Итоговая стоимость: ${formatRub(order.grandTotal)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [order, hasArtwork]);

  function selectProduct(id) {
    setProductId(id);
  }

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор бумажной продукции (большие тиражи)</h1>
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

        {/* Выберите продукцию */}
        <div className="rc-step">
          <span className="rc-step-title">Выберите продукцию</span>
          <div className="rc-choice-row">
            {PRODUCTS.map((p) => (
              <button key={p.id} type="button" className={"rc-choice" + (productId === p.id ? " is-active" : "")} onClick={() => selectProduct(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {product && (
          <>
            {product.printTypeLabel && (
              <div className="rc-step">
                <dl className="cart-fact-list">
                  <div className="cart-fact">
                    <dt>Тип печати</dt>
                    <dd>{product.printTypeLabel}</dd>
                  </div>
                </dl>
              </div>
            )}

            {hasSizeChoice ? (
              <div className="rc-step">
                <span className="rc-step-title">Выберите вид и размер</span>
                <div className="rc-choice-row">
                  {product.sizes.map((s) => (
                    <button key={s.id} type="button" className={"rc-choice" + (sizeId === s.id ? " is-active" : "")} onClick={() => setSizeId(s.id)}>
                      {s.label} — {formatRub(s.price)} / 1000 шт
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              size && (
                <div className="rc-step">
                  <dl className="cart-fact-list">
                    <div className="cart-fact">
                      <dt>Размер</dt>
                      <dd>{size.label}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Стоимость</dt>
                      <dd>{formatRub(size.price)} / 1000 шт</dd>
                    </div>
                  </dl>
                </div>
              )
            )}
          </>
        )}

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
