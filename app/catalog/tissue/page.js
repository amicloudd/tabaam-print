import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TissueCalculator from "@/components/tissue-calculator/TissueCalculator";

export const metadata = {
  title: "Калькулятор тишью и кальки — tabaam.print",
  description: "Рассчитайте стоимость тишью, пергамента и крафта онлайн.",
};

export default function TissueCalculatorPage() {
  return (
    <>
      <Header />
      <TissueCalculator />
      <Footer />
    </>
  );
}
