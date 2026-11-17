// Datos de ejemplo: Observaciones aún no está conectado al backend.
// Lo que se registre vive en memoria y se pierde al recargar.

export const mockFilters = {
  years: [
    { id: 2026, name: "2026" },
    { id: 2025, name: "2025" },
  ],

  grades: [
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
  ],

  classrooms: [
    { id: 101, name: "601", grade: 6 },
    { id: 102, name: "602", grade: 6 },
    { id: 103, name: "701", grade: 7 },
    { id: 104, name: "801", grade: 8 },
  ],
};

export const initialStudents = [
  {
    id: 1,
    code: "20260001",
    name: "Juan Pérez",
    classroom: 101,
  },
  {
    id: 2,
    code: "20260002",
    name: "María Gómez",
    classroom: 101,
  },
  {
    id: 3,
    code: "20260003",
    name: "Carlos Rodríguez",
    classroom: 101,
  },
  {
    id: 4,
    code: "20260004",
    name: "Laura Martínez",
    classroom: 101,
  },
  {
    id: 5,
    code: "20260005",
    name: "Daniel Torres",
    classroom: 101,
  },
];

export const initialObservations = [
  {
    id: 1,
    studentId: 2,
    date: "2026-08-12",
    teacher: "Ana López",
    description: "Presentó dificultades durante la actividad de clase.",
    commitment: "Mejorar su participación y entrega de actividades.",
    status: "En seguimiento",
  },
  {
    id: 2,
    studentId: 3,
    date: "2026-08-10",
    teacher: "Carlos Pérez",
    description: "Incumplimiento reiterado de las normas de convivencia.",
    commitment: "Cumplir las normas establecidas durante la jornada.",
    status: "Con penalización",
  },
];

export const initialAppointments = [
  {
    id: 1,
    studentId: 2,
    date: "2026-08-15",
    time: "08:00",
    reason: "Seguimiento académico",
    place: "Coordinación",
    responsible: "Ana López",
    status: "Pendiente",
  },
  {
    id: 2,
    studentId: 3,
    date: "2026-08-16",
    time: "10:30",
    reason: "Situación de convivencia",
    place: "Sala de reuniones",
    responsible: "Carlos Pérez",
    status: "Realizada",
  },
];

export const initialFilters = {
  year: 2026,
  grade: 6,
  classroom: 101,
};
