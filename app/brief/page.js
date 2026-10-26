import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackButton from "@/components/BackButton";
import Brief from "@/components/brief/Brief";
import { BRIEF_RULES } from "@/lib/brief";
import "@/app/artwork-requirements/artwork-requirements.css";
import "@/components/brief/brief.css";

export const metadata = {
  title: "Бриф на фирменный стиль — tabaam.print",
  description: "Заполните бриф на логотип и фирменный стиль онлайн: вопросы о бренде, аудитории, характере и носителях. Ответы можно отправить дизайнеру в WhatsApp или скачать.",
};

const RULE_ICONS = {
  chat: (
    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12Z" />
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" />
      <circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9Z" />
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
      <path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 14.8c1.8.6 3 2.2 3.5 4.7" />
    </>
  ),
};

export default function BriefPage() {
  return (
    <>
      <Header />

      <section className="content-section content-section--card content-section--textured bf-hero">
        <div className="content-inner content-inner--narrow">
          <BackButton className="ar-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <span>Назад</span>
          </BackButton>

          <Reveal>
            <span className="eyebrow">Дизайн</span>
            <h1 className="section-title">Бриф на фирменный стиль</h1>
            <p className="section-lede">
              С брифа начинается каждый логотип и фирменный стиль. Ответьте на вопросы прямо здесь —
              ответы сохраняются автоматически, а в конце их можно одним нажатием отправить дизайнеру.
            </p>
          </Reveal>
        </div>

        <div className="bf-rules content-inner">
          {BRIEF_RULES.map((rule) => (
            <Reveal as="div" className="bf-rule" key={rule.title}>
              <span className="bf-rule-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {RULE_ICONS[rule.icon]}
                </svg>
              </span>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Brief />

      <Footer />
    </>
  );
}
