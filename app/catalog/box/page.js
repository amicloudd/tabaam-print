import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BoxCalculator from "@/components/box-calculator/BoxCalculator";

export const metadata = {
  title: "Калькулятор брендированных коробок — tabaam.print",
  description: "Узнайте стоимость брендированных коробок под ваш размер — производство в Китае.",
};

export default function BoxCalculatorPage() {
  return (
    <>
      <Header />
      <BoxCalculator />
      <Footer />
    </>
  );
}
