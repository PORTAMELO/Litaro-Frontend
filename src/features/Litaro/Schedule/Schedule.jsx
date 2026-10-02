import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuItem, Select, Tab, Tabs, Typography } from "@mui/material";

import styles from "./Schedule.module.css";
import { useAuth } from "../../../shared/hooks/UseAuth";
import { usePermissions } from "../../../shared/hooks/UsePermissions";
import AppNotification from "./components/AppNotification";
import ScheduleEditor from "./components/ScheduleEditor";
import MySchedule from "./components/MySchedule";
import ParentAttentionBoard from "./components/ParentAttentionBoard";
import { AssignmentsTab, AvailabilityTab, ClassroomsTab, SpacesTab, StudyPlanTab } from "./components/CatalogTabs";
import { getAssignments, getClassrooms, getLookupOptions, getSpaces } from "./services/ScheduleService";

const READ_ONLY_ROLES = ["Profesor", "Estudiante", "Acudiente"];

const selectSx = {
  fontFamily: "inherit",
  fontSize: "var(--text-sm)",
  "& .MuiSelect-select": { fontSize: "var(--text-sm)" },
};

const Schedule = () => {
  const { user } = useAuth();
  const { can, ready } = usePermissions();

  const [notification, setNotification] = useState({ open: false, severity: "success", title: "", message: "", details: [] });

  const notify = useCallback(
    ({ severity = "success", title = "", message = "", details = [] }) =>
      setNotification({ open: true, severity, title, message, details }),
    [],
  );

  const notifyError = useCallback(
    (error, fallbackTitle = "Ocurrió un error") =>
      notify({
        severity: "error",
        title: error?.status === 409 ? "Cruce de horario" : error?.status === 403 ? "Sin permiso" : fallbackTitle,
        message: error?.message ?? "Intenta de nuevo.",
      }),
    [notify],
  );

  const isReadOnlyRole = READ_ONLY_ROLES.includes(user?.role);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{isReadOnlyRole ? "Mi horario" : "Horarios"}</h1>
          <p className={styles.subtitle}>
            {isReadOnlyRole
              ? "Consulta el horario semanal vigente."
              : "Arma y ajusta el horario por salón, docente o espacio. Al guardar, el sistema revisa que no haya cruces."}
          </p>
        </div>
      </div>

      {isReadOnlyRole ? (
        <MySchedule role={user?.role} notifyError={notifyError} />
      ) : !ready ? (
        <p className={styles.emptyText}>Cargando permisos...</p>
      ) : can("Schedule", "read") ? (
        <ScheduleAdmin can={can} notify={notify} notifyError={notifyError} />
      ) : (
        <p className={styles.emptyText}>No tienes permisos para consultar el horario. Solicítalos al administrador.</p>
      )}

      <AppNotification {...notification} onClose={() => setNotification((prev) => ({ ...prev, open: false }))} />
    </div>
  );
};

const ScheduleAdmin = ({ can, notify, notifyError }) => {
  const [lookups, setLookups] = useState({ years: [], campuses: [], teachers: [], grades: [], subjects: [] });
  const [classrooms, setClassrooms] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [yearId, setYearId] = useState("");
  const [chosenCampusId, setCampusId] = useState("");
  const [tab, setTab] = useState("schedule");

  const permsOf = useCallback(
    (table) => ({ create: can(table, "create"), update: can(table, "update"), delete: can(table, "delete") }),
    [can],
  );

  const tabs = useMemo(
    () =>
      [
        { value: "schedule", label: "Horario semanal", visible: can("Schedule", "read") },
        { value: "attention", label: "Atención a padres", visible: can("Schedule", "read") },
        { value: "classrooms", label: "Salones", visible: can("Classroom", "update") },
        { value: "assignments", label: "Asignaciones", visible: can("AcademicAssignment", "read") },
        { value: "plan", label: "Horas por materia", visible: can("StudyPlan", "read") },
        { value: "availability", label: "Disponibilidad docente", visible: can("TeacherAvailability", "read") },
        { value: "spaces", label: "Espacios y zonas", visible: can("Space", "read") },
      ].filter((t) => t.visible),
    [can],
  );

  const [classroomsVersion, setClassroomsVersion] = useState(0);
  const [spacesVersion, setSpacesVersion] = useState(0);
  const reloadClassrooms = useCallback(async () => setClassroomsVersion((v) => v + 1), []);
  const reloadSpaces = useCallback(async () => setSpacesVersion((v) => v + 1), []);
  const [assignmentsVersion, setAssignmentsVersion] = useState(0);
  const reloadAssignments = useCallback(async () => setAssignmentsVersion((v) => v + 1), []);

  useEffect(() => {
    Promise.all([
      getLookupOptions("AcademicYear"),
      getLookupOptions("Campus"),
      getLookupOptions("Teacher"),
      getLookupOptions("Grade"),
      getLookupOptions("Subject"),
    ])
      .then(([years, campuses, teachers, grades, subjects]) => {
        setLookups({ years, campuses, teachers, grades, subjects });

        const currentYear = new Date().getFullYear();
        setYearId(years.find((y) => y.id === currentYear)?.id ?? years[0]?.id ?? "");
      })
      .catch((error) => notifyError(error, "No se pudieron cargar los datos del módulo"));
  }, [notifyError]);

  useEffect(() => {
    getClassrooms()
      .catch(() => [])
      .then(setClassrooms);
  }, [classroomsVersion]);

  useEffect(() => {
    getSpaces()
      .catch(() => [])
      .then(setSpaces);
  }, [spacesVersion]);

  useEffect(() => {
    if (!yearId) return;
    getAssignments(yearId).then(setAssignments);
  }, [yearId, assignmentsVersion]);

  const labeledAssignments = useMemo(() => {
    const nameOf = (options, id) => options.find((o) => o.id === id)?.label ?? "—";
    return assignments.map((a) => ({
      ...a,
      label: [
        nameOf(lookups.subjects, a.subjectId),
        classrooms.find((c) => c.classroomId === a.classroomId)?.name ?? "—",
        nameOf(lookups.teachers, a.teacherId),
      ].join(" · "),
    }));
  }, [assignments, classrooms, lookups.subjects, lookups.teachers]);

  const defaultCampus = lookups.campuses.find((c) => classrooms.some((cl) => cl.campusId === c.id)) ?? lookups.campuses[0];
  const campusId = chosenCampusId || defaultCampus?.id || "";

  const activeTab = tabs.some((t) => t.value === tab) ? tab : tabs[0]?.value;
  const showCampus = activeTab !== "plan" && activeTab !== "availability";
  const showYear = activeTab !== "spaces" && activeTab !== "classrooms";

  return (
    <>
      <section className={styles.filtersCard}>
        <Typography className={styles.sectionTitle}>Seleccionar año y sede</Typography>
        <div className={styles.filtersGrid}>
          {showYear && (
            <div className={styles.filter}>
              <label>Año académico</label>
              <Select size="small" value={yearId} onChange={(e) => setYearId(e.target.value)} fullWidth sx={selectSx}>
                {lookups.years.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          {showCampus && (
            <div className={styles.filter}>
              <label>Sede</label>
              <Select size="small" value={campusId} onChange={(e) => setCampusId(e.target.value)} fullWidth sx={selectSx}>
                {lookups.campuses.map((campus) => (
                  <MenuItem key={campus.id} value={campus.id}>
                    {campus.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </div>
      </section>

      <Tabs
        value={activeTab ?? false}
        onChange={(_, value) => setTab(value)}
        variant="scrollable"
        className={styles.tabs}
        sx={{ "& .MuiTab-root": { textTransform: "none", fontFamily: "inherit", fontWeight: "var(--font-semibold)" } }}
      >
        {tabs.map((t) => (
          <Tab key={t.value} value={t.value} label={t.label} />
        ))}
      </Tabs>

      {activeTab === "schedule" && yearId && campusId && (
        <ScheduleEditor
          yearId={yearId}
          campusId={campusId}
          data={{ classrooms, assignments: labeledAssignments, teachers: lookups.teachers, spaces }}
          permissions={permsOf("Schedule")}
          notify={notify}
          notifyError={notifyError}
        />
      )}

      {activeTab === "assignments" && (
        <AssignmentsTab
          yearId={yearId}
          campusId={campusId}
          campuses={lookups.campuses}
          classrooms={classrooms}
          subjects={lookups.subjects}
          teachers={lookups.teachers}
          assignments={assignments}
          permissions={permsOf("AcademicAssignment")}
          onChanged={reloadAssignments}
          notify={notify}
          notifyError={notifyError}
        />
      )}

      {activeTab === "attention" && (
        <ParentAttentionBoard yearId={yearId} campusId={campusId} notifyError={notifyError} />
      )}

      {activeTab === "spaces" && (
        <SpacesTab
          campusId={campusId}
          campuses={lookups.campuses}
          spaces={spaces}
          permissions={permsOf("Space")}
          onChanged={reloadSpaces}
          notify={notify}
          notifyError={notifyError}
        />
      )}

      {activeTab === "plan" && (
        <StudyPlanTab
          yearId={yearId}
          grades={lookups.grades}
          subjects={lookups.subjects}
          permissions={permsOf("StudyPlan")}
          notify={notify}
          notifyError={notifyError}
        />
      )}

      {activeTab === "availability" && (
        <AvailabilityTab
          yearId={yearId}
          teachers={lookups.teachers}
          campuses={lookups.campuses}
          permissions={permsOf("TeacherAvailability")}
          notify={notify}
          notifyError={notifyError}
        />
      )}

      {activeTab === "classrooms" && (
        <ClassroomsTab
          campusId={campusId}
          campuses={lookups.campuses}
          classrooms={classrooms}
          teachers={lookups.teachers}
          permissions={permsOf("Classroom")}
          onChanged={reloadClassrooms}
          notify={notify}
          notifyError={notifyError}
        />
      )}
    </>
  );
};

export default Schedule;
