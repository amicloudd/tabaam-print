"use client";

import { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";
import {
  CATEGORIES,
  SIGN_TYPES,
  BANNER_MATERIALS,
  BANNER_PRICE_PER_M2,
  RING_PRICE,
  RING_HINT,
  BANNER_MOUNTS,
  HOLDER_OPTIONS,
  ROLLUP_OPTIONS,
} from "@/lib/sign-pricing";
import { formatRub } from "@/lib/format";
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
  const [materialId, setMaterialId] = useState(null);
  const [bannerLength, setBannerLength] = useState("");
  const [bannerWidth, setBannerWidth] = useState("");
  const [mountId, setMountId] = useState(null);
  const [ringQty, setRingQty] = useState(4);
  const [needsInstall, setNeedsInstall] = useState(null);
  const [bannerQty, setBannerQty] = useState(1);

  // реквизитницы и визитницы
  const [holderId, setHolderId] = useState(null);
  const [holderQty, setHolderQty] = useState(1);

  // ролл-ап
  const [rollupId, setRollupId] = useState(null);
  const [rollupQty, setRollupQty] = useState(1);

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || "—";

  // ---- баннеры: расчёт ----
  const material = BANNER_MATERIALS.find((m) => m.id === materialId);
  const mount = BANNER_MOUNTS.find((m) => m.id === mountId);
  const lengthNum = Number(bannerLength);
  const widthNum = Number(bannerWidth);
  const areaM2 = lengthNum > 0 && widthNum > 0 ? (lengthNum / 100) * (widthNum / 100) : 0;
  const areaCost = areaM2 * BANNER_PRICE_PER_M2;
  const ringCost = mount?.id === "rings" ? ringQty * RING_PRICE : 0;
  const mountCostKnown = mount ? mount.priced : false;
  const installKnown = needsInstall === false;
  const bannerFullyKnown = !!material && areaM2 > 0 && !!mount && mountCostKnown && needsInstall !== null && installKnown;
  const bannerPerUnit = areaCost + ringCost;
  const bannerTotal = areaM2 > 0 ? bannerPerUnit * bannerQty : null;

  let rawOrder = null;

  if (category === "signs" && signTypeId && signQty > 0) {
    rawOrder = {
      categoryLabel,
      facts: [{ label: "Тип вывески", value: SIGN_TYPES.find((t) => t.id === signTypeId)?.label }],
      qty: signQty,
      total: null,
      isEstimate: true,
    };
  } else if (category === "banners" && material && areaM2 > 0 && mount && needsInstall !== null) {
    const facts = [
      { label: "Материал", value: material.note ? `${material.label} (${material.note})` : material.label },
      { label: "Размер", value: `${lengthNum} × ${widthNum} см` },
      {
        label: "Крепление",
        value: mount.priced ? `${mount.label} — ${ringQty} шт × ${RING_PRICE} ₽` : `${mount.label} (стоимость индивидуально)`,
      },
      { label: "Нужна установка", value: needsInstall ? "Да (стоимость индивидуально)" : "Нет" },
    ];
    rawOrder = {
      categoryLabel,
      facts,
      qty: bannerQty,
      total: bannerTotal,
      isEstimate: !bannerFullyKnown,
    };
  } else if (category === "holders" && holderId && holderQty > 0) {
    const holder = HOLDER_OPTIONS.find((h) => h.id === holderId);
    rawOrder = {
      categoryLabel,
      facts: [{ label: "Вариант", value: `${holder.label} — ${formatRub(holder.price)}/шт` }],
      qty: holderQty,
      total: holder.price * holderQty,
      isEstimate: false,
    };
  } else if (category === "rollup" && rollupId && rollupQty > 0) {
    const rollup = ROLLUP_OPTIONS.find((r) => r.id === rollupId);
    rawOrder = {
      categoryLabel,
      facts: [{ label: "Вариант", value: `${rollup.label} — ${formatRub(rollup.price)}` }],
      qty: rollupQty,
      total: rollup.price * rollupQty,
      isEstimate: false,
    };
  }

  // живой предпросмотр цены баннера, пока не заполнены все поля для отправки в корзину
  const livePreviewTotal = category === "banners" ? bannerTotal : null;

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
    lines.push(
      finalOrder.total === null
        ? "Стоимость: уточните, пожалуйста."
        : `${finalOrder.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}: ${formatRub(finalOrder.total)}`
    );
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
              <span className="rc-step-title">Материал</span>
              <div className="rc-choice-row">
                {BANNER_MATERIALS.map((m) => (
                  <button key={m.id} type="button" className={"rc-choice" + (materialId === m.id ? " is-active" : "")} onClick={() => setMaterialId(m.id)}>
                    {m.label}
                    {m.note ? ` (${m.note})` : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Размер (в см)</span>
              <div className="tag-custom-inputs">
                <label className="tag-input-field">
                  <span>Длина, см</span>
                  <input type="number" min={1} step={1} value={bannerLength} onChange={(e) => setBannerLength(e.target.value)} />
                </label>
                <label className="tag-input-field">
                  <span>Ширина, см</span>
                  <input type="number" min={1} step={1} value={bannerWidth} onChange={(e) => setBannerWidth(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Крепление</span>
              <div className="rc-choice-row">
                {BANNER_MOUNTS.map((m) => (
                  <button key={m.id} type="button" className={"rc-choice" + (mountId === m.id ? " is-active" : "")} onClick={() => setMountId(m.id)}>
                    {m.label}
                    {m.priced ? ` — ${RING_PRICE} ₽/шт` : " (цена индивидуально)"}
                  </button>
                ))}
              </div>
              {mount?.id === "rings" && (
                <>
                  <div className="tag-custom-inputs" style={{ marginTop: 12 }}>
                    <label className="tag-input-field">
                      <span>Количество колец</span>
                      <input type="number" min={1} value={ringQty} onChange={(e) => setRingQty(Number(e.target.value))} />
                    </label>
                  </div>
                  <p className="rc-hint">{RING_HINT}</p>
                </>
              )}
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
              {needsInstall === true && <p className="rc-hint">Стоимость установки рассчитывается индивидуально.</p>}
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

        {/* РЕКВИЗИТНИЦЫ И ВИЗИТНИЦЫ */}
        {category === "holders" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Вариант</span>
              <div className="rc-choice-row">
                {HOLDER_OPTIONS.map((h) => (
                  <button key={h.id} type="button" className={"rc-choice" + (holderId === h.id ? " is-active" : "")} onClick={() => setHolderId(h.id)}>
                    {h.label} — {formatRub(h.price)}
                  </button>
                ))}
              </div>
              <p className="rc-hint">Уточните у нас, какой вариант подойдёт под ваш формат.</p>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <div className="tag-custom-inputs">
                <label className="tag-input-field">
                  <span>Штук</span>
                  <input type="number" min={1} value={holderQty} onChange={(e) => setHolderQty(Number(e.target.value))} />
                </label>
              </div>
            </div>
          </>
        )}

        {/* РОЛЛ-АП */}
        {category === "rollup" && (
          <>
            <div className="rc-step">
              <span className="rc-step-title">Вариант</span>
              <div className="rc-choice-row">
                {ROLLUP_OPTIONS.map((r) => (
                  <button key={r.id} type="button" className={"rc-choice" + (rollupId === r.id ? " is-active" : "")} onClick={() => setRollupId(r.id)}>
                    {r.label} — {formatRub(r.price)}
                  </button>
                ))}
              </div>
            </div>

            <div className="rc-step">
              <span className="rc-step-title">Количество</span>
              <div className="tag-custom-inputs">
                <label className="tag-input-field">
                  <span>Штук</span>
                  <input type="number" min={1} value={rollupQty} onChange={(e) => setRollupQty(Number(e.target.value))} />
                </label>
              </div>
            </div>
          </>
        )}

        {category && (
          <div className="rc-summary">
            <span className="rc-step-title">Итог заказа</span>
            <div className="rc-total-row">
              <span>
                {finalOrder
                  ? finalOrder.isEstimate
                    ? "Ориентировочная стоимость"
                    : "Итоговая стоимость"
                  : "Ориентировочная стоимость"}
              </span>
              <span className="rc-total-value">
                {finalOrder
                  ? finalOrder.total === null
                    ? "Уточняется"
                    : formatRub(finalOrder.total)
                  : livePreviewTotal !== null
                  ? formatRub(livePreviewTotal)
                  : "—"}
              </span>
            </div>
            <button type="button" className="btn-primary rc-submit" disabled={!finalOrder} onClick={() => setCartOpen(true)}>
              <span>Добавить в корзину</span>
              <span className="btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
            {!finalOrder && <p className="rc-hint rc-hint--center">Ответьте про макет и заполните все поля выше.</p>}
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={finalOrder} whatsappUrl={whatsappUrl} />
    </section>
  );
}
