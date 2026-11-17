import { NavLink } from "react-router-dom";
import { FaCalendar, FaClipboardList, FaHome } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";

import styles from "../styles/MobileNavigation.module.css";

// Barra inferior del sitio público en pantallas de menos de 1200 px, donde el
// encabezado se oculta. Cada enlace incluye su ícono para que toda el área se pueda tocar.
const links = [
  { to: "/Homepage/Inicio", label: "Inicio", icon: FaHome },
  { to: "/Homepage/Nosotros", label: "Nosotros", icon: FaPeopleGroup },
  { to: "/Homepage/Calendario", label: "Calendario", icon: FaCalendar },
  { to: "/Homepage/Admisiones", label: "Admisiones", icon: FaClipboardList },
  { to: "/Login", label: "Ingresar", icon: MdLogin },
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
