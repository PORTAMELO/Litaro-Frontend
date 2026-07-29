import { HiMiniMegaphone } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import {
  MdOutlineManageSearch,
} from "react-icons/md";
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
            location.pathname === "/LitaroStudent/Inicio" ? styles.active : ""
          }
        >
          <MdOutlineManageSearch className={styles["icon"]} />
          <Link to="/LitaroStudent/Inicio">Inicio</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroStudent/Notas" ? styles.active : ""
          }
        >
          <ImStatsDots className={styles["icon"]} />
          <Link to="/LitaroStudent/Notas">Notas</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroStudent/Asistencia" ? styles.active : ""
          }
        >
          <TbFileReport className={styles["icon"]} />
          <Link to="/LitaroStudent/Asistencia">Asistencia</Link>
        </p>
        <p
          className={
            location.pathname === "/LitaroStudent/Foro" ? styles.active : ""
          }
        >
          <HiMiniMegaphone className={styles["icon"]} />
          <Link to="/LitaroStudent/Foro">Foro</Link>
        </p> 
      </div>
      <div className={styles["navigation-profile"]}>
        <img src={logo}></img>
        <div className={styles["navigation-profile-title"]}>
          <p>Estudiante</p>
          <span>student@inps.com</span>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
