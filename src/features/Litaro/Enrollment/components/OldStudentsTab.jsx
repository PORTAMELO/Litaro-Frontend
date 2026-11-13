import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import styles from "../Enrollment.module.css";
import * as service from "../services/EnrollmentService";
import ResponsePopover from "./ResponsePopover";
import { EmptyState, SegmentedFilter, StatusMark } from "../../../../shared/components/Ui/Ui";
import {
  PAGE_SIZE,
  PRE_STATUS,
  countBy,
  formatDateTime,
  formatDay,
  matchesQuery,
  plural,
  todayInColombia,
} from "../utils/EnrollmentUtils";

const FILTERS = [
  { value: "RESERVED", label: "Sin respuesta" },
  { value: "CONFIRMED", label: "Confirmaron" },
  { value: "DECLINED", label: "No continúan" },
  { value: "LOST", label: "Perdieron el cupo" },
];

const OldStudentsTab = ({ yearId, rows, period, canManage, canRestore, onChanged, notify, onConfigure }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [response, setResponse] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [confirmingRestore, setConfirmingRestore] = useState(false);

  const totals = countBy(rows, (row) => row.status);
  const waiting = totals.RESERVED ?? 0;
  const lost = totals.LOST ?? 0;
  const restorable = canRestore && lost > 0 && Boolean(period) && period.preEnrollmentEnd >= todayInColombia();

  const restore = async () => {
    setConfirmingRestore(false);
    setRestoring(true);

    try {
      const result = await service.restoreLostPreEnrollments(yearId);
      const restored = result?.restored ?? 0;
      const reverts = result?.simatReverts ?? 0;

      notify(
        `Se ${plural(restored, "restableció", "restablecieron")} ${restored} ${plural(restored, "cupo", "cupos")}.` +
          (reverts > 0
            ? ` Secretaría recibirá ${reverts} ${plural(reverts, "aviso", "avisos")} para revertir la novedad en el SIMAT.`
            : ""),
      );
      onChanged();
    } catch (error) {
      notify(error.message ?? "No fue posible restablecer los cupos.", "error");
    } finally {
      setRestoring(false);
    }
  };
  const active = filter ?? (waiting > 0 ? "RESERVED" : "all");

  const options = [
    { value: "all", label: "Todos", count: rows.length },
    ...FILTERS.map((item) => ({ ...item, count: totals[item.value] ?? 0 })).filter(
      (item) => item.count > 0 || item.value === active,
    ),
  ];

  const matching = rows.filter(
    (row) => (active === "all" || row.status === active) && matchesQuery(query, row.studentName, row.document),
  );
  const visible = matching.slice(0, limit);

  const generate = async () => {
    setMenuAnchor(null);
    setGenerating(true);

    try {
      const result = await service.generatePreEnrollments(yearId);
      const created = result?.created ?? 0;
      const finishing = result?.withoutNextGrade ?? 0;

      notify(
        (created === 0
          ? "No había cupos nuevos por reservar."
          : `Se ${plural(created, "reservó", "reservaron")} ${created} ${plural(created, "cupo", "cupos")}.`) +
          (finishing > 0 ? ` ${finishing} terminan el colegio y no tienen grado siguiente.` : ""),
      );
      onChanged();
    } catch (error) {
      notify(error.message ?? "No fue posible reservar los cupos.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const respond = (event, row, confirm) => setResponse({ anchor: event.currentTarget, row, confirm });

  if (!period) {
    return (
      <div className={styles.card}>
        <EmptyState
          title="Primero define las fechas"
          text={`La prematrícula de ${yearId} necesita un plazo para que las familias respondan.`}
        >
          {canManage && (
            <Button variant="contained" onClick={onConfigure}>
              Configurar fechas
            </Button>
          )}
        </EmptyState>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={styles.card}>
        <EmptyState
          title="Aún no hay cupos reservados"
          text={
            canManage
              ? `Se reserva el cupo del grado siguiente para los estudiantes matriculados el año anterior a ${yearId}.`
              : "Secretaría todavía no ha reservado los cupos."
          }
        >
          {canManage && (
            <Button variant="contained" onClick={generate} disabled={generating}>
              {generating ? "Reservando…" : `Reservar cupos de ${yearId}`}
            </Button>
          )}
        </EmptyState>
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

        <SegmentedFilter
          className={styles.toolbarSegment}
          label="Filtrar por respuesta"
          options={options}
          value={active}
          onChange={(value) => {
            setFilter(value);
            setLimit(PAGE_SIZE);
          }}
        />

        {canManage && (
          <div className={styles.toolbarActions}>
            <IconButton size="small" aria-label="Más acciones" onClick={(event) => setMenuAnchor(event.currentTarget)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              <MenuItem onClick={generate} disabled={generating}>
                Reservar cupos que falten
              </MenuItem>
              {restorable && (
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    setConfirmingRestore(true);
                  }}
                  disabled={restoring}
                >
                  Restablecer cupos perdidos
                </MenuItem>
              )}
            </Menu>
          </div>
        )}
      </div>

      {matching.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          text={
            query.trim() === "" ? "No hay estudiantes en esta lista." : "Ningún estudiante coincide con la búsqueda."
          }
        />
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th className={styles.hideSmall}>Pasa a</th>
                <th>Respuesta</th>
                {canManage && <th aria-label="Acciones" />}
              </tr>
            </thead>

            <tbody>
              {visible.map((row) => {
                const info = PRE_STATUS[row.status] ?? { label: row.status, color: "#6b7280" };
                const detail =
                  row.responseNote ??
                  (row.respondedAt ? formatDateTime(row.respondedAt) : `Reservado el ${formatDay(row.createdAt)}`);

                return (
                  <tr key={row.preEnrollmentId}>
                    <td>
                      <span className={styles.primaryText}>{row.studentName}</span>
                      <span className={styles.secondaryText}>Documento {row.document}</span>
                    </td>

                    <td className={styles.hideSmall}>{row.gradeName}</td>

                    <td>
                      <StatusMark label={info.label} color={info.color} />
                      {detail && <span className={styles.secondaryText}>{detail}</span>}
                    </td>

                    {canManage && (
                      <td className={styles.cellRight}>
                        {row.status === "RESERVED" && (
                          <span className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.quiet}
                              onClick={(event) => respond(event, row, true)}
                            >
                              Confirmó
                            </button>
                            <button
                              type="button"
                              className={`${styles.quiet} ${styles.quietMuted}`}
                              onClick={(event) => respond(event, row, false)}
                            >
                              No continúa
                            </button>
                          </span>
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

      <Dialog open={confirmingRestore} onClose={() => setConfirmingRestore(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Restablecer cupos</DialogTitle>
        <DialogContent>
          {lost === 1
            ? "1 estudiante volverá a quedar sin respuesta."
            : `${lost} estudiantes volverán a quedar sin respuesta.`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmingRestore(false)}>Cancelar</Button>
          <Button variant="contained" onClick={restore}>
            Restablecer
          </Button>
        </DialogActions>
      </Dialog>

      {response && (
        <ResponsePopover
          key={`${response.row.preEnrollmentId}-${response.confirm}`}
          target={response}
          onClose={() => setResponse(null)}
          onSaved={(message) => {
            setResponse(null);
            notify(message);
            onChanged();
          }}
        />
      )}
    </div>
  );
};

export default OldStudentsTab;
