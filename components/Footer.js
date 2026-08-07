import { LOGO } from "@/lib/assets";

export default function Footer() {
  return (
    <footer id="siteFooter">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={LOGO} alt="tabaam.print" />
          <p>Полиграфия и сувенирная продукция полного цикла — от макета до готового изделия.</p>
        </div>
        <div className="footer-col">
          <span className="footer-heading">Каталог</span>
          <a href="/#hero">Все категории</a>
          <a href="/#about">О нас</a>
          <a href="/#design">Дизайн</a>
        </div>
        <div className="footer-col">
          <span className="footer-heading">Контакты</span>
          <span className="footer-name">Амина Ахматханова</span>
          <a href="tel:+79282699936">+7 928 269-99-36</a>
          <a href="mailto:enigma00_00@mail.ru">enigma00_00@mail.ru</a>
          <a href="https://instagram.com/tabaam.print" target="_blank" rel="noopener noreferrer">
            Instagram · @tabaam.print
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 tabaam.print</span>
        <span>Полиграфия и сувенирная продукция</span>
      </div>
    </footer>
  );
}
