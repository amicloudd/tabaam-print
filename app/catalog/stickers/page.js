import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerCalculator from "@/components/sticker-calculator/StickerCalculator";

export const metadata = {
  title: "Калькулятор наклеек — tabaam.print",
  description: "Рассчитайте стоимость наклеек онлайн.",
};

export default function StickerCalculatorPage() {
  return (
    <>
      <Header />
      <StickerCalculator />
      <Footer />
    </>
  );
}
