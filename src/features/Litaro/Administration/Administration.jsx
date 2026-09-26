import { useState } from "react";
import * as service from "./services/AdministrationService";
import AdministracionSection from "./components/AdministracionSection";
import { Snackbar, Alert } from "@mui/material";
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
  FaListUl,
  FaTags,
} from "react-icons/fa";
import styles from "./Administration.module.css";
import RecordsTable from "./components/RecordsTable";
import DynamicForm from "./components/DynamicForm";
import RoleForm from "./components/RoleForm";
import { ROLE_FORM_CONFIG } from "./roleFormConfig";

const Administration = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [records, setRecords] = useState([]);
  const [lookups, setLookups] = useState({});
  const [schema, setSchema] = useState([]);
  const [managerOpen, setManagerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [lastFilters, setLastFilters] = useState(undefined);
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [roleFormSaving, setRoleFormSaving] = useState(false);
  const [roleFormError, setRoleFormError] = useState(null);
  const [studentOptions, setStudentOptions] = useState([]);

  const [feedback, setFeedback] = useState(null);

  const handleCreate = async () => {
    if (selectedCard?.role) {
      const roleConfig = ROLE_FORM_CONFIG[selectedCard.role];

      if (roleConfig?.withStudents) {
        try {
          const result = await service.getRecords("/students");
          setStudentOptions(result.records ?? []);
        } catch (error) {
          console.error("Error cargando estudiantes:", error);
          setStudentOptions([]);
        }
      }

      setRoleFormError(null);
      setRoleFormOpen(true);
      return;
    }

    setFormOpen(true);
  };

  const handleManage = async (card) => {
    try {
      const schemaData = await service.getSchema(card.tableName);
      const hasFilters = schemaData.some((column) => column.filterable);

      setSelectedCard(card);
      setSchema(schemaData);

      if (hasFilters) {
        setRecords([]);
        setLookups({});
      } else {
        const result = await service.getRecords(card.endpoint);
        setRecords(result.records);
        setLookups(result.lookups);
      }

      setManagerOpen(true);
    } catch (error) {
      console.error("Error cargando la administración:", error);
    }
  };

  const handleQuery = async (filters) => {
    try {
      const result = await service.getRecords(selectedCard.endpoint, filters);
      setRecords(result.records);
      setLookups(result.lookups);
      setLastFilters(filters);
    } catch (error) {
      console.error("Error consultando registros:", error);
    }
  };

  const handleSchemaChange = async () => {
    if (!selectedCard) return;

    try {
      const schemaData = await service.getSchema(selectedCard.tableName);
      setSchema(schemaData);
    } catch (error) {
      console.error("Error actualizando el schema:", error);
    }
  };

  const refreshRecords = async () => {
    const result = await service.getRecords(selectedCard.endpoint, lastFilters);
    setRecords(result.records);
    setLookups(result.lookups);
  };

  const handleSave = async (formData) => {
    try {
      await service.createRecord(selectedCard.endpoint, formData);
      setFormOpen(false);
      await refreshRecords();
    } catch (error) {
      console.error("Error creando el registro:", error);
    }
  };

  const handleRoleSave = async (payload) => {
    const roleConfig = ROLE_FORM_CONFIG[selectedCard.role];

    setRoleFormSaving(true);
    setRoleFormError(null);

    try {
      const result = await service.createRecord(roleConfig.endpoint, payload);
      setRoleFormOpen(false);

      setFeedback({
        severity: "success",
        message: result?.temporaryPassword
          ? `${roleConfig.roleLabel} creado correctamente. Contraseña temporal: ${result.temporaryPassword}`
          : `${roleConfig.roleLabel} creado correctamente.`,
      });

      await refreshRecords();
    } catch (error) {
      setRoleFormError(error.message ?? "No fue posible crear el registro.");
    } finally {
      setRoleFormSaving(false);
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

  const catalogs = [
    {
      title: "Características",
      tableName: "Characteristic",
      endpoint: "/characteristics",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaListUl />,
    },
    {
      title: "Detalles de característica",
      tableName: "CharacteristicDetail",
      endpoint: "/characteristic-details",
      records: 17478,
      color: "#0F4DB8",
      icon: <FaTags />,
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
      readOnly: true,
    },
    {
      title: "Estudiantes",
      tableName: "Student",
      endpoint: "/students",
      records: 17478,
      color: "#72D84B",
      icon: <FaUserGraduate />,
      role: "Student",
    },
    {
      title: "Padres",
      tableName: "Parent",
      endpoint: "/parents",
      records: 17478,
      color: "#72D84B",
      icon: <FaUserFriends />,
      role: "Parent",
    },
    {
      title: "Profesores",
      tableName: "Teacher",
      endpoint: "/teachers",
      records: 17478,
      color: "#72D84B",
      icon: <FaChalkboardTeacher />,
      role: "Teacher",
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

  const activeRoleConfig = selectedCard?.role ? ROLE_FORM_CONFIG[selectedCard.role] : null;

  return (
    <div className={styles.container}>
      <h1>Administración</h1>

      <AdministracionSection title="Administración institucional" cards={institutional} onManage={handleManage} />

      <AdministracionSection title="Catálogos" cards={catalogs} onManage={handleManage} />

      <AdministracionSection title="Administración de usuarios" cards={users} onManage={handleManage} />

      <AdministracionSection title="Administración académica" cards={academic} onManage={handleManage} />

      {selectedCard && (
        <RecordsTable
          open={managerOpen}
          title={selectedCard.title}
          tableName={selectedCard.tableName}
          rows={records}
          schema={schema}
          lookups={lookups}
          roleFields={activeRoleConfig?.fields}
          onQuery={handleQuery}
          onSchemaChange={handleSchemaChange}
          onClose={() => {
            setManagerOpen(false);
            setSelectedCard(null);
          }}
          onCreate={handleCreate}
          hideCreate={selectedCard.readOnly}
        />
      )}

      {!activeRoleConfig && (
        <DynamicForm
          open={formOpen}
          title={`Nuevo ${selectedCard?.title ?? "registro"}`}
          schema={schema}
          record={null}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {activeRoleConfig && (
        <RoleForm
          open={roleFormOpen}
          title={`Nuevo ${activeRoleConfig.roleLabel}`}
          fields={activeRoleConfig.fields}
          roleTableName={selectedCard.tableName}
          students={activeRoleConfig.withStudents ? studentOptions : null}
          saving={roleFormSaving}
          error={roleFormError}
          onClose={() => setRoleFormOpen(false)}
          onSave={handleRoleSave}
        />
      )}

      <Snackbar
        open={!!feedback}
        autoHideDuration={10000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {feedback && (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ width: "100%" }}>
            {feedback.message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default Administration;