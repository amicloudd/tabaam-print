"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import {
  DESIGN_FEE,
  PRODUCT_TYPES,
  PRINT_SIDES,
  BUSINESS_CARD_PRICE,
  BUSINESS_CARD_MIN_QTY,
  BUSINESS_CARD_MAX_QTY,
  businessCardDiscount,
  businessCardLineTotal,
  CARD_SIZES,
  FOLDED_CARD,
  CERTIFICATE_PRICE,
  FOIL_ITEMS,
} from "@/lib/paper-small-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./paper-small-calculator.css";

const WHATSAPP_PHONE = "79282699936";

export default function PaperSmallCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [productId, setProductId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // визитки
  const [bcSideId, setBcSideId] = useState(null);
  const [bcQty, setBcQty] = useState(BUSINESS_CARD_MIN_QTY);

  // карточки
  const [cardSizeId, setCardSizeId] = useState(null);
  const [cardSizeCustom, setCardSizeCustom] = useState("");
  const [cardSideId, setCardSideId] = useState(null);
  const [cardQty, setCardQty] = useState(100);

  // складные открытки
  const [foldedQty, setFoldedQty] = useState(FOLDED_CARD.minQty);

  // сертификат А4
  const [certQty, setCertQty] = useState(1);

  // тиснение золотом
  const [foilItemId, setFoilItemId] = useState(null);
  const [foilQty, setFoilQty] = useState(1);
  const selectedFoilItem = FOIL_ITEMS.find((i) => i.id === foilItemId);

  const productLabel = PRODUCT_TYPES.find((p) => p.id === productId)?.label || "—";
  const designFee = hasArtwork === false ? DESIGN_FEE : 0;

  // ---- визитки ----
  const bcDiscount = businessCardDiscount(bcQty);
  const bcBasePrice = bcSideId ? BUSINESS_CARD_PRICE[bcSideId] : null;
  const bcTotal = bcBasePrice !== null ? businessCardLineTotal(bcQty, bcBasePrice) : null;
  const bcSideLabel = PRINT_SIDES.find((s) => s.id === bcSideId)?.label;

  // ---- карточки ----
  const cardSize = CARD_SIZES.find((s) => s.id === cardSizeId);
  const cardIsOther = cardSize?.id === "other";
  const cardSidePrice = cardSize && cardSideId ? cardSize[cardSideId] : null;
  const cardTotal = cardSidePrice !== null && cardSidePrice !== undefined ? cardSidePrice * cardQty : null;
  const cardSideLabel = PRINT_SIDES.find((s) => s.id === cardSideId)?.label;
  const cardSizeLabel = cardIsOther ? cardSizeCustom.trim() || "уточняется" : cardSize?.label || "—";

  let order = null;
  let whatsappLines = null;

  if (productId === "business" && bcSideId && bcQty >= BUSINESS_CARD_MIN_QTY) {
    order = {
      productLabel,
      sizeLabel: "стандарт",
      printLabel: `${bcSideLabel} — ${formatRub(bcBasePrice)}/шт${bcDiscount > 0 ? ` (скидка ${bcDiscount} ₽/шт)` : ""}`,
      qty: bcQty,
      hasArtwork,
      designFee,
      isEstimate: false,
      total: bcTotal + designFee,
    };
  } else if (productId === "cards" && cardSizeId && cardSideId && cardQty > 0 && (!cardIsOther || cardSizeCustom.trim())) {
    const known = cardTotal !== null;
    order = {
      productLabel,
      sizeLabel: cardSizeLabel,
      printLabel: `${cardSideLabel}${known ? ` — ${formatRub(cardSidePrice)}/шт` : ""}`,
      qty: cardQty,
      hasArtwork,
      designFee,
      isEstimate: !known,
      total: known ? cardTotal + designFee : null,
    };
  } else if (productId === "folded" && foldedQty >= FOLDED_CARD.minQty) {
    order = {
      productLabel,
      sizeLabel: FOLDED_CARD.formatLabel,
      printLabel: FOLDED_CARD.typeLabel,
      qty: foldedQty,
      hasArtwork,
      designFee,
      isEstimate: false,
      total: FOLDED_CARD.price * foldedQty + designFee,
    };
  } else if (productId === "certificate" && certQty > 0) {
    order = {
      productLabel,
      sizeLabel: "А4",
      printLabel: `${CERTIFICATE_PRICE} ₽/шт`,
      qty: certQty,
      hasArtwork,
      designFee,
      isEstimate: false,
      total: CERTIFICATE_PRICE * certQty + designFee,
    };
  } else if (productId === "foil" && selectedFoilItem && foilQty >= selectedFoilItem.minQty) {
    const foilItem = selectedFoilItem;
    order = {
      productLabel: `${productLabel} — ${foilItem.label}`,
      sizeLabel: foilItem.sizeLabel,
      printLabel: `Тиснение золотом — ${foilItem.price} ₽/шт`,
      qty: foilQty,
      hasArtwork,
      designFee,
      isEstimate: false,
      total: foilItem.price * foilQty + designFee,
    };
  }

  const canSubmit = hasArtwork !== null && !!order;

  const finalOrder = useMemo(() => order, [order]);

  const whatsappUrl = useMemo(() => {
    if (!finalOrder) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать бумажную продукцию (малый тираж).", ""];
    lines.push(`Вид продукции: ${finalOrder.productLabel}`);
    lines.push(`Размер: ${finalOrder.sizeLabel}`);
    lines.push(`Тип печати: ${finalOrder.printLabel}`);
    lines.push(`Количество: ${finalOrder.qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? `да (+${DESIGN_FEE} ₽)` : "нет, макет есть"}`);
    lines.push("");
    lines.push(finalOrder.total === null ? "Стоимость: уточняется" : `${finalOrder.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}: ${formatRub(finalOrder.total)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalOrder, hasArtwork]);

  function selectProduct(id) {
    setProductId(id);
  }

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор бумажной продукции (малые тиражи)</h1>
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
            {PRODUCT_TYPES.map((p) => (
              <button key={p.id} type="button" className={"rc-choice" + (productId === p.id ? " is-active" : "")} onClick={() => selectProduct(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ВИЗИТКИ */}
        {productId === "business" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Тип печати</span>
              <div className="rc-choice-row">
                {PRINT_SIDES.map((s) => (
                  <button key={s.id} type="button" className={"rc-choice" + (bcSideId === s.id ? " is-active" : "")} onClick={() => setBcSideId(s.id)}>
                    {s.label} — {BUSINESS_CARD_PRICE[s.id]} ₽/шт
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <div className="rc-slider-block">
                <div className="rc-slider-row">
                  <input
                    type="range"
                    min={BUSINESS_CARD_MIN_QTY}
                    max={BUSINESS_CARD_MAX_QTY}
                    step={100}
                    value={bcQty}
                    onChange={(e) => setBcQty(Number(e.target.value))}
                  />
                  <span className="rc-slider-value">{bcQty} шт</span>
                </div>
                {bcBasePrice !== null && (
                  <div className="rc-order-item">
                    <span>
                      {bcQty} шт × {formatRub(Math.max(bcBasePrice - bcDiscount, 0))}
                      {bcDiscount > 0 && ` (скидка ${bcDiscount} ₽/шт)`}
                    </span>
                    <span className="rc-order-price">{formatRub(bcTotal)}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* КАРТОЧКИ */}
        {productId === "cards" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Размер</span>
              <div className="rc-choice-row">
                {CARD_SIZES.map((s) => (
                  <button key={s.id} type="button" className={"rc-choice" + (cardSizeId === s.id ? " is-active" : "")} onClick={() => setCardSizeId(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
              {cardIsOther && (
                <label className="pc-field">
                  <span>Укажите размер</span>
                  <input type="text" value={cardSizeCustom} onChange={(e) => setCardSizeCustom(e.target.value)} placeholder="например, 12 × 8 см" />
                </label>
              )}
            </div>

            {cardSizeId && (
              <div className="rc-step">
                <span className="rc-step-title">Тип печати</span>
                <div className="rc-choice-row">
                  {PRINT_SIDES.map((s) => (
                    <button key={s.id} type="button" className={"rc-choice" + (cardSideId === s.id ? " is-active" : "")} onClick={() => setCardSideId(s.id)}>
                      {s.label}
                      {cardSize[s.id] != null ? ` — ${cardSize[s.id]} ₽/шт` : " — цена уточняется"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <label className="pc-field" style={{ marginTop: 0 }}>
                <span>Штук</span>
                <input type="number" min={1} value={cardQty} onChange={(e) => setCardQty(Number(e.target.value))} />
              </label>
              <p className="rc-hint">Минимальный заказ и шаг ползунка добавим позже.</p>
            </div>
          </>
        )}

        {/* СКЛАДНЫЕ ОТКРЫТКИ */}
        {productId === "folded" && (
          <>
            <div className="rc-step">
              <dl className="cart-fact-list">
                <div className="cart-fact">
                  <dt>Формат</dt>
                  <dd>{FOLDED_CARD.formatLabel}</dd>
                </div>
                <div className="cart-fact">
                  <dt>Тип</dt>
                  <dd>{FOLDED_CARD.typeLabel}</dd>
                </div>
                <div className="cart-fact">
                  <dt>Стоимость</dt>
                  <dd>{FOLDED_CARD.price} ₽/шт</dd>
                </div>
              </dl>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <label className="pc-field" style={{ marginTop: 0 }}>
                <span>Штук (минимум {FOLDED_CARD.minQty})</span>
                <input type="number" min={FOLDED_CARD.minQty} value={foldedQty} onChange={(e) => setFoldedQty(Number(e.target.value))} />
              </label>
              <p className="rc-hint">Ползунок количества добавим позже.</p>
            </div>
          </>
        )}

        {/* СЕРТИФИКАТ А4 */}
        {productId === "certificate" && (
          <>
            <div className="rc-step">
              <dl className="cart-fact-list">
                <div className="cart-fact">
                  <dt>Формат</dt>
                  <dd>А4</dd>
                </div>
                <div className="cart-fact">
                  <dt>Стоимость</dt>
                  <dd>{CERTIFICATE_PRICE} ₽/шт</dd>
                </div>
              </dl>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <label className="pc-field" style={{ marginTop: 0 }}>
                <span>Штук</span>
                <input type="number" min={1} value={certQty} onChange={(e) => setCertQty(Number(e.target.value))} />
              </label>
            </div>
          </>
        )}

        {/* ТИСНЕНИЕ ЗОЛОТОМ */}
        {productId === "foil" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Изделие</span>
              <div className="rc-choice-row">
                {FOIL_ITEMS.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    className={"rc-choice" + (foilItemId === it.id ? " is-active" : "")}
                    onClick={() => {
                      setFoilItemId(it.id);
                      setFoilQty(it.minQty);
                    }}
                  >
                    {it.label} — {it.price} ₽/шт
                  </button>
                ))}
              </div>
            </div>

            {selectedFoilItem && (
              <div className="rc-step">
                <span className="rc-step-title">Количество</span>
                <label className="pc-field" style={{ marginTop: 0 }}>
                  <span>Штук (минимум {selectedFoilItem.minQty})</span>
                  <input type="number" min={selectedFoilItem.minQty} value={foilQty} onChange={(e) => setFoilQty(Number(e.target.value))} />
                </label>
              </div>
            )}
          </>
        )}

        {finalOrder && (
          <div className="rc-summary">
            <span className="rc-step-title">Итог заказа</span>
            <div className="rc-total-row">
              <span>{finalOrder.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}</span>
              <span className="rc-total-value">{finalOrder.total === null ? "Уточняется" : formatRub(finalOrder.total)}</span>
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

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={finalOrder} whatsappUrl={whatsappUrl} />
    </section>
  );
}
