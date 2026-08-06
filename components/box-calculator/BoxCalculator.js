"use client";

import { useMemo, useState } from "react";
import { CHINA_INFO } from "@/lib/box-pricing";
import "@/components/ribbon-calculator/ribbon-calculator.css";
import "./box-calculator.css";

const WHATSAPP_PHONE = "79282699936";

export default function BoxCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [qty, setQty] = useState("");

  const whatsappUrl = useMemo(() => {
    const lines = ["Здравствуйте!", "Хочу заказать брендированные коробки.", ""];
    lines.push(`Размеры (Д × Ш × В): ${length.trim() || "—"} × ${width.trim() || "—"} × ${height.trim() || "—"} см`);
    lines.push(`Количество: ${qty.trim() || "—"} шт (минимум ${CHINA_INFO.minQty} шт)`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    lines.push("");
    lines.push("Стоимость: уточните, пожалуйста.");
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [length, width, height, qty, hasArtwork]);

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор брендированных коробок</h1>
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
              <p className="rc-fee-line">Уточняется</p>
            </div>
          )}
        </div>

        <div className="rc-step">
          <div className="tag-china-info">
            <div className="tag-china-fact">
              <span className="tag-china-fact-label">Производство</span>
              <span className="tag-china-fact-value">Китай</span>
            </div>
            <div className="tag-china-fact">
              <span className="tag-china-fact-label">Срок изготовления</span>
              <span className="tag-china-fact-value">{CHINA_INFO.leadTime}</span>
            </div>
            <div className="tag-china-fact">
              <span className="tag-china-fact-label">Минимальный заказ</span>
              <span className="tag-china-fact-value">{CHINA_INFO.minQty} шт</span>
            </div>
            <p className="tag-china-note">{CHINA_INFO.note}</p>
          </div>
        </div>

        <div className="rc-step">
          <span className="rc-step-title">Введите размеры</span>
          <div className="box-dims-row">
            <label className="box-field">
              <span>Длина, см</span>
              <input type="number" min={1} value={length} onChange={(e) => setLength(e.target.value)} placeholder="например, 20" />
            </label>
            <label className="box-field">
              <span>Ширина, см</span>
              <input type="number" min={1} value={width} onChange={(e) => setWidth(e.target.value)} placeholder="например, 15" />
            </label>
            <label className="box-field">
              <span>Высота, см</span>
              <input type="number" min={1} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="например, 8" />
            </label>
          </div>

          <label className="box-field" style={{ maxWidth: 220 }}>
            <span>Количество, шт (минимум {CHINA_INFO.minQty})</span>
            <input type="number" min={CHINA_INFO.minQty} value={qty} onChange={(e) => setQty(e.target.value)} placeholder={String(CHINA_INFO.minQty)} />
          </label>

          <a className="text-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 20 }}>
            <span className="link-text">Уточнить в WhatsApp</span>
            <span className="link-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
