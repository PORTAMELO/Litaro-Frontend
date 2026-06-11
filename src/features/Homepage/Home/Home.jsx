import {
  text,
  first_labels,
  second_labels,
  locations,
  levels,
  events,
} from "./HomeData.js";
import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../components/SectionTitle";
import Banner from "../components/Banner";
import EventCardBoard from "./components/EventCardBoard";
import LevelCardBoard from "./components/LevelCardBoard";
import LocationCardBoard from "./components/LocationCardBoard";
import IntroductionCard from "./components/IntroductionCard";

const Home = () => {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
    >
      {/*Sección introducción*/}
      <div className="section-intro">
        <SectionTitle
          text="Instituto Nacional de Promoción Social"
          center={true}
        />
        <IntroductionCard text={text} image={colegio} />
      </div>

      <Banner labels={first_labels} />

      {/*Sección ubicaciones*/}
      <div className="section-map">
        <LocationCardBoard locations={locations} />
      </div>

      {/*Seccion niveles academicos*/}
      <div className="section-academic-level">
        <SectionTitle text="Niveles académicos" center={true} />
        <LevelCardBoard levels={levels} />
      </div>

      <Banner labels={second_labels} />

      {/*Seccion eventos*/}
      <div className="section-events">
        <SectionTitle text="Eventos destacados" center={true} />
        <EventCardBoard events={events} />
      </div>
    </section>
  );
};

export default Home;
