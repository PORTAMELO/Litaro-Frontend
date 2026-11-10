import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, SegmentedFilter, StatusMark } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import { formatDateTime } from "../../../../shared/utils/Dates";
import * as service from "../services/NotificationService";
import { NOTE_LIMIT, STATE, announceChange } from "../utils/NotificationUtils";

const InboxTab = ({ canMarkDone, notify }) => {
  const { data, error, loading, reload } = useLoad(() => service.getNotifications(), []);

  const [filter, setFilter] = useState("ALL");
  const [typeId, setTypeId] = useState("");
  const [selected, setSelected] = useState([]);
  const [readHere, setReadHere] = useState([]);
  const [closing, setClosing] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = (data ?? []).map((row) =>
    row.state === "UNREAD" && readHere.includes(row.notificationId) ? { ...row, state: "PENDING" } : row,
  );

  const types = [...new Map(rows.map((row) => [row.typeId, row.typeName])).entries()].sort((a, b) =>
    a[1].localeCompare(b[1]),
  );

  const ofType = rows.filter((row) => typeId === "" || row.typeId === typeId);
  const count = (state) => ofType.filter((row) => row.state === state).length;
  const visible = ofType.filter((row) => filter === "ALL" || row.state === filter);

  const openIds = new Set(rows.filter((row) => row.state !== "DONE").map((row) => row.notificationId));
  const chosen = selected.filter((id) => openIds.has(id));

  const toggle = (id) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const open = (row) => {
    if (row.state !== "UNREAD") return;

    setReadHere((current) => [...current, row.notificationId]);
    service
      .markRead(row.notificationId)
      .then(announceChange)
      .catch(() => {});
  };

  const askToClose = (ids) => {
    setNote("");
    setClosing(ids);
  };

  const confirmClose = async () => {
    setSaving(true);

    try {
      await service.markDone(closing, note.trim() || null);
      notify(closing.length === 1 ? "Notificación realizada." : `${closing.length} notificaciones realizadas.`);
      setClosing(null);
      setSelected([]);
      announceChange();
      reload();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <p className={page.message}>
        {error}{" "}
        <Button size="small" onClick={reload}>
          Reintentar
        </Button>
      </p>
    );
  }

  if (!data && loading) return <p className={page.message}>Cargando…</p>;

  return (
    <>
      <div className={page.card}>
        <div className={page.toolbar}>
          <SegmentedFilter
            label="Estado"
            options={[
              { value: "ALL", label: "Todas" },
              { value: "UNREAD", label: "No leídas", count: count("UNREAD") },
              { value: "PENDING", label: "Pendientes", count: count("PENDING") },
              { value: "DONE", label: "Realizadas" },
            ]}
            value={filter}
            onChange={setFilter}
          />

          <span className={page.toolbarSpacer} />

          <TextField
            select
            size="small"
            value={typeId}
            onChange={(event) => setTypeId(event.target.value)}
            slotProps={{ select: { displayEmpty: true }, htmlInput: { "aria-label": "Tipo" } }}
            sx={{ minWidth: "12rem" }}
          >
            <MenuItem value="">Todos los tipos</MenuItem>
            {types.map(([id, name]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {visible.length === 0 ? (
          <EmptyState title="Sin notificaciones" />
        ) : (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  {canMarkDone && <th className={page.cellTight} />}
                  <th>Tipo</th>
                  <th>Notificación</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  {canMarkDone && <th className={page.cellTight} />}
                </tr>
              </thead>

              <tbody>
                {visible.map((row) => {
                  const done = row.state === "DONE";
                  const tone = row.state === "UNREAD" ? page.rowStrong : done ? page.rowMuted : "";

                  return (
                    <tr
                      key={row.notificationId}
                      className={`${tone} ${row.state === "UNREAD" ? page.rowClickable : ""}`}
                      onClick={() => open(row)}
                    >
                      {canMarkDone && (
                        <td className={page.cellTight}>
                          {!done && (
                            <Checkbox
                              size="small"
                              checked={chosen.includes(row.notificationId)}
                              onClick={(event) => event.stopPropagation()}
                              onChange={() => toggle(row.notificationId)}
                              slotProps={{ input: { "aria-label": row.message } }}
                            />
                          )}
                        </td>
                      )}

                      <td>{row.typeName}</td>

                      <td>
                        {row.message}
                        {done && (
                          <span className={page.secondaryText}>
                            Realizada por {row.doneBy} · {formatDateTime(row.doneAt)}
                            {row.doneNote ? ` · ${row.doneNote}` : ""}
                          </span>
                        )}
                      </td>

                      <td className={page.cellTight}>{formatDateTime(row.createdAt)}</td>

                      <td className={page.cellTight}>
                        <StatusMark label={STATE[row.state].label} color={STATE[row.state].color} />
                      </td>

                      {canMarkDone && (
                        <td className={page.cellTight}>
                          {!done && (
                            <Tooltip title="Marcar como realizada">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  askToClose([row.notificationId]);
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
      </div>

      {chosen.length > 0 && (
        <div className={page.selectionBar} role="region" aria-label="Notificaciones seleccionadas">
          <span>{chosen.length === 1 ? "1 seleccionada" : `${chosen.length} seleccionadas`}</span>

          <Button
            variant="contained"
            onClick={() => askToClose(chosen)}
            sx={{ backgroundColor: "#ffffff", color: "primary.main", "&:hover": { backgroundColor: "#eeeef6" } }}
          >
            Marcar como realizadas
          </Button>
        </div>
      )}

      <Dialog open={closing !== null} onClose={saving ? undefined : () => setClosing(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Marcar como realizada</DialogTitle>

        <DialogContent>
          <TextField
            label="Nota"
            multiline
            minRows={2}
            fullWidth
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, NOTE_LIMIT))}
            sx={{ marginTop: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setClosing(null)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={confirmClose} disabled={saving}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InboxTab;
