"use client";

import { useMemo, useState } from "react";
import RibbonCard from "./RibbonCard";
import CartDrawer from "./CartDrawer";
import {
  WIDTHS,
  SILICONE_BASE_100,
  SILICONE_LABEL,
  SILICONE_IMAGE,
  widthByValue,
  lineTotal,
  priceWithDiscount,
  discountPercentFor,
  formatRub,
} from "@/lib/ribbon-pricing";
import { PRINT_COLOR_GROUPS, findPrintColors } from "@/lib/print-colors";
import "./ribbon-calculator.css";

const WHATSAPP_PHONE = "79282699936";
const SILICONE_STEPS = Array.from({ length: 10 }, (_, i) => (i + 1) * 100); // 100..1000

function pct(n) {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(1);
}

export default function RibbonCalculator({ ribbons }) {
  const [hasArtwork, setHasArtwork] = useState(null); // true = есть макет, false = нужен дизайн
  const [width, setWidth] = useState(2);
  const [printColorIds, setPrintColorIds] = useState([]);
  const [ribbonCounts, setRibbonCounts] = useState({});
  const [siliconeEnabled, setSiliconeEnabled] = useState(false);
  const [siliconeMeters, setSiliconeMeters] = useState(100);
  const [cartOpen, setCartOpen] = useState(false);

  const widthInfo = widthByValue(width);
  const selectedPrintColors = findPrintColors(printColorIds);

  function incrementRibbon(id) {
    setRibbonCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }
  function clearRibbon(id) {
    setRibbonCounts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }
  function togglePrintColor(id) {
    setPrintColorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // discount is pooled: it depends on the TOTAL metres across every chosen ribbon colour,
  // not on any single colour's own volume — so 100 м белой + 100 м чёрной already gets the 200 м tier.
  const ribbonsMetersTotal = useMemo(
    () => ribbons.reduce((sum, r) => sum + (ribbonCounts[r.id] || 0) * 100, 0),
    [ribbons, ribbonCounts]
  );
  const ribbonsDiscountPercent = discountPercentFor(ribbonsMetersTotal);

  const selectedRibbons = useMemo(() => {
    return ribbons
      .filter((r) => ribbonCounts[r.id] > 0)
      .map((r) => {
        const meters = ribbonCounts[r.id] * 100;
        return { ...r, meters, total: priceWithDiscount(meters, widthInfo.base100, ribbonsDiscountPercent) };
      });
  }, [ribbons, ribbonCounts, widthInfo, ribbonsDiscountPercent]);

  const ribbonsTotal = selectedRibbons.reduce((sum, r) => sum + r.total, 0);
  const siliconeTotal = siliconeEnabled ? lineTotal(siliconeMeters, SILICONE_BASE_100) : 0;
  const siliconeDiscountPercent = siliconeEnabled ? discountPercentFor(siliconeMeters) : 0;
  const designFee = hasArtwork === false ? 400 : 0;
  const grandTotal = ribbonsTotal + siliconeTotal + designFee;

  const canSubmit =
    hasArtwork !== null &&
    printColorIds.length > 0 &&
    (selectedRibbons.length > 0 || (siliconeEnabled && siliconeMeters > 0));

  const printColorLabel = selectedPrintColors.map((c) => c.label).join(", ") || "—";

  const order = useMemo(
    () => ({
      widthLabel: widthInfo.label,
      printColorLabel,
      hasArtwork,
      designFee,
      ribbons: selectedRibbons,
      silicone: siliconeEnabled ? { meters: siliconeMeters, total: siliconeTotal } : null,
      grandTotal,
    }),
    [widthInfo, printColorLabel, hasArtwork, designFee, selectedRibbons, siliconeEnabled, siliconeMeters, siliconeTotal, grandTotal]
  );

  const whatsappUrl = useMemo(() => {
    const lines = ["Здравствуйте!", "Хочу заказать печать на лентах.", ""];
    lines.push(`Размер: ${widthInfo.label}`);
    lines.push(`Цвет печати: ${printColorLabel !== "—" ? printColorLabel.toLowerCase() : "—"}`);
    lines.push(`Нужен дизайн: ${hasArtwork === false ? "да" : "нет, макет есть"}`);
    if (selectedRibbons.length > 0) {
      lines.push("");
      lines.push("Ленты:");
      selectedRibbons.forEach((r) => lines.push(`• ${r.name} — ${r.meters} м`));
    }
    if (siliconeEnabled && siliconeMeters > 0) {
      lines.push("");
      lines.push(`${SILICONE_LABEL} — ${siliconeMeters} м`);
    }
    lines.push("");
    lines.push(`Итоговая стоимость: ${formatRub(grandTotal)}`);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  }, [widthInfo, printColorLabel, hasArtwork, selectedRibbons, siliconeEnabled, siliconeMeters, grandTotal]);

  return (
    <section className="rc content-section">
      <div className="content-inner">
        <div className="rc-head">
          <span className="eyebrow">Рассчитать стоимость</span>
          <h1 className="section-title">Калькулятор стоимости печати на лентах</h1>
        </div>

        {/* 1. Макет */}
        <div className="rc-step">
          <span className="rc-step-title">1. Есть ли у вас макет?</span>
          <div className="rc-choice-row">
            <button
              type="button"
              className={"rc-choice" + (hasArtwork === true ? " is-active" : "")}
              onClick={() => setHasArtwork(true)}
            >
              Да, у меня есть готовый макет
            </button>
            <button
              type="button"
              className={"rc-choice" + (hasArtwork === false ? " is-active" : "")}
              onClick={() => setHasArtwork(false)}
            >
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
              <p className="rc-fee-line">+400 ₽</p>
            </div>
          )}
        </div>

        {/* 2. Размер */}
        <div className="rc-step">
          <span className="rc-step-title">2. Размер ленты</span>
          <div className="rc-choice-row">
            {WIDTHS.map((w) => (
              <button
                key={w.value}
                type="button"
                className={"rc-choice" + (width === w.value ? " is-active" : "")}
                onClick={() => setWidth(w.value)}
              >
                {w.label}
                {w.isDefault && <span className="rc-choice-tag">Стандарт</span>}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Выбор цветов лент */}
        <div className="rc-step">
          <span className="rc-step-title">3. Выбор цветов лент</span>
          <p className="rc-hint">
            Нажимайте на карточку, чтобы добавлять по 100 м. Скидка считается на общий объём всех лент вместе —
            неважно, одного цвета или разных.
          </p>
          <div className="rc-carousel">
            {ribbons.map((r) => (
              <RibbonCard
                key={r.id}
                ribbon={r}
                count={ribbonCounts[r.id] || 0}
                onIncrement={incrementRibbon}
                onClear={clearRibbon}
              />
            ))}
          </div>

          <div className="rc-order-list">
            {selectedRibbons.length === 0 ? (
              <p className="rc-hint">Пока ничего не выбрано.</p>
            ) : (
              selectedRibbons.map((r) => (
                <div className="rc-order-item" key={r.id}>
                  <span className="rc-order-check">✔</span>
                  <span>{widthInfo.label} — {r.name} — {r.meters} м</span>
                  <span className="rc-order-price">{formatRub(r.total)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Цвет печати */}
        <div className="rc-step">
          <span className="rc-step-title">4. Цвет печати</span>
          <p className="rc-hint">Можно выбрать несколько цветов.</p>
          {PRINT_COLOR_GROUPS.map((group) => (
            <div className="rc-color-group" key={group.title}>
              <span className="rc-color-group-title">{group.title}</span>
              <div className="rc-swatch-row">
                {group.colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={"rc-swatch" + (printColorIds.includes(c.id) ? " is-active" : "")}
                    onClick={() => togglePrintColor(c.id)}
                    aria-pressed={printColorIds.includes(c.id)}
                  >
                    <span
                      className={"rc-swatch-dot" + (c.needsBorder ? " has-border" : "")}
                      style={{ background: c.swatch }}
                    >
                      {printColorIds.includes(c.id) && <span className="rc-swatch-check">✔</span>}
                    </span>
                    <span className="rc-swatch-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Силикон */}
        <div className="rc-step rc-silicone">
          <span className="rc-step-title">{SILICONE_LABEL}</span>
          <div className="rc-silicone-row">
            <img className="rc-silicone-photo" src={SILICONE_IMAGE} alt={SILICONE_LABEL} loading="lazy" />
            <div className="rc-silicone-controls">
              <label className="rc-toggle">
                <input
                  type="checkbox"
                  checked={siliconeEnabled}
                  onChange={(e) => setSiliconeEnabled(e.target.checked)}
                />
                <span>Добавить в заказ</span>
              </label>

              {siliconeEnabled && (
                <div className="rc-slider-block rc-note--fade">
                  <div className="rc-slider-row">
                    <input
                      type="range"
                      min={100}
                      max={1000}
                      step={100}
                      value={siliconeMeters}
                      onChange={(e) => setSiliconeMeters(Number(e.target.value))}
                      list="silicone-steps"
                    />
                    <datalist id="silicone-steps">
                      {SILICONE_STEPS.map((m) => (
                        <option value={m} key={m} />
                      ))}
                    </datalist>
                    <span className="rc-slider-value">{siliconeMeters} м</span>
                  </div>
                  <div className="rc-order-item">
                    <span>
                      {siliconeMeters} м силикона
                      {siliconeDiscountPercent > 0 && ` · скидка ${pct(siliconeDiscountPercent)}%`}
                    </span>
                    <span className="rc-order-price">{formatRub(siliconeTotal)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Скидка + итог */}
        <div className="rc-discount-banner">
          Чем больше объём — тем выше скидка
          {ribbonsDiscountPercent > 0 && ` — сейчас ${pct(ribbonsDiscountPercent)}% на все ленты (${ribbonsMetersTotal} м)`}
          .
        </div>

        <div className="rc-summary">
          <span className="rc-step-title">6. Итог заказа</span>
          <dl className="cart-fact-list">
            <div className="cart-fact">
              <dt>Размер</dt>
              <dd>{widthInfo.label}</dd>
            </div>
            <div className="cart-fact">
              <dt>Цвет печати</dt>
              <dd>{printColorLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Дизайн</dt>
              <dd>{hasArtwork === false ? "Да (+400 ₽)" : hasArtwork === true ? "Не нужен" : "—"}</dd>
            </div>
          </dl>

          <div className="rc-total-row">
            <span>Итоговая стоимость</span>
            <span className="rc-total-value">{formatRub(grandTotal)}</span>
          </div>

          <button
            type="button"
            className="btn-primary rc-submit"
            disabled={!canSubmit}
            onClick={() => setCartOpen(true)}
          >
            <span>Добавить в корзину</span>
            <span className="btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
          {!canSubmit && (
            <p className="rc-hint rc-hint--center">
              Ответьте про макет, выберите хотя бы один цвет печати и хотя бы одну ленту (или силикон).
            </p>
          )}
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} order={order} whatsappUrl={whatsappUrl} />
    </section>
  );
}
