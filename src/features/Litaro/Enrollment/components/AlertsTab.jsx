import { useState } from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";

import styles from "../Enrollment.module.css";
import * as service from "../services/EnrollmentService";
import { EmptyState, SegmentedFilter, StatusMark } from "../../../../shared/components/Ui/Ui";
import { ALERT_TYPE, PAGE_SIZE, formatDateTime } from "../utils/EnrollmentUtils";

const AlertsTab = ({ alerts, onChanged, notify }) => {
  const [filter, setFilter] = useState("PENDING");
  const [selected, setSelected] = useState([]);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [saving, setSaving] = useState(false);

  const pending = alerts.filter((alert) => alert.status === "PENDING");
  const done = alerts.filter((alert) => alert.status !== "PENDING");
  const isPending = filter === "PENDING";
  const list = isPending ? pending : done;
  const visible = list.slice(0, limit);

  const pendingIds = new Set(pending.map((alert) => alert.simatAlertId));
  const chosen = selected.filter((id) => pendingIds.has(id));
  const allChosen = pending.length > 0 && chosen.length === pending.length;

  const toggle = (id) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const resolve = async () => {
    setSaving(true);

    try {
      await service.resolveSimatAlerts(chosen, null);
      notify(
        chosen.length === 1 ? "Alerta marcada como registrada." : `${chosen.length} alertas marcadas como registradas.`,
      );
      setSelected([]);
      onChanged();
    } catch (error) {
      notify(error.message ?? "No fue posible marcar las alertas.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.toolbar}>
          <SegmentedFilter
          className={styles.toolbarSegment}
            label="Estado de las alertas"
            options={[
              { value: "PENDING", label: "Pendientes", count: pending.length },
              { value: "DONE", label: "Hechas", count: done.length },
            ]}
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setLimit(PAGE_SIZE);
            }}
          />

          <span className={styles.toolbarNote}>Estos cambios se registran a mano en el SIMAT.</span>

          <span className={styles.toolbarSpacer} />

          {isPending && pending.length > 0 && (
            <FormControlLabel
              className={styles.checkAll}
              label={`Seleccionar las ${pending.length}`}
              control={
                <Checkbox
                  size="small"
                  checked={allChosen}
                  indeterminate={chosen.length > 0 && !allChosen}
                  onChange={() => setSelected(allChosen ? [] : pending.map((alert) => alert.simatAlertId))}
                />
              }
            />
          )}
        </div>

        {list.length === 0 ? (
          <EmptyState
            title={isPending ? "Todo al día" : "Aún no hay alertas hechas"}
            text={
              isPending
                ? "Aquí aparecen las admisiones aprobadas, los cupos liberados y los estudiantes que faltan en el archivo del SIMAT."
                : "Las alertas que marques como registradas quedan guardadas aquí."
            }
          />
        ) : (
          <ul className={styles.alertList}>
            {visible.map((alert) => {
              const info = ALERT_TYPE[alert.type] ?? { label: alert.type, color: "#6b7280" };

              return (
                <li
                  key={alert.simatAlertId}
                  className={`${styles.alertItem} ${isPending ? "" : `${styles.alertItemPlain} ${styles.alertDone}`}`}
                >
                  {isPending && (
                    <Checkbox
                      size="small"
                      checked={chosen.includes(alert.simatAlertId)}
                      onChange={() => toggle(alert.simatAlertId)}
                      disabled={saving}
                      slotProps={{ input: { "aria-label": alert.message } }}
                      sx={{ marginTop: "-4px" }}
                    />
                  )}

                  <div>
                    <div className={styles.alertMessage}>{alert.message}</div>

                    <div className={styles.alertMeta}>
                      <StatusMark label={info.label} color={info.color} />
                      <span>{formatDateTime(isPending ? alert.createdAt : (alert.resolvedAt ?? alert.createdAt))}</span>
                      {!isPending && alert.resolvedBy && <span>Registrada por {alert.resolvedBy}</span>}
                      {!isPending && alert.resolutionNote && <span>{alert.resolutionNote}</span>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {list.length > limit && (
          <div className={styles.cardFooter}>
            <span>
              Mostrando {visible.length} de {list.length}
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
      </div>

      {isPending && chosen.length > 0 && (
        <div className={styles.selectionBar} role="region" aria-label="Alertas seleccionadas">
          <span>{chosen.length === 1 ? "1 seleccionada" : `${chosen.length} seleccionadas`}</span>

          <Button
            variant="contained"
            onClick={resolve}
            disabled={saving}
            sx={{ backgroundColor: "#ffffff", color: "primary.main", "&:hover": { backgroundColor: "#eeeef6" } }}
          >
            {saving ? "Guardando…" : "Ya las registré en el SIMAT"}
          </Button>
        </div>
      )}
    </>
  );
};

export default AlertsTab;
