"use client";

import { useEffect, useRef } from "react";
import { formatRub } from "@/lib/format";

export default function CartDrawer({ open, onClose, order, whatsappUrl }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!order) return null;

  return (
    <div className={"cart-overlay" + (open ? " is-open" : "")} aria-hidden={!open}>
      <div className="cart-scrim" onClick={onClose} />
      <div className="cart-panel" ref={panelRef} tabIndex={-1} role="dialog" aria-label="Корзина">
        <div className="cart-panel-head">
          <span className="eyebrow">Ваш заказ</span>
          <button type="button" className="cart-close" onClick={onClose} aria-label="Закрыть корзину">
            ×
          </button>
        </div>

        <div className="cart-panel-body">
          <dl className="cart-fact-list">
            <div className="cart-fact">
              <dt>Вид продукции</dt>
              <dd>{order.productLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Размер</dt>
              <dd>{order.sizeLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Тип печати</dt>
              <dd>{order.printLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Количество</dt>
              <dd>{order.qty} шт</dd>
            </div>
            <div className="cart-fact">
              <dt>Нужен дизайн</dt>
              <dd>{order.hasArtwork ? "Нет, макет готов" : `Да (+${order.designFee} ₽)`}</dd>
            </div>
          </dl>

          <div className="cart-total-row">
            <span>{order.isEstimate ? "Ориентировочная стоимость" : "Итоговая стоимость"}</span>
            <span>{order.total === null ? "Уточняется" : formatRub(order.total)}</span>
          </div>

          <a className="btn-primary cart-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <span>Отправить заказ в WhatsApp</span>
            <span className="btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
          <p className="cart-note">Дальше общение и подтверждение заказа — в переписке.</p>
        </div>
      </div>
    </div>
  );
}
