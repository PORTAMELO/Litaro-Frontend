import { Link } from "react-router-dom";

import styles from "./StatusPage.module.css";
import { PATHS } from "@/shared/utils/Paths";

// Pantalla de estado: "sin permiso" y "página no encontrada".
// `fullScreen` la centra en toda la ventana; sin él ocupa el área de contenido del portal.
const StatusPage = ({ title, text, actionLabel, actionTo, fullScreen = false }) => (
  <section className={fullScreen ? `${styles.page} ${styles.fullScreen}` : styles.page}>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.text}>{text}</p>
    <Link className={styles.action} to={actionTo} replace>
      {actionLabel}
    </Link>
  </section>
);

export const Unauthorized = (props) => (
  <StatusPage
    title="No tienes acceso a esta sección"
    text="Tu perfil no tiene permiso para verla. Si lo necesitas, pídelo al administrador del colegio."
    actionLabel="Volver al inicio"
    actionTo={PATHS.portal}
    {...props}
  />
);

export const NotFound = (props) => (
  <StatusPage
    title="Esta página no existe"
    text="Revisa la dirección o vuelve al inicio."
    actionLabel="Volver al inicio"
    actionTo={PATHS.home}
    {...props}
  />
);

export default StatusPage;
