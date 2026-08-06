"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import {
  DESIGN_FEE as SMALL_DESIGN_FEE,
  PRODUCT_TYPES as SMALL_PRODUCT_TYPES,
  PRINT_SIDES,
  BUSINESS_CARD_PRICE,
  BUSINESS_CARD_MIN_QTY,
  BUSINESS_CARD_MAX_QTY,
  businessCardDiscount,
  businessCardLineTotal,
  CARD_SIZES,
  CARD_MIN_QTY,
  CARD_MAX_QTY,
  CARD_QTY_STEP,
  FOLDED_CARD,
  CERTIFICATE_PRICE,
  FOIL_ITEMS,
  NOTEBOOK_STANDARD,
} from "@/lib/paper-small-pricing";
import {
  DESIGN_FEE as LARGE_DESIGN_FEE,
  PRODUCTS as LARGE_PRODUCTS,
  POSTCARD_QTY_MIN,
  POSTCARD_QTY_MAX,
  POSTCARD_QTY_STEP,
  NOTEBOOK_LARGE_STANDARD,
} from "@/lib/paper-large-pricing";
import { tagsPerSheet, customUnitPrice, doubleSidedUnitFee } from "@/lib/tag-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./paper-calculator.css";

const WHATSAPP_PHONE = "79282699936";

const DIVISIONS = [
  { id: "small", label: "Малые тиражи" },
  { id: "large", label: "Большие тиражи" },
];

export default function PaperCalculator({ initialDivision = null }) {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [division, setDivision] = useState(initialDivision);
  const [cartOpen, setCartOpen] = useState(false);

  // ---- малые тиражи: состояние ----
  const [smallProductId, setSmallProductId] = useState(null);
  const [bcSideId, setBcSideId] = useState(null);
  const [bcQty, setBcQty] = useState(BUSINESS_CARD_MIN_QTY);
  const [cardCutType, setCardCutType] = useState("standard"); // "standard" | "custom"
  const [cardSizeId, setCardSizeId] = useState(null);
  const [cardSizeCustom, setCardSizeCustom] = useState("");
  const [cardSideId, setCardSideId] = useState(null);
  const [cardQty, setCardQty] = useState(CARD_MIN_QTY);
  const [cardCustomWidth, setCardCustomWidth] = useState(50);
  const [cardCustomHeight, setCardCustomHeight] = useState(80);
  const [cardCustomQty, setCardCustomQty] = useState(100);
  const [cardDoubleSided, setCardDoubleSided] = useState(false);
  const [foldedQty, setFoldedQty] = useState(FOLDED_CARD.minQty);
  const [certQty, setCertQty] = useState(1);
  const [foilItemId, setFoilItemId] = useState(null);
  const [foilQty, setFoilQty] = useState(1);
  const selectedFoilItem = FOIL_ITEMS.find((i) => i.id === foilItemId);
  const [nbCatQty, setNbCatQty] = useState(NOTEBOOK_STANDARD.minQty);

  // ---- большие тиражи: состояние ----
  const [largeProductId, setLargeProductId] = useState(null);
  const [largeSizeId, setLargeSizeId] = useState(null);
  const [postcardQty, setPostcardQty] = useState(POSTCARD_QTY_MIN);

  const designFee = hasArtwork === false ? SMALL_DESIGN_FEE : 0; // SMALL_DESIGN_FEE === LARGE_DESIGN_FEE (800)

  // ================= МАЛЫЕ ТИРАЖИ =================
  const smallProductLabel = SMALL_PRODUCT_TYPES.find((p) => p.id === smallProductId)?.label || "—";

  const bcDiscount = businessCardDiscount(bcQty);
  const bcBasePrice = bcSideId ? BUSINESS_CARD_PRICE[bcSideId] : null;
  const bcTotal = bcBasePrice !== null ? businessCardLineTotal(bcQty, bcBasePrice) : null;
  const bcSideLabel = PRINT_SIDES.find((s) => s.id === bcSideId)?.label;

  const cardSize = CARD_SIZES.find((s) => s.id === cardSizeId);
  const cardIsOther = cardSize?.id === "other";
  const cardSidePrice = cardSize && cardSideId ? cardSize[cardSideId] : null;
  const cardTotal = cardSidePrice !== null && cardSidePrice !== undefined ? cardSidePrice * cardQty : null;
  const cardSideLabel = PRINT_SIDES.find((s) => s.id === cardSideId)?.label;
  const cardSizeLabel = cardIsOther ? cardSizeCustom.trim() || "уточняется" : cardSize?.label || "—";

  const cardCustomValidSize = cardCustomWidth > 0 && cardCustomHeight > 0;
  const cardCustomPerSheet = tagsPerSheet(cardCustomWidth, cardCustomHeight);
  const cardCustomUnitPrice = customUnitPrice(cardCustomWidth, cardCustomHeight);
  const cardDoubleSidedUnitFee = doubleSidedUnitFee(cardCustomWidth, cardCustomHeight);
  const cardDoubleSidedFee = cardDoubleSided ? cardDoubleSidedUnitFee * cardCustomQty : 0;
  const cardCustomTotal = cardCustomUnitPrice * cardCustomQty + cardDoubleSidedFee;

  let smallOrder = null;

  if (smallProductId === "business" && bcSideId && bcQty >= BUSINESS_CARD_MIN_QTY) {
    smallOrder = {
      productLabel: smallProductLabel,
      sizeLabel: "стандарт",
      printLabel: `${bcSideLabel} — ${formatRub(bcBasePrice)}/шт${bcDiscount > 0 ? ` (скидка ${bcDiscount} ₽/шт)` : ""}`,
      qty: bcQty,
      isEstimate: false,
      total: bcTotal + designFee,
    };
  } else if (smallProductId === "cards" && cardCutType === "standard" && cardSizeId && cardSideId && cardQty > 0 && (!cardIsOther || cardSizeCustom.trim())) {
    const known = cardTotal !== null;
    smallOrder = {
      productLabel: smallProductLabel,
      sizeLabel: cardSizeLabel,
      printLabel: `${cardSideLabel}${known ? ` — ${formatRub(cardSidePrice)}/шт` : ""}`,
      qty: cardQty,
      isEstimate: !known,
      total: known ? cardTotal + designFee : null,
    };
  } else if (smallProductId === "cards" && cardCutType === "custom" && cardCustomValidSize && cardCustomPerSheet > 0 && cardCustomQty > 0) {
    smallOrder = {
      productLabel: `${smallProductLabel} — фигурная резка`,
      sizeLabel: `${cardCustomWidth} × ${cardCustomHeight} мм`,
      printLabel: `${cardCustomQty} шт × ${formatRub(cardCustomUnitPrice)}/шт${cardDoubleSided ? " (двусторонняя)" : ""}`,
      qty: cardCustomQty,
      isEstimate: false,
      total: cardCustomTotal + designFee,
    };
  } else if (smallProductId === "folded" && foldedQty >= FOLDED_CARD.minQty) {
    smallOrder = {
      productLabel: smallProductLabel,
      sizeLabel: FOLDED_CARD.formatLabel,
      printLabel: FOLDED_CARD.typeLabel,
      qty: foldedQty,
      isEstimate: false,
      total: FOLDED_CARD.price * foldedQty + designFee,
    };
  } else if (smallProductId === "certificate" && certQty > 0) {
    smallOrder = {
      productLabel: smallProductLabel,
      sizeLabel: "А4",
      printLabel: `${CERTIFICATE_PRICE} ₽/шт`,
      qty: certQty,
      isEstimate: false,
      total: CERTIFICATE_PRICE * certQty + designFee,
    };
  } else if (smallProductId === "foil" && selectedFoilItem && foilQty >= selectedFoilItem.minQty) {
    smallOrder = {
      productLabel: `${smallProductLabel} — ${selectedFoilItem.label}`,
      sizeLabel: selectedFoilItem.sizeLabel,
      printLabel: `Тиснение золотом — ${selectedFoilItem.price} ₽/шт`,
      qty: foilQty,
      isEstimate: false,
      total: selectedFoilItem.price * foilQty + designFee,
    };
  } else if (smallProductId === "notebooks-catalogs" && nbCatQty >= NOTEBOOK_STANDARD.minQty) {
    smallOrder = {
      productLabel: smallProductLabel,
      sizeLabel: NOTEBOOK_STANDARD.formatLabel,
      printLabel: `${NOTEBOOK_STANDARD.coverLabel}, ${NOTEBOOK_STANDARD.innerLabel}, ${NOTEBOOK_STANDARD.finishLabel}`,
      qty: nbCatQty,
      isEstimate: false,
      total: NOTEBOOK_STANDARD.price * nbCatQty + designFee,
    };
  }

  // ================= БОЛЬШИЕ ТИРАЖИ =================
  const largeProduct = LARGE_PRODUCTS.find((p) => p.id === largeProductId);
  const largeHasSizeChoice = largeProduct && largeProduct.sizes.length > 1;
  const largeSize = largeProduct
    ? largeProduct.sizes.find((s) => s.id === largeSizeId) || (!largeHasSizeChoice ? largeProduct.sizes[0] : null)
    : null;

  const isPostcards = largeProductId === "postcards";
  const postcardTotal = largeSize && largeSize.price != null ? (largeSize.price / 1000) * postcardQty : null;

  const isNotebooksLarge = largeProductId === "notebooks-catalogs";

  let largeOrder = null;
  if (isNotebooksLarge) {
    largeOrder = {
      productLabel: largeProduct.label,
      sizeLabel: NOTEBOOK_LARGE_STANDARD.formatLabel,
      printLabel: `${NOTEBOOK_LARGE_STANDARD.coverLabel}, ${NOTEBOOK_LARGE_STANDARD.innerLabel}, ${NOTEBOOK_LARGE_STANDARD.finishLabel}`,
      qty: NOTEBOOK_LARGE_STANDARD.qty,
      isEstimate: false,
      total: NOTEBOOK_LARGE_STANDARD.price + designFee,
    };
  } else if (largeProduct && largeSize) {
    const largeKnownPrice = largeSize.price != null;
    if (isPostcards) {
      largeOrder = {
        productLabel: largeProduct.label,
        sizeLabel: largeSize.label,
        printLabel: null,
        qty: postcardQty,
        isEstimate: !largeKnownPrice,
        total: largeKnownPrice ? postcardTotal + designFee : null,
      };
    } else {
      largeOrder = {
        productLabel: largeProduct.label,
        sizeLabel: largeSize.label,
        printLabel: largeProduct.printTypeLabel || null,
        qty: null,
        isEstimate: !largeKnownPrice,
        total: largeKnownPrice ? largeSize.price + designFee : null,
      };
    }
  }

  // ================= ИТОГ =================
  const rawOrder = division === "small" ? smallOrder : division === "large" ? largeOrder : null;
  const canSubmit = hasArtwork !== null && !!division && !!rawOrder;

  const finalOrder = useMemo(() => {
    if (!canSubmit) return null;
    return {
      ...rawOrder,
      divisionLabel: DIVISIONS.find((d) => d.id === division)?.label,
      hasArtwork,
      designFee,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, rawOrder, division, hasArtwork, designFee]);

  const whatsappUrl = useMemo(() => {
    if (!finalOrder) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать бумажную продукцию.", ""];
    lines.push(`Тираж: ${finalOrder.divisionLabel}`);
    lines.push(`Вид продукции: ${finalOrder.productLabel}`);
    lines.push(`Размер: ${finalOrder.sizeLabel}`);
    if (finalOrder.printLabel) lines.push(`Тип печати: ${finalOrder.printLabel}`);
    if (finalOrder.qty !== null) lines.push(`Количество: ${finalOrder.qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? `да (+${SMALL_DESIGN_FEE} ₽)` : "нет, макет есть"}`);
    lines.push("");
    lines.push(
      finalOrder.total === null
        ? "Стоимость: уточняется"
        : `${finalOrder.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}: ${formatRub(finalOrder.total)}`
    );
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [finalOrder, hasArtwork]);

  function selectDivision(id) {
    setDivision(id);
  }

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор бумажной продукции</h1>
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
              <p className="rc-fee-line">+{SMALL_DESIGN_FEE} ₽</p>
            </div>
          )}
        </div>

        {/* Тираж: малые / большие */}
        <div className="rc-step">
          <span className="rc-step-title">Тираж</span>
          <div className="rc-choice-row">
            {DIVISIONS.map((d) => (
              <button key={d.id} type="button" className={"rc-choice" + (division === d.id ? " is-active" : "")} onClick={() => selectDivision(d.id)}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============ МАЛЫЕ ТИРАЖИ ============ */}
        {division === "small" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Выберите продукцию</span>
              <div className="rc-choice-row">
                {SMALL_PRODUCT_TYPES.map((p) => (
                  <button key={p.id} type="button" className={"rc-choice" + (smallProductId === p.id ? " is-active" : "")} onClick={() => setSmallProductId(p.id)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ВИЗИТКИ */}
            {smallProductId === "business" && (
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
            {smallProductId === "cards" && (
              <>
                <div className="rc-step">
                  <span className="rc-step-title">Тип реза</span>
                  <div className="rc-choice-row">
                    <button type="button" className={"rc-choice" + (cardCutType === "standard" ? " is-active" : "")} onClick={() => setCardCutType("standard")}>
                      Стандартный размер
                    </button>
                    <button type="button" className={"rc-choice" + (cardCutType === "custom" ? " is-active" : "")} onClick={() => setCardCutType("custom")}>
                      Фигурная резка
                    </button>
                  </div>
                </div>

                {cardCutType === "standard" && (
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
                      <div className="rc-slider-block">
                        <div className="rc-slider-row">
                          <input
                            type="range"
                            min={CARD_MIN_QTY}
                            max={CARD_MAX_QTY}
                            step={CARD_QTY_STEP}
                            value={cardQty}
                            onChange={(e) => setCardQty(Number(e.target.value))}
                          />
                          <span className="rc-slider-value">{cardQty} шт</span>
                        </div>
                        {cardSidePrice !== null && cardSidePrice !== undefined && (
                          <div className="rc-order-item">
                            <span>{cardQty} шт × {formatRub(cardSidePrice)}/шт</span>
                            <span className="rc-order-price">{formatRub(cardTotal)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {cardCutType === "custom" && (
                  <div className="rc-step">
                    <p className="rc-hint">
                      Укажите произвольный размер карточки — мы посчитаем, сколько поместится на лист А3, и подберём цену.
                    </p>
                    <div className="tag-custom-inputs">
                      <label className="tag-input-field">
                        <span>Ширина, мм</span>
                        <input
                          type="number"
                          min={10}
                          max={420}
                          value={cardCustomWidth}
                          onChange={(e) => setCardCustomWidth(Number(e.target.value))}
                        />
                      </label>
                      <label className="tag-input-field">
                        <span>Высота, мм</span>
                        <input
                          type="number"
                          min={10}
                          max={420}
                          value={cardCustomHeight}
                          onChange={(e) => setCardCustomHeight(Number(e.target.value))}
                        />
                      </label>
                      <label className="tag-input-field">
                        <span>Количество, шт</span>
                        <input
                          type="number"
                          min={1}
                          step={10}
                          value={cardCustomQty}
                          onChange={(e) => setCardCustomQty(Number(e.target.value))}
                        />
                      </label>
                    </div>

                    {cardCustomValidSize && cardCustomPerSheet === 0 && (
                      <p className="rc-hint">Такой размер не помещается на лист А3 — уменьшите ширину или высоту.</p>
                    )}

                    {cardCustomPerSheet > 0 && (
                      <div className="tag-option-row" style={{ marginTop: 16 }}>
                        <span className="tag-option-label">Двусторонняя печать</span>
                        <div className="rc-choice-row">
                          <button type="button" className={"rc-choice" + (!cardDoubleSided ? " is-active" : "")} onClick={() => setCardDoubleSided(false)}>
                            Нет
                          </button>
                          <button type="button" className={"rc-choice" + (cardDoubleSided ? " is-active" : "")} onClick={() => setCardDoubleSided(true)}>
                            Да
                          </button>
                        </div>
                        {cardDoubleSided && (
                          <p className="rc-hint tag-option-hint">
                            +{formatRub(cardDoubleSidedUnitFee)}/шт ({formatRub(cardDoubleSidedFee)})
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* СКЛАДНЫЕ ОТКРЫТКИ */}
            {smallProductId === "folded" && (
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
                </div>
              </>
            )}

            {/* СЕРТИФИКАТ А4 */}
            {smallProductId === "certificate" && (
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
                  {certQty > 0 && (
                    <div className="rc-order-item" style={{ marginTop: 12 }}>
                      <span>{certQty} шт × {CERTIFICATE_PRICE} ₽/шт</span>
                      <span className="rc-order-price">{formatRub(CERTIFICATE_PRICE * certQty)}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ТИСНЕНИЕ ЗОЛОТОМ */}
            {smallProductId === "foil" && (
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
                    <div className="rc-slider-block">
                      <div className="rc-slider-row">
                        <input
                          type="range"
                          min={selectedFoilItem.minQty}
                          max={selectedFoilItem.maxQty}
                          step={selectedFoilItem.step}
                          value={foilQty}
                          onChange={(e) => setFoilQty(Number(e.target.value))}
                        />
                        <span className="rc-slider-value">{foilQty} шт</span>
                      </div>
                      <div className="rc-order-item">
                        <span>{foilQty} шт × {selectedFoilItem.price} ₽/шт</span>
                        <span className="rc-order-price">{formatRub(selectedFoilItem.price * foilQty)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* БЛОКНОТЫ И КАТАЛОГИ */}
            {smallProductId === "notebooks-catalogs" && (
              <>
                <div className="rc-step">
                  <span className="rc-step-title">Стандарт</span>
                  <dl className="cart-fact-list">
                    <div className="cart-fact">
                      <dt>Формат</dt>
                      <dd>Блокноты {NOTEBOOK_STANDARD.formatLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Обложка</dt>
                      <dd>{NOTEBOOK_STANDARD.coverLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Внутренний блок</dt>
                      <dd>{NOTEBOOK_STANDARD.innerLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Отделка</dt>
                      <dd>{NOTEBOOK_STANDARD.finishLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Стоимость</dt>
                      <dd>{NOTEBOOK_STANDARD.price} ₽/шт</dd>
                    </div>
                  </dl>
                </div>

                <div className="rc-step">
                  <span className="rc-step-title">Количество</span>
                  <label className="pc-field" style={{ marginTop: 0 }}>
                    <span>Штук (минимум {NOTEBOOK_STANDARD.minQty})</span>
                    <input type="number" min={NOTEBOOK_STANDARD.minQty} value={nbCatQty} onChange={(e) => setNbCatQty(Number(e.target.value))} />
                  </label>
                </div>
              </>
            )}
          </>
        )}

        {/* ============ БОЛЬШИЕ ТИРАЖИ ============ */}
        {division === "large" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Выберите продукцию</span>
              <div className="rc-choice-row">
                {LARGE_PRODUCTS.map((p) => (
                  <button key={p.id} type="button" className={"rc-choice" + (largeProductId === p.id ? " is-active" : "")} onClick={() => setLargeProductId(p.id)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {largeProduct && isNotebooksLarge && (
              <>
                <div className="rc-step">
                  <span className="rc-step-title">Стандарт</span>
                  <dl className="cart-fact-list">
                    <div className="cart-fact">
                      <dt>Формат</dt>
                      <dd>Блокноты {NOTEBOOK_LARGE_STANDARD.formatLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Обложка</dt>
                      <dd>{NOTEBOOK_LARGE_STANDARD.coverLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Внутренний блок</dt>
                      <dd>{NOTEBOOK_LARGE_STANDARD.innerLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Отделка</dt>
                      <dd>{NOTEBOOK_LARGE_STANDARD.finishLabel}</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Количество</dt>
                      <dd>{NOTEBOOK_LARGE_STANDARD.qty} шт (только эта партия)</dd>
                    </div>
                    <div className="cart-fact">
                      <dt>Стоимость</dt>
                      <dd>{formatRub(NOTEBOOK_LARGE_STANDARD.price)}</dd>
                    </div>
                  </dl>
                </div>
              </>
            )}

            {largeProduct && !isNotebooksLarge && (
              <>
                {largeProduct.printTypeLabel && (
                  <div className="rc-step">
                    <dl className="cart-fact-list">
                      <div className="cart-fact">
                        <dt>Тип печати</dt>
                        <dd>{largeProduct.printTypeLabel}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {largeHasSizeChoice ? (
                  <div className="rc-step">
                    <span className="rc-step-title">Выберите вид и размер</span>
                    <div className="rc-choice-row">
                      {largeProduct.sizes.map((s) => (
                        <button key={s.id} type="button" className={"rc-choice" + (largeSizeId === s.id ? " is-active" : "")} onClick={() => setLargeSizeId(s.id)}>
                          {s.label} — {formatRub(s.price)} / 1000 шт
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  largeSize && (
                    <div className="rc-step">
                      <dl className="cart-fact-list">
                        <div className="cart-fact">
                          <dt>Размер</dt>
                          <dd>{largeSize.label}</dd>
                        </div>
                        <div className="cart-fact">
                          <dt>Стоимость</dt>
                          <dd>{largeSize.price != null ? `${formatRub(largeSize.price)} / 1000 шт` : "уточняется"}</dd>
                        </div>
                      </dl>
                    </div>
                  )
                )}

                {isPostcards && largeSize && (
                  <div className="rc-step">
                    <span className="rc-step-title">Тираж</span>
                    <div className="rc-slider-block">
                      <div className="rc-slider-row">
                        <input
                          type="range"
                          min={POSTCARD_QTY_MIN}
                          max={POSTCARD_QTY_MAX}
                          step={POSTCARD_QTY_STEP}
                          value={postcardQty}
                          onChange={(e) => setPostcardQty(Number(e.target.value))}
                        />
                        <span className="rc-slider-value">{postcardQty} шт</span>
                      </div>
                      {postcardTotal !== null && (
                        <div className="rc-order-item">
                          <span>{postcardQty} шт × {formatRub(largeSize.price / 1000)}/шт</span>
                          <span className="rc-order-price">{formatRub(postcardTotal)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {(division === "small" ? smallProductId : division === "large" ? largeProductId : null) && (
          <div className="rc-summary">
            <span className="rc-step-title">Итог заказа</span>
            <div className="rc-total-row">
              <span>{finalOrder?.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}</span>
              <span className="rc-total-value">
                {finalOrder ? (finalOrder.total === null ? "Уточняется" : formatRub(finalOrder.total)) : "—"}
              </span>
            </div>
            <button type="button" className="btn-primary rc-submit" disabled={!finalOrder} onClick={() => setCartOpen(true)}>
              <span>Добавить в корзину</span>
              <span className="btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
            {!finalOrder && <p className="rc-hint rc-hint--center">Ответьте про макет и заполните все поля выше.</p>}
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={finalOrder} whatsappUrl={whatsappUrl} />
    </section>
  );
}
