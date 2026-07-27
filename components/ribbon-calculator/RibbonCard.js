"use client";

export default function RibbonCard({ ribbon, count, onIncrement, onClear }) {
  const meters = count * 100;
  return (
    <div className={"ribbon-card" + (count > 0 ? " is-selected" : "")}>
      <button
        type="button"
        className="ribbon-card-tap"
        onClick={() => onIncrement(ribbon.id)}
        aria-label={`${ribbon.name}: добавить 100 м (сейчас ${meters} м)`}
      >
        <span className="ribbon-card-photo">
          <img src={ribbon.src} alt={ribbon.name} loading="lazy" />
        </span>
        <span className="ribbon-card-name">{ribbon.name}</span>
      </button>

      {count > 0 && (
        <>
          <span className="ribbon-card-badge" key={count}>
            {count}
          </span>
          <button
            type="button"
            className="ribbon-card-clear"
            onClick={() => onClear(ribbon.id)}
            aria-label={`Убрать ${ribbon.name} из заказа`}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
