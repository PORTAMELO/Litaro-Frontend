import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { BLOCK_TYPES, WEEKDAYS, addMinutes, durationMinutes, shortTime } from "../utils/ScheduleUtils";

const emptyForm = {
  type: "CLASS",
  assignmentId: "",
  teacherId: "",
  title: "",
  weekday: 1,
  startTime: "",
  endTime: "",
  spaceId: "",
};

const buttonSx = {
  borderRadius: "var(--radius-md)",
  textTransform: "none",
  fontFamily: "inherit",
  fontWeight: "var(--font-semibold)",
};

const BlockDialog = ({ open, block, defaults, context, saving, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(() =>
    block
      ? {
          type: block.type,
          assignmentId: block.assignmentId ?? "",
          teacherId: block.teacherId ?? "",
          title: block.title ?? "",
          weekday: block.weekday,
          startTime: shortTime(block.startTime),
          endTime: shortTime(block.endTime),
          spaceId: block.spaceId ?? "",
        }
      : { ...emptyForm, ...defaults },
  );
  const [touched, setTouched] = useState(false);

  const { yearId, campusId, classrooms, assignments, teachers, spaces, fixed } = context;

  const isClass = form.type === "CLASS";

  const assignmentOptions = useMemo(() => {
    const campusClassrooms = new Set(classrooms.filter((c) => c.campusId === campusId).map((c) => c.classroomId));

    return assignments.filter((a) => {
      if (fixed.classroomId) return a.classroomId === fixed.classroomId;
      if (fixed.teacherId) return a.teacherId === fixed.teacherId;
      return campusClassrooms.has(a.classroomId);
    });
  }, [assignments, classrooms, campusId, fixed]);

  const selectedAssignment = assignments.find((a) => a.assignmentId === Number(form.assignmentId));
  const selectedClassroom = classrooms.find((c) => c.classroomId === selectedAssignment?.classroomId);
  const classMinutes = selectedClassroom?.classMinutes ?? 60;

  const otherCampusId = block?.campusId ?? campusId;
  const blockCampusId = isClass && selectedClassroom ? selectedClassroom.campusId : otherCampusId;
  const spaceOptions = spaces.filter((s) => s.campusId === blockCampusId);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "startTime" && value) {
        const previous = durationMinutes(prev.startTime, prev.endTime);
        const minutes = isClass ? classMinutes : previous > 0 ? previous : 60;
        next.endTime = addMinutes(value, minutes);
      }

      if (field === "assignmentId" || field === "type") next.spaceId = fixed.spaceId ?? "";

      return next;
    });
  };

  const errors = {
    assignmentId: isClass && !form.assignmentId ? "Elige la materia" : "",
    teacherId: !isClass && !form.teacherId ? "Elige el docente" : "",
    startTime: !form.startTime ? "Indica la hora de inicio" : "",
    endTime: !form.endTime
      ? "Indica la hora de fin"
      : form.startTime && form.endTime <= form.startTime
        ? "Debe ser posterior a la hora de inicio"
        : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = () => {
    setTouched(true);
    if (hasErrors) return;

    onSave(block?.scheduleId ?? null, {
      yearId,
      type: form.type,
      weekday: Number(form.weekday),
      startTime: form.startTime,
      endTime: form.endTime,
      assignmentId: isClass ? Number(form.assignmentId) : null,
      teacherId: isClass ? null : Number(form.teacherId),
      spaceId: form.spaceId ? Number(form.spaceId) : null,
      campusId: isClass ? null : otherCampusId,
      title: ["MEETING", "OTHER"].includes(form.type) ? form.title : null,
    });
  };

  const showError = (field) => touched && Boolean(errors[field]);
  const duration = durationMinutes(form.startTime, form.endTime);

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" } } }}
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
        {block ? "Cambiar en el horario" : "Agregar al horario"}
      </DialogTitle>

      <DialogContent sx={{ px: "var(--space-lg)", py: "var(--space-md)" }}>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          <TextField
            select
            label="¿Qué se va a programar?"
            size="small"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            fullWidth
          >
            {Object.entries(BLOCK_TYPES).map(([value, info]) => (
              <MenuItem key={value} value={value}>
                {info.label}
              </MenuItem>
            ))}
          </TextField>

          {isClass ? (
            <TextField
              select
              label="Materia (salón y docente)"
              size="small"
              value={form.assignmentId}
              onChange={(e) => handleChange("assignmentId", e.target.value)}
              error={showError("assignmentId")}
              helperText={
                showError("assignmentId")
                  ? errors.assignmentId
                  : assignmentOptions.length === 0
                    ? "No hay materias asignadas. Agrégalas en la pestaña Asignaciones."
                    : " "
              }
              fullWidth
            >
              {assignmentOptions.map((a) => (
                <MenuItem key={a.assignmentId} value={a.assignmentId}>
                  {a.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              select
              label="Docente"
              size="small"
              value={form.teacherId}
              onChange={(e) => handleChange("teacherId", e.target.value)}
              error={showError("teacherId")}
              helperText={showError("teacherId") ? errors.teacherId : " "}
              fullWidth
            >
              {teachers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
          )}

          {["MEETING", "OTHER"].includes(form.type) && (
            <TextField
              label="Título (opcional)"
              size="small"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ej.: Comité de evaluación"
              inputProps={{ maxLength: 100 }}
              fullWidth
            />
          )}

          <TextField
            select
            label="Día"
            size="small"
            value={form.weekday}
            onChange={(e) => handleChange("weekday", e.target.value)}
            fullWidth
          >
            {WEEKDAYS.map((day) => (
              <MenuItem key={day.value} value={day.value}>
                {day.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1.5}>
            <TextField
              label="Hora de inicio"
              type="time"
              size="small"
              value={form.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              error={showError("startTime")}
              helperText={showError("startTime") ? errors.startTime : " "}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 300 } }}
              fullWidth
            />
            <TextField
              label="Hora de fin"
              type="time"
              size="small"
              value={form.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              error={showError("endTime")}
              helperText={
                showError("endTime") ? errors.endTime : duration > 0 ? `Duración: ${duration} min` : " "
              }
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 300 } }}
              fullWidth
            />
          </Stack>

          <TextField
            select
            label="Lugar (opcional)"
            size="small"
            value={form.spaceId}
            onChange={(e) => handleChange("spaceId", e.target.value)}
            helperText={
              form.type === "ACCOMPANIMENT"
                ? "Elige la zona donde el docente hace el acompañamiento."
                : "Aula, laboratorio o sala. El sistema revisa que esté libre y que quepan los estudiantes."
            }
            fullWidth
          >
            <MenuItem value="">
              <em>Sin lugar asignado</em>
            </MenuItem>
            {spaceOptions.map((s) => (
              <MenuItem key={s.spaceId} value={s.spaceId}>
                {s.name} · {s.type}
                {s.capacity ? ` (${s.capacity} puestos)` : ""}
              </MenuItem>
            ))}
          </TextField>

          {isClass && selectedClassroom && (
            <Alert severity="info" variant="outlined" sx={{ fontSize: "var(--text-sm)" }}>
              En {selectedClassroom.name} cada hora de clase dura {classMinutes} minutos; la hora de fin se calcula sola.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: "var(--space-lg)", pb: "var(--space-lg)", gap: "var(--space-xs)" }}>
        {block && onDelete && (
          <Button
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(block)}
            disabled={saving}
            sx={{ ...buttonSx, mr: "auto" }}
          >
            Eliminar
          </Button>
        )}

        <Button variant="outlined" size="small" onClick={onClose} disabled={saving} sx={buttonSx}>
          Cancelar
        </Button>

        <Button variant="contained" size="small" onClick={handleSubmit} disabled={saving} sx={buttonSx}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockDialog;
