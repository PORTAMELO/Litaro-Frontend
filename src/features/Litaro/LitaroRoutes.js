import { lazy } from "react";
import { HiMiniMegaphone } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import {
  MdForum,
  MdGrade,
  MdHowToReg,
  MdManageHistory,
  MdNotifications,
  MdOutlineManageSearch,
  MdOutlineSecurity,
  MdSchedule,
  MdWeb,
} from "react-icons/md";
import { TbFileReport, TbMessageReportFilled } from "react-icons/tb";
import { FaClipboardCheck } from "react-icons/fa";

import { PATHS } from "@/shared/utils/Paths";

export const LITARO_BASE = PATHS.portal;
export const LITARO_HOME = "Inicio";

export const HomePage = lazy(() => import("./Home/Home"));

// Única lista de módulos: de aquí salen las rutas (App.jsx) y el menú (NavigationBar).
// `keys` son las claves de permiso que dan acceso; basta con tener una.
// `legacyPath` es la ruta anterior en inglés, que redirige a la nueva.
export const litaroModules = [
  {
    path: "Administracion",
    legacyPath: "Administration",
    label: "Administración",
    icon: MdOutlineManageSearch,
    keys: ["AdministrationModule"],
    component: lazy(() => import("./Administration/Administration")),
  },
  {
    path: "Matricula",
    legacyPath: "Enrollment",
    label: "Matrícula",
    icon: MdHowToReg,
    keys: ["EnrollmentProcess", "AdmissionDecision", "StudentMovement"],
    component: lazy(() => import("./Enrollment/Enrollment")),
  },
  {
    path: "Notas",
    legacyPath: "Grades",
    label: "Notas",
    icon: MdGrade,
    keys: ["GradesModule", "GradeBook", "StudyPlanner", "StudyPlannerPanel", "GradeSettings", "YearClosing"],
    component: lazy(() => import("./Grades/Grades")),
  },
  {
    path: "Horarios",
    legacyPath: "Schedule",
    label: "Horarios",
    icon: MdSchedule,
    keys: ["Schedule", "MySchedule"],
    component: lazy(() => import("./Schedule/Schedule")),
  },
  {
    path: "Asistencia",
    legacyPath: "Attendance",
    label: "Asistencia",
    icon: FaClipboardCheck,
    keys: ["AttendanceRoll", "AttendanceSummary", "LateArrival", "AttendanceExcuse", "AttendanceSettings"],
    component: lazy(() => import("./Attendance/Attendance")),
  },
  {
    path: "Observaciones",
    legacyPath: "Observations",
    label: "Observaciones",
    icon: TbMessageReportFilled,
    keys: ["ObservationsModule"],
    component: lazy(() => import("./Observations/Observations")),
  },
  {
    path: "Notificaciones",
    legacyPath: "Notifications",
    label: "Notificaciones",
    icon: MdNotifications,
    keys: ["Notification", "NotificationSettings"],
    counted: true,
    component: lazy(() => import("./Notifications/Notifications")),
  },
  {
    path: "Estadisticas",
    legacyPath: "Statistics",
    label: "Estadísticas",
    icon: ImStatsDots,
    keys: ["StatisticsModule"],
    component: lazy(() => import("./Statistics/Statistics")),
  },
  {
    path: "Reportes",
    legacyPath: "Reports",
    label: "Reportes",
    icon: TbFileReport,
    keys: ["ReportsModule"],
    component: lazy(() => import("./Reports/Reports")),
  },
  {
    path: "Comunicaciones",
    legacyPath: "Communications",
    label: "Comunicaciones",
    icon: HiMiniMegaphone,
    keys: ["CommunicationsModule"],
    component: lazy(() => import("./Communications/Communications")),
  },
  {
    path: "Foro",
    legacyPath: "Forum",
    label: "Foro",
    icon: MdForum,
    keys: ["ForumModule"],
    component: lazy(() => import("./Forum/Forum")),
  },
  {
    path: "Seguridad",
    legacyPath: "Security",
    label: "Seguridad",
    icon: MdOutlineSecurity,
    keys: ["SecurityModule"],
    component: lazy(() => import("./Security/Security")),
  },
  {
    path: "Auditoria",
    legacyPath: "Audit",
    label: "Auditoría",
    icon: MdManageHistory,
    keys: ["AuditModule"],
    component: lazy(() => import("./Audit/Audit")),
  },
  {
    path: "ContenidoWeb",
    legacyPath: "Webpage",
    label: "Contenido Web",
    icon: MdWeb,
    keys: ["WebpageModule"],
    component: lazy(() => import("./Webpage/Webpage")),
  },
];

export const modulePath = (module) => `${LITARO_BASE}/${module.path}`;
