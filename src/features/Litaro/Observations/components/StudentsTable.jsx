import { Button, Tooltip, Typography } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import EventIcon from "@mui/icons-material/Event";

import styles from "../Observations.module.css";

const StudentsTable = ({ classroomName, students, onObservation, onAppointment }) => (
  <section className={styles.studentsCard}>
    <div className={styles.tableHeader}>
      <div>
        <Typography className={styles.tableTitle}>Estudiantes</Typography>

        <Typography className={styles.tableSubtitle}>
          Grupo {classroomName} · {students.length} estudiantes
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
          {students.map((student, index) => (
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
                      onClick={() => onObservation(student)}
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
                      onClick={() => onAppointment(student)}
                      className={styles.appointmentButton}
                    >
                      Citar
                    </Button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
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
);

export default StudentsTable;
