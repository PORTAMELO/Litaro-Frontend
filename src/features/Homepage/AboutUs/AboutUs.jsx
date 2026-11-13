import colegio from "../../../assets/colegio.jpeg";

import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import { useLoad } from "../../../shared/hooks/UseLoad";
import LoadError from "../components/LoadError";
import SectionSkeleton from "../components/SectionSkeleton";
import HistoryCard from "./components/HistoryCard";
import MissionVision from "./components/MissionVision";
import ProfessorCardBoard from "./components/ProfessorCardBoard";

import {
  getIntroduction,
  getMission,
  getVision,
  getProfessors,
} from "../services/AboutUsService";

const images = {
  colegio,
};

const initialState = {
  introduction: [],
  mission: [],
  vision: [],
  professors: [],
};

const loadContent = async () => {
  const [introduction, mission, vision, professors] = await Promise.all([
    getIntroduction(),
    getMission(),
    getVision(),
    getProfessors(),
  ]);

  return {
    introduction,
    mission,
    vision,
    professors: professors.map((item) => ({
      ...item,
      image: images[item.image],
    })),
  };
};

const AboutUs = () => {
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
      <div className="section-intro">
        <SectionTitle text="Nosotros" center />

        {loading ? (
          <SectionSkeleton variant="intro" />
        ) : (
          <HistoryCard
            imagen={colegio}
            text={content.introduction[0]?.description || ""}
          />
        )}
      </div>

      <div className="section-mission-vision">
        <SectionTitle text="Misión y Visión" center />

        {loading ? (
          <SectionSkeleton variant="intro" />
        ) : (
          <MissionVision
            mision={content.mission[0]?.description || ""}
            vision={content.vision[0]?.description || ""}
          />
        )}
      </div>

      <div className="section-professors">
        <SectionTitle text="Nuestro cuerpo académico" center />

        {loading ? <SectionSkeleton variant="cards" /> : <ProfessorCardBoard professors={content.professors} />}
      </div>
    </section>
  );
};

export default AboutUs;
