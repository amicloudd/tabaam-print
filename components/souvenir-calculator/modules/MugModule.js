"use client";

import { useEffect, useState } from "react";
import { MUG_MIN_QTY, MUG_PRICE } from "@/lib/souvenir-pricing";

export default function MugModule({ onOrderChange }) {
  const [qty, setQty] = useState(MUG_MIN_QTY);
  const canSubmit = qty >= MUG_MIN_QTY;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty,
      facts: [{ label: "Цена", value: `${MUG_PRICE} ₽/шт` }],
      total: MUG_PRICE * qty,
      isEstimate: false,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty]);

  return (
    <div className="rc-step">
      <span className="rc-step-title">Количество</span>
      <label className="souv-field">
        <span>Штук (минимум {MUG_MIN_QTY})</span>
        <input type="number" min={MUG_MIN_QTY} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      </label>
      <p className="rc-hint">{qty} шт × {MUG_PRICE} ₽ = {MUG_PRICE * qty} ₽</p>
    </div>
  );
}
