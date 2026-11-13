import { useCallback, useEffect, useState } from "react";
import { Button, IconButton, Snackbar, Tab, Tabs, TextField, ThemeProvider } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import styles from "./Enrollment.module.css";
import { litaroTheme } from "../../../shared/styles/LitaroTheme";
import * as service from "./services/EnrollmentService";
import { usePermissions } from "../../../shared/hooks/UsePermissions";
import PeriodStrip from "./components/PeriodStrip";
import OldStudentsTab from "./components/OldStudentsTab";
import NewStudentsTab from "./components/NewStudentsTab";
import MovementsTab from "./components/MovementsTab";
import DatesPanel from "./components/DatesPanel";
import ImportDialog from "./components/ImportDialog";

const yearText = (year) => `Año ${year.yearId}${year.active ? "" : " (inactivo)"}`;

const Enrollment = () => {
  const { can, ready } = usePermissions();

  const viewer = can("EnrollmentProcess", "read");
  const staff = can("EnrollmentProcess", "create") || can("EnrollmentProcess", "update");
  const rector = can("AdmissionDecision", "update");
  const mover = can("StudentMovement", "read");

  const [options, setOptions] = useState(null);
  const [optionsError, setOptionsError] = useState(null);
  const [chosenYear, setChosenYear] = useState(null);
  const [version, setVersion] = useState(0);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(null);
  const [datesOpen, setDatesOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const years = options?.years ?? [];
  const yearId = chosenYear ?? (years.length > 0 ? Math.max(...years.map((year) => year.yearId)) : null);
  const key = `${yearId}|${version}`;

  useEffect(() => {
    if (!viewer) return undefined;

    let cancelled = false;

    service
      .getOptions()
      .then((result) => {
        if (!cancelled) setOptions(result ?? { years: [], grades: [] });
      })
      .catch((error) => {
        if (!cancelled) setOptionsError(error.message ?? "No fue posible cargar los años.");
      });

    return () => {
      cancelled = true;
    };
  }, [viewer]);

  useEffect(() => {
    if (!viewer || yearId === null) return undefined;

    let cancelled = false;

    Promise.all([
      service.getPeriod(yearId),
      service.getPreEnrollments(yearId),
      service.getAdmissions(yearId),
    ])
      .then(([period, pre, admissions]) => {
        if (cancelled) return;

        setData({
          key,
          yearId,
          period: period ?? null,
          pre: pre ?? [],
          admissions: admissions ?? [],
        });
      })
      .catch((error) => {
        if (!cancelled) setData({ key, yearId, error: error.message ?? "No fue posible cargar la matrícula." });
      });

    return () => {
      cancelled = true;
    };
  }, [viewer, yearId, key]);

  const notify = useCallback((message, kind = "info") => setToast({ id: Date.now(), message, kind }), []);
  const reload = useCallback(() => setVersion((current) => current + 1), []);

  if (!ready) {
    return (
      <div className={styles.page}>
        <p className={styles.message}>Cargando…</p>
      </div>
    );
  }

  if (!viewer && !mover) {
    return (
      <div className={styles.page}>
        <p className={styles.message}>No tienes permisos para ver la matrícula.</p>
      </div>
    );
  }

  const current = data?.yearId === yearId ? data : null;
  const failed = current?.key === key && current.error ? current.error : null;
  const refreshing = Boolean(yearId !== null && data?.key !== key);
  const loaded = current && !current.error;

  const waiting = loaded ? current.pre.filter((row) => row.status === "RESERVED").length : 0;
  const pendingRequests = loaded ? current.admissions.filter((row) => row.status === "PENDING").length : 0;

  const viewerTab = rector && !staff ? "new" : "old";
  const fallbackTab = viewer ? viewerTab : "moves";
  const activeTab = tab ?? fallbackTab;

  const tabLabel = (text, count) => (
    <span>
      {text}
      {count > 0 && <span className={styles.tabCount}>{count}</span>}
    </span>
  );

  return (
    <ThemeProvider theme={litaroTheme}>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Matrícula</h1>
            <p className={styles.subtitle}>
              {viewer
                ? "Prematrícula de estudiantes antiguos y admisión de nuevos."
                : "Cambios de curso, de sede y retiro de estudiantes."}
            </p>
          </div>

          <div className={styles.headerActions}>
            {years.length > 0 && (
              <TextField
                select
                size="small"
                className={styles.yearSelect}
                value={yearId ?? ""}
                onChange={(event) => setChosenYear(Number(event.target.value))}
                slotProps={{ select: { native: true }, htmlInput: { "aria-label": "Año de matrícula" } }}
              >
                {years.map((year) => (
                  <option key={year.yearId} value={year.yearId}>
                    {yearText(year)}
                  </option>
                ))}
              </TextField>
            )}

            <IconButton aria-label="Actualizar" onClick={reload} disabled={refreshing || yearId === null}>
              <RefreshIcon fontSize="small" />
            </IconButton>

            {ready && can("Enrollment", "create") && (
              <Button variant="outlined" onClick={() => setImportOpen(true)}>
                Importar del SIMAT
              </Button>
            )}
          </div>
        </div>

        {optionsError && <p className={styles.message}>{optionsError}</p>}

        {!optionsError && options && years.length === 0 && (
          <p className={styles.message}>Todavía no hay años académicos creados.</p>
        )}

        {failed && (
          <p className={styles.message}>
            {failed}{" "}
            <button type="button" className={styles.linkButton} onClick={reload}>
              Reintentar
            </button>
          </p>
        )}

        {!failed && !optionsError && yearId !== null && !current && <p className={styles.message}>Cargando…</p>}

        {(loaded || !viewer) && (
          <>
            {loaded && activeTab !== "moves" && (
              <PeriodStrip yearId={yearId} period={current.period} canEdit={staff} onEdit={() => setDatesOpen(true)} />
            )}

            <Tabs
              className={styles.tabs}
              value={activeTab}
              onChange={(_, value) => setTab(value)}
              variant="scrollable"
              scrollButtons={false}
            >
              {viewer && <Tab value="old" label={tabLabel("Antiguos", waiting)} />}
              {viewer && <Tab value="new" label={tabLabel("Nuevos", pendingRequests)} />}
              {mover && <Tab value="moves" label="Novedades" />}
            </Tabs>

            {loaded && activeTab === "old" && (
              <OldStudentsTab
                yearId={yearId}
                rows={current.pre}
                period={current.period}
                canManage={staff}
                onChanged={reload}
                notify={notify}
                onConfigure={() => setDatesOpen(true)}
              />
            )}

            {loaded && activeTab === "new" && (
              <NewStudentsTab
                yearId={yearId}
                rows={current.admissions}
                grades={options?.grades ?? []}
                period={current.period}
                canCreate={staff}
                canDecide={rector}
                onChanged={reload}
                notify={notify}
                onConfigure={() => setDatesOpen(true)}
              />
            )}

            {mover && activeTab === "moves" && (
              <MovementsTab canExecute={can("StudentMovement", "update")} notify={notify} />
            )}
          </>
        )}

        {datesOpen && (
          <DatesPanel
            yearId={yearId}
            period={current?.period ?? null}
            onClose={() => setDatesOpen(false)}
            onSaved={() => {
              setDatesOpen(false);
              notify("Fechas guardadas.");
              reload();
            }}
          />
        )}

        <ImportDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onImported={(result) => {
            notify(
              `Importación aplicada: ${result.studentsCreated} estudiantes nuevos y ${result.studentsUpdated} actualizados.` +
                (result.alertsCreated > 0 ? ` Hay ${result.alertsCreated} notificaciones nuevas.` : ""),
            );
            reload();
          }}
        />

        {toast && (
          <Snackbar
            key={toast.id}
            open
            autoHideDuration={toast.kind === "error" ? 8000 : 4000}
            onClose={(_, reason) => {
              if (reason !== "clickaway") setToast(null);
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <div className={`${styles.toast} ${toast.kind === "error" ? styles.toastError : ""}`} role="status">
              {toast.message}
            </div>
          </Snackbar>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Enrollment;
