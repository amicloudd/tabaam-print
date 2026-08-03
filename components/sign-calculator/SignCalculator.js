"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import { CATEGORIES, SIGN_TYPES, BANNER_TYPES, MOUNT_OPTIONS } from "@/lib/sign-pricing";
import "@/components/ribbon-calculator/ribbon-calculator.css";

const WHATSAPP_PHONE = "79282699936";

const INSTALL_OPTIONS = [
  { id: true, label: "Да" },
  { id: false, label: "Нет" },
];

export default function SignCalculator() {
  const [hasArtwork, setHasArtwork] = useState(null);
  const [category, setCategory] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // вывески
  const [signTypeId, setSignTypeId] = useState(null);
  const [signQty, setSignQty] = useState(1);

  // баннеры и плакаты
  const [bannerTypeId, setBannerTypeId] = useState(null);
  const [mountId, setMountId] = useState(null);
  const [needsInstall, setNeedsInstall] = useState(null);
  const [bannerQty, setBannerQty] = useState(1);

  // штендер / ролл-ап
  const [standQty, setStandQty] = useState(1);
  const [rollupQty, setRollupQty] = useState(1);

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || "—";

  let rawOrder = null;

  if (category === "signs" && signTypeId && signQty > 0) {
    rawOrder = {
      categoryLabel,
      facts: [{ label: "Тип вывески", value: SIGN_TYPES.find((t) => t.id === signTypeId)?.label }],
      qty: signQty,
    };
  } else if (category === "banners" && bannerTypeId && mountId && needsInstall !== null && bannerQty > 0) {
    rawOrder = {
      categoryLabel,
      facts: [
        { label: "Тип", value: BANNER_TYPES.find((t) => t.id === bannerTypeId)?.label },
        { label: "Крепление", value: MOUNT_OPTIONS.find((m) => m.id === mountId)?.label },
        { label: "Нужна установка", value: needsInstall ? "Да" : "Нет" },
      ],
      qty: bannerQty,
    };
  } else if (category === "stand" && standQty > 0) {
    rawOrder = { categoryLabel, facts: [], qty: standQty };
  } else if (category === "rollup" && rollupQty > 0) {
    rawOrder = { categoryLabel, facts: [], qty: rollupQty };
  }

  const canSubmit = hasArtwork !== null && !!rawOrder;

  const finalOrder = useMemo(() => {
    if (!canSubmit) return null;
    return { ...rawOrder, hasArtwork };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit, rawOrder, hasArtwork]);

  const whatsappUrl = useMemo(() => {
    if (!finalOrder) return "#";
    const lines = ["Здравствуйте!", "Хочу заказать вывеску/баннер.", ""];
    lines.push(`Вид продукции: ${finalOrder.categoryLabel}`);
    finalOrder.facts.forEach((f) => lines.push(`${f.label}: ${f.value}`));
    lines.push(`Количество: ${finalOrder.qty} шт`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    lines.push("");
    lines.push("Стоимость: уточните, пожалуйста.");
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [finalOrder, hasArtwork]);

  function selectCategory(id) {
    setCategory(id);
  }

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор вывесок и баннеров</h1>
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

        {/* Вид продукции */}
        <div className="rc-step">
          <span className="rc-step-title">Выберите продукцию</span>
          <div className="rc-choice-row">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className={"rc-choice" + (category === c.id ? " is-active" : "")} onClick={() => selectCategory(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ВЫВЕСКИ */}
        {category === "signs" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Тип вывески</span>
              <div className="rc-choice-row">
                {SIGN_TYPES.map((t) => (
                  <button key={t.id} type="button" className={"rc-choice" + (signTypeId === t.id ? " is-active" : "")} onClick={() => setSignTypeId(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <div className="tag-custom-inputs">
                <label className="tag-input-field">
                  <span>Штук</span>
                  <input type="number" min={1} value={signQty} onChange={(e) => setSignQty(Number(e.target.value))} />
                </label>
              </div>
            </div>
          </>
        )}

        {/* БАННЕРЫ И ПЛАКАТЫ */}
        {category === "banners" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Тип</span>
              <div className="rc-choice-row">
                {BANNER_TYPES.map((t) => (
                  <button key={t.id} type="button" className={"rc-choice" + (bannerTypeId === t.id ? " is-active" : "")} onClick={() => setBannerTypeId(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Крепление</span>
              <div className="rc-choice-row">
                {MOUNT_OPTIONS.map((m) => (
                  <button key={m.id} type="button" className={"rc-choice" + (mountId === m.id ? " is-active" : "")} onClick={() => setMountId(m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Нужна ли установка?</span>
              <div className="rc-choice-row">
                {INSTALL_OPTIONS.map((o) => (
                  <button
                    key={String(o.id)}
                    type="button"
                    className={"rc-choice" + (needsInstall === o.id ? " is-active" : "")}
                    onClick={() => setNeedsInstall(o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <div className="tag-custom-inputs">
                <label className="tag-input-field">
                  <span>Штук</span>
                  <input type="number" min={1} value={bannerQty} onChange={(e) => setBannerQty(Number(e.target.value))} />
                </label>
              </div>
            </div>
          </>
        )}

        {/* ЖЕЛЕЗНЫЙ ШТЕНДЕР */}
        {category === "stand" && (
          <div className="rc-step">
            <span className="rc-step-title">Количество</span>
            <div className="tag-custom-inputs">
              <label className="tag-input-field">
                <span>Штук</span>
                <input type="number" min={1} value={standQty} onChange={(e) => setStandQty(Number(e.target.value))} />
              </label>
            </div>
          </div>
        )}

        {/* РОЛЛ-АП */}
        {category === "rollup" && (
          <div className="rc-step">
            <span className="rc-step-title">Количество</span>
            <div className="tag-custom-inputs">
              <label className="tag-input-field">
                <span>Штук</span>
                <input type="number" min={1} value={rollupQty} onChange={(e) => setRollupQty(Number(e.target.value))} />
              </label>
            </div>
          </div>
        )}

        {finalOrder && (
          <div className="rc-summary">
            <span className="rc-step-title">Итог заказа</span>
            <div className="rc-total-row">
              <span>Стоимость</span>
              <span className="rc-total-value">Уточняется</span>
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
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={finalOrder} whatsappUrl={whatsappUrl} />
    </section>
  );
}
