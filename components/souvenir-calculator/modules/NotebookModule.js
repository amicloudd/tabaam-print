"use client";

import { useEffect, useState } from "react";

const MIN_QTY = 10;

export default function NotebookModule({ onOrderChange }) {
  const [qty, setQty] = useState(MIN_QTY);
  const canSubmit = qty >= MIN_QTY;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty,
      facts: [{ label: "Размер", value: "варианты появятся позже" }],
      total: null,
      isEstimate: true,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty]);

  return (
    <>
      <div className="rc-step">
        <span className="rc-step-title">Размер</span>
        <select className="souv-select" disabled defaultValue="">
          <option value="">Варианты появятся позже</option>
        </select>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Количество</span>
        <label className="souv-field">
          <span>Штук (минимум {MIN_QTY})</span>
          <input type="number" min={MIN_QTY} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </label>
        <p className="rc-hint">Цена появится позже.</p>
      </div>
    </>
  );
}
