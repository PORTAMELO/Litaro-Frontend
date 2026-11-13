import { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import styles from "../Enrollment.module.css";
import * as service from "../services/MovementService";
import MovementPanel from "./MovementPanel";
import { EmptyState, StatusMark } from "../../../../shared/components/Ui/Ui";
import { ENROLLMENT_STATUS } from "../utils/EnrollmentUtils";

const MIN_QUERY = 2;
const SEARCH_DELAY = 300;

const MovementsTab = ({ canExecute, notify }) => {
  const [options, setOptions] = useState(null);
  const [optionsError, setOptionsError] = useState(null);
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ key: null, rows: [], error: null });
  const [selectedId, setSelectedId] = useState(null);

  const text = query.trim();
  const searchable = text.length >= MIN_QUERY;
  const key = `${text}|${version}`;
  const searching = searchable && result.key !== key;
  const rows = searchable ? result.rows : [];
  const selected = rows.find((row) => row.enrollmentId === selectedId) ?? null;

  useEffect(() => {
    let cancelled = false;

    service
      .getOptions()
      .then((loaded) => {
        if (!cancelled) setOptions(loaded ?? { campuses: [], classrooms: [], withdrawalReasons: [] });
      })
      .catch((error) => {
        if (!cancelled) setOptionsError(error.message ?? "No fue posible cargar las sedes y cursos.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!searchable) return undefined;

    let cancelled = false;

    const timer = setTimeout(() => {
      service
        .searchStudents(text)
        .then((found) => {
          if (!cancelled) setResult({ key, rows: found ?? [], error: null });
        })
        .catch((error) => {
          if (!cancelled)
            setResult({ key, rows: [], error: error.message ?? "No fue posible buscar al estudiante." });
        });
    }, SEARCH_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchable, text, key]);

  if (optionsError) {
    return (
      <div className={styles.card}>
        <EmptyState title="No se pudo cargar" text={optionsError} />
      </div>
    );
  }

  let body;

  if (!searchable) {
    body = (
      <EmptyState
        title="Busca al estudiante"
        text="Escribe el nombre, el documento o el código para ver su matrícula y registrar un cambio de curso, de sede o un retiro."
      />
    );
  } else if (result.error && !searching) {
    body = <EmptyState title="No se pudo buscar" text={result.error} />;
  } else if (rows.length === 0) {
    body = searching ? (
      <p className={styles.message}>Buscando…</p>
    ) : (
      <EmptyState title="Sin resultados" text="Ningún estudiante con matrícula en el año activo coincide." />
    );
  } else {
    body = (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Curso</th>
              <th className={styles.hideSmall}>Sede</th>
              <th>Estado</th>
              <th aria-label="Abrir" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const info = ENROLLMENT_STATUS[row.status] ?? { label: row.status, color: "#6b7280" };

              return (
                <tr key={row.enrollmentId} className={styles.rowClickable} onClick={() => setSelectedId(row.enrollmentId)}>
                  <td>
                    <button
                      type="button"
                      className={styles.rowName}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(row.enrollmentId);
                      }}
                    >
                      <span className={styles.primaryText}>{row.studentName}</span>
                    </button>
                    <span className={styles.secondaryText}>{row.document}</span>
                  </td>

                  <td>
                    {row.classroomName}
                    <span className={styles.secondaryText}>
                      {row.gradeName}, {row.yearId}
                    </span>
                  </td>

                  <td className={styles.hideSmall}>{row.campusName}</td>

                  <td>
                    <StatusMark label={info.label} color={info.color} />
                    {row.statusReason && <span className={styles.secondaryText}>{row.statusReason}</span>}
                  </td>

                  <td className={styles.cellRight}>
                    <span className={styles.chevron}>
                      <ChevronRightIcon fontSize="small" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.toolbar}>
        <TextField
          size="small"
          placeholder="Nombre, documento o código"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ width: 320 }}
          slotProps={{
            htmlInput: { "aria-label": "Buscar estudiante" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        {!canExecute && <span className={styles.toolbarNote}>Solo consulta: no tienes permiso para ejecutar novedades.</span>}
      </div>

      {body}

      {selected && options && (
        <MovementPanel
          key={selected.enrollmentId}
          row={selected}
          options={options}
          canExecute={canExecute}
          version={version}
          notify={notify}
          onClose={() => setSelectedId(null)}
          onDone={(message) => {
            notify(message);
            setVersion((current) => current + 1);
          }}
        />
      )}
    </div>
  );
};

export default MovementsTab;
