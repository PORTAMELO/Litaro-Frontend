import { useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "../Schedule.module.css";
import ConfirmDialog from "./ConfirmDialog";

const buttonSx = {
  borderRadius: "var(--radius-md)",
  textTransform: "none",
  fontFamily: "inherit",
  fontWeight: "var(--font-semibold)",
};

const CatalogSection = ({
  title,
  subtitle,
  info,
  columns,
  rows,
  rowKey,
  fields: allFields,
  emptyForm,
  toForm,
  addLabel = "Agregar",
  editLabel = "Editar",
  deleteText,
  emptyText = "No hay registros.",
  permissions,
  onSave,
  onDelete,
  notify,
  notifyError,
}) => {
  const [dialog, setDialog] = useState({ open: false, row: null });
  const [form, setForm] = useState(emptyForm ?? {});
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const fields = dialog.row ? allFields.filter((field) => !field.createOnly) : allFields;

  const openDialog = (row = null) => {
    setForm(row ? toForm(row) : { ...emptyForm });
    setTouched(false);
    setDialog({ open: true, row });
  };

  const closeDialog = () => setDialog({ open: false, row: null });

  const errorOf = (field) => {
    const value = form[field.name];
    if (field.required && (value === "" || value === null || value === undefined)) return "Campo obligatorio";
    if (field.type === "number" && value !== "" && value !== null) {
      if (field.min !== undefined && Number(value) < field.min) return `Mínimo ${field.min}`;
      if (field.max !== undefined && Number(value) > field.max) return `Máximo ${field.max}`;
    }
    return "";
  };

  const handleSubmit = async () => {
    setTouched(true);
    if (fields.some((field) => errorOf(field))) return;

    setSaving(true);
    try {
      await onSave(dialog.row, form);
      notify({ severity: "success", message: dialog.row ? "Cambios guardados correctamente." : "Registro agregado correctamente." });
      closeDialog();
    } catch (error) {
      notifyError(error, "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const row = confirm;
    setConfirm(null);
    try {
      await onDelete(row);
      notify({ severity: "success", message: "Registro eliminado correctamente." });
    } catch (error) {
      notifyError(error, "No se pudo eliminar");
    }
  };

  const renderField = (field) => {
    const error = touched ? errorOf(field) : "";
    const common = {
      label: field.label,
      size: "small",
      fullWidth: true,
      error: Boolean(error),
      helperText: error || field.helper || " ",
    };
    const setValue = (value) => setForm((prev) => ({ ...prev, [field.name]: value }));

    if (field.type === "suggest") {
      return (
        <Autocomplete
          key={field.name}
          freeSolo
          options={field.options}
          value={form[field.name] ?? ""}
          onInputChange={(_, value) => setValue(value)}
          renderInput={(params) => <TextField {...params} {...common} />}
        />
      );
    }

    if (field.type === "select") {
      return (
        <TextField key={field.name} {...common} select value={form[field.name] ?? ""} onChange={(e) => setValue(e.target.value)}>
          {field.emptyLabel && (
            <MenuItem value="">
              <em>{field.emptyLabel}</em>
            </MenuItem>
          )}
          {field.options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        key={field.name}
        {...common}
        type={field.type === "time" ? "time" : field.type === "number" ? "number" : "text"}
        value={form[field.name] ?? ""}
        onChange={(e) => setValue(e.target.value)}
        slotProps={{
          inputLabel: field.type === "time" ? { shrink: true } : undefined,
          htmlInput: field.type === "time" ? { step: 300 } : { min: field.min, max: field.max },
        }}
      />
    );
  };

  const hasActions = permissions.update || (permissions.delete && onDelete);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <Typography className={styles.cardTitle}>{title}</Typography>
          {subtitle && <Typography className={styles.cardSubtitle}>{subtitle}</Typography>}
        </div>
        {permissions.create && (
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => openDialog()} sx={buttonSx}>
            {addLabel}
          </Button>
        )}
      </div>

      {info && (
        <Alert severity="info" variant="outlined" sx={{ m: "var(--space-md) var(--space-lg) 0", fontSize: "var(--text-sm)" }}>
          {info}
        </Alert>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.label}>{column.label}</th>
              ))}
              {hasActions && <th className={styles.actionsColumn}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column, index) => (
                  <td key={column.label} className={index === 0 ? styles.strongCell : undefined}>
                    {column.render(row)}
                  </td>
                ))}
                {hasActions && (
                  <td>
                    <div className={styles.iconActions}>
                      {permissions.update && (
                        <Tooltip title={editLabel}>
                          <IconButton size="small" color="primary" onClick={() => openDialog(row)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {permissions.delete && onDelete && (
                        <Tooltip title={deleteText?.tooltip ?? "Eliminar"}>
                          <IconButton size="small" color="error" onClick={() => setConfirm(row)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)} className={styles.emptyCell}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialog.open}
        onClose={saving ? undefined : closeDialog}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" } } }}
      >
        <DialogTitle sx={{ fontFamily: "Nunito, sans-serif", fontWeight: "var(--font-bold)", fontSize: "var(--text-xl)" }}>
          {dialog.row ? `${editLabel} · ${title}` : `${addLabel} · ${title}`}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pt: 1 }}>
            {fields.map(renderField)}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: "var(--space-lg)", pb: "var(--space-lg)" }}>
          <Button variant="outlined" size="small" onClick={closeDialog} disabled={saving} sx={buttonSx}>
            Cancelar
          </Button>
          <Button variant="contained" size="small" onClick={handleSubmit} disabled={saving} sx={buttonSx}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={deleteText?.title ?? "Eliminar registro"}
        message={confirm ? (deleteText?.message?.(confirm) ?? "¿Está seguro de eliminar este registro?") : ""}
        confirmText={deleteText?.confirm ?? "Eliminar"}
        onConfirm={handleDelete}
        onClose={() => setConfirm(null)}
      />
    </section>
  );
};

export default CatalogSection;
