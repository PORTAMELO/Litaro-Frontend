import { useState } from "react";
import { Button, Checkbox, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, SegmentedFilter, StatusMark, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import { formatDateTime } from "../../../../shared/utils/Dates";
import * as service from "../services/NotificationService";
import { STATE, announceChange } from "../utils/NotificationUtils";
import DoneDialog from "./DoneDialog";

const numberFormat = new Intl.NumberFormat("es-CO");

const format = (value) => numberFormat.format(value);

const barButton = { color: "#ffffff", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.12)" } };

const InboxTab = ({ canMarkDone, notify }) => {
  const [filter, setFilter] = useState("ALL");
  const [typeId, setTypeId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [version, setVersion] = useState(0);
  const [selection, setSelection] = useState({ key: null, ids: [], matching: false });
  const [readHere, setReadHere] = useState([]);
  const [closing, setClosing] = useState(false);
  const [saving, setSaving] = useState(false);

  const state = filter === "ALL" ? null : filter;
  const viewKey = `${filter}|${typeId}|${pageNumber}|${version}`;

  const { data, error, loading } = useLoad(
    () => service.getNotifications({ state, typeId: typeId || null, page: pageNumber }),
    [viewKey],
  );

  const reload = () => setVersion((current) => current + 1);

  const rows = (data?.rows ?? []).map((row) =>
    row.state === "UNREAD" && readHere.includes(row.notificationId) ? { ...row, state: "PENDING" } : row,
  );
  const counts = data?.counts ?? { all: 0, unread: 0, pending: 0, done: 0 };

  const openRows = rows.filter((row) => row.state !== "DONE");
  const openIds = openRows.map((row) => row.notificationId);
  const current = selection.key === viewKey ? selection : { key: viewKey, ids: [], matching: false };
  const chosen = current.ids.filter((id) => openIds.includes(id));
  const allOnPage = openIds.length > 0 && chosen.length === openIds.length;

  const matchingOpen = { ALL: counts.unread + counts.pending, UNREAD: counts.unread, PENDING: counts.pending, DONE: 0 }[filter];
  const matchingUnread = filter === "ALL" || filter === "UNREAD" ? counts.unread : 0;

  const selectedCount = current.matching ? matchingOpen : chosen.length;
  const selectedUnread = current.matching
    ? matchingUnread
    : openRows.filter((row) => row.state === "UNREAD" && chosen.includes(row.notificationId)).length;

  const select = (ids, matching = false) => setSelection({ key: viewKey, ids, matching });

  const toggle = (id) =>
    select(chosen.includes(id) ? chosen.filter((item) => item !== id) : [...chosen, id]);

  const toggleAll = () => select(allOnPage ? [] : openIds);

  const changeView = (apply) => {
    apply();
    setPageNumber(1);
  };

  const open = (row) => {
    if (row.state !== "UNREAD") return;

    setReadHere((previous) => [...previous, row.notificationId]);
    service
      .markRead(row.notificationId)
      .then(announceChange)
      .catch(() => {});
  };

  const matching = { state, typeId: typeId || null };

  const finish = (message) => {
    notify(message);
    setSelection({ key: null, ids: [], matching: false });
    announceChange();
    reload();
  };

  const markRead = async () => {
    setSaving(true);

    try {
      const unreadIds = openRows
        .filter((row) => row.state === "UNREAD" && chosen.includes(row.notificationId))
        .map((row) => row.notificationId);
      const result = current.matching ? await service.markReadMatching(matching) : await service.markReadMany(unreadIds);
      const read = result?.read ?? 0;

      finish(read === 1 ? "Notificación leída." : `${format(read)} notificaciones leídas.`);
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  const markDone = async (note) => {
    setSaving(true);

    try {
      const ids = closing === true ? chosen : closing;
      const result = current.matching && closing === true
        ? await service.markDoneMatching(matching, note)
        : await service.markDone(ids, note);
      const done = result?.done ?? 0;

      setClosing(false);
      finish(done === 1 ? "Notificación realizada." : `${format(done)} notificaciones realizadas.`);
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (error && !data) {
    return (
      <p className={page.message}>
        {error}{" "}
        <Button size="small" onClick={reload}>
          Reintentar
        </Button>
      </p>
    );
  }

  if (!data && loading) return <TableSkeleton rows={8} columns={5} />;

  const first = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const last = Math.min(data.page * data.pageSize, data.total);
  const lastPage = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <>
      <div className={page.card}>
        <div className={page.toolbar}>
          <SegmentedFilter
            label="Estado"
            options={[
              { value: "ALL", label: "Todas", count: format(counts.all) },
              { value: "UNREAD", label: "No leídas", count: format(counts.unread) },
              { value: "PENDING", label: "Pendientes", count: format(counts.pending) },
              { value: "DONE", label: "Realizadas", count: format(counts.done) },
            ]}
            value={filter}
            onChange={(value) => changeView(() => setFilter(value))}
          />

          <span className={page.toolbarSpacer} />

          <TextField
            select
            size="small"
            value={typeId}
            onChange={(event) => changeView(() => setTypeId(event.target.value))}
            slotProps={{ select: { displayEmpty: true }, htmlInput: { "aria-label": "Tipo" } }}
            sx={{ minWidth: "12rem" }}
          >
            <MenuItem value="">Todos los tipos</MenuItem>
            {data.types.map((type) => (
              <MenuItem key={type.typeId} value={type.typeId}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="Sin notificaciones" />
        ) : (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  <th className={page.cellTight}>
                    {openIds.length > 0 && (
                      <Checkbox
                        size="small"
                        checked={allOnPage || current.matching}
                        indeterminate={chosen.length > 0 && !allOnPage && !current.matching}
                        onChange={toggleAll}
                        disabled={current.matching}
                        slotProps={{ input: { "aria-label": "Seleccionar la página" } }}
                      />
                    )}
                  </th>
                  <th>Tipo</th>
                  <th>Notificación</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  {canMarkDone && <th className={page.cellTight} />}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const done = row.state === "DONE";
                  const tone = row.state === "UNREAD" ? page.rowStrong : done ? page.rowMuted : "";

                  return (
                    <tr
                      key={row.notificationId}
                      className={`${tone} ${row.state === "UNREAD" ? page.rowClickable : ""}`}
                      onClick={() => open(row)}
                    >
                      <td className={page.cellTight}>
                        {!done && (
                          <Checkbox
                            size="small"
                            checked={current.matching || chosen.includes(row.notificationId)}
                            disabled={current.matching}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggle(row.notificationId)}
                            slotProps={{ input: { "aria-label": row.message } }}
                          />
                        )}
                      </td>

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
                                  setClosing([row.notificationId]);
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

        {data.total > 0 && (
          <div className={page.toolbar}>
            <span className={page.toolbarSpacer} />
            <span className={page.toolbarMeta}>
              {format(first)}–{format(last)} de {format(data.total)}
            </span>
            <Tooltip title="Anterior">
              <span>
                <IconButton
                  size="small"
                  disabled={data.page <= 1 || loading}
                  onClick={() => setPageNumber(data.page - 1)}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Siguiente">
              <span>
                <IconButton
                  size="small"
                  disabled={data.page >= lastPage || loading}
                  onClick={() => setPageNumber(data.page + 1)}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        )}
      </div>

      {selectedCount > 0 && (
        <div className={page.selectionBar} role="region" aria-label="Notificaciones seleccionadas">
          <span className={page.headerActions}>
            <span>{selectedCount === 1 ? "1 seleccionada" : `${format(selectedCount)} seleccionadas`}</span>

            {!current.matching && allOnPage && matchingOpen > openIds.length && (
              <Button size="small" onClick={() => select([], true)} sx={barButton}>
                Seleccionar las {format(matchingOpen)} que coinciden
              </Button>
            )}

            {current.matching && (
              <Button size="small" onClick={() => select([])} sx={barButton}>
                Quitar selección
              </Button>
            )}
          </span>

          <span className={page.headerActions}>
            {selectedUnread > 0 && (
              <Button onClick={markRead} disabled={saving} sx={barButton}>
                Marcar como leídas
              </Button>
            )}

            {canMarkDone && (
              <Button
                variant="contained"
                onClick={() => setClosing(true)}
                disabled={saving}
                sx={{ backgroundColor: "#ffffff", color: "primary.main", "&:hover": { backgroundColor: "#eeeef6" } }}
              >
                Marcar como realizadas
              </Button>
            )}
          </span>
        </div>
      )}

      {closing !== false && (
        <DoneDialog
          count={closing === true ? selectedCount : closing.length}
          saving={saving}
          onCancel={() => setClosing(false)}
          onConfirm={markDone}
        />
      )}
    </>
  );
};

export default InboxTab;
