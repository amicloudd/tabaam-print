import { LOGO } from "@/lib/assets";

export default function Header() {
  return (
    <header id="siteHeader">
      <a className="site-logo" href="#hero" aria-label="tabaam.print — на главную">
        <img src={LOGO} alt="tabaam.print" />
      </a>
      <nav className="site-nav" aria-label="Основная навигация">
        <a href="#hero">Каталог</a>
        <a href="#about">О нас</a>
        <a href="#design">Дизайн</a>
      </nav>
      <span className="site-phone">
        <a href="tel:+79282699936">+7 928 269-99-36</a>
      </span>
    </header>
  );
}
