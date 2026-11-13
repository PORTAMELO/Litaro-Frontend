import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import { formatDateTime } from "../../../../shared/utils/Dates";
import * as service from "../services/AttendanceService";
import ExcusePanel from "./ExcusePanel";

const plain = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const ExcusesTab = ({ options, can, notify }) => {
  const canCreate = can("AttendanceExcuse", "create");
  const canDelete = can("AttendanceExcuse", "delete");
  const yearId = Number(options.today.slice(0, 4));

  const { data, error, reload } = useLoad(() => service.getExcuses(yearId), [yearId]);

  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = (data ?? []).filter((row) => plain(row.studentName).includes(plain(text.trim())));

  const remove = async () => {
    setBusy(true);

    try {
      await service.deleteExcuse(removing.attendanceExcuseId);
      notify("Excusa anulada.");
      setRemoving(null);
      reload();
    } catch (failure) {
      notify(failure.message ?? "No fue posible anular la excusa.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className={page.card}>
        <div className={page.toolbar}>
          <TextField
            size="small"
            placeholder="Buscar estudiante"
            value={text}
            onChange={(event) => setText(event.target.value)}
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
            sx={{ minWidth: "16rem" }}
          />

          <span className={page.toolbarSpacer} />

          {canCreate && (
            <Button variant="contained" onClick={() => setCreating(true)}>
              Nueva excusa
            </Button>
          )}
        </div>

        {error && <p className={page.message}>{error}</p>}

        {!error && !data && <TableSkeleton rows={6} columns={6} />}

        {!error && data && rows.length === 0 && <EmptyState title="Sin excusas registradas" />}

        {rows.length > 0 && (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Desde</th>
                  <th>Hasta</th>
                  <th>Motivo</th>
                  <th className={page.cellRight}>Faltas</th>
                  {canDelete && <th className={page.cellTight} />}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.attendanceExcuseId}>
                    <td>
                      {row.studentName}
                      <span className={page.secondaryText}>{row.classroomName}</span>
                    </td>
                    <td className={page.cellTight}>{formatDateTime(row.startAt)}</td>
                    <td className={page.cellTight}>{formatDateTime(row.endAt)}</td>
                    <td>{row.reason}</td>
                    <td className={page.cellRight}>{row.absences}</td>

                    {canDelete && (
                      <td className={page.cellTight}>
                        <Tooltip title="Anular">
                          <IconButton size="small" onClick={() => setRemoving(row)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {creating && (
        <ExcusePanel
          today={options.today}
          notify={notify}
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            reload();
          }}
        />
      )}

      <Dialog open={removing !== null} onClose={busy ? undefined : () => setRemoving(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Anular excusa</DialogTitle>
        <DialogContent>Las faltas volverán a contar.</DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoving(null)} disabled={busy}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={remove} disabled={busy}>
            Anular
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExcusesTab;
