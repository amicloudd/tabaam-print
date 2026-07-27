import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Требования к макету — tabaam.print",
};

export default function ArtworkRequirementsPage() {
  return (
    <>
      <Header />
      <section className="content-section" style={{ minHeight: "50vh" }}>
        <div className="content-inner content-inner--narrow">
          <span className="eyebrow">Макет</span>
          <h2 className="section-title">Требования к макету</h2>
          <p className="section-lede">
            Здесь скоро появятся требования к макетам для каждого вида продукции — лент, визиток,
            наклеек, бирок, пакетов, коробок и других. Пока страница пустая.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
