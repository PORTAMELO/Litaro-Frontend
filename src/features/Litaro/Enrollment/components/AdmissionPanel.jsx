import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import * as service from "../services/EnrollmentService";
import SidePanel from "./SidePanel";
import { Field, StatusMark } from "./Ui";
import { ADMISSION_STATUS, ageAt, formatDate, formatDateTime, todayInColombia } from "../utils/EnrollmentUtils";

const DECISIONS = {
  APPROVED: {
    action: "Aprobar",
    prompt: "Se avisa a Secretaría para que registre al estudiante nuevo en el SIMAT.",
    label: "Nota (opcional)",
    required: false,
    done: "Admisión aprobada. Secretaría recibió el aviso para registrarla en el SIMAT.",
  },
  WAITLIST: {
    action: "Pasar a lista de espera",
    prompt: "Queda en espera, en el orden en que llegó dentro de su grado.",
    label: "Nota (opcional)",
    required: false,
    done: "La solicitud pasó a la lista de espera.",
  },
  REJECTED: {
    action: "Rechazar",
    prompt: "El motivo queda en el historial de la solicitud.",
    label: "Motivo del rechazo",
    required: true,
    done: "Solicitud rechazada.",
  },
};

const EVENT_TITLE = {
  PENDING: "Solicitud registrada",
  WAITLIST: "Pasó a lista de espera",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const AdmissionPanel = ({ row, canDecide, onClose, onDecided }) => {
  const [events, setEvents] = useState({ key: null, list: [] });
  const [action, setAction] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const eventsKey = `${row.admissionRequestId}|${row.status}`;
  const loadingEvents = events.key !== eventsKey;
  const info = ADMISSION_STATUS[row.status] ?? { label: row.status, color: "#6b7280" };
  const decidable = row.status === "PENDING" || row.status === "WAITLIST";
  const decision = action ? DECISIONS[action] : null;

  useEffect(() => {
    let cancelled = false;

    service
      .getAdmissionEvents(row.admissionRequestId)
      .then((list) => {
        if (!cancelled) setEvents({ key: eventsKey, list: list ?? [] });
      })
      .catch(() => {
        if (!cancelled) setEvents({ key: eventsKey, list: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [row.admissionRequestId, eventsKey]);

  const choose = (value) => {
    setAction(value);
    setNote("");
    setError(null);
  };

  const submit = async () => {
    setBusy(true);
    setError(null);

    try {
      await service.decideAdmission(row.admissionRequestId, action, note.trim() === "" ? null : note.trim());
      onDecided(decision.done);
    } catch (err) {
      setError(err.message ?? "No fue posible registrar la decisión.");
      setBusy(false);
    }
  };

  let footer = null;

  if (decidable && canDecide && decision) {
    footer = (
      <>
        <p className={styles.hint}>{decision.prompt}</p>

        <Field label={decision.label}>
          <TextField
            multiline
            minRows={2}
            fullWidth
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={busy}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        </Field>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.panelActions}>
          <Button onClick={() => choose(null)} disabled={busy}>
            Volver
          </Button>
          <Button
            variant="contained"
            color={action === "REJECTED" ? "error" : "primary"}
            onClick={submit}
            disabled={busy || (decision.required && note.trim() === "")}
          >
            {busy ? "Guardando…" : decision.action}
          </Button>
        </div>
      </>
    );
  } else if (decidable && canDecide) {
    footer = (
      <div className={styles.panelActions}>
        <Button color="error" onClick={() => choose("REJECTED")} sx={{ marginRight: "auto" }}>
          Rechazar
        </Button>
        {row.status !== "WAITLIST" && (
          <Button variant="outlined" onClick={() => choose("WAITLIST")}>
            Lista de espera
          </Button>
        )}
        <Button variant="contained" onClick={() => choose("APPROVED")}>
          Aprobar
        </Button>
      </div>
    );
  } else if (decidable) {
    footer = <p className={styles.hint}>La decisión la toma el Rector.</p>;
  }

  const today = todayInColombia();

  return (
    <SidePanel
      open
      busy={busy}
      onClose={onClose}
      title={`${row.firstName} ${row.lastName}`}
      subtitle={
        <>
          <StatusMark label={info.label} color={info.color} />
          {row.waitlistPosition && <div>Puesto {row.waitlistPosition} en su grado</div>}
        </>
      }
      footer={footer}
    >
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Aspirante</h3>
        <dl className={styles.facts}>
          <dt>Documento</dt>
          <dd>
            {row.documentType} {row.documentNumber}
          </dd>
          <dt>Nacimiento</dt>
          <dd>
            {formatDate(row.birthDate)}, {ageAt(row.birthDate, today)} años
          </dd>
          <dt>Grado</dt>
          <dd>{row.gradeName}</dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Acudiente</h3>
        <dl className={styles.facts}>
          <dt>Nombre</dt>
          <dd>{row.guardianName}</dd>
          <dt>Teléfono</dt>
          <dd>{row.guardianPhone}</dd>
        </dl>
      </section>

      {row.notes && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Observaciones</h3>
          <p className={styles.hint}>{row.notes}</p>
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Historial</h3>

        {loadingEvents ? (
          <p className={styles.hint}>Cargando…</p>
        ) : (
          <ol className={styles.timeline}>
            {[...events.list].reverse().map((event, index) => {
              const eventInfo = ADMISSION_STATUS[event.toStatus] ?? { color: "#6b7280" };
              const showNote = event.note && !(event.toStatus === "PENDING" && !event.fromStatus);

              return (
                <li key={`${event.createdAt}-${index}`} className={styles.timelineItem}>
                  <span
                    className={styles.timelineDot}
                    style={{ backgroundColor: eventInfo.color }}
                    aria-hidden="true"
                  />
                  <div className={styles.timelineTitle}>{EVENT_TITLE[event.toStatus] ?? event.toStatus}</div>
                  <div className={styles.timelineMeta}>
                    {event.userName}, {formatDateTime(event.createdAt)}
                  </div>
                  {showNote && <p className={styles.timelineNote}>{event.note}</p>}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </SidePanel>
  );
};

export default AdmissionPanel;
