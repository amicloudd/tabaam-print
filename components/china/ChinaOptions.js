"use client";

import "./china-options.css";

export const WHATSAPP_PHONE = "79282699936";

export function whatsappLink(lines) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// Фото-подсказка к шагу; по клику открывается в полном размере
export function OptionPhoto({ src, alt }) {
  return (
    <a className="cn-photo" href={src} target="_blank" rel="noopener noreferrer">
      <img src={src} alt={alt} loading="lazy" />
    </a>
  );
}

// Заглушка, пока фото палитры не добавлено
export function PhotoSoon({ label = "Фото палитры скоро появится" }) {
  return (
    <div className="cn-photo-soon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m21 15-5-5-9 9" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

// Кнопки выбора с подписью и необязательным бейджем ("рекомендуем")
export function OptionCards({ options, value, onChange }) {
  return (
    <div className="cn-cards">
      {options.map((o) => (
        <button
          type="button"
          key={o.id}
          className={"cn-card" + (value === o.id ? " is-active" : "")}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.badge && <span className="cn-card-badge">{o.badge}</span>}
          <span className="cn-card-label">{o.label}</span>
          {o.sub && <span className="cn-card-sub">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}

// Цветные кружки палитры
export function ColorSwatches({ colors, value, onChange }) {
  return (
    <div className="cn-swatches">
      {colors.map((c) => (
        <button
          type="button"
          key={c.id}
          className={"cn-swatch" + (value === c.id ? " is-active" : "")}
          aria-pressed={value === c.id}
          onClick={() => onChange(c.id)}
        >
          <span className="cn-swatch-dot" style={{ background: c.hex }} />
          <span className="cn-swatch-label">{c.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ChinaFacts({ leadTime, minQty, note }) {
  return (
    <div className="tag-china-info">
      <div className="tag-china-fact">
        <span className="tag-china-fact-label">Производство</span>
        <span className="tag-china-fact-value">Китай</span>
      </div>
      <div className="tag-china-fact">
        <span className="tag-china-fact-label">Срок производства</span>
        <span className="tag-china-fact-value">{leadTime}</span>
      </div>
      {minQty && (
        <div className="tag-china-fact">
          <span className="tag-china-fact-label">Минимальный заказ</span>
          <span className="tag-china-fact-value">{minQty}</span>
        </div>
      )}
      {note && <p className="tag-china-note">{note}</p>}
    </div>
  );
}

export function ChinaSubmit({ href, ready, hint }) {
  return (
    <div className="rc-summary">
      <span className="rc-step-title">Итог заказа</span>
      <div className="rc-total-row">
        <span>Стоимость</span>
        <span className="rc-total-value cn-total-text">рассчитаем индивидуально</span>
      </div>
      <a
        className={"btn-primary rc-submit" + (ready ? "" : " is-disabled")}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!ready) e.preventDefault();
        }}
      >
        <span>Рассчитать в WhatsApp</span>
        <span className="btn-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </a>
      {!ready && hint && <p className="rc-hint rc-hint--center">{hint}</p>}
    </div>
  );
}
