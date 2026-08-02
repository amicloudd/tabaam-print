import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SewnTagCalculator from "@/components/sewn-tag-calculator/SewnTagCalculator";

export const metadata = {
  title: "Калькулятор пришивных бирок — tabaam.print",
  description: "Рассчитайте стоимость пришивных бирок онлайн.",
};

export default function SewnTagCalculatorPage() {
  return (
    <>
      <Header />
      <SewnTagCalculator />
      <Footer />
    </>
  );
}
