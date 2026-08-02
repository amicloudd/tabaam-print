import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampCalculator from "@/components/stamp-calculator/StampCalculator";

export const metadata = {
  title: "Калькулятор штампов — tabaam.print",
  description: "Рассчитайте стоимость штампа онлайн.",
};

export default function StampCalculatorPage() {
  return (
    <>
      <Header />
      <StampCalculator />
      <Footer />
    </>
  );
}
