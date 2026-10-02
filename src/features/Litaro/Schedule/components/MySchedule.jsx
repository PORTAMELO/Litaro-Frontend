import { useEffect, useState } from "react";
import { Tab, Tabs, Typography } from "@mui/material";

import styles from "../Schedule.module.css";
import WeekView from "./WeekView";
import { getMySchedule } from "../services/ScheduleService";
import { dayLabel, shortTime } from "../utils/ScheduleUtils";

const MySchedule = ({ role, notifyError }) => {
  const [data, setData] = useState(null);
  const [childIndex, setChildIndex] = useState(0);

  useEffect(() => {
    getMySchedule()
      .then(setData)
      .catch((error) => notifyError(error, "No se pudo cargar tu horario"));
  }, [notifyError]);

  if (!data) return <p className={styles.emptyText}>Cargando horario...</p>;

  if (role === "Profesor") {
    return (
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <Typography className={styles.cardTitle}>Mi horario {data.yearId}</Typography>
            <Typography className={styles.cardSubtitle}>
              Clases, atención a padres, zonas de acompañamiento y reuniones en todas las sedes.
            </Typography>
          </div>
        </div>
        <WeekView
          blocks={data.teacher ?? []}
          subtitleOf={(b) => [b.classroomName, b.campusName].filter(Boolean).join(" · ")}
        />
      </section>
    );
  }

  if (role === "Estudiante") {
    const blocks = data.student ?? [];
    const subtitle =
      data.student === null
        ? "No tienes una matrícula activa este año."
        : blocks.length > 0
          ? `Salón ${blocks[0].classroomName}`
          : "Tu salón aún no tiene horario registrado.";
    return (
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <Typography className={styles.cardTitle}>Mi horario {data.yearId}</Typography>
            <Typography className={styles.cardSubtitle}>
              {subtitle}
            </Typography>
          </div>
        </div>
        <WeekView blocks={blocks} subtitleOf={(b) => b.teacherName} />
      </section>
    );
  }

  const children = data.children ?? [];
  if (children.length === 0)
    return <p className={styles.emptyText}>No hay estudiantes con matrícula activa asociados a tu usuario.</p>;

  const child = children[Math.min(childIndex, children.length - 1)];

  return (
    <>
      {children.length > 1 && (
        <Tabs value={childIndex} onChange={(_, value) => setChildIndex(value)} className={styles.tabs}>
          {children.map((c) => (
            <Tab key={c.studentId} label={c.name} sx={{ textTransform: "none", fontFamily: "inherit" }} />
          ))}
        </Tabs>
      )}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <Typography className={styles.cardTitle}>Horario de {child.name}</Typography>
            <Typography className={styles.cardSubtitle}>
              {child.classes.length > 0 ? `Salón ${child.classes[0].classroomName} · ${data.yearId}` : `Año ${data.yearId}`}
            </Typography>
          </div>
        </div>
        <WeekView blocks={child.classes} subtitleOf={(b) => b.teacherName} />
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <Typography className={styles.cardTitle}>Atención a padres</Typography>
            <Typography className={styles.cardSubtitle}>Horarios en que los docentes de {child.name} atienden a los acudientes.</Typography>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Docente</th>
                <th>Día</th>
                <th>Horario</th>
              </tr>
            </thead>
            <tbody>
              {child.parentAttention.map((b) => (
                <tr key={b.scheduleId}>
                  <td className={styles.strongCell}>{b.teacherName}</td>
                  <td>{dayLabel(b.weekday)}</td>
                  <td>
                    {shortTime(b.startTime)} – {shortTime(b.endTime)}
                  </td>
                </tr>
              ))}
              {child.parentAttention.length === 0 && (
                <tr>
                  <td colSpan={3} className={styles.emptyCell}>
                    Los docentes aún no tienen horario de atención registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default MySchedule;
