"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import TagChina from "./TagChina";
import {
  DESIGN_FEE,
  STANDARD,
  standardDiscountPercent,
  standardLineTotal,
  tagsPerSheet,
  sheetPriceFor,
  sheetsNeeded,
  customLineTotal,
  doubleSidedUnitFee,
  ROUNDED_CORNERS_PER_TAG,
  TAG_HOLDER_PER_TAG,
} from "@/lib/tag-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./tag-calculator.css";

const WHATSAPP_PHONE = "79282699936";
const STANDARD_STEPS = Array.from({ length: 10 }, (_, i) => (i + 1) * 100);

export default function TagCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [production, setProduction] = useState(null); // "own" | "china"
  const [tagType, setTagType] = useState("standard"); // "standard" | "custom"

  const [standardQty, setStandardQty] = useState(100);
  const [customWidth, setCustomWidth] = useState(50);
  const [customHeight, setCustomHeight] = useState(80);
  const [customQty, setCustomQty] = useState(100);

  const [doubleSided, setDoubleSided] = useState(false);
  const [roundedCorners, setRoundedCorners] = useState(false);
  const [tagHolders, setTagHolders] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  const isStandard = tagType === "standard";
  const qty = isStandard ? standardQty : Math.max(0, customQty || 0);
  const widthMm = isStandard ? STANDARD.widthMm : Math.max(0, customWidth || 0);
  const heightMm = isStandard ? STANDARD.heightMm : Math.max(0, customHeight || 0);

  const sheets = useMemo(() => sheetsNeeded(qty, widthMm, heightMm), [qty, widthMm, heightMm]);
  const perSheet = useMemo(() => tagsPerSheet(widthMm, heightMm), [widthMm, heightMm]);

  const baseTotal = isStandard ? standardLineTotal(standardQty) : customLineTotal(customQty, customWidth, customHeight);
  const standardDiscount = isStandard ? standardDiscountPercent(standardQty) : 0;

  const effectiveDoubleSided = isStandard ? true : doubleSided;
  const doubleSidedRate = useMemo(() => doubleSidedUnitFee(widthMm, heightMm), [widthMm, heightMm]);
  const doubleSidedFee = !isStandard && doubleSided ? qty * doubleSidedRate : 0;
  const roundedFee = roundedCorners ? qty * ROUNDED_CORNERS_PER_TAG : 0;
  const holderFee = tagHolders ? qty * TAG_HOLDER_PER_TAG : 0;
  const designFee = hasArtwork === false ? DESIGN_FEE : 0;

  const grandTotal = baseTotal + doubleSidedFee + roundedFee + holderFee + designFee;

  const validSize = widthMm > 0 && heightMm > 0;
  const canSubmit =
    production === "own" && hasArtwork !== null && qty > 0 && validSize && (isStandard || perSheet > 0);

  const sizeLabel = isStandard ? STANDARD.sizeLabel : `${customWidth} × ${customHeight} мм`;
  const tagTypeLabel = isStandard ? "Стандартная" : "Фигурная";
  const baseLabel = isStandard
    ? `${standardQty} шт${standardDiscount > 0 ? ` · скидка ${standardDiscount}%` : ""}`
    : `${qty} шт · ${sheets} лист(ов) А3 × ${formatRub(sheetPriceFor(Math.max(widthMm, heightMm)))}`;

  const order = useMemo(
    () => ({
      tagTypeLabel,
      sizeLabel,
      qty,
      hasArtwork,
      baseLabel,
      baseTotal,
      doubleSided: effectiveDoubleSided,
      doubleSidedFee,
      roundedCorners,
      roundedFee,
      tagHolders,
      holderFee,
      designFee,
      grandTotal,
    }),
    [tagTypeLabel, sizeLabel, qty, hasArtwork, baseLabel, baseTotal, effectiveDoubleSided, doubleSidedFee, roundedCorners, roundedFee, tagHolders, holderFee, designFee, grandTotal]
  );

  const whatsappUrl = useMemo(() => {
    const lines = ["Здравствуйте!", "Хочу заказать печать подвесных картонных бирок.", ""];
    lines.push("Производство: своё");
    lines.push(`Тип бирки: ${tagTypeLabel} (${sizeLabel})`);
    lines.push(`Количество: ${qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    if (effectiveDoubleSided) lines.push("Двусторонняя печать: да");
    if (roundedCorners) lines.push("Скругление углов: да");
    if (tagHolders) lines.push("Биркодержатели: да");
    lines.push("");
    lines.push(`Итоговая стоимость: ${formatRub(grandTotal)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [tagTypeLabel, sizeLabel, qty, hasArtwork, effectiveDoubleSided, roundedCorners, tagHolders, grandTotal]);

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор подвесных картонных бирок</h1>
        </div>

        {/* 1. Макет */}
        <div className="rc-step">
          <span className="rc-step-title">1. Есть ли у вас готовый макет?</span>
          <div className="rc-choice-row">
            <button
              type="button"
              className={"rc-choice" + (hasArtwork === true ? " is-active" : "")}
              onClick={() => setHasArtwork(true)}
            >
              Да, у меня есть готовый макет
            </button>
            <button
              type="button"
              className={"rc-choice" + (hasArtwork === false ? " is-active" : "")}
              onClick={() => setHasArtwork(false)}
            >
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
          <span className="rc-step-title">2. Производство</span>
          <div className="rc-choice-row">
            <button
              type="button"
              className={"rc-choice" + (production === "own" ? " is-active" : "")}
              onClick={() => setProduction("own")}
            >
              Наше производство
            </button>
            <button
              type="button"
              className={"rc-choice" + (production === "china" ? " is-active" : "")}
              onClick={() => setProduction("china")}
            >
              Производство в Китае
            </button>
          </div>
        </div>

        {production === "own" && (
          <>
            {/* тип бирки */}
            <div className="rc-step">
              <span className="rc-step-title">Тип бирки</span>
              <div className="rc-choice-row">
                <button
                  type="button"
                  className={"rc-choice" + (tagType === "standard" ? " is-active" : "")}
                  onClick={() => setTagType("standard")}
                >
                  Стандартные бирки
                </button>
                <button
                  type="button"
                  className={"rc-choice" + (tagType === "custom" ? " is-active" : "")}
                  onClick={() => setTagType("custom")}
                >
                  Фигурные бирки
                </button>
              </div>
            </div>

            {isStandard ? (
              <div className="rc-step">
                <dl className="cart-fact-list tag-spec-list">
                  <div className="cart-fact">
                    <dt>Размер</dt>
                    <dd>{STANDARD.sizeLabel}</dd>
                  </div>
                  <div className="cart-fact">
                    <dt>Печать</dt>
                    <dd>Двусторонняя (включена)</dd>
                  </div>
                  <div className="cart-fact">
                    <dt>Материал</dt>
                    <dd>{STANDARD.material}</dd>
                  </div>
                  <div className="cart-fact">
                    <dt>Минимальный заказ</dt>
                    <dd>{STANDARD.minQty} шт</dd>
                  </div>
                  <div className="cart-fact">
                    <dt>Цена</dt>
                    <dd>{formatRub(STANDARD.base100)} / 100 шт</dd>
                  </div>
                </dl>

                <div className="rc-slider-block">
                  <div className="rc-slider-row">
                    <input
                      type="range"
                      min={100}
                      max={1000}
                      step={100}
                      value={standardQty}
                      onChange={(e) => setStandardQty(Number(e.target.value))}
                      list="standard-tag-steps"
                    />
                    <datalist id="standard-tag-steps">
                      {STANDARD_STEPS.map((n) => (
                        <option value={n} key={n} />
                      ))}
                    </datalist>
                    <span className="rc-slider-value">{standardQty} шт</span>
                  </div>
                  <div className="rc-order-item">
                    <span>
                      {standardQty} шт{standardDiscount > 0 && ` · скидка ${standardDiscount}%`}
                    </span>
                    <span className="rc-order-price">{formatRub(baseTotal)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rc-step">
                <p className="rc-hint">
                  Укажите произвольный размер бирки — мы посчитаем, сколько поместится на лист А3, и подберём цену.
                </p>
                <div className="tag-custom-inputs">
                  <label className="tag-input-field">
                    <span>Ширина, мм</span>
                    <input
                      type="number"
                      min={10}
                      max={420}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                    />
                  </label>
                  <label className="tag-input-field">
                    <span>Высота, мм</span>
                    <input
                      type="number"
                      min={10}
                      max={420}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                    />
                  </label>
                  <label className="tag-input-field">
                    <span>Количество, шт</span>
                    <input
                      type="number"
                      min={1}
                      step={10}
                      value={customQty}
                      onChange={(e) => setCustomQty(Number(e.target.value))}
                    />
                  </label>
                </div>

                {validSize && perSheet === 0 && (
                  <p className="rc-hint">Такой размер не помещается на лист А3 — уменьшите ширину или высоту.</p>
                )}
                <p className="rc-hint">По умолчанию — односторонняя печать.</p>
              </div>
            )}

            {/* доп опции */}
            <div className="rc-step">
              <span className="rc-step-title">Дополнительные опции</span>

              {!isStandard && (
                <div className="tag-option-row">
                  <span className="tag-option-label">Двусторонняя печать</span>
                  <div className="rc-choice-row">
                    <button type="button" className={"rc-choice" + (!doubleSided ? " is-active" : "")} onClick={() => setDoubleSided(false)}>
                      Нет
                    </button>
                    <button type="button" className={"rc-choice" + (doubleSided ? " is-active" : "")} onClick={() => setDoubleSided(true)}>
                      Да
                    </button>
                  </div>
                  {doubleSided && (
                    <p className="rc-hint tag-option-hint">
                      +{formatRub(doubleSidedRate)}/шт ({formatRub(doubleSidedFee)})
                    </p>
                  )}
                </div>
              )}

              <div className="tag-option-row">
                <span className="tag-option-label">Скругление углов</span>
                <div className="rc-choice-row">
                  <button type="button" className={"rc-choice" + (!roundedCorners ? " is-active" : "")} onClick={() => setRoundedCorners(false)}>
                    Нет
                  </button>
                  <button type="button" className={"rc-choice" + (roundedCorners ? " is-active" : "")} onClick={() => setRoundedCorners(true)}>
                    Да
                  </button>
                </div>
                {roundedCorners && <p className="rc-hint tag-option-hint">+{ROUNDED_CORNERS_PER_TAG} ₽ за бирку ({formatRub(roundedFee)})</p>}
              </div>

              <div className="tag-option-row">
                <span className="tag-option-label">Биркодержатели</span>
                <div className="rc-choice-row">
                  <button type="button" className={"rc-choice" + (!tagHolders ? " is-active" : "")} onClick={() => setTagHolders(false)}>
                    Нет
                  </button>
                  <button type="button" className={"rc-choice" + (tagHolders ? " is-active" : "")} onClick={() => setTagHolders(true)}>
                    Да
                  </button>
                </div>
                {tagHolders && <p className="rc-hint tag-option-hint">+{TAG_HOLDER_PER_TAG} ₽ за бирку ({formatRub(holderFee)})</p>}
              </div>
            </div>

            <p className="tag-shipping-note">
              Расчёт не включает стоимость доставки. Доставка рассчитывается индивидуально в зависимости от объёма заказа.
            </p>

            <div className="rc-summary">
              <span className="rc-step-title">Итог заказа</span>
              <div className="rc-total-row">
                <span>Итоговая стоимость</span>
                <span className="rc-total-value">{formatRub(grandTotal)}</span>
              </div>

              <button type="button" className="btn-primary rc-submit" disabled={!canSubmit} onClick={() => setCartOpen(true)}>
                <span>Добавить в корзину</span>
                <span className="btn-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              {!canSubmit && <p className="rc-hint rc-hint--center">Ответьте про макет и укажите количество (и размер, если бирка фигурная).</p>}
            </div>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
          </>
        )}

        {production === "china" && <TagChina hasArtwork={hasArtwork} />}
      </div>
    </section>
  );
}
