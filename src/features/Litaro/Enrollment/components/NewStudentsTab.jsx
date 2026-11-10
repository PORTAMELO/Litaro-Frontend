import { useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import styles from "../Enrollment.module.css";
import AdmissionForm from "./AdmissionForm";
import AdmissionPanel from "./AdmissionPanel";
import { EmptyState, SegmentedFilter, StatusMark } from "../../../../shared/components/Ui/Ui";
import {
  ADMISSION_STATUS,
  PAGE_SIZE,
  countBy,
  formatDateTime,
  formatDay,
  matchesQuery,
  todayInColombia,
} from "../utils/EnrollmentUtils";

const FILTERS = [
  { value: "PENDING", label: "Pendientes" },
  { value: "WAITLIST", label: "En espera" },
  { value: "APPROVED", label: "Aprobadas" },
  { value: "REJECTED", label: "Rechazadas" },
];

const NewStudentsTab = ({ yearId, rows, grades, period, canCreate, canDecide, onChanged, notify, onConfigure }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState(null);
  const [creating, setCreating] = useState(false);

  const today = todayInColombia();
  const receiving = Boolean(period) && today >= period.admissionStart && today <= period.admissionEnd;
  const closedNote = period
    ? `Las solicitudes se reciben del ${formatDay(period.admissionStart)} al ${formatDay(period.admissionEnd)}.`
    : "Primero define las fechas de matrícula.";

  const totals = countBy(rows, (row) => row.status);
  const pending = totals.PENDING ?? 0;
  const active = filter ?? (pending > 0 ? "PENDING" : "all");

  const options = [
    { value: "all", label: "Todas", count: rows.length },
    ...FILTERS.map((item) => ({ ...item, count: totals[item.value] ?? 0 })).filter(
      (item) => item.count > 0 || item.value === active,
    ),
  ];

  const matching = rows.filter(
    (row) =>
      (active === "all" || row.status === active) &&
      matchesQuery(query, row.firstName, row.lastName, `${row.firstName} ${row.lastName}`, row.documentNumber),
  );
  const visible = matching.slice(0, limit);
  const selected = rows.find((row) => row.admissionRequestId === selectedId) ?? null;

  const newRequest = (
    <span title={receiving ? undefined : closedNote}>
      <Button variant="contained" onClick={() => setCreating(true)} disabled={!receiving}>
        Nueva solicitud
      </Button>
    </span>
  );

  const panels = (
    <>
      {creating && (
        <AdmissionForm
          yearId={yearId}
          grades={grades}
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            notify("Solicitud registrada. Queda pendiente de la decisión del Rector.");
            onChanged();
          }}
        />
      )}

      {selected && (
        <AdmissionPanel
          key={selected.admissionRequestId}
          row={selected}
          canDecide={canDecide}
          onClose={() => setSelectedId(null)}
          onDecided={(message) => {
            setSelectedId(null);
            notify(message);
            onChanged();
          }}
        />
      )}
    </>
  );

  if (rows.length === 0) {
    return (
      <div className={styles.card}>
        <EmptyState
          title={period ? "Todavía no hay solicitudes" : "Primero define las fechas"}
          text={
            period
              ? receiving
                ? "Cuando una familia pida cupo, regístralo aquí y el Rector lo revisa."
                : closedNote
              : `Las solicitudes de ${yearId} necesitan un plazo de recepción.`
          }
        >
          {period && canCreate && newRequest}
          {!period && canCreate && (
            <Button variant="contained" onClick={onConfigure}>
              Configurar fechas
            </Button>
          )}
        </EmptyState>
        {panels}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.toolbar}>
        <TextField
          size="small"
          placeholder="Buscar por nombre o documento"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setLimit(PAGE_SIZE);
          }}
          sx={{ width: 280 }}
          slotProps={{
            htmlInput: { "aria-label": "Buscar aspirante" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <SegmentedFilter
          className={styles.toolbarSegment}
          label="Filtrar por estado"
          options={options}
          value={active}
          onChange={(value) => {
            setFilter(value);
            setLimit(PAGE_SIZE);
          }}
        />

        {canCreate && <div className={styles.toolbarActions}>{newRequest}</div>}
      </div>

      {matching.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          text={
            query.trim() === "" ? "No hay solicitudes en esta lista." : "Ninguna solicitud coincide con la búsqueda."
          }
        />
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Aspirante</th>
                <th className={styles.hideSmall}>Grado</th>
                <th>Estado</th>
                <th className={styles.hideMedium}>Registrada</th>
                <th aria-label="Abrir" />
              </tr>
            </thead>

            <tbody>
              {visible.map((row) => {
                const info = ADMISSION_STATUS[row.status] ?? { label: row.status, color: "#6b7280" };
                const decidable = canDecide && (row.status === "PENDING" || row.status === "WAITLIST");

                return (
                  <tr
                    key={row.admissionRequestId}
                    className={styles.rowClickable}
                    onClick={() => setSelectedId(row.admissionRequestId)}
                  >
                    <td>
                      <button
                        type="button"
                        className={styles.rowName}
                        onClick={() => setSelectedId(row.admissionRequestId)}
                      >
                        {row.firstName} {row.lastName}
                      </button>
                      <span className={styles.secondaryText}>
                        {row.documentType} {row.documentNumber}
                      </span>
                    </td>

                    <td className={styles.hideSmall}>{row.gradeName}</td>

                    <td>
                      <StatusMark label={info.label} color={info.color} />
                      {row.waitlistPosition && (
                        <span className={styles.secondaryText}>Puesto {row.waitlistPosition} en su grado</span>
                      )}
                    </td>

                    <td className={styles.hideMedium}>{formatDateTime(row.createdAt)}</td>

                    <td className={styles.cellRight}>
                      {decidable ? (
                        <span className={styles.quiet}>Revisar</span>
                      ) : (
                        <span className={styles.chevron} aria-hidden="true">
                          <ChevronRightIcon fontSize="small" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {matching.length > limit && (
        <div className={styles.cardFooter}>
          <span>
            Mostrando {visible.length} de {matching.length}
          </span>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
          >
            Mostrar más
          </button>
        </div>
      )}

      {panels}
    </div>
  );
};

export default NewStudentsTab;
