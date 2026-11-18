import { useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import styles from "../Observations.module.css";
import page from "@/shared/components/Ui/Page.module.css";
import SidePanel from "@/shared/components/Ui/SidePanel";
import ui from "@/shared/components/Ui/Ui.module.css";
import { EmptyState, Field, TableSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import * as service from "../services/ObservationService";
import { plain } from "../utils/CitationUtils";
import { emptyScope } from "../utils/ObservationUtils";
import ConsolidatedPanel from "./ConsolidatedPanel";
import ScopeFilters from "./ScopeFilters";

const THRESHOLD_MIN = 1;
const THRESHOLD_MAX = 50;

const ThresholdPanel = ({ current, notify, onClose, onSaved }) => {
  const [value, setValue] = useState(String(current));
  const [saving, setSaving] = useState(false);
  const number = Number(value);
  const valid = Number.isInteger(number) && number >= THRESHOLD_MIN && number <= THRESHOLD_MAX && number !== current;

  const save = async () => {
    setSaving(true);

    try {
      await service.saveSettings({ typeIThreshold: number });
      notify("Umbral actualizado.");
      onSaved();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar el umbral.", "error");
      setSaving(false);
    }
  };

  return (
    <SidePanel
      open
      title="Alerta por reincidencia"
      subtitle="Parámetros del observador"
      busy={saving}
      onClose={onClose}
      footer={
        <div className={ui.panelActions}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={save} disabled={saving || !valid}>
            Guardar
          </Button>
        </div>
      }
    >
      <div className={page.formStack}>
        <Field label="Situaciones Tipo I en el año para alertar a Coordinación">
          <TextField
            type="number"
            size="small"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            slotProps={{ htmlInput: { min: THRESHOLD_MIN, max: THRESHOLD_MAX, step: 1 } }}
          />
        </Field>
        <div className={page.notice}>
          La alerta sale una sola vez por estudiante y año, al registrar la observación que alcanza el umbral.
        </div>
      </div>
    </SidePanel>
  );
};

const ConsolidatedTab = ({ options, can, notify }) => {
  const canConfigure = can("ObservationConsolidated", "update");

  const [scope, setScope] = useState(() => emptyScope(options));
  const [text, setText] = useState("");
  const [selected, setSelected] = useState(null);
  const [editingThreshold, setEditingThreshold] = useState(false);

  const ranking = useLoad(() => service.getRanking(scope), [JSON.stringify(scope)]);

  const query = plain(text.trim());
  const rows = (ranking.data?.students ?? []).filter((row) => plain(row.studentName).includes(query));
  const reached = rows.filter((row) => row.reachedThreshold).length;

  return (
    <>
      <div className={page.card}>
        <div className={page.toolbar}>
          <ScopeFilters options={options} value={scope} onChange={setScope} />

          <TextField
            size="small"
            placeholder="Buscar estudiante"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={styles.searchField}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
              htmlInput: { "aria-label": "Buscar estudiante" },
            }}
          />
        </div>
      </div>

      <div className={page.card}>
        <div className={page.toolbar}>
          <h2 className={page.toolbarTitle}>Reincidencias</h2>
          {ranking.data && (
            <span className={page.toolbarMeta}>
              {rows.length} {rows.length === 1 ? "estudiante" : "estudiantes"}
              {reached > 0 ? ` · ${reached} en alerta` : ""}
            </span>
          )}
          <span className={page.toolbarSpacer} />
          {ranking.data && (
            <span className={page.secondaryText}>Alerta desde {ranking.data.threshold} Tipo I</span>
          )}
          {ranking.data && canConfigure && (
            <Button size="small" onClick={() => setEditingThreshold(true)}>
              Cambiar
            </Button>
          )}
        </div>

        {ranking.error && <p className={page.message}>{ranking.error}</p>}

        {!ranking.error && !ranking.data && <TableSkeleton rows={6} columns={6} />}

        {ranking.data && rows.length === 0 && (
          <EmptyState title="Sin observaciones" text="Ningún estudiante tiene observaciones con los filtros elegidos." />
        )}

        {rows.length > 0 && (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th className={page.cellRight}>Tipo I</th>
                  <th className={page.cellRight}>Tipo II</th>
                  <th className={page.cellRight}>Tipo III</th>
                  <th className={page.cellRight}>Académicas</th>
                  <th className={page.cellRight}>Total</th>
                  <th className={page.cellRight}>Compromisos pendientes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.studentId}
                    className={page.rowClickable}
                    tabIndex={0}
                    onClick={() => setSelected(row.studentId)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(row.studentId);
                      }
                    }}
                  >
                    <td>
                      {row.studentName}
                      <span className={page.secondaryText}>
                        {row.classroomName} · {row.campusName}
                      </span>
                    </td>
                    <td className={page.cellRight}>
                      <strong>{row.counts.typeI}</strong>
                      {row.reachedThreshold && <span className={styles.warningText}>En alerta</span>}
                    </td>
                    <td className={page.cellRight}>{row.counts.typeII}</td>
                    <td className={page.cellRight}>{row.counts.typeIII}</td>
                    <td className={page.cellRight}>{row.counts.academic}</td>
                    <td className={page.cellRight}>{row.counts.total}</td>
                    <td className={page.cellRight}>{row.pendingCommitments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ConsolidatedPanel studentId={selected} yearId={scope.yearId || undefined} onClose={() => setSelected(null)} />
      )}

      {editingThreshold && ranking.data && (
        <ThresholdPanel
          current={ranking.data.threshold}
          notify={notify}
          onClose={() => setEditingThreshold(false)}
          onSaved={() => {
            setEditingThreshold(false);
            ranking.reload();
          }}
        />
      )}
    </>
  );
};

export default ConsolidatedTab;
