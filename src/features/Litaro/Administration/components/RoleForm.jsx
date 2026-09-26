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
  Alert,
  Autocomplete,
  Typography,
} from "@mui/material";

import * as service from "../services/AdministrationService";

const RoleForm = ({ open, title, fields, roleTableName, students, onClose, onSave, saving, error }) => {
  const [form, setForm] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [columnSchema, setColumnSchema] = useState([]);
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [fkOptions, setFkOptions] = useState({});

  useEffect(() => {
    if (!open) {
      setForm({});
      setSelectedStudents([]);
      return;
    }

    Promise.all([
      roleTableName ? service.getSchema(roleTableName) : Promise.resolve([]),
      service.getSchema("User"),
    ]).then(([ownColumns, userColumns]) => {
      setColumnSchema([...ownColumns, ...userColumns]);
    });
  }, [open, roleTableName]);

  useEffect(() => {
    if (!open) return;

    const characteristicIds = [
      ...new Set(
        columnSchema
          .filter((column) =>
            column.characteristicId &&
            fields.some((field) => field.name.toLowerCase() === column.columnName.toLowerCase())
          )
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, columnSchema, fields]);

  useEffect(() => {
    if (!open) return;

    const tables = [
      ...new Set(
        fields
          .filter((field) => field.type === "foreignKey" && field.foreignKeyTable)
          .map((field) => field.foreignKeyTable)
      ),
    ];

    tables.forEach((table) => {
      if (fkOptions[table]) return;

      service.getLookupOptions(table).then((options) => {
        setFkOptions((previous) => ({ ...previous, [table]: options }));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fields]);

  const getCharacteristicIdFor = (fieldName) => {
    const column = columnSchema.find((c) => c.columnName.toLowerCase() === fieldName.toLowerCase());
    return column?.characteristicId ?? null;
  };

  const handleChange = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = { ...form };

    fields.forEach((field) => {
      if (
        (field.type === "number" || field.type === "foreignKey") &&
        payload[field.name] !== undefined &&
        payload[field.name] !== ""
      ) {
        payload[field.name] = Number(payload[field.name]);
      }
    });

    if (students) {
      payload.studentIds = selectedStudents.map((student) => student.studentId);
    }

    onSave(payload);
  };

  const studentLabel = (student) => {
    const name = `${student.user?.firstName ?? ""} ${student.user?.lastName ?? ""}`.trim();
    return [student.studentCode, name].filter(Boolean).join(" — ");
  };

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
        {error && (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={1.5}>
          {fields.map((field) => {
            const value = form[field.name] ?? "";

            const characteristicId = getCharacteristicIdFor(field.name);

            if (characteristicId) {
              const options = characteristicOptions[characteristicId] ?? [];

              return (
                <TextField
                  key={field.name}
                  select
                  label={field.label}
                  value={value}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  fullWidth
                  size="small"
                  disabled={options.length === 0}
                  helperText={options.length === 0 ? "Cargando opciones…" : undefined}
                >
                  {options.map((option) => (
                    <MenuItem key={option.characteristicDetailId} value={option.valor}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            if (field.type === "foreignKey") {
              const options = fkOptions[field.foreignKeyTable] ?? [];
              const selected = options.find((option) => String(option.id) === String(value)) ?? null;

              return (
                <Autocomplete
                  key={field.name}
                  options={options}
                  value={selected}
                  getOptionLabel={(option) => option.label ?? ""}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  onChange={(_, option) => handleChange(field.name, option ? option.id : "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={field.label}
                      size="small"
                      placeholder="Buscar…"
                      helperText={options.length === 0 ? "Cargando opciones…" : undefined}
                    />
                  )}
                  fullWidth
                />
              );
            }

            if (field.type === "select") {
              return (
                <TextField
                  key={field.name}
                  select
                  label={field.label}
                  value={value}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  fullWidth
                  size="small"
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            const inputType =
              field.type === "date" ? "date"
                : field.type === "number" ? "number"
                  : field.type === "email" ? "email"
                    : field.type === "password" ? "password"
                      : field.type === "tel" ? "tel"
                        : "text";

            return (
              <TextField
                key={field.name}
                label={field.label}
                value={value}
                type={inputType}
                fullWidth
                size="small"
                autoComplete={field.type === "password" ? "new-password" : undefined}
                helperText={field.helperText}
                onChange={(event) => handleChange(field.name, event.target.value)}
                slotProps={{
                  inputLabel: field.type === "date" ? { shrink: true } : undefined,
                }}
              />
            );
          })}

          {students && (
            <>
              <Autocomplete
                multiple
                options={students}
                value={selectedStudents}
                onChange={(_, value) => setSelectedStudents(value)}
                getOptionLabel={studentLabel}
                isOptionEqualToValue={(a, b) => a.studentId === b.studentId}
                renderInput={(params) => (
                  <TextField {...params} label="Estudiantes" size="small" placeholder="Buscar por código o nombre" />
                )}
              />
            </>
          )}
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
          onClick={onClose}
          disabled={saving}
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
          disabled={saving}
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

export default RoleForm;