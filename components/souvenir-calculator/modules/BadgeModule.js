"use client";

import { useEffect, useState } from "react";
import { BADGE_MIN_QTY, BADGE_MATERIALS } from "@/lib/souvenir-pricing";

export default function BadgeModule({ onOrderChange }) {
  const [materialId, setMaterialId] = useState(null);
  const [qty, setQty] = useState(BADGE_MIN_QTY);

  const material = BADGE_MATERIALS.find((m) => m.id === materialId);
  const canSubmit = !!material && qty >= BADGE_MIN_QTY;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty,
      facts: [{ label: "Материал", value: `${material.label} — ${material.price} ₽/шт` }],
      total: material.price * qty,
      isEstimate: false,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, qty]);

  return (
    <>
      <div className="rc-step">
        <span className="rc-step-title">Материал</span>
        <div className="rc-choice-row">
          {BADGE_MATERIALS.map((m) => (
            <button key={m.id} type="button" className={"rc-choice" + (materialId === m.id ? " is-active" : "")} onClick={() => setMaterialId(m.id)}>
              {m.label} — {m.price} ₽/шт
            </button>
          ))}
        </div>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Количество</span>
        <label className="souv-field">
          <span>Штук</span>
          <input type="number" min={BADGE_MIN_QTY} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </label>
      </div>
    </>
  );
}
