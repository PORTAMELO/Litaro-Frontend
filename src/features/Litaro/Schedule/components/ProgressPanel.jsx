import { LinearProgress, Tooltip, Typography } from "@mui/material";

import styles from "../Schedule.module.css";

const STATUS = {
  PENDING: { label: "Faltan horas", color: "warning" },
  COMPLETE: { label: "Completa", color: "success" },
  EXCEEDED: { label: "Se pasa de las horas", color: "error" },
};

const ProgressPanel = ({ progress, classroomName, classMinutes }) => (
  <section className={styles.card}>
    <div className={styles.cardHeader}>
      <div>
        <Typography className={styles.cardTitle}>Horas por materia</Typography>
        <Typography className={styles.cardSubtitle}>
          {classroomName} · programadas / exigidas (hora de {classMinutes ?? 60} min)
        </Typography>
      </div>
    </div>

    <div className={styles.progressList}>
      {progress.length === 0 && (
        <p className={styles.emptyText}>
          Aún no se han definido las horas semanales de este grado. Agrégalas en la pestaña "Horas por materia".
        </p>
      )}

      {progress.map((item) => {
        const status = STATUS[item.status] ?? STATUS.PENDING;
        const percent = Math.min(100, (item.scheduled / item.planned) * 100);

        return (
          <Tooltip key={item.subjectId} title={status.label} placement="left">
            <div className={styles.progressItem}>
              <div className={styles.progressRow}>
                <span className={styles.progressSubject}>{item.subject}</span>
                <span className={`${styles.progressValue} ${styles[`progress_${item.status}`] ?? ""}`}>
                  {item.scheduled} / {item.planned}
                </span>
              </div>
              <LinearProgress variant="determinate" value={percent} color={status.color} sx={{ height: 6, borderRadius: 3 }} />
            </div>
          </Tooltip>
        );
      })}
    </div>
  </section>
);

export default ProgressPanel;
