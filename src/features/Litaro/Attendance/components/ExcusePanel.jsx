import { useState } from "react";
import { Button, TextField } from "@mui/material";

import page from "../../../../shared/components/Ui/Page.module.css";
import SidePanel from "../../../../shared/components/Ui/SidePanel";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import { Field, FieldGroup } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import { formatDate } from "../../../../shared/utils/Dates";
import * as service from "../services/AttendanceService";
import { REASON_LIMIT, localDateTime } from "../utils/AttendanceUtils";
import StudentSearch from "./StudentSearch";

const ExcusePanel = ({ today, notify, onClose, onSaved }) => {
  const [student, setStudent] = useState(null);
  const [range, setRange] = useState({ fromDate: today, fromTime: "06:00", toDate: today, toTime: "18:00" });
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const startAt = localDateTime(range.fromDate, range.fromTime);
  const endAt = localDateTime(range.toDate, range.toTime);
  const complete = Boolean(student && range.fromDate && range.fromTime && range.toDate && range.toTime);
  const ordered = complete && endAt > startAt;

  const body = { studentId: student?.studentId, startAt, endAt, reason: reason.trim() || null };

  const { data: preview } = useLoad(() => service.previewExcuse(body), [student?.studentId, startAt, endAt], ordered);

  const change = (field, value) => setRange((current) => ({ ...current, [field]: value }));

  const save = async () => {
    setSaving(true);

    try {
      await service.createExcuse(body);
      notify("Excusa registrada.");
      onSaved();
    } catch (failure) {
      notify(failure.message ?? "No fue posible registrar la excusa.", "error");
      setSaving(false);
    }
  };

  const expired = ordered && preview?.expired;

  return (
    <SidePanel
      open
      title="Nueva excusa"
      busy={saving}
      onClose={onClose}
      footer={
        <div className={ui.panelActions}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={save} disabled={saving || !ordered || !preview || expired}>
            Guardar
          </Button>
        </div>
      }
    >
      <div className={page.formStack}>
        <FieldGroup label="Estudiante">
          {student ? (
            <div className={page.notice}>
              {student.name} · {student.classroomName}{" "}
              <Button size="small" onClick={() => setStudent(null)} disabled={saving}>
                Cambiar
              </Button>
            </div>
          ) : (
            <StudentSearch placeholder="Nombre, documento o código" actionLabel="Elegir" onPick={setStudent} />
          )}
        </FieldGroup>

        <FieldGroup label="Desde">
          <div className={page.formRow}>
            <TextField
              type="date"
              size="small"
              value={range.fromDate}
              onChange={(event) => change("fromDate", event.target.value)}
              slotProps={{ htmlInput: { "aria-label": "Fecha de inicio" } }}
            />
            <TextField
              type="time"
              size="small"
              value={range.fromTime}
              onChange={(event) => change("fromTime", event.target.value)}
              slotProps={{ htmlInput: { "aria-label": "Hora de inicio" } }}
            />
          </div>
        </FieldGroup>

        <FieldGroup label="Hasta">
          <div className={page.formRow}>
            <TextField
              type="date"
              size="small"
              value={range.toDate}
              onChange={(event) => change("toDate", event.target.value)}
              slotProps={{ htmlInput: { "aria-label": "Fecha de fin" } }}
            />
            <TextField
              type="time"
              size="small"
              value={range.toTime}
              onChange={(event) => change("toTime", event.target.value)}
              slotProps={{ htmlInput: { "aria-label": "Hora de fin" } }}
            />
          </div>
        </FieldGroup>

        <Field label="Motivo">
          <TextField
            multiline
            minRows={2}
            fullWidth
            value={reason}
            onChange={(event) => setReason(event.target.value.slice(0, REASON_LIMIT))}
          />
        </Field>

        {complete && !ordered && (
          <div className={`${page.notice} ${page.noticeError}`}>La fecha de fin debe ser posterior a la de inicio.</div>
        )}

        {ordered && preview && !expired && (
          <div className={page.notice}>
            {preview.absences === 1 ? "1 falta quedará justificada" : `${preview.absences} faltas quedarán justificadas`}
          </div>
        )}

        {expired && (
          <div className={`${page.notice} ${page.noticeError}`}>
            El plazo para presentar esta excusa venció el {formatDate(preview.deadline)}.
          </div>
        )}
      </div>
    </SidePanel>
  );
};

export default ExcusePanel;
