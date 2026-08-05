"use client";

import { useEffect, useState } from "react";
import { WEIGHT_LABEL, TIRAZH_OPTIONS } from "@/lib/chocolate-pricing";

export default function ChocolateModule({ onOrderChange }) {
  const [tirazhId, setTirazhId] = useState(null);
  const tirazh = TIRAZH_OPTIONS.find((t) => t.id === tirazhId);
  const canSubmit = !!tirazh;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty: tirazh.qty,
      facts: [{ label: "Вес шоколадки", value: WEIGHT_LABEL }],
      total: tirazh.price,
      isEstimate: false,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tirazhId]);

  return (
    <div className="rc-step">
      <span className="rc-step-title">Шоколадки {WEIGHT_LABEL} — выберите тираж</span>
      <div className="rc-choice-row">
        {TIRAZH_OPTIONS.map((t) => (
          <button key={t.id} type="button" className={"rc-choice" + (tirazhId === t.id ? " is-active" : "")} onClick={() => setTirazhId(t.id)}>
            {t.qty} шт — {t.price} ₽
          </button>
        ))}
      </div>
    </div>
  );
}
