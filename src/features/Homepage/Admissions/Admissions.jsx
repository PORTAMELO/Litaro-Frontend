import { useOutletContext } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

import { useLoad } from "@/shared/hooks/useLoad";
import ui from "../styles/Public.module.css";
import styles from "./styles/Admissions.module.css";
import ContactList from "../components/ContactList";
import LoadError from "../components/LoadError";
import SectionSkeleton from "../components/SectionSkeleton";
import AdmissionGuide from "./components/AdmissionGuide";
import { getIntroduction, getSteps } from "../services/AdmissionsService";

const loadContent = async () => {
  const [introduction, steps] = await Promise.all([getIntroduction(), getSteps()]);

  return { introduction: introduction[0]?.description ?? "", steps };
};

const Admissions = () => {
  const { data, error, loading, reload } = useLoad(loadContent, []);
  // Contacto del pie de página (Homepage lo carga una sola vez para todo el sitio).
  const { information, socials } = useOutletContext();
  const whatsapp = socials.find((social) => social.name.toLowerCase() === "whatsapp")?.url;

  return (
    <section className={ui.section}>
      <div className={`${ui.wrap} ${styles.layout}`}>
        <div>
          <h1 className={ui.heading}>Proceso de admisión</h1>
          {error ? (
            <LoadError onRetry={reload} />
          ) : loading ? (
            <SectionSkeleton variant="lines" />
          ) : (
            <>
              <p className={styles.intro}>{data.introduction}</p>
              <AdmissionGuide steps={data.steps} />
            </>
          )}
        </div>

        <aside className={styles.help} aria-labelledby="titulo-ayuda">
          <h2 id="titulo-ayuda" className={styles.helpTitle}>
            ¿Tienes dudas sobre el proceso?
          </h2>
          <p className={styles.helpText}>La secretaría del colegio te orienta sobre cupos, documentos y fechas.</p>
          <ContactList className={styles.contact} information={information} />
          {whatsapp && (
            <a className={`${ui.button} ${ui.accent} ${styles.whatsapp}`} href={whatsapp} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp aria-hidden="true" />
              Escribir por WhatsApp
            </a>
          )}
        </aside>
      </div>
    </section>
  );
};

export default Admissions;
