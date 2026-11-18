// Tarjetas del módulo Administración, agrupadas por sección.
// Pendiente: "records" es un valor fijo de ejemplo; el conteo real requiere un servicio del backend.

export const INSTITUTIONAL_CARDS = [
  {
    title: "Colegio",
    tableName: "School",
    endpoint: "/schools",
    records: 17478,
  },
  {
    title: "Sedes",
    tableName: "Campus",
    endpoint: "/campus",
    records: 17478,
  },
  {
    title: "Años académicos",
    tableName: "AcademicYear",
    endpoint: "/academic-years",
    records: 17478,
  },
  {
    title: "Períodos académicos",
    tableName: "AcademicPeriod",
    endpoint: "/academic-periods",
    records: 17478,
  },
];

export const CATALOGS_CARDS = [
  {
    title: "Características",
    tableName: "Characteristic",
    endpoint: "/characteristics",
    records: 17478,
  },
  {
    title: "Detalles de característica",
    tableName: "CharacteristicDetail",
    endpoint: "/characteristic-details",
    records: 17478,
  },
];

export const USERS_CARDS = [
  {
    title: "Usuarios",
    tableName: "User",
    endpoint: "/users",
    records: 17478,
    readOnly: true,
  },
  {
    title: "Estudiantes",
    tableName: "Student",
    endpoint: "/students",
    records: 17478,
    role: "Student",
  },
  {
    title: "Padres",
    tableName: "Parent",
    endpoint: "/parents",
    records: 17478,
    role: "Parent",
  },
  {
    title: "Profesores",
    tableName: "Teacher",
    endpoint: "/teachers",
    records: 17478,
    role: "Teacher",
  },
];

export const SECURITY_CARDS = [
  {
    title: "Roles",
    tableName: "Role",
    endpoint: "/roles",
    records: 17478,
  },
  {
    title: "Permisos por rol",
    tableName: "RolePermission",
    records: 17478,
    special: "permissions",
  },
];

export const ACADEMIC_CARDS = [
  {
    title: "Grados",
    tableName: "Grade",
    endpoint: "/grades",
    records: 17478,
  },
  {
    title: "Salones",
    tableName: "Classroom",
    endpoint: "/classrooms",
    records: 17478,
  },
  {
    title: "Materias",
    tableName: "Subject",
    endpoint: "/subjects",
    records: 17478,
  },
  {
    title: "Asignaciones",
    tableName: "AcademicAssignment",
    endpoint: "/academic-assignments",
    records: 17478,
  },
  {
    title: "Horarios",
    tableName: "Schedule",
    endpoint: "/schedules",
    records: 17478,
  },
  {
    title: "Matrículas",
    tableName: "Enrollment",
    endpoint: "/enrollments",
    records: 17478,
  },
  {
    title: "Notas",
    tableName: "GradeScore",
    endpoint: "/grade-scores",
    records: 17478,
  },
  {
    title: "Asistencia",
    tableName: "Attendance",
    endpoint: "/attendances",
    records: 17478,
  },
  {
    title: "Observador",
    tableName: "StudentLog",
    endpoint: "/student-logs",
    records: 17478,
  },
];
