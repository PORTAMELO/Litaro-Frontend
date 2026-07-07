import { HiMiniMegaphone } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import {
  MdForum,
  MdOutlineManageSearch,
  MdOutlineSecurity,
  MdWeb,
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
            location.pathname === "/Litaro/Administracion" ? styles.active : ""
          }
        >
          <MdOutlineManageSearch className={styles["icon"]} />
          <Link to="/Litaro/Administracion">Administración</Link>
        </p>
        <p
          className={
            location.pathname === "/Litaro/Estadisticas" ? styles.active : ""
          }
        >
          <ImStatsDots className={styles["icon"]} />
          <Link to="/Litaro/Estadisticas">Estadisticas</Link>
        </p>
        <p
          className={
            location.pathname === "/Litaro/Reportes" ? styles.active : ""
          }
        >
          <TbFileReport className={styles["icon"]} />
          <Link to="/Litaro/Reportes">Reportes</Link>
        </p>
        <p
          className={
            location.pathname === "/Litaro/Comunicaciones" ? styles.active : ""
          }
        >
          <HiMiniMegaphone className={styles["icon"]} />
          <Link to="/Litaro/Comunicaciones">Comunicaciones</Link>
        </p>
        <p
          className={location.pathname === "/Litaro/Foro" ? styles.active : ""}
        >
          <MdForum className={styles["icon"]} />
          <Link to="/Litaro/Foro">Foro</Link>
        </p>
        <p
          className={
            location.pathname === "/Litaro/Seguridad" ? styles.active : ""
          }
        >
          <MdOutlineSecurity className={styles["icon"]} />
          <Link to="/Litaro/Seguridad">Seguridad</Link>
        </p>
        <p
          className={
            location.pathname === "/Litaro/PaginaWeb" ? styles.active : ""
          }
        >
          <MdWeb className={styles["icon"]} />
          <Link to="/Litaro/PaginaWeb">Página web</Link>
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
