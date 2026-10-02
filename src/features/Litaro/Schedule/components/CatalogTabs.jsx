import { useEffect, useState } from "react";

import CatalogSection from "./CatalogSection";
import { WEEKDAYS, dayLabel, shortTime } from "../utils/ScheduleUtils";
import {
  changeAssignmentTeacher,
  createAssignment,
  deactivateSpace,
  deleteAvailability,
  deleteStudyPlan,
  getAvailabilities,
  getStudyPlans,
  saveAvailability,
  saveClassroomSettings,
  saveSpace,
  saveStudyPlan,
} from "../services/ScheduleService";

const labelOf = (options, id) => options.find((option) => option.id === id)?.label ?? "—";
const nullable = (value) => (value === "" || value === null || value === undefined ? null : Number(value));

export const AssignmentsTab = ({
  yearId,
  campusId,
  campuses,
  classrooms,
  subjects,
  teachers,
  assignments,
  permissions,
  onChanged,
  notify,
  notifyError,
}) => {
  const campusClassrooms = classrooms
    .filter((c) => c.campusId === campusId)
    .map((c) => ({ id: c.classroomId, label: c.name }))
    .sort((a, b) => a.label.localeCompare(b.label, "es", { numeric: true }));
  const campusIds = new Set(campusClassrooms.map((c) => c.id));

  const rows = assignments
    .filter((a) => campusIds.has(a.classroomId))
    .sort(
      (a, b) =>
        labelOf(campusClassrooms, a.classroomId).localeCompare(labelOf(campusClassrooms, b.classroomId), "es", { numeric: true }) ||
        labelOf(subjects, a.subjectId).localeCompare(labelOf(subjects, b.subjectId)),
    );

  return (
    <CatalogSection
      title="Asignaciones"
      subtitle={`Qué docente dicta cada materia en los salones de ${labelOf(campuses, campusId)} en ${yearId}.`}
      info="Antes de armar el horario, cada salón necesita sus materias con su docente. Si un docente se retira o llega uno nuevo, usa “Cambiar docente”: sus clases pasan al nuevo docente sin volver a crearlas (el sistema revisa que no tenga cruces)."
      columns={[
        { label: "Salón", render: (a) => labelOf(campusClassrooms, a.classroomId) },
        { label: "Materia", render: (a) => labelOf(subjects, a.subjectId) },
        { label: "Docente", render: (a) => labelOf(teachers, a.teacherId) },
      ]}
      rows={rows}
      rowKey={(a) => a.assignmentId}
      fields={[
        { name: "classroomId", label: "Salón", type: "select", required: true, options: campusClassrooms, createOnly: true },
        { name: "subjectId", label: "Materia", type: "select", required: true, options: subjects, createOnly: true },
        { name: "teacherId", label: "Docente", type: "select", required: true, options: teachers },
      ]}
      emptyForm={{ classroomId: "", subjectId: "", teacherId: "" }}
      toForm={(a) => ({ classroomId: a.classroomId, subjectId: a.subjectId, teacherId: a.teacherId })}
      addLabel="Asignar materia"
      editLabel="Cambiar docente"
      emptyText="Aún no hay materias asignadas en esta sede para el año."
      permissions={{ create: permissions.create, update: permissions.update, delete: false }}
      onSave={async (row, form) => {
        if (row) await changeAssignmentTeacher(row.assignmentId, Number(form.teacherId));
        else
          await createAssignment({
            yearId,
            classroomId: Number(form.classroomId),
            subjectId: Number(form.subjectId),
            teacherId: Number(form.teacherId),
          });
        await onChanged();
      }}
      notify={notify}
      notifyError={notifyError}
    />
  );
};

export const SpacesTab = ({ campusId, campuses, spaces, permissions, onChanged, notify, notifyError }) => (
  <CatalogSection
    title="Espacios y zonas"
    subtitle={`Aulas, laboratorios, salas y zonas de acompañamiento de ${labelOf(campuses, campusId)}.`}
    info='Las zonas de acompañamiento (patio, cancha...) se crean aquí con el tipo "Zona". Varios docentes pueden acompañar la misma zona a la misma hora; un aula o laboratorio, en cambio, solo puede tener una clase a la vez.'
    columns={[
      { label: "Nombre", render: (s) => s.name },
      { label: "Tipo", render: (s) => s.type },
      { label: "Capacidad", render: (s) => (s.capacity ? `${s.capacity} puestos` : "Sin límite") },
    ]}
    rows={spaces.filter((s) => s.campusId === campusId)}
    rowKey={(s) => s.spaceId}
    fields={[
      { name: "name", label: "Nombre", type: "text", required: true, helper: "Ej.: Aula 201, Laboratorio de química" },
      {
        name: "type",
        label: "Tipo",
        type: "suggest",
        required: true,
        options: ["Aula", "Laboratorio", "Sala de sistemas", "Zona"],
      },
      { name: "capacity", label: "Capacidad (opcional)", type: "number", min: 1, max: 500, helper: "Puestos disponibles. Vacío = sin límite." },
    ]}
    emptyForm={{ name: "", type: "", capacity: "" }}
    toForm={(s) => ({ name: s.name, type: s.type, capacity: s.capacity ?? "" })}
    addLabel="Agregar espacio"
    emptyText="No hay espacios registrados en esta sede."
    deleteText={{
      tooltip: "Dar de baja",
      title: "Dar de baja el espacio",
      confirm: "Dar de baja",
      message: (s) => `"${s.name}" ya no se podrá elegir para nuevas clases o actividades. Lo que ya está programado allí se conserva.`,
    }}
    permissions={{ ...permissions, delete: permissions.update }}
    onSave={async (row, form) => {
      await saveSpace(row?.spaceId, { campusId, name: form.name, type: form.type, capacity: nullable(form.capacity) });
      await onChanged();
    }}
    onDelete={async (s) => {
      await deactivateSpace(s.spaceId);
      await onChanged();
    }}
    notify={notify}
    notifyError={notifyError}
  />
);

export const StudyPlanTab = ({ yearId, grades, subjects, permissions, notify, notifyError }) => {
  const [rows, setRows] = useState([]);
  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);

  useEffect(() => {
    if (!yearId) return;
    let cancelled = false;

    getStudyPlans(yearId)
      .then((records) => !cancelled && setRows(records))
      .catch((error) => !cancelled && notifyError(error, "No se pudieron cargar las horas por materia"));

    return () => {
      cancelled = true;
    };
  }, [yearId, version, notifyError]);

  const sorted = [...rows].sort(
    (a, b) => labelOf(grades, a.gradeId).localeCompare(labelOf(grades, b.gradeId)) || labelOf(subjects, a.subjectId).localeCompare(labelOf(subjects, b.subjectId)),
  );

  return (
    <CatalogSection
      title="Horas por materia"
      subtitle={`Cuántas horas a la semana exige cada materia en cada grado (${yearId}).`}
      info="Con estas horas el editor muestra cuánto falta por programar en cada salón. Si se programan más, el sistema solo avisa."
      columns={[
        { label: "Grado", render: (p) => labelOf(grades, p.gradeId) },
        { label: "Materia", render: (p) => labelOf(subjects, p.subjectId) },
        { label: "Horas semanales", render: (p) => p.weeklyHours },
      ]}
      rows={sorted}
      rowKey={(p) => p.studyPlanId}
      fields={[
        { name: "gradeId", label: "Grado", type: "select", required: true, options: grades },
        { name: "subjectId", label: "Materia", type: "select", required: true, options: subjects },
        { name: "weeklyHours", label: "Horas semanales", type: "number", required: true, min: 1, max: 40 },
      ]}
      emptyForm={{ gradeId: "", subjectId: "", weeklyHours: "" }}
      toForm={(p) => ({ gradeId: p.gradeId, subjectId: p.subjectId, weeklyHours: p.weeklyHours })}
      addLabel="Agregar materia"
      emptyText="Aún no hay horas registradas para este año."
      deleteText={{ message: (p) => `¿Eliminar ${labelOf(subjects, p.subjectId)} de ${labelOf(grades, p.gradeId)}?` }}
      permissions={permissions}
      onSave={async (row, form) => {
        await saveStudyPlan(row?.studyPlanId, {
          yearId,
          gradeId: Number(form.gradeId),
          subjectId: Number(form.subjectId),
          weeklyHours: Number(form.weeklyHours),
        });
        reload();
      }}
      onDelete={async (p) => {
        await deleteStudyPlan(p.studyPlanId);
        reload();
      }}
      notify={notify}
      notifyError={notifyError}
    />
  );
};

export const AvailabilityTab = ({ yearId, teachers, campuses, permissions, notify, notifyError }) => {
  const [rows, setRows] = useState([]);
  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);

  useEffect(() => {
    if (!yearId) return;
    let cancelled = false;

    getAvailabilities(yearId)
      .then((records) => !cancelled && setRows(records))
      .catch((error) => !cancelled && notifyError(error, "No se pudo cargar la disponibilidad"));

    return () => {
      cancelled = true;
    };
  }, [yearId, version, notifyError]);

  const sorted = [...rows].sort(
    (a, b) => labelOf(teachers, a.teacherId).localeCompare(labelOf(teachers, b.teacherId)) || a.weekday - b.weekday || a.startTime.localeCompare(b.startTime),
  );

  return (
    <CatalogSection
      title="Disponibilidad docente"
      subtitle={`Días y horas en que cada docente puede dictar clase en ${yearId}.`}
      info="Es opcional: si un docente no tiene horas registradas, se le puede programar en cualquier momento. Si una clase queda por fuera de su disponibilidad, se guarda igual y se muestra un aviso."
      columns={[
        { label: "Docente", render: (a) => labelOf(teachers, a.teacherId) },
        { label: "Día", render: (a) => dayLabel(a.weekday) },
        { label: "Horario", render: (a) => `${shortTime(a.startTime)} – ${shortTime(a.endTime)}` },
        { label: "Sede", render: (a) => (a.campusId ? labelOf(campuses, a.campusId) : "Cualquier sede") },
      ]}
      rows={sorted}
      rowKey={(a) => a.teacherAvailabilityId}
      fields={[
        { name: "teacherId", label: "Docente", type: "select", required: true, options: teachers },
        { name: "weekday", label: "Día", type: "select", required: true, options: WEEKDAYS.map((d) => ({ id: d.value, label: d.label })) },
        { name: "startTime", label: "Desde", type: "time", required: true },
        { name: "endTime", label: "Hasta", type: "time", required: true },
        { name: "campusId", label: "Sede", type: "select", options: campuses, emptyLabel: "Cualquier sede" },
      ]}
      emptyForm={{ teacherId: "", weekday: 1, startTime: "", endTime: "", campusId: "" }}
      toForm={(a) => ({
        teacherId: a.teacherId,
        weekday: a.weekday,
        startTime: shortTime(a.startTime),
        endTime: shortTime(a.endTime),
        campusId: a.campusId ?? "",
      })}
      addLabel="Agregar horario disponible"
      emptyText="No hay disponibilidad registrada este año."
      deleteText={{
        message: (a) => `¿Eliminar el horario disponible del ${dayLabel(a.weekday).toLowerCase()} de ${labelOf(teachers, a.teacherId)}?`,
      }}
      permissions={permissions}
      onSave={async (row, form) => {
        await saveAvailability(row?.teacherAvailabilityId, {
          yearId,
          teacherId: Number(form.teacherId),
          weekday: Number(form.weekday),
          startTime: form.startTime,
          endTime: form.endTime,
          campusId: nullable(form.campusId),
        });
        reload();
      }}
      onDelete={async (a) => {
        await deleteAvailability(a.teacherAvailabilityId);
        reload();
      }}
      notify={notify}
      notifyError={notifyError}
    />
  );
};

export const ClassroomsTab = ({ campusId, campuses, classrooms, teachers, permissions, onChanged, notify, notifyError }) => (
  <CatalogSection
    title="Salones"
    subtitle={`Duración de la hora de clase y director de grupo de los salones de ${labelOf(campuses, campusId)}.`}
    info="Los salones se crean en Administración. Aquí se define cuánto dura una hora de clase (sirve para calcular la hora de fin y las horas programadas) y quién es el director de grupo."
    columns={[
      { label: "Salón", render: (c) => c.name },
      { label: "Hora de clase", render: (c) => `${c.classMinutes ?? 60} min${c.classMinutes ? "" : " (predeterminada)"}` },
      { label: "Director de grupo", render: (c) => (c.directorTeacherId ? labelOf(teachers, c.directorTeacherId) : "Sin asignar") },
    ]}
    rows={classrooms.filter((c) => c.campusId === campusId).sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }))}
    rowKey={(c) => c.classroomId}
    fields={[
      {
        name: "classMinutes",
        label: "Duración de la hora de clase (minutos)",
        type: "number",
        min: 20,
        max: 180,
        helper: "Vacío = 60 minutos.",
      },
      { name: "directorTeacherId", label: "Director de grupo", type: "select", options: teachers, emptyLabel: "Sin director" },
    ]}
    emptyForm={{ classMinutes: "", directorTeacherId: "" }}
    toForm={(c) => ({ classMinutes: c.classMinutes ?? "", directorTeacherId: c.directorTeacherId ?? "" })}
    emptyText="No hay salones en esta sede."
    permissions={{ create: false, update: permissions.update, delete: false }}
    onSave={async (row, form) => {
      await saveClassroomSettings(row.classroomId, {
        classMinutes: nullable(form.classMinutes),
        directorTeacherId: nullable(form.directorTeacherId),
      });
      await onChanged();
    }}
    notify={notify}
    notifyError={notifyError}
  />
);
