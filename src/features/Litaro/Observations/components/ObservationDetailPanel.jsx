import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";

import styles from "../Observations.module.css";
import page from "@/shared/components/Ui/Page.module.css";
import { DeleteButton, UploadButton, ViewButton } from "@/shared/components/Ui/FileButtons";
import SidePanel from "@/shared/components/Ui/SidePanel";
import { Field, TableSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import { formatDate, formatDateTime } from "@/shared/utils/Dates";
import { openBlob } from "@/shared/utils/Files";
import * as service from "../services/ObservationService";
import {
  COMMITMENT_LIMIT,
  COMMITMENT_STATUSES,
  NOTE_LIMIT,
  STATEMENT_ACCEPT,
  STATEMENT_LIMIT,
  actionLabel,
  commitmentLabel,
  kindLabel,
} from "../utils/ObservationUtils";

const CommitmentRow = ({ commitment, canUpdate, run }) => {
  const [status, setStatus] = useState(commitment.status);
  const [note, setNote] = useState(commitment.note ?? "");
  const changed = status !== commitment.status || note.trim() !== (commitment.note ?? "");

  return (
    <li className={styles.commitment}>
      <p className={styles.commitmentText}>{commitment.text}</p>
      <span className={page.secondaryText}>
        {commitment.followUpDate ? `Seguimiento: ${formatDate(commitment.followUpDate)} · ` : ""}
        {commitment.createdBy}
      </span>

      {canUpdate ? (
        <div className={styles.commitmentEdit}>
          <TextField
            select
            size="small"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            slotProps={{ htmlInput: { "aria-label": "Estado del compromiso" } }}
          >
            {COMMITMENT_STATUSES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            placeholder={status === "OBSERVATION" ? "Observación (obligatoria)" : "Nota (opcional)"}
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, NOTE_LIMIT))}
            slotProps={{ htmlInput: { "aria-label": "Nota del compromiso" } }}
          />
          <Button
            size="small"
            disabled={!changed}
            onClick={() =>
              run(() => service.setCommitmentStatus(commitment.commitmentId, { status, note }), "Seguimiento guardado.")
            }
          >
            Guardar
          </Button>
        </div>
      ) : (
        <span className={page.chip}>
          {commitmentLabel(commitment.status)}
          {commitment.note ? ` · ${commitment.note}` : ""}
        </span>
      )}
    </li>
  );
};

const ObservationDetailPanel = ({ observationId, canUpdate, notify, onEdit, onClose, onChanged }) => {
  const { data, error, reload } = useLoad(() => service.getObservation(observationId), [observationId]);
  const [busy, setBusy] = useState(false);
  const [statement, setStatement] = useState(null);
  const [commitment, setCommitment] = useState({ text: "", followUpDate: "" });

  const statementText = statement ?? data?.statement ?? "";

  const run = async (action, message) => {
    setBusy(true);

    try {
      await action();
      if (message) notify(message);
      reload();
      onChanged();
      return true;
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar el cambio.", "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  // El texto escrito se conserva: coincide con lo guardado y evita que el campo se vacíe mientras recarga.
  const saveStatement = () => run(() => service.saveStatement(observationId, statementText), "Descargos guardados.");

  const saveCommitment = async () => {
    const body = { text: commitment.text.trim(), followUpDate: commitment.followUpDate || null };
    if (await run(() => service.addCommitment(observationId, body), "Compromiso agregado."))
      setCommitment({ text: "", followUpDate: "" });
  };

  const openFile = async () => {
    try {
      openBlob(await service.openStatementFile(observationId));
    } catch (failure) {
      notify(failure.message ?? "No fue posible abrir el archivo.", "error");
    }
  };

  return (
    <SidePanel
      open
      title="Observación"
      subtitle={data ? `${data.studentName} · ${data.classroomName}` : null}
      busy={busy}
      onClose={onClose}
    >
      {error && <p className={page.message}>{error}</p>}

      {!error && !data && <TableSkeleton rows={4} columns={2} />}

      {data && (
        <div className={page.formStack}>
          <section className={styles.detailSection}>
            <div className={styles.detailHead}>
              <div>
                <span className={page.chip}>{kindLabel(data)}</span>
                <span className={page.secondaryText}>
                  {formatDate(data.date)} · {data.recordedBy}
                  {data.subjectName ? ` · ${data.subjectName}` : ""}
                </span>
              </div>
              {data.canEdit && canUpdate && (
                <Button size="small" onClick={() => onEdit(data)} disabled={busy}>
                  Editar
                </Button>
              )}
            </div>
            <p className={styles.description}>{data.description}</p>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Descargos del estudiante</h3>

            {canUpdate ? (
              <>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Transcriba los descargos del estudiante"
                  value={statementText}
                  onChange={(event) => setStatement(event.target.value.slice(0, STATEMENT_LIMIT))}
                  slotProps={{ htmlInput: { "aria-label": "Descargos transcritos" } }}
                />
                <div className={styles.inlineActions}>
                  <Button
                    size="small"
                    onClick={saveStatement}
                    disabled={busy || statementText.trim() === (data.statement ?? "")}
                  >
                    Guardar descargos
                  </Button>
                </div>
              </>
            ) : (
              <p className={styles.description}>{data.statement || "Sin descargos transcritos."}</p>
            )}

            <div className={styles.fileRow}>
              <span>
                {data.statementFile ? data.statementFile.fileName : "Sin formato escaneado"}
                {data.statementFile && (
                  <span className={page.secondaryText}>
                    {data.statementFile.uploadedBy} · {formatDateTime(data.statementFile.uploadedAt)}
                  </span>
                )}
              </span>

              <span className={styles.fileButtons}>
                <ViewButton disabled={!data.statementFile || busy} onClick={openFile} />
                {canUpdate && (
                  <UploadButton
                    replace={Boolean(data.statementFile)}
                    accept={STATEMENT_ACCEPT}
                    disabled={busy}
                    onFile={(file) =>
                      file && run(() => service.uploadStatementFile(observationId, file), "Formato de descargos cargado.")
                    }
                  />
                )}
                {canUpdate && data.statementFile && (
                  <DeleteButton
                    disabled={busy}
                    title="Retirar formato de descargos"
                    text="El archivo deja de estar disponible. El retiro queda en el historial."
                    onConfirm={() => run(() => service.removeStatementFile(observationId), "Formato retirado.")}
                  />
                )}
              </span>
            </div>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Compromisos</h3>

            {data.commitments.length === 0 && <p className={page.secondaryText}>Sin compromisos registrados.</p>}

            <ul className={styles.commitments}>
              {data.commitments.map((item) => (
                <CommitmentRow
                  key={`${item.commitmentId}-${item.status}-${item.note ?? ""}`}
                  commitment={item}
                  canUpdate={canUpdate && !busy}
                  run={run}
                />
              ))}
            </ul>

            {canUpdate && (
              <div className={page.formStack}>
                <Field label="Nuevo compromiso del estudiante y del acudiente">
                  <TextField
                    multiline
                    minRows={2}
                    fullWidth
                    value={commitment.text}
                    onChange={(event) =>
                      setCommitment((current) => ({ ...current, text: event.target.value.slice(0, COMMITMENT_LIMIT) }))
                    }
                  />
                </Field>
                <div className={styles.addRow}>
                  <TextField
                    type="date"
                    size="small"
                    value={commitment.followUpDate}
                    onChange={(event) => setCommitment((current) => ({ ...current, followUpDate: event.target.value }))}
                    slotProps={{ htmlInput: { "aria-label": "Fecha de seguimiento", min: data.date } }}
                  />
                  <Button onClick={saveCommitment} disabled={busy || !commitment.text.trim()}>
                    Agregar compromiso
                  </Button>
                </div>
              </div>
            )}
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Historial</h3>
            <ol className={styles.history}>
              {data.events.map((event, index) => (
                <li key={index}>
                  <strong>{actionLabel(event.action)}</strong>
                  {event.detail && <span> · {event.detail}</span>}
                  <span className={page.secondaryText}>
                    {event.user} · {formatDateTime(event.createdAt)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </SidePanel>
  );
};

export default ObservationDetailPanel;
