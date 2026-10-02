import { useEffect, useMemo, useState } from "react";
import { FormControlLabel, MenuItem, Select, Switch, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import styles from "../Schedule.module.css";
import WeekView from "./WeekView";
import BlockDialog from "./BlockDialog";
import ProgressPanel from "./ProgressPanel";
import ConfirmDialog from "./ConfirmDialog";
import { BLOCK_TYPES, blockTitle, dayLabel, shortTime } from "../utils/ScheduleUtils";
import { deleteBlock, getProgress, getScheduleView, saveBlock } from "../services/ScheduleService";

const selectSx = {
  fontFamily: "inherit",
  fontSize: "var(--text-sm)",
  "& .MuiSelect-select": { fontSize: "var(--text-sm)" },
};

const SUBTITLES = {
  classroom: (b) => b.teacherName,
  teacher: (b) => [b.classroomName, b.campusName].filter(Boolean).join(" · "),
  space: (b) => [b.classroomName, b.teacherName].filter(Boolean).join(" · "),
};

const ScheduleEditor = ({ yearId, campusId, data, permissions, notify, notifyError }) => {
  const { classrooms, assignments, teachers, spaces } = data;

  const [viewBy, setViewBy] = useState("classroom");
  const [chosenId, setChosenId] = useState("");
  const [showSaturday, setShowSaturday] = useState(false);
  const [dialog, setDialog] = useState({ open: false, block: null, defaults: null, key: 0 });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, block: null });

  const options = useMemo(() => {
    const byLabel = (a, b) => a.label.localeCompare(b.label, "es", { numeric: true });
    if (viewBy === "classroom")
      return classrooms
        .filter((c) => c.campusId === campusId)
        .map((c) => ({ id: c.classroomId, label: c.name }))
        .sort(byLabel);
    if (viewBy === "teacher") return teachers;
    return spaces
      .filter((s) => s.campusId === campusId)
      .map((s) => ({ id: s.spaceId, label: `${s.name} · ${s.type}` }))
      .sort(byLabel);
  }, [viewBy, classrooms, teachers, spaces, campusId]);

  const selectedId = options.some((o) => o.id === chosenId) ? chosenId : (options[0]?.id ?? "");

  const selectedClassroom = viewBy === "classroom" ? classrooms.find((c) => c.classroomId === selectedId) : null;
  const selectedSpace = viewBy === "space" ? spaces.find((s) => s.spaceId === selectedId) : null;

  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ viewKey: "", version: -1, blocks: [], progress: [] });
  const viewKey = `${yearId}:${viewBy}:${selectedId}`;
  const classMinutes = selectedClassroom?.classMinutes ?? 60;
  const reload = () => setVersion((v) => v + 1);

  useEffect(() => {
    if (!yearId || !selectedId) return;

    const key = `${yearId}:${viewBy}:${selectedId}`;
    const filter = { classroom: "classroomId", teacher: "teacherId", space: "spaceId" }[viewBy];
    let cancelled = false;

    Promise.all([
      getScheduleView({ yearId, [filter]: selectedId }),
      viewBy === "classroom" ? getProgress(selectedId, yearId) : Promise.resolve([]),
    ])
      .then(([view, planProgress]) => {
        if (!cancelled) setResult({ viewKey: key, version, blocks: view ?? [], progress: planProgress ?? [] });
      })
      .catch((error) => {
        if (cancelled) return;
        setResult({ viewKey: key, version, blocks: [], progress: [] });
        notifyError(error, "No se pudo cargar el horario");
      });

    return () => {
      cancelled = true;
    };
  }, [yearId, viewBy, selectedId, version, classMinutes, notifyError]);

  const isCurrentView = result.viewKey === viewKey && Boolean(selectedId);
  const blocks = isCurrentView ? result.blocks : [];
  const progress = isCurrentView ? result.progress : [];
  const loading = Boolean(selectedId) && !(isCurrentView && result.version === version);

  const fixed = useMemo(
    () => ({
      classroomId: viewBy === "classroom" ? selectedId : null,
      teacherId: viewBy === "teacher" ? selectedId : null,
      spaceId: viewBy === "space" ? selectedId : null,
    }),
    [viewBy, selectedId],
  );

  const openNew = (weekday) => {
    const isZone = selectedSpace?.type?.toLowerCase().includes("zona");
    setDialog({
      open: true,
      block: null,
      key: Date.now(),
      defaults: {
        weekday,
        type: isZone ? "ACCOMPANIMENT" : "CLASS",
        teacherId: fixed.teacherId ?? "",
        spaceId: fixed.spaceId ?? "",
      },
    });
  };

  const openEdit = (block) => setDialog({ open: true, block, defaults: null, key: Date.now() });
  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  const handleSave = async (id, payload) => {
    setSaving(true);
    try {
      const result = await saveBlock(id, payload);
      const warnings = result?.warnings ?? [];

      if (warnings.length > 0) {
        notify({ severity: "warning", title: "Se guardó, pero revisa lo siguiente", details: warnings });
      } else {
        notify({ severity: "success", message: id ? "Cambios guardados en el horario." : "Agregado al horario." });
      }

      closeDialog();
      reload();
    } catch (error) {
      notifyError(error, "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const block = confirm.block;
    setConfirm({ open: false, block: null });
    try {
      await deleteBlock(block.scheduleId);
      notify({ severity: "success", message: "Quitado del horario." });
      closeDialog();
      reload();
    } catch (error) {
      notifyError(error, "No se pudo quitar del horario");
    }
  };

  const canAdd = permissions.create && Boolean(selectedId);

  return (
    <>
      <section className={styles.filtersCard}>
        <div className={styles.editorFilters}>
          <div className={styles.filter}>
            <label>Ver horario de</label>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={viewBy}
              onChange={(_, value) => value && setViewBy(value)}
              sx={{ "& .MuiToggleButton-root": { textTransform: "none", fontFamily: "inherit", fontSize: "var(--text-sm)" } }}
            >
              <ToggleButton value="classroom">Un salón</ToggleButton>
              <ToggleButton value="teacher">Un docente</ToggleButton>
              <ToggleButton value="space">Un espacio</ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div className={styles.filter}>
            <label>{{ classroom: "Salón", teacher: "Docente", space: "Espacio" }[viewBy]}</label>
            <Select
              size="small"
              value={selectedId}
              onChange={(e) => setChosenId(e.target.value)}
              displayEmpty
              fullWidth
              sx={selectSx}
            >
              {options.length === 0 && (
                <MenuItem value="" disabled>
                  No hay opciones en esta sede
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>

          <FormControlLabel
            control={<Switch size="small" checked={showSaturday} onChange={(e) => setShowSaturday(e.target.checked)} />}
            label={<Typography sx={{ fontSize: "var(--text-sm)" }}>Mostrar sábado</Typography>}
            className={styles.saturdaySwitch}
          />
        </div>

        <div className={styles.legend}>
          {Object.entries(BLOCK_TYPES).map(([type, info]) => (
            <span key={type} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: info.color }} />
              {info.label}
            </span>
          ))}
        </div>
      </section>

      <div className={selectedClassroom ? styles.editorWithSide : undefined}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <Typography className={styles.cardTitle}>
                {options.find((o) => o.id === selectedId)?.label ?? "Horario"}
              </Typography>
              <Typography className={styles.cardSubtitle}>
                {loading
                  ? "Cargando..."
                  : `${blocks.length} ${blocks.length === 1 ? "clase o actividad" : "clases y actividades"}${canAdd ? " · Usa + para agregar; haz clic sobre una para cambiarla o quitarla" : ""}`}
              </Typography>
            </div>
          </div>

          <WeekView
            blocks={blocks}
            showSaturday={showSaturday}
            subtitleOf={SUBTITLES[viewBy]}
            onAdd={canAdd ? openNew : undefined}
            onEdit={permissions.update || permissions.delete ? openEdit : undefined}
          />
        </section>

        {selectedClassroom && (
          <ProgressPanel
            progress={progress}
            classroomName={selectedClassroom.name}
            classMinutes={selectedClassroom.classMinutes}
          />
        )}
      </div>

      <BlockDialog
        key={dialog.key}
        open={dialog.open}
        block={dialog.block}
        defaults={dialog.defaults}
        context={{ yearId, campusId, classrooms, assignments, teachers, spaces, fixed }}
        saving={saving}
        onClose={closeDialog}
        onSave={handleSave}
        onDelete={permissions.delete ? (block) => setConfirm({ open: true, block }) : undefined}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Quitar del horario"
        message={
          confirm.block
            ? `¿Quitar "${blockTitle(confirm.block)}" del ${dayLabel(confirm.block.weekday).toLowerCase()} de ${shortTime(
                confirm.block.startTime,
              )} a ${shortTime(confirm.block.endTime)}?`
            : ""
        }
        confirmText="Quitar"
        onConfirm={handleDelete}
        onClose={() => setConfirm({ open: false, block: null })}
      />
    </>
  );
};

export default ScheduleEditor;
