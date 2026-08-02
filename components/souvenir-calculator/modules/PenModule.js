"use client";

import { useEffect, useState } from "react";

const METHODS = [
  { id: "print", label: "Печать" },
  { id: "engrave", label: "Гравировка" },
];

export default function PenModule({ onOrderChange }) {
  const [methodId, setMethodId] = useState(null);
  const [qty, setQty] = useState(1);

  const method = METHODS.find((m) => m.id === methodId);
  const canSubmit = !!method && qty > 0;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty,
      facts: [
        { label: "Способ нанесения", value: method.label },
        { label: "Минимальный заказ", value: "уточняется" },
      ],
      total: null,
      isEstimate: true,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodId, qty]);

  return (
    <>
      <div className="rc-step">
        <span className="rc-step-title">Способ нанесения</span>
        <div className="rc-choice-row">
          {METHODS.map((m) => (
            <button key={m.id} type="button" className={"rc-choice" + (methodId === m.id ? " is-active" : "")} onClick={() => setMethodId(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <p className="rc-hint">Минимальный заказ и цена уточняются, параметры добавим позже.</p>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Количество</span>
        <label className="souv-field">
          <span>Штук</span>
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </label>
      </div>
    </>
  );
}
