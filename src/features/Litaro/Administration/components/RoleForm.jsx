import { useEffect, useRef, useState } from "react";
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

const PROFILE_LABELS = {
  student: "Estudiante",
  parent: "Padre/Acudiente",
  teacher: "Profesor",
};

const profileSummary = (lookupResult) =>
  Object.entries(PROFILE_LABELS)
    .map(([key, label]) => {
      const status = lookupResult?.[key];
      const estado = status?.exists ? (status.active ? "Activo" : "Inactivo") : "No tiene";
      return `${label}: ${estado}`;
    })
    .join(" · ");

const RoleForm = ({ open, title, fields, roleTableName, students, onClose, onSave, saving, error }) => {
  const [form, setForm] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [columnSchema, setColumnSchema] = useState([]);
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [fkOptions, setFkOptions] = useState({});
  const [lookup, setLookup] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  // Catálogos ya pedidos: cada uno se carga una sola vez.
  const requested = useRef(new Set());

  const documentType = form.documentType?.trim();
  const documentNumber = form.documentNumber?.trim();
  const documentKey = documentType && documentNumber?.length >= 5 ? `${documentType}|${documentNumber}` : null;
  // El resultado solo vale para el documento que se buscó.
  const lookupResult = lookup && lookup.key === documentKey ? lookup.result : null;

  // Al cerrar, el formulario queda limpio para la próxima vez.
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) {
      setForm({});
      setSelectedStudents([]);
      setLookup(null);
    }
  }

  const profileKey = roleTableName?.toLowerCase();
  const existingProfile = lookupResult?.found ? lookupResult[profileKey] : null;
  const isExistingUser = !!lookupResult?.found;
  const isReactivation = !!(existingProfile?.exists && !existingProfile.active);
  const isBlocked = !!(existingProfile?.exists && existingProfile.active);

  useEffect(() => {
    if (!open) return;

    Promise.all([
      roleTableName ? service.getSchema(roleTableName) : Promise.resolve([]),
      service.getSchema("User"),
    ]).then(([ownColumns, userColumns]) => {
      setColumnSchema([...ownColumns, ...userColumns]);
    });
  }, [open, roleTableName]);

  useEffect(() => {
    if (!open || !documentKey) return undefined;

    const timeout = setTimeout(() => {
      setLookupLoading(true);

      service
        .lookupUserByDocument(documentType, documentNumber)
        .then((result) => {
          setLookup({ key: documentKey, result });

          if (result?.found) {
            setForm((previous) => ({
              ...previous,
              firstName: result.firstName ?? "",
              lastName: result.lastName ?? "",
              email: result.email ?? "",
              phoneNumber: result.phoneNumber ?? "",
              campusId: result.campusId ?? "",
            }));
          }
        })
        .catch(() => setLookup(null))
        .finally(() => setLookupLoading(false));
    }, 500);

    return () => clearTimeout(timeout);
  }, [open, documentKey, documentType, documentNumber]);

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
      const cacheKey = `characteristic:${characteristicId}`;
      if (requested.current.has(cacheKey)) return;
      requested.current.add(cacheKey);

      service.getCharacteristicDetails(characteristicId).then((details) => {
        setCharacteristicOptions((previous) => ({
          ...previous,
          [characteristicId]: details,
        }));
      });
    });
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
      const cacheKey = `table:${table}`;
      if (requested.current.has(cacheKey)) return;
      requested.current.add(cacheKey);

      service.getLookupOptions(table).then((options) => {
        setFkOptions((previous) => ({ ...previous, [table]: options }));
      });
    });
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

      if (field.hideWhenExisting && isExistingUser) {
        delete payload[field.name];
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
          fontSize: "var(--text-title)",
          fontWeight: "var(--font-bold)",
          color: "var(--color-text)",
        }}
      >
        {isReactivation ? `Reactivar ${title.replace(/^Nuevo /, "")}` : title}
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

        {isExistingUser && (
          <Alert severity={isBlocked ? "warning" : "info"} sx={{ mb: 1.5 }}>
            Ya existe un usuario con este documento
            {lookupResult.firstName ? `: ${lookupResult.firstName} ${lookupResult.lastName ?? ""}` : ""}.
            <br />
            {profileSummary(lookupResult)}.
            {isBlocked && " Este usuario ya tiene este perfil activo."}
            {isReactivation && " Este perfil está inactivo: guardar lo reactivará con los datos que diligencies."}
            {!isBlocked && !isReactivation && " Solo se piden los datos propios de este nuevo perfil."}
          </Alert>
        )}

        <Stack spacing={1.5}>
          {fields.map((field) => {
            if (field.hideWhenExisting && isExistingUser) return null;

            const value = form[field.name] ?? "";
            const disabled = !!(field.shared && isExistingUser);

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
                  disabled={disabled || options.length === 0}
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
                  disabled={disabled}
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
                  disabled={disabled}
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
                disabled={disabled}
                autoComplete={field.type === "password" ? "new-password" : undefined}
                helperText={field.helperText}
                onChange={(event) => handleChange(field.name, event.target.value)}
                slotProps={{
                  inputLabel: field.type === "date" ? { shrink: true } : undefined,
                }}
              />
            );
          })}

          {lookupLoading && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Buscando documento…
            </Typography>
          )}

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
          disabled={saving || isBlocked}
          sx={{
            borderRadius: "var(--radius-md)",
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: "var(--font-semibold)",
          }}
        >
          {isReactivation ? "Reactivar perfil" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleForm;