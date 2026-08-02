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
              <dt>Тип бирки</dt>
              <dd>{order.tagTypeLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Размер</dt>
              <dd>{order.sizeLabel}</dd>
            </div>
            <div className="cart-fact">
              <dt>Количество</dt>
              <dd>{order.qty} шт</dd>
            </div>
            <div className="cart-fact">
              <dt>Нужен дизайн</dt>
              <dd>{order.hasArtwork ? "Нет, макет готов" : "Да (+800 ₽)"}</dd>
            </div>
          </dl>

          <div className="cart-block">
            <span className="cart-block-title">Стоимость</span>
            <ul className="cart-line-list">
              <li>
                <span>{order.baseLabel}</span>
                <span>{formatRub(order.baseTotal)}</span>
              </li>
              {order.doubleSided && (
                <li>
                  <span>Двусторонняя печать</span>
                  <span>{formatRub(order.doubleSidedFee)}</span>
                </li>
              )}
              {order.roundedCorners && (
                <li>
                  <span>Скругление углов</span>
                  <span>{formatRub(order.roundedFee)}</span>
                </li>
              )}
              {order.tagHolders && (
                <li>
                  <span>Биркодержатели</span>
                  <span>{formatRub(order.holderFee)}</span>
                </li>
              )}
              {order.designFee > 0 && (
                <li>
                  <span>Дизайн макета</span>
                  <span>{formatRub(order.designFee)}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="cart-total-row">
            <span>Итоговая стоимость</span>
            <span>{formatRub(order.grandTotal)}</span>
          </div>

          <p className="tag-shipping-note">
            Расчёт не включает стоимость доставки. Доставка рассчитывается индивидуально в зависимости от объёма заказа.
          </p>

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
