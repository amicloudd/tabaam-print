"use client";

import { useEffect, useState } from "react";
import { NOTEBOOK_STANDARD } from "@/lib/paper-small-pricing";
import { NOTEBOOK_LARGE_STANDARD } from "@/lib/paper-large-pricing";
import { formatRub } from "@/lib/format";

const DIVISIONS = [
  { id: "small", label: "Малые тиражи" },
  { id: "large", label: "Большие тиражи" },
];

export default function NotebookCatalogModule({ onOrderChange }) {
  const [division, setDivision] = useState(null);
  const [qty, setQty] = useState(NOTEBOOK_STANDARD.minQty);

  const isSmall = division === "small";
  const isLarge = division === "large";
  const standard = isLarge ? NOTEBOOK_LARGE_STANDARD : NOTEBOOK_STANDARD;

  const canSubmit = isSmall ? qty >= NOTEBOOK_STANDARD.minQty : isLarge;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    if (isLarge) {
      onOrderChange({
        qty: NOTEBOOK_LARGE_STANDARD.qty,
        facts: [
          { label: "Формат", value: `Блокноты ${NOTEBOOK_LARGE_STANDARD.formatLabel}` },
          { label: "Обложка", value: NOTEBOOK_LARGE_STANDARD.coverLabel },
          { label: "Внутренний блок", value: NOTEBOOK_LARGE_STANDARD.innerLabel },
          { label: "Отделка", value: NOTEBOOK_LARGE_STANDARD.finishLabel },
          { label: "Количество", value: `${NOTEBOOK_LARGE_STANDARD.qty} шт (только эта партия)` },
        ],
        total: NOTEBOOK_LARGE_STANDARD.price,
        isEstimate: false,
        canSubmit: true,
      });
      return;
    }
    onOrderChange({
      qty,
      facts: [
        { label: "Формат", value: `Блокноты ${NOTEBOOK_STANDARD.formatLabel}` },
        { label: "Обложка", value: NOTEBOOK_STANDARD.coverLabel },
        { label: "Внутренний блок", value: NOTEBOOK_STANDARD.innerLabel },
        { label: "Отделка", value: NOTEBOOK_STANDARD.finishLabel },
      ],
      total: NOTEBOOK_STANDARD.price * qty,
      isEstimate: false,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division, qty]);

  return (
    <>
      <div className="rc-step">
        <span className="rc-step-title">Тираж</span>
        <div className="rc-choice-row">
          {DIVISIONS.map((d) => (
            <button key={d.id} type="button" className={"rc-choice" + (division === d.id ? " is-active" : "")} onClick={() => setDivision(d.id)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {division && (
        <div className="rc-step">
          <span className="rc-step-title">Стандарт</span>
          <dl className="cart-fact-list">
            <div className="cart-fact">
              <dt>Формат</dt>
              <dd>Блокноты {standard.formatLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Обложка</dt>
              <dd>{standard.coverLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Внутренний блок</dt>
              <dd>{standard.innerLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Отделка</dt>
              <dd>{standard.finishLabel}</dd>
            </div>
            {isLarge && (
              <div className="cart-fact">
                <dt>Количество</dt>
                <dd>{NOTEBOOK_LARGE_STANDARD.qty} шт (только эта партия)</dd>
              </div>
            )}
            <div className="cart-fact">
              <dt>Стоимость</dt>
              <dd>{isLarge ? formatRub(NOTEBOOK_LARGE_STANDARD.price) : `${NOTEBOOK_STANDARD.price} ₽/шт`}</dd>
            </div>
          </dl>
        </div>
      )}

      {isSmall && (
        <div className="rc-step">
          <span className="rc-step-title">Количество</span>
          <label className="souv-field">
            <span>Штук (минимум {NOTEBOOK_STANDARD.minQty})</span>
            <input type="number" min={NOTEBOOK_STANDARD.minQty} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </label>
        </div>
      )}
    </>
  );
}
