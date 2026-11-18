import { useState } from "react";
import { Button, Checkbox, FormControlLabel, MenuItem, Radio, RadioGroup, TextField } from "@mui/material";

import styles from "../Observations.module.css";
import page from "@/shared/components/Ui/Page.module.css";
import SidePanel from "@/shared/components/Ui/SidePanel";
import ui from "@/shared/components/Ui/Ui.module.css";
import { Field, FieldGroup } from "@/shared/components/Ui/Ui";
import * as service from "../services/ObservationService";
import { DESCRIPTION_LIMIT, TYPES } from "../utils/ObservationUtils";

const formFrom = (observation, today) => ({
  date: observation?.date ?? today,
  isAcademic: observation?.isAcademic ?? false,
  isCoexistence: observation?.isCoexistence ?? false,
  coexistenceType: observation?.coexistenceType ?? "",
  subjectId: observation?.subjectId ?? "",
  description: observation?.description ?? "",
});

const ObservationFormPanel = ({ student, observation, subjects, today, notify, onClose, onSaved }) => {
  const editing = Boolean(observation);
  const [form, setForm] = useState(() => formFrom(observation, today));
  const [saving, setSaving] = useState(false);

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const missingKind = !form.isAcademic && !form.isCoexistence;
  const missingType = form.isCoexistence && !form.coexistenceType;
  const valid = form.date && form.description.trim() && !missingKind && !missingType;
  const toCoordination = form.isCoexistence && ["II", "III"].includes(form.coexistenceType);

  const save = async () => {
    setSaving(true);

    const body = {
      enrollmentId: student.enrollmentId,
      date: form.date,
      description: form.description.trim(),
      isAcademic: form.isAcademic,
      isCoexistence: form.isCoexistence,
      coexistenceType: form.isCoexistence ? form.coexistenceType : null,
      subjectId: form.subjectId === "" ? null : form.subjectId,
    };

    try {
      if (editing) {
        await service.updateObservation(observation.observationId, body);
        notify("Observación actualizada.");
      } else {
        await service.createObservation(body);
        notify("Observación registrada. Se creó la citación al acudiente.");
      }

      onSaved();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar la observación.", "error");
      setSaving(false);
    }
  };

  return (
    <SidePanel
      open
      title={editing ? "Editar observación" : "Nueva observación"}
      subtitle={`${student.studentName} · ${student.classroomName}`}
      busy={saving}
      onClose={onClose}
      footer={
        <div className={ui.panelActions}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={save} disabled={saving || !valid}>
            Guardar
          </Button>
        </div>
      }
    >
      <div className={page.formStack}>
        <Field label="Fecha">
          <TextField
            type="date"
            size="small"
            value={form.date}
            onChange={(event) => change("date", event.target.value)}
            slotProps={{ htmlInput: { max: today } }}
          />
        </Field>

        <FieldGroup label="Tipo de observación">
          <div className={styles.checkRow}>
            <FormControlLabel
              control={<Checkbox checked={form.isAcademic} onChange={(event) => change("isAcademic", event.target.checked)} />}
              label="Académica"
            />
            <FormControlLabel
              control={
                <Checkbox checked={form.isCoexistence} onChange={(event) => change("isCoexistence", event.target.checked)} />
              }
              label="Convivencia"
            />
          </div>
        </FieldGroup>

        {form.isCoexistence && (
          <FieldGroup label="Tipificación">
            <RadioGroup row value={form.coexistenceType} onChange={(event) => change("coexistenceType", event.target.value)}>
              {TYPES.map((type) => (
                <FormControlLabel key={type} value={type} control={<Radio />} label={`Tipo ${type}`} />
              ))}
            </RadioGroup>
          </FieldGroup>
        )}

        <Field label="Materia (opcional)">
          <TextField
            select
            size="small"
            value={form.subjectId}
            onChange={(event) => change("subjectId", event.target.value)}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value="">Sin materia</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.subjectId} value={subject.subjectId}>
                {subject.name}
              </MenuItem>
            ))}
          </TextField>
        </Field>

        <Field label="Descripción">
          <TextField
            multiline
            minRows={4}
            fullWidth
            value={form.description}
            onChange={(event) => change("description", event.target.value.slice(0, DESCRIPTION_LIMIT))}
          />
        </Field>

        {missingKind && <div className={page.notice}>Marque si es académica, de convivencia o ambas.</div>}

        {missingType && (
          <div className={`${page.notice} ${page.noticeError}`}>
            La observación de convivencia debe tener tipificación Tipo I, II o III.
          </div>
        )}

        {!editing && valid && (
          <div className={page.notice}>
            {toCoordination
              ? "Se creará una citación al acudiente a cargo de Coordinación de Convivencia."
              : "Se creará una citación al acudiente a su cargo, pendiente de agendar."}
          </div>
        )}
      </div>
    </SidePanel>
  );
};

export default ObservationFormPanel;
