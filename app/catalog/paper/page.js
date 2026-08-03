import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaperCalculator from "@/components/paper-calculator/PaperCalculator";

export const metadata = {
  title: "Калькулятор бумажной продукции — tabaam.print",
  description: "Рассчитайте стоимость визиток, карточек, открыток, листовок, буклетов и другой бумажной продукции онлайн — малые и большие тиражи.",
};

export default function PaperCalculatorPage() {
  return (
    <>
      <Header />
      <PaperCalculator />
      <Footer />
    </>
  );
}
