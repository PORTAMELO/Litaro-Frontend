import { useState } from "react";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";

import SidePanel from "@/shared/components/Ui/SidePanel";
import { Field } from "@/shared/components/Ui/Ui";
import ui from "@/shared/components/Ui/Ui.module.css";
import styles from "../Grades.module.css";
import * as service from "../services/YearClosingService";

const NUMBERS = [
  { name: "period1Weight", label: "Peso del periodo 1 (%)" },
  { name: "period2Weight", label: "Peso del periodo 2 (%)" },
  { name: "period3Weight", label: "Peso del periodo 3 (%)" },
  { name: "exceptionMinGrade", label: "Nota mínima de la asignatura perdida" },
  { name: "exceptionRestAverage", label: "Promedio mínimo de las demás áreas" },
  { name: "exceptionAttendancePercent", label: "Asistencia mínima del año (%)" },
  { name: "piarLostAreas", label: "Áreas perdidas para reprobar con PIAR" },
];

const toNumber = (text) => Number(String(text).replace(",", "."));

const PromotionSettingsPanel = ({ settings, subjects, canEdit, notify, onClose, onSaved }) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(NUMBERS.map((item) => [item.name, String(settings[item.name])])),
  );
  const [fundamental, setFundamental] = useState(settings.fundamentalSubjectIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const valid = NUMBERS.every((item) => values[item.name].trim() !== "" && Number.isFinite(toNumber(values[item.name])));

  const toggle = (subjectId) =>
    setFundamental((current) =>
      current.includes(subjectId) ? current.filter((id) => id !== subjectId) : [...current, subjectId],
    );

  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      const saved = await service.saveSettings({
        ...Object.fromEntries(NUMBERS.map((item) => [item.name, toNumber(values[item.name])])),
        fundamentalSubjectIds: fundamental,
      });
      notify("Parámetros de promoción guardados.");
      onSaved(saved);
    } catch (failure) {
      setError(failure.message ?? "No fue posible guardar los parámetros.");
      setSaving(false);
    }
  };

  return (
    <SidePanel
      open
      busy={saving}
      onClose={onClose}
      title="Parámetros de promoción"
      subtitle="Valores del SIEE que usa el cierre de año."
      footer={
        canEdit && (
          <div className={ui.panelActions}>
            <Button onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={save} disabled={saving || !valid}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        )
      }
    >
      <div className={styles.settingsStack}>
        {NUMBERS.map((item) => (
          <Field key={item.name} label={item.label}>
            <TextField
              size="small"
              fullWidth
              value={values[item.name]}
              onChange={(event) => setValues((current) => ({ ...current, [item.name]: event.target.value }))}
              disabled={!canEdit || saving}
              slotProps={{ htmlInput: { inputMode: "decimal", "aria-label": item.label } }}
            />
          </Field>
        ))}

        <Field label="Asignaturas fundamentales de 1° y 2°">
          <div className={styles.checkList}>
            {subjects.map((subject) => (
              <FormControlLabel
                key={subject.subjectId}
                label={subject.name}
                control={
                  <Checkbox
                    size="small"
                    checked={fundamental.includes(subject.subjectId)}
                    onChange={() => toggle(subject.subjectId)}
                    disabled={!canEdit || saving}
                  />
                }
              />
            ))}
          </div>
        </Field>

        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    </SidePanel>
  );
};

export default PromotionSettingsPanel;
