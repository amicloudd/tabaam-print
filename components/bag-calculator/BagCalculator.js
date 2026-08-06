"use client";

import { useMemo, useState } from "react";
import { BAG_PRICE, BAG_MIN_QTY, BAG_SIZE_MIN, BAG_SIZE_MAX, BAG_IMAGE } from "@/lib/bag-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./bag-calculator.css";

const WHATSAPP_PHONE = "79282699936";
const PRODUCT_LABEL = "Картонные брендированные пакеты";

export default function BagCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [sizeNumber, setSizeNumber] = useState("");
  const [qty, setQty] = useState(BAG_MIN_QTY);

  const sizeNum = Number(sizeNumber);
  const sizeValid = sizeNumber !== "" && sizeNum >= BAG_SIZE_MIN && sizeNum <= BAG_SIZE_MAX;
  const estimateTotal = qty > 0 ? BAG_PRICE * qty : null;

  const whatsappUrl = useMemo(() => {
    const lines = ["Здравствуйте!", "Хочу заказать картонные брендированные пакеты.", ""];
    lines.push(`Номер размера (по изображению): ${sizeValid ? sizeNum : "—"}`);
    lines.push(`Количество: ${qty || "—"} шт (минимум ${BAG_MIN_QTY} шт)`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    lines.push("");
    lines.push(`Ориентировочная стоимость: ${estimateTotal !== null ? formatRub(estimateTotal) : "уточняется"}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [sizeValid, sizeNum, qty, hasArtwork, estimateTotal]);

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
          </dl>

          <label className="bag-field" style={{ maxWidth: 280 }}>
            <span>Введите номер размера с изображения ({BAG_SIZE_MIN}–{BAG_SIZE_MAX})</span>
            <input
              type="number"
              min={BAG_SIZE_MIN}
              max={BAG_SIZE_MAX}
              value={sizeNumber}
              onChange={(e) => setSizeNumber(e.target.value)}
              placeholder="например, 7"
            />
          </label>

          <label className="bag-field" style={{ marginTop: 16, maxWidth: 280 }}>
            <span>Количество, шт (минимум {BAG_MIN_QTY})</span>
            <input type="number" min={BAG_MIN_QTY} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </label>

          {estimateTotal !== null && (
            <div className="rc-order-item" style={{ marginTop: 16 }}>
              <span>{qty} шт × {formatRub(BAG_PRICE)}</span>
              <span className="rc-order-price">{formatRub(estimateTotal)}</span>
            </div>
          )}
        </div>

        <div className="rc-summary">
          <span className="rc-step-title">Итог заказа</span>
          <div className="rc-total-row">
            <span>Ориентировочная стоимость</span>
            <span className="rc-total-value">{estimateTotal !== null ? formatRub(estimateTotal) : "—"}</span>
          </div>
          <a
            className={"btn-primary rc-submit" + (!(hasArtwork !== null && sizeValid && qty >= BAG_MIN_QTY) ? " is-disabled" : "")}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!(hasArtwork !== null && sizeValid && qty >= BAG_MIN_QTY)) e.preventDefault();
            }}
          >
            <span>Уточнить в WhatsApp</span>
            <span className="btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
          {!(hasArtwork !== null && sizeValid && qty >= BAG_MIN_QTY) && (
            <p className="rc-hint rc-hint--center">
              Ответьте про макет, укажите номер размера ({BAG_SIZE_MIN}–{BAG_SIZE_MAX}) и количество (минимум {BAG_MIN_QTY} шт).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
