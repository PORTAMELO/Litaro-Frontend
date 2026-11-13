import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, StatusMark, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import styles from "../Grades.module.css";
import * as service from "../services/GradingService";
import ActivityPanel from "./ActivityPanel";
import {
  COMPONENTS,
  FIXED_COMPONENTS,
  MODES,
  NEUTRAL_COLOR,
  PERFORMANCE,
  formatGrade,
  formatPercent,
  formatRaw,
  isValidRaw,
  parseRaw,
} from "../utils/GradingUtils";

const courseKey = (course) => `${course.classroomId}-${course.subjectId}`;

const cellKey = (enrollmentId, activityId) => `${enrollmentId}:${activityId}`;

const GradeSheetTab = ({ options, can, notify }) => {
  const [chosenPeriod, setChosenPeriod] = useState(null);
  const [chosenCourse, setChosenCourse] = useState(null);
  const [override, setOverride] = useState(null);
  const [drafts, setDrafts] = useState({ key: null, values: {} });
  const [pendingChange, setPendingChange] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const periodId = chosenPeriod ?? options.currentPeriodId ?? options.periods[0]?.periodId ?? "";
  const course = options.courses.find((item) => courseKey(item) === chosenCourse) ?? options.courses[0] ?? null;
  const ready = Boolean(periodId && course);
  const requestKey = ready ? `${periodId}-${courseKey(course)}` : null;

  const { data, error, loading } = useLoad(
    () => service.getSheet(course.classroomId, course.subjectId, periodId),
    [requestKey],
    ready,
  );

  const sheet = override?.key === requestKey ? override.sheet : loading ? null : data;
  const values = drafts.key === requestKey ? drafts.values : {};
  const dirty = Object.keys(values).length > 0;

  const guard = (change) => {
    if (dirty) setPendingChange(() => change);
    else change();
  };

  const apply = (next) => {
    const activityIds = new Set(next.activities.map((activity) => activity.activityId));
    const enrollmentIds = new Set(next.students.map((student) => student.enrollmentId));

    setOverride({ key: requestKey, sheet: next });
    setDrafts((current) => {
      if (current.key !== requestKey) return current;

      const kept = Object.entries(current.values).filter(([key]) => {
        const [enrollmentId, activityId] = key.split(":").map(Number);
        return enrollmentIds.has(enrollmentId) && activityIds.has(activityId);
      });

      return { key: requestKey, values: Object.fromEntries(kept) };
    });
  };

  const run = async (action, message) => {
    try {
      const next = await action();
      apply(next);
      if (message) notify(message);
      return next;
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar los cambios.", "error");
      throw failure;
    }
  };

  const target = sheet && { classroomId: sheet.classroomId, subjectId: sheet.subjectId, periodId: sheet.periodId };

  const changeMode = (mode) => run(() => service.setMode({ ...target, mode })).catch(() => {});

  const saveActivity = async (body) => {
    await run(
      () =>
        editing?.activity
          ? service.updateActivity(editing.activity.activityId, { ...target, ...body })
          : service.createActivity({ ...target, ...body }),
      "Actividad guardada.",
    );
    setEditing(null);
  };

  const removeActivity = async () => {
    await run(() => service.deleteActivity(editing.activity.activityId), "Actividad eliminada.");
    setEditing(null);
  };

  const original = (row, activityId) => row.scores[activityId] ?? null;

  const changeScore = (row, activityId, text) =>
    setDrafts((current) => {
      const next = current.key === requestKey ? { ...current.values } : {};
      const key = cellKey(row.enrollmentId, activityId);
      const parsed = parseRaw(text);

      if (parsed === original(row, activityId) || (parsed === null && original(row, activityId) === null)) delete next[key];
      else next[key] = text;

      return { key: requestKey, values: next };
    });

  const invalid = Object.values(values).some((text) => !isValidRaw(text));

  const saveScores = async () => {
    setSaving(true);

    try {
      await run(
        () =>
          service.saveScores({
            ...target,
            scores: Object.entries(values).map(([key, text]) => {
              const [enrollmentId, activityId] = key.split(":").map(Number);
              return { enrollmentId, activityId, value: parseRaw(text) };
            }),
          }),
        "Notas guardadas.",
      );
      setDrafts({ key: null, values: {} });
    } catch {
      return;
    } finally {
      setSaving(false);
    }
  };

  const hetero = sheet ? sheet.activities.filter((activity) => activity.component === COMPONENTS.HETERO) : [];
  const fixed = sheet
    ? FIXED_COMPONENTS.map((item) => ({
        ...item,
        activity: sheet.activities.find((activity) => activity.component === item.component),
      })).filter((item) => item.activity)
    : [];
  const weighted = sheet?.mode === MODES.WEIGHTED;

  const scoreCell = (row, activity) => {
    const key = cellKey(row.enrollmentId, activity.activityId);
    const text = key in values ? values[key] : formatRaw(original(row, activity.activityId));

    if (!sheet.canEditScores) return <span className={styles.scoreValue}>{text}</span>;

    return (
      <TextField
        size="small"
        className={styles.scoreInput}
        value={text}
        error={!isValidRaw(text)}
        disabled={saving}
        onChange={(event) => changeScore(row, activity.activityId, event.target.value)}
        slotProps={{ htmlInput: { inputMode: "decimal", "aria-label": `${activity.name} · ${row.studentName}` } }}
      />
    );
  };

  const performanceCell = (row) => {
    if (row.absenceLoss) return <StatusMark label="Pérdida por fallas" color={NEUTRAL_COLOR} />;
    if (!row.performance) return null;

    const band = PERFORMANCE[row.performance];
    return <StatusMark label={band.label} color={band.color} />;
  };

  return (
    <div className={page.card}>
      <div className={page.toolbar}>
        <TextField
          select
          size="small"
          className={styles.selectSmall}
          value={periodId}
          onChange={(event) => guard(() => setChosenPeriod(event.target.value))}
          slotProps={{ htmlInput: { "aria-label": "Periodo" } }}
        >
          {options.periods.map((item) => (
            <MenuItem key={item.periodId} value={item.periodId}>
              Periodo {item.periodNumber}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          className={styles.selectSmall}
          value={course ? courseKey(course) : ""}
          onChange={(event) => guard(() => setChosenCourse(event.target.value))}
          slotProps={{ htmlInput: { "aria-label": "Curso y materia" } }}
        >
          {options.courses.map((item) => (
            <MenuItem key={courseKey(item)} value={courseKey(item)}>
              {item.classroomName} · {item.subjectName}
            </MenuItem>
          ))}
        </TextField>

        {sheet?.canEditDesign && (
          <TextField
            select
            size="small"
            className={styles.selectSmall}
            value={sheet.mode}
            onChange={(event) => changeMode(event.target.value)}
            slotProps={{ htmlInput: { "aria-label": "Modo de calificación" } }}
          >
            <MenuItem value={MODES.AVERAGE}>Promedio</MenuItem>
            <MenuItem value={MODES.WEIGHTED}>Porcentajes</MenuItem>
          </TextField>
        )}

        <span className={page.toolbarSpacer} />

        {sheet && (
          <>
            <StatusMark label={sheet.periodClosed ? "Cerrado" : "Abierto"} color={sheet.periodClosed ? NEUTRAL_COLOR : "var(--primary-color)"} />
            {sheet.designLocked && <StatusMark label="Diseño bloqueado" color={NEUTRAL_COLOR} />}
          </>
        )}

        {sheet?.canEditScores && (
          <Button variant="contained" onClick={saveScores} disabled={!dirty || invalid || saving}>
            Guardar
          </Button>
        )}
      </div>

      {!ready && <EmptyState title="Sin cursos ni materias para mostrar" />}

      {ready && error && !sheet && <p className={page.message}>{error}</p>}

      {ready && !error && !sheet && <TableSkeleton rows={8} columns={6} />}

      {sheet && sheet.students.length === 0 && <EmptyState title="Este curso no tiene estudiantes matriculados" />}

      {sheet && sheet.students.length > 0 && (
        <div className={page.tableWrapper}>
          <table className={`${page.table} ${styles.sheet}`}>
            <thead>
              <tr>
                <th rowSpan={2}>Estudiante</th>
                <th colSpan={Math.max(hetero.length, 1) + (sheet.canEditDesign ? 1 : 0)} className={styles.groupHeader}>
                  Heteroevaluación 70 %
                  {weighted && Number(sheet.weightSum) !== 100 && (
                    <span className={styles.sumNotice}> · Suma {formatPercent(sheet.weightSum)}</span>
                  )}
                </th>
                {fixed.map((item) => (
                  <th key={item.component} rowSpan={2} className={page.cellCenter}>
                    {item.label} 10 %
                  </th>
                ))}
                <th rowSpan={2} className={page.cellRight}>
                  Acumulada
                </th>
                <th rowSpan={2} className={page.cellRight}>
                  Definitiva
                </th>
                <th rowSpan={2}>Desempeño</th>
              </tr>
              <tr>
                {hetero.length === 0 && <th />}
                {hetero.map((activity) => (
                  <th key={activity.activityId} className={page.cellCenter}>
                    <span className={styles.activityHeader}>
                      <Tooltip title={activity.competencies || activity.name}>
                        <span className={styles.activityName}>{activity.name}</span>
                      </Tooltip>
                      {weighted && (
                        <span className={styles.activityWeight}>
                          {activity.weight === null ? "—" : formatPercent(activity.weight)}
                        </span>
                      )}
                      {sheet.canEditDesign && (
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => setEditing({ activity })}>
                            <EditOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </span>
                  </th>
                ))}
                {sheet.canEditDesign && (
                  <th className={page.cellTight}>
                    <Tooltip title="Agregar actividad">
                      <IconButton size="small" onClick={() => setEditing({ activity: null })}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {sheet.students.map((row) => (
                <tr key={row.enrollmentId}>
                  <td>{row.studentName}</td>
                  {hetero.length === 0 && <td />}
                  {hetero.map((activity) => (
                    <td key={activity.activityId} className={`${page.cellCenter} ${styles.scoreCell}`}>
                      {scoreCell(row, activity)}
                    </td>
                  ))}
                  {sheet.canEditDesign && <td />}
                  {fixed.map((item) => (
                    <td key={item.component} className={`${page.cellCenter} ${styles.scoreCell}`}>
                      {scoreCell(row, item.activity)}
                    </td>
                  ))}
                  <td className={`${page.cellRight} ${styles.gradeValue}`}>{formatGrade(row.accumulated)}</td>
                  <td className={`${page.cellRight} ${styles.gradeValue}`}>
                    {row.final !== null ? formatGrade(row.final) : <span className={styles.mutedText}>Incompleta</span>}
                  </td>
                  <td>{performanceCell(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && sheet && (
        <ActivityPanel
          key={editing.activity?.activityId ?? "new"}
          activity={editing.activity}
          weighted={weighted}
          canDelete={can("GradeDesign", "delete") || can("GradeDesign", "update")}
          onClose={() => setEditing(null)}
          onSave={saveActivity}
          onDelete={removeActivity}
        />
      )}

      <Dialog open={pendingChange !== null} onClose={() => setPendingChange(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Cambios sin guardar</DialogTitle>
        <DialogContent>Las notas digitadas se perderán.</DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingChange(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              const change = pendingChange;
              setPendingChange(null);
              setDrafts({ key: null, values: {} });
              change();
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default GradeSheetTab;
