import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";

import page from "@/shared/components/Ui/Page.module.css";
import { EmptyState, StatusMark, TableSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import styles from "../Grades.module.css";
import * as service from "../services/YearClosingService";
import { CLOSING_RESULT, formatGrade, formatPercent } from "../utils/GradingUtils";
import PromotionSettingsPanel from "./PromotionSettingsPanel";
import { colors } from "@/shared/styles/tokens";

const DECIDABLE = ["PROMOTED", "FAILED"];

const YearClosingTab = ({ can, notify }) => {
  const canClose = can("YearClosing", "update");
  const [yearId, setYearId] = useState(null);
  const [classroomId, setClassroomId] = useState("");
  const [decisions, setDecisions] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const options = useLoad(() => service.getOptions(yearId), [yearId]);
  const settings = useLoad(() => service.getSettings(), []);
  const selectedYear = yearId ?? options.data?.yearId ?? null;
  const preview = useLoad(
    () => service.getPreview(selectedYear, classroomId),
    [selectedYear, classroomId],
    Boolean(selectedYear) && classroomId !== "",
  );

  const reset = () => {
    setDecisions({});
    setConfirming(false);
  };

  if (options.error) return <p className={page.message}>{options.error}</p>;
  if (!options.data) return <TableSkeleton rows={8} columns={4} />;
  if (!selectedYear) return <EmptyState title="No hay años académicos registrados" />;

  const rows = preview.data?.rows ?? [];
  const open = rows.filter((row) => row.status === "ACTIVE" && DECIDABLE.includes(row.proposed));
  const pending = rows.filter((row) => row.proposed === "PENDING").length;
  const result = (row) => decisions[row.enrollmentId]?.result ?? row.proposed;
  const changed = open.filter((row) => result(row) !== row.proposed);
  const missingNote = changed.some((row) => (decisions[row.enrollmentId]?.note ?? "").trim() === "");

  const decide = (enrollmentId, patch) =>
    setDecisions((current) => ({ ...current, [enrollmentId]: { ...current[enrollmentId], ...patch } }));

  const close = async () => {
    setBusy(true);

    try {
      const done = await service.close(
        selectedYear,
        Number(classroomId),
        changed.map((row) => ({
          enrollmentId: row.enrollmentId,
          result: result(row),
          note: decisions[row.enrollmentId].note.trim(),
        })),
      );
      notify(
        `Cierre registrado: ${done.promoted} promovidos, ${done.failed} reprobados` +
          (done.pending > 0 ? ` y ${done.pending} pendientes por notas.` : "."),
      );
      reset();
      preview.reload();
      options.reload();
    } catch (failure) {
      notify(failure.message ?? "No fue posible cerrar el año del curso.", "error");
    }

    setBusy(false);
  };

  return (
    <div className={page.card}>
      <div className={page.toolbar}>
        <TextField
          select
          size="small"
          className={styles.selectSmall}
          value={selectedYear}
          onChange={(event) => {
            setYearId(event.target.value);
            setClassroomId("");
            reset();
          }}
          slotProps={{ htmlInput: { "aria-label": "Año lectivo" } }}
        >
          {options.data.years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          className={styles.selectWide}
          value={classroomId}
          onChange={(event) => {
            setClassroomId(event.target.value);
            reset();
          }}
          slotProps={{ select: { displayEmpty: true }, htmlInput: { "aria-label": "Curso" } }}
        >
          <MenuItem value="">Selecciona un curso</MenuItem>
          {options.data.classrooms.map((classroom) => (
            <MenuItem key={classroom.classroomId} value={classroom.classroomId}>
              {classroom.name} · {classroom.campusName} ({classroom.active} por cerrar)
            </MenuItem>
          ))}
        </TextField>

        <span className={page.toolbarSpacer} />

        <Button onClick={() => setSettingsOpen(true)} disabled={!settings.data}>
          Parámetros
        </Button>
      </div>

      {classroomId === "" && (
        <EmptyState
          title="Selecciona un curso"
          text="Verás el resultado que proponen las reglas del SIEE para cada estudiante antes de cerrar el año."
        />
      )}

      {classroomId !== "" && preview.error && <EmptyState title="No se pudo calcular" text={preview.error} />}

      {classroomId !== "" && !preview.error && !preview.data && <TableSkeleton rows={8} columns={4} />}

      {preview.data && rows.length === 0 && <EmptyState title="El curso no tiene estudiantes matriculados" />}

      {preview.data && rows.length > 0 && (
        <div className={page.tableWrapper}>
          <table className={page.table}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Áreas</th>
                <th>Asistencia</th>
                <th>Resultado</th>
                {canClose && <th>Decisión de la Comisión</th>}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const info = CLOSING_RESULT[row.proposed] ?? { label: row.proposed, color: colors.textMuted };
                const closed = row.status !== "ACTIVE";
                const editable = canClose && !closed && DECIDABLE.includes(row.proposed);
                const differs = editable && result(row) !== row.proposed;

                return (
                  <tr key={row.enrollmentId}>
                    <td>
                      <span className={page.rowStrong}>{row.studentName}</span>
                      <span className={page.secondaryText}>{row.document}</span>
                      {row.repeater && <span className={page.chip}>Repitente</span>}
                      {row.hasPiar && <span className={page.chip}>PIAR</span>}
                    </td>

                    <td>
                      {row.areas.map((area) => (
                        <span key={area.area} className={area.passed ? styles.areaPassed : styles.areaLost}>
                          {area.area} {formatGrade(area.final)}
                        </span>
                      ))}
                      {row.lostSubjects.length > 0 && (
                        <span className={page.secondaryText}>Asignaturas perdidas: {row.lostSubjects.join(", ")}</span>
                      )}
                    </td>

                    <td>{closed ? "" : formatPercent(row.attendancePercent)}</td>

                    <td>
                      <StatusMark label={closed ? `${info.label} (cerrado)` : info.label} color={info.color} />
                      <span className={page.secondaryText}>{row.rule}</span>
                      {row.decisionNote && (
                        <span className={page.secondaryText}>
                          {row.decidedBy}: {row.decisionNote}
                        </span>
                      )}
                    </td>

                    {canClose && (
                      <td>
                        {editable && (
                          <div className={styles.decision}>
                            <TextField
                              select
                              size="small"
                              value={result(row)}
                              onChange={(event) => decide(row.enrollmentId, { result: event.target.value })}
                              disabled={busy}
                              slotProps={{ htmlInput: { "aria-label": `Decisión para ${row.studentName}` } }}
                            >
                              {DECIDABLE.map((value) => (
                                <MenuItem key={value} value={value}>
                                  {CLOSING_RESULT[value].label}
                                </MenuItem>
                              ))}
                            </TextField>

                            {differs && (
                              <TextField
                                size="small"
                                placeholder="Justificación (acta de la Comisión)"
                                value={decisions[row.enrollmentId]?.note ?? ""}
                                onChange={(event) => decide(row.enrollmentId, { note: event.target.value })}
                                disabled={busy}
                                slotProps={{
                                  htmlInput: { maxLength: 500, "aria-label": `Justificación para ${row.studentName}` },
                                }}
                              />
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {preview.data && canClose && (open.length > 0 || pending > 0) && (
        <div className={styles.footerActions}>
          <span className={styles.footerNote}>
            {open.length} por cerrar
            {pending > 0 && `, ${pending} pendientes por notas (siguen matriculados hasta que el docente las complete)`}
            {confirming && ". El cierre no se puede deshacer desde esta pantalla."}
          </span>

          {confirming && (
            <Button onClick={() => setConfirming(false)} disabled={busy}>
              Cancelar
            </Button>
          )}

          <Button
            variant="contained"
            onClick={confirming ? close : () => setConfirming(true)}
            disabled={busy || open.length === 0 || missingNote}
          >
            {busy ? "Cerrando…" : confirming ? "Confirmar cierre" : "Cerrar año del curso"}
          </Button>
        </div>
      )}

      {settingsOpen && settings.data && (
        <PromotionSettingsPanel
          settings={settings.data}
          subjects={options.data.subjects}
          canEdit={canClose}
          notify={notify}
          onClose={() => setSettingsOpen(false)}
          onSaved={() => {
            setSettingsOpen(false);
            settings.reload();
            preview.reload();
          }}
        />
      )}
    </div>
  );
};

export default YearClosingTab;
