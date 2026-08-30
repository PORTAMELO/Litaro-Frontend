import { useState } from "react";
import * as service from "./services/AdministrationService";
import AdministracionSection from "./components/AdministracionSection";
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
import styles from "./Administration.module.css";
import RecordsTable from "./components/RecordsTable";
import DynamicForm from "./components/DynamicForm";

const Administration = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [records, setRecords] = useState([]);
  const [schema, setSchema] = useState([]);
  const [managerOpen, setManagerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const handleCreate = () => {
    setFormOpen(true);
    console.log("=== NUEVO REGISTRO ===");
    console.log("Tabla:", selectedCard?.tableName);
    console.log("Schema:", schema);
  };

  const handleManage = async (card) => {
    try {
      console.log("=== ADMINISTRATION ===");
      console.log("Card seleccionada:", card);
      console.log("Endpoint:", card.endpoint);
      console.log("TableName:", card.tableName);

      const [recordsData, schemaData] = await Promise.all([
        service.getRecords(card.endpoint),
        service.getSchema(card.tableName),
      ]);

      console.log("=== RESPUESTA RECORDS ===");
      console.log(recordsData);

      console.log("=== RESPUESTA SCHEMA ===");
      console.log(schemaData);

      setSelectedCard(card);
      setRecords(recordsData);
      setSchema(schemaData);
      setManagerOpen(true);
    } catch (error) {
      console.error("Error cargando la administración:", error);
    }
  };

  const institutional = [
    {
      title: "Colegio",
      tableName: "School",
      endpoint: "/schools",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaSchool />,
    },
    {
      title: "Sedes",
      tableName: "Campus",
      endpoint: "/campus",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaBuilding />,
    },
    {
      title: "Años académicos",
      tableName: "AcademicYear",
      endpoint: "/academic-years",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Períodos académicos",
      tableName: "AcademicPeriod",
      endpoint: "/academic-periods",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaCalendarWeek />,
    },
  ];

  const users = [
    {
      title: "Usuarios",
      tableName: "User",
      endpoint: "/users",
      records: 17478,
      color: "#72D84B",
      icon: <FaUsers />,
    },
    {
      title: "Estudiantes",
      tableName: "Student",
      endpoint: "/students",
      records: 17478,
      color: "#72D84B",
      icon: <FaUserGraduate />,
    },
    {
      title: "Padres",
      tableName: "Parent",
      endpoint: "/parents",
      records: 17478,
      color: "#72D84B",
      icon: <FaUserFriends />,
    },
    {
      title: "Profesores",
      tableName: "Teacher",
      endpoint: "/teachers",
      records: 17478,
      color: "#72D84B",
      icon: <FaChalkboardTeacher />,
    },
  ];

  const academic = [
    {
      title: "Grados",
      tableName: "Grade",
      endpoint: "/grades",
      records: 17478,
      color: "#C06AF2",
      icon: <FaLayerGroup />,
    },
    {
      title: "Salones",
      tableName: "Classroom",
      endpoint: "/classrooms",
      records: 17478,
      color: "#C06AF2",
      icon: <FaDoorOpen />,
    },
    {
      title: "Materias",
      tableName: "Subject",
      endpoint: "/subjects",
      records: 17478,
      color: "#C06AF2",
      icon: <FaBookOpen />,
    },
    {
      title: "Asignaciones",
      tableName: "AcademicAssignment",
      endpoint: "/academic-assignments",
      records: 17478,
      color: "#C06AF2",
      icon: <FaTheaterMasks />,
    },
    {
      title: "Horarios",
      tableName: "Schedule",
      endpoint: "/schedules",
      records: 17478,
      color: "#C06AF2",
      icon: <FaClock />,
    },
    {
      title: "Matrículas",
      tableName: "Enrollment",
      endpoint: "/enrollments",
      records: 17478,
      color: "#C06AF2",
      icon: <FaClipboardList />,
    },
    {
      title: "Notas",
      tableName: "GradeScore",
      endpoint: "/grade-scores",
      records: 17478,
      color: "#C06AF2",
      icon: <FaGraduationCap />,
    },
    {
      title: "Asistencia",
      tableName: "Attendance",
      endpoint: "/attendances",
      records: 17478,
      color: "#C06AF2",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Observador",
      tableName: "StudentLog",
      endpoint: "/student-logs",
      records: 17478,
      color: "#C06AF2",
      icon: <FaBookReader />,
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Administración</h1>

      <AdministracionSection title="Administración institucional" cards={institutional} onManage={handleManage} />

      <AdministracionSection title="Administración de usuarios" cards={users} onManage={handleManage} />

      <AdministracionSection title="Administración académica" cards={academic} onManage={handleManage} />

      {selectedCard && (
        <RecordsTable
          open={managerOpen}
          title={selectedCard.title}
          rows={records}
          schema={schema}
          onClose={() => {
            setManagerOpen(false);
            setSelectedCard(null);
          }}
          onCreate={handleCreate}
        />
      )}

      <DynamicForm
        open={formOpen}
        title={`Nuevo ${selectedCard?.title ?? "registro"}`}
        schema={schema}
        record={null}
        onClose={() => setFormOpen(false)}
      />
    </div>
  );
};

export default Administration;
