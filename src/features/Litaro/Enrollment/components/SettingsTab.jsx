import { useState } from "react";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import styles from "../Enrollment.module.css";
import * as service from "../services/EnrollmentService";
import { EmptyState, TableSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";

const STATES = [
  { value: "OBLIGATORIO", label: "Obligatorio" },
  { value: "OPCIONAL", label: "Opcional" },
  { value: "OCULTO", label: "Oculto" },
];

const SettingsTab = ({ can, notify }) => {
  const { data, error } = useLoad(() => service.getDocumentSettings(), []);
  const [saved, setSaved] = useState(null);

  const items = saved ?? data;

  if (error) return <p className={styles.message}>{error}</p>;
  if (!items) return <TableSkeleton rows={5} columns={2} />;

  return (
    <SettingsForm
      key={JSON.stringify(items)}
      items={items}
      canEdit={can("EnrollmentSettings", "update")}
      notify={notify}
      onSaved={setSaved}
    />
  );
};

const SettingsForm = ({ items, canEdit, notify, onSaved }) => {
  const [rows, setRows] = useState(() => items.map((item, index) => ({ ...item, key: `saved-${item.detailId ?? index}` })));
  const [saving, setSaving] = useState(false);

  const change = (key, field, value) =>
    setRows((current) => current.map((row) => (row.key === key ? { ...row, [field]: value } : row)));

  const add = () =>
    setRows((current) => [
      ...current,
      { key: `new-${Date.now()}`, detailId: null, name: "", state: "OBLIGATORIO", hasFiles: false },
    ]);

  const remove = (key) => setRows((current) => current.filter((row) => row.key !== key));

  const save = async () => {
    setSaving(true);

    try {
      const result = await service.saveDocumentSettings(
        rows.map(({ detailId, name, state, hasFiles }) => ({ detailId, name, state, hasFiles })),
      );
      notify("Parámetros guardados.");
      onSaved(result ?? []);
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar los parámetros.", "error");
      setSaving(false);
    }
  };

  const disabled = !canEdit || saving;
  const incomplete = rows.some((row) => row.name.trim() === "");

  return (
    <div className={styles.card}>
      <div className={styles.settingsBody}>
        <div className={styles.sectionTitle}>Documentos de matrícula</div>

        {rows.length === 0 && <EmptyState title="No hay documentos configurados" />}

        {rows.map((row) => (
          <div key={row.key} className={styles.settingRow}>
            <TextField
              size="small"
              value={row.name}
              disabled={disabled}
              placeholder="Nombre del documento"
              onChange={(event) => change(row.key, "name", event.target.value)}
              slotProps={{ htmlInput: { maxLength: 150, "aria-label": "Nombre del documento" } }}
            />

            <TextField
              select
              size="small"
              value={row.state}
              disabled={disabled}
              onChange={(event) => change(row.key, "state", event.target.value)}
              slotProps={{ select: { native: true }, htmlInput: { "aria-label": `Estado de ${row.name || "documento"}` } }}
            >
              {STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </TextField>

            {canEdit && (
              <Tooltip title={row.hasFiles ? "Tiene archivos cargados" : "Quitar"}>
                <span>
                  <IconButton aria-label="Quitar" size="small" disabled={disabled || row.hasFiles} onClick={() => remove(row.key)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </div>
        ))}

        {canEdit && (
          <button type="button" className={styles.linkButton} onClick={add} disabled={saving}>
            Agregar documento
          </button>
        )}
      </div>

      {canEdit && (
        <div className={styles.cardFooter}>
          <span />
          <Button variant="contained" onClick={save} disabled={saving || incomplete}>
            Guardar
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
