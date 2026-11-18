export const DESCRIPTION_LIMIT = 2000;
export const STATEMENT_LIMIT = 2000;
export const COMMITMENT_LIMIT = 500;
export const NOTE_LIMIT = 300;
export const STATEMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png";

export const TYPES = ["I", "II", "III"];

export const KIND_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "ACADEMIC", label: "Académicas" },
  { value: "COEXISTENCE", label: "Convivencia" },
];

export const COMMITMENT_STATUSES = [
  { value: "PENDING", label: "Pendiente" },
  { value: "MET", label: "Cumplió" },
  { value: "NOT_MET", label: "No cumplió" },
  { value: "OBSERVATION", label: "Observación" },
];

export const commitmentLabel = (status) =>
  COMMITMENT_STATUSES.find((option) => option.value === status)?.label ?? status;

export const kindLabel = ({ isAcademic, isCoexistence, coexistenceType }) =>
  [isAcademic && "Académica", isCoexistence && `Convivencia Tipo ${coexistenceType}`].filter(Boolean).join(" y ");

const ACTIONS = {
  CREATE: "Registró la observación",
  UPDATE: "Editó la observación",
  STATEMENT: "Descargos transcritos",
  STATEMENT_FILE: "Formato de descargos",
  STATEMENT_FILE_REMOVED: "Formato de descargos",
  COMMITMENT_ADDED: "Agregó un compromiso",
  COMMITMENT_STATUS: "Seguimiento del compromiso",
};

export const actionLabel = (action) => ACTIONS[action] ?? action;

// Clave de permiso que habilita cada acción: basta una de las dos.
export const canAny = (can, action) => can("ObservationRecord", action) || can("ObservationConsolidated", action);

// --- Filtros de año, sede, grado y curso ---

export const ALL_SCOPE = "";

export const emptyScope = (options, classroomId = ALL_SCOPE) => ({
  yearId: options.yearId ?? ALL_SCOPE,
  campusId: ALL_SCOPE,
  gradeId: ALL_SCOPE,
  classroomId,
});

// Cursos del año en curso que cumplen la sede y el grado elegidos.
export const classroomsIn = (options, scope) =>
  options.classrooms.filter(
    (item) =>
      (scope.campusId === ALL_SCOPE || item.campusId === scope.campusId) &&
      (scope.gradeId === ALL_SCOPE || item.gradeId === scope.gradeId),
  );
