import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RibbonCalculator from "@/components/ribbon-calculator/RibbonCalculator";
import { getRibbonColors } from "@/lib/ribbons";

export const metadata = {
  title: "Калькулятор стоимости лент — tabaam.print",
  description: "Рассчитайте стоимость печати на атласных лентах онлайн.",
};

export default function RibbonCalculatorPage() {
  const ribbons = getRibbonColors();
  return (
    <>
      <Header />
      <RibbonCalculator ribbons={ribbons} />
      <Footer />
    </>
  );
}
