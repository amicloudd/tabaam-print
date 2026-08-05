"use client";

import { useEffect, useState } from "react";
import { PLASTIC_CARD_SIZE, PLASTIC_CARD_TIERS } from "@/lib/souvenir-pricing";

export default function PlasticCardModule({ onOrderChange }) {
  const [tierId, setTierId] = useState(null);
  const tier = PLASTIC_CARD_TIERS.find((t) => t.id === tierId);
  const canSubmit = !!tier;

  useEffect(() => {
    if (!canSubmit) {
      onOrderChange(null);
      return;
    }
    onOrderChange({
      qty: tier.qty,
      facts: [{ label: "Размер", value: PLASTIC_CARD_SIZE }],
      total: tier.price,
      isEstimate: false,
      canSubmit: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierId]);

  return (
    <div className="rc-step">
      <span className="rc-step-title">Тираж ({PLASTIC_CARD_SIZE})</span>
      <div className="rc-choice-row">
        {PLASTIC_CARD_TIERS.map((t) => (
          <button key={t.id} type="button" className={"rc-choice" + (tierId === t.id ? " is-active" : "")} onClick={() => setTierId(t.id)}>
            {t.qty} шт — {t.price} ₽
          </button>
        ))}
      </div>
    </div>
  );
}
