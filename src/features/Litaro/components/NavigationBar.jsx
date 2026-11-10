import { HiMiniMegaphone } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import {
  MdForum,
  MdGrade,
  MdOutlineManageSearch,
  MdOutlineSecurity,
  MdWeb,
  MdLogout,
  MdSchedule,
  MdHowToReg,
} from "react-icons/md";
import { TbFileReport, TbMessageReportFilled } from "react-icons/tb";
import { FaClipboardCheck } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/logoinps.jpg";
import styles from "./NavigationBar.module.css";
import { useAuth } from "../../../shared/hooks/UseAuth";
import { usePermissions } from "../../../shared/hooks/UsePermissions";
import { getRoleOptions, roleLabel } from "../../../shared/utils/ProfileOptions";

const navigationItems = {
  administration: {
    label: "Administración",
    path: "/Litaro/Administration",
    icon: MdOutlineManageSearch,
    keys: ["AdministrationModule"],
  },

  enrollment: {
    label: "Matrícula",
    path: "/Litaro/Enrollment",
    icon: MdHowToReg,
    keys: ["EnrollmentProcess", "AdmissionDecision"],
  },

  grades: {
    label: "Notas",
    path: "/Litaro/Grades",
    icon: MdGrade,
    keys: ["GradesModule"],
  },

  schedule: {
    label: "Horarios",
    path: "/Litaro/Schedule",
    icon: MdSchedule,
    keys: ["Schedule", "MySchedule"],
  },

  attendance: {
    label: "Asistencia",
    path: "/Litaro/Attendance",
    icon: FaClipboardCheck,
    keys: ["AttendanceRoll", "AttendanceSummary", "LateArrival", "AttendanceExcuse", "AttendanceSettings"],
  },

  observations: {
    label: "Observaciones",
    path: "/Litaro/Observations",
    icon: TbMessageReportFilled,
    keys: ["ObservationsModule"],
  },

  statistics: {
    label: "Estadísticas",
    path: "/Litaro/Statistics",
    icon: ImStatsDots,
    keys: ["StatisticsModule"],
  },

  reports: {
    label: "Reportes",
    path: "/Litaro/Reports",
    icon: TbFileReport,
    keys: ["ReportsModule"],
  },

  communications: {
    label: "Comunicaciones",
    path: "/Litaro/Communications",
    icon: HiMiniMegaphone,
    keys: ["CommunicationsModule"],
  },

  forum: {
    label: "Foro",
    path: "/Litaro/Forum",
    icon: MdForum,
    keys: ["ForumModule"],
  },

  security: {
    label: "Seguridad",
    path: "/Litaro/Security",
    icon: MdOutlineSecurity,
    keys: ["SecurityModule"],
  },

  webpage: {
    label: "Contenido Web",
    path: "/Litaro/Webpage",
    icon: MdWeb,
    keys: ["WebpageModule"],
  },
};

const NavigationBar = () => {
  const { user, logout, clearChosenRole } = useAuth();
  const navigate = useNavigate();
  const { sees } = usePermissions();

  const options = Object.values(navigationItems).filter((item) => sees(item.keys));

  const canSwitchProfile = getRoleOptions(user).length > 1;

  const handleSwitchProfile = () => {
    clearChosenRole();
    navigate("/SeleccionarPerfil");
  };

  return (
    <nav className={styles["navigation-bar"]}>
      {/*Header*/}
      <div className={styles["navigation-header"]}>
        <img src={logo}></img>
        <div className={styles["navigation-header-title"]}>
          <p>Litaro INPS</p>
          <span>Portal {roleLabel(user?.role)}</span>
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

        {canSwitchProfile && (
          <button
            type="button"
            onClick={handleSwitchProfile}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              font: "inherit",
              color: "inherit",
              padding: "0.5rem 0",
              textAlign: "left",
            }}
          >
            <MdSwapHoriz className={styles.icon} />
            <span>Cambiar de vista</span>
          </button>
        )}
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