import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TagCalculator from "@/components/tag-calculator/TagCalculator";

export const metadata = {
  title: "Калькулятор подвесных картонных бирок — tabaam.print",
  description: "Рассчитайте стоимость печати подвесных картонных бирок онлайн.",
};

export default function TagCalculatorPage() {
  return (
    <>
      <Header />
      <TagCalculator />
      <Footer />
    </>
  );
}
