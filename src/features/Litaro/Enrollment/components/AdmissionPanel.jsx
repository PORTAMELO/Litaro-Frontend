import { Fragment, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "@/shared/components/Ui/Ui.module.css";
import * as service from "../services/EnrollmentService";
import SidePanel from "@/shared/components/Ui/SidePanel";
import { Field, StatusMark } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import AdmissionForm from "./AdmissionForm";
import DocumentChecklist from "./DocumentChecklist";
import { ADMISSION_STATUS, ageAt, formatDate, formatDateTime, todayInColombia } from "../utils/EnrollmentUtils";
import { C600_FIELDS, optionLabel } from "../utils/EnrollmentForm";
import { colors } from "@/shared/styles/tokens";

const DECISIONS = {
  APPROVED: {
    action: "Aprobar",
    prompt: "Se crean las cuentas del estudiante y del acudiente, y se avisa a Secretaría para registrarlo en el SIMAT.",
    label: "Nota (opcional)",
    required: false,
    done: "Admisión aprobada. Se crearon las cuentas y Secretaría recibió el aviso.",
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

const eventTitle = (event) =>
  event.fromStatus && event.fromStatus === event.toStatus
    ? "Solicitud actualizada"
    : (EVENT_TITLE[event.toStatus] ?? event.toStatus);

const AdmissionPanel = ({ row, options, canDecide, canCreate, onClose, onDecided, onChanged, notify }) => {
  const [events, setEvents] = useState({ key: null, list: [] });
  const [action, setAction] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [version, setVersion] = useState(0);
  const [override, setOverride] = useState(null);
  const [docsChanged, setDocsChanged] = useState(false);

  const id = row.admissionRequestId;
  const eventsKey = `${id}|${row.status}|${version}`;
  const loadingEvents = events.key !== eventsKey;
  const info = ADMISSION_STATUS[row.status] ?? { label: row.status, color: colors.textMuted };
  const decidable = row.status === "PENDING" || row.status === "WAITLIST";
  const decision = action ? DECISIONS[action] : null;

  const { data } = useLoad(() => service.getAdmission(id), [id, version]);
  const detail = data?.summary?.admissionRequestId === id ? data : null;
  const checklist = override?.version === version ? override.value : (detail?.documents ?? null);
  const catalogs = options?.catalogs;
  const complete = detail ? detail.complete : row.complete;

  useEffect(() => {
    let cancelled = false;

    service
      .getAdmissionEvents(id)
      .then((list) => {
        if (!cancelled) setEvents({ key: eventsKey, list: list ?? [] });
      })
      .catch(() => {
        if (!cancelled) setEvents({ key: eventsKey, list: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [id, eventsKey]);

  const close = () => {
    if (docsChanged) onChanged();
    onClose();
  };

  if (editing) {
    return (
      <AdmissionForm
        yearId={row.yearId}
        options={options}
        admissionId={id}
        canManageDocuments={canCreate}
        onClose={() => {
          setEditing(false);
          setVersion((current) => current + 1);
        }}
        onSaved={() => {
          setEditing(false);
          setVersion((current) => current + 1);
        }}
        onChanged={onChanged}
        notify={notify}
      />
    );
  }

  const choose = (value) => {
    setAction(value);
    setNote("");
    setError(null);
  };

  const submit = async () => {
    setBusy(true);
    setError(null);

    try {
      await service.decideAdmission(id, action, note.trim() === "" ? null : note.trim());
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

        <div className={ui.panelActions}>
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
      <>
        {!complete && <p className={styles.hint}>Falta completar el formulario para poder aprobar.</p>}
        <div className={ui.panelActions}>
          <Button color="error" onClick={() => choose("REJECTED")} sx={{ marginRight: "auto" }}>
            Rechazar
          </Button>
          {row.status !== "WAITLIST" && (
            <Button variant="outlined" onClick={() => choose("WAITLIST")}>
              Lista de espera
            </Button>
          )}
          <Button variant="contained" onClick={() => choose("APPROVED")} disabled={!complete}>
            Aprobar
          </Button>
        </div>
      </>
    );
  } else if (decidable) {
    footer = <p className={styles.hint}>La decisión la toma el Rector.</p>;
  }

  const today = todayInColombia();
  const student = detail?.student;
  const guardian = detail?.guardian;
  const campus = (options?.campuses ?? []).find((item) => String(item.campusId) === String(student?.campusId));

  return (
    <SidePanel
      open
      busy={busy}
      onClose={close}
      title={`${row.firstName} ${row.lastName}`}
      subtitle={
        <>
          <StatusMark label={info.label} color={info.color} />
          {row.waitlistPosition && <div>Puesto {row.waitlistPosition} en su grado</div>}
        </>
      }
      footer={footer}
    >
      {canCreate && decidable && (
        <Button variant="outlined" size="small" onClick={() => setEditing(true)} sx={{ alignSelf: "flex-start" }}>
          Editar
        </Button>
      )}

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
          {detail && (
            <>
              <dt>Género</dt>
              <dd>{optionLabel(catalogs?.genders, student.gender)}</dd>
              <dt>Tipo de sangre</dt>
              <dd>{optionLabel(catalogs?.bloodTypes, student.bloodType)}</dd>
              <dt>EPS</dt>
              <dd>{optionLabel(catalogs?.eps, student.eps)}</dd>
              <dt>Correo</dt>
              <dd>{student.email || "—"}</dd>
              <dt>Sede</dt>
              <dd>{campus?.name ?? "—"}</dd>
            </>
          )}
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Acudiente</h3>
        <dl className={styles.facts}>
          <dt>Nombre</dt>
          <dd>{row.guardianName}</dd>
          <dt>Teléfono</dt>
          <dd>{row.guardianPhone}</dd>
          {detail && (
            <>
              <dt>Documento</dt>
              <dd>{guardian.documentNumber ? `${guardian.documentType} ${guardian.documentNumber}` : "—"}</dd>
              <dt>Parentesco</dt>
              <dd>{optionLabel(catalogs?.relationships, guardian.relationship)}</dd>
              <dt>Dirección</dt>
              <dd>{guardian.address || "—"}</dd>
              <dt>Correo</dt>
              <dd>{guardian.email || "—"}</dd>
            </>
          )}
        </dl>
      </section>

      {detail && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>DANE C-600</h3>
          <dl className={styles.facts}>
            {C600_FIELDS.map(({ field, catalog, label }) => (
              <Fragment key={field}>
                <dt>{label}</dt>
                <dd>{optionLabel(catalogs?.[catalog], detail.c600[field])}</dd>
              </Fragment>
            ))}
          </dl>
        </section>
      )}

      {row.notes && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Observaciones</h3>
          <p className={styles.hint}>{row.notes}</p>
        </section>
      )}

      <DocumentChecklist
        checklist={checklist}
        canManage={canCreate && row.status !== "REJECTED"}
        upload={(detailId, file) => service.uploadAdmissionDocument(id, detailId, file)}
        remove={(detailId) => service.deleteAdmissionDocument(id, detailId)}
        open={(detailId) => service.downloadAdmissionDocument(id, detailId)}
        onChange={(value) => {
          setOverride({ version, value });
          setDocsChanged(true);
        }}
        notify={notify}
      />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Historial</h3>

        {loadingEvents ? (
          <p className={styles.hint}>Cargando…</p>
        ) : (
          <ol className={styles.timeline}>
            {[...events.list].reverse().map((event, index) => {
              const eventInfo = ADMISSION_STATUS[event.toStatus] ?? { color: colors.textMuted };
              const showNote = event.note && !(event.toStatus === "PENDING" && !event.fromStatus);

              return (
                <li key={`${event.createdAt}-${index}`} className={styles.timelineItem}>
                  <span
                    className={styles.timelineDot}
                    style={{ backgroundColor: eventInfo.color }}
                    aria-hidden="true"
                  />
                  <div className={styles.timelineTitle}>{eventTitle(event)}</div>
                  <div className={styles.timelineMeta}>
                    {event.userName}, {formatDateTime(event.createdAt)}
                  </div>
                  {showNote && event.fromStatus !== event.toStatus && <p className={styles.timelineNote}>{event.note}</p>}
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
