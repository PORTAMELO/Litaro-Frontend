import { useState } from "react";
import { Button, TextField } from "@mui/material";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import styles from "../Grades.module.css";
import * as service from "../services/GradingService";
import { fromColombiaInput, toColombiaInput } from "../utils/GradingUtils";

const DeadlinesTab = ({ options, can, notify }) => {
  const yearId = options.yearId;
  const { data, error } = useLoad(() => service.getDeadlines(yearId), [yearId], Boolean(yearId));
  const [saved, setSaved] = useState(null);

  const deadlines = saved ?? data;

  if (!yearId) return <EmptyState title="No hay un año académico activo" />;
  if (error) return <p className={page.message}>{error}</p>;
  if (!deadlines) return <TableSkeleton rows={6} columns={3} />;

  return (
    <DeadlinesForm
      key={JSON.stringify(deadlines)}
      deadlines={deadlines}
      canEdit={can("GradeSettings", "update")}
      notify={notify}
      onSaved={setSaved}
    />
  );
};

const DeadlinesForm = ({ deadlines, canEdit, notify, onSaved }) => {
  const [planner, setPlanner] = useState(() => toColombiaInput(deadlines.plannerDueAt));
  const [locks, setLocks] = useState(() =>
    Object.fromEntries(deadlines.periods.map((period) => [period.periodId, toColombiaInput(period.designLockAt)])),
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);

    try {
      const result = await service.saveDeadlines({
        yearId: deadlines.yearId,
        plannerDueAt: fromColombiaInput(planner),
        periods: deadlines.periods.map((period) => ({
          periodId: period.periodId,
          periodNumber: period.periodNumber,
          designLockAt: fromColombiaInput(locks[period.periodId]),
        })),
      });
      notify("Parámetros guardados.");
      onSaved(result);
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar los parámetros.", "error");
      setSaving(false);
    }
  };

  const input = (label, value, onChange) => (
    <TextField
      type="datetime-local"
      size="small"
      className={styles.dateInput}
      disabled={!canEdit || saving}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ htmlInput: { "aria-label": label } }}
    />
  );

  return (
    <div className={page.card}>
      <div className={styles.settingGroup}>
        <div className={styles.settingGroupTitle}>Plan de estudio</div>

        <label className={styles.settingRow}>
          <span>Fecha límite de entrega</span>
          {input("Fecha límite de entrega", planner, setPlanner)}
        </label>
      </div>

      <div className={styles.settingGroup}>
        <div className={styles.settingGroupTitle}>Bloqueo del diseño de notas</div>

        {deadlines.periods.length === 0 && (
          <p className={styles.mutedText}>El año {deadlines.yearId} no tiene periodos académicos.</p>
        )}

        {deadlines.periods.map((period) => (
          <label key={period.periodId} className={styles.settingRow}>
            <span>Periodo {period.periodNumber}</span>
            {input(`Periodo ${period.periodNumber}`, locks[period.periodId] ?? "", (value) =>
              setLocks((current) => ({ ...current, [period.periodId]: value })),
            )}
          </label>
        ))}
      </div>

      {canEdit && (
        <div className={styles.footerActions}>
          <Button variant="contained" onClick={save} disabled={saving}>
            Guardar
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeadlinesTab;
