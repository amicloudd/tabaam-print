"use client";

import { useEffect, useState } from "react";
import { TSHIRT_MIN_QTY, TSHIRT_PRINT_SIZES } from "@/lib/souvenir-pricing";

export default function TshirtModule({ onOrderChange }) {
  const [ownShirt, setOwnShirt] = useState(null); // "yes" | "no"
  const [printSizeId, setPrintSizeId] = useState(null);
  const [qty, setQty] = useState(TSHIRT_MIN_QTY);

  const printSize = TSHIRT_PRINT_SIZES.find((s) => s.id === printSizeId);
  const canSubmit = ownShirt !== null && !!printSize && qty >= TSHIRT_MIN_QTY;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    const printTotal = printSize.price * qty;
    onOrderChange({
      qty,
      facts: [
        { label: "Своя футболка", value: ownShirt === "yes" ? "Да" : "Нет — футболка от нас, цена уточняется" },
        { label: "Размер печати", value: `${printSize.label} — ${printSize.price} ₽/шт` },
      ],
      total: printTotal,
      isEstimate: ownShirt === "no",
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownShirt, printSizeId, qty]);

  return (
    <>
      <div className="rc-step">
        <span className="rc-step-title">Своя футболка</span>
        <div className="rc-choice-row">
          <button type="button" className={"rc-choice" + (ownShirt === "yes" ? " is-active" : "")} onClick={() => setOwnShirt("yes")}>
            Да
          </button>
          <button type="button" className={"rc-choice" + (ownShirt === "no" ? " is-active" : "")} onClick={() => setOwnShirt("no")}>
            Нет
          </button>
        </div>
        {ownShirt === "no" && (
          <div className="rc-note rc-note--fade">
            <p>Стоимость футболки будет добавлена позже.</p>
          </div>
        )}
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Размер печати</span>
        <div className="rc-choice-row">
          {TSHIRT_PRINT_SIZES.map((s) => (
            <button key={s.id} type="button" className={"rc-choice" + (printSizeId === s.id ? " is-active" : "")} onClick={() => setPrintSizeId(s.id)}>
              {s.label} — {s.price} ₽
            </button>
          ))}
        </div>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Количество</span>
        <label className="souv-field">
          <span>Штук (минимум {TSHIRT_MIN_QTY})</span>
          <input type="number" min={TSHIRT_MIN_QTY} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </label>
        <p className="rc-hint">Ползунок количества добавим позже.</p>
      </div>
    </>
  );
}
