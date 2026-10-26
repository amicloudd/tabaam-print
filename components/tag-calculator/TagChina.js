"use client";

import { useState } from "react";
import {
  CHINA_INFO,
  CHINA_DENSITY_PHOTO,
  CHINA_EFFECTS_PHOTO,
  CHINA_DENSITIES,
  CHINA_DEFAULT_DENSITY,
  CHINA_LAMINATION,
  CHINA_PAPER_TYPES,
  CHINA_FINISHES,
} from "@/lib/tag-pricing";
import { ChinaFacts, ChinaSubmit, OptionCards, OptionPhoto, PhotoSoon, whatsappLink } from "@/components/china/ChinaOptions";

const labelOf = (list, id) => list.find((o) => o.id === id)?.label ?? "—";

export default function TagChina({ hasArtwork }) {
  const [density, setDensity] = useState(CHINA_DEFAULT_DENSITY);
  const [lamination, setLamination] = useState(null);
  const [paperType, setPaperType] = useState(null);
  const [finish, setFinish] = useState(null);
  const [holderColor, setHolderColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState("");

  const ready = hasArtwork !== null && lamination !== null && paperType !== null && finish !== null;

  const href = whatsappLink([
    "Здравствуйте!",
    "Хочу заказать подвесные картонные бирки (производство в Китае).",
    "",
    "Печать: двусторонняя",
    `Плотность бумаги: ${labelOf(CHINA_DENSITIES, density)}`,
    `Ламинация: ${labelOf(CHINA_LAMINATION, lamination).toLowerCase()}`,
    `Вид бумаги: ${labelOf(CHINA_PAPER_TYPES, paperType).toLowerCase()}`,
    `Способ нанесения: ${labelOf(CHINA_FINISHES, finish).toLowerCase()}`,
    `Цвет держателей: ${holderColor.trim() || "уточню"}`,
    `Размер бирки: ${size.trim() || "уточню"}`,
    `Количество: ${qty.trim() || "уточню"}`,
    `Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`,
    "",
    "Подскажите, пожалуйста, стоимость.",
  ]);

  return (
    <>
      <div className="rc-step">
        <ChinaFacts leadTime={CHINA_INFO.leadTime} minQty={CHINA_INFO.minQty} note={CHINA_INFO.note} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Печать</span>
        <dl className="cart-fact-list">
          <div className="cart-fact">
            <dt>Стороны</dt>
            <dd>Двусторонняя печать</dd>
          </div>
        </dl>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Плотность бумаги</span>
        <OptionPhoto src={CHINA_DENSITY_PHOTO} alt="Плотность бумаги для бирок: 300–900 г/м²" />
        <OptionCards options={CHINA_DENSITIES} value={density} onChange={setDensity} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Ламинация</span>
        <OptionCards options={CHINA_LAMINATION} value={lamination} onChange={setLamination} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Вид бумаги</span>
        <PhotoSoon label="Фото видов бумаги скоро появится" />
        <OptionCards options={CHINA_PAPER_TYPES} value={paperType} onChange={setPaperType} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Способ нанесения</span>
        <span className="cn-step-sub">Цветная печать или один из эффектов на фото</span>
        <OptionPhoto src={CHINA_EFFECTS_PHOTO} alt="Эффекты нанесения: фольга, УФ-лак, тиснение" />
        <OptionCards options={CHINA_FINISHES} value={finish} onChange={setFinish} />
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Цвет держателей</span>
        <PhotoSoon />
        <label className="cn-field">
          <span>Укажите цвет</span>
          <input type="text" value={holderColor} onChange={(e) => setHolderColor(e.target.value)} placeholder="например, чёрный" />
        </label>
      </div>

      <div className="rc-step">
        <span className="rc-step-title">Размер и тираж</span>
        <label className="cn-field">
          <span>Размер бирки</span>
          <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="например, 5 × 9 см" />
        </label>
        <label className="cn-field">
          <span>Количество ({CHINA_INFO.minQty})</span>
          <input type="text" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="например, 1000 шт" />
        </label>
      </div>

      <ChinaSubmit
        href={href}
        ready={ready}
        hint="Ответьте про макет и выберите ламинацию, вид бумаги и способ нанесения."
      />
    </>
  );
}
