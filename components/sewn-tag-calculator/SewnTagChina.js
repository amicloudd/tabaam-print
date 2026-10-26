"use client";

import { useState } from "react";
import { CHINA_INFO, JACQUARD_MIN_QTY, JACQUARD_STANDARD_SIZE } from "@/lib/sewn-tags-pricing";
import { ChinaFacts, ChinaSubmit, PhotoSoon, whatsappLink } from "@/components/china/ChinaOptions";

export default function SewnTagChina({ hasArtwork }) {
  const [size, setSize] = useState("");
  const [ribbonColor, setRibbonColor] = useState("");
  const [yarnColor, setYarnColor] = useState("");
  const [qty, setQty] = useState(JACQUARD_MIN_QTY);

  const ready = hasArtwork !== null && qty >= JACQUARD_MIN_QTY;

  const href = whatsappLink([
    "Здравствуйте!",
    "Хочу заказать жаккардовые пришивные бирки (производство в Китае).",
    "",
    `Готовый размер после сгиба по краям: ${size.trim() || `стандарт ${JACQUARD_STANDARD_SIZE}`}`,
    `Цвет ленты: ${ribbonColor.trim() || "уточню"}`,
    `Цвет пряжи: ${yarnColor.trim() || "уточню"}`,
    `Количество: ${qty} шт`,
    `Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`,
    "",
    "Подскажите, пожалуйста, стоимость.",
  ]);

  return (
    <>
      <div className="rc-step">
        <ChinaFacts leadTime={CHINA_INFO.leadTime} minQty={`${JACQUARD_MIN_QTY} шт`} note={CHINA_INFO.note} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Жаккардовые бирки — размер</span>
        <span className="cn-step-sub">Введите готовый размер после сгиба по краям. Стандарт — {JACQUARD_STANDARD_SIZE}.</span>
        <label className="cn-field">
          <span>Готовый размер</span>
          <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder={JACQUARD_STANDARD_SIZE} />
        </label>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Выберите цвет ленты</span>
        <PhotoSoon />
        <label className="cn-field">
          <span>Цвет ленты</span>
          <input type="text" value={ribbonColor} onChange={(e) => setRibbonColor(e.target.value)} placeholder="например, белый" />
        </label>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Выберите цвет пряжи</span>
        <PhotoSoon />
        <label className="cn-field">
          <span>Цвет пряжи</span>
          <input type="text" value={yarnColor} onChange={(e) => setYarnColor(e.target.value)} placeholder="например, чёрный" />
        </label>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Количество</span>
        <label className="cn-field">
          <span>Количество, шт (минимум {JACQUARD_MIN_QTY})</span>
          <input type="number" min={JACQUARD_MIN_QTY} step={50} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </label>
      </div>

      <ChinaSubmit href={href} ready={ready} hint={`Ответьте про макет и укажите количество (минимум ${JACQUARD_MIN_QTY} шт).`} />
    </>
  );
}
