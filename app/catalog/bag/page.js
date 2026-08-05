import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BagCalculator from "@/components/bag-calculator/BagCalculator";

export const metadata = {
  title: "Калькулятор картонных брендированных пакетов — tabaam.print",
  description: "Рассчитайте стоимость картонных брендированных пакетов любого размера онлайн.",
};

export default function BagCalculatorPage() {
  return (
    <>
      <Header />
      <BagCalculator />
      <Footer />
    </>
  );
}
