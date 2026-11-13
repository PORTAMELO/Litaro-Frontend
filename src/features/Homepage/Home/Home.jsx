import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import { useLoad } from "../../../shared/hooks/UseLoad";
import Banner from "../components/Banner";
import LoadError from "../components/LoadError";
import SectionSkeleton from "../components/SectionSkeleton";
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

const loadContent = async () => {
  const [introduction, locations, levels, events, statistics, values] =
    await Promise.all([
      getIntroduction(),
      getLocations(),
      getAcademicLevels(),
      getEvents(),
      getStatistics(),
      getValues(),
    ]);

  return {
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
  };
};

const Home = () => {
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
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
      }}
    >
      <div className="section-intro">
        <SectionTitle text="Instituto Nacional de Promoción Social" center />

        {loading ? (
          <SectionSkeleton variant="intro" />
        ) : (
          <IntroductionCard
            text={content.introduction[0]?.description || ""}
            image={colegio}
          />
        )}
      </div>

      {loading ? <SectionSkeleton variant="banner" /> : <Banner labels={content.statistics} />}

      <div className="section-map">
        {loading ? <SectionSkeleton variant="cards" /> : <LocationCardBoard locations={content.locations} />}
      </div>

      <div className="section-academic-level">
        <SectionTitle text="Niveles académicos" center />

        {loading ? <SectionSkeleton variant="cards" /> : <LevelCardBoard levels={content.levels} />}
      </div>

      {loading ? <SectionSkeleton variant="banner" /> : <Banner labels={content.values} />}

      <div className="section-events">
        <SectionTitle text="Eventos destacados" center />

        {loading ? <SectionSkeleton variant="cards" /> : <EventCardBoard events={content.events} />}
      </div>
    </section>
  );
};

export default Home;
