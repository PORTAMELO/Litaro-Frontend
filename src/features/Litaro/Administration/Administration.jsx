import { useState } from "react";
import * as service from "./services/AdministrationService";
import AdministracionSection from "./components/AdministracionSection";
import Toast from "@/shared/components/Ui/Toast";
import { useToast } from "@/shared/hooks/useToast";
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
  FaUserShield,
} from "react-icons/fa";
import styles from "./Administration.module.css";
import RecordsTable from "./components/RecordsTable";
import DynamicForm from "./components/DynamicForm";
import RoleForm from "./components/RoleForm";
import PermissionsMatrix from "./components/PermissionsMatrix";
import UserRolesManager from "./components/UserRolesManager";
import { ROLE_FORM_CONFIG } from "./RoleFormConfig";
import { usePermissions } from "@/shared/hooks/usePermissions";

const getRowId = (tableName, row) => {
  if (!tableName) return undefined;
  const field = `${tableName.charAt(0).toLowerCase()}${tableName.slice(1)}Id`;
  return row[field];
};

const Administration = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [records, setRecords] = useState([]);
  const [lookups, setLookups] = useState({});
  const [schema, setSchema] = useState([]);
  const [managerOpen, setManagerOpen] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [lastFilters, setLastFilters] = useState(undefined);
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [roleFormSaving, setRoleFormSaving] = useState(false);
  const [roleFormError, setRoleFormError] = useState(null);
  const [studentOptions, setStudentOptions] = useState([]);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [userRolesOpen, setUserRolesOpen] = useState(false);
  const [userRolesTarget, setUserRolesTarget] = useState(null);

  const { toast, notify, close: closeToast } = useToast();

  const { can, ready } = usePermissions();

  const showError = (error, fallback) => notify(error?.message ?? fallback, "error");

  const handleCreate = async () => {
    if (!can(selectedCard?.tableName, "create")) return;

    if (selectedCard?.role) {
      const roleConfig = ROLE_FORM_CONFIG[selectedCard.role];

      if (roleConfig?.withStudents) {
        try {
          const result = await service.getRecords("/students");
          setStudentOptions(result.records ?? []);
        } catch (error) {
          showError(error, "No fue posible cargar la lista de estudiantes.");
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
    if (card.special === "permissions") {
      setSelectedCard(card);
      setPermissionsOpen(true);
      return;
    }

    setSelectedCard(card);
    setSchema([]);
    setRecords([]);
    setLookups({});
    setRecordsLoading(true);
    setManagerOpen(true);

    try {
      const schemaData = await service.getSchema(card.tableName);
      const hasFilters = schemaData.some((column) => column.filterable);

      setSchema(schemaData);

      if (!hasFilters) {
        const result = await service.getRecords(card.endpoint);
        setRecords(result.records);
        setLookups(result.lookups);
      }
    } catch (error) {
      showError(error, "No fue posible cargar esta sección.");
      setManagerOpen(false);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleEdit = (row) => {
    if (selectedCard?.tableName === "User") {
      setUserRolesTarget(row);
      setUserRolesOpen(true);
    }
  };

  const handleQuery = async (filters) => {
    setRecordsLoading(true);

    try {
      const result = await service.getRecords(selectedCard.endpoint, filters);
      setRecords(result.records);
      setLookups(result.lookups);
      setLastFilters(filters);
    } catch (error) {
      showError(error, "No fue posible consultar los registros.");
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleSchemaChange = async () => {
    if (!selectedCard) return;

    try {
      const schemaData = await service.getSchema(selectedCard.tableName);
      setSchema(schemaData);
    } catch (error) {
      showError(error, "No fue posible actualizar las columnas.");
    }
  };

  const refreshRecords = async () => {
    setRecordsLoading(true);

    try {
      const result = await service.getRecords(selectedCard.endpoint, lastFilters);
      setRecords(result.records);
      setLookups(result.lookups);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      await service.createRecord(selectedCard.endpoint, formData);
      setFormOpen(false);
      await refreshRecords();
    } catch (error) {
      showError(error, "No fue posible crear el registro.");
    }
  };

  const handleRoleSave = async (payload) => {
    const roleConfig = ROLE_FORM_CONFIG[selectedCard.role];

    setRoleFormSaving(true);
    setRoleFormError(null);

    try {
      const result = await service.createRecord(roleConfig.endpoint, payload);
      setRoleFormOpen(false);

      // La contraseña temporal se muestra una sola vez: el aviso no se cierra solo.
      if (result?.temporaryPassword) {
        notify(`Contraseña temporal: ${result.temporaryPassword}`, "success", {
          title: `${roleConfig.roleLabel} guardado correctamente.`,
          persistent: true,
        });
      } else {
        notify(`${roleConfig.roleLabel} guardado correctamente.`, "success");
      }

      await refreshRecords();
    } catch (error) {
      setRoleFormError(error.message ?? "No fue posible crear el registro.");
    } finally {
      setRoleFormSaving(false);
    }
  };

  const handleSetProfileActive = async (row, active) => {
    try {
      const id = getRowId(selectedCard.tableName, row);
      await service.setProfileEstado(selectedCard.endpoint, id, active);

      notify(active ? "Perfil activado correctamente." : "Perfil desactivado correctamente.", "success");

      await refreshRecords();
    } catch (error) {
      showError(error, "No fue posible actualizar el estado del perfil.");
    }
  };

  const handleActivate = (row) => handleSetProfileActive(row, true);
  const handleDeactivate = (row) => handleSetProfileActive(row, false);

  const institutional = [
    {
      title: "Colegio",
      tableName: "School",
      endpoint: "/schools",
      records: 17478,
      icon: <FaSchool />,
    },
    {
      title: "Sedes",
      tableName: "Campus",
      endpoint: "/campus",
      records: 17478,
      icon: <FaBuilding />,
    },
    {
      title: "Años académicos",
      tableName: "AcademicYear",
      endpoint: "/academic-years",
      records: 17478,
      icon: <FaCalendarAlt />,
    },
    {
      title: "Períodos académicos",
      tableName: "AcademicPeriod",
      endpoint: "/academic-periods",
      records: 17478,
      icon: <FaCalendarWeek />,
    },
  ];

  const catalogs = [
    {
      title: "Características",
      tableName: "Characteristic",
      endpoint: "/characteristics",
      records: 17478,
      icon: <FaListUl />,
    },
    {
      title: "Detalles de característica",
      tableName: "CharacteristicDetail",
      endpoint: "/characteristic-details",
      records: 17478,
      icon: <FaTags />,
    },
  ];

  const users = [
    {
      title: "Usuarios",
      tableName: "User",
      endpoint: "/users",
      records: 17478,
      icon: <FaUsers />,
      readOnly: true,
    },
    {
      title: "Estudiantes",
      tableName: "Student",
      endpoint: "/students",
      records: 17478,
      icon: <FaUserGraduate />,
      role: "Student",
    },
    {
      title: "Padres",
      tableName: "Parent",
      endpoint: "/parents",
      records: 17478,
      icon: <FaUserFriends />,
      role: "Parent",
    },
    {
      title: "Profesores",
      tableName: "Teacher",
      endpoint: "/teachers",
      records: 17478,
      icon: <FaChalkboardTeacher />,
      role: "Teacher",
    },
  ];

  const security = [
    {
      title: "Roles",
      tableName: "Role",
      endpoint: "/roles",
      records: 17478,
      icon: <FaUserShield />,
    },
    {
      title: "Permisos por rol",
      tableName: "RolePermission",
      records: 17478,
      icon: <FaUserShield />,
      special: "permissions",
    },
  ];

  const academic = [
    {
      title: "Grados",
      tableName: "Grade",
      endpoint: "/grades",
      records: 17478,
      icon: <FaLayerGroup />,
    },
    {
      title: "Salones",
      tableName: "Classroom",
      endpoint: "/classrooms",
      records: 17478,
      icon: <FaDoorOpen />,
    },
    {
      title: "Materias",
      tableName: "Subject",
      endpoint: "/subjects",
      records: 17478,
      icon: <FaBookOpen />,
    },
    {
      title: "Asignaciones",
      tableName: "AcademicAssignment",
      endpoint: "/academic-assignments",
      records: 17478,
      icon: <FaTheaterMasks />,
    },
    {
      title: "Horarios",
      tableName: "Schedule",
      endpoint: "/schedules",
      records: 17478,
      icon: <FaClock />,
    },
    {
      title: "Matrículas",
      tableName: "Enrollment",
      endpoint: "/enrollments",
      records: 17478,
      icon: <FaClipboardList />,
    },
    {
      title: "Notas",
      tableName: "GradeScore",
      endpoint: "/grade-scores",
      records: 17478,
      icon: <FaGraduationCap />,
    },
    {
      title: "Asistencia",
      tableName: "Attendance",
      endpoint: "/attendances",
      records: 17478,
      icon: <FaClipboardCheck />,
    },
    {
      title: "Observador",
      tableName: "StudentLog",
      endpoint: "/student-logs",
      records: 17478,
      icon: <FaBookReader />,
    },
  ];

  const activeRoleConfig = selectedCard?.role ? ROLE_FORM_CONFIG[selectedCard.role] : null;

  const canRead = (card) => can(card.tableName, "read");
  const institutionalCards = institutional.filter(canRead);
  const catalogCards = catalogs.filter(canRead);
  const userCards = users.filter(canRead);
  const securityCards = security.filter(canRead);
  const academicCards = academic.filter(canRead);
  const noAccess = [
    institutionalCards,
    catalogCards,
    userCards,
    securityCards,
    academicCards,
  ].every((cards) => cards.length === 0);

  return (
    <div className={styles.container}>
      <h1>Administración</h1>

      {ready && noAccess && <p>No tienes permisos para administrar ninguna tabla.</p>}

      {institutionalCards.length > 0 && (
        <AdministracionSection title="Administración institucional" cards={institutionalCards} onManage={handleManage} />
      )}

      {catalogCards.length > 0 && (
        <AdministracionSection title="Catálogos" cards={catalogCards} onManage={handleManage} />
      )}

      {userCards.length > 0 && (
        <AdministracionSection title="Perfiles" cards={userCards} onManage={handleManage} />
      )}

      {securityCards.length > 0 && (
        <AdministracionSection title="Roles" cards={securityCards} onManage={handleManage} />
      )}

      {academicCards.length > 0 && (
        <AdministracionSection title="Administración académica" cards={academicCards} onManage={handleManage} />
      )}

      {selectedCard && (
        <RecordsTable
          open={managerOpen}
          title={selectedCard.title}
          tableName={selectedCard.tableName}
          rows={records}
          loading={recordsLoading}
          schema={schema}
          lookups={lookups}
          roleFields={activeRoleConfig?.fields}
          onQuery={handleQuery}
          onEdit={handleEdit}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
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

      <PermissionsMatrix
        open={permissionsOpen}
        onClose={() => {
          setPermissionsOpen(false);
          setSelectedCard(null);
        }}
        canEdit={can("RolePermission", "update")}
      />

      <UserRolesManager
        open={userRolesOpen}
        user={userRolesTarget}
        onClose={() => {
          setUserRolesOpen(false);
          setUserRolesTarget(null);
        }}
        canEdit={can("User", "update")}
        onSaved={() => notify("Roles actualizados correctamente.", "success")}
      />

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default Administration;