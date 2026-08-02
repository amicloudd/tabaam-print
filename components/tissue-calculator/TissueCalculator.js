"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import { DESIGN_FEE, MATERIALS, sizesForMaterial, CHINA_INFO } from "@/lib/tissue-pricing";
import { formatRub } from "@/lib/format";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./tissue-calculator.css";

const WHATSAPP_PHONE = "79282699936";

export default function TissueCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [production, setProduction] = useState(null); // "own" | "china"

  const [materialId, setMaterialId] = useState(null);
  const [sizeId, setSizeId] = useState(null);

  const [chinaSize, setChinaSize] = useState("");
  const [chinaQty, setChinaQty] = useState("");

  const [cartOpen, setCartOpen] = useState(false);

  const material = MATERIALS.find((m) => m.id === materialId);
  const sizes = materialId ? sizesForMaterial(materialId) : [];
  const size = sizes.find((s) => s.id === sizeId);

  const designFee = hasArtwork === false ? DESIGN_FEE : 0;
  const grandTotal = size ? size.price + designFee : null;
  const canSubmit = hasArtwork !== null && !!material && !!size;

  const order = useMemo(() => {
    if (!canSubmit) return null;
    return {
      materialLabel: material.label,
      sizeLabel: size.label,
      hasArtwork,
      designFee,
      grandTotal,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, material, size, hasArtwork, designFee, grandTotal]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать тишью/кальку/крафт.", ""];
    lines.push(`Материал: ${order.materialLabel}`);
    lines.push("Производство: своё");
    lines.push(`Размер рулона: ${order.sizeLabel}`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? `да (+${DESIGN_FEE} ₽)` : "нет, макет есть"}`);
    lines.push("");
    lines.push(`Итоговая стоимость: ${formatRub(order.grandTotal)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [order, hasArtwork]);

  const chinaWhatsappUrl = useMemo(() => {
    const lines = ["Здравствуйте!", "Интересует тишью/калька/крафт с производством в Китае.", ""];
    lines.push(`Размер: ${chinaSize.trim() || "уточню"}`);
    lines.push(`Количество: ${chinaQty.trim() || "уточню"}`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    lines.push("");
    lines.push("Стоимость: уточните, пожалуйста.");
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [chinaSize, chinaQty, hasArtwork]);

  function selectMaterial(id) {
    setMaterialId(id);
    setSizeId(null);
  }

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор тишью и кальки</h1>
        </div>

        {/* Макет — общий блок для всех калькуляторов */}
        <div className="rc-step">
          <span className="rc-step-title">Есть ли у вас готовый макет?</span>
          <div className="rc-choice-row">
            <button type="button" className={"rc-choice" + (hasArtwork === true ? " is-active" : "")} onClick={() => setHasArtwork(true)}>
              Да, у меня есть готовый макет
            </button>
            <button type="button" className={"rc-choice" + (hasArtwork === false ? " is-active" : "")} onClick={() => setHasArtwork(false)}>
              Нет, нужен дизайн
            </button>
          </div>

          {hasArtwork === true && (
            <div className="rc-note rc-note--fade">
              <p>Не забудьте прикрепить его к собранному заказу!</p>
              <a className="text-link" href="/artwork-requirements">
                <span className="link-text">Требования к макету</span>
                <span className="link-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
            </div>
          )}

          {hasArtwork === false && (
            <div className="rc-note rc-note--fade rc-note--fee">
              <p>Стоимость разработки дизайна</p>
              <p className="rc-fee-line">+{DESIGN_FEE} ₽</p>
            </div>
          )}
        </div>

        {/* Производство */}
        <div className="rc-step">
          <span className="rc-step-title">Выберите производство</span>
          <div className="rc-choice-row">
            <button type="button" className={"rc-choice" + (production === "own" ? " is-active" : "")} onClick={() => setProduction("own")}>
              Наше производство
            </button>
            <button type="button" className={"rc-choice" + (production === "china" ? " is-active" : "")} onClick={() => setProduction("china")}>
              Производство в Китае
            </button>
          </div>
        </div>

        {production === "own" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Выберите материал</span>
              <div className="rc-choice-row">
                {MATERIALS.map((m) => (
                  <button key={m.id} type="button" className={"rc-choice" + (materialId === m.id ? " is-active" : "")} onClick={() => selectMaterial(m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {material && (
              <div className="rc-step">
                <span className="rc-step-title">{material.label}</span>
                <div className="rc-choice-row">
                  {sizes.map((s) => (
                    <button key={s.id} type="button" className={"rc-choice" + (sizeId === s.id ? " is-active" : "")} onClick={() => setSizeId(s.id)}>
                      {s.label} — {formatRub(s.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {order && (
              <div className="rc-summary">
                <span className="rc-step-title">Итог заказа</span>
                <div className="rc-total-row">
                  <span>Итоговая стоимость</span>
                  <span className="rc-total-value">{formatRub(order.grandTotal)}</span>
                </div>
                <button type="button" className="btn-primary rc-submit" onClick={() => setCartOpen(true)}>
                  <span>Добавить в корзину</span>
                  <span className="btn-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              </div>
            )}

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
          </>
        )}

        {production === "china" && (
          <div className="rc-step">
            <div className="tag-china-info">
              <div className="tag-china-fact">
                <span className="tag-china-fact-label">Срок производства</span>
                <span className="tag-china-fact-value">{CHINA_INFO.leadTime}</span>
              </div>
              <p className="tag-china-note">{CHINA_INFO.note}</p>
            </div>

            <div className="rc-step" style={{ paddingTop: 20 }}>
              <span className="rc-step-title">Параметры заказа</span>
              <label className="tc-field">
                <span>Укажите размер</span>
                <input type="text" value={chinaSize} onChange={(e) => setChinaSize(e.target.value)} placeholder="например, 84 см × 100 м" />
              </label>
              <label className="tc-field">
                <span>Укажите необходимое количество</span>
                <input type="text" value={chinaQty} onChange={(e) => setChinaQty(e.target.value)} placeholder="например, 50 рулонов" />
              </label>
              <p className="rc-hint">Расчёт стоимости будет добавлен позже.</p>

              <a className="text-link" href={chinaWhatsappUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                <span className="link-text">Уточнить в WhatsApp</span>
                <span className="link-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
