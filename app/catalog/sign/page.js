import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignCalculator from "@/components/sign-calculator/SignCalculator";

export const metadata = {
  title: "Калькулятор вывесок и баннеров — tabaam.print",
  description: "Подберите вывеску, баннер, плакат, штендер или ролл-ап — уточним стоимость индивидуально.",
};

export default function SignCalculatorPage() {
  return (
    <>
      <Header />
      <SignCalculator />
      <Footer />
    </>
  );
}
