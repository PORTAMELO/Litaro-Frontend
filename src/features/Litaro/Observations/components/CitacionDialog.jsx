import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
} from "@mui/material";

const initialForm = {
  date: "",
  time: "",
  reason: "",
  place: "",
  responsible: "",
  status: "Pendiente",
};

const statusOptions = [
  {
    value: "Pendiente",
    label: "Pendiente",
  },
  {
    value: "Realizada",
    label: "Realizada",
  },
  {
    value: "Cancelada",
    label: "Cancelada",
  },
];

const CitacionDialog = ({ open, student, appointment, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (appointment) {
      setForm({
        date: appointment.date ?? "",
        time: appointment.time ?? "",
        reason: appointment.reason ?? "",
        place: appointment.place ?? "",
        responsible: appointment.responsible ?? "",
        status: appointment.status ?? "Pendiente",
      });
    } else {
      setForm({
        ...initialForm,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [appointment, open]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        {appointment ? "Editar citación" : "Registrar citación"}
      </DialogTitle>

      <DialogContent
        sx={{
          px: "var(--space-lg)",
          py: "var(--space-md)",
        }}
      >
        <Stack spacing={1.5}>
          {student && (
            <div>
              <Typography
                sx={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                }}
              >
                Estudiante
              </Typography>

              <Typography
                sx={{
                  fontSize: "var(--text-md)",
                  fontWeight: "var(--font-semibold)",
                  color: "var(--color-text)",
                }}
              >
                {student.name} · {student.code}
              </Typography>
            </div>
          )}

          <TextField
            label="Fecha"
            type="date"
            size="small"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Hora"
            type="time"
            size="small"
            value={form.time}
            onChange={(e) => handleChange("time", e.target.value)}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Motivo"
            size="small"
            value={form.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            fullWidth
            multiline
            minRows={2}
            placeholder="Motivo de la citación..."
          />

          <TextField
            label="Lugar"
            size="small"
            value={form.place}
            onChange={(e) => handleChange("place", e.target.value)}
            fullWidth
            placeholder="Lugar de la citación"
          />

          <TextField
            label="Responsable"
            size="small"
            value={form.responsible}
            onChange={(e) => handleChange("responsible", e.target.value)}
            fullWidth
            placeholder="Persona responsable"
          />

          <TextField
            select
            label="Estado"
            size="small"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            fullWidth
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
          onClick={() => onSave(form)}
          size="small"
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

export default CitacionDialog;
