import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChocolateCalculator from "@/components/chocolate-calculator/ChocolateCalculator";

export const metadata = {
  title: "Калькулятор брендированных шоколадок — tabaam.print",
  description: "Рассчитайте стоимость брендированных шоколадок 5 г онлайн.",
};

export default function ChocolateCalculatorPage() {
  return (
    <>
      <Header />
      <ChocolateCalculator />
      <Footer />
    </>
  );
}
