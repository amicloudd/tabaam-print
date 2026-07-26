import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <section id="about" className="content-section">
      <div className="content-inner">
        <Reveal className="section-head">
          <span className="eyebrow">О нас</span>
          <h2 className="section-title">Типография полного цикла</h2>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-block">
            <h3>Бренд начинается с деталей</h3>
            <p>
              Мы верим, что именно детали формируют первое впечатление о компании. Фирменная
              упаковка, ленты, наклейки, полиграфия и сувенирная продукция помогают бренду
              выглядеть профессионально и запоминаться с первого взгляда.
            </p>
          </Reveal>
          <Reveal className="about-block">
            <h3>Мы объединяем дизайн и производство, чтобы вы могли получить всё в одном месте</h3>
            <p>
              — от идеи и разработки фирменного стиля до готовой продукции. Внимательно относимся
              к каждому проекту, подбираем материалы, контролируем качество и создаём решения,
              которыми действительно хочется пользоваться.
            </p>
          </Reveal>
        </div>

        <Reveal className="stats-row">
          <div className="stat-item">
            <p className="stat-head">С 2023 года</p>
            <p className="stat-sub">на рынке полиграфии и сувенирной продукции</p>
          </div>
          <div className="stat-item">
            <p className="stat-head">Сотни заказов</p>
            <p className="stat-sub">и клиенты, которые возвращаются снова</p>
          </div>
          <div className="stat-item">
            <p className="stat-head">Индивидуальный подход</p>
            <p className="stat-sub">к каждому проекту — без шаблонных решений</p>
          </div>
          <div className="stat-item">
            <p className="stat-head">Полный контроль</p>
            <p className="stat-sub">от заказа до доставки, всегда на связи</p>
          </div>
        </Reveal>

        <Reveal className="section-cta">
          <a className="text-link" href="#hero">
            <span className="link-text">Смотреть каталог продукции</span>
            <span className="link-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
