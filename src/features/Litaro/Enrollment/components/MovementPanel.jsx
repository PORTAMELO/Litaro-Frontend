import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import * as service from "../services/MovementService";
import SidePanel from "../../../../shared/components/Ui/SidePanel";
import { Field, StatusMark } from "../../../../shared/components/Ui/Ui";
import { ENROLLMENT_STATUS, formatDateTime } from "../utils/EnrollmentUtils";
import { openCertificateWindow, printCertificate } from "../utils/MovementCertificate";

const ACTIONS = {
  CLASSROOM: {
    action: "Cambiar de curso",
    prompt: "Las notas, la asistencia y el observador siguen con el estudiante. Se avisa a Secretaría para el SIMAT.",
    done: "Cambio de curso registrado. Secretaría recibió el aviso para el SIMAT.",
  },
  CAMPUS: {
    action: "Cambiar de sede",
    prompt: "El SIMAT lo trata como un traslado. Al guardar podrás imprimir la constancia para firmas.",
    done: "Cambio de sede registrado. Imprime la constancia desde el historial.",
  },
  WITHDRAWAL: {
    action: "Retirar",
    prompt: "El estudiante queda como retirado. Sus notas, asistencia y observador se conservan.",
    done: "Retiro registrado. Secretaría recibió el aviso para el SIMAT.",
  },
};

const EVENT_COLOR = {
  CLASSROOM: "#2563eb",
  CAMPUS: "#d97706",
  WITHDRAWAL: "#6b7280",
};

const eventTitle = (event) => {
  if (event.type === "WITHDRAWAL") return `Retiro: ${event.reason}`;

  if (event.type === "CAMPUS")
    return `Cambio de sede: ${event.fromClassroom} (${event.fromCampus}) a ${event.toClassroom} (${event.toCampus})`;

  return `Cambio de curso: ${event.fromClassroom} a ${event.toClassroom}`;
};

const selectProps = (label) => ({ select: { native: true }, htmlInput: { "aria-label": label } });

const MovementPanel = ({ row, options, canExecute, version, onClose, onDone, notify }) => {
  const [events, setEvents] = useState({ key: null, list: [] });
  const [action, setAction] = useState(null);
  const [campusId, setCampusId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const eventsKey = `${row.enrollmentId}|${version}`;
  const loadingEvents = events.key !== eventsKey;
  const info = ENROLLMENT_STATUS[row.status] ?? { label: row.status, color: "#6b7280" };
  const active = row.status === "ACTIVE";
  const chosen = action ? ACTIONS[action] : null;

  const sameGrade = options.classrooms.filter(
    (classroom) => classroom.gradeId === row.gradeId && classroom.classroomId !== row.classroomId,
  );
  const sameCampus = sameGrade.filter((classroom) => classroom.campusId === row.campusId);
  const otherCampus = sameGrade.filter((classroom) => classroom.campusId !== row.campusId);
  const campuses = options.campuses.filter((campus) =>
    otherCampus.some((classroom) => classroom.campusId === campus.campusId),
  );
  const campusClassrooms = otherCampus.filter((classroom) => String(classroom.campusId) === campusId);

  useEffect(() => {
    let cancelled = false;

    service
      .getEvents(row.enrollmentId)
      .then((list) => {
        if (!cancelled) setEvents({ key: eventsKey, list: list ?? [] });
      })
      .catch(() => {
        if (!cancelled) setEvents({ key: eventsKey, list: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [row.enrollmentId, eventsKey]);

  const choose = (value) => {
    setAction(value);
    setCampusId("");
    setClassroomId("");
    setReason("");
    setNote("");
    setError(null);
  };

  const complete = action === "WITHDRAWAL" ? reason !== "" : classroomId !== "";

  const submit = async () => {
    const cleanNote = note.trim() === "" ? null : note.trim();

    setBusy(true);
    setError(null);

    try {
      if (action === "CLASSROOM") await service.changeClassroom(row.enrollmentId, Number(classroomId), cleanNote);
      if (action === "CAMPUS") await service.transferCampus(row.enrollmentId, Number(classroomId), cleanNote);
      if (action === "WITHDRAWAL") await service.withdraw(row.enrollmentId, reason, cleanNote);

      setBusy(false);
      setAction(null);
      onDone(chosen.done);
    } catch (err) {
      setError(err.message ?? "No fue posible registrar la novedad.");
      setBusy(false);
    }
  };

  const print = async (eventId) => {
    const target = openCertificateWindow();

    if (!target) {
      notify("El navegador bloqueó la ventana de la constancia. Permite las ventanas emergentes.", "error");
      return;
    }

    try {
      printCertificate(target, await service.getCertificate(eventId));
    } catch (err) {
      target.close();
      notify(err.message ?? "No fue posible generar la constancia.", "error");
    }
  };

  let footer = null;

  if (active && canExecute && chosen) {
    footer = (
      <>
        <p className={styles.hint}>{chosen.prompt}</p>

        {action === "CLASSROOM" && (
          <Field label="Curso de destino">
            <TextField
              select
              fullWidth
              size="small"
              value={classroomId}
              onChange={(event) => setClassroomId(event.target.value)}
              disabled={busy}
              slotProps={selectProps("Curso de destino")}
            >
              <option value="">Selecciona un curso</option>
              {sameCampus.map((classroom) => (
                <option key={classroom.classroomId} value={classroom.classroomId}>
                  {classroom.name}
                </option>
              ))}
            </TextField>
          </Field>
        )}

        {action === "CAMPUS" && (
          <>
            <Field label="Sede de destino">
              <TextField
                select
                fullWidth
                size="small"
                value={campusId}
                onChange={(event) => {
                  setCampusId(event.target.value);
                  setClassroomId("");
                }}
                disabled={busy}
                slotProps={selectProps("Sede de destino")}
              >
                <option value="">Selecciona una sede</option>
                {campuses.map((campus) => (
                  <option key={campus.campusId} value={campus.campusId}>
                    {campus.name}
                  </option>
                ))}
              </TextField>
            </Field>

            <Field label="Curso de destino">
              <TextField
                select
                fullWidth
                size="small"
                value={classroomId}
                onChange={(event) => setClassroomId(event.target.value)}
                disabled={busy || campusId === ""}
                slotProps={selectProps("Curso de destino")}
              >
                <option value="">Selecciona un curso</option>
                {campusClassrooms.map((classroom) => (
                  <option key={classroom.classroomId} value={classroom.classroomId}>
                    {classroom.name}
                  </option>
                ))}
              </TextField>
            </Field>
          </>
        )}

        {action === "WITHDRAWAL" && (
          <Field label="Motivo del retiro (catálogo SIMAT)">
            <TextField
              select
              fullWidth
              size="small"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={busy}
              slotProps={selectProps("Motivo del retiro")}
            >
              <option value="">Selecciona un motivo</option>
              {options.withdrawalReasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </TextField>
          </Field>
        )}

        <Field label="Nota (opcional)">
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

        <div className={ui.panelActions}>
          <Button onClick={() => choose(null)} disabled={busy}>
            Volver
          </Button>
          <Button
            variant="contained"
            color={action === "WITHDRAWAL" ? "error" : "primary"}
            onClick={submit}
            disabled={busy || !complete}
          >
            {busy ? "Guardando…" : chosen.action}
          </Button>
        </div>
      </>
    );
  } else if (active && canExecute) {
    footer = (
      <div className={ui.panelActions}>
        <Button color="error" onClick={() => choose("WITHDRAWAL")} sx={{ marginRight: "auto" }}>
          Retirar
        </Button>
        <span title={campuses.length === 0 ? `No hay cursos de ${row.gradeName} en otra sede.` : undefined}>
          <Button variant="outlined" onClick={() => choose("CAMPUS")} disabled={campuses.length === 0}>
            Cambiar de sede
          </Button>
        </span>
        <span title={sameCampus.length === 0 ? `No hay otro curso de ${row.gradeName} en esta sede.` : undefined}>
          <Button variant="contained" onClick={() => choose("CLASSROOM")} disabled={sameCampus.length === 0}>
            Cambiar de curso
          </Button>
        </span>
      </div>
    );
  } else if (active) {
    footer = <p className={styles.hint}>Las novedades las ejecuta Coordinación Académica.</p>;
  }

  return (
    <SidePanel
      open
      busy={busy}
      onClose={onClose}
      title={row.studentName}
      subtitle={
        <>
          <StatusMark label={info.label} color={info.color} />
          {row.statusReason && <div>Motivo: {row.statusReason}</div>}
        </>
      }
      footer={footer}
    >
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Matrícula {row.yearId}</h3>
        <dl className={styles.facts}>
          <dt>Documento</dt>
          <dd>{row.document}</dd>
          <dt>Código</dt>
          <dd>{row.studentCode}</dd>
          <dt>Grado</dt>
          <dd>{row.gradeName}</dd>
          <dt>Curso</dt>
          <dd>{row.classroomName}</dd>
          <dt>Sede</dt>
          <dd>{row.campusName}</dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Historial de novedades</h3>

        {loadingEvents && <p className={styles.hint}>Cargando…</p>}

        {!loadingEvents && events.list.length === 0 && (
          <p className={styles.hint}>Sin cambios de curso, de sede ni retiro en este año.</p>
        )}

        {!loadingEvents && events.list.length > 0 && (
          <ol className={styles.timeline}>
            {events.list.map((event) => (
              <li key={event.enrollmentEventId} className={styles.timelineItem}>
                <span
                  className={styles.timelineDot}
                  style={{ backgroundColor: EVENT_COLOR[event.type] ?? "#6b7280" }}
                  aria-hidden="true"
                />
                <div className={styles.timelineTitle}>{eventTitle(event)}</div>
                <div className={styles.timelineMeta}>
                  {event.userName}, {formatDateTime(event.createdAt)}
                </div>
                {event.note && <p className={styles.timelineNote}>{event.note}</p>}
                {event.type === "CAMPUS" && (
                  <button type="button" className={styles.linkButton} onClick={() => print(event.enrollmentEventId)}>
                    Imprimir constancia
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </SidePanel>
  );
};

export default MovementPanel;
