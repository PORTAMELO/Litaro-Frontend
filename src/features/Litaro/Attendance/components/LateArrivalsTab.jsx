import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import * as service from "../services/AttendanceService";
import StudentSearch from "./StudentSearch";

const formatClock = (value) => new Date(value).toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" });

const LateArrivalsTab = ({ options, can, notify }) => {
  const canCreate = can("LateArrival", "create");
  const canDelete = can("LateArrival", "delete");

  const { data, error, reload } = useLoad(() => service.getLateArrivals(options.today), [options.today]);
  const [busy, setBusy] = useState(false);

  const rows = data ?? [];

  const run = async (action, done) => {
    setBusy(true);

    try {
      await action();
      notify(done);
      reload();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {canCreate && (
        <div className={page.card}>
          <StudentSearch
            placeholder="Nombre, documento o código"
            actionLabel="Registrar"
            busy={busy}
            onPick={(student) => run(() => service.registerLateArrival(student.enrollmentId), "Llegada registrada.")}
          />
        </div>
      )}

      <div className={page.card}>
        <div className={page.toolbar}>
          <span className={page.toolbarTitle}>Hoy</span>
          <span className={page.toolbarMeta}>
            {rows.length} {rows.length === 1 ? "llegada" : "llegadas"}
          </span>
        </div>

        {error && <p className={page.message}>{error}</p>}

        {!error && !data && <TableSkeleton rows={6} columns={5} />}

        {!error && data && rows.length === 0 && <EmptyState title="Sin llegadas tarde hoy" />}

        {rows.length > 0 && (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th className={page.cellRight}>En el periodo</th>
                  {canDelete && <th className={page.cellTight} />}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.lateArrivalId}>
                    <td className={page.cellTight}>{formatClock(row.arrivedAt)}</td>
                    <td>{row.studentName}</td>
                    <td>{row.classroomName}</td>
                    <td className={page.cellRight}>{row.periodCount}</td>

                    {canDelete && (
                      <td className={page.cellTight}>
                        <Tooltip title="Deshacer">
                          <span>
                            <IconButton
                              size="small"
                              disabled={busy}
                              onClick={() => run(() => service.deleteLateArrival(row.lateArrivalId), "Llegada eliminada.")}
                            >
                              <UndoIcon fontSize="small" />
                            </IconButton>
                          </span>
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
    </>
  );
};

export default LateArrivalsTab;
