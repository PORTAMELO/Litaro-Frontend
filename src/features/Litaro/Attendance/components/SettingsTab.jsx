import { useState } from "react";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";

import page from "../../../../shared/components/Ui/Page.module.css";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import styles from "../Attendance.module.css";
import * as service from "../services/AttendanceService";

const FIELDS = [
  { name: "lossPercent", label: "Porcentaje de pérdida", step: "0.1" },
  { name: "lossGrade", label: "Nota por pérdida", step: "0.1" },
  { name: "excuseDeadlineDays", label: "Días para presentar excusa", step: "1" },
  { name: "lateCommitmentCount", label: "Tardanzas para compromiso", step: "1" },
  { name: "lateCitationCount", label: "Tardanzas para citación", step: "1" },
  { name: "absenceAlertDays", label: "Días de inasistencia para alerta", step: "1" },
  { name: "nightlyHour", label: "Hora del proceso nocturno", step: "1" },
];

const SettingsTab = ({ can, notify }) => {
  const { data, error, reload } = useLoad(() => service.getSettings(), []);
  const [stamp, setStamp] = useState(0);

  if (error) return <p className={page.message}>{error}</p>;
  if (!data) return <p className={page.message}>Cargando…</p>;

  return (
    <SettingsForm
      key={stamp}
      settings={data.settings}
      gradeLevels={data.gradeLevels}
      canEdit={can("AttendanceSettings", "update")}
      notify={notify}
      onSaved={() => {
        setStamp((current) => current + 1);
        reload();
      }}
    />
  );
};

const SettingsForm = ({ settings, gradeLevels, canEdit, notify, onSaved }) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(FIELDS.map((field) => [field.name, String(settings[field.name])])),
  );
  const [dailyLevels, setDailyLevels] = useState(settings.dailyLevels);
  const [saving, setSaving] = useState(false);

  const levels = [...new Set([...gradeLevels, ...settings.dailyLevels])].sort((a, b) => a.localeCompare(b));
  const complete = FIELDS.every((field) => values[field.name].trim() !== "" && !Number.isNaN(Number(values[field.name])));

  const toggleLevel = (level) =>
    setDailyLevels((current) => (current.includes(level) ? current.filter((item) => item !== level) : [...current, level]));

  const save = async () => {
    setSaving(true);

    try {
      await service.saveSettings({
        ...Object.fromEntries(FIELDS.map((field) => [field.name, Number(values[field.name])])),
        dailyLevels,
      });
      notify("Parámetros guardados.");
      onSaved();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar los parámetros.", "error");
      setSaving(false);
    }
  };

  return (
    <div className={page.card}>
      {FIELDS.map((field) => (
        <label key={field.name} className={styles.settingRow}>
          <span>{field.label}</span>
          <TextField
            type="number"
            size="small"
            className={styles.settingInput}
            disabled={!canEdit || saving}
            value={values[field.name]}
            onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            slotProps={{ htmlInput: { step: field.step, min: 0 } }}
          />
        </label>
      ))}

      <div className={styles.settingGroup} role="group" aria-label="Niveles con lista diaria">
        <div className={styles.settingGroupTitle}>Niveles con lista diaria</div>

        {levels.map((level) => (
          <FormControlLabel
            key={level}
            label={level}
            control={
              <Checkbox
                size="small"
                disabled={!canEdit || saving}
                checked={dailyLevels.includes(level)}
                onChange={() => toggleLevel(level)}
              />
            }
          />
        ))}
      </div>

      {canEdit && (
        <div className={styles.footerActions}>
          <Button variant="contained" onClick={save} disabled={saving || !complete}>
            Guardar
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
