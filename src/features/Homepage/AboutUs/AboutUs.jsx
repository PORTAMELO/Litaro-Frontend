import { introtext, mission, vision, professors } from "./AboutUsData.js";
import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../components/SectionTitle";
import HistoryCard from "./components/HistoryCard";
import MissionVision from "./components/MissionVision";
import ProfessorCardBoard from "./components/ProfessorCardBoard";

const AboutUs = () => {
  return (
    <section>
      <div className="section-intro">
        <SectionTitle text="Nosotros" center={true} />
        <HistoryCard imagen={colegio} text={introtext} />
      </div>
      <div className="section-mission-vision">
        <SectionTitle text="Misión y Visión" center={true} />
        <MissionVision mision={mission} vision={vision}></MissionVision>
      </div>
      <div className="section-professors">
        <SectionTitle text="Nuestro cuerpo académico" center={true} />
        <ProfessorCardBoard professors={professors} />
      </div>
    </section>
  );
};

export default AboutUs;
