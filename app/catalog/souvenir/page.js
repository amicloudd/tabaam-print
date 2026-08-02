import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SouvenirCalculator from "@/components/souvenir-calculator/SouvenirCalculator";

export const metadata = {
  title: "Калькулятор корпоративной сувенирной продукции — tabaam.print",
  description: "Рассчитайте стоимость корпоративной сувенирной продукции онлайн.",
};

export default function SouvenirCalculatorPage() {
  return (
    <>
      <Header />
      <SouvenirCalculator />
      <Footer />
    </>
  );
}
