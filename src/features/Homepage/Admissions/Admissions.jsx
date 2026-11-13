import colegio from "../../../assets/colegio.jpeg";

import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import { useLoad } from "../../../shared/hooks/UseLoad";
import LoadError from "../components/LoadError";
import SectionSkeleton from "../components/SectionSkeleton";
import AdmissionGuide from "./components/AdmissionGuide";
import IntroductionCard from "./components/IntroductionCard";

import { getIntroduction, getSteps } from "../services/AdmissionsService";

const initialState = {
  introduction: [],
  steps: [],
};

const loadContent = async () => {
  const [introduction, steps] = await Promise.all([
    getIntroduction(),
    getSteps(),
  ]);

  return {
    introduction,
    steps,
  };
};

const Admissions = () => {
  const { data, error, loading, reload } = useLoad(loadContent, []);
  const content = data ?? initialState;

  if (error) {
    return (
      <section>
        <LoadError onRetry={reload} />
      </section>
    );
  }

  return (
    <section>
      <div>
        <SectionTitle text="¿Cómo realizar el proceso de admisión?" center />

        {loading ? (
          <SectionSkeleton variant="intro" />
        ) : (
          <IntroductionCard
            introduction={content.introduction[0]?.description || ""}
            image={colegio}
          />
        )}
      </div>

      <div>
        <SectionTitle text="Ruta de admisión" center />

        {loading ? <SectionSkeleton variant="cards" /> : <AdmissionGuide steps={content.steps} />}
      </div>
    </section>
  );
};

export default Admissions;
