import { NavLink } from "react-router-dom";
import { FaCalendar, FaClipboardList, FaHome } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";

import styles from "../styles/MobileNavigation.module.css";
import { PATHS } from "@/shared/utils/Paths";

// Barra inferior del sitio público en pantallas de menos de 900 px, donde el
// encabezado se oculta. Cada enlace incluye su ícono para que toda el área se pueda tocar.
const links = [
  { to: PATHS.home, label: "Inicio", icon: FaHome },
  { to: PATHS.aboutUs, label: "Nosotros", icon: FaPeopleGroup },
  { to: PATHS.calendar, label: "Calendario", icon: FaCalendar },
  { to: PATHS.admissions, label: "Admisiones", icon: FaClipboardList },
  { to: PATHS.login, label: "Ingresar", icon: MdLogin },
];

const MobileNavigation = () => (
  <nav className={styles["mobile-navigation"]} aria-label="Navegación del sitio">
    {links.map(({ to, label, icon: Icon }) => (
      <NavLink key={to} to={to} className={({ isActive }) => (isActive ? styles.active : undefined)}>
        <Icon className={styles.icon} aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default MobileNavigation;
