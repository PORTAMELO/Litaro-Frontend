import { useState } from "react";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./AsistenciaView.module.css";

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
    { id: 101, name: "601" },
    { id: 102, name: "602" },
    { id: 103, name: "701" },
    { id: 104, name: "801" },
  ],

  subjects: [
    { id: 1, name: "Matemáticas" },
    { id: 2, name: "Español" },
    { id: 3, name: "Ciencias" },
    { id: 4, name: "Sociales" },
    { id: 5, name: "Inglés" },
  ],
};

const initialStudents = [
  {
    id: 1,
    code: "20260001",
    name: "Juan Pérez",
    status: "PRESENT",
    observation: "",
  },
  {
    id: 2,
    code: "20260002",
    name: "María Gómez",
    status: "ABSENT",
    observation: "Incapacidad médica",
  },
  {
    id: 3,
    code: "20260003",
    name: "Carlos Rodríguez",
    status: "LATE",
    observation: "Llegó 15 minutos tarde",
  },
  {
    id: 4,
    code: "20260004",
    name: "Laura Martínez",
    status: "PRESENT",
    observation: "",
  },
  {
    id: 5,
    code: "20260005",
    name: "Daniel Torres",
    status: "PRESENT",
    observation: "",
  },
];

const statusOptions = [
  {
    value: "PRESENT",
    label: "Presente",
  },
  {
    value: "LATE",
    label: "Tarde",
  },
  {
    value: "ABSENT",
    label: "Ausente",
  },
];

const AsistenciaView = () => {
  const [filters, setFilters] = useState({
    year: 2026,
    date: "2026-08-13",
    grade: 6,
    classroom: 101,
    subject: 1,
  });

  const [students, setStudents] = useState(initialStudents);

  const selectedClassroom = mockFilters.classrooms.find(
    (classroom) => classroom.id === filters.classroom,
  );

  const selectedSubject = mockFilters.subjects.find(
    (subject) => subject.id === filters.subject,
  );

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStudentChange = (studentId, field, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              [field]: value,
            }
          : student,
      ),
    );
  };

  const handleSave = () => {
    console.log("Asistencia a guardar:", {
      filters,
      students,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de asistencia</h1>

          <p className={styles.subtitle}>
            Consulta y registra la asistencia de los estudiantes.
          </p>
        </div>
      </div>

      <section className={styles.filtersCard}>
        <Typography className={styles.sectionTitle}>
          Seleccionar clase
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
                <MenuItem
                  key={year.id}
                  value={year.id}
                  sx={{
                    fontFamily: "inherit",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {year.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={styles.filter}>
            <label>Fecha</label>

            <TextField
              type="date"
              size="small"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  style: {
                    fontFamily: "inherit",
                    fontSize: "var(--text-sm)",
                  },
                },
              }}
              fullWidth
            />
          </div>

          <div className={styles.filter}>
            <label>Grado</label>

            <Select
              size="small"
              value={filters.grade}
              onChange={(e) => handleFilterChange("grade", e.target.value)}
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
                <MenuItem
                  key={grade.id}
                  value={grade.id}
                  sx={{
                    fontFamily: "inherit",
                    fontSize: "var(--text-sm)",
                  }}
                >
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
              {mockFilters.classrooms.map((classroom) => (
                <MenuItem
                  key={classroom.id}
                  value={classroom.id}
                  sx={{
                    fontFamily: "inherit",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {classroom.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={styles.filter}>
            <label>Asignatura</label>

            <Select
              size="small"
              value={filters.subject}
              onChange={(e) => handleFilterChange("subject", e.target.value)}
              fullWidth
              sx={{
                fontFamily: "inherit",
                fontSize: "var(--text-sm)",

                "& .MuiSelect-select": {
                  fontSize: "var(--text-sm)",
                },
              }}
            >
              {mockFilters.subjects.map((subject) => (
                <MenuItem
                  key={subject.id}
                  value={subject.id}
                  sx={{
                    fontFamily: "inherit",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <Typography className={styles.tableTitle}>Asistencia</Typography>

            <Typography className={styles.tableSubtitle}>
              {selectedClassroom?.name} · {selectedSubject?.name} ·{" "}
              {filters.date}
            </Typography>
          </div>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            className={styles.saveButton}
          >
            Guardar asistencia
          </Button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.numberColumn}>#</th>
                <th>Estudiante</th>
                <th className={styles.codeColumn}>Código</th>
                <th className={styles.statusColumn}>Estado</th>
                <th>Observación</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td className={styles.numberCell}>{index + 1}</td>

                  <td className={styles.studentName}>{student.name}</td>

                  <td className={styles.codeCell}>{student.code}</td>

                  <td>
                    <Select
                      size="small"
                      value={student.status}
                      onChange={(e) =>
                        handleStudentChange(
                          student.id,
                          "status",
                          e.target.value,
                        )
                      }
                      className={styles.statusSelect}
                      sx={{
                        fontFamily: "inherit",
                        fontSize: "var(--text-sm)",

                        "& .MuiSelect-select": {
                          fontSize: "var(--text-sm)",
                        },
                      }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "var(--text-sm)",
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </td>

                  <td>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Opcional"
                      value={student.observation}
                      onChange={(e) =>
                        handleStudentChange(
                          student.id,
                          "observation",
                          e.target.value,
                        )
                      }
                      sx={{
                        "& input": {
                          fontFamily: "inherit",
                          fontSize: "var(--text-sm)",
                        },

                        "& input::placeholder": {
                          fontSize: "var(--text-sm)",
                        },
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AsistenciaView;
