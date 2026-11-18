import { Chip, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import styles from "../Observations.module.css";

const AppointmentsTable = ({ appointments, studentOf, onEdit, onDelete }) => (
  <section className={styles.recordsCard}>
    <div className={styles.tableHeader}>
      <div>
        <Typography className={styles.tableTitle}>Citaciones</Typography>

        <Typography className={styles.tableSubtitle}>Citaciones programadas para los estudiantes.</Typography>
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
          {appointments.map((appointment) => {
            const student = studentOf(appointment.studentId);

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
                    color={appointment.status === "Realizada" ? "success" : "warning"}
                  />
                </td>

                <td>
                  <div className={styles.iconActions}>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => onEdit(student, appointment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => onDelete(appointment)}>
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

export default AppointmentsTable;
