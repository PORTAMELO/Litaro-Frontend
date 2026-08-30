import { HiMiniMegaphone } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import { MdForum, MdGrade, MdOutlineManageSearch, MdOutlineSecurity, MdWeb, MdLogout } from "react-icons/md";
import { TbFileReport, TbMessageReportFilled } from "react-icons/tb";
import { FaClipboardCheck } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/logoinps.jpg";
import styles from "./NavigationBar.module.css";
import { useAuth } from "../../../shared/hooks/useAuth";

const navigationItems = {
  administration: {
    label: "Administración",
    path: "/Litaro/Administration",
    icon: MdOutlineManageSearch,
  },

  grades: {
    label: "Notas",
    path: "/Litaro/Grades",
    icon: MdGrade,
  },

  attendance: {
    label: "Asistencia",
    path: "/Litaro/Attendance",
    icon: FaClipboardCheck,
  },

  observations: {
    label: "Observaciones",
    path: "/Litaro/Observations",
    icon: TbMessageReportFilled,
  },

  statistics: {
    label: "Estadísticas",
    path: "/Litaro/Statistics",
    icon: ImStatsDots,
  },

  reports: {
    label: "Reportes",
    path: "/Litaro/Reports",
    icon: TbFileReport,
  },

  communications: {
    label: "Comunicaciones",
    path: "/Litaro/Communications",
    icon: HiMiniMegaphone,
  },

  forum: {
    label: "Foro",
    path: "/Litaro/Forum",
    icon: MdForum,
  },

  security: {
    label: "Seguridad",
    path: "/Litaro/Security",
    icon: MdOutlineSecurity,
  },

  webpage: {
    label: "Contenido Web",
    path: "/Litaro/Webpage",
    icon: MdWeb,
  },
};

const navigationByRole = {
  Administrador: {
    administration: true,
    grades: true,
    attendance: true,
    observations: true,
    statistics: true,
    reports: true,
    communications: true,
    forum: true,
    security: true,
    webpage: true,
  },

  Profesor: {
    administration: false,
    grades: true,
    attendance: true,
    observations: true,
    statistics: false,
    reports: false,
    communications: true,
    forum: true,
    security: false,
    webpage: false,
  },

  Estudiante: {
    administration: false,
    grades: true,
    attendance: true,
    observations: true,
    statistics: false,
    reports: true,
    communications: true,
    forum: true,
    security: false,
    webpage: false,
  },

  Padre: {
    administration: false,
    grades: true,
    attendance: true,
    observations: true,
    statistics: false,
    reports: true,
    communications: true,
    forum: true,
    security: false,
    webpage: false,
  },
};

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const roleConfig = navigationByRole[user?.role] ?? {};
  const options = Object.entries(roleConfig)
    .filter(([, enabled]) => enabled)
    .map(([key]) => navigationItems[key]);

  return (
    <nav className={styles["navigation-bar"]}>
      {/*Header*/}
      <div className={styles["navigation-header"]}>
        <img src={logo}></img>
        <div className={styles["navigation-header-title"]}>
          <p>Litaro INPS</p>
          <span>Portal {user?.role}</span>
        </div>
      </div>

      {/*Options*/}
      <div className={styles["navigation-options"]}>
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <NavLink key={option.path} to={option.path} className={({ isActive }) => (isActive ? styles.active : "")}>
              <Icon className={styles.icon}></Icon>
              <span>{option.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/*Profile*/}
      <div className={styles["navigation-profile"]}>
        <img src={logo}></img>
        <div className={styles["navigation-profile-title"]}>
          <p>{user?.firstName || user?.lastName ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() : "Usuario"}</p>
          <span>{user?.email ?? "Sin email registrado"}</span>
        </div>
        <button type="button" onClick={logout} className={styles["navigation-logout-button"]} title="Cerrar sesión">
          <MdLogout className={styles.icon} />
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
