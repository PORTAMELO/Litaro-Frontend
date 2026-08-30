import styles from "./Administration.module.css";

import {
  FaSchool,
  FaBuilding,
  FaUserGraduate,
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaClipboardCheck,
  FaGraduationCap,
  FaCalendarAlt,
  FaCalendarWeek,
  FaUserFriends,
  FaClipboardList,
  FaClock,
  FaTheaterMasks,
  FaDoorOpen,
  FaLayerGroup,
  FaBookReader,
} from "react-icons/fa";

import AdministracionSection from "./components/AdministracionSection";

const Administration = () => {
  const institutional = [
    {
      title: "Colegio",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaSchool />,
    },
    {
      title: "Sedes",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaBuilding />,
    },
    {
      title: "Años académicos",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Períodos académicos",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaCalendarWeek />,
    },
  ];

  const users = [
    {
      title: "Usuarios",
      records: 17478,
      color: "#72D84B",
      icon: <FaUsers />,
    },
    {
      title: "Estudiantes",
      records: 17478,
      color: "#72D84B",
      icon: <FaUserGraduate />,
    },
    {
      title: "Padres",
      records: 17478,
      color: "#72D84B",
      icon: <FaUserFriends />,
    },
    {
      title: "Profesores",
      records: 17478,
      color: "#72D84B",
      icon: <FaChalkboardTeacher />,
    },
  ];

  const academic = [
    {
      title: "Grados",
      records: 17478,
      color: "#C06AF2",
      icon: <FaLayerGroup />,
    },
    {
      title: "Salones",
      records: 17478,
      color: "#C06AF2",
      icon: <FaDoorOpen />,
    },
    {
      title: "Materias",
      records: 17478,
      color: "#C06AF2",
      icon: <FaBookOpen />,
    },
    {
      title: "Asignaciones",
      records: 17478,
      color: "#C06AF2",
      icon: <FaTheaterMasks />,
    },
    {
      title: "Horarios",
      records: 17478,
      color: "#C06AF2",
      icon: <FaClock />,
    },
    {
      title: "Matrículas",
      records: 17478,
      color: "#C06AF2",
      icon: <FaClipboardList />,
    },
    {
      title: "Notas",
      records: 17478,
      color: "#C06AF2",
      icon: <FaGraduationCap />,
    },
    {
      title: "Asistencia",
      records: 17478,
      color: "#C06AF2",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Observador",
      records: 17478,
      color: "#C06AF2",
      icon: <FaBookReader />,
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Administración</h1>

      <AdministracionSection title="Administración institucional" cards={institutional} />

      <AdministracionSection title="Administración de usuarios" cards={users} />

      <AdministracionSection title="Administración académica" cards={academic} />
    </div>
  );
};

export default Administration;
