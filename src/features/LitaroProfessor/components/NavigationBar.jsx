import { HiMiniMegaphone } from "react-icons/hi2";
import { TbMessageReportFilled } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logoinps.jpg";
import styles from "../styles/NavigationBar.module.css";
import { FaClipboardCheck } from "react-icons/fa";
import { MdGrade } from "react-icons/md";

const NavigationBar = () => {
  const location = useLocation();

  return (
    <nav className={styles["navigation-bar"]}>
      <div className={styles["navigation-header"]}>
        <img src={logo}></img>
        <div className={styles["navigation-header-title"]}>
          <p>Litaro INPS</p>
          <span>Portal Administrador</span>
        </div>
      </div>
      <div className={styles["navigation-options"]}>
        <p
          className={
            location.pathname === "/LitaroProfessor/Notas" ? styles.active : ""
          }
        >
          <MdGrade className={styles["icon"]} />
          <Link to="/LitaroProfessor/Notas">Notas</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroProfessor/Asistencia"
              ? styles.active
              : ""
          }
        >
          <FaClipboardCheck className={styles["icon"]} />
          <Link to="/LitaroProfessor/Asistencia">Asistencia</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroProfessor/Observaciones"
              ? styles.active
              : ""
          }
        >
          <TbMessageReportFilled className={styles["icon"]} />
          <Link to="/LitaroProfessor/Observaciones">Observaciones</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroProfessor/Foro" ? styles.active : ""
          }
        >
          <HiMiniMegaphone className={styles["icon"]} />
          <Link to="/LitaroProfessor/Foro">Comunicaciones</Link>
        </p>
      </div>
      <div className={styles["navigation-profile"]}>
        <img src={logo}></img>
        <div className={styles["navigation-profile-title"]}>
          <p>Administrador</p>
          <span>admin@inps.com</span>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
