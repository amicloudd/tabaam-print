"use client";

import { useState } from "react";
import {
  CHINA_INFO,
  CHINA_PALETTE_PHOTO,
  CHINA_BAG_COLORS,
  CHINA_BAG_SIZES,
  CHINA_BAG_THICKNESS,
  CHINA_DEFAULT_THICKNESS,
} from "@/lib/plastic-bag-pricing";
import { ChinaFacts, ChinaSubmit, ColorSwatches, OptionCards, OptionPhoto, whatsappLink } from "@/components/china/ChinaOptions";

const labelOf = (list, id) => list.find((o) => o.id === id)?.label ?? "—";

export default function PlasticBagChina({ hasArtwork }) {
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [thickness, setThickness] = useState(CHINA_DEFAULT_THICKNESS);
  const [qty, setQty] = useState("");

  const ready = hasArtwork !== null && color !== null && size !== null;

  const href = whatsappLink([
    "Здравствуйте!",
    "Хочу заказать полиэтиленовые пакеты с ручками (производство в Китае).",
    "",
    `Цвет пакета: ${labelOf(CHINA_BAG_COLORS, color).toLowerCase()}`,
    `Размер: ${labelOf(CHINA_BAG_SIZES, size)}`,
    `Толщина: ${labelOf(CHINA_BAG_THICKNESS, thickness)}`,
    `Количество: ${qty.trim() || "уточню"}`,
    `Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`,
    "",
    "Подскажите, пожалуйста, стоимость.",
  ]);

  return (
    <>
      <div className="rc-step">
        <ChinaFacts leadTime={CHINA_INFO.leadTime} note={CHINA_INFO.note} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Выберите цвет пакета</span>
        <OptionPhoto src={CHINA_PALETTE_PHOTO} alt="Палитра цветов полиэтиленовых пакетов" />
        <ColorSwatches colors={CHINA_BAG_COLORS} value={color} onChange={setColor} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Выберите размер</span>
        <OptionCards options={CHINA_BAG_SIZES} value={size} onChange={setSize} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Плотность (толщина)</span>
        <OptionCards options={CHINA_BAG_THICKNESS} value={thickness} onChange={setThickness} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Количество</span>
        <label className="cn-field">
          <span>Необходимое количество</span>
          <input type="text" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="например, 5000 шт" />
        </label>
      </div>

      <ChinaSubmit href={href} ready={ready} hint="Ответьте про макет, выберите цвет и размер пакета." />
    </>
  );
}
