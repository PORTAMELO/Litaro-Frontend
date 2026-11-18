import { Link, NavLink } from "react-router-dom";

import logo from "@/assets/logoinps.jpg";
import { PATHS } from "@/shared/utils/Paths";
import ui from "../styles/Public.module.css";
import styles from "../styles/Header.module.css";

const SITE_LINKS = [
  { to: PATHS.home, label: "Inicio" },
  { to: PATHS.aboutUs, label: "Nosotros" },
  { to: PATHS.calendar, label: "Calendario" },
  { to: PATHS.admissions, label: "Admisiones" },
];

// Encabezado fijo del sitio público. Por debajo de 900 px los enlaces pasan a la
// barra inferior (MobileNavigation) y por debajo de 600 px se oculta "Iniciar sesión".
const Header = () => (
  <header className={styles.header}>
    <div className={`${ui.wrap} ${styles.bar}`}>
      <Link className={styles.brand} to={PATHS.home}>
        <img className={styles.logo} src={logo} alt="" />
        <span className={styles.name}>Instituto Nacional de Promoción Social</span>
      </Link>

      <nav className={styles.nav} aria-label="Sitio">
        {SITE_LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            {label}
          </NavLink>
        ))}
      </nav>

      <Link className={`${ui.button} ${ui.accent} ${styles.login}`} to={PATHS.login}>
        Iniciar sesión
      </Link>
    </div>
  </header>
);

export default Header;
