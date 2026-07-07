import { useEffect, useState } from "react";
import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import Banner from "../components/Banner";
import EventCardBoard from "./components/EventCardBoard";
import LevelCardBoard from "./components/LevelCardBoard";
import LocationCardBoard from "./components/LocationCardBoard";
import IntroductionCard from "./components/IntroductionCard";

import {
  getIntroduction,
  getLocations,
  getAcademicLevels,
  getEvents,
  getStatistics,
  getValues,
} from "../services/HomeService.js";

const images = {
  colegio,
};

const initialState = {
  introduction: [],
  locations: [],
  levels: [],
  events: [],
  statistics: [],
  values: [],
};

const Home = () => {
  const [content, setContent] = useState(initialState);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [introduction, locations, levels, events, statistics, values] =
          await Promise.all([
            getIntroduction(),
            getLocations(),
            getAcademicLevels(),
            getEvents(),
            getStatistics(),
            getValues(),
          ]);

        setContent({
          introduction,

          locations: locations.map((item) => ({
            ...item,
            image: images[item.image],
          })),

          levels: levels.map((item) => ({
            ...item,
            image: images[item.image],
          })),

          events: events.map((item) => ({
            ...item,
            image: images[item.image],
          })),

          statistics,
          values,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadContent();
  }, []);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
      }}
    >
      <div className="section-intro">
        <SectionTitle text="Instituto Nacional de Promoción Social" center />

        <IntroductionCard
          text={content.introduction[0]?.description || ""}
          image={colegio}
        />
      </div>

      <Banner labels={content.statistics} />

      <div className="section-map">
        <LocationCardBoard locations={content.locations} />
      </div>

      <div className="section-academic-level">
        <SectionTitle text="Niveles académicos" center />

        <LevelCardBoard levels={content.levels} />
      </div>

      <Banner labels={content.values} />

      <div className="section-events">
        <SectionTitle text="Eventos destacados" center />

        <EventCardBoard events={content.events} />
      </div>
    </section>
  );
};

export default Home;
