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
  teacher: "",
  description: "",
  commitment: "",
  status: "En seguimiento",
};

const statusOptions = [
  {
    value: "Sin penalización",
    label: "Sin penalización",
  },
  {
    value: "En seguimiento",
    label: "En seguimiento",
  },
  {
    value: "Con penalización",
    label: "Con penalización",
  },
];

const ObservacionDialog = ({ open, student, observation, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (observation) {
      setForm({
        date: observation.date ?? "",
        teacher: observation.teacher ?? "",
        description: observation.description ?? "",
        commitment: observation.commitment ?? "",
        status: observation.status ?? "En seguimiento",
      });
    } else {
      setForm({
        ...initialForm,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [observation, open]);

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
        {observation ? "Editar observación" : "Registrar observación"}
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
            label="Docente"
            size="small"
            value={form.teacher}
            onChange={(e) => handleChange("teacher", e.target.value)}
            fullWidth
            placeholder="Nombre del docente"
          />

          <TextField
            label="Descripción"
            size="small"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            multiline
            minRows={4}
            placeholder="Describe la situación presentada..."
          />

          <TextField
            label="Compromiso"
            size="small"
            value={form.commitment}
            onChange={(e) => handleChange("commitment", e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Compromiso adquirido por el estudiante..."
          />

          <TextField
            select
            label="Estado del estudiante"
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

export default ObservacionDialog;
