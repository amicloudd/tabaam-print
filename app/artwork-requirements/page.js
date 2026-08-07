import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BackButton from "@/components/BackButton";
import "./artwork-requirements.css";

export const metadata = {
  title: "Требования к макету — tabaam.print",
  description: "Технические требования к макетам для всех видов продукции tabaam.print: форматы файлов, вылеты, цветовой профиль и подготовка к печати.",
};

const CHECKLIST = [
  "Макет должен быть подготовлен точно под выбранный размер изделия.",
  "Добавьте вылеты по 5 мм с каждой стороны.",
  "При двусторонней печати предоставляйте лицевую и оборотную стороны отдельными файлами.",
  "Все шрифты должны быть переведены в кривые.",
  "Цветовой профиль — CMYK.",
  "Все слои должны быть сведены.",
  "Градиенты, прозрачности, эффекты и тени должны быть растрированы.",
  "QR-коды должны корректно считываться.",
  "Все изображения должны иметь достаточное разрешение для качественной печати.",
  "Не размещайте важную информацию близко к линии реза.",
  "На макете не должно быть меток, направляющих, комментариев, рамок и других вспомогательных элементов.",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 5 5L19 7" />
    </svg>
  );
}

export default function ArtworkRequirementsPage() {
  return (
    <>
      <Header />

      <section className="content-section">
        <div className="content-inner content-inner--narrow">
          <BackButton className="ar-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <span>Назад</span>
          </BackButton>

          <Reveal>
            <span className="eyebrow">Макет</span>
            <h1 className="section-title">Требования к макетам</h1>
            <p className="section-lede">
              Единые правила подготовки макета для всей продукции tabaam.print — от лент и бирок до
              бумажной продукции и упаковки. Проверьте свой файл по этому списку перед отправкой заказа.
            </p>
          </Reveal>

          <Reveal className="ar-important">
            <span className="ar-important-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <div className="ar-important-body">
              <span className="ar-important-title">Важно</span>
              <p>
                Готовый макет — это файл, полностью соответствующий техническим требованиям, выбранному
                размеру и не требующий каких-либо изменений.
              </p>
              <p>
                Если макет необходимо доработать (исправить размер, качество, текст, цвета, вылеты,
                расположение элементов и т. д.), такая работа считается подготовкой макета и оплачивается
                отдельно.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="content-section content-section--card">
        <div className="content-inner">
          <div className="ar-tracks">
            <Reveal as="div" className="ar-track">
              <div className="ar-track-head">
                <span className="ar-track-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 18 12 6l8 12" />
                    <circle cx="4" cy="18" r="1.6" fill="currentColor" stroke="none" />
                    <circle cx="12" cy="6" r="1.6" fill="currentColor" stroke="none" />
                    <circle cx="20" cy="18" r="1.6" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <h2>Только векторный макет</h2>
              </div>

              <p className="ar-track-products">
                Брендированные ленты, пришивные бирки, наклейки на прозрачной плёнке, наклейки без
                подложки, штампы и печати
              </p>

              <div className="ar-track-formats-row">
                <span className="ar-track-formats-label">Форматы</span>
                <div className="ar-track-formats">
                  {["AI", "CDR", "SVG", "PDF"].map((f) => (
                    <span className="ar-format-chip" key={f}>{f}</span>
                  ))}
                </div>
              </div>

              <ul className="ar-track-list">
                <li>Переведите весь текст в кривые.</li>
                <li>Удалите скрытые объекты и лишние элементы.</li>
                <li>Используйте только чёрный цвет.</li>
                <li>Сохраните макет в оригинальном размере.</li>
              </ul>

              <div className="ar-track-warn">
                <span className="ar-track-warn-title">Для штампов, печатей и наклеек без подложки не допускаются</span>
                <ul>
                  <li>растровые изображения</li>
                  <li>фотографии</li>
                  <li>полупрозрачности</li>
                  <li>тени</li>
                  <li>градиенты</li>
                </ul>
              </div>
            </Reveal>

            <Reveal as="div" className="ar-track">
              <div className="ar-track-head">
                <span className="ar-track-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="8.5" cy="9.5" r="1.5" />
                    <path d="m21 15-5-5-9 9" />
                  </svg>
                </span>
                <h2>Вектор предпочтителен</h2>
              </div>

              <p className="ar-track-products">
                Подвесные картонные бирки, цветные наклейки, корпоративная продукция, бумажная продукция,
                тишью, пакеты, коробки, баннеры
              </p>

              <div className="ar-track-formats-row">
                <span className="ar-track-formats-label">Если вектора нет</span>
                <div className="ar-track-formats">
                  {["JPG", "PNG", "PDF"].map((f) => (
                    <span className="ar-format-chip" key={f}>{f}</span>
                  ))}
                </div>
              </div>

              <ul className="ar-track-list">
                <li>Предпочтительно предоставлять векторный макет.</li>
                <li>Изображение должно быть высокого качества и без потери чёткости.</li>
              </ul>
            </Reveal>
          </div>

          <Reveal>
            <h2 className="ar-section-title">Общие требования к макету</h2>
            <ul className="ar-checklist">
              {CHECKLIST.map((item) => (
                <li key={item}>
                  <span className="ar-check-icon">
                    <CheckIcon />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="ar-textsize">
              <div className="ar-textsize-item">
                <span className="ar-textsize-value">5 pt</span>
                <span className="ar-textsize-label">минимальный размер текста на светлом фоне</span>
              </div>
              <div className="ar-textsize-item">
                <span className="ar-textsize-value">6 pt</span>
                <span className="ar-textsize-label">минимальный размер текста на тёмном фоне</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="content-section">
        <div className="content-inner content-inner--narrow">
          <Reveal className="ar-black-note">
            <span className="ar-black-swatch" aria-hidden="true" />
            <div className="ar-black-note-body">
              <p>
                Для получения насыщенного чёрного цвета рекомендуется использовать составной
                (<strong>Rich Black</strong>), а не 100% K.
              </p>
              <p>
                Если в макете используется обычный чёрный цвет (K100), итоговый оттенок может выглядеть
                менее насыщенным. За особенности цветопередачи макетов, подготовленных без соблюдения этих
                требований, ответственность не несётся.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
