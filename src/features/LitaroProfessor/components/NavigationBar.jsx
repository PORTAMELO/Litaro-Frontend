import { HiMiniMegaphone } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import { MdOutlineManageSearch } from "react-icons/md";
import { TbFileReport } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logoinps.jpg";
import styles from "../styles/NavigationBar.module.css";

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
            location.pathname === "/LitaroProfessor/Inicio" ? styles.active : ""
          }
        >
          <MdOutlineManageSearch className={styles["icon"]} />
          <Link to="/LitaroProfessor/Inicio">Administración</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroProfessor/Notas" ? styles.active : ""
          }
        >
          <ImStatsDots className={styles["icon"]} />
          <Link to="/LitaroProfessor/Notas">Estadisticas</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroProfessor/Asistencia"
              ? styles.active
              : ""
          }
        >
          <TbFileReport className={styles["icon"]} />
          <Link to="/LitaroProfessor/Asistencia">Reportes</Link>
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
