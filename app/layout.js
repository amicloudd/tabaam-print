import "./globals.css";

export const metadata = {
  title: "tabaam.print",
  description: "Полиграфия и сувенирная продукция полного цикла — от макета до готового изделия.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
