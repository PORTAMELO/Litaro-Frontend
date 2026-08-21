import { useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import AddCommentIcon from "@mui/icons-material/AddComment";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./ObservacionesCitacionesProfessor.module.css";

import ObservacionDialog from "./components/ObservacionDialog";
import CitacionDialog from "./components/CitacionDialog";
import AppNotification from "./components/AppNotification";
import ConfirmDialog from "./components/ConfirmDialog";

const mockFilters = {
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

const initialStudents = [
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

const initialObservations = [
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

const initialAppointments = [
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

const initialFilters = {
  year: 2026,
  grade: 6,
  classroom: 101,
};

const ObservacionesCitacionesView = () => {
  const [filters, setFilters] = useState(initialFilters);

  const [students] = useState(initialStudents);

  const [observations, setObservations] = useState(initialObservations);
  const [appointments, setAppointments] = useState(initialAppointments);

  const [observationDialog, setObservationDialog] = useState({
    open: false,
    student: null,
    observation: null,
  });

  const [appointmentDialog, setAppointmentDialog] = useState({
    open: false,
    student: null,
    appointment: null,
  });

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const selectedClassroom = mockFilters.classrooms.find(
    (classroom) => classroom.id === filters.classroom,
  );

  const filteredStudents = students.filter(
    (student) => student.classroom === filters.classroom,
  );

  const getStudent = (studentId) =>
    students.find((student) => student.id === studentId);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGradeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      grade: value,
      classroom:
        mockFilters.classrooms.find((classroom) => classroom.grade === value)
          ?.id ?? "",
    }));
  };

  const showNotification = ({
    severity = "success",
    title = "",
    message = "",
  }) => {
    setNotification({
      open: true,
      severity,
      title,
      message,
    });
  };

  const openObservation = (student, observation = null) => {
    setObservationDialog({
      open: true,
      student,
      observation,
    });
  };

  const openAppointment = (student, appointment = null) => {
    setAppointmentDialog({
      open: true,
      student,
      appointment,
    });
  };

  const closeObservation = () => {
    setObservationDialog({
      open: false,
      student: null,
      observation: null,
    });
  };

  const closeAppointment = () => {
    setAppointmentDialog({
      open: false,
      student: null,
      appointment: null,
    });
  };

  const handleObservationSave = (form) => {
    if (observationDialog.observation) {
      setObservations((prev) =>
        prev.map((item) =>
          item.id === observationDialog.observation.id
            ? {
                ...item,
                ...form,
              }
            : item,
        ),
      );

      showNotification({
        severity: "success",
        message: "Observación actualizada correctamente.",
      });
    } else {
      setObservations((prev) => [
        ...prev,
        {
          id: Date.now(),
          studentId: observationDialog.student.id,
          ...form,
        },
      ]);

      showNotification({
        severity: "success",
        message: "Observación registrada correctamente.",
      });
    }

    closeObservation();
  };

  const handleAppointmentSave = (form) => {
    if (appointmentDialog.appointment) {
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointmentDialog.appointment.id
            ? {
                ...item,
                ...form,
              }
            : item,
        ),
      );

      showNotification({
        severity: "success",
        message: "Citación actualizada correctamente.",
      });
    } else {
      setAppointments((prev) => [
        ...prev,
        {
          id: Date.now(),
          studentId: appointmentDialog.student.id,
          ...form,
        },
      ]);

      showNotification({
        severity: "success",
        message: "Citación registrada correctamente.",
      });
    }

    closeAppointment();
  };

  const handleDeleteObservation = (observation) => {
    setConfirm({
      open: true,
      title: "Eliminar observación",
      message: "¿Está seguro de eliminar esta observación?",
      action: () => {
        setObservations((prev) =>
          prev.filter((item) => item.id !== observation.id),
        );

        showNotification({
          severity: "success",
          message: "Observación eliminada correctamente.",
        });
      },
    });
  };

  const handleDeleteAppointment = (appointment) => {
    setConfirm({
      open: true,
      title: "Eliminar citación",
      message: "¿Está seguro de eliminar esta citación?",
      action: () => {
        setAppointments((prev) =>
          prev.filter((item) => item.id !== appointment.id),
        );

        showNotification({
          severity: "success",
          message: "Citación eliminada correctamente.",
        });
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Observaciones y citaciones</h1>

          <p className={styles.subtitle}>
            Registra observaciones y gestiona las citaciones de los estudiantes.
          </p>
        </div>
      </div>

      {/* FILTROS */}

      <section className={styles.filtersCard}>
        <Typography className={styles.sectionTitle}>
          Seleccionar grupo
        </Typography>

        <div className={styles.filtersGrid}>
          <div className={styles.filter}>
            <label>Año académico</label>

            <Select
              size="small"
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              fullWidth
              sx={{
                fontFamily: "inherit",
                fontSize: "var(--text-sm)",
                "& .MuiSelect-select": {
                  fontSize: "var(--text-sm)",
                },
              }}
            >
              {mockFilters.years.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={styles.filter}>
            <label>Grado</label>

            <Select
              size="small"
              value={filters.grade}
              onChange={(e) => handleGradeChange(e.target.value)}
              fullWidth
              sx={{
                fontFamily: "inherit",
                fontSize: "var(--text-sm)",
                "& .MuiSelect-select": {
                  fontSize: "var(--text-sm)",
                },
              }}
            >
              {mockFilters.grades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id}>
                  {grade.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={styles.filter}>
            <label>Grupo</label>

            <Select
              size="small"
              value={filters.classroom}
              onChange={(e) => handleFilterChange("classroom", e.target.value)}
              fullWidth
              sx={{
                fontFamily: "inherit",
                fontSize: "var(--text-sm)",
                "& .MuiSelect-select": {
                  fontSize: "var(--text-sm)",
                },
              }}
            >
              {mockFilters.classrooms
                .filter((classroom) => classroom.grade === filters.grade)
                .map((classroom) => (
                  <MenuItem key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
      </section>

      {/* ESTUDIANTES */}

      <section className={styles.studentsCard}>
        <div className={styles.tableHeader}>
          <div>
            <Typography className={styles.tableTitle}>Estudiantes</Typography>

            <Typography className={styles.tableSubtitle}>
              Grupo {selectedClassroom?.name} · {filteredStudents.length}{" "}
              estudiantes
            </Typography>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.numberColumn}>#</th>
                <th>Estudiante</th>
                <th className={styles.codeColumn}>Código</th>
                <th className={styles.actionsColumn}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td className={styles.numberCell}>{index + 1}</td>

                  <td className={styles.studentName}>{student.name}</td>

                  <td className={styles.codeCell}>{student.code}</td>

                  <td>
                    <div className={styles.actions}>
                      <Tooltip title="Registrar observación">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddCommentIcon />}
                          onClick={() => openObservation(student)}
                          className={styles.observationButton}
                        >
                          Observación
                        </Button>
                      </Tooltip>

                      <Tooltip title="Registrar citación">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EventIcon />}
                          onClick={() => openAppointment(student)}
                          className={styles.appointmentButton}
                        >
                          Citar
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.emptyCell}>
                    No hay estudiantes para el grupo seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* OBSERVACIONES */}

      <section className={styles.recordsCard}>
        <div className={styles.tableHeader}>
          <div>
            <Typography className={styles.tableTitle}>
              Observaciones registradas
            </Typography>

            <Typography className={styles.tableSubtitle}>
              Historial de observaciones del grupo seleccionado.
            </Typography>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Fecha</th>
                <th>Docente</th>
                <th>Observación</th>
                <th>Estado</th>
                <th className={styles.recordActionsColumn}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {observations
                .filter((observation) =>
                  filteredStudents.some(
                    (student) => student.id === observation.studentId,
                  ),
                )
                .map((observation) => {
                  const student = getStudent(observation.studentId);

                  return (
                    <tr key={observation.id}>
                      <td className={styles.studentName}>{student?.name}</td>

                      <td>{observation.date}</td>

                      <td>{observation.teacher}</td>

                      <td className={styles.descriptionCell}>
                        {observation.description}
                      </td>

                      <td>
                        <Chip
                          label={observation.status}
                          size="small"
                          color={
                            observation.status === "Con penalización"
                              ? "warning"
                              : "default"
                          }
                        />
                      </td>

                      <td>
                        <div className={styles.iconActions}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                openObservation(student, observation)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteObservation(observation)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CITACIONES */}

      <section className={styles.recordsCard}>
        <div className={styles.tableHeader}>
          <div>
            <Typography className={styles.tableTitle}>Citaciones</Typography>

            <Typography className={styles.tableSubtitle}>
              Citaciones programadas para los estudiantes.
            </Typography>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Lugar</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th className={styles.recordActionsColumn}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {appointments
                .filter((appointment) =>
                  filteredStudents.some(
                    (student) => student.id === appointment.studentId,
                  ),
                )
                .map((appointment) => {
                  const student = getStudent(appointment.studentId);

                  return (
                    <tr key={appointment.id}>
                      <td className={styles.studentName}>{student?.name}</td>

                      <td>{appointment.date}</td>

                      <td>{appointment.time}</td>

                      <td>{appointment.reason}</td>

                      <td>{appointment.place}</td>

                      <td>{appointment.responsible}</td>

                      <td>
                        <Chip
                          label={appointment.status}
                          size="small"
                          color={
                            appointment.status === "Realizada"
                              ? "success"
                              : "warning"
                          }
                        />
                      </td>

                      <td>
                        <div className={styles.iconActions}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                openAppointment(student, appointment)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteAppointment(appointment)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      {/* DIALOGS */}

      <ObservacionDialog
        open={observationDialog.open}
        student={observationDialog.student}
        observation={observationDialog.observation}
        onClose={closeObservation}
        onSave={handleObservationSave}
      />

      <CitacionDialog
        open={appointmentDialog.open}
        student={appointmentDialog.student}
        appointment={appointmentDialog.appointment}
        onClose={closeAppointment}
        onSave={handleAppointmentSave}
      />

      <AppNotification
        {...notification}
        onClose={() =>
          setNotification((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onClose={() =>
          setConfirm((prev) => ({
            ...prev,
            open: false,
          }))
        }
        onConfirm={async () => {
          await confirm.action?.();

          setConfirm((prev) => ({
            ...prev,
            open: false,
          }));
        }}
      />
    </div>
  );
};

export default ObservacionesCitacionesView;
