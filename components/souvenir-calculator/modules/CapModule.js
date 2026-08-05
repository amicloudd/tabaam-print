"use client";

import { useEffect, useState } from "react";
import { CAP_MIN_QTY, CAP_PRICE } from "@/lib/souvenir-pricing";

export default function CapModule({ onOrderChange }) {
  const [qty, setQty] = useState(CAP_MIN_QTY);
  const canSubmit = qty >= CAP_MIN_QTY;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty,
      facts: [{ label: "Цена", value: `${CAP_PRICE} ₽/шт` }],
      total: CAP_PRICE * qty,
      isEstimate: false,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty]);

  return (
    <div className="rc-step">
      <span className="rc-step-title">Количество</span>
      <label className="souv-field">
        <span>Штук</span>
        <input type="number" min={CAP_MIN_QTY} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      </label>
      <p className="rc-hint">{qty} шт × {CAP_PRICE} ₽ = {CAP_PRICE * qty} ₽</p>
    </div>
  );
}
