import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaperSmallCalculator from "@/components/paper-small-calculator/PaperSmallCalculator";

export const metadata = {
  title: "Калькулятор бумажной продукции (малые тиражи) — tabaam.print",
  description: "Рассчитайте стоимость визиток, карточек и открыток онлайн.",
};

export default function PaperSmallCalculatorPage() {
  return (
    <>
      <Header />
      <PaperSmallCalculator />
      <Footer />
    </>
  );
}
