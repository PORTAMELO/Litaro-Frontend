import { useEffect, useState } from "react";

import colegio from "../../../assets/colegio.jpeg";

import SectionTitle from "../../../shared/components/SectionTitle.jsx";
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

const AboutUs = () => {
  const [content, setContent] = useState(initialState);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [introduction, mission, vision, professors] = await Promise.all([
          getIntroduction(),
          getMission(),
          getVision(),
          getProfessors(),
        ]);

        setContent({
          introduction,
          mission,
          vision,
          professors: professors.map((item) => ({
            ...item,
            image: images[item.image],
          })),
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadContent();
  }, []);

  return (
    <section>
      <div className="section-intro">
        <SectionTitle text="Nosotros" center />

        <HistoryCard
          imagen={colegio}
          text={content.introduction[0]?.description || ""}
        />
      </div>

      <div className="section-mission-vision">
        <SectionTitle text="Misión y Visión" center />

        <MissionVision
          mision={content.mission[0]?.description || ""}
          vision={content.vision[0]?.description || ""}
        />
      </div>

      <div className="section-professors">
        <SectionTitle text="Nuestro cuerpo académico" center />

        <ProfessorCardBoard professors={content.professors} />
      </div>
    </section>
  );
};

export default AboutUs;
