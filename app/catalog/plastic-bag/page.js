import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlasticBagCalculator from "@/components/plastic-bag-calculator/PlasticBagCalculator";

export const metadata = {
  title: "Калькулятор полиэтиленовых пакетов — tabaam.print",
  description: "Рассчитайте стоимость ПВД-пакетов онлайн.",
};

export default function PlasticBagCalculatorPage() {
  return (
    <>
      <Header />
      <PlasticBagCalculator />
      <Footer />
    </>
  );
}
