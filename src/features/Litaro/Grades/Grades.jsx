import { useMemo, useState } from "react";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./Grades.module.css";

const mockFilters = {
  years: [
    { id: 2026, name: "2026" },
    { id: 2025, name: "2025" },
  ],

  periods: [
    { id: 1, name: "Período 1" },
    { id: 2, name: "Período 2" },
    { id: 3, name: "Período 3" },
    { id: 4, name: "Período 4" },
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
    score: 4.5,
  },
  {
    id: 2,
    code: "20260002",
    name: "María Gómez",
    score: 3.8,
  },
  {
    id: 3,
    code: "20260003",
    name: "Carlos Rodríguez",
    score: 4.2,
  },
  {
    id: 4,
    code: "20260004",
    name: "Laura Martínez",
    score: 2.9,
  },
  {
    id: 5,
    code: "20260005",
    name: "Daniel Torres",
    score: null,
  },
];

const Grades = () => {
  const [filters, setFilters] = useState({
    year: 2026,
    period: 1,
    grade: 6,
    classroom: 101,
    subject: 1,
  });

  const [students, setStudents] = useState(initialStudents);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScoreChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              score: value === "" ? null : Number(value),
            }
          : student,
      ),
    );
  };

  const selectedClassroom = useMemo(
    () => mockFilters.classrooms.find((classroom) => classroom.id === filters.classroom),
    [filters.classroom],
  );

  const selectedSubject = useMemo(
    () => mockFilters.subjects.find((subject) => subject.id === filters.subject),
    [filters.subject],
  );

  const handleSave = () => {
    console.log("Notas a guardar:", {
      filters,
      students,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de notas</h1>

          <p className={styles.subtitle}>Consulta y registra las notas de los estudiantes.</p>
        </div>
      </div>

      <section className={styles.filtersCard}>
        <Typography className={styles.sectionTitle}>Seleccionar grupo</Typography>

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
            <label>Período</label>

            <Select
              size="small"
              value={filters.period}
              onChange={(e) => handleFilterChange("period", e.target.value)}
              fullWidth
              sx={{
                fontFamily: "inherit",
                fontSize: "var(--text-sm)",

                "& .MuiSelect-select": {
                  fontSize: "var(--text-sm)",
                },
              }}
            >
              {mockFilters.periods.map((period) => (
                <MenuItem
                  key={period.id}
                  value={period.id}
                  sx={{
                    fontFamily: "inherit",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {period.name}
                </MenuItem>
              ))}
            </Select>
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
            <Typography className={styles.tableTitle}>{selectedSubject?.name}</Typography>

            <Typography className={styles.tableSubtitle}>
              {selectedClassroom?.name} · Período {filters.period} · {filters.year}
            </Typography>
          </div>

          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} className={styles.saveButton}>
            Guardar cambios
          </Button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.numberColumn}>#</th>
                <th>Estudiante</th>
                <th className={styles.codeColumn}>Código</th>
                <th className={styles.scoreColumn}>Nota</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td className={styles.numberCell}>{index + 1}</td>

                  <td className={styles.studentName}>{student.name}</td>

                  <td className={styles.codeCell}>{student.code}</td>

                  <td>
                    <TextField
                      type="number"
                      size="small"
                      value={student.score ?? ""}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          max: 5,
                          step: 0.1,
                        },
                      }}
                      className={styles.scoreInput}
                      sx={{
                        "& input": {
                          fontFamily: "inherit",
                          fontSize: "var(--text-sm)",
                          textAlign: "center",
                          fontWeight: "var(--font-semibold)",
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

export default Grades;
