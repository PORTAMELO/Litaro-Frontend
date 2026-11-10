import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import * as administration from "../../Administration/services/AdministrationService";
import { Field } from "../../../../shared/components/Ui/Ui";

const startYear = (year) => new Date(year.startDate).getUTCFullYear();

const yearLabel = (year) => `${startYear(year)}${year.active ? "" : " (inactivo)"}`;

const defaultYearId = (years) => {
  const current = new Date().getFullYear();
  const match = years.find((year) => startYear(year) === current) ?? years[0];
  return match?.yearId ?? "";
};

const SEVERITY_COLOR = { Error: "#b91c1c", Conflicto: "#d97706", Aviso: "#6b7280" };

const Stat = ({ value, label, alert = false }) => (
  <div className={styles.stat}>
    <div className={styles.statValue} style={alert && value > 0 ? { color: "#b91c1c" } : undefined}>
      {value}
    </div>
    <div className={styles.statLabel}>{label}</div>
  </div>
);

const Result = ({ result }) => {
  const missing = result.missingInSimat?.length ?? 0;

  return (
    <>
      <div className={styles.importStats}>
        <Stat value={result.studentsCreated} label="Estudiantes nuevos" />
        <Stat value={result.studentsUpdated} label="Ya existentes" />
        <Stat value={result.rowsWithIssues} label="Filas con problemas" alert />
        <Stat value={missing} label="No están en el archivo" />
      </div>

      {result.rowsWithIssues > 0 && (
        <p className={styles.hint}>
          Las filas con problemas no se importan. Corrígelas en el Excel y vuelve a cargarlo.
        </p>
      )}

      {missing > 0 && (
        <p className={styles.hint}>
          {missing === 1 ? "Un estudiante matriculado" : `${missing} estudiantes matriculados`} en Litaro no aparece en
          el archivo. Secretaría recibe una alerta para revisarlo en el SIMAT.
        </p>
      )}

      <details className={styles.details}>
        <summary>Ver detalle</summary>

        <dl className={styles.facts}>
          <dt>Filas leídas</dt>
          <dd>{result.totalRows}</dd>
          <dt>Matrículas nuevas</dt>
          <dd>{result.enrollmentsCreated}</dd>
          <dt>Matrículas actualizadas</dt>
          <dd>{result.enrollmentsUpdated}</dd>
          <dt>Salones nuevos</dt>
          <dd>{result.classroomsCreated}</dd>
          <dt>Filas omitidas</dt>
          <dd>{result.rowsSkipped}</dd>
        </dl>

        <p className={styles.hint}>
          Los estudiantes retirados, trasladados o graduados no se importan porque no tienen matrícula activa. Los
          estudiantes nuevos se crean sin contraseña.
        </p>

        {result.issues.length > 0 && (
          <div className={styles.tableWrapper} style={{ maxHeight: 260, overflow: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fila</th>
                  <th>Documento</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {result.issues.map((issue, index) => (
                  <tr key={`${issue.row}-${index}`}>
                    <td>{issue.row}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {issue.document}
                      <span className={styles.secondaryText}>{issue.name}</span>
                    </td>
                    <td>
                      <span className={ui.status}>
                        <span
                          className={ui.dot}
                          style={{ backgroundColor: SEVERITY_COLOR[issue.severity] ?? "#6b7280" }}
                          aria-hidden="true"
                        />
                        {issue.severity}
                      </span>
                      <span className={styles.secondaryText}>{issue.message}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </>
  );
};

const ImportDialog = ({ open, onClose, onImported }) => {
  const [years, setYears] = useState([]);
  const [yearId, setYearId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [applied, setApplied] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInput = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;

    administration
      .getAcademicYears()
      .then((list) => {
        if (!cancelled) setYears(list ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("No fue posible cargar los años académicos.");
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const selectedYear = yearId !== "" ? yearId : defaultYearId(years);
  const shown = applied ?? preview;
  const globalErrors = shown?.globalErrors ?? [];
  const changes = preview ? preview.studentsCreated + preview.studentsUpdated + preview.enrollmentsUpdated : 0;
  const canApply = Boolean(preview) && !applied && !loading && globalErrors.length === 0 && changes > 0;

  const reset = () => {
    setPreview(null);
    setApplied(null);
    setError(null);
  };

  const close = () => {
    setFile(null);
    setYearId("");
    reset();
    onClose();
  };

  const run = async (dryRun) => {
    if (!file || selectedYear === "") return;

    setLoading(true);
    setError(null);

    try {
      const result = await administration.importSimat(file, selectedYear, dryRun);
      if (!result) return;

      if (dryRun) {
        setPreview(result);
      } else {
        setApplied(result);
        if (result.applied) onImported?.(result);
      }
    } catch (err) {
      setError(err.message ?? "No fue posible procesar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : close} maxWidth="sm" fullWidth>
      <DialogTitle>Importar del SIMAT</DialogTitle>

      <DialogContent>
        <div className={styles.importBody}>
          <p className={styles.hint}>
            Carga el Excel de matriculados que descargas del SIMAT. Primero ves una vista previa y no se guarda nada
            hasta que confirmes.
          </p>

          <div className={styles.formGrid}>
            <Field label="Año académico">
              <TextField
                select
                size="small"
                value={selectedYear}
                onChange={(event) => {
                  setYearId(event.target.value);
                  reset();
                }}
                disabled={loading || Boolean(applied)}
                slotProps={{ select: { native: true } }}
              >
                {years.map((year) => (
                  <option key={year.yearId} value={year.yearId}>
                    {yearLabel(year)}
                  </option>
                ))}
              </TextField>
            </Field>

            <div className={ui.field}>
              <span className={ui.fieldLabel}>Archivo</span>
              <Button
                variant="outlined"
                onClick={() => fileInput.current?.click()}
                disabled={loading || Boolean(applied)}
                sx={{
                  justifyContent: "flex-start",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file ? file.name : "Elegir Excel (.xlsx)"}
              </Button>
              <input
                ref={fileInput}
                hidden
                type="file"
                accept=".xlsx"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  reset();
                  event.target.value = "";
                }}
              />
            </div>
          </div>

          {loading && (
            <div>
              <LinearProgress />
              <p className={styles.hint}>Procesando el archivo. La primera carga puede tardar un par de minutos.</p>
            </div>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {globalErrors.length > 0 && (
            <Alert severity="error">
              {globalErrors.map((message) => (
                <div key={message}>{message}</div>
              ))}
            </Alert>
          )}

          {shown && globalErrors.length === 0 && (
            <>
              {applied && (
                <Alert severity={applied.applied ? "success" : "info"}>
                  {applied.applied
                    ? `Importación aplicada.${applied.alertsCreated > 0 ? ` Se crearon ${applied.alertsCreated} alertas para Secretaría.` : ""}`
                    : "No había cambios para aplicar."}
                </Alert>
              )}

              <Result result={shown} />
            </>
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={close} disabled={loading}>
          {applied ? "Cerrar" : "Cancelar"}
        </Button>

        {!preview && !applied && (
          <Button variant="contained" onClick={() => run(true)} disabled={!file || selectedYear === "" || loading}>
            Ver vista previa
          </Button>
        )}

        {preview && !applied && (
          <Button variant="contained" onClick={() => run(false)} disabled={!canApply}>
            {loading ? "Importando…" : "Importar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportDialog;
