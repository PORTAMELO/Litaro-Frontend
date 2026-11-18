import { useLoad } from "@/shared/hooks/useLoad";
import ui from "../styles/Public.module.css";
import styles from "./styles/AboutUs.module.css";
import LoadError from "../components/LoadError";
import PhotoSlot from "../components/PhotoSlot";
import SectionSkeleton from "../components/SectionSkeleton";
import MissionVision from "./components/MissionVision";
import ProfessorCardBoard from "./components/ProfessorCardBoard";
import { getIntroduction, getMission, getProfessors, getVision } from "../services/AboutUsService";

const loadContent = async () => {
  const [introduction, mission, vision, professors] = await Promise.all([
    getIntroduction(),
    getMission(),
    getVision(),
    getProfessors(),
  ]);

  return {
    introduction: introduction[0]?.description ?? "",
    mission: mission[0]?.description ?? "",
    vision: vision[0]?.description ?? "",
    professors,
  };
};

const AboutUs = () => {
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
      <section className={ui.section}>
        <div className={`${ui.wrap} ${styles.intro}`}>
          <div>
            <h1 className={ui.heading}>Nosotros</h1>
            {loading ? <SectionSkeleton variant="lines" /> : <p className={styles.introText}>{data.introduction}</p>}
          </div>
          <PhotoSlot className={styles.gallery} label="Galería del colegio" hint="Se carga desde Contenido Web: varias fotos en carrusel" />
        </div>
      </section>

      <section className={ui.section} aria-labelledby="titulo-mision">
        <div className={ui.wrap}>
          <div className={ui.sectionHead}>
            <h2 id="titulo-mision" className={ui.heading}>
              Misión y visión
            </h2>
          </div>
          {loading ? <SectionSkeleton variant="intro" /> : <MissionVision mission={data.mission} vision={data.vision} />}
        </div>
      </section>

      <section className={ui.section} aria-labelledby="titulo-docentes">
        <div className={ui.wrap}>
          <div className={ui.sectionHead}>
            <h2 id="titulo-docentes" className={ui.heading}>
              Nuestro cuerpo académico
            </h2>
          </div>
          {loading ? <SectionSkeleton variant="cards" /> : <ProfessorCardBoard professors={data.professors} />}
        </div>
      </section>
    </>
  );
};

export default AboutUs;
