import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Autocomplete,
} from "@mui/material";

import * as service from "../services/AdministrationService";

const DynamicForm = ({ open, title, schema, record, onClose, onSave }) => {
  const [form, setForm] = useState({});
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [fkOptions, setFkOptions] = useState({});

  useEffect(() => {
    if (record) {
      const initialForm = {};

      schema.forEach((column) => {
        const fieldName = column.columnName.charAt(0).toLowerCase() + column.columnName.slice(1);

        initialForm[fieldName] = record[fieldName] ?? "";
      });

      setForm(initialForm);
    } else {
      setForm({});
    }
  }, [record, schema]);

  useEffect(() => {
    if (!open) {
      setForm({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const characteristicIds = [
      ...new Set(
        schema
          .filter((column) => column.characteristicId)
          .map((column) => column.characteristicId)
      ),
    ];

    characteristicIds.forEach((characteristicId) => {
      if (characteristicOptions[characteristicId]) return;

      service.getCharacteristicDetails(characteristicId).then((details) => {
        setCharacteristicOptions((previous) => ({
          ...previous,
          [characteristicId]: details,
        }));
      });
    });
  }, [open, schema]);

  useEffect(() => {
    if (!open) return;

    const tables = [
      ...new Set(
        schema
          .filter((column) => column.foreignKeyTable && !column.characteristicId)
          .map((column) => column.foreignKeyTable)
      ),
    ];

    tables.forEach((table) => {
      if (fkOptions[table]) return;

      service.getLookupOptions(table).then((options) => {
        setFkOptions((previous) => ({ ...previous, [table]: options }));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, schema]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave?.(form);
  };

  const getFieldName = (columnName) => {
    return columnName.charAt(0).toLowerCase() + columnName.slice(1);
  };

  const getInputType = (dataType) => {
    switch (dataType) {
      case "integer":
      case "numeric":
      case "decimal":
      case "double precision":
        return "number";

      case "date":
        return "date";

      case "timestamp with time zone":
      case "timestamp without time zone":
        return "datetime-local";

      default:
        return "text";
    }
  };

  const isBoolean = (column) => {
    return column.dataType === "boolean";
  };

  const visibleSchema = schema.filter(
    (column) => column.columnName !== "CreationDate" && column.visible !== false && !column.isIdentity
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: "var(--space-lg)",
          pt: "var(--space-lg)",
          pb: "var(--space-sm)",
          fontFamily: "Nunito, sans-serif",
          fontSize: "var(--text-xl)",
          fontWeight: "var(--font-bold)",
          color: "var(--color-text)",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          px: "var(--space-lg)",
          py: "var(--space-md)",
        }}
      >
        <Stack spacing={1.5}>
          {visibleSchema.map((column) => {
            const field = getFieldName(column.columnName);
            const value = form[field];
            const label = column.alias || column.columnName;

            if (isBoolean(column)) {
              return (
                <FormControlLabel
                  key={column.columnName}
                  control={
                    <Switch checked={Boolean(value)} onChange={(event) => handleChange(field, event.target.checked)} />
                  }
                  label={label}
                />
              );
            }

            if (column.characteristicId) {
              const options = characteristicOptions[column.characteristicId] ?? [];

              return (
                <TextField
                  key={column.columnName}
                  select
                  label={label}
                  value={value ?? ""}
                  fullWidth
                  size="small"
                  disabled={options.length === 0}
                  helperText={options.length === 0 ? "Cargando opciones…" : undefined}
                  onChange={(event) => handleChange(field, event.target.value)}
                >
                  {options.map((option) => (
                    <MenuItem key={option.characteristicDetailId} value={option.valor}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            if (column.foreignKeyTable) {
              const options = fkOptions[column.foreignKeyTable] ?? [];
              const selected = options.find((option) => String(option.id) === String(value ?? "")) ?? null;

              return (
                <Autocomplete
                  key={column.columnName}
                  options={options}
                  value={selected}
                  getOptionLabel={(option) => option.label ?? ""}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  onChange={(_, option) => handleChange(field, option ? option.id : "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={label}
                      size="small"
                      placeholder="Buscar…"
                      helperText={options.length === 0 ? "Cargando opciones…" : undefined}
                    />
                  )}
                  fullWidth
                />
              );
            }

            return (
              <TextField
                key={column.columnName}
                label={label}
                value={value ?? ""}
                type={getInputType(column.dataType)}
                fullWidth
                size="small"
                onChange={(event) => handleChange(field, event.target.value)}
                slotProps={{
                  inputLabel:
                    getInputType(column.dataType) === "date" || getInputType(column.dataType) === "datetime-local"
                      ? { shrink: true }
                      : undefined,
                }}
              />
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: "var(--space-lg)",
          pb: "var(--space-lg)",
          gap: "var(--space-xs)",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            setForm({});
            onClose();
          }}
          size="small"
          sx={{
            borderRadius: "var(--radius-md)",
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: "var(--font-semibold)",
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          sx={{
            borderRadius: "var(--radius-md)",
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: "var(--font-semibold)",
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicForm;