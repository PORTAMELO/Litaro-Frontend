import { Link } from "react-router-dom";
import logo from "@/assets/logoinps.jpg";
import { PATHS } from "@/shared/utils/Paths";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <header className={styles["header"]}>
      <div className={styles["brand"]}>
        <img className={styles["logo-placeholder"]} src={logo} alt="Escudo del INPS" />
        <h1>Instituto Nacional de Promoción Social</h1>
      </div>

      <nav className={styles["nav"]}>
        <Link to={PATHS.home}>Inicio</Link>
        <Link to={PATHS.aboutUs}>Nosotros</Link>
        <Link to={PATHS.calendar}>Calendario</Link>
        <Link to={PATHS.admissions}>Admisiones</Link>
      </nav>

      <nav className={styles["nav"]}>
        <Link
          className={styles["login-button"]}
          to={PATHS.login}
          style={{ padding: "10px" }}
        >
          Iniciar Sesión
        </Link>
      </nav>
    </header>
  );
};

export default Header;
