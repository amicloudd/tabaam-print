export default function Intro() {
  return (
    <section id="intro" aria-label="tabaam.print — типография полного цикла">
      <div className="intro-inner">
        <span className="eyebrow">Полиграфия и сувенирная продукция</span>
        <h1 className="intro-title">
          tabaam.print
          <span className="intro-title-sub">Дизайн.Печать.Брендирование упаковки</span>
        </h1>
      </div>

      <a className="intro-scroll" href="#hero" aria-label="Смотреть каталог продукции">
        <span>Смотреть каталог</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  );
}
