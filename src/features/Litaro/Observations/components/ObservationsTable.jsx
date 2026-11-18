import { Chip, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import styles from "../Observations.module.css";

const ObservationsTable = ({ observations, studentOf, onEdit, onDelete }) => (
  <section className={styles.recordsCard}>
    <div className={styles.tableHeader}>
      <div>
        <Typography className={styles.tableTitle}>Observaciones registradas</Typography>

        <Typography className={styles.tableSubtitle}>Historial de observaciones del grupo seleccionado.</Typography>
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
          {observations.map((observation) => {
            const student = studentOf(observation.studentId);

            return (
              <tr key={observation.id}>
                <td className={styles.studentName}>{student?.name}</td>

                <td>{observation.date}</td>

                <td>{observation.teacher}</td>

                <td className={styles.descriptionCell}>{observation.description}</td>

                <td>
                  <Chip
                    label={observation.status}
                    size="small"
                    color={observation.status === "Con penalización" ? "warning" : "default"}
                  />
                </td>

                <td>
                  <div className={styles.iconActions}>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => onEdit(student, observation)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => onDelete(observation)}>
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
);

export default ObservationsTable;
