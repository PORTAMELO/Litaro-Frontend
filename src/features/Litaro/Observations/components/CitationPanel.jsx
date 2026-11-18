import { useState } from "react";
import { Button, Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";

import styles from "../Observations.module.css";
import page from "@/shared/components/Ui/Page.module.css";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";
import SidePanel from "@/shared/components/Ui/SidePanel";
import { Field, FieldGroup, StatusMark, TableSkeleton } from "@/shared/components/Ui/Ui";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useLoad } from "@/shared/hooks/useLoad";
import { formatDate, formatDateTime, todayInColombia } from "@/shared/utils/Dates";
import * as service from "../services/ObservationService";
import {
  CITATION_NOTE_LIMIT,
  dayName,
  formatTime,
  missesText,
  nextDateFor,
  slotLabel,
  statusInfo,
  weekdayOf,
} from "../utils/CitationUtils";

// Fecha y hora de la citación: dentro de una franja de atención a padres si quien
// atiende tiene franjas; si no (coordinación, rectoría), fecha y hora libres.
const ScheduleFields = ({ slots, value, onChange, today }) => {
  const slot = slots.find((item) => item.scheduleId === value.scheduleId);
  const change = (field, next) => onChange({ ...value, [field]: next });

  const chooseSlot = (scheduleId) => {
    const chosen = slots.find((item) => item.scheduleId === scheduleId);
    onChange({
      ...value,
      scheduleId,
      date: chosen ? nextDateFor(chosen.weekday, today) : value.date,
      time: chosen ? formatTime(chosen.startTime) : value.time,
    });
  };

  return (
    <>
      {slots.length > 0 && (
        <Field label="Franja de atención a padres">
          <TextField select size="small" value={value.scheduleId ?? ""} onChange={(event) => chooseSlot(event.target.value)}>
            {slots.map((item) => (
              <MenuItem key={item.scheduleId} value={item.scheduleId}>
                {slotLabel(item)}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      )}

      <div className={styles.dateTimeRow}>
        <Field label="Fecha">
          <TextField
            type="date"
            size="small"
            value={value.date}
            onChange={(event) => change("date", event.target.value)}
            slotProps={{ htmlInput: { min: today, step: slot ? 7 : 1 } }}
          />
        </Field>
        <Field label="Hora">
          <TextField
            type="time"
            size="small"
            value={value.time}
            onChange={(event) => change("time", event.target.value)}
            slotProps={{
              htmlInput: slot ? { min: formatTime(slot.startTime), max: formatTime(slot.endTime) } : {},
            }}
          />
        </Field>
      </div>

      {slot && value.date && weekdayOf(value.date) !== slot.weekday && (
        <div className={`${page.notice} ${page.noticeError}`}>
          La franja elegida es los {dayName(slot.weekday).toLowerCase()}; cambie la fecha.
        </div>
      )}
    </>
  );
};

const scheduleValid = (slots, value) => {
  if (!value.date || !value.time) return false;
  if (slots.length === 0) return true;

  const slot = slots.find((item) => item.scheduleId === value.scheduleId);
  return Boolean(slot) && weekdayOf(value.date) === slot.weekday;
};

const scheduleBody = (slots, value) => ({
  date: value.date,
  time: value.time,
  scheduleId: slots.length > 0 ? value.scheduleId : null,
});

const CitationPanel = ({ citation, canUpdate, notify, onClose, onChanged }) => {
  const today = todayInColombia();
  const manage = canUpdate && citation.canManage;
  const open = ["TO_SCHEDULE", "SCHEDULED"].includes(citation.status);

  const slots = useLoad(() => service.getSlots(citation.responsibleUserId ?? undefined), [citation.citationId], manage && open);
  const parents = useLoad(() => service.getParents(citation.studentId), [citation.citationId], manage && citation.status === "TO_SCHEDULE");

  const [busy, setBusy] = useState(false);
  const [schedule, setSchedule] = useState({ scheduleId: null, date: "", time: "" });
  const [parentId, setParentId] = useState(citation.parentId ?? "");
  const [note, setNote] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [flags, setFlags] = useState({
    studentInformed: citation.studentInformed,
    parentInformed: citation.parentInformed,
    attended: citation.attended,
  });
  const { ask, dialogProps } = useConfirm();

  const status = statusInfo(citation.status);
  const slotList = slots.data ?? [];
  const flagsChanged =
    flags.studentInformed !== citation.studentInformed ||
    flags.parentInformed !== citation.parentInformed ||
    flags.attended !== citation.attended;

  const run = async (action, message) => {
    setBusy(true);

    try {
      await action();
      notify(message);
      onChanged();
      onClose();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar el cambio.", "error");
      setBusy(false);
    }
  };

  const agendar = () =>
    run(
      () =>
        service.scheduleCitation(citation.citationId, {
          ...scheduleBody(slotList, schedule),
          parentId: parentId === "" ? null : parentId,
        }),
      parents.data?.length ? "Citación agendada. Se notificó al acudiente." : "Citación agendada.",
    );

  const reprogramar = () =>
    run(
      () => service.rescheduleCitation(citation.citationId, { ...scheduleBody(slotList, schedule), note: rescheduleNote }),
      citation.parentId ? "Citación reprogramada. Se notificó al acudiente." : "Citación reprogramada.",
    );

  const changeStatus = (next) =>
    ask({
      title: next === "CLOSED" ? "Cerrar citación" : "Cancelar citación",
      message:
        next === "CLOSED"
          ? "La citación queda cerrada y ya no se puede agendar ni reprogramar."
          : "La citación queda cancelada y no cuenta como inasistencia del acudiente.",
      confirmText: next === "CLOSED" ? "Cerrar" : "Cancelar citación",
      action: () =>
        run(
          () => service.setCitationStatus(citation.citationId, { status: next, note }),
          next === "CLOSED" ? "Citación cerrada." : "Citación cancelada.",
        ),
    });

  const loadingTools = manage && open && (!slots.data || (citation.status === "TO_SCHEDULE" && !parents.data));

  return (
    <SidePanel
      open
      title="Citación"
      subtitle={`${citation.studentName} · ${citation.classroomName}`}
      busy={busy}
      onClose={onClose}
    >
      <div className={page.formStack}>
        <section className={styles.detailSection}>
          <div className={styles.detailHead}>
            <StatusMark label={status.label} color={status.color} />
            <span className={page.secondaryText}>
              {citation.origin === "AUTO" ? "Automática por observación" : "Manual"} · {citation.createdBy}
            </span>
          </div>
          <p className={styles.description}>{citation.reason}</p>

          <dl className={styles.facts}>
            <dt>Fecha</dt>
            <dd>
              {citation.scheduledDate
                ? `${dayName(weekdayOf(citation.scheduledDate))} ${formatDate(citation.scheduledDate)}, ${formatTime(citation.scheduledTime)}`
                : "Por agendar"}
            </dd>
            <dt>Atiende</dt>
            <dd>{citation.responsibleName}</dd>
            <dt>Acudiente</dt>
            <dd>
              {citation.parentName ?? "Sin acudiente"}
              {citation.parentConsecutiveMisses > 0 && (
                <span className={styles.warningText}>{missesText(citation.parentConsecutiveMisses)}</span>
              )}
            </dd>
            <dt>Creada</dt>
            <dd>{formatDateTime(citation.createdAt)}</dd>
          </dl>

          {citation.rescheduledFromId && (
            <span className={page.secondaryText}>Reprogramación de una citación anterior.</span>
          )}
          {citation.note && <p className={styles.description}>Nota: {citation.note}</p>}
        </section>

        {loadingTools && <TableSkeleton rows={3} columns={2} />}

        {manage && citation.status === "TO_SCHEDULE" && parents.data && slots.data && (
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Agendar</h3>

            {parents.data.length > 0 ? (
              <Field label="Acudiente citado">
                <TextField select size="small" value={parentId} onChange={(event) => setParentId(event.target.value)}>
                  {parents.data.map((parent) => (
                    <MenuItem key={parent.parentId} value={parent.parentId}>
                      {parent.name} · {parent.relationship}
                      {parent.primaryContact ? " (principal)" : ""}
                    </MenuItem>
                  ))}
                </TextField>
              </Field>
            ) : (
              <div className={page.notice}>
                El estudiante no tiene acudientes vinculados. Se puede agendar, pero nadie recibirá la notificación.
              </div>
            )}

            <ScheduleFields slots={slotList} value={schedule} onChange={setSchedule} today={today} />

            <div className={styles.inlineActions}>
              <Button variant="contained" onClick={agendar} disabled={busy || !scheduleValid(slotList, schedule)}>
                Agendar
              </Button>
            </div>
          </section>
        )}

        {manage && citation.status === "SCHEDULED" && slots.data && (
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Reprogramar</h3>
            <p className={page.secondaryText}>
              Esta citación queda como reprogramada y se crea una nueva con la fecha elegida.
            </p>

            <ScheduleFields slots={slotList} value={schedule} onChange={setSchedule} today={today} />

            <Field label="Motivo de la reprogramación (opcional)">
              <TextField
                size="small"
                placeholder="Ej.: el acudiente no pudo asistir"
                value={rescheduleNote}
                onChange={(event) => setRescheduleNote(event.target.value.slice(0, CITATION_NOTE_LIMIT))}
              />
            </Field>

            <div className={styles.inlineActions}>
              <Button onClick={reprogramar} disabled={busy || !scheduleValid(slotList, schedule)}>
                Reprogramar
              </Button>
            </div>
          </section>
        )}

        {manage && citation.status !== "CANCELLED" && citation.status !== "RESCHEDULED" && (
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Seguimiento</h3>
            <FieldGroup label="Casillas">
              <div className={styles.checkRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={flags.studentInformed}
                      onChange={(event) => setFlags({ ...flags, studentInformed: event.target.checked })}
                    />
                  }
                  label="Estudiante enterado"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={flags.parentInformed}
                      onChange={(event) => setFlags({ ...flags, parentInformed: event.target.checked })}
                    />
                  }
                  label="Acudiente enterado"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={flags.attended}
                      disabled={!citation.scheduledDate}
                      onChange={(event) => setFlags({ ...flags, attended: event.target.checked })}
                    />
                  }
                  label="Asistió"
                />
              </div>
            </FieldGroup>
            <div className={styles.inlineActions}>
              <Button
                onClick={() => run(() => service.setCitationFlags(citation.citationId, flags), "Seguimiento guardado.")}
                disabled={busy || !flagsChanged}
              >
                Guardar casillas
              </Button>
            </div>
          </section>
        )}

        {!manage && (
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Seguimiento</h3>
            <p className={page.secondaryText}>
              Estudiante enterado: {citation.studentInformed ? "sí" : "no"} · Acudiente enterado:{" "}
              {citation.parentInformed ? "sí" : "no"} · Asistió: {citation.attended ? "sí" : "no"}
            </p>
          </section>
        )}

        {manage && open && (
          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>{citation.status === "SCHEDULED" ? "Cerrar o cancelar" : "Cancelar"}</h3>
            <Field label="Nota (opcional)">
              <TextField
                size="small"
                value={note}
                onChange={(event) => setNote(event.target.value.slice(0, CITATION_NOTE_LIMIT))}
              />
            </Field>
            <div className={styles.inlineActions}>
              <Button color="error" onClick={() => changeStatus("CANCELLED")} disabled={busy}>
                Cancelar citación
              </Button>
              {citation.status === "SCHEDULED" && (
                <Button variant="contained" onClick={() => changeStatus("CLOSED")} disabled={busy}>
                  Cerrar citación
                </Button>
              )}
            </div>
          </section>
        )}
      </div>

      <ConfirmDialog {...dialogProps} />
    </SidePanel>
  );
};

export default CitationPanel;
