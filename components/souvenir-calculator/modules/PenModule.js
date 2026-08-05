"use client";

import { useEffect, useState } from "react";
import { PEN_TIERS, penUnitPrice } from "@/lib/souvenir-pricing";

export default function PenModule({ onOrderChange }) {
  const [qty, setQty] = useState(1);
  const canSubmit = qty > 0;
  const unitPrice = penUnitPrice(qty);

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty,
      facts: [{ label: "Цена", value: `${unitPrice} ₽/шт` }],
      total: unitPrice * qty,
      isEstimate: false,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty]);

  return (
    <div className="rc-step">
      <span className="rc-step-title">Количество</span>
      <label className="souv-field">
        <span>Штук — {unitPrice} ₽/шт</span>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      </label>
      <p className="rc-hint">
        {PEN_TIERS[0].label} — {PEN_TIERS[0].price} ₽/шт · {PEN_TIERS[1].label} — {PEN_TIERS[1].price} ₽/шт
      </p>
    </div>
  );
}
