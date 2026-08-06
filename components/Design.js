import Reveal from "@/components/Reveal";

export default function Design() {
  return (
    <section id="design" className="content-section content-section--card content-section--textured">
      <Reveal className="content-inner content-inner--narrow">
        <h2 className="section-title">Дизайн, который делает бренд узнаваемым</h2>
        <p className="section-lede">
          Каждый проект начинается с идеи. Мы создаём логотипы, фирменный стиль, упаковку и
          полиграфию, чтобы ваша компания выглядела профессионально и запоминалась с первого
          взгляда. Все макеты сразу подготавливаются к производству.
        </p>
        <a className="btn-primary" href="/designer-portfolio">
          <span>Смотреть портфолио</span>
          <span className="btn-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </Reveal>
    </section>
  );
}
