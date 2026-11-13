import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, StatusMark, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import * as service from "../services/GradingService";
import { NEUTRAL_COLOR, formatColombiaDateTime } from "../utils/GradingUtils";
import { usePlannerFiles } from "../hooks/UsePlannerFiles";
import { DeleteButton, UploadButton, ViewButton } from "./PlannerUpload";

const PlannersTab = ({ notify }) => {
  const { data, error, reload } = useLoad(() => service.getPlanners(), []);
  const [requesting, setRequesting] = useState(null);
  const [sending, setSending] = useState(false);
  const files = usePlannerFiles({ notify, onChanged: reload });

  if (error) return <p className={page.message}>{error}</p>;
  if (!data) return <TableSkeleton rows={6} columns={5} />;

  const canUpload = !data.overdue || data.canUploadAny;

  const send = async () => {
    setSending(true);

    try {
      await service.requestPlanner(requesting.assignmentId);
      notify("Solicitud enviada.");
      setRequesting(null);
      reload();
    } catch (failure) {
      notify(failure.message ?? "No fue posible enviar la solicitud.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={page.card}>
      <div className={page.toolbar}>
        <span className={page.toolbarTitle}>Mis asignaturas</span>
        <span className={page.toolbarSpacer} />
        {data.dueAt && <span className={page.toolbarMeta}>Plazo: {formatColombiaDateTime(data.dueAt)}</span>}
      </div>

      {data.rows.length === 0 && <EmptyState title="No tienes asignaciones académicas activas" />}

      {data.rows.length > 0 && (
        <div className={page.tableWrapper}>
          <table className={page.table}>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Materia</th>
                <th>Estado</th>
                <th>Cargado</th>
                <th className={page.cellTight} />
              </tr>
            </thead>

            <tbody>
              {data.rows.map((row) => (
                <tr key={row.assignmentId}>
                  <td>{row.classroomName}</td>
                  <td>{row.subjectName}</td>
                  <td>
                    <StatusMark
                      label={row.delivered ? "Entregado" : "Pendiente"}
                      color={row.delivered ? "var(--primary-color)" : NEUTRAL_COLOR}
                    />
                  </td>
                  <td>
                    {row.document && (
                      <>
                        {formatColombiaDateTime(row.document.uploadedAt)}
                        <span className={page.secondaryText}>{row.document.fileName}</span>
                      </>
                    )}
                  </td>
                  <td className={page.cellTight}>
                    {row.document && (
                      <ViewButton disabled={files.busy !== null} onClick={() => files.open(row.assignmentId)} />
                    )}

                    {canUpload && (
                      <UploadButton
                        replace={Boolean(row.document)}
                        disabled={files.busy !== null}
                        onFile={(file) => files.upload(row.assignmentId, file)}
                      />
                    )}

                    {canUpload && row.document && (
                      <DeleteButton disabled={files.busy !== null} onConfirm={() => files.remove(row.assignmentId)} />
                    )}

                    {!canUpload && !row.delivered && (
                      <Tooltip title={row.requestPending ? "Solicitud enviada" : "Enviar solicitud"}>
                        <span>
                          <IconButton size="small" disabled={row.requestPending} onClick={() => setRequesting(row)}>
                            <SendOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={requesting !== null} onClose={() => setRequesting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Enviar solicitud</DialogTitle>
        <DialogContent>Coordinación recibirá la solicitud.</DialogContent>
        <DialogActions>
          <Button onClick={() => setRequesting(null)} disabled={sending}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={send} disabled={sending}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlannersTab;
