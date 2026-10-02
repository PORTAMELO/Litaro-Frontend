import { useEffect, useState } from "react";
import { Chip, Typography } from "@mui/material";

import styles from "../Schedule.module.css";
import { getParentAttention } from "../services/ScheduleService";
import { dayLabel, shortTime } from "../utils/ScheduleUtils";

const ParentAttentionBoard = ({ yearId, campusId, notifyError }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!yearId) return;
    getParentAttention(yearId, campusId)
      .then((data) => setRows(data ?? []))
      .catch((error) => notifyError(error, "No se pudo cargar la atención a padres"));
  }, [yearId, campusId, notifyError]);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <Typography className={styles.cardTitle}>Atención a padres</Typography>
          <Typography className={styles.cardSubtitle}>
            Para agregar o cambiar un horario de atención, ve a la pestaña "Horario semanal", elige al docente y agrega "Atención a padres".
          </Typography>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Docente</th>
              <th>Director de grupo</th>
              <th>Día</th>
              <th>Horario</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.teacherId}-${row.weekday}-${row.startTime}`}>
                <td className={styles.strongCell}>{row.teacherName}</td>
                <td>{row.directorOf ? <Chip size="small" label={row.directorOf} /> : "—"}</td>
                <td>{dayLabel(row.weekday)}</td>
                <td>
                  {shortTime(row.startTime)} – {shortTime(row.endTime)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.emptyCell}>
                  No hay horarios de atención a padres en esta sede.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ParentAttentionBoard;
