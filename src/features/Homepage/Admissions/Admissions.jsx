import { useEffect, useState } from "react";

import colegio from "../../../assets/colegio.jpeg";

import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import AdmissionGuide from "./components/AdmissionGuide";
import IntroductionCard from "./components/IntroductionCard";

import { getIntroduction, getSteps } from "../services/AdmissionsService";

const initialState = {
  introduction: [],
  steps: [],
};

const Admissions = () => {
  const [content, setContent] = useState(initialState);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [introduction, steps] = await Promise.all([
          getIntroduction(),
          getSteps(),
        ]);

        setContent({
          introduction,
          steps,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadContent();
  }, []);

  return (
    <section>
      <div>
        <SectionTitle text="¿Cómo realizar el proceso de admisión?" center />

        <IntroductionCard
          introduction={content.introduction[0]?.description || ""}
          image={colegio}
        />
      </div>

      <div>
        <SectionTitle text="Ruta de admisión" center />

        <AdmissionGuide steps={content.steps} />
      </div>
    </section>
  );
};

export default Admissions;
