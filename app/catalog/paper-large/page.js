import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaperLargeCalculator from "@/components/paper-large-calculator/PaperLargeCalculator";

export const metadata = {
  title: "Калькулятор бумажной продукции (большие тиражи) — tabaam.print",
  description: "Рассчитайте стоимость визиток, листовок, буклетов и другой бумажной продукции онлайн.",
};

export default function PaperLargeCalculatorPage() {
  return (
    <>
      <Header />
      <PaperLargeCalculator />
      <Footer />
    </>
  );
}
