import { Button } from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import { formatDay, todayInColombia, windowState } from "../utils/EnrollmentUtils";

const OPEN_COLOR = "#0fd355";
const WAITING_COLOR = "#d97706";
const CLOSED_COLOR = "#9ca3af";

const describe = (state, start, end) => {
  if (state.phase === "before") return { text: `Abre el ${formatDay(start)}`, color: WAITING_COLOR };

  if (state.phase === "closed") return { text: `Cerró el ${formatDay(end)}`, color: CLOSED_COLOR };

  const text =
    state.daysLeft === 0 ? "Último día" : state.daysLeft === 1 ? "Queda 1 día" : `Quedan ${state.daysLeft} días`;

  return { text, color: OPEN_COLOR };
};

const Window = ({ name, start, end, today }) => {
  const state = windowState(start, end, today);
  const info = describe(state, start, end);

  return (
    <div>
      <div className={styles.windowTop}>
        <span className={styles.windowName}>{name}</span>
        <span className={styles.windowState}>
          <span className={ui.dot} style={{ backgroundColor: info.color }} aria-hidden="true" />
          {info.text}
        </span>
      </div>

      <div
        className={styles.track}
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(state.progress * 100)}
      >
        <div
          className={`${styles.trackFill} ${state.phase === "open" ? "" : styles.trackFillMuted}`}
          style={{ width: `${Math.round(state.progress * 100)}%` }}
        />
      </div>

      <div className={styles.windowDates}>
        <span>{formatDay(start)}</span>
        <span>{formatDay(end)}</span>
      </div>
    </div>
  );
};

const PeriodStrip = ({ yearId, period, canEdit, onEdit }) => {
  if (!period) {
    return (
      <div className={styles.stripEmpty}>
        <span>Aún no hay fechas de matrícula para {yearId}.</span>
        {canEdit && (
          <Button variant="outlined" size="small" onClick={onEdit}>
            Configurar fechas
          </Button>
        )}
      </div>
    );
  }

  const today = todayInColombia();

  return (
    <div className={styles.strip}>
      <Window
        name="Prematrícula de antiguos"
        start={period.preEnrollmentStart}
        end={period.preEnrollmentEnd}
        today={today}
      />
      <Window name="Solicitudes de nuevos" start={period.admissionStart} end={period.admissionEnd} today={today} />

      {canEdit && (
        <Button size="small" onClick={onEdit}>
          Cambiar fechas
        </Button>
      )}
    </div>
  );
};

export default PeriodStrip;
