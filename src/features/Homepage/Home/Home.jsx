import { Link } from "react-router-dom";

import colegio from "@/assets/colegio.jpeg";
import { useLoad } from "@/shared/hooks/useLoad";
import { PATHS } from "@/shared/utils/Paths";
import ui from "../styles/Public.module.css";
import styles from "./styles/Home.module.css";
import LoadError from "../components/LoadError";
import SectionSkeleton from "../components/SectionSkeleton";
import EventCardBoard from "./components/EventCardBoard";
import LevelCardBoard from "./components/LevelCardBoard";
import LocationCardBoard from "./components/LocationCardBoard";
import {
  getAcademicLevels,
  getEvents,
  getIntroduction,
  getLocations,
  getStatistics,
  getValues,
} from "../services/HomeService.js";

const loadContent = async () => {
  const [introduction, locations, levels, events, statistics, values] = await Promise.all([
    getIntroduction(),
    getLocations(),
    getAcademicLevels(),
    getEvents(),
    getStatistics(),
    getValues(),
  ]);

  return { introduction: introduction[0]?.description ?? "", locations, levels, events, statistics, values };
};

const Section = ({ id, title, hint, action, children }) => (
  <section className={ui.section} aria-labelledby={id}>
    <div className={ui.wrap}>
      <div className={ui.sectionHead}>
        <div>
          <h2 id={id} className={ui.heading}>
            {title}
          </h2>
          {hint && <p className={ui.hint}>{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  </section>
);

const Home = () => {
  const { data, error, loading, reload } = useLoad(loadContent, []);

  if (error) {
    return (
      <section className={ui.section}>
        <div className={ui.wrap}>
          <LoadError onRetry={reload} />
        </div>
      </section>
    );
  }

  return (
    <>
      <div className={styles.hero}>
        <div className={`${ui.wrap} ${styles.heroGrid}`}>
          <div>
            <h1 className={styles.title}>Instituto Nacional de Promoción Social</h1>
            <p className={styles.place}>Villeta de San Miguel, Cundinamarca</p>
            {loading ? <SectionSkeleton variant="lines" /> : <p className={styles.lead}>{data.introduction}</p>}
            <div className={styles.actions}>
              <Link className={`${ui.button} ${ui.accent}`} to={PATHS.admissions}>
                Proceso de admisión
              </Link>
              <Link className={`${ui.button} ${ui.tertiary}`} to={PATHS.aboutUs}>
                Conoce el colegio
              </Link>
            </div>
          </div>
          <img className={styles.heroImage} src={colegio} alt="Fachada de la sede principal del colegio" />
        </div>

        <div className={ui.wrap}>
          {loading ? (
            <SectionSkeleton variant="banner" />
          ) : (
            data.statistics.length > 0 && (
              <dl className={styles.facts}>
                {data.statistics.map((fact, index) => (
                  <div key={`${index}-${fact.subtitle}`} className={styles.fact}>
                    <dt className={styles.factLabel}>{fact.subtitle}</dt>
                    <dd className={styles.factValue}>{fact.title}</dd>
                  </div>
                ))}
              </dl>
            )
          )}
        </div>
      </div>

      <Section id="titulo-sedes" title="Nuestras sedes" hint="Usa las flechas para recorrer las sedes.">
        {loading ? <SectionSkeleton variant="cards" /> : <LocationCardBoard locations={data.locations} />}
      </Section>

      <Section id="titulo-niveles" title="Niveles académicos">
        {loading ? <SectionSkeleton variant="cards" /> : <LevelCardBoard levels={data.levels} />}
      </Section>

      <Section id="titulo-valores" title="Nuestros valores">
        {loading ? (
          <SectionSkeleton variant="banner" />
        ) : (
          <ul className={styles.values}>
            {data.values.map((value, index) => (
              <li key={`${index}-${value.title}`} className={styles.value}>
                {value.title}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        id="titulo-eventos"
        title="Eventos destacados"
        hint="Actividades que ya realizó la institución."
        action={
          <Link className={`${ui.button} ${ui.tertiary}`} to={PATHS.calendar}>
            Ver calendario
          </Link>
        }
      >
        {loading ? <SectionSkeleton variant="cards" /> : <EventCardBoard events={data.events} />}
      </Section>
    </>
  );
};

export default Home;
