import { LOGO } from "@/lib/assets";

export default function Header() {
  return (
    <header id="siteHeader">
      <a className="site-logo" href="#hero" aria-label="tabaam.print — на главную">
        <img src={LOGO} alt="tabaam.print" />
        <span className="site-logo-text">tabaam.print</span>
      </a>
      <nav className="site-nav" aria-label="Основная навигация">
        <a href="#hero">Каталог</a>
        <a href="#about">О нас</a>
        <a href="#design">Дизайн</a>
      </nav>
      <div className="site-contacts">
        <a
          className="site-contact-btn"
          href="https://wa.me/79282699936"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm5.71 14.02c-.24.68-1.19 1.25-1.94 1.41-.53.11-1.22.2-3.56-.76-2.99-1.24-4.91-4.26-5.06-4.46-.15-.2-1.2-1.6-1.2-3.06s.75-2.17 1.02-2.47c.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.24.55.79 1.93.86 2.07.07.14.11.31.02.5-.09.19-.13.31-.27.48-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.27.36-.23.6-.14.24.09 1.53.72 1.79.85.26.13.43.19.5.3.06.11.06.61-.18 1.29Z" />
          </svg>
        </a>
        <a
          className="site-contact-btn"
          href="https://instagram.com/tabaam.print"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram tabaam.print"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.4" cy="6.6" r="1.05" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a className="site-contact-btn" href="mailto:enigma00_00@mail.ru" aria-label="Написать на почту">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </a>
      </div>
    </header>
  );
}
