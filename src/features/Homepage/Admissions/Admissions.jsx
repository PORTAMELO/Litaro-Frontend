import { introduction, steps } from "./AdmissionsData.js";
import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../components/SectionTitle";
import AdmissionGuide from "./components/AdmissionGuide";
import IntroductionCard from "./components/IntroductionCard";

const Admissions = () => {
  return (
    <section>
      <div>
        <SectionTitle
          text="¿Cómo realizar el proceso de admisión?"
          center={true}
        />
        <IntroductionCard introduction={introduction} image={colegio} />
      </div>
      <div>
        <SectionTitle text="Ruta de admisión" center={true} />
        <AdmissionGuide steps={steps} />
      </div>
    </section>
  );
};

export default Admissions;
